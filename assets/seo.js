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
function apply(locale){
  const metadata=config.resolve(root.location.href,locale);
  if(!metadata)return;
  const title=element('title','title',{});
  if(title.textContent!==metadata.title)title.textContent=metadata.title;
  element('meta[name="description"]','meta',{name:'description',content:metadata.description});
  element('link[rel="canonical"]','link',{rel:'canonical',href:metadata.canonical});
  element('meta[name="robots"]','meta',{name:'robots',content:metadata.noindex?'noindex, follow':'index, follow'});
  // Remove stale alternates only; original course links are untouched.
  const wanted=new Set(metadata.alternates.map(([lang])=>lang));
  for(const link of document.head.querySelectorAll('link[rel="alternate"][hreflang]'))if(!wanted.has(link.getAttribute('hreflang')))link.remove();
  for(const [lang,href]of metadata.alternates)element('link[rel="alternate"][hreflang="'+lang+'"]','link',{rel:'alternate',hreflang:lang,href});
  for(const [property,content]of [['og:type','website'],['og:site_name','Quidence'],['og:title',metadata.title],['og:description',metadata.description],['og:url',metadata.canonical],['og:locale',metadata.locale==='es'?'es_MX':'en_US'],['og:image',config.ORIGIN+'/assets/quidence-share.png']])element('meta[property="'+property+'"]','meta',{property,content});
}
function current(){apply(root.QuidenceI18n?.locale||document.documentElement?.lang||'en');}
document.addEventListener('quidence:language',event=>apply(event.detail.locale));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',current,{once:true});else current();
})(typeof window==='object'?window:globalThis);
