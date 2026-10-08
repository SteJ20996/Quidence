(function(root){
'use strict';
// Legacy persistence identifiers are intentionally retained; see BRAND_MIGRATION.md.
const KEY='cluevera_saved_reports_v1',SUBJECTS={aa01:'Secondary-school math',ab01:'Linear Algebra',ac01:'Game theory foundations',ad01:'Calculus',ae01:'Statistics',af01:'Pre-calculus','pre-algebra':'Pre-Algebra','algebra-1':'Algebra I',geometry:'Geometry','algebra-2':'Algebra II',microeconomics:'Microeconomics',physics:'Earlier introductory Physics','physics-1':'Physics 1 Foundations','physics-2':'Physics 2 Foundations'};
const clone=v=>JSON.parse(JSON.stringify(v));
const GOAL_KEY='cluevera_learning_goal_v1';
function sessionKey(payload,sessionId){return String(sessionId||payload.session?.id||payload.session_id||payload.sessionId||payload.state?.sessionId||payload.state?.id||payload.id||'current-session');}
// Snapshot an explicitly opted-in request. Free text supplies a review criterion,
// never an automatic answer score. An unreadable request stays untouched.
function captureRequest(module,storage){
 try{const goal=JSON.parse(storage.getItem(GOAL_KEY));const subject=goal?.subject==='aa01'?'algebra-1':goal?.subject;
  const matches=subject===module||(module==='aa01'&&['pre-algebra','algebra-1'].includes(subject));
  if(goal?.schema!==GOAL_KEY||goal.includeInReport!==true||!SUBJECTS[subject]||!matches||typeof goal.text!=='string'||!goal.text.trim()||goal.text.length>3000)return null;
  return{schema:'quidence_report_learning_request_v1',subject,text:goal.text,capturedAt:new Date().toISOString()};
 }catch{return null;}
}
function withRequest(payload,request){const copy=clone(payload);delete copy.learningRequest;if(request)copy.learningRequest=clone(request);return copy;}
// Export and render the context saved with this session, including an older
// snapshot with no request. Editing the homepage cannot rewrite that context.
function prepare(module,payload,sessionId,storage){
 storage=storage||(root.QuidenceStorage||root.localStorage);
 const result=read(storage),item=result.ok?result.data.items.find(x=>x.id===module+':'+sessionKey(payload,sessionId)):null;
 return withRequest(payload,item?item.versions.at(-1).payload.learningRequest:captureRequest(module,storage));
}
function displaySubject(item){return SUBJECTS[item.module]||item.subject;}
function fresh(){return{schema:KEY,items:[]};}
function hydrate(v){if(!v||v.schema!==KEY||!Array.isArray(v.items))return null;const ids=new Set();for(const x of v.items){if(!x||typeof x.id!=='string'||ids.has(x.id)||!SUBJECTS[x.module]||!Array.isArray(x.versions)||!x.versions.length||x.versions.some(r=>!r||typeof r.signature!=='string'||!Number.isFinite(Date.parse(r.savedAt))||!r.payload||typeof r.payload!=='object'))return null;ids.add(x.id);}return clone(v);}
function read(storage){try{const raw=storage.getItem(KEY)||'';if(!raw)return{ok:true,data:fresh(),raw};const data=hydrate(JSON.parse(raw));return data?{ok:true,data,raw}:{ok:false,raw,error:'The saved reports could not be read. The original data is kept unchanged.'};}catch{return{ok:false,raw:'',error:'Browser saving is unavailable. Download a copy of your report.'};}}
function content(payload){return JSON.stringify(payload,(key,value)=>['exported_at','exportedAt','exportedAtISO','exported'].includes(key)?undefined:value);}
// A small storage fingerprint, not a security hash or proof of equal reports.
// Equality always compares the actual normalized content, including legacy copies.
function signature(text){let hash=2166136261;for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);return'compact-v2:'+text.length+':'+(hash>>>0).toString(16);}
// Check reports contain the original session as well as derived presentation.
// A regenerated summary or report-view event is not a new student response.
function sameWork(a,b){
 if(!a?.session?.records||!b?.session?.records)return content(withRequest(a,null))===content(withRequest(b,null));
 const stable=p=>JSON.stringify({schema:p.schema,kind:p.kind,bankVersion:p.bankVersion,session:Object.fromEntries(Object.entries(p.session).filter(([k])=>!['view','index','events'].includes(k)))});
 return stable(a)===stable(b);
}
function save(module,payload,sessionId,storage){
 if(!SUBJECTS[module]||!payload||typeof payload!=='object')return{ok:false,error:'The report could not be saved.'};
 try{storage=storage||(root.QuidenceStorage||root.localStorage);const result=read(storage);if(!result.ok)return result;const data=result.data;
  const session=sessionKey(payload,sessionId);
  const id=module+':'+session;let item=data.items.find(x=>x.id===id);
  if(item&&sameWork(item.versions.at(-1).payload,payload))return{ok:true,id,changed:false,module,payload:withRequest(payload,item.versions.at(-1).payload.learningRequest)};
  payload=withRequest(payload,captureRequest(module,storage));const hash=signature(content(payload));
  if(!item){item={id,module,subject:SUBJECTS[module],sessionId:session,versions:[]};data.items.push(item);}
  item.versions.push({savedAt:new Date().toISOString(),signature:hash,payload:clone(payload)});
  for(const existing of data.items)for(const version of existing.versions)version.signature=signature(content(version.payload));
  if((storage.getItem(KEY)||'')!==result.raw)return{ok:false,error:'Saved reports changed in another tab. Reload before saving; your activity record is kept.'};
  storage.setItem(KEY,JSON.stringify(data));return{ok:true,id,changed:true,module,payload};
 }catch{return{ok:false,error:'Your report is open, but it could not be saved in this browser. Download a copy.'};}
}
function compact(storage){
 try{storage=storage||(root.QuidenceStorage||root.localStorage);const result=read(storage);if(!result.ok)return result;
  for(const item of result.data.items)for(const version of item.versions)version.signature=signature(content(version.payload));
  const next=JSON.stringify(result.data),savedCharacters=result.raw.length-next.length;
  if(savedCharacters<=0)return{ok:true,changed:false,savedCharacters:0};
  if((storage.getItem(KEY)||'')!==result.raw)return{ok:false,error:'Saved reports changed in another tab. Reload before trying again.'};
  storage.setItem(KEY,next);return{ok:true,changed:true,savedCharacters};
 }catch{return{ok:false,error:'Report optimization could not finish. The previous saved reports are kept.'};}
}
const HANDOFF='Any earlier automatic explanation credit is an unvalidated detector suggestion, not a label of understanding. Independently review the question, conditions, exact reasoning and justification. Before sharing, remove names, school, contact details and other personal information. Use only tools you are allowed to use; younger learners should work with a parent or teacher. Read the actual questions, answers, explanations, support context, and revisions in this report. Suggest one or two learning priorities with specific evidence. Ask a follow-up when reasoning is ambiguous. Keep missing evidence separate from incorrect answers, and calculation separate from conceptual explanation. Do not infer mastery, effort, or AI use from this short activity. Teach one next idea, offer a changed-number question, and adapt to the learner’s answer.';
function appendNotice(host,result,options={}){if(!result||!root.document)return;const p=root.document.createElement('p');p.className='saved-report-note'+(result.ok?'':' error');p.setAttribute('role',result.ok?'status':'alert');p.textContent=result.ok?'A report copy is saved in this browser. Download it to discuss with your teacher or tutor, or revisit it when you keep learning. ':result.error+' ';if(result.ok){const a=root.document.createElement('a');a.href=options.reportsHref||'../../../reports/';a.textContent='View saved reports';p.appendChild(a);}host.appendChild(p);if(result.ok&&result.payload)root.QuidenceReportTools?.attach(host,SUBJECTS[result.module],result.payload,HANDOFF);}
const api={KEY,SUBJECTS,displaySubject,fresh,hydrate,read,save,prepare,compact,appendNotice,HANDOFF};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceReportStore=api;
})(typeof window==='undefined'?globalThis:window);

