'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const {createServer} = require('../backend/server.cjs');
const {files} = require('./build-static-release.cjs');
async function run() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const errors = [], failures = [];
  try {
    browser = await chromium.launch({headless: true, ...(process.env.QUIDENCE_BROWSER_EXECUTABLE ? {executablePath: process.env.QUIDENCE_BROWSER_EXECUTABLE} : {})});
    const page = await browser.newPage(), origin = 'http://127.0.0.1:' + server.address().port;
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failures.push(r.url()));
    page.on('response', r => {if (r.status() >= 400) failures.push(r.url() + ': ' + r.status());});
    let layouts = 0;
    for (const width of [320, 375, 768, 1440]) for (const lang of ['en', 'es']) {
      await page.setViewportSize({width, height: 1000});
      for (const file of files().filter(f => f.endsWith('.html'))) {
        await page.goto(origin + '/' + file + '?lang=' + lang);
        const fixed=fs.readFileSync(path.join(__dirname,'..',file),'utf8').includes('data-fixed-language="en"');
        await page.waitForFunction(locale => window.QuidenceI18n?.locale === locale, fixed?'en':lang);
        assert.equal(await page.locator('.q-brand-logo').count(), 1, file);
        await page.waitForFunction(() => [...document.querySelectorAll('.q-brand-logo')].every(e => e.complete && e.naturalWidth));
        const result = await page.locator('.q-brand-logo').evaluate(e => {
          const box = e.getBoundingClientRect();
          let parent=e.parentElement,color='';while(parent){color=getComputedStyle(parent).backgroundColor;if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent')break;parent=parent.parentElement;}
          const rgb=(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number),bg=rgb.length===3?rgb:[255,255,255];
          const fg=e.src.includes('logo-dark')?[246,247,249]:[20,34,54];
          const luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0),a=luminance(bg),b=luminance(fg);
          return {x: box.x, right: box.right, height: box.height, width: box.width, filter: getComputedStyle(e).filter, blend: getComputedStyle(e).mixBlendMode,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
        });
        assert(result.x >= 0 && result.right <= width + 1, file + ' clipped logo');
        assert(result.width >= 180 && result.height >= 44, file + ' undersized logo at '+width+' ('+result.width+'×'+result.height+')');
        assert.equal(result.filter, 'none'); assert.equal(result.blend, 'normal');
        assert(result.contrast>=4.5,file+' low logo contrast '+result.contrast);
        assert.equal(await page.locator('.brand-mark,.brand-initial,.brand-wordmark,.f-brand-mark').count(), 0, file + ' old mark');
        const overlap = await page.evaluate(() => {
          const logo = document.querySelector('.q-brand'), parent = logo.parentElement, a = logo.getBoundingClientRect();
          return [...parent.children].filter(e => e !== logo && getComputedStyle(e).display !== 'none').some(e => {
            const b = e.getBoundingClientRect();
            return Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
          });
        });
        assert.equal(overlap, false, file + ' overlapping header');
        assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, file + ' horizontal overflow');
        layouts++;
      }
    }
    for (const lang of ['en', 'es']) {
      await page.goto(origin + '/?lang=' + lang);
      const report = await page.evaluate(() => QuidenceReportTools.documentHtml('Saved reports', '<h1>Saved reports</h1><p class="student-work">My original answer: x &lt; 0</p>'));
      assert(/<div class="report-brand" data-no-translate(?:="")?><svg/.test(report));
      assert(!report.includes('quidence-logo-light.svg'), 'offline report must not fetch the logo');
      await page.setContent(report);
      assert.equal(await page.locator('.report-brand svg').count(), 1);
      assert.equal(await page.locator('.student-work').textContent(), 'My original answer: x < 0');
      await page.emulateMedia({media: 'print'});
      assert.equal(await page.locator('.report-brand svg').isVisible(), true);
      await page.emulateMedia({media: 'screen'});
    }
    await page.setViewportSize({width: 1440, height: 1000});
    const screenshots = path.join(__dirname, '../review/screenshots');
    fs.mkdirSync(screenshots, {recursive: true});
    for (const lang of ['en', 'es']) {
      await page.goto(origin + '/?lang=' + lang);
      await page.screenshot({path: path.join(screenshots, 'new-logo-home-' + lang + '-1440.webp')});
    }
    await page.setViewportSize({width: 375, height: 950});
    await page.goto(origin + '/?lang=es');
    await page.screenshot({path: path.join(screenshots, 'new-logo-home-es-375.webp')});
    await page.goto(origin + '/projects/?module=algebra-1&lang=es');
    await page.waitForFunction(() => !document.querySelector('.f-lead')?.textContent.includes('Show an answer'));
    await page.screenshot({path: path.join(screenshots, 'new-logo-projects-es-375.webp')});
    const report = await page.evaluate(() => QuidenceReportTools.documentHtml('Saved reports', '<h1>Saved reports</h1><p class="student-work">My original answer: x &lt; 0</p>'));
    await page.setContent(report);
    await page.screenshot({path: path.join(screenshots, 'new-logo-report-es-375.webp')});
    assert.deepEqual(errors, []); assert.deepEqual(failures, []);
    console.log(JSON.stringify({pages: files().filter(f=>f.endsWith('.html')).length, languages: 2, layouts, offlineReports: 2, errors, failures}));
  } finally {
    await browser?.close(); await new Promise(resolve => server.close(resolve));
  }
}
run().catch(e => {console.error(e); process.exitCode = 1;});
