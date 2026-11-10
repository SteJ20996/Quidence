'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const {chooseTheme}=require('./theme-choice.cjs');
// Quidence is published in English only. A language preference saved by an earlier version stays in storage untouched.
const LOCALE='quidence_ui_locale_v1',LANGUAGE_CONTROLS='#quidence-language,#language,.language-toolbar,[data-language-host]';
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const result={layouts:0,categories:0,themeRoundTrips:0,errors:[],failedRequests:[]};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext(),page=await context.newPage(),origin='http://127.0.0.1:'+server.address().port;
  page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failedRequests.push(r.status()+' '+r.url());});
  const english=async where=>{await page.waitForFunction(()=>window.QuidenceI18n?.locale==='en');assert.equal(await page.locator('html').getAttribute('lang'),'en',where+' is in English');assert.equal(await page.locator(LANGUAGE_CONTROLS).count(),0,where+' has no language control');};
  await page.goto(origin+'/');await english('home');
  const originalLinks=await page.locator('.subject-card').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.dataset.subject,[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))])));
  await chooseTheme(page,'paper');
  assert.equal(await page.locator('.q-paper-category-icon').count(),6,'category decorations stay in the six filter buttons');
  await page.locator('#request-subject').selectOption('geometry');
  const raw='Geometry: −1/3\n原始答案 <keep>  x² = 9';await page.locator('#learning-goal').fill(raw);await page.locator('#learning-goal').blur();
  await page.locator('.q-paper-options>summary').click();await page.locator('#goal-include-report').check();
  const stored=await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1'));
  await page.locator('#goal-copy').click();
  // Clipboard may be unavailable in a browser: the existing selected fallback still contains the exact work.
  await page.waitForFunction(()=>/cop|select/i.test(document.getElementById('goal-status').textContent));
  assert.match(await page.locator('#goal-status').textContent(),/cop|Copy|select/i);
  for(const theme of ['classic','studio','atlas','paper','studio','paper']){
   await chooseTheme(page,theme);
   assert.equal(await page.locator('#learning-goal').inputValue(),raw);
   assert.equal(await page.locator('#request-subject').inputValue(),'geometry');
   assert.equal(await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1')),stored);
   assert.equal(await page.locator('#goal-include-report').isChecked(),true);
   assert.deepEqual(await page.locator('.subject-card').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.dataset.subject,[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))]))),originalLinks);
   assert.equal(await page.locator('#goal-include-report').count(),1);result.themeRoundTrips++;
  }
  await page.reload();await english('home after reload');assert.equal(await page.locator('#learning-goal').inputValue(),raw);assert.equal(await page.locator('#request-subject').inputValue(),'geometry');
  // An address and a saved preference asking for Spanish leave the page in English with the exact request, its saved
  // copy and its report choice; the saved preference stays as it was.
  await page.evaluate(key=>localStorage.setItem(key,'es'),LOCALE);await page.goto(origin+'/?lang=es');await english('home ?lang=es');
  assert.equal(await page.locator('#learning-goal').inputValue(),raw);assert.equal(await page.locator('#request-subject').inputValue(),'geometry');
  assert.equal(await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1')),stored);assert.equal(await page.locator('#goal-include-report').isChecked(),true);
  assert.match(await page.locator('.q-paper-records').textContent(),/My records/);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),LOCALE),'es','saved language preference left in place');
  await page.goto(origin+'/');await english('home');
  const shots=path.join(__dirname,'../review/paper-screenshots');fs.mkdirSync(shots,{recursive:true});
  for(const width of [320,375,768,920,1024,1199,1280,1440,1512]){
   await page.setViewportSize({width,height:1000});await page.evaluate(()=>document.fonts.ready);
   for(const [category,count]of [['all',21],['school',6],['further',8],['science',2],['cs',1],['cross',4]]){
    await page.locator('button[data-home-view="courses"]').click();await page.locator('button[data-category="'+category+'"]').click();assert.equal(await page.locator('.subject-card:visible').count(),count);
    const bounds=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,links:[...document.querySelectorAll('.subject-card:not([hidden])>.q-paper-entry')].map(e=>{const a=e.getBoundingClientRect(),b=e.closest('.subject-card').getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1&&e.scrollWidth<=e.clientWidth+1;}),header:[...document.querySelector('.qh-site-header').children].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1;})}));
    assert(bounds.overflow<=1,width+' overflow');assert(bounds.links.every(Boolean),width+' clipped links');assert(bounds.header.every(Boolean),width+' clipped header');result.categories++;
   }
   await page.locator('button[data-category="all"]').click();
   if([375,1512].includes(width))await page.screenshot({path:path.join(shots,'paper-en-'+width+'.png'),fullPage:width===1512});
   assert.match(await page.locator('.q-paper-records').textContent(),/My records/);
   await page.locator('button[data-home-view="map"]').click();assert.equal(await page.locator('#cartoon-knowledge-map .map-panel').count(),4);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.locator('button[data-home-view="courses"]').click();result.layouts++;
  }
  await page.locator('.subject-card[data-subject="geometry"] summary').click();assert(await page.locator('.subject-card[data-subject="geometry"] .project-link').isVisible());
  for(const path of ['/assets/paper-shelf.webp','/assets/fonts/nunito-600.woff','/assets/fonts/nunito-900.woff','/assets/fonts/Nunito-OFL.txt'])assert.equal((await page.request.get(origin+path)).status(),200,path);
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.failedRequests,[]);console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
