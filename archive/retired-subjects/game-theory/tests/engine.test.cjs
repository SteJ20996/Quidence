'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../dist/content.js'),E=require('../dist/engine.js');
const answer=(...choices)=>({choices,explanation:'',otherHelp:false});
test('row and column ownership, deviations, and known equilibria',()=>{
 assert.deepEqual(C.GAMES.transferRead.payoffs[1][0],[3,7]);
 assert.deepEqual(E.deviation(C.GAMES.meetup,0,0,0),{before:4,after:0,gain:-4,row:1,col:0});
 assert.deepEqual(E.deviation(C.GAMES.meetup,0,0,1),{before:3,after:0,gain:-3,row:0,col:1});
 assert.deepEqual(E.equilibria(C.GAMES.meetup),[[0,0],[1,1]]);
 assert.deepEqual(E.equilibria(C.GAMES.resource),[[1,1]]);
 assert.deepEqual(E.equilibria(C.GAMES.transferNash),[[0,0],[1,1]]);
 assert.deepEqual(E.dominant(C.GAMES.packaging,0),[1]);
 assert.deepEqual(E.dominant(C.GAMES.packaging,1),[1]);
 assert.deepEqual(E.dominant(C.GAMES.meetup,0),[]);
});
test('ties are best responses but not strictly dominant; no pure equilibrium is possible',()=>{
 const ties={rows:['U','D'],cols:['L','R'],payoffs:[[[1,1],[1,1]],[[1,1],[1,1]]]};
 assert.deepEqual(E.bestResponses(ties,0,0),[0,1]);
 assert.deepEqual(E.equilibria(ties),[[0,0],[0,1],[1,0],[1,1]]);
 assert.deepEqual(E.dominant(ties,0),[]);
 const zeroSum={rows:['H','T'],cols:['H','T'],payoffs:[[[1,-1],[-1,1]],[[-1,1],[1,-1]]]};
 assert.deepEqual(E.equilibria(zeroSum),[]);
});
test('all 2×2 binary-payoff games match an independent unilateral-deviation oracle',()=>{
 for(let mask=0;mask<256;mask++){
  const values=Array.from({length:8},(_,i)=>(mask>>i)&1);
  const g={rows:['U','D'],cols:['L','R'],payoffs:[[values.slice(0,2),values.slice(2,4)],[values.slice(4,6),values.slice(6,8)]]};
  const expected=[];for(let r=0;r<2;r++)for(let c=0;c<2;c++)if(g.payoffs[r][c][0]>=g.payoffs[1-r][c][0]&&g.payoffs[r][c][1]>=g.payoffs[r][1-c][1])expected.push([r,c]);
  assert.deepEqual(E.equilibria(g),expected);
 }
});
test('new game answers are independently supported by their tables',()=>{
 assert.equal(E.score(E.TASKS.c1,answer('37')),'correct');
 assert.ok(C.GAMES.transferRead.payoffs[0][1][0]>C.GAMES.transferRead.payoffs[0][1][1]);
 assert.deepEqual(E.bestResponses(C.GAMES.transferBest,0,1),[1]);
 assert.deepEqual(E.dominant(C.GAMES.transferBest,0),[1]);
 const d=C.GAMES.transferDilemma;assert.deepEqual(E.dominant(d,0),[1]);assert.deepEqual(E.dominant(d,1),[1]);
 assert.ok(d.payoffs[0][0].every((x,i)=>x>d.payoffs[1][1][i]));
 assert.notEqual(d.payoffs[0][0].reduce((a,b)=>a+b),d.payoffs[1][1].reduce((a,b)=>a+b));
 assert.deepEqual(E.TASKS.c7.correct,E.equilibria(C.GAMES.transferNash).map(([r,c])=>`${r}${c}`));
});
test('blank, duplicate, unknown, and incompatible multi-select answers cannot submit',()=>{
 const t=E.TASKS.c7;
 assert.equal(E.valid(t,answer()),false);
 assert.equal(E.valid(t,answer('00','00')),false);
 assert.equal(E.valid(t,answer('00','unsure')),false);
 assert.equal(E.valid(t,answer('11','none')),false);
 assert.equal(E.valid(t,answer('unknown')),false);
 assert.equal(E.valid(E.TASKS.c1,answer('37','73')),false);
 assert.equal(E.score(t,answer('11','00')),'correct');
 assert.equal(E.score(t,answer('00')),'revisit');
 assert.equal(E.score(t,answer('unsure')),'unsure');
 assert.equal(E.score(t,answer('none')),'revisit');
});
test('revisions preserve immutable first answers and support context',()=>{
 const s=E.fresh();E.update(s,'p1',answer('a'));assert.equal(E.submit(s,'p1','predict'),true);
 const first=JSON.stringify(E.last(s,'p1'));s.lessons[0].seenSteps=[0,1,2,3];s.records.p1.feedbackSeen=true;
 const second=answer('b');second.otherHelp=true;E.update(s,'p1',second);assert.equal(s.records.p1.status,'draft');
 assert.equal(E.submit(s,'p1','predict'),true);
 assert.equal(JSON.stringify(s.records.p1.submissions[0]),first);
 assert.equal(E.last(s,'p1').support.lessonSeen,true);assert.equal(E.last(s,'p1').support.feedbackSeen,true);assert.equal(E.last(s,'p1').support.otherHelp,true);
 assert.equal(E.hydrate(s).records.p1.submissions.length,2);
});
test('completed sessions export twelve distinct observations and revised drafts cannot be called complete',()=>{
 const s=E.fresh();
 for(let i=0;i<4;i++){
  const l=C.LESSONS[i];E.update(s,l.predict.id,answer('unsure'));E.submit(s,l.predict.id,'predict');s.lessons[i].seenSteps=[0,1,2,3];
  for(const t of l.checks){E.update(s,t.id,answer(...t.correct));E.submit(s,t.id,'check');}
  s.lessons[i].reviewed=true;
 }
 s.view='summary';s.lessonIndex=3;s.stage='review';assert.equal(E.allDone(s),true);assert.ok(E.hydrate(s));
 const exported=E.exportRecord(s);assert.equal(Object.keys(exported.records).length,12);assert.ok(exported.taskDefinitions);assert.ok(exported.games);
 E.update(s,'c8',answer('equal'));assert.equal(E.allDone(s),false);assert.throws(()=>E.exportRecord(s));assert.equal(E.hydrate(s),null);
});
test('incompatible, corrupt, and impossible saved states are rejected without mutating the source',()=>{
 const s=E.fresh(),before=JSON.stringify(s);assert.ok(E.hydrate(s));assert.equal(JSON.stringify(s),before);
 for(const patch of [{schema:'old'},{contentVersion:'old'},{stage:'unknown'},{lessonIndex:9},{questionIndex:-1},{view:'summary'},{stage:'review'},{records:{noSuchTask:{}}}])assert.equal(E.hydrate({...s,...patch}),null);
 const duplicates=E.fresh();duplicates.lessons[0].seenSteps=[0,0,0,0];assert.equal(E.hydrate(duplicates),null);
 assert.equal(E.hydrate(null),null);
});

