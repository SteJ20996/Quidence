(function(root){
'use strict';
function create(C){
const SCHEMA=C.MODULE+'_beta01_session_v1',clone=x=>JSON.parse(JSON.stringify(x));
const tasks=C.LESSONS.flatMap(l=>[l.predict,...l.checks]);
// Earlier wordings of revised questions stay defined, so every answer saved against them still validates and is
// always shown with the wording it answered. A current question names the ids it replaces.
const TASKS=Object.fromEntries(tasks.concat(C.RETIRED||[]).map(t=>[t.id,t]));
// The id of the version of a question that was answered: the current one, or an earlier wording it replaces.
function answered(state,t){return[t.id,...(t.replaces||[])].find(id=>state.records[id]?.status==='submitted')||null;}
// Only presentation is shuffled. Stored choices retain their original content IDs.
function choiceOptions(state,task){
 let seed=2166136261;
 for(const c of C.MODULE+'|'+state.createdAt+'|'+task.id)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 const options=[...task.options];
 const random=()=>{seed=(seed+0x6D2B79F5)>>>0;let n=seed;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;};
 for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
 return options.map((option,i)=>({option,value:'option-'+i})).concat({option:{id:'unsure',label:'I’m not sure yet'},value:'unsure'});
}
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
function lessonDone(state,index){return state.lessons[index].reviewed&&state.lessons[index].seenSteps.length===4&&[C.LESSONS[index].predict,...C.LESSONS[index].checks].every(t=>answered(state,t));}
function allDone(state){return C.LESSONS.every((_,i)=>lessonDone(state,i));}
function last(state,id){return state.records[id]?.submissions.at(-1)||null;}
// A course may append lessons. A record saved under an earlier version whose
// lessons are still the first ones gains empty places for the new lessons;
// its answers, drafts and history are kept exactly, and an event records the change.
// A lab control added to a lesson after a record was saved takes its default value; every saved setting is kept.
function fillLabs(raw){
 if(!raw||!Array.isArray(raw.labs)||raw.labs.length!==C.LESSONS.length)return raw;
 return{...raw,labs:raw.labs.map((lab,i)=>lab&&typeof lab==='object'&&!Array.isArray(lab)?{...clone(C.LESSONS[i].defaults),...lab}:lab)};
}
function upgrade(raw){
 const prior=raw&&(C.PREVIOUS||[]).find(p=>p.version===raw.contentVersion);
 // A version that revised questions without adding lessons: every saved answer stays under the id it was given, and
 // the questions that replace them count it as answered.
 if(prior&&prior.revised&&prior.lessons===C.LESSONS.length&&raw.schema===SCHEMA&&Array.isArray(raw.events)){const next=clone(raw);next.contentVersion=C.VERSION;next.events.push({at:new Date().toISOString(),type:'questions_revised',from:prior.version,to:C.VERSION});return next;}
 if(!prior||prior.lessons>=C.LESSONS.length||raw.schema!==SCHEMA||!Array.isArray(raw.lessons)||raw.lessons.length!==prior.lessons||!Array.isArray(raw.labs)||raw.labs.length!==prior.lessons||!Array.isArray(raw.events))return raw;
 const added=C.LESSONS.slice(prior.lessons),newIds=new Set(added.flatMap(l=>[l.predict.id,...l.checks.map(t=>t.id)]));
 // The earlier version could not hold answers to the new lessons, so such a record is not upgraded and fails validation.
 if(raw.records&&typeof raw.records==='object'&&Object.keys(raw.records).some(id=>newIds.has(id)))return raw;
 // Only a finished record may be on its summary, so an unfinished one stays as it is and fails validation.
 if(raw.view==='summary'&&!C.LESSONS.slice(0,prior.lessons).every((_,i)=>lessonDone(raw,i)))return raw;
 const next=clone(raw);
 next.contentVersion=C.VERSION;
 next.labs=next.labs.concat(added.map(l=>clone(l.defaults)));
 next.lessons=next.lessons.concat(added.map(()=>({seenSteps:[],reviewed:false})));
 // The summary needs every lesson, so a finished record reopens at the course start, and resuming opens the first new lesson.
 if(next.view==='summary')Object.assign(next,{view:'orientation',lessonIndex:prior.lessons,stage:'predict',questionIndex:0});
 next.events.push({at:new Date().toISOString(),type:'lessons_added',from:prior.version,to:C.VERSION,lessons:added.map(l=>l.id)});
 return next;
}
function hydrate(input){
 try{
  const raw=fillLabs(upgrade(input));
  if(!raw||raw.schema!==SCHEMA||raw.contentVersion!==C.VERSION||!validLabs(raw.labs)||!['orientation','lesson','summary'].includes(raw.view)||!['predict','learn','check','review'].includes(raw.stage))return null;
  if(!Number.isInteger(raw.lessonIndex)||raw.lessonIndex<0||raw.lessonIndex>=C.LESSONS.length||!Number.isInteger(raw.questionIndex)||raw.questionIndex<0||raw.questionIndex>1)return null;
  if(!Array.isArray(raw.lessons)||raw.lessons.length!==C.LESSONS.length||!Number.isFinite(Date.parse(raw.createdAt))||!Array.isArray(raw.events)||raw.events.some(e=>!e||typeof e.type!=='string'||!Number.isFinite(Date.parse(e.at)))||!raw.records||typeof raw.records!=='object'||Array.isArray(raw.records))return null;
  if(raw.lessons.some(l=>!l||typeof l.reviewed!=='boolean'||!Array.isArray(l.seenSteps)||new Set(l.seenSteps).size!==l.seenSteps.length||l.seenSteps.some(s=>!Number.isInteger(s)||s<0||s>3)))return null;
  // Step predictions are optional: four entries, each empty or a saved prediction of up to 500 characters.
  if(raw.lessons.some(l=>l.stepPredictions!==undefined&&!(Array.isArray(l.stepPredictions)&&l.stepPredictions.length===4&&l.stepPredictions.every(p=>p===null||p&&typeof p==='object'&&typeof p.text==='string'&&p.text.length<=500&&typeof p.unsure==='boolean'&&p.unsure===!p.text&&Number.isFinite(Date.parse(p.at))))))return null;
  for(const [id,r] of Object.entries(raw.records)){
   if(!TASKS[id]||!r||!['draft','submitted'].includes(r.status)||typeof r.feedbackSeen!=='boolean'||!Array.isArray(r.submissions)||!draftValid(TASKS[id],r.draft))return null;
   for(const s of r.submissions)if(!s||!valid(TASKS[id],s.answer)||s.result!==score(TASKS[id],s.answer)||!Number.isFinite(Date.parse(s.at))||!s.support||!['predict','check'].includes(s.support.phase)||typeof s.support.feedbackSeen!=='boolean'||typeof s.support.lessonSeen!=='boolean'||s.support.otherHelp!==s.answer.otherHelp)return null;
   if(r.status==='submitted'&&(!r.submissions.length||!valid(TASKS[id],r.draft)||JSON.stringify(r.draft)!==JSON.stringify(r.submissions.at(-1).answer)))return null;
  }
  const lesson=C.LESSONS[raw.lessonIndex];
  if(raw.stage!=='predict'&&!answered(raw,lesson.predict))return null;
  if(['check','review'].includes(raw.stage)&&raw.lessons[raw.lessonIndex].seenSteps.length!==4)return null;
  if(raw.stage==='review'&&!lesson.checks.every(t=>answered(raw,t)))return null;
  if(raw.view==='summary'&&!allDone(raw))return null;
  return clone(raw);
 }catch{return null;}
}
function exportRecord(state){
 if(!allDone(state))throw new Error('Finish all '+C.LESSONS.length+' lessons before exporting the complete report.');
 return{...clone(state),taskDefinitions:clone(C.LESSONS),retiredTaskDefinitions:clone(C.RETIRED||[]),note:'Initial predictions and checks after instruction are separate observations. Revisions and help remain in history. Required explanations need human review; fixed choices alone do not establish understanding. No validated mastery, behavior, effort, or AI-use inference.'};
}
const api={SCHEMA,TASKS,answered,choiceOptions,defaultLabs,validLabs,valid,score,fresh,record,update,submit,log,lessonDone,allDone,last,upgrade,hydrate,exportRecord};
return api;
}
if(typeof module==='object'&&module.exports)module.exports={create};else root.QuidenceCourseEngine=create(root.QuidenceCourseContent);
})(typeof window==='undefined'?globalThis:window);

