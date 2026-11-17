(function(root){
'use strict';
// The quick-rounds panel on the Quantitative Reasoning course page. view(record, ui) is a pure function of the saved
// record and the panel's temporary state; mount() wires it to the page and to localStorage.
const R=typeof module==='object'&&module.exports?require('./quant-rounds.js'):root.QuidenceQuantRounds;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=x=>Math.round(100*x)+'%';
function current(record){const r=record.rounds.at(-1);return r&&r.answers.length<R.ROUND_SIZE?r:null;}
function history(record){
 const done=record.rounds.filter(r=>r.answers.length===R.ROUND_SIZE).slice(-8).reverse();
 if(!done.length)return'';
 return`<div class="table-wrap"><table class="summary-table quick-history"><caption>Your last rounds</caption><thead><tr><th scope="col">Date</th><th scope="col">Right</th><th scope="col">Average confidence</th><th scope="col">Brier score</th></tr></thead><tbody>${done.map(r=>{const s=R.summary(r.answers);return`<tr><th scope="row">${esc(new Date(r.startedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'}))}</th><td>${s.right} of ${s.count}</td><td>${Math.round(s.meanConfidence)}%</td><td>${s.brier.toFixed(2)}</td></tr>`;}).join('')}</tbody></table></div>`;
}
function calibrationText(c){
 if(!c.enough)return`Five answers are too few to judge calibration. After ${c.needed} answers (you have ${c.count}), this panel compares your confidence with how often you were right.`;
 return`Over your last ${c.count} answers: ${Math.round(100*c.accuracy)}% right, at an average confidence of ${Math.round(c.meanConfidence)}%. ${verdict(c)}`;
}
function verdict(s){
 const gap=Math.round(Math.abs(s.gap));
 return s.verdict==='well calibrated'?`Your confidence matched your accuracy to within ${gap} points: well calibrated.`:s.verdict==='overconfident'?`You were ${gap} points more confident than accurate. Slow down on the questions you felt sure of.`:`You were right more often than you expected, by ${gap} points. You can trust these moves a little more.`;
}
function view(record,ui={}){
 const round=current(record)||(ui.feedback?record.rounds.at(-1):null),intro=`<p class="eyebrow">PRACTICE</p><h2 id="quick-rounds-title">Quick rounds</h2><p class="muted">Five quick questions mixed from the lessons. Answer, say how sure you are, then see the check. Accuracy comes first: the timer is optional and only counts up.</p>`;
 if(!round){
  const last=record.rounds.at(-1),s=last&&R.summary(last.answers);
  const result=ui.finished&&s?`<div class="quick-result" tabindex="-1"><p class="quick-score"><strong>${s.right} of ${s.count} right</strong> · average confidence ${Math.round(s.meanConfidence)}% · Brier score ${s.brier.toFixed(2)}</p><p class="quick-calibration">${esc(calibrationText(R.calibration(record)))}</p><p class="tiny">The Brier score averages (confidence − outcome)² over the questions: 0 is perfect, and always saying 50% scores 0.25.</p></div>`:'';
  return`${intro}${result}<div class="actions"><button class="btn primary" data-qr="start">${record.rounds.length?'Start another round →':'Start a round →'}</button><label class="quick-timer"><input type="checkbox" data-qr="timer" ${record.timer?'checked':''}> Show a timer</label></div>${history(record)}${ui.storage===false?'<p class="tiny">Rounds cannot be saved in this browser, so they last until you leave the page.</p>':''}`;
 }
 // After a check, the question just answered stays on screen with its feedback.
 const items=R.makeRound(round.seed,round.lessons),i=ui.feedback?round.answers.length-1:round.answers.length,item=items[i],answered=ui.feedback;
 const input=item.kind==='choice'?`<fieldset class="quick-choices"><legend>Your answer</legend>${item.options.map(([v,l])=>`<label class="answer-option"><input type="radio" name="qr-answer" value="${esc(v)}" ${ui.response===v?'checked':''} ${answered?'disabled':''}> ${esc(l)}</label>`).join('')}</fieldset>`
  :`<label class="quick-answer">Your answer${item.unit?' ('+esc(item.unit)+')':''}<input type="text" inputmode="decimal" autocomplete="off" name="qr-answer" aria-describedby="qr-prompt qr-rule" value="${esc(ui.response||'')}" ${answered?'disabled':''}></label>`;
 const confidence=`<fieldset class="quick-confidence"><legend>How sure are you that your answer counts as right?</legend>${R.scale(item).map(c=>`<label><input type="radio" name="qr-confidence" value="${c}" ${ui.confidence===c?'checked':''} ${answered?'disabled':''}> ${c}%</label>`).join('')}</fieldset>`;
 const feedback=answered?`<div class="quick-feedback ${answered.correct?'good':'miss'}"><strong>${answered.correct?'Right':'Not this time'}.</strong> ${esc(item.why)}</div><div class="actions"><button class="btn primary" data-qr="next">${i+1<R.ROUND_SIZE?'Next question →':'See your round →'}</button></div>`
  :`${ui.error?`<p class="quick-error" role="alert">${esc(ui.error)}</p>`:''}<div class="actions"><button class="btn primary" data-qr="submit">Check</button>${record.timer?`<span class="tiny quick-clock" aria-live="off">${ui.elapsed||0} s</span>`:''}</div>`;
 return`${intro}<form class="quick-item" data-qr-form novalidate><p class="tiny">Question ${i+1} of ${R.ROUND_SIZE}</p><p class="quick-prompt" id="qr-prompt" tabindex="-1">${esc(item.prompt)}</p>${item.accept?`<p class="tiny quick-rule" id="qr-rule">Counts as right ${esc(item.accept)} of the exact value.</p>`:''}${input}${confidence}${feedback}</form>`;
}
function mount(host,storage=root.localStorage,now=()=>Date.now()){
 let record=R.fresh(),saved=true,ui={},started=0,clock=null;
 try{const raw=storage.getItem(R.SCHEMA);if(raw!==null){const v=R.hydrate(raw);if(v)record=v;else saved=false;}}catch{saved=false;ui.storage=false;}
 // A record that cannot be read is left untouched in storage; new rounds then last only for this visit.
 const persist=()=>{if(!saved)return;try{storage.setItem(R.SCHEMA,JSON.stringify(record));}catch{saved=false;ui.storage=false;}};
 // One live region outside the re-rendered markup announces each check and result; focus moves to what comes next.
 host.innerHTML='<div data-qr-body></div><p class="quick-live" aria-live="polite" data-qr-live></p>';
 const body=host.querySelector('[data-qr-body]'),live=host.querySelector('[data-qr-live]');
 const announce=text=>{live.textContent='';setTimeout(()=>{live.textContent=text;},50);};
 const render=focus=>{body.innerHTML=view(record,ui);const el=focus&&body.querySelector(focus);if(el)el.focus();};
 const tick=()=>{if(!record.timer||!current(record)||ui.feedback)return;ui.elapsed=Math.floor((now()-started)/1000);const c=body.querySelector('.quick-clock');if(c)c.textContent=ui.elapsed+' s';};
 const startClock=()=>{started=now();ui.elapsed=0;if(clock)clearInterval(clock);if(record.timer&&typeof setInterval==='function')clock=setInterval(tick,1000);};
 host.addEventListener('click',e=>{
  const action=e.target.closest?.('[data-qr]')?.dataset.qr;if(!action||action==='timer')return;e.preventDefault();
  if(action==='start'){record.rounds.push({seed:Math.floor(Math.random()*2**31),lessons:[1,2,3,4],startedAt:new Date(now()).toISOString(),answers:[]});ui={storage:ui.storage};persist();startClock();render('#qr-prompt');}
  if(action==='submit'){
   const round=current(record),item=R.makeRound(round.seed,round.lessons)[round.answers.length],form=body.querySelector('[data-qr-form]');
   const response=item.kind==='choice'?(form.querySelector('input[name="qr-answer"]:checked')?.value??''):(form.querySelector('input[name="qr-answer"]').value||'').trim();
   const conf=Number(form.querySelector('input[name="qr-confidence"]:checked')?.value);
   ui.response=response;ui.confidence=R.scale(item).includes(conf)?conf:undefined;
   const correct=R.check(item,response);
   if(correct===null){ui.error=item.kind==='choice'?'Choose an answer.':'Enter a number, such as 12 or 0.5.';render('input[name="qr-answer"]');return;}
   if(!R.scale(item).includes(conf)){ui.error='Say how sure you are before checking.';render('input[name="qr-confidence"]');return;}
   const entry={template:item.template,response,confidence:conf,correct,seconds:record.timer?Math.round((now()-started)/1000):null};
   round.answers.push(entry);if(round.answers.length===R.ROUND_SIZE)round.finishedAt=new Date(now()).toISOString();
   ui.feedback=entry;ui.error='';persist();render('[data-qr="next"]');announce((correct?'Right. ':'Not this time. ')+item.why);
  }
  if(action==='next'){const finished=!current(record);ui={storage:ui.storage,finished};if(!finished){startClock();render('#qr-prompt');}else{if(clock)clearInterval(clock);render('.quick-result');announce(body.querySelector('.quick-result')?.textContent.replace(/\s+/g,' ').trim()||'');}}
 });
 host.addEventListener('change',e=>{if(e.target.dataset?.qr==='timer'){record.timer=e.target.checked;persist();}});
 if(current(record))startClock();
 render();
 return{get record(){return record;},render};
}
const api={view,mount,verdict,calibrationText};
if(typeof module==='object'&&module.exports)module.exports=api;else{root.QuidenceQuickRounds=api;const start=()=>{const host=document.getElementById('quick-rounds');if(host)mount(host);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
})(typeof window==='undefined'?globalThis:window);
