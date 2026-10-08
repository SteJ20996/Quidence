'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const {createServer} = require('../backend/server.cjs');
const {COURSES} = require('../assets/course-catalog.js');

async function run() {
  const server = createServer(), serve = server.listeners('request')[0];
  let legacy = true;
  const stale = {
    '/assets/foundation.css': 'body{margin:8px} main{margin-left:45vw} .f-toolbar{display:flex;gap:12px}',
    '/assets/foundation-app.js': 'window.staleActivityAsset=true;',
  };
  server.removeAllListeners('request');
  server.on('request', (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (legacy && !url.searchParams.has('v') &&
        (stale[url.pathname] || /^\/(diagnostics|projects)\/$/.test(url.pathname))) {
      res.writeHead(200, {'Content-Type': stale[url.pathname] ? (url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript') : 'text/html', 'Cache-Control': 'public,max-age=3600'});
      res.end(stale[url.pathname] || '<!doctype html><link rel="stylesheet" href="/assets/foundation.css"><script src="/assets/foundation-app.js"></script><main><h1>Earlier activity page</h1></main>');
    } else serve(req, res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const errors = [], failures = [];
  const capture = process.env.QUIDENCE_SCREENSHOTS;
  if (capture) fs.mkdirSync(capture, {recursive: true});
  try {
    browser = await chromium.launch({headless: true, ...(process.env.QUIDENCE_BROWSER_EXECUTABLE ? {executablePath: process.env.QUIDENCE_BROWSER_EXECUTABLE} : {})});
    const origin = 'http://127.0.0.1:' + server.address().port;
    const cacheContext = await browser.newContext(), cached = await cacheContext.newPage();
    // Warm a real HTTP cache, including both old documents and their shared resources.
    for (const route of ['diagnostics/?module=algebra-1', 'diagnostics/?module=af01', 'projects/?module=af01']) {
      await cached.goto(origin + '/' + route);
      assert.equal(await cached.evaluate(() => window.staleActivityAsset), true);
    }
    legacy = false;
    await cached.goto(origin + '/projects/?module=af01');
    assert.equal(await cached.evaluate(() => window.staleActivityAsset), true, 'the warmed old asset remains in the HTTP cache');
    await cached.goto(origin + '/');
    for (const [subject, className] of [['algebra-1', 'challenge-link'], ['af01', 'project-link']]) {
      await cached.goto(origin + '/');
      await cached.locator('[data-subject="' + subject + '"] .' + className).click();
      await cached.locator('.f-mode-link').first().waitFor();
      assert.equal(await cached.locator('.f-mode-link').count(), 3);
      assert.equal(await cached.evaluate(() => window.staleActivityAsset), undefined);
      assert.equal(await cached.locator('.f-header-inner').evaluate(el => getComputedStyle(el).display), 'flex');
    }
    await cached.locator('.f-intro a[href*="diagnostics/"]').click();
    await cached.locator('.f-mode-link[aria-current="page"]').waitFor();
    assert.equal(await cached.locator('.f-mode-link[aria-current="page"]').getAttribute('data-f-mode'), 'check');
    assert.equal(await cached.evaluate(() => window.staleActivityAsset), undefined);
    await cacheContext.close();

    let pages = 0, drafts = 0;
    for (const width of [1440, 768, 375, 320]) {
      const context = await browser.newContext({viewport: {width, height: 1000}}), page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failures.push(request.url() + ': ' + request.failure()?.errorText));
      page.on('response', response => {if (response.status() >= 400) failures.push(response.url() + ': ' + response.status());});
      await page.goto(origin + '/');
      const links = await page.locator('.challenge-link, .project-link').evaluateAll(elements => elements.map(el => el.href));
      assert.equal(links.length, 20);
      for (const href of links) {
        const url = new URL(href), subject = url.searchParams.get('module'), projects = url.pathname === '/projects/';
        await page.goto(href);
        assert.equal(await page.locator('#f-subject').inputValue(), subject);
        assert.equal(await page.locator('.f-mode-link[aria-current="page"]').getAttribute('data-f-mode'), projects ? 'projects' : 'check');
        assert.equal(await page.locator('[data-f-mode="learn"]').getAttribute('href'), '../' + COURSES[subject].course);
        await checkLayout(page, width, url.pathname + subject + ' overview');
        if (capture && (width === 1440 || width === 375) && ((!projects && subject === 'algebra-1') || (projects && subject === 'af01'))) {
          await page.screenshot({path: path.join(capture, (projects ? 'projects' : 'diagnostic') + '-' + width + '.png'), fullPage: true});
        }
        // Desktop and phone: check actual inputs, subject switching, reload and new-tab links.
        if (width === 1440 || width === 375) {
          await page.locator('[data-f-action="resume"]').click();
          const field = page.locator('input[data-f-field][type="text"]').first(), fieldID = await field.getAttribute('data-f-field');
          await field.fill('123/7');
          await page.locator('[data-f-explanation]').fill('Unfinished browser regression draft.');
          await checkLayout(page, width, url.pathname + subject + ' task');
          const other = subject === 'ab01' ? 'af01' : 'ab01';
          await page.locator('#f-subject').selectOption(other);
          await page.locator('#f-subject').selectOption(subject);
          assert.equal(await page.locator('[data-f-field="' + fieldID + '"]').inputValue(), '123/7');
          await page.reload();
          assert.equal(await page.locator('[data-f-field="' + fieldID + '"]').inputValue(), '123/7');
          assert.equal(await page.locator('[data-f-explanation]').inputValue(), 'Unfinished browser regression draft.');
          assert.equal(await page.locator('[data-f-action="report"]').isDisabled(), true);
          const mode = projects ? 'check' : 'projects', target = page.locator('[data-f-mode="' + mode + '"]');
          assert.equal(await target.getAttribute('target'), '_blank');
          const [popup] = await Promise.all([page.waitForEvent('popup'), target.click()]);
          await popup.waitForLoadState();
          assert.equal(new URL(popup.url()).searchParams.get('module'), subject);
          assert.equal(await popup.locator('.f-mode-link[aria-current="page"]').getAttribute('data-f-mode'), mode);
          await popup.close();
          assert.equal(await page.locator('[data-f-field="' + fieldID + '"]').inputValue(), '123/7');
          drafts++;
        }
        pages++;
      }
      console.log('Activity browser checks: ' + width + 'px passed.');
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(failures, []);
    console.log(JSON.stringify({pages, drafts, oldCacheUpgrade: 'passed', pageErrors: errors.length, failedRequests: failures.length}));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

async function checkLayout(page, width, label) {
  const layout = await page.evaluate(() => {
    const main = document.querySelector('main').getBoundingClientRect(), header = document.querySelector('.f-header-inner').getBoundingClientRect();
    const controls = [...document.querySelectorAll('.f-header-inner a, .f-toolbar a, .f-toolbar button, .f-toolbar select, .f-mode-link')].map(el => ({rect: el.getBoundingClientRect().toJSON(), height: el.getBoundingClientRect().height}));
    return {viewport: innerWidth, scroll: document.documentElement.scrollWidth, main: main.toJSON(), header: header.toJSON(), controls, display: getComputedStyle(document.querySelector('.f-header-inner')).display};
  });
  assert.equal(layout.viewport, width, label);
  assert(layout.scroll <= width + 1, label + ' must not overflow horizontally');
  assert(Math.abs(layout.main.x - layout.header.x) < 1 && Math.abs(layout.main.width - layout.header.width) < 1, label + ' header and main must align');
  assert(Math.abs(layout.main.x * 2 + layout.main.width - width) < 2, label + ' must be centered');
  assert.equal(layout.display, 'flex', label);
  for (const {rect, height} of layout.controls) {
    assert(rect.x >= -1 && rect.x + rect.width <= width + 1, label + ' control stays on screen');
    assert(height >= 44, label + ' control has a 44px touch target');
  }
}
run().catch(error => {console.error(error); process.exitCode = 1;});
