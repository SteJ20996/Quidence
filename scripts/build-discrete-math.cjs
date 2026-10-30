'use strict';
// Builds courses/discrete-math/data.json (English, the same shape as the Number Theory data) from the
// bilingual source in content/discrete-math/projects.cjs, and exposes the English → Spanish catalog
// that scripts/build-locales.cjs merges into the Spanish locale.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const OUT=path.join(root,'courses/discrete-math/data.json');
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
function source(){delete require.cache[require.resolve('../content/discrete-math/projects.cjs')];return require('../content/discrete-math/projects.cjs');}
const en=t=>{if(!t||typeof t.en!=='string'||typeof t.es!=='string'||!t.en.trim()||!t.es.trim())throw Error('Missing English or Spanish text: '+JSON.stringify(t));return t.en;};
function field(f){
 const out={id:f.id,label:en(f.label),type:f.type};
 if(f.type==='number'){out.answer=f.answer;out.accepted=f.accepted;if(f.minDecimalPlaces)out.minDecimalPlaces=f.minDecimalPlaces;}
 else if(f.type==='reason'){out.criteria=f.criteria.map(en);if(f.followup)out.followup=en(f.followup);}
 else{out.answer=f.answer;out.options=f.options.map(o=>({value:o.value,label:en(o.label)}));}
 return out;
}
function data(){
 return source().map((p,i)=>({id:p.id,order:i+1,title:en(p.title),level:p.level,difficulty:p.difficulty,topic:en(p.topic),prompt:en(p.prompt),approach:en(p.approach),uses:en(p.uses),
  steps:p.steps.map(s=>({title:en(s.title),prompt:en(s.prompt),proof:s.proof.map(en).join('\n\n'),fields:s.fields.map(field)})),nextCheck:en(p.nextCheck)}));
}
function discreteMathCatalog(){
 const catalog={};
 const add=t=>{const key=normalize(t.en),value=normalize(t.es);if(catalog[key]&&catalog[key]!==value)throw Error('Conflicting Spanish for '+key);catalog[key]=value;};
 for(const p of source()){
  for(const k of ['title','topic','prompt','approach','uses','nextCheck'])add(p[k]);
  for(const s of p.steps){add(s.title);add(s.prompt);s.proof.forEach(add);
   for(const f of s.fields){add(f.label);for(const o of f.options||[])add(o.label);
    if(f.criteria){f.criteria.forEach(add);add({en:f.label.en+' · Self-check',es:f.label.es+' · Autoevaluación'});}
    if(f.followup){add(f.followup);add({en:'One more question: '+f.followup.en,es:'Una pregunta más: '+f.followup.es});}
   }
  }
 }
 return catalog;
}
function serialized(){return JSON.stringify(data(),null,1)+'\n';}
if(require.main===module){
 const text=serialized();
 if(process.argv.includes('--check')){if(!fs.existsSync(OUT)||fs.readFileSync(OUT,'utf8')!==text){console.error('courses/discrete-math/data.json is out of date. Run node scripts/build-discrete-math.cjs');process.exit(1);}console.log('Discrete Math data is up to date.');}
 else{fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,text);console.log(JSON.stringify({projects:JSON.parse(text).length,steps:JSON.parse(text).reduce((n,p)=>n+p.steps.length,0),fields:JSON.parse(text).reduce((n,p)=>n+p.steps.reduce((m,s)=>m+s.fields.length,0),0)}));}
}
module.exports={data,discreteMathCatalog,serialized,OUT};
