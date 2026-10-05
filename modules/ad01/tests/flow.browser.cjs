'use strict';
// Optional real-browser checks: requires Playwright + its Chromium browser.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
const C=require('../dist/content.js'),E=require('../dist/engine.js'),root=path.resolve(__dirname,'../../..');
let server,browser,base;
test.before(async()=>{
 server=http.createServer((req,res)=>{let rel=decodeURIComponent(new URL(req.url,'http://local').pathname);let file=path.resolve(root,'.'+rel);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'text/plain');res.end(fs.readFileSync(file));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),args:['--no-sandbox']});
});
test.after(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});
const click=(page,action,index)=>page.locator(`[data-action="${action}"]${index===undefined?'':`[data-index="${index}"]`}`).click();
const choose=(page,id)=>page.locator(`input[name="choice"][value="${id}"]`).check();
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),E.SCHEMA);
async function value(page,name,v){await page.locator(`[data-lab="${name}"]`).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},v);}
async function learn(page){await click(page,'next');for(let i=0;i<4;i++)await click(page,'next-step');}
async function finish(page,i){await choose(page,'unsure');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await learn(page);for(const t of C.LESSONS[i].checks){await choose(page,t.correct[0]);await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');}}
test('complete workflow: blank gates, unsaved edits, history, resume, feedback and exports',async()=>{
 const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/');assert.equal(await page.locator('.subject-link').count(),6);
 await page.locator('.subject-link[href="modules/ad01/dist/"]').click();await click(page,'start');
 await page.locator('#answer-form').evaluate(f=>f.requestSubmit());assert.match(await page.locator('#answer-status').textContent(),/Choose an answer/);assert.equal(await page.locator('[data-action="next"]').isDisabled(),true);
 await choose(page,'4');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());assert.doesNotMatch(await page.locator('#app').textContent(),/Correct on this question|Revisit this idea/);
 await choose(page,'2');assert.equal(await page.locator('[data-action="next"]').isDisabled(),true);await page.locator('#answer-form').evaluate(f=>f.requestSubmit());
 await click(page,'next');await click(page,'step',3);assert.equal(await page.locator('[data-action="next-step"]').isDisabled(),true);await click(page,'step',1);await click(page,'step',2);await click(page,'step',3);await click(page,'next-step');
 await choose(page,'limit4');await page.locator('#explanation').fill('<img src=x onerror=alert(1)>');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await page.reload();assert.equal(await page.locator('#explanation').inputValue(),'<img src=x onerror=alert(1)>');assert.equal(await page.locator('#app img').count(),0);
 await click(page,'next');await choose(page,'none');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');assert.match(await page.locator('.first-thought').textContent(),/4/);
 await click(page,'revise',0);await choose(page,'limit1');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());assert.equal((await saved(page)).records.c1.submissions[1].support.feedbackSeen,true);await click(page,'next');await click(page,'next');
 await click(page,'continue');await finish(page,1);await click(page,'continue');await finish(page,2);await click(page,'continue');await finish(page,3);await click(page,'continue');assert.equal((await saved(page)).view,'summary');
 const [json]=await Promise.all([page.waitForEvent('download'),click(page,'export-json')]);const out=JSON.parse(fs.readFileSync(await json.path(),'utf8'));assert.equal(Object.keys(out.records).length,12);assert.deepEqual(out.records.p1.submissions.map(s=>s.answer.choices),[['4'],['2']]);
 const [md]=await Promise.all([page.waitForEvent('download'),click(page,'export-md')]);assert.match(fs.readFileSync(await md.path(),'utf8'),/AD01 · Visual Calculus/);
 await page.reload();assert.equal((await saved(page)).view,'summary');assert.equal(errors.length,0,errors.join('\n'));await context.close();
});
test('graph controls update real SVGs and numbers without changing saved answers or losing focus',async()=>{
 const context=await browser.newContext(),page=await context.newPage();await page.goto(base+'/modules/ad01/dist/');await click(page,'open',1);await choose(page,'unsure');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');
 await page.locator('#lab-kind').selectOption('absolute');await value(page,'a',0);await page.locator('#lab-side').selectOption('-1');await value(page,'h',.02);assert.match(await page.locator('#live-readout').textContent(),/Δy\/Δx = −?\-1|Δy\/Δx = -1/);assert.match(await page.locator('#live-readout').textContent(),/undefined/);
 await page.locator('#lab-showDerivative').check();assert.equal(await page.locator('#lab-graphs svg').count(),2);const slider=page.locator('#lab-a');await slider.focus();await slider.press('ArrowRight');assert.equal(await slider.evaluate(el=>document.activeElement===el),true);
 await value(page,'a',2);await value(page,'h',1);await page.locator('#lab-side').selectOption('1');assert.doesNotMatch(await page.locator('#lab-graphs').innerHTML(),/NaN|Infinity/);
 const before=await saved(page);assert.equal(Object.keys(before.records).length,1);await page.reload();assert.equal((await saved(page)).labs[1].kind,'absolute');assert.equal(await page.locator('#lab-showDerivative').isChecked(),true);
 await click(page,'reset-lab');assert.equal(await page.locator('#lab-kind').inputValue(),'square');assert.equal(await page.locator('#lab-showDerivative').isChecked(),false);
 await click(page,'open',2);await choose(page,'unsure');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');await page.locator('#lab-kind').selectOption('linear');await value(page,'b',2);await value(page,'n',64);assert.match(await page.locator('#live-readout').textContent(),/Signed integral = 0/);assert.match(await page.locator('#live-readout').textContent(),/Total area = 4/);assert.equal(await page.locator('#lab-graphs rect[fill-opacity]').count(),64);
 await click(page,'open',3);await choose(page,'unsure');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');await value(page,'x',-1);await value(page,'h',.02);assert.match(await page.locator('#live-readout').textContent(),/A′\(x\) = f\(x\) = 0/);assert.match(await page.locator('#lab-graphs').textContent(),/reverses orientation/);await context.close();
});
test('phone layout, corrupt storage recovery, blocked saving and module isolation',async()=>{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(base+'/');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.goto(base+'/modules/ad01/dist/');await page.evaluate(key=>{localStorage.setItem(key,'{corrupt');localStorage.setItem('ac01_beta01_session_v1','AC01 unchanged');},E.SCHEMA);await page.reload();assert.match(await page.locator('#app').textContent(),/kept unchanged/);
 await click(page,'reset-blocked');await click(page,'cancel-reset');assert.equal(await page.evaluate(key=>localStorage.getItem(key),E.SCHEMA),'{corrupt');await click(page,'reset-blocked');await click(page,'confirm-reset');assert.equal(await page.evaluate(()=>localStorage.getItem('ac01_beta01_session_v1')),'AC01 unchanged');
 await click(page,'start');await choose(page,'unsure');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#lab-graphs svg').count(),1);
 if(process.env.AD01_SCREENSHOT_DIR){fs.mkdirSync(process.env.AD01_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.AD01_SCREENSHOT_DIR,'ad01-mobile.png'),fullPage:true});}
 await context.close();
 const denied=await browser.newContext();await denied.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('denied');};});const p=await denied.newPage();await p.goto(base+'/modules/ad01/dist/');assert.match(await p.locator('#storage-note').textContent(),/unavailable/);await click(p,'start');await choose(p,'unsure');await p.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(p,'next');assert.equal(await p.locator('#lab-graphs svg').count(),1);await denied.close();
});
test('desktop screenshot and visible graph bounds for the largest two-point separation',async()=>{
 const context=await browser.newContext({viewport:{width:1440,height:1080}}),page=await context.newPage();await page.goto(base+'/');
 if(process.env.AD01_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.AD01_SCREENSHOT_DIR,'dashboard.png'),fullPage:true});
 await page.goto(base+'/modules/ad01/dist/');await click(page,'open',1);await choose(page,'unsure');await page.locator('#answer-form').evaluate(f=>f.requestSubmit());await click(page,'next');await value(page,'a',2);await value(page,'h',1);
 assert.match(await page.locator('#lab-graphs figcaption').textContent(),/Q = \(3, 9\)/);
 if(process.env.AD01_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.AD01_SCREENSHOT_DIR,'ad01-desktop.png'),fullPage:true});
 await context.close();
});

