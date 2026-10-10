'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
function numberTheoryCatalog(){
 const source=JSON.parse(fs.readFileSync(path.join(root,'courses/number-theory/data.json'))),translations={};
 for(const file of fs.readdirSync(path.join(root,'localization')).filter(f=>/^number-theory-es-mx(?:-\d+)?\.json$/.test(f))){
  for(const [id,p]of Object.entries(JSON.parse(fs.readFileSync(path.join(root,'localization',file))))){if(translations[id])throw Error('Duplicate Number Theory translation '+id);translations[id]=p;}
 }
 const catalog={},mathOnly=s=>!/[A-Za-z]{2}/.test(s.replace(/\b(?:gcd|lcm|mod|pq|cm)\b/g,''));
 const add=(en,es,label)=>{if(es===undefined&&mathOnly(en))es=en;if(typeof es!=='string'||!es.trim())throw Error('Missing Spanish: '+label+' '+en);const key=normalize(en),value=normalize(es);if(catalog[key]&&catalog[key]!==value)throw Error('Conflicting Spanish '+key);catalog[key]=value;};
 for(const p of source){const t=translations[p.id];if(!t||t.steps.length!==p.steps.length)throw Error('Missing project/steps '+p.id);
  for(const key of ['title','prompt','approach','uses','nextCheck'])add(p[key],t[key],p.id+'.'+key);
  p.steps.forEach((s,i)=>{const st=t.steps[i],label=p.id+'.steps.'+i;for(const key of ['title','prompt'])add(s[key],st[key],label+'.'+key);
   const paragraphs=s.proof.split(/\n\s*\n/).filter(Boolean);if(st.proof.length!==paragraphs.length)throw Error('Proof paragraph count '+label);paragraphs.forEach((en,j)=>add(en,st.proof[j],label+'.proof.'+j));
   s.fields.forEach(f=>{const ft=st.fields[f.id]||{};add(f.label,ft.label,label+'.'+f.id+'.label');
    for(const o of f.options||[])add(o.label,ft.options?.[o.value],label+'.'+f.id+'.'+o.value);
    if(f.criteria){if(ft.criteria?.length!==f.criteria.length)throw Error('Missing criteria '+label+'.'+f.id);f.criteria.forEach((en,j)=>add(en,ft.criteria[j],label+'.'+f.id+'.criteria.'+j));add(f.label+' · Self-check',catalog[normalize(f.label)]+' · Autoevaluación',label);}
    if(f.followup){add(f.followup,ft.followup,label+'.'+f.id+'.followup');add('One more question: '+f.followup,'Una pregunta más: '+ft.followup,label);}
   });
  });
 }
 if(Object.keys(translations).length!==source.length)throw Error('Unknown translated project');return catalog;
}
module.exports={numberTheoryCatalog};
