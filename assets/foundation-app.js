(function(root){
'use strict';
const B=root.ClueveraFoundationBank,E=root.ClueveraFoundationEngine,G=root.ClueveraFoundationGraphs;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(host,options={}){
 let selected=B.MODULES[options.module]?options.module:'aa01',portfolio=E.fresh(),notice='',blocked=false,raw='',saving=true;
 const key=options.key||E.SCHEMA;let storage;
 try{storage=options.storage||root.localStorage;raw=storage.getItem(key)||'';if(raw){const loaded=E.hydrate(JSON.parse(raw));if(loaded)portfolio=loaded;else blocked=true;}}
 catch{if(raw)blocked=true;else saving=false;}
 const current=()=>E.session(portfolio,selected)||E.createSession(portfolio,selected);
 const button=(action,label,extra='')=>'<button type="button" data-f-action="'+action+'" '+extra+'>'+label+'</button>';
 function save(){if(!blocked&&saving)try{storage.setItem(key,JSON.stringify(portfolio));}catch{saving=false;}}
 function download(data,type,name){try{const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice='Download requested. Keep a copy with your learning notes.';}catch{notice='The download could not start. Use a full browser tab or copy the readable report below.';}render();}
 function nav(){return'<div class="f-toolbar"><a href="../index.html" data-f-home>← All subjects</a><label for="f-subject">Subject<select id="f-subject" data-f-subject>'+Object.entries(B.MODULES).map(([id,m])=>'<option value="'+id+'" '+(id===selected?'selected':'')+'>'+m.title+'</option>').join('')+'</select></label>'+button('intro','Start here')+button('report','My report',E.done(current())?'':'disabled')+'</div>';}
 function status(){return'<p id="f-status" class="f-status" role="status">'+esc(notice)+'</p>'+(saving?'':'<p class="f-warning" role="alert">Browser saving is unavailable. Keep this tab open and download your report.</p>');}
 function intro(){
  const m=B.MODULES[selected],s=current(),answered=E.tasks(s).filter(t=>E.last(s,t)).length;
  return'<section class="f-intro"><p class="f-eyebrow">FOUNDATION CHECK · 15 QUESTIONS</p><h1 id="f-heading">'+m.title+'</h1><p class="f-lead">'+m.scope+'. Show an answer and explain how you reached it. Your reasoning helps a tutor choose what to teach next.</p><ol class="f-topic-list">'+m.groups.map(g=>'<li>'+g+'<span>3 questions</span></li>').join('')+'</ol><p>You can use a short calculation, a sentence, or describe where you got stuck. “I’m not sure” is allowed; tell us what is unclear. There is no time limit.</p><p>Reference answers appear after all 15 responses are saved. Answer checks and explanation review stay separate.</p><div class="f-actions">'+button('resume',answered?'Continue this check →':'Start the check →','class="f-primary"')+'<a class="f-secondary-link" href="'+m.course+'" data-f-course>Continue the lessons</a></div><p class="f-note">Answers and reports are saved in this browser. Download a copy to use on another device or with another AI tutor.</p></section>'+history();
 }
 function history(){const sessions=portfolio.modules[selected].sessions;return'<details class="f-history"><summary>Saved checks ('+sessions.length+')</summary><ul>'+sessions.map(s=>'<li>'+button('history',new Date(s.createdAt).toLocaleString()+' · '+E.tasks(s).filter(t=>E.last(s,t)).length+'/15 saved','data-session="'+esc(s.id)+'"')+'</li>').join('')+'</ul>'+button('new','Start a new check; keep earlier records')+'</details>';}
 function fields(t,a){return t.fields.map(f=>{
  if(f.kind==='number')return'<label class="f-field" for="f-'+f.id+'">'+esc(f.label)+'<input id="f-'+f.id+'" data-f-field="'+f.id+'" type="text" inputmode="text" maxlength="80" value="'+esc(a.values[f.id])+'" '+(a.unsure?'disabled':'')+'></label>';
  return'<fieldset class="f-field"><legend>'+esc(f.label)+(f.kind==='multi'?' · select every answer that fits':'')+'</legend>'+f.options.map(o=>'<label class="f-option"><input data-f-field="'+f.id+'" type="'+(f.kind==='multi'?'checkbox':'radio')+'" name="'+f.id+'" value="'+o.value+'" '+((f.kind==='multi'?a.values[f.id].includes(o.value):a.values[f.id]===o.value)?'checked':'')+' '+(a.unsure?'disabled':'')+'><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
 }).join('');}
 function question(){
  const s=current(),t=E.task(s),r=E.record(s,t),a=r.draft,width=Math.max(240,Math.min(620,host.clientWidth-70||520));
  return'<section class="f-question"><p class="f-eyebrow">QUESTION '+(s.index+1)+' OF 15 · '+t.groupName+'</p><h1 id="f-heading">'+t.title+'</h1><p class="f-prompt">'+esc(t.prompt)+'</p>'+G.visual(t,width)+'<form data-f-answer novalidate><div class="f-answer-fields">'+fields(t,a)+'</div><p class="f-note">Numbers can be entered as signed numbers, decimals, or fractions such as −2/3.</p><label class="f-check"><input type="checkbox" data-f-unsure '+(a.unsure?'checked':'')+'> I’m not sure about this question</label><label class="f-field" for="f-explanation">Explain your thinking · required<p id="f-reason-prompt" class="f-reason-prompt">'+esc(t.reason)+'</p><textarea id="f-explanation" data-f-explanation rows="4" maxlength="3000" required aria-describedby="f-reason-prompt">'+esc(a.explanation)+'</textarea></label><label class="f-check"><input type="checkbox" data-f-help '+(a.otherHelp?'checked':'')+'> I used other help on this answer</label><div class="f-actions"><button class="f-primary" type="submit">Save my answer</button>'+button('previous','← Previous',s.index===0?'disabled':'')+button('next',s.index===14?'See my report →':'Next question →',r.status==='submitted'?'':'disabled')+'</div></form></section><details class="f-question-list"><summary>All 15 questions</summary><ol>'+E.tasks(s).map((t,i)=>'<li>'+button('jump',esc(t.title)+(E.last(s,t)?' ✓':''),'data-index="'+i+'"')+'</li>').join('')+'</ol></details>';
 }
 function outcome(o){return o.status==='matched'?'Answer components matched; explanation needs review':o.status==='recheck'?'Answer components need another check':o.status==='unsure'?'Not sure yet; ask a follow-up':'No current submitted answer';}
 function report(){
  const s=current(),m=B.MODULES[selected],obs=E.observations(s);
  const prompts=E.nextChecks(s),scope=E.scopeReview(s);
  const scopeHtml='<details class="f-handoff"><summary>What this check covered, and what it did not</summary><p>'+esc(scope.interpretation)+'</p><h2>Sampled groups</h2><ul>'+scope.groups.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><h2>Not checked in these 15 questions</h2><ul>'+scope.notChecked.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><h2>Where information was supplied</h2><ul>'+scope.suppliedInformation.map(x=>'<li><strong>'+esc(E.tasks(s).find(t=>t.id===x.task).title)+'</strong><p>'+esc(x.note)+'</p></li>').join('')+'</ul></details>';
  return'<section class="f-report"><p class="f-eyebrow">YOUR FOUNDATION REPORT</p><h1 id="f-heading">'+m.title+'</h1><p class="f-lead">Use the answer evidence and your own explanations to plan the next conversation with a tutor.</p><div class="f-actions">'+button('export-md','Download report for an AI tutor','class="f-primary"')+button('export-json','Download full answer history')+'<a href="../reports/" data-f-reports>View saved reports</a>'+button('new','Start a new check')+'</div><p class="f-note">The number and choice components use fixed answer checks. The written reasons below need human or AI-tutor review. A matched component is not a confirmed explanation or mastery score.</p>'+scopeHtml+'<section class="f-next"><h2>Possible next checks</h2>'+(prompts.length?'<ul>'+prompts.map(o=>'<li><strong>'+esc(o.group)+' · '+esc(o.title)+'</strong><p>'+esc(o.followupReasons.join(' '))+'</p><p>'+esc(o.next)+'</p></li>').join('')+'</ul>':'<p>No specific follow-up was selected from the fixed checks, reported support, or saved local reviews. Written reasons may still need review. New tasks are needed for topics and independent use not checked here.</p>')+'<p>These are reasons to collect more evidence, not confirmed knowledge gaps. Ask your tutor to read the original explanations before choosing the next lesson.</p></section><details class="f-handoff"><summary>Use this report with another AI tutor</summary><p>'+esc(root.ClueveraReportStore?.HANDOFF||'Read the actual answers and explanations, ask a follow-up when unclear, and teach one next idea.')+'</p><label class="f-field">Readable report<textarea readonly rows="8">'+esc(E.markdown(s))+'</textarea></label></details><div class="f-evidence">'+E.tasks(s).map((t,i)=>{
   const r=s.records[t.id],a=E.last(s,t),o=obs[i],review=E.latestReview(s,t);
   return'<article><p class="f-eyebrow">'+esc(t.groupName)+'</p><h2>'+esc(t.title)+'</h2><p class="f-result">'+outcome(o)+'</p><p>'+esc(t.prompt)+'</p><pre class="f-answer-text">'+esc(a.answer.unsure?'Student selected “I’m not sure”.\n'+E.answerText(t,a.answer):E.answerText(t,a.answer))+'</pre><h3>Your explanation</h3><div class="f-quote">'+esc(a.answer.explanation)+'</div><p class="f-note">'+r.submissions.length+' saved attempt(s) · '+(a.answer.otherHelp?'other help reported':'no other help reported')+(a.feedbackSeen?' · earlier report viewed':'')+'</p><details><summary>Reference mathematics and earlier attempts</summary><p>'+esc(t.solution)+'</p>'+r.submissions.map((x,j)=>'<div class="f-attempt"><h3>Attempt '+(j+1)+' · '+x.objective.state+'</h3><pre>'+esc(E.answerText(t,x.answer))+'</pre><p>'+esc(x.answer.explanation)+'</p></div>').join('')+'</details><details><summary>Local explanation review</summary><p>0: reason needs revision. 1: a relevant part is explained. 2: the key connection is explained. Leave it open when uncertain. This is a local review, not an automatic grade.</p>'+ (review?'<p>Saved review: '+(review.points===null?'Open':review.points+'/2')+' · '+esc(review.note)+'</p>':'<p>No review has been recorded.</p>')+'<form data-f-review="'+t.id+'"><label class="f-field">Reason review<select name="points"><option value="">Leave open</option>'+[0,1,2].map(n=>'<option value="'+n+'" '+(review?.points===n?'selected':'')+'>'+n+'/2</option>').join('')+'</select></label><label class="f-field">Review note · required<textarea name="note" rows="2" maxlength="2000">'+esc(review?.note||'')+'</textarea></label><button type="submit">Save local review</button></form></details>'+button('jump','Revise this answer','data-index="'+i+'"')+'</article>';
  }).join('')+'</div></section>'+history();
 }
 function archive(){if(current().view!=='report'||!E.done(current()))return;const result=root.ClueveraReportStore?.save(selected,E.portable(current()),current().id,storage);if(result&&!result.ok)notice=result.error||'This report could not be kept in this browser. Download a copy.';}
 function render(focus=false){
  if(blocked){host.innerHTML='<section class="f-intro"><h1>Keep your saved check safe.</h1><p>The existing check could not be read and has been kept unchanged.</p><div class="f-actions">'+button('raw','Download the saved data')+button('replace','Replace with a fresh portfolio')+'</div><dialog id="f-recovery-dialog"><h2>Replace the saved checks?</h2><p>Download the original data first if you want to keep it. This replaces the foundation-check portfolio only.</p>'+button('cancel-replace','Keep the original')+button('confirm-replace','Replace it')+'</dialog></section>';return;}
  const s=current();archive();host.innerHTML=nav()+status()+(s.view==='intro'?intro():s.view==='task'?question():report());save();
  if(focus){const heading=host.querySelector('#f-heading');heading?.setAttribute('tabindex','-1');heading?.focus();}
 }
 function openReport(){const s=current();if(!E.done(s)){notice='Save an answer and explanation for all 15 questions before opening the report.';render();return;}s.view='report';if(!s.events.some(e=>e.type==='report_opened'))s.events.push({type:'report_opened',at:new Date().toISOString()});notice='';render(true);}
 host.addEventListener('input',event=>{
  if(blocked)return;const target=event.target,s=current();
  if(s.view!=='task')return;const t=E.task(s),r=E.record(s,t),a=JSON.parse(JSON.stringify(r.draft));
  if(target.hasAttribute('data-f-field')){const f=t.fields.find(f=>f.id===target.dataset.fField);if(!f)return;if(f.kind==='multi')a.values[f.id]=target.checked?[...new Set([...a.values[f.id],target.value])]:a.values[f.id].filter(v=>v!==target.value);else a.values[f.id]=target.value;}
  else if(target.hasAttribute('data-f-explanation'))a.explanation=target.value;
  else if(target.hasAttribute('data-f-unsure'))a.unsure=target.checked;
  else if(target.hasAttribute('data-f-help'))a.otherHelp=target.checked;
  else return;
  E.edit(s,t,a);save();const next=host.querySelector('[data-f-action="next"]');if(next)next.disabled=true;
  const reportButton=host.querySelector('[data-f-action="report"]');if(reportButton)reportButton.disabled=true;
  if(target.hasAttribute('data-f-unsure'))render();
 });
 host.addEventListener('change',event=>{if(event.target.hasAttribute('data-f-subject')&&B.MODULES[event.target.value]){selected=event.target.value;notice='';render(true);}});
 host.addEventListener('submit',event=>{
  const form=event.target.closest('form');if(!form||blocked)return;event.preventDefault();const s=current();
  if(form.hasAttribute('data-f-answer')){const result=E.submit(s,E.task(s));notice=result.ok?'Answer and explanation saved. Continue when you are ready.':result.error;render();}
  else if(form.hasAttribute('data-f-review')){const t=E.tasks(s).find(t=>t.id===form.dataset.fReview),value=form.querySelector('[name="points"]').value,note=form.querySelector('[name="note"]').value;notice=E.review(s,t,value===''?null:Number(value),note)?'Local review saved with this attempt.':'Add a review note and choose a valid review value.';render();}
 });
 host.addEventListener('click',event=>{
  const home=event.target.closest('[data-f-home]');if(home&&options.onHome){event.preventDefault();options.onHome();return;}
  if(event.target.closest('[data-f-course]')&&options.onCourse){event.preventDefault();options.onCourse(selected);return;}
  if(event.target.closest('[data-f-reports]')&&options.onReports){event.preventDefault();options.onReports();return;}
  const b=event.target.closest('[data-f-action]');if(!b||b.disabled)return;const action=b.dataset.fAction;
  if(action==='raw'){download(raw,'application/json','Cluevera_Foundation_Original_Data.json');return;}
  if(action==='replace'){host.querySelector('#f-recovery-dialog').showModal();return;}
  if(action==='cancel-replace'){host.querySelector('#f-recovery-dialog').close();return;}
  if(action==='confirm-replace'){portfolio=E.fresh();blocked=false;raw='';notice='A new foundation portfolio is open.';render();return;}
  if(blocked)return;const s=current();
  if(action==='intro')s.view='intro';
  else if(action==='resume')s.view='task';
  else if(action==='new'){E.createSession(portfolio,selected);notice='Earlier checks have been kept.';}
  else if(action==='history'){portfolio.modules[selected].active=b.dataset.session;notice='';}
  else if(action==='jump'){const index=Number(b.dataset.index);if(!Number.isInteger(index)||index<0||index>=15)return;s.index=index;s.view='task';notice='';}
  else if(action==='previous'){s.index=Math.max(0,s.index-1);notice='';}
  else if(action==='next'){if(!E.last(s,E.task(s)))return;if(s.index===14){openReport();return;}s.index++;notice='';}
  else if(action==='report'){openReport();return;}
  else if(action==='export-md'){download(E.markdown(s),'text/markdown','Cluevera_'+selected+'_Foundation_Report.md');return;}
  else if(action==='export-json'){download(JSON.stringify(E.portable(s),null,2),'application/json','Cluevera_'+selected+'_Foundation_History.json');return;}
  render(true);
 });
 render();return{render,portfolio:()=>JSON.parse(JSON.stringify(portfolio)),current,select:module=>{if(B.MODULES[module]){selected=module;render();}}};
}
root.ClueveraFoundationApp={mount};
})(window);
