const fs = require('node:fs');
const { parseDocument } = require('htmlparser2');
const dom = require('domutils');

const origin = 'https://raykie.cn';
const queue = ['/', '/link/'];
const seen = new Set();
const pages = [];
const all = (doc, test) => dom.findAll(test, doc.children);
const byId = (doc, id) => dom.findOne(n => n.attribs?.id === id, doc.children, true);
const attr = (node, key) => node?.attribs?.[key] || '';

async function read(path) {
  try {
    const response = await fetch(origin + path, { signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    const doc = parseDocument(html);
    const article = byId(doc, 'article-container');
    const links = all(doc, n => n.name === 'a').map(n => attr(n, 'href'));
    for (const link of links) {
      const url = new URL(link, origin);
      if (url.origin !== origin || !/^\/(?:$|page\/|archives\/|tags\/|categories\/|about\/|case\/|link\/|photo\/|20\d\d\/)/.test(url.pathname)) continue;
      const next = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
      if (!seen.has(next) && !queue.includes(next)) queue.push(next);
    }
    pages.push({ path, status: response.status,
      title: dom.textContent(byId(doc, 'post-info') || byId(doc, 'page-header') || doc).trim().slice(-250),
      header: attr(byId(doc, 'page-header'), 'style'),
      images: all(doc, n => n.name === 'img').map(n => ({ src: attr(n, 'data-lazy-src') || attr(n, 'src'), alt: attr(n, 'alt') })),
      articleImages: article ? dom.findAll(n => n.name === 'img', article.children).map(n => attr(n, 'data-lazy-src') || attr(n, 'src')) : [],
      articleHtml: article ? dom.getInnerHTML(article) : '',
      covers: all(doc, n => n.name === 'img' && /post-bg|post_bg/.test(attr(n, 'class'))).map(n => ({ title: attr(n, 'alt'), src: attr(n, 'src') }))
    });
  } catch (error) { pages.push({ path, error: error.message }); }
}

(async () => {
  while (queue.length && seen.size < 250) {
    const batch = queue.splice(0, 6).filter(p => !seen.has(p));
    batch.forEach(p => seen.add(p));
    await Promise.all(batch.map(read));
    console.log('Audited', pages.length, 'remaining', queue.length);
  }
  fs.writeFileSync('/tmp/raykie-online-audit.json', JSON.stringify(pages, null, 2));
  console.log('Saved /tmp/raykie-online-audit.json', pages.length, 'pages');
})();
