'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
const {hashQueue,trustedClients}=require('../backend/security.cjs'),{createServer}=require('../backend/server.cjs');
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return{promise,resolve};};
test('hash queue bounds concurrency and capacity, cancels waiting jobs and rejects excess work',async()=>{
 const q=hashQueue({concurrency:2,maxQueued:2}),gate=deferred();let active=0,max=0,started=0;
 const work=async()=>{started++;active++;max=Math.max(max,active);await gate.promise;active--;return started;};
 const first=q.schedule(work),second=q.schedule(work),abort=new AbortController();
 const cancelled=q.schedule(work,abort.signal),cancelledCheck=assert.rejects(cancelled,e=>e.status===499);
 const queued=q.schedule(work);await assert.rejects(q.schedule(work),e=>e.status===503);abort.abort();await cancelledCheck;
 assert.deepEqual(q.stats(),{running:2,queued:1});gate.resolve();await Promise.all([first,second,queued]);assert.equal(started,3);assert.equal(max,2);q.close();await assert.rejects(q.schedule(work),e=>e.status===503);
});
test('cancelled running hashes cannot authorize a database write, and waiting jobs time out',async()=>{
 const q=hashQueue({concurrency:1,waitMs:15}),gate=deferred(),abort=new AbortController();
 const running=q.schedule(()=>gate.promise,abort.signal);await assert.rejects(q.schedule(()=>assert.fail('Timed-out work started')),e=>e.status===503);
 abort.abort();gate.resolve('hash');await assert.rejects(running,e=>e.status===499);q.close();
});
test('proxy identity ignores spoofed headers by default and uses only explicit trusted hops',()=>{
 const req=(socket,header)=>({socket:{remoteAddress:socket},headers:{'x-forwarded-for':header}});
 assert.equal(trustedClients()(req('::ffff:127.0.0.1','203.0.113.1')),'127.0.0.1');
 const trusted=trustedClients('127.0.0.1/32,10.0.0.0/8,2001:db8::/32');
 assert.equal(trusted(req('127.0.0.1','198.51.100.8, 10.2.1.4')),'198.51.100.8');
 assert.equal(trusted(req('127.0.0.1','203.0.113.9, 198.51.100.8')),'198.51.100.8');
 assert.equal(trusted(req('192.0.2.8','203.0.113.9')),'192.0.2.8');
 assert.equal(trusted(req('2001:db8::1','2001:db9::a')),'2001:db9::a');
 assert.equal(trusted(req('127.0.0.1','invalid')),'127.0.0.1');
 for(const cidr of ['0.0.0.0/0','::/0','127.0.0.1/33','invalid'])assert.throws(()=>trustedClients(cidr));
});
async function fixture(t){const server=createServer({accountsEnabled:true,dataPath:':memory:'});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const origin='http://127.0.0.1:'+server.address().port;
 const post=(route,body,headers={})=>fetch(origin+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body:JSON.stringify(body)});return{server,origin,post};}
test('twelve simultaneous classroom registrations and then logins complete without busy rejection',async t=>{
 const {post}=await fixture(t),responses=await Promise.all(Array.from({length:12},(_,i)=>post('/api/register',{username:'class_student_'+i,password:'classroom strong password '+i})));
 assert.deepEqual(responses.map(r=>r.status),Array(12).fill(201));await Promise.all(responses.map(r=>r.json()));
 const logins=await Promise.all(Array.from({length:12},(_,i)=>post('/api/login',{username:'class_student_'+i,password:'classroom strong password '+i})));
 assert.deepEqual(logins.map(r=>r.status),Array(12).fill(200));
 const bodies=await Promise.all(logins.map(r=>r.json()));assert.equal(new Set(bodies.map(b=>b.user.id)).size,12);
});
test('logout is repeatable and an upload finished after logout cannot create a revision',async t=>{
 const {origin,post}=await fixture(t),registered=await post('/api/register',{username:'race_student',password:'a strong password 123'}),cookie=registered.headers.get('set-cookie').split(';')[0],{csrf}=await registered.json();
 const headers={Cookie:cookie,'X-CSRF-Token':csrf},key='algebra-1_beta01_session_v1',body=JSON.stringify({baseVersion:0,value:JSON.stringify({schema:key,answer:7})});
 let resolveResponse;const response=new Promise(r=>resolveResponse=r);
 const upload=http.request(origin+'/api/records/'+key,{method:'PUT',headers:{Origin:origin,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body),...headers}},res=>{res.resume();res.on('end',()=>resolveResponse(res.statusCode));});
 upload.on('error',e=>resolveResponse(e));upload.write(body.slice(0,12));
 // The body is deliberately incomplete until the logout response confirms revocation.
 assert.equal((await post('/api/logout',{},headers)).status,200);upload.end(body.slice(12));assert.equal(await response,401);
 assert.equal((await post('/api/logout',{},headers)).status,200);
 const login=await post('/api/login',{username:'race_student',password:'a strong password 123'}),newCookie=login.headers.get('set-cookie').split(';')[0];await login.json();
 const records=await fetch(origin+'/api/records',{headers:{Cookie:newCookie}});assert.deepEqual((await records.json()).records,[]);
});

test('HTTP rate buckets ignore spoofed proxy headers by default and separate explicitly trusted clients',async t=>{
 for(const trustedProxyCIDRs of ['', '127.0.0.1/32']){
  const server=createServer({accountsEnabled:true,dataPath:':memory:',trustedProxyCIDRs});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const origin='http://127.0.0.1:'+server.address().port;
  async function request(i,ip){const r=await fetch(origin+'/api/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Forwarded-For':ip},body:JSON.stringify({username:'proxy_test_'+i,password:'short'})});await r.json();return r.status;}
  for(let i=0;i<60;i++)assert.equal(await request(i,'198.51.100.1'),400);
  assert.equal(await request(60,'198.51.100.1'),429);
  assert.equal(await request(61,'198.51.100.2'),trustedProxyCIDRs?400:429);
 }
});
