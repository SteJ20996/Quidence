'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),Catalog=require('../assets/course-catalog.js'),Release=require('../scripts/build-static-release.cjs'),Local=require('../assets/local-records.js');
const ids=['ab01','ae01','af01','ac01','geometry','algebra-2'],KEY='quidence-college-voice-demo-v1';
test('six course entries reach the chooser while their original checks remain available',()=>{
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const id of ids){const c=Catalog.COURSES[id];assert.equal(c.challenge,'checks/?module='+id);assert(home.includes(c.challenge));assert(fs.readFileSync(path.join(root,c.course,'index.html'),'utf8').includes(c.challenge));assert.equal(c.originalChallenge,(id==='ac01'?'foundations':'diagnostics')+'/?module='+id);}
 const chooser=fs.readFileSync(path.join(root,'checks/app.js'),'utf8');for(const hash of ['linear','statistics','precalculus','game-theory','geometry','algebra2'])assert(chooser.includes("hash:'"+hash+"'"));assert(chooser.includes("cfg.foundation?'foundations':'diagnostics'"));
});
test('published modules match the reviewed source and every local dependency is in the static bundle',()=>{
 assert.doesNotThrow(()=>require('../scripts/build-math-voice.cjs').build(true));const files=Release.files();Release.validateLinks(files);
 for(const file of ['checks/index.html','checks/app.js','explain/index.html','explain/app.js','explain/core.js','explain/views.js','explain/recorder.js','explain/style.css','explain/assets/nunito-900.woff','explain/assets/Nunito-OFL.txt'])assert(files.includes(file),file);
 assert(!files.some(f=>f.startsWith('demos/')));assert(!files.includes('explain/package.json'));
});
test('English-only metadata stays fixed while the surrounding chooser preserves both languages',()=>{
 const SEO=require('../assets/seo-config.js');for(const lang of ['en','es','zh-Hant']){const m=SEO.resolve('/explain/?lang='+lang,'es');assert.equal(m.locale,'en');assert.deepEqual(m.alternates,[['en','https://www.quidence.com/explain/?lang=en']]);}
 for(const id of ids)for(const lang of ['en','es']){const m=SEO.resolve('/checks/?module='+id+'&lang='+lang);assert.equal(m.locale,lang);assert.equal(new URL(m.canonical).searchParams.get('module'),id);assert.equal(m.noindex,false);}
 assert(fs.readFileSync(path.join(root,'explain/index.html'),'utf8').includes('data-fixed-language="en"'));
});
test('new voice notes join local backup, restore and workspace isolation without changing raw evidence',()=>{
 const map=new Map([[KEY,'{original incomplete record'],['unrelated','keep']]);const storage={keys:()=>[...map.keys()],getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const c=Local.create(storage),backup=c.exportWork();assert.equal(backup.records[KEY],'{original incomplete record');assert.equal(backup.records.unrelated,undefined);
 const destination=new Map(),next={keys:()=>[...destination.keys()],getItem:k=>destination.get(k)??null,setItem:(k,v)=>destination.set(k,v),removeItem:k=>destination.delete(k)};Local.create(next).restore(backup);assert.equal(destination.get(KEY),map.get(KEY));
 const meta=JSON.stringify({activeOwner:{id:'learner'},users:{learner:{bases:{}}}});map.set(Local.META,meta);map.set('cluevera_user_learner:'+KEY,'Exact personal wording');const owned=Local.create(storage);assert.equal(owned.adapter.getItem(KEY),'Exact personal wording');assert.equal(map.get(KEY),'{original incomplete record');
});
test('new public routes work under the existing CSP and leave internal source and APIs unavailable',async t=>{
 const server=require('../backend/server.cjs').createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const origin='http://127.0.0.1:'+server.address().port;
 for(const file of ['/checks/?module=ac01','/explain/?lang=es','/explain/app.js','/explain/views.js','/explain/assets/nunito-900.woff','/explain/assets/Nunito-OFL.txt']){const r=await fetch(origin+file);assert.equal(r.status,200,file);assert.match(r.headers.get('content-security-policy'),/media-src 'self' blob:/);}
 for(const file of ['/demos/college-voice-lab/dist/core.js','/explain/package.json'])assert.equal((await fetch(origin+file)).status,404);assert.equal((await fetch(origin+'/api/me')).status,410);
});
