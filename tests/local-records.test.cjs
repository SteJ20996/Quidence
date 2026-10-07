'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm');
const Local=require('../assets/local-records.js'),Policy=require('../assets/sync-policy.js'),Element=require('./foundation-dom.cjs'),{createServer}=require('../backend/server.cjs');
const KEY='algebra-1_beta01_session_v1',root=path.resolve(__dirname,'..');
function storage(entries=[]){const map=new Map(entries);return{map,keys:()=>[...map.keys()],getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};}
test('public default rejects every account API and does not open or create a student database',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'quidence-local-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));const dataPath=path.join(dir,'unused.sqlite'),server=createServer({dataPath});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const origin='http://127.0.0.1:'+server.address().port;
 for(const[route,method]of [['/api/me','GET'],['/api/records','GET'],['/api/records/'+KEY,'PUT'],['/api/register','POST'],['/api/login','POST'],['/api/recover','POST']]){const r=await fetch(origin+route,{method,headers:{Cookie:'cluevera_session=old-session',Origin:origin,'Content-Type':'application/json'},body:method==='GET'?undefined:JSON.stringify({username:'student',password:'strong password',value:'private answer'})});assert.equal(r.status,410);assert.match((await r.json()).error,/paused/);assert.equal(r.headers.get('set-cookie'),null);}
 assert.equal(fs.existsSync(dataPath),false);
 for(const route of ['/records/','/account/']){const r=await fetch(origin+route);assert.equal(r.status,200);assert.doesNotMatch(await r.text(),/data-kind="(?:login|register)"|account-app.js|sync-client.js/);}
});
test('local mode resumes the exact existing workspace without contacting a server or copying guest work over it',()=>{
 const meta=JSON.stringify({activeOwner:{id:'old-student'},users:{'old-student':{bases:{}}}}),physical='cluevera_user_old-student:'+KEY,s=storage([[Local.META,meta],[KEY,'guest original'],[physical,'unfinished −1/3\nexact draft']]),before=[...s.map];
 const c=Local.create(s);assert.equal(c.adapter.getItem(KEY),'unfinished −1/3\nexact draft');assert.deepEqual([...s.map],before);
 c.adapter.setItem(KEY,'local edit');assert.equal(s.getItem(physical),'local edit');assert.equal(s.getItem(KEY),'guest original');
 const backup=c.exportWork();assert.equal(backup.records[Local.META],meta);assert.equal(backup.records[KEY],'guest original');assert.equal(backup.records[physical],'local edit');
});
test('clearing removes reviewed records and backups, leaves unrelated keys, and blocks a stale tab from recreating answers',()=>{
 const s=storage([[KEY,'raw draft'],['cluevera_user_jane:'+KEY,'account draft'],['cluevera_user_jane:backup:123:abc','backup'],[Local.META,'{"activeOwner":null,"users":{}}'],['unrelated_widget','keep']]),old=Local.create(s),other=Local.create(s);old.clear();
 assert.equal(s.getItem(KEY),null);assert.equal(s.getItem(Local.META),null);assert.equal(s.getItem('cluevera_user_jane:'+KEY),null);assert.equal(s.getItem('unrelated_widget'),'keep');
 assert.throws(()=>other.adapter.setItem(KEY,'stale answer'),/Reload/);assert.equal(s.getItem(KEY),null);const fresh=Local.create(s);fresh.adapter.setItem(KEY,'new work');assert.equal(s.getItem(KEY),'new work');
});
test('backup restores exact raw records locally, refuses overwrite and unsupported keys, and rolls back a failed write',()=>{
 const source=storage([[KEY,'{unreadable draft'],[Local.META,'bad metadata']]),backup=Local.create(source).exportWork();assert.equal(backup.records[KEY],'{unreadable draft');
 const target=storage(),c=Local.create(target);c.restore(backup);assert.equal(target.getItem(KEY),'{unreadable draft');assert.equal(target.getItem(Local.META),'bad metadata');assert(Local.create(target).blocked());
 const existing=storage([[KEY,'keep this']]);assert.throws(()=>Local.create(existing).restore(backup),/different records/);assert.equal(existing.getItem(KEY),'keep this');
 assert.throws(()=>Local.create(storage()).restore({schema:Local.SCHEMA,records:{unrelated_widget:'overwrite'}}),/unsupported/);
 const fail=storage();const write=fail.setItem;fail.setItem=(k,v)=>{if(k===Local.META)throw Error('quota');write(k,v);};assert.throws(()=>Local.create(fail).restore(backup),/could not be restored/);assert.equal(fail.getItem(KEY),null);
});
test('backup inspection reports missing, identical and conflicting records without writing or merging',()=>{
 const s=storage([[KEY,'keep my response'],['cluevera_saved_reports_v1','same reports']]),c=Local.create(s),before=[...s.map];
 const backup={schema:Local.SCHEMA,records:{[KEY]:'different response',cluevera_saved_reports_v1:'same reports',cluevera_foundation_portfolio_v1:'new foundation work'}};
 assert.deepEqual(c.inspectBackup(backup),{total:3,missing:1,identical:1,conflicting:1});assert.deepEqual([...s.map],before);
 assert.throws(()=>c.restore(backup),/different records/);assert.deepEqual([...s.map],before);
 delete backup.records[KEY];assert.deepEqual(c.restore(backup),{total:2,missing:1,identical:1,conflicting:0});assert.equal(s.getItem(KEY),'keep my response');assert.equal(s.getItem('cluevera_foundation_portfolio_v1'),'new foundation work');
});
test('browser local-record controls never fetch and implement download, cancel and confirmed deletion',async()=>{
 const body=new Element('body');body.innerHTML=fs.readFileSync(path.join(root,'records/index.html'),'utf8');const q=id=>body.querySelector('#'+id),s=storage([[KEY,'private unfinished response']]),downloads=[],listeners={},docListeners={};
 const document={currentScript:{src:'https://example.test/assets/local-records.js'},body,getElementById:q,createTextNode:text=>({textContent:text}),createElement:tag=>{const e=new Element(tag);e.style={};e.remove=()=>{};e.click=()=>downloads.push(e.download);return e;},addEventListener:(event,fn)=>docListeners[event]=fn};body.prepend=()=>{};
 let confirmed=false;const window={document,localStorage:s,QuidenceSyncPolicy:Policy,location:{href:'https://example.test/records/',reload(){}},addEventListener:(e,fn)=>listeners[e]=fn,confirm:()=>confirmed,Blob,URL,setTimeout:fn=>fn(),fetch:()=>assert.fail('Public mode must not request a server')};
 Local.mount(window);docListeners.DOMContentLoaded();q('local-export').events.click();assert.match(downloads[0],/^quidence-local-records-/);assert.equal(s.getItem(KEY),'private unfinished response');
 q('local-clear').events.click();assert.equal(s.getItem(KEY),'private unfinished response');confirmed=true;q('local-clear').events.click();assert.equal(s.getItem(KEY),null);assert.match(q('local-record-status').textContent,/removed/);
});
test('all student entry pages load only the local adapter and expose no account link',()=>{
 const files=['index.html','records/index.html','data-use/index.html','account/index.html',...['foundations','diagnostics','projects','reports'].map(p=>p+'/index.html'),...Object.values(require('../assets/course-catalog.js').COURSES).map(c=>c.course+'index.html'),'modules/aa01/dist/index.html','modules/ab01/dist/matrix.html','modules/ab01/dist/vectors.html'];
 for(const file of files){const text=fs.readFileSync(path.join(root,file),'utf8');assert.doesNotMatch(text,/Your account|href="(?:\.\.\/)*account\/|sync-client.js|account-app.js/,file);if(!['data-use/index.html','account/index.html'].includes(file))assert.match(text,/local-records.js/,file);}
});
