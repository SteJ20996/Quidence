'use strict';
// Quidence is published in English only (AGENTS.md). This suite opens every released page at four widths and then
// follows every same-site link from the homepage. The browser is set to Spanish, every address carries ?lang=es and
// an earlier Spanish site language is saved. Every page must stay English, offer no language choice, show no Spanish
// and leave the saved preference and the learner's own words exactly as they were.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const {files}=require('./build-static-release.cjs');
const LANGUAGE_CONTROLS='#quidence-language,#language,[data-language-host],.language-toolbar,.lang-select,select[aria-label="Language"],select[aria-label="Idioma"]';
// Collect what a reader can see or hear on the page: visible text, accessible names, tooltips, placeholders and alt text.
function readable(){
 const parts=[document.title,document.querySelector('meta[name="description"]')?.content||'',document.body?.innerText||''];
 for(const e of document.querySelectorAll('[aria-label],[title],[alt],[placeholder]'))for(const a of ['aria-label','title','alt','placeholder'])if(e.hasAttribute(a))parts.push(e.getAttribute(a));
 for(const e of document.querySelectorAll('option'))parts.push(e.textContent);
 return parts.join('\n');
}
// Spanish punctuation, Spanish accented vowels outside proper names, and words that do not occur in English prose.
const NAMES=/Poincaré|Bézout|Méré|Café|café|Fréchet|Pólya|Erdős|résumé|Ampère|Gödel|Möbius|naïve|Hôpital|Lévy|Évariste|Cauchy|Dürer|Schrödinger|Ångström/g;
const SPANISH=/[¿¡ñÑ]|[áéíóúÁÉÍÓÚ]|\b(?:Idioma|Español|español|Proyectos|Inicio|Guardar|Comprueba|Explora|Elige|Siguiente|Anterior|pregunta|respuesta|matemáticas|también|aquí|cuál|cómo|para|los|las|una|unos|con|tus?|está|eres|puedes)\b/;
function spanishIn(text,allowed=[]){
 let probe=text.replace(NAMES,'');for(const a of allowed)probe=probe.split(a).join('');
 const m=probe.match(SPANISH);return m?probe.slice(Math.max(0,m.index-50),m.index+60).replace(/\s+/g,' '):null;
}
async function run(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],found=[],broken=new Set(),screens=process.env.QUIDENCE_SCREENSHOTS;let layouts=0,crawled=0;
 try{
 browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
 const origin='http://127.0.0.1:'+server.address().port;
 // The visitor's browser is set to Mexican Spanish, and every page starts with the Spanish site language that an
 // earlier version may have saved.
 const context=await browser.newContext({locale:'es-MX',extraHTTPHeaders:{'Accept-Language':'es-MX,es;q=0.9'}});await context.addInitScript(()=>{try{if(!sessionStorage.getItem('english-only-seeded')){localStorage.setItem('quidence_ui_locale_v1','es');sessionStorage.setItem('english-only-seeded','1');}}catch{}});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(page.url()+': '+e.message));
 page.on('response',r=>{const u=new URL(r.url());if(u.origin===origin&&r.status()>=400&&!u.pathname.startsWith('/api/'))broken.add(r.status()+' '+u.pathname+u.search);});
 const spanish=u=>{const url=new URL(u,origin);url.searchParams.set('lang','es');return url.href;};
 async function check(label){
  await page.waitForLoadState('load');await page.waitForTimeout(60);
  assert.equal(await page.locator('html').getAttribute('lang'),'en',label+' html lang');
  assert.equal(await page.locator(LANGUAGE_CONTROLS).count(),0,label+' offers a language choice');
  assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(),0,label+' advertises a language alternate');
  assert.equal(await page.evaluate(()=>window.QuidenceI18n?.locale??'en'),'en',label+' locale');
  assert.equal(await page.evaluate(()=>localStorage.getItem('quidence_ui_locale_v1')),'es',label+' changed the saved preference');
  const hit=spanishIn(await page.evaluate(readable));if(hit)found.push(label+': …'+hit+'…');
 }
 // 1. Every released page at phone, tablet and desktop widths.
 for(const width of [320,375,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const file of files().filter(f=>f.endsWith('.html'))){
   await page.goto(spanish('/'+file));await check(file+' @'+width);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=1,file+' overflow '+overflow+' at '+width);layouts++;
   if(screens&&file==='index.html'&&[375,1440].includes(width)){fs.mkdirSync(screens,{recursive:true});await page.screenshot({path:path.join(screens,'home-english-'+width+'.png'),fullPage:true});}
  }
 }
 // 2. Every same-site link reachable from the homepage, including query and hash routes, opened with ?lang=es.
 await page.setViewportSize({width:1280,height:900});
 const seen=new Set(),queue=['/'];
 while(queue.length&&seen.size<900){
  const next=queue.shift(),key=new URL(next,origin);key.searchParams.delete('lang');key.searchParams.delete('v');const id=key.pathname+key.search+key.hash;if(seen.has(id))continue;seen.add(id);
  await page.goto('about:blank');await page.goto(spanish(id));await check(id);crawled++;
  for(const href of await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.href))){
   const u=new URL(href);if(u.origin!==origin||/\.(?:json|md|zip|pdf|png|svg|txt|xml)$/i.test(u.pathname)||u.pathname.startsWith('/api/'))continue;
   u.searchParams.delete('lang');u.searchParams.delete('v');const k=u.pathname+u.search+u.hash;if(!seen.has(k))queue.push(k);
  }
 }
 assert(crawled>=80,'only '+crawled+' routes were reachable');
 if(process.env.QUIDENCE_CRAWL_LOG)fs.writeFileSync(process.env.QUIDENCE_CRAWL_LOG,[...seen].join('\n')+'\n');
 // 3. The English dialogue keeps its fixed language and the learner's exact draft.
 const exactDraft='My original reasoning: −3/4 < 0. 中文原话 y una frase en español remain evidence.';
 await page.goto(origin+'/modules/ad01/dist/checks/?lang=es');await check('calculus checks');
 assert.equal(new URL(await page.locator('#dialogue-route').getAttribute('href'),origin).searchParams.get('lang'),'en');
 assert.equal(await page.locator('#dialogue-route').getAttribute('data-fixed-language'),'en');
 assert.equal(new URL(await page.locator('#four-problem-route').getAttribute('href'),origin).searchParams.get('lang'),null);
 for(const incoming of ['es','zh','zh-CN','zh-TW','zh-Hans','zh-Hant','en']){
  await page.goto(origin+'/modules/ad01/dist/think/?lang='+incoming);
  await page.waitForFunction(()=>window.QuidenceI18n?.locale==='en'&&document.querySelector('#draft'));
  await check('think ?lang='+incoming);
  assert.equal(await page.locator('.q-theme-label').textContent(),'Appearance');
  await page.locator('#draft').fill(exactDraft);
  const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
  assert.equal(await page.evaluate(()=>QuidenceI18n.setLocale('es')),'en');
  assert.equal(await page.locator('#draft').inputValue(),exactDraft);
  assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before);
 }
 await page.reload();assert.equal(await page.locator('#draft').inputValue(),exactDraft);
 // 4. Answers and explanations, including words in another language, reach reports exactly as written.
 const raw='Save my answer\nYour explanation\nNo puedo calcular −3/4; x < 0 y y > 0. <script>alert(1)</script>';
 const storage=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k!=='quidence_ui_locale_v1')));
 let tasks=0,reports=0;
 for(const mode of ['diagnostics','projects'])for(const module of ['pre-algebra','algebra-1','geometry','algebra-2','af01','ad01','ae01','ab01','physics-1','physics-2',...(mode==='diagnostics'?['number-theory','coordinate-geometry','discrete-math','probability']:[])]){
  await page.goto(origin+'/'+mode+'/?module='+module+'&lang=es');await check(mode+' '+module);await page.locator('[data-f-action="resume"]').click();
  const count=await page.locator('.f-question-list li').count();
  for(let i=0;i<count;i++){
   await page.locator('[data-f-explanation]').fill(raw);
   const field=page.locator('[data-f-field]').filter({visible:true}).first();
   if(await field.count()&&['text','number'].includes(await field.getAttribute('type')))await field.fill('−3/4');
   await page.evaluate(()=>document.activeElement?.blur());
   const before=await storage();assert(Object.values(before).some(v=>v.includes(JSON.stringify(raw).slice(1,-1))),'original explanation was not saved');
   assert.equal(await page.evaluate(()=>QuidenceI18n.setLocale('es')),'en');
   assert.deepEqual(await storage(),before,'a language request changed saved records');
   assert.equal(await page.locator('[data-f-explanation]').inputValue(),raw);
   const hit=spanishIn(await page.evaluate(readable),['No puedo calcular −3/4; x < 0 y y > 0.']);if(hit)found.push(mode+' '+module+' question '+(i+1)+': …'+hit+'…');
   await page.locator('[data-f-unsure]').check();await page.locator('[data-f-answer] button[type="submit"]').click();
   tasks++;if(i<count-1)await page.locator('[data-f-action="next"]').click();
  }
  await page.locator('[data-f-action="next"]').click();reports++;
  const quotes=await page.locator('.f-quote').allTextContents();assert(quotes.length&&quotes.every(q=>q===raw),'student report quote changed');
  const markdown=await page.locator('textarea[data-i18n-markdown]').inputValue();assert(markdown.includes('> Save my answer\n> Your explanation\n> No puedo'),'Markdown changed the original multiline explanation');
  const print=await page.evaluate(()=>QuidenceReportTools.documentHtml('Saved reports','<h1>Saved reports</h1><div class="student-work">Save my answer</div>'));
  assert(print.includes('lang="en"')&&print.includes('Saved reports')&&print.includes('>Save my answer</div>'),'printable report');
  if(screens&&mode==='diagnostics'&&module==='ab01')await page.screenshot({path:path.join(screens,'linear-algebra-report-english.png'),fullPage:true});
 }
 // 5. Stacked fractions are drawn over English readouts and stay in step with the text underneath.
 {const p=await browser.newPage();p.on('pageerror',e=>errors.push('fractions: '+e.message));await p.goto(origin+'/modules/ae01/dist/?lang=es');
  await p.locator('[data-action="open"][data-index="3"]').first().click();await p.locator('#answer-form input[value="unsure"]').check();await p.locator('#answer-form textarea[name="explanation"]').fill('Not sure.');await p.locator('#answer-form button[type="submit"]').click();await p.locator('[data-action="next"]').click();await p.locator('#lab-condition').selectOption('club');
  assert.match(await p.locator('#live-readout').textContent(),/Relevant fraction = 12\/20 = 0\.6/);
  assert.deepEqual(await p.locator('#live-readout .q-frac').evaluateAll(es=>es.map(e=>[e.dataset.n,e.dataset.d,e.textContent])),[['12','20','12/20']]);await p.close();}
 assert.deepEqual(found,[],'Spanish shown on a page');
 assert.deepEqual([...broken],[],'a page or asset failed to load');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log(JSON.stringify({layouts,crawled,tasks,reports,errors:errors.length}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={spanishIn};
