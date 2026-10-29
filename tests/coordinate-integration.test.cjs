'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../assets/course-catalog.js'),M=require('../assets/knowledge-map.js'),P=require('../assets/sync-policy.js'),Local=require('../assets/local-records.js');
test('Coordinate Geometry has one course entry with its projects, both checks and its own map binding',()=>{
 const c=C.COURSES['coordinate-geometry'];assert.equal(c.group,'school');assert.equal(c.course,c.project);assert.equal(c.projectCount,2);assert.equal(c.challenge,'diagnostics/?module=coordinate-geometry');assert.equal(c.challengeCount,4);assert.equal(c.foundation,'foundations/?module=coordinate-geometry');
 assert.deepEqual(M.courseCandidates(0,['coordinate']),['coordinate-geometry']);
 for(const id of ['geometry','ab01'])assert.equal(C.COURSES[id].relatedProject,c.course);
 const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');assert.match(h,/data-subject="coordinate-geometry"/);assert.match(h,/High school → university bridge/);
 require('../scripts/build-coordinate.cjs').build(true);
 require('../scripts/build-coordinate-ledger.cjs').build(true);
 assert.equal(require('../scripts/build-coordinate-ledger.cjs').inventory().items.length,12);
});
test('new course UI translations are available without replacing the shared translation banks',()=>{
 const vm=require('node:vm'),context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/i18n.js'),'utf8'),context);const api=context.QuidenceI18n;api.setLocale('es');
 const copy=require('../localization/coordinate-ui-es.json');for(const [source,translated]of Object.entries(copy))assert.equal(api.text(source),translated,source);
});
test('Coordinate Geometry drafts and submissions join backups and owner isolation',()=>{
 const key='quidence-coordinate-project-studio-v1',map=new Map(),storage={get length(){return map.size;},key:i=>[...map.keys()][i],getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 assert(P.KEYS[key]);const records=Local.create(storage,P),raw=JSON.stringify({version:1,drafts:{'plan:0':{reason:'Keep my exact original. 中文 / español.',answers:{}}},history:[]});records.adapter.setItem(key,raw);
 assert.equal(records.exportWork().records[key],raw);map.set(Local.META,JSON.stringify({activeOwner:{id:'jane'},users:{jane:{}}}));const owned=Local.create(storage,P);owned.adapter.setItem(key,'separate work');assert.equal(map.get(key),raw);assert.equal(map.get('cluevera_user_jane:'+key),'separate work');
});
