'use strict';
const C=NTCore,X=CrossCore,storage={getItem:k=>(window.QuidenceStorage||window.localStorage).getItem(k),setItem:(k,v)=>(window.QuidenceStorage||window.localStorage).setItem(k,v),removeItem:k=>(window.QuidenceStorage||window.localStorage).removeItem(k)},KEY='quidence:cross-disciplinary:v1';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let projects=[],state={version:1,project:'cross-p01',steps:{},answers:{},checks:{},attempts:[]},saveTimer,toastTimer,storeAvailable=true,blockedOriginal=null,lastStored=null,saveBlocked=false,blockedReason='unreadable',unsavedWork=false;
function current(){return projects.find(p=>p.id===state.project)||projects[0];}
function stepIndex(){return Math.min(current().steps.length-1,Math.max(0,Number(state.steps[current().id])||0));}
function key(p,step,f){return `${p.id}:${step}:${f.id}`;}
function valueOf(p,step,f){return state.answers[key(p,step,f)]??'';}
function displayAnswer(f,v){return f.type==='choice'?(f.options.find(o=>o.value===v)?.label||v):v;}
function answered(p){return p.steps.filter((st,i)=>st.fields.every(f=>C.filled(f,valueOf(p,i,f)))).length;}
function paragraphs(text,math=false){return String(text).split(/\n\s*\n/).filter(Boolean).map(t=>`<p${math&&t.length<150&&/[=≡]/.test(t)&&!/[.!?]$/.test(t)?' class="math-line"':''}>${esc(t)}</p>`).join('');}
function course(id){return window.QuidenceCourseCatalog?.COURSES?.[id];}
// Each subject a step uses links to its course, so a learner can look up what the step borrows.
function chips(ids,label){return `<p class="x-connects"><span class="x-connects-label">${esc(label)}</span>${ids.map(id=>course(id)?`<a class="x-chip" data-course="${id}" href="../${course(id).course}">${esc(course(id).title)}</a>`:'').join('')}</p>`;}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function blockedMessage(){return blockedReason==='conflict'?'Saved work changed in another tab. Export your current notes before reloading; new edits are not saved.':'The saved original is unreadable. Export your current notes and the saved original before resetting; new edits are not saved.';}
function persist(){clearTimeout(saveTimer);if(saveBlocked){$('save-status').textContent=blockedMessage();return;}try{const live=storage.getItem(KEY);if(live!==lastStored){blockedOriginal=live;lastStored=live;saveBlocked=true;blockedReason='conflict';$('save-status').textContent=blockedMessage();return;}const serialized=JSON.stringify(state);storage.setItem(KEY,serialized);lastStored=serialized;storeAvailable=true;unsavedWork=false;$('save-status').textContent='Draft saved on this device.';}catch{storeAvailable=false;$('save-status').textContent='Could not save locally. Export your session to keep a copy.';}}
function queueSave(){unsavedWork=true;clearTimeout(saveTimer);saveTimer=setTimeout(persist,180);}
function restore(){
  try{const raw=storage.getItem(KEY);lastStored=raw;if(raw===null)return;blockedOriginal=raw;saveBlocked=true;const d=JSON.parse(raw);if(!d||d.version!==1||!d.answers||!d.steps||!d.checks||!Array.isArray(d.attempts))throw Error('Unreadable record');
    const p=projects.find(p=>p.id===d.project);if(p)state.project=p.id;
    for(const p of projects){const i=d.steps?.[p.id];if(Number.isInteger(i)&&i>=0&&i<p.steps.length)state.steps[p.id]=i;
      p.steps.forEach((s,i)=>s.fields.forEach(f=>{const k=key(p,i,f),a=d.answers?.[k];if(typeof a==='string')state.answers[k]=a.slice(0,f.type==='reason'?24000:80);
        const ck=d.checks?.[k];if(ck&&typeof ck.status==='string'&&typeof ck.text==='string'&&['empty','pending','correct','retry','format'].includes(ck.status))state.checks[k]=ck;
      }));
    }
    state.attempts=d.attempts.filter(a=>a&&typeof a.project==='string'&&Number.isInteger(a.step)&&typeof a.time==='string'&&Array.isArray(a.results));blockedOriginal=null;saveBlocked=false;
  }catch{$('save-status').textContent=blockedMessage();}
}
function progressText(p){return `${answered(p)}/${p.steps.length} steps with responses`;}
function renderRoute(){
  $('route').innerHTML=projects.map((p,i)=>`<button class="x-project" data-project="${p.id}" aria-current="${p.id===current().id}"><span class="route-number">${String(i+1).padStart(2,'0')}</span><span class="x-project-copy"><span class="route-name">${esc(p.name)}</span><span class="x-project-subjects">${p.subjects.map(id=>`<span>${esc(course(id)?.title||id)}</span>`).join('')}</span><span class="route-sub" data-progress="${p.id}">${esc(progressText(p))}</span></span></button>`).join('');
}
function updateProgress(){
  for(const p of projects){const el=document.querySelector(`[data-progress="${p.id}"]`);if(el)el.textContent=progressText(p);}
  const p=current(),n=answered(p);if($('progress-copy'))$('progress-copy').textContent=`${n} of ${p.steps.length} steps have responses`;
  if($('progress-fill'))$('progress-fill').style.width=`${100*n/p.steps.length}%`;
  p.steps.forEach((s,i)=>{const b=document.querySelector(`[data-step="${i}"]`);if(b)b.classList.toggle('done',s.fields.every(f=>C.filled(f,valueOf(p,i,f))));});
}
function renderProject(){
  const p=current(),idx=stepIndex();
  document.querySelectorAll('[data-project]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.project===p.id)));
  $('project-head').innerHTML=`<div class="project-meta"><span class="badge">${esc(p.level)}</span><span class="badge gray">${p.steps.length} steps</span><span class="badge gray">${esc(p.difficulty)}</span></div><h2>${esc(p.title)}</h2><p class="x-topic">${esc(p.topic)}</p><p>${esc(p.prompt)}</p>${chips(p.subjects,'Subjects in this project')}<div class="project-progress"><span class="track"><i id="progress-fill" style="width:${100*answered(p)/p.steps.length}%"></i></span><span id="progress-copy">${answered(p)} of ${p.steps.length} steps have responses</span></div>`;
  $('step-nav').innerHTML=p.steps.map((s,i)=>`<button class="step-tab ${s.fields.every(f=>C.filled(f,valueOf(p,i,f)))?'done':''}" data-step="${i}" aria-current="${idx===i?'step':'false'}" aria-label="Step ${i+1}">${idx===i?'<small>Step</small> ':''}${i+1}</button>`).join('');
  $('approach-copy').innerHTML=paragraphs(p.approach);$('uses').textContent=p.uses;$('approach').open=false;
  renderWork();renderLab();
}
function fieldHtml(f,p,idx){
  const val=valueOf(p,idx,f),k=key(p,idx,f),id=`f-${f.id}`,feedback=state.checks[k];
  const fb=`<div class="feedback ${feedback?.status||''}" id="feedback-${f.id}" aria-live="polite">${esc(feedback?.text||'')}</div>`;
  if(f.type==='number')return `<div class="field"><label for="${id}">${esc(f.label)}</label><input id="${id}" type="text" inputmode="text" maxlength="80" autocomplete="off" data-field="${f.id}" value="${esc(val)}" placeholder="Your answer" aria-describedby="feedback-${f.id}">${fb}</div>`;
  if(f.type==='reason')return `<div class="field wide"><label for="${id}">${esc(f.label)}</label><textarea data-speech-explanation id="${id}" data-field="${f.id}" maxlength="24000" placeholder="State your claim. Explain each step. Say where the conditions matter." aria-describedby="feedback-${f.id}">${esc(val)}</textarea><p class="field-note">Your explanation is saved for review. It is not automatically marked correct.</p>${fb}</div>`;
  return `<fieldset class="field wide"><legend>${esc(f.label)}</legend><div class="answer-options">${C.orderedOptions(f,key(p,idx,f)).map((o,i)=>`<label class="option" for="${id}-${i}"><input id="${id}-${i}" type="radio" name="${id}" data-field="${f.id}" value="${esc(o.value)}" ${val===o.value?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>${fb}</fieldset>`;
}
function renderWork(){
  const p=current(),idx=stepIndex(),s=p.steps[idx],card=$('lab-card');
  // The lab card may sit inside the step; keep it out of the way while the step is rebuilt.
  if(card&&$('work').contains(card))$('side').prepend(card);
  const criteria=s.fields.filter(f=>f.type==='reason').map(f=>`<div class="criteria-card"><h4>${esc(f.label)} · Self-check</h4><ul>${f.criteria.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>${f.followup?`<p style="margin-top:12px">One more question: ${esc(f.followup)}</p>`:''}</div>`).join('');
  $('work').innerHTML=`<div class="step-kicker"><span>STEP ${idx+1} OF ${p.steps.length}</span><span>${s.fields.some(f=>f.type==='reason')?'Explain your reasoning':'Start with a concrete case'}</span></div><h3>${esc(s.title)}</h3>${chips(s.connects,'This step uses')}<p class="step-prompt">${esc(s.prompt)}</p><div class="math-banner" data-no-translate>${esc(s.banner)}</div><div id="lab-slot" class="x-lab-slot"></div><div class="fields">${s.fields.map(f=>fieldHtml(f,p,idx)).join('')}</div><p class="check-note" id="check-summary" role="status">Calculations and choices can be checked. Proofs stay open for review.</p><div class="action-row"><button class="primary" id="check">Check this step</button><div class="action-right"><button class="quiet" id="prev" ${idx===0?'disabled':''}>← Back</button><button id="next">${idx===p.steps.length-1?'Project notes ↗':'Next step →'}</button></div></div><details class="proof-panel" id="proof"><summary>See the full proof</summary><div class="proof-content"><p class="proof-label">REFERENCE PROOF · STEP ${idx+1}</p>${paragraphs(s.proof,true)}${criteria}${idx===p.steps.length-1?`<div class="next-challenge"><span>TAKE THE IDEA ONE STEP FURTHER</span>${esc(p.nextCheck)}</div>`:''}</div></details>`;
  placeLab();
}
// On narrow screens the lab sits in the step, right after the question that refers to it.
const narrow=matchMedia('(max-width: 1000px)');
function placeLab(){const card=$('lab-card'),slot=$('lab-slot');if(!card)return;if(narrow.matches&&slot){if(card.parentElement!==slot)slot.append(card);}else if(card.parentElement!==$('side'))$('side').prepend(card);}
narrow.addEventListener?.('change',placeLab);
function selectProject(id){if(!projects.some(p=>p.id===id))return;state.project=id;persist();renderProject();try{const u=new URL(location.href);u.searchParams.set('project',id);history.replaceState(history.state,'',u);}catch{}}
function moveStep(i){const p=current();if(i<0||i>=p.steps.length)return;state.steps[p.id]=i;persist();renderProject();$('work').scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});}
function recordInput(el){
  const p=current(),i=stepIndex(),s=p.steps[i],f=s.fields.find(f=>f.id===el.dataset.field);if(!f)return;
  state.answers[key(p,i,f)]=el.value;delete state.checks[key(p,i,f)];const fb=$('feedback-'+f.id);fb.textContent='';fb.className='feedback';$('check-summary').textContent='Response updated. Check this step when you are ready.';updateProgress();queueSave();
}
function checkStep(){
  const p=current(),i=stepIndex(),s=p.steps[i];let good=0,objective=0,pending=0,empty=0;
  const results=s.fields.map(f=>{const val=valueOf(p,i,f),g=C.grade(f,val);state.checks[key(p,i,f)]=g;const el=$('feedback-'+f.id);el.textContent=g.text;el.className='feedback '+g.status;if(g.status==='empty')empty++;if(f.type!=='reason'){objective++;if(g.status==='correct')good++;}else if(g.status==='pending')pending++;return {field:f.id,value:val,status:g.status};});
  state.attempts.push({project:p.id,step:i,time:new Date().toISOString(),results});persist();
  $('check-summary').textContent=[objective?`${good} of ${objective} calculations or choices match.`:'',pending?`${pending} explanation${pending===1?'':'s'} saved for review.`:'',empty?`${empty} response${empty===1?'':'s'} still open.`:''].filter(Boolean).join(' ');
  if(!empty)document.querySelector(`[data-step="${i}"]`).classList.add('done');
}
function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;$('modal').showModal();}
function totals(){let objective=0,correct=0,pending=0,responses=0;for(const p of projects)p.steps.forEach((s,i)=>s.fields.forEach(f=>{const k=key(p,i,f),v=valueOf(p,i,f);if(C.filled(f,v)){responses++;if(f.type==='reason')pending++;else objective++;}if(f.type!=='reason'&&state.checks[k]?.status==='correct')correct++;}));return {objective,correct,pending,responses};}
function showSession(projectOnly=false){
  const t=totals(),ps=projectOnly?[current()]:projects;let entries='';
  for(const p of ps)p.steps.forEach((s,i)=>{const rows=s.fields.filter(f=>C.filled(f,valueOf(p,i,f))).map(f=>{const k=key(p,i,f),v=valueOf(p,i,f),g=state.checks[k];const st=f.type==='reason'?'Pending proof review':g?.status==='correct'?'Checked calculation / choice':g?.status==='retry'||g?.status==='format'?'Revisit this response':'Draft response';return `<div class="session-item"><span class="session-state ${f.type==='reason'?'pending':g?.status==='retry'?'retry':''}">${st}</span><h3>${esc(f.label)}</h3><p ${['reason','number'].includes(f.type)?'data-no-translate class="student-work"':'class="session-choice"'}>${esc(displayAnswer(f,v))}</p></div>`;});if(rows.length)entries+=`<h3 style="margin-top:23px;font-weight:550">${esc(p.name)} · Step ${i+1}</h3>${rows.join('')}`;});
  showModal(projectOnly?'Your project notes':'Your cross-disciplinary session',`<p>This is a record of your actual responses. Matching a calculation does not establish mastery, and explanations remain pending review.</p><div class="summary-stats"><div><span>${t.responses}</span>Responses saved</div><div><span>${t.correct}</span>Calculations / choices matched</div><div><span>${t.pending}</span>Explanations to review</div></div>${entries||'<p>No responses yet. Try a step, then return here to see your work.</p>'}<div class="modal-actions"><button class="primary" id="export">Export session notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button id="reset-open">Reset cross-disciplinary projects</button></div>`);
}
function sessionMarkdown(){
  const t=s=>window.QuidenceI18n?.text(s)||s;
  const status=s=>t(({correct:'Checked calculation / choice',pending:'Pending proof review',retry:'Revisit this response',format:'Check the response format',empty:'No response yet',Draft:'Draft response'})[s]||'Draft response');
  const response=(f,v)=>f.type==='choice'?t(displayAnswer(f,v)):v;
  let text='# Quidence · '+t('Cross-disciplinary Projects')+'\n\n'+t('Responses and reasoning from this browser. Proofs are pending review; numerical matches are not mastery judgments.')+'\n';
  if(saveBlocked||!storeAvailable)text+='\n'+t('These notes include current work that could not be saved in this browser. The previously saved record is kept separately.')+'\n';
  for(const p of projects){let body='';p.steps.forEach((s,i)=>{for(const f of s.fields){const v=valueOf(p,i,f);if(C.filled(f,v)){const g=state.checks[key(p,i,f)];body+=`\n### ${t('Step')} ${i+1} · ${t(s.title)}\n\n${t(f.label)}\n\n${response(f,v)}\n\n${t('Response status')}: ${status(f.type==='reason'?'pending':g?.status||'Draft')}\n`;}}});if(body)text+=`\n## ${t(p.title)}\n${body}`;}
  if(state.attempts.length){text+='\n## '+t('Check history')+'\n\n'+t('Each check preserves the responses supplied at that time.')+'\n';for(const a of state.attempts){const p=projects.find(p=>p.id===a.project);if(!p||!p.steps[a.step])continue;text+=`\n### ${a.time} · ${t(p.title)} · ${t('Step')} ${a.step+1}\n`;for(const r of a.results){const f=p.steps[a.step].fields.find(f=>f.id===r.field);if(f&&C.filled(f,r.value))text+=`\n${t(f.label)}\n\n${response(f,r.value)}\n\n${t('Response status')}: ${status(r.status)}\n`;}}}
  return text;
}
function downloadNotes(text,name,type){try{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;}catch{toast('The download could not start. Your current notes are still visible.');return false;}}
function exportSession(){persist();if(downloadNotes(sessionMarkdown(),'Quidence-cross-disciplinary-session.md','text/markdown;charset=utf-8'))toast('Your current session notes have been exported.');}
function exportOriginal(){if(blockedOriginal===null)return;let json=true;try{JSON.parse(blockedOriginal);}catch{json=false;}if(downloadNotes(blockedOriginal,'Quidence-cross-disciplinary-saved-original.'+(json?'json':'txt'),json?'application/json':'text/plain;charset=utf-8'))toast('The previously saved original has been exported separately.');}

/* ---------- Animation ----------
   Animations change only SVG attributes and class names; text changes happen a few times per animation,
   so the page's translation pass does not run on every frame. With reduced motion, each animation jumps to its end. */
function reduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
const ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
let run=null;
function animate(duration,frame){
  const token=run;
  return new Promise(resolve=>{
    if(!token||token.cancel)return resolve(false);
    if(reduced()||token.skip){frame(1);return resolve(true);}
    const start=performance.now();
    const tick=now=>{if(token.cancel)return resolve(false);const t=token.skip?1:Math.min(1,(now-start)/duration);frame(ease(t));if(t<1)requestAnimationFrame(tick);else resolve(true);};
    requestAnimationFrame(tick);
  });
}
// A pause is not motion, so it keeps its length with reduced motion too; skipping or stopping ends it at once.
function pause(ms){
  const token=run;
  return new Promise(resolve=>{
    if(!token||token.cancel||token.skip)return resolve(!token?.cancel);
    const timer=setTimeout(()=>{token.waits.delete(wake);resolve(!token.cancel);},ms),wake=()=>{clearTimeout(timer);resolve(!token.cancel);};
    (token.waits??=new Set()).add(wake);
  });
}
function wakeAll(token){for(const wake of token?.waits||[])wake();token?.waits?.clear();}
function skip(){if(run){run.skip=true;wakeAll(run);}}
function setBusy(on){const b=$('lab-skip'),had=b&&document.activeElement===b;if(b)b.hidden=!on;$('lab')?.classList.toggle('x-busy',on);if(had&&!on)restoreFocus('');}
function stop(){if(run){run.cancel=true;wakeAll(run);}run=null;setBusy(false);}
// Runs one animation; another lab action first finishes the running one at its end state.
async function play(sequence){
  if(run){const done=run.done;skip();await done;}
  const token={cancel:false,skip:false};run=token;setBusy(true);
  token.done=(async()=>{try{await sequence(token);}finally{if(run===token){run=null;setBusy(false);}}})();
  return token.done;
}
function attr(el,values){if(el)for(const [k,v]of Object.entries(values))el.setAttribute(k,v);}
const q=id=>document.getElementById(id);

/* ---------- Drawing helpers ---------- */
const COLORS=['#badccc','#f4d49d','#cfc6ee','#9bc5c8','#f3c9b8','#d9e7b4','#f1b9c9','#bcd3ee','#e8d3a9','#c4e0d8','#e3c6e8'];
const HOT='#f2a65a',CUT='#c2553d',INK='#2f5d62';
function colorFor(address){let h=0;for(const s of address)h=h*2+(s==='+'?1:0);return COLORS[(h*7+address.length*3)%COLORS.length];}
const pt=([x,y])=>x.toFixed(1)+','+y.toFixed(1);
// Pizzas are drawn in a 420-wide picture; their pictures are cropped to the pizza so that labels stay readable on phones.
const PIZZA_BOX='76 12 268 256';
function svg(body,label,h=280,box=null){return `<svg class="lab-svg x-svg" viewBox="${box||'0 0 420 '+h}" role="img" aria-label="${esc(label)}">${body}</svg>`;}
function button(action,label,{disabled=false,pressed=null,primary=false}={}){return `<button type="button" data-lab="${action}"${disabled?' disabled':''}${pressed===null?'':` aria-pressed="${pressed}"`}${primary?' class="x-lab-main"':''}>${esc(label)}</button>`;}
function readouts(rows){return `<dl class="x-readouts" style="--cols:${rows.length===4?2:rows.length}">${rows.map(([label,value,id])=>`<div><dt>${esc(label)}</dt><dd${id?` id="${id}"`:''}>${esc(value)}</dd></div>`).join('')}</dl>`;}
function views(list,active){return `<div class="x-views" role="group" aria-label="Views">${list.map(([id,label])=>button('view-'+id,label,{pressed:id===active})).join('')}</div>`;}
// The status line stays in the page (index.html), so screen readers announce each change in one live region.
// A rebuilt lab returns keyboard focus to the control that had it, or to the lab's main button.
function labShell({title,views:v='',picture,legend='',rows,status,caption,buttons}){
  const active=document.activeElement,key=active&&$('lab').contains(active)?(active.dataset.lab||active.id):null;
  $('lab-title').textContent=title;
  $('lab-body').innerHTML=`${v}<div class="x-picture"><div class="x-art">${picture}</div><button type="button" id="lab-skip" class="x-skip" hidden>Skip animation</button></div>${legend}${rows?readouts(rows):''}`;
  say(status);
  $('lab-controls').innerHTML=`<p class="lab-caption">${esc(caption)}</p><div class="lab-buttons">${buttons}</div>`;
  setBusy(!!run);
  if(key!==null)restoreFocus(key);
}
function restoreFocus(key){
  const usable=el=>el&&!el.disabled&&!el.hidden&&el.getClientRects().length>0;
  let el=key==='lab-skip'?$('lab-skip'):key?document.querySelector(`#lab [data-lab="${key}"]`):null;
  if(!usable(el))el=document.querySelector('#lab .x-lab-main');if(!usable(el))el=[...document.querySelectorAll('#lab .lab-buttons button')].find(usable);if(!usable(el))el=[...document.querySelectorAll('#lab button')].find(usable);
  el?.focus({preventScroll:true});
}
// Updates a lab without rebuilding its controls, so a slider keeps working while it is dragged.
function patch({picture,rows,status,equation}){const box=document.querySelector('#lab .x-art');if(picture!==undefined&&box)box.innerHTML=picture;const dl=document.querySelector('#lab .x-readouts');if(rows&&dl)dl.outerHTML=readouts(rows);if(status!==undefined)say(status);const eq=document.querySelector('#lab .lab-equation');if(equation!==undefined&&eq)eq.textContent=equation;}
function rangeOutput(text){const out=document.querySelector('#lab .x-range output'),input=document.querySelector('#lab .x-range input');if(out)out.textContent=text;input?.setAttribute('aria-valuetext',text);}
// The live region is rewritten only when its message changes, so screen readers do not hear it twice.
function say(text){const el=$('lab-status');if(el&&el.dataset.source!==text){el.dataset.source=text;el.textContent=text;}}
function setText(id,value){const el=$(id);if(el&&el.textContent!==String(value))el.textContent=value;}
// A piece of a pizza or a face is a polygon; the map turns unit-disc coordinates into picture coordinates.
const discMap=(cx,cy,r)=>([x,y])=>[cx+r*x,cy-r*y];
function polygon(poly,map,attrs){return `<polygon points="${poly.map(p=>pt(map(p))).join(' ')}" ${attrs}/>`;}
function chordEnds(l,r=1){const c=X.chord(l,r);return [c.at(-c.half),c.at(c.half)];}
function lineTag(l,map,attrs,r=1){const [a,b]=chordEnds(l,r).map(map);return `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" ${attrs}/>`;}
// Crossings in the order the cuts make them: all of cut 2's, then cut 3's new ones, and so on.
function crossingPoints(lines){const out=[];for(let j=1;j<lines.length;j++)for(let i=0;i<j;i++){const a=lines[i],b=lines[j],det=a.n[0]*b.n[1]-a.n[1]*b.n[0];if(Math.abs(det)<1e-12)continue;const p=[(a.d*b.n[1]-b.d*a.n[1])/det,(a.n[0]*b.d-b.n[0]*a.d)/det];if(Math.hypot(...p)<1-1e-7&&!out.some(o=>Math.hypot(o[0]-p[0],o[1]-p[1])<1e-6))out.push(p);}return out;}
// The point of a convex polygon farthest from its edges, where a label has the most room.
function innerPoint(poly){
  const xs=poly.map(p=>p[0]),ys=poly.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;let best=centroid(poly),room=-1;
  const edge=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;return ((p[0]-a[0])*dy-(p[1]-a[1])*dx)/len;};
  const sign=Math.sign(poly.reduce((s,p,i)=>{const q2=poly[(i+1)%poly.length];return s+p[0]*q2[1]-q2[0]*p[1];},0))||1;
  for(let i=1;i<40;i++)for(let j=1;j<40;j++){const p=[x0+w*i/40,y0+h*j/40];let d=Infinity;for(let k=0;k<poly.length;k++)d=Math.min(d,-sign*edge(p,poly[k],poly[(k+1)%poly.length]));if(d>room){room=d;best=p;}}
  return best;
}
const centroid=poly=>{let a=0,x=0,y=0;poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],c=p[0]*q[1]-q[0]*p[1];a+=c;x+=(p[0]+q[0])*c;y+=(p[1]+q[1])*c;});return Math.abs(a)<1e-12?poly[0]:[x/(3*a),y/(3*a)];};
const bubble=(id,[x,y],text,cls='x-plus')=>`<text id="${id}" class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" opacity="0">${text}</text>`;
async function pop(id,token){const el=q(id);if(!el)return;const y=Number(el.getAttribute('y'));await animate(260,t=>attr(el,{opacity:t,y:y-6*t}));if(token.cancel)return;}

/* ---------- The labs, one per step ---------- */
const labState={};
function lab(){const key=current().id+':'+stepIndex();return labState[key]||(labState[key]={});}
const LABS={'cross-p01':[stickLab,pizzaLab,formulaLab,ballLab,trapLab,patternLab],'cross-p02':[circleLab,chordLab,fourLab,tableLab,pairLab,differenceLab]};
function labFor(){return LABS[current().id]?.[stepIndex()];}
function renderLab(){stop();labFor()?.(lab());}
function labAction(action,value){labFor()?.(lab(),action,value);}

// Step 1. A stick cut at points; each new cut lands inside one piece.
const STICK=[.5,.25,.75,.12,.62,.38,.88,.2,.69,.44],SX=30,SW=360,SY=118,SH=26,GAP=7;
function stickPieces(n){const cuts=STICK.slice(0,n).map((c,i)=>({c,i})).sort((a,b)=>a.c-b.c);const out=[];let left={c:0,i:-1};for(const cut of [...cuts,{c:1,i:null}]){out.push({a:left.c,b:cut.c,color:COLORS[(left.i+1)%COLORS.length]});left=cut;}return out;}
function stickRect(p,gaps={}){const g=c=>c<=0||c>=1?0:(gaps[c]??GAP)/2,x0=SX+p.a*SW+g(p.a),x1=SX+p.b*SW-g(p.b);return {x:x0.toFixed(1),width:Math.max(0,x1-x0).toFixed(1)};}
const KNIFE='<path d="M0 0L-6-14V-52H6V-7Z" fill="#e3e9ec" stroke="#5b6b74" stroke-width="1.4"/><rect x="-5" y="-82" width="10" height="31" rx="4" fill="#8a5a3b"/>';
function stickLab(l,action){
  l.n??=0;
  const draw=()=>{const pieces=stickPieces(l.n);
    const body=`<rect x="${SX-6}" y="${SY+SH/2+20}" width="${SW+12}" height="3" rx="1.5" fill="#dfe8e4"/>${pieces.map((p,i)=>{const r=stickRect(p);return `<rect id="st-${i}" x="${r.x}" y="${SY-SH/2}" width="${r.width}" height="${SH}" rx="8" fill="${p.color}" stroke="#5f8f86" stroke-width="1.2"/>`;}).join('')}${STICK.slice(0,l.n).map((c,i)=>`<text x="${(SX+c*SW).toFixed(1)}" y="${SY+SH/2+42}" text-anchor="middle" class="x-small">${i+1}</text>`).join('')}<g id="st-knife" transform="translate(-60 0)" opacity="0">${KNIFE}</g>${bubble('st-plus',[SX+SW/2,SY-SH/2-14],'+1')}${bubble('st-zero',[SX+SW/2,SY-SH/2-14],'+0','x-plus x-zero')}`;
    labShell({title:'Cut the stick',picture:svg(body,`Stick picture. Cuts: ${l.n}. Pieces: ${l.n+1}.`,190),
      rows:[['Cuts',l.n,'st-cuts'],['Pieces',l.n+1,'st-pieces']],
      status:l.message||(l.n?`Cuts: ${l.n}. Pieces: ${l.n+1}.`:'No cuts yet: the stick is 1 piece.'),
      caption:'The numbers under the stick show the order of the cuts. Watch which piece lights up when the knife comes down.',
      buttons:button('stick-next','Make the next cut',{disabled:l.n>=STICK.length,primary:true})+button('stick-repeat','Cut on an earlier cut',{disabled:l.n===0})+button('stick-reset','Start over',{disabled:l.n===0})});
  };
  if(!action){draw();return;}
  if(action==='stick-reset'){stop();l.n=0;l.message='';draw();return;}
  if(action==='stick-next'&&l.n<STICK.length)play(async token=>{
    const c=STICK[l.n],before=stickPieces(l.n),target=before.findIndex(p=>p.a<c&&c<p.b);l.message='';draw();
    const knife=q('st-knife'),x=(SX+c*SW).toFixed(1);attr(q('st-'+target),{stroke:HOT,'stroke-width':3});
    await animate(650,t=>attr(knife,{transform:`translate(${x} ${(SY-SH/2-56+(SH+68)*t).toFixed(1)})`,opacity:Math.min(1,t*3)}));if(token.cancel)return;
    l.n++;const after=stickPieces(l.n);draw();const k2=q('st-knife');attr(k2,{transform:`translate(${x} ${SY+SH/2+12})`,opacity:1});
    const left=after.findIndex(p=>p.b===c),right=left+1;[left,right].forEach(i=>attr(q('st-'+i),{stroke:HOT,'stroke-width':3,...stickRect(after[i],{[c]:0})}));
    await Promise.all([animate(420,t=>{for(const i of [left,right])attr(q('st-'+i),stickRect(after[i],{[c]:GAP*t}));}),(async()=>{const p=q('st-plus');attr(p,{x:(Number(x)+20).toFixed(1)});await pop('st-plus',token);})()]);if(token.cancel)return;
    await animate(380,t=>attr(k2,{opacity:1-t}));if(token.cancel)return;
    l.message=`Cut ${l.n} landed inside one piece and split it in two: ${l.n+1} pieces.`;draw();
  });
  if(action==='stick-repeat'&&l.n>0)play(async token=>{
    l.message='';draw();const c=STICK[l.n-1],x=(SX+c*SW).toFixed(1),knife=q('st-knife');
    await animate(650,t=>attr(knife,{transform:`translate(${x} ${(SY-SH/2-56+(SH+68)*t).toFixed(1)})`,opacity:Math.min(1,t*3)}));if(token.cancel)return;
    attr(q('st-zero'),{x:(Number(x)+20).toFixed(1)});await pop('st-zero',token);if(token.cancel)return;await pause(500);if(token.cancel)return;
    l.message=`The knife landed on an earlier cut. Nothing was split: still ${l.n+1} pieces.`;draw();
  });
}

// Step 2. A pizza; the new cut is a line, cut into segments by the earlier cuts.
const PZ=discMap(210,140,116);
function pizzaLines(l){return l.mode==='point'?X.CONCURRENT:X.PIZZA;}
function segmentsOf(lines,k){
  const l=lines[k],ch=X.chord(l),ts=[];for(const t of X.crossings(l,lines.slice(0,k)))if(!ts.some(s=>Math.abs(s-t)<1e-6))ts.push(t);
  const bounds=[-ch.half,...ts,ch.half];return {ch,ts,bounds,segments:bounds.slice(1).map((b,j)=>({from:bounds[j],to:b,mid:ch.at((bounds[j]+b)/2)}))};
}
function pizzaStatus(l){
  const k=l.n-1;if(k<0)return 'No cuts yet: the pizza is 1 piece.';
  const lines=pizzaLines(l),seg=segmentsOf(lines,k).segments.length,total=X.pieces(lines.slice(0,l.n)).length;
  if(l.mode==='point'&&k===2)return 'Cut 3 met both earlier cuts at the same point, so it has only 2 segments and added 2 pieces: 6 in all.';
  if(k===0)return 'The first cut crosses no earlier cut. It is 1 segment and splits the pizza into 2 pieces.';
  if(k===1)return `Cut 2 crossed 1 earlier cut, so it has 2 segments and added 2 pieces: ${total} in all.`;
  return `Cut ${l.n} crossed ${k} earlier cuts, so it has ${seg} segments and added ${seg} pieces: ${total} in all.`;
}
function pizzaPicture(l,{hideLast=false}={}){
  const lines=pizzaLines(l),shown=hideLast?l.n-1:l.n,list=X.pieces(lines.slice(0,shown)),last=!hideLast&&l.n>0?l.n-1:null;
  let body=`<circle cx="210" cy="140" r="122" fill="#e2b77a"/><circle cx="210" cy="140" r="116" fill="#f7e7c6"/><g id="pz-pieces">${list.map((p,i)=>polygon(p.poly,PZ,`id="pz-p${i}" fill="${colorFor(p.address)}" stroke="#ffffff" stroke-width="1.2"`)).join('')}</g>`;
  body+=lines.slice(0,shown).map((ln,i)=>lineTag(ln,PZ,`stroke="${i===last?CUT:INK}" stroke-width="${i===last?3:2}" stroke-linecap="round"`)).join('');
  body+=crossingPoints(lines.slice(0,shown)).map(p=>{const [x,y]=PZ(p);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="${INK}"/>`;}).join('');
  if(last!==null){const s=segmentsOf(lines,last);body+=s.segments.map((g,j)=>{const [x,y]=PZ(g.mid);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#ffffff" stroke="${CUT}" stroke-width="1.5"/><text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" class="x-badge-text">${j+1}</text>`;}).join('');}
  return {body,list};
}
function pizzaLab(l,action){
  l.mode??='general';l.n??=0;
  const lines=pizzaLines(l),max=lines.length;
  const draw=(picture)=>{const total=X.pieces(lines.slice(0,l.n)).length,k=Math.max(0,l.n-1);
    labShell({title:'Follow the knife across the pizza',views:views([['general','Cuts that follow the rule'],['point','Cuts that break the rule']],l.mode),
      picture:svg(picture??pizzaPicture(l).body,`Pizza picture. Cuts: ${l.n}. Pieces: ${total}.`,280,PIZZA_BOX),
      legend:'<p class="x-legend"><span class="x-legend-item"><span class="x-key x-key-cut"></span>Newest cut, with its segments numbered</span> <span class="x-legend-item"><span class="x-key x-key-line"></span>Earlier cuts</span></p>',
      rows:[['Cuts',l.n,'pz-n'],['Earlier cuts it crosses',l.n?(l.mode==='point'&&l.n===3?'2, at one point':k):'–','pz-k'],['Segments of the newest cut',l.n?segmentsOf(lines,l.n-1).segments.length:'–','pz-s'],['Pieces',total,'pz-total']],
      status:pizzaStatus(l),caption:'Each time the knife reaches a crossing or the crust, the piece it just passed through splits in two.',
      buttons:button('pizza-next','Make the next cut',{disabled:l.n>=max,primary:true})+button('pizza-replay','Replay the last cut',{disabled:l.n===0})+button('pizza-reset','Start over',{disabled:l.n===0})});
  };
  if(!action){draw();return;}
  if(action.startsWith('view-')){stop();l.mode=action.slice(5);l.n=0;pizzaLab(l);return;}
  if(action==='pizza-reset'){stop();l.n=0;draw();return;}
  if(action==='pizza-replay'&&l.n>0){l.n--;action='pizza-next';}
  if(action==='pizza-next'&&l.n<max)play(async token=>{
    const k=l.n,line=lines[k],{bounds,segments}=segmentsOf(lines,k),before=X.pieces(lines.slice(0,k));
    const parents=segments.map(s=>before.findIndex(p=>p.address===X.addressOf(s.mid,lines.slice(0,k))));
    const kids=parents.map(i=>X.split(before[i].poly,line).map((part,side)=>part&&{poly:part,address:before[i].address+(side?'+':'−')}).filter(Boolean));
    l.n=k+1;const base=pizzaPicture(l,{hideLast:true});
    const extra=kids.map((pair,j)=>pair.map((c,s)=>polygon(c.poly,PZ,`id="pz-k${j}-${s}" fill="${colorFor(c.address)}" stroke="#ffffff" stroke-width="1.2" opacity="0"`)).join('')).join('')
      +lines.slice(0,k).map(ln=>lineTag(ln,PZ,`stroke="${INK}" stroke-width="2" stroke-linecap="round"`)).join('')
      +`<line id="pz-knife" stroke="${CUT}" stroke-width="3.2" stroke-linecap="round" x1="0" y1="0" x2="0" y2="0" opacity="0"/><circle id="pz-tip" r="6" fill="${CUT}" stroke="#ffffff" stroke-width="2" opacity="0"/>`
      +bounds.slice(1,-1).map((t,j)=>{const [x,y]=PZ(X.chord(line).at(t));return `<circle id="pz-x${j}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#ffffff" stroke="${CUT}" stroke-width="2" opacity="0"/>`;}).join('')
      +segments.map((s,j)=>{const [x,y]=PZ(s.mid);return bubble('pz-plus'+j,[x+(line.n[0]>0?14:-14),y-12],'+1');}).join('');
    draw(base.body+extra);
    setText('pz-n',k+1);setText('pz-k',k===2&&l.mode==='point'?'2, at one point':k);setText('pz-s','0');setText('pz-total',before.length);
    say(k===0?'The knife enters the pizza.':k===1?'The knife enters the pizza. It will cross 1 earlier cut.':l.mode==='point'?'The knife enters the pizza. It will meet both earlier cuts at one point.':`The knife enters the pizza. It will cross ${k} earlier cuts.`);
    const ch=X.chord(line),knife=q('pz-knife'),tip=q('pz-tip'),[sx,sy]=PZ(ch.at(-ch.half));attr(knife,{x1:sx,y1:sy,x2:sx,y2:sy,opacity:1});attr(tip,{cx:sx,cy:sy,opacity:1});
    for(let j=0;j<segments.length;j++){
      const parent=q('pz-p'+parents[j]);attr(parent,{fill:HOT});
      await animate(Math.max(380,900*(segments[j].to-segments[j].from)/ch.half),t=>{const [x,y]=PZ(ch.at(segments[j].from+t*(segments[j].to-segments[j].from)));attr(knife,{x2:x,y2:y});attr(tip,{cx:x,cy:y});});if(token.cancel)return;
      attr(parent,{opacity:0});kids[j].forEach((c,s)=>attr(q(`pz-k${j}-${s}`),{opacity:1}));if(j<segments.length-1)attr(q('pz-x'+j),{opacity:1});
      setText('pz-s',j+1);setText('pz-total',before.length+j+1);
      await pop('pz-plus'+j,token);if(token.cancel)return;
    }
    await pause(350);if(token.cancel)return;draw();
  });
}

// Step 3. Two views of the pizza formula: a staircase of new pieces, and cuts plus crossings.
function stairsGeometry(n){const s=Math.min(40,Math.floor(330/(n+2.6)),Math.floor(222/(n+1))),x0=Math.round(210-(n+1.6)*s/2);return {s,x0,base:252,col:k=>x0+s*1.6+(k-1)*s};}
function formulaLab(l,action,value){
  l.view??='stairs';l.n??=4;l.m??=3;l.paired??=false;
  const stairs=()=>{const {s,x0,base,col}=stairsGeometry(l.n);let body=`<rect x="${x0}" y="${base-s}" width="${s}" height="${s}" rx="3" fill="#f7e7c6" stroke="#c9935a"/><text x="${(x0+s/2).toFixed(1)}" y="${(base-s/2+4).toFixed(1)}" text-anchor="middle" class="x-small">1</text>`;
    for(let k=1;k<=l.n;k++){for(let r=0;r<k;r++)body+=`<rect class="x-stair" data-col="${k}" x="${col(k)+1}" y="${base-(r+1)*s+1}" width="${s-2}" height="${s-2}" rx="3" fill="${COLORS[k%COLORS.length]}" stroke="#5f8f86" stroke-width=".8"/>`;body+=`<text x="${(col(k)+s/2).toFixed(1)}" y="${base+16}" text-anchor="middle" class="x-small">${k}</text>`;}
    body+=`<g id="fm-copy" opacity="${l.paired?1:0}" transform="translate(0 ${l.paired?0:-40})">`;for(let k=1;k<=l.n;k++)for(let r=k;r<=l.n;r++)body+=`<rect x="${col(k)+1}" y="${base-(r+1)*s+1}" width="${s-2}" height="${s-2}" rx="3" fill="#ffffff" stroke="${CUT}" stroke-width="1.2" stroke-dasharray="3 2"/>`;
    body+=`<rect x="${col(1)}" y="${base-(l.n+1)*s}" width="${l.n*s}" height="${(l.n+1)*s}" fill="none" stroke="${CUT}" stroke-width="2"/></g>`;return body;};
  const crossings=()=>{const lines=X.PIZZA.slice(0,l.m),list=X.pieces(lines),pts=crossingPoints(lines);
    return `<circle cx="210" cy="140" r="122" fill="#e2b77a"/><circle cx="210" cy="140" r="116" fill="#f7e7c6"/>${list.map(p=>polygon(p.poly,PZ,`fill="${colorFor(p.address)}" stroke="#ffffff" stroke-width="1.2" opacity=".75"`)).join('')}${lines.map(ln=>lineTag(ln,PZ,`stroke="${INK}" stroke-width="2" stroke-linecap="round"`)).join('')}${pts.map((p,i)=>{const [x,y]=PZ(p);return `<g class="x-cross" id="fm-x${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${CUT}" stroke="#ffffff" stroke-width="1.5"/><text x="${x.toFixed(1)}" y="${(y+3.5).toFixed(1)}" text-anchor="middle" class="x-badge-text x-on-dark">${i+1}</text></g>`;}).join('')}`;};
  const stairsContent=()=>{const T=l.n*(l.n+1)/2;return {picture:svg(stairs(),`Staircase picture. Cuts: ${l.n}. Squares: ${1+T}.`,280),
      rows:[['Cuts',l.n],['New pieces',T],['Pieces in all',1+T]],
      status:l.paired?`Two copies of the staircase fill a ${l.n} by ${l.n+1} rectangle, so the sum is half of ${l.n} × ${l.n+1}: ${T}.`:`Column k holds the k pieces that cut k adds. With the whole pizza: ${1+T} pieces.`};};
  const draw=()=>{const c=X.choose(l.m,2);
    if(l.view==='stairs')labShell({title:'Add up the new pieces',views:views([['stairs','Staircase'],['crossings','Cuts and crossings']],l.view),...stairsContent(),
      legend:`<label class="x-range"><span>Number of cuts, n</span><input type="range" min="1" max="10" step="1" value="${l.n}" data-lab="stairs-n" aria-valuetext="${l.n}"><output aria-live="off">${l.n}</output></label>`,
      caption:'Fit a second, upside-down copy of the staircase on top: every column then has n + 1 squares.',
      buttons:button('stairs-pair',l.paired?'Take the copy away':'Fit two staircases together',{primary:true})});
    else labShell({title:'Count cuts and crossings',views:views([['stairs','Staircase'],['crossings','Cuts and crossings']],l.view),
      picture:svg(crossings(),`Pizza picture. Cuts: ${l.m}. Crossings: ${c}.`,280,PIZZA_BOX),
      rows:[['Whole pizza',1],['Cuts',l.m],['Crossings, C(n, 2)',c],['Pieces',1+l.m+c]],
      status:l.m?`1 + ${l.m} + ${c} = ${1+l.m+c} pieces: the whole pizza, one for each cut and one for each crossing.`:'No cuts: the whole pizza is 1 piece.',
      caption:'Every crossing point lies on exactly two cuts, so counting crossings is choosing 2 of the cuts.',
      buttons:button('cross-next','Add a cut',{disabled:l.m>=X.PIZZA.length,primary:true})+button('cross-reset','Start over',{disabled:l.m===0})});
  };
  if(!action){draw();return;}
  if(action.startsWith('view-')){stop();l.view=action.slice(5);draw();return;}
  if(action==='stairs-n'){stop();l.n=Math.max(1,Math.min(10,Number(value)||1));l.paired=false;patch(stairsContent());rangeOutput(String(l.n));const b=document.querySelector('#lab [data-lab="stairs-pair"]');if(b)b.textContent='Fit two staircases together';return;}
  if(action==='stairs-pair')play(async token=>{
    if(l.paired){l.paired=false;draw();return;}
    l.paired=false;draw();const copy=q('fm-copy');await animate(900,t=>attr(copy,{opacity:Math.min(1,t*1.6),transform:`translate(0 ${(-40*(1-t)).toFixed(1)})`}));if(token.cancel)return;l.paired=true;draw();
  });
  if(action==='cross-reset'){stop();l.m=0;draw();return;}
  if(action==='cross-next'&&l.m<X.PIZZA.length)play(async token=>{
    const old=crossingPoints(X.PIZZA.slice(0,l.m)).length;l.m++;draw();const all=crossingPoints(X.PIZZA.slice(0,l.m));
    for(let i=old;i<all.length;i++)attr(q('fm-x'+i),{opacity:0});
    for(let i=old;i<all.length;i++){await animate(300,t=>attr(q('fm-x'+i),{opacity:t}));if(token.cancel)return;}
  });
}

// Step 4. The ball. Left: the ball and its cuts, seen from the front. Right: the face of the newest cut, turned toward you.
const BX=112,BY=142,BR=92,FX=318,FY=142,FR=92;
function view3(p,turn){const a=turn*Math.PI/180,x=p[0]*Math.cos(a)+p[2]*Math.sin(a),z=-p[0]*Math.sin(a)+p[2]*Math.cos(a);return [BX+BR*x,BY-BR*p[1],z];}
// The rim of a cut, where its plane meets the surface, split into the front (seen) and back (hidden) arcs.
function rim(k,turn,offset=null){
  const f=X.face(k),{u}=X.BALL[k],d=offset??X.BALL[k].d,r=Math.sqrt(Math.max(0,1-d*d)),pts=[];
  for(let i=0;i<=96;i++){const t=2*Math.PI*i/96,a=Math.cos(t),b=Math.sin(t);pts.push(view3([0,1,2].map(j=>d*u[j]+r*(a*f.e1[j]+b*f.e2[j])),turn));}
  let front='',back='';for(let i=0;i<96;i++){const [p,q2]=[pts[i],pts[i+1]],seg=`M${pt(p)}L${pt(q2)}`;if(p[2]+q2[2]>=0)front+=seg;else back+=seg;}
  return {front,back,fill:pts.map(pt).join(' ')};
}
function facePieces(k){return X.pieces(X.face(k).lines);}
// The turn that shows cut k at a slant: its face neither edge-on nor flat toward the viewer.
function bestTurn(k,from){let best=from,score=Infinity;for(let a=-70;a<=70;a++){const r=a*Math.PI/180,u=X.BALL[k].u,z=Math.abs(-u[0]*Math.sin(r)+u[2]*Math.cos(r)),s=Math.abs(z-.66)+.002*Math.abs(a-from);if(s<score){score=s;best=a;}}return best;}
// Every element of the ball picture has an id, so turning the ball changes attributes only.
function ballParts(l,sliding){
  const parts=[],newest=l.n-1,line=(a,b)=>({x1:a[0].toFixed(1),y1:a[1].toFixed(1),x2:b[0].toFixed(1),y2:b[1].toFixed(1)});
  for(let j=0;j<l.n;j++){const r=rim(j,l.turn,j===newest&&sliding!==null?sliding:null);parts.push(['rb-'+j,{d:r.back}]);if(j===newest)parts.push(['face-3d',{points:r.fill}]);parts.push(['rf-'+j,{d:r.front}]);}
  if(newest>=0&&sliding===null){const f=X.face(newest),toScreen=p=>view3(f.toSpace(p),l.turn);
    facePieces(newest).forEach((p,i)=>parts.push(['f3-'+i,{points:p.poly.map(v=>pt(toScreen(v))).join(' ')}]));
    f.lines.forEach((ln,i)=>{const [a,b]=chordEnds(ln).map(toScreen);parts.push(['fl-'+i,line(a,b)]);});
    parts.push(['rf-top',{d:rim(newest,l.turn).front}]);}
  return parts;
}
function orient(l,sliding=null){for(const [id,values]of ballParts(l,sliding))attr(q(id),values);}
function ballLab(l,action,value){
  l.n??=0;l.turn??=-18;
  const max=X.BALL.length,counts=X.ballCounts();
  const picture=({sliding=null,faceScale=1,showFace=true}={})=>{
    const newest=l.n-1,look=id=>id.startsWith('rb-')?`fill="none" stroke="${id==='rb-'+newest?CUT:INK}" stroke-width="1.2" stroke-dasharray="4 3" opacity=".55"`:id.startsWith('rf-')?`fill="none" stroke="${id==='rf-'+newest||id==='rf-top'?CUT:INK}" stroke-width="${id==='rf-'+newest||id==='rf-top'?2.6:1.6}"`:id==='face-3d'?'fill="#f4d49d" fill-opacity=".72"':id.startsWith('fl-')?`stroke="${INK}" stroke-width="1.6"`:'';
    const list=newest>=0?facePieces(newest):[];
    let body=`<defs><radialGradient id="ball-shade" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#f4faf8"/><stop offset="1" stop-color="#a9cdc4"/></radialGradient><marker id="x-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#9db8b0"/></marker></defs><circle cx="${BX}" cy="${BY}" r="${BR}" fill="url(#ball-shade)" stroke="#5f8f86" stroke-width="1.4"/>`;
    for(const [id,values]of ballParts(l,sliding)){const tag=id.startsWith('f3-')||id==='face-3d'?'polygon':id.startsWith('fl-')?'line':'path',i=Number(id.slice(3));
      const extra=id.startsWith('f3-')?`fill="${colorFor(list[i].address)}" fill-opacity=".55" stroke="#ffffff" stroke-width=".8"`:look(id);
      body+=`<${tag} id="${id}" ${Object.entries(values).map(([k,v])=>`${k}="${v}"`).join(' ')} ${extra}/>`;}
    if(newest>=0&&showFace){const f=X.face(newest),r=FR*f.r,map=discMap(0,0,r);
      body+=`<g id="face-2d" transform="translate(${FX} ${FY}) scale(1 ${faceScale.toFixed(3)})" opacity="${Math.min(1,faceScale*1.3).toFixed(2)}"><circle r="${(r+3).toFixed(1)}" fill="${CUT}" opacity=".9"/>${list.map((p,i)=>polygon(p.poly,map,`id="f2-${i}" fill="${colorFor(p.address)}" stroke="#ffffff" stroke-width="1.2"`)).join('')}${f.lines.map(ln=>lineTag(ln,map,`stroke="${INK}" stroke-width="2"`)).join('')}${crossingPoints(f.lines).map(p=>{const [x,y]=map(p);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${INK}"/>`;}).join('')}${list.map((p,i)=>bubble('fp-'+i,map(centroid(p.poly)).map((v,a)=>a?v+4:v),'+1','x-plus x-plus-small')).join('')}</g>`;}
    else body+=`<circle cx="${FX}" cy="${FY}" r="${FR}" fill="none" stroke="#cbd9d4" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    return body+`<path d="M${BX+BR+3} ${BY}H${FX-FR-4}" stroke="#9db8b0" stroke-width="1.4" marker-end="url(#x-arrow)"/>`;
  };
  const status=()=>{const k=l.n-1;if(k<0)return 'No cuts yet: the ball is 1 piece.';const face=counts[k+1]-counts[k];
    if(k===0)return 'The face of the first cut is a whole disc with no lines. It splits the ball into 2 pieces.';
    if(k===1)return `Cut 2: its face shows 1 line, which makes 2 pieces of the face, so the cut added 2 pieces: ${counts[2]} in all.`;
    return `Cut ${l.n}: its face shows ${k} lines, which make ${face} pieces of the face, so the cut added ${face} pieces: ${counts[l.n]} in all.`;};
  const label=()=>`Ball picture. Cuts: ${l.n}. Pieces: ${counts[l.n]}.`;
  const draw=(opts)=>{labShell({title:'Slide in a cut, then look at its face',picture:svg(picture(opts),label()),
    legend:`<p class="x-legend"><span class="x-legend-item"><span class="x-key x-key-cut"></span>Newest cut</span> <span class="x-legend-item"><span class="x-key x-key-line"></span>Earlier cuts</span> <span class="x-legend-item"><span class="x-key x-key-dash"></span>Behind the ball</span></p><p class="x-legend x-legend-panels"><span>Left: the ball</span><span>Right: the face of the newest cut, turned toward you</span></p><label class="x-range"><span>Turn the ball</span><input type="range" min="-70" max="70" step="1" value="${l.turn}" data-lab="ball-turn" aria-valuetext="${l.turn}°"><output aria-live="off">${l.turn}°</output></label>`,
    rows:[['Cuts',l.n,'b-n'],['Lines on the newest face',l.n?l.n-1:'–','b-lines'],['Pieces of the newest face',l.n?counts[l.n]-counts[l.n-1]:'–','b-face'],['Pieces of the ball',counts[l.n],'b-total']],
    status:status(),caption:'Before each cut the ball turns so that the new face is easy to see. Drag the slider to turn it yourself.',
    buttons:button('ball-next','Make the next cut',{disabled:l.n>=max,primary:true})+button('ball-replay','Replay the last cut',{disabled:l.n===0})+button('ball-reset','Start over',{disabled:l.n===0})});};
  const turnTo=async(token,target)=>{const from=l.turn;if(Math.abs(target-from)<2)return;const input=document.querySelector('#lab [data-lab="ball-turn"]');let shown=from;
    // The readout follows the turn in steps of 5°, so its text does not change on every frame.
    await animate(Math.min(900,250+8*Math.abs(target-from)),t=>{l.turn=Math.round(from+(target-from)*t);orient(l,null);if(input)input.value=l.turn;if(Math.abs(l.turn-shown)>=5){shown=l.turn;rangeOutput(l.turn+'°');}});if(token.cancel)return;rangeOutput(l.turn+'°');};
  if(!action){draw();return;}
  if(action==='ball-turn'){l.turn=Math.max(-70,Math.min(70,Number(value)||0));if(run)skip();else{orient(l);rangeOutput(l.turn+'°');}return;}
  if(action==='ball-reset'){stop();l.n=0;draw();return;}
  if(action==='ball-replay'&&l.n>0){l.n--;action='ball-next';}
  if(action==='ball-next'&&l.n<max)play(async token=>{
    const k=l.n,target=X.BALL[k].d;draw();say(k?'The ball turns so that the next cut is easy to see.':'The ball turns so that the first cut is easy to see.');
    await turnTo(token,bestTurn(k,l.turn));if(token.cancel)return;
    l.n=k+1;draw({sliding:.999,showFace:false});
    setText('b-lines','–');setText('b-face','–');setText('b-total',counts[k]);say(k?'A new cut slides into the ball.':'The first cut slides into the ball.');
    await animate(1200,t=>orient(l,.999+(target-.999)*t));if(token.cancel)return;
    draw({faceScale:.08});setText('b-total',counts[k]);setText('b-face','–');say(k===0?'Its face is a whole disc. It turns toward you.':k===1?'Its face meets the earlier cut in 1 line. It turns toward you.':`Its face meets the ${k} earlier cuts in ${k} lines. It turns toward you.`);
    await animate(900,t=>attr(q('face-2d'),{transform:`translate(${FX} ${FY}) scale(1 ${(.08+.92*t).toFixed(3)})`,opacity:Math.min(1,.2+t)}));if(token.cancel)return;
    const list=facePieces(k);setText('b-face','0');
    for(let i=0;i<list.length;i++){
      for(const pre of ['f2-','f3-']){attr(q(pre+i),{fill:HOT,'fill-opacity':.95});if(i>0)attr(q(pre+(i-1)),{fill:colorFor(list[i-1].address),'fill-opacity':pre==='f3-'?.55:1});}
      setText('b-face',i+1);setText('b-total',counts[k]+i+1);await pop('fp-'+i,token);if(token.cancel)return;await pause(160);if(token.cancel)return;
    }
    await pause(300);if(token.cancel)return;draw();
  });
}

// Step 5. The doubling trap: the count against 2ⁿ, addresses on a pizza and on the ball, and stacking.
function addressText(a){return [...a].join(' ');}
// In a sentence an address is joined with word joiners, so it never breaks across lines.
function addressWord(a){return [...a].join('\u2060');}
function trapLab(l,action){
  l.view??='chart';l.m??=0;
  const counts=X.ballCounts().concat([42]);
  const viewList=views([['chart','Pieces and 2ⁿ'],['pizza','Addresses on a pizza'],['ball','Addresses in the ball'],['stack','Moving the pieces']],l.view);
  const chart=()=>{let body='<line x1="34" y1="236" x2="408" y2="236" stroke="#9db8b0"/>';const unit=196/64;
    // Bars for 5 and 6 cuts appear only when the learner grows them, since step 5 asks for those counts.
    for(let n=0;n<=6;n++){const x=46+n*52,b=counts[n],p=2**n;if(n>4&&!l.grown){body+=`<text x="${x+19}" y="226" text-anchor="middle" class="x-small">?</text><text x="${x+19}" y="254" text-anchor="middle" class="x-small">${n}</text>`;continue;}body+=`<rect class="x-bar-ghost" x="${x+22}" y="${236-p*unit}" width="18" height="${p*unit}" rx="2" fill="#ffffff" stroke="#b07a2a" stroke-width="1.4" stroke-dasharray="3 2" data-grow="${p*unit}"/><rect class="x-bar" x="${x}" y="${236-b*unit}" width="18" height="${b*unit}" rx="2" fill="#4f8f83" data-grow="${b*unit}"/><g class="x-bar-label" data-n="${n}"><text x="${x+8}" y="${230-b*unit}" text-anchor="middle" class="x-small">${b}</text><text x="${x+32}" y="${230-p*unit}" text-anchor="middle" class="x-small x-amber">${p}</text>${p>b?`<text x="${x+19}" y="272" text-anchor="middle" class="x-small x-red">−${p-b}</text>`:''}</g><text x="${x+19}" y="254" text-anchor="middle" class="x-small">${n}</text>`;}
    return body;};
  const pizza=()=>{const lines=X.TRIANGLE,list=X.pieces(lines);
    let body=`<circle cx="210" cy="140" r="122" fill="#e2b77a"/><circle cx="210" cy="140" r="116" fill="#f7e7c6"/>${list.map((p,i)=>polygon(p.poly,PZ,`id="tp-${i}" fill="${colorFor(p.address)}" stroke="#ffffff" stroke-width="1.2"`)).join('')}${lines.map(ln=>lineTag(ln,PZ,`stroke="${INK}" stroke-width="2" stroke-linecap="round"`)).join('')}`;
    // Each cut is numbered just beyond one end, outside the crust, with an arrow toward its "+" side. A badge goes at
    // the end farthest from the badges already placed.
    const placed=[];body+=lines.map((ln,i)=>{const c=X.chord(ln),ends=[[c.half,1],[-c.half,-1]].map(([t,s])=>({end:c.at(t),out:c.dir.map(v=>v*s)}));
      const far=e=>Math.min(9,...placed.map(b=>Math.hypot(b[0]-e.end[0],b[1]-e.end[1])));const e=ends.sort((a,b)=>far(b)-far(a))[0];placed.push(e.end);
      const badge=e.end.map((v,k)=>v+.17*e.out[k]),[x,y]=PZ(badge),[ex,ey]=PZ(e.end),[a1,b1]=PZ(badge.map((v,k)=>v+.085*ln.n[k])),[a2,b2]=PZ(badge.map((v,k)=>v+.3*ln.n[k]));
      return `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${INK}" stroke-width="1.4" stroke-dasharray="3 3"/><line x1="${a1.toFixed(1)}" y1="${b1.toFixed(1)}" x2="${a2.toFixed(1)}" y2="${b2.toFixed(1)}" stroke="${CUT}" stroke-width="2.2" marker-end="url(#tp-arrow)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${INK}"/><text x="${x.toFixed(1)}" y="${(y+3.6).toFixed(1)}" text-anchor="middle" class="x-badge-text x-on-dark">${i+1}</text>`;}).join('');
    body+=list.map(p=>{const [x,y]=PZ(innerPoint(p.poly));return `<text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" class="x-address">${addressText(p.address)}</text>`;}).join('');
    return `<defs><marker id="tp-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${CUT}"/></marker></defs>`+body;};
  const grid=(n,found,extra={},hidden=false)=>{const all=Array.from({length:2**n},(_,s)=>Array.from({length:n},(_,b)=>s&(1<<(n-1-b))?'−':'+').join(''));
    const note=a=>hidden?'':!found.has(a)?'No piece':extra[a]==='triangle'?extra.middle:'';
    return `<div class="x-address-grid">${all.map((a,i)=>`<span class="x-address-cell ${hidden?'waiting':found.has(a)?'found':'missing'}${extra[a]&&!hidden?' '+extra[a]:''}" id="ad-${i}" data-address="${a}" style="${found.has(a)?`--fill:${extra.colors?.[a]||'#e7f3ee'}`:''}"><b data-no-translate>${addressText(a)}</b>${note(a)?`<small>${esc(note(a))}</small>`:''}</span>`).join('')}</div>`;};
  // Pieces as slabs in a tower: one cut down the middle splits every slab, and the two halves are stacked again.
  const slabH=m=>Math.min(24,176/2**m),slab=(m,i)=>({x:135,y:(214-(i+1)*slabH(m)).toFixed(1),width:150,height:(slabH(m)-2).toFixed(1)});
  const stack=(split=false)=>{let body='';for(let i=0;i<2**l.m;i++){const r=slab(l.m,i),fill=COLORS[i%COLORS.length];
      body+=split?`<rect id="sk-l${i}" x="${r.x}" y="${r.y}" width="75" height="${r.height}" rx="3" fill="${fill}" stroke="#5f8f86"/><rect id="sk-r${i}" x="210" y="${r.y}" width="75" height="${r.height}" rx="3" fill="${COLORS[(i+2**l.m)%COLORS.length]}" stroke="#5f8f86"/>`:`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="3" fill="${fill}" stroke="#5f8f86"/>`;}
    return body+`<g id="tk-knife" opacity="0">${KNIFE}</g>`;};
  const draw=()=>{
    if(l.view==='chart')labShell({title:'Compare the count with doubling',views:viewList,picture:svg(chart(),'Bar chart of the most pieces of the ball and of 2ⁿ, for 0 to 6 cuts'),
      legend:'<p class="x-legend"><span class="x-legend-item"><span class="x-key x-key-bar"></span>Most pieces, B(n)</span> <span class="x-legend-item"><span class="x-key x-key-ghost"></span>Doubling, 2ⁿ</span> <span class="x-legend-item"><span class="x-key x-key-red">−</span>Short of doubling, 2ⁿ − B(n)</span></p>',
      status:l.grown?'Doubling matches up to 3 cuts. With 4 cuts the ball has 15 pieces, 1 fewer than 16; with 6 cuts it has 42, 22 fewer than 64.':'Doubling matches up to 3 cuts. With 4 cuts the ball has 15 pieces, 1 fewer than 16. Find B(5) and B(6) first, then grow the bars to check.',caption:'The numbers under the bars are the numbers of cuts.',buttons:button('chart-grow',l.grown?'Grow the bars again':'Grow the bars to 6 cuts',{primary:true})});
    else if(l.view==='pizza'){const list=X.pieces(X.TRIANGLE),tri=list.find(p=>p.poly.every(q2=>Math.hypot(...q2)<.999)),colors=Object.fromEntries(list.map(p=>[p.address,colorFor(p.address)]));
      labShell({title:'Give each piece an address',views:viewList,picture:svg(pizza(),'A pizza with 3 numbered cuts and 7 pieces, each labeled with its address',280,'56 -16 308 312'),
        legend:grid(3,new Set(list.map(p=>p.address)),{colors,middle:'Triangle',[tri.address]:'triangle',[X.flip(tri.address)]:'opposite'}),
        status:`Address of the triangle in the middle: ${addressWord(tri.address)}. Its opposite would be beyond all three sides of the triangle at once, so no piece has it: ${addressWord(X.flip(tri.address))}.`,
        caption:'For each cut, + means the side its arrow points to. The grid lists all 2³ = 8 addresses, like the rows of a truth table.',buttons:button('pizza-visit','Visit every piece',{primary:true})});}
    else if(l.view==='ball'){const found=new Set(X.ballAddresses(X.BALL.slice(0,4))),tet=X.tetrahedron();
      labShell({title:'Addresses with four cuts of the ball',views:viewList,picture:grid(4,found,{middle:'Tetrahedron',[tet.address]:'triangle',[X.flip(tet.address)]:'opposite'},!l.checked),
        status:!l.checked?'Which of the 16 addresses have a piece? Count them first, then check every address.':`${found.size} of the 16 addresses have a piece. Address of the small tetrahedron in the middle: ${addressWord(tet.address)}. Address with no piece, its opposite: ${addressWord(X.flip(tet.address))}. No point is beyond all four faces of the tetrahedron.`,
        caption:'The lab finds the addresses from the corners where three cuts meet: the eight points just around a corner lie in eight different pieces.',buttons:button('ball-visit','Check every address',{primary:true})});}
    else labShell({title:'What if the pieces could move?',views:viewList,picture:svg(stack(),`Tower of pieces. Cuts: ${l.m}. Pieces: ${2**l.m}.`,230),rows:[['Cuts',l.m],['Pieces',2**l.m]],
      status:l.m?`Every cut went through every piece, so the count doubled: ${2**l.m} pieces.`:'One piece. If you may move the pieces, stack them before each cut.',
      caption:'Moving the pieces breaks a rule of the project. With the rule, 4 cuts make at most 15 pieces. Cut the stack 4 times and compare.',
      buttons:button('stack-next','Cut through the stack',{disabled:l.m>=4,primary:true})+button('stack-reset','Start over',{disabled:l.m===0})});
  };
  if(!action){draw();return;}
  if(action.startsWith('view-')){stop();l.view=action.slice(5);trapLab(l);return;}
  if(action==='chart-grow')play(async token=>{l.grown=true;draw();const bars=[...document.querySelectorAll('#lab .x-bar,#lab .x-bar-ghost')];bars.forEach(b=>attr(b,{height:0,y:236}));
    // Each pair's numbers appear once its bars have grown.
    const labels=[...document.querySelectorAll('#lab .x-bar-label')];labels.forEach(g=>attr(g,{opacity:0}));
    for(let n=0;n<=6;n++){const pair=bars.filter((b,i)=>Math.floor(i/2)===n);await animate(260,t=>pair.forEach(b=>{const h=Number(b.dataset.grow)*t;attr(b,{height:h.toFixed(1),y:(236-h).toFixed(1)});}));if(token.cancel)return;attr(labels[n],{opacity:1});}});
  if(action==='pizza-visit')play(async token=>{draw();const list=X.pieces(X.TRIANGLE);
    for(let i=0;i<list.length;i++){const poly=q('tp-'+i),cell=document.querySelector(`#lab [data-address="${list[i].address}"]`);attr(poly,{fill:HOT});cell?.classList.add('active');say(`This piece has the address: ${addressWord(list[i].address)}.`);await pause(650);if(token.cancel)return;attr(poly,{fill:colorFor(list[i].address)});cell?.classList.remove('active');}
    draw();document.querySelector('#lab .x-address-cell.opposite')?.classList.add('active');});
  if(action==='ball-visit')play(async token=>{l.checked=true;draw();const cells=[...document.querySelectorAll('#lab .x-address-cell')];cells.forEach(c=>c.classList.add('waiting'));
    for(const c of cells){c.classList.remove('waiting');c.classList.add('active');await pause(140);if(token.cancel)return;c.classList.remove('active');}
    document.querySelector('#lab .x-address-cell.missing')?.classList.add('active');});
  if(action==='stack-reset'){stop();l.m=0;draw();return;}
  if(action==='stack-next'&&l.m<4)play(async token=>{
    const m=l.m,count=2**m,top=214-count*slabH(m);draw();q('lab').querySelector('.x-art').innerHTML=svg(stack(true),`Tower of pieces. Cuts: ${m}. Pieces: ${count}.`,230);const knife=q('tk-knife');
    // The knife comes down the middle; each slab it reaches opens into two halves.
    await animate(1100,t=>{const tip=top-30+(214-top+36)*t;attr(knife,{transform:`translate(210 ${tip.toFixed(1)})`,opacity:Math.min(1,t*4)});
      for(let i=0;i<count;i++){const r=slab(m,i),open=Math.max(0,Math.min(1,(tip-Number(r.y))/8));attr(q('sk-l'+i),{x:(135-5*open).toFixed(1)});attr(q('sk-r'+i),{x:(210+5*open).toFixed(1)});}});if(token.cancel)return;
    attr(knife,{opacity:0});say(`Stack the ${count*2} halves again.`);
    // The right halves move onto the top of the tower, and every half becomes a whole slab of the new tower.
    await animate(900,t=>{for(let i=0;i<count;i++){const a=slab(m+1,i),b=slab(m+1,i+count),lx=130,rx=215,ly=Number(slab(m,i).y),lh=slabH(m)-2;
      attr(q('sk-l'+i),{x:(lx+(135-lx)*t).toFixed(1),y:(ly+(Number(a.y)-ly)*t).toFixed(1),width:(75+75*t).toFixed(1),height:(lh+(Number(a.height)-lh)*t).toFixed(1)});
      attr(q('sk-r'+i),{x:(rx+(135-rx)*t).toFixed(1),y:(ly+(Number(b.y)-ly)*t).toFixed(1),width:(75+75*t).toFixed(1),height:(lh+(Number(b.height)-lh)*t).toFixed(1)});}});if(token.cancel)return;
    l.m++;draw();});
}

// A difference table: each row lists the differences of the row above. Hidden cells are also hidden from screen readers.
function diffTable(rows,names,built,prefix){
  return `<div class="x-diff" style="--cells:${2*rows[0].length}">${rows.map((r,i)=>`<p class="x-diff-name">${esc(names[i])}</p><div class="x-diff-row">${r.map((v,j)=>`<span class="x-diff-cell${built||i===0?' shown':''}"${built||i===0?'':' aria-hidden="true"'} id="${prefix}-${i}-${j}" style="grid-column:${2*j+i+1}/span 2">${v}</span>`).join('')}</div>`).join('')}</div>`;
}
async function buildDiff(token,rows,prefix){
  for(let j=0;j<rows[0].length;j++){q(`${prefix}-0-${j}`)?.classList.add('shown');await pause(90);if(token.cancel)return false;}
  for(let i=1;i<rows.length;i++)for(let j=0;j<rows[i].length;j++){const parents=[q(`${prefix}-${i-1}-${j}`),q(`${prefix}-${i-1}-${j+1}`)],cell=q(`${prefix}-${i}-${j}`);parents.forEach(p=>p?.classList.add('parent'));await pause(160);if(token.cancel)return false;cell?.classList.add('shown');cell?.removeAttribute('aria-hidden');parents.forEach(p=>p?.classList.remove('parent'));await pause(70);if(token.cancel)return false;}
  return true;
}
// Step 6. One pattern: the difference table and Pascal's triangle.
const SEQ=[1,2,4,8,15,26,42,64];
function patternLab(l,action,value){
  l.view??='table';l.n??=4;l.dim??=3;
  const rows=[SEQ];while(rows.length<4){const r=rows[rows.length-1];rows.push(r.slice(1).map((v,i)=>v-r[i]));}
  const names=['Ball, B(n)','Pizza, P(n)','Stick, L(n)','Third differences'];
  const table=()=>diffTable(rows,names,l.built,'df');
  const pascal=()=>{const out=[];for(let r=0;r<=8;r++){const row=[1];for(let k=1;k<=r;k++)row.push(row[k-1]*(r-k+1)/k);out.push(row);}
    return `<div class="x-pascal" role="img" aria-label="Pascal’s triangle, rows 0 to 8">${out.map((row,r)=>`<div class="x-pascal-row">${row.map((v,k)=>`<span class="x-pascal-cell${r===l.n&&k<=l.dim?' picked':''}" id="pc-${r}-${k}" style="grid-column:${8-r+2*k+1}/span 2">${v}</span>`).join('')}</div>`).join('')}</div>`;};
  const sum=()=>Array.from({length:l.dim+1},(_,k)=>X.choose(l.n,k)),total=()=>sum().reduce((a,b)=>a+b,0);
  const pascalStatus=()=>`Row ${l.n}: the first ${l.dim+1} numbers add up to ${total()}.`;
  const dims=[[1,'Stick'],[2,'Pizza'],[3,'Ball']];
  const draw=()=>{
    if(l.view==='table')labShell({title:'Build the difference table',views:views([['table','Difference table'],['pascal','Pascal’s triangle']],l.view),picture:table(),
      status:l.built?'Each row lists the differences of the row above. The ball’s differences are the pizza counts, theirs are the stick counts, and the third differences are all 1.':'Start from the ball counts for 0 to 7 cuts.',
      caption:'Each number in a lower row is the difference of the two numbers just above it.',
      buttons:button('table-build','Build the table',{primary:true})+button('table-all','Show it all at once')});
    else{const terms=sum();labShell({title:'Find the counts in Pascal’s triangle',views:views([['table','Difference table'],['pascal','Pascal’s triangle']],l.view),picture:pascal(),
      legend:`<div class="x-views x-dims" role="group" aria-label="Choose the count">${dims.map(([d,label])=>button('dim-'+d,label,{pressed:d===l.dim})).join('')}</div><label class="x-range"><span>Number of cuts, n</span><input type="range" min="0" max="8" step="1" value="${l.n}" data-lab="pascal-n" aria-valuetext="${l.n}"><output aria-live="off">${l.n}</output></label><p class="lab-equation" data-no-translate>${terms.join(' + ')} = ${total()}</p>`,
      status:pascalStatus(),
      caption:'Row n lists C(n, 0), C(n, 1), C(n, 2), …. The stick adds the first two, the pizza the first three and the ball the first four.',
      buttons:button('pascal-play','Add them one at a time',{primary:true})});}
  };
  if(!action){draw();return;}
  if(action.startsWith('view-')){stop();l.view=action.slice(5);draw();return;}
  if(action==='table-all'){stop();l.built=true;draw();return;}
  if(action==='table-build')play(async token=>{l.built=false;draw();if(await buildDiff(token,rows,'df')){l.built=true;draw();}});
  if(action.startsWith('dim-')){stop();l.dim=Number(action.slice(4));draw();return;}
  if(action==='pascal-n'){stop();l.n=Math.max(0,Math.min(8,Number(value)||0));patch({picture:pascal(),status:pascalStatus(),equation:sum().join(' + ')+' = '+total()});rangeOutput(String(l.n));return;}
  if(action==='pascal-play')play(async token=>{draw();const cells=Array.from({length:l.dim+1},(_,k)=>q(`pc-${l.n}-${k}`)).filter(Boolean);cells.forEach(c=>c.classList.remove('picked'));let total=0;
    for(let k=0;k<cells.length;k++){cells[k].classList.add('picked','active');total+=X.choose(l.n,k);say(`Running total: ${total}.`);await pause(600);if(token.cancel)return;cells[k].classList.remove('active');}
    draw();});
}

/* ---------- Project 2: chords of a circle and cuts in four dimensions ---------- */
// The circle is the pizza's disc. Each chord is the part of a line inside the disc, so the pizza's geometry counts the regions.
const CIRCLE_BOX='60 -10 300 300';
function chordLines(angles,n){return X.chords(angles,n).map(c=>c.line);}
// The picture after the first k chords among n points: regions, chords, crossings and numbered points. With `newest`,
// that chord is drawn red with its segments numbered.
function circleScene(angles,n,k,{newest=null,pieceIds='cr-p',hideFrom=null}={}){
  const lines=chordLines(angles,n),drawn=lines.slice(0,k),list=X.pieces(drawn);
  let body=`<circle cx="210" cy="140" r="117" fill="#f8fbfa" stroke="#9db8b0" stroke-width="2"/>${list.map((p,i)=>polygon(p.poly,PZ,`id="${pieceIds}${i}" fill="${colorFor(p.address)}" stroke="#ffffff" stroke-width="1.2"`)).join('')}`;
  body+=drawn.map((ln,i)=>lineTag(ln,PZ,`stroke="${i===newest?CUT:INK}" stroke-width="${i===newest?3:1.8}" stroke-linecap="round"`)).join('');
  body+=crossingPoints(drawn).map(p=>{const [x,y]=PZ(p);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${INK}"/>`;}).join('');
  if(newest!==null&&newest<k){const s=segmentsOf(drawn,newest);body+=s.segments.map((g,j)=>{const [x,y]=PZ(g.mid);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.5" fill="#ffffff" stroke="${CUT}" stroke-width="1.5"/><text x="${x.toFixed(1)}" y="${(y+3.8).toFixed(1)}" text-anchor="middle" class="x-badge-text">${j+1}</text>`;}).join('');}
  body+=angles.slice(0,hideFrom??n).map((a,i)=>{const [x,y]=PZ(X.point(a)),[tx,ty]=PZ(X.point(a).map(v=>v*1.13));return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${CUT}" stroke="#ffffff" stroke-width="1.5"/><text x="${tx.toFixed(1)}" y="${(ty+4.5).toFixed(1)}" text-anchor="middle" class="x-small">${i+1}</text>`;}).join('');
  return {body,list,lines};
}
// Animates chord k across the regions of the first k chords, from point `from` to its other end, splitting each region
// it passes. The scene must have been drawn with circleScene(…, k) and the overlay that this function adds.
function chordOverlay(lines,k){
  const {bounds,segments}=segmentsOf(lines,k),before=X.pieces(lines.slice(0,k)),line=lines[k];
  const parents=segments.map(s=>before.findIndex(p=>p.address===X.addressOf(s.mid,lines.slice(0,k))));
  const kids=parents.map(i=>X.split(before[i].poly,line).map((part,side)=>part&&{poly:part,address:before[i].address+(side?'+':'−')}).filter(Boolean));
  const svg=kids.map((pair,j)=>pair.map((c,s)=>polygon(c.poly,PZ,`id="cr-k${j}-${s}" fill="${colorFor(c.address)}" stroke="#ffffff" stroke-width="1.2" opacity="0"`)).join('')).join('')
    +lines.slice(0,k).map(ln=>lineTag(ln,PZ,`stroke="${INK}" stroke-width="1.8" stroke-linecap="round"`)).join('')
    +`<line id="cr-knife" stroke="${CUT}" stroke-width="3" stroke-linecap="round" x1="0" y1="0" x2="0" y2="0" opacity="0"/><circle id="cr-tip" r="5.5" fill="${CUT}" stroke="#ffffff" stroke-width="2" opacity="0"/>`
    +segments.map((s,j)=>{const [x,y]=PZ(s.mid);return bubble('cr-plus'+j,[x+(line.n[0]>0?13:-13),y-11],'+1');}).join('');
  return {svg,bounds,segments,parents,kids,before,line};
}
async function runChord(token,o,fromPoint){
  const ch=X.chord(o.line),forward=Math.hypot(...ch.at(-ch.half).map((v,i)=>v-fromPoint[i]))<Math.hypot(...ch.at(ch.half).map((v,i)=>v-fromPoint[i]));
  const order=forward?o.segments.map((_,j)=>j):o.segments.map((_,j)=>o.segments.length-1-j),knife=q('cr-knife'),tip=q('cr-tip');
  const start=PZ(ch.at(forward?-ch.half:ch.half));attr(knife,{x1:start[0],y1:start[1],x2:start[0],y2:start[1],opacity:1});attr(tip,{cx:start[0],cy:start[1],opacity:1});
  for(const j of order){
    const s=o.segments[j],[a,b]=forward?[s.from,s.to]:[s.to,s.from],parent=q('cr-p'+o.parents[j]);attr(parent,{fill:HOT});
    await animate(Math.max(260,700*Math.abs(b-a)/ch.half),t=>{const [x,y]=PZ(ch.at(a+t*(b-a)));attr(knife,{x2:x,y2:y});attr(tip,{cx:x,cy:y});});if(token.cancel)return false;
    attr(parent,{opacity:0});o.kids[j].forEach((c,side)=>attr(q(`cr-k${j}-${side}`),{opacity:1}));
    await pop('cr-plus'+j,token);if(token.cancel)return false;
  }
  return true;
}
function regionStatus(n,mode){
  if(mode==='hexagon'&&n===6)return 'Three chords meet at the center, so the six equally spaced points make only 30 regions.';
  if(n===1)return 'One point and no chords: the disc is 1 region.';
  if(n===2)return 'Point 2 added 1 chord, which split the disc into 2 regions.';
  const R=X.pieces(chordLines(mode==='hexagon'?X.HEXAGON:X.CIRCLE,n)).length,before=X.pieces(chordLines(mode==='hexagon'?X.HEXAGON:X.CIRCLE,n-1)).length;
  return `Point ${n} added ${n-1} chords, which added ${R-before} regions: ${R} in all.`;
}
// Step 1. Add points one at a time; each new point's chords split regions.
function circleLab(l,action){
  l.mode??='general';l.n??=1;
  const angles=l.mode==='hexagon'?X.HEXAGON:X.CIRCLE,max=angles.length;
  const triple=()=>l.mode==='hexagon'&&l.n===6?`<circle cx="210" cy="140" r="11" fill="none" stroke="${CUT}" stroke-width="3"/>`:'';
  const draw=(picture,status)=>{const R=X.pieces(chordLines(angles,l.n)).length;
    labShell({title:'Add points to the circle',views:views([['general','Points in general position'],['hexagon','Six equally spaced points']],l.mode),
      picture:svg(picture??circleScene(angles,l.n,X.choose(l.n,2)).body+triple(),`Circle picture. Points: ${l.n}. Regions: ${R}.`,280,CIRCLE_BOX),
      rows:[['Points',l.n,'cr-n'],['Chords',X.choose(l.n,2),'cr-c'],['Regions',R,'cr-r']],
      status:status??regionStatus(l.n,l.mode),caption:'Each new point is joined to every earlier point. Watch each new chord split the regions it passes through.',
      buttons:button('circle-next','Add the next point',{disabled:l.n>=max,primary:true})+button('circle-reset','Start over',{disabled:l.n<=1})});};
  if(!action){draw();return;}
  if(action.startsWith('view-')){stop();l.mode=action.slice(5);l.n=1;circleLab(l);return;}
  if(action==='circle-reset'){stop();l.n=1;draw();return;}
  if(action==='circle-next'&&l.n<max)play(async token=>{
    const n=l.n,lines=chordLines(angles,n+1),first=X.choose(n,2),from=X.point(angles[n]);l.n=n+1;
    const joining=`Point ${n+1} is added to the circle. It will be joined to ${n===1?'the first point':'the '+n+' earlier points'}.`;
    for(let k=first;k<lines.length;k++){
      const o=chordOverlay(lines,k);draw(circleScene(angles,n+1,k,{hideFrom:n+1}).body+o.svg,joining);
      setText('cr-c',k);setText('cr-r',o.before.length);
      if(!await runChord(token,o,from))return;setText('cr-c',k+1);setText('cr-r',o.before.length+o.segments.length);await pause(220);if(token.cancel)return;
    }
    draw();
  });
}
// Step 2. Draw the chords of n points one at a time, keeping the tally 1 + chords + crossings.
function chordLab(l,action,value){
  l.n??=5;l.m??=0;
  const lines=()=>chordLines(X.CIRCLE,l.n),total=()=>X.choose(l.n,2);
  const tally=()=>{const drawn=lines().slice(0,l.m),c=crossingPoints(drawn).length;return {c,R:1+l.m+c};};
  const content=()=>{const {c,R}=tally();return {picture:svg(circleScene(X.CIRCLE,l.n,l.m,{newest:l.m?l.m-1:null}).body,`Circle picture. Points: ${l.n}. Chords drawn: ${l.m}. Regions: ${R}.`,280,CIRCLE_BOX),
    rows:[['Chords drawn',`${l.m} of ${total()}`],['Crossings so far',c],['Regions, 1 + chords + crossings',R]],
    status:l.m?`1 + ${l.m} + ${c} = ${R} regions so far.`:'No chords yet: the disc is 1 region.'};};
  const draw=(body)=>{const c=content();labShell({title:'Draw the chords one at a time',...c,picture:body===undefined?c.picture:svg(body,`Circle picture. Points: ${l.n}. Chords drawn: ${l.m}. Regions: ${tally().R}.`,280,CIRCLE_BOX),
    legend:`<label class="x-range"><span>Number of points, n</span><input type="range" min="2" max="7" step="1" value="${l.n}" data-lab="chord-n" aria-valuetext="${l.n}"><output aria-live="off">${l.n}</output></label>`,
    caption:'A chord that crosses k earlier chords is cut into k + 1 segments, so it adds 1 region for itself and 1 for each crossing.',
    buttons:button('chord-next','Draw the next chord',{disabled:l.m>=total(),primary:true})+button('chord-all','Draw them all',{disabled:l.m>=total()})+button('chord-reset','Start over',{disabled:l.m===0})});};
  if(!action){draw();return;}
  if(action==='chord-n'){stop();l.n=Math.max(2,Math.min(7,Number(value)||2));l.m=0;patch(content());rangeOutput(String(l.n));
    for(const [a,on]of [['chord-next',true],['chord-all',true],['chord-reset',false]]){const b=document.querySelector(`#lab [data-lab="${a}"]`);if(b)b.disabled=!on;}return;}
  if(action==='chord-reset'){stop();l.m=0;draw();return;}
  if(action==='chord-all'){stop();l.m=total();draw();return;}
  if(action==='chord-next'&&l.m<total())play(async token=>{
    const k=l.m,all=lines(),o=chordOverlay(all,k),chord=X.chords(X.CIRCLE,l.n)[k];
    draw(circleScene(X.CIRCLE,l.n,k).body+o.svg);const crossed=o.segments.length-1;
    say(crossed===0?'This chord crosses no earlier chord, so it adds 1 region.':crossed===1?'This chord crosses 1 earlier chord, so it adds 2 regions.':`This chord crosses ${crossed} earlier chords, so it adds ${crossed+1} regions.`);
    if(!await runChord(token,o,X.point(X.CIRCLE[chord.from])))return;await pause(350);if(token.cancel)return;l.m=k+1;draw();
  });
}
// Step 3. Four points: the three pairings, and every crossing matched with its four points.
const FOURS=[[20,95,200,290],[60,110,250,330],[5,140,175,250],[80,150,215,345]];
function fourLab(l,action){
  l.view??='pairs';l.set??=0;l.shown??=0;l.k??=0;
  const pairs=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]],names='ABCD';
  const pairsPicture=()=>{const a=FOURS[l.set],pts=a.map(X.point);let body=`<circle cx="210" cy="140" r="117" fill="#f8fbfa" stroke="#9db8b0" stroke-width="2"/>`;
    pairs.slice(0,l.shown).forEach((pair,i)=>{const current=i===l.shown-1,color=['#5c7fb0','#c2553d','#7a5aa8'][i];
      body+=pair.map(([u,v])=>{const [x1,y1]=PZ(pts[u]),[x2,y2]=PZ(pts[v]);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${current?3.2:1.4}" stroke-dasharray="${current?'':'5 4'}" stroke-linecap="round" opacity="${current?1:.55}"/>`;}).join('');
      if(i===1){const ln=pair.map(([u,v])=>X.chordLine(a[u],a[v])),p=crossingPoints(ln)[0];if(p){const [x,y]=PZ(p);body+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${current?8:5}" fill="${CUT}" stroke="#ffffff" stroke-width="2"/>`;}}});
    body+=pts.map((p,i)=>{const [x,y]=PZ(p),[tx,ty]=PZ(p.map(v=>v*1.14));return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${INK}" stroke="#ffffff" stroke-width="1.5"/><text x="${tx.toFixed(1)}" y="${(ty+5).toFixed(1)}" text-anchor="middle" class="x-letter">${names[i]}</text>`;}).join('');
    return body;};
  const pairStatus=()=>l.shown===0?'Four points in order around the circle. Pair them in each of the three ways.':l.shown===1?'Opposite sides, which do not cross: AB, CD.':l.shown===2?'Diagonals, which cross inside the circle: AC, BD.':'Opposite sides, which do not cross: AD, BC. Only 1 of the 3 pairings has chords that cross.';
  const mapPicture=()=>{const n=6,lines=chordLines(X.CIRCLE,n),chords=X.chords(X.CIRCLE,n),pts=crossingPoints(lines);let body=circleScene(X.CIRCLE,n,lines.length).body;
    if(l.k>0){const p=pts[l.k-1],on=chords.filter(c=>Math.abs(X.dot(c.line.n,p)-c.line.d)<1e-9),ends=[...new Set(on.flatMap(c=>[c.from,c.to]))];
      body+=on.map(c=>lineTag(c.line,PZ,`stroke="${CUT}" stroke-width="3.2" stroke-linecap="round"`)).join('');
      body+=ends.map(i=>{const [x,y]=PZ(X.point(X.CIRCLE[i]));return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="none" stroke="${CUT}" stroke-width="2.2"/>`;}).join('');
      const [x,y]=PZ(p);body+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${CUT}" stroke="#ffffff" stroke-width="2"/>`;}
    return body;};
  const mapStatus=()=>{if(!l.k)return 'Six points. Match each crossing with the endpoints of its two chords.';const lines=chordLines(X.CIRCLE,6),p=crossingPoints(lines)[l.k-1],chords=X.chords(X.CIRCLE,6).filter(c=>Math.abs(X.dot(c.line.n,p)-c.line.d)<1e-9),ends=[...new Set(chords.flatMap(c=>[c.from,c.to]))].map(i=>i+1).sort((a,b)=>a-b);
    return `Crossing ${l.k} of ${crossingPoints(lines).length}: points ${ends.join(', ')}.`;};
  const viewList=views([['pairs','Three pairings'],['map','Crossings and their points']],l.view);
  const draw=()=>{
    if(l.view==='pairs')labShell({title:'Pair four points in every way',views:viewList,picture:svg(pairsPicture(),'Four points A, B, C and D on a circle, joined in pairs',280,CIRCLE_BOX),
      rows:[['Pairings shown',`${l.shown} of 3`],['Pairings whose chords cross',l.shown>=2?1:0]],status:pairStatus(),
      caption:'Solid chords show the pairing just drawn; dashed chords show the earlier ones.',
      buttons:button('pairs-play','Show the three pairings',{primary:true})+button('pairs-new','Try four other points')});
    else labShell({title:'Every crossing has its own four points',views:viewList,picture:svg(mapPicture(),l.k?mapStatus():'Six points on a circle with all chords',280,CIRCLE_BOX),
      rows:[['Crossings matched',l.k],['Sets of four points, C(6, 4)',X.choose(6,4)]],status:mapStatus(),
      caption:'Each crossing lies on two chords, and their four endpoints are different. Different crossings have different sets of four points.',
      buttons:button('map-play','Match every crossing',{primary:true})+button('map-next','Next crossing',{disabled:l.k>=15})+button('map-reset','Start over',{disabled:l.k===0})});
  };
  if(!action){draw();return;}
  if(action.startsWith('view-')){stop();l.view=action.slice(5);draw();return;}
  if(action==='pairs-new'){stop();l.set=(l.set+1)%FOURS.length;l.shown=0;draw();return;}
  if(action==='pairs-play')play(async token=>{for(let i=1;i<=3;i++){l.shown=i;draw();await pause(1100);if(token.cancel)return;}});
  if(action==='map-reset'){stop();l.k=0;draw();return;}
  if(action==='map-next'&&l.k<15){stop();l.k++;draw();return;}
  if(action==='map-play')play(async token=>{for(let k=1;k<=15;k++){l.k=k;draw();await pause(520);if(token.cancel)return;}});
}
// Step 4. One row for each dimension: each number is the number to its left plus the number above that one.
const DIMENSIONS=['Point, 0 dimensions','Stick, 1 dimension','Pizza, 2 dimensions','Ball, 3 dimensions','Four dimensions, H(n)'];
function tableLab(l,action){
  l.cols??=1;
  const value=(d,n)=>Array.from({length:d+1},(_,k)=>X.choose(n,k)).reduce((a,b)=>a+b,0),N=8;
  const grid=()=>`<div class="x-dim" style="--cells:${N}"><p class="x-diff-name">Number of cuts, n</p><p class="x-dim-head" aria-hidden="true">${Array.from({length:N},(_,n)=>`<span>${n}</span>`).join('')}</p>${DIMENSIONS.map((name,d)=>`<p class="x-diff-name">${esc(name)}</p><div class="x-dim-row">${Array.from({length:N},(_,n)=>{const shown=n<l.cols||d===0;return `<span class="x-dim-cell${shown?' shown':''}${d===4?' last':''}"${shown?'':' aria-hidden="true"'} id="dm-${d}-${n}">${value(d,n)}</span>`;}).join('')}</div>`).join('')}</div>`;
  const status=()=>l.cols<=1?'Column 0: before any cut, every dimension has 1 piece. A point is always 1 piece.':`Columns 0 to ${l.cols-1} are filled. The last row gives H(n) for four dimensions.`;
  const draw=()=>labShell({title:'One row for each dimension',picture:grid(),status:status(),
    caption:'A new cut adds as many pieces as its face has, and its face is one dimension lower: so each number is the number to its left plus the number above that one.',
    buttons:button('table-next','Fill the next column',{disabled:l.cols>=N,primary:true})+button('table-fill','Fill the whole table',{disabled:l.cols>=N})+button('table-reset','Start over',{disabled:l.cols<=1})});
  if(!action){draw();return;}
  if(action==='table-reset'){stop();l.cols=1;draw();return;}
  if(action==='table-fill'){stop();l.cols=N;draw();return;}
  if(action==='table-next'&&l.cols<N)play(async token=>{
    const n=l.cols;draw();
    for(let d=1;d<DIMENSIONS.length;d++){const left=q(`dm-${d}-${n-1}`),above=q(`dm-${d-1}-${n-1}`),cell=q(`dm-${d}-${n}`);[left,above].forEach(c=>c?.classList.add('parent'));
      say(`${value(d,n-1)} + ${value(d-1,n-1)} = ${value(d,n)}.`);await pause(520);if(token.cancel)return;
      cell?.classList.add('shown');cell?.removeAttribute('aria-hidden');[left,above].forEach(c=>c?.classList.remove('parent'));await pause(160);if(token.cancel)return;}
    l.cols=n+1;draw();
  });
}
// Step 5. Pascal's rule turns the five numbers of row n − 1 into C(n, 0), C(n, 2) and C(n, 4).
function pairLab(l,action,value){
  l.n??=6;l.done??=false;
  const row=r=>Array.from({length:r+1},(_,k)=>X.choose(r,k)),group=k=>k===0?'a':k<=2?'b':k<=4?'c':'out';
  const picture=()=>{const rows=Array.from({length:10},(_,r)=>row(r));
    return `<div class="x-pascal x-pairs" role="img" aria-label="Pascal’s triangle, rows 0 to 9, with row ${l.n-1} grouped in pairs">${rows.map((vals,r)=>`<div class="x-pascal-row" style="--cells:20">${vals.map((v,k)=>{let cls='';if(r===l.n-1)cls=' g-'+group(k);if(r===l.n&&[0,2,4].includes(k))cls=' t-'+({0:'a',2:'b',4:'c'})[k]+(l.done?' lit':'');return `<span class="x-pascal-cell${cls}" id="pp-${r}-${k}" style="grid-column:${9-r+2*k+1}/span 2">${v}</span>`;}).join('')}</div>`).join('')}</div>`;};
  const prev=()=>row(l.n-1),H=()=>prev().slice(0,5).reduce((a,b)=>a+b,0),R=()=>1+X.choose(l.n,2)+X.choose(l.n,4);
  const equation=()=>{const p=prev(),t=k=>p[k]??0;return `${t(0)} + (${t(1)} + ${t(2)}) + (${t(3)} + ${t(4)}) = 1 + ${X.choose(l.n,2)} + ${X.choose(l.n,4)} = ${H()}`;};
  const status=()=>l.n>5?`Points: ${l.n}. Row ${l.n-1} has ${l.n} numbers and the sum uses only the first five, so R(${l.n}) = ${H()}, not ${2**(l.n-1)}.`:`Points: ${l.n}. Row ${l.n-1} has ${l.n} numbers and the sum uses all of them, so R(${l.n}) = ${H()}, a power of 2.`;
  const draw=()=>labShell({title:'Pair the numbers with Pascal’s rule',picture:picture(),
    legend:`<label class="x-range"><span>Number of points, n</span><input type="range" min="2" max="9" step="1" value="${l.n}" data-lab="pair-n" aria-valuetext="${l.n}"><output aria-live="off">${l.n}</output></label><p class="lab-equation" data-no-translate>${equation()}</p>`,
    status:status(),caption:'Same color, same sum: each pair in row n − 1 adds up to the number below it in row n, by Pascal’s rule.',
    buttons:button('pair-play','Add the pairs',{primary:true})});
  if(!action){draw();return;}
  if(action==='pair-n'){stop();l.n=Math.max(2,Math.min(9,Number(value)||2));l.done=false;patch({picture:picture(),status:status(),equation:equation()});rangeOutput(String(l.n));return;}
  if(action==='pair-play')play(async token=>{l.done=false;draw();
    for(const [g,k]of [['a',0],['b',2],['c',4]]){const from=[...document.querySelectorAll('#lab .g-'+g)],to=q(`pp-${l.n}-${k}`);from.forEach(c=>c.classList.add('active'));await pause(650);if(token.cancel)return;to?.classList.add('lit','active');from.forEach(c=>c.classList.remove('active'));await pause(450);if(token.cancel)return;to?.classList.remove('active');}
    l.done=true;draw();});
}
// Step 6. The difference table of the circle counts reaches the ball, the pizza, the stick and then constant 1s.
const CIRCLE_COUNTS=[1,2,4,8,16,31,57,99,163];
function differenceLab(l,action){
  // Rows are named by order, not by what they turn out to be, since step 6 asks which counts they are.
  const names=['Points on a circle, R(n)','First differences','Second differences','Third differences','Fourth differences'];
  const rows=[CIRCLE_COUNTS];while(rows.length<5){const r=rows[rows.length-1];rows.push(r.slice(1).map((v,i)=>v-r[i]));}
  const draw=()=>labShell({title:'Build the difference table',picture:diffTable(rows,names,l.built,'cd'),
    status:l.built?'The first differences are the ball counts, then come the pizza and stick counts, and the fourth differences are all 1.':'Start from the regions for 1 to 9 points.',
    caption:'Each number in a lower row is the difference of the two numbers just above it.',
    buttons:button('diff-build','Build the table',{primary:true})+button('diff-all','Show it all at once')});
  if(!action){draw();return;}
  if(action==='diff-all'){stop();l.built=true;draw();return;}
  if(action==='diff-build')play(async token=>{l.built=false;draw();if(await buildDiff(token,rows,'cd')){l.built=true;draw();}});
}

document.addEventListener('input',e=>{if(e.target.dataset?.field&&(e.target.tagName==='TEXTAREA'||e.target.type==='text'))recordInput(e.target);else if(e.target.dataset?.lab&&e.target.type==='range')labAction(e.target.dataset.lab,e.target.value);});
document.addEventListener('change',e=>{if(e.target.dataset?.field&&e.target.type==='radio')recordInput(e.target);});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.project)selectProject(b.dataset.project);
  else if(b.dataset.step!==undefined){moveStep(Number(b.dataset.step));document.querySelector(`[data-step="${b.dataset.step}"]`)?.focus({preventScroll:true});}
  else if(b.dataset.lab)labAction(b.dataset.lab);
  else if(b.id==='lab-skip')skip();
  else if(b.id==='check')checkStep();else if(b.id==='prev')moveStep(stepIndex()-1);
  else if(b.id==='next'){if(stepIndex()===current().steps.length-1)showSession(true);else moveStep(stepIndex()+1);}
  else if(['session','review-session','review-top'].includes(b.id))showSession();
  else if(b.id==='close-modal')$('modal').close();else if(b.id==='export')exportSession();else if(b.id==='export-original')exportOriginal();
  else if(b.id==='reset-open')showModal('Reset cross-disciplinary projects?',`<p>This clears only your cross-disciplinary project responses. You can export your current notes and the previously saved original first.</p><div class="modal-actions"><button id="export">Export current notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button class="primary" id="reset-confirm">Clear cross-disciplinary responses</button><button id="reset-cancel">Keep my work</button></div>`);
  else if(b.id==='reset-cancel')showSession();else if(b.id==='reset-confirm'){if(saveBlocked){try{if(storage.getItem(KEY)!==lastStored){toast('The saved original changed. Reload before resetting.');return;}storage.removeItem(KEY);blockedOriginal=null;lastStored=null;saveBlocked=false;}catch{toast('The original could not be cleared. Your work is kept.');return;}}state={version:1,project:current().id,steps:{},answers:{},checks:{},attempts:[]};persist();renderRoute();renderProject();$('modal').close();toast('Your cross-disciplinary responses have been cleared.');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&projects.length)persist();});
window.addEventListener('pagehide',()=>{if(projects.length)persist();});
window.addEventListener('beforeunload',event=>{if(unsavedWork&&(saveBlocked||!storeAvailable)){event.preventDefault();event.returnValue='';}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
async function boot(){
  try{const r=await fetch('data.json?v=cross-disciplinary-20261031');if(!r.ok)throw Error('Content request failed');projects=await r.json();if(!projects.length)throw Error('Content missing');restore();
    const asked=new URLSearchParams(location.search).get('project');if(projects.some(p=>p.id===asked))state.project=asked;
    renderRoute();renderProject();$('loading').hidden=true;$('app').hidden=false;}
  catch{$('loading').innerHTML='The project content could not be loaded. <button id="reload">Try loading again</button>';document.getElementById('reload').addEventListener('click',()=>location.reload());}
}
boot();
