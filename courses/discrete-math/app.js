'use strict';
const C=NTCore,D=DMCore,storage={getItem:k=>(window.QuidenceStorage||window.localStorage).getItem(k),setItem:(k,v)=>(window.QuidenceStorage||window.localStorage).setItem(k,v),removeItem:k=>(window.QuidenceStorage||window.localStorage).removeItem(k)},KEY='quidence:discrete-math:v1';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={'dm-p01':'Exam timetables','dm-p02':'City routes & Pascal','dm-p03':'Pigeonholes','dm-p04':'Tower of Hanoi','dm-p05':'A broken chessboard','dm-p06':'Tromino tilings','dm-p07':'Königsberg bridges','dm-p08':'Dominoes & Fibonacci','dm-p09':'Mixed-up hats','dm-p10':'The cheapest network'};
// Each opening banner poses the project's question; none states an answer that a step asks for.
const banners={'dm-p01':'A–B, B–C, C–D, D–E, E–A, F–A, F–C','dm-p02':'Routes from (0, 0) to (5, 3) = ?','dm-p03':'Numbers from 1 to 20: how many force a sum of 21?','dm-p04':'M(1) = 1, M(2) = 3, M(3) = ?','dm-p05':'62 squares, 31 dominoes?','dm-p06':'T(n) = 4 · T(n − 1) + 1 = (4ⁿ − 1) / 3','dm-p07':'7 bridges, 4 areas: one walk?','dm-p08':'T(1) = 1, T(2) = 2, T(3) = ?','dm-p09':'P(nobody gets their own hat) = ?','dm-p10':'6 schools, 9 cables: cheapest network?'};
let projects=[],state={version:1,project:'dm-p01',steps:{},answers:{},checks:{},attempts:[]},saveTimer,toastTimer,storeAvailable=true,blockedOriginal=null,lastStored=null,saveBlocked=false,blockedReason='unreadable',unsavedWork=false,labState={};
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
  let learningRequest=null;try{const g=JSON.parse(storage.getItem('cluevera_learning_goal_v1')||'null');if(g?.subject==='discrete-math'&&g.includeInReport===true&&typeof g.text==='string')learningRequest={text:g.text,capturedAt:new Date().toISOString()};}catch{}
  state.attempts.push({project:p.id,step:i,time:new Date().toISOString(),results,learningRequest});persist();
  $('check-summary').textContent=[objective?`${good} of ${objective} calculations or choices match.`:'',pending?`${pending} explanation${pending===1?'':'s'} saved for review.`:'',empty?`${empty} response${empty===1?'':'s'} still open.`:''].filter(Boolean).join(' ');
  if(!empty)document.querySelector(`[data-step="${i}"]`).classList.add('done');
}
function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;$('modal').showModal();}
function showToolkit(){
  const proofs=[
    ['Mathematical induction','If P(1) is true, and P(k) implies P(k + 1) for every k ≥ 1, then P(n) is true for every n ≥ 1.',
      'Suppose some P(n) were false. Among the positive integers for which P fails, take the smallest one, m. It is not 1, because P(1) is true, so m − 1 ≥ 1, and P(m − 1) is true by the choice of m. The inductive step then makes P(m) true, a contradiction. ∎',
      'Strong induction lets the step use all of P(1), …, P(k) at once. The same smallest-counterexample argument proves it, because every smaller case is true. When the step uses the two previous cases, check two base cases, P(1) and P(2), and apply the step only for k ≥ 2. The domino project uses this form: each term depends on the two before it.'],
    ['The pigeonhole principle','If more than kn objects are placed in n boxes, some box contains at least k + 1 objects.',
      'If every box held at most k objects, the boxes together would hold at most kn objects, fewer than were placed. This contradiction shows that some box holds at least k + 1. ∎',
      'The art is in choosing the boxes, so that two objects in the same box give exactly what you need.'],
    ['Binomial coefficients','An n-element set has C(n, k) = n! / (k!(n − k)!) subsets with k elements, and C(n, k) = C(n − 1, k − 1) + C(n − 1, k) for 1 ≤ k ≤ n − 1.',
      'Count the ordered lists of k different elements in two ways. Directly there are n(n − 1)⋯(n − k + 1) = n!/(n − k)! lists. Alternatively, choose the subset first and then order it in k! ways. So C(n, k) · k! = n!/(n − k)!, and dividing by k! gives the formula.',
      'For Pascal’s rule, with 1 ≤ k ≤ n − 1, fix one element x. A k-element subset either contains x, and is decided by choosing k − 1 more elements from the other n − 1, or does not contain x, and is k elements chosen from the other n − 1. The two cases do not overlap. ∎'],
    ['The handshake lemma','In every finite graph, the sum of the degrees is twice the number of edges, so the number of vertices of odd degree is even.',
      'Count the edge ends. The degree of v is the number of edge ends at v, so counting by vertices gives Σ deg(v). Every edge has two ends, so counting by edges gives 2|E|. Both count the same ends. ∎',
      'The sum is even, and the even degrees contribute an even amount, so the odd degrees must add up to an even number. That happens only when there is an even number of them.']
  ];
  showModal('Proof toolkit',`<p>These four foundation proofs supply the general results used by the projects. You can return to them whenever a step uses a result you have not met before.</p><div>${proofs.map((a,i)=>`<details class="tool-proof" ${i===0?'open':''}><summary>${esc(a[0])}</summary><div>${a.slice(1).map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div>`);
}
function totals(){let objective=0,correct=0,pending=0,responses=0;for(const p of projects)p.steps.forEach((s,i)=>s.fields.forEach(f=>{const k=key(p,i,f),v=valueOf(p,i,f);if(C.filled(f,v)){responses++;if(f.type==='reason')pending++;else objective++;}if(f.type!=='reason'&&state.checks[k]?.status==='correct')correct++;}));return {objective,correct,pending,responses};}
function showSession(projectOnly=false){
  const t=totals(),ps=projectOnly?[current()]:projects;let entries='';
  for(const p of ps)p.steps.forEach((s,i)=>{const rows=s.fields.filter(f=>C.filled(f,valueOf(p,i,f))).map(f=>{const k=key(p,i,f),v=valueOf(p,i,f),g=state.checks[k];const st=f.type==='reason'?'Pending proof review':g?.status==='correct'?'Checked calculation / choice':g?.status==='retry'||g?.status==='format'?'Revisit this response':'Draft response';return `<div class="session-item"><span class="session-state ${f.type==='reason'?'pending':g?.status==='retry'?'retry':''}">${st}</span><h3>${esc(f.label)}</h3><p ${['reason','number'].includes(f.type)?'data-no-translate class="student-work"':'class="session-choice"'}>${esc(displayAnswer(f,v))}</p></div>`;});if(rows.length)entries+=`<h3 style="margin-top:23px;font-weight:550">${esc(names[p.id])} · Step ${i+1}</h3>${rows.join('')}`;});
  showModal(projectOnly?'Your project notes':'Your discrete mathematics session',`<p>This is a record of your actual responses. Matching a calculation does not establish mastery, and explanations remain pending review.</p><div class="summary-stats"><div><span>${t.responses}</span>Responses saved</div><div><span>${t.correct}</span>Calculations / choices matched</div><div><span>${t.pending}</span>Explanations to review</div></div>${entries||'<p>No responses yet. Try a step, then return here to see your work.</p>'}<div class="modal-actions"><button class="primary" id="export">Export session notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button id="reset-open">Reset Discrete Mathematics</button></div>`);
}
function sessionMarkdown(){
  const t=s=>window.QuidenceI18n?.text(s)||s;
  const status=s=>t(({correct:'Checked calculation / choice',pending:'Pending proof review',retry:'Revisit this response',format:'Check the response format',empty:'No response yet',Draft:'Draft response'})[s]||'Draft response');
  const response=(f,v)=>f.type==='choice'?t(displayAnswer(f,v)):f.type==='multi'?v.map(x=>t(f.options.find(o=>o.value===x)?.label||x)).join(', '):v;
  let text='# Quidence · '+t('Discrete Mathematics')+'\n\n'+t('Responses and reasoning from this browser. Proofs are pending review; numerical matches are not mastery judgments.')+'\n';
  if(saveBlocked||!storeAvailable)text+='\n'+t('These notes include current work that could not be saved in this browser. The previously saved record is kept separately.')+'\n';
  for(const p of projects){let body='';p.steps.forEach((s,i)=>{for(const f of s.fields){const v=valueOf(p,i,f);if(C.filled(f,v)){const g=state.checks[key(p,i,f)];body+=`\n### ${t('Step')} ${i+1} · ${t(s.title)}\n\n${t(f.label)}\n\n${response(f,v)}\n\n${t('Response status')}: ${status(f.type==='reason'?'pending':g?.status||'Draft')}\n`;}}});if(body)text+=`\n## ${t(p.title)}\n${body}`;}
  if(state.attempts.length){text+='\n## '+t('Check history')+'\n\n'+t('Each check preserves the responses supplied at that time.')+'\n';for(const a of state.attempts){const p=projects.find(p=>p.id===a.project);if(!p||!p.steps[a.step])continue;text+=`\n### ${a.time} · ${t(p.title)} · ${t('Step')} ${a.step+1}\n`;if(a.learningRequest?.text)text+='\n'+t('Learning request included with this check (original wording):')+'\n\n'+a.learningRequest.text+'\n';for(const r of a.results){const f=p.steps[a.step].fields.find(f=>f.id===r.field);if(f&&C.filled(f,r.value))text+=`\n${t(f.label)}\n\n${response(f,r.value)}\n\n${t('Response status')}: ${status(r.status)}\n`;}}}
  return text;
}
function downloadNotes(text,name,type){try{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;}catch{toast('The download could not start. Your current notes are still visible.');return false;}}
function exportSession(){persist();if(downloadNotes(sessionMarkdown(),'Quidence-discrete-mathematics-session.md','text/markdown;charset=utf-8'))toast('Your current session notes have been exported.');}
function exportOriginal(){if(blockedOriginal===null)return;let json=true;try{JSON.parse(blockedOriginal);}catch{json=false;}if(downloadNotes(blockedOriginal,'Quidence-discrete-mathematics-saved-original.'+(json?'json':'txt'),json?'application/json':'text/plain;charset=utf-8'))toast('The previously saved original has been exported separately.');}

function svg(body,label,height=235){return `<svg class="lab-svg" viewBox="0 0 330 ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>`;}
function labButton(action,label,disabled=false){return `<button data-lab="${action}" ${disabled?'disabled':''}>${label}</button>`;}
const SLOT_COLORS=['#ffffff','#badccc','#f4d49d','#cfc6ee'],EXAM_XY={A:[165,30],B:[252,92],C:[218,194],D:[112,194],E:[78,92],F:[165,124]};
const TILE_COLORS=['#badccc','#f4d49d','#cfc6ee','#9bc5c8','#f3c9b8'];
function tileColors(grid){
  // Greedy coloring of the trominoes, so that neighboring tiles never share a color.
  const near=new Map(),add=(a,b)=>{if(a>0&&b>0&&a!==b){if(!near.has(a))near.set(a,new Set());near.get(a).add(b);}};
  grid.forEach((row,r)=>row.forEach((v,c)=>{if(r+1<grid.length){add(v,grid[r+1][c]);add(grid[r+1][c],v);}if(c+1<row.length){add(v,row[c+1]);add(row[c+1],v);}}));
  const color={};for(const id of [...new Set(grid.flat().filter(v=>v>0))].sort((a,b)=>a-b)){const used=new Set([...(near.get(id)||[])].map(n=>color[n]));let k=0;while(used.has(k))k++;color[id]=k;}return color;
}
function renderLab(){
  const id=current().id,l=labState[id]||(labState[id]={});let html='',title='Explore the idea';
  if(id==='dm-p01'){
    title='Color the clash graph';l.slots??={A:0,B:0,C:0,D:0,E:0,F:0};
    const bad=D.clashes(l.slots),open=Object.values(l.slots).filter(v=>!v).length,used=new Set(Object.values(l.slots).filter(Boolean)).size;
    const lines=D.CLASHES.map(([a,b])=>{const clash=bad.some(([x,y])=>x===a&&y===b);return `<line x1="${EXAM_XY[a][0]}" y1="${EXAM_XY[a][1]}" x2="${EXAM_XY[b][0]}" y2="${EXAM_XY[b][1]}" stroke="${clash?'#c2553d':'#9db8b0'}" stroke-width="${clash?3:1.6}"/>`;}).join('');
    const nodes=D.EXAMS.map(x=>`<circle cx="${EXAM_XY[x][0]}" cy="${EXAM_XY[x][1]}" r="17" fill="${SLOT_COLORS[l.slots[x]]}" stroke="#4c7f72" stroke-width="1.5"/><text x="${EXAM_XY[x][0]}" y="${EXAM_XY[x][1]+5}" text-anchor="middle" font-family="Georgia" font-size="15" fill="#173f42">${x}</text>`).join('');
    html=svg(lines+nodes,'Clash graph of six exams, colored by time slot')+`<div class="slot-legend">${[1,2,3].map(s=>`<span><i style="background:${SLOT_COLORS[s]}"></i>Slot ${s}</span>`).join('')}</div><p class="lab-caption">Click an exam to move it to the next slot. Can you place all six exams in 3 slots? Can you do it in 2?</p><div class="lab-buttons">${D.EXAMS.map(x=>labButton('slot-'+x,x)).join('')}${labButton('slot-reset','Start again')}</div><div class="lab-status">${bad.length?`Clashes inside a slot: ${bad.length}`:open?`Exams without a slot: ${open}`:`No clash inside any slot. Slots used: ${used}`}</div>`;
  }else if(id==='dm-p02'){
    title='Count the routes at every corner';l.closed??=false;l.filled??=1;const counts=D.pathCounts(5,3,l.closed?[2,1]:null),x0=34,y0=206,sx=52,sy=54;
    let body='';
    for(let x=0;x<=5;x++)body+=`<line x1="${x0+x*sx}" y1="${y0}" x2="${x0+x*sx}" y2="${y0-3*sy}" stroke="#d5e2dd"/>`;
    for(let y=0;y<=3;y++)body+=`<line x1="${x0}" y1="${y0-y*sy}" x2="${x0+5*sx}" y2="${y0-y*sy}" stroke="#d5e2dd"/>`;
    for(let x=0;x<=5;x++)for(let y=0;y<=3;y++){const closed=l.closed&&x===2&&y===1,end=x===5&&y===3,shown=x+y<=l.filled;body+=`<circle cx="${x0+x*sx}" cy="${y0-y*sy}" r="13" fill="${closed?'#f3d0c6':end&&shown?'#173f42':'#f0f5f2'}" stroke="${closed?'#c2553d':'#9db8b0'}"/><text x="${x0+x*sx}" y="${y0-y*sy+4}" text-anchor="middle" font-family="system-ui" font-size="11" fill="${end?'#ffffff':'#28644c'}">${closed?'×':shown?counts[x][y]:''}</text>`;}
    body+=`<text x="${x0-12}" y="${y0+28}" font-family="system-ui" font-size="11" fill="#526b7c">School</text><text x="${x0+5*sx+12}" y="${y0-3*sy-22}" text-anchor="end" font-family="system-ui" font-size="11" fill="#526b7c">Library</text>`;
    html=svg(body,'Street grid with the number of shortest routes to every corner',240)+`<div class="lab-status">${l.filled>=8?`Routes to the library: ${counts[5][3]}`:'Fill the corners one diagonal at a time.'}</div><p class="lab-caption">Each corner adds the count from the corner to its west and the count from the corner to its south.</p><div class="lab-buttons">${labButton('paths-next','Fill the next diagonal',l.filled>=8)}${labButton('paths-all','Fill every corner',l.filled>=8)}${labButton('paths-reset','Start again')}${labButton('paths-close',l.closed?'Reopen (2, 1)':'Close (2, 1)')}</div>`;
  }else if(id==='dm-p03'){
    title='Choose numbers, then look in the boxes';l.mode??='sum';l.chosen??=[];
    const box=n=>l.mode==='sum'?Math.min(n,21-n):n/(n&-n),groups=[...new Set(Array.from({length:20},(_,i)=>box(i+1)))].sort((a,b)=>a-b),c=l.chosen.slice().sort((a,b)=>a-b);let found=null;
    for(let i=0;i<c.length&&!found;i++)for(let j=i+1;j<c.length&&!found;j++)if(l.mode==='sum'?c[i]+c[j]===21:c[j]%c[i]===0)found=[c[i],c[j]];
    const verdict=found?(l.mode==='sum'?`A pair adding to 21: ${found[0]} + ${found[1]}`:`${found[0]} divides ${found[1]}`):(l.mode==='sum'?'No pair adds to 21 yet.':'No number divides another yet.');
    html=`<div class="lab-buttons">${labButton('pigeon-sum','Boxes: pairs that add to 21')}${labButton('pigeon-odd','Boxes: same odd part')}</div><div class="pigeon-boxes">${groups.map(g=>`<div class="pigeon-box">${Array.from({length:20},(_,i)=>i+1).filter(n=>box(n)===g).map(n=>`<button class="pigeon-chip" data-lab="pick-${n}" aria-pressed="${l.chosen.includes(n)}">${n}</button>`).join('')}</div>`).join('')}</div><div class="lab-status">Chosen: ${l.chosen.length}</div><div class="lab-status">${verdict}</div><p class="lab-caption">${l.mode==='sum'?'Each box holds one pair. How many numbers can you choose before two must share a box?':'Each box holds the numbers with the same odd part. What do you notice about the numbers in one box?'}</p><div class="lab-buttons">${labButton('pick-clear','Clear choices')}</div>`;
  }else if(id==='dm-p04'){
    title='Move the tower';l.n??=3;l.pegs??=D.hanoiStart(l.n);l.moves??=0;
    const solved=l.pegs[2].length===l.n,x=[60,165,270],names=['Left','Middle','Right'];
    let body='<rect x="14" y="200" width="302" height="8" rx="3" fill="#c9d8cf"/>'+x.map(px=>`<rect x="${px-3}" y="92" width="6" height="108" rx="3" fill="#9db8b0"/>`).join('');
    l.pegs.forEach((peg,i)=>peg.forEach((d,j)=>{const w=26+18*d;body+=`<rect x="${x[i]-w/2}" y="${184-16*j}" width="${w}" height="14" rx="5" fill="${TILE_COLORS[d-1]}" stroke="#4c7f72"/>`;}));
    body+=names.map((t,i)=>`<text x="${x[i]}" y="226" text-anchor="middle" font-family="system-ui" font-size="11" fill="#526b7c">${t}</text>`).join('');
    html=svg(body,'Three pegs with the discs of the Tower of Hanoi')+`<div class="lab-buttons">${[[0,1],[0,2],[1,0],[1,2],[2,0],[2,1]].map(([f,t])=>labButton(`hanoi-${f}-${t}`,`${names[f]} → ${names[t]}`,solved)).join('')}</div><div class="lab-status">${solved?`Solved in ${l.moves} moves.`:`Moves: ${l.moves}`}</div><div class="lab-buttons">${labButton('hanoi-3','3 discs')}${labButton('hanoi-4','4 discs')}${labButton('hanoi-reset','Start again')}</div><p class="lab-caption">A larger disc never goes on a smaller one. Where must the smaller discs be when the largest disc moves?</p>`;
  }else if(id==='dm-p05'){
    title='Color the board';l.colors??=true;l.balanced??=false;l.counted??=false;
    const removed=l.balanced?[[0,0],[0,1]]:[[0,0],[7,7]];let dark=0,light=0,body='';
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const gone=removed.some(([a,b])=>a===r&&b===c),isDark=(r+c)%2===0;if(!gone){if(isDark)dark++;else light++;}
      body+=gone?`<rect x="${86+c*20}" y="${8+(7-r)*20}" width="20" height="20" fill="none" stroke="#c2553d" stroke-dasharray="3 2"/>`:`<rect x="${86+c*20}" y="${8+(7-r)*20}" width="20" height="20" fill="${l.colors?(isDark?'#4c7f72':'#f0f5f2'):'#f7faf8'}" stroke="#c9d8cf" stroke-width=".6"/>`;}
    html=svg(body,'Eight by eight board with two squares removed',176)+`${l.counted?`<div class="lab-results"><div><span>Dark squares</span>${dark}</div><div><span>Light squares</span>${light}</div></div>`:''}<div class="lab-buttons">${labButton('board-count',l.counted?'Hide the counts':'Count the squares')}${labButton('board-colors',l.colors?'Hide the colors':'Show the colors')}${labButton('board-swap',l.balanced?'Remove opposite corners':'Remove one dark and one light square')}</div><p class="lab-caption">${l.balanced?'Now the counts are equal, and a covering exists. Equal counts alone do not always guarantee one (see step 4).':'What does every domino cover? Compare that with the counts.'}</p>`;
  }else if(id==='dm-p06'){
    title='Split, place, repeat';l.n??=2;l.hole??=[1,2];const size=2**l.n;if(l.hole[0]>=size||l.hole[1]>=size)l.hole=[0,0];
    const {grid,count}=D.tromino(l.n,l.hole),color=tileColors(grid);
    html=`<div class="tromino-grid" style="--size:${size}">${grid.map((row,r)=>row.map((v,c)=>`<button class="tromino-cell${v<0?' hole':''}" data-lab="hole-${r}-${c}" aria-label="Row ${r+1}, column ${c+1}" aria-pressed="${v<0}" style="background:${v<0?'#ffffff':TILE_COLORS[color[v]%TILE_COLORS.length]}"></button>`).join('')).join('')}</div><div class="lab-status">Trominoes used: ${count}</div><div class="lab-buttons">${labButton('tromino-2','4 × 4 board')}${labButton('tromino-3','8 × 8 board')}</div><p class="lab-caption">Click any square to remove it instead. The covering follows the proof: one tromino at the center, then the same idea in each quadrant.</p>`;
  }else if(id==='dm-p07'){
    title='Count the bridge ends';l.extra??=[];l.degrees??=false;
    const P={A:[165,118],B:[165,30],C:[165,206],D:[282,118]},curve=(a,b,cx,cy,added)=>`<path d="M ${P[a][0]} ${P[a][1]} Q ${cx} ${cy} ${P[b][0]} ${P[b][1]}" fill="none" stroke="${added?'#c28b3d':'#6b9c8c'}" stroke-width="${added?3:2.2}"${added?' stroke-dasharray="6 4"':''}/>`;
    let body=curve('A','B',128,74)+curve('A','B',202,74)+curve('A','C',128,162)+curve('A','C',202,162)+curve('A','D',224,118)+curve('B','D',262,52)+curve('C','D',262,184);
    if(l.extra.includes('BC'))body+=curve('B','C',40,118,true);if(l.extra.includes('AD'))body+=curve('A','D',224,162,true);
    const d=D.degrees(l.extra.map(x=>x.split(''))),odd=Object.values(d).filter(v=>v%2).length;
    body+=Object.entries(P).map(([k,[px,py]])=>`<circle cx="${px}" cy="${py}" r="16" fill="${!l.degrees?'#f0f5f2':d[k]%2?'#f4d49d':'#badccc'}" stroke="#4c7f72" stroke-width="1.5"/><text x="${px}" y="${py+5}" text-anchor="middle" font-family="Georgia" font-size="14" fill="#173f42">${k}</text>${l.degrees?`<text x="${px+20}" y="${py-12}" font-family="system-ui" font-size="11" fill="#526b7c">${d[k]}</text>`:''}`).join('');
    html=svg(body,'Four land areas of Königsberg joined by bridges, with the degree of each area')+`${l.degrees?`<div class="lab-status">Odd-degree areas: ${odd}</div><div class="lab-status">${odd===0?'A closed walk can cross every bridge exactly once.':odd===2?'A walk can cross every bridge exactly once, between the two odd areas.':'No walk crosses every bridge exactly once.'}</div>`:''}<div class="lab-buttons">${labButton('bridge-degrees',l.degrees?'Hide the degrees':'Show the degrees')}${labButton('bridge-BC',l.extra.includes('BC')?'Remove bridge B–C':'Add bridge B–C')}${labButton('bridge-AD',l.extra.includes('AD')?'Remove bridge A–D':'Add bridge A–D')}</div><p class="lab-caption">${l.degrees?'Yellow areas have odd degree. In a walk that crosses every bridge once, every area other than the start and the end must have even degree.':'Count the bridge ends at each area, then show the degrees to check.'}</p>`;
  }else if(id==='dm-p08'){
    title='Every covering of a 2 × n strip';l.n??=2;const all=D.stripTilings(l.n),cell=Math.min(18,Math.floor(150/l.n));
    const strip=t=>{let x=0,body='';for(const piece of t){if(piece==='V'){body+=`<rect x="${x+1}" y="1" width="${cell-2}" height="${2*cell-2}" rx="3" fill="#badccc" stroke="#4c7f72"/>`;x+=cell;}else{body+=`<rect x="${x+1}" y="1" width="${2*cell-2}" height="${cell-2}" rx="3" fill="#f4d49d" stroke="#8b6532"/><rect x="${x+1}" y="${cell+1}" width="${2*cell-2}" height="${cell-2}" rx="3" fill="#f4d49d" stroke="#8b6532"/>`;x+=2*cell;}}return `<svg class="strip-svg" viewBox="0 0 ${cell*l.n} ${2*cell}" width="${cell*l.n}" height="${2*cell}" aria-hidden="true">${body}</svg>`;};
    const v=all.filter(t=>t[0]==='V'),h=all.filter(t=>t[0]==='H');
    html=`<div class="lab-buttons strip-controls"><button data-lab="strip-down" aria-label="Shorter strip" ${l.n<=1?'disabled':''}>−</button><span class="lab-equation">T(${l.n}) = ${all.length}</span><button data-lab="strip-up" aria-label="Longer strip" ${l.n>=6?'disabled':''}>+</button></div><div class="strip-group"><span class="eyebrow">Starts with a vertical domino</span><div class="strip-list">${v.map(strip).join('')}</div></div>${h.length?`<div class="strip-group"><span class="eyebrow">Starts with two horizontal dominoes</span><div class="strip-list">${h.map(strip).join('')}</div></div>`:''}<p class="lab-caption">Sort the coverings by how the left end starts. How do the two groups compare with shorter strips?</p>`;
  }else if(id==='dm-p09'){
    title='All 24 ways to hand back 4 hats';l.only??=false;l.marked??=false;const perms=D.permutations(4),good=perms.filter(D.derangement);
    html=`<div class="perm-grid">${(l.marked&&l.only?good:perms).map(p=>`<span class="perm${l.marked&&D.derangement(p)?' derangement':''}">${p.join('')}</span>`).join('')}</div>${l.marked?`<div class="lab-status">Orders in which nobody gets their own hat: ${good.length} of ${perms.length}</div>`:''}<div class="lab-buttons">${labButton('perm-mark',l.marked?'Hide the highlighting':'Highlight the orders where nobody gets their own hat')}${l.marked?labButton('perm-toggle',l.only?'Show all 24 orders':'Show only these orders'):''}</div><p class="lab-caption">${l.marked?'Each order lists the hats that guests 1, 2, 3 and 4 receive. Highlighted orders give no guest their own hat.':'Each order lists the hats that guests 1, 2, 3 and 4 receive.'}</p>`;
  }else if(id==='dm-p10'){
    title='Kruskal’s algorithm, one cable at a time';l.k??=0;const steps=D.kruskal(D.CABLES),shown=steps.slice(0,l.k),last=shown[shown.length-1];
    const P={A:[40,62],B:[140,26],C:[118,132],D:[222,88],E:[204,204],F:[296,172]};
    let body=D.CABLES.map(([a,b,w])=>{const s=shown.find(x=>x.a===a&&x.b===b),mx=(P[a][0]+P[b][0])/2,my=(P[a][1]+P[b][1])/2;const stroke=!s?'#c9d8cf':s.accepted?'#217b61':'#d8b3a6';return `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${stroke}" stroke-width="${s?.accepted?4:2}"${s&&!s.accepted?' stroke-dasharray="5 4"':''}/><rect x="${mx-9}" y="${my-9}" width="18" height="18" rx="9" fill="#ffffff" stroke="${stroke}"/><text x="${mx}" y="${my+4}" text-anchor="middle" font-family="system-ui" font-size="11" fill="#173f42">${w}</text>`;}).join('');
    body+=Object.entries(P).map(([k,[px,py]])=>`<circle cx="${px}" cy="${py}" r="15" fill="#f0f5f2" stroke="#4c7f72" stroke-width="1.5"/><text x="${px}" y="${py+5}" text-anchor="middle" font-family="Georgia" font-size="14" fill="#173f42">${k}</text>`).join('');
    html=svg(body,'Six schools and the possible cables with their costs',232)+`${last?`<div class="lab-status"><span>${last.a}–${last.b} (${last.w})</span>: <span>${last.accepted?'accepted':'rejected'}</span></div>`:''}<div class="lab-status">Total cost: ${last?last.total:0}</div><div class="lab-buttons">${labButton('kruskal-next','Next cable →',l.k>=steps.length)}${labButton('kruskal-reset','Start again')}</div><p class="lab-caption">Cables are tried from cheapest to most expensive. A cable is rejected when its two schools are already connected.</p>`;
  }
  $('lab-title').textContent=title;$('lab').innerHTML=html;
}
function labAction(action,value){
  const id=current().id,l=labState[id];if(!l)return;
  if(action.startsWith('slot-')){const x=action.slice(5);if(x==='reset')l.slots={A:0,B:0,C:0,D:0,E:0,F:0};else if(x in l.slots)l.slots[x]=(l.slots[x]+1)%4;}
  else if(action==='paths-close')l.closed=!l.closed;
  else if(action==='paths-next')l.filled=Math.min(8,l.filled+1);else if(action==='paths-all')l.filled=8;else if(action==='paths-reset')l.filled=1;
  else if(action==='pigeon-sum'||action==='pigeon-odd'){l.mode=action==='pigeon-sum'?'sum':'odd';}
  else if(action==='pick-clear')l.chosen=[];
  else if(action.startsWith('pick-')){const n=Number(action.slice(5));if(Number.isInteger(n)&&n>=1&&n<=20)l.chosen=l.chosen.includes(n)?l.chosen.filter(x=>x!==n):[...l.chosen,n];}
  else if(action==='hanoi-reset'){l.pegs=D.hanoiStart(l.n);l.moves=0;}
  else if(action==='hanoi-3'||action==='hanoi-4'){l.n=Number(action.slice(6));l.pegs=D.hanoiStart(l.n);l.moves=0;}
  else if(action.startsWith('hanoi-')){const [,f,t]=action.split('-').map(Number),next=D.hanoiMove(l.pegs,f,t);if(!next){toast('A larger disc cannot go on a smaller one.');return;}l.pegs=next;l.moves++;}
  else if(action==='board-count')l.counted=!l.counted;
  else if(action==='board-colors')l.colors=!l.colors;else if(action==='board-swap')l.balanced=!l.balanced;
  else if(action==='tromino-2'||action==='tromino-3'){l.n=Number(action.slice(8));l.hole=[0,0];}
  else if(action.startsWith('hole-')){const [,r,c]=action.split('-').map(Number);if(r<2**l.n&&c<2**l.n)l.hole=[r,c];}
  else if(action==='bridge-degrees')l.degrees=!l.degrees;
  else if(action.startsWith('bridge-')){const b=action.slice(7);l.extra=l.extra.includes(b)?l.extra.filter(x=>x!==b):[...l.extra,b];}
  else if(action==='strip-down')l.n=Math.max(1,l.n-1);else if(action==='strip-up')l.n=Math.min(6,l.n+1);
  else if(action==='perm-mark'){l.marked=!l.marked;if(!l.marked)l.only=false;}
  else if(action==='perm-toggle')l.only=!l.only;
  else if(action==='kruskal-next')l.k=Math.min(D.CABLES.length,l.k+1);else if(action==='kruskal-reset')l.k=0;
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
  else if(b.id==='reset-open')showModal('Reset Discrete Mathematics?',`<p>This clears only your Discrete Mathematics project responses. You can export your current notes and the previously saved original first.</p><div class="modal-actions"><button id="export">Export current notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button class="primary" id="reset-confirm">Clear Discrete Mathematics responses</button><button id="reset-cancel">Keep my work</button></div>`);
  else if(b.id==='reset-cancel')showSession();else if(b.id==='reset-confirm'){if(saveBlocked){try{if(storage.getItem(KEY)!==lastStored){toast('The saved original changed. Reload before resetting.');return;}storage.removeItem(KEY);blockedOriginal=null;lastStored=null;saveBlocked=false;}catch{toast('The original could not be cleared. Your work is kept.');return;}}state={version:1,project:current().id,steps:{},answers:{},checks:{},attempts:[]};persist();renderRoute();renderProject();$('modal').close();toast('Your Discrete Mathematics responses have been cleared.');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&projects.length)persist();});
window.addEventListener('pagehide',()=>{if(projects.length)persist();});
window.addEventListener('beforeunload',event=>{if(unsavedWork&&(saveBlocked||!storeAvailable)){event.preventDefault();event.returnValue='';}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
async function boot(){
  try{const r=await fetch('data.json?v=discrete-math-20261030');if(!r.ok)throw Error('Content request failed');projects=await r.json();if(projects.length!==10)throw Error('Content missing');restore();renderRoute();renderProject();$('loading').hidden=true;$('app').hidden=false;}
  catch{$('loading').innerHTML='The project content could not be loaded. <button id="reload">Try loading again</button>';document.getElementById('reload').addEventListener('click',()=>location.reload());}
}
boot();
