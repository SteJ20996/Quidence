'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const SEO=require('../assets/seo-config.js');
test('dialogue metadata stays English for every incoming language and never advertises a translated activity',()=>{
 for(const lang of ['en','es','zh','zh-CN','zh-TW','zh-Hans','zh-Hant']){
  const metadata=SEO.resolve('/modules/ad01/dist/think/?lang='+lang);
  assert.equal(metadata.locale,'en');assert.match(metadata.title,/Think in motion/);
  assert.equal(metadata.canonical,'https://www.quidence.com/modules/ad01/dist/think/');
  assert.deepEqual(metadata.alternates,[]);
 }
 // The pages around the dialogue are English too, whatever the address asks for.
 assert.equal(SEO.resolve('/modules/ad01/dist/checks/?lang=es').locale,'en');
 assert.equal(SEO.resolve('/diagnostics/?module=ad01&lang=es').locale,'en');
});
test('English-only runtime refuses locale changes without fetching translations or rewriting general preferences',async()=>{
 const records=new Map([['quidence_ui_locale_v1','es'],['learner-draft','Original words: 中文 / Español / −3/4']]),before=[...records],events=[];
 const document={readyState:'loading',documentElement:{getAttribute:name=>name==='data-fixed-language'?'en':null,lang:'es'},querySelectorAll:()=>[],createTreeWalker:()=>({nextNode:()=>null}),addEventListener(){},dispatchEvent:e=>events.push(e),createElement(){throw Error('Translations must not load on this page');}};
 const window={document,location:{href:'https://www.quidence.com/modules/ad01/dist/think/?lang=zh-Hant'},history:{replaceState(){throw Error('The address is not rewritten');}},localStorage:{getItem:key=>records.get(key),setItem:(key,value)=>records.set(key,value)},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/i18n.js'),'utf8'),{window,URL,Intl});
 for(const request of ['es','zh','zh-Hant','en'])assert.equal(await window.QuidenceI18n.setLocale(request),'en');
 assert.equal(window.QuidenceI18n.locale,'en');assert.deepEqual([...window.QuidenceI18n.missing],[]);
 // Text passes through unchanged, and the page is marked English once it is drawn.
 assert.equal(window.QuidenceI18n.text('Original words: 中文 / Español'),'Original words: 中文 / Español');
 window.QuidenceI18n.apply(document);assert.equal(document.documentElement.lang,'en');
 // The saved preference and the learner's words stay exactly as they were; no language event is sent.
 assert.deepEqual([...records],before);assert.equal(events.length,0);
});
