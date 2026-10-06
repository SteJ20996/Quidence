(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./content.js'):root.AC01Content;
const SCHEMA='ac01_beta01_session_v1',clone=x=>JSON.parse(JSON.stringify(x));
const tasks=C.LESSONS.flatMap(l=>[l.predict,...l.checks]);
const TASKS=Object.fromEntries(tasks.map(t=>[t.id,t]));
function bestResponses(game,player,other){
 const choices=player===0?game.rows:game.cols;
 const values=choices.map((_,i)=>player===0?game.payoffs[i][other][0]:game.payoffs[other][i][1]);
 const max=Math.max(...values);return values.flatMap((v,i)=>v===max?[i]:[]);
}
function dominant(game,player){
 const count=player===0?game.rows.length:game.cols.length,otherCount=player===0?game.cols.length:game.rows.length;
 return Array.from({length:count},(_,i)=>i).filter(i=>Array.from({length:otherCount},(_,j)=>j).every(j=>{
  const br=bestResponses(game,player,j);return br.length===1&&br[0]===i;
 }));
}
function deviation(game,row,col,player){
 const before=game.payoffs[row][col][player],r=player===0?1-row:row,c=player===1?1-col:col;
 const after=game.payoffs[r][c][player];return{before,after,gain:after-before,row:r,col:c};
}
function equilibria(game){
 const out=[];game.rows.forEach((_,r)=>game.cols.forEach((_,c)=>{if(bestResponses(game,0,c).includes(r)&&bestResponses(game,1,r).includes(c))out.push([r,c]);}));return out;
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
function fresh(){return{schema:SCHEMA,contentVersion:C.VERSION,createdAt:new Date().toISOString(),view:'orientation',lessonIndex:0,stage:'predict',questionIndex:0,records:{},lessons:C.LESSONS.map(()=>({seenSteps:[],reviewed:false})),events:[]};}
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
function hydrate(raw){
 try{
  if(!raw||raw.schema!==SCHEMA||raw.contentVersion!==C.VERSION||!['orientation','lesson','summary'].includes(raw.view)||!['predict','learn','check','review'].includes(raw.stage))return null;
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
 return{...clone(state),taskDefinitions:clone(C.LESSONS),games:clone(C.GAMES),note:'Initial predictions and checks after instruction are separate observations. Revisions and help remain in history. Optional explanations need human review. No validated mastery, behavior, effort, or AI-use inference.'};
}
const api={SCHEMA,TASKS,bestResponses,dominant,deviation,equilibria,valid,score,fresh,record,update,submit,log,lessonDone,allDone,last,hydrate,exportRecord};
if(typeof module==='object'&&module.exports)module.exports=api;else root.AC01Engine=api;
})(typeof window==='undefined'?globalThis:window);

