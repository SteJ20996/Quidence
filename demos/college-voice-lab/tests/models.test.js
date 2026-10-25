import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorModel,intervalModel,parseNumber,numericMatch,followup,blank,copy,validDB,exampleAttempt,waveModel,rectangleModel,growthModel,gameModel,ids,subject,modelFor,targetFor,checkpointCopy} from '../dist/core.js';
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

test('precalculus keeps the sine amplitude separate from its input scale',()=>{
 for(const b of [1,2,3,4]){const m=waveModel(b,90/b);assert.equal(m.amplitude,1);assert.equal(m.period,360/b);assert.equal(m.cycles,b);assert.ok(Math.abs(m.value-1)<1e-12);}
 const m=waveModel(2,30,true);assert.equal(m.amplitude,3);assert.equal(m.period,90);assert.equal(m.value,3);
 assert.equal(followup('precalculus','period').target,90);
});
test('fixed perimeter permits different areas and the square maximizes them',()=>{
 assert.equal(rectangleModel(3).area,27);assert.equal(rectangleModel(6).area,36);assert.equal(rectangleModel(2).area,20);
 for(let w=1;w<=11;w++){const m=rectangleModel(w);assert.equal(2*(m.w+m.h),24);assert.ok(m.area<=36);assert.equal(m.area,36-(w-6)**2);}
 const m=rectangleModel(3,true);assert.equal(m.perimeter,28);assert.equal(m.area,45);assert.equal(m.maxArea,49);
});
test('exponential functions have fixed ratios and changing differences',()=>{
 assert.equal(growthModel(0).delta,50);assert.equal(growthModel(1).delta,75);assert.equal(growthModel(3).delta,168.75);
 for(const b of [1.25,1.5,2])for(let x=0;x<=4;x++){const m=growthModel(x,b);assert.ok(Math.abs(m.next/m.value-b)<1e-12);assert.ok(Math.abs(m.delta-m.value*(b-1))<1e-12);}
 const m=growthModel(1,1.5,true);assert.equal(m.value,125);assert.equal(m.next,156.25);assert.equal(m.delta,31.25);
});
test('game theory checks unilateral deviations separately from joint benefit',()=>{
 const cc=gameModel(0,0);assert.equal(cc.total,6);assert.equal(cc.gainOwn,2);assert.equal(cc.stable,0);
 const dd=gameModel(1,1);assert.equal(dd.total,2);assert.equal(dd.gainOwn,-1);assert.equal(dd.stable,1);
 for(const a of [0,1])for(const b of [0,1]){const m=gameModel(a,b);assert.equal(m.stable,a===1&&b===1?1:0);}
 const tr=gameModel(0,0,true);assert.equal(tr.total,8);assert.equal(tr.switchOwn,3);assert.equal(tr.gainOwn,-1);assert.equal(tr.stable,1);
});
test('all six subjects have valid examples, focus routing and fixed transfer checks',()=>{
 const db=Object.fromEntries([['version',1],...ids.map(id=>[id,[exampleAttempt(id)]])]);assert(validDB(db));
 for(const id of ids){const s=db[id][0];assert(s.isExample);assert.equal(s.review.target,targetFor(id,modelFor(id,s)));for(const [focus] of subject[id].focus){const f=followup(id,focus);assert(f.question.length>20);if(focus==='custom')assert.equal(f.target,null);else assert(Number.isFinite(f.target));}assert(Number.isFinite(targetFor(id,modelFor(id,s,true),true)));}
 for(const [id,key,value] of [['precalculus','b',0],['geometry','w',12],['algebra2','x',5],['game-theory','a',2]]){const bad=copy(db);bad[id][0].model[key]=value;assert.equal(validDB(bad),false);}
});

test('checkpoint wording and targets stay aligned after changing model settings',()=>{
 for(const [id,model,expected,prompt,label] of [
  ['precalculus',{b:4,theta:30},90,'sin(4x)','Period'],
  ['geometry',{w:2},20,'height 10','Area'],
  ['algebra2',{x:4,b:2},1600,'x = 4 with x = 5','f(5) − f(4)'],
  ['game-theory',{a:1,b:1},-1,'currently choose Compete','payoff change']
 ]){const m=modelFor(id,{model}),c=checkpointCopy(id,m);assert.equal(targetFor(id,m),expected);assert(c.prompt.includes(prompt));assert(c.label.includes(label));}
});
