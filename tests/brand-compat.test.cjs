'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),Reports=require('../assets/report-store.js'),Tools=require('../assets/report-tools.js'),Policy=require('../assets/sync-policy.js'),Algebra=require('../modules/aa01/dist/session-store.js');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name==='.git'?[]:e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
test('all HTML pages and generated course templates use Quidence and the Q mark',()=>{
 for(const file of files(root).filter(p=>p.endsWith('.html')||p.endsWith('.html.source'))){const text=fs.readFileSync(file,'utf8');assert.doesNotMatch(text,/cluevera/i,path.relative(root,file));assert.doesNotMatch(text,/(?:brand-mark|brand-initial)[^>]*>C<\//,file);}
 assert.equal(require('../package.json').name,'quidence');
 for(const name of ['build-course-home.cjs','build-course-pages.cjs'])assert.doesNotMatch(fs.readFileSync(path.join(root,'scripts',name),'utf8'),/cluevera/i);
 assert.match(fs.readFileSync(path.join(root,'assets/favicon.svg'),'utf8'),/<title>Quidence<\/title>/);
});
test('pre-rename portfolios resume exact drafts, bank versions, submissions, reviews and geometry',()=>{
 const F=require('../assets/foundation-engine.js'),B=require('../assets/challenge-bank.js'),PB=require('../assets/project-bank.js'),T=require('../assets/project-tools.js'),fixtures=require('./fixtures/legacy-portfolios.json');
 const challenge=F.forBank(B,{VERSION:'challenge-no-followup',MODULES:{}},{schema:'cluevera_challenge_portfolio_v1',challenge:true});
 const projects=F.forBank(PB,{VERSION:'projects-no-followup',MODULES:{}},{schema:'cluevera_project_portfolio_v1',challenge:true,projects:true,fieldTypes:T.fieldTypes});
 for(const [kind,engine]of [['foundation',F],['challenge',challenge],['projects',projects]]){const expected=structuredClone(fixtures[kind]);if(kind==='foundation')for(const id of ['number-theory','physics-1','physics-2'])expected.modules[id]={active:null,sessions:[]};if(kind!=='foundation')for(const id of ['physics','physics-1','physics-2'])expected.modules[id]={active:null,sessions:[]};if(kind==='challenge')for(const id of ['number-theory','coordinate-geometry'])expected.modules[id]={active:null,sessions:[]};if(kind==='foundation')for(const id of ['coordinate-geometry','geometry','algebra-2'])expected.modules[id]={active:null,sessions:[]};assert.deepEqual(engine.hydrate(fixtures[kind]),expected,kind);}
});
test('legacy persistence protocols remain readable and historical payloads stay exact',()=>{
 assert.equal(Algebra.KEY,'cluevera_algebra_progress_v06');assert.equal(Reports.KEY,'cluevera_saved_reports_v1');
 for(const key of ['cluevera_project_portfolio_v1','cluevera_challenge_portfolio_v1','cluevera_foundation_portfolio_v1','cluevera_saved_reports_v1','cluevera_learning_goal_v1'])assert(Policy.valid(key,JSON.stringify({schema:key})));
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const payload={markdown:'# Cluevera · Algebra learning report\n\n> I used Cluevera and wrote −1/3.',records:{old:{explanation:'Cluevera helped me draw this.'}}};
 assert(Reports.save('aa01',payload,'old-session',storage).ok);const before=storage.getItem(Reports.KEY),saved=Reports.read(storage).data.items[0].versions[0].payload;
 const rendered=Tools.markdown('Algebra',saved);assert.match(rendered,/# Quidence · Algebra learning report/);assert.match(rendered,/> I used Cluevera and wrote −1\/3/);assert.equal(saved.records.old.explanation,payload.records.old.explanation);assert.equal(storage.getItem(Reports.KEY),before);
});
