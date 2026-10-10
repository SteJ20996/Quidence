'use strict';
// User-supplied regressions: real motion, browse-only navigation and exact drafts.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const KEY='quidence:number-theory-preview:v1',GOAL='cluevera_learning_goal_v1';
const RAW='Save my answer\nThe unsaved proof uses gcd invariance. 保留这一段原文。';
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],missing=new Set(),result={matrixCycles:30,conflictExports:0,unreadableExports:0,quotaExports:0,mapBrowseActions:0,errors};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE});
  const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'}),page=await context.newPage();
  const origin='http://127.0.0.1:'+server.address().port,watch=p=>p.on('pageerror',e=>errors.push(e.message));watch(page);
  const es=async p=>p.waitForFunction(()=>QuidenceI18n.locale==='es');
  const collect=async p=>{await p.evaluate(()=>QuidenceI18n.apply());for(const k of await p.evaluate(()=>QuidenceI18n.missing))missing.add(k);};
  const download=async(p,id)=>{const ready=p.waitForEvent('download');await p.locator(id).click();const d=await ready;return{name:d.suggestedFilename(),text:fs.readFileSync(await d.path(),'utf8')};};
  await page.goto(origin+'/?lang=en');await page.locator('#learning-goal').fill(RAW);await page.locator('#goal-include-report').check();await page.locator('#learning-goal').blur();
  const before=await page.evaluate(k=>localStorage.getItem(k),GOAL);
  for(const selector of ['.qa-next','.qa-back','.qa-layer:first-child','[data-chapter="1"]','[data-chapter="0"]']){
   await page.locator(selector).click();assert.equal(await page.evaluate(k=>localStorage.getItem(k),GOAL),before,'Browsing changed report criteria');result.mapBrowseActions++;
  }
  for(const language of ['es','en']){await page.locator('#quidence-language').selectOption(language);await page.waitForFunction(l=>QuidenceI18n.locale===l,language);assert.equal(await page.evaluate(k=>localStorage.getItem(k),GOAL),before);result.mapBrowseActions++;}
  await page.goto(origin+'/modules/ab01/dist/matrix.html?lang=es');await es(page);await page.locator('#guide-mode').click();
  // Keep animation enabled. requestAnimationFrame may precede the click timestamp.
  for(let i=0;i<30;i++){await page.evaluate(()=>{document.querySelector('[data-guide-step="0"]').click();document.querySelector('#guide-next').click();document.querySelector('#guide-next').click();});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert(await page.evaluate(()=>MatrixGuide.read().progress>=0&&MatrixGuide.read().progress<=1));}
  await collect(page);
  await page.goto(origin+'/courses/number-theory/?lang=es');await es(page);await page.locator('#f-gcd').fill('84');await page.locator('#f-gcd').blur();await page.waitForTimeout(250);
  await page.locator('[data-step="1"]').click();const other=await context.newPage();watch(other);await other.goto(origin+'/courses/number-theory/?lang=es');await es(other);await other.locator('[data-step="1"]').click();
  // Give A a distinct new revision after B loaded the original.
  await page.locator('#f-why').fill('A saved proof: gcd is invariant.');await page.locator('#f-why').blur();await page.waitForTimeout(250);
  const saved=await page.evaluate(k=>localStorage.getItem(k),KEY);await other.locator('#f-why').fill(RAW);await other.locator('#f-why').blur();await other.waitForTimeout(250);
  assert.match(await other.locator('#save-status').textContent(),/otra pestaña/);assert(!/No se puede leer/.test(await other.locator('#save-status').textContent()));
  await other.locator('#session').click();const notes=await download(other,'#export');assert(notes.name.endsWith('.md'));assert(notes.text.startsWith('# '));assert(notes.text.includes(RAW));
  const original=await download(other,'#export-original');assert(original.name.endsWith('.json'));assert.equal(original.text,saved);assert.equal(await other.evaluate(k=>localStorage.getItem(k),KEY),saved);result.conflictExports=2;
  await collect(other);await context.close();
  for(const scenario of ['unreadable','quota']){
   const c=await browser.newContext(),p=await c.newPage();watch(p);await p.goto(origin+'/courses/number-theory/?lang=es');await es(p);
   const original='UNREADABLE ORIGINAL: < & > 原始数据';
   if(scenario==='unreadable'){await p.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,original]);await p.reload();await es(p);}
   else await p.evaluate(()=>{QuidenceStorage.setItem=()=>{throw new DOMException('Full','QuotaExceededError');};});
   await p.locator('[data-step="1"]').click();await p.locator('#f-why').fill(RAW);await p.locator('#f-why').blur();await p.waitForTimeout(250);await p.locator('#session').click();
   const notes=await download(p,'#export');assert(notes.text.includes(RAW));assert(notes.text.startsWith('# '));
   if(scenario==='unreadable'){assert.equal((await download(p,'#export-original')).text,original);assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),original);result.unreadableExports=2;}else result.quotaExports=1;
   await collect(p);await c.close();
  }
  const c=await browser.newContext(),p=await c.newPage();watch(p);await p.setViewportSize({width:375,height:900});await p.goto(origin+'/modules/aa01/dist/?lang=es');await es(p);await p.locator('#snapshot').waitFor();await p.locator('#snapshot').click();await collect(p);
  await p.locator('#return-work').click();const d1=await p.locator('#area-select option').evaluateAll(es=>es.find(e=>e.textContent.startsWith('P3')).value);await p.locator('#area-select').selectOption(d1);
  // Rendering supported/skipped reports used to leave English captions behind.
  for(const b of await p.locator('button[data-optional-visual]').all())await b.click();await p.locator('#skip').click();if(await p.locator('#quadratic-ready').count())await p.locator('#quadratic-ready').click();await p.locator('#snapshot').click();await collect(p);
  const screens=path.join(__dirname,'../review/screenshots');fs.mkdirSync(screens,{recursive:true});await p.screenshot({path:path.join(screens,'reviewed-legacy-report-es.webp'),fullPage:true});await c.close();
  fs.writeFileSync(path.join(__dirname,'../localization/reviewed-release-missing.json'),JSON.stringify([...missing].sort(),null,2)+'\n');
  assert.deepEqual([...missing],[],'Untranslated regression captions');assert.deepEqual(errors,[]);result.missing=missing.size;
  fs.writeFileSync(path.join(__dirname,'../review/reviewed-release-browser-20261010.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
