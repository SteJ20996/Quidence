'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const harness = require('./course-dom.cjs');
const C = require('../courses/physics/content.js');
const Models = require('../assets/physics-models.js');
const Graphs = require('../assets/course-graphs.js');
const create = require('../assets/course-engine.js').create;
const F = require('../assets/foundation-engine.js');
const Policy = require('../assets/sync-policy.js');
const empty = {VERSION: 'none', MODULES: {}};
const close = (a, b) => assert(Math.abs(a-b) < 1e-9, a + ' != ' + b);

test('physics models preserve signed motion, force balance, energy balance, and fixed-speed wavelength relations', () => {
  const motion = Models.values(0, {start: 5, velocity: -3});
  assert.deepEqual(motion, {end: 5-3*4, displacement: -3*4, distance: 3*4, acceleration: 0});
  assert.deepEqual(Models.values(1, {push: 6, resistance: 6, mass: 3}), {net: 0, acceleration: 0});
  close(Models.values(1, {push: 2, resistance: 5, mass: 2}).acceleration, (2-5)/2);
  const energy = Models.values(2, {power: 150, minutes: 15, efficiency: 70});
  close(energy.energy, 150*15*60); close(energy.wattHours, 150*15/60);
  close(energy.useful+energy.other, energy.energy);
  const wave = Models.values(3, {speed: 12, frequency: 3});
  close(wave.wavelength*3, 12); close(wave.period*3, 1);
  close(Models.values(3, {speed: 12, frequency: 6}).wavelength, wave.wavelength/2);
  const E = create(C);
  C.LESSONS.forEach((lesson, i) => {
    const cases = [lesson.defaults];
    for (const c of lesson.controls) for (const value of [c.min, c.max]) cases.push({...lesson.defaults, [c.name]: value});
    for (const settings of cases) {
      const labs = E.defaultLabs(); labs[i] = settings; assert(E.validLabs(labs));
      const output = Graphs.lab('physics', i, settings);
      assert.doesNotMatch(output.graph, /NaN|Infinity/);
      assert(output.readout && output.formula && output.note);
      assert.match(output.graph, /figcaption/);
    }
  });
});

test('the complete physics lesson flow saves formulas and Chinese reasoning without automatic explanation credit, reloads, and exports', async () => {
  const map = new Map([['geometry_beta01_session_v1', 'another subject remains untouched']]);
  let h = harness('physics', map);
  h.click('start');
  h.choose('unsure'); h.input('explanation', '我先核对单位，再比较位置变化。');
  h = harness('physics', map);
  assert.equal(h.app.querySelector('[name="explanation"]').value, '我先核对单位，再比较位置变化。');
  for (let i = 0; i < C.LESSONS.length; i++) {
    const lesson = C.LESSONS[i];
    if (i) { h.click('continue'); h.choose('unsure'); h.input('explanation', '先看模型假设。'); }
    h.submit(); h.click('next');
    const before = JSON.stringify(h.saved().records);
    const control = lesson.controls[0]; h.lab(control.name, control.max);
    assert.equal(JSON.stringify(h.saved().records), before);
    for (let j = 0; j < 4; j++) {
      const activity = lesson.steps[j].activity;
      const list = h.app.querySelector('[class="simple-list activity-list"]');
      assert(list, 'The current activity has distinct prediction, test, and explanation prompts');
      assert.equal(list.children.length, 3);
      assert(h.app.innerHTML.indexOf('Predict first') < h.app.innerHTML.indexOf('Test and compare'));
      assert(h.app.innerHTML.indexOf('Test and compare') < h.app.innerHTML.indexOf('Explain with evidence'));
      assert.equal(!!h.app.querySelector('details'), !!activity.hint);
      assert.equal(JSON.stringify(h.saved().records), before, 'Reading an activity is not an answer submission');
      h.click('next-step');
    }
    for (const task of lesson.checks) {
      h.choose(task.correct[0]); h.input('explanation', 'Δx/Δt; Fnet = ma; E = Pt。按题目条件核对。');
      h.submit(); h.click('next');
    }
  }
  h.click('continue');
  assert.equal(h.saved().view, 'summary'); assert(h.E.hydrate(h.saved()));
  assert(Policy.valid(h.E.SCHEMA, map.get(h.E.SCHEMA)));
  assert.equal(map.get('geometry_beta01_session_v1'), 'another subject remains untouched');
  assert.equal(harness('physics', map).saved().view, 'summary');
  h.click('export-json'); h.click('export-md'); h.click('print');
  const report = JSON.parse(await h.blobs[0].text());
  assert.equal(Object.keys(report.records).length, 12);
  assert.match(report.note, /explanations need human review/);
  assert.match(await h.blobs[1].text(), /Δx\/Δt/);
  assert.match(h.window.preview.html, /Print \/ save as PDF/);
  assert.equal(JSON.parse(map.get('cluevera_saved_reports_v1')).items[0].module, 'physics');
});

test('version-three mathematics portfolios migrate additively and keep their attempts and report wording intact', () => {
  for (const family of ['challenge', 'project']) {
    const old = require('../assets/' + family + '-bank-v3.js');
    const next = require('../assets/' + family + '-bank.js');
    const settings = {schema: 'migration-test', challenge: true, ...(family === 'project' ? {projects: true, fieldTypes: require('../assets/project-tools.js').fieldTypes} : {})};
    const previous = F.forBank(old, empty, settings), current = F.forBank(next, empty, settings);
    const portfolio = previous.fresh(), session = previous.createSession(portfolio, 'algebra-1');
    const task = previous.task(session), answer = previous.blank(task);
    for (const field of task.fields) answer.values[field.id] = field.kind === 'number' ? String(field.answer) : field.kind === 'reason' ? 'An original equation and its justification.' : field.answer;
    answer.explanation = 'Original saved mathematics reasoning.';
    previous.edit(session, task, answer); assert(previous.submit(session, task).ok);
    const before = JSON.stringify(portfolio), migrated = current.hydrate(portfolio);
    assert(migrated); assert.equal(JSON.stringify(portfolio), before);
    for (const id of Object.keys(old.MODULES)) assert.deepEqual(migrated.modules[id], portfolio.modules[id]);
    assert.deepEqual(migrated.modules.physics, {active: null, sessions: []});
    assert.equal(current.markdown(migrated.modules['algebra-1'].sessions[0]), previous.markdown(session));
    const invalid = structuredClone(portfolio); invalid.modules.physics = {active: 'fake', sessions: [{...session, id: 'fake', module: 'physics'}]};
    assert.equal(current.hydrate(invalid), null, 'A historical bank has no physics definition');
    const physics = current.createSession(migrated, 'physics'); assert.equal(physics.bankVersion, next.VERSION);
    assert(current.hydrate(migrated));
  }
});

test('the public release includes physics routes, full script dependency order, and reproducible scientific cover', () => {
  const release = require('../scripts/build-static-release.cjs'), files = release.files();
  release.validateLinks(files);
  for (const name of ['courses/physics/index.html','courses/physics/content.js','assets/physics-models.js','assets/physics-bank.js','assets/challenge-bank-v3.js','assets/project-bank-v3.js','assets/illustrations/physics.svg']) assert(files.includes(name), name);
  const root = path.resolve(__dirname, '..');
  for (const family of ['challenge','project']) {
    const file = family === 'challenge' ? 'diagnostics/index.html' : 'projects/index.html';
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert(html.indexOf(family+'-bank-v3.js') < html.indexOf(family+'-bank.js'));
    assert(html.indexOf('physics-bank.js') < html.indexOf(family+'-bank.js'));
  }
  assert.equal(fs.readFileSync(path.join(root,'assets/illustrations/physics.svg'),'utf8'), require('../scripts/build-hub-illustrations.cjs').build().physics);
});
