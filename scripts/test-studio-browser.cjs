'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const result={layouts:0,categories:0,themeRoundTrips:0,errors:[],failedRequests:[]};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext(),page=await context.newPage(),origin='http://127.0.0.1:'+server.address().port;
  page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failedRequests.push(r.status()+' '+r.url());});
  const language=lang=>page.waitForFunction(l=>window.QuidenceI18n?.locale===l,lang);
  await page.goto(origin+'/?lang=en');await language('en');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'studio','new visitor starts in Studio');
  await page.evaluate(()=>window.originalFormNodes=['learning-goal','request-subject','goal-include-report'].map(id=>document.getElementById(id)));
  const originalLinks=await page.locator('.subject-card').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.dataset.subject,[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))])));
  await page.locator('[data-theme-choice="studio"]').click();
  assert.equal(await page.locator('.q-paper-category-icon').count(),4,'category decorations stay in the four filter buttons');
  await page.locator('#request-subject').selectOption('geometry');
  const raw='Geometry: −1/3\n原始答案 <keep>  x² = 9';await page.locator('#learning-goal').fill(raw);await page.locator('#learning-goal').blur();
  await page.locator('.q-paper-options>summary').click();await page.locator('#goal-include-report').check();
  const stored=await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1'));
  await page.locator('#goal-copy').click();
  // Clipboard may be unavailable in a browser: the existing selected fallback still contains the exact work.
  await page.waitForFunction(()=>/cop|select/i.test(document.getElementById('goal-status').textContent));
  assert.match(await page.locator('#goal-status').textContent(),/cop|Copy|select/i);
  for(const theme of ['classic','paper','atlas','studio','paper','studio']){
   await page.locator('[data-theme-choice="'+theme+'"]').click();
   assert.equal(await page.locator('#learning-goal').inputValue(),raw);
   assert.equal(await page.locator('#request-subject').inputValue(),'geometry');
   assert.equal(await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1')),stored);
   assert.equal(await page.locator('#goal-include-report').isChecked(),true);
   assert.deepEqual(await page.locator('.subject-card').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.dataset.subject,[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))]))),originalLinks);
   assert.equal(await page.locator('#goal-include-report').count(),1);assert(await page.evaluate(()=>originalFormNodes.every(el=>el===document.getElementById(el.id))),'original form nodes survive theme switches');assert.equal(await page.locator('.qf-request-heading:visible').count(),1);result.themeRoundTrips++;
  }
  await page.reload();await language('en');assert.equal(await page.locator('#learning-goal').inputValue(),raw);assert.equal(await page.locator('#request-subject').inputValue(),'geometry');
  const shots=path.join(__dirname,'../review/studio-screenshots');fs.mkdirSync(shots,{recursive:true});
  for(const lang of ['en','es'])for(const width of [320,375,600,768,900,1024,1100,1101,1512,1920]){
   await page.setViewportSize({width,height:1000});await page.locator('#quidence-language').selectOption(lang);await language(lang);await page.evaluate(()=>document.fonts.ready);
   for(const [category,count]of [['all',12],['school',4],['further',6],['science',2]]){
    await page.locator('button[data-home-view="courses"]').click();await page.locator('button[data-category="'+category+'"]').click();assert.equal(await page.locator('.subject-card:visible').count(),count);assert.equal(await page.locator('.q-studio-cover:visible').count(),count);assert.equal(await page.locator('.q-paper-cover:visible,.q-atlas-cover:visible,.q-cartoon-cover:visible').count(),0);
    assert(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length===new Set(ids).size;}),'SVG and form IDs stay unique');
    const bounds=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,links:[...document.querySelectorAll('.subject-card:not([hidden])>.q-paper-entry')].map(e=>{const a=e.getBoundingClientRect(),b=e.closest('.subject-card').getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1&&e.scrollWidth<=e.clientWidth+1;}),header:[...document.querySelector('.qh-site-header').children].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1;})}));
    assert(bounds.overflow<=1,lang+' '+width+' overflow');assert(bounds.links.every(Boolean),lang+' '+width+' clipped links');assert(bounds.header.every(Boolean),lang+' '+width+' clipped header');result.categories++;
   }
   await page.locator('button[data-category="all"]').click();
   if([375,1512].includes(width))await page.screenshot({path:path.join(shots,'studio-'+lang+'-'+width+'.png'),fullPage:width===1512});
   assert.equal(await page.locator('.q-studio-footer:visible').count(),1);
   assert.match(await page.locator('.q-paper-records').textContent(),lang==='en'?/My records/:/Mis registros/);
   await page.locator('button[data-home-view="map"]').click();assert.equal(await page.locator('#cartoon-knowledge-map .map-panel').count(),3);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.locator('button[data-home-view="courses"]').click();result.layouts++;
  }
  await page.locator('.subject-card[data-subject="geometry"] summary').click();assert(await page.locator('.subject-card[data-subject="geometry"] .project-link').isVisible());
  for(const path of ['/assets/geometric-studio.css','/assets/studio-art.js','/assets/studio-home.js','/assets/fonts/nunito-600.woff','/assets/fonts/nunito-900.woff'])assert.equal((await page.request.get(origin+path)).status(),200,path);
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.failedRequests,[]);console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
