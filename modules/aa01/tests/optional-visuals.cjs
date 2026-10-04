const assert=require('node:assert/strict'),{load}=require('./workspace.cjs');
const h=load();h.api.goto(h.api.state.queue.indexOf('S1'));
assert(h.q('#visual-cost-blocks').hidden);
for(const[k,v]of Object.entries({setupA:24,rateA:3,setupB:6,rateB:5}))h.input(k,v);
h.text('Setup is paid once; each player adds the rate.');h.q('#submit').click();
const r=h.api.state.records.S1,event=JSON.stringify(h.api.state.events.at(-1)),completed=r.complete;
assert.equal(r.supportAtSubmission.hint_ids.length,0);
h.q('[data-optional-visual="cost-blocks"]').click();assert(!h.q('#visual-cost-blocks').hidden);
assert.equal(r.complete,completed);assert.equal(r.score.correct,true);assert.equal(JSON.stringify(h.api.state.events.at(-1)),event);
assert.equal(r.visualPanels['cost-blocks'].answerBeforeHelp.setupA,24);assert.equal(r.visualPanels['cost-blocks'].attemptsBeforeHelp,1);
const slider=h.q('[data-cost-count]');
for(const n of [0,8,9,10,24]){
 slider.value=String(n);slider.fire('input');const svg=h.q('#cost-block-diagram').innerHTML;
 assert(svg.includes(`Plan A: $24 once + ${n} × $3 = $${24+3*n}`));assert(svg.includes(`Plan B: $6 once + ${n} × $5 = $${6+5*n}`));
 assert.equal((svg.match(/data-cost-block=/g)??[]).length,2*n);
 assert.equal(r.score.correct,true);assert.equal(r.complete,completed);assert.equal(h.api.collect().setupA,24);
}
h.q('[data-cost-step="1"]').click();assert.equal(r.costCount,24);
h.q('[data-cost-step="-1"]').click();assert.equal(r.costCount,23);
h.q('[data-optional-visual="cost-blocks"]').click();assert(h.q('#visual-cost-blocks').hidden);assert.equal(r.hints.length,1);
h.api.goto(h.api.state.queue.indexOf('S2'));for(const[k,v]of Object.entries({a6:42,b6:36,a12:60,b12:66}))h.input(k,v);h.q('#submit').click();
const next=h.api.state.records.S2;assert(next.supportAtSubmission.hint_ids.includes('S1-cost-blocks'));
assert(h.api.state.events.at(-1).objective_components.every(c=>c.support_level==='hinted'));
h.api.goto(h.api.state.queue.indexOf('S1'));assert(h.q('#visual-cost-blocks').hidden);assert.equal(h.q('[data-cost-count]').value,'23');
h.q('[data-optional-visual="cost-blocks"]').click();assert.equal(r.hints.length,1);h.input('setupA',23);assert.equal(r.complete,null);
h.input('setupA',24);h.q('#submit').click();assert.equal(r.attempts.length,2);assert.equal(r.attempts[0].support.hint_ids.length,0);assert(r.attempts[1].support.hint_ids.includes('S1-cost-blocks'));
h.q('#snapshot').click();assert(h.app.innerHTML.includes('Before optional support: answer components matched'));assert(h.app.innerHTML.includes('Opening a visual is a choice, not proof'));
// This is a convention for comparable content, not only the Sports Day example.
const forms=load();for(const[id,key]of [['C3','lap-model'],['C5','area-model'],['C6','area-model'],['FE','area-model'],['FN','temperature-model'],['V1','volume-model'],['D1','subtraction-model']]){
 const html=forms.api.form(id);assert(html.includes(`data-optional-visual="${key}"`));assert(html.includes(`id="visual-${key}" hidden`));
}
for(const id of ['C10','FM','FB','S1','S2','S3','S4','S6'])assert(forms.api.costSpec(id));
// Number-line responses and graph reading keep their required stimulus.
assert(forms.api.form('C1').includes('data-line="point"'));assert(forms.api.form('C9').includes('Descending line'));
console.log(JSON.stringify({result:'passed',checks:['optional default and toggle persistence','same dollar scale and exact block counts','equal costs at 9 and change after 9','view controls preserve saved credit and answers','pre-help drafts and immutable submission snapshots','shared-project support propagates without rewriting earlier evidence','independent and supported submissions in report','applies to comparable activities; required graph stimuli retained'],scope:'DOM callback and math checks; live browser behavior unverified'}));
