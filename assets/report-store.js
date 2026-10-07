(function(root){
'use strict';
// Legacy persistence identifiers are intentionally retained; see BRAND_MIGRATION.md.
const KEY='cluevera_saved_reports_v1',SUBJECTS={aa01:'Secondary-school math',ab01:'Linear algebra foundations',ac01:'Game theory foundations',ad01:'Visual calculus',ae01:'Statistics foundations',af01:'Pre-calculus foundations','pre-algebra':'Pre-Algebra','algebra-1':'Algebra I',geometry:'Geometry','algebra-2':'Algebra II',microeconomics:'Microeconomics'};
const clone=v=>JSON.parse(JSON.stringify(v));
function fresh(){return{schema:KEY,items:[]};}
function hydrate(v){if(!v||v.schema!==KEY||!Array.isArray(v.items))return null;const ids=new Set();for(const x of v.items){if(!x||typeof x.id!=='string'||ids.has(x.id)||!SUBJECTS[x.module]||!Array.isArray(x.versions)||!x.versions.length||x.versions.some(r=>!r||typeof r.signature!=='string'||!Number.isFinite(Date.parse(r.savedAt))||!r.payload||typeof r.payload!=='object'))return null;ids.add(x.id);}return clone(v);}
function read(storage){try{const raw=storage.getItem(KEY)||'';if(!raw)return{ok:true,data:fresh(),raw};const data=hydrate(JSON.parse(raw));return data?{ok:true,data,raw}:{ok:false,raw,error:'The saved reports could not be read. The original data is kept unchanged.'};}catch{return{ok:false,raw:'',error:'Browser saving is unavailable. Download a copy of your report.'};}}
function signature(payload){return JSON.stringify(payload,(key,value)=>['exported_at','exportedAt','exportedAtISO','exported'].includes(key)?undefined:value);}
function save(module,payload,sessionId,storage){
 if(!SUBJECTS[module]||!payload||typeof payload!=='object')return{ok:false,error:'The report could not be saved.'};
 try{storage=storage||(root.QuidenceStorage||root.localStorage);const result=read(storage);if(!result.ok)return result;const data=result.data;
  const session=String(sessionId||payload.session?.id||payload.session_id||payload.sessionId||payload.state?.sessionId||payload.state?.id||payload.id||'current-session');
  const id=module+':'+session,hash=signature(payload);let item=data.items.find(x=>x.id===id);
  if(item?.versions.at(-1).signature===hash)return{ok:true,id,changed:false,module,payload};
  if(!item){item={id,module,subject:SUBJECTS[module],sessionId:session,versions:[]};data.items.push(item);}
  item.versions.push({savedAt:new Date().toISOString(),signature:hash,payload:clone(payload)});
  storage.setItem(KEY,JSON.stringify(data));return{ok:true,id,changed:true,module,payload};
 }catch{return{ok:false,error:'Your report is open, but it could not be saved in this browser. Download a copy.'};}
}
const HANDOFF='Any earlier automatic explanation credit is an unvalidated detector suggestion, not a label of understanding. Independently review the question, conditions, exact reasoning and justification. Before sharing, remove names, school, contact details and other personal information. Use only tools you are allowed to use; younger learners should work with a parent or teacher. Read the actual questions, answers, explanations, support context, and revisions in this report. Suggest one or two learning priorities with specific evidence. Ask a follow-up when reasoning is ambiguous. Keep missing evidence separate from incorrect answers, and calculation separate from conceptual explanation. Do not infer mastery, effort, or AI use from this short activity. Teach one next idea, offer a changed-number question, and adapt to the learner’s answer.';
function appendNotice(host,result,options={}){if(!result||!root.document)return;const p=root.document.createElement('p');p.className='saved-report-note'+(result.ok?'':' error');p.setAttribute('role',result.ok?'status':'alert');p.textContent=result.ok?'A report copy is saved in this browser. Download it for another AI tutor, or revisit it when you keep learning. ':result.error+' ';if(result.ok){const a=root.document.createElement('a');a.href=options.reportsHref||'../../../reports/';a.textContent='View saved reports';p.appendChild(a);}host.appendChild(p);if(result.ok&&result.payload)root.QuidenceReportTools?.attach(host,SUBJECTS[result.module],result.payload,HANDOFF);}
const api={KEY,SUBJECTS,fresh,hydrate,read,save,appendNotice,HANDOFF};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceReportStore=api;
})(typeof window==='undefined'?globalThis:window);

