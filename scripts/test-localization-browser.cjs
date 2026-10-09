'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const {files}=require('./build-static-release.cjs');
async function run(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],untranslated=[],screens=process.env.QUIDENCE_SCREENSHOTS;
 try{
 browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
 const context=await browser.newContext(),page=await context.newPage(),origin='http://127.0.0.1:'+server.address().port;
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,375,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const file of files().filter(f=>f.endsWith('.html'))){
   await page.goto(origin+'/'+file+'?lang=es');await page.waitForFunction(()=>window.QuidenceI18n?.locale==='es');
   assert.equal(await page.locator('html').getAttribute('lang'),'es');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=1,file+' overflow '+overflow+' at '+width);
   await page.locator('#quidence-language').selectOption('en');assert.equal(await page.locator('html').getAttribute('lang'),'en');
   await page.locator('#quidence-language').selectOption('es');
   if(screens&&file==='index.html'&&[375,1440].includes(width)){fs.mkdirSync(screens,{recursive:true});await page.screenshot({path:path.join(screens,'home-es-'+width+'.png'),fullPage:true});}
  }
 }
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
   const before=await storage(),values=await page.locator('input,select,textarea').evaluateAll(es=>es.map(e=>[e.id,e.name,e.value,e.checked]));
   await page.locator('#quidence-language').selectOption('en');await page.locator('#quidence-language').selectOption('es');
   assert.deepEqual(await storage(),before,'locale switch changed saved records');
   const after=await page.locator('input,select,textarea').evaluateAll(es=>es.map(e=>[e.id,e.name,e.value,e.checked]));assert.deepEqual(after,values,'locale switch changed answers');
   assert.equal(await page.locator('[data-f-explanation]').inputValue(),raw);
   await page.locator('[data-f-unsure]').check();await page.locator('[data-f-answer] button[type="submit"]').click();
   tasks++;
   untranslated.push(...await page.locator('.f-question').evaluate(e=>e.innerText.split('\n').filter(t=>/\b(?:the|your|with|choose|which|question|answer|before|after|because|where|when|this|that|could|should)\b/i.test(t)&&!t.includes('No puedo')&&!t.includes('Save my answer')&&!t.includes('Your explanation'))));
   if(i<count-1)await page.locator('[data-f-action="next"]').click();
  }
  await page.locator('[data-f-action="next"]').click();
  const quotes=await page.locator('.f-quote').allTextContents();assert(quotes.every(q=>q===raw),'student report quote changed');
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
 assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync(path.join(__dirname,'../localization/browser-english-residue.json'),JSON.stringify([...new Set(untranslated)],null,2)+'\n');
 console.log(JSON.stringify({layouts:88,tasks,reports:20,errors,englishResidue:[...new Set(untranslated)].length}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
