(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ClueveraAlgebraSession=api;})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const KEY='cluevera_algebra_progress_v06';
function hydrate(raw){
 if(!raw||raw.schema!==KEY||!raw.state||typeof raw.savedAt!=='number')return null;
 const s=raw.state;
 if(!['assessment','report'].includes(s.phase)||typeof s.sessionId!=='string'||!Array.isArray(s.queue)||!s.queue.length||new Set(s.queue).size!==s.queue.length||s.queue.some(id=>typeof id!=='string'||! /^(?:C(?:[1-9]|10|11)|S[12346]|V1|D1|Q[PN]|F(?:AN|AR|AE|AF|AM|N|P|E|G|M|B))$/.test(id))||!Number.isInteger(s.index)||s.index<0||s.index>=s.queue.length||!s.records||typeof s.records!=='object'||Array.isArray(s.records)||!Array.isArray(s.events)||!Array.isArray(s.reviewed)||!s.adaptiveItems||typeof s.adaptiveItems!=='object'||!Array.isArray(s.adaptiveDecisions)||!Array.isArray(s.quadraticDecisions)||!s.reviewDrafts||!s.reviewMessages)return null;
 for(const[id,r]of Object.entries(s.records))if(!r||r.id!==id||!s.queue.includes(id)||!Array.isArray(r.attempts)||r.attempts.some(a=>!a||!Number.isFinite(a.at)||!a.answer||!a.score||!a.score.parts)||!Array.isArray(r.hints)||r.hints.some(h=>!h||typeof h!=='object')||!Number.isFinite(r.started)||(r.complete!==null&&!Number.isFinite(r.complete))||(r.elapsedBeforeRevision!==undefined&&(!Number.isFinite(r.elapsedBeforeRevision)||r.elapsedBeforeRevision<0)))return null;
 for(const[id,t]of Object.entries(s.adaptiveItems))if(!s.queue.includes(id)||!t||typeof t.variant_id!=='string'||typeof t.prompt!=='string'||!Array.isArray(t.fields)||!t.fields.length||t.fields.some(f=>!f||typeof f.key!=='string'||typeof f.label!=='string'||!['number','choice'].includes(f.type)||(f.type==='choice'&&(!Array.isArray(f.options)||f.options.some(o=>!Array.isArray(o)||o.length!==2))))||!t.answer||!t.anchor)return null;
 return JSON.parse(JSON.stringify(s));
}
function read(storage){let raw='';try{raw=storage.getItem(KEY)||'';if(!raw)return{ok:true,state:null};const state=hydrate(JSON.parse(raw));return state?{ok:true,state}:{ok:false,raw,error:'Your saved progress could not be read. It is kept unchanged; download it before replacing it.'};}catch{return{ok:false,raw,error:raw?'Your saved progress could not be read. It is kept unchanged; download it before replacing it.':'Browser saving is unavailable. Keep this tab open and download your record.'};}}
function save(storage,state){try{storage.setItem(KEY,JSON.stringify({schema:KEY,savedAt:Date.now(),state}));return{ok:true};}catch{return{ok:false,error:'Progress could not be saved in this browser. Download your record before refreshing.'};}}
return{KEY,hydrate,read,save};
});
