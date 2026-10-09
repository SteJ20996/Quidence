(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceI18n=api;})(typeof window==='object'?window:globalThis,root=>{
'use strict';
const KEY='quidence_ui_locale_v1',normalize=s=>String(s??'').replace(/\s+/g,' ').trim();
const protectedSelector='[data-no-translate],textarea,input,pre,code,blockquote,[contenteditable],.student-work,.f-quote,.f-answer-text';
const textMemory=new WeakMap(),attributeMemory=new WeakMap(),imageMemory=new WeakMap();
let locale='en',observer=null,pending=false,control=null,phraseIndex=null;
const markdownMemory=new WeakMap();
const catalog=()=>root.QuidenceSpanish||{};
function translate(key){
 const direct=catalog()[key];if(direct!==undefined)return direct;
 const count=key.match(/^All (\d+) questions$/);if(count)return 'Todas las '+count[1]+' preguntas';
 const question=key.match(/^Question (\d+) of (\d+)$/);if(question)return 'Pregunta '+question[1]+' de '+question[2];
 if(key===key.toUpperCase()){
  const match=Object.keys(catalog()).find(k=>k.toUpperCase()===key);if(match)return catalog()[match].toUpperCase();
 }
 if(!phraseIndex){phraseIndex=new Map();for(const k of Object.keys(catalog())){
  if(!k||/^<\/?[a-z]/i.test(k)||k.startsWith('"')||k.startsWith('>'))continue;
  const first=k[0];if(!phraseIndex.has(first))phraseIndex.set(first,[]);phraseIndex.get(first).push(k);
 }for(const bucket of phraseIndex.values())bucket.sort((a,b)=>b.length-a.length);}
 let output='',i=0;
 while(i<key.length){let found;
  if(i===0||!/[\p{L}\p{N}_]/u.test(key[i-1]))for(const k of phraseIndex.get(key[i])||[]){
   if(key.startsWith(k,i)&&(i+k.length===key.length||!/[\p{L}\p{N}_]/u.test(key[i+k.length]))){found=k;break;}
  }
  if(found){output+=catalog()[found];i+=found.length;}else output+=key[i++];
 }
 return output;
}
function text(source){
 const input=String(source??'');if(locale!=='es')return input;
 return input.match(/^\s*/)[0]+translate(normalize(input))+input.match(/\s*$/)[0];
}
function protect(element){return !!element?.closest?.(protectedSelector)||['SCRIPT','STYLE','NOSCRIPT'].includes(element?.tagName);}
function apply(scope=root.document){
 if(!scope)return;const document=scope.ownerDocument||scope;
 for(const option of scope.querySelectorAll?.('option:not([value])')||[])option.setAttribute('value',option.textContent);
 const walker=document.createTreeWalker(scope,4),nodes=[];let node;
 while((node=walker.nextNode()))nodes.push(node);
 for(node of nodes){
  if(protect(node.parentElement))continue;
  let saved=textMemory.get(node);if(!saved||node.data!==saved.output)saved={source:node.data,output:node.data};
  const output=text(saved.source);saved.output=output;textMemory.set(node,saved);if(node.data!==output)node.data=output;
 }
 for(const element of scope.querySelectorAll?.('[aria-label],[placeholder],[title],[alt],option')||[]){
  if(protect(element)&&element.tagName!=='INPUT'&&element.tagName!=='TEXTAREA')continue;
  // An option without an explicit value otherwise changes its answer value
  // when its visible caption changes language.
  if(element.tagName==='OPTION'&&!element.hasAttribute('value'))element.setAttribute('value',element.textContent);
  let memory=attributeMemory.get(element);if(!memory){memory={};attributeMemory.set(element,memory);}
  for(const name of ['aria-label','placeholder','title','alt']){
   if(!element.hasAttribute(name))continue;const current=element.getAttribute(name);
   let saved=memory[name];if(!saved||current!==saved.output)saved={source:current,output:current};
   const output=text(saved.source);saved.output=output;memory[name]=saved;if(current!==output)element.setAttribute(name,output);
  }
 }
 for(const area of scope.querySelectorAll?.('textarea[data-i18n-markdown]')||[]){
  let saved=markdownMemory.get(area);if(!saved||area.value!==saved.output)saved={source:area.value,output:area.value};
  saved.output=markdown(saved.source);markdownMemory.set(area,saved);area.value=saved.output;
 }
 for(const img of scope.querySelectorAll?.('img[src*="assets/illustrations/"]')||[]){
  let saved=imageMemory.get(img);if(!saved){saved=img.getAttribute('src');imageMemory.set(img,saved);}
  img.setAttribute('src',locale==='es'?saved.replace(/(?<!-es)\.svg(?=\?|$)/,'-es.svg'):saved);
 }
 for(const link of scope.querySelectorAll?.('a[href]')||[]){
  const href=link.getAttribute('href');if(!href||link.hasAttribute('download')||/^(?:#|mailto:|blob:|data:|javascript:)/i.test(href))continue;
  try{const url=new URL(href,root.location.href);if(url.origin!==root.location.origin||/\.(?:json|md|zip|pdf)$/i.test(url.pathname))continue;url.searchParams.set('lang',locale);const next=href.split(/[?#]/)[0]+url.search+url.hash;if(href!==next)link.setAttribute('href',next);}catch{}
 }
 document.documentElement.lang=locale;
 if(control)control.value=locale;
}
function schedule(){if(pending)return;pending=true;root.queueMicrotask(()=>{pending=false;observer?.disconnect();apply();observe();});}
function observe(){observer?.observe(root.document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});}
function setLocale(next){
 locale=next==='es'?'es':'en';try{root.localStorage.setItem(KEY,locale);}catch{}
 if(root.location&&root.history){const url=new URL(root.location.href);url.searchParams.set('lang',locale);root.history.replaceState(root.history.state,'',url);}
 observer?.disconnect();apply();observe();root.document?.dispatchEvent(new root.CustomEvent('quidence:language',{detail:{locale}}));return locale;
}
function markdown(source){
 // Never translate quoted original answers or code/JSON records. For mixed
 // evidence lines only a known heading is translated; the student suffix stays.
 let fenced=false,originalBlock=false;return String(source).split('\n').map(line=>{
  if(/^\s*(```+|~~~+)/.test(line)){fenced=!fenced;return line;}
  if(fenced||/^\s*>/.test(line))return line;
  if(originalBlock){if(!line.trim()||/^(?:Other help reported|Earlier report viewed|Reference mathematics|Next check):/.test(line))originalBlock=false;else return line;}
  if(/^(?:Student explanation|Explanation \(human review\)|Explanation for (?:human )?review|Current revision is not submitted\. Draft explanation|Unsaved reviewer draft|Reviewed explanation|Reviewer note)/.test(line)){const colon=line.indexOf(':');originalBlock=true;return colon<0?line:text(line.slice(0,colon+1))+line.slice(colon+1);}
  if(/^(?:Unsaved reviewer draft|Reviewer note|Review note|Local review of|Local review:|Local part review|Part review)/.test(line)){const colon=line.indexOf(':');return colon<0?line:text(line.slice(0,colon+1))+line.slice(colon+1);}
  const heading=line.match(/^(#{1,6}\s+|[-*]\s+)?(.*)$/);return (heading[1]||'')+text(heading[2]);
 }).join('\n');
}
function markdownArea(area,source){const output=markdown(source);if(area){area.setAttribute('data-i18n-markdown','');markdownMemory.set(area,{source,output});area.value=output;}return output;}
function html(source){
 if(locale==='en'||!root.DOMParser)return source;
 const doc=new root.DOMParser().parseFromString(source,'text/html');apply(doc);return '<!doctype html>\n'+doc.documentElement.outerHTML;
}
function start(){
 const requested=new URL(root.location.href).searchParams.get('lang');let stored='';try{stored=root.localStorage.getItem(KEY)||'';}catch{}
 locale=requested==='es'||requested==='en'?requested:stored==='es'?'es':'en';
 if(requested==='es'||requested==='en')try{root.localStorage.setItem(KEY,locale);}catch{}
 const toolbar=root.document.createElement('nav');toolbar.className='language-toolbar';toolbar.setAttribute('aria-label','Language');
 const label=root.document.createElement('label');label.className='language-label';label.appendChild(root.document.createTextNode('Language'));
 control=root.document.createElement('select');control.setAttribute('aria-label','Language');control.id='quidence-language';
 label.setAttribute('for','quidence-language');
 for(const [value,caption]of [['en','English'],['es','Español']]){const option=root.document.createElement('option');option.value=value;option.textContent=caption;option.lang=value;option.setAttribute('data-no-translate','');control.appendChild(option);}
 control.value=locale;control.addEventListener('change',()=>setLocale(control.value));label.appendChild(control);toolbar.appendChild(label);
 const header=root.document.querySelector('.site-header');
 if(header){const group=root.document.createElement('div');group.className='header-tools';const preview=header.querySelector('.preview-label');if(preview)group.appendChild(preview);group.appendChild(toolbar);header.appendChild(group);}
 else root.document.body.prepend(toolbar);
 apply();observer=new root.MutationObserver(schedule);observe();
 root.addEventListener('storage',event=>{if(event.key===KEY)setLocale(event.newValue);});
}
if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
return {text,markdown,markdownArea,html,apply,setLocale,get locale(){return locale;},normalize,KEY,protectedSelector};
});
