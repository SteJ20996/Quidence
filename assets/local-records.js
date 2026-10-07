(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.QuidenceLocalRecords=api;api.mount(root);}})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const META='cluevera_sync_device_v1',GENERATION='quidence_local_device_generation_v1',SCHEMA='quidence_local_backup_v1';
const P=typeof module==='object'&&module.exports?require('./sync-policy.js'):null;
function managed(key,policy){if(key===META||Object.hasOwn(policy.KEYS,key))return true;const match=String(key).match(/^cluevera_user_[a-z0-9_-]{1,128}:(.+)$/i);return!!match&&(Object.hasOwn(policy.KEYS,match[1])||/^backup:\d+:[a-z0-9]+$/.test(match[1]));}
function keys(storage){if(typeof storage.keys==='function')return storage.keys();return Array.from({length:storage.length},(_,i)=>storage.key(i));}
function create(storage,policy=P){
 const initialGeneration=storage.getItem(GENERATION),initialMeta=storage.getItem(META);let owner=null,blocked=false;
 try{const meta=JSON.parse(initialMeta||'null');if(meta!==null){if(!meta||!meta.users||typeof meta.users!=='object')throw Error('Unreadable metadata');if(meta.activeOwner){if(typeof meta.activeOwner.id!=='string'||!/^[a-z0-9_-]{1,128}$/i.test(meta.activeOwner.id))throw Error('Unreadable workspace');owner=meta.activeOwner.id;}}}catch{blocked=true;}
 function check(){if(blocked)throw Error('Saved workspace information could not be read. Export the original records before clearing this browser.');if(initialGeneration?.startsWith('clearing:')||storage.getItem(GENERATION)!==initialGeneration||storage.getItem(META)!==initialMeta)throw Error('Local records changed. Reload before continuing; this tab cannot save stale answers.');}
 const physical=key=>Object.hasOwn(policy.KEYS,key)&&owner?'cluevera_user_'+owner+':'+key:key;
 const adapter={getItem:key=>{check();return storage.getItem(physical(key));},setItem:(key,value)=>{check();storage.setItem(physical(key),value);},removeItem:key=>{check();storage.removeItem(physical(key));}};
 function exportWork(){return{schema:SCHEMA,exportedAt:new Date().toISOString(),records:Object.fromEntries(keys(storage).filter(k=>managed(k,policy)).map(k=>[k,storage.getItem(k)]))};}
 function token(){return Date.now()+':'+Math.random().toString(36).slice(2);}
 function clear(){const id=token();storage.setItem(GENERATION,'clearing:'+id);try{for(const key of keys(storage).filter(k=>managed(k,policy)))storage.removeItem(key);}finally{storage.setItem(GENERATION,'ready:'+id);}}
 function inspectBackup(backup){
  if(!backup||backup.schema!==SCHEMA||!backup.records||typeof backup.records!=='object'||Array.isArray(backup.records))throw Error('Choose a Quidence local-record backup. Other exports can be read separately.');
  const entries=Object.entries(backup.records);if(!entries.length||entries.length>10000||entries.some(([k,v])=>!managed(k,policy)||typeof v!=='string'))throw Error('This backup has an unsupported record. Your current records are kept.');
  const counts={total:entries.length,missing:0,identical:0,conflicting:0};
  for(const[k,v]of entries){const saved=storage.getItem(k);counts[saved===null?'missing':saved===v?'identical':'conflicting']++;}
  return counts;
 }
 function restore(backup){
  const counts=inspectBackup(backup),entries=Object.entries(backup.records);
  if(counts.conflicting)throw Error('This browser has different records in '+counts.conflicting+' record group(s). Nothing was restored. Use a separate browser profile to view this backup without changing your current work, or download your current backup before clearing and replacing records.');
  const id=token(),added=[];storage.setItem(GENERATION,'clearing:'+id);
  try{for(const[k,v]of entries)if(storage.getItem(k)===null){added.push(k);storage.setItem(k,v);}}catch(e){for(const key of added)storage.removeItem(key);throw Error('The backup could not be restored. Check browser storage space; your previous records are kept.');}finally{storage.setItem(GENERATION,'ready:'+id);}
  return counts;
 }
 return{adapter,exportWork,clear,inspectBackup,restore,check,blocked:()=>blocked};
}
function mount(window){
 const document=window.document,policy=window.QuidenceSyncPolicy,script=document.currentScript?.src;if(!document||!policy)return;
 const siteRoot=new URL('../',script||window.location.href);let controller;
 try{controller=create(window.localStorage,policy);window.QuidenceStorage=controller.adapter;}catch(e){window.QuidenceLocalRecordsError=e.message;}
 function reloadNotice(){window.location.reload();}
 window.addEventListener('storage',event=>{if(event.key===GENERATION||event.key===META||event.key===null)reloadNotice();});
 window.addEventListener('pageshow',event=>{if(event.persisted)reloadNotice();});
 document.addEventListener('DOMContentLoaded',()=>{
  const banner=document.createElement('aside');banner.setAttribute('aria-label','Local record storage');banner.style.cssText='padding:12px 20px;background:#edf4f2;color:#173c34;font:14px system-ui;display:block';
  banner.appendChild(document.createTextNode(controller?'New learning records stay in this browser. ':'Browser saving is unavailable; download a report before closing an activity. '));const link=document.createElement('a');link.href=new URL('records/',siteRoot).href;link.textContent='Save or delete records';banner.appendChild(link);document.body.prepend(banner);
  const status=document.getElementById('local-record-status');if(!status)return;
  if(!controller){status.textContent='Browser storage is unavailable. Use the activity’s report download while the page is open.';return;}
  if(controller.blocked())status.textContent='Saved workspace information could not be read. You can still export the original records before clearing them.';
  document.getElementById('local-export').addEventListener('click',()=>{
   try{const blob=new window.Blob([JSON.stringify(controller.exportWork(),null,2)],{type:'application/json'}),url=window.URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='quidence-local-records-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>window.URL.revokeObjectURL(url),1000);status.textContent='Download requested. Check your Downloads folder and keep the file somewhere private. The original browser records remain.';}catch{status.textContent='The download could not start. Keep your activity open and use its own report export.';}
  });
  document.getElementById('local-clear').addEventListener('click',()=>{
   if(!window.confirm('Delete all Quidence learning records and local backups from this browser? Download anything you want to keep first. Downloaded files must be deleted separately.'))return;
   try{controller.clear();status.textContent='Quidence learning records were removed from this browser. Remove downloaded files and clipboard contents separately on a shared device. Reload before starting new work.';document.getElementById('local-clear').disabled=true;}catch{status.textContent='Clearing could not finish. Close activity tabs and remove this site’s data in your browser settings before leaving a shared device.';}
  });
  document.getElementById('local-import').addEventListener('change',async event=>{
   const file=event.target.files?.[0];if(!file)return;
   try{if(file.size>64*1024*1024)throw Error('This backup is too large for this restore tool. Keep the file and use a smaller device backup.');const backup=JSON.parse(await file.text()),counts=controller.inspectBackup(backup);if(counts.conflicting)throw Error('Backup checked: '+counts.total+' record groups; '+counts.conflicting+' differ from this browser. Nothing was restored. Use a separate browser profile to view it safely. To replace your work instead, download your current backup before clearing browser records.');if(!window.confirm('Restore '+counts.missing+' missing record groups? '+counts.identical+' identical groups are already here. This backup can contain private answers; existing different records will not be overwritten.'))return;controller.restore(backup);status.textContent='Backup restored locally: '+counts.missing+' record groups added; '+counts.identical+' identical groups kept. Reload before continuing a course.';}catch(e){status.textContent=e.message||'This backup could not be read. Your current records are kept.';}finally{event.target.value='';}
  });
 });
}
return{META,GENERATION,SCHEMA,managed,create,mount};
});
