'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const inventory=JSON.parse(fs.readFileSync(path.join(root,'localization/source-inventory.json')));
const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
const normalize=s=>String(s).replace(/&(#x[\da-f]+|#\d+|\w+);/gi,(_,e)=>e[0]==='#'?String.fromCodePoint(parseInt(e.slice(e[1]==='x'?2:1),e[1]==='x'?16:10)):entities[e]||'&'+e+';').replace(/\s+/g,' ').trim();
const translated=new Map();
for(const file of fs.readdirSync(path.join(root,'localization')).filter(f=>/^es-.*\.tsv$/.test(f)).sort()){
 for(const line of fs.readFileSync(path.join(root,'localization',file),'utf8').split('\n')){
  if(!line.trim()||line.startsWith('#'))continue;const split=line.indexOf('\t');if(split<0)throw Error('Invalid translation row in '+file);
  const id=Number(line.slice(0,split));if(!inventory[id]||inventory[id].id!==id)throw Error('Unknown translation id '+id);
  const value=normalize(line.slice(split+1));if(!value)throw Error('Empty translation '+id);
  if(translated.has(id)&&translated.get(id)!==value)throw Error('Conflicting translation '+id);translated.set(id,value);
 }
}
const catalog={};for(const [id,value]of translated){const key=normalize(inventory[id].text);if(Object.hasOwn(catalog,key)&&catalog[key]!==value)throw Error('Conflicting normalized source '+key);catalog[key]=value;}
for(const file of fs.readdirSync(path.join(root,'localization')).filter(f=>f.endsWith('-extra-es.json')).sort()){
 for(const [key,value]of Object.entries(JSON.parse(fs.readFileSync(path.join(root,'localization',file),'utf8')))){catalog[normalize(key)]=normalize(value);}
}
// Rendered Markdown headings omit their source markup prefix.
Object.assign(catalog,require('./number-theory-locales.cjs').numberTheoryCatalog());
Object.assign(catalog,require('../assets/additional-foundations.js').SPANISH);
for(const [key,value]of Object.entries(catalog)){if(/^#{1,6}\s/.test(key)){const clean=key.replace(/^#{1,6}\s+/,'');if(!Object.hasOwn(catalog,clean))catalog[clean]=value.replace(/^#{1,6}\s+/,'');}}
// US spelling changes are presentation aliases, not new question definitions.
const american=s=>s.replace(/\bAnalyse\b/g,'Analyze').replace(/\banalyse\b/g,'analyze').replace(/\bmodelling\b/g,'modeling').replace(/\btravelled\b/g,'traveled').replace(/\bkilometres\b/g,'kilometers').replace(/\bkilometre\b/g,'kilometer').replace(/\bmetres\b/g,'meters').replace(/\bmetre\b/g,'meter').replace(/\blitres\b/g,'liters').replace(/\blitre\b/g,'liter');
for(const [key,value]of Object.entries(catalog)){const alias=american(key);if(!Object.hasOwn(catalog,alias))catalog[alias]=value;}
// Reviewed UI terminology for the US Spanish audience. Mathematics stays intact.
for(const key of Object.keys(catalog))catalog[key]=catalog[key].replace(/\bIntroduce\b/g,'Ingresa').replace(/\bintroduce\b/g,'ingresa').replace(/\basignatura\b/g,'materia').replace(/Álgebra Lineal/g,'Álgebra lineal').replace(/[«“"](?:Todavía no estoy seguro|No estoy seguro)[»”"]/g,'«Aún no estoy seguro»').replace(/^Comprobar fundamentos$/,'Comprueba los fundamentos');
const quantities=JSON.parse(fs.readFileSync(path.join(root,'localization/quantity-templates-es.json'),'utf8'));
for(const [en,es]of quantities)if(en.split('[n]').length!==es.split('[n]').length)throw Error('Quantity template changes numeric slots: '+en);
fs.writeFileSync(path.join(root,'assets/i18n-es.js'),"(function(root){'use strict';root.QuidenceSpanish=Object.freeze("+JSON.stringify(catalog,null,2)+");root.QuidenceSpanishQuantities=Object.freeze("+JSON.stringify(quantities)+");})(typeof window==='object'?window:globalThis);\n");
// Keep the complete catalog for portable reports and compatibility. Browser
// pages load common copy plus their own course's long, source-scoped passages.
const groups=['aa01','ab01','ac01','ad01','ae01','af01','number-theory'];
const buckets=Object.fromEntries(groups.map(group=>[group,{}]));
const owner=new Map();
for(const item of inventory){
 const scoped=new Set(item.files.map(file=>file.match(/^modules\/(aa01|ab01|ac01|ad01|ae01|af01)\/dist\//)?.[1]||null));
 if(scoped.size===1&&!scoped.has(null)&&normalize(item.text).length>80)owner.set(normalize(item.text),[...scoped][0]);
}
for(const key of Object.keys(require('./number-theory-locales.cjs').numberTheoryCatalog())){
 if(key.length>80&&!inventory.some(item=>normalize(item.text)===key&&item.files.some(file=>!file.startsWith('courses/number-theory/'))))owner.set(key,'number-theory');
}
const common={};
for(const [key,value]of Object.entries(catalog)){
 const group=owner.get(key)||owner.get(key.replace(/^#{1,6}\s+/,''));
 (group?buckets[group]:common)[key]=value;
}
const directory=path.join(root,'assets/i18n-es');fs.mkdirSync(directory,{recursive:true});
for(const [group,entries]of Object.entries({common,...buckets})){
 const extra=group==='common'?';root.QuidenceSpanishQuantities=Object.freeze('+JSON.stringify(quantities)+')':'';
 fs.writeFileSync(path.join(directory,group+'.js'),"(function(root){'use strict';root.QuidenceSpanish=Object.freeze(Object.assign({},root.QuidenceSpanish,"+JSON.stringify(entries)+"))"+extra+";})(typeof window==='object'?window:globalThis);\n");
}
console.log(JSON.stringify({translated:translated.size,catalogEntries:Object.keys(catalog).length,inventory:inventory.length}));
