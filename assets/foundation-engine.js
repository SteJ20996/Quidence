(function(root){
'use strict';
const B=typeof module==='object'&&module.exports?require('./foundation-bank.js'):root.ClueveraFoundationBank;
const SCHEMA='cluevera_foundation_portfolio_v1',clone=v=>JSON.parse(JSON.stringify(v));
const stamp=()=>new Date().toISOString();
let sequence=0;
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
function numeric(value){
 if(typeof value!=='string'&&typeof value!=='number')return null;
 const s=String(value).trim().replace(/−/g,'-');
 if(s.length>80||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return null;
 const parts=s.split('/').map(Number),n=parts.length===1?parts[0]:parts[0]/parts[1];
 return Number.isFinite(n)?n:null;
}
function fresh(){return{schema:SCHEMA,bankVersion:B.VERSION,modules:Object.fromEntries(Object.keys(B.MODULES).map(id=>[id,{active:null,sessions:[]}]))};}
function session(portfolio,module){const m=portfolio.modules[module];return m?.sessions.find(s=>s.id===m.active)||null;}
function createSession(portfolio,module){
 if(!B.MODULES[module])throw Error('Unknown subject');
 const s={id:stamp()+'-'+(++sequence)+'-'+Math.random().toString(36).slice(2,9),module,bankVersion:B.VERSION,createdAt:stamp(),view:'intro',index:0,records:{},events:[]};
 portfolio.modules[module].sessions.push(s);portfolio.modules[module].active=s.id;return s;
}
const tasks=s=>B.MODULES[s.module].tasks;
const task=s=>tasks(s)[s.index];
function blank(t){return{values:Object.fromEntries(t.fields.map(f=>[f.id,f.kind==='multi'?[]:''])),explanation:'',unsure:false,otherHelp:false};}
function record(s,t){return s.records[t.id]||(s.records[t.id]={draft:blank(t),status:'draft',submissions:[],reviews:[]});}
function edit(s,t,answer){const r=record(s,t);r.draft=clone(answer);r.status='draft';}
function validDraft(t,a){
 if(!object(a)||!object(a.values)||typeof a.explanation!=='string'||a.explanation.length>3000||typeof a.unsure!=='boolean'||typeof a.otherHelp!=='boolean')return false;
 if(Object.keys(a.values).some(k=>!t.fields.some(f=>f.id===k)))return false;
 return t.fields.every(f=>{const v=a.values[f.id];return f.kind==='multi'?Array.isArray(v)&&v.every(x=>typeof x==='string'&&f.options.some(o=>o.value===x))&&new Set(v).size===v.length:typeof v==='string'&&v.length<=80&&(f.kind==='number'||v===''||f.options.some(o=>o.value===v));});
}
function validate(t,a){
 if(!validDraft(t,a))return'An answer could not be read. Please check the fields.';
 if(!a.explanation.trim())return'Add your reasoning, a calculation, or where you got stuck before saving.';
 if(a.unsure)return'';
 for(const f of t.fields){const v=a.values[f.id];if(f.kind==='number'&&numeric(v)===null)return'Enter a number, decimal, or fraction for '+f.label+'.';if(f.kind==='choice'&&!v)return'Choose an answer for '+f.label+'.';if(f.kind==='multi'&&!v.length)return'Select at least one answer for '+f.label+'.';}
 return'';
}
function evaluate(t,a){
 if(a.unsure)return{state:'unsure',parts:{}};
 const parts={};for(const f of t.fields){const v=a.values[f.id],n=f.kind==='number'?numeric(v):null;parts[f.id]=f.kind==='number'?n!==null&&Math.abs(n-f.answer)<=1e-8*Math.max(1,Math.abs(f.answer)):f.kind==='multi'?JSON.stringify([...v].sort())===JSON.stringify([...f.answer].sort()):v===f.answer;}
 return{state:Object.values(parts).every(Boolean)?'matched':'recheck',parts};
}
function submit(s,t){
 const r=record(s,t),error=validate(t,r.draft);if(error)return{ok:false,error};
 const submission={at:stamp(),answer:clone(r.draft),objective:evaluate(t,r.draft),feedbackSeen:s.events.some(e=>e.type==='report_opened'),taskVersion:B.VERSION};
 r.submissions.push(submission);r.status='submitted';s.events.push({type:'answer_saved',at:stamp(),task:t.id,submission:r.submissions.length});return{ok:true};
}
function last(s,t){return s.records[t.id]?.status==='submitted'?s.records[t.id].submissions.at(-1):null;}
function done(s){return tasks(s).every(t=>!!last(s,t));}
function review(s,t,points,note){
 const r=s.records[t.id];if(!r||!last(s,t)||![null,0,1,2].includes(points)||typeof note!=='string'||!note.trim()||note.length>2000)return false;
 r.reviews.push({submission:r.submissions.length,points,note:note.trim(),at:stamp()});return true;
}
function latestReview(s,t){const r=s.records[t.id];return r?.reviews.filter(x=>x.submission===r.submissions.length).at(-1)||null;}
function observations(s){return tasks(s).map(t=>{const r=s.records[t.id],a=last(s,t);return{id:t.id,group:t.groupName,title:t.title,status:a?a.objective.state:'missing',parts:a?.objective.parts||{},explanation:a?.answer.explanation||r?.draft.explanation||'',explanationReview:a?latestReview(s,t):null,otherHelp:a?.answer.otherHelp||false,attempts:r?.submissions.length||0,next:t.next};});}
function portable(s){return{product:'Cluevera',kind:'foundation-check',schema:SCHEMA,bankVersion:B.VERSION,exportedAt:stamp(),scope:B.MODULES[s.module].scope,subject:B.MODULES[s.module].title,session:clone(s),taskDefinitions:clone(tasks(s)),observations:observations(s),interpretation:'Objective answer components are checked with fixed mathematics. Explanations require human or AI-tutor review. These observations do not establish mastery, effort, AI use, or a complete course diagnosis.'};}
function answerText(t,a){return t.fields.map(f=>{const v=a?.values[f.id];return f.label+': '+(f.kind==='number'?v||'not entered':f.kind==='multi'?(v||[]).map(x=>f.options.find(o=>o.value===x)?.label||x).join('; ')||'not selected':f.options.find(o=>o.value===v)?.label||'not selected');}).join('\n');}
function markdown(s){
 const module=B.MODULES[s.module];let out='# Cluevera · '+module.title+'\n\nScope: '+module.scope+'\nSession: '+s.id+'\n\n## A useful request for an AI tutor\n\nUse the actual answers and explanations below to suggest one or two learning priorities. Explain which specific responses support each suggestion, and ask a follow-up question when the reasoning is ambiguous. Keep arithmetic errors, conceptual explanations, missing evidence, and reported help distinct. Do not treat this short check as a complete course assessment or infer effort or AI use from it. Start with a short explanation and one changed-number practice question, then adapt to my response.\n\n';
 out+='## Answer and explanation history\n\n';
 for(const t of tasks(s)){
  const r=s.records[t.id];out+='### '+t.title+' · '+t.groupName+'\n\n'+t.prompt+'\n\n';
  if(t.table)out+='Given table: '+JSON.stringify(t.table)+'\n\n';if(t.matrix)out+='Given matrix: '+JSON.stringify(t.matrix)+'\n\n';if(t.visual)out+='Graph/table description: '+t.visual.description+'\n'+(t.visual.kind==='game'?'Payoffs: '+JSON.stringify(t.visual)+'\n':'')+'\n';
  out+='Reasoning prompt: '+t.reason+'\n\n';
  for(const [i,a]of (r?.submissions||[]).entries())out+='Attempt '+(i+1)+' · '+a.objective.state+' · '+a.at+'\n'+(a.answer.unsure?'Student selected “I’m not sure”.\n':'')+answerText(t,a.answer)+'\nStudent explanation: '+a.answer.explanation+'\nOther help reported: '+a.answer.otherHelp+'\nEarlier report viewed: '+a.feedbackSeen+'\n\n';
  if(!r?.submissions.length)out+='No submitted answer.\n\n';else if(r.status==='draft')out+='Current revision is not submitted. Draft explanation: '+r.draft.explanation+'\n\n';
  out+='Reference mathematics: '+t.solution+'\nNext check: '+t.next+'\n';for(const x of r?.reviews||[])out+='Local review of attempt '+x.submission+': '+(x.points===null?'open':x.points+'/2')+' · '+x.note+'\n';out+='\n';
 }
 return out+'These are task observations. All original explanations and earlier attempts remain available for review.\n';
}
function hydrate(value){
 if(!object(value)||value.schema!==SCHEMA||value.bankVersion!==B.VERSION||!object(value.modules)||Object.keys(value.modules).sort().join()!==Object.keys(B.MODULES).sort().join())return null;
 const ids=new Set();
 for(const [module,m]of Object.entries(value.modules)){
  if(!object(m)||!Array.isArray(m.sessions)||!(m.active===null||typeof m.active==='string'))return null;
  if(m.active!==null&&!m.sessions.some(s=>s?.id===m.active))return null;
  for(const s of m.sessions){
   if(!object(s)||typeof s.id!=='string'||ids.has(s.id)||s.module!==module||s.bankVersion!==B.VERSION||!Number.isFinite(Date.parse(s.createdAt))||!['intro','task','report'].includes(s.view)||!Number.isInteger(s.index)||s.index<0||s.index>=B.MODULES[module].tasks.length||!object(s.records)||!Array.isArray(s.events)||s.events.some(e=>!object(e)||typeof e.type!=='string'||!Number.isFinite(Date.parse(e.at))))return null;
   ids.add(s.id);
   for(const [id,r]of Object.entries(s.records)){
    const t=tasks(s).find(t=>t.id===id);
    if(!t||!object(r)||!validDraft(t,r.draft)||!['draft','submitted'].includes(r.status)||!Array.isArray(r.submissions)||!Array.isArray(r.reviews)||r.status==='submitted'&&!r.submissions.length)return null;
    for(const a of r.submissions)if(!object(a)||a.taskVersion!==B.VERSION||validate(t,a.answer)||typeof a.feedbackSeen!=='boolean'||!Number.isFinite(Date.parse(a.at))||JSON.stringify(a.objective)!==JSON.stringify(evaluate(t,a.answer)))return null;
    if(r.status==='submitted'&&JSON.stringify(r.draft)!==JSON.stringify(r.submissions.at(-1).answer))return null;
    if(r.reviews.some(x=>!object(x)||!Number.isInteger(x.submission)||x.submission<1||x.submission>r.submissions.length||![null,0,1,2].includes(x.points)||typeof x.note!=='string'||!x.note.trim()||x.note.length>2000||!Number.isFinite(Date.parse(x.at))))return null;
   }
   if(s.view==='report'&&!done(s))return null;
  }
 }
 return clone(value);
}
const api={SCHEMA,numeric,fresh,session,createSession,tasks,task,blank,record,edit,validate,evaluate,submit,last,done,review,latestReview,observations,portable,answerText,markdown,hydrate};
if(typeof module==='object'&&module.exports)module.exports=api;else root.ClueveraFoundationEngine=api;
})(typeof window==='undefined'?globalThis:window);
