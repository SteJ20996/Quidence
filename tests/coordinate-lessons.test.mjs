import {test} from 'node:test';import assert from 'node:assert/strict';
import {LESSONS,LESSON_UI,checkLesson,lineEquation,circleEquation,lessonModel,startPoints,root} from '../courses/coordinate-geometry/lessons.mjs';
import {LESSON_IDS,newState,validState,numberValue,learningNotes} from '../courses/coordinate-geometry/core.mjs';
test('four lessons have English and Spanish text only and match the saved lesson ids',()=>{
 assert.deepEqual(LESSONS.map(l=>l.id),LESSON_IDS);let n=0;
 const visit=o=>{if(!o||typeof o!=='object')return;if(Object.hasOwn(o,'en')){for(const l of ['en','es'])assert.ok(typeof o[l]==='string'&&o[l].trim(),o.en+' '+l);assert.deepEqual(Object.keys(o).sort(),['en','es'],o.en);n++;}else for(const v of Object.values(o))visit(v);};
 visit(LESSONS);visit(LESSON_UI);assert.equal(n,LESSONS.reduce((s,l)=>s+7+l.check.length,0)+Object.keys(LESSON_UI).length);
 for(const l of LESSONS){assert.equal(l.text.length,2);assert.ok(l.check.length>=2&&l.check.length<=3);assert.equal(new Set(l.check.map(([id])=>id)).size,l.check.length);}
});
test('quick-check answers agree with separately computed coordinate arithmetic',()=>{
 // Each value is recomputed from the coordinates named in the question.
 const expected={changes:{dx:4-(-2),dy:-1-3},distance:{d1:Math.hypot(4-1,5-1),d2:Math.hypot(3-(-2),11-(-1))},midpoint:{mx:(-3+5)/2,my:(2+6)/2,m:(6-2)/(5-(-3))},equations:{on:3**2+4**2===25?'yes':'no',y:2*3+1,circle:(6-2)**2+(2+1)**2===25?'yes':'no'}};
 for(const [i,l]of LESSONS.entries()){
  for(const [id,,answer]of l.check)assert.equal(answer,expected[l.id][id],l.id+' '+id);
  const right=Object.fromEntries(l.check.map(([id,,a])=>[id,String(a)]));assert.ok(Object.values(checkLesson(i,right,numberValue)).every(s=>s==='match'),l.id);
 }
 assert.deepEqual(checkLesson(0,{dx:'6',dy:'−4'},numberValue),{dx:'match',dy:'match'});
 assert.deepEqual(checkLesson(2,{mx:'1',my:'4',m:'1/2'},numberValue),{mx:'match',my:'match',m:'match'});
 assert.deepEqual(checkLesson(0,{dx:'4',dy:''},numberValue),{dx:'mismatch',dy:'blank'});
 assert.equal(checkLesson(1,{d1:'five'},numberValue).d1,'unreadable');
 assert.equal(checkLesson(3,{on:'no'},numberValue).on,'mismatch');
});
test('graph readouts use exact equations and never show NaN',()=>{
 assert.equal(lineEquation({x:-4,y:-3},{x:2,y:1}).text,'y = (2/3)x − 1/3');assert.equal(lineEquation({x:0,y:3},{x:2,y:0}).text,'y = (−3/2)x + 3');
 assert.equal(lineEquation({x:1,y:2},{x:3,y:2}).text,'y = 2');assert.equal(lineEquation({x:2,y:-1},{x:2,y:5}).text,'x = 2');assert.equal(lineEquation({x:0,y:0},{x:1,y:1}).text,'y = x');
 assert.ok(lineEquation({x:0,y:1},{x:1,y:3}).test({x:3,y:7}));assert.ok(!lineEquation({x:0,y:1},{x:1,y:3}).test({x:3,y:6}));
 assert.equal(circleEquation({x:2,y:-1},25),'(x − 2)² + (y + 1)² = 25');assert.equal(root(25),'5');assert.equal(root(52),'√52 ≈ 7.21');
 for(const lang of ['en','es'])for(let i=0;i<4;i++)for(const mode of i<3?[null]:['line','circle']){
  const pts=i<3?startPoints(i):startPoints(3)[mode],m=lessonModel(i,mode,lang),rows=m.read(pts);
  assert.ok(rows.length>=3);assert.doesNotMatch(JSON.stringify(rows)+JSON.stringify(m.status?.(pts)||''),/NaN|undefined|\{[a-z]+\}/);
 }
});
test('lesson answers are optional in saved records and appear in the notebook export',()=>{
 const old=newState();assert.ok(validState(JSON.parse(JSON.stringify(old))),'a record saved before the lessons existed');
 const withLessons={...old,lessons:{answers:{changes:{dx:'6',dy:'−4'}},checked:{changes:true}}};assert.ok(validState(JSON.parse(JSON.stringify(withLessons))));
 for(const bad of [{answers:{other:{}},checked:{}},{answers:{changes:{dx:6}},checked:{}},{answers:{},checked:{changes:'yes'}},[]])assert.equal(validState({...old,lessons:bad}),false);
 // Older pages only list home, project and notebook views, so a lesson never becomes the saved view.
 assert.ok(['home','project','notebook'].includes(withLessons.view));
 const notes=learningNotes(withLessons);assert.match(notes,/## Lesson quick checks/);assert.match(notes,/changes: checked; answers \{"dx":"6","dy":"−4"\}/);assert.match(notes,/equations: not checked/);
});
