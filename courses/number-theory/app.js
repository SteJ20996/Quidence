'use strict';
const C=NTCore,storage={getItem:k=>(window.QuidenceStorage||window.localStorage).getItem(k),setItem:(k,v)=>(window.QuidenceStorage||window.localStorage).setItem(k,v),removeItem:k=>(window.QuidenceStorage||window.localStorage).removeItem(k)},KEY='quidence:number-theory-preview:v1';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={'nt-p01':'Square tiles & gcd','nt-p02':'Two jugs, one idea','nt-p09':'Tickets & thresholds','nt-p10':'Endless primes','nt-p03':'Digits & error checks','nt-p04':'An ancient remainder puzzle','nt-p07':'Triangles & whole numbers','nt-p05':'Powers & prime tests','nt-p06':'A toy public-key lock','nt-p08':'Perfect numbers'};
const banners={'nt-p01':'924 = 1 × 588 + 336','nt-p02':'7x + 11y = 1','nt-p09':'n = 5x + 7y,   x, y ≥ 0','nt-p10':'Q = p₁p₂⋯pₖ + 1','nt-p03':'10 ≡ 1 (mod 9)     ·     10 ≡ −1 (mod 11)','nt-p04':'x ≡ 2 (mod 3),  x ≡ 3 (mod 5),  x ≡ 2 (mod 7)','nt-p07':'(m² − n²)² + (2mn)² = (m² + n²)²','nt-p05':'Prime ⇒ passes.   Does passes ⇒ prime?','nt-p06':'m → mᵉ mod n → cᵈ mod n','nt-p08':'σ(n) = sum of the positive divisors of n'};
let projects=[],state={version:1,project:'nt-p01',steps:{},answers:{},checks:{},attempts:[]},saveTimer,toastTimer,storeAvailable=true,blockedOriginal=null,lastStored=null,saveBlocked=false,blockedReason='unreadable',unsavedWork=false,labState={};
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
  if(f.type==='reason')return `<div class="field wide"><label for="${id}">${esc(f.label)}</label><textarea id="${id}" data-field="${f.id}" maxlength="24000" placeholder="State your claim. Explain each step. Say where the conditions matter." aria-describedby="feedback-${f.id}">${esc(val)}</textarea><p class="field-note">Your explanation is saved for review. It is not automatically marked correct.</p>${fb}</div>`;
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
  let learningRequest=null;try{const g=JSON.parse(storage.getItem('cluevera_learning_goal_v1')||'null');if(g?.subject==='number-theory'&&g.includeInReport===true&&typeof g.text==='string')learningRequest={text:g.text,capturedAt:new Date().toISOString()};}catch{}
  state.attempts.push({project:p.id,step:i,time:new Date().toISOString(),results,learningRequest});persist();
  $('check-summary').textContent=[objective?`${good} of ${objective} calculations or choices match.`:'',pending?`${pending} explanation${pending===1?'':'s'} saved for review.`:'',empty?`${empty} response${empty===1?'':'s'} still open.`:''].filter(Boolean).join(' ');
  if(!empty)document.querySelector(`[data-step="${i}"]`).classList.add('done');
}
function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;$('modal').showModal();}
function showToolkit(){
  const proofs=[
    ['Bézout’s identity','For positive integers a and b, there are integers x and y with ax + by = gcd(a, b).',
      'Run the Euclidean algorithm on a and b. Every nonzero remainder is an integer linear combination of a and b. Initially a = 1·a + 0·b and b = 0·a + 1·b. If two consecutive remainders are A·a + B·b and C·a + D·b, the next remainder is their difference after multiplying the second by an integer quotient q. Its coefficients are A − qC and B − qD, still integers.',
      'The nonnegative remainders strictly decrease, so the algorithm terminates. At every division r₀ = q·r₁ + r₂, the pairs (r₀, r₁) and (r₁, r₂) have the same positive common divisors: a divisor of either pair divides the missing member by subtraction or addition. At the final pair (g, 0), those common divisors are exactly the positive divisors of g. Hence the last nonzero remainder is gcd(a, b). Since it is an integer linear combination, g = ax + by. ∎'],
    ['Euclid’s lemma and cancellation','If a prime p divides ab, then p divides a or p divides b.',
      'If p divides a, the conclusion already holds. Otherwise, the only positive divisors of the prime p are 1 and p, so gcd(p, a) = 1. Bézout gives integers u and v with up + va = 1. Multiply by b: upb + vab = b. Both terms on the left are divisible by p, because p divides ab. Therefore p divides b. ∎',
      'More generally, if gcd(m, n) = 1 and m divides nk, write um + vn = 1 and multiply by k. Both umk and vnk are multiples of m, so m divides k. This is the cancellation rule used in the jug and ticket projects.'],
    ['Unique prime factorization','Every integer n ≥ 2 is a product of primes, uniquely apart from their order.',
      'Existence follows by strong induction. The integer 2 is prime. Assume every integer from 2 to n − 1 is a product of primes. If n is prime, it is already such a product. Otherwise n = ab with 1 < a, b < n; the induction hypothesis factors a and b into primes, and combining their factorizations factors n.',
      'For uniqueness, suppose p₁⋯pᵣ = q₁⋯qₛ are two products of primes. Euclid’s lemma, applied repeatedly, implies that p₁ divides some qⱼ. Since qⱼ is prime and p₁ > 1, p₁ = qⱼ. Move this factor to the front and cancel it from both products. Repeat. One side cannot run out of factors first: the empty product is 1, while a nonempty product of primes is at least 2. Thus every factor, including its multiplicity, matches. ∎']
  ];
  showModal('Proof toolkit',`<p>These three foundation proofs supply the general results used by the projects. You can return to them whenever a step uses a theorem you have not met before.</p><div>${proofs.map((a,i)=>`<details class="tool-proof" ${i===0?'open':''}><summary>${esc(a[0])}</summary><div>${a.slice(1).map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div>`);
}
function totals(){let objective=0,correct=0,pending=0,responses=0;for(const p of projects)p.steps.forEach((s,i)=>s.fields.forEach(f=>{const k=key(p,i,f),v=valueOf(p,i,f);if(C.filled(f,v)){responses++;if(f.type==='reason')pending++;else objective++;}if(f.type!=='reason'&&state.checks[k]?.status==='correct')correct++;}));return {objective,correct,pending,responses};}
function showSession(projectOnly=false){
  const t=totals(),ps=projectOnly?[current()]:projects;let entries='';
  for(const p of ps)p.steps.forEach((s,i)=>{const rows=s.fields.filter(f=>C.filled(f,valueOf(p,i,f))).map(f=>{const k=key(p,i,f),v=valueOf(p,i,f),g=state.checks[k];const st=f.type==='reason'?'Pending proof review':g?.status==='correct'?'Checked calculation / choice':g?.status==='retry'||g?.status==='format'?'Revisit this response':'Draft response';return `<div class="session-item"><span class="session-state ${f.type==='reason'?'pending':g?.status==='retry'?'retry':''}">${st}</span><h3>${esc(f.label)}</h3><p ${['reason','number'].includes(f.type)?'data-no-translate class="student-work"':'class="session-choice"'}>${esc(displayAnswer(f,v))}</p></div>`;});if(rows.length)entries+=`<h3 style="margin-top:23px;font-weight:550">${esc(names[p.id])} · Step ${i+1}</h3>${rows.join('')}`;});
  showModal(projectOnly?'Your project notes':'Your number theory session',`<p>This is a record of your actual responses. Matching a calculation does not establish mastery, and explanations remain pending review.</p><div class="summary-stats"><div><span>${t.responses}</span>Responses saved</div><div><span>${t.correct}</span>Calculations / choices matched</div><div><span>${t.pending}</span>Explanations to review</div></div>${entries||'<p>No responses yet. Try a step, then return here to see your work.</p>'}<div class="modal-actions"><button class="primary" id="export">Export session notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button id="reset-open">Reset Number Theory</button></div>`);
}
function sessionMarkdown(){
  const t=s=>window.QuidenceI18n?.text(s)||s;
  const status=s=>t(({correct:'Checked calculation / choice',pending:'Pending proof review',retry:'Revisit this response',format:'Check the response format',empty:'No response yet',Draft:'Draft response'})[s]||'Draft response');
  const response=(f,v)=>f.type==='choice'?t(displayAnswer(f,v)):f.type==='multi'?v.map(x=>t(f.options.find(o=>o.value===x)?.label||x)).join(', '):v;
  let text='# Quidence · '+t('Number Theory Preview')+'\n\n'+t('Responses and reasoning from this browser. Proofs are pending review; numerical matches are not mastery judgments.')+'\n';
  if(saveBlocked||!storeAvailable)text+='\n'+t('These notes include current work that could not be saved in this browser. The previously saved record is kept separately.')+'\n';
  for(const p of projects){let body='';p.steps.forEach((s,i)=>{for(const f of s.fields){const v=valueOf(p,i,f);if(C.filled(f,v)){const g=state.checks[key(p,i,f)];body+=`\n### ${t('Step')} ${i+1} · ${t(s.title)}\n\n${t(f.label)}\n\n${response(f,v)}\n\n${t('Response status')}: ${status(f.type==='reason'?'pending':g?.status||'Draft')}\n`;}}});if(body)text+=`\n## ${t(p.title)}\n${body}`;}
  if(state.attempts.length){text+='\n## '+t('Check history')+'\n\n'+t('Each check preserves the responses supplied at that time.')+'\n';for(const a of state.attempts){const p=projects.find(p=>p.id===a.project);if(!p||!p.steps[a.step])continue;text+=`\n### ${a.time} · ${t(p.title)} · ${t('Step')} ${a.step+1}\n`;if(a.learningRequest?.text)text+='\n'+t('Learning request included with this check (original wording):')+'\n\n'+a.learningRequest.text+'\n';for(const r of a.results){const f=p.steps[a.step].fields.find(f=>f.id===r.field);if(f&&C.filled(f,r.value))text+=`\n${t(f.label)}\n\n${response(f,r.value)}\n\n${t('Response status')}: ${status(r.status)}\n`;}}}
  return text;
}
function downloadNotes(text,name,type){try{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;}catch{toast('The download could not start. Your current notes are still visible.');return false;}}
function exportSession(){persist();if(downloadNotes(sessionMarkdown(),'Quidence-number-theory-session.md','text/markdown;charset=utf-8'))toast('Your current session notes have been exported.');}
function exportOriginal(){if(blockedOriginal===null)return;let json=true;try{JSON.parse(blockedOriginal);}catch{json=false;}if(downloadNotes(blockedOriginal,'Quidence-number-theory-saved-original.'+(json?'json':'txt'),json?'application/json':'text/plain;charset=utf-8'))toast('The previously saved original has been exported separately.');}

function svg(body,label,height=235){return `<svg class="lab-svg" viewBox="0 0 330 ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>`;}
function labButton(action,label,disabled=false){return `<button data-lab="${action}" ${disabled?'disabled':''}>${label}</button>`;}
function renderLab(){
  const id=current().id,l=labState[id]||(labState[id]={});let html='',title='Explore the idea';
  if(id==='nt-p01'){
    title='A floor, cut into squares';l.cut??=0;const k=.306,x=20,y=27;
    const rect=(a,b,w,h,fill)=>`<rect x="${x+a*k}" y="${y+b*k}" width="${w*k}" height="${h*k}" fill="${fill}" stroke="#739c8c" stroke-width="1"/>`;
    let body=rect(0,0,924,588,'#f0f5f2')+`<text x="162" y="17" text-anchor="middle" font-family="system-ui" font-size="12" fill="#526b7c">924 cm</text><text x="163" y="225" text-anchor="middle" font-family="system-ui" font-size="11" fill="#526b7c">Height: 588 cm</text>`;
    if(l.cut>=1)body+=rect(0,0,588,588,'#badccc')+'<text x="111" y="125" text-anchor="middle" font-family="Georgia" font-size="18" fill="#28644c">588 × 588</text>';
    if(l.cut>=2)body+=rect(588,0,336,336,'#d3dfb4')+'<text x="251" y="81" text-anchor="middle" font-family="Georgia" font-size="15" fill="#426544">336</text>';
    if(l.cut>=3)body+=rect(588,336,252,252,'#f4d49d')+'<text x="238" y="175" text-anchor="middle" font-family="Georgia" font-size="15" fill="#8b6532">252</text>';
    if(l.cut>=4)for(let i=0;i<3;i++)body+=rect(840,336+i*84,84,84,'#9bc5c8')+`<text x="290" y="${y+(379+i*84)*k+4}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#335b65">84</text>`;
    const equations=['Start with the full 924 × 588 floor.','924 = 1 × 588 + 336','588 = 1 × 336 + 252','336 = 1 × 252 + 84','252 = 3 × 84 + 0'];
    html=svg(body,'Euclidean square-cutting model of a 924 by 588 centimeter floor')+`<div class="lab-status">${equations[l.cut]}</div><p class="lab-caption">Each cut leaves a smaller rectangle. What stays the same about its common divisors?</p><div class="lab-buttons">${labButton('tile-next','Next cut →',l.cut>=4)}${labButton('tile-reset','Start again')}</div>`;
  }else if(id==='nt-p02'){
    title='Try the allowed moves';const caps=stepIndex()>=2?[6,15]:[7,11],capkey=caps.join('-');if(l.capkey!==capkey){l.capkey=capkey;l.amounts=[0,0];l.history=[];l.moves=0;}
    html=`<div class="jug-row">${caps.map((cap,i)=>`<div class="jug-container">${cap} L jug<div class="jug"><div class="water" style="height:${100*l.amounts[i]/cap}%"></div><span>${l.amounts[i]} L</span></div><small>Capacity ${cap} L</small></div>`).join('')}</div><p class="lab-caption">Fill, empty or pour until a jug is full or empty. ${caps[0]===7?'Can you leave 1 L in the larger jug?':'Notice the multiple-of-3 invariant.'}</p><div class="lab-buttons">${labButton('jug-fill-0',`Fill ${caps[0]} L`)}${labButton('jug-fill-1',`Fill ${caps[1]} L`)}${labButton('jug-pour-0',`${caps[0]} → ${caps[1]}`)}${labButton('jug-pour-1',`${caps[1]} → ${caps[0]}`)}${labButton('jug-empty-0',`Empty ${caps[0]} L`)}${labButton('jug-empty-1',`Empty ${caps[1]} L`)}</div><div class="lab-status">(${l.amounts[0]}, ${l.amounts[1]}) · ${l.moves} moves${caps[0]===7&&l.amounts[1]===1?' · Target reached!':''}</div><div class="lab-buttons">${labButton('jug-undo','Undo',!l.history.length)}${labButton('jug-reset','Reset jugs')}</div><p class="lab-note" style="margin-top:10px">The model helps you explore. Your proof must explain which amounts can or cannot be reached.</p>`;
  }else if(id==='nt-p09'){
    title='One threshold per remainder';l.group??=24;const t=C.ticket(l.group);
    html=`<p class="lab-caption">Five classes cover every possible group size. Each class begins at 7b, then grows by 5.</p>${[0,1,2,3,4].map(b=>`<div class="threshold-row"><span>mod 5: ${7*b%5}</span><span class="threshold-bar" style="width:${Math.max(2,100*7*b/28)}%"></span><span>${7*b}</span></div>`).join('')}<p class="lab-note">Bar length = threshold, not a list of group sizes.</p><label class="lab-label" for="ticket-group">Explore a group size</label><input class="lab-input" id="ticket-group" data-lab="ticket-group" type="number" min="0" max="1000000" step="1" value="${l.group}"><div class="lab-status">${l.group} mod 5 = ${l.group%5}<br>Threshold: 7 × ${t.b} = ${t.threshold}<br>${t.possible?`${l.group} = 5 × ${t.a} + 7 × ${t.b}`:`${l.group} is below its threshold. It is impossible.`}</div>`;
  }else if(id==='nt-p10'){
    title='A new factor, not always a prime';l.prime??=2;
    html='<div class="lab-equation">2 × 3 × 5 × 7 × 11 × 13 + 1</div><p class="lab-caption">Choose a prime from the list. The product is divisible by that prime, so adding 1 leaves remainder 1.</p><div class="lab-buttons">'+[2,3,5,7,11,13].map(p=>labButton('prime-'+p,String(p))).join('')+`</div><div class="lab-status">Q mod ${l.prime} = 1</div><p class="lab-caption">Every prime factor of Q must be outside this list. That is enough for Euclid’s argument.</p>`;
  }else if(id==='nt-p03'){
    title='What changes in a digit swap?';l.swapped??=false;const ds=l.swapped?[5,2,1,3,7]:[5,2,3,1,7],n=Number(ds.join(''));
    html=`<div class="digit-row">${ds.map(d=>`<span class="digit">${d}</span>`).join('')}</div><div class="lab-buttons">${labButton('digits-swap','Swap the two middle digits')}</div><div class="lab-results"><div><span>Remainder mod 9</span>${n%9}</div><div><span>Remainder mod 11</span>${n%11}</div></div><p class="lab-caption">The digit sum stays the same. The alternating remainder changes when different neighboring digits swap.</p><div class="lab-equation">Δ = 9 · 10ʲ · (u − v)</div><p class="lab-note">The sign depends on which number is subtracted from the other.</p>`;
  }else if(id==='nt-p04'){
    title='Build the answer by substitution';l.build??=0;
    html='<div class="lab-equation">x ≡ 2 (mod 7)<br>x ≡ 3 (mod 5)<br>x ≡ 2 (mod 3)</div>'+['x = 7k + 2','k = 5j + 3  →  x = 35j + 23','j = 3i  →  x = 105i + 23'].slice(0,l.build).map(t=>`<div class="lab-status">${t}</div>`).join('')+`<p class="lab-caption">Substitute one condition into the next. Each step should work in both directions.</p><div class="lab-buttons">${labButton('crt-next','Next substitution →',l.build>=3)}${labButton('crt-reset','Start again')}</div>`;
  }else if(id==='nt-p07'){
    title='A triangle meets the unit circle';l.m??=3;l.n??=2;const t=C.triple(l.m,l.n),cx=152,cy=119,r=86,px=cx+r*t.a/t.c,py=cy-r*t.b/t.c;
    html=svg(`<line x1="40" y1="${cy}" x2="283" y2="${cy}" stroke="#d1dce0"/><line x1="${cx}" y1="19" x2="${cx}" y2="218" stroke="#d1dce0"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#91b4a6" stroke-width="1.5"/><path d="M ${cx} ${cy} L ${px} ${cy} L ${px} ${py} Z" fill="#e3f0e7" stroke="#4c9780" stroke-width="1.5"/><line x1="${cx-r}" y1="${cy}" x2="${px}" y2="${py}" stroke="#c28b3d" stroke-dasharray="4 3"/><circle cx="${px}" cy="${py}" r="4" fill="#217b61"/><text x="${cx-r-9}" y="${cy+17}" font-size="10" fill="#526b7c">−1</text><text x="${cx+r+4}" y="${cy+17}" font-size="10" fill="#526b7c">1</text><text x="${px+6}" y="${Math.max(18,py-7)}" font-family="Georgia" font-size="12" fill="#217b61">P</text><text x="20" y="230" font-size="11" fill="#526b7c">x² + y² = 1 · slope t = ${l.n}/${l.m}</text>`,'Unit circle with a rational-slope line and its integer-triangle point',245)+`<label class="lab-label" for="triple-m">m = ${l.m}</label><input id="triple-m" data-lab="triple-m" type="range" min="2" max="10" value="${l.m}" style="width:100%;accent-color:#217b61"><label class="lab-label" for="triple-n">n = ${l.n}</label><input id="triple-n" data-lab="triple-n" type="range" min="1" max="${l.m-1}" value="${l.n}" style="width:100%;accent-color:#217b61"><div class="lab-status">Sides: (${t.a}, ${t.b}, ${t.c})<br>P = (${t.a}/${t.c}, ${t.b}/${t.c})<br>${t.g===1?'Primitive: the three sides have gcd 1.':`Not primitive: the three sides have gcd ${t.g}.`}</div><p class="lab-caption">Changing m and n changes the point. The algebraic identity explains every triangle this formula creates.</p>`;
  }else if(id==='nt-p05'){
    title='A repeated-squaring chain';l.square??=0;
    html=Array.from({length:l.square+1},(_,i)=>`<div class="sequence-row"><span>3${i===0?'':`<sup>${2**i}</sup>`} mod 17</span><span>${C.powMod(3,2**i,17)}</span></div>`).join('')+`<div class="lab-buttons">${labButton('square-next','Square once more →',l.square>=5)}${labButton('square-reset','Restart')}</div><p class="lab-caption">Each squaring doubles the exponent. Five squarings reach exponent 32.</p><div class="lab-equation">45 = 32 + 8 + 4 + 1</div><p class="lab-note">Multiply only the powers used in this sum to compute 3⁴⁵.</p>`;
  }else if(id==='nt-p06'){
    title='Lock, then unlock';l.message??=9;
    html='<div class="lab-status">Public key: n = 143, e = 7</div>'+`<label class="lab-label" for="rsa-message">Message (a whole number from 0 to 142)</label><input id="rsa-message" class="lab-input" data-lab="rsa-message" type="number" min="0" max="142" step="1" value="${l.message}"><div class="lab-buttons">${labButton('rsa-lock','Lock message →')}${labButton('rsa-unlock','Unlock',l.cipher===undefined)}</div>${l.cipher!==undefined?`<div class="lab-status">${l.message}⁷ mod 143 = ${l.cipher}</div>`:''}${l.unlocked!==undefined?`<div class="lab-status">${l.cipher}¹⁰³ mod 143 = ${l.unlocked}<br>The original message returns.</div>`:''}<p class="lab-caption">Try a message divisible by 11 or 13. Why must the correctness proof handle that case separately?</p><p class="lab-note">A small-number mathematical demonstration, using the toy secret exponent 103.</p>`;
  }else if(id==='nt-p08'){
    title='A product that counts divisors';l.expanded??=false;l.factor??=0;
    html='<p class="lab-caption">28 = 2² × 7. Every divisor chooses one exponent for 2 and one for 7.</p><div class="factor-groups"><span>1 + 2 + 4</span><span>×</span><span>1 + 7</span></div><div class="lab-buttons">'+labButton('factor-expand',l.expanded?'Hide the expansion':'Expand the product')+'</div>'+(l.expanded?'<div class="factor-product">'+[1,2,4,7,14,28].map(n=>labButton('factor-'+n,String(n))).join('')+`</div><div class="lab-status">${l.factor?`${l.factor} = ${l.factor%7===0?l.factor/7:l.factor} × ${l.factor%7===0?7:1}<br>`:''}σ(28) = 7 × 8 = 56<br>s(28) = 56 − 28 = 28</div>`:'')+'<p class="lab-caption">The expansion follows from exponent choices. It explains why each divisor is counted exactly once.</p>';
  }
  $('lab-title').textContent=title;$('lab').innerHTML=html;
}
function labAction(action,value){
  const id=current().id,l=labState[id];if(!l)return;
  if(action==='tile-next')l.cut=Math.min(4,l.cut+1);else if(action==='tile-reset')l.cut=0;
  else if(action.startsWith('jug-')){
    const caps=l.capkey.split('-').map(Number);
    if(action==='jug-reset'){l.amounts=[0,0];l.moves=0;l.history=[];}
    else if(action==='jug-undo'){const prev=l.history.pop();if(prev){l.amounts=prev.amounts;l.moves=prev.moves;}}
    else{const [,op,pos]=action.split('-'),i=Number(pos);if(![0,1].includes(i))return;const next=l.amounts.slice();if(op==='fill')next[i]=caps[i];else if(op==='empty')next[i]=0;else if(op==='pour'){const a=C.pour(next,caps,i);next[0]=a[0];next[1]=a[1];}else return;if(next[0]!==l.amounts[0]||next[1]!==l.amounts[1]){l.history.push({amounts:l.amounts.slice(),moves:l.moves});l.amounts=next;l.moves++;}}
  }else if(action==='ticket-group'){const n=Number(value);if(!Number.isInteger(n)||n<0||n>1000000){toast('Choose a whole group size from 0 to 1,000,000.');return;}l.group=n;}
  else if(action.startsWith('prime-'))l.prime=Number(action.split('-')[1]);
  else if(action==='digits-swap')l.swapped=!l.swapped;
  else if(action==='crt-next')l.build=Math.min(3,l.build+1);else if(action==='crt-reset')l.build=0;
  else if(action==='triple-m'){l.m=Math.max(2,Math.min(10,Number(value)));l.n=Math.min(l.n,l.m-1);}
  else if(action==='triple-n')l.n=Math.max(1,Math.min(l.m-1,Number(value)));
  else if(action==='square-next')l.square=Math.min(5,l.square+1);else if(action==='square-reset')l.square=0;
  else if(action==='rsa-message'){const n=Number(value);if(!Number.isInteger(n)||n<0||n>142){toast('Choose a whole-number message from 0 to 142.');return;}l.message=n;delete l.cipher;delete l.unlocked;}
  else if(action==='rsa-lock'){const raw=$('rsa-message').value,n=Number(raw);if(!raw.trim()||!Number.isInteger(n)||n<0||n>142){toast('Choose a whole-number message from 0 to 142.');return;}l.message=n;l.cipher=C.powMod(n,7,143);delete l.unlocked;}
  else if(action==='rsa-unlock'&&l.cipher!==undefined)l.unlocked=C.powMod(l.cipher,103,143);
  else if(action==='factor-expand')l.expanded=!l.expanded;
  else if(action.startsWith('factor-'))l.factor=Number(action.split('-')[1]);
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
  else if(b.id==='reset-open')showModal('Reset Number Theory?',`<p>This clears only your Number Theory project responses. You can export your current notes and the previously saved original first.</p><div class="modal-actions"><button id="export">Export current notes</button>${blockedOriginal!==null?'<button id="export-original">Export saved original separately</button>':''}<button class="primary" id="reset-confirm">Clear Number Theory responses</button><button id="reset-cancel">Keep my work</button></div>`);
  else if(b.id==='reset-cancel')showSession();else if(b.id==='reset-confirm'){if(saveBlocked){try{if(storage.getItem(KEY)!==lastStored){toast('The saved original changed. Reload before resetting.');return;}storage.removeItem(KEY);blockedOriginal=null;lastStored=null;saveBlocked=false;}catch{toast('The original could not be cleared. Your work is kept.');return;}}state={version:1,project:current().id,steps:{},answers:{},checks:{},attempts:[]};persist();renderRoute();renderProject();$('modal').close();toast('Your Number Theory responses have been cleared.');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&projects.length)persist();});
window.addEventListener('pagehide',()=>{if(projects.length)persist();});
window.addEventListener('beforeunload',event=>{if(unsavedWork&&(saveBlocked||!storeAvailable)){event.preventDefault();event.returnValue='';}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
async function boot(){
  try{const r=await fetch('data.json?v=number-theory-20261010');if(!r.ok)throw Error('Content request failed');projects=await r.json();if(projects.length!==10)throw Error('Content missing');restore();renderRoute();renderProject();$('loading').hidden=true;$('app').hidden=false;}
  catch{$('loading').innerHTML='The project content could not be loaded. <button id="reload">Try loading again</button>';document.getElementById('reload').addEventListener('click',()=>location.reload());}
}
boot();
