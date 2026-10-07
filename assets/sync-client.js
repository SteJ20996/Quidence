(function(root){
'use strict';
// Legacy persistence identifiers are intentionally retained; see BRAND_MIGRATION.md.
const P=typeof module==='object'&&module.exports?require('./sync-policy.js'):root.QuidenceSyncPolicy;
const META='cluevera_sync_device_v1';
function create(options){
 const storage=options.storage,request=options.request;let meta={activeOwner:null,users:{}},csrf=null,available=false,busy=false,conflicts=[],pending=[],authenticated=false;
 let metadataError=false;try{const parsed=JSON.parse(storage.getItem(META));if(parsed!==null&&(!parsed||!parsed.users||typeof parsed.users!=='object'))throw Error('Unreadable account metadata');if(parsed)meta=parsed;}catch{metadataError=true;}
 function checkOwner(){if(metadataError)throw Error('Saved account information could not be read. Download a copy before resetting this browser.');let live;try{live=JSON.parse(storage.getItem(META)||'null');}catch{throw Error('Saved account information could not be read.');}if((live?.activeOwner?.id||null)!==(meta.activeOwner?.id||null))throw Error('The account changed in another tab. Reload before continuing.');}
 const save=()=>storage.setItem(META,JSON.stringify(meta));
 const physical=(key,owner=meta.activeOwner)=>owner?'cluevera_user_'+owner.id+':'+key:key;
 const local=key=>{checkOwner();return storage.getItem(physical(key));};
 const write=(key,value)=>{checkOwner();storage.setItem(physical(key),value);};
 const userState=()=>{const id=meta.activeOwner?.id;if(!id)throw Error('Sign in to sync your work.');return meta.users[id]||(meta.users[id]={bases:{}});};
 const announce=()=>options.onChange?.(state());
 function state(){return {owner:meta.activeOwner,authenticated,available,busy,conflicts:conflicts.slice(),pending:pending.slice()};}
 async function api(url,method='GET',body){const result=await request(url,{method,headers:{'Content-Type':'application/json',...(csrf?{'X-CSRF-Token':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)});if(!result.ok){const e=Error(result.data?.error||'Account sync is unavailable. Your local work is kept.');e.status=result.status;e.data=result.data;throw e;}return result.data;}
 async function refresh(){checkOwner();try{const result=await api('/api/me');checkOwner();available=true;csrf=result.csrf;authenticated=!!result.user&&result.user.id===meta.activeOwner?.id;if(result.user&&(!meta.activeOwner||meta.activeOwner.id===result.user.id)){if(options.accountPage&&!meta.signedOut){meta.activeOwner=result.user;authenticated=true;userState();save();}}else if(result.user)throw Error('Open your account page to switch accounts before syncing.');
 // Expiry does not erase unsynced work. Explicit sign-out/device clearing does.
 announce();return result;}catch(e){if(!e.status||e.status===404)available=false;announce();throw e;}}
 async function signIn(kind,body){checkOwner();const result=await api('/api/'+kind,'POST',body);checkOwner();available=true;authenticated=true;csrf=result.csrf;meta.activeOwner=result.user;meta.signedOut=false;userState();save();conflicts=[];pending=[];announce();return result;}
 function storageKeys(){if(typeof storage.keys==='function')return storage.keys();if(storage.map instanceof Map)return [...storage.map.keys()];const result=[];for(let i=0;i<storage.length;i++)result.push(storage.key(i));return result;}
 function forgetDevice(includeGuest=false){checkOwner();const keys=storageKeys().filter(key=>typeof key==='string'&&(key.startsWith('cluevera_user_')||(includeGuest&&Object.hasOwn(P.KEYS,key))));for(const key of keys)storage.removeItem(key);authenticated=false;csrf=null;meta={activeOwner:null,users:{},signedOut:true};save();conflicts=[];pending=[];announce();}
 async function logout(){checkOwner();let error;try{await api('/api/logout','POST',{});}catch(e){error=e;}finally{forgetDevice(false);}if(error)throw Error('Account copies were cleared from this device. Server sign-out could not be confirmed; close the shared browser profile and sign out again when online.');}
 async function clearDevice(){checkOwner();let error;if(meta.activeOwner)try{await api('/api/logout','POST',{});}catch(e){error=e;}forgetDevice(true);if(error)throw Error('This device was cleared. Server sign-out could not be confirmed; close the shared browser profile and sign out again when online.');}
 function reloadMeta(){authenticated=false;const parsed=JSON.parse(storage.getItem(META)||'null');if(parsed&&parsed.users&&typeof parsed.users==='object')meta=parsed;else meta={activeOwner:null,users:{}};announce();}

 function importGuest(){checkOwner();userState();for(const key of Object.keys(P.KEYS)){const value=storage.getItem(key);if(value!==null&&P.valid(key,value)&&local(key)===null)write(key,value);}announce();}
 function backup(key,value){if(value!==null){checkOwner();storage.setItem(physical('backup:'+Date.now()+':'+Math.random().toString(36).slice(2)),JSON.stringify({key,value,savedAt:Date.now()}));}}
 async function sync(applyRemote=false){checkOwner();if(busy)return;busy=true;conflicts=[];pending=[];announce();const owner=meta.activeOwner?.id;try{
  const me=await api('/api/me');checkOwner();available=true;csrf=me.csrf;authenticated=!!me.user&&me.user.id===owner;if(!me.user||me.user.id!==owner)throw Error('Sign in to this account again before syncing. Your local work is kept.');
  const remote=await api('/api/records');checkOwner();if(!Array.isArray(remote.records)||remote.records.some(r=>!P.valid(r.key,r.value)||!Number.isSafeInteger(r.version)||r.version<1))throw Error('Account records could not be read. Your local work is kept.');if(meta.activeOwner?.id!==owner)return;
  const bases=userState().bases,map=new Map(remote.records.map(r=>[r.key,r]));
  for(const key of Object.keys(P.KEYS)){
   if(meta.activeOwner?.id!==owner)return;
   const value=local(key),record=map.get(key)||{key,version:0,value:null},base=bases[key]||{version:0,value:null};
   if(value===record.value){bases[key]={version:record.version,value:record.value};save();continue;}
   if(value===null||value===base.value){if(record.value!==null){if(applyRemote&&local(key)===value){backup(key,value);write(key,record.value);bases[key]={version:record.version,value:record.value};save();}else pending.push(record);}continue;}
   if(record.version!==base.version){conflicts.push({key,local:value,remote:record});continue;}
   if(!P.valid(key,value)){conflicts.push({key,local:value,remote:record,invalid:true});continue;}
   try{const result=await api('/api/records/'+encodeURIComponent(key),'PUT',{baseVersion:base.version,value});checkOwner();if(meta.activeOwner?.id!==owner)return;bases[key]={version:result.record.version,value:result.record.value};save();}
   catch(e){if(e.status===409)conflicts.push({key,local:local(key),remote:e.data.conflict});else throw e;}
  }
 }finally{busy=false;announce();}}
 async function resolve(key,choice){checkOwner();const item=conflicts.find(x=>x.key===key);if(!item)throw Error('Sync again to review this record.');const owner=meta.activeOwner?.id,bases=userState().bases;
  if(choice==='remote'){backup(key,local(key));write(key,item.remote.value);bases[key]={version:item.remote.version,value:item.remote.value};save();}
  else{const value=local(key),result=await api('/api/records/'+encodeURIComponent(key),'PUT',{baseVersion:item.remote.version,value});checkOwner();if(meta.activeOwner?.id!==owner)return;bases[key]={version:result.record.version,value:result.record.value};save();}
  conflicts=conflicts.filter(x=>x.key!==key);announce();
 }
 function exportWork(){return{owner:meta.activeOwner,exportedAt:new Date().toISOString(),records:Object.fromEntries(Object.keys(P.KEYS).map(k=>[k,local(k)]).filter(([,v])=>v!==null))};}
 return{state,physical,local,refresh,signIn,logout,clearDevice,reloadMeta,importGuest,sync,resolve,exportWork};
}
const api={create,META};if(typeof module==='object'&&module.exports){module.exports=api;return;}
root.QuidenceSync=api;
try{
 // An explicit application storage adapter. Native Storage and third-party keys
 // are left alone. A page cannot save its old in-memory work to a different user.
 const native=root.localStorage,storage={getItem:k=>native.getItem(k),setItem:(k,v)=>native.setItem(k,v),removeItem:k=>native.removeItem(k),keys:()=>Array.from({length:native.length},(_,i)=>native.key(i))};
 const siteRoot=new URL('../',document.currentScript.src);let timer,controller,locked=false;const accountPage=location.pathname.includes('/account/');
 let initialOwner;const changed=()=>{clearTimeout(timer);if(!locked&&controller.state().owner)timer=setTimeout(()=>{if(controller.state().busy){changed();return;}controller.sync(false).catch(showError);},2500);};
 function showError(e){if(banner)banner.textContent=e.message+' ';addLink();}
 let banner;function addLink(){if(!banner)return;const a=document.createElement('a');a.href=new URL('account/',siteRoot).href;a.textContent='Your account';banner.appendChild(a);}
 function liveOwner(){try{return JSON.parse(native.getItem(META)||'null')?.activeOwner?.id||null;}catch{return '__unreadable__';}}
 function checkScope(){if(!accountPage&&liveOwner()!==initialOwner)locked=true;if(locked)throw Error('The account changed in another tab. Reload before continuing; this page cannot write to another workspace.');}
 function invalidate(){if(accountPage)return;locked=true;clearTimeout(timer);if(document.body){document.body.textContent='Your account changed. Reload this page before continuing.';const a=document.createElement('a');a.href=new URL('account/',siteRoot).href;a.textContent=' Your account';document.body.appendChild(a);}root.location?.reload?.();}
 controller=create({storage,accountPage,request:async(url,opts)=>{const res=await fetch(url,{...opts,credentials:'same-origin'});let data;try{data=await res.json();}catch{throw Error('Account sync is not available on this site. Your local work is still saved.');}return{ok:res.ok,status:res.status,data};},onChange:s=>{if(!accountPage&&initialOwner!==undefined&&s.owner?.id!==initialOwner&&((s.owner?.id||null)!==initialOwner)){invalidate();return;}if(banner){banner.textContent=s.owner?(s.conflicts.length?'Two copies need your choice. ':s.pending.length?'Work from another device is ready to review. ':s.busy?'Saving to your account… ':'Signed in as '+s.owner.username+'. '):'Your work saves on this device. ';addLink();}root.dispatchEvent(new Event('quidence-sync-change'));}});
 initialOwner=controller.state().owner?.id||null;
 root.QuidenceStorage={getItem(key){if(!Object.hasOwn(P.KEYS,String(key)))return native.getItem(key);checkScope();return native.getItem(controller.physical(String(key)));},setItem(key,value){if(!Object.hasOwn(P.KEYS,String(key)))return native.setItem(key,value);checkScope();native.setItem(controller.physical(String(key)),value);changed();},removeItem(key){if(!Object.hasOwn(P.KEYS,String(key)))return native.removeItem(key);checkScope();native.removeItem(controller.physical(String(key)));changed();}};
 root.QuidenceAccount=controller;
 root.addEventListener('storage',event=>{if(event.key===META||event.key===null){clearTimeout(timer);if(!accountPage&&liveOwner()!==initialOwner)invalidate();else{controller.reloadMeta();}}});
 root.addEventListener('pageshow',event=>{if(event.persisted){if(!accountPage&&liveOwner()!==initialOwner)invalidate();else root.location?.reload?.();}});
 document.addEventListener('DOMContentLoaded',()=>{banner=document.createElement('aside');banner.id='account-status';banner.setAttribute('aria-label','Account and saving');banner.style.cssText='padding:12px 20px;background:#edf4f2;color:#173c34;font:14px system-ui;display:block';document.body.prepend(banner);controller.refresh().then(result=>{if(result.user&&result.user.id===controller.state().owner?.id)return controller.sync(accountPage);}).catch(showError);});
 root.addEventListener('online',()=>{if(!locked&&controller.state().owner)controller.sync(false).catch(showError);});
}catch(e){root.QuidenceSyncError=e.message;}
})(typeof window==='undefined'?globalThis:window);
