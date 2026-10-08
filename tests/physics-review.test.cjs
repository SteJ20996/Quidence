'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../assets/foundation-engine.js'),Content=require('../assets/physics-foundation-content.js'),Course=require('../assets/course-engine.js'),M=require('../assets/physics-foundation-models.js'),Tools=require('../assets/project-tools.js');
const empty={VERSION:'none',MODULES:{}};
const engine=family=>F.forBank(require('../assets/'+family+'-bank.js'),empty,{schema:'cluevera_'+family+'_portfolio_v1',challenge:true,...(family==='project'?{projects:true,fieldTypes:Tools.fieldTypes}:{})});
const answer=(E,t)=>{const a=E.blank(t);for(const f of t.fields)a.values[f.id]=f.kind==='number'?String(f.answer):'Synthetic mathematical review, not a student sample.';a.explanation='Synthetic regression';return a;};
test('physics uses correct rounding to three significant figures at large and tiny scales, without widening math tolerances',()=>{
 const E=engine('challenge'),s=E.createSession(E.fresh(),'physics-2'),t=E.tasks(s).find(t=>t.id==='p2-c06'),a=answer(E,t);
 for(const x of ['4.83×10^14','4.83e14','4.831×10^14','4.8309e14','4.83x10^14','483090000000000']){a.values.threshold=x;assert.equal(E.validate(t,a),'');assert(E.evaluate(t,a,E.NUMERIC_POLICY).parts.threshold,x);}
 for(const x of ['4.8e14','4.82e14','0','1/25']){a.values.threshold=x;assert.equal(E.evaluate(t,a,E.NUMERIC_POLICY).parts.threshold,false,x);}
 const heat=E.tasks(s).find(t=>t.id==='p2-c01'),b=answer(E,heat);
 for(const x of ['2.97e2','2.971e2','2.972e2']){b.values.kelvin=x;assert(E.evaluate(heat,b,E.NUMERIC_POLICY).parts.kelvin,x);}
 const check=(n,x,physics=false)=>F.numberMatches({answer:n,...(physics?{precision:'significant',significantFigures:3}:{})},x,F.NUMERIC_POLICY);
 assert(check(6.6743e-11,'6.67e-11',true));assert(!check(6.6743e-11,'6.6e-11',true));assert(!check(0.0049,'0.00',true));
 for(const x of ['0.035','0.04','1/25'])assert(!check(1/27,x));assert(!check(2,'2.00000001'));
 for(const x of ['1e999','4.83x10^14;alert(1)','3e8 kPa'])assert.equal(F.numeric(x),null);
});
test('all 87 current physics numeric fields accept their correctly rounded three-significant-figure result',()=>{
 let count=0;
 for(const family of ['challenge','project']){const E=engine(family);for(const id of Content.IDS){const s=E.createSession(E.fresh(),id);for(const t of E.tasks(s)){const a=answer(E,t);for(const f of t.fields.filter(f=>f.kind==='number')){a.values[f.id]=f.answer===0?'0':f.answer.toPrecision(3);count++;}for(const f of t.fields.filter(f=>f.kind==='number'))assert.equal(E.evaluate(t,a,E.NUMERIC_POLICY).parts[f.id],true,t.id+' '+f.id);}}}
 assert.equal(count,87);
});
test('v5 task definitions and precision-2 outcomes survive hydration unchanged; affected old outcomes are separated from weaknesses',()=>{
 for(const family of ['challenge','project']){
  const E=engine(family),oldBank=require('../assets/'+family+'-bank-v5.js'),old=F.forBank(oldBank,empty,{...E.settings}),p=old.fresh(),s=old.createSession(p,'physics-2');
  const t=old.tasks(s).find(t=>t.id=== 'p2-c06')||old.tasks(s)[0],a=answer(old,t);if(t.id==='p2-c06')a.values.threshold='4.83e14';old.edit(s,t,a);assert(old.submit(s,t).ok);
  const submission=old.last(s,t);submission.numericPolicy=F.PREVIOUS_NUMERIC_POLICY;submission.objective=old.evaluate(t,a,F.PREVIOUS_NUMERIC_POLICY);const before=JSON.stringify(submission);
  assert(E.hydrate(p));assert.equal(JSON.stringify(submission),before);assert.deepEqual(E.tasks(s),oldBank.MODULES['physics-2'].tasks);
  if(t.id==='p2-c06'){assert.equal(submission.objective.parts.threshold,false);assert.equal(E.observations(s).find(o=>o.id===t.id).components.find(c=>c.id==='threshold').state,'rounding-review');assert(E.submit(s,t).ok);assert(E.last(s,t).objective.parts.threshold);assert.equal(JSON.stringify(s.records[t.id].submissions[0]),before);}
 }
});
test('choice values expose display positions; session order is stable and unrelated to stored correct ID',()=>{
 const positions=new Set(),orders=new Set();
 for(const id of Content.IDS){const C=Content.create(id),E=Course.create(C),s=E.fresh();s.createdAt='2026-10-08T12:00:00.000Z';for(const t of Object.values(E.TASKS)){const options=E.choiceOptions(s,t);assert.deepEqual(options,E.choiceOptions(structuredClone(s),t));assert.deepEqual(options.map(o=>o.value),['option-0','option-1','option-2','unsure']);positions.add(options.findIndex(o=>o.option.id===t.correct[0]));assert.equal(E.score(t,{choices:t.correct,explanation:'Synthetic work',otherHelp:false}),'correct');}
  const t=C.LESSONS[0].predict;for(let i=0;i<10;i++){s.createdAt='2026-10-08T12:00:'+String(i).padStart(2,'0')+'.000Z';orders.add(E.choiceOptions(s,t).map(o=>o.option.id).join());}
 }
 assert.equal(positions.size,3);assert(orders.size>1);
});
test('formerly table-only physics models now include accessible original diagrams and show the model note once',()=>{
 for(const [id,indices]of [['physics-1',[2,3,5]],['physics-2',[0,1,2,3,6]]]){const C=Content.create(id);for(const i of indices){const r=M.model(id,i,C.LESSONS[i].defaults);assert.match(r.graph,/<svg[^>]+role="img"/);assert.match(r.graph,/<desc/);assert.match(r.graph,/<table/);assert(!r.graph.includes(r.note));}}
 assert.equal(M.format(2/4.14e-15),'4.83 × 10¹⁴');assert.equal(M.format(1.2e-6),'1.20 × 10⁻⁶');assert.equal(M.format(0),'0');
 assert.match(M.model('physics-2',1,Content.create('physics-2').LESSONS[1].defaults).note,/external constraint/);
});
test('published HTML loads current and pinned banks in browser order for new and historical reports',()=>{
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
 for(const [folder,title]of [['diagnostics','Challenge'],['projects','Project']]){
  const window={},context=vm.createContext({window}),dir=path.resolve(__dirname,'..',folder),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  for(const[,reference]of html.matchAll(/<script src="([^"]+)"/g)){const src=new URL(reference,'https://quidence.test/'+folder+'/').pathname;if(/(?:bank[^/]*|subject-foundations|foundation-extension|project-tools|foundation-engine)\.js$/.test(src))vm.runInContext(fs.readFileSync(path.resolve(dir,'..','.'+src),'utf8'),context,{filename:src});}
  const bank=window['Quidence'+title+'Bank'];assert(bank.MODULES['physics-2']);assert(bank.HISTORY[title==='Challenge'?'quidence-challenges-5':'quidence-projects-5']);
 }
});
