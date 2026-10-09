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
for(const [key,value]of Object.entries(catalog)){if(/^#{1,6}\s/.test(key)){const clean=key.replace(/^#{1,6}\s+/,'');if(!Object.hasOwn(catalog,clean))catalog[clean]=value.replace(/^#{1,6}\s+/,'');}}
// US spelling changes are presentation aliases, not new question definitions.
const american=s=>s.replace(/\bAnalyse\b/g,'Analyze').replace(/\banalyse\b/g,'analyze').replace(/\bmodelling\b/g,'modeling').replace(/\btravelled\b/g,'traveled').replace(/\bkilometres\b/g,'kilometers').replace(/\bkilometre\b/g,'kilometer').replace(/\bmetres\b/g,'meters').replace(/\bmetre\b/g,'meter').replace(/\blitres\b/g,'liters').replace(/\blitre\b/g,'liter');
for(const [key,value]of Object.entries(catalog)){const alias=american(key);if(!Object.hasOwn(catalog,alias))catalog[alias]=value;}
fs.writeFileSync(path.join(root,'assets/i18n-es.js'),"(function(root){'use strict';root.QuidenceSpanish=Object.freeze("+JSON.stringify(catalog,null,2)+");})(typeof window==='object'?window:globalThis);\n");
console.log(JSON.stringify({translated:translated.size,catalogEntries:Object.keys(catalog).length,inventory:inventory.length}));
