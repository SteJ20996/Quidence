'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const result={layouts:0,categories:0,mapViews:0,themeRoundTrips:0,errors:[],failedRequests:[]};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const context=await browser.newContext(),page=await context.newPage(),origin='http://127.0.0.1:'+server.address().port;
  page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failedRequests.push(r.status()+' '+r.url());});
  const language=lang=>page.waitForFunction(l=>window.QuidenceI18n?.locale===l,lang);
  const links=()=>page.locator('.subject-card').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.dataset.subject,[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))])));
  await page.goto(origin+'/?lang=en');await language('en');const originalLinks=await links();
  await page.locator('[data-theme-choice="atlas"]').click();await page.evaluate(()=>document.fonts.ready);
  assert.deepEqual(await page.locator('.q-atlas-group').evaluateAll(es=>es.map(e=>[e.dataset.atlasGroup,e.querySelectorAll('.subject-card').length])),[['school',4],['further',6],['science',2]]);
  const raw='Keep this exact work: −1/3\n幾何 x² = 9 <original>';await page.locator('#request-subject').selectOption('geometry');await page.locator('#learning-goal').fill(raw);await page.locator('#learning-goal').blur();
  await page.locator('.q-paper-options>summary').click();await page.locator('#goal-include-report').check();
  const saved=await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1'));
  await page.locator('#goal-copy').click();await page.waitForFunction(()=>/cop|select/i.test(document.getElementById('goal-status').textContent));
  for(const theme of ['paper','classic','atlas','studio','paper','atlas']){
   await page.locator('[data-theme-choice="'+theme+'"]').click();assert.deepEqual(await links(),originalLinks);assert.equal(await page.locator('#learning-goal').inputValue(),raw);assert.equal(await page.locator('#request-subject').inputValue(),'geometry');assert(await page.locator('#goal-include-report').isChecked());assert.equal(await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1')),saved);assert.equal(await page.locator('.subject-card').count(),12);
   if(theme==='classic')assert.deepEqual(await page.locator('.catalogue-group').evaluateAll(es=>es.map(e=>e.querySelectorAll('.subject-card').length)),[1,6,5]);
   if(theme==='paper')assert.equal(await page.locator('.q-atlas-group:visible').count(),0);
   result.themeRoundTrips++;
  }
  await page.reload();await language('en');assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'atlas');assert.equal(await page.locator('#learning-goal').inputValue(),raw);assert.deepEqual(await links(),originalLinks);
  const shots=path.join(__dirname,'../review/atlas-screenshots');fs.mkdirSync(shots,{recursive:true});
  for(const lang of ['en','es'])for(const width of [320,375,600,768,1000,1024,1280,1281,1512]){
   await page.setViewportSize({width,height:1000});await page.locator('#quidence-language').selectOption(lang);await language(lang);await page.evaluate(()=>document.fonts.ready);
   for(const [category,count]of [['all',12],['school',4],['further',6],['science',2]]){
    await page.locator('button[data-home-view="courses"]').click();await page.locator('button[data-category="'+category+'"]').click();assert.equal(await page.locator('.subject-card:visible').count(),count);assert.equal(await page.locator('.q-atlas-group:visible').count(),category==='all'?3:1);
    const bounds=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,links:[...document.querySelectorAll('.subject-card:not([hidden])>.q-paper-entry')].map(e=>{const a=e.getBoundingClientRect(),b=e.closest('.subject-card').getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1&&e.scrollWidth<=e.clientWidth+1&&(innerWidth>700||a.height>=44);}),header:[...document.querySelector('.qh-site-header').children].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1;})}));
    assert(bounds.overflow<=1,lang+' '+width+' overflow '+bounds.overflow);assert(bounds.links.every(Boolean),lang+' '+width+' clipped links/touch targets');assert(bounds.header.every(Boolean),lang+' '+width+' clipped header');result.categories++;
    await page.locator('button[data-home-view="map"]').click();assert.equal(await page.locator('#cartoon-knowledge-map .map-panel').count(),category==='all'?3:1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));result.mapViews++;
   }
   await page.locator('button[data-category="all"]').click();await page.locator('button[data-home-view="courses"]').click();
   if([375,1512].includes(width))await page.screenshot({path:path.join(shots,'atlas-'+lang+'-'+width+'.png')});
   await page.locator('.q-atlas-map-link').click();assert.equal(await page.locator('#quidence-home').getAttribute('data-home-view'),'map');await page.locator('button[data-home-view="courses"]').click();result.layouts++;
  }
  await page.locator('.subject-card[data-subject="geometry"] summary').click();assert(await page.locator('.subject-card[data-subject="geometry"] .project-link').isVisible());
  await page.goto(origin+'/?lang=es&group=science&view=courses');await language('es');assert.equal(await page.locator('.subject-card:visible').count(),2);assert.equal(await page.locator('.q-atlas-group:visible').count(),1);assert.match(await page.locator('.q-atlas-group:visible h2').textContent(),/Ciencias/);
  for(const file of ['atlas-observatory.webp','atlas-books.webp','fonts/source-serif-4-400.woff','fonts/source-serif-4-700.woff','fonts/SourceSerif4-OFL.txt'])assert.equal((await page.request.get(origin+'/assets/'+file)).status(),200,file);
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.failedRequests,[]);console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
