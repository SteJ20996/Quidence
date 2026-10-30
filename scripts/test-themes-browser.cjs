'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs'),{files}=require('./build-static-release.cjs');
const {chooseTheme}=require('./theme-choice.cjs');
const {KEY,THEMES}=require('../assets/themes.js');
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const result={layouts:0,pages:files().filter(f=>f.endsWith('.html')).length,themes:4,alignedHomeLayouts:0,classicCardLayouts:0,logoContrastChecks:0,errors:[],failures:[]};
 const homeEdges=new Map();
 const shots=path.join(__dirname,'../review/theme-screenshots');fs.mkdirSync(shots,{recursive:true});
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const context=await browser.newContext(),page=await context.newPage();
  const listen=p=>{p.on('pageerror',e=>result.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)result.failures.push(r.status()+' '+r.url());});};listen(page);
  // Switching styles must not move the controls under the user's pointer.
  for(const lang of ['en','es'])for(const width of [960,1024,1440,1920,2560]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+'/?lang='+lang+'&view=courses');await page.waitForFunction(l=>window.QuidenceI18n?.locale===l,lang);let baseline;
   for(const theme of Object.keys(THEMES)){
    await chooseTheme(page,theme);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,0));
    const boxes=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return[r.x,r.y,r.width,r.height]};return{bar:rect('.q-theme-bar'),label:rect('.q-theme-label'),buttons:[...document.querySelectorAll('[data-theme-choice]')].map(e=>{const r=e.getBoundingClientRect();return[r.x,r.y,r.width,r.height]}),header:rect('.qh-site-header'),layout:rect('.qf-layout')}});
    homeEdges.set([lang,width,theme].join(':'),{x:boxes.layout[0],width:boxes.layout[2]});
    if(!baseline)baseline=boxes;
    assert.deepEqual(boxes.bar,baseline.bar,`${lang} ${width} ${theme}: Appearance moved`);assert.deepEqual(boxes.label,baseline.label,`${lang} ${width} ${theme}: Appearance label moved`);assert.deepEqual(boxes.buttons,baseline.buttons,`${lang} ${width} ${theme}: theme buttons moved`);
    for(const section of ['header','layout']){assert.equal(boxes[section][0],baseline[section][0],theme+' '+section+' left edge');assert.equal(boxes[section][2],baseline[section][2],theme+' '+section+' width');}
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang} ${width} ${theme}: overflow`);result.alignedHomeLayouts++;
    if(theme==='classic'){
     const cards=await page.locator('.subject-card').evaluateAll(es=>es.map(e=>{
      const card=e.getBoundingClientRect(),box=selector=>{const el=e.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return{top:r.top-card.top,bottom:r.bottom-card.top,height:r.height,inside:r.left>=card.left&&r.right<=card.right+1&&r.bottom<=card.bottom+1&&el.scrollWidth<=el.clientWidth+1};};
      return{id:e.dataset.subject,top:card.top,height:card.height,slots:['.topic-label','.version','.subject-picture','h3',':scope>p',':scope>.subject-link','a[href*="foundations/"]','.challenge-link:not([href*="foundations/"])','.project-link','.scope-note'].map(box)};
     }));
     assert.equal(cards.length,15);
     for(const card of cards){
      assert(card.slots[1].top>=card.slots[0].bottom+8,card.id+' activity label has its own line');
      assert(card.slots.filter(Boolean).every(slot=>slot.inside),`${lang} ${width} ${card.id}: clipped card content`);
      const present=card.slots.filter(Boolean);for(let i=1;i<present.length;i++)assert(present[i].top>=present[i-1].bottom-1,card.id+' card reading order overlaps');
     }
     // Every neighbouring card uses the same rows, including available action
     // slots. Longer translations may expand a whole row, never clip its text.
     for(const card of cards)for(const peer of cards.filter(p=>p.top===card.top)){
      assert.equal(card.height,peer.height,card.id+' card height');
      card.slots.forEach((slot,i)=>{if(slot&&peer.slots[i])assert.equal(slot.top,peer.slots[i].top,card.id+' slot '+i+' alignment');});
     }
     if(lang==='en'){const physics=cards.find(c=>c.id==='physics-1');for(const card of cards){assert.equal(card.height,physics.height,card.id+' matches Physics 1 height');card.slots.forEach((slot,i)=>{if(slot&&physics.slots[i])assert.equal(slot.top,physics.slots[i].top,card.id+' matches Physics 1 slot '+i);});}}
     result.classicCardLayouts++;
    }
   }
  }
  // Both Calculus routes use the same desktop content edges as the subject hub.
  result.explorationLayouts=0;
  for(const lang of ['en','es'])for(const width of [960,1440,1920,2560])for(const theme of Object.keys(THEMES)){
   await page.setViewportSize({width,height:1000});
   const expected=homeEdges.get([lang,width,theme].join(':'));
   for(const route of ['checks','think']){
    await page.goto(origin+'/modules/ad01/dist/'+route+'/?lang='+lang);
    await page.waitForFunction(l=>window.QuidenceI18n?.locale===l,route==='think'?'en':lang);
    await chooseTheme(page,theme);await page.evaluate(()=>document.fonts.ready);
    const bounds=await page.evaluate(()=>{const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{x:r.x,width:r.width};};return{main:rect('main'),bar:rect('.q-theme-bar'),header:document.querySelector('.top')?rect('.top'):null,overflow:document.documentElement.scrollWidth-innerWidth};});
    for(const box of [bounds.main,bounds.bar,bounds.header].filter(Boolean)){
     assert(Math.abs(box.x-expected.x)<=1,`${route} ${theme} ${lang} ${width}: content left edge`);
     assert(Math.abs(box.width-expected.width)<=1,`${route} ${theme} ${lang} ${width}: content width`);
    }
    assert(bounds.overflow<=1,`${route} ${theme} ${width}: horizontal overflow`);
    if(route==='think'){
     assert.match(await page.locator('h1').innerText(),/thinking room/);
     assert(await page.locator('.intro-note').isVisible());
     assert.equal(await page.locator('#quidence-language,#language').count(),0);
    }
    result.explorationLayouts++;
   }
  }
  for(const theme of Object.keys(THEMES)){
   await page.goto(origin+'/?lang=en');await chooseTheme(page,theme);
   for(const width of [320,1440])for(const file of files().filter(f=>f.endsWith('.html'))){
    const lang=width===320?'es':'en';await page.setViewportSize({width,height:1000});
    await page.goto(origin+'/'+file+'?lang='+lang);
    const fixed=/<html\b[^>]*\bdata-fixed-language="en"/.test(fs.readFileSync(path.join(__dirname,'..',file),'utf8'));
    await page.waitForFunction(lang=>window.QuidenceI18n?.locale===lang,fixed?'en':lang);
    assert.equal(await page.locator('html').getAttribute('data-ui-theme'),theme,file);
    assert.equal(await page.locator('.q-theme-bar').count(),1,file);
    assert.equal(await page.locator('[data-theme-choice="'+theme+'"]').getAttribute('aria-pressed'),'true',file);
    const bounds=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,buttons:[...document.querySelectorAll('[data-theme-choice],.q-theme-toggle')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return{x:r.left,right:r.right,h:r.height};}),bg:getComputedStyle(document.body).backgroundColor,bar:document.querySelector('.q-theme-bar').getBoundingClientRect().height}));
    assert(bounds.overflow<=1,`${theme} ${file} ${width}: overflow ${bounds.overflow}`);
    // One row, or two when a wide font pushes the menu button under the label; never reserved empty space.
    if(width===320)assert(bounds.bar<=96,`${theme} ${file}: collapsed appearance bar is ${bounds.bar}px tall`);
    assert(bounds.buttons.length&&bounds.buttons.every(b=>b.x>=0&&b.right<=width+1&&b.h>=44),theme+' '+file+' clipped theme controls');
    await page.waitForFunction(()=>[...document.querySelectorAll('.q-brand-logo')].every(e=>e.complete&&e.naturalWidth));
    const logoContrast=await page.locator('.q-brand-logo').evaluate(e=>{let parent=e.parentElement,color='';while(parent){color=getComputedStyle(parent).backgroundColor;if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent')break;parent=parent.parentElement;}const bg=color.match(/[\d.]+/g).slice(0,3).map(Number),fg=e.src.includes('logo-dark')?[246,247,249]:[20,34,54];const luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0),a=luminance(bg),b=luminance(fg);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);});
    assert(logoContrast>=4.5,`${theme} ${file}: low logo contrast ${logoContrast}`);result.logoContrastChecks++;
    const expected=THEMES[theme].page.match(/\w\w/g).map(v=>parseInt(v,16));assert.equal(bounds.bg,`rgb(${expected.join(', ')})`,file+' theme background');
    if(file==='index.html'||(width===1440&&['courses/algebra-1/index.html','foundations/index.html','reports/index.html'].includes(file)))await page.screenshot({path:path.join(shots,theme+'-'+file.replaceAll('/','-')+'-'+width+'.png'),fullPage:false});
    if(fixed)assert.equal(await page.locator('#quidence-language,#language').count(),0,file+' has no language switch');
    else assert.match(await page.locator('#quidence-language').evaluate(e=>getComputedStyle(e).backgroundImage),/%2320383e/,file+' visible language chevron');
    result.layouts++;
   }
   await page.goto(origin+'/?lang=en&view=courses');await page.waitForFunction(()=>window.QuidenceI18n?.locale==='en');
   assert.equal(await page.locator('.subject-card:visible').count(),15);
   await page.screenshot({path:path.join(shots,theme+'-courses.png')});
   const html=await page.evaluate(()=>QuidenceReportTools.documentHtml('Report','<h1>Report</h1><p class="student-work">My exact answer: −1/3</p>'));
   const offline=await context.newPage();await offline.setContent(html);
   assert.equal(await offline.locator('html').getAttribute('data-ui-theme'),theme);
   assert.equal(await offline.locator('.student-work').textContent(),'My exact answer: −1/3');
   await offline.emulateMedia({media:'print'});assert.equal(await offline.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');await offline.close();
  }
  // Phones show one button with the current appearance; it opens the four previews as an even two-column grid.
  {const phone=await browser.newContext({viewport:{width:390,height:800}}),p=await phone.newPage();listen(p);await p.goto(origin+'/?lang=en');
   const toggle=p.locator('.q-theme-toggle'),bar=p.locator('.q-theme-bar');
   assert(await toggle.isVisible(),'phone menu button');assert.equal(await p.locator('[data-theme-choice]:visible').count(),0);assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   assert((await bar.boundingBox()).height<=80,'collapsed appearance bar height');
   await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
   const tiles=await p.locator('[data-theme-choice]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return[Math.round(r.x),Math.round(r.y),Math.round(r.width)];}));
   assert.equal(new Set(tiles.map(t=>t[0])).size,2,'two columns');assert.equal(new Set(tiles.map(t=>t[1])).size,2,'two rows');assert.equal(new Set(tiles.map(t=>t[2])).size,1,'equal widths');
   await p.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await p.evaluate(()=>document.activeElement.className),'q-theme-toggle');
   await chooseTheme(p,'paper');assert.equal(await p.locator('html').getAttribute('data-ui-theme'),'paper');assert.equal(await toggle.getAttribute('aria-expanded'),'false','menu closes after a choice');
   assert.match(await toggle.getAttribute('aria-label'),/^Appearance: Paper Explorer\./);await phone.close();}
  // Each desktop choice previews its appearance; only the selected one shows the check badge.
  await page.setViewportSize({width:1440,height:900});await page.goto(origin+'/?lang=en');await chooseTheme(page,'atlas');
  assert.equal(await page.locator('[data-theme-choice] .q-theme-thumb svg').count(),4);
  assert.deepEqual(await page.locator('[data-theme-choice] .q-theme-check').evaluateAll(es=>es.map(e=>getComputedStyle(e).visibility)),['hidden','hidden','visible','hidden']);
  // Switch live without losing exact in-progress input, locale or report history.
  await page.goto(origin+'/?lang=es');await page.waitForFunction(()=>window.QuidenceI18n?.locale==='es');
  const raw='My exact question\n  −1/3 <test> 我的原文';await page.locator('#learning-goal').fill(raw);
  const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='quidence_ui_theme_v1')));
  for(const theme of ['classic','paper','atlas','studio'])await chooseTheme(page,theme);
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
  for(const theme of ['classic','paper','studio','atlas']){await chooseTheme(other,theme);assert.equal(await other.evaluate(()=>localStorage.getItem('quidence_ui_theme_v1')),theme,'live saved selection');}
  assert.equal(await answer.inputValue(),'123/7');assert.equal(await other.locator('[data-f-explanation]').inputValue(),raw);
  assert.deepEqual(await other.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='quidence_ui_theme_v1'))),recordBefore);
  await other.reload();assert.equal(await other.locator('[data-f-explanation]').inputValue(),raw);
  assert.equal(await other.locator('html').getAttribute('data-ui-theme'),'atlas','saved selection after reload');
  // storageState reads the first open page for each origin. Let the background
  // page receive cross-tab storage events before taking that browser snapshot.
  await page.bringToFront();
  await page.waitForFunction(()=>localStorage.getItem('quidence_ui_theme_v1')==='atlas'&&document.documentElement.dataset.uiTheme==='atlas',null,{polling:100});
  // A new browser session with restored storage picks the same theme before the DOM is ready.
  const saved=await context.storageState();assert.equal(saved.origins.find(o=>o.origin===origin)?.localStorage.find(x=>x.name===KEY)?.value,'atlas','stored theme before reopening');await context.close();
  const reopened=await browser.newContext({storageState:saved}),again=await reopened.newPage();listen(again);
  await again.goto(origin+'/',{waitUntil:'commit'});await again.waitForFunction(()=>document.documentElement.dataset.uiTheme==='atlas');await reopened.close();
  const blocked=await browser.newContext(),b=await blocked.newPage();listen(b);
  await b.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage denied');}}));
  await b.goto(origin+'/');await chooseTheme(b,'studio');
  assert.equal(await b.locator('html').getAttribute('data-ui-theme'),'studio');assert.match(await b.locator('.q-theme-note').textContent(),/For this visit only/);await blocked.close();
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.failures,[]);console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
