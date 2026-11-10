(function(root){
'use strict';
// Metadata only: never navigate, fetch, inspect an answer, or write browser storage.
const document=root.document,config=root.QuidenceSEOConfig;
if(!document||!config)return;
function element(selector,tag,attributes){
  const matches=[...document.head.querySelectorAll(selector)];
  const node=matches.shift()||document.createElement(tag);
  for(const other of matches)other.remove();
  for(const [name,value]of Object.entries(attributes))if(node.getAttribute(name)!==value)node.setAttribute(name,value);
  node.setAttribute('data-no-translate','');
  if(!node.parentNode)document.head.appendChild(node);
  return node;
}
function apply(){
  const metadata=config.resolve(root.location.href);
  if(!metadata)return;
  const title=element('title','title',{});
  if(title.textContent!==metadata.title)title.textContent=metadata.title;
  element('meta[name="description"]','meta',{name:'description',content:metadata.description});
  element('link[rel="canonical"]','link',{rel:'canonical',href:metadata.canonical});
  element('meta[name="robots"]','meta',{name:'robots',content:metadata.noindex?'noindex, follow':'index, follow'});
  for(const [property,content]of [['og:type','website'],['og:site_name','Quidence'],['og:title',metadata.title],['og:description',metadata.description],['og:url',metadata.canonical],['og:locale','en_US'],['og:image',config.ORIGIN+'/assets/quidence-share.png']])element('meta[property="'+property+'"]','meta',{property,content});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})(typeof window==='object'?window:globalThis);
