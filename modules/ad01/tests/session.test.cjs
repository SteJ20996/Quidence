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
test('completion and exports require all five lessons and saved current answers',()=>{
 const s=E.fresh();
 for(let i=0;i<5;i++){const l=C.LESSONS[i];E.update(s,l.predict.id,answer('unsure'));E.submit(s,l.predict.id,'predict');s.lessons[i].seenSteps=[0,1,2,3];for(const t of l.checks){E.update(s,t.id,answer(...t.correct));E.submit(s,t.id,'check');}s.lessons[i].reviewed=true;}
 s.view='summary';s.stage='review';s.lessonIndex=4;assert.ok(E.hydrate(s));assert.equal(E.allDone(s),true);
 const out=E.exportRecord(s);assert.equal(Object.keys(out.records).length,15);assert.equal(out.taskDefinitions.length,5);assert.equal(out.labs.length,5);
 E.update(s,'c8',answer('all'));assert.equal(E.allDone(s),false);assert.throws(()=>E.exportRecord(s));assert.equal(E.hydrate(s),null);
});
test('impossible lesson stages and corrupted submissions cannot be restored',()=>{
 for(const patch of [{schema:'ac01_beta01_session_v1'},{stage:'review'},{stage:'check'},{view:'summary'},{lessonIndex:8},{questionIndex:-1}])assert.equal(E.hydrate({...E.fresh(),...patch}),null);
 const s=E.fresh();E.update(s,'p1',answer('2'));E.submit(s,'p1','predict');s.records.p1.submissions[0].result='revisit';assert.equal(E.hydrate(s),null);
});

test('records saved with the four-lesson course open with lesson 5 added and every answer unchanged',()=>{
 // Build a finished four-lesson record exactly as ad01-beta-0.1 saved it.
 const s=E.fresh();s.contentVersion='ad01-beta-0.1';s.lessons=s.lessons.slice(0,4);s.labs=s.labs.slice(0,4);
 for(let i=0;i<4;i++){const l=C.LESSONS[i];E.update(s,l.predict.id,answer('unsure'));E.submit(s,l.predict.id,'predict');s.lessons[i].seenSteps=[0,1,2,3];for(const t of l.checks){E.update(s,t.id,{...answer(...t.correct),explanation:'Original words, kept: ∫ and 中文'});E.submit(s,t.id,'check');}s.lessons[i].reviewed=true;}
 s.view='summary';s.stage='review';s.lessonIndex=3;s.labs[3]={x:-1.25,h:.3,side:-1};s.labs[0]={kind:'jump',exponent:-1.2,side:-1};
 const saved=JSON.stringify(s),restored=E.hydrate(JSON.parse(saved));
 assert.ok(restored,'a four-lesson record was rejected');assert.equal(JSON.stringify(s),saved,'the input was changed in place');
 assert.equal(restored.contentVersion,C.VERSION);assert.equal(restored.lessons.length,5);assert.deepEqual(restored.lessons.slice(0,4),s.lessons);assert.deepEqual(restored.lessons[4],{seenSteps:[],reviewed:false});
 assert.deepEqual(restored.records,s.records,'answers, drafts and submissions are kept exactly');assert.deepEqual(restored.labs.slice(1,4),s.labs.slice(1));assert.deepEqual(restored.labs[4],E.defaultLabs()[4]);
 assert.deepEqual(restored.labs[0],{kind:'jump',exponent:-1.2,side:-1,showBand:false,band:-1,digits:3},'lesson 1 keeps its settings and gains the band and the nines');
 const bad=E.fresh();bad.labs[0].digits=0;assert.equal(E.hydrate(JSON.parse(JSON.stringify(bad))),null);bad.labs[0].digits=3;bad.labs[0].showBand='yes';assert.equal(E.hydrate(JSON.parse(JSON.stringify(bad))),null);
 assert.deepEqual(restored.events.slice(0,-1),s.events);assert.equal(restored.events.at(-1).type,'content_upgraded');
 // The summary needed all lessons; the record opens at the new lesson instead, and the summary returns once it is done.
 assert.equal(restored.view,'lesson');assert.equal(restored.lessonIndex,4);assert.equal(restored.stage,'predict');assert.equal(E.allDone(restored),false);
 assert.deepEqual(E.hydrate(JSON.parse(JSON.stringify(restored))),restored);
 // A record in the middle of lesson 2 keeps its place.
 const mid=JSON.parse(saved);mid.view='lesson';mid.stage='learn';mid.lessonIndex=1;const r2=E.hydrate(mid);assert.equal(r2.view,'lesson');assert.equal(r2.lessonIndex,1);assert.equal(r2.stage,'learn');
 // Shapes that were never published stay rejected.
 for(const broken of [{...JSON.parse(saved),contentVersion:'ad01-beta-0.2'},{...JSON.parse(saved),labs:JSON.parse(saved).labs.slice(0,3)},{...JSON.parse(saved),contentVersion:'ad01-beta-0.0'}])assert.equal(E.hydrate(broken),null);
});
