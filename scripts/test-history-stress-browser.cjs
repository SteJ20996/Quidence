'use strict';
// Bounded local stress test: never sends traffic to the production site.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {performance}=require('node:perf_hooks'),{chromium}=require('playwright');
const {createServer}=require('../backend/server.cjs'),E=require('../assets/foundation-engine.js'),S=require('../assets/report-store.js');
const ORIGINAL='I am still checking how this relationship works. Compare an equation with a diagram.\nMi explicación original: no cambiar mis palabras. 我的原始解释。';
const portfolio=E.fresh(),session=E.createSession(portfolio,'aa01');
for(const task of E.tasks(session)){E.edit(session,task,{...E.blank(task),unsure:true,explanation:ORIGINAL});assert(E.submit(session,task).ok);}
session.view='report';const payload=E.portable(session);
const copy=x=>JSON.parse(JSON.stringify(x)),round=n=>Math.round(n*10)/10;
function fingerprint(p){const text=JSON.stringify(p,(k,v)=>['exported_at','exportedAt','exportedAtISO','exported'].includes(k)?undefined:v);let hash=2166136261;for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);return 'compact-v2:'+text.length+':'+(hash>>>0).toString(16);}
function archive(count){const a=S.fresh();for(let i=0;i<count;i++){const p=copy(payload),id='stress-report-'+i;p.session.id=id;a.items.push({id:'aa01:'+id,module:'aa01',subject:S.SUBJECTS.aa01,sessionId:id,versions:[{savedAt:new Date().toISOString(),signature:fingerprint(p),payload:p}]});}return a;}
function history(count){const p=copy(portfolio),sessions=[];for(let i=0;i<count;i++){const s=copy(session);s.id='stress-session-'+i;s.view='intro';sessions.push(s);}p.modules.aa01.sessions=sessions;p.modules.aa01.active=sessions.at(-1).id;assert(E.hydrate(p));return p;}
async function main(){
 const output={label:process.env.QUIDENCE_STRESS_LABEL||'measurement',date:new Date().toISOString(),scope:'Local Chromium and local static server only; CPU throttling is a synthetic proxy, not a real phone or Cloudflare capacity measurement.',fixture:{tasks:E.tasks(session).length,reportCharacters:JSON.stringify(payload).length,sessionCharacters:JSON.stringify(session).length},archives:[],histories:[],errors:[]};
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  const origin='http://127.0.0.1:'+server.address().port;browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE});
  const context=await browser.newContext({viewport:{width:375,height:900}}),page=await context.newPage();
  page.on('pageerror',e=>output.errors.push(e.message));const cdp=await context.newCDPSession(page);
  await page.addInitScript(()=>{window.stressLongTasks=[];new PerformanceObserver(list=>stressLongTasks.push(...list.getEntries().map(x=>x.duration))).observe({type:'longtask',buffered:true});});
  for(const cpu of [1,4]){
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu});
   for(const count of [10,50,100]){
    await page.goto(origin+'/reports/?lang=en');
    const data=archive(count),raw=JSON.stringify(data);
    const seeded=await page.evaluate(raw=>{try{QuidenceStorage.setItem(QuidenceReportStore.KEY,raw);return true;}catch{return false;}},raw);
    if(!seeded){output.archives.push({cpu,count,characters:raw.length,seeded:false});continue;}
    const start=performance.now();await page.reload();await page.locator('[data-r-action="open"]').first().waitFor();
    const loadMs=round(performance.now()-start);
    const metrics=await page.evaluate(p=>{
     const S=QuidenceReportStore,storage=QuidenceStorage,raw=storage.getItem(S.KEY),before=JSON.parse(raw),time=fn=>{const t=performance.now(),value=fn();return{ms:Math.round((performance.now()-t)*10)/10,value};};
     const read=time(()=>S.read(storage));if(!read.value.ok)throw Error('Unreadable seeded reports');
     const unchanged=time(()=>S.save('aa01',p,before.items.at(-1).sessionId,storage));
     if(!unchanged.value.ok||unchanged.value.changed)throw Error('Unchanged report became another version');
     const next=structuredClone(p);next.session.id='new-stress-report';const saved=time(()=>S.save('aa01',next,next.session.id,storage));
     if(!saved.value.ok)throw Error('New report failed within available storage');
     const after=S.read(storage).data;if(JSON.stringify(after.items.slice(0,-1).map(x=>x.versions.map(v=>v.payload)))!==JSON.stringify(before.items.map(x=>x.versions.map(v=>v.payload))))throw Error('Old payloads changed');
     return{readMs:read.ms,unchangedSaveMs:unchanged.ms,newSaveMs:saved.ms,renderedReports:document.querySelectorAll('[data-r-action="open"]').length};
    },{...payload,session:{...payload.session,id:'stress-report-'+(count-1)}});
    const click=performance.now();await page.locator('[data-r-action="open"]').first().click();await page.locator('#r-copy').waitFor();metrics.openMs=round(performance.now()-click);
    const stored=await page.evaluate(()=>QuidenceStorage.getItem(QuidenceReportStore.KEY));
    const language=performance.now();for(let i=0;i<3;i++){await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');await page.locator('#quidence-language').selectOption('en');await page.waitForFunction(()=>QuidenceI18n.locale==='en');}metrics.sixLanguageChangesMs=round(performance.now()-language);
    assert.equal(await page.evaluate(()=>QuidenceStorage.getItem(QuidenceReportStore.KEY)),stored,'Language switch changed originals');
    assert((await page.locator('.f-quote').allTextContents()).every(x=>x===ORIGINAL));assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
    const seen=new Set();for(;;){for(const id of await page.locator('[data-r-action="open"]').evaluateAll(es=>es.map(e=>e.dataset.report)))seen.add(id);const older=page.locator('[data-r-action="older"]');if(!await older.count()||await older.isDisabled())break;await older.click();}assert.equal(seen.size,count,'Pagination hid historical reports');
    metrics.allReportsReachable=true;metrics.maxLongTaskMs=round(await page.evaluate(()=>Math.max(0,...stressLongTasks)));output.archives.push({cpu,count,characters:raw.length,seeded:true,loadMs,...metrics});console.log(JSON.stringify(output.archives.at(-1)));
    await page.evaluate(()=>QuidenceStorage.removeItem(QuidenceReportStore.KEY));
   }
   for(const count of [10,100,250]){
    await page.goto(origin+'/foundations/?module=aa01&lang=en');const raw=JSON.stringify(history(count));
    const seeded=await page.evaluate(({key,raw})=>{try{QuidenceStorage.setItem(key,raw);return true;}catch{return false;}},{key:E.SCHEMA,raw});
    if(!seeded){output.histories.push({cpu,count,characters:raw.length,seeded:false});continue;}
    const start=performance.now();await page.reload();await page.locator('[data-f-action="resume"]').waitFor();const loadMs=round(performance.now()-start);
    const savedHistoryButtons=await page.locator('[data-f-action="history"]').count();await page.locator('[data-f-action="resume"]').click();const field=page.locator('[data-f-explanation]');
    await field.fill('');const edit=performance.now();await field.pressSequentially(ORIGINAL.slice(0,100));const hundredKeystrokesMs=round(performance.now()-edit);
    await page.reload();assert.equal(await field.inputValue(),ORIGINAL.slice(0,100),'Last draft was lost on reload');
    const validation=await page.evaluate(({key,count,original})=>{const p=JSON.parse(QuidenceStorage.getItem(key));if(p.modules.aa01.sessions.length!==count)throw Error('Earlier sessions lost');if(p.modules.aa01.sessions[0].records[Object.keys(p.modules.aa01.sessions[0].records)[0]].submissions[0].answer.explanation!==original)throw Error('Earlier answer changed');return{savedHistoryButtons:document.querySelectorAll('[data-f-action="history"]').length,maxLongTaskMs:Math.round(Math.max(0,...stressLongTasks)*10)/10};},{key:E.SCHEMA,count,original:ORIGINAL});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);output.histories.push({cpu,count,characters:raw.length,seeded:true,loadMs,hundredKeystrokesMs,...validation,savedHistoryButtons});console.log(JSON.stringify(output.histories.at(-1)));
    await page.evaluate(key=>QuidenceStorage.removeItem(key),E.SCHEMA);
   }
  }
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  // Exhaust space in an isolated browser. Existing evidence must survive failure.
  await page.goto(origin+'/reports/?lang=en');
  output.quota=await page.evaluate(p=>{const S=QuidenceReportStore,storage=QuidenceStorage;const first=S.save('aa01',p,'quota-original',storage);if(!first.ok)throw Error('Quota fixture failed');const before=storage.getItem(S.KEY);let filled=0;try{for(let i=0;i<100;i++){localStorage.setItem('stress-fill-'+i,'x'.repeat(100000));filled++;}}catch{}const huge=structuredClone(p);huge.reportText='x'.repeat(500000);const result=S.save('aa01',huge,'quota-new',storage);if(result.ok)throw Error('Expected quota failure');if(storage.getItem(S.KEY)!==before)throw Error('Quota failure altered prior records');return{filledBlocks:filled,rejectedNewSave:!result.ok,originalArchiveUnchanged:true,error:result.error};},payload);
  await context.close();
  // Two tabs for the same activity must never silently overwrite each other.
  const tabsContext=await browser.newContext(),one=await tabsContext.newPage(),two=await tabsContext.newPage();
  await one.goto(origin+'/foundations/?module=aa01&lang=en');await one.locator('[data-f-action="resume"]').click();
  await two.goto(origin+'/foundations/?module=aa01&lang=en');
  await one.locator('[data-f-explanation]').fill('First tab updated this draft.');await one.locator('[data-f-explanation]').press('Tab');
  const tabBefore=await one.evaluate(key=>QuidenceStorage.getItem(key),E.SCHEMA);
  await two.locator('[data-f-explanation]').fill('Second tab has its own unsaved draft.');await two.locator('[data-f-explanation]').press('Tab');
  await two.locator('[data-f-action="export-work"]').waitFor();assert((await two.locator('[role="alert"]').textContent()).includes('another tab'));
  assert.equal(await two.evaluate(key=>QuidenceStorage.getItem(key),E.SCHEMA),tabBefore,'Stale tab replaced the first draft');
  const downloaded=two.waitForEvent('download');await two.locator('[data-f-action="export-work"]').click();const download=await downloaded,stream=await download.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);const tabCopy=JSON.parse(Buffer.concat(chunks).toString());assert(JSON.stringify(tabCopy).includes('Second tab has its own unsaved draft.'));
  output.sameActivityTabs={staleWriteBlocked:true,firstDraftPreserved:true,secondDraftDownloadable:true};await tabsContext.close();
  const durations=[],routes=['/','/diagnostics/?module=algebra-1','/projects/?module=ad01','/assets/foundation-app.js','/assets/i18n-es.js','/assets/quidence-logo-dark.svg'];let failed=0;
  const start=performance.now();for(let batch=0;batch<5;batch++)await Promise.all(Array.from({length:100},async(_,i)=>{const t=performance.now(),response=await fetch(origin+routes[i%routes.length]);const body=await response.text();if(response.status!==200||!body.length)failed++;durations.push(performance.now()-t);}));
  durations.sort((a,b)=>a-b);output.localRequests={concurrency:100,total:500,failed,totalMs:round(performance.now()-start),p50Ms:round(durations[249]),p95Ms:round(durations[474])};assert.equal(failed,0);
  const users=await Promise.all(Array.from({length:8},async(_,i)=>{const c=await browser.newContext({viewport:{width:375,height:850}}),p=await c.newPage();p.on('pageerror',e=>output.errors.push(e.message));for(const route of ['/','/diagnostics/?module=algebra-1','/reports/'])await p.goto(origin+route);await p.evaluate(({payload,i})=>{const r=QuidenceReportStore.save('aa01',payload,'isolated-user-'+i,QuidenceStorage);if(!r.ok)throw Error(r.error);},{payload,i});await p.reload();const ids=await p.evaluate(()=>QuidenceReportStore.read(QuidenceStorage).data.items.map(x=>x.sessionId));assert.deepEqual(ids,['isolated-user-'+i]);await c.close();return true;}));output.isolatedBrowsers={concurrentUsers:users.length,reloadAndIsolationPassed:users.every(Boolean)};
  assert.deepEqual(output.errors,[]);const file=path.join(__dirname,'../review/performance-'+output.label+'.json');fs.writeFileSync(file,JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({file,quota:output.quota,requests:output.localRequests,users:output.isolatedBrowsers,errors:output.errors}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
