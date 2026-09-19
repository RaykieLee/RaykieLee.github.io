const fs = require('node:fs');
const path = require('node:path');
const { parseDocument } = require('htmlparser2');
const dom = require('domutils');
const online = JSON.parse(fs.readFileSync('/tmp/raykie-online-audit.json'));
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const files = walk('public').filter(f => f.endsWith('/index.html'));
const slug = p => decodeURIComponent(p).split('/').filter(Boolean).at(-1);
const differences = [];
let compared = 0;
const normalize = s => { try { return decodeURI(s).replaceAll('&amp;', '&'); } catch { return s; } };
for (const page of online.filter(p => p.status === 200)) {
  let file = 'public' + decodeURIComponent(page.path) + 'index.html';
  if (!fs.existsSync(file) && /^\/20\d\d\//.test(page.path)) file = files.find(f => slug(path.dirname(f)) === slug(page.path));
  if (!file && /^\/20\d\d\//.test(page.path)) {
    const title = page.title.split('发表于')[0].trim();
    file = files.find(f => {
      if (!/^public\/20\d\d\//.test(f)) return false;
      const doc = parseDocument(fs.readFileSync(f, 'utf8'));
      const heading = dom.findOne(n => n.name === 'h1', doc.children, true);
      return heading && dom.textContent(heading).trim() === title;
    });
  }
  if (!file || !fs.existsSync(file)) { differences.push({ path: page.path, reason: 'No matching local page (date archives may have changed)' }); continue; }
  const doc = parseDocument(fs.readFileSync(file, 'utf8'));
  const find = id => dom.findOne(n => n.attribs?.id === id, doc.children, true);
  const header = find('page-header')?.attribs?.style || '';
  const imageUrl = s => s.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || '';
  if (normalize(imageUrl(header)) !== normalize(imageUrl(page.header))) differences.push({ path: page.path, reason: 'header', online: page.header, local: header });
  const article = find('article-container');
  const images = article ? dom.findAll(n => n.name === 'img', article.children).map(n => normalize(n.attribs['data-lazy-src'] || n.attribs.src || '')) : [];
  const remote = (page.articleImages || []).map(normalize);
  if (JSON.stringify(images) !== JSON.stringify(remote)) differences.push({ path: page.path, reason: 'article images', missing: remote.filter(x => !images.includes(x)), extra: images.filter(x => !remote.includes(x)) });
  compared++;
}
const remoteCovers = new Map(online.flatMap(p => p.covers || []).map(c => [c.title.trim(), normalize(c.src)]));
for (const file of files.filter(f => f === 'public/index.html' || /^public\/page\/\d+\/index.html$/.test(f))) {
  const doc = parseDocument(fs.readFileSync(file, 'utf8'));
  for (const img of dom.findAll(n => n.name === 'img' && /post-bg/.test(n.attribs?.class || ''), doc.children)) {
    const title = img.attribs.alt?.trim();
    const expected = remoteCovers.get(title);
    if (expected && normalize(img.attribs.src) !== expected) differences.push({ path: file, title, reason: 'cover', online: expected, local: img.attribs.src });
  }
}
fs.writeFileSync('/tmp/raykie-asset-differences.json', JSON.stringify({ compared, differences }, null, 2));
console.log(JSON.stringify({ compared, differences }, null, 2));
