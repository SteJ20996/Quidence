'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const data=require('../courses/number-theory/data.json');
const KEY='quidence:number-theory-preview:v1',RAW='Mi razonamiento original / 我的证明\n  <img src=x onerror=alert(1)> & spaces.';
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const origin='http://127.0.0.1:'+server.address().port,errors=[],failed=[];
 const result={projects:10,steps:0,layouts:0,languages:['en','es'],errors,failedRequests:failed};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
  await page.goto(origin+'/courses/number-theory/?lang=en');await page.locator('#app').waitFor({state:'visible'});
  for(const p of data){await page.locator('[data-project="'+p.id+'"]').click();for(let i=0;i<p.steps.length;i++){
   await page.locator('[data-step="'+i+'"]').click();assert.equal(await page.locator('#work h3').first().textContent(),p.steps[i].title);
   await page.locator('#proof').evaluate(e=>e.open=true);assert((await page.locator('.proof-content').textContent()).includes(p.steps[i].proof.split('\n')[0]));
   assert.equal(await page.locator('[data-field]').count(),p.steps[i].fields.reduce((n,f)=>n+(['choice','multi'].includes(f.type)?f.options.length:1),0));result.steps++;
  }}
  await page.locator('[data-project="nt-p01"]').click();await page.locator('[data-step="0"]').click();
  await page.locator('#f-gcd').fill('84');await page.locator('#f-divisions').fill('4');await page.locator('#check').click();assert.match(await page.locator('#feedback-gcd').textContent(),/Correct/);
  await page.locator('#f-gcd').fill('42');await page.locator('#check').click();assert.match(await page.locator('#feedback-gcd').textContent(),/Try again/);
  await page.locator('#f-gcd').fill('6,468');await page.locator('#check').click();assert.match(await page.locator('#feedback-gcd').textContent(),/no thousands separators/);
  await page.locator('[data-step="1"]').click();await page.locator('#f-why').fill(RAW);await page.locator('#check').click();assert.match(await page.locator('#feedback-why').textContent(),/saved for review/);
  const before=await page.evaluate(k=>localStorage.getItem(k),KEY);
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.equal(await page.locator('#f-why').inputValue(),RAW);assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),before);
  assert.match(await page.locator('.content-language-note').textContent(),/inglés o español/);assert.match(await page.locator('#check').textContent(),/Comprueba/);
  // Every authored project, proof, criterion and option is localized; originals stay intact.
  const expected=Object.assign({},...fs.readdirSync(path.join(__dirname,'../localization')).filter(f=>/^number-theory-es-mx(?:-\d+)?\.json$/.test(f)).map(f=>JSON.parse(fs.readFileSync(path.join(__dirname,'../localization',f),'utf8'))));
  const collect=async()=>{await page.evaluate(()=>QuidenceI18n.apply());};
  const chooseProject=async id=>{if(await page.locator('#project-select').isVisible())await page.locator('#project-select').selectOption(id);else await page.locator(`[data-project="${id}"]`).click();};
  for(const width of [1440,375]){await page.setViewportSize({width,height:900});for(const p of data){await chooseProject(p.id);for(let i=0;i<p.steps.length;i++){
   await page.locator(`[data-step="${i}"]`).click();await page.locator('#proof').evaluate(e=>e.open=true);await collect();
   assert.equal(await page.locator('#project-head h2').textContent(),expected[p.id].title);
   assert.equal(await page.locator('#work h3').textContent(),expected[p.id].steps[i].title);
   assert.deepEqual(await page.locator('.proof-content > p:not(.proof-label)').allTextContents(),expected[p.id].steps[i].proof);
   for(const f of p.steps[i].fields)if(f.options)assert.deepEqual(await page.locator(`input[data-field="${f.id}"]`).evaluateAll(es=>es.map(e=>e.value)),f.options.map(o=>o.value));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,'Number Theory overflow '+p.id+' '+i+' at '+width);
  }}}
  await page.setViewportSize({width:1440,height:900});
  for(const [project,step,actions]of [
   ['nt-p01',0,['tile-next','tile-next','tile-next','tile-next','tile-reset']],
   ['nt-p02',0,['jug-fill-1','jug-pour-1','jug-empty-0','jug-pour-1','jug-fill-1','jug-pour-1','jug-empty-0','jug-pour-1','jug-undo','jug-reset']],
   ['nt-p02',2,['jug-fill-1','jug-pour-1','jug-empty-0','jug-pour-1']],
   ['nt-p10',0,['prime-3','prime-13']],['nt-p03',0,['digits-swap']],
   ['nt-p04',0,['crt-next','crt-next','crt-next','crt-reset']],
   ['nt-p05',0,['square-next','square-next','square-next','square-next','square-next','square-reset']],
   ['nt-p06',0,['rsa-lock','rsa-unlock']],['nt-p08',0,['factor-expand','factor-14','factor-expand']]
  ]){await chooseProject(project);await page.locator(`[data-step="${step}"]`).click();for(const action of actions){await page.locator(`[data-lab="${action}"]`).click();await collect();}}
  await page.locator('[data-project="nt-p09"]').click();await page.locator('[data-step="0"]').click();await page.locator('#ticket-group').fill('23');await page.locator('#ticket-group').dispatchEvent('change');await collect();
  await page.locator('[data-project="nt-p07"]').click();await page.locator('#triple-m').evaluate(e=>{e.value='4';e.dispatchEvent(new Event('input',{bubbles:true}));});await collect();
  await page.locator('[data-project="nt-p06"]').click();await page.locator('#rsa-message').fill('11');await page.locator('#rsa-message').dispatchEvent('change');await page.locator('[data-lab="rsa-lock"]').click();await page.locator('[data-lab="rsa-unlock"]').click();await collect();
  await page.locator('[data-project="nt-p01"]').click();await page.locator('[data-step="1"]').click();await collect();
  await page.locator('#session').click();assert.equal(await page.locator('.student-work').last().textContent(),RAW);assert.equal(await page.locator('.student-work img').count(),0);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const text=fs.readFileSync(await download.path(),'utf8');assert(text.includes(RAW));assert(text.includes('Historial de comprobaciones'));assert(text.includes('84'));assert(text.includes('6,468'));
  await page.locator('#close-modal').click();await page.reload();await page.locator('#app').waitFor({state:'visible'});assert.equal(await page.locator('#f-why').inputValue(),RAW);
  // Opted-in learning criteria are captured with the check, rather than read retroactively.
  await page.evaluate(()=>QuidenceStorage.setItem('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:'number-theory',text:'Explain gcd geometrically / 保留原文',includeInReport:true})));
  await page.locator('#check').click();assert.equal(await page.evaluate(k=>JSON.parse(QuidenceStorage.getItem(k)).attempts.at(-1).learningRequest.text,KEY),'Explain gcd geometrically / 保留原文');
  await page.evaluate(()=>QuidenceStorage.setItem('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:'geometry',text:'Other course',includeInReport:true})));
  await page.locator('#check').click();assert.equal(await page.evaluate(k=>JSON.parse(QuidenceStorage.getItem(k)).attempts.at(-1).learningRequest,KEY),null);
  for(const [width,height]of [[1920,1080],[1440,900],[1024,768],[768,1024],[375,812],[320,812]]){
   await page.setViewportSize({width,height});
   for(const language of ['en','es']){
    await page.locator('#quidence-language').selectOption(language);await page.waitForFunction(l=>QuidenceI18n.locale===l,language);
    await page.locator('dialog[open]').count().then(async n=>{if(n)await page.locator('#close-modal').click();});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+width+' '+language);
    await page.locator('#toolkit').click();assert.equal(await page.locator('.tool-proof').count(),3);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('#close-modal').click();result.layouts++;
   }
   if([1440,375].includes(width))await page.screenshot({path:path.join(__dirname,'../review/screenshots/number-theory-'+width+'-20261010.webp'),type:'webp',fullPage:true});
  }
  const missing=await page.evaluate(()=>QuidenceI18n.missing);fs.writeFileSync(path.join(__dirname,'../localization/number-theory-browser-missing.json'),JSON.stringify(missing,null,2)+'\n');assert.deepEqual(missing,[],'untranslated Number Theory content');result.spanishProofSteps=86;result.interactiveModels=10;
  // Failed saves remain visible; no successful-save claim is shown.
  await page.evaluate(()=>{QuidenceStorage.setItem=()=>{throw Error('quota')};});await page.locator('#f-why').fill(RAW+' more');await page.waitForTimeout(250);assert.match(await page.locator('#save-status').textContent(),/Could not save|No se pudo guardar/);
  await context.close();
  const corruptContext=await browser.newContext(),cp=await corruptContext.newPage();await cp.goto(origin+'/courses/number-theory/');await cp.locator('#app').waitFor({state:'visible'});
  await cp.evaluate(k=>localStorage.setItem(k,'unreadable original'),KEY);await cp.reload();await cp.locator('#app').waitFor({state:'visible'});await cp.locator('#f-gcd').fill('84');await cp.waitForTimeout(250);assert.equal(await cp.evaluate(k=>localStorage.getItem(k),KEY),'unreadable original');
  await corruptContext.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);result.result='passed';
  fs.writeFileSync(path.join(__dirname,'../review/number-theory-browser-20261010.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
