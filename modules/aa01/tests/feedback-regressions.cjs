'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {load}=require('./workspace.cjs'),MathEvidence=require('../dist/reason-evidence.js'),Store=require('../dist/session-store.js'),Adaptive=require('../dist/adaptive.js');
// Student-authored explanations from the October 5 test; no personal/session IDs.
const responses=[
 ['C4','If we think two challenges are like two linear equations, A starts from (0,0), B starts from (0,2), so A is in direct proportion.'],
 ['C9','Every move of 1 units right of x, y moves 1 units down, so the slope is -1/1=-1. y=-x+2'],
 ['C10','You need to pay $12 to register into this gym, so if you do not show up at all you still need to pay $12.'],
 ['S1','As we discussed before, there is a registration fee applied at the beginning, also there is a per-player fee when you come every time.'],
 ['S3','If there are 9 players exactly, that does not matter which plan they choose because the price is the same.'],
 ['S6','If there are fewer than 9 players, plan B is cheaper obviously. However, when player count is greater than 9, plan B is more expensive.'],
 ['V1','I multiply 8 and x+3 first, which equals to 8x+24, then multiply this to 2x+5, then get 16x^2+48x+40x+120. The coefficient of x is 48+40=88.'],
 ['D1','Distribution rule, 3*x-3*2=3x-6'],
 ['FB','$100 can not cover 19 (one more player than 18) players cost.']
];
const h=load();for(const[id,text]of responses){const r=h.reason.evaluate(id,text,true);assert.equal(r.points,2,id);assert(!r.reviewReasons.includes('unknown_or_conflicting_wording'),id);}
for(const[key,text]of [
 ['R-stretch','Set x min/mile, x/1=12/1.5=8, which means 8 min/mile'],
 ['E-stretch','Distribution rule, 3 times everything inside this parenthesis, 3*x-3*4=3x-12'],
 ['F-stretch',"(0,-3) tells us b=-3, 'Every move of 4 units right moves 6 units up.' tells us slope is 6/4=1.5, so the equation is y=1.5x-3, x=2, y=0."],
 ['M-confirm','No show up, still need to pay $18 registration fee, 3 visits means 3*$4=$12, then plus registration fee which equals to $30 in total.']
]){
 const x=load(),task={...Adaptive.tasks[key],variant_id:key};x.api.state.adaptiveItems.FAM=task;x.api.expected.FAM=task.answer;x.api.required.FAM=[...task.fields.map(f=>f.key),'why'];x.api.state.queue.push('FAM');x.api.goto(x.api.state.queue.indexOf('FAM'));x.api.submit({...task.answer,why:text});assert.equal(x.api.state.records.FAM.reason.points,2,key);
}
const fg=h.reason.evaluate('FG','line a has slope (7-1)/(2-0)=3.5, line b only has slope 2.',true);assert.notEqual(fg.points,2);assert(fg.reviewReasons.includes('arithmetic_error'));assert.equal(fg.calculationChecks[0].value,3);
assert.notEqual(h.reason.evaluate('FG','Line A has slope 3.5, line B has slope 2.',true).points,2);
assert.equal(h.reason.evaluate('C10','At zero visits it is free; the sign-up fee is $12.',true).status,'Needs review');
assert.equal(h.reason.evaluate('C9','I used another method not described here.',true).points,null);
assert.equal(h.reason.evaluate('C10','',true).points,null);
for(const[text,value]of [['-2^2',-4],['(-2)^2',4],['(7-1)/(2-0)',3],['1/2+1/4',.75]])assert.equal(MathEvidence.polynomial(text)[0],value);
for(const bad of ['alert(1)','process.exit()','1/0','x^99','2**4'])assert.equal(MathEvidence.polynomial(bad),null);
assert(MathEvidence.equal(MathEvidence.polynomial('3(x-4)'),MathEvidence.polynomial('3x-12')));
const q=load();q.api.goto(5);q.api.submit({left:9,right:6,step:'not-always',why:'At x=3, 3^2=9 and 2*3=6. They are not equal, so the claim is false.'});assert.equal(q.api.state.records.C6.reason.points,2);
q.api.goto(q.api.state.queue.indexOf('D1'));q.api.submit({rewrite:'5x-15',areaAt7:20,why:'5*x-5*3=5x-15. The 3 is a width, and 5*3=15 is the removed area.'});assert.equal(q.api.state.records.D1.reason.points,2);
// Restore an unfinished fractional input and exact text, without counting time away.
const saved=load({persistence:true});saved.api.goto(8);saved.input('m','-1/');saved.text('A draft\nwith two lines.');saved.tick(2400);saved.api.saveProgress();
const restored=load({persistence:true,storage:saved.archiveMap});assert.equal(restored.api.state.sessionId,saved.api.state.sessionId);assert.equal(restored.q('[data-n="m"]').value,'1/');assert.equal(restored.q('[data-sign="m"]').textContent,'−');assert.equal(restored.q('[data-text="why"]').value,'A draft\nwith two lines.');assert.equal(restored.api.activityTime(restored.api.state.records.C9),2400);assert.equal(restored.api.state.records.C9.attempts.length,0);
restored.input('m','-1');restored.input('b',2);restored.text(responses[1][1]);restored.api.submit();const immutable=JSON.stringify(restored.api.state.events);restored.q('#snapshot').click();restored.api.saveProgress();const report=load({persistence:true,storage:saved.archiveMap});assert.equal(report.api.state.phase,'report');assert.equal(JSON.stringify(report.api.state.events),immutable);assert(report.api.sessionMarkdown().includes('A line passes through (0,2) and (2,0)'));assert(report.api.printableReport().includes('question-text'));assert(report.api.printableReport().includes('student-work'));assert(report.api.printableReport().includes('report-feedback'));
const raw='{broken progress',map=new Map([[Store.KEY,raw]]),broken=load({persistence:true,storage:map});assert.equal(map.get(Store.KEY),raw);assert(broken.app.innerHTML.includes('kept unchanged'));assert(Store.read({getItem:()=>raw}).raw===raw);assert.equal(Store.save({setItem(){throw Error('quota');}},{}).ok,false);
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');for(const name of ['reason-evidence.js','session-store.js'])assert(html.includes(name+'?v=0.6'));
console.log(JSON.stringify({result:'passed',checks:['13 actual valid explanations accepted','FG arithmetic error retained with partial/open explanation credit','blank, unknown and contradictory claims remain distinct','safe arithmetic/polynomial checks','Q6 counterexample and changed P3 mathematics','refresh restores raw fractions, signs, multiline drafts, active time and immutable events','corrupt progress is not overwritten','compact colored report has the question and original work'],scope:'state, DOM callbacks and exact calculations; macOS native print dialog requires user retest'}));
