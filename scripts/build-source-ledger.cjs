'use strict';
// Inventory and change detection, not an originality or copyright clearance test.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),digest=x=>createHash('sha256').update(x).digest('hex');
function stable(value){if(Array.isArray(value))return value.map(stable);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(k=>k!=='provenance').map(k=>[k,stable(value[k])]));return value;}
function build(){
 const items=[],active=new Set(Object.keys(require('../assets/course-catalog.js').COURSES));
 function add(family,module,task,sourceFiles,extra={}){
  const id=family+':'+module+':'+task.id;
  items.push({id,family,module,taskId:task.id,title:task.title||task.prompt,bankVersion:extra.bankVersion||task.version||null,availability:module==='aa01'||active.has(module)?'active':'historical-only',fingerprint:digest(JSON.stringify(stable(task))),fingerprintScope:'task definition excluding provenance label',sourceFiles:sourceFiles.map(file=>({path:file,sha256:digest(fs.readFileSync(path.join(root,file)))})),sourceReview:{status:'not-cleared',reviewer:null,evidence:[],next:'Compare wording, scene, data, solution and every diagram against known inspirations; document human edits and permissions where needed.'},mathematicsReview:{status:'not-human-certified',automatedReference:extra.automatedReference||null},...extra});
 }
 for(const[family,file,audit]of [['diagnostic','assets/challenge-bank.js','review/challenge-math-audit.json'],['project','assets/project-bank.js','review/project-math-audit.json'],['foundation','assets/foundation-bank.js',null],['followup','assets/foundation-extension.js',null]]){
  const bank=require(path.join(root,file));for(const[module,m]of Object.entries(bank.MODULES))for(const task of m.tasks)add(family,module,task,bank.SOURCE_FILES||(family==='foundation'?[file,'assets/subject-foundations.js']:[file]),{bankVersion:bank.VERSION,automatedReference:audit});
 }
 const school=require('../assets/school-course-content.js');
 for(const module of [...school.IDS,'ad01','ae01','af01']){
  const file=school.IDS.includes(module)?'assets/school-course-content.js':`modules/${module}/dist/content.js`,content=school.IDS.includes(module)?school.create(module):require(path.join(root,file));
  for(const lesson of content.LESSONS)for(const task of [lesson.predict,...lesson.checks])add('lesson',module,task,[file,'assets/course-models.js','assets/course-graphs.js'],{bankVersion:content.VERSION});
 }
 const physics=require('../courses/physics/content.js');
 for(const lesson of physics.LESSONS)for(const task of [lesson.predict,...lesson.checks])add('lesson','physics',task,['courses/physics/content.js','assets/physics-models.js'],{bankVersion:physics.VERSION});
 for(const module of ['physics-1','physics-2']){const physics=require('../courses/'+module+'/content.js');for(const lesson of physics.LESSONS)for(const task of [lesson.predict,...lesson.checks])add('lesson',module,task,['courses/'+module+'/content.js','assets/physics-foundation-content.js','courses/physics/content.js','assets/physics-foundation-models.js'],{bankVersion:physics.VERSION});}
 const linear=require('../modules/ab01/dist/learning-engine.js');for(const[stage,tasks]of Object.entries(linear.TASKS))for(const task of tasks)add('matrix-'+stage,'ab01',task,['modules/ab01/dist/learning-engine.js']);
 const adaptive=require('../modules/aa01/dist/adaptive.js');for(const[id,task]of Object.entries(adaptive.tasks))add('algebra-adaptive','aa01',{id,...task},['modules/aa01/dist/adaptive.js','modules/aa01/dist/app.js']);
 const h=require('../modules/aa01/tests/workspace.cjs').load({expose:'window.testOnly={state,goto};'}),api=h.api;
 for(const id of [...api.state.queue,'QN']){
  if(!api.state.queue.includes(id))api.state.queue.push(id);api.goto(api.state.queue.indexOf(id));
  const lead=h.app.innerHTML.match(/<p class="lead">([\s\S]*?)<\/p>/)?.[1]||id;
  add('visual-algebra','aa01',{id,prompt:lead},['modules/aa01/dist/app.js','modules/aa01/dist/integrated.js','modules/aa01/dist/geometry.js'],{fingerprintScope:'rendered lead prompt; full-file hashes cover remaining fields and figures',sourceConcern:['C11','QP','QN'].includes(id)?'Q11/P4 candidates trace to D01/D08; earlier mixed-source B01/B08 inspirations are unresolved. Compare against the original PDF; new code is not rights clearance.':null});
 }
 return{schema:'quidence-source-review-1',date:'2026-10-08',status:'inventory-only',interpretation:'No item is cleared by generation, mathematical tests, a fingerprint or an originality label. Human contribution, source comparison and any required permission remain unverified. Review records must be retained separately when this snapshot is rebuilt.',scope:'Active structured task banks, course checks, matrix learning tasks, adaptive algebra and visual-algebra main prompts. Retired foundation/followup definitions retained and marked historical-only. Not a complete inventory of tutorial prose, all interactive matrix guides, external links, logos or archived files.',items:items.sort((a,b)=>a.id.localeCompare(b.id))};
}
const target=path.join(root,'review/source-ledger.json');
if(require.main===module){const text=JSON.stringify(build(),null,2)+'\n';if(process.argv.includes('--check')){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==text){console.error('Source inventory is stale; rebuild and review changed entries.');process.exitCode=1;}}else{fs.writeFileSync(target,text);console.log(JSON.stringify({items:JSON.parse(text).items.length,output:'review/source-ledger.json'}));}}
module.exports={build};
