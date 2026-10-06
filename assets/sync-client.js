(function(root){
'use strict';
const P=typeof module==='object'&&module.exports?require('./sync-policy.js'):root.ClueveraSyncPolicy;
const META='cluevera_sync_device_v1';
function create(options){
 const storage=options.storage,request=options.request;let meta={activeOwner:null,users:{}},csrf=null,available=false,busy=false,conflicts=[],pending=[];
 try{const parsed=JSON.parse(storage.getItem(META));if(parsed&&parsed.users&&typeof parsed.users==='object')meta=parsed;}catch{}
 const save=()=>storage.setItem(META,JSON.stringify(meta));
 const physical=(key,owner=meta.activeOwner)=>owner?'cluevera_user_'+owner.id+':'+key:key;
 const local=key=>storage.getItem(physical(key));
 const write=(key,value)=>storage.setItem(physical(key),value);
 const userState=()=>{const id=meta.activeOwner?.id;if(!id)throw Error('Sign in to sync your work.');return meta.users[id]||(meta.users[id]={bases:{}});};
 const announce=()=>options.onChange?.(state());
 function state(){return {owner:meta.activeOwner,available,busy,conflicts:conflicts.slice(),pending:pending.slice()};}
 async function api(url,method='GET',body){const result=await request(url,{method,headers:{'Content-Type':'application/json',...(csrf?{'X-CSRF-Token':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)});if(!result.ok){const e=Error(result.data?.error||'Account sync is unavailable. Your local work is kept.');e.status=result.status;e.data=result.data;throw e;}return result.data;}
 async function refresh(){try{const result=await api('/api/me');available=true;csrf=result.csrf;if(result.user&&(!meta.activeOwner||meta.activeOwner.id===result.user.id)){if(options.accountPage){meta.activeOwner=result.user;userState();save();}}else if(result.user)throw Error('Open your account page to switch accounts before syncing.');announce();return result;}catch(e){if(!e.status||e.status===404)available=false;announce();throw e;}}
 async function signIn(kind,body){const result=await api('/api/'+kind,'POST',body);available=true;csrf=result.csrf;meta.activeOwner=result.user;userState();save();conflicts=[];pending=[];announce();return result;}
 async function logout(){await api('/api/logout','POST',{});csrf=null;meta.activeOwner=null;save();conflicts=[];pending=[];announce();}
 function importGuest(){userState();for(const key of Object.keys(P.KEYS)){const value=storage.getItem(key);if(value!==null&&P.valid(key,value)&&local(key)===null)write(key,value);}announce();}
 function backup(key,value){if(value!==null)storage.setItem(physical('backup:'+Date.now()+':'+Math.random().toString(36).slice(2)),JSON.stringify({key,value,savedAt:Date.now()}));}
 async function sync(applyRemote=false){if(busy)return;busy=true;conflicts=[];pending=[];announce();const owner=meta.activeOwner?.id;try{
  const me=await api('/api/me');available=true;csrf=me.csrf;if(!me.user||me.user.id!==owner)throw Error('Sign in to this account again before syncing. Your local work is kept.');
  const remote=await api('/api/records');if(!Array.isArray(remote.records)||remote.records.some(r=>!P.valid(r.key,r.value)||!Number.isSafeInteger(r.version)||r.version<1))throw Error('Account records could not be read. Your local work is kept.');if(meta.activeOwner?.id!==owner)return;
  const bases=userState().bases,map=new Map(remote.records.map(r=>[r.key,r]));
  for(const key of Object.keys(P.KEYS)){
   if(meta.activeOwner?.id!==owner)return;
   const value=local(key),record=map.get(key)||{key,version:0,value:null},base=bases[key]||{version:0,value:null};
   if(value===record.value){bases[key]={version:record.version,value:record.value};save();continue;}
   if(value===null||value===base.value){if(record.value!==null){if(applyRemote&&local(key)===value){backup(key,value);write(key,record.value);bases[key]={version:record.version,value:record.value};save();}else pending.push(record);}continue;}
   if(record.version!==base.version){conflicts.push({key,local:value,remote:record});continue;}
   if(!P.valid(key,value)){conflicts.push({key,local:value,remote:record,invalid:true});continue;}
   try{const result=await api('/api/records/'+encodeURIComponent(key),'PUT',{baseVersion:base.version,value});if(meta.activeOwner?.id!==owner)return;bases[key]={version:result.record.version,value:result.record.value};save();}
   catch(e){if(e.status===409)conflicts.push({key,local:local(key),remote:e.data.conflict});else throw e;}
  }
 }finally{busy=false;announce();}}
 async function resolve(key,choice){const item=conflicts.find(x=>x.key===key);if(!item)throw Error('Sync again to review this record.');const owner=meta.activeOwner?.id,bases=userState().bases;
  if(choice==='remote'){backup(key,local(key));write(key,item.remote.value);bases[key]={version:item.remote.version,value:item.remote.value};save();}
  else{const value=local(key),result=await api('/api/records/'+encodeURIComponent(key),'PUT',{baseVersion:item.remote.version,value});if(meta.activeOwner?.id!==owner)return;bases[key]={version:result.record.version,value:result.record.value};save();}
  conflicts=conflicts.filter(x=>x.key!==key);announce();
 }
 function exportWork(){return{owner:meta.activeOwner,exportedAt:new Date().toISOString(),records:Object.fromEntries(Object.keys(P.KEYS).map(k=>[k,local(k)]).filter(([,v])=>v!==null))};}
 return{state,physical,local,refresh,signIn,logout,importGuest,sync,resolve,exportWork};
}
const api={create,META};if(typeof module==='object'&&module.exports){module.exports=api;return;}
root.ClueveraSync=api;
try{
 const native={getItem:Storage.prototype.getItem,setItem:Storage.prototype.setItem,removeItem:Storage.prototype.removeItem},storage={getItem:k=>native.getItem.call(root.localStorage,k),setItem:(k,v)=>native.setItem.call(root.localStorage,k,v)};
 const siteRoot=new URL('../',document.currentScript.src);let timer,controller;const accountPage=location.pathname.includes('/account/');
 const changed=()=>{clearTimeout(timer);if(controller.state().owner)timer=setTimeout(()=>{if(controller.state().busy){changed();return;}controller.sync(false).catch(showError);},2500);};
 function showError(e){if(banner)banner.textContent=e.message+' ';addLink();}
 let banner;function addLink(){if(!banner)return;const a=document.createElement('a');a.href=new URL('account/',siteRoot).href;a.textContent='Your account';banner.appendChild(a);}
 controller=create({storage,accountPage,request:async(url,opts)=>{const res=await fetch(url,{...opts,credentials:'same-origin'});let data;try{data=await res.json();}catch{throw Error('Account sync is not available on this site. Your local work is still saved.');}return{ok:res.ok,status:res.status,data};},onChange:s=>{if(banner){banner.textContent=s.owner?(s.conflicts.length?'Two copies need your choice. ':s.pending.length?'Work from another device is ready to review. ':s.busy?'Saving to your account… ':'Signed in as '+s.owner.username+'. '):'Your work saves on this device. ';addLink();}root.dispatchEvent(new Event('cluevera-sync-change'));}});
 for(const name of ['getItem','setItem','removeItem'])Storage.prototype[name]=function(key,...args){const known=this===root.localStorage&&Object.hasOwn(P.KEYS,String(key)),mapped=known?controller.physical(String(key)):key;const value=native[name].call(this,mapped,...args);if(known&&name!=='getItem')changed();return value;};
 root.ClueveraAccount=controller;
 document.addEventListener('DOMContentLoaded',()=>{banner=document.createElement('aside');banner.id='account-status';banner.setAttribute('aria-label','Account and saving');banner.style.cssText='padding:12px 20px;background:#edf4f2;color:#173c34;font:14px system-ui;display:block';document.body.prepend(banner);controller.refresh().then(result=>{if(result.user&&result.user.id===controller.state().owner?.id)return controller.sync(accountPage);}).catch(showError);});
 root.addEventListener('online',()=>controller.sync(false).catch(showError));
}catch(e){root.ClueveraSyncError=e.message;}
})(typeof window==='undefined'?globalThis:window);
