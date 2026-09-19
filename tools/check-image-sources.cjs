const fs = require('node:fs');
const pages = JSON.parse(fs.readFileSync('/tmp/raykie-online-audit.json'));
const sources = [...new Set(pages.flatMap(p => [
  ...(p.images || []).map(i => i.src),
  p.header?.match(/url\(['"]?(.*?)['"]?\)/)?.[1]
]).filter(Boolean))];
let index = 0;
const results = [];
async function worker() {
  while (index < sources.length) {
    const src = sources[index++];
    if (!/^https?:\/\//.test(src) && !src.startsWith('/')) { results.push({ src, status: 'non-web path' }); continue; }
    try {
      const response = await fetch(new URL(src, 'https://raykie.cn'), { method: 'HEAD', signal: AbortSignal.timeout(10000) });
      results.push({ src, status: response.status, type: response.headers.get('content-type') });
    } catch (error) { results.push({ src, status: 'unreachable', error: error.message }); }
    if (results.length % 100 === 0) console.log('Checked', results.length);
  }
}
(async () => {
  await Promise.all(Array.from({ length: 12 }, worker));
  fs.writeFileSync('/tmp/raykie-image-health.json', JSON.stringify(results, null, 2));
  console.log('Total', results.length, 'non-200', results.filter(r => r.status !== 200).length);
})();
