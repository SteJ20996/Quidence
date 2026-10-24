'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const SEO=require('../assets/seo-config.js');
test('dialogue metadata stays English for every incoming language and never advertises a translated activity',()=>{
 for(const lang of ['en','es','zh','zh-CN','zh-TW','zh-Hans','zh-Hant']){
  const metadata=SEO.resolve('/modules/ad01/dist/think/?lang='+lang,'es');
  assert.equal(metadata.locale,'en');assert.match(metadata.title,/Think in motion/);
  assert.equal(metadata.canonical,'https://www.quidence.com/modules/ad01/dist/think/?lang=en');
  assert.deepEqual(metadata.alternates,[['en',metadata.canonical]]);
 }
 assert.equal(SEO.resolve('/modules/ad01/dist/checks/?lang=es').locale,'es');
 assert.equal(SEO.resolve('/diagnostics/?module=ad01&lang=es').locale,'es');
});
test('English-only runtime refuses locale changes without fetching translations or rewriting general preferences',async()=>{
 const records=new Map([['quidence_ui_locale_v1','es'],['learner-draft','Original words: 中文 / Español / −3/4']]),before=[...records],events=[];
 const document={readyState:'loading',documentElement:{getAttribute:name=>name==='data-fixed-language'?'en':null,lang:'en'},querySelectorAll:()=>[],createTreeWalker:()=>({nextNode:()=>null}),addEventListener(){},dispatchEvent:e=>events.push(e),createElement(){throw Error('Translations must not load on this page');}};
 const window={document,location:{href:'https://www.quidence.com/modules/ad01/dist/think/?lang=zh-Hant'},history:{replaceState(_a,_b,url){window.location.href=String(url);}},localStorage:{getItem:key=>records.get(key),setItem:(key,value)=>records.set(key,value)},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/i18n.js'),'utf8'),{window,URL,Intl});
 for(const request of ['es','zh','zh-Hant','en'])assert.equal(await window.QuidenceI18n.setLocale(request),'en');
 assert.equal(document.documentElement.lang,'en');assert.equal(new URL(window.location.href).searchParams.get('lang'),'en');
 assert.deepEqual([...records],before);assert(events.every(e=>e.detail.locale==='en'));
});
