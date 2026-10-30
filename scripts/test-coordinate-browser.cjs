'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),{createServer}=require('../backend/server.cjs');
const {chooseTheme}=require('./theme-choice.cjs');
const KEY='quidence-coordinate-project-studio-v1',RAW='Original explanation — keep my words. 中文 / español.';
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({args:['--no-sandbox']}),errors=[];let layouts=0;
 try{
  for(const theme of ['classic','paper','atlas','studio'])for(const lang of ['en','es'])for(const width of [320,1440]){
   const c=await browser.newContext({viewport:{width,height:960}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(({theme,lang})=>{localStorage.setItem('quidence_ui_theme_v1',theme);localStorage.setItem('quidence_ui_locale_v1',lang==='es'?'es':'en');},{theme,lang});
   await p.goto(origin+'/courses/coordinate-geometry/?lang='+lang);await p.locator('[data-action="open"][data-project="plan"]').waitFor();
   assert.equal(await p.locator('#quidence-language').inputValue(),lang);await p.evaluate(()=>QuidenceI18n.apply());assert.deepEqual(await p.evaluate(()=>QuidenceI18n.missing),[]);
   // Each lesson opens from the overview, has no untranslated text or sideways scroll, shows point names as subscripts, and its graph answers the keyboard.
   for(let i=0;i<4;i++){
    await p.locator('.lesson-card[data-lesson="'+i+'"]').click();await p.locator('.lesson-plane').waitFor();assert.equal(new URL(p.url()).hash,'#lesson-'+(i+1));
    await p.evaluate(()=>QuidenceI18n.apply());assert.deepEqual(await p.evaluate(()=>QuidenceI18n.missing),[]);
    assert.doesNotMatch(await p.locator('main').innerText(),/\b[xy]_[A-Z]\b/,'lesson '+(i+1)+' shows raw subscript notation');if(i===0||i===2)assert(await p.locator('.lesson-formula sub').count()>0,'lesson '+(i+1)+' formula subscripts');
    const before=await p.locator('.lesson-readout').innerText();await p.locator('.lp-drag').first().focus();await p.keyboard.press('ArrowRight');assert.notEqual(await p.locator('.lesson-readout').innerText(),before,'lesson '+(i+1)+' keyboard move');
    assert.doesNotMatch(await p.locator('main').innerText(),/NaN|undefined/);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${theme} ${lang} ${width} lesson ${i+1}`);layouts++;
    await p.locator('.breadcrumb [data-action="home"]').click();await p.locator('.lesson-cards').waitFor();
   }
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
  await p.locator('#quidence-language').selectOption('es');await p.reload();assert.equal(await p.locator('#reason').inputValue(),original.reason);assert.deepEqual(await p.evaluate(KEY=>JSON.parse(QuidenceStorage.getItem(KEY)).history[0],KEY),original);
  // A record saved while the course also offered Traditional Chinese opens in English with its answers unchanged.
  await p.evaluate(KEY=>{const s=JSON.parse(QuidenceStorage.getItem(KEY));s.lang='zh-TW';QuidenceStorage.setItem(KEY,JSON.stringify(s));},KEY);{const u=new URL(p.url());u.searchParams.delete('lang');await p.goto(u.toString());}
  assert.equal(await p.locator('#quidence-language').inputValue(),'en');assert.deepEqual(await p.locator('#quidence-language option').evaluateAll(o=>o.map(x=>x.value)),['en','es']);assert.equal(await p.locator('#reason').inputValue(),original.reason);assert.deepEqual(await p.evaluate(KEY=>JSON.parse(QuidenceStorage.getItem(KEY)).history[0],KEY),original);
  await p.locator('.q-speech-entry').click();await p.locator('#q-speech-text').fill('Unconfirmed draft.');await p.getByRole('button',{name:'Keep draft & close',exact:true}).click();assert.equal(await p.locator('#reason').inputValue(),original.reason);await p.locator('.q-speech-entry').click();assert.equal(await p.locator('#q-speech-text').inputValue(),'Unconfirmed draft.');await p.getByRole('button',{name:'Keep draft & close',exact:true}).click();
  await p.goto(origin+'/?view=map&lang=en');await chooseTheme(p,'classic');await p.locator('button[data-home-view="map"]').click();await p.locator('[data-node="coordinate"]').click();
  assert.equal(await p.locator('#knowledge-map').getAttribute('data-selected-course'),'coordinate-geometry');assert.match(await p.locator('.qa-learn').getAttribute('href'),/courses\/coordinate-geometry/);assert.equal(await p.locator('.qa-diagnose').isVisible(),true);assert.match(await p.locator('.qa-diagnose').getAttribute('href'),/diagnostics\/\?module=coordinate-geometry/);
  await p.locator('button[data-home-view="courses"]').click();const card=p.locator('.subject-card[data-subject="coordinate-geometry"]');assert.match(await card.locator('.foundation-link').getAttribute('href'),/foundations\/\?module=coordinate-geometry/);assert.match(await card.locator('.challenge-link').getAttribute('href'),/diagnostics\/\?module=coordinate-geometry/);assert.equal(await card.locator('.availability-note').count(),0);assert.match(await card.locator('.intuition-link').getAttribute('href'),/intuition\/\?lang=en#fair$/);assert.match(await card.locator('.subject-link').getAttribute('href'),/courses\/coordinate-geometry/);
  // The projects link opens the overview at the two projects, even when the saved view is a project;
  // a #projects hash change on the course page does the same.
  const projects=card.locator('.project-link');assert.equal(await projects.innerText(),'Explore coordinate projects →');assert.match(await projects.getAttribute('href'),/courses\/coordinate-geometry\/(\?lang=en)?#projects$/);
  const atProjects=async()=>{await p.locator('#projects [data-action="open"][data-project="station"]').waitFor();assert.equal(await p.locator('#projects [data-action="open"][data-project]').count(),2);assert(await p.evaluate(()=>{const r=document.getElementById('projects').getBoundingClientRect();return r.top>-2&&r.top<innerHeight/2;}),'scrolled to the projects');};
  await projects.click();await atProjects();await p.goto(origin+'/courses/coordinate-geometry/?lang=en#lesson-2');await p.locator('.lesson-plane').waitFor();await p.evaluate(()=>{location.hash='projects';});await atProjects();
  const overview=async()=>{await p.locator('main').first().waitFor();if(!await p.locator('.readiness-links').count())await p.locator('[data-action="home"]').first().click();await p.locator('.readiness-links').waitFor();};
  await p.goto(origin+'/courses/coordinate-geometry/?lang=en');await overview();for(const [name,route] of [['Check foundations · 15 questions','/foundations/'],['Test your understanding · 4 problems','/diagnostics/']]){const link=p.getByRole('link',{name:new RegExp('^'+name)});assert.equal(new URL(await link.getAttribute('href'),p.url()).pathname,route);assert.equal(new URL(await link.getAttribute('href'),p.url()).searchParams.get('module'),'coordinate-geometry');}
  // The course page offers its Intuition Lab question in both languages, below the site header, and the panel survives re-renders.
  for(const [lang,label,link] of [['en','INTUITION LAB','Explore the question →'],['es','LABORATORIO DE INTUICIÓN','Explorar la pregunta →']]){await p.goto(origin+'/courses/coordinate-geometry/?lang='+lang);await overview();const panel=p.locator('.intuition-subject-entry');assert.equal(await panel.locator('.intuition-entry-label').innerText(),label);assert.equal(await panel.locator('a').innerText(),link);assert.equal(new URL(await panel.locator('a').getAttribute('href')).hash,'#fair');const placed=()=>p.evaluate(()=>{const e=document.querySelector('.intuition-subject-entry');return !!(e.compareDocumentPosition(document.querySelector('.site-header'))&Node.DOCUMENT_POSITION_PRECEDING)&&e.nextElementSibling?.id==='main';});assert(await placed(),'panel sits between the site header and the main content');assert((await p.locator('.nav-button[data-action="notebook"]').boundingBox()).height<=44,lang+' notebook link stays on one line');await p.locator('.lesson-card[data-lesson="0"]').click();await p.locator('.lesson-plane').waitFor();assert.equal(await p.locator('.intuition-subject-entry').count(),1);assert(await placed(),'panel keeps its place after a re-render');}
  // Chinese locale requests open the English course, with no Chinese text in the overview.
  for(const lang of ['zh-TW','zh-Hant']){await p.goto(origin+'/courses/coordinate-geometry/?lang='+lang);await overview();assert.equal(await p.locator('#quidence-language').inputValue(),'en');assert.doesNotMatch(await p.locator('main').innerText(),/[\u3400-\u9fff]/);}
  for(const route of ['/courses/geometry/','/modules/ab01/dist/']){await p.goto(origin+route+'?lang=en');assert.match(await p.getByRole('link',{name:'Related coordinate geometry projects ↗',exact:true}).getAttribute('href'),/courses\/coordinate-geometry/);}
  await p.goto(origin+'/courses/coordinate-geometry/?lang=en#plan');assert.equal(await p.locator('#reason').inputValue(),original.reason);assert.deepEqual(await p.evaluate(KEY=>JSON.parse(QuidenceStorage.getItem(KEY)).history[0],KEY),original);await c.close();
  {const lc=await browser.newContext({viewport:{width:1280,height:900}}),lp=await lc.newPage();lp.on('pageerror',e=>errors.push(e.message));
   await lp.goto(origin+'/courses/coordinate-geometry/?lang=en#lesson-3');await lp.locator('#lesson-mx').fill('1');await lp.locator('#lesson-my').fill('4');await lp.locator('#lesson-m').fill('1/2');await lp.locator('#lesson-form button[type="submit"]').click();
   assert.deepEqual(await lp.locator('.lesson-feedback').allInnerTexts(),['Matches the reference.','Matches the reference.','Matches the reference.']);assert(await lp.locator('.lesson-solution').isVisible());
   await lp.reload();assert.equal(await lp.locator('#lesson-m').inputValue(),'1/2');assert.deepEqual((await lp.evaluate(KEY=>JSON.parse(localStorage.getItem(KEY)).lessons,KEY)).checked,{midpoint:true});
   await lp.locator('.breadcrumb [data-action="home"]').click();assert.match(await lp.locator('.lesson-card[data-lesson="2"]').innerText(),/Quick check done/);assert.equal(new URL(lp.url()).hash,'');await lc.close();}
  const corrupt=await browser.newContext(),bad=await corrupt.newPage();await bad.addInitScript(KEY=>localStorage.setItem(KEY,'{broken original'),KEY);await bad.goto(origin+'/courses/coordinate-geometry/?lang=en#plan');await bad.locator('#reason').fill('New text cannot replace the unreadable record.');assert.equal(await bad.evaluate(KEY=>localStorage.getItem(KEY),KEY),'{broken original');await corrupt.close();
  const denied=await browser.newContext(),temporary=await denied.newPage();await temporary.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Saving unavailable');}}));await temporary.goto(origin+'/courses/coordinate-geometry/?lang=en#plan');await temporary.locator('#reason').fill('Temporary reasoning stays editable.');assert.equal(await temporary.locator('#reason').inputValue(),'Temporary reasoning stays editable.');await denied.close();
  assert.deepEqual(errors,[]);console.log(JSON.stringify({coordinateLayouts:layouts,reviewedSpeechAndRecordPreservation:true,errors}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
