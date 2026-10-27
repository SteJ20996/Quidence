'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const KEY='quidence-coordinate-project-studio-v1',RAW='Original explanation — keep my words. 中文 / español.';
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({args:['--no-sandbox']}),errors=[];let layouts=0;
 try{
  for(const theme of ['classic','paper','atlas','studio'])for(const lang of ['en','es','zh-Hant'])for(const width of [320,1440]){
   const c=await browser.newContext({viewport:{width,height:960}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(({theme,lang})=>{localStorage.setItem('quidence_ui_theme_v1',theme);localStorage.setItem('quidence_ui_locale_v1',lang==='es'?'es':'en');},{theme,lang});
   await p.goto(origin+'/courses/coordinate-geometry/?lang='+lang);await p.locator('[data-action="open"][data-project="plan"]').waitFor();
   assert.equal(await p.locator('#quidence-language').inputValue(),lang==='zh-Hant'?'zh-TW':lang);await p.evaluate(()=>QuidenceI18n.apply());assert.deepEqual(await p.evaluate(()=>QuidenceI18n.missing),[]);
   for(const project of ['plan','station']){
    if(project==='station')await p.locator('.nav-button[data-action="home"]').click();
    await p.locator('[data-action="open"][data-project="'+project+'"]').click();
    for(let step=0;step<6;step++){
     await p.locator('[data-action="step"][data-step="'+step+'"]').click();assert.equal(await p.locator('.q-speech-entry').count(),1);assert.ok((await p.locator('.small-goal').textContent()).trim());
     assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${theme} ${lang} ${width} ${project} ${step}`);layouts++;
    }
   }
   await p.locator('.q-speech-entry').click();assert.equal(await p.locator('.q-speech-dialog').getAttribute('lang'),'en');assert.equal(await p.getByRole('button',{name:'Add reviewed text',exact:true}).isEnabled(),false);
   assert.equal(await p.locator('.q-speech-dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
   await p.getByRole('button',{name:'Keep draft & close',exact:true}).click();await c.close();
  }
  const c=await browser.newContext({viewport:{width:1280,height:960}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{localStorage.setItem('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:'coordinate-geometry',includeInReport:true,text:'Use the diagram to explain the distance. Keep my original goal.'}));class Recognition{start(){this.onstart?.();this.onresult?.({results:[[{transcript:'The distance is tree metres.'}]]});}stop(){this.onend?.();}abort(){this.onend?.();}}window.SpeechRecognition=Recognition;});
  await p.goto(origin+'/courses/coordinate-geometry/?lang=es#plan');await p.locator('#reason').fill(RAW);await p.locator('.q-speech-entry').click();await p.getByRole('button',{name:'Start dictation',exact:true}).click();
  assert.equal(await p.locator('#reason').inputValue(),RAW);assert.equal(await p.getByRole('button',{name:'Add reviewed text',exact:true}).isEnabled(),false);
  await p.getByRole('button',{name:'Stop & review',exact:true}).click();await p.locator('#q-speech-text').fill('The distance is three metres.');await p.getByRole('button',{name:'Add reviewed text',exact:true}).click();
  assert.equal(await p.locator('#reason').inputValue(),RAW+'\nThe distance is three metres.');await p.locator('#work-form button[type="submit"]').click();
  const original=await p.evaluate(KEY=>JSON.parse(QuidenceStorage.getItem(KEY)).history[0],KEY);assert.equal(original.speechReviews[0].rawTranscript,'The distance is tree metres.');assert.equal(original.speechReviews[0].reviewedText,'The distance is three metres.');assert.equal(original.speechReviews[0].kind,'browser_speech_review');assert.equal(original.learningRequest.text,'Use the diagram to explain the distance. Keep my original goal.');
  await p.locator('#quidence-language').selectOption('zh-TW');await p.reload();assert.equal(await p.locator('#reason').inputValue(),original.reason);assert.deepEqual(await p.evaluate(KEY=>JSON.parse(QuidenceStorage.getItem(KEY)).history[0],KEY),original);
  await p.locator('.q-speech-entry').click();await p.locator('#q-speech-text').fill('Unconfirmed draft.');await p.getByRole('button',{name:'Keep draft & close',exact:true}).click();assert.equal(await p.locator('#reason').inputValue(),original.reason);await p.locator('.q-speech-entry').click();assert.equal(await p.locator('#q-speech-text').inputValue(),'Unconfirmed draft.');await p.getByRole('button',{name:'Keep draft & close',exact:true}).click();
  await p.goto(origin+'/?view=map&lang=en');await p.locator('[data-theme-choice="classic"]').click();await p.locator('button[data-home-view="map"]').click();await p.locator('[data-node="coordinate"]').click();
  assert.equal(await p.locator('#knowledge-map').getAttribute('data-selected-course'),'coordinate-geometry');assert.match(await p.locator('.qa-learn').getAttribute('href'),/courses\/coordinate-geometry/);assert.equal(await p.locator('.qa-diagnose').isVisible(),false);
  await p.locator('button[data-home-view="courses"]').click();const card=p.locator('.subject-card[data-subject="coordinate-geometry"]');assert.equal(await card.locator('.challenge-link,.foundation-link').count(),0);assert.match(await card.locator('.subject-link').getAttribute('href'),/courses\/coordinate-geometry/);
  for(const route of ['/courses/geometry/','/modules/ab01/dist/']){await p.goto(origin+route+'?lang=en');assert.match(await p.getByRole('link',{name:'Related coordinate geometry projects ↗',exact:true}).getAttribute('href'),/courses\/coordinate-geometry/);}
  await p.goto(origin+'/courses/coordinate-geometry/?lang=en#plan');assert.equal(await p.locator('#reason').inputValue(),original.reason);assert.deepEqual(await p.evaluate(KEY=>JSON.parse(QuidenceStorage.getItem(KEY)).history[0],KEY),original);await c.close();
  const corrupt=await browser.newContext(),bad=await corrupt.newPage();await bad.addInitScript(KEY=>localStorage.setItem(KEY,'{broken original'),KEY);await bad.goto(origin+'/courses/coordinate-geometry/?lang=en#plan');await bad.locator('#reason').fill('New text cannot replace the unreadable record.');assert.equal(await bad.evaluate(KEY=>localStorage.getItem(KEY),KEY),'{broken original');await corrupt.close();
  const denied=await browser.newContext(),temporary=await denied.newPage();await temporary.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Saving unavailable');}}));await temporary.goto(origin+'/courses/coordinate-geometry/?lang=en#plan');await temporary.locator('#reason').fill('Temporary reasoning stays editable.');assert.equal(await temporary.locator('#reason').inputValue(),'Temporary reasoning stays editable.');await denied.close();
  assert.deepEqual(errors,[]);console.log(JSON.stringify({coordinateLayouts:layouts,reviewedSpeechAndRecordPreservation:true,errors}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
