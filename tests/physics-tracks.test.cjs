'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const harness = require('./course-dom.cjs');
const Content = require('../assets/physics-foundation-content.js');
const Models = require('../assets/physics-foundation-models.js');
const Graphs = require('../assets/course-graphs.js');
const F = require('../assets/foundation-engine.js');
const Tools = require('../assets/project-tools.js');
const Policy = require('../assets/sync-policy.js');
const Local = require('../assets/local-records.js');
const Catalog = require('../assets/course-catalog.js');
const root = path.resolve(__dirname, '..');
const empty = {VERSION: 'none', MODULES: {}};
const close = (actual, expected) => assert(Math.abs(actual-expected) <= 1e-10*Math.max(1, Math.abs(expected)), actual+' != '+expected);

test('the two active physics tracks have distinct lessons, reports, and entry points without retiring the old record schema', () => {
  const ids = new Set();
  for (const [track, lessons] of [['physics-1', 6], ['physics-2', 7]]) {
    const C = Content.create(track), h = harness(track);
    assert.equal(C.LESSONS.length, lessons);
    assert.equal(Catalog.COURSES[track].challengeCount, 6);
    assert.equal(Catalog.COURSES[track].projectCount, 2);
    assert.match(C.scope, /Selected introductory foundations/);
    assert(Policy.KEYS[h.E.SCHEMA]);
    for (const lesson of C.LESSONS) {
      assert.equal(lesson.steps.length, 4);
      assert.equal(lesson.checks.length, 2);
      const positions = [];
      for (const task of [lesson.predict, ...lesson.checks]) {
        assert(!ids.has(task.id)); ids.add(task.id);
        positions.push(task.options.findIndex(o => o.id === task.correct[0]));
      }
      assert.deepEqual(positions.sort(), [0, 1, 2]);
      for (const step of lesson.steps) {
        assert(step.activity.predict && step.activity.test && step.activity.explain);
      }
    }
  }
  assert.equal(ids.size, 39);
  assert.equal(Catalog.COURSES.physics, undefined);
  assert(Policy.KEYS.physics_beta01_session_v1);
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.doesNotMatch(home, /data-subject="physics"|AP Physics/);
});

test('both complete lesson flows preserve original reasoning, survive reload, and export all six or seven units', async () => {
  const map = new Map([['physics_beta01_session_v1', 'original Physics work']]);
  for (const track of Content.IDS) {
    let h = harness(track, map);
    assert(!map.has(h.E.SCHEMA), 'Reading the course creates no empty record');
    h.click('start'); h.choose('unsure');
    h.input('explanation', '先比较单位；p = m₁v₁ + m₂v₂。');
    h = harness(track, map);
    assert.equal(h.app.querySelector('[name="explanation"]').value, '先比较单位；p = m₁v₁ + m₂v₂。');
    for (let i = 0; i < h.C.LESSONS.length; i++) {
      if (i) { h.click('continue'); h.choose('unsure'); h.input('explanation', '先写假设，再检查变化。'); }
      h.submit(); h.click('next');
      for (let step = 0; step < 4; step++) {
        const list = h.app.querySelector('[class="simple-list activity-list"]');
        assert.equal(list.children.length, 3);
        h.click('next-step');
      }
      for (const task of h.C.LESSONS[i].checks) {
        h.choose(task.correct[0]); h.input('explanation', '用公式和图核对。'); h.submit(); h.click('next');
      }
    }
    h.click('continue');
    assert.equal(h.saved().view, 'summary');
    assert(h.E.hydrate(h.saved()));
    assert(Policy.valid(h.E.SCHEMA, map.get(h.E.SCHEMA)));
    assert.equal(harness(track, map).saved().view, 'summary');
    h.click('export-json'); h.click('export-md'); h.click('print');
    const exported = JSON.parse(await h.blobs[0].text());
    assert.equal(Object.keys(exported.records).length, h.C.LESSONS.length*3);
    assert.match(await h.blobs[1].text(), /先比较单位/);
    assert.match(h.window.preview.html, /Print \/ save as PDF/);
    const report = JSON.parse(map.get('cluevera_saved_reports_v1')).items.find(item => item.module === track);
    assert(report, 'Reports keep separate subject identities');
  }
  assert.equal(map.get('physics_beta01_session_v1'), 'original Physics work');
});

test('new model boundaries remain finite and satisfy independent conservation, circuit and optics checks', () => {
  for (const track of Content.IDS) {
    const C = Content.create(track), E = require('../assets/course-engine.js').create(C);
    C.LESSONS.forEach((lesson, index) => {
      let cases = [lesson.defaults];
      // Cartesian combinations catch interacting bounds, such as a lens near its focus.
      for (const control of lesson.controls) {
        const choices = control.options ? control.options.map(x => x[0]) : [control.min, control.max];
        cases = cases.flatMap(settings => choices.map(value => ({...settings, [control.name]: value})));
      }
      for (const settings of [lesson.defaults, ...cases]) {
        const labs = E.defaultLabs(); labs[index] = settings; assert(E.validLabs(labs));
        const output = Graphs.lab(track, index, settings);
        assert.doesNotMatch(output.graph+' '+output.readout, /NaN|Infinity/);
        assert(output.note && output.formula);
        assert.match(output.graph, /figcaption/);
      }
    });
  }
  const collision = Models.values('physics-1', 2, {massA: 3, speedA: 2, massB: 1, speedB: -2});
  close(4*collision.velocity, 4); close(collision.initial, 8); close(collision.final, 2); close(collision.other, 6);
  close(collision.final+collision.other, collision.initial);
  assert.equal(Models.values('physics-1', 2, {massA: 1, massB: 4, speedA: 3, speedB: 3}).other, 0);
  const r1 = Models.values('physics-1', 3, {mass: 2, radius: .4, force: 4, omega: 3});
  const r2 = Models.values('physics-1', 3, {mass: 2, radius: .8, force: 4, omega: 3});
  close(r2.inertia/r1.inertia, 4); close(r2.torque/r1.torque, 2); close(r2.alpha/r1.alpha, .5);
  const spring = Models.values('physics-1', 4, {mass: 1, stiffness: 16, amplitude: .2});
  close(spring.period, Math.PI/2); close(spring.energy, .32);
  const electric = Models.values('physics-2', 1, {charge: 0, distance: .5});
  close(electric.field, 72000); close(electric.potential, 36000); close(electric.force, 0);
  const circuit = Models.values('physics-2', 2, {voltage: 12, r1: 6, r2: 3, arrangement: 'parallel'});
  close(circuit.current, circuit.i1+circuit.i2); close(circuit.resistance, 2); close(circuit.power, 72);
  const lens = Models.values('physics-2', 4, {focal: 10, object: 30});
  close(1/30+1/lens.image, 1/10); close(lens.magnification, -.5); close(lens.height, -1);
  const photons = Models.values('physics-2', 6, {frequency: 4, work: 2});
  assert.equal(photons.emits, false);
  assert.match(Models.model('physics-2', 6, {frequency: 4, work: 2}).graph, /Not applicable/);
});

test('new physics numbers accept scientific notation and displayed units, reject zero for small forces, and leave explanations open', () => {
  const D = require('../assets/challenge-bank.js');
  const E = F.forBank(D, empty, {schema: 'test', challenge: true});
  const p = E.fresh(), s = E.createSession(p, 'physics-2');
  const task = E.tasks(s).find(t => t.id === 'p2-c04');
  for (const force of ['2.4e-6 N', '2.4×10^-6 N', '0.0000024']) {
    const a = {...E.blank(task), values: {force, flux: '0.01 Wb', emf: '0.05 V'}, explanation: 'qvB；ΔΦ/Δt。先检查方向。'};
    E.edit(s, task, a); assert(E.submit(s, task).ok);
    assert.equal(E.last(s, task).objective.state, 'matched');
    assert.equal(E.last(s, task).answer.explanation, a.explanation);
    assert.equal(E.latestReview(s, task), null);
    a.values.force = '0.00';
    assert.equal(E.evaluate(task, a, E.NUMERIC_POLICY).parts.force, false);
    a.values.force = '2.4e-6 J';
    assert.equal(E.evaluate(task, a, E.NUMERIC_POLICY).parts.force, false);
  }
  assert(E.hydrate(p));
});

test('version-four physics portfolios keep original task definitions, attempts and reports after the additive split', () => {
  for (const family of ['challenge', 'project']) {
    const old = require('../assets/'+family+'-bank-v4.js'), next = require('../assets/'+family+'-bank.js');
    const settings = {schema: 'test', challenge: true, ...(family === 'project' ? {projects: true, fieldTypes: Tools.fieldTypes} : {})};
    const previous = F.forBank(old, empty, settings), current = F.forBank(next, empty, settings);
    const p = previous.fresh(), s = previous.createSession(p, 'physics'), t = previous.task(s), a = previous.blank(t);
    for (const f of t.fields) a.values[f.id] = f.kind === 'reason' ? '原来的推导；保留。' : String(f.answer);
    a.explanation = '原来的过程，不更换题目。'; previous.edit(s, t, a); assert(previous.submit(s, t).ok);
    const original = JSON.stringify(p), migrated = current.hydrate(p);
    assert(migrated); assert.equal(JSON.stringify(p), original);
    const kept = migrated.modules.physics.sessions[0];
    assert.deepEqual(kept, s); assert.deepEqual(current.tasks(kept), previous.tasks(s));
    assert.equal(current.markdown(kept), previous.markdown(s));
    for (const track of Content.IDS) {
      assert.deepEqual(migrated.modules[track], {active: null, sessions: []});
      const fresh = current.createSession(migrated, track);
      assert.equal(fresh.bankVersion, next.VERSION);
    }
    assert(current.hydrate(migrated));
  }
});

test('a local backup restores both new courses alongside the untouched original physics record', () => {
  const old = harness('physics'); old.click('start');
  const map = new Map(old.map);
  for (const track of Content.IDS) { const h = harness(track, map); h.click('start'); h.input('explanation', '跨设备手动备份，保留原文。'); }
  const storage = map => ({keys: () => [...map.keys()], getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k)});
  const backup = Local.create(storage(map)).exportWork(), restored = new Map();
  Local.create(storage(restored)).restore(backup);
  for (const [key, value] of map) assert.equal(restored.get(key), value);
  for (const track of ['physics', ...Content.IDS]) assert(harness(track, restored).E.hydrate(harness(track, restored).saved()));
});

test('the public release ships complete script dependencies and deterministic covers for both tracks', () => {
  const release = require('../scripts/build-static-release.cjs'), files = release.files();
  release.validateLinks(files);
  for (const track of Content.IDS) {
    const page = fs.readFileSync(path.join(root, 'courses', track, 'index.html'), 'utf8');
    assert(page.indexOf('../physics/content.js') < page.indexOf('physics-foundation-content.js'));
    assert(page.indexOf('physics-foundation-content.js') < page.indexOf('src="content.js"'));
    assert(page.indexOf('physics-foundation-models.js') < page.indexOf('course-app.js'));
    assert(files.includes('courses/'+track+'/content.js'));
    const svg = fs.readFileSync(path.join(root, 'assets/illustrations', track+'.svg'), 'utf8');
    assert.equal(svg, require('../scripts/build-hub-illustrations.cjs').build()[track]);
    assert.doesNotMatch(svg, /NaN|Infinity/);
  }
  assert(!files.some(file => file.startsWith('review/') || file.startsWith('tests/')));
});
