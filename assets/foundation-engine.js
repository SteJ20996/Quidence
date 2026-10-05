(function(root){
'use strict';
const B=typeof module==='object'&&module.exports?require('./foundation-bank.js'):root.ClueveraFoundationBank;
const X=typeof module==='object'&&module.exports?require('./foundation-extension.js'):root.ClueveraFoundationExtension;
const SCHEMA='cluevera_foundation_portfolio_v1',clone=v=>JSON.parse(JSON.stringify(v));
const UNCHECKED={
 aa01:['Multiplication and division of rational numbers; powers and roots','Equations with variables on both sides, no solution, or infinitely many solutions','Inequality steps involving multiplication or division by a negative number','General systems of equations, function domains, and quadratic equations'],
 ab01:['Matrix composition and multiplication order','Elimination and systems with no solution or infinitely many solutions','Nullspace, rank, basis, dimension, and inverse matrices','Dot products, orthogonality, projections, determinants, and eigenvectors'],
 ac01:['Constructing a payoff model from a story and stating its assumptions','Expected payoffs and mixed strategies','Sequential decisions, backward induction, and credible threats','Repeated games and incomplete information'],
 ad01:['Constructing a difference quotient and derivative without a supplied slope','Product, quotient, chain, implicit, and inverse-function differentiation rules','Antiderivatives, integration constants, and finding definite integrals analytically','Function analysis, optimization, differential equations, and wider integration applications']
};
const CONDITIONS={
 aa01:[{task:'aa-f12',note:'The graph description supplies the horizontal and vertical moves. This checks converting directions to coordinates; independent graph reading needs a new task.'}],
 ab01:[{task:'ab-f12',note:'The reasoning prompt supplies the zero-vector test. It checks applying this necessary condition to a translation, not independently choosing a test or proving an arbitrary map linear.'}],
 ac01:[{task:'ac-f08',note:'The comparison pattern is stated in the question. This checks interpreting that pattern; identifying dominance independently needs a new table.'}],
 ad01:[{task:'ad-f05',note:'The tangent slope is supplied. This checks the meaning of derivative notation, not calculating a tangent slope independently.'},{task:'ad-f11',note:'The rectangle sums and exact integral are supplied. This checks comparing errors, not constructing a rectangle sum independently.'}]
};
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
function createSession(portfolio,module,check='entry'){
 if(!B.MODULES[module])throw Error('Unknown subject');
 if(!['entry','followup'].includes(check))throw Error('Unknown check');
 const s={id:stamp()+'-'+(++sequence)+'-'+Math.random().toString(36).slice(2,9),module,bankVersion:check==='followup'?X.VERSION:B.VERSION,createdAt:stamp(),view:'intro',index:0,records:{},events:[]};
 if(check==='followup')s.check=check;
 portfolio.modules[module].sessions.push(s);portfolio.modules[module].active=s.id;return s;
}
const definition=s=>s.bankVersion===X.VERSION?X.MODULES[s.module]:B.MODULES[s.module];
const tasks=s=>definition(s).tasks;
const checkName=s=>s.bankVersion===X.VERSION?'Further foundation check':'Entry foundation check';
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
 const submission={at:stamp(),answer:clone(r.draft),objective:evaluate(t,r.draft),feedbackSeen:s.events.some(e=>e.type==='report_opened'),taskVersion:s.bankVersion};
 r.submissions.push(submission);r.status='submitted';s.events.push({type:'answer_saved',at:stamp(),task:t.id,submission:r.submissions.length});return{ok:true};
}
function last(s,t){return s.records[t.id]?.status==='submitted'?s.records[t.id].submissions.at(-1):null;}
function done(s){return tasks(s).every(t=>!!last(s,t));}
function review(s,t,points,note){
 const r=s.records[t.id];if(!r||!last(s,t)||![null,0,1,2].includes(points)||typeof note!=='string'||!note.trim()||note.length>2000)return false;
 r.reviews.push({submission:r.submissions.length,points,note:note.trim(),at:stamp()});return true;
}
function latestReview(s,t){const r=s.records[t.id];return r?.reviews.filter(x=>x.submission===r.submissions.length).at(-1)||null;}
function componentChecks(t,a){return t.fields.map(f=>{
 const state=!a?'missing':a.answer.unsure?'unsure':a.objective.parts[f.id]?'matched':'recheck';
 const result={id:f.id,label:f.label,state};
 if(a&&!a.answer.unsure&&f.kind==='multi'){const selected=a.answer.values[f.id];result.selection={correct:selected.filter(v=>f.answer.includes(v)).map(v=>f.options.find(o=>o.value===v).label),extra:selected.filter(v=>!f.answer.includes(v)).map(v=>f.options.find(o=>o.value===v).label),missing:f.answer.filter(v=>!selected.includes(v)).map(v=>f.options.find(o=>o.value===v).label)};}
 return result;
});}
function observations(s){return tasks(s).map(t=>{const r=s.records[t.id],a=last(s,t);return{id:t.id,group:t.groupName,title:t.title,status:a?a.objective.state:'missing',parts:a?.objective.parts||{},components:componentChecks(t,a),explanation:a?.answer.explanation||r?.draft.explanation||'',explanationReview:a?latestReview(s,t):null,otherHelp:a?.answer.otherHelp||false,attempts:r?.submissions.length||0,next:t.next};});}
const FOLLOWUP_UNCHECKED={
 aa01:['Powers and roots, general systems, function domains, and quadratic equations','Independent graphical construction and wider fraction, percentage, and equation transfer'],
 ab01:['General elimination algorithms, formal basis/dimension/rank, and inverse matrix construction','Dot products, orthogonality, projections, determinants, and eigenvectors','A complete proof of linearity for an arbitrary map'],
 ac01:['Expected payoffs and mixed strategies','Sequential decisions, backward induction, repeated games, and incomplete information','Larger action spaces and independent construction of a complete payoff model'],
 ad01:['General differentiation rules and wider limit techniques','Function analysis, optimization, differential equations, and wider integration applications','Exact derivatives inferred from finite data alone']
};
function scopeReview(s){const further=s.bankVersion===X.VERSION;return{scope:B.MODULES[s.module].scope,groups:[...definition(s).groups],notChecked:[...(further?FOLLOWUP_UNCHECKED:UNCHECKED)[s.module]],suppliedInformation:further?[]:clone(CONDITIONS[s.module]),interpretation:'These limits describe this '+tasks(s).length+'-question '+(further?'further':'entry')+' check. Other lessons and projects may provide additional evidence. Completion and matching components do not establish complete subject mastery.'};}
function evidenceSummary(s){const obs=observations(s),parts=obs.flatMap(o=>o.components);return{matched:parts.filter(x=>x.state==='matched').length,recheck:parts.filter(x=>x.state==='recheck').length,unsure:parts.filter(x=>x.state==='unsure').length,missing:parts.filter(x=>x.state==='missing').length,explanations:{open:obs.filter(o=>!o.explanationReview||o.explanationReview.points===null).length,revise:obs.filter(o=>o.explanationReview?.points===0).length,partial:obs.filter(o=>o.explanationReview?.points===1).length,connected:obs.filter(o=>o.explanationReview?.points===2).length}};}
function nextChecks(s){return observations(s).flatMap(o=>{
 const a=last(s,tasks(s).find(t=>t.id===o.id)),reasons=[];
 if(o.status==='recheck')reasons.push('Some number or choice components need another check.');
 if(o.status==='unsure')reasons.push('You marked this answer as uncertain.');
 if(o.explanationReview?.points===0)reasons.push('The local explanation review asks for a revised reason.');
 if(o.explanationReview?.points===1)reasons.push('The local explanation review confirms part of the connection; check the remaining part.');
 if(a?.answer.otherHelp)reasons.push('Other help was reported. Use a new question if you want to check independent use.');
 if(a?.feedbackSeen)reasons.push('This response was saved after a report was opened. Use a new question to check transfer.');
 else if(o.attempts>1)reasons.push('Earlier attempts are available. Review what changed and try a new question.');
 return reasons.length?[{...o,followupReasons:reasons}]:[];
});}
function portable(s){return{product:'Cluevera',kind:'foundation-check',check:checkName(s),schema:SCHEMA,bankVersion:s.bankVersion,exportedAt:stamp(),scope:B.MODULES[s.module].scope,subject:B.MODULES[s.module].title,session:clone(s),taskDefinitions:clone(tasks(s)),observations:observations(s),evidenceSummary:evidenceSummary(s),scopeReview:scopeReview(s),recommendedFollowups:nextChecks(s),interpretation:'Objective answer components are checked with fixed mathematics. Explanations require human or AI-tutor review. These observations do not establish mastery, effort, AI use, or a complete course diagnosis.'};}
function answerText(t,a){return t.fields.map(f=>{const v=a?.values[f.id];return f.label+': '+(f.kind==='number'?v||'not entered':f.kind==='multi'?(v||[]).map(x=>f.options.find(o=>o.value===x)?.label||x).join('; ')||'not selected':f.options.find(o=>o.value===v)?.label||'not selected');}).join('\n');}
function markdown(s){
 const module=B.MODULES[s.module];let out='# Cluevera · '+module.title+'\n\nScope: '+module.scope+'\nSession: '+s.id+'\n\n## A useful request for an AI tutor\n\nUse the actual answers and explanations below to suggest one or two learning priorities. Explain which specific responses support each suggestion, and ask a follow-up question when the reasoning is ambiguous. Keep arithmetic errors, conceptual explanations, missing evidence, and reported help distinct. Do not treat this short check as a complete course assessment or infer effort or AI use from it. Start with a short explanation and one changed-number practice question, then adapt to my response.\n\n';
 const summary=evidenceSummary(s);out+='Check: '+checkName(s)+' · '+tasks(s).length+' questions\n\n## Fixed components and separate explanation reviews\n\nMatched components: '+summary.matched+'; need another check: '+summary.recheck+'; uncertain: '+summary.unsure+'; missing: '+summary.missing+'. These are component counts, not a weighted grade or mastery estimate.\nExplanation reviews — open: '+summary.explanations.open+'; revision: '+summary.explanations.revise+'; partial: '+summary.explanations.partial+'; key connection explained: '+summary.explanations.connected+'. Reviews concern only the current submitted attempt.\n\n';
 const scope=scopeReview(s);out+='## Scope and evidence limits\n\n'+scope.interpretation+'\n\nNot checked in these '+tasks(s).length+' questions:\n'+scope.notChecked.map(x=>'- '+x).join('\n')+'\n\nSupplied information affecting interpretation:\n'+(scope.suppliedInformation.length?scope.suppliedInformation.map(x=>'- '+x.task+': '+x.note).join('\n'):'No separate supplied-answer condition is flagged here. The full prompts remain above each answer; they still define the support and limits of the evidence.')+'\n\n';
 const followups=nextChecks(s);out+='## Possible next checks\n\n'+(followups.length?followups.map(o=>'- '+o.id+' · '+o.title+': '+o.followupReasons.join(' ')+' Next: '+o.next).join('\n'):'No specific follow-up was selected from the fixed checks, reported support, or saved local reviews. Unreviewed written reasons and untested topics still need evidence.')+'\n\n';
 out+='## Answer and explanation history\n\n';
 for(const t of tasks(s)){
  const r=s.records[t.id];out+='### '+t.title+' · '+t.groupName+'\n\n'+t.prompt+'\n\n';
  if(t.table)out+='Given table: '+JSON.stringify(t.table)+'\n\n';if(t.matrix)out+='Given matrix: '+JSON.stringify(t.matrix)+'\n\n';if(t.visual)out+='Graph/table description: '+t.visual.description+'\n'+(t.visual.kind==='game'?'Payoffs: '+JSON.stringify(t.visual)+'\n':'')+'\n';
  out+='Reasoning prompt: '+t.reason+'\n\n';
  out+='Current component checks:\n'+componentChecks(t,last(s,t)).map(x=>'- '+x.label+': '+x.state+(x.selection?' · correct selections: '+x.selection.correct.join(', ')+'; extra selections: '+x.selection.extra.join(', ')+'; missing selections: '+x.selection.missing.join(', '):'')).join('\n')+'\n\n';
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
   if(!object(s)||typeof s.id!=='string'||ids.has(s.id)||s.module!==module||![B.VERSION,X.VERSION].includes(s.bankVersion)||(s.bankVersion===X.VERSION?s.check!=='followup':s.check!==undefined&&s.check!=='entry')||!Number.isFinite(Date.parse(s.createdAt))||!['intro','task','report'].includes(s.view)||!Number.isInteger(s.index)||s.index<0||s.index>=tasks(s).length||!object(s.records)||!Array.isArray(s.events)||s.events.some(e=>!object(e)||typeof e.type!=='string'||!Number.isFinite(Date.parse(e.at))))return null;
   ids.add(s.id);
   for(const [id,r]of Object.entries(s.records)){
    const t=tasks(s).find(t=>t.id===id);
    if(!t||!object(r)||!validDraft(t,r.draft)||!['draft','submitted'].includes(r.status)||!Array.isArray(r.submissions)||!Array.isArray(r.reviews)||r.status==='submitted'&&!r.submissions.length)return null;
    for(const a of r.submissions)if(!object(a)||a.taskVersion!==s.bankVersion||validate(t,a.answer)||typeof a.feedbackSeen!=='boolean'||!Number.isFinite(Date.parse(a.at))||JSON.stringify(a.objective)!==JSON.stringify(evaluate(t,a.answer)))return null;
    if(r.status==='submitted'&&JSON.stringify(r.draft)!==JSON.stringify(r.submissions.at(-1).answer))return null;
    if(r.reviews.some(x=>!object(x)||!Number.isInteger(x.submission)||x.submission<1||x.submission>r.submissions.length||![null,0,1,2].includes(x.points)||typeof x.note!=='string'||!x.note.trim()||x.note.length>2000||!Number.isFinite(Date.parse(x.at))))return null;
   }
   if(s.view==='report'&&!done(s))return null;
  }
 }
 return clone(value);
}
const api={SCHEMA,numeric,fresh,session,createSession,definition,checkName,tasks,task,blank,record,edit,validate,evaluate,submit,last,done,review,latestReview,observations,componentChecks,evidenceSummary,scopeReview,nextChecks,portable,answerText,markdown,hydrate};
if(typeof module==='object'&&module.exports)module.exports=api;else root.ClueveraFoundationEngine=api;
})(typeof window==='undefined'?globalThis:window);
