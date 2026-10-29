'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.join(__dirname,'..'),digest=s=>createHash('sha256').update(s).digest('hex');
function inventory(){
 const {CONTENT}=require('../courses/coordinate-geometry/content.mjs');
 const sourceFiles=['courses/coordinate-geometry/content.mjs','courses/coordinate-geometry/core.mjs','courses/coordinate-geometry/lessons.mjs'].map(file=>({path:file,sha256:digest(fs.readFileSync(path.join(root,file)))}));
 return{schema:'quidence-coordinate-source-review-1',module:'coordinate-geometry',status:'inventory-only',items:Object.entries(CONTENT).flatMap(([project,c])=>c.steps.map((step,index)=>({id:'coordinate-project-step:'+project+':'+index,project,step:index,title:step.title,fingerprint:digest(JSON.stringify(step)),sourceFiles,sourceReview:{status:'not-cleared',reviewer:null,evidence:[]},mathematicsReview:{status:'not-human-certified',automatedReference:'tests/coordinate-core.test.mjs'}})))};
}
function build(check=false){const file=path.join(root,'review/coordinate-source-ledger.json'),text=JSON.stringify(inventory(),null,2)+'\n';if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==text)throw Error('Coordinate Geometry source inventory is stale.');}else fs.writeFileSync(file,text);return{items:12};}
module.exports={build,inventory};if(require.main===module)console.log(JSON.stringify(build(process.argv.includes('--check'))));
