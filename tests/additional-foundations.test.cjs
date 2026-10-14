'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const B=require('../assets/foundation-bank.js'),E=require('../assets/foundation-engine.js'),S=require('../assets/report-store.js');
// Independent arithmetic from the question conditions, not from the stored key.
const gcd=(a,b)=>b?gcd(b,a%b):a,division=(a,b)=>[Math.floor(a/b),a-b*Math.floor(a/b)];
const references={
 'number-theory':[division(47,6),division(-17,5),['yes','no'],['two'],[2,1,1],['no',7],[gcd(42,66)],[18*24/gcd(18,24)],[gcd(91,65)],[(27+38)%7],[(8*13)%5],[[0,1,2,3,4,5,6].find(x=>(3*x)%7===1)],['odd',(2*3+1)**2],['nine'],['yes']],
 'physics-1':[[-5-3,Math.abs(-5-3)],[(6-(-2))/(5-1)],[(-2-6)/4],[10-4,(10-4)/2],[4*10,4*10],['book'],[.5*2*3**2,.5*2*6**2],[3*4+1*(-2),(3*4+1*(-2))/(3+1)],[8*3,Math.sqrt(2*8*3/3)],[6*.5],[6/2],[1/.4],[1000*10*.8],[1000*10*.003,'up'],[.04*1.5/.02]],
 'physics-2':[[.25*4000*6],[150-60],[20+273.15],[-.02*200],[.003*(-20)],[1/2**2],[4+8,12/(4+8)],[1/(1/6+1/3),9*(1/6+1/3)],[6*.5],[2e-6*500*.4],[.02*.3/.1],[1/(1/10-1/30),-(1/(1/10-1/30))/30],[12/3],[1*.6/1.5],[4.14e-15*1e15,4.14e-15*1e15-2.14,'no']]
};
test('45 new foundation answers agree with independently recomputed arithmetic and counterexamples',()=>{
 assert.equal(2**2*3*7,84);assert.equal(49%7,0);assert.equal(9%2,1);assert.equal(9%3,0);assert(4.14/2<2.14);
 for(let k=-50;k<=50;k++)assert.equal(Math.abs(((2*k+1)**2)%2),1);
 for(const [id,rows]of Object.entries(references))for(const[i,values]of rows.entries()){
  const t=B.MODULES[id].tasks[i],a=E.blank(t);assert.equal(t.fields.length,values.length,t.id);
  t.fields.forEach((f,j)=>{if(typeof values[j]==='number')assert(Math.abs(f.answer-values[j])<1e-9,t.id);else assert.equal(f.answer,values[j],t.id);a.values[f.id]=String(values[j]);});
  a.explanation='Independent reference calculation; explanation review remains open.';
  assert.equal(E.validate(t,a),'',t.id);assert.equal(E.evaluate(t,a,E.NUMERIC_POLICY).state,'matched',t.id);
  for(const f of t.fields.filter(f=>f.kind==='number')){if(f.unit){assert(E.numberMatches(f,String(f.answer)+' '+f.unit,E.NUMERIC_POLICY),t.id+' requested unit');assert(!E.numberMatches(f,String(f.answer)+' wrongUnit',E.NUMERIC_POLICY));}const wrong=structuredClone(a);wrong.values[f.id]=String(Number(a.values[f.id])+1);assert.equal(E.evaluate(t,wrong,E.NUMERIC_POLICY).parts[f.id],false,t.id);}
 }
});
test('six-subject portfolios upgrade without rewriting drafts, submissions or prior reports',()=>{
 const old=E.fresh();for(const id of Object.keys(references))delete old.modules[id];
 const s=E.createSession(old,'ad01'),t=E.task(s),a=E.blank(t);a.values.limit='2';a.explanation='Original answer\n  −1/3 / 我的原文';E.edit(s,t,a);E.submit(s,t);E.edit(s,t,{...a,explanation:a.explanation+' draft'});
 const before=JSON.stringify(old),restored=E.hydrate(old);assert(restored);assert.equal(JSON.stringify(old),before);for(const id of Object.keys(old.modules))assert.deepEqual(restored.modules[id],old.modules[id]);
 for(const id of Object.keys(references))assert.deepEqual(restored.modules[id],{active:null,sessions:[]});
 const corrupt=structuredClone(old);delete corrupt.modules.ab01;assert.equal(E.hydrate(corrupt),null);assert.equal(E.hydrate({...old,modules:{...old.modules,unknown:{active:null,sessions:[]}}}),null);
});
test('unfamiliar and uncertain new topics stay separate from wrong answers, with immutable exports and reports',()=>{
 for(const id of Object.keys(references)){
  const p=E.fresh(),s=E.createSession(p,id),t=E.task(s),a=E.blank(t);a.notStudied=true;a.explanation='I have not studied this yet.\n  Keep my wording.';E.edit(s,t,a);assert(E.submit(s,t).ok);assert.equal(E.last(s,t).objective.state,'not-studied');const first=JSON.stringify(E.last(s,t));
  E.edit(s,t,{...a,notStudied:false,unsure:true});assert(E.submit(s,t).ok);assert.equal(E.last(s,t).objective.state,'unsure');assert.equal(JSON.stringify(s.records[t.id].submissions[0]),first);assert(E.hydrate(p));
  const out=E.portable(s),storage=new Map(),adapter={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};assert(S.save(id,out,s.id,adapter).ok);assert.equal(S.read(adapter).data.items[0].module,id);assert.equal(out.taskDefinitions.length,15);assert(out.scopeReview.notChecked.length>0);assert.equal(out.observations[0].explanationReview,null);
 }
});
