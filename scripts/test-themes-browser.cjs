'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs'),{files}=require('./build-static-release.cjs');
const {KEY,THEMES}=require('../assets/themes.js');
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const result={layouts:0,pages:24,themes:4,errors:[],failures:[]};
 const shots=path.join(__dirname,'../review/theme-screenshots');fs.mkdirSync(shots,{recursive:true});
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const context=await browser.newContext(),page=await context.newPage();
  const listen=p=>{p.on('pageerror',e=>result.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)result.failures.push(r.status()+' '+r.url());});};listen(page);
  for(const theme of Object.keys(THEMES)){
   await page.goto(origin+'/?lang=en');await page.locator('[data-theme-choice="'+theme+'"]').click();
   for(const width of [320,1440])for(const file of files().filter(f=>f.endsWith('.html'))){
    const lang=width===320?'es':'en';await page.setViewportSize({width,height:1000});
    await page.goto(origin+'/'+file+'?lang='+lang);
    await page.waitForFunction(lang=>window.QuidenceI18n?.locale===lang,lang);
    assert.equal(await page.locator('html').getAttribute('data-ui-theme'),theme,file);
    assert.equal(await page.locator('.q-theme-bar').count(),1,file);
    assert.equal(await page.locator('[data-theme-choice="'+theme+'"]').getAttribute('aria-pressed'),'true',file);
    const bounds=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,buttons:[...document.querySelectorAll('[data-theme-choice]')].map(e=>{const r=e.getBoundingClientRect();return{x:r.left,right:r.right,h:r.height};}),bg:getComputedStyle(document.body).backgroundColor}));
    assert(bounds.overflow<=1,`${theme} ${file} ${width}: overflow ${bounds.overflow}`);
    assert(bounds.buttons.every(b=>b.x>=0&&b.right<=width+1&&b.h>=44),theme+' '+file+' clipped theme controls');
    const expected=THEMES[theme].page.match(/\w\w/g).map(v=>parseInt(v,16));assert.equal(bounds.bg,`rgb(${expected.join(', ')})`,file+' theme background');
    if(file==='index.html'||(width===1440&&['courses/algebra-1/index.html','foundations/index.html','reports/index.html'].includes(file)))await page.screenshot({path:path.join(shots,theme+'-'+file.replaceAll('/','-')+'-'+width+'.png'),fullPage:false});
    assert.match(await page.locator('#quidence-language').evaluate(e=>getComputedStyle(e).backgroundImage),/%2320383e/,file+' visible language chevron');
    result.layouts++;
   }
   await page.goto(origin+'/?lang=en&view=courses');await page.waitForFunction(()=>window.QuidenceI18n?.locale==='en');
   assert.equal(await page.locator('.subject-card:visible').count(),12);
   await page.screenshot({path:path.join(shots,theme+'-courses.png')});
   const html=await page.evaluate(()=>QuidenceReportTools.documentHtml('Report','<h1>Report</h1><p class="student-work">My exact answer: −1/3</p>'));
   const offline=await context.newPage();await offline.setContent(html);
   assert.equal(await offline.locator('html').getAttribute('data-ui-theme'),theme);
   assert.equal(await offline.locator('.student-work').textContent(),'My exact answer: −1/3');
   await offline.emulateMedia({media:'print'});assert.equal(await offline.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');await offline.close();
  }
  // Switch live without losing exact in-progress input, locale or report history.
  await page.goto(origin+'/?lang=es');await page.waitForFunction(()=>window.QuidenceI18n?.locale==='es');
  const raw='My exact question\n  −1/3 <test> 我的原文';await page.locator('#learning-goal').fill(raw);
  const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='quidence_ui_theme_v1')));
  for(const theme of ['classic','paper','atlas','studio'])await page.locator('[data-theme-choice="'+theme+'"]').click();
  assert.equal(await page.locator('#learning-goal').inputValue(),raw);
  assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='quidence_ui_theme_v1'))),before);
  await page.reload();assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'studio');assert.equal(await page.locator('#learning-goal').inputValue(),raw);
  const other=await context.newPage();listen(other);await other.goto(origin+'/records/?lang=es');
  assert.equal(await other.locator('html').getAttribute('data-ui-theme'),'studio');
  await other.locator('[data-theme-choice="atlas"]').focus();await other.keyboard.press('Enter');
  await page.waitForFunction(()=>document.documentElement.dataset.uiTheme==='atlas');
  await other.locator('#quidence-language').selectOption('en');await other.waitForFunction(()=>QuidenceI18n.locale==='en');
  assert.equal(await other.locator('html').getAttribute('data-ui-theme'),'atlas');assert.equal(await other.locator('.q-theme-label').textContent(),'Appearance');
  // A mathematics draft and exact record bytes survive live theme changes too.
  await other.goto(origin+'/diagnostics/?module=algebra-1&lang=en');
  await other.locator('[data-f-action="resume"]').click();
  const answer=other.locator('input[data-f-field][type="text"]').first();await answer.fill('123/7');
  await other.locator('[data-f-explanation]').fill(raw);await other.locator('[data-f-explanation]').blur();
  const recordBefore=await other.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='quidence_ui_theme_v1')));
  for(const theme of ['classic','paper','studio','atlas']){await other.locator('[data-theme-choice="'+theme+'"]').click();assert.equal(await other.evaluate(()=>localStorage.getItem('quidence_ui_theme_v1')),theme,'live saved selection');}
  assert.equal(await answer.inputValue(),'123/7');assert.equal(await other.locator('[data-f-explanation]').inputValue(),raw);
  assert.deepEqual(await other.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='quidence_ui_theme_v1'))),recordBefore);
  await other.reload();assert.equal(await other.locator('[data-f-explanation]').inputValue(),raw);
  // A new browser session with restored storage picks the same theme before the DOM is ready.
  const saved=await context.storageState();assert.equal(saved.origins.find(o=>o.origin===origin)?.localStorage.find(x=>x.name===KEY)?.value,'atlas','stored theme before reopening');await context.close();
  const reopened=await browser.newContext({storageState:saved}),again=await reopened.newPage();listen(again);
  await again.goto(origin+'/',{waitUntil:'commit'});await again.waitForFunction(()=>document.documentElement.dataset.uiTheme==='atlas');await reopened.close();
  const blocked=await browser.newContext(),b=await blocked.newPage();listen(b);
  await b.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage denied');}}));
  await b.goto(origin+'/');await b.locator('[data-theme-choice="studio"]').click();
  assert.equal(await b.locator('html').getAttribute('data-ui-theme'),'studio');assert.match(await b.locator('.q-theme-note').textContent(),/For this visit only/);await blocked.close();
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.failures,[]);console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
