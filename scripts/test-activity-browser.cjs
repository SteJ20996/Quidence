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
    await cached.goto(origin + '/?view=courses');
    for (const [subject, className] of [['algebra-1', 'challenge-link'], ['af01', 'project-link']]) {
      await cached.goto(origin + '/?view=courses');
      const target=cached.locator('[data-subject="' + subject + '"] .' + className);if(await target.isHidden())await cached.locator('[data-subject="' + subject + '"] .card-more summary').click();await target.click();
      await cached.locator('.f-mode-link').first().waitFor();
      assert.equal(await cached.locator('.f-mode-link').count(), 3);
      assert.equal(await cached.evaluate(() => window.staleActivityAsset), undefined);
      assert.equal(await cached.locator('.f-header-inner').evaluate(el => getComputedStyle(el).display), 'flex');
    }
    await cached.locator('.f-intro a[href*="diagnostics/"]').click();
    await cached.locator('.f-mode-link[aria-current="page"]').waitFor();
    assert.equal(await cached.locator('.f-mode-link[aria-current="page"]').getAttribute('data-f-mode'), 'check');
    assert.equal(await cached.evaluate(() => window.staleActivityAsset), undefined);
    await cached.goto(origin+'/?view=courses');
    const chooserLink=cached.locator('[data-subject="af01"] .challenge-link');if(await chooserLink.isHidden())await cached.locator('[data-subject="af01"] .card-more summary').click();await chooserLink.click();
    await cached.locator('html[data-check-module="af01"]').waitFor();
    assert(new URL(await cached.locator('#original-route').getAttribute('href'),cached.url()).searchParams.has('v'));
    await cached.locator('#original-route').click();await cached.locator('.f-mode-link').first().waitFor();
    assert.equal(await cached.evaluate(()=>window.staleActivityAsset),undefined);
    await cacheContext.close();

    await checkHomepage(browser, origin, capture, errors, failures);

    let pages = 0, drafts = 0;
    for (const width of [1440, 768, 375, 320]) {
      const context = await browser.newContext({viewport: {width, height: 1000}}), page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failures.push(request.url() + ': ' + request.failure()?.errorText));
      page.on('response', response => {if (response.status() >= 400) failures.push(response.url() + ': ' + response.status());});
      await page.goto(origin + '/?view=courses');
      const activityLinks = await page.locator('.challenge-link, .project-link').evaluateAll(elements => elements.map(el => el.href).filter(href=>new URL(href).searchParams.has('module')));
      assert.equal(activityLinks.length, 23);
      assert.equal(await page.locator('.project-link[href*="ac01/dist/projects"]').count(), 1);
      const choosers=activityLinks.filter(href=>new URL(href).pathname==='/checks/');assert.equal(choosers.length,6);
      for(const href of choosers){
        const subject=new URL(href).searchParams.get('module');await page.goto(href);
        await page.locator('html[data-check-module="'+subject+'"]').waitFor();
        const original=new URL(await page.locator('#original-route').getAttribute('href'),page.url());
        assert.equal(original.searchParams.get('module'),subject);assert(original.searchParams.has('v'));
        assert.equal(original.pathname,subject==='ac01'?'/foundations/':'/diagnostics/');
        const interactive=new URL(await page.locator('#dialogue-route').getAttribute('href'),page.url());
        assert.equal(interactive.pathname,'/explain/');assert.equal(interactive.searchParams.get('lang'),'en');
        activityLinks[activityLinks.indexOf(href)]=original.href;
      }
      assert.equal(activityLinks.filter(href => new URL(href).pathname === '/foundations/' && new URL(href).searchParams.get('module') === 'ac01').length, 1);
      await page.goto(origin+'/?view=courses');
      const calculusEntry=await page.locator('.subject-card[data-subject="ad01"] .challenge-link').getAttribute('href');
      assert.equal(new URL(calculusEntry,origin).pathname,'/modules/ad01/dist/checks/');
      await page.goto(new URL(calculusEntry,origin).href);
      assert.equal(await page.locator('#dialogue-route').count(),1);
      const originalCheck=await page.locator('#four-problem-route').getAttribute('href');
      const originalURL=new URL(originalCheck,page.url());assert.equal(originalURL.pathname,'/diagnostics/');assert.equal(originalURL.searchParams.get('module'),'ad01');
      activityLinks.push(originalURL.href);assert.equal(activityLinks.length,24);
      const links = activityLinks.filter(href => ['/diagnostics/', '/projects/'].includes(new URL(href).pathname));
      assert.equal(links.length, 23);
      for (const href of links) {
        const url = new URL(href), subject = url.searchParams.get('module'), projects = url.pathname === '/projects/';
        await page.goto(href);
        assert.equal(await page.locator('#f-subject').inputValue(), subject);
        assert.equal(await page.locator('.f-mode-link[aria-current="page"]').getAttribute('data-f-mode'), projects ? 'projects' : 'check');
        assert.equal(await page.locator('[data-f-mode="learn"]').getAttribute('href'), '../' + COURSES[subject].course + '?lang=en');
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
          // Number Theory, Discrete Mathematics and Coordinate Geometry keep their projects on the course page, so their checks offer no field-projects link.
          if (['number-theory', 'discrete-math', 'coordinate-geometry'].includes(subject)) assert.equal(await page.locator('[data-f-mode="projects"]').count(), 0);
          else {
            const mode = projects ? 'check' : 'projects', target = page.locator('[data-f-mode="' + mode + '"]');
            assert.equal(await target.getAttribute('target'), '_blank');
            const [popup] = await Promise.all([page.waitForEvent('popup'), target.click()]);
            await popup.waitForLoadState();
            assert.equal(new URL(popup.url()).searchParams.get('module'), subject);
            assert.equal(await popup.locator('.f-mode-link[aria-current="page"]').getAttribute('data-f-mode'), mode);
            await popup.close();
          }
          assert.equal(await page.locator('[data-f-field="' + fieldID + '"]').inputValue(), '123/7');
          drafts++;
        }
        pages++;
      }
      await checkRestoredGameTheory(page, origin, width);
      pages += 2; drafts += 2;
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

async function checkRestoredGameTheory(page, origin, width) {
  const explanation = '先分别读取 A 和 B 的收益。 Keep each player’s payoff separate.';
  await page.goto(origin + '/?view=courses');
  const entry=page.locator('[data-subject="ac01"] .challenge-link');if(await entry.isHidden())await page.locator('[data-subject="ac01"] .card-more summary').click();await entry.click();
  assert.equal(new URL(page.url()).pathname, '/checks/');
  await page.locator('html[data-check-module="ac01"]').waitFor();
  await page.locator('#original-route').click();
  assert.equal(new URL(page.url()).pathname, '/foundations/');
  assert.equal(await page.locator('#f-subject').inputValue(), 'ac01');
  assert.equal(await page.locator('#f-heading').textContent(), 'Game theory foundations');
  assert.equal(await page.locator('a[href*="diagnostics/?module=ac01"], a[href*="projects/?module=ac01"]').count(), 0);
  await checkLayout(page, width, 'Game Theory foundation overview');
  await page.locator('[data-f-action="resume"]').click();
  await page.locator('[data-f-unsure]').check();
  await page.locator('[data-f-explanation]').fill(explanation);
  await page.locator('#f-subject').selectOption('ab01');
  await page.locator('#f-subject').selectOption('ac01');
  await page.reload();
  assert.equal(await page.locator('[data-f-unsure]').isChecked(), true);
  assert.equal(await page.locator('[data-f-explanation]').inputValue(), explanation);
  await page.locator('#quidence-language').selectOption('es');
  await page.waitForFunction(() => QuidenceI18n.locale === 'es');
  assert.equal(await page.locator('[data-f-explanation]').inputValue(), explanation);
  await checkLayout(page, width, 'Game Theory Spanish foundation draft');
  await page.locator('#quidence-language').selectOption('en');
  await page.waitForFunction(() => QuidenceI18n.locale === 'en');

  await page.goto(origin + '/?view=courses');
  await page.locator('[data-subject="ac01"] .subject-link').click();
  assert.equal(new URL(page.url()).pathname, '/' + COURSES.ac01.course);
  assert.equal(await page.locator('#app').getAttribute('lang'), 'en');
  await checkPageWidth(page, width, 'Game Theory course introduction');
  await page.locator('[data-action="start"]').click();
  await page.locator('[name="choice"][value="b"]').check();
  await page.locator('#explanation').fill(explanation);
  await page.reload();
  assert.equal(await page.locator('[name="choice"][value="b"]').isChecked(), true);
  assert.equal(await page.locator('#explanation').inputValue(), explanation);
  await page.locator('#answer-form button[type="submit"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('#row-choice').selectOption('0');
  await page.locator('#col-choice').selectOption('1');
  assert.equal(await page.locator('.payoffs td.selected .payoff-a').textContent(), '0');
  assert.equal(await page.locator('.payoffs td.selected .payoff-b').textContent(), '1');
  await checkPageWidth(page, width, 'Game Theory interactive payoff table');
}

async function checkHomepage(browser, origin, capture, errors, failures) {
  const request = 'I want to understand how a graph connects to an equation, and practise solving homework step by step.';
  let reports = 0;
  for (const width of [1440, 768, 375, 320]) {
    const context = await browser.newContext({viewport: {width, height: width > 760 ? 1350 : 900}}), page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', r => failures.push(r.url() + ': ' + r.failure()?.errorText));
    page.on('response', r => {if (r.status() >= 400) failures.push(r.url() + ': ' + r.status());});
    await page.goto(origin + '/?view=courses');
    assert.equal(await page.locator('.qh-description-title').textContent(), 'Mathematics & Science');
    assert.equal(await page.locator('#goal-include-report').isChecked(), false);
    await page.locator('#request-subject').selectOption('algebra-1');
    await page.locator('#learning-goal').fill(request);
    await page.locator('.q-paper-options > summary').click();
    await page.locator('#goal-include-report').check();
    await page.reload();
    assert.equal(await page.locator('#learning-goal').inputValue(), request);
    assert.equal(await page.locator('#goal-include-report').isChecked(), true);
    await page.locator('.q-paper-options > summary').click();
    assert.equal(await page.locator('.feedback-email').getAttribute('href'), 'mailto:hello@quidence.com?subject=Quidence%20website%20feedback');
    await checkPageWidth(page, width, 'homepage');
    for (const selector of ['.goal-report-option', '.feedback-email']) {
      const box = await page.locator(selector).boundingBox();
      assert(box.height >= 44 && box.x >= 0 && box.x + box.width <= width, selector + ' remains usable');
    }
    if (capture && [1440, 375].includes(width)) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({path: path.join(capture, 'home-' + width + '.png')});
      await page.locator('.learning-request').screenshot({path: path.join(capture, 'learning-request-' + width + '.png')});
      await page.locator('.feedback-section').screenshot({path: path.join(capture, 'feedback-' + width + '.png')});
    }
    // Consent applies to the selected subject, while the exact draft stays available.
    await page.locator('#request-subject').selectOption('geometry');
    assert.equal(await page.locator('#goal-include-report').isChecked(), false);
    assert.equal(await page.locator('#learning-goal').inputValue(), request);
    await page.locator('#request-subject').selectOption('algebra-1');
    if ([1440, 375].includes(width)) {
      for (const className of ['challenge-link', 'project-link']) {
        await page.goto(origin + '/?view=courses');
        await page.locator('#learning-goal').fill(request);
        await page.locator('.q-paper-options > summary').click();
        await page.locator('#goal-include-report').check();
        const activity = await page.locator('[data-subject="algebra-1"] .' + className).getAttribute('href');
        await page.goto(origin + '/' + activity);
        await page.locator('[data-f-action="resume"]').click();
        const count = className === 'project-link' ? 2 : 4;
        for (let i = 0; i < count; i++) {
          await page.locator('[data-f-unsure]').check();
          await page.locator('[data-f-explanation]').fill('I need help relating the quantities and the graph.');
          await page.locator('[data-f-answer] button[type="submit"]').click();
          await page.locator('[data-f-action="next"]').click();
        }
        await page.locator('.report-learning-focus').waitFor();
        assert.equal(await page.locator('.report-learning-focus .student-work').textContent(), request);
        await checkPageWidth(page, width, 'report with learning focus');
        if (capture && className === 'challenge-link') await page.locator('.report-learning-focus').screenshot({path: path.join(capture, 'report-focus-' + width + '.png')});
        const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-f-action="export-json"]').click()]);
        const record = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
        assert.equal(record.learningRequest.text, request);
        const [full] = await Promise.all([page.waitForEvent('popup'), page.locator('[data-report-print]').click()]);
        await full.waitForLoadState();
        assert.equal(await full.locator('.report-learning-focus .student-work').textContent(), request);
        await full.close();
        const [summary] = await Promise.all([page.waitForEvent('popup'), page.locator('[data-report-summary]').click()]);
        await summary.waitForLoadState();
        assert.equal(await summary.locator('.report-learning-focus .student-work').textContent(), request);
        await summary.close();
        await page.goto(origin + '/?view=courses');
        await page.locator('#learning-goal').fill('<script>window.goalTextExecuted=true</script>\nA later request.');
        await page.goto(origin + '/' + activity);
        assert.equal(await page.locator('.report-learning-focus .student-work').textContent(), request);
        await page.goto(origin + '/reports/');
        const module = record.session.module;
        await page.locator('[data-r-action="open"][data-report="' + module + ':' + record.session.id + '"]').click();
        assert.equal(await page.locator('.report-learning-focus .student-work').textContent(), request);
        assert.equal(await page.evaluate(() => window.goalTextExecuted), undefined);
        await checkPageWidth(page, width, 'saved report with learning focus');
        reports++;
      }
    }
    console.log('Homepage and learning request checks: ' + width + 'px passed.');
    await context.close();
  }
  console.log(JSON.stringify({homepageWidths: 4, completedReportFlows: reports, savedContextAndExports: 'passed'}));
}

async function checkPageWidth(page, width, label) {
  assert.equal(await page.evaluate(() => innerWidth), width);
  assert(await page.evaluate(() => document.documentElement.scrollWidth) <= width + 1, label + ' must not overflow horizontally');
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

