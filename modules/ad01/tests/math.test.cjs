'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/math.js'),C=require('../dist/content.js');
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol,`${a} differs from ${b}`);
test('nearby outputs and point values are different at a hole; jump limits disagree',()=>{
 near(M.limitValue('hole',1),4);
 for(const h of [.1,.01,.001]){near(M.limitValue('hole',1-h),2-h);near(M.limitValue('hole',1+h),2+h);}
 for(const h of [.1,.01,.001]){near(M.limitValue('jump',-h),-1);near(M.limitValue('jump',h),1);}
});
test('square secants equal the algebraic slope 2a+h for positive and negative h',()=>{
 for(const a of [-2,-1,0,.5,2])for(const h of [-1,-.02,.02,1])near(M.secant('square',a,h),2*a+h);
 assert.throws(()=>M.secant('square',0,0));
 assert.equal(M.FUNCTIONS.absolute.derivative(0),null);
 near(M.secant('absolute',0,-.02),-1);near(M.secant('absolute',0,.02),1);
});
test('rectangles converge to 8/3; midpoint, left and right have expected bounds on x²',()=>{
 for(const n of [2,8,64]){
  const left=M.riemann('square',0,2,n,'left'),mid=M.riemann('square',0,2,n,'midpoint'),right=M.riemann('square',0,2,n,'right');
  assert.ok(left.sum<8/3);assert.ok(right.sum>8/3);near(mid.sum,8/3-2/(3*n*n));
  near(mid.rectangles.reduce((s,r)=>s+r.width,0),2);
 }
 assert.ok(Math.abs(M.riemann('square',0,2,64).sum-8/3)<.0002);
 for(const method of ['left','midpoint','right'])assert.ok(Math.abs(M.riemann('square',0,2,64,method).sum-8/3)<Math.abs(M.riemann('square',0,2,8,method).sum-8/3));
 assert.throws(()=>M.riemann('square',0,2,0));assert.throws(()=>M.riemann('square',2,0,4));assert.throws(()=>M.riemann('square',0,2,4,'bad'));
});
test('signed integrals differ from total geometric area; reversed bounds change only integral sign',()=>{
 near(M.integral('linear',-2,2),0);near(M.totalArea('linear',-2,2),4);
 near(M.integral('linear',-2,1),-1.5);near(M.totalArea('linear',-2,1),2.5);
 near(M.integral('square',0,2),8/3);near(M.integral('square',2,0),-8/3);near(M.totalArea('square',2,0),8/3);
 near(M.integral('rate',-1,1),-4/3);near(M.totalArea('rate',-2,2),4);
 for(const n of [2,8,64])near(M.riemann('linear',-2,2,n).sum,0);
});
test('accumulation has the correct orientation and difference quotients approach original heights',()=>{
 near(M.accumulation(1),-2/3);near(M.accumulation(-1),2/3);
 for(const x of [-2,-1,0,1,2]){
  near(M.accumulation(x),x**3/3-x);
  for(const h of [-.5,-.02,.02,.5])near(M.accumulationSecant(x,h),x*x-1+x*h+h*h/3);
  assert.ok(Math.abs(M.accumulationSecant(x,.0001)-(x*x-1))<.0003);
 }
 assert.throws(()=>M.accumulationSecant(0,0));
});
test('new questions have independent mathematical support',()=>{
 const tasks=Object.fromEntries(C.LESSONS.flatMap(l=>[l.predict,...l.checks]).map(t=>[t.id,t]));
 near(2+2,4);assert.deepEqual(tasks.c1.correct,['limit4']);assert.deepEqual(tasks.c2.correct,['none']);
 near(M.FUNCTIONS.cubic.derivative(-1),3);assert.deepEqual(tasks.c3.correct,['3']);
 assert.equal(M.FUNCTIONS.absolute.derivative(0),null);assert.deepEqual(tasks.c4.correct,['none']);
 near(3*4,12);assert.deepEqual(tasks.c5.correct,['12']);assert.deepEqual(tasks.c6.correct,['0and4']);
 near(2*1.5,3);assert.deepEqual(tasks.c7.correct,['3']);
 for(const x of [-.9,0,.9])assert.ok(M.FUNCTIONS.rate.value(x)<0);
 for(const x of [-2,-1.1,1.1,2])assert.ok(M.FUNCTIONS.rate.value(x)>0);
 assert.deepEqual(tasks.c8.correct,['middle']);
});
