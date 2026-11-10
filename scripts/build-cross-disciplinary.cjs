'use strict';
// Builds cross-disciplinary/data.json (the same shape as the Discrete Mathematics data plus the courses each step
// draws on) from content/cross-disciplinary/projects.cjs.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const OUT=path.join(root,'cross-disciplinary/data.json');
const {COURSES}=require('../assets/course-catalog.js');
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
function source(){delete require.cache[require.resolve('../content/cross-disciplinary/projects.cjs')];return require('../content/cross-disciplinary/projects.cjs');}
const en=t=>{if(!t||typeof t.en!=='string'||!t.en.trim())throw Error('Missing English text: '+JSON.stringify(t));return t.en;};
const courses=ids=>ids.map(id=>{if(!COURSES[id])throw Error('Unknown course '+id);return id;});
function field(f){
 const out={id:f.id,label:en(f.label),type:f.type};
 if(f.type==='number'){out.answer=f.answer;out.accepted=f.accepted;if(f.minDecimalPlaces)out.minDecimalPlaces=f.minDecimalPlaces;}
 else if(f.type==='reason'){out.criteria=f.criteria.map(en);if(f.followup)out.followup=en(f.followup);}
 else{out.answer=f.answer;out.options=f.options.map(o=>({value:o.value,label:en(o.label)}));}
 return out;
}
function data(){
 return source().map((p,i)=>({id:p.id,order:i+1,name:en(p.name),title:en(p.title),level:p.level,difficulty:p.difficulty,lab:p.lab,subjects:courses(p.subjects),topic:en(p.topic),prompt:en(p.prompt),approach:en(p.approach),uses:en(p.uses),
  steps:p.steps.map(s=>({title:en(s.title),connects:courses(s.connects),banner:s.banner,prompt:en(s.prompt),proof:s.proof.map(en).join('\n\n'),fields:s.fields.map(field)})),nextCheck:en(p.nextCheck)}));
}
function serialized(){return JSON.stringify(data(),null,1)+'\n';}
if(require.main===module){
 const text=serialized();
 if(process.argv.includes('--check')){if(!fs.existsSync(OUT)||fs.readFileSync(OUT,'utf8')!==text){console.error('cross-disciplinary/data.json is out of date. Run node scripts/build-cross-disciplinary.cjs');process.exit(1);}console.log('Cross-disciplinary data is up to date.');}
 else{fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,text);const d=JSON.parse(text);console.log(JSON.stringify({projects:d.length,steps:d.reduce((n,p)=>n+p.steps.length,0),fields:d.reduce((n,p)=>n+p.steps.reduce((m,s)=>m+s.fields.length,0),0)}));}
}
module.exports={data,serialized,OUT};
