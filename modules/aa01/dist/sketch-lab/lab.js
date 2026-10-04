(() => {
  'use strict';
  const M=window.ClueveraSketch,app=document.querySelector('#app');
  const state={topic:'equation',ready:false,functionId:'positive',negativeUnlocked:false,comparison:false,records:{},events:[],route:null,highlight:null,view:'work',sessionId:crypto.randomUUID()};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const current=()=>state.topic==='equation'?'equation':state.functionId;
  function record(id=current()){
    return state.records[id]??=( {id,draft:{},rawDraft:{},attempts:[],help:{},helpOpen:false,stage:0,elapsed:0,entered:Date.now(),complete:false,result:null,route:null} );
  }
  const elapsed=r=>r.elapsed+(r.entered===null?0:Date.now()-r.entered);
  function pause(r){if(r.entered!==null){r.elapsed+=Date.now()-r.entered;r.entered=null;}}
  function resume(r){if(!r.complete&&r.entered===null)r.entered=Date.now();}
  function collect(){
    const a={};document.querySelectorAll('[data-number]').forEach(el=>a[el.dataset.number]=M.number(el.value));
    document.querySelectorAll('[data-select]').forEach(el=>a[el.dataset.select]=el.value);
    const why=document.querySelector('#why');a.why=why?.value??'';return a;
  }
  function remember(r=record()){
    r.draft=collect();r.rawDraft={};
    document.querySelectorAll('[data-number]').forEach(el=>r.rawDraft[el.dataset.number]=el.value);
    document.querySelectorAll('[data-select]').forEach(el=>r.rawDraft[el.dataset.select]=el.value);
    r.rawDraft.why=document.querySelector('#why')?.value??'';
  }
  function retain(){if(state.view!=='work'||state.topic==='quadratic'&&!state.ready)return;const r=record();remember(r);pause(r);}
  function field(key,label){return `<div><label class="field-label" for="n-${key}">${label}</label><span class="numeric"><button type="button" data-sign="${key}" aria-label="Change sign for ${esc(label)}">±</button><input id="n-${key}" data-number="${key}" inputmode="decimal" type="text" placeholder="Number" autocomplete="off"></span></div>`;}
  function select(key,label,values){return `<div><label class="field-label" for="s-${key}">${label}</label><select id="s-${key}" class="full" data-select="${key}"><option value="">Choose</option>${values.map(([v,t])=>`<option value="${v}">${esc(t)}</option>`).join('')}</select></div>`;}
  const whyBox=()=>`<div><label class="field-label" for="why">Explain the key reason in your own words.</label><textarea id="why" class="full" maxlength="1200" placeholder="A sentence, equation, or calculation is welcome."></textarea><p class="help">Spelling and grammar are not scored. Unrecognized wording stays available for review.</p></div>`;
  function topicTabs(){return `<nav class="tabs" aria-label="Sketch Lab activities"><button data-topic="equation"${state.topic==='equation'?' aria-current="page"':''}>Restore & share</button><button data-topic="quadratic"${state.topic==='quadratic'?' aria-current="page"':''}>One sign, two curves</button><button id="lab-review">Review lab record</button></nav>`;}
  function shell(content){app.innerHTML=`${topicTabs()}${content}<div class="lab-actions"><button class="secondary" id="export">Download lab record</button><p class="help">These new activities have a separate record from the main assessment.</p></div>`;bindCommon();}
  function tiles(){return [0,1,2,3].map(i=>`<rect class="tile" x="${35+i%2*80}" y="${45+Math.floor(i/2)*78}" width="62" height="56" rx="5"/><text class="model-big" x="${66+i%2*80}" y="${81+Math.floor(i/2)*78}" text-anchor="middle">x</text>`).join('');}
  function coins(n,startY=45){return Array.from({length:n},(_,i)=>`<circle class="coin" cx="${385+i%3*48}" cy="${startY+Math.floor(i/3)*40}" r="11"/>`).join('');}
  function equationDrawing(stage){
    const removed=stage===0?`<text class="model-big" x="220" y="120">−</text>${[0,1,2].map(i=>`<circle class="removed" cx="270" cy="${65+i*40}" r="11"/>`).join('')}<text class="model-label" x="225" y="220">3 removed units</text>`:'';
    if(stage<2)return `<svg class="equation-model" viewBox="0 0 590 260" role="img" aria-label="${stage===0?'Four equal box contents, with three units removed, equal nine units.':'The full contents of four equal boxes equal twelve units after both sides increase by three.'}">${tiles()}${removed}<text class="model-big" x="325" y="120">=</text>${coins(stage===0?9:12)}<text class="model-label" x="30" y="242">${stage===0?'4 equal boxes, minus 3 units':'Full combined contents restored'}</text><text class="model-label" x="365" y="242">${stage===0?'9 units remaining':'9 + 3 = 12 units'}</text></svg>`;
    return `<svg class="equation-model" viewBox="0 0 590 300" role="img" aria-label="Twelve units split into four equal groups of three, one group for each box.">${tiles()}<text class="model-big" x="285" y="120">=</text>${[0,1,2,3].map(i=>`<rect x="345" y="${22+i*62}" width="174" height="48" rx="7" fill="none" stroke="#2147df"/>${[0,1,2].map(j=>`<circle class="coin" cx="${383+j*48}" cy="${46+i*62}" r="11"/>`).join('')}`).join('')}<text class="model-label" x="30" y="280">Each box gets one equal group.</text><text class="model-label" x="346" y="280">Four groups of three units</text></svg>`;
  }
  function equationSupport(r){return `<section class="support"><button class="text-button" data-help="restore-model" aria-controls="restore-model" aria-expanded="${r.helpOpen}">${r.helpOpen?'Hide the visual model':'Explore a visual model'}</button><div id="restore-model"${r.helpOpen?'':' hidden'}><nav class="tabs" aria-label="Restore and share stages">${['Start','Restore 3','Share equally'].map((t,i)=>`<button data-stage="${i}"${r.stage===i?' aria-pressed="true"':' aria-pressed="false"'}>${t}</button>`).join('')}</nav>${equationDrawing(r.stage)}<p>${r.stage===0?'x is the number of units in each equal box. The three removed units come from their combined contents.':r.stage===1?'Undo the removal: adding 3 to each side gives 4x = 12. The boxes now represent their full contents.':'Divide each side by 4. Twelve units make four equal groups, so x = 3.'}</p></div></section>`;}
  function renderEquation(){
    const r=record('equation');resume(r);
    shell(`<div class="row between"><span class="tag">Equation activity</span><span class="help">Time <span id="timer"></span></span></div><h1>Restore & share</h1><div class="layout"><section class="card"><p class="math">4x − 3 = 9</p><p>Four boxes contain equal amounts. Taking away 3 units from their combined contents leaves 9 units.</p><p>Choose an operation that cancels the −3. Apply it to both sides, then find x.</p>${equationSupport(r)}</section><section class="card"><div class="form-parts">${select('operation','Operation on both sides',[['add','Add'],['subtract','Subtract'],['multiply','Multiply'],['divide','Divide']])}${field('amount','Number used in that operation')}${field('x','Value of x')}${select('reason','Choose a reason, or write your own below',[['same-both','The same addition or subtraction on both sides preserves equality.'],['one-side','Changing just one side always preserves equality.'],['cancel-only','This cancels the −3 on the left.']])}${whyBox()}</div><div class="validation" id="validation" role="alert"></div><button class="primary" id="save">Check this route</button><div id="feedback" aria-live="polite"></div></section></div>`);
    restore(r);bindWork();showEquationFeedback(r);updateTimer();
  }
  function eqGrade(a){
    const operation=a.operation==='add'&&M.close(a.amount,3)||a.operation==='subtract'&&M.close(a.amount,-3);
    const objective=operation&&M.close(a.x,3),raw=a.why??'',t=raw.toLowerCase();
    const contradiction=a.reason==='one-side'||/only (?:one|1) side/.test(t);
    const matched=a.reason==='same-both'||/(?:same|equal).{0,35}(?:both|each|two|2) sides?|both sides.{0,35}(?:same|equal)/.test(t);
    return {correct:objective,parts:{operation,x:M.close(a.x,3)},reason:{status:contradiction?'Needs review':matched?'Provisional central reason matched':raw||a.reason?'Needs review':'Missing explanation',points:matched&&!contradiction?2:null,max:2,raw,anchor:'Adding the same amount to both sides preserves equality; adding 3 cancels the −3.'}};
  }
  function showEquationFeedback(r){if(!r.result)return;document.querySelector('#feedback').innerHTML=`<div class="feedback"><p>${r.result.correct?'The operation and value of x match.':'Recheck the operation or the final value. The clock continues after an incorrect try.'}</p><p class="help">Explanation: ${esc(r.result.reason.status)}.</p>${r.result.correct?'<button class="secondary" id="open-quadratic">Explore the quadratic activity</button>':''}</div>`;const go=document.querySelector('#open-quadratic');if(go)go.onclick=()=>switchTopic('quadratic');}
  function gate(){shell(`<span class="tag">Quadratic graphs</span><h1>One sign, two curves</h1><section class="card"><p>This activity uses expanding a square, plotting a quadratic function, and reading a turning point.</p><p>Have you already studied quadratic graphs?</p><div class="row"><button class="primary" id="ready">Yes, open the activity</button><button class="secondary" id="not-ready">Return to the equation activity</button></div><p class="help preview-note">This choice selects the activity; it is not evidence of mastery.</p></section>`);document.querySelector('#ready').onclick=()=>{state.ready=true;render();};document.querySelector('#not-ready').onclick=()=>switchTopic('equation');}
  function functionTabs(){return `<nav class="tabs" aria-label="Two function stages"><button data-function="positive"${state.functionId==='positive'?' aria-current="step"':''}>1 · Positive square</button><button data-function="negative"${!state.negativeUnlocked?' disabled':''}${state.functionId==='negative'?' aria-current="step"':''}>2 · Negative square</button></nav>`;}
  function comparison(){return `<section class="card"><h2>Compare the sign outside the square</h2><div class="comparison"><div><span class="positive-key">Positive square</span><p class="math">y = (x − 2)² + 5</p></div><div class="negative"><span class="negative-key">Negative square</span><p class="math">y = −(x − 2)² + 5</p></div></div><p class="help preview-note">Keep the +5. The minus sign applies to the entire square.</p></section>`;}
  function plotData(id){const a=record(id).draft;return [1,2,3].map(i=>({x:a['x'+i],entered:a['y'+i]})).filter(p=>Number.isFinite(p.x)&&Math.abs(p.x)<=50);}
  function graph(id,compare=false){
    const points=plotData(id),xs=points.map(p=>p.x),xMin=Math.floor(Math.min(0,...xs))-1,xMax=Math.ceil(Math.max(4,...xs))+1;
    const ids=compare?['positive','negative']:[id],sample=ids.flatMap(k=>[M.value(k,xMin),M.value(k,xMax),5]),yMin=Math.floor(Math.min(0,...sample))-1,yMax=Math.ceil(Math.max(6,...sample))+1;
    const L=55,R=590,T=22,B=322,x=v=>L+(v-xMin)/(xMax-xMin)*(R-L),y=v=>B-(v-yMin)/(yMax-yMin)*(B-T);
    const ticks=(lo,hi)=>{
      const raw=(hi-lo)/6,power=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].map(n=>n*power).find(n=>n>=raw);
      const start=Math.ceil(lo/step)*step;return Array.from({length:Math.max(1,Math.floor((hi-start)/step)+1)},(_,i)=>start+i*step);
    };
    const fmt=n=>Math.abs(n)<1e-8?'0':Number(n.toFixed(2)).toString();
    const grid=ticks(xMin,xMax).map(v=>`<line x1="${x(v)}" y1="${T}" x2="${x(v)}" y2="${B}"/><text class="graph-label" x="${x(v)}" y="${B+22}" text-anchor="middle">${fmt(v)}</text>`).join('')+ticks(yMin,yMax).map(v=>`<line x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}"/><text class="graph-label" x="${L-9}" y="${y(v)+4}" text-anchor="end">${fmt(v)}</text>`).join('');
    const paths=ids.map(k=>`<path class="${k}-curve" d="${Array.from({length:201},(_,i)=>{const v=xMin+(xMax-xMin)*i/200;return `${i?'L':'M'}${x(v).toFixed(2)},${y(M.value(k,v)).toFixed(2)}`}).join(' ')}"/>`).join('');
    return `<svg viewBox="0 0 640 375" role="img" aria-label="Computed graph of ${ids.map(k=>M.functions[k].formula).join(' and ')}. The axes have labelled scales. Your chosen x-values appear on the given function."><g class="graph-grid">${grid}</g><path class="graph-axis" d="M${L},${y(0)}H${R}M${x(0)},${B}V${T}"/>${paths}${points.map(p=>`<circle class="graph-point ${id==='negative'?'negative-point':''}" cx="${x(p.x)}" cy="${y(M.value(id,p.x))}" r="5"><title>(${fmt(p.x)}, ${fmt(M.value(id,p.x))})</title></circle>`).join('')}<text class="graph-label" x="${R+15}" y="${y(0)+4}">x</text><text class="graph-label" x="${x(0)+9}" y="${T+8}">y</text></svg>`;
  }
  function graphSupport(id,r){return `<section class="support"><button class="text-button" data-help="quadratic-graph" aria-controls="quadratic-graph" aria-expanded="${r.helpOpen}">${r.helpOpen?'Hide the graph':'Explore a graph of the given function'}</button><div id="quadratic-graph"${r.helpOpen?'':' hidden'}>${graph(id,state.comparison)}<p class="help">Axes use the labelled scales, which may differ between x and y.</p>${plotData(id).length?`<table class="point-table"><thead><tr><th>Chosen x</th><th>Calculated y</th></tr></thead><tbody>${plotData(id).map(p=>`<tr><td>${esc(p.x)}</td><td>${esc(M.value(id,p.x))}</td></tr>`).join('')}</tbody></table>`:'<p class="help">Enter your chosen x-values to add points to the graph.</p>'}<div class="legend">${id==='positive'||state.comparison?'<span class="positive-key">Blue solid line: positive square</span>':''}${id==='negative'||state.comparison?'<span class="negative-key">Red dashed line: negative square</span>':''}</div><p class="help preview-note">The graph is calculated from the given function, not from your expanded coefficients. Your chosen x-values are plotted with their calculated y-values. Viewing it is recorded as optional support.</p><button class="secondary" id="refresh-graph">Update graph with my x-values</button><details><summary>Another route: complete the square</summary><p class="math">ax² + bx + c = a(x + b/(2a))² + c − b²/(4a)</p><p>For a ≠ 0, the turning point is at x = −b/(2a), with y = c − b²/(4a). The sign of a determines the opening.</p><p>Finding a turning point is different from solving y = 0. The quadratic formula finds zeros.</p></details></div></section>`;}
  function renderQuadratic(){
    const id=state.functionId,f=M.functions[id],r=record(id);resume(r);
    shell(`<div class="row between"><span class="tag">Quadratic activity · ${id==='positive'?'part 1':'part 2'}</span><span class="help">Time <span id="timer"></span></span></div><h1>One sign, two curves</h1>${functionTabs()}${state.comparison?comparison():''}<section class="card"><p class="math">y = ${f.formula}</p><p>Rewrite the function, choose three points, then locate its turning point. Use your own approach or open the optional graph.</p><p class="help">Each chosen point must have a different x-value. A smallest sampled y-value is not necessarily the minimum of the entire function.</p></section><div class="layout"><div class="form-parts"><section class="card" id="part-expansion"><h2>1 · Rewrite & predict</h2><p>Write y = ax² + bx + c.</p><div class="coefficients">${field('a','a · x² coefficient')}${field('b','b · x coefficient')}${field('c','c · constant')}</div>${select('opening','Which way will it open?',[['up','Upward'],['down','Downward']])}</section><section class="card" id="part-points"><h2>2 · Pick three points</h2><div class="point-grid"><span></span><strong>x</strong><strong>y</strong>${[1,2,3].map(i=>`<span>Point ${i}</span>${field('x'+i,`Point ${i}: x`)}${field('y'+i,`Point ${i}: y`)}`).join('')}</div><p class="help">Choose x-values between −50 and 50 for this preview. The function is defined for all real x.</p></section></div><div class="form-parts"><section class="card" id="part-vertex"><h2>3 · Find the turning point</h2><div class="coefficients">${field('vx','Turning-point x')}${field('vy','Turning-point y')}</div>${select('kind','What does that point give?',[['minimum','A minimum'],['maximum','A maximum']])}<div style="margin-top:16px">${select('reason','Choose a reason, or write your own below',[['bound-and-zero',id==='positive'?'The square is at least 0 and reaches 0 at x = 2; adding 5 gives the minimum.':'The negative of the square is at most 0 and reaches 0 at x = 2; adding 5 gives the maximum.'],['three-samples','My three samples alone prove that no other real x can do better.'],['x-square-sign','x² is sometimes negative, which determines the opening.']])}</div><div style="margin-top:16px">${whyBox()}</div></section>${graphSupport(id,r)}</div></div><div class="validation" id="validation" role="alert"></div><div class="lab-actions"><button class="primary" id="save">Check & choose the next step</button></div><div id="feedback" aria-live="polite"></div>`);
    restore(r);bindWork();showQuadraticFeedback(r);if(state.highlight){const target=document.querySelector('#part-'+state.highlight);if(target)target.classList.add('target');}updateTimer();
  }
  function showQuadraticFeedback(r){
    if(!r.result)return;
    const names={expansion:'Expansion',points:'Chosen-point calculations',opening:'Opening direction',vertex:'Turning point',extremum:'Minimum / maximum'};
    const route=r.route;
    document.querySelector('#feedback').innerHTML=`<section class="feedback"><h2>Your next step</h2><ul class="check-list">${Object.entries(r.result.parts).map(([k,ok])=>`<li>${names[k]}: ${ok?'matched':'recheck'}</li>`).join('')}</ul><p>${esc(route.message)}</p><p class="help">Explanation: ${esc(r.result.reason.status)}. This branch uses the answer components; unfamiliar wording does not create a weakness label.</p><button class="secondary" id="follow-route">${route.target==='negative'?'Try the sign change':route.target==='comparison'?'Compare the two signs':route.target==='review'?'Review both functions':'Recheck this part'}</button></section>`;
    document.querySelector('#follow-route').onclick=()=>{
      remember(r);pause(r);state.events.push({type:'route_followed',at:Date.now(),source_event_id:r.attempts.at(-1)?.event_id,route:structuredClone(route)});
      if(route.target==='negative'||route.target==='comparison'){state.negativeUnlocked=true;state.functionId='negative';state.comparison=route.target==='comparison';state.highlight=null;}
      else if(route.target==='review'){state.view='review';renderReview();return;}
      else state.highlight=route.target;
      render();if(state.highlight)document.querySelector('#part-'+state.highlight)?.scrollIntoView({behavior:'smooth',block:'start'});
    };
  }
  function restore(r){
    const d=r.draft;document.querySelectorAll('[data-number]').forEach(el=>el.value=r.rawDraft?.[el.dataset.number]??(Number.isFinite(d[el.dataset.number])?String(d[el.dataset.number]):''));
    document.querySelectorAll('[data-select]').forEach(el=>el.value=d[el.dataset.select]??'');const why=document.querySelector('#why');if(why)why.value=d.why??'';
  }
  function markEdit(){const r=record();if(r.result||r.complete){r.complete=false;r.result=null;r.route=null;resume(r);const fb=document.querySelector('#feedback');if(fb)fb.innerHTML='<p class="help">Answer edited. Check again to save the revision; earlier submissions remain in the record.</p>';}}
  function openHelp(key){
    const r=record();remember(r);if(!r.help[key]){r.help[key]={at:Date.now(),draft_before:structuredClone(r.draft),attempts_before:r.attempts.length};state.events.push({type:'support_opened',item_id:r.id,key,at:Date.now(),draft_before:structuredClone(r.draft)});}
    r.helpOpen=!r.helpOpen;render();
  }
  function save(){
    const r=record(),a=collect();let result,route;
    if(state.topic==='equation'){
      if(!a.operation||![a.amount,a.x].every(Number.isFinite)){document.querySelector('#validation').textContent='Choose an operation and enter both numbers.';return;}
      result=eqGrade(a);route=null;
    }else{const p=M.plan(state.functionId,a);if(p.error){document.querySelector('#validation').textContent=p.error;return;}result=p.result;route=p.route;}
    remember(r);r.draft=structuredClone(a);r.result=result;r.route=route;r.complete=result.correct;if(r.complete)pause(r);
    const event={event_id:crypto.randomUUID(),type:'submission',version:'sketch-lab-0.1',item_id:r.id,at:Date.now(),answer:structuredClone(a),result:structuredClone(result),route:structuredClone(route),support:structuredClone(r.help),active_ms:elapsed(r),parent_event_id:r.id==='negative'?state.records.positive?.attempts.at(-1)?.event_id??null:null};
    r.attempts.push(event);state.events.push(structuredClone(event));document.querySelector('#validation').textContent='';
    if(state.topic==='equation')showEquationFeedback(r);else showQuadraticFeedback(r);updateTimer();
  }
  function bindWork(){
    document.querySelectorAll('[data-number],textarea,[data-select]').forEach(el=>el.addEventListener('input',()=>{markEdit();remember();}));
    document.querySelectorAll('[data-select]').forEach(el=>el.addEventListener('change',()=>{markEdit();remember();}));
    document.querySelectorAll('[data-sign]').forEach(el=>el.onclick=()=>{const input=document.querySelector('#n-'+el.dataset.sign);const raw=input.value.trim().replace(/−/g,'-');input.value=raw.startsWith('-')?raw.slice(1):'-'+raw.replace(/^\+/,'');markEdit();remember();});
    document.querySelectorAll('[data-help]').forEach(el=>el.onclick=()=>openHelp(el.dataset.help));
    document.querySelectorAll('[data-stage]').forEach(el=>el.onclick=()=>{const r=record();remember(r);r.stage=Number(el.dataset.stage);state.events.push({type:'visual_stage',item_id:r.id,stage:r.stage,at:Date.now()});render();});
    document.querySelectorAll('[data-function]').forEach(el=>el.onclick=()=>{if(el.dataset.function==='negative'&&!state.negativeUnlocked)return;retain();state.functionId=el.dataset.function;state.highlight=null;render();});
    const refresh=document.querySelector('#refresh-graph');if(refresh)refresh.onclick=()=>{remember();render();};
    document.querySelector('#save').onclick=save;
  }
  function switchTopic(topic){retain();state.topic=topic;state.view='work';state.highlight=null;render();}
  function bindCommon(){
    document.querySelectorAll('[data-topic]').forEach(el=>el.onclick=()=>switchTopic(el.dataset.topic));
    document.querySelector('#lab-review').onclick=()=>{retain();state.view='review';renderReview();};
    document.querySelector('#export').onclick=()=>{
      if(state.view==='work'&&(state.topic==='equation'||state.ready))remember();
      try{const output={version:'sketch-lab-0.1',session_id:state.sessionId,events:state.events,records:state.records,exported_at:new Date().toISOString(),limits:'Experimental activity records; no validated mastery estimate. Main assessment records are separate.'};const blob=new Blob([JSON.stringify(output,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='cluevera-sketch-lab.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{const notice=document.querySelector('#export-notice')??document.createElement('p');notice.id='export-notice';notice.textContent='Download could not start. Keep this tab open and try in a full browser tab.';app.appendChild(notice);}
    };
  }
  function renderReview(){
    const rs=Object.values(state.records),functionRecords=rs.filter(r=>['positive','negative'].includes(r.id));
    const showComparison=functionRecords.length===2&&functionRecords.every(r=>r.attempts.length>0);
    if(showComparison)for(const r of functionRecords)if(!r.help['comparison-review']){
      r.help['comparison-review']={at:Date.now(),draft_before:structuredClone(r.draft),attempts_before:r.attempts.length};
      state.events.push({type:'support_opened',item_id:r.id,key:'comparison-review',at:Date.now(),draft_before:structuredClone(r.draft)});
    }
    shell(`<span class="tag">Lab record</span><h1>What was observed</h1><p class="lab-note">Submitted work, optional support, and revisions are kept separately. Opening a graph does not prove that it was needed. A matched answer in this activity is not a course-mastery estimate.</p><div class="summary-list">${rs.map(r=>`<article><h2>${r.id==='equation'?'Restore & share':r.id==='positive'?'Positive square':'Negative square'}</h2><p>${r.attempts.length} submitted attempt${r.attempts.length===1?'':'s'}. ${r.result?r.result.correct?'Latest answer components matched.':'Latest components need rechecking.':'No current submitted result.'}</p>${r.attempts.map((a,i)=>`<details><summary>Attempt ${i+1} · ${a.support&&Object.keys(a.support).length?'with support available':'before optional support'}</summary><p>Explanation: ${esc(a.result.reason.status)}</p><blockquote>${esc(a.answer.why||'(No written explanation)')}</blockquote><p>Chosen reason: ${esc(a.answer.reason||'none')}</p>${a.route?`<p>Next step: ${esc(a.route.purpose)}. ${esc(a.route.message)}</p>`:''}</details>`).join('')}</article>`).join('')||'<section class="card"><p>No answers submitted yet.</p></section>'}</div>${showComparison?`${comparison()}<section class="card"><h2>Compare the mathematics</h2>${graph('negative',true)}<div class="legend"><span class="positive-key">Blue solid: positive square</span><span class="negative-key">Red dashed: negative square</span></div><p class="math">(x − 2)² + 5 = x² − 4x + 9</p><p class="math">−(x − 2)² + 5 = −x² + 4x + 1</p><p>Both turning points are (2, 5). The first gives a minimum; the second gives a maximum. For the same x, the two y-values add to 10: the curves reflect across y = 5.</p><p>The square is nonnegative and reaches zero at x = 2. Negating that square reverses its bound; the +5 stays unchanged.</p><details><summary>Turning points and roots</summary><p>The quadratic formula solves y = 0. Here the positive-square function has no real zeros; the negative-square function has zeros x = 2 ± √5. These are different from the turning-point x = 2.</p></details></section>`:''}<button class="primary" id="return">Return to my work</button>`);
    document.querySelector('#return').onclick=()=>{state.view='work';render();};
  }
  function updateTimer(){const el=document.querySelector('#timer');if(!el)return;const seconds=Math.floor(elapsed(record())/1000);el.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
  function render(){if(state.view==='review')return renderReview();if(state.topic==='equation')renderEquation();else if(!state.ready)gate();else renderQuadratic();}
  // Test seam.
  render();setInterval(updateTimer,1000);
})();
