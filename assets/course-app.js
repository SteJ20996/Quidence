(function(){
'use strict';
const C=window.QuidenceCourseContent,E=window.QuidenceCourseEngine,G=window.QuidenceCourseGraphs;
const app=document.getElementById('app'),KEY=E.SCHEMA;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=E.fresh(),saving=true,blocked=false,raw='',notice='',step=0,motion=null,motionFrame=0;
try{raw=(window.QuidenceStorage||window.localStorage).getItem(KEY)||'';if(raw){const loaded=E.hydrate(JSON.parse(raw));if(loaded)state=loaded;else blocked=true;}}
catch{if(raw)blocked=true;else saving=false;}
const lesson=()=>C.LESSONS[state.lessonIndex];
const currentTask=()=>state.view==='lesson'?(state.stage==='predict'?lesson().predict:state.stage==='check'?lesson().checks[state.questionIndex]:null):null;
const button=(action,label,cls='',extra='')=>`<button class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`;
function save(){
 if(!blocked)try{(window.QuidenceStorage||window.localStorage).setItem(KEY,JSON.stringify(state));}catch{saving=false;}
 document.getElementById('storage-note').textContent=saving?'Progress stays in this browser. No account needed.':'Browser saving is unavailable. Keep this tab open to finish.';
}
function nav(){return`<nav class="lesson-nav" aria-label="Subject lessons">${button('home','Start here','quiet')}${C.LESSONS.map((l,i)=>`<button class="lesson-link ${state.view==='lesson'&&state.lessonIndex===i?'active':''}" data-action="open" data-index="${i}" ${state.view==='lesson'&&state.lessonIndex===i?'aria-current="page"':''}><span class="lesson-number">${E.lessonDone(state,i)?'✓':i+1}</span>${esc(l.short)}</button>`).join('')}${button('summary','My summary','quiet',E.allDone(state)?'':'disabled')}</nav>`;}
function phases(){return`<ol class="phase-path" aria-label="Current lesson phases">${[['predict','First thought'],['learn','Explore & learn'],['check','Fresh questions'],['review','Feedback']].map(([id,name])=>`<li class="${state.stage===id?'current':''}" ${state.stage===id?'aria-current="step"':''}>${name}</li>`).join('')}</ol>`;}
function orientation(){return`<section class="hero course-hero"><p class="eyebrow">${esc(C.eyebrow)}</p><h1>${C.headline.split('\n').map(esc).join('<br>')}</h1><p class="lead">${esc(C.lead)}</p><div class="actions">${button('start',Object.keys(state.records).length?'Resume learning →':'Start exploring →','primary')}<span class="tiny">${esc(C.prerequisite)}</span></div><p class="course-bridge"><a href="${esc(C.bridge.href)}" target="_blank" rel="noopener">${esc(C.bridge.label)}</a></p></section><section class="orientation-grid"><article class="card"><p class="eyebrow">HOW IT WORKS</p><h2>Predict. Explore. Explain.</h2><ol class="simple-list"><li>Save a first thought and a reason. “I’m not sure” is welcome.</li><li>Explore four short steps with interactive diagrams.</li><li>Answer two new questions and explain, then review feedback.</li></ol><p class="muted">Use a calculation, a sentence, or describe where you got stuck. Graphs include text and numerical readouts. Written explanations need review; entering text does not earn an automatic explanation score.</p></article><article class="card"><p class="eyebrow">WHAT YOU’LL CONNECT</p><h2>Four starting points.</h2><ul class="topic-list">${C.LESSONS.map((l,i)=>`<li><span>${i+1}</span><div>${esc(l.short)}<small>${esc(l.goal)}</small></div></li>`).join('')}</ul></article></section><p class="privacy-note">${esc(C.scope)} No sign-up needed. Your progress stays in this browser; export your report after all four lessons.</p>`;}
function taskHtml(t){
 const r=E.record(state,t.id),pre=state.stage==='predict';
 return`<section class="card task-card"><p class="eyebrow">${pre?'BEFORE THIS LESSON':`NEW SITUATION · QUESTION ${state.questionIndex+1} OF 2`}</p><h2>${pre?'What do you think?':'Try the idea yourself.'}</h2><p class="muted">${pre?'Save a first prediction before the explanation. Feedback comes after the two new questions.':'Use this new situation. Save both answers and explanations before seeing feedback.'}</p><div class="task-layout ${t.graph?'':'text-task'}">${t.graph?`<div class="task-stimulus">${G.task(t.graph)}</div>`:''}<form id="answer-form"><fieldset><legend>${esc(t.prompt)}</legend><div class="answer-options">${t.options.concat({id:'unsure',label:'I’m not sure yet'}).map(o=>`<label class="answer-option"><input type="radio" name="choice" value="${o.id}" ${r.draft.choices.includes(o.id)?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div></fieldset><label class="explanation-label" for="explanation">Explain your thinking <span class="tiny">(required; saved for review)</span></label><p class="review-text">Equations, calculations, or a short explanation are welcome. Your reasoning helps us build a clearer report about what this work shows and what still needs checking. Quidence checks the fixed answer parts and saves your reasoning for a teacher or tutor to review. A reviewer should judge the mathematics, not grammar, keywords or answer length.</p><textarea id="explanation" name="explanation" rows="3" maxlength="3000" aria-required="true" placeholder="Show a calculation, explain your choice, or describe what is unclear.">${esc(r.draft.explanation)}</textarea><label class="help-label"><input type="checkbox" name="otherHelp" ${r.draft.otherHelp?'checked':''}> I used other help on this question.</label><div class="actions"><button type="submit" class="btn primary">${r.submissions.length?'Save this answer':'Save my answer'}</button>${button('next',pre?'Explore the idea →':state.questionIndex===0?'Next question →':'See the feedback →','',r.status==='submitted'?'':'disabled')}</div><p id="answer-status" class="status" role="status">${esc(notice||(r.status==='submitted'?'Answer saved. Continue when you are ready.':''))}</p></form></div></section>`;
}
function select(name,label,options,value){return`<label class="control-label" for="lab-${name}">${label}<select id="lab-${name}" data-lab="${name}">${options.map(([v,t])=>`<option value="${v}" ${String(value)===String(v)?'selected':''}>${t}</option>`).join('')}</select></label>`;}
function slider(name,label,min,max,inc,value){return`<label class="control-label" for="lab-${name}">${label}<span class="range-row"><input id="lab-${name}" data-lab="${name}" type="range" min="${min}" max="${max}" step="${inc}" value="${value}"><output id="out-${name}" for="lab-${name}">${value}</output></span></label>`;}
function controls(){return lesson().controls.map(c=>c.options?`<label class="control-label" for="lab-${c.name}">${esc(c.label)}<select id="lab-${c.name}" data-lab="${c.name}" ${c.numeric?'data-numeric="true"':''}>${c.options.map(([v,t])=>`<option value="${v}" ${String(state.labs[state.lessonIndex][c.name])===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`:slider(c.name,esc(c.label),c.min,c.max,c.step,state.labs[state.lessonIndex][c.name])).join('');}
function explorer(){return`<article class="card explorer"><p class="eyebrow">CHANGE · COMPARE · EXPLAIN</p><h2>Explore the example.</h2><div class="lab-controls">${controls()}</div>${lesson().motion?`<div class="motion-controls"><button type="button" class="btn primary" id="play-motion" data-action="play-motion" aria-pressed="false">Play animation</button><p id="motion-note" class="tiny" role="status">Watch the change, then pause or use a control.</p></div>`:''}<div id="live-readout" class="lab-readout" role="status" aria-live="polite" aria-atomic="true"></div><div id="lab-graphs"></div><div id="lab-formula" class="formula-box"></div><p id="lab-note" class="tiny"></p><p class="tiny">Controls explore the example; they do not submit an answer.</p>${button('reset-lab','Reset this example','quiet small')}</article>`;}
function learnHtml(){
 const l=lesson();
 if(!state.lessons[state.lessonIndex].seenSteps.includes(step)){state.lessons[state.lessonIndex].seenSteps.push(step);E.log(state,'lesson_step_viewed',{lesson:l.id,step});}
 return`<section class="learning-grid"><article class="card lesson-copy"><p class="eyebrow">STEP ${step+1} OF 4</p><div class="step-tabs" aria-label="Worked lesson steps">${l.steps.map((_,i)=>`<button data-action="step" data-index="${i}" class="step-dot ${step===i?'active':''}" aria-label="Read step ${i+1}" ${step===i?'aria-current="step"':''}>${i+1}</button>`).join('')}</div><h2>${esc(l.steps[step].title)}</h2><p class="lesson-text">${esc(l.steps[step].text)}</p><div class="try-note"><h3>Try this</h3><p>${esc(l.steps[step].try)}</p></div><div class="actions">${button('prev-step','← Previous','quiet',step===0?'disabled':'')}${button('next-step',step<3?'Next step →':'Try fresh questions →','primary',step===3&&state.lessons[state.lessonIndex].seenSteps.length<4?'disabled':'')}</div><p class="tiny">${state.lessons[state.lessonIndex].seenSteps.length} of 4 steps opened. Take time to compare the graphs.</p></article>${explorer()}</section>`;
}
function motionSpec(){const spec=lesson().motion;return spec?{...spec,start:state.labs[state.lessonIndex][spec.key]}:null;}
function updateMotionButton(){
 const b=document.getElementById('play-motion');if(!b)return;
 const spec=motionSpec();
 b.textContent=motion?'Pause animation':Math.abs(spec.start-spec.end)<.00001?'Replay animation':'Play animation';
 b.setAttribute('aria-pressed',motion?'true':'false');
}
function stopMotion(reason='paused',persist=true){
 if(motionFrame){cancelAnimationFrame(motionFrame);motionFrame=0;}
 if(!motion)return;
 const previous=motion;motion=null;
 E.log(state,reason==='completed'?'graph_animation_completed':'graph_animation_paused',{lesson:C.LESSONS[previous.lessonIndex].id,reason,settings:{...state.labs[previous.lessonIndex]}});
 const readout=document.getElementById('live-readout');if(readout)readout.setAttribute('aria-live','polite');
 const note=document.getElementById('motion-note');if(note)note.textContent=reason==='completed'?'Animation finished. Compare the values or change a control.':'Animation paused. Use the controls or press Play to continue.';
 updateMotionButton();if(persist&&!blocked)save();
}
function applyMotionValue(spec,value){
 const c=lesson().controls.find(c=>c.name===spec.key);
 value=Math.max(c.min,Math.min(c.max,c.min+Math.round((value-c.min)/c.step)*c.step));
 state.labs[state.lessonIndex][spec.key]=Number(value.toFixed(8));
 const input=document.getElementById('lab-'+spec.key);if(input)input.value=String(state.labs[state.lessonIndex][spec.key]);updateExplorer();
}
function playMotion(){
 if(motion){stopMotion('paused');return;}
 if(blocked||state.view!=='lesson'||state.stage!=='learn')return;
 const spec=motionSpec();if(!spec)return;if(Math.abs(spec.start-spec.end)<.00001)spec.start=spec.replay;
 motion={...spec,lessonIndex:state.lessonIndex,startedAt:null};
 E.log(state,'graph_animation_started',{lesson:lesson().id,settings:{...state.labs[state.lessonIndex]}});
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){applyMotionValue(spec,spec.end);stopMotion('completed');return;}
 const readout=document.getElementById('live-readout');if(readout)readout.setAttribute('aria-live','off');
 const note=document.getElementById('motion-note');if(note)note.textContent='Animation playing. Pause whenever you want to inspect a value.';
 updateMotionButton();save();
 function frame(time){
  if(!motion)return;
  if(state.view!=='lesson'||state.stage!=='learn'||state.lessonIndex!==motion.lessonIndex){stopMotion('navigation');return;}
  if(motion.startedAt===null)motion.startedAt=time;
  const progress=Math.min(1,Math.max(0,(time-motion.startedAt)/4500)),eased=progress*progress*(3-2*progress);
  const value=spec.key==='h'?spec.start*Math.pow(spec.end/spec.start,eased):spec.start+(spec.end-spec.start)*eased;
  applyMotionValue(spec,value);
  if(progress<1)motionFrame=requestAnimationFrame(frame);else stopMotion('completed');
 }
 motionFrame=requestAnimationFrame(frame);
}
if(window.addEventListener)window.addEventListener('pagehide',()=>stopMotion('pagehide'));
if(document.addEventListener)document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMotion('hidden');});
function updateExplorer(){
 if(state.view!=='lesson'||state.stage!=='learn'||blocked)return;
 const l=state.labs[state.lessonIndex],rendered=G.lab(C.MODULE,state.lessonIndex,l);
 document.getElementById('lab-graphs').innerHTML=rendered.graph;
 document.getElementById('live-readout').textContent=rendered.readout;
 document.getElementById('lab-formula').textContent=rendered.formula;
 document.getElementById('lab-note').textContent=rendered.note;
 for(const [name,value]of Object.entries(l)){const out=document.getElementById('out-'+name);if(out)out.textContent=String(value);}
 updateMotionButton();
}
const resultLabel=result=>result==='correct'?'Correct on this question':result==='unsure'?'Not sure yet':'Revisit this idea';
function answerText(t,a){return a.choices.map(id=>id==='unsure'?'I’m not sure yet':t.options.find(o=>o.id===id)?.label||id).join('; ');}
function reviewHtml(){
 const l=lesson(),initial=state.records[l.predict.id].submissions[0];
 return`<section class="card review"><p class="eyebrow">LESSON ${state.lessonIndex+1} · FEEDBACK</p><h2>What does your work show?</h2><div class="first-thought"><h3>Your first saved prediction</h3><p>${esc(answerText(l.predict,initial.answer))}</p><p class="tiny">${resultLabel(initial.result)}. ${initial.support.lessonSeen?'An earlier lesson visit was recorded before this prediction.':'Saved before opening this lesson.'}</p><p>${esc(l.predict.explanation)}</p></div><h3>Fresh questions after instruction</h3>${l.checks.map((t,i)=>{const r=state.records[t.id],s=E.last(state,t.id);return`<article class="feedback-item"><span class="feedback-label ${s.result==='correct'?'correct':'revisit'}">${resultLabel(s.result)}</span><h4>${i+1}. ${esc(t.prompt)}</h4><p class="answer-line">Your answer: ${esc(answerText(t,s.answer))}</p><p>${esc(t.explanation)}</p>${s.answer.explanation?`<p class="written-answer">Your explanation: ${esc(s.answer.explanation)}</p>`:''}<p class="tiny">${s.support.otherHelp?'Other help was reported. ':''}${s.support.feedbackSeen?'This submission followed earlier feedback. ':''}${r.submissions.length} saved attempt${r.submissions.length===1?'':'s'}; earlier answers remain in your history.</p>${button('revise','Revise this question','quiet small',`data-index="${i}"`)}</article>`;}).join('')}<div class="next-step-note"><h3>A useful next step</h3><p>${esc(l.next)}</p></div><p class="tiny">Feedback on these questions, rather than a course grade. Written explanations are saved for human review.</p><div class="actions">${button('relearn','Reopen the lesson','quiet')}${button('continue',E.allDone(state)?'See my summary →':state.lessonIndex<3?'Continue to the next lesson →':'Visit an unfinished lesson →','primary')}</div></section>`;
}
function summaryHtml(){return`<section class="summary-heading"><p class="eyebrow">YOUR FOUR-LESSON SUMMARY</p><h1>Connect the picture<br>to the mathematics.</h1><p class="lead">First predictions and questions after instruction are separate observations. These activities give you starting points for practice, rather than a complete measure of this subject.</p></section><div class="card"><div class="table-wrap"><table class="summary-table"><thead><tr><th scope="col">Concept</th><th scope="col">First saved prediction</th><th scope="col">Fresh questions</th></tr></thead><tbody>${C.LESSONS.map((l,i)=>`<tr><th scope="row">${esc(l.short)}</th><td>${resultLabel(state.records[l.predict.id].submissions[0].result)}</td><td>${l.checks.map(t=>resultLabel(E.last(state,t.id).result)).join('<br>')}${button('open','View feedback','quiet small',`data-index="${i}"`)}</td></tr>`).join('')}</tbody></table></div><p class="tiny">History includes first attempts, revisions, previous feedback, and self-reported help. Required explanations are saved and are not automatically scored.</p><div class="actions">${button('export-json','Download answer history','primary')}${button('export-md','Download readable summary')}${button('print','Print summary','quiet')}</div></div><section class="card next-steps"><h2>Practice the connections</h2><ul>${C.LESSONS.map(l=>`<li>${esc(l.short)}: ${esc(l.next)}</li>`).join('')}</ul></section>`;}
function render(focus=false){
 stopMotion('navigation',false);
 if(blocked){app.innerHTML=`<section class="card recovery"><h1>Your saved session needs attention.</h1><p>It could not be read and has been kept unchanged. Download a copy before replacing it.</p><div class="actions">${button('raw','Download saved record','primary')}${button('reset-blocked','Replace with a new session')}</div></section><dialog id="reset-dialog"><h2>Replace the unreadable ${esc(C.TITLE)} record?</h2><p>Download the record first if you want to keep it.</p><div class="actions">${button('cancel-reset','Keep it')}${button('confirm-reset','Replace record','primary')}</div></dialog>`;return;}
 app.innerHTML=nav()+(state.view==='orientation'?orientation():state.view==='summary'?summaryHtml():`<section class="lesson-heading"><p class="eyebrow">LESSON ${state.lessonIndex+1} OF 4</p><h1>${esc(lesson().title)}</h1><p class="muted">${esc(lesson().goal)}</p>${phases()}</section>`+(state.stage==='learn'?learnHtml():state.stage==='review'?reviewHtml():taskHtml(currentTask())));
 if(state.view==='summary'&&window.QuidenceReportStore){const saved=window.QuidenceReportStore.save(C.MODULE,{...E.exportRecord(state),reportText:markdown()},state.createdAt);window.QuidenceReportStore.appendNotice(app,saved,{reportsHref:C.reportsHref});}
 const form=document.getElementById('answer-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const t=currentTask();if(E.submit(state,t.id,state.stage)){notice='Answer saved. Continue when you are ready.';save();render();document.querySelector('[data-action="next"]').focus();}else{notice='Choose an answer or “I’m not sure yet,” and add a reason before saving.';document.getElementById('answer-status').textContent=notice;}});
 updateExplorer();save();
 if(focus){const heading=app.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus();}window.scrollTo({top:0,behavior:'instant'});}
}
function showReview(){state.stage='review';state.lessons[state.lessonIndex].reviewed=true;[lesson().predict,...lesson().checks].forEach(t=>E.record(state,t.id).feedbackSeen=true);E.log(state,'feedback_viewed',{lesson:lesson().id});}
function openLesson(index){
 state.lessonIndex=index;state.view='lesson';const l=lesson(),r=state.records[l.predict.id];step=0;notice='';
 if(!r||r.status!=='submitted')state.stage='predict';
 else if(E.lessonDone(state,index))state.stage='review';
 else if(state.lessons[index].seenSteps.length===4){state.stage='check';state.questionIndex=l.checks.findIndex(t=>state.records[t.id]?.status!=='submitted');if(state.questionIndex<0)showReview();}
 else state.stage='learn';
 E.log(state,'lesson_opened',{lesson:l.id});render(true);
}
app.addEventListener('input',event=>{
 const target=event.target;
 if(target.dataset.lab){
  stopMotion('control',false);
  const name=target.dataset.lab;state.labs[state.lessonIndex][name]=target.type==='checkbox'?target.checked:target.tagName==='SELECT'&&!target.dataset.numeric?target.value:Number(target.value);
  updateExplorer();save();return;
 }
 if(!target.closest('#answer-form'))return;
 const t=currentTask();if(!t)return;const form=document.getElementById('answer-form'),r=E.record(state,t.id);
 E.update(state,t.id,{choices:Array.from(form.querySelectorAll('[name="choice"]:checked')).map(x=>x.value),explanation:form.querySelector('[name="explanation"]').value,otherHelp:form.querySelector('[name="otherHelp"]').checked});
 notice=r.submissions.length?'Edited. Save again before continuing.':'';
 document.getElementById('answer-status').textContent=notice;document.querySelector('[data-action="next"]').disabled=true;save();
});
app.addEventListener('change',event=>{if(event.target.dataset.lab){E.log(state,'graph_explored',{lesson:lesson().id,control:event.target.dataset.lab,settings:{...state.labs[state.lessonIndex]}});save();}});
function download(name,content,mime){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function markdown(){
 let s='# '+C.TITLE+'\n\n'+`Session started: ${state.createdAt}\n\n`+'Initial predictions and checks after instruction are separate observations. Required explanations need human review. Fixed choices do not establish subject mastery.\n\n';
 s+='AI tutor request: '+window.QuidenceReportStore.HANDOFF+'\n\nScope: '+C.scope+'\n\n';
 for(const l of C.LESSONS){s+=`## ${l.short}\n\n`;for(const t of [l.predict,...l.checks]){s+=`### ${t===l.predict?'Initial prediction':'Fresh question'}: ${t.prompt}\n\n`;state.records[t.id].submissions.forEach((r,i)=>{s+=`Attempt ${i+1}: ${answerText(t,r.answer)}\n\nResult: ${resultLabel(r.result)}\n\nSupport: lesson seen=${r.support.lessonSeen}; earlier feedback=${r.support.feedbackSeen}; other help reported=${r.support.otherHelp}\n\n`;if(r.answer.explanation)s+=`Explanation (not automatically scored):\n\n${r.answer.explanation.split('\n').map(line=>'> '+line).join('\n')}\n\n`;});s+=`${t.explanation}\n\n`;}s+=`Next step: ${l.next}\n\n`;}
 return s;
}
app.addEventListener('click',event=>{
 const b=event.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action,i=Number(b.dataset.index);notice='';
 if(action==='raw'){download('Quidence_'+C.TITLE.replace(/\W+/g,'_')+'_Saved_Record.json',raw,'application/json');return;}
 if(action==='reset-blocked'){document.getElementById('reset-dialog').showModal();return;}
 if(action==='cancel-reset'){document.getElementById('reset-dialog').close();return;}
 if(action==='confirm-reset'){state=E.fresh();blocked=false;raw='';step=0;render(true);return;}
 if(blocked)return;
 if(action==='play-motion'){playMotion();return;}
 stopMotion('navigation',false);
 if(action==='home')state.view='orientation';
 else if(action==='start')state.view='lesson';
 else if(action==='open'){openLesson(i);return;}
 else if(action==='summary'){if(!E.allDone(state))return;state.view='summary';}
 else if(action==='next'){
  if(E.record(state,currentTask().id).status!=='submitted')return;
  if(state.stage==='predict'){state.stage='learn';step=0;}
  else if(state.questionIndex===0)state.questionIndex=1;else showReview();
 }
 else if(action==='step')step=i;
 else if(action==='prev-step')step=Math.max(0,step-1);
 else if(action==='next-step'){if(step<3)step++;else if(state.lessons[state.lessonIndex].seenSteps.length===4){state.stage='check';state.questionIndex=0;}}
 else if(action==='reset-lab'){state.labs[state.lessonIndex]=E.defaultLabs()[state.lessonIndex];render();document.getElementById('lab-'+lesson().controls[0].name).focus();return;}
 else if(action==='relearn'){state.stage='learn';step=0;}
 else if(action==='revise'){state.stage='check';state.questionIndex=i;}
 else if(action==='continue'){if(E.allDone(state))state.view='summary';else{const next=state.lessonIndex<3?state.lessonIndex+1:C.LESSONS.findIndex((_,j)=>!E.lessonDone(state,j));openLesson(next);return;}}
 else if(action==='export-json'){download('Quidence_'+C.TITLE.replace(/\W+/g,'_')+'_Answer_History.json',JSON.stringify(E.exportRecord(state),null,2),'application/json');return;}
 else if(action==='export-md'){download('Quidence_'+C.TITLE.replace(/\W+/g,'_')+'_Learning_Summary.md',markdown(),'text/markdown');return;}
 else if(action==='print'){try{const ok=window.QuidenceReportTools.openPrint(window.QuidenceReportTools.printable(document.title,{markdown:markdown()}));notice=ok?'The report opened in a new tab. Print / save as PDF there.':'Allow pop-ups or download the readable report.';}catch{notice='The report tab could not open. Download the readable report.';}render();return;}
 else return;
 const local=state.stage==='learn'&&['step','prev-step','next-step'].includes(action);
 render(!local);if(local){const h=app.querySelector('h2');h.tabIndex=-1;h.focus();}
});
render();
})();

