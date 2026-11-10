(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceI18n=api;})(typeof window==='object'?window:globalThis,root=>{
'use strict';
// Quidence is published in English only (see AGENTS.md). This module keeps the small interface that pages
// already call: dates are written in one English format, and text, Markdown and HTML pass through unchanged.
// A language saved in an earlier version stays in storage, untouched, and no longer changes anything.
const KEY='quidence_ui_locale_v1',normalize=s=>String(s??'').replace(/\s+/g,' ').trim();
const protectedSelector='[data-no-translate],textarea,input,pre,code,blockquote,[contenteditable],.student-work,.f-quote,.f-answer-text';
const formatter=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
function date(source){const d=new Date(source);return Number.isNaN(d.getTime())?String(source):formatter.format(d);}
const text=source=>String(source??'');
const markdown=source=>String(source);
function markdownArea(area,source){const output=markdown(source);if(area)area.value=output;return output;}
const html=source=>source;
// Elements that carry a saved time show it in the same English format everywhere.
function apply(scope=root.document){
 if(!scope)return;
 for(const element of scope.querySelectorAll?.('[data-i18n-date]')||[]){const output=date(element.getAttribute('data-i18n-date'))+(element.hasAttribute('data-date-caption')?' · '+element.getAttribute('data-date-caption'):'');if(element.textContent!==output)element.textContent=output;}
 const document=scope.ownerDocument||scope;if(document.documentElement&&document.documentElement.lang!=='en')document.documentElement.lang='en';
}
const setLocale=async()=>'en';
function start(){
 apply();
 let pending=false;new root.MutationObserver(()=>{if(pending)return;pending=true;root.queueMicrotask(()=>{pending=false;apply();});}).observe(root.document.body,{childList:true,subtree:true});
}
if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
return {text,markdown,markdownArea,html,apply,setLocale,date,get missing(){return [];},clearMissing(){},get locale(){return 'en';},normalize,KEY,protectedSelector};
});
