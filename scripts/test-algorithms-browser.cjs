'use strict';
// Algorithms course in a real browser: the three views move together, predictions and every challenge
// record evidence, the suggestion follows it, the page reads in English and Spanish, learner words survive
// a language switch, a reload and an export, and a changed or unreadable record is never overwritten.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const A=require('../courses/algorithms/core.js');
const KEY='quidence:algorithms:v1',RAW='Primero miro el medio / I look at the middle\n  <img src=x onerror=alert(1)> & spaces.';
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const origin='http://127.0.0.1:'+server.address().port,errors=[],failed=[],result={algorithms:0,steps:0,predictions:0,challenges:0,layouts:0,errors,failedRequests:failed};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
  await page.goto(origin+'/courses/algorithms/?lang=en');await page.locator('#app').waitFor({state:'visible'});
  const open=async k=>{await page.locator(`[data-alg="${k}"]`).click();assert.equal(await page.locator(`[data-alg="${k}"]`).getAttribute('aria-pressed'),'true');};

  // Step every algorithm to its end. The flowchart box, the highlighted step and the code line follow the same event.
  for(const k of A.ORDER){await open(k);const g=A.ALGS[k],E=await page.evaluate(k=>{const g=QuidenceAlgorithms.ALGS[k],d=g.defaults;return g.gen(d.list,d.target,()=>0.5,[d.a,d.b]).map(e=>({node:e.node,line:e.line,ask:!!e.ask,row:!!e.row}));},k);
   let asked=0,rows=0;
   for(let i=0;i<E.length;i++){
    await page.locator('#b-next').click();if(await page.locator('[data-opt]').count()){await page.locator('[data-opt]').first().click();asked++;}
    const e=E[i];assert.equal(await page.locator('#flow .fn.cur').getAttribute('data-node'),e.node,k+' step '+i);
    if(e.line>=0){assert.equal(await page.locator('#steps li.cur .ln').textContent(),String(e.line+1),k+' step line '+i);
     const lines=g.code.python.map[e.line];assert.deepEqual(await page.locator('.code div.cur .n').allTextContents(),lines.map(String),k+' code line '+i);}
    if(e.row)rows++;result.steps++;}
   assert.equal(asked,E.filter(e=>e.ask).length,k+' predictions');result.predictions+=asked;
   assert.equal(await page.locator('#b-next').isDisabled(),true);assert.equal(await page.locator('.tracewrap tbody tr').count(),rows);
   assert.match(await page.locator('.tally').textContent(),new RegExp(`of ${asked} matched`));
   if(g.kind==='list'&&k!=='find-max'){const cells=await page.locator('.arr .cell .v').allTextContents();assert.deepEqual(cells.map(Number),[...g.defaults.list].sort((x,y)=>x-y));}
   result.algorithms++;}

  // Skipping predictions plays straight through, and one step can still be predicted on request.
  await open('bubble-sort');await page.locator('#skip').check();await page.locator('#b-next').click();assert.equal(await page.locator('[data-opt]').count(),0);
  for(let i=0;i<5&&!await page.locator('#b-force').count();i++){await page.locator('#b-next').click();assert.equal(await page.locator('[data-opt]').count(),0);}
  await page.locator('#b-force').click();assert.ok(await page.locator('[data-opt]').count()>=2);await page.locator('#b-skipone').click();
  await page.locator('#skip').uncheck();
  // The guide teaches each line in all three languages.
  for(const lang of ['python','java','matlab']){await page.locator(`[data-lang="${lang}"]`).click();await page.locator('#b-teach').click();
   for(let i=0;i<A.ALGS['bubble-sort'].teach.length;i++){assert.match(await page.locator('.teach .eyebrow').textContent(),new RegExp(`line ${i+1} of`));assert.deepEqual(await page.locator('.code div.new .n').allTextContents(),A.ALGS['bubble-sort'].code[lang].map[i].map(String));if(i<A.ALGS['bubble-sort'].teach.length-1)await page.locator('#t-next').click();}
   await page.locator('#b-teach').click();}
  await page.locator('[data-lang="python"]').click();
  // Invalid input is explained and changes nothing.
  await page.locator('#in-list').fill('3, x, 5');await page.locator('#in-apply').click();assert.match(await page.locator('[role="alert"]').textContent(),/2 to 12 whole numbers/);

  // The challenges start from an empty record, so the suggestions below depend only on them.
  await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.locator('#app').waitFor({state:'visible'});
  // #1: a counterexample, its reason, a tested improvement and the cost; the suggestion moves to #2.
  await open('find-max');await page.locator('#cx-list').fill('-3, -1, -7');await page.locator('#cx-go').click();assert.match(await page.locator('#challenges .result').first().textContent(),/largest number is -1, but starting with best ← 0 returns 0/);
  await page.locator('[data-why="0"]').click();assert.match(await page.locator('#challenges').textContent(),/0 is bigger than every negative number/);
  await page.locator('input[name="im-v"][value="1"]').check();await page.locator('#im-go').click();assert.match(await page.locator('#challenges').textContent(),/148 comparisons instead of 198/);
  await page.locator('[data-cx="2"]').click();assert.match(await page.locator('#challenges').textContent(),/Yes\. Every item after the first/);
  assert.equal(await page.locator('#challenges .ch.done').count(),3);result.challenges+=3;
  assert.match(await page.locator('#recbox .big').textContent(),/#2 Linear search/);assert.equal(await page.locator('#map .mapnode.rec title').textContent(),'#2 Linear search');
  await page.locator('#idea').fill(RAW);
  // #2: a repeated target, then a halving search built from blocks.
  await page.locator('#recbox [data-go="linear-search"]').click();assert.equal(await page.locator('[data-alg="linear-search"]').getAttribute('aria-pressed'),'true');
  await page.locator('#cx-list').fill('4, 7, 1, 7');await page.locator('#cx-target').fill('7');await page.locator('#cx-go').click();await page.locator('[data-why="0"]').click();
  await page.locator('#b-cond').selectOption('0');await page.locator('#b-slot0').selectOption('1');await page.locator('#b-slot1').selectOption('2');await page.locator('#b-slot2').selectOption('3');await page.locator('#b-test').click();
  assert.match(await page.locator('#challenges').textContent(),/Passed 300 of 300 lists/);result.challenges+=2;
  assert.match(await page.locator('#recbox .big').textContent(),/#3 Bubble sort, then #6 Binary search/);
  // #3: the bottleneck is chosen in the flowchart, by keyboard; then early stopping is tested.
  await open('bubble-sort');await page.locator('#bn-go').click();assert.equal(await page.locator('#flow .fn.pick').count(),A.ALGS['bubble-sort'].flow.nodes.length-1);
  await page.locator('#flow .fn.pick[data-node="icheck"]').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#challenges').textContent(),/The inner loop check runs 20 times/);
  await page.locator('#im-early').check();await page.locator('#im-go').click();assert.match(await page.locator('#challenges').textContent(),/nothing on reversed ones/);result.challenges+=2;
  assert.match(await page.locator('#recbox .big').textContent(),/#4 Insertion sort/);
  // #4: a decreasing list, and the busiest box on it.
  await open('insertion-sort');await page.locator('#cx-list').fill('5, 4, 3, 2, 1');await page.locator('#cx-go').click();await page.locator('[data-why="0"]').click();
  await page.locator('#bn-go').click();await page.locator('#flow .fn.pick[data-node="wcheck"]').click();assert.match(await page.locator('#challenges').textContent(),/The while check runs 15 times: once before every shift \(10\)/);result.challenges+=2;
  assert.match(await page.locator('#recbox .big').textContent(),/#5 Euclid/);
  // #5: a bigger pair with fewer steps, and the remainder replacing subtraction.
  await open('euclid');for(const [f,v] of [['a1','13'],['b1','8'],['a2','1000'],['b2','500']])await page.locator('#cx-'+f).fill(v);await page.locator('#cx-go').click();
  assert.match(await page.locator('#challenges').textContent(),/bigger pair \(1000, 500\) needs 1 step, but the smaller pair \(13, 8\) needs 5/);await page.locator('[data-why="0"]').click();
  await page.locator('input[name="im-v"][value="1"]').check();await page.locator('#im-go').click();assert.match(await page.locator('#challenges').textContent(),/Correct on all 200 pairs/);result.challenges+=2;
  assert.match(await page.locator('#recbox .big').textContent(),/#8 Recursion/);assert.equal(await page.locator('#recbox [data-go]').count(),1,'only open algorithms get an Open button');
  // The route map opens an algorithm from the keyboard.
  await page.locator('#map [data-open="find-max"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-alg="find-max"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#idea').inputValue(),RAW);

  // Spanish: the page, the record and the learner's words.
  await page.waitForTimeout(400);const before=await page.evaluate(k=>localStorage.getItem(k),KEY);assert.ok(before.includes(JSON.stringify(RAW).slice(1,-1)));
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.equal(await page.locator('#idea').inputValue(),RAW);assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),before);
  assert.equal(await page.locator('#alg h2').textContent(),'Encontrar el máximo');assert.equal(await page.locator('#think-title').textContent(),'Piensa más allá');
  assert.match(await page.locator('.content-language-note').textContent(),/inglés o en español/);assert.match(await page.locator('h1').textContent(),/Sigue la lógica/);
  assert.match(await page.locator('#steps').textContent(),/para i desde 1 hasta n − 1:/);assert.match(await page.locator('#recbox .big').textContent(),/#2 Búsqueda lineal/);
  assert.deepEqual(await page.evaluate(()=>QuidenceI18n.missing),[],'untranslated Algorithms page text');
  // The session record shows the learner's words exactly, and exports them in Spanish notes.
  await page.locator('#session').click();assert.equal(await page.locator('#modal-title').textContent(),'Tu sesión de algoritmos');assert.equal(await page.locator('#modal-body .student-work').first().textContent(),RAW);
  const dl=page.waitForEvent('download');await page.locator('#export').click();const file=await dl;assert.equal(file.suggestedFilename(),'Quidence-algorithms-session.md');
  const md=fs.readFileSync(await file.path(),'utf8');assert.ok(md.includes(RAW));assert.match(md,/# Quidence · Algoritmos/);assert.match(md,/### Historial de revisiones/);assert.match(md,/Datos: Lista: -3, -1, -7/);
  await page.locator('#close-modal').click();
  // A reload keeps the evidence and the words.
  await page.reload();await page.locator('#app').waitFor({state:'visible'});await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.equal(await page.locator('#idea').inputValue(),RAW);assert.equal(await page.locator('#challenges .ch.done').count(),3);
  await page.locator('#quidence-language').selectOption('en');await page.waitForFunction(()=>QuidenceI18n.locale==='en');

  // Layout: no sideways scroll, and every flowchart label fits its box, at each width and in both languages.
  for(const lang of ['en','es'])for(const [width,height] of [[1440,900],[1024,768],[768,1024],[375,812],[320,700]]){
   await page.setViewportSize({width,height});await page.goto(origin+'/courses/algorithms/?lang='+lang);await page.locator('#app').waitFor({state:'visible'});if(lang==='es')await page.waitForFunction(()=>QuidenceI18n.locale==='es');
   for(const k of A.ORDER){await open(k);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${k} ${width} ${lang}`);
    const tight=await page.evaluate(()=>[...document.querySelectorAll('#flow .fn')].filter(g=>{const t=g.querySelector('text').getBBox(),s=g.querySelector('rect,polygon').getBBox(),dec=g.querySelector('polygon');return t.width>(dec?s.width*(1-t.height/s.height):s.width-8);}).map(g=>g.dataset.node));
    assert.deepEqual(tight,[],`flowchart labels ${k} ${lang}`);
    if(width<=375){const box=await page.locator('#flow svg').boundingBox();assert.ok(box.width/A.ALGS[k].flow.w>=.84,`flowchart readable at ${width}: ${k}`);}}
   result.layouts++;}

  // A record changed in another tab is not overwritten, and its original can be exported.
  await page.setViewportSize({width:1280,height:900});await page.goto(origin+'/courses/algorithms/?lang=en');await page.locator('#app').waitFor({state:'visible'});
  const other=await context.newPage();await other.goto(origin+'/courses/algorithms/?lang=en');await other.locator('#app').waitFor({state:'visible'});await other.locator('#idea').fill('another tab');await other.waitForTimeout(400);
  const changed=await page.evaluate(k=>localStorage.getItem(k),KEY);await page.locator('#idea').fill(RAW+' more');await page.waitForTimeout(400);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),changed);assert.match(await page.locator('#save-status').textContent(),/changed in another tab/);
  await page.locator('#review-session').click();assert.equal(await page.locator('#export-original').count(),1);await page.locator('#close-modal').click();await other.close();
  // An unreadable record is kept until the learner exports it and resets.
  await page.evaluate(k=>localStorage.setItem(k,'unreadable original'),KEY);await page.reload();await page.locator('#app').waitFor({state:'visible'});
  assert.match(await page.locator('#save-status').textContent(),/could not be read/);await page.locator('[data-cx="2"]').click();await page.waitForTimeout(300);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),'unreadable original');
  await page.locator('#review-session').click();const orig=page.waitForEvent('download');await page.locator('#export-original').click();assert.equal(fs.readFileSync(await (await orig).path(),'utf8'),'unreadable original');
  await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();assert.match(await page.locator('#toast').textContent(),/cleared/);
  const fresh=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),KEY));assert.equal(fresh.version,1);assert.deepEqual(fresh.evidence,{});
  await page.evaluate(k=>localStorage.removeItem(k),KEY);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  console.log(JSON.stringify(result));
 }finally{await browser?.close();server.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
