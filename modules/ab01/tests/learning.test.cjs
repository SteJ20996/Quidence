const assert=require('node:assert/strict');
const E=require('../dist/learning-engine.js');
const expected={
 'pre-1':[2,-1], 'pre-3':[1,0], 'practice-1':[2,1], 'practice-2':[5,2],
 'post-1':[-1,0], 'post-2':[5,1], 'post-3':[0,-1], 'delay-1':[1,3], 'delay-2':[1,1]
};
for(const t of Object.values(E.TASKS).flat()){
 const a={values:expected[t.id],choice:t.id==='pre-2'?0:t.choiceAnswer};
 assert(E.valid(t,a),t.id);
 assert(Object.values(E.score(t,a)).every(Boolean),t.id);
 if(t.matrix&&t.vector){const [a,b,c,d]=t.matrix,[x,y]=t.vector;assert.deepEqual([a*x+b*y,c*x+d*y],expected[t.id],t.id);}
 if(t.kind!=='choice'){
  assert(!E.valid(t,{...a,values:['',0]}));assert(!E.valid(t,{...a,values:[Infinity,0]}));
  assert(Object.values(E.score(t,{...a,values:[99,99]})).some(v=>!v));
 }
 if(t.options)assert(!E.valid(t,{...a,choice:t.options.length}));
}
const paired=E.TASKS.post[1];
assert.deepEqual(E.score(paired,{values:[5,1],choice:0}),{'Output calculation':true,'Preserved coefficients':false},'Calculation must not substitute for meaning.');
const now=Date.parse('2026-10-04T08:00:00Z'),s=E.fresh();
assert(!E.delayEligible(s,now));s.completedAt='2026-10-03T08:00:00Z';
assert(!E.delayEligible(s,now-1));assert(E.delayEligible(s,now));
assert(E.hydrate(s));assert.equal(E.hydrate({...s,taskSet:'future-unknown'}),null);
assert.equal(E.hydrate({...s,lesson:{...s.lesson,checkpoint:{...s.lesson.checkpoint,values:null}}}),null);
assert.equal(E.hydrate({...s,index:99}),null);
assert.equal(E.hydrate({...s,records:{unknown:{}}}),null);
const history=[{answer:{values:[0,0]},score:{'Column coordinates':false},support:{systemHint:false}},{answer:{values:[1,0]},score:{'Column coordinates':true},support:{systemHint:true}}];
const evidence=E.summarize({'pre-3':{status:'submitted',answer:{values:[1,0]},submissions:history}},'pre')[2];
assert.equal(evidence.first['Column coordinates'],false);assert.equal(evidence.last['Column coordinates'],true);assert.equal(evidence.support.systemHint,true);
assert.equal(E.summarize({'pre-3':{status:'not-studied',submissions:[]}},'pre')[2].last,null);
console.log('PASS: independent matrix calculations, distinct calculation/meaning evidence, numeric constraints, phase history, pinned task version and one-day eligibility.');
