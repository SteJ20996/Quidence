'use strict';
// Plays the Quantitative Reasoning course page in a real browser: the lessons load, and a full quick round can be
// answered, checked, saved, reloaded and listed, at desktop and phone widths, with no page errors.
const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const R=require('../assets/quant-rounds.js');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch(),errors=[];
 try{
  for(const [theme,width] of [['classic',1280],['studio',375]]){
   const context=await browser.newContext({viewport:{width,height:900}});await context.addInitScript(t=>localStorage.setItem('quidence_ui_theme_v1',t),theme);
   const page=await context.newPage();page.on('pageerror',e=>errors.push(theme+': '+e.message));page.on('console',m=>{if(m.type()==='error')errors.push(theme+': '+m.text());});
   await page.goto(origin+'/courses/quantitative/');await page.locator('#quick-rounds h2').waitFor();
   assert.match(await page.locator('#app').textContent(),/Think fast/);
   assert.equal(await page.locator('#quick-rounds [data-qr="start"]').count(),1);
   await page.locator('#quick-rounds [data-qr="timer"]').check();
   await page.locator('#quick-rounds [data-qr="start"]').click();
   const record=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),R.SCHEMA);
   const saved=await record();assert.equal(saved.timer,true);const round=saved.rounds.at(-1),items=R.makeRound(round.seed,round.lessons);
   for(const [i,item] of items.entries()){
    assert.match(await page.locator('#quick-rounds').textContent(),new RegExp('Question '+(i+1)+' of 5'));
    // An answer without a confidence rating is not checked.
    if(i===0){if(item.kind==='choice')await page.locator(`#quick-rounds input[name="qr-answer"][value="${item.exact}"]`).check();else await page.locator('#quick-rounds input[name="qr-answer"]').fill(String(Number(item.exact.toPrecision(6))));
     await page.locator('#quick-rounds [data-qr="submit"]').click();assert.match(await page.locator('#quick-rounds .quick-error').textContent(),/how sure/);}
    if(item.kind==='choice')await page.locator(`#quick-rounds input[name="qr-answer"][value="${item.exact}"]`).check();else await page.locator('#quick-rounds input[name="qr-answer"]').fill(String(Number(item.exact.toPrecision(6))));
    if(item.kind==='number')assert.match(await page.locator('#quick-rounds .quick-rule').textContent(),new RegExp('Counts as right '+item.accept));
    await page.locator('#quick-rounds input[name="qr-confidence"][value="90"]').check();await page.locator('#quick-rounds [data-qr="submit"]').click();
    assert.match(await page.locator('#quick-rounds .quick-feedback').textContent(),/^Right\./);
    // The check is announced once, and focus moves to the next step.
    await page.waitForFunction(()=>/^Right\./.test(document.querySelector('#quick-rounds [data-qr-live]').textContent));
    assert.equal(await page.evaluate(()=>document.activeElement?.dataset.qr),'next');
    await page.locator('#quick-rounds [data-qr="next"]').click();
    if(i<4)assert.equal(await page.evaluate(()=>document.activeElement?.id),'qr-prompt');
   }
   assert.match(await page.locator('#quick-rounds .quick-score').textContent(),/5 of 5 right · average confidence 90% · Brier score 0\.01/);
   assert.match(await page.locator('#quick-rounds .quick-result').textContent(),/Five answers are too few to judge calibration\. After 20 answers \(you have 5\)/);
   assert(await page.evaluate(()=>document.activeElement?.classList.contains('quick-result')),'focus moves to the result');
   const after=await record();assert.equal(after.rounds.at(-1).answers.length,5);assert(after.rounds.at(-1).finishedAt);assert(after.rounds.at(-1).answers.every(a=>a.correct&&a.confidence===90&&Number.isFinite(a.seconds)));assert(R.hydrate(after));
   await page.reload();await page.locator('#quick-rounds .quick-history').waitFor();assert.equal(await page.locator('#quick-rounds .quick-history tbody tr').count(),1);assert(await page.locator('#quick-rounds [data-qr="timer"]').isChecked());
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,theme+' overflows at '+width);
   // The lessons still start below the course header.
   await page.locator('[data-action="start"]').first().click();assert.match(await page.locator('#app').textContent(),/Part 1 · Fast estimates/);
   await context.close();
  }
  // A record that cannot be read is kept as it is, and new rounds are not saved over it.
  const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>errors.push('broken: '+e.message));
  await page.addInitScript(k=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem(k,'{broken');sessionStorage.setItem('seeded','1');}},R.SCHEMA);
  await page.goto(origin+'/courses/quantitative/');await page.locator('#quick-rounds [data-qr="start"]').click();
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),R.SCHEMA),'{broken');await context.close();
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({quickRounds:'passed',themes:2}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
