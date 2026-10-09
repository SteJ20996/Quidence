'use strict';
// Development inventory only; nothing is automatically translated or scored.
const fs=require('node:fs'),path=require('node:path');
const {babelParse}=require(path.join(path.dirname(require.resolve('playwright/package.json')),'lib/transform/babelBundle.js'));
const root=path.resolve(__dirname,'..'),texts=new Map();
function add(source,file){
 if(typeof source!=='string')return;
 for(const part of source.split(/<\/?(?:html|head|body|title|meta|link|script|style|header|footer|main|nav|section|article|aside|div|span|p|h[1-6]|strong|em|small|a|button|label|input|textarea|select|option|ul|ol|li|details|summary|form|table|thead|tbody|tr|td|th|pre|code|svg|path|circle|rect|polygon|text|g|defs|marker|line|noscript)\b[^>]*>/i)){
  const text=part.trim();
  if(!/[A-Za-z]{3}/.test(text)||text.length>4000||(!/\s/.test(text)&&text.length<3)||/^(?:[.#/]|data-|aria-|https?:|[a-z]+_[a-z])/.test(text)||text.includes('=>')||/\{[^}]*:[^}]*\}/.test(text))continue;
  if(!texts.has(text))texts.set(text,new Set());texts.get(text).add(file);
 }
}
for(const file of require('./build-static-release.cjs').files().filter(f=>!f.startsWith('assets/i18n'))){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 if(file.endsWith('.js')){
  const ast=babelParse(source,file);
  function walk(node){if(!node||typeof node!=='object')return;if(node.type==='StringLiteral')add(node.value,file);if(node.type==='TemplateElement')add(node.value.cooked,file);for(const [key,value]of Object.entries(node)){if(['raw','loc'].includes(key))continue;if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')walk(value);}}
  walk(ast);
 }else if(file.endsWith('.html'))add(source,file);
}
const previous=JSON.parse(fs.readFileSync(path.join(root,'localization/source-inventory.json'),'utf8'));
const entries=previous.map(row=>({...row,files:[...(texts.get(row.text)||row.files)]})),known=new Set(previous.map(row=>row.text));
for(const [text,files]of texts)if(!known.has(text))entries.push({id:entries.length,text,files:[...files]});
fs.writeFileSync(path.join(root,'localization/source-inventory.json'),JSON.stringify(entries,null,2)+'\n');
console.log(JSON.stringify({strings:entries.length,words:entries.reduce((s,r)=>s+r.text.split(/\s/).length,0)}));
