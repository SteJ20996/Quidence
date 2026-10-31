'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Store = require('../assets/report-store.js');
const Local = require('../assets/local-records.js');
const F = require('../assets/foundation-engine.js');
const D = require('../assets/challenge-bank.js');
const Tools = require('../assets/report-tools.js');
const Release = require('../scripts/build-static-release.cjs');
function storage(entries = []) {
  const map = new Map(entries);
  return {map, keys: () => [...map.keys()], getItem: key => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key)};
}
test('compact report signatures preserve every legacy version and compare content rather than trusting a hash', () => {
  const s = storage(), payload = {markdown: 'Original formula: 11/3\n'.repeat(300), exportedAt: 'old'};
  Store.save('ab01', payload, 'session', s);
  const data = Store.read(s).data;
  data.items[0].versions[0].signature = JSON.stringify(payload);
  s.setItem(Store.KEY, JSON.stringify(data));
  const before = s.getItem(Store.KEY), versions = structuredClone(data.items[0].versions);
  assert.equal(Store.save('ab01', {...payload, exportedAt: 'new'}, 'session', s).changed, false);
  assert.equal(s.getItem(Store.KEY), before, 'viewing identical old content must not rewrite storage');
  const optimized = Store.compact(s);
  assert(optimized.savedCharacters > 5000);
  const after = Store.read(s).data.items[0].versions;
  assert.deepEqual(after.map(({signature, ...v}) => v), versions.map(({signature, ...v}) => v));
  assert(after[0].signature.length < 50);
  // A stale or colliding fingerprint cannot suppress a genuinely different report.
  assert.equal(Store.save('ab01', {...payload, markdown: 'Different work'}, 'session', s).changed, true);
  assert.equal(Store.read(s).data.items[0].versions.length, 2);
  assert.equal(Store.save('ab01', {...payload, markdown: 'Different work'}, 'session', s).changed, false);
});
test('report optimization retains unreadable originals and preserves the prior value when storage fails', () => {
  const bad = storage([[Store.KEY, '{original unreadable report']]);
  assert.equal(Store.compact(bad).ok, false);
  assert.equal(bad.getItem(Store.KEY), '{original unreadable report');
  const s = storage(); Store.save('aa01', {markdown: 'Saved work'}, 'one', s);
  const data = Store.read(s).data; data.items[0].versions[0].signature = 'duplicate'.repeat(100);
  s.setItem(Store.KEY, JSON.stringify(data)); const before = s.getItem(Store.KEY);
  s.setItem = () => {throw Error('quota');};
  assert.equal(Store.compact(s).ok, false); assert.equal(s.getItem(Store.KEY), before);
});
test('an upgraded check report does not duplicate unchanged work under a quota, but a real review change saves a new version', () => {
  const s=storage(), payload={schema:'check',kind:'diagnostic-challenge',bankVersion:'old',session:{id:'one',module:'ab01',createdAt:'2026-10-07T00:00:00Z',view:'report',index:0,events:[],records:{task:{draft:{explanation:'Exact original work'},submissions:[{answer:{value:'11/3'}}],reviews:[]}}},markdown:'Legacy report\n'.repeat(800)};
  Store.save('ab01',payload,'one',s);const data=Store.read(s).data;data.items[0].versions[0].signature=JSON.stringify(payload);s.setItem(Store.KEY,JSON.stringify(data));
  const before=s.getItem(Store.KEY),limit=before.length+10,write=s.setItem;
  s.setItem=(key,value)=>{if(value.length>limit)throw Error('quota');write(key,value);};
  const regenerated=structuredClone(payload);regenerated.markdown+='New presentation\n';regenerated.studentSummary={title:'A student summary'};regenerated.session.index=1;regenerated.session.events.push({type:'report_opened'});
  for(let i=0;i<20;i++){const result=Store.save('ab01',regenerated,'one',s);assert(result.ok);assert.equal(result.changed,false);}
  assert.equal(s.getItem(Store.KEY),before);assert.equal(Store.read(s).data.items[0].versions.length,1);
  regenerated.session.records.task.reviews.push({points:1,note:'A real local review'});
  assert(Store.save('ab01',regenerated,'one',s).ok);const after=Store.read(s).data.items[0].versions;
  assert.equal(after.length,2);assert.deepEqual(after[0].payload,payload);assert(after.every(v=>v.signature.length<50));
});
test('local text estimates include old workspace copies without uploading or changing raw backup data', () => {
  const key = 'cluevera_saved_reports_v1', ownerKey = 'cluevera_user_old:' + key;
  const s = storage([[key, 'α'.repeat(100)], [ownerKey, 'legacy report'], ['unrelated', 'keep']]);
  const c = Local.create(s), before = [...s.map];
  assert.deepEqual(c.usage(), {groups: 2, estimatedBytes: 2 * (key.length + 100 + ownerKey.length + 13)});
  assert.deepEqual([...s.map], before);
  assert.deepEqual(c.exportWork().records, {[key]: 'α'.repeat(100), [ownerKey]: 'legacy report'});
});
test('student summaries prioritize observed mismatches and keep all-correct explanations open', () => {
  const E = F.forBank(D, {VERSION: 'none', MODULES: {}}, {schema: 'cluevera_challenge_portfolio_v1', challenge: true});
  const p = E.fresh(), s = E.createSession(p, 'ab01');
  for (const t of E.tasks(s)) {
    const a = E.blank(t);
    for (const f of t.fields) a.values[f.id] = f.kind === 'number' ? String(f.answer) : f.answer;
    a.explanation = 'Short unfamiliar calculation; not a keyword-based grade.';
    E.edit(s, t, a); assert(E.submit(s, t).ok);
  }
  const brief = E.studentSummary(s);
  assert.equal(brief.matched.length, 3); assert.equal(brief.checks.length, 2);
  assert.match(brief.overview,/57 answer components matched/);
  assert.match(Tools.printableSummary('Linear Algebra',E.portable(s)),/57 answer components matched/);
  assert.match(E.markdown(s),/57 answer components matched/);
  assert(brief.checks.every(x => x.detail.includes('not a demonstrated mistake')));
  const task = E.tasks(s).findLast(t => t.fields.some(f => f.kind === 'number'));
  const field = task.fields.find(f => f.kind === 'number'), answer = structuredClone(E.last(s, task).answer);
  answer.values[field.id] = String(field.answer + 100);
  E.edit(s, task, answer); assert(E.submit(s, task).ok);
  assert.equal(E.studentSummary(s).checks[0].title, task.title);
  assert(E.hydrate(p));
  const portable = E.portable(s), html = Tools.printableSummary('Linear Algebra', portable);
  const full = Tools.printable('Linear Algebra', portable);
  assert.match(full, /Short unfamiliar calculation/);
  assert(full.includes(E.tasks(s)[0].title));
  assert.match(full, /Answer and explanation history/);
  assert.match(html, /How to read this summary/); assert.match(html, /data-print-report/);
  assert.match(E.markdown(s), /Your next conversation/);
  portable.studentSummary.checks[0].title = '<script>unsafe()</script>';
  assert.match(Tools.printableSummary('Test', portable), /&lt;script&gt;/);
  assert.equal(Tools.printableSummary('Legacy', {reportText: 'Original'}), null);
  const legacy = {session: {records: {one: {draft: {explanation: 'Exact legacy calculation 11/3'}}}}, taskDefinitions: [{title: 'Preserved legacy prompt'}]};
  assert.match(Tools.printable('Legacy', legacy), /Exact legacy calculation 11\/3/);
  assert.match(Tools.printable('Legacy', legacy), /Preserved legacy prompt/);
});
test('static release includes public dependencies and excludes internal documents, test data, accounts and archived design pages', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'quidence-release-'));
  t.after(() => fs.rmSync(temp, {recursive: true, force: true}));
  const output = path.join(temp, 'public'), files = Release.files();
  Release.validateLinks(files);
  assert(files.includes('modules/aa01/dist/sketch-lab/math.js'));
  assert(files.includes('assets/project-bank-v1.js'), 'old definitions are needed for saved history');
  assert(files.includes('records/index.html'));
  assert(files.includes('courses/number-theory/data.json'));
  assert(files.includes('courses/number-theory/app.js'));
  assert(files.includes('courses/discrete-math/data.json'));
  assert(files.includes('cross-disciplinary/data.json'));
  assert(files.includes('courses/discrete-math/app.js'));
  assert(!files.includes('content/number-theory/source-v2.md'));
  assert(!files.some(file => file.startsWith('content/')), 'bilingual course sources stay out of the release');
  assert(!files.some(file => /^(review|tests|archive|backend)\//.test(file) || (/\.(?:md|json)$/.test(file)&&!['courses/number-theory/data.json','courses/discrete-math/data.json','cross-disciplinary/data.json'].includes(file))));
  assert(!files.includes('assets/sync-client.js')); assert(!files.includes('assets/account-app.js'));
  assert(!files.includes('modules/aa01/dist/sketch-lab/index.html'));
  assert(!files.some(file => file.includes('/beta01/')));
  Release.build(output);
  const headers = fs.readFileSync(path.join(output, '_headers'), 'utf8');
  assert.match(headers, /script-src-attr 'none'/); assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.throws(() => Release.build(output), /empty output directory/);
});
