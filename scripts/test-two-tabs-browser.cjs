'use strict';
// Two tabs of one course share one saved record. Opening, hiding or closing a second tab without editing must not
// stop the first tab from saving; a record rewritten with the same content in another key order is not a conflict;
// and a real edit from another tab must still block the first tab instead of being overwritten.
const assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const COURSES=[['cross-disciplinary/','quidence:cross-disciplinary:v1'],['courses/number-theory/','quidence:number-theory-preview:v1'],['courses/probability/','quidence:probability:v1'],['courses/discrete-math/','quidence:discrete-math:v1']];
const FIELD='input[type="text"][data-field]:visible,textarea[data-field]:visible';
const SAVED='Draft saved on this device.',CONFLICT=/changed in another tab/;
async function run(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],results={};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  for(const [route,KEY] of COURSES){
   const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
   const open=async()=>{const p=await context.newPage();p.on('pageerror',e=>errors.push(route+': '+e.message));p.on('dialog',d=>d.accept().catch(()=>{}));await p.goto(origin+'/'+route);await p.locator('#app').waitFor({state:'visible'});return p;};
   const stored=p=>p.evaluate(k=>localStorage.getItem(k),KEY);
   const type=async(p,text)=>{await p.locator(FIELD).first().fill(text);await p.waitForFunction(()=>document.querySelector('#save-status')?.textContent!=='',null,{timeout:5000});await p.waitForTimeout(400);};
   const status=p=>p.locator('#save-status').textContent();
   const a=await open();
   // Answer the last project before the first, so the saved order differs from the order a new tab rebuilds.
   const ids=await a.locator('[data-project]').evaluateAll(es=>[...new Set(es.map(e=>e.dataset.project))]);
   assert(ids.length>=2,route+' lists its projects');
   await a.locator(`[data-project="${ids.at(-1)}"]`).first().click();await type(a,'last project, answered first');
   await a.locator(`[data-project="${ids[0]}"]`).first().click();await type(a,'first project, answered second');
   assert.equal(await status(a),SAVED,route+' first save');const before=await stored(a);assert(before.includes('answered second'));
   // 1. A second tab that is opened, hidden and closed without edits leaves the record byte for byte as it was.
   const b=await open();assert.equal(await stored(b),before,route+' opening a tab rewrote the record');
   await b.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
   assert.equal(await stored(a),before,route+' hiding an untouched tab rewrote the record');
   await b.close({runBeforeUnload:true});await a.waitForTimeout(200);
   assert.equal(await stored(a),before,route+' closing an untouched tab rewrote the record');
   await type(a,'edited after the second tab closed');
   assert.equal(await status(a),SAVED,route+' false conflict after an untouched tab closed');assert((await stored(a)).includes('edited after the second tab closed'));
   // 2. The same content written with its keys in another order is not a conflict.
   await a.evaluate(k=>{const reverse=v=>Array.isArray(v)?v.map(reverse):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([x,y])=>[x,reverse(y)])):v;
    const raw=localStorage.getItem(k),again=JSON.stringify(reverse(JSON.parse(raw)));if(again===raw)throw Error('reordering did not change the text');localStorage.setItem(k,again);},KEY);
   await type(a,'edited after a reordered rewrite');
   assert.equal(await status(a),SAVED,route+' false conflict after a reordered rewrite');assert((await stored(a)).includes('edited after a reordered rewrite'));
   // 3. A real edit from another tab still blocks this tab, and this tab does not overwrite it.
   const c=await open();await c.locator(`[data-project="${ids[0]}"]`).first().click();await type(c,'written in the other tab');assert.equal(await status(c),SAVED);
   await c.close();
   await type(a,'this edit must not overwrite the other tab');
   assert.match(await status(a),CONFLICT,route+' a real change from another tab was not detected');
   const after=await stored(a);assert(after.includes('written in the other tab')&&!after.includes('this edit must not overwrite the other tab'),route+' the other tab\'s work was overwritten');
   // 4. Closing the blocked tab keeps the other tab's work.
   await a.close({runBeforeUnload:true});const check=await open();assert(( await stored(check)).includes('written in the other tab'),route+' closing the blocked tab lost work');
   results[route]='ok';await context.close();
  }
  assert.deepEqual(errors,[],errors.join('\n'));
  console.log(JSON.stringify({courses:results,errors}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
