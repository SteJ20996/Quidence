'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const {files}=require('./build-static-release.cjs');
async function run(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],untranslated=[],missing=new Set(),screens=process.env.QUIDENCE_SCREENSHOTS;let layouts=0;
 try{
 browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
 const context=await browser.newContext(),page=await context.newPage(),origin='http://127.0.0.1:'+server.address().port;
 page.on('pageerror',e=>errors.push(e.message));
 const collect=async()=>{await page.evaluate(()=>QuidenceI18n.apply());for(const key of await page.evaluate(()=>QuidenceI18n.missing))missing.add(key);};
 for(const width of [320,375,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const file of files().filter(f=>f.endsWith('.html'))){
   await page.goto(origin+'/'+file+'?lang=es');const fixed=/<html\b[^>]*\bdata-fixed-language="en"/.test(fs.readFileSync(path.join(__dirname,'..',file),'utf8'));
   await page.waitForFunction(expected=>window.QuidenceI18n?.locale===expected,fixed?'en':'es');
   assert.equal(await page.locator('html').getAttribute('lang'),fixed?'en':'es');await collect();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=1,file+' overflow '+overflow+' at '+width);
   if(fixed){assert.equal(await page.locator('#quidence-language,#language').count(),0);}else{
   await page.locator('#quidence-language').selectOption('en');assert.equal(await page.locator('html').getAttribute('lang'),'en');
   await page.locator('#quidence-language').selectOption('es');}
   layouts++;
   if(screens&&file==='index.html'&&[375,1440].includes(width)){fs.mkdirSync(screens,{recursive:true});await page.screenshot({path:path.join(screens,'home-es-'+width+'.png'),fullPage:true});}
  }
 }
 // English-only dialogue is a deliberate page policy, not a global preference change.
 await page.goto(origin+'/modules/ad01/dist/checks/?lang=es');await page.waitForFunction(()=>window.QuidenceI18n?.locale==='es');
 assert.equal(new URL(await page.locator('#dialogue-route').getAttribute('href'),origin).searchParams.get('lang'),'en');
 assert.equal(new URL(await page.locator('#four-problem-route').getAttribute('href'),origin).searchParams.get('lang'),'es');
 const exactDraft='My original reasoning: −3/4 < 0. 中文原话 remains evidence.';
 for(const incoming of ['es','zh','zh-CN','zh-TW','zh-Hans','zh-Hant','en']){
  await page.goto(origin+'/modules/ad01/dist/think/?lang='+incoming);
  await page.waitForFunction(()=>window.QuidenceI18n?.locale==='en'&&document.querySelector('#draft'));
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(new URL(page.url()).searchParams.get('lang'),'en');
  assert.equal(await page.locator('#quidence-language,#language,[data-zh]').count(),0);
  assert.equal(await page.locator('.q-theme-label').textContent(),'Appearance');
  assert.equal(await page.locator('link[rel="alternate"]').count(),1);
  assert.equal(await page.locator('link[rel="alternate"]').getAttribute('hreflang'),'en');
  await page.locator('#draft').fill(exactDraft);
  const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
  await page.evaluate(()=>QuidenceI18n.setLocale('es'));
  assert.equal(await page.locator('#draft').inputValue(),exactDraft);
  assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before);
  assert.equal(await page.evaluate(()=>localStorage.getItem('quidence_ui_locale_v1')),'es');
 }
 const secondary=await context.newPage();await secondary.goto(origin+'/modules/ad01/dist/checks/?lang=es');
 await secondary.locator('#quidence-language').selectOption('en');
 await page.waitForFunction(()=>new URL(document.querySelector('.top-right a').href).searchParams.get('lang')==='en');
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await secondary.locator('#quidence-language').selectOption('es');
 await page.waitForFunction(()=>new URL(document.querySelector('.top-right a').href).searchParams.get('lang')==='es');
 assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('#draft').inputValue(),exactDraft);await secondary.close();
 await page.reload();assert.equal(await page.locator('#draft').inputValue(),exactDraft);
 await page.locator('.top-right a').click();await page.waitForFunction(()=>window.QuidenceI18n?.locale==='es');
 assert.equal(await page.locator('#quidence-language').inputValue(),'es');
 await page.locator('#four-problem-route').click();await page.waitForFunction(()=>window.QuidenceI18n?.locale==='es');
 assert.equal(await page.locator('#quidence-language').inputValue(),'es');
 const raw='Save my answer\nYour explanation\nNo puedo calcular −3/4; x < 0 y y > 0. <script>alert(1)</script>';
 const storage=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k!=='quidence_ui_locale_v1')));
 let tasks=0;
 for(const mode of ['diagnostics','projects'])for(const module of ['pre-algebra','algebra-1','geometry','algebra-2','af01','ad01','ae01','ab01','physics-1','physics-2']){
  await page.goto(origin+'/'+mode+'/?module='+module+'&lang=es');await page.locator('[data-f-action="resume"]').click();
  const count=await page.locator('.f-question-list li').count();
  for(let i=0;i<count;i++){
   await page.locator('[data-f-explanation]').fill(raw);
   const field=page.locator('[data-f-field]').filter({visible:true}).first();
   if(await field.count()&&['text','number'].includes(await field.getAttribute('type')))await field.fill('−3/4');
   // Finish the existing edit before taking the baseline. Changing focus to
   // the language menu legitimately flushes a pending draft; it is not a
   // write caused by translating the page. Verify the original edit is saved.
   await page.evaluate(()=>document.activeElement?.blur());
   const before=await storage();assert(Object.values(before).some(v=>v.includes(JSON.stringify(raw).slice(1,-1))),'original explanation was not saved before locale test');
   const values=await page.locator('input,select,textarea').evaluateAll(es=>es.map(e=>[e.id,e.name,e.value,e.checked]));
   await page.locator('#quidence-language').selectOption('en');await page.locator('#quidence-language').selectOption('es');
   assert.deepEqual(await storage(),before,'locale switch changed saved records');
   const after=await page.locator('input,select,textarea').evaluateAll(es=>es.map(e=>[e.id,e.name,e.value,e.checked]));assert.deepEqual(after,values,'locale switch changed answers');
   assert.equal(await page.locator('[data-f-explanation]').inputValue(),raw);
   await page.locator('[data-f-unsure]').check();await page.locator('[data-f-answer] button[type="submit"]').click();
   tasks++;await collect();
   untranslated.push(...await page.locator('.f-question').evaluate(e=>e.innerText.split('\n').filter(t=>/\b(?:the|your|with|choose|which|question|answer|before|after|because|where|when|this|that|could|should)\b/i.test(t)&&!t.includes('No puedo')&&!t.includes('Save my answer')&&!t.includes('Your explanation'))));
   if(i<count-1)await page.locator('[data-f-action="next"]').click();
  }
  await page.locator('[data-f-action="next"]').click();
  await collect();const quotes=await page.locator('.f-quote').allTextContents();assert(quotes.every(q=>q===raw),'student report quote changed');
  const before=await storage();await page.locator('#quidence-language').selectOption('en');await page.locator('#quidence-language').selectOption('es');assert.deepEqual(await storage(),before,'report switch added a snapshot');
  const markdown=await page.locator('textarea[data-i18n-markdown]').inputValue();assert(markdown.includes('> Save my answer\n> Your explanation\n> No puedo'),'Markdown changed original multiline explanation');
  const print=await page.evaluate(()=>QuidenceReportTools.documentHtml('Saved reports','<h1>Saved reports</h1><div class="student-work">Save my answer</div>'));
  assert(print.includes('lang="es"')&&print.includes('Informes guardados')&&print.includes('>Save my answer</div>'));
  if(screens&&mode==='diagnostics'&&module==='ab01')await page.screenshot({path:path.join(screens,'linear-algebra-report-es.png'),fullPage:true});
 }
 // An option whose value was implicit keeps its original underlying answer.
 await page.evaluate(()=>{const s=document.createElement('select');s.id='implicit-value';s.innerHTML='<option>Save my answer</option>';document.body.appendChild(s);QuidenceI18n.apply();});
 assert.equal(await page.locator('#implicit-value').inputValue(),'Save my answer');assert.equal(await page.locator('#implicit-value option').textContent(),'Guardar mi respuesta');
 await page.locator('#quidence-language').selectOption('en');assert.equal(await page.locator('#implicit-value option').textContent(),'Save my answer');
 fs.writeFileSync(path.join(__dirname,'../localization/missing-review.json'),JSON.stringify([...missing].sort(),null,2)+'\n');
 assert.deepEqual([...new Set(untranslated)],[],'untranslated text on question screens');
 const authoredMissing=[...missing].filter(k=>!/^(?:det\([AT]\):|hello@quidence\.com)$/.test(k));
 assert.deepEqual(authoredMissing,[],'unreviewed authored text in introductions, reports, controls or exports');
 assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync(path.join(__dirname,'../localization/browser-english-residue.json'),JSON.stringify([...new Set(untranslated)],null,2)+'\n');
 console.log(JSON.stringify({layouts,tasks,reports:20,errors,englishResidue:[...new Set(untranslated)].length}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
