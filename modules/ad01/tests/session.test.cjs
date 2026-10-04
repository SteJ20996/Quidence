'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../dist/content.js'),E=require('../dist/engine.js');
const answer=(...choices)=>({choices,explanation:'',otherHelp:false});
test('blank and unknown answers are gated while unsure is a valid observation',()=>{
 const s=E.fresh();E.record(s,'p1');assert.equal(E.submit(s,'p1','predict'),false);
 for(const choices of [[],['bad'],['2','4'],['2','2']])assert.equal(E.valid(E.TASKS.p1,answer(...choices)),false);
 E.update(s,'p1',answer('unsure'));assert.equal(E.submit(s,'p1','predict'),true);assert.equal(E.last(s,'p1').result,'unsure');
});
test('immutable answer history records revisions and earlier instruction or feedback',()=>{
 const s=E.fresh();E.update(s,'p1',answer('4'));E.submit(s,'p1','predict');const first=JSON.stringify(s.records.p1.submissions[0]);
 s.lessons[0].seenSteps=[0,1,2,3];s.records.p1.feedbackSeen=true;const a=answer('2');a.otherHelp=true;E.update(s,'p1',a);
 assert.equal(s.records.p1.status,'draft');E.submit(s,'p1','predict');assert.equal(JSON.stringify(s.records.p1.submissions[0]),first);
 assert.equal(E.last(s,'p1').support.lessonSeen,true);assert.equal(E.last(s,'p1').support.feedbackSeen,true);assert.equal(E.last(s,'p1').support.otherHelp,true);
 assert.ok(E.hydrate(s));
});
test('graph settings persist with a session and invalid settings reject corrupt records',()=>{
 const s=E.fresh();s.labs[1]={kind:'absolute',a:0,h:.02,side:-1,showDerivative:true};assert.deepEqual(E.hydrate(s).labs[1],s.labs[1]);
 for(const change of [{a:9},{h:0},{h:NaN},{kind:'eval'},{side:0},{showDerivative:'yes'}]){const bad=E.fresh();Object.assign(bad.labs[1],change);assert.equal(E.hydrate(bad),null);}
 const bad=E.fresh();bad.labs[2].n=2.5;assert.equal(E.hydrate(bad),null);
});
test('completion and exports require all four lessons and saved current answers',()=>{
 const s=E.fresh();
 for(let i=0;i<4;i++){const l=C.LESSONS[i];E.update(s,l.predict.id,answer('unsure'));E.submit(s,l.predict.id,'predict');s.lessons[i].seenSteps=[0,1,2,3];for(const t of l.checks){E.update(s,t.id,answer(...t.correct));E.submit(s,t.id,'check');}s.lessons[i].reviewed=true;}
 s.view='summary';s.stage='review';s.lessonIndex=3;assert.ok(E.hydrate(s));assert.equal(E.allDone(s),true);
 const out=E.exportRecord(s);assert.equal(Object.keys(out.records).length,12);assert.equal(out.taskDefinitions.length,4);assert.equal(out.labs.length,4);
 E.update(s,'c8',answer('all'));assert.equal(E.allDone(s),false);assert.throws(()=>E.exportRecord(s));assert.equal(E.hydrate(s),null);
});
test('impossible lesson stages and corrupted submissions cannot be restored',()=>{
 for(const patch of [{schema:'ac01_beta01_session_v1'},{stage:'review'},{stage:'check'},{view:'summary'},{lessonIndex:8},{questionIndex:-1}])assert.equal(E.hydrate({...E.fresh(),...patch}),null);
 const s=E.fresh();E.update(s,'p1',answer('2'));E.submit(s,'p1','predict');s.records.p1.submissions[0].result='revisit';assert.equal(E.hydrate(s),null);
});
