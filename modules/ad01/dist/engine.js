(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./content.js'):root.AD01Content;
const SCHEMA='ad01_beta01_session_v1',clone=x=>JSON.parse(JSON.stringify(x));
const tasks=C.LESSONS.flatMap(l=>[l.predict,...l.checks]);
const TASKS=Object.fromEntries(tasks.map(t=>[t.id,t]));
function defaultLabs(){return[
 {kind:'hole',exponent:-.6,side:1,showBand:false,band:-1,digits:3},
 {kind:'square',a:1,h:.5,side:1,showDerivative:false},
 {kind:'square',b:2,n:8,method:'midpoint'},
 {x:.5,h:.5,side:1},
 {kind:'family',c:1,fn:'inverse-square',e:1}
];}
function validLabs(labs){
 const range=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b;
 if(!Array.isArray(labs)||labs.length!==5||labs.some(l=>!l||typeof l!=='object'))return false;
 const [a,b,c,d,e]=labs;
 return ['hole','jump','wiggle','nines'].includes(a.kind)&&range(a.exponent,-2.3,-.3)&&[-1,1].includes(a.side)&&typeof a.showBand==='boolean'&&range(a.band,-3,0)&&Number.isInteger(a.digits)&&a.digits>=1&&a.digits<=12
  &&['square','absolute'].includes(b.kind)&&range(b.a,-2,2)&&range(b.h,.001,1)&&[-1,1].includes(b.side)&&typeof b.showDerivative==='boolean'
  &&['square','linear'].includes(c.kind)&&range(c.b,.25,2)&&Number.isInteger(c.n)&&c.n>=2&&c.n<=64&&['left','midpoint','right'].includes(c.method)
  &&range(d.x,-2,2)&&range(d.h,.02,1)&&[-1,1].includes(d.side)
  &&['family','tail'].includes(e.kind)&&range(e.c,-2,2)&&['inverse-square','inverse'].includes(e.fn)&&range(e.e,0,3);
}
function valid(task,answer){
 if(!answer||!Array.isArray(answer.choices)||typeof answer.explanation!=='string'||typeof answer.otherHelp!=='boolean')return false;
 const a=answer.choices,allowed=task.options.map(o=>o.id).concat('unsure');
 if(!a.length||new Set(a).size!==a.length||a.some(x=>!allowed.includes(x)))return false;
 if(a.includes('unsure'))return a.length===1;
 if(a.includes('none'))return a.length===1;
 return !!task.multi||a.length===1;
}
function score(task,answer){
 if(!valid(task,answer))return null;
 if(answer.choices[0]==='unsure')return 'unsure';
 const a=[...answer.choices].sort(),b=[...task.correct].sort();return JSON.stringify(a)===JSON.stringify(b)?'correct':'revisit';
}
function fresh(){return{schema:SCHEMA,contentVersion:C.VERSION,createdAt:new Date().toISOString(),view:'orientation',lessonIndex:0,stage:'predict',questionIndex:0,records:{},labs:defaultLabs(),lessons:C.LESSONS.map(()=>({seenSteps:[],reviewed:false})),events:[]};}
function record(state,id){
 if(!TASKS[id])throw new Error('Unknown task');
 if(!state.records[id])state.records[id]={draft:{choices:[],explanation:'',otherHelp:false},status:'draft',feedbackSeen:false,submissions:[]};
 return state.records[id];
}
function log(state,type,data={}){state.events.push({at:new Date().toISOString(),type,...data});}
function update(state,id,answer){const r=record(state,id);r.draft=clone(answer);r.status='draft';log(state,'answer_edited',{taskId:id});}
function submit(state,id,phase){
 const t=TASKS[id],r=record(state,id);if(!valid(t,r.draft))return false;
 const li=C.LESSONS.findIndex(l=>l.predict.id===id||l.checks.some(x=>x.id===id));
 const entry={at:new Date().toISOString(),answer:clone(r.draft),result:score(t,r.draft),support:{phase,lessonSeen:state.lessons[li].seenSteps.length>0,feedbackSeen:r.feedbackSeen,otherHelp:r.draft.otherHelp}};
 r.submissions.push(entry);r.status='submitted';log(state,'answer_submitted',{taskId:id,submission:r.submissions.length});return true;
}
function lessonDone(state,index){return state.lessons[index].reviewed&&C.LESSONS[index].checks.every(t=>state.records[t.id]?.status==='submitted');}
function allDone(state){return C.LESSONS.every((_,i)=>lessonDone(state,i));}
function last(state,id){return state.records[id]?.submissions.at(-1)||null;}
// A record saved with the four-lesson course (ad01-beta-0.1) opens with the fifth lesson added. Its answers, drafts,
// submissions and events are kept exactly; a record that was on the summary page opens at the new lesson instead.
function upgrade(raw){
 if(!raw||raw.schema!==SCHEMA||raw.contentVersion!=='ad01-beta-0.1'||!Array.isArray(raw.lessons)||raw.lessons.length!==4||!Array.isArray(raw.labs)||raw.labs.length!==4||!Array.isArray(raw.events))return raw;
 const next=clone(raw);next.contentVersion=C.VERSION;next.lessons.push({seenSteps:[],reviewed:false});next.labs.push(defaultLabs()[4]);
 // Lesson 1's lab gained the error band and the 0.999… example; earlier settings keep their values.
 if(next.labs[0]&&typeof next.labs[0]==='object')next.labs[0]={...defaultLabs()[0],...next.labs[0]};
 if(next.view==='summary'){next.view='lesson';next.lessonIndex=4;next.stage='predict';next.questionIndex=0;}
 next.events.push({at:new Date().toISOString(),type:'content_upgraded',from:'ad01-beta-0.1',to:C.VERSION});
 return next;
}
function hydrate(raw){
 try{
  raw=upgrade(raw);
  if(!raw||raw.schema!==SCHEMA||raw.contentVersion!==C.VERSION||!validLabs(raw.labs)||!['orientation','lesson','summary'].includes(raw.view)||!['predict','learn','check','review'].includes(raw.stage))return null;
  if(!Number.isInteger(raw.lessonIndex)||raw.lessonIndex<0||raw.lessonIndex>=C.LESSONS.length||!Number.isInteger(raw.questionIndex)||raw.questionIndex<0||raw.questionIndex>1)return null;
  if(!Array.isArray(raw.lessons)||raw.lessons.length!==C.LESSONS.length||!Array.isArray(raw.events)||!raw.records||typeof raw.records!=='object'||Array.isArray(raw.records))return null;
  if(raw.lessons.some(l=>!l||typeof l.reviewed!=='boolean'||!Array.isArray(l.seenSteps)||new Set(l.seenSteps).size!==l.seenSteps.length||l.seenSteps.some(s=>!Number.isInteger(s)||s<0||s>3)))return null;
  for(const [id,r] of Object.entries(raw.records)){
   if(!TASKS[id]||!r||!['draft','submitted'].includes(r.status)||typeof r.feedbackSeen!=='boolean'||!Array.isArray(r.submissions)||!r.draft||!Array.isArray(r.draft.choices)||typeof r.draft.explanation!=='string'||typeof r.draft.otherHelp!=='boolean')return null;
   for(const s of r.submissions)if(!s||!valid(TASKS[id],s.answer)||s.result!==score(TASKS[id],s.answer)||!s.support||typeof s.support.feedbackSeen!=='boolean'||typeof s.support.lessonSeen!=='boolean')return null;
   if(r.status==='submitted'&&(!r.submissions.length||!valid(TASKS[id],r.draft)||JSON.stringify(r.draft)!==JSON.stringify(r.submissions.at(-1).answer)))return null;
  }
  const lesson=C.LESSONS[raw.lessonIndex];
  if(raw.stage!=='predict'&&raw.records[lesson.predict.id]?.status!=='submitted')return null;
  if(['check','review'].includes(raw.stage)&&raw.lessons[raw.lessonIndex].seenSteps.length!==4)return null;
  if(raw.stage==='review'&&!lesson.checks.every(t=>raw.records[t.id]?.status==='submitted'))return null;
  if(raw.view==='summary'&&!allDone(raw))return null;
  return clone(raw);
 }catch{return null;}
}
function exportRecord(state){
 if(!allDone(state))throw new Error('Finish all four lessons before exporting the complete report.');
 return{...clone(state),taskDefinitions:clone(C.LESSONS),note:'Initial predictions and checks after instruction are separate observations. Revisions and help remain in history. Optional explanations need human review. No validated mastery, behavior, effort, or AI-use inference.'};
}
const api={SCHEMA,TASKS,defaultLabs,validLabs,valid,score,fresh,record,update,submit,log,lessonDone,allDone,last,hydrate,exportRecord};
if(typeof module==='object'&&module.exports)module.exports=api;else root.AD01Engine=api;
})(typeof window==='undefined'?globalThis:window);
