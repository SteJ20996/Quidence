'use strict';
const C=NTCore,R=PRCore,storage={getItem:k=>(window.QuidenceStorage||window.localStorage).getItem(k),setItem:(k,v)=>(window.QuidenceStorage||window.localStorage).setItem(k,v),removeItem:k=>(window.QuidenceStorage||window.localStorage).removeItem(k)},KEY='quidence:probability:v1';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={'pr-p01':'De Méré’s dice','pr-p02':'The problem of points','pr-p03':'A positive test','pr-p04':'Boxes and doors','pr-p05':'Shared birthdays','pr-p06':'Cards in place','pr-p07':'Waiting for a six','pr-p08':'Collecting stickers','pr-p09':'The Galton board','pr-p10':'The law of large numbers'};
// Each opening banner poses the project's question; none states an answer that a step asks for.
const banners={'pr-p01':'P(at least one six in 4 rolls)  vs  P(at least one double six in 24 rolls)','pr-p02':'A needs a, B needs b: who should get the pot?','pr-p03':'P(sick | positive) = ?','pr-p04':'Gold box · silver box · mixed box','pr-p05':'23 people, 365 days: a shared birthday?','pr-p06':'E[number of cards in place] = ?','pr-p07':'P(T = k) = (5/6)ᵏ⁻¹ × 1/6','pr-p08':'Rolls until every face has appeared = ?','pr-p09':'P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ','pr-p10':'P(|X̄ − 1/2| ≥ ε) → 0'};
let projects=[],state={version:1,project:'pr-p01',steps:{},answers:{},checks:{},attempts:[]},saveTimer,toastTimer,storeAvailable=true,blockedOriginal=null,lastStored=null,saveBlocked=false,blockedReason='unreadable',unsavedWork=false,labState={};
function current(){return projects.find(p=>p.id===state.project)||projects[0];}
function stepIndex(){return Math.min(current().steps.length-1,Math.max(0,Number(state.steps[current().id])||0));}
function key(p,step,f){return `${p.id}:${step}:${f.id}`;}
function valueOf(p,step,f){return state.answers[key(p,step,f)]??(f.type==='multi'?[]:'');}
function displayAnswer(f,v){return f.type==='multi'?v.map(x=>f.options.find(o=>o.value===x)?.label||x).join(', '):f.type==='choice'?(f.options.find(o=>o.value===v)?.label||v):v;}
function answered(p){return p.steps.filter((st,i)=>st.fields.every(f=>C.filled(f,valueOf(p,i,f)))).length;}
function paragraphs(text,math=false){return String(text).split(/\n\s*\n/).filter(Boolean).map(t=>`<p${math&&t.length<150&&/[=≡]/.test(t)&&!/[.!?]$/.test(t)?' class="math-line"':''}>${esc(t)}</p>`).join('');}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function blockedMessage(){return blockedReason==='conflict'?'Saved work changed in another tab. Export your current notes before reloading; new edits are not saved.':'The saved original is unreadable. Export your current notes and the saved original before resetting; new edits are not saved.';}
function persist(){clearTimeout(saveTimer);if(saveBlocked){$('save-status').textContent=blockedMessage();return;}try{const live=storage.getItem(KEY);if(live!==lastStored){blockedOriginal=live;lastStored=live;saveBlocked=true;blockedReason='conflict';$('save-status').textContent=blockedMessage();return;}const serialized=JSON.stringify(state);storage.setItem(KEY,serialized);lastStored=serialized;storeAvailable=true;unsavedWork=false;$('save-status').textContent='Draft saved on this device.';}catch{storeAvailable=false;$('save-status').textContent='Could not save locally. Export your session to keep a copy.';}}
function queueSave(){unsavedWork=true;clearTimeout(saveTimer);saveTimer=setTimeout(persist,180);}
function restore(){
  try{const raw=storage.getItem(KEY);lastStored=raw;if(raw===null)return;blockedOriginal=raw;saveBlocked=true;const d=JSON.parse(raw);if(!d||d.version!==1||!d.answers||!d.steps||!d.checks||!Array.isArray(d.attempts))throw Error('Unreadable record');
    const p=projects.find(p=>p.id===d.project);if(p)state.project=p.id;
    for(const p of projects){const i=d.steps?.[p.id];if(Number.isInteger(i)&&i>=0&&i<p.steps.length)state.steps[p.id]=i;
      p.steps.forEach((s,i)=>s.fields.forEach(f=>{const k=key(p,i,f),a=d.answers?.[k];if(f.type==='multi'&&Array.isArray(a)&&a.every(v=>typeof v==='string'))state.answers[k]=a;else if(f.type!=='multi'&&typeof a==='string')state.answers[k]=a.slice(0,f.type==='reason'?24000:80);
        const ck=d.checks?.[k];if(ck&&typeof ck.status==='string'&&typeof ck.text==='string'&&['empty','pending','correct','retry','format'].includes(ck.status))state.checks[k]=ck;
      }));
    }
    if(Array.isArray(d.attempts))state.attempts=d.attempts.filter(a=>a&&typeof a.project==='string'&&Number.isInteger(a.step)&&typeof a.time==='string'&&Array.isArray(a.results));blockedOriginal=null;saveBlocked=false;
  }catch{$('save-status').textContent=blockedMessage();}
}
function renderRoute(){
  $('route').innerHTML=projects.map((p,i)=>`<button class="route-item" data-project="${p.id}" aria-current="${p.id===current().id}"><span class="route-number">${String(i+1).padStart(2,'0')}</span><span><span class="route-name">${esc(names[p.id])}</span><span class="route-sub" data-progress="${p.id}">${p.level.startsWith('High')?'High school':p.level.startsWith('Bridge')?'Bridge to university':'University'} · ${answered(p)}/${p.steps.length} responses</span></span></button>`).join('');
  $('project-select').innerHTML=projects.map((p,i)=>`<option value="${p.id}">${i+1}. ${esc(names[p.id])}</option>`).join('');$('project-select').value=current().id;
}
function updateProgress(){
  for(const p of projects){const el=document.querySelector(`[data-progress="${p.id}"]`);if(el)el.textContent=`${p.level.startsWith('High')?'High school':p.level.startsWith('Bridge')?'Bridge to university':'University'} · ${answered(p)}/${p.steps.length} responses`;}
  const p=current(),n=answered(p);if($('progress-copy'))$('progress-copy').textContent=`${n} of ${p.steps.length} steps have responses`;
  if($('progress-fill'))$('progress-fill').style.width=`${100*n/p.steps.length}%`;
  p.steps.forEach((s,i)=>{const b=document.querySelector(`[data-step="${i}"]`);if(b)b.classList.toggle('done',s.fields.every(f=>C.filled(f,valueOf(p,i,f))));});
}
function renderProject(){
  const p=current(),idx=stepIndex();
  document.querySelectorAll('[data-project]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.project===p.id)));$('project-select').value=p.id;
  $('project-head').innerHTML=`<div class="project-meta"><span class="badge">${esc(p.level)}</span><span class="badge gray">${p.steps.length} steps</span><span class="badge gray">${esc(p.difficulty)}</span></div><h2>${esc(p.title)}</h2><p>${esc(p.prompt)}</p><div class="project-progress"><span class="track"><i id="progress-fill" style="width:${100*answered(p)/p.steps.length}%"></i></span><span id="progress-copy">${answered(p)} of ${p.steps.length} steps have responses</span></div>`;
  $('step-nav').innerHTML=p.steps.map((s,i)=>`<button class="step-tab ${s.fields.every(f=>C.filled(f,valueOf(p,i,f)))?'done':''}" data-step="${i}" aria-current="${idx===i?'step':'false'}" aria-label="Step ${i+1}">${idx===i?'<small>Step</small> ':''}${i+1}</button>`).join('');
  $('approach-copy').innerHTML=paragraphs(p.approach);$('uses').textContent=p.uses;$('approach').open=false;
  renderWork();renderLab();
}
function fieldHtml(f,p,idx){
  const val=valueOf(p,idx,f),k=key(p,idx,f),id=`f-${f.id}`,feedback=state.checks[k];
  const fb=`<div class="feedback ${feedback?.status||''}" id="feedback-${f.id}" aria-live="polite">${esc(feedback?.text||'')}</div>`;
  if(f.type==='number')return `<div class="field"><label for="${id}">${esc(f.label)}</label><input id="${id}" type="text" inputmode="text" maxlength="80" autocomplete="off" data-field="${f.id}" value="${esc(val)}" placeholder="Your answer" aria-describedby="feedback-${f.id}">${f.minDecimalPlaces===2?'<p class="field-note">Exact fractions or decimals correctly rounded to at least two places are accepted.</p>':''}${f.accepted.includes('X')?'<p class="field-note">The check value 10 may be written as X.</p>':''}${fb}</div>`;
  if(f.type==='reason')return `<div class="field wide"><label for="${id}">${esc(f.label)}</label><textarea data-speech-explanation id="${id}" data-field="${f.id}" maxlength="24000" placeholder="State your claim. Explain each step. Say where the conditions matter." aria-describedby="feedback-${f.id}">${esc(val)}</textarea><p class="field-note">Your explanation is saved for review. It is not automatically marked correct.</p>${fb}</div>`;
  return `<fieldset class="field wide"><legend>${esc(f.label)}</legend><div class="answer-options">${C.orderedOptions(f,key(p,idx,f)).map((o,i)=>`<label class="option" for="${id}-${i}"><input id="${id}-${i}" type="${f.type==='multi'?'checkbox':'radio'}" name="${id}" data-field="${f.id}" value="${esc(o.value)}" ${f.type==='multi'?(val.includes(o.value)?'checked':''):(val===o.value?'checked':'')}><span>${esc(o.label)}</span></label>`).join('')}</div>${fb}</fieldset>`;
}
function renderWork(){
  const p=current(),idx=stepIndex(),s=p.steps[idx];
  const criteria=s.fields.filter(f=>f.type==='reason').map(f=>`<div class="criteria-card"><h4>${esc(f.label)} · Self-check</h4><ul>${f.criteria.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>${f.followup?`<p style="margin-top:12px">One more question: ${esc(f.followup)}</p>`:''}</div>`).join('');
  $('work').innerHTML=`<div class="step-kicker"><span>STEP ${idx+1} OF ${p.steps.length}</span><span>${s.fields.some(f=>f.type==='reason')?'Explain your reasoning':'Start with a concrete case'}</span></div><h3>${esc(s.title)}</h3><p class="step-prompt">${esc(s.prompt)}</p>${idx===0?`<div class="math-banner">${esc(banners[p.id])}</div>`:''}<div class="fields">${s.fields.map(f=>fieldHtml(f,p,idx)).join('')}</div><p class="check-note" id="check-summary" role="status">Calculations and choices can be checked. Proofs stay open for review.</p><div class="action-row"><button class="primary" id="check">Check this step</button><div class="action-right"><button class="quiet" id="prev" ${idx===0?'disabled':''}>← Back</button><button id="next">${idx===p.steps.length-1?'Project notes ↗':'Next step →'}</button></div></div><details class="proof-panel" id="proof"><summary>See the full proof</summary><div class="proof-content"><p class="proof-label">REFERENCE PROOF · STEP ${idx+1}</p>${paragraphs(s.proof,true)}${criteria}${idx===p.steps.length-1?`<div class="next-challenge"><span>TAKE THE IDEA ONE STEP FURTHER</span>${esc(p.nextCheck)}</div>`:''}</div></details>`;
}
function selectProject(id){if(!projects.some(p=>p.id===id))return;state.project=id;persist();renderProject();}
function moveStep(i){const p=current();if(i<0||i>=p.steps.length)return;state.steps[p.id]=i;persist();renderProject();$('work').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function recordInput(el){
  const p=current(),i=stepIndex(),s=p.steps[i],f=s.fields.find(f=>f.id===el.dataset.field);if(!f)return;
  let val=el.value;if(f.type==='multi')val=[...$('work').querySelectorAll(`input[data-field="${f.id}"]:checked`)].map(e=>e.value);
  state.answers[key(p,i,f)]=val;delete state.checks[key(p,i,f)];const fb=$('feedback-'+f.id);fb.textContent='';fb.className='feedback';$('check-summary').textContent='Response updated. Check this step when you are ready.';updateProgress();queueSave();
}
function checkStep(){
  const p=current(),i=stepIndex(),s=p.steps[i];let good=0,objective=0,pending=0,empty=0;
  const results=s.fields.map(f=>{const val=valueOf(p,i,f),g=C.grade(f,val);state.checks[key(p,i,f)]=g;const el=$('feedback-'+f.id);el.textContent=g.text;el.className='feedback '+g.status;if(g.status==='empty')empty++;if(f.type!=='reason'){objective++;if(g.status==='correct')good++;}else if(g.status==='pending')pending++;return {field:f.id,value:val,status:g.status};});
  let learningRequest=null;try{const g=JSON.parse(storage.getItem('cluevera_learning_goal_v1')||'null');if(g?.subject==='probability'&&g.includeInReport===true&&typeof g.text==='string')learningRequest={text:g.text,capturedAt:new Date().toISOString()};}catch{}
  state.attempts.push({project:p.id,step:i,time:new Date().toISOString(),results,learningRequest});persist();
  $('check-summary').textContent=[objective?`${good} of ${objective} calculations or choices match.`:'',pending?`${pending} explanation${pending===1?'':'s'} saved for review.`:'',empty?`${empty} response${empty===1?'':'s'} still open.`:''].filter(Boolean).join(' ');
  if(!empty)document.querySelector(`[data-step="${i}"]`).classList.add('done');
}
function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;$('modal').showModal();}
function showToolkit(){
  const proofs=[
    ['The rules of probability','For events in a finite space of equally likely outcomes, P(A) = (outcomes in A)/(all outcomes). Then P(not A) = 1 − P(A), and P(A or B) = P(A) + P(B) − P(A and B).',
      'Every outcome is either in A or not, so the counts of A and of not A add up to all outcomes; dividing by that total gives P(A) + P(not A) = 1.',
      'Counting the outcomes of A and then those of B counts the outcomes in both twice, so subtract them once: |A or B| = |A| + |B| − |A and B|. Divide by the total. When A and B cannot happen together, P(A or B) = P(A) + P(B). ∎'],
    ['Conditional probability and independence','P(A | B) = P(A and B)/P(B) when P(B) > 0, so P(A and B) = P(A | B) P(B). Events A and B are independent when P(A and B) = P(A) P(B).',
      'Knowing that B happened restricts attention to the outcomes in B. Among them, the outcomes of A are those in A and B, so the share of A is |A and B|/|B| = P(A and B)/P(B). Multiplying by P(B) gives the multiplication rule.',
      'Independence means that knowing B does not change the chance of A: P(A | B) = P(A). Separate rolls of a die, separate tosses of a coin and separate bounces on a Galton board are modeled as independent, so their probabilities multiply. ∎'],
    ['Bayes’ rule','If B₁, …, Bₖ are disjoint and one of them always happens, then P(A) = Σ P(A | Bᵢ) P(Bᵢ), and P(Bⱼ | A) = P(A | Bⱼ) P(Bⱼ) / Σ P(A | Bᵢ) P(Bᵢ).',
      'A happens together with exactly one of the Bᵢ, so P(A) is the sum of the P(A and Bᵢ) = P(A | Bᵢ) P(Bᵢ). This is the law of total probability.',
      'By the definition of conditional probability, P(Bⱼ | A) = P(A and Bⱼ)/P(A) = P(A | Bⱼ) P(Bⱼ)/P(A). Replace P(A) by the total from the first part. ∎'],
    ['Linearity of expectation','A random variable X assigns a number to each outcome, and E[X] = Σ x P(X = x). For any random variables X and Y and numbers a and b, E[aX + bY] = a E[X] + b E[Y], whether or not X and Y are independent.',
      'In a finite space, E[X] is also the sum of X(ω) P(ω) over the outcomes ω, because grouping the outcomes by the value of X gives the first formula. Then E[aX + bY] = Σ (a X(ω) + b Y(ω)) P(ω) = a Σ X(ω) P(ω) + b Σ Y(ω) P(ω).',
      'No independence was used. For independent X and Y, variances also add: Var(X + Y) = Var(X) + Var(Y), because the cross term 2(E[XY] − E[X]E[Y]) is 0. ∎']
  ];
  showModal('Proof toolkit',`<p>These four foundation results are used throughout the projects. You can return to them whenever a step uses a rule you have not met before.</p><div>${proofs.map((a,i)=>`<details class="tool-proof" ${i===0?'open':''}><summary>${esc(a[0])}</summary><div>${a.slice(1).map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div>`);
}
function totals(){let objective=0,correct=0,pending=0,responses=0;for(const p of projects)p.steps.forEach((s,i)=>s.fields.forEach(f=>{const k=key(p,i,f),v=valueOf(p,i,f);if(C.filled(f,v)){responses++;if(f.type==='reason')pending++;else objective++;}if(f.type!=='reason'&&state.checks[k]?.status==='correct')correct++;}));return {objective,correct,pending,responses};}
function showSession(projectOnly=false){
  const t=totals(),ps=projectOnly?[current()]:projects;let entries='';
  for(const p of ps)p.steps.forEach((s,i)=>{const rows=s.fields.filter(f=>C.filled(f,valueOf(p,i,f))).map(f=>{const k=key(p,i,f),v=valueOf(p,i,f),g=state.checks[k];const st=f.type==='reason'?'Pending proof review':g?.status==='correct'?'Checked calculation / choice':g?.status==='retry'||g?.status==='format'?'Revisit this response':'Draft response';return `<div class="session-item"><span class="session-state ${f.type==='reason'?'pending':g?.status==='retry'?'retry':''}">${st}</span><h3>${esc(f.label)}</h3><p ${['reason','number'].includes(f.type)?'data-no-translate class="student-work"':'class="session-choice"'}>${esc(displayAnswer(f,v))}</p></div>`;});if(rows.length)entries+=`<h3 style="margin-top:23px;font-weight:550">${esc(names[p.id])} · Step ${i+1}</h3>${rows.join('')}`;});
  showModal(projectOnly?'Your project notes':'Your probability session',`<p>This is a record of your actual responses. Matching a calculation does not establish mastery, and explanations remain pending review.</p><div class="summary-stats"><div><span>${t.responses}</span>Responses saved</div><div><span>${t.correct}</span>Calculations / choices matched</div><div><span>${t.pending}</span>Explanations to review</div></div>${entries||'<p>No responses yet. Try a step, then return here to see your work.</p>'}<div class="modal-actions"><button class="primary" id="export">Export session notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button id="reset-open">Reset Probability</button></div>`);
}
function sessionMarkdown(){
  const t=s=>window.QuidenceI18n?.text(s)||s;
  const status=s=>t(({correct:'Checked calculation / choice',pending:'Pending proof review',retry:'Revisit this response',format:'Check the response format',empty:'No response yet',Draft:'Draft response'})[s]||'Draft response');
  const response=(f,v)=>f.type==='choice'?t(displayAnswer(f,v)):f.type==='multi'?v.map(x=>t(f.options.find(o=>o.value===x)?.label||x)).join(', '):v;
  let text='# Quidence · '+t('Probability')+'\n\n'+t('Responses and reasoning from this browser. Proofs are pending review; numerical matches are not mastery judgments.')+'\n';
  if(saveBlocked||!storeAvailable)text+='\n'+t('These notes include current work that could not be saved in this browser. The previously saved record is kept separately.')+'\n';
  for(const p of projects){let body='';p.steps.forEach((s,i)=>{for(const f of s.fields){const v=valueOf(p,i,f);if(C.filled(f,v)){const g=state.checks[key(p,i,f)];body+=`\n### ${t('Step')} ${i+1} · ${t(s.title)}\n\n${t(f.label)}\n\n${response(f,v)}\n\n${t('Response status')}: ${status(f.type==='reason'?'pending':g?.status||'Draft')}\n`;}}});if(body)text+=`\n## ${t(p.title)}\n${body}`;}
  if(state.attempts.length){text+='\n## '+t('Check history')+'\n\n'+t('Each check preserves the responses supplied at that time.')+'\n';for(const a of state.attempts){const p=projects.find(p=>p.id===a.project);if(!p||!p.steps[a.step])continue;text+=`\n### ${a.time} · ${t(p.title)} · ${t('Step')} ${a.step+1}\n`;if(a.learningRequest?.text)text+='\n'+t('Learning request included with this check (original wording):')+'\n\n'+a.learningRequest.text+'\n';for(const r of a.results){const f=p.steps[a.step].fields.find(f=>f.id===r.field);if(f&&C.filled(f,r.value))text+=`\n${t(f.label)}\n\n${response(f,r.value)}\n\n${t('Response status')}: ${status(r.status)}\n`;}}}
  return text;
}
function downloadNotes(text,name,type){try{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;}catch{toast('The download could not start. Your current notes are still visible.');return false;}}
function exportSession(){persist();if(downloadNotes(sessionMarkdown(),'Quidence-probability-session.md','text/markdown;charset=utf-8'))toast('Your current session notes have been exported.');}
function exportOriginal(){if(blockedOriginal===null)return;let json=true;try{JSON.parse(blockedOriginal);}catch{json=false;}if(downloadNotes(blockedOriginal,'Quidence-probability-saved-original.'+(json?'json':'txt'),json?'application/json':'text/plain;charset=utf-8'))toast('The previously saved original has been exported separately.');}

function svg(body,label,height=235){return `<svg class="lab-svg" viewBox="0 0 330 ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>`;}
function labButton(action,label,disabled=false,pressed=null){return `<button data-lab="${action}" ${disabled?'disabled':''}${pressed===null?'':` aria-pressed="${pressed}"`}>${label}</button>`;}
const INK='#173f42',MUTED='#526b7c',GREEN='#2f8a62',CORAL='#c2553d',GOLD='#d39b2a',PALE='#e7f1ec',LINE='#9db8b0';
const txt=(x,y,s,extra='')=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="11" fill="${MUTED}" ${extra}>${s}</text>`;
const status=lines=>`<div class="lab-status">${lines.filter(Boolean).map(t=>`<span class="lab-line">${t}</span>`).join('')}</div>`;
const caption=t=>`<p class="lab-caption">${t}</p>`;
const buttons=list=>`<div class="lab-buttons">${list.join('')}</div>`;
// Bars on a shared baseline: values, optional expected values drawn as outlines, labels under the bars.
function bars(values,{x0=34,width=286,base=200,top=40,max,labels,expected=null,highlight=-1}){
  const n=values.length,step=width/n,w=Math.min(26,step*0.7),scale=v=>(base-top)*Math.min(v,max)/max;let body=`<line x1="${x0-4}" y1="${base}" x2="${x0+width}" y2="${base}" stroke="${LINE}"/>`;
  values.forEach((v,i)=>{const x=x0+i*step+(step-w)/2;body+=`<rect x="${x.toFixed(1)}" y="${(base-scale(v)).toFixed(1)}" width="${w.toFixed(1)}" height="${scale(v).toFixed(1)}" rx="2" fill="${i===highlight?CORAL:GREEN}" opacity=".85"/>`;
    if(expected)body+=`<rect x="${x.toFixed(1)}" y="${(base-scale(expected[i])).toFixed(1)}" width="${w.toFixed(1)}" height="${scale(expected[i]).toFixed(1)}" rx="2" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-dasharray="3 2"/>`;
    body+=txt((x+w/2).toFixed(1),base+14,labels[i],'text-anchor="middle"');});
  return body;
}
const expectedKey=label=>`<div class="lab-key"><span><i class="key-bar"></i>${label}</span><span><i class="key-ghost"></i>Expected</span></div>`;
function renderLab(){
  const id=current().id,l=labState[id]||(labState[id]={});let html='',title='Explore the idea';
  if(id==='pr-p01'){
    l.view??='grid';l.event??=null;l.n??=4;
    if(l.view==='grid'){
      title='All the ordered outcomes';const inEvent=R.DICE_EVENTS[l.event]||(()=>false),k=R.DICE.filter(inEvent).length;let body=txt(165,16,'Blue die','text-anchor="middle"')+txt(14,128,'Red die','transform="rotate(-90 14 128)" text-anchor="middle"');
      R.DICE.forEach(([a,b])=>{const x=48+(b-1)*45,y=26+(a-1)*33,on=inEvent([a,b]);body+=`<rect x="${x}" y="${y}" width="40" height="28" rx="5" fill="${on?GREEN:PALE}"/><text x="${x+20}" y="${y+18}" text-anchor="middle" font-family="system-ui" font-size="11" fill="${on?'#ffffff':INK}">${a}, ${b}</text>`;});
      html=svg(body,'The ordered outcomes of a red die and a blue die',232)+status([!l.event?'Choose an event to color its outcomes.':k===1?'One of the 36 outcomes is in this event.':`${k} of 36 outcomes are in this event.`])+caption('Each outcome is a pair (red, blue). For fair dice all 36 pairs are equally likely.')
        +buttons([labButton('dice-seven','Sum of 7',false,l.event==='seven'),labButton('dice-double','Double six',false,l.event==='double'),labButton('dice-six','At least one six',false,l.event==='six'),labButton('dice-bets','Compare the two bets')]);
    }else{
      title='More rolls, more chances';const X=n=>34+n*7,Y=p=>200-170*p;let body=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(40)}" y2="${Y(0)}" stroke="${LINE}"/><line x1="${X(0)}" y1="${Y(.5)}" x2="${X(40)}" y2="${Y(.5)}" stroke="${MUTED}" stroke-dasharray="4 3"/>`+txt(X(40),Y(.5)-5,'1/2','text-anchor="end"');
      for(const [p,color]of [[1/6,GREEN],[1/36,CORAL]])body+=`<polyline fill="none" stroke="${color}" stroke-width="2.4" points="${Array.from({length:40},(_,i)=>`${X(i+1).toFixed(1)},${Y(R.atLeastOne(p,i+1)).toFixed(1)}`).join(' ')}"/>`;
      body+=`<line x1="${X(1)}" y1="${Y(1/36)}" x2="${X(36)}" y2="${Y(1)}" stroke="${CORAL}" stroke-width="1.4" stroke-dasharray="2 3"/><line x1="${X(l.n)}" y1="${Y(0)}" x2="${X(l.n)}" y2="${Y(1)}" stroke="${INK}" stroke-width="1"/>`;
      for(const v of [1,10,20,30,40])body+=txt(X(v),Y(0)+14,v,'text-anchor="middle"');
      const above=p=>R.atLeastOne(p,l.n)>.5?'above':'below';
      html=svg(body,'Probability of at least one six, and of at least one double six, against the number of rolls',222)+`<div class="lab-key"><span><i style="background:${GREEN}"></i>At least one six (one die)</span><span><i style="background:${CORAL}"></i>At least one double six (two dice)</span><span><i class="key-dots"></i>Expected double sixes, n/36</span></div>`
        +status([`Rolls: ${l.n}.`,`The one-die bet is ${above(1/6)} one half, and the two-dice bet is ${above(1/36)} one half.`])+caption('The dotted line grows in proportion to the number of rolls; the chance of at least one double six grows more slowly.')
        +buttons([labButton('bets-less','One roll fewer',l.n<=1),labButton('bets-more','One roll more',l.n>=40),labButton('dice-grid','Back to the 36 outcomes')]);
    }
  }else if(id==='pr-p02'){
    title='Play out the imagined rounds';l.which??=0;l.counted??=false;const [a,b]=[[1,2],[2,3],[3,4]][l.which],seqs=R.pointsSequences(a,b),n=a+b-1,wins=seqs.filter(s=>s.winner==='A').length;
    const cols=n<=2?2:n<=4?4:8,cw=310/cols,ch=Math.min(26,190/Math.ceil(seqs.length/cols));let body='';
    seqs.forEach((s,i)=>{const x=12+(i%cols)*cw,y=12+Math.floor(i/cols)*ch,cell=Math.min(16,(cw-12)/n);[...s.rounds].forEach((r,j)=>{body+=`<rect x="${(x+j*cell).toFixed(1)}" y="${y.toFixed(1)}" width="${(cell-1.5).toFixed(1)}" height="${(ch-6).toFixed(1)}" rx="2" fill="${r==='A'?GREEN:'#e6b8a9'}"/>`;});
      if(l.counted&&s.winner==='A')body+=`<rect x="${(x-2).toFixed(1)}" y="${(y-2).toFixed(1)}" width="${(n*cell+2.5).toFixed(1)}" height="${(ch-2).toFixed(1)}" rx="3" fill="none" stroke="${INK}" stroke-width="1.4"/>`;});
    html=svg(body,'Every sequence of the imagined rounds, one colored square per round',214)+`<div class="lab-key"><span><i style="background:${GREEN}"></i>A wins the round</span><span><i style="background:#e6b8a9"></i>B wins the round</span></div>`
      +status([`A needs ${a}, B needs ${b}: ${n} imagined rounds give ${2**n} equally likely sequences.`,l.counted?`A wins in ${wins} of ${2**n} sequences.`:''])+caption('Play every round that could still be needed, even after the game is decided. Then each sequence is equally likely.')
      +buttons([labButton('points-0','A needs 1, B needs 2',false,l.which===0),labButton('points-1','A needs 2, B needs 3',false,l.which===1),labButton('points-2','A needs 3, B needs 4',false,l.which===2),labButton('points-count',l.counted?'Hide the count':'Outline A’s wins')]);
  }else if(id==='pr-p03'){
    title='Test ten thousand people';l.prev??=1;l.stage??=0;l.acted??=false;
    const c=R.screening(10000,l.prev/100,.9,.09),second={tp:Math.round(c.truePositive*.9),fp:Math.round(c.falsePositive*.09)};
    const groups=l.stage===0&&!l.acted?[[10000,'#dfe8e4']]:l.stage===0?[[c.sick,'#8a3b2c'],[c.healthy,'#dfe8e4']]:l.stage===1?[[c.truePositive,CORAL],[c.sick-c.truePositive,'#8a3b2c'],[c.falsePositive,GOLD],[c.healthy-c.falsePositive,'#dfe8e4']]:[[second.tp,CORAL],[c.truePositive-second.tp,'#8a3b2c'],[second.fp,GOLD],[c.falsePositive-second.fp,'#dfe8e4']];
    const total=groups.reduce((s,g)=>s+g[0],0),per=l.stage===2?40:100,size=l.stage===2?7.5:2.95;let body='',i=0;
    for(const [count,color]of groups)for(let k=0;k<count;k++,i++)body+=`<rect x="${(12+(i%per)*size*(l.stage===2?1:1.02)).toFixed(1)}" y="${(10+Math.floor(i/per)*size*(l.stage===2?1:1.02)).toFixed(1)}" width="${(size*.88).toFixed(2)}" height="${(size*.88).toFixed(2)}" fill="${color}"/>`;
    const lines=l.stage===0&&!l.acted?['Ten thousand people, before anyone is tested.']:l.stage===0?[`${c.sick} of 10000 people are sick.`]:l.stage===1?[`Positive tests: ${c.truePositive} from sick people and ${c.falsePositive} from healthy people.`]:[`After two positive tests: ${second.tp} sick and ${second.fp} healthy people.`];
    html=svg(body,l.stage===2?'The people who tested positive, after a second test':'Ten thousand people, colored by health and test result',l.stage===2?Math.ceil(total/per)*7.5+20:318)
      +`<div class="lab-key"><span><i style="background:${CORAL}"></i>Sick, positive</span><span><i style="background:#8a3b2c"></i>Sick, negative</span><span><i style="background:${GOLD}"></i>Healthy, positive</span><span><i style="background:#dfe8e4"></i>Healthy, negative</span></div>`
      +status(lines)+caption(l.stage===2?'Only the people who tested positive take the second test.':'One square for each person. The test finds 90% of the sick and wrongly flags 9% of the healthy.')
      +buttons([labButton('screen-test','Test everyone',l.stage!==0),labButton('screen-again','Test the positives again',l.stage!==1),labButton('screen-1','Population: 1% sick',false,l.prev===1),labButton('screen-10','Clinic: 10% sick',false,l.prev===10)]);
  }else if(id==='pr-p04'){
    l.view??='coins';l.seed??=7;
    if(l.view==='coins'){
      title='Draw from Bertrand’s boxes';l.gold??=0;l.otherGold??=0;l.last??=null;const boxes=[['G','G'],['S','S'],['G','S']];let body='';
      boxes.forEach((box,b)=>{const x=24+b*102;body+=`<rect x="${x}" y="40" width="86" height="70" rx="8" fill="#f3f7f5" stroke="${LINE}"/>`;box.forEach((c,j)=>{const hot=l.last&&l.last[0]===b&&l.last[1]===j;body+=`<circle cx="${x+24+j*38}" cy="75" r="15" fill="${c==='G'?GOLD:'#b8c2c6'}" stroke="${hot?CORAL:'#ffffff'}" stroke-width="${hot?3.5:1.5}"/>`;});});
      body+=txt(165,140,'Gold box · silver box · mixed box','text-anchor="middle"');
      html=svg(body,'Three boxes of two coins, with the last coin drawn outlined',160)+status([`Gold drawn: ${l.gold} times. The other coin was gold ${l.otherGold} times.`])+caption('Each draw picks a box at random, then one of its two coins at random. Only the draws that show gold count.')
        +buttons([labButton('coins-draw','Draw 10 times'),labButton('coins-reset','Start again',!l.gold&&!l.last),labButton('view-doors','Go to the doors')]);
    }else{
      title='Play the game show';l.host??='knows';l.games??=0;l.switchWins??=0;l.spoiled??=0;l.lastGame??=null;let body='';
      for(let d=1;d<=3;d++){const x=30+(d-1)*95,g=l.lastGame,open=g&&g.opened===d,prize=g&&open&&g.prize===d;body+=`<rect x="${x}" y="30" width="80" height="110" rx="6" fill="${open?'#ffffff':'#d9e7e0'}" stroke="${g&&g.pick===d?INK:LINE}" stroke-width="${g&&g.pick===d?2.5:1.2}"/>`+txt(x+40,160,'Door '+d,'text-anchor="middle"');if(open)body+=prize?`<text x="${x+40}" y="94" text-anchor="middle" font-family="system-ui" font-size="26" fill="${GOLD}">★</text>`:txt(x+40,90,'Empty','text-anchor="middle"');}
      html=svg(body,'Three doors; the last game is shown',176)+status([`Games counted: ${l.games}. Switching won ${l.switchWins} of them.`,l.host==='random'?`Games where the host revealed the prize, not counted: ${l.spoiled}.`:''])
        +caption(l.host==='knows'?'You always pick door 1. The host knows where the prize is and always opens an empty door.':'You always pick door 1. The host opens door 2 or 3 at random; games where it reveals the prize are not counted.')
        +buttons([labButton('doors-play','Play 10 games'),labButton('host-knows','Host who knows',false,l.host==='knows'),labButton('host-random','Host who guesses',false,l.host==='random'),labButton('view-coins','Back to the boxes')]);
    }
  }else if(id==='pr-p05'){
    title='How many people?';l.n??=10;const X=n=>30+n*4.9,Y=p=>196-170*p;let body=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(60)}" y2="${Y(0)}" stroke="${LINE}"/><line x1="${X(0)}" y1="${Y(.5)}" x2="${X(60)}" y2="${Y(.5)}" stroke="${MUTED}" stroke-dasharray="4 3"/>`+txt(X(60),Y(.5)-5,'1/2','text-anchor="end"');
    body+=`<polyline fill="none" stroke="${GREEN}" stroke-width="2.4" points="${Array.from({length:60},(_,i)=>`${X(i+1).toFixed(1)},${Y(R.sharedBirthday(i+1)).toFixed(1)}`).join(' ')}"/><circle cx="${X(l.n).toFixed(1)}" cy="${Y(R.sharedBirthday(l.n)).toFixed(1)}" r="5.5" fill="${CORAL}"/>`;
    for(const v of [1,10,20,30,40,50,60])body+=txt(X(v),Y(0)+14,v,'text-anchor="middle"');
    html=svg(body,'Probability of a shared birthday against the number of people',220)+status([`People: ${l.n}. Pairs: ${R.choose(l.n,2)}.`,R.sharedBirthday(l.n)>.5?'A shared birthday is more likely than not.':'A shared birthday is less likely than not.'])+caption('Every pair of people is a chance for a match, and the number of pairs grows much faster than the number of people.')
      +buttons([labButton('bday-less','One person fewer',l.n<=2),labButton('bday-more','One person more',l.n>=60),labButton('bday-less10','Ten fewer',l.n<=11),labButton('bday-more10','Ten more',l.n>=51)]);
  }else if(id==='pr-p06'){
    title='Shuffle eight cards';l.counts??=Array(9).fill(0);l.shuffles??=0;l.total??=0;l.last??=null;l.seed??=11;let body='';
    (l.last||[1,2,3,4,5,6,7,8]).forEach((c,i)=>{const fixed=l.last&&c===i+1;body+=`<rect x="${14+i*38.5}" y="18" width="32" height="44" rx="5" fill="${fixed?GREEN:'#ffffff'}" stroke="${fixed?GREEN:LINE}"/><text x="${30+i*38.5}" y="46" text-anchor="middle" font-family="Georgia" font-size="16" fill="${fixed?'#ffffff':INK}">${c}</text>`+txt(30+i*38.5,76,i+1,'text-anchor="middle"');});
    const shown=l.counts.slice(0,6),expected=shown.map((_,k)=>l.shuffles*Math.exp(-1)/[1,1,2,6,24,120][k]);
    body+=bars(shown,{base:214,top:96,max:Math.max(1,...shown,...expected),labels:['0','1','2','3','4','5'],expected});
    html=svg(body,'The last shuffle, with fixed points in green, and how many fixed points each shuffle had',234)+expectedKey('Shuffles with this many fixed points')
      +status([`Shuffles: ${l.shuffles}.`,l.shuffles?`Average number of fixed points: ${(l.total/l.shuffles).toFixed(2)}.`:''])+caption('The numbers under the cards are the positions. A card is a fixed point when its number matches its position.')
      +buttons([labButton('shuffle-one','Shuffle once'),labButton('shuffle-hundred','Shuffle 100 times'),labButton('shuffle-reset','Start again',!l.shuffles)]);
  }else if(id==='pr-p07'){
    title='Roll until a six';l.waits??=[];l.last??=null;l.seed??=23;const counts=Array(12).fill(0);for(const w of l.waits)counts[Math.min(w,12)-1]++;
    const expected=counts.map((_,k)=>l.waits.length*(k<11?(5/6)**k/6:(5/6)**11));let body='';
    if(l.last)l.last.slice(-20).forEach((r,i)=>{body+=`<rect x="${12+i*15.5}" y="12" width="13" height="13" rx="2" fill="${r===6?CORAL:'#dfe8e4'}"/><text x="${18.5+i*15.5}" y="22.5" text-anchor="middle" font-family="system-ui" font-size="9" fill="${r===6?'#ffffff':INK}">${r}</text>`;});
    body+=bars(counts,{base:208,top:44,max:Math.max(1,...counts,...expected),labels:counts.map((_,k)=>k<11?String(k+1):'12+'),expected});
    html=svg(body,'The last run of rolls, and how many rolls each wait took',228)+expectedKey('Waits of this length')+status([`Waits recorded: ${l.waits.length}.`,l.waits.length?`Average wait: ${(l.waits.reduce((a,b)=>a+b,0)/l.waits.length).toFixed(2)} rolls.`:''])
      +caption('Each wait ends with the first six. Long waits are rarer, by a factor of 5/6 for each extra roll.')
      +buttons([labButton('six-one','Roll until a six'),labButton('six-hundred','Repeat 100 times'),labButton('six-reset','Start again',!l.waits.length)]);
  }else if(id==='pr-p08'){
    title='Collect all six faces';l.runs??=[];l.last??=null;l.seed??=31;let body='';
    if(l.last){const seen=new Set();let stage=0;l.last.slice(0,40).forEach((r,i)=>{const isNew=!seen.has(r);seen.add(r);if(isNew)stage++;body+=`<rect x="${12+(i%20)*15.5}" y="${12+Math.floor(i/20)*17}" width="13" height="13" rx="2" fill="${isNew?GREEN:'#dfe8e4'}"/><text x="${18.5+(i%20)*15.5}" y="${22.5+Math.floor(i/20)*17}" text-anchor="middle" font-family="system-ui" font-size="9" fill="${isNew?'#ffffff':INK}">${r}</text>`;});}
    const stages=[0,0,0,0,0,0];if(l.last){const seen=new Set();let k=0;for(const r of l.last){stages[k]++;if(!seen.has(r)){seen.add(r);k++;}if(k===6)break;}}
    const means=[6/6,6/5,6/4,6/3,6/2,6/1];body+=bars(stages,{base:208,top:66,max:Math.max(8,...stages),labels:['1st','2nd','3rd','4th','5th','6th'],expected:l.runs.length?means:null});
    html=svg(body,'The rolls of the last collection, new faces in green, and the rolls spent waiting for each new face',228)+(l.runs.length?expectedKey('Rolls for each new face, last collection'):'<div class="lab-key"><span><i class="key-bar"></i>Rolls for each new face, last collection</span></div>')
      +status([`Collections: ${l.runs.length}.`,l.runs.length?`Average number of rolls: ${(l.runs.reduce((a,b)=>a+b,0)/l.runs.length).toFixed(1)}.`:''])+caption(l.runs.length?'The outlines show the expected wait for each new face.':'Collect once to see how many rolls each new face takes.')
      +buttons([labButton('collect-one','Collect once'),labButton('collect-hundred','Collect 100 times'),labButton('collect-reset','Start again',!l.runs.length)]);
  }else if(id==='pr-p09'){
    title='Drop balls through the board';l.mode??='fair';l.seed??=41;const rows=l.mode==='fair'?8:10,p=l.mode==='fair'?.5:.3;l.counts??=Array(rows+1).fill(0);if(l.counts.length!==rows+1)l.counts=Array(rows+1).fill(0);l.path??=null;
    const balls=l.counts.reduce((a,b)=>a+b,0),cx=165,dy=11,dx=13;let body='';
    for(let r=0;r<rows;r++)for(let k=0;k<=r;k++)body+=`<circle cx="${cx+(k-r/2)*dx*2}" cy="${16+r*dy}" r="2.4" fill="${LINE}"/>`;
    if(l.path){let k=0,pts=[`${cx},6`];l.path.forEach((b,r)=>{k+=b;pts.push(`${cx+(k-(r+1)/2)*dx*2},${16+(r+1)*dy}`);});body+=`<polyline fill="none" stroke="${CORAL}" stroke-width="2" points="${pts.join(' ')}"/>`;}
    const expected=l.counts.map((_,k)=>balls*R.binomial(rows,k,p));body+=bars(l.counts,{x0:20,width:300,base:228,top:16+rows*dy+12,max:Math.max(1,...l.counts,...expected),labels:l.counts.map((_,k)=>String(k)),expected});
    const most=balls?l.counts.indexOf(Math.max(...l.counts)):null;
    html=svg(body,'A Galton board with the path of the last ball, and the number of balls in each bin',246)+expectedKey('Balls in each bin')+status([`Balls: ${balls}.`,balls?`Most common bin so far: ${most}.`:''])
      +caption(l.mode==='fair'?'8 rows, and each bounce goes right with probability 1/2. A bin’s number is the count of right bounces.':'10 rows, and each bounce goes right with probability 0.3. A bin’s number is the count of right bounces.')
      +buttons([labButton('galton-one','Drop one ball'),labButton('galton-hundred','Drop 100 balls'),labButton('galton-fair','Fair board',false,l.mode==='fair'),labButton('galton-tilt','Tilted board',false,l.mode==='tilt'),labButton('galton-reset','Empty the bins',!balls)]);
  }else if(id==='pr-p10'){
    title='Toss a coin thousands of times';l.n??=0;l.heads??=0;l.path??=[];l.seed??=53;const N=5000,X=n=>34+286*Math.sqrt(n/N),Y=f=>116-200*(f-.5);
    let body=`<rect x="${X(0)}" y="${Y(.55)}" width="${X(N)-X(0)}" height="${Y(.45)-Y(.55)}" fill="#e7f1ec"/><line x1="${X(0)}" y1="${Y(.5)}" x2="${X(N)}" y2="${Y(.5)}" stroke="${MUTED}" stroke-dasharray="4 3"/>`+txt(X(N),Y(.55)-5,'0.55','text-anchor="end"')+txt(X(N),Y(.45)+13,'0.45','text-anchor="end"');
    if(l.path.length>1)body+=`<polyline fill="none" stroke="${GREEN}" stroke-width="1.8" points="${l.path.map(([n,h])=>`${X(n).toFixed(1)},${Y(h/n).toFixed(1)}`).join(' ')}"/>`;
    for(const v of [10,100,1000,5000])body+=txt(X(v),222,v,'text-anchor="middle"');
    html=svg(body,'The fraction of heads after each toss, with the band from 0.45 to 0.55',230)+status([`Tosses: ${l.n}.`,l.n?`Fraction of heads: ${(l.heads/l.n).toFixed(3)}.`:'',l.n?`Chebyshev’s bound for a miss of 0.05 or more: ${Math.min(1,100/l.n).toFixed(3)}.`:''])
      +caption('The horizontal scale is stretched at the start, where the fraction moves most. The shaded band is within 0.05 of 1/2.')
      +buttons([labButton('toss-10','Toss 10 times',l.n>=N),labButton('toss-100','Toss 100 times',l.n>=N),labButton('toss-1000','Toss 1000 times',l.n>=N),labButton('toss-reset','Start again',!l.n)]);
  }
  $('lab-title').textContent=title;$('lab').innerHTML=html;
}
function labAction(action){
  const id=current().id,l=labState[id];if(!l)return;const next=()=>R.random(l.seed++);
  if(action.startsWith('dice-')&&action!=='dice-bets'&&action!=='dice-grid'){l.event=action.slice(5);}
  else if(action==='dice-bets')l.view='bets';else if(action==='dice-grid')l.view='grid';
  else if(action==='bets-less')l.n=Math.max(1,l.n-1);else if(action==='bets-more')l.n=Math.min(40,l.n+1);
  else if(action.startsWith('points-')&&action!=='points-count'){l.which=Number(action.slice(7));l.counted=false;}
  else if(action==='points-count')l.counted=!l.counted;
  else if(action==='screen-test'){l.stage=1;l.acted=true;}else if(action==='screen-again'){l.stage=2;l.acted=true;}
  else if(action==='screen-1'||action==='screen-10'){l.prev=Number(action.slice(7));l.stage=0;l.acted=true;}
  else if(action==='view-doors'||action==='view-coins')l.view=action.slice(5);
  else if(action==='coins-draw'){const rand=next();for(let i=0;i<10;i++){const b=Math.floor(rand()*3),j=Math.floor(rand()*2),box=[['G','G'],['S','S'],['G','S']][b];l.last=[b,j];if(box[j]==='G'){l.gold++;if(box[1-j]==='G')l.otherGold++;}}}
  else if(action==='coins-reset'){l.gold=0;l.otherGold=0;l.last=null;}
  else if(action==='host-knows'||action==='host-random'){l.host=action.slice(5);l.games=0;l.switchWins=0;l.spoiled=0;l.lastGame=null;}
  else if(action==='doors-play'){const rand=next();for(let i=0;i<10;i++){const prize=1+Math.floor(rand()*3);let opened;
    if(l.host==='knows'){const empty=[2,3].filter(d=>d!==prize);opened=empty[Math.floor(rand()*empty.length)];}else opened=2+Math.floor(rand()*2);
    l.lastGame={prize,pick:1,opened};if(opened===prize){l.spoiled++;continue;}l.games++;if(prize===5-opened)l.switchWins++;}}
  else if(action==='bday-less')l.n=Math.max(2,l.n-1);else if(action==='bday-more')l.n=Math.min(60,l.n+1);
  else if(action==='bday-less10')l.n=Math.max(2,l.n-10);else if(action==='bday-more10')l.n=Math.min(60,l.n+10);
  else if(action==='shuffle-one'||action==='shuffle-hundred'){const rand=next();for(let i=0;i<(action==='shuffle-one'?1:100);i++){const perm=R.shuffle(8,rand),f=R.fixedPoints(perm);l.last=perm;l.counts[f]++;l.shuffles++;l.total+=f;}}
  else if(action==='shuffle-reset'){l.counts=Array(9).fill(0);l.shuffles=0;l.total=0;l.last=null;}
  else if(action==='six-one'||action==='six-hundred'){const rand=next();for(let i=0;i<(action==='six-one'?1:100);i++){const rolls=R.waitForSix(rand);l.last=rolls;l.waits.push(rolls.length);}}
  else if(action==='six-reset'){l.waits=[];l.last=null;}
  else if(action==='collect-one'||action==='collect-hundred'){const rand=next();for(let i=0;i<(action==='collect-one'?1:100);i++){const rolls=R.collectFaces(rand);l.last=rolls;l.runs.push(rolls.length);}}
  else if(action==='collect-reset'){l.runs=[];l.last=null;}
  else if(action==='galton-fair'||action==='galton-tilt'){l.mode=action.slice(7);l.counts=null;l.path=null;}
  else if(action==='galton-one'||action==='galton-hundred'){const rand=next(),rows=l.mode==='fair'?8:10,p=l.mode==='fair'?.5:.3;for(let i=0;i<(action==='galton-one'?1:100);i++){const path=R.galton(rows,p,rand);l.path=path;l.counts[path.reduce((a,b)=>a+b,0)]++;}}
  else if(action==='galton-reset'){l.counts=null;l.path=null;}
  else if(action.startsWith('toss-')&&action!=='toss-reset'){const rand=next(),k=Math.min(Number(action.slice(5)),5000-l.n),step=Math.max(1,Math.floor((l.n+k)/400));for(let i=0;i<k;i++){l.n++;if(rand()<.5)l.heads++;if(l.n<=50||l.n%step===0||i===k-1)l.path.push([l.n,l.heads]);}}
  else if(action==='toss-reset'){l.n=0;l.heads=0;l.path=[];}
  renderLab();
}
document.addEventListener('input',e=>{if(e.target.dataset?.field&&(e.target.tagName==='TEXTAREA'||e.target.type==='text'))recordInput(e.target);});
document.addEventListener('change',e=>{if(e.target.dataset?.field&&['checkbox','radio'].includes(e.target.type))recordInput(e.target);else if(e.target.id==='project-select')selectProject(e.target.value);else if(e.target.dataset?.lab)labAction(e.target.dataset.lab,e.target.value);});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.project)selectProject(b.dataset.project);
  else if(b.dataset.step!==undefined)moveStep(Number(b.dataset.step));
  else if(b.dataset.lab)labAction(b.dataset.lab);
  else if(b.id==='check')checkStep();else if(b.id==='prev')moveStep(stepIndex()-1);
  else if(b.id==='next'){if(stepIndex()===current().steps.length-1)showSession(true);else moveStep(stepIndex()+1);}
  else if(['toolkit','open-tools-side'].includes(b.id))showToolkit();
  else if(['session','review-session'].includes(b.id))showSession();
  else if(b.id==='close-modal')$('modal').close();else if(b.id==='export')exportSession();else if(b.id==='export-original')exportOriginal();
  else if(b.id==='reset-open')showModal('Reset Probability?',`<p>This clears only your Probability project responses. You can export your current notes and the previously saved original first.</p><div class="modal-actions"><button id="export">Export current notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button class="primary" id="reset-confirm">Clear Probability responses</button><button id="reset-cancel">Keep my work</button></div>`);
  else if(b.id==='reset-cancel')showSession();else if(b.id==='reset-confirm'){if(saveBlocked){try{if(storage.getItem(KEY)!==lastStored){toast('The saved original changed. Reload before resetting.');return;}storage.removeItem(KEY);blockedOriginal=null;lastStored=null;saveBlocked=false;}catch{toast('The original could not be cleared. Your work is kept.');return;}}state={version:1,project:current().id,steps:{},answers:{},checks:{},attempts:[]};persist();renderRoute();renderProject();$('modal').close();toast('Your Probability responses have been cleared.');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&projects.length)persist();});
window.addEventListener('pagehide',()=>{if(projects.length)persist();});
window.addEventListener('beforeunload',event=>{if(unsavedWork&&(saveBlocked||!storeAvailable)){event.preventDefault();event.returnValue='';}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
async function boot(){
  try{const r=await fetch('data.json?v=probability-20261101');if(!r.ok)throw Error('Content request failed');projects=await r.json();if(projects.length!==10)throw Error('Content missing');restore();renderRoute();renderProject();$('loading').hidden=true;$('app').hidden=false;}
  catch{$('loading').innerHTML='The project content could not be loaded. <button id="reload">Try loading again</button>';document.getElementById('reload').addEventListener('click',()=>location.reload());}
}
boot();
