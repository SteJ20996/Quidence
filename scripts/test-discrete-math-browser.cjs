'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const data=require('../courses/discrete-math/data.json'),C=require('../courses/number-theory/core.js'),source=require('../content/discrete-math/projects.cjs');
const KEY='quidence:discrete-math:v1',RAW='Mi razonamiento original / my own proof\n  <img src=x onerror=alert(1)> & spaces.';
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const origin='http://127.0.0.1:'+server.address().port,errors=[],failed=[];
 const result={projects:10,steps:0,layouts:0,languages:['en','es'],errors,failedRequests:failed};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
  await page.goto(origin+'/courses/discrete-math/?lang=en');await page.locator('#app').waitFor({state:'visible'});
  // Both checks open from the course page.
  assert.deepEqual(await page.locator('.topbar-links a').evaluateAll(as=>as.map(a=>new URL(a.href).pathname+new URL(a.href).searchParams.get('module'))),['/foundations/discrete-math','/diagnostics/discrete-math']);
  for(const p of data){await page.locator('[data-project="'+p.id+'"]').click();for(let i=0;i<p.steps.length;i++){
   await page.locator('[data-step="'+i+'"]').click();assert.equal(await page.locator('#work h3').first().textContent(),p.steps[i].title);
   await page.locator('#proof').evaluate(e=>e.open=true);assert((await page.locator('.proof-content').textContent()).includes(p.steps[i].proof.split('\n')[0]));
   assert.equal(await page.locator('[data-field]').count(),p.steps[i].fields.reduce((n,f)=>n+(['choice','multi'].includes(f.type)?f.options.length:1),0));result.steps++;
  }}
  assert.equal(result.steps,40);
  await page.locator('[data-project="dm-p01"]').click();await page.locator('[data-step="0"]').click();
  await page.locator('#f-edges').fill('7');await page.locator('#f-degree').fill('3');await page.locator('#check').click();assert.match(await page.locator('#feedback-edges').textContent(),/Correct/);
  await page.locator('#f-edges').fill('6');await page.locator('#check').click();assert.match(await page.locator('#feedback-edges').textContent(),/Try again/);
  await page.locator('[data-step="1"]').click();await page.locator('#f-two').fill(RAW);await page.locator('#check').click();assert.match(await page.locator('#feedback-two').textContent(),/saved for review/);
  const before=await page.evaluate(k=>localStorage.getItem(k),KEY);
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.equal(await page.locator('#f-two').inputValue(),RAW);assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),before);
  assert.match(await page.locator('.content-language-note').textContent(),/inglés o español/);assert.match(await page.locator('#check').textContent(),/Comprueba/);
  // Every authored title, proof paragraph and option is shown in the Spanish written beside its English source.
  const collect=async()=>{await page.evaluate(()=>QuidenceI18n.apply());};
  const chooseProject=async id=>{if(await page.locator('#project-select').isVisible())await page.locator('#project-select').selectOption(id);else await page.locator(`[data-project="${id}"]`).click();};
  for(const width of [1440,375]){await page.setViewportSize({width,height:900});for(const [n,p]of data.entries()){await chooseProject(p.id);for(let i=0;i<p.steps.length;i++){
   const authored=source[n].steps[i];
   await page.locator(`[data-step="${i}"]`).click();await page.locator('#proof').evaluate(e=>e.open=true);await collect();
   assert.equal(await page.locator('#project-head h2').textContent(),normalize(source[n].title.es));
   assert.equal(await page.locator('#work h3').textContent(),normalize(authored.title.es));
   assert.deepEqual((await page.locator('.proof-content > p:not(.proof-label)').allTextContents()).map(normalize),authored.proof.map(x=>normalize(x.es)));
   for(const f of p.steps[i].fields)if(f.options)assert.deepEqual(await page.locator(`input[data-field="${f.id}"]`).evaluateAll(es=>es.map(e=>e.value)),C.orderedOptions(f,p.id+':'+i+':'+f.id).map(o=>o.value));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,'Discrete Mathematics overflow '+p.id+' '+i+' at '+width);
  }}}
  await page.setViewportSize({width:1440,height:900});
  // Labs show a result only after the learner acts, so they do not answer a step in advance.
  const labText=async(project,step)=>{await chooseProject(project);await page.locator(`[data-step="${step}"]`).click();return page.locator('#lab').textContent();};
  assert.doesNotMatch(await labText('dm-p02',0),/56/);assert.doesNotMatch(await labText('dm-p05',0),/30/);
  assert.doesNotMatch(await labText('dm-p07',0),/[35]/);assert.doesNotMatch(await labText('dm-p09',1),/\b9\b/);
  assert.doesNotMatch(await labText('dm-p04',0),/7/);assert.match(await labText('dm-p08',0),/T\(2\) = 2/);
  // Every lab control runs in Spanish, so its live text is checked for translations too.
  for(const [project,step,actions]of [
   ['dm-p01',0,['slot-A','slot-B','slot-B','slot-C','slot-D','slot-D','slot-E','slot-E','slot-E','slot-F','slot-F','slot-reset']],
   ['dm-p02',2,['paths-next','paths-next','paths-all','paths-close','paths-close','paths-reset']],
   ['dm-p03',1,['pick-1','pick-20','pick-7','pick-1','pigeon-odd','pick-12','pick-3','pigeon-sum','pick-clear']],
   ['dm-p04',0,['hanoi-0-2','hanoi-0-1','hanoi-2-1','hanoi-0-2','hanoi-1-0','hanoi-1-2','hanoi-0-2','hanoi-4','hanoi-0-1','hanoi-reset','hanoi-3']],
   ['dm-p05',0,['board-count','board-colors','board-swap','board-swap','board-colors','board-count']],
   ['dm-p06',2,['tromino-2','hole-3-1','tromino-3','hole-5-6','hole-0-0']],
   ['dm-p07',3,['bridge-degrees','bridge-BC','bridge-AD','bridge-BC','bridge-AD','bridge-degrees']],
   ['dm-p08',0,['strip-up','strip-up','strip-down']],
   ['dm-p09',1,['perm-mark','perm-toggle','perm-toggle','perm-mark']],
   ['dm-p10',1,['kruskal-next','kruskal-next','kruskal-next','kruskal-next','kruskal-next','kruskal-next','kruskal-next','kruskal-next','kruskal-next','kruskal-reset']]
  ]){await chooseProject(project);await page.locator(`[data-step="${step}"]`).click();for(const action of actions){await page.locator(`[data-lab="${action}"]`).click();await collect();}}
  // The Hanoi lab reaches the fewest-moves solution and blocks an illegal move without counting it.
  await chooseProject('dm-p04');await page.locator('[data-lab="hanoi-reset"]').click();
  for(const move of ['0-2','0-1','2-1','0-2','1-0','1-2','0-2'])await page.locator(`[data-lab="hanoi-${move}"]`).click();
  await page.locator('#quidence-language').selectOption('en');await page.waitForFunction(()=>QuidenceI18n.locale==='en');
  assert.match(await page.locator('#lab .lab-status').textContent(),/Solved in 7 moves/);
  await page.locator('[data-lab="hanoi-reset"]').click();await page.locator('[data-lab="hanoi-0-1"]').click();await page.locator('[data-lab="hanoi-0-1"]').click();
  assert.equal(await page.locator('#lab .lab-status').textContent(),'Moves: 1');
  // Kruskal's algorithm stops at the cost proved in the project.
  await chooseProject('dm-p10');await page.locator('[data-step="1"]').click();for(let i=0;i<9;i++)await page.locator('[data-lab="kruskal-next"]').click();
  assert.match(await page.locator('#lab').textContent(),/Total cost: 17/);
  // Rounded fractions follow the shared Number Theory rule: at least two correctly rounded decimal places.
  await chooseProject('dm-p09');await page.locator('[data-step="2"]').click();
  for(const [value,correct]of [['11/30',true],['44/120',true],['0.37',true],['0.367',true],['0.3667',true],['0.36',false],['0.3666',false],['0.4',false]]){
   await page.locator('#f-p5').fill(value);await page.locator('#check').click();
   assert.equal(await page.locator('#feedback-p5').evaluate(e=>e.classList.contains('correct')),correct,value);
  }
  // Multi-select answers need exactly the right set; option order survives a language switch and a reload.
  await chooseProject('dm-p03');await page.locator('[data-step="1"]').click();
  for(const value of ['low','high'])await page.locator(`input[data-field="safe"][value="${value}"]`).check();
  await page.locator('#check').click();assert.equal(await page.locator('#feedback-safe').evaluate(e=>e.classList.contains('correct')),false);
  await page.locator('input[data-field="safe"][value="odd"]').check();await page.locator('#check').click();assert(await page.locator('#feedback-safe').evaluate(e=>e.classList.contains('correct')));
  const order=await page.locator('input[data-field="safe"]').evaluateAll(es=>es.map(e=>e.value));
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.deepEqual(await page.locator('input[data-field="safe"]').evaluateAll(es=>es.map(e=>e.value)),order);
  await page.reload();await page.locator('#app').waitFor({state:'visible'});assert(await page.locator('input[data-field="safe"][value="odd"]').isChecked());
  assert.deepEqual(await page.locator('input[data-field="safe"]').evaluateAll(es=>es.map(e=>e.value)),order);

  await page.locator('[data-project="dm-p01"]').click();await page.locator('[data-step="1"]').click();await collect();
  await page.locator('#session').click();assert((await page.locator('.student-work').allTextContents()).includes(RAW));assert.equal(await page.locator('.student-work img').count(),0);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;assert.match(download.suggestedFilename(),/^Quidence-discrete-mathematics-/);
  const text=fs.readFileSync(await download.path(),'utf8');assert(text.includes(RAW));assert(text.includes('Historial de comprobaciones'));assert(text.includes('Estado de la respuesta:'));assert(!/\n(?:Status|Response status):|\nEstado de la respuesta: (?:correct|retry|format|empty|pending)\b/.test(text));
  await page.locator('#close-modal').click();await page.reload();await page.locator('#app').waitFor({state:'visible'});assert.equal(await page.locator('#f-two').inputValue(),RAW);
  // Opted-in learning requests are captured only for this course.
  await page.evaluate(()=>QuidenceStorage.setItem('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:'discrete-math',text:'Explain the lower bound / conservar el original',includeInReport:true})));
  await page.locator('#check').click();assert.equal(await page.evaluate(k=>JSON.parse(QuidenceStorage.getItem(k)).attempts.at(-1).learningRequest.text,KEY),'Explain the lower bound / conservar el original');
  await page.evaluate(()=>QuidenceStorage.setItem('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:'number-theory',text:'Other course',includeInReport:true})));
  await page.locator('#check').click();assert.equal(await page.evaluate(k=>JSON.parse(QuidenceStorage.getItem(k)).attempts.at(-1).learningRequest,KEY),null);
  for(const [width,height]of [[1920,1080],[1440,900],[1024,768],[768,1024],[375,812],[320,812]]){
   await page.setViewportSize({width,height});
   for(const language of ['en','es']){
    await page.locator('#quidence-language').selectOption(language);await page.waitForFunction(l=>QuidenceI18n.locale===l,language);
    await page.locator('dialog[open]').count().then(async n=>{if(n)await page.locator('#close-modal').click();});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    if(width<=375){const fits=await page.locator('#quidence-language').evaluate(e=>{
      const s=getComputedStyle(e),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=s.font;
      const available=e.getBoundingClientRect().width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-20;
      return available>=ctx.measureText(e.selectedOptions[0].textContent).width;
    });assert(fits,'selected language must fit at '+width+' '+language);}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+width+' '+language);
    await page.locator('#toolkit').click();assert.equal(await page.locator('.tool-proof').count(),4);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('#close-modal').click();result.layouts++;
   }
   if([1440,375].includes(width))await page.screenshot({path:path.join(__dirname,'../review/screenshots/discrete-math-'+width+'-20261030.webp'),type:'webp',fullPage:true});
  }
  // Labs at phone width stay inside the page.
  await page.setViewportSize({width:320,height:812});
  for(const project of data.map(p=>p.id)){await chooseProject(project);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'lab overflow '+project);}
  const missing=await page.evaluate(()=>QuidenceI18n.missing);assert.deepEqual(missing,[],'untranslated Discrete Mathematics content');result.spanishProofSteps=40;result.interactiveModels=10;
  // Failed saves remain visible; no successful-save claim is shown.
  await page.evaluate(()=>{QuidenceStorage.setItem=()=>{throw Error('quota')};});await chooseProject('dm-p01');await page.locator('[data-step="1"]').click();await page.locator('#f-two').fill(RAW+' more');await page.waitForTimeout(250);assert.match(await page.locator('#save-status').textContent(),/Could not save|No se pudo guardar/);
  await context.close();
  const corruptContext=await browser.newContext(),cp=await corruptContext.newPage();await cp.goto(origin+'/courses/discrete-math/');await cp.locator('#app').waitFor({state:'visible'});
  await cp.evaluate(k=>localStorage.setItem(k,'unreadable original'),KEY);await cp.reload();await cp.locator('#app').waitFor({state:'visible'});await cp.locator('#f-edges').fill('7');await cp.waitForTimeout(250);assert.equal(await cp.evaluate(k=>localStorage.getItem(k),KEY),'unreadable original');
  await corruptContext.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);result.result='passed';
  fs.writeFileSync(path.join(__dirname,'../review/discrete-math-browser-20261030.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
