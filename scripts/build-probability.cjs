'use strict';
// Builds courses/probability/data.json (the same shape as the Number Theory data) from content/probability/projects.cjs.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const OUT=path.join(root,'courses/probability/data.json');
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
function source(){delete require.cache[require.resolve('../content/probability/projects.cjs')];return require('../content/probability/projects.cjs');}
const en=t=>{if(!t||typeof t.en!=='string'||!t.en.trim())throw Error('Missing English text: '+JSON.stringify(t));return t.en;};
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
function serialized(){return JSON.stringify(data(),null,1)+'\n';}
if(require.main===module){
 const text=serialized();
 if(process.argv.includes('--check')){if(!fs.existsSync(OUT)||fs.readFileSync(OUT,'utf8')!==text){console.error('courses/probability/data.json is out of date. Run node scripts/build-probability.cjs');process.exit(1);}console.log('Probability data is up to date.');}
 else{fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,text);console.log(JSON.stringify({projects:JSON.parse(text).length,steps:JSON.parse(text).reduce((n,p)=>n+p.steps.length,0),fields:JSON.parse(text).reduce((n,p)=>n+p.steps.reduce((m,s)=>m+s.fields.length,0),0)}));}
}
module.exports={data,serialized,OUT};
