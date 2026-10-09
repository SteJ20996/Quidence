'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const RAW='The cart is up and the speed is in the top lap. Use six or one for the Sum.\nSave my answer\nConstant velocity means the velocity does not change, so a = 0.';
async function run(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const missing=new Set(),errors=[],requests=[];let lessons=0,steps=0,controlStates=0;
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE});
  const page=await browser.newPage({viewport:{width:375,height:950}}),origin='http://127.0.0.1:'+server.address().port;
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  const collect=async()=>{await page.evaluate(()=>QuidenceI18n.apply());for(const key of await page.evaluate(()=>QuidenceI18n.missing))missing.add(key);};
  const storage=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k!=='quidence_ui_locale_v1')));
  await page.goto(origin+'/?lang=en');assert(!requests.some(r=>r.includes('i18n-es.js')),'English loaded the Spanish catalog');
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');assert(requests.some(r=>r.includes('i18n-es.js')));
  assert.equal(await page.evaluate(()=>QuidenceI18n.text('The new student sentence is in your notebook.')),'The new student sentence is in your notebook.');
  for(const course of ['pre-algebra','algebra-1','geometry','algebra-2','physics','physics-1','physics-2']){
   await page.goto(origin+'/courses/'+course+'/?lang=es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');await collect();
   const count=await page.evaluate(raw=>{
    const E=QuidenceCourseEngine,C=QuidenceCourseContent,s=E.fresh();
    for(const l of C.LESSONS)for(const t of [l.predict,...l.checks]){E.update(s,t.id,{choices:['unsure'],explanation:raw,otherHelp:false});assertSubmit(E.submit(s,t.id,t===l.predict?'predict':'check'));}
    function assertSubmit(ok){if(!ok)throw Error('Could not seed submitted evidence');}
    s.lessons.forEach(l=>{l.seenSteps=[0,1,2,3];l.reviewed=true;});s.view='lesson';s.stage='review';localStorage.setItem(E.SCHEMA,JSON.stringify(s));return C.LESSONS.length;
   },RAW);await page.reload();await page.waitForFunction(()=>QuidenceI18n.locale==='es');
   for(let i=0;i<count;i++){
    await page.locator('[data-action="open"][data-index="'+i+'"]').click();
    assert.deepEqual(await page.locator('.written-answer [data-no-translate]').allTextContents(),[RAW,RAW],course+' original explanation');
    const before=await storage();await page.locator('#quidence-language').selectOption('en');await page.locator('#quidence-language').selectOption('es');assert.deepEqual(await storage(),before,'feedback language switch changed source records');
    await collect();lessons++;
    if(course==='physics-1'&&i===0){const folder=path.join(__dirname,'../review/screenshots');fs.mkdirSync(folder,{recursive:true});await page.screenshot({path:path.join(folder,'review-fix-original-explanation-es-375.webp'),fullPage:true});}
    await page.locator('[data-action="relearn"]').click();
    for(let j=0;j<4;j++){
     await page.locator('[data-action="step"][data-index="'+j+'"]').click();await collect();steps++;
     for(const control of await page.locator('[id^="lab-"]').all()){
      const tag=await control.evaluate(e=>e.tagName);
      const values=await control.evaluate(e=>e.tagName==='SELECT'?[...e.options].map(o=>o.value):[e.min,e.max]);
      for(const value of [...new Set(values)]){if(tag==='SELECT')await control.selectOption(value);else await control.evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},value);await collect();controlStates++;}
     }
     assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,course+' step overflow');
    }
   }
  }
  // Ambiguous input stays a draft until corrected or explicitly confirmed.
  await page.goto(origin+'/diagnostics/?module=physics-1&lang=es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  await page.locator('[data-f-action="resume"]').click();const first=page.locator('input[data-f-field]').first();
  await page.locator('[data-f-explanation]').fill(RAW);
  for(const raw of ['0,125','1,234','1,57']){
   await first.fill(raw);await page.locator('[data-f-answer] button[type="submit"]').first().click();
   assert.equal(await first.inputValue(),raw);assert(await page.locator('.f-number-format').isVisible());assert.equal(await page.locator('[data-f-confirm-number]').count(),0);
   assert.equal(await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem(QuidenceChallengeEngine.SCHEMA)),s=QuidenceChallengeEngine.session(p,'physics-1');return Object.values(s.records).reduce((n,r)=>n+r.submissions.length,0);}),0);
  }
  const ids=await page.locator('input[data-f-field]').evaluateAll(es=>es.map(e=>e.id));for(const id of ids)await page.locator('#'+id).fill('1');
  await first.fill('12.000');await page.locator('[data-f-answer] button[type="submit"]').first().click();assert.equal(await page.locator('[data-f-confirm-number]').count(),1);
  await first.press('Enter');assert.equal(await page.locator('[data-f-action="next"]').isDisabled(),true,'Enter silently confirmed punctuation');
  await first.fill('13.000');await page.locator('[data-f-confirm-number]').click();assert.equal(await page.locator('[data-f-action="next"]').isDisabled(),true,'stale readout silently confirmed a changed value');
  await first.fill('12.000');await page.locator('[data-f-answer] button[type="submit"]').first().click();
  await collect();await page.locator('[data-f-confirm-number]').click();
  const saved=await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem(QuidenceChallengeEngine.SCHEMA)),s=QuidenceChallengeEngine.session(p,'physics-1');return Object.values(s.records)[0].submissions.at(-1);});
  assert(Object.values(saved.answer.values).includes('12.000'));assert.equal(saved.answer.explanation,RAW);
  await page.reload();assert.equal(await first.inputValue(),'12.000');assert.equal(await page.locator('[data-f-action="next"]').isDisabled(),false,'confirmed input did not resume');
  await page.goto(origin+'/reports/?lang=es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');await collect();
  await page.evaluate(raw=>QuidenceReportStore.save('physics-1',{check:'Intermediate & advanced diagnostic',reportText:'# Saved reports\n\n'+raw.split('\n').map(s=>'> '+s).join('\n'),observations:[{title:'A cart turns around',status:'matched',components:[{label:'Velocity (m/s)',state:'matched'}],explanation:raw,explanationReview:null}]},'locale-date-regression'),RAW);
  await page.reload();await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  const reportStorage=await storage(),dateEs=await page.locator('time[data-i18n-date]').first().textContent();
  await page.locator('[data-r-action="open"]').first().click();assert.equal(await page.locator('.f-quote').textContent(),RAW);
  await page.locator('#quidence-language').selectOption('en');const dateEn=await page.locator('time[data-i18n-date]').first().textContent();assert.notEqual(dateEn,dateEs);
  await page.locator('#quidence-language').selectOption('es');assert.equal(await page.locator('time[data-i18n-date]').first().textContent(),dateEs);assert.deepEqual(await storage(),reportStorage);await collect();
  const screens=path.join(__dirname,'../review/screenshots');fs.mkdirSync(screens,{recursive:true});await page.screenshot({path:path.join(screens,'review-fix-reports-es-375.webp')});
  // Leaving a viewer in an existing single-page route must not let a stale
  // language callback render it over the next activity.
  await page.evaluate(()=>{document.getElementById('saved-reports').innerHTML='<p id="other-view">Start exploring →</p>';});await page.locator('#quidence-language').selectOption('en');assert.equal(await page.locator('#other-view').count(),1);
  fs.writeFileSync(path.join(__dirname,'../localization/course-review-missing.json'),JSON.stringify([...missing].sort(),null,2)+'\n');
  assert.deepEqual([...missing],[],'unreviewed course or validation text');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({lessons,steps,controlStates,numericCases:4,errors,missing:missing.size}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
