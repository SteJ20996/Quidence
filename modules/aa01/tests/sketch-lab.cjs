const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../dist/sketch-lab/math.js'),{load}=require('./workspace.cjs');
const config={files:['sketch-lab/math.js'],entry:'sketch-lab/lab.js',marker:'  // Test seam.',expose:'  window.testOnly={state,collect,record,elapsed,save,render,graph,equationDrawing,eqGrade};'};
const lab=()=>load(config);
const enter=(h,k,v)=>{const el=h.q(`[data-number="${k}"]`);assert(el,k);el.value=String(v);el.fire('input');};
const choose=(h,k,v)=>{const el=h.q(`[data-select="${k}"]`);assert(el,k);el.value=v;el.fire('change');};
const ready=h=>{h.q('[data-topic="quadratic"]').click();assert(h.q('#ready'));h.q('#ready').click();};
const positive={a:1,b:-4,c:9,opening:'up',x1:0,y1:9,x2:1,y2:6,x3:3,y3:6,vx:2,vy:5,kind:'minimum',reason:'bound-and-zero',why:''};
const negative={a:-1,b:4,c:1,opening:'down',x1:0,y1:1,x2:1,y2:4,x3:3,y3:4,vx:2,vy:5,kind:'maximum',reason:'bound-and-zero',why:''};
function fill(h,a){for(const[k,v]of Object.entries(a))if(h.q(`[data-number="${k}"]`))enter(h,k,v);else if(h.q(`[data-select="${k}"]`))choose(h,k,v);else if(k==='why'){h.q('#why').value=v;h.q('#why').fire('input');}}
for(const x of [-50,-3,-.5,0,1,2,3,8,50]){
 assert.equal(M.value('positive',x),x*x-4*x+9);assert.equal(M.value('negative',x),-x*x+4*x+1);
 assert.equal(M.value('positive',x)+M.value('negative',x),10);assert(M.value('positive',x)>=5&&M.value('negative',x)<=5);
}
assert.deepEqual(M.vertex(1,-4,9),{x:2,y:5});assert.deepEqual(M.vertex(-1,4,1),{x:2,y:5});assert.throws(()=>M.vertex(0,1,2));
for(const x of [2-Math.sqrt(5),2+Math.sqrt(5)])assert(M.close(M.value('negative',x),0));
assert.equal(M.number('−1/2'),-.5);assert.equal(M.number('+3/2'),1.5);assert(Number.isNaN(M.number('1/0')));assert(Number.isNaN(M.number('2e3')));
assert.equal(M.plan('positive',positive).route.target,'negative');assert.equal(M.plan('negative',negative).route.target,'review');
assert.equal(M.plan('positive',{...positive,b:4}).route.target,'expansion');
assert.equal(M.plan('positive',{...positive,y1:8}).route.target,'points');
assert.equal(M.plan('positive',{...positive,opening:'down'}).route.target,'comparison');
assert.equal(M.plan('positive',{...positive,kind:'maximum'}).route.target,'comparison');
assert.equal(M.plan('positive',{...positive,vx:1,vy:6}).route.target,'vertex');
assert(M.plan('positive',{...positive,x2:0}).error);
assert.equal(M.reason('positive',{why:'My own unfamiliar valid explanation.'}).points,null);
assert.equal(M.reason('positive',{reason:'bound-and-zero',why:'The square can be negative.'}).points,null);
assert.equal(M.reason('positive',{reason:'three-samples',why:'The square is nonnegative. At x = 2 it is zero.'}).points,null);
assert.equal(M.reason('positive',{why:'The square cannot be negative. At x = 2 it is zero.'}).points,2);
assert.equal(M.reason('negative',{why:'The square is nonnegative. Its negative is at most zero. At x = 2 it is zero.'}).points,2);
const e=lab();assert.equal(e.q('#restore-model').hidden,true);
choose(e,'operation','add');enter(e,'amount',-3);enter(e,'x',3);e.tick(1000);e.q('#save').click();assert(!e.api.record().complete);e.tick(1000);assert.equal(e.api.elapsed(e.api.record()),2000);
enter(e,'amount',3);choose(e,'reason','same-both');e.q('#save').click();assert(e.api.record().complete);e.tick(4000);assert.equal(e.api.elapsed(e.api.record()),2000);
const first=JSON.stringify(e.api.record().attempts[1]);e.q('[data-help="restore-model"]').click();assert(e.api.record().complete);assert.equal(JSON.stringify(e.api.record().attempts[1]),first);assert.equal(Object.keys(e.api.record().attempts[1].support).length,0);
e.q('[data-stage="1"]').click();assert.equal((e.api.equationDrawing(1).match(/class="coin"/g)||[]).length,12);assert.equal((e.api.equationDrawing(1).match(/class="tile"/g)||[]).length,4);
e.q('[data-stage="2"]').click();assert.equal((e.api.equationDrawing(2).match(/class="coin"/g)||[]).length,12);assert(e.app.innerHTML.includes('four equal groups'));
enter(e,'amount','1/');assert(!e.api.record().complete);e.q('[data-topic="quadratic"]').click();assert(e.q('#ready'));e.tick(1000);e.q('#not-ready').click();assert.equal(e.q('#n-amount').value,'1/');
const h=lab();ready(h);assert.equal(h.q('#quadratic-graph').hidden,true);assert(h.q('[data-function="negative"]').disabled);
fill(h,positive);h.q('#save').click();assert.equal(h.api.record().result.correct,true);assert.equal(h.api.record().result.reason.points,2);
const posSnapshot=JSON.stringify(h.api.record().attempts[0]);h.q('#follow-route').click();assert.equal(h.api.state.functionId,'negative');assert.equal(h.q('#n-a').value,'');assert.equal(h.q('#quadratic-graph').hidden,true);
// Merely visiting the second function must not disclose its answer in the record.
h.q('#lab-review').click();assert(!h.app.innerHTML.includes('Compare the mathematics'));h.q('#return').click();
fill(h,negative);h.q('#save').click();assert(h.api.record().complete);assert.equal(h.api.record().attempts[0].parent_event_id,h.api.state.records.positive.attempts[0].event_id);
h.q('#follow-route').click();assert(h.app.innerHTML.includes('reflect across y = 5'));assert.equal(JSON.stringify(h.api.state.records.positive.attempts[0]),posSnapshot);
assert(h.api.state.records.negative.help['comparison-review']);h.q('#return').click();enter(h,'c',2);assert.equal(h.api.record().result,null);assert.equal(h.q('#follow-route'),null);
h.q('#save').click();assert.equal(h.api.record().route.target,'expansion');h.q('#follow-route').click();assert(h.q('#part-expansion').getAttribute('class').includes('target'));assert.equal(h.api.state.functionId,'negative');
// Wrong opening leads to sign comparison; arithmetic errors remain on their source function.
const contrast=lab();ready(contrast);fill(contrast,{...positive,opening:'down'});contrast.q('#save').click();contrast.q('#follow-route').click();assert(contrast.api.state.comparison);assert.equal(contrast.api.state.functionId,'negative');assert(contrast.app.innerHTML.includes('Compare the sign outside the square'));
contrast.q('[data-help="quadratic-graph"]').click();assert.equal(contrast.q('#quadratic-graph').hidden,false);assert(contrast.api.graph('negative',true).includes('negative-curve'));assert(contrast.api.graph('negative',true).includes('positive-curve'));assert(!/NaN|Infinity/.test(contrast.api.graph('negative',true)));
const repair=lab();ready(repair);fill(repair,{...positive,b:4});repair.q('#save').click();repair.q('#follow-route').click();assert.equal(repair.api.state.functionId,'positive');assert(!repair.api.state.negativeUnlocked);
// Editing a wrong submission removes stale routing and preserves the old event.
const before=repair.api.record().attempts.length;enter(repair,'b',-4);assert.equal(repair.api.record().result,null);assert.equal(repair.q('#follow-route'),null);assert.equal(repair.api.record().attempts.length,before);
// Post-support revision retains the original unassisted attempt and records support on the new one.
repair.q('[data-help="quadratic-graph"]').click();repair.q('#save').click();assert.equal(Object.keys(repair.api.record().attempts[0].support).length,0);assert(Object.keys(repair.api.record().attempts[1].support).length>0);
console.log(JSON.stringify({result:'passed',checks:['both expansions, bounds, vertices, roots and y=5 reflection','signed fractions and distinct x validation','component-specific routes and language uncertainty','equation restore/group counts and timer','partial drafts survive navigation','separate positive/negative answers and source events','optional support with immutable earlier snapshots','pending-function key remains hidden','revisions clear stale routing'],scope:'Exact math and DOM callbacks; native layout and downloads unverified'}));
