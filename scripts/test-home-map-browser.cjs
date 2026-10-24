'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {performance}=require('node:perf_hooks'),{chromium}=require('playwright');
const {createServer}=require('../backend/server.cjs'),Store=require('../assets/report-store.js');
const RAW='My original question: compare an equation with a diagram.\n  Keep my spaces. Español / 我的原文 / <script>no execution</script>';
async function main(){
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 const output={scope:'Local browser and local server; not a production capacity guarantee.',layouts:0,mapStates:0,errors:[],failedRequests:[],stress:{}};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const listen=page=>{page.on('pageerror',e=>output.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)output.failedRequests.push([r.status(),r.url()]);});};
  const ready=page=>page.waitForFunction(()=>window.QuidenceI18n&&document.querySelectorAll('.qa-node').length>0&&!document.getElementById('knowledge-map').hidden);
  async function geometry(page){
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const bounds=await page.evaluate(()=>{
    const overlaps=[],nodes=[...document.querySelectorAll('.qa-node')].map(e=>({id:e.dataset.node,r:e.getBoundingClientRect()}));
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i].r,b=nodes[j].r;if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)overlaps.push([nodes[i].id,nodes[j].id]);}
    const h=document.querySelector('.qh-site-header').getBoundingClientRect(),headerClipping=[...document.querySelector('.qh-site-header').children].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left<h.left||r.right>h.right);}).map(e=>e.className);
    return{overflow:document.documentElement.scrollWidth>innerWidth,overlaps,headerClipping};
   });
   assert.deepEqual(bounds,{overflow:false,overlaps:[],headerClipping:[]});output.mapStates++;
  }
  for(const [width,height]of [[1280,720],[1200,900],[1920,1080],[1024,768],[375,812],[320,812]]){
   const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();listen(page);
   await page.addInitScript(()=>localStorage.setItem('quidence_ui_theme_v1','classic'));await page.goto(origin+'/?lang=en');await ready(page);
   assert.deepEqual(await page.locator('#quidence-language option').evaluateAll(es=>es.map(e=>e.value)),['en','es']);
   assert.equal(await page.locator('.q-brand-logo').count(),1);
   if(width===1280){await page.locator('[data-node="calculus"]').click();assert.match(await page.locator('#qa-topic-intro').textContent(),/derivatives|derivadas/);await page.locator('.q-map-subjects').click();assert(await page.locator('.home-course-view').isVisible());await page.locator('button[data-home-view="map"]').click();}

   for(const language of ['en','es']){
    await page.locator('#quidence-language').selectOption(language);await page.waitForFunction(language=>QuidenceI18n.locale===language,language);
    for(let chapter=0;chapter<3;chapter++){await page.locator('button[data-chapter="'+chapter+'"]').click();await geometry(page);}
    await page.locator('button[data-chapter="0"]').click();
    if((width===1280&&language==='en')||(width===1200&&language==='es')||(width===375&&language==='es')){
     await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(__dirname,'../review/screenshots/home-map-'+width+'-'+language+'.webp'),type:'webp'});
    }
    output.layouts++;
   }
   await page.locator('#learning-goal').fill(RAW);await page.locator('#goal-include-report').check();
   await page.locator('[data-node="algebra1"]').click();
   assert.equal(await page.locator('[data-learning-subject="algebra-1"]').getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#goal-include-report').isChecked(),false,'New subject needs its own report opt-in');
   await page.locator('#goal-include-report').check();
   await page.locator('button[data-home-view="courses"]').click();
   assert.equal(await page.locator('.subject-card:visible').count(),12);
   assert.deepEqual(await page.locator('.group-heading h2').allTextContents(),['Secundaria','Preparatoria','Nivel universitario']);
   const levels=await page.locator('.catalogue-group').evaluateAll(groups=>groups.map(g=>g.querySelectorAll('.subject-card').length));assert.deepEqual(levels,[1,6,5]);
   assert.equal(await page.locator('.home-map-view').isVisible(),false);
   assert.equal(await page.locator('#learning-goal').inputValue(),RAW);assert(await page.locator('#goal-include-report').isChecked());
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.reload();await ready(page);assert.equal(await page.locator('.home-course-view').isVisible(),true);
   assert.equal(await page.locator('#learning-goal').inputValue(),RAW);assert(await page.locator('#goal-include-report').isChecked());
   await page.locator('button[data-home-view="map"]').click();
   assert.equal(await page.locator('#knowledge-map').getAttribute('data-selected-course'),'algebra-1');
   for(const subject of Object.keys(require('../assets/course-catalog.js').COURSES)){
    await page.locator('[data-learning-subject="'+subject+'"]').click();
    assert.equal(await page.locator('#knowledge-map').getAttribute('data-selected-course'),subject);
    for(const href of await page.locator('.qa-actions a').evaluateAll(es=>es.filter(e=>!e.hidden).map(e=>e.href))){const response=await page.request.get(href);assert.equal(response.status(),200);assert.equal(new URL(href).searchParams.get('lang'),'es');}
   }
   await page.locator('button[data-chapter="1"]').click();await page.locator('[data-node="real"]').click();assert.equal(await page.locator('.qa-actions').isVisible(),false);
   await page.locator('.q-brand').click();assert.equal(await page.locator('.home-map-view').isVisible(),true);
   await context.close();
  }
  // Existing reports and the exact user request survive repeated map/page/language changes.
  const context=await browser.newContext({viewport:{width:1200,height:900}}),page=await context.newPage();listen(page);
  await page.addInitScript(()=>localStorage.setItem('quidence_ui_theme_v1','classic'));await page.goto(origin+'/?lang=en');await ready(page);
  const archive=Store.fresh();for(let i=0;i<100;i++)archive.items.push({id:'algebra-1:map-report-'+i,module:'algebra-1',subject:'Algebra I',sessionId:'map-report-'+i,versions:[{savedAt:'2026-10-09T19:00:00Z',signature:'compact-v2:1:0',payload:{markdown:'# Algebra I\n\n> '+RAW+'\n\n'+'.'.repeat(5000)}}]});
  const originalArchive=JSON.stringify(archive);
  await page.evaluate(({key,value})=>QuidenceStorage.setItem(key,value),{key:Store.KEY,value:originalArchive});
  await page.reload();await ready(page);await page.locator('[data-learning-subject="algebra-1"]').click();
  assert.equal(await page.locator('#goal-report option').count(),101);await page.locator('#learning-goal').fill(RAW);
  const started=performance.now();
  await page.evaluate(async()=>{
   for(let i=0;i<200;i++)document.querySelector('[data-learning-subject="'+(i%2?'geometry':'algebra-1')+'"]').click();
   for(let i=0;i<20;i++)document.querySelector('[data-home-view="'+(i%2?'map':'courses')+'"]').click();
   for(let i=0;i<6;i++)await QuidenceI18n.setLocale(i%2?'en':'es');
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  output.stress={savedReports:100,archiveCharacters:originalArchive.length,subjectChanges:200,pageChanges:20,languageChanges:6,elapsedMs:Math.round(performance.now()-started)};
  assert.equal(await page.locator('#learning-goal').inputValue(),RAW);assert.equal(await page.evaluate(key=>QuidenceStorage.getItem(key),Store.KEY),originalArchive);
  await page.reload();await ready(page);assert.equal(await page.locator('#learning-goal').inputValue(),RAW);
  // Verify the generated report still captures the opted-in request for the chosen subject.
  await page.locator('[data-learning-subject="geometry"]').click();await page.locator('#goal-include-report').check();
  assert.equal(await page.evaluate(()=>QuidenceReportStore.save('geometry',{markdown:'# Geometry'},'map-criterion',QuidenceStorage).payload.learningRequest.text),RAW);
  await context.close();
  for(const raw of ['{unreadable','{"schema":"unknown","text":"original"}']){
   const context=await browser.newContext(),page=await context.newPage();listen(page);
   await page.addInitScript(raw=>{localStorage.setItem('cluevera_learning_goal_v1',raw);localStorage.setItem('quidence_ui_theme_v1','classic');},raw);
   await page.goto(origin+'/');await ready(page);await page.locator('#learning-goal').fill('New unsaved draft');await page.locator('[data-node="algebra1"]').click();
   assert.equal(await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1')),raw);await context.close();
  }
  const unavailable=await browser.newContext(),blocked=await unavailable.newPage();listen(blocked);
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage denied');}}));
  await blocked.goto(origin+'/');await blocked.locator('[data-theme-choice="classic"]').click();await ready(blocked);await blocked.locator('button[data-home-view="courses"]').click();assert.equal(await blocked.locator('.subject-card:visible').count(),12);await unavailable.close();
  const routes=['/','/assets/home.js','/assets/knowledge-map.js','/assets/knowledge-map-data.js'];let failed=0;
  for(let batch=0;batch<3;batch++)await Promise.all(Array.from({length:40},async(_,i)=>{const response=await fetch(origin+routes[i%routes.length]);if(response.status!==200||!(await response.text()).length)failed++;}));
  output.stress.localRequests={concurrency:40,total:120,failed};assert.equal(failed,0);
  assert.deepEqual(output.errors,[]);assert.deepEqual(output.failedRequests,[]);
  fs.writeFileSync(path.join(__dirname,'../review/home-map-validation-20261009.json'),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
