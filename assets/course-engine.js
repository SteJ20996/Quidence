(function(root){
'use strict';
function create(C){
const SCHEMA=C.MODULE+'_beta01_session_v1',clone=x=>JSON.parse(JSON.stringify(x));
const tasks=C.LESSONS.flatMap(l=>[l.predict,...l.checks]);
const TASKS=Object.fromEntries(tasks.map(t=>[t.id,t]));
function defaultLabs(){return C.LESSONS.map(l=>clone(l.defaults));}
function validLabs(labs){
 if(!Array.isArray(labs)||labs.length!==C.LESSONS.length)return false;
 return labs.every((lab,i)=>lab&&typeof lab==='object'&&!Array.isArray(lab)&&Object.keys(lab).sort().join()===Object.keys(C.LESSONS[i].defaults).sort().join()&&C.LESSONS[i].controls.every(c=>c.options?c.options.some(([v])=>v===lab[c.name]):Number.isFinite(lab[c.name])&&lab[c.name]>=c.min&&lab[c.name]<=c.max));
}
function draftValid(task,a){
 if(!a||!Array.isArray(a.choices)||typeof a.explanation!=='string'||a.explanation.length>3000||typeof a.otherHelp!=='boolean')return false;
 const allowed=task.options.map(o=>o.id).concat('unsure');return new Set(a.choices).size===a.choices.length&&a.choices.every(x=>allowed.includes(x))&&a.choices.length<=1;
}
function valid(task,answer){
 if(!answer||!Array.isArray(answer.choices)||typeof answer.explanation!=='string'||typeof answer.otherHelp!=='boolean'||!answer.explanation.trim()||answer.explanation.length>3000)return false;
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
function lessonDone(state,index){return state.lessons[index].reviewed&&state.lessons[index].seenSteps.length===4&&[C.LESSONS[index].predict,...C.LESSONS[index].checks].every(t=>state.records[t.id]?.status==='submitted');}
function allDone(state){return C.LESSONS.every((_,i)=>lessonDone(state,i));}
function last(state,id){return state.records[id]?.submissions.at(-1)||null;}
function hydrate(raw){
 try{
  if(!raw||raw.schema!==SCHEMA||raw.contentVersion!==C.VERSION||!validLabs(raw.labs)||!['orientation','lesson','summary'].includes(raw.view)||!['predict','learn','check','review'].includes(raw.stage))return null;
  if(!Number.isInteger(raw.lessonIndex)||raw.lessonIndex<0||raw.lessonIndex>=C.LESSONS.length||!Number.isInteger(raw.questionIndex)||raw.questionIndex<0||raw.questionIndex>1)return null;
  if(!Array.isArray(raw.lessons)||raw.lessons.length!==C.LESSONS.length||!Number.isFinite(Date.parse(raw.createdAt))||!Array.isArray(raw.events)||raw.events.some(e=>!e||typeof e.type!=='string'||!Number.isFinite(Date.parse(e.at)))||!raw.records||typeof raw.records!=='object'||Array.isArray(raw.records))return null;
  if(raw.lessons.some(l=>!l||typeof l.reviewed!=='boolean'||!Array.isArray(l.seenSteps)||new Set(l.seenSteps).size!==l.seenSteps.length||l.seenSteps.some(s=>!Number.isInteger(s)||s<0||s>3)))return null;
  for(const [id,r] of Object.entries(raw.records)){
   if(!TASKS[id]||!r||!['draft','submitted'].includes(r.status)||typeof r.feedbackSeen!=='boolean'||!Array.isArray(r.submissions)||!draftValid(TASKS[id],r.draft))return null;
   for(const s of r.submissions)if(!s||!valid(TASKS[id],s.answer)||s.result!==score(TASKS[id],s.answer)||!Number.isFinite(Date.parse(s.at))||!s.support||!['predict','check'].includes(s.support.phase)||typeof s.support.feedbackSeen!=='boolean'||typeof s.support.lessonSeen!=='boolean'||s.support.otherHelp!==s.answer.otherHelp)return null;
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
 return{...clone(state),taskDefinitions:clone(C.LESSONS),note:'Initial predictions and checks after instruction are separate observations. Revisions and help remain in history. Required explanations need human review; fixed choices alone do not establish understanding. No validated mastery, behavior, effort, or AI-use inference.'};
}
const api={SCHEMA,TASKS,defaultLabs,validLabs,valid,score,fresh,record,update,submit,log,lessonDone,allDone,last,hydrate,exportRecord};
return api;
}
if(typeof module==='object'&&module.exports)module.exports={create};else root.ClueveraCourseEngine=create(root.ClueveraCourseContent);
})(typeof window==='undefined'?globalThis:window);

