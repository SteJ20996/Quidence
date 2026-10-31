'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const {chooseTheme}=require('./theme-choice.cjs');
const B=require('../assets/foundation-bank.js'),E=require('../assets/foundation-engine.js');
const RAW='My original work\n  −1/3 <test> 我的原文';
async function main(){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const result={layouts:0,mapViews:0,questions:0,errors:[],failedRequests:[],missing:[]};
 try{
  browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port,context=await browser.newContext(),page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.failedRequests.push(r.status()+' '+r.url());});
  const locale=lang=>page.waitForFunction(l=>QuidenceI18n.locale===l,lang);
  const bounds=async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,'page overflow');assert(await page.locator('.qf-left-rail').isHidden());const header=await page.locator('.qh-site-header').evaluate(e=>{const r=e.getBoundingClientRect();return [...e.children].every(c=>{const a=c.getBoundingClientRect();return !a.width||(a.left>=r.left-1&&a.right<=r.right+1);});});assert(header,'header clipping');};
  await page.goto(origin+'/?lang=en');await locale('en');assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'studio');assert.equal(await page.locator('#quidence-home').getAttribute('data-home-view'),'courses');
  assert.equal(await page.locator('.subject-card:visible').count(),16);
  await page.locator('#request-subject').selectOption('number-theory');await page.locator('#learning-goal').fill(RAW);await page.locator('#learning-goal').blur();
  const original=await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1'));
  for(const theme of ['studio','paper','atlas'])for(const lang of ['en','es'])for(const width of [320,768,1440]){
   await page.setViewportSize({width,height:1000});await chooseTheme(page,theme);await page.locator('#quidence-language').selectOption(lang);await locale(lang);
   assert.equal(await page.locator('#learning-goal').inputValue(),RAW);assert.equal(await page.evaluate(()=>localStorage.getItem('cluevera_learning_goal_v1')),original);
   for(const [group,count]of [['all',16],['school',6],['further',7],['science',2],['cross',1]]){
    await page.locator('button[data-home-view="courses"]').click();await page.locator('button[data-category="'+group+'"]').click();assert.equal(await page.locator('.subject-card:visible').count(),count);await bounds();
    await page.locator('button[data-home-view="map"]').click();// Cross-disciplinary projects span the subjects, so their category keeps all three maps.
    assert.equal(await page.locator('#cartoon-knowledge-map .map-panel').count(),['all','cross'].includes(group)?3:1);await bounds();result.mapViews++;
   }
   result.layouts++;
  }
  // Native node buttons select a real course and expose working, language-aware links.
  await page.locator('button[data-category="all"]').click();
  const courseNodes=await page.locator('#cartoon-knowledge-map .node-card.course').evaluateAll(es=>es.map(e=>e.dataset.mapNode));assert.equal(courseNodes.length,15);
  for(const id of courseNodes){await page.locator('[data-map-node="'+id+'"]').click();const links=page.locator('[data-map-node="'+id+'"]').locator('xpath=ancestor::section').locator('.qkm-actions a');for(const href of await links.evaluateAll(es=>es.map(e=>e.href))){assert.equal(new URL(href).searchParams.get('lang'),'es');assert.equal((await page.request.get(href)).status(),200);}}
  // Every routed edge avoids unrelated cards (including the manually approved lanes).
  const geometry=await page.evaluate(()=>{const bad=[];for(const m of QuidenceCartoonMap.maps)for(const r of QuidenceCartoonMap.routes[m.id])for(let i=1;i<r.points.length;i++){const [a,b]=[r.points[i-1],r.points[i]];for(const n of m.nodes.filter(n=>n.id!==r.from&&n.id!==r.to)){if(a[0]===b[0]?a[0]>n.x&&a[0]<n.x+200&&Math.max(a[1],b[1])>n.y&&Math.min(a[1],b[1])<n.y+124:a[1]>n.y&&a[1]<n.y+124&&Math.max(a[0],b[0])>n.x&&Math.min(a[0],b[0])<n.x+200)bad.push(m.id+':'+r.from+'→'+r.to+' crosses '+n.id);}}return bad;});assert.deepEqual(geometry,[]);
  await page.locator('button[data-category="science"]').click();await page.reload();assert.equal(await page.locator('#cartoon-knowledge-map .map-panel').count(),1);assert.equal(await page.locator('[data-map="science"]').count(),1);
  await chooseTheme(page,'classic');await page.locator('button[data-home-view="courses"]').click();assert.equal(await page.locator('.subject-card:visible').count(),16);assert(await page.locator('.qf-left-rail').isVisible());assert(await page.locator('.subject-card details').first().getAttribute('open')!==null);
  await chooseTheme(page,'studio');assert.equal(await page.locator('.subject-card:visible').count(),2);assert(await page.locator('.subject-card details').first().getAttribute('open')===null);
  // All new questions, drafts, uncertainty, complete reports and exports in a real browser.
  for(const module of ['number-theory','physics-1','physics-2','coordinate-geometry','geometry','algebra-2','discrete-math']){
   await page.goto(origin+'/foundations/?module='+module+'&lang=es');await locale('es');await page.locator('[data-f-action="resume"]').click();
   const tasks=B.MODULES[module].tasks;
   for(const [i,t]of tasks.entries()){
    for(const f of t.fields){if(f.kind==='number')await page.locator('[data-f-field="'+f.id+'"]').fill(String(f.answer));else await page.locator('[data-f-field="'+f.id+'"][data-f-option="'+f.options.findIndex(o=>o.value===f.answer)+'"]').check();}
    await page.locator('[data-f-explanation]').fill(RAW+' '+t.id);await page.locator('[data-f-explanation]').blur();
    if(i===0){const before=await page.evaluate(key=>localStorage.getItem(key),E.SCHEMA);await chooseTheme(page,'paper');await page.reload();await locale('es');assert.equal(await page.evaluate(key=>localStorage.getItem(key),E.SCHEMA),before);assert.equal(await page.locator('[data-f-explanation]').inputValue(),RAW+' '+t.id);await page.locator('[data-f-not-studied]').check();await page.locator('[data-f-not-studied]').uncheck();}
    for(const x of await page.evaluate(()=>QuidenceI18n.missing))result.missing.push(x);
    await page.locator('button[type="submit"]').click();await page.locator('[data-f-action="next"]').click();result.questions++;
   }
   const portfolio=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),E.SCHEMA),s=E.session(E.hydrate(portfolio),module);assert(E.done(s));assert.equal(s.view,'report');for(const t of tasks){assert.equal(E.last(s,t).answer.explanation,RAW+' '+t.id);assert.equal(E.last(s,t).objective.state,'matched');}
   const dl=page.waitForEvent('download');await page.locator('[data-f-action="export-json"]').click();const d=await dl,report=JSON.parse(fs.readFileSync(await d.path(),'utf8'));assert.equal(report.taskDefinitions.length,15);assert.equal(report.session.module,module);
   await page.reload();assert(await page.locator('[data-f-action="export-json"]').isVisible());
  }
  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('cluevera_saved_reports_v1')));for(const id of ['number-theory','physics-1','physics-2','coordinate-geometry','geometry','algebra-2','discrete-math'])assert(records.items.some(i=>i.module===id));
  result.missing=[...new Set(result.missing)];assert.deepEqual(result.errors,[]);assert.deepEqual(result.failedRequests,[]);assert.deepEqual(result.missing,[]);console.log(JSON.stringify(result));await context.close();
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
