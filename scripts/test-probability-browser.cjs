'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const data=require('../courses/probability/data.json'),C=require('../courses/number-theory/core.js'),source=require('../content/probability/projects.cjs');
const KEY='quidence:probability:v1',RAW='Mi razonamiento original / my own proof\n  <img src=x onerror=alert(1)> & spaces.';
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const origin='http://127.0.0.1:'+server.address().port,errors=[],failed=[];
 const result={projects:10,steps:0,layouts:0,languages:['en','es'],errors,failedRequests:failed};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
  await page.goto(origin+'/courses/probability/?lang=en');await page.locator('#app').waitFor({state:'visible'});
  // The checks arrive in a later change, so the course page links to none yet.
  assert.equal(await page.locator('.topbar-links a').count(),0);
  for(const p of data){await page.locator('[data-project="'+p.id+'"]').click();for(let i=0;i<p.steps.length;i++){
   await page.locator('[data-step="'+i+'"]').click();assert.equal(await page.locator('#work h3').first().textContent(),p.steps[i].title);
   await page.locator('#proof').evaluate(e=>e.open=true);assert((await page.locator('.proof-content').textContent()).includes(p.steps[i].proof.split('\n')[0]));
   assert.equal(await page.locator('[data-field]').count(),p.steps[i].fields.reduce((n,f)=>n+(['choice','multi'].includes(f.type)?f.options.length:1),0));result.steps++;
  }}
  assert.equal(result.steps,40);
  const chooseProject=async id=>{if(await page.locator('#project-select').isVisible())await page.locator('#project-select').selectOption(id);else await page.locator(`[data-project="${id}"]`).click();};
  const check=async(project,step,field,cases)=>{await chooseProject(project);await page.locator(`[data-step="${step}"]`).click();
   for(const [value,correct]of cases){await page.locator('#f-'+field).fill(value);await page.locator('#check').click();
    assert.equal(await page.locator('#feedback-'+field).evaluate(e=>e.classList.contains('correct')),correct,project+' '+field+' '+value);}};
  // Exact fractions are accepted; decimals need the stated number of correctly rounded places.
  await check('pr-p01',0,'outcomes',[['36',true],['35',false]]);
  await check('pr-p01',0,'doubleSix',[['1/36',true],['2/72',true],['0.028',true],['0.0278',true],['0.03',false],['0.027',false]]);
  await check('pr-p05',1,'shared23',[['0.507',true],['0.5073',true],['0.508',false],['0.51',false]]);
  await check('pr-p07',3,'expectedRounds',[['36/11',true],['3.27',true],['3.273',true],['3.3',false],['3.28',false]]);
  await check('pr-p10',3,'exact100',[['0.057',true],['0.0569',true],['0.056',false]]);
  // A reason is saved for review exactly as written, through a language switch.
  await chooseProject('pr-p01');await page.locator('[data-step="3"]').click();await page.locator('#f-averages').fill(RAW);await page.locator('#check').click();assert.match(await page.locator('#feedback-averages').textContent(),/saved for review/);
  const before=await page.evaluate(k=>localStorage.getItem(k),KEY);
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  assert.equal(await page.locator('#f-averages').inputValue(),RAW);assert.equal(await page.evaluate(k=>localStorage.getItem(k),KEY),before);
  assert.match(await page.locator('.content-language-note').textContent(),/inglés o español/);assert.match(await page.locator('#check').textContent(),/Comprueba/);
  // Every authored title, proof paragraph and option is shown in the Spanish written beside its English source.
  const collect=async()=>{await page.evaluate(()=>QuidenceI18n.apply());};
  for(const width of [1440,375]){await page.setViewportSize({width,height:900});for(const [n,p]of data.entries()){await chooseProject(p.id);for(let i=0;i<p.steps.length;i++){
   const authored=source[n].steps[i];
   await page.locator(`[data-step="${i}"]`).click();await page.locator('#proof').evaluate(e=>e.open=true);await collect();
   assert.equal(await page.locator('#project-head h2').textContent(),normalize(source[n].title.es));
   assert.equal(await page.locator('#work h3').textContent(),normalize(authored.title.es));
   assert.deepEqual((await page.locator('.proof-content > p:not(.proof-label)').allTextContents()).map(normalize),authored.proof.map(x=>normalize(x.es)));
   for(const f of p.steps[i].fields)if(f.options)assert.deepEqual(await page.locator(`input[data-field="${f.id}"]`).evaluateAll(es=>es.map(e=>e.value)),C.orderedOptions(f,p.id+':'+i+':'+f.id).map(o=>o.value));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,'Probability overflow '+p.id+' '+i+' at '+width);
  }}}
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#quidence-language').selectOption('en');await page.waitForFunction(()=>QuidenceI18n.locale==='en');
  // Labs show a result only after the learner acts, so they do not answer a step in advance.
  const labText=async project=>{await chooseProject(project);await page.locator('[data-step="0"]').click();return normalize(await page.locator('#lab').textContent());};
  const status=async()=>normalize(await page.locator('#lab .lab-status').textContent());
  await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.locator('#app').waitFor({state:'visible'});
  assert.match(await labText('pr-p01'),/Choose an event to color its outcomes\./);assert.doesNotMatch(await labText('pr-p01'),/Thirty-six|of 36 outcomes/);
  assert.match(await labText('pr-p03'),/before anyone is tested/);assert.doesNotMatch(await labText('pr-p03'),/\b100 of 10000\b|\b891\b/);
  assert.doesNotMatch(await labText('pr-p08'),/6\/6|6\/5|6\/1/);assert.doesNotMatch(await labText('pr-p02'),/A wins in/);
  assert.doesNotMatch(await labText('pr-p05'),/\b253\b|\b23\b/);
  // Each lab gives the result the project proves once the learner acts.
  await chooseProject('pr-p01');await page.locator('[data-lab="dice-seven"]').click();assert.equal(await status(),'6 of 36 outcomes are in this event.');
  await page.locator('[data-lab="dice-double"]').click();assert.equal(await status(),'One of the 36 outcomes is in this event.');
  await chooseProject('pr-p02');await page.locator('[data-lab="points-1"]').click();await page.locator('[data-lab="points-count"]').click();assert.match(await status(),/A wins in 11 of 16 sequences\./);
  await chooseProject('pr-p03');await page.locator('[data-lab="screen-test"]').click();assert.equal(await status(),'Positive tests: 90 from sick people and 891 from healthy people.');
  // The second test reports expected counts, not rounded ones that would give a wrong posterior.
  await page.locator('[data-lab="screen-again"]').click();assert.equal(await status(),'After two positive tests, on average: 81 sick and 80.19 healthy people.');
  await chooseProject('pr-p01');await page.locator('[data-lab="dice-bets"]').click();assert.deepEqual(await page.locator('#lab .lab-line').allTextContents(),['Rolls: 4.','P(at least one six) > 1/2 and P(at least one double six) < 1/2.']);await page.locator('[data-lab="dice-grid"]').click();
  // The birthday curve is drawn only up to the current group, so its crossing of 1/2 is found, not shown.
  await chooseProject('pr-p05');assert.equal(await page.locator('#lab polyline').evaluate(e=>e.getAttribute('points').trim().split(/\s+/).length),10);for(let i=0;i<13;i++)await page.locator('[data-lab="bday-more"]').click();assert.match(await status(),/People: 23\. Pairs: 253\./);
  // Every lab control runs in Spanish, so its live text is checked for translations too.
  await page.locator('#quidence-language').selectOption('es');await page.waitForFunction(()=>QuidenceI18n.locale==='es');
  for(const [project,actions]of [
   ['pr-p01',['dice-seven','dice-double','dice-six','dice-bets','bets-more','bets-less','dice-grid']],
   ['pr-p02',['points-0','points-count','points-1','points-count','points-2','points-count']],
   ['pr-p03',['screen-1','screen-test','screen-again','screen-10','screen-test','screen-again','screen-1']],
   ['pr-p04',['coins-draw','coins-draw','coins-reset','view-doors','doors-play','host-random','doors-play','host-knows','view-coins']],
   ['pr-p05',['bday-more','bday-more10','bday-less10','bday-less']],
   ['pr-p06',['shuffle-one','shuffle-hundred','shuffle-reset']],
   ['pr-p07',['six-one','six-hundred','six-reset']],
   ['pr-p08',['collect-one','collect-hundred','collect-reset']],
   ['pr-p09',['galton-one','galton-hundred','galton-tilt','galton-hundred','galton-fair','galton-one','galton-reset']],
   ['pr-p10',['toss-10','toss-100','toss-1000','toss-reset']]
  ]){await chooseProject(project);await page.locator('[data-step="0"]').click();await collect();for(const action of actions){await page.locator(`[data-lab="${action}"]`).click();await collect();}}
  await page.locator('[data-project="pr-p01"]').click();await page.locator('[data-step="3"]').click();await page.locator('#f-averages').fill(RAW);await page.locator('#check').click();await collect();
  await page.locator('#session').click();assert((await page.locator('.student-work').allTextContents()).includes(RAW));assert.equal(await page.locator('.student-work img').count(),0);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;assert.match(download.suggestedFilename(),/^Quidence-probability-/);
  const text=fs.readFileSync(await download.path(),'utf8');assert(text.includes(RAW));assert(text.includes('Historial de comprobaciones'));assert(text.includes('Estado de la respuesta:'));assert(!/\n(?:Status|Response status):|\nEstado de la respuesta: (?:correct|retry|format|empty|pending)\b/.test(text));
  await page.locator('#close-modal').click();await page.reload();await page.locator('#app').waitFor({state:'visible'});assert.equal(await page.locator('#f-averages').inputValue(),RAW);
  // Opted-in learning requests are captured only for this course.
  await page.evaluate(()=>QuidenceStorage.setItem('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:'probability',text:'Explain conditional probability / conservar el original',includeInReport:true})));
  await page.locator('#check').click();assert.equal(await page.evaluate(k=>JSON.parse(QuidenceStorage.getItem(k)).attempts.at(-1).learningRequest.text,KEY),'Explain conditional probability / conservar el original');
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
   if([1440,375].includes(width))await page.screenshot({path:path.join(__dirname,'../review/screenshots/probability-'+width+'-20261101.webp'),type:'webp',fullPage:true});
  }
  // Labs at phone width stay inside the page.
  await page.setViewportSize({width:320,height:812});
  for(const project of data.map(p=>p.id)){await chooseProject(project);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'lab overflow '+project);}
  const missing=await page.evaluate(()=>QuidenceI18n.missing);assert.deepEqual(missing,[],'untranslated Probability content');result.spanishProofSteps=40;result.interactiveModels=10;
  // Failed saves remain visible; no successful-save claim is shown.
  await page.evaluate(()=>{QuidenceStorage.setItem=()=>{throw Error('quota')};});await chooseProject('pr-p01');await page.locator('[data-step="3"]').click();await page.locator('#f-averages').fill(RAW+' more');await page.waitForTimeout(250);assert.match(await page.locator('#save-status').textContent(),/Could not save|No se pudo guardar/);
  await context.close();
  const corruptContext=await browser.newContext(),cp=await corruptContext.newPage();await cp.goto(origin+'/courses/probability/');await cp.locator('#app').waitFor({state:'visible'});
  await cp.evaluate(k=>localStorage.setItem(k,'unreadable original'),KEY);await cp.reload();await cp.locator('#app').waitFor({state:'visible'});await cp.locator('#f-outcomes').fill('36');await cp.waitForTimeout(250);assert.equal(await cp.evaluate(k=>localStorage.getItem(k),KEY),'unreadable original');
  await corruptContext.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);result.result='passed';
  fs.writeFileSync(path.join(__dirname,'../review/probability-browser-20261101.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
