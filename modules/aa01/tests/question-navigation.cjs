// Regression for the six-group menu hiding ten individual questions.
// Real app callbacks in the DOM-shape harness; no native-browser layout claim.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {load}=require('./workspace.cjs');
const h=load(),core=Array.from({length:11},(_,i)=>`C${i+1}`);
assert.equal(h.q('#question-list').hidden,false);
assert.equal(h.qa('[data-catalog-item]').length,15);
for(const[id,index]of core.map((id,i)=>[id,i])){
 const entry=h.q(`[data-catalog-item="${id}"]`);
 assert(entry,`missing individual entry ${id}`);
 assert(entry.textContent.includes(`Q${index+1}`));
 assert.equal(Number(entry.dataset.goto),index);
 entry.click();
 assert.equal(h.api.state.queue[h.api.state.index],id);
 assert.equal(h.q('.q-id').textContent,`Question ${index+1} of 11`);
 for(const key of h.api.required[id].filter(k=>k!=='why')){
  assert(h.q(`[data-n="${key}"]`)||h.q(`[data-choice="${key}"]`)||h.q(`[data-line="${key}"]`)||h.q(`[data-slider="${key}"]`),`${id} must open its actual response fields`);
 }
}
// All three larger activities are independently reachable, with the project intact.
for(const id of ['S1','V1','D1']){
 h.q(`[data-catalog-item="${id}"]`).click();
 assert.equal(h.api.state.queue[h.api.state.index],id);
 assert(h.app.innerHTML.includes(id==='S1'?'Sports Day views':id==='V1'?'8(x + 3)(2x + 5)':'5x − 3'));
}
const options=h.qa('option');
assert.equal(options.length,19);
for(const id of h.api.state.queue.filter(id=>id!=='QP')){
 const destination=h.api.state.queue.indexOf(id),opt=h.q(`option[value="${destination}"]`);
 assert(opt,`missing mobile destination ${id}`);
 h.q('#area-select').value=opt.value;h.q('#area-select').fire('change');
 assert.equal(h.api.state.queue[h.api.state.index],id);
}
// Hide/show must not submit, clear the draft, open mathematical support, or reset time.
h.q('[data-catalog-item="C3"]').click();h.input('one',2.5);h.tick(2000);
const attempts=h.api.state.records.C3.attempts.length;
h.q('#catalog-toggle').click();assert(h.q('#question-list').hidden);assert.equal(h.q('#catalog-toggle').getAttribute('aria-expanded'),'false');
assert.equal(h.api.collect().one,2.5);assert.equal(h.api.state.records.C3.attempts.length,attempts);assert.equal(h.api.activityTime(h.api.state.records.C3),2000);
h.api.goto(h.api.state.queue.indexOf('C1'));assert(h.q('#question-list').hidden);
h.api.state.includeStretch=true;h.api.submit({point:-1.5,near:'-0.5'});h.api.advance();
assert.equal(h.api.state.queue[h.api.state.index],'FAN');
h.q('#catalog-toggle').click();assert.equal(h.qa('[data-catalog-item]').length,16);
// An inserted adaptive check shifts queue indices, but Q labels and destinations stay correct.
for(const id of core){
 const entry=h.q(`[data-catalog-item="${id}"]`);assert.equal(Number(entry.dataset.goto),h.api.state.queue.indexOf(id));
}
const q10Index=h.api.state.queue.indexOf('C10');assert(q10Index>9);
h.q('#area-select').value=String(q10Index);h.q('#area-select').fire('change');
assert.equal(h.q('.q-id').textContent,'Question 10 of 11');assert(h.q('[data-choice="model"]'));assert(h.q('[data-n="cost"]'));
h.q('[data-catalog-item="C3"]').click();assert.equal(h.api.collect().one,2.5);assert.equal(h.api.activityTime(h.api.state.records.C3),2000);
h.q('#catalog-toggle').click();h.q('#snapshot').click();h.q('#restart').click();h.q('#confirm-restart').click();
assert.equal(h.q('#question-list').hidden,false);assert.equal(h.qa('[data-catalog-item]').length,15);
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
assert(html.includes('Beta 0.6'));for(const name of ['style.css','rubric.js','reasoning.js','geometry.js','adaptive.js','app.js'])assert(html.includes(`${name}?v=0.6`));
console.log(JSON.stringify({result:'passed',checks:['eleven distinct question entries open real response forms','three base activities independently reachable; optional fourth covered by integration suite','every mobile question/project step reachable','list toggle preserves drafts/timers','adaptive insertion retains Q numbering and destinations','restart restores complete visible inventory','release label and asset cache keys'],scope:'DOM callbacks and state; native browser layout unverified'}));

