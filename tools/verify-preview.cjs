const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, ignoreHTTPSErrors: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [label, origin] of [['online', 'https://raykie.cn'], ['local', 'http://localhost:4000']]) {
      errors.length = 0;
      await page.goto(origin + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);
      const state = await page.evaluate(() => {
        const header = document.querySelector('#page-header');
        const bg = getComputedStyle(header).backgroundImage;
        return { headerHeight: header.clientHeight, background: bg,
          font: getComputedStyle(document.body).fontFamily,
          fontSize: getComputedStyle(document.body).fontSize,
          overflow: document.documentElement.scrollWidth > innerWidth,
          brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src) };
      });
      await page.screenshot({ path: `/tmp/raykie-${label}-${width}-home.png` });
      await page.locator('#content-inner').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `/tmp/raykie-${label}-${width}-content.png` });
      if (label === 'local') {
        await page.locator('#footer').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        const canvas = page.locator('#jsi-flying-fish-container canvas');
        assert.equal(await canvas.count(), 1);
        const before = await canvas.evaluate(c => c.toDataURL());
        const pixels = await canvas.evaluate(c => {
          const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          let filled = 0;
          for (let i = 3; i < data.length; i += 4) if (data[i]) filled++;
          return { width: c.width, height: c.height, filled };
        });
        await page.waitForTimeout(800);
        const after = await canvas.evaluate(c => c.toDataURL());
        assert(pixels.filled > 0 && pixels.width > 0 && pixels.height > 0);
        assert.notEqual(before, after, 'Fish animation must move');
        await page.screenshot({ path: `/tmp/raykie-local-${width}-footer.png` });
        await page.evaluate(() => document.dispatchEvent(new Event('pjax:complete')));
        assert.equal(await canvas.count(), 1, 'No duplicate canvas');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(100);
        assert.equal(await canvas.count(), 0, 'Respect reduced motion');
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForTimeout(100);
        assert.equal(await canvas.count(), 1);
        state.canvas = pixels;
      }
      results.push({ label, width, ...state, errors: [...errors] });
      console.log(JSON.stringify(results.at(-1)));
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('/tmp/raykie-preview-verification.json', JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
