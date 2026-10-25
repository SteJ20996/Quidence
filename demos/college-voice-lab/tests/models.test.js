import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorModel,intervalModel,parseNumber,numericMatch,followup,blank,copy,validDB,exampleAttempt} from '../dist/core.js';
import {VoiceRecorder,appendTranscript} from '../dist/recorder.js';
test('vector model separates direction-dependent length from coordinate scaling',()=>{
 assert.ok(Math.abs(vectorModel(45).factor-Math.sqrt(2.5))<1e-12);
 assert.equal(vectorModel(0).factor,2);assert.equal(vectorModel(90).factor,1);
 const tr=vectorModel(0,true);assert.equal(tr.before,5);assert.equal(tr.after,Math.sqrt(97));assert.equal(tr.factor,Math.sqrt(97)/5);
 for(let a=0;a<=90;a+=15){const m=vectorModel(a);assert.ok(m.factor>=1&&m.factor<=2);assert.ok([m.x,m.y,m.before,m.after].every(Number.isFinite));}
});
test('normal intervals use the stated known-SD model; precision and coverage stay distinct',()=>{
 const m=intervalModel(40,95);assert.ok(Math.abs(m.lo-.7207743144279912)<1e-12);
 assert.equal(m.mean,3.2);assert.equal(m.sigma,8);
 assert.equal(intervalModel(160).half/m.half,.5);
 assert.ok(Math.abs(intervalModel(40,99).half/m.half-2.576/1.96)<1e-12);
 for(let n=20;n<=200;n+=20)for(const level of [95,99]){const r=intervalModel(n,level);assert.ok(r.lo<r.mean&&r.mean<r.hi);assert.ok(Object.values(r).every(Number.isFinite));}
});
test('numeric parsing accepts decimal comma and Unicode minus, without accepting nonfinite or ambiguous values',()=>{
 assert.equal(parseNumber('1,97'),1.97);assert.equal(parseNumber('−.5'),-.5);assert.equal(numericMatch('1,58',Math.sqrt(2.5)),true);
 for(const x of ['', 'Infinity','1,234.5','0x10','two'])assert.equal(parseNumber(x),null);
});
test('scripted routing follows an explicit focus and never classifies arbitrary prose',()=>{
 assert.equal(followup('linear','universal').target,1);
 assert.equal(followup('linear','counterexample').target,2);
 assert.equal(followup('stats','individual').target,.5);
 assert.equal(followup('stats','coverage').target,95);
 for(const id of ['linear','stats']){assert.equal(followup(id,'custom').target,null);assert.match(followup(id,'custom').observation,/without an automatic judgment/);}
});
test('wording confirmation appends and never overwrites existing text',()=>{
 assert.equal(appendTranscript('Original answer','Confirmed wording'),'Original answer\nConfirmed wording');
 assert.throws(()=>appendTranscript('x'.repeat(1999),'more'));assert.throws(()=>appendTranscript('',' '));
});
test('saved states reject impossible settings and unlocked stages without evidence',()=>{
 const db={version:1,linear:[blank('linear')],stats:[blank('stats')]};assert(validDB(db));
 for(const a of [-15,91,16]){const bad=copy(db);bad.linear[0].model.angle=a;assert.equal(validDB(bad),false);}
 for(const n of [0,39,201]){const bad=copy(db);bad.stats[0].model.n=n;assert.equal(validDB(bad),false);}
 const bad=copy(db);bad.stats[0].reached=bad.stats[0].phase=4;assert.equal(validDB(bad),false);
});
test('late microphone permission after cancelling releases all tracks',async()=>{
 let resolve,stops=0;const r=new VoiceRecorder({media:{getUserMedia:()=>new Promise(r=>resolve=r)},Recorder:class{}});const p=r.start();r.cancel();resolve({getTracks:()=>[{stop(){stops++;}}]});await p;assert.equal(stops,1);assert.equal(r.state,'idle');
});
test('denied microphone permission leaves the recorder recoverable',async()=>{
 const r=new VoiceRecorder({media:{getUserMedia:async()=>{throw Object.assign(Error(),{name:'NotAllowedError'});}},Recorder:class{}});await r.start();assert.equal(r.state,'error');assert.equal(r.blob,null);r.cancel();assert.equal(r.state,'idle');
});
test('one-click journeys are labelled examples with complete, valid evidence',()=>{
 const db={version:1,linear:[exampleAttempt('linear')],stats:[exampleAttempt('stats')]};assert(validDB(db));
 assert.equal(db.linear[0].isExample,true);assert.equal(db.stats[0].review.matches,true);assert.equal(db.linear[0].review.matches,false);
 assert.equal(db.linear[0].first.text,db.linear[0].voiceSources[0].rawText);
});
