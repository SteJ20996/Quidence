'use strict';
// Cross-disciplinary projects in a browser: steps, proofs, answer checks, every lab in English and Spanish,
// saved work, exports and phone layouts. Animations run with reduced motion, so each one jumps to its end.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const data=require('../cross-disciplinary/data.json'),C=require('../courses/number-theory/core.js'),source=require('../content/cross-disciplinary/projects.cjs');
const KEY='quidence:cross-disciplinary:v1',RAW='Mi razonamiento original / my own proof\n  <img src=x onerror=alert(1)> & spaces.';
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const origin='http://127.0.0.1:'+server.address().port,errors=[],failed=[];
 const result={projects:data.length,steps:0,labs:0,layouts:0,languages:['en','es'],errors,failedRequests:failed};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
  await page.goto(origin+'/cross-disciplinary/?lang=en');await page.locator('#app').waitFor({state:'visible'});
  const p=data[0],step=async i=>{await page.locator(`[data-step="${i}"]`).click();};
  // Every step names the courses it draws on and links them.
  for(let i=0;i<p.steps.length;i++){
   await step(i);assert.equal(await page.locator('#work h3').first().textContent(),p.steps[i].title);
   assert.deepEqual(await page.locator('#work .x-chip').evaluateAll(as=>as.map(a=>new URL(a.href).pathname)),p.steps[i].connects.map(id=>'/courses/'+id+'/'));
   await page.locator('#proof').evaluate(e=>e.open=true);assert((await page.locator('.proof-content').textContent()).includes(p.steps[i].proof.split('\n')[0]));
   assert.equal(await page.locator('[data-field]').count(),p.steps[i].fields.reduce((n,f)=>n+(f.type==='choice'?f.options.length:1),0));result.steps++;
  }
  // Labs show a result only after the learner acts, so they do not answer a step in advance.
  const labText=async i=>{await step(i);return page.locator('#lab').textContent();};
  assert.match(await labText(0),/No cuts yet/);assert.match(await labText(1),/No cuts yet/);assert.match(await labText(3),/No cuts yet/);
  const trap=await labText(4);assert.doesNotMatch(trap,/\b(26|42)\b/);
  await page.locator('[data-lab="view-ball"]').click();assert.doesNotMatch(await page.locator('#lab').textContent(),/\b15 of the 16\b|No piece/);
  // Each lab reaches the counts that the project proves.
  const run=async(i,actions)=>{await step(i);for(const a of actions)await page.locator(`#lab [data-lab="${a}"]`).click();result.labs++;return normalize(await page.locator('#lab-status').textContent());};
  assert.equal(await run(0,['stick-next','stick-next','stick-next']),'Cut 3 landed inside one piece and split it in two: 4 pieces.');
  assert.match(await run(0,['stick-repeat']),/still 4 pieces/);
  assert.equal(await run(1,['pizza-next','pizza-next','pizza-next','pizza-next']),'Cut 4 crossed 3 earlier cuts, so it has 4 segments and added 4 pieces: 11 in all.');
  assert.equal(await page.locator('#lab svg text.x-badge-text').count(),4);
  assert.match(await run(1,['view-point','pizza-next','pizza-next','pizza-next']),/6 in all/);
  assert.match(await run(2,['stairs-pair']),/4 by 5 rectangle.*: 10\./);
  await page.locator('#lab [data-lab="stairs-n"]').evaluate(e=>{e.value=10;e.dispatchEvent(new Event('input',{bubbles:true}));});assert.match(await page.locator('#lab .x-readouts').textContent(),/56/);
  assert.match(await run(2,['view-crossings','cross-next','cross-next']),/1 \+ 5 \+ 10 = 16 pieces/);
  assert.equal(await run(3,['ball-next','ball-next','ball-next','ball-next']),'Cut 4: its face shows 3 lines, which make 7 pieces of the face, so the cut added 7 pieces: 15 in all.');
  await page.locator('#lab [data-lab="ball-turn"]').evaluate(e=>{e.value=40;e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await page.locator('#lab .x-range output').textContent(),'40°');
  assert.match(await run(3,['ball-next']),/11 pieces: 26 in all/);
  assert.match(await run(4,['view-chart','chart-grow']),/with 6 cuts it has 42, 22 fewer than 64/);
  assert.match(await run(4,['view-pizza','pizza-visit']),/no piece has it/);
  assert.equal(await page.locator('#lab .x-address-cell.missing').count(),1);
  assert.match(await run(4,['view-ball','ball-visit']),/^15 of the 16 addresses have a piece\./);
  assert.equal(await page.locator('#lab .x-address-cell.missing').count(),1);
  assert.match(await run(4,['view-stack','stack-next','stack-next','stack-next','stack-next']),/16 pieces/);
  await run(5,['table-build']);assert.deepEqual(await page.locator('#lab .x-diff-row').last().locator('.x-diff-cell').allTextContents(),['1','1','1','1','1']);
  assert.match(await run(5,['view-pascal','pascal-play']),/Row 4: the first 4 numbers add up to 15\./);
  // Checked answers and saved explanations.
  await step(0);await page.locator('#f-stick3').fill('4');await page.locator('#f-stick10').fill('11');await page.locator('#check').click();assert.match(await page.locator('#feedback-stick3').textContent(),/Correct/);
  await page.locator('#f-stick3').fill('5');await page.locator('#check').click();assert.match(await page.locator('#feedback-stick3').textContent(),/Try again/);
  await step(3);await page.locator('#f-face').fill(RAW);await page.locator('#check').click();assert.match(await page.locator('#feedback-face').textContent(),/saved for review/);
  const before=await page.evaluate(k=>localStorage.getItem(k),KEY);
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.equal(await page.locator('#f-face').inputValue(),RAW);assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),before);
  // The Spanish written beside each English source is what the page shows, at desktop and phone widths.
  for(const width of [1440,375]){await page.setViewportSize({width,height:900});for(let i=0;i<p.steps.length;i++){
   const authored=source[0].steps[i];await step(i);await page.locator('#proof').evaluate(e=>e.open=true);await page.evaluate(()=>QuidenceI18n.apply());
   assert.equal(await page.locator('#project-head h2').textContent(),normalize(source[0].title.es));
   assert.equal(await page.locator('#work h3').textContent(),normalize(authored.title.es));
   assert.deepEqual((await page.locator('.proof-content > p:not(.proof-label)').allTextContents()).map(normalize),authored.proof.map(x=>normalize(x.es)));
   for(const f of p.steps[i].fields)if(f.options)assert.deepEqual(await page.locator(`input[data-field="${f.id}"]`).evaluateAll(es=>es.map(e=>e.value)),C.orderedOptions(f,p.id+':'+i+':'+f.id).map(o=>o.value));
   // On a phone the lab sits inside the step, after the question that refers to it.
   assert.equal(await page.locator('#lab-slot #lab-card').count(),width<=1000?1:0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,'overflow at step '+i+' and '+width);
  }}
  await page.setViewportSize({width:1440,height:900});
  // Every lab control runs in Spanish too, so its live text is checked for translations.
  for(const [i,actions]of [[0,['stick-reset','stick-next','stick-next','stick-repeat']],[1,['view-general','pizza-next','pizza-next','pizza-next','pizza-replay','view-point','pizza-next','pizza-next','pizza-next','pizza-reset']],
   [2,['view-stairs','stairs-pair','stairs-pair','view-crossings','cross-reset','cross-next']],[3,['ball-reset','ball-next','ball-next','ball-next','ball-replay','ball-reset']],
   [4,['view-chart','chart-grow','view-pizza','pizza-visit','view-ball','ball-visit','view-stack','stack-reset','stack-next']],[5,['view-table','table-build','table-all','view-pascal','dim-1','dim-2','dim-3','pascal-play']]]){
   await step(i);for(const a of actions){await page.locator(`#lab [data-lab="${a}"]`).click();await page.evaluate(()=>QuidenceI18n.apply());}
  }
  await page.locator('#lab [data-lab="pascal-n"]').evaluate(e=>{e.value=6;e.dispatchEvent(new Event('input',{bubbles:true}));});await page.evaluate(()=>QuidenceI18n.apply());
  assert.match(await page.locator('#lab-status').textContent(),/^Fila 6: los primeros 4 números suman 42\.$/);
  await step(3);await page.locator('#session').click();assert((await page.locator('.student-work').allTextContents()).includes(RAW));assert.equal(await page.locator('.student-work img').count(),0);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;assert.match(download.suggestedFilename(),/^Quidence-cross-disciplinary-/);
  const text=fs.readFileSync(await download.path(),'utf8');assert(text.includes(RAW));assert(text.includes('Historial de comprobaciones'));assert(text.includes('Estado de la respuesta:'));
  await page.locator('#close-modal').click();await page.reload();await page.locator('#app').waitFor({state:'visible'});assert.equal(await page.locator('#f-face').inputValue(),RAW);
  for(const [width,height]of [[1920,1080],[1440,900],[1024,768],[768,1024],[375,812],[320,812]]){
   await page.setViewportSize({width,height});
   for(const language of ['en','es']){
    await page.locator('#quidence-language').selectOption(language);await page.waitForFunction(l=>QuidenceI18n.locale===l,language);
    for(let i=0;i<p.steps.length;i++){await step(i);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+width+' '+language+' step '+i);}
    result.layouts++;
   }
  }
  const missing=await page.evaluate(()=>QuidenceI18n.missing);assert.deepEqual(missing,[],'untranslated cross-disciplinary content');
  // Failed saves remain visible; no successful-save claim is shown.
  await page.evaluate(()=>{QuidenceStorage.setItem=()=>{throw Error('quota')};});await step(3);await page.locator('#f-face').fill(RAW+' more');await page.waitForTimeout(250);assert.match(await page.locator('#save-status').textContent(),/Could not save|No se pudo guardar/);
  await context.close();
  // An unreadable saved record is kept as it was.
  const corruptContext=await browser.newContext(),cp=await corruptContext.newPage();await cp.goto(origin+'/cross-disciplinary/');await cp.locator('#app').waitFor({state:'visible'});
  await cp.evaluate(k=>localStorage.setItem(k,'unreadable original'),KEY);await cp.reload();await cp.locator('#app').waitFor({state:'visible'});await cp.locator('#f-stick3').fill('4');await cp.waitForTimeout(250);assert.equal(await cp.evaluate(k=>localStorage.getItem(k),KEY),'unreadable original');
  await corruptContext.close();
  // The homepage section and its card open the project in every appearance.
  for(const theme of ['classic','paper','atlas','studio']){
   const home=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});await home.addInitScript(t=>{try{localStorage.setItem('quidence_ui_theme_v1',t);}catch{}},theme);
   const hp=await home.newPage();hp.on('pageerror',e=>errors.push(theme+': '+e.message));await hp.goto(origin+'/?view=courses&lang=en');
   const card=hp.locator('.subject-card[data-subject="cross-p01"]');await card.waitFor({state:'visible'});
   assert.equal(new URL(await card.locator('.subject-link').getAttribute('href'),origin+'/').pathname,'/cross-disciplinary/');
   if(theme!=='classic'){await hp.locator('#subject-categories [data-category="cross"]').click();assert.deepEqual(await hp.locator('.subject-card:visible').evaluateAll(cs=>cs.map(c=>c.dataset.subject)),['cross-p01']);}
   await home.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);result.result='passed';
  fs.writeFileSync(path.join(__dirname,'../review/cross-disciplinary-browser-20261031.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
