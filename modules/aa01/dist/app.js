(() => {
  "use strict";
  const app = document.querySelector("#app");
  const core = ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11"];
  const integrated=window.QuidenceIntegrated;
  const sports = ["S1","S2","S3","S6","S4"];
  const geometryLab = ['V1','D1'];
  const titles = {
    C1:"Numbers below zero", C2:"A move to the left", C3:"Track practice",
    C4:"Puzzle points", C5:"The matching cards", C6:"Test a claimed identity",
    C7:"A range of solutions", C8:"A rule from a table", C9:"A line that falls",
    C10:"Open-gym visits", C11:"Restore & share",QP:"One sign, two curves · positive",QN:"One sign, two curves · negative", FN:"A temperature change", FP:"Two different patterns",
    FE:"Another equation step", FG:"Compare two rates",
    V1:"Four parts of a volume",D1:"Take away an area strip",
    S1:"Sports day · Build two plans",S2:"Sports day · Compare a table",S3:"Sports day · Sketch and connect",S4:"Sports day · Check a budget",S5:"Sports day · Make a decision",S6:"Sports day · Challenge a claim",FM:"A supplied-model check",FB:"A new budget boundary"
  };
  const topics = {
    C1:"Signed numbers",C2:"Signed numbers",FN:"Signed numbers",
    C3:"Rates & proportionality",C4:"Rates & proportionality",FP:"Rates & proportionality",
    C5:"Expressions & equations",C6:"Expressions & equations",C7:"Expressions & equations",FE:"Expressions & equations",
    C8:"Functions & models",C9:"Functions & models",C10:"Functions & models",C11:"Expressions & equations",QP:"Quadratic graphs",QN:"Quadratic graphs",FG:"Functions & models",
    V1:"Geometric products",D1:"Geometric products",
    S1:"Modeling",S2:"Substitution",S3:"Graph connections",S4:"Integer constraints",S5:"Decision making",S6:"Counterexamples",FM:"Supported substitution",FB:"Integer constraints"
  };
  const answers = {
    C1:"−1.5 is midway between −2 and −1. −0.5 is closer to zero.",
    C2:"Start at −3 and move five spaces left to −8.",
    C3:"The pace is 2.5 minutes per lap; 1, 2, and 5 laps take 2.5, 5, and 12.5 minutes.",
    C4:"Table A is proportional: each puzzle earns 3 points. Table B starts with 2 points at 0 puzzles.",
    C5:"3(x + 2) and 3x + 6 are equivalent; 3x + 2 is separate.",
    C6:"At x = 3, x² = 9 and 2x = 6. These differ, so x² = 2x is not an identity for every x.",
    C7:"x ≥ 3: a closed point at 3 and a ray to the right.",
    C8:"y = 2x + 3. The pair (0, 3) gives the starting value b = 3.",
    C9:"m = −1, b = 2. As x increases by 2, y decreases by 2.",
    C10:"C = 12 + 5v. Three visits cost $27; (0, 12) means $12 before any visits.",
    C11:"Add 3 to both sides to get 4x = 12, then divide by 4: x = 3. Subtracting −3 on both sides is also valid.",
    QP:"y = x² − 4x + 9. It opens upward; the minimum is 5 at (2, 5). The square is nonnegative and is zero at x = 2.",
    QN:"y = −x² + 4x + 1. It opens downward; the maximum is 5 at (2, 5). The negative square is nonpositive and is zero at x = 2.",
    V1:"8(x + 3)(2x + 5) = 16x² + 40x + 48x + 120 = 16x² + 88x + 120. At x = 2, V = 360 cubic units. Every part retains height 8.",
    D1:"5(x − 3) = 5x − 15. The removed strip is 3 by 5, so its area is 15. At x = 7, the remaining area is 20 square units. Width and area have different units.",
    FN:"The temperature changes from −2° to −6° after a 4° drop.",
    FP:"The steady running pace starts at zero time for zero laps. The gym cost starts above zero because of its sign-up fee.",
    FE:"4(x + 2) = 20 becomes 4x + 8 = 20, because 4 multiplies both terms.",
    FG:"Line A has slope 3; Plan B has slope 2. Starting values do not determine the rate.",
    S1:"Plan A: C = 24 + 3n. Plan B: C = 6 + 5n. Setup is paid once; each player adds a per-player cost.",
    S2:"At 6 players: A $42, B $36. At 12 players: A $60, B $66.",
    S3:"A: (0,24), (12,60). B: (0,6), (12,66). They meet at (9,51): 9 players, both $51.",
    S4:"A covers at most 22 players ($90; 23 costs $93). B covers at most 16 ($86; 17 costs $91).",
    S5:"At 20 players, A costs $84 and B $106. Only A fits the $90 budget.",
    S6:"Any whole number above 9 gives a counterexample: at 12 players, A costs $60 and B $66. B is not always cheaper.",FM:"At 8 players, P = $42; Q = $38. Q costs less. The rules were supplied.",FB:"C = 6 + 5n covers 18 players under a $100 budget ($96). The next player costs $101."
  };
  const state = {phase:"assessment", queue:[...core,...sports,...geometryLab,'QP'], index:0, records:{}, catalogOpen:true, quadraticReady:false,quadraticUnlocked:false,quadraticComparison:false,quadraticGate:false,quadraticDecisions:[], planned:true, followPlanned:false, adaptiveItems:{},adaptiveDecisions:[],lastMessage:"", sessionId:crypto.randomUUID(), events:[], reviewed:[], reviewMode:false, reviewDrafts:{}, reviewMessages:{}};
  const sessionStore=window.QuidenceAlgebraSession;
  let savingBlocked=false,savedNotice='',saveTimer=null,recovered=false;
  function saveProgress(){
    if(!sessionStore||savingBlocked)return;
    if(state.phase==='assessment'&&!state.quadraticGate){const r=state.records[current()];if(r&&r.complete===null){r.draft=collect();rememberRaw(r);}}
    if(state.phase==='report')preserveReviewDrafts();
    const snapshot=structuredClone(state);
    for(const r of Object.values(snapshot.records))if(r.complete===null){r.elapsedBeforeRevision=activityTime(state.records[r.id]);r.started=clock();r.paused=true;}
    try{const result=sessionStore.save((window.QuidenceStorage||window.localStorage),snapshot);savedNotice=result.ok?'Progress saved in this browser.':result.error;}catch{savedNotice='Browser saving is unavailable. Download your record before refreshing.';}
    const notice=document.querySelector('#progress-status');if(notice)notice.textContent=savedNotice;
  }
  function scheduleSave(){if(saveTimer!==null)clearTimeout(saveTimer);saveTimer=setTimeout(()=>{saveTimer=null;saveProgress();},400);}
  function restoreProgress(){
    if(!sessionStore)return;
    let result;try{result=sessionStore.read((window.QuidenceStorage||window.localStorage));}catch{return;}
    if(!result.ok){savingBlocked=!!result.raw;savedNotice=result.error;return;}
    if(!result.state)return;
    Object.assign(state,result.state);recovered=true;savedNotice='Your previous progress has been restored.';
    for(const r of Object.values(state.records))if(r.complete===null){r.started=clock();r.paused=true;}
    for(const[id,task]of Object.entries(state.adaptiveItems))registerAdaptiveTask(id,task);
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const number = (key,label,unit="",step="any") => `<div><label class="field-label" for="n-${key}">${label}</label><div class="input-row"><span class="numeric"><button type="button" class="sign" data-sign="${key}" aria-label="Change sign for ${esc(label)}" title="Tap to change + or −">+</button><input id="n-${key}" data-n="${key}" inputmode="decimal" type="text" autocomplete="off" placeholder="0, 2.5, 1/2" aria-label="${esc(label)} magnitude"></span><span class="unit">${unit}</span></div></div>`;
  const choices = (key,vals,label) => `<div><span class="field-label">${label}</span><div class="options" role="group" aria-label="${esc(label)}">${vals.map(([v,t])=>`<button type="button" class="option" data-choice="${key}" data-value="${esc(v)}" aria-pressed="false">${esc(t)}</button>`).join("")}</div></div>`;
  const writing = (label,key="why") => `<div class="reason-input"><label class="field-label" for="t-${key}">${label}</label><textarea id="t-${key}" data-text="${key}" maxlength="1200" placeholder="A short reason, equation, or calculation is welcome."></textarea><p class="help">Your idea matters. Spelling and grammar are not scored.</p><details class="reason-help"><summary>How explanations are reviewed</summary><p>A clear central reason can earn full credit. Unrecognized wording is kept for review. A blank explanation is recorded separately as missing.</p></details></div>`;
  const line = (key,values,label) => `<div class="line-wrap"><span class="field-label">${label}</span><div class="number-line" role="group" aria-label="${esc(label)}">${values.map((v,i)=>`<button type="button" data-line="${key}" data-value="${v}" aria-label="Position ${i+1} of ${values.length} between ${values[0]} and ${values.at(-1)}" aria-pressed="false"><i></i><span>${i===0||i===values.length-1?String(v).replace("-","−"):""}</span></button>`).join("")}</div><p class="help">The marks are equally spaced. Click a mark, or use Tab and Enter.</p></div>`;
  const table = (heads,rows) => `<table class="table"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  function coordinateGraph({xMin,xMax,yMin,yMax,points,line,description}) {
    const W=420,H=370,scale=Math.min(286/(xMax-xMin),276/(yMax-yMin));
    const L=64+(286-scale*(xMax-xMin))/2,R=L+scale*(xMax-xMin),T=26,B=T+scale*(yMax-yMin);
    const x=v=>L+(v-xMin)*scale,y=v=>B-(v-yMin)*scale;
    const xs=Array.from({length:xMax-xMin+1},(_,i)=>xMin+i),ys=Array.from({length:yMax-yMin+1},(_,i)=>yMin+i);
    const grid=xs.map(v=>`<line x1="${x(v)}" y1="${T}" x2="${x(v)}" y2="${B}"/>`).join("")+ys.map(v=>`<line x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}"/>`).join("");
    return `<figure class="graph-card"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(description)}"><g class="graph-grid">${grid}</g><path class="graph-axis" d="M${L} ${y(0)}H${R+10}M${x(0)} ${B}V${T-10}"/><g class="graph-ticks">${xs.map(v=>`<text x="${x(v)}" y="${B+24}" text-anchor="middle">${v}</text>`).join("")}${ys.map(v=>`<text x="${L-14}" y="${y(v)+5}" text-anchor="end">${v}</text>`).join("")}</g><line class="graph-line" x1="${x(line[0][0])}" y1="${y(line[0][1])}" x2="${x(line[1][0])}" y2="${y(line[1][1])}"/>${points.map(([a,b],i)=>`<g><title>Point (${a}, ${b})</title><circle class="graph-dot" cx="${x(a)}" cy="${y(b)}" r="6"/><text x="${x(a)+12}" y="${y(b)-12}" class="graph-point-label">(${a}, ${b})</text></g>`).join("")}<text x="${R+13}" y="${y(0)-8}" class="graph-axis-label">x</text><text x="${x(0)+10}" y="${T-10}" class="graph-axis-label">y</text></svg><figcaption>Both axes use equal unit spacing. Each grid line marks 1 unit.</figcaption></figure>`;
  }
  const board=(label,content)=>`<section class="math-board"><div class="board-caption">${label}</div>${content}</section>`;
  const response=content=>`<section class="response-panel">${content}</section>`;
  const workspace=(visual,fields)=>`<div class="workspace-grid">${visual}${response(fields)}</div>`;
  function optionalPanel(id,key,title,content){
    const open=!!state.records[id]?.visualPanels?.[key]?.visible;
    return `<section class="optional-visual"><button class="text-button" type="button" data-optional-visual="${key}" aria-expanded="${open}" aria-controls="visual-${key}">${esc(title)}</button><p class="help">Try your own approach, or explore a visual. Both are welcome.</p><div id="visual-${key}"${open?'':' hidden'}>${content}</div></section>`;
  }
  function supportSnapshot(r){
    const sources=[r,...(['QP','QN'].includes(r.id)?['QP','QN'].filter(id=>id!==r.id).map(id=>state.records[id]).filter(s=>s?.hints.some(h=>h.type==='sign_contrast')):[]),...(r.id.startsWith('S')?sports.filter(id=>id!==r.id).map(id=>state.records[id]).filter(Boolean):[])];
    const used=sources.filter(s=>s.hints.length);
    return {hint_ids:used.flatMap(s=>s.hints.map((h,i)=>h.id??`${s.id}-hint-${i+1}`)),source_ids:used.map(s=>s.id),visual_panels:Object.fromEntries(used.filter(s=>s.visualPanels).map(s=>[s.id,structuredClone(s.visualPanels)]))};
  }
  function openOptionalVisual(key){
    const r=ensure(current()),panel=document.querySelector('#visual-'+key);if(!panel)return;
    r.visualPanels??={};let meta=r.visualPanels[key];
    if(!meta){
      const at=clock();meta=r.visualPanels[key]={at,answerBeforeHelp:structuredClone(collect()),attemptsBeforeHelp:r.attempts.length,visible:false};
      r.hints.push({id:`${r.id}-${key}`,at,type:'optional_visual',text:'Optional visual model opened; the draft and previous submissions were preserved.'});
    }
    meta.visible=!meta.visible;panel.hidden=!meta.visible;
    document.querySelector(`[data-optional-visual="${key}"]`).setAttribute('aria-expanded',String(meta.visible));
    // Looking at support alone does not revoke a previously saved result.
    // If a completed answer is subsequently edited, normal revision handling applies.
    document.querySelectorAll('.question input[data-n],.question textarea,.question button[data-choice],.question button[data-sign]').forEach(el=>el.disabled=false);
    if(key==='cost-blocks')refreshCostBlocks();
  }
  const costPlans={
    C10:{unit:'visits',plans:[['Gym',12,5]]},
    FM:{unit:'players',plans:[['P',10,4],['Q',22,2]]},
    FB:{unit:'players',plans:[['Plan B',6,5]],budget:100}
  };
  function costSpec(id){return state.adaptiveItems[id]?.costModel??(id.startsWith('S')?{unit:'players',plans:[['Plan A',24,3],['Plan B',6,5]],budget:id==='S4'?90:null}:costPlans[id]);}
  const costUnit=spec=>({visits:'visit',sessions:'session',rounds:'round',players:'player'}[spec.unit]??'unit');
  function adaptiveHelper(id,task){
    if(task.costModel)return ''; // Shared costHelper is already included before the task.
    let content='';
    if(task.graph)content=coordinateGraph(task.graph);
    else if(task.areaModel)content=areaDiagram(3,false,task.areaModel)+'<p class="help">This ordinary length model uses x > 0. Labels determine the lengths; the drawing does not specify a numerical x. The algebraic identity also holds for zero and negative x.</p>';
    else if(task.variant_id==='E-stretch')content='<p>The length picture uses x > 4. This example shows x = 6. The identity also holds outside this positive-length model.</p><svg viewBox="0 0 500 250" role="img" aria-label="At x = 6, a rectangle has height 3 and width 6. A width-4 strip is removed; the remaining width is 2."><defs><pattern id="adaptive-remove" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#f9dce1"/><path d="M0 8L8 0" stroke="#ba303b" stroke-width="1"/></pattern></defs><rect x="110" y="70" width="72" height="108" fill="#e1eaff" stroke="#2147df"/><rect x="182" y="70" width="144" height="108" fill="url(#adaptive-remove)" stroke="#ba303b"/><text x="80" y="126" class="model-label">3</text><text x="130" y="52" class="model-label">2</text><text x="245" y="52" class="model-label">4</text><text x="115" y="212" class="model-small">Blue remains; red is removed.</text></svg>';
    else if(task.unitModel){const u=task.unitModel;content=`<p>${u.distance?'Two equal 0.75-mile sections make 1.5 miles. Each section takes the given 6 minutes.':`The given ${u.count} equal laps take ${u.total} minutes in total. The unknown boxes represent equal time for each lap.`}</p><div class="time-cells">${Array.from({length:u.count},(_,i)=>`<div><span>${u.distance?'Section':'Lap'} ${i+1}</span><strong>${u.distance?'6':'?'}</strong><small>min</small></div>`).join('')}</div>`;}
    else content=`<div id="adaptive-numberline">${miniLine(null,0)}</div><p class="help">The dot follows your entered value or chosen number. It does not tell you whether your answer is correct.</p>`;
    return optionalPanel(id,'adaptive-model','Need a visual? Explore another view',content);
  }
  function costBlockDiagram(spec,n){
    const unit=3.5,L=30,rows=spec.plans.map(([name,base,rate],i)=>{
      const y=56+i*110,total=base+rate*n;
      return `<g><text x="${L}" y="${y-13}" class="cost-label">${name}: $${base} once + ${n} × $${rate} = $${total}</text><rect data-cost-base="${base}" x="${L}" y="${y}" width="${base*unit}" height="36" fill="#97b5fa" stroke="#2147df"/><g>${Array.from({length:n},(_,j)=>`<rect data-cost-block="${rate}" x="${L+(base+j*rate)*unit}" y="${y}" width="${rate*unit}" height="36" fill="#e1eaff" stroke="#2147df"/>`).join('')}</g>${spec.budget?`<line x1="${L+spec.budget*unit}" x2="${L+spec.budget*unit}" y1="${y-3}" y2="${y+43}" stroke="#ba303b" stroke-width="2" stroke-dasharray="4 3"/><text x="${L+spec.budget*unit}" y="${y+65}" text-anchor="middle" class="cost-small">$${spec.budget} budget</text>`:''}</g>`;
    }).join('');
    return `<svg class="cost-block-svg" viewBox="0 0 520 ${spec.plans.length*110+35}" role="img" aria-label="At ${n} ${spec.unit}, ${spec.plans.map(([name,base,rate])=>`${name} is ${base} plus ${n} times ${rate}, totaling ${base+rate*n} dollars`).join('; ')}. Bars use the same dollars-to-length scale.">${rows}</svg><p class="help">Darker block: paid once. Each small block: one ${costUnit(spec)}. Every bar uses the same dollars-to-length scale.</p>`;
  }
  function costHelper(id){
    const spec=costSpec(id);if(!spec)return '';
    const n=state.records[id]?.costCount??0;
    return optionalPanel(id,'cost-blocks','Need a visual? Explore the cost blocks',`<p>These blocks use the reference fees in the question, not your entered rules. Your answers will not change when you move the blocks.</p><div class="cost-block-controls"><button type="button" class="secondary" data-cost-step="-1" aria-label="Remove one ${costUnit(spec)}">−</button><label for="cost-count">${esc(spec.unit[0].toUpperCase()+spec.unit.slice(1))}: <output id="cost-count-value">${n}</output></label><button type="button" class="secondary" data-cost-step="1" aria-label="Add one ${costUnit(spec)}">+</button></div><input id="cost-count" data-cost-count type="range" min="0" max="24" step="1" value="${n}" aria-label="Number of ${spec.unit}"><div id="cost-block-diagram">${costBlockDiagram(spec,n)}</div><p class="help">Try more or fewer ${spec.unit}. What changes, and what stays fixed?</p>`);
  }
  function refreshCostBlocks(){
    const r=ensure(current()),spec=costSpec(r.id);if(!spec)return;
    const n=r.costCount??0;if(r.visualPanels?.['cost-blocks'])r.visualPanels['cost-blocks'].countPreview=n;const diagram=document.querySelector('#cost-block-diagram');if(diagram)diagram.innerHTML=costBlockDiagram(spec,n);
    const output=document.querySelector('#cost-count-value');if(output)output.textContent=String(n);
    const slider=document.querySelector('[data-cost-count]');if(slider)slider.value=String(n);
    document.querySelectorAll('[data-cost-step]').forEach(el=>el.disabled=Number(el.dataset.costStep)<0?n===0:n===24);
  }
  const equation=(text,small="")=>`<div class="equation-display">${text}${small?`<small>${small}</small>`:""}</div>`;
  function miniLine(v=-3,start=-3) {
    const x=n=>40+(n+10)/12*440,finite=Number.isFinite(v),view=finite?Math.min(2,Math.max(-10,v)):start;
    return `<svg class="mini-line" viewBox="0 0 520 130" role="img" aria-label="Number line from minus 10 to 2. Start ${start}${finite?`, current position ${v}`:''}."><line x1="40" x2="480" y1="62" y2="62" class="graph-axis"/><g class="graph-ticks">${Array.from({length:13},(_,i)=>i-10).map(n=>`<line x1="${x(n)}" x2="${x(n)}" y1="56" y2="68" stroke="#8b97b8"/><text x="${x(n)}" y="96" text-anchor="middle">${n}</text>`).join('')}</g><circle cx="${x(start)}" cy="62" r="6" fill="white" stroke="#4f5f89" stroke-width="2"/>${finite?`<line x1="${x(start)}" x2="${x(view)}" y1="41" y2="41" stroke="#2147df" stroke-width="3"/><circle cx="${x(view)}" cy="62" r="9" fill="#2147df"/><text x="${x(view)}" y="25" text-anchor="middle" class="graph-point-label">${v}</text>`:''}</svg>`;
  }
  function inequalityView(a={}) {
    const n=Number.isFinite(a.boundary)?a.boundary:null;
    const x=v=>40+(v+2)/10*440,visible=n!==null&&n>=-2&&n<=8;
    return `<svg viewBox="0 0 520 140" role="img" aria-label="Your inequality sketch${n!==null?`: boundary ${n}, ${a.dot??'point type not chosen'}, ${a.ray??'direction not chosen'}`:': choose a boundary, point type, and direction'}."><line class="graph-axis" x1="40" x2="480" y1="65" y2="65"/><g class="graph-ticks">${Array.from({length:11},(_,i)=>i-2).map(v=>`<line x1="${x(v)}" x2="${x(v)}" y1="59" y2="71" stroke="#8b97b8"/><text x="${x(v)}" y="105" text-anchor="middle">${v}</text>`).join('')}</g>${visible&&a.ray?`<line x1="${x(n)}" x2="${a.ray==='right'?480:40}" y1="65" y2="65" stroke="#2147df" stroke-width="5"/><path d="${a.ray==='right'?'M468 57L480 65L468 73':'M52 57L40 65L52 73'}" stroke="#2147df" fill="none" stroke-width="3"/>`:''}${visible&&a.dot?`<circle cx="${x(n)}" cy="65" r="9" stroke="#2147df" stroke-width="3" fill="${a.dot==='closed'?'#2147df':'white'}"/>`:''}</svg>${n!==null&&!visible?'<p class="help">Your boundary is outside the displayed range −2 to 8.</p>':''}`;
  }
  function lapDiagram(count=3,showTimes=false) {
    const n=[1,2,3,5].includes(count)?count:3;
    const colors=['#2147df','#4366c8','#b75508','#526280','#6b4eaa'];
    const spacing=n===5?52:62,top=n===5?45:70;
    const rings=Array.from({length:n},(_,i)=>`<circle data-lap-ring="${i+1}" cx="${145+(i-(n-1)/2)*6}" cy="${160+(i-(n-1)/2)*3}" r="98" fill="none" stroke="${colors[i]}" stroke-width="4"/>`).reverse().join('');
    const labels=Array.from({length:n},(_,i)=>`<g><rect x="292" y="${top+i*spacing-16}" width="13" height="13" rx="3" fill="${colors[i]}"/><text x="318" y="${top+i*spacing}" class="model-label">Lap ${i+1}</text><text x="318" y="${top+i*spacing+24}" class="model-small">${showTimes?'2.5 min':'same time'}</text></g>`).join('');
    return `<svg class="lap-model" viewBox="0 0 500 320" role="img" aria-label="${n} equal laps around the same track. Every outline has the same radius. Small drawing offsets distinguish repetitions, not different track sizes.${showTimes?` Each lap is 2.5 minutes; ${n} laps take ${n*2.5} minutes.`:''}">${rings}<text x="145" y="154" text-anchor="middle" class="model-center">${n}</text><text x="145" y="181" text-anchor="middle" class="model-small">${n===1?'lap':'laps'}</text>${labels}</svg><p class="model-caption">Same track. Same distance each lap. The equal-size outlines are slightly offset so you can count them.</p>`;
  }
  function timeGroups(count=3,showTimes=false){
    return `<div class="time-groups" aria-label="${count} equal time groups"><div class="time-cells">${Array.from({length:count},(_,i)=>`<div><span>Lap ${i+1}</span><strong>${showTimes?'2.5':'?'}</strong><small>min</small></div>`).join('')}</div><div class="time-total">${count===3?'Given total: 7.5 min':showTimes?`Total: ${count*2.5} min`:`Total for ${count} ${count===1?'lap':'laps'}: ? min`}</div></div>`;
  }
  function separateAreaDiagram(x=3,showAreas=false,{height=3,constant=2}={}){
    const v=Number.isInteger(x)&&x>=1&&x<=6?x:3;
    const unit=Math.min(42,Math.floor(348/(6+constant))),gap=42,w=(v+constant)*unit,h=height*unit,L=(500-w-gap)/2,T=84,B=T+h,cut=L+v*unit,right=cut+gap,R=right+constant*unit;
    const brace=(a,b,y)=>`M${a} ${y+7}V${y}H${b}V${y+7}`;
    const areas=showAreas?`<text x="${L+v*unit/2}" y="${T+h/2-5}" text-anchor="middle" class="model-area">${height}x</text><text x="${L+v*unit/2}" y="${T+h/2+25}" text-anchor="middle" class="model-small">= ${height*v}</text><text x="${right+constant*unit/2}" y="${T+h/2-5}" text-anchor="middle" class="model-area area-constant">${height} × ${constant}</text><text x="${right+constant*unit/2}" y="${T+h/2+25}" text-anchor="middle" class="model-small">= ${height*constant}</text>`:`<text x="${L+v*unit/2}" y="${T+h/2+7}" text-anchor="middle" class="model-small">Area?</text><text x="${right+constant*unit/2}" y="${T+h/2+7}" text-anchor="middle" class="model-small">Area?</text>`;
    return `<svg class="area-model" viewBox="0 0 500 320" role="img" aria-label="Rectangle with height ${height} and length x plus ${constant}, shown as two separate pieces. Both pieces have height ${height}; their widths are x and ${constant}. The gap is only for display.${showAreas?` At x=${v}, the first width is ${v}. Areas are ${height}x=${height*v} and ${height} times ${constant}=${height*constant}.`:' This first sketch does not specify x.'}"><text x="250" y="38" text-anchor="middle" class="model-area">${height}(x + ${constant})</text><rect data-area-piece="variable" x="${L}" y="${T}" width="${v*unit}" height="${h}" fill="#e4ebff" stroke="#2147df" stroke-width="2.5"/><rect data-area-piece="constant" x="${right}" y="${T}" width="${constant*unit}" height="${h}" fill="#cfdbff" stroke="#2147df" stroke-width="2.5"/>${areas}<text x="${cut+gap/2}" y="${T+h/2+9}" text-anchor="middle" class="model-area">+</text><path d="${brace(L,cut,B+22)} ${brace(right,R,B+22)} M${L-15} ${T}H${L-23}V${B}H${L-15} M${R+15} ${T}H${R+23}V${B}H${R+15}" class="model-dimension"/><text x="${L+v*unit/2}" y="${B+51}" text-anchor="middle" class="model-label">${showAreas?`x = ${v}`:'x'}</text><text x="${right+constant*unit/2}" y="${B+51}" text-anchor="middle" class="model-label">${constant}</text><text x="${L-42}" y="${T+h/2+7}" text-anchor="middle" class="model-label">${height}</text><text x="${R+42}" y="${T+h/2+7}" text-anchor="middle" class="model-label">${height}</text></svg><p class="model-caption">Add the two areas. Moving the pieces apart does not change their sizes; the gap is only for display.</p>`;
  }
  function areaDiagram(x=3,showAreas=false,model={height:3,constant:2}){
    const {height,constant}=model,v=Number.isInteger(x)&&x>=1&&x<=6?x:3;
    const unit=Math.min(42,Math.floor(348/(6+constant))),w=(v+constant)*unit,h=height*unit,L=(500-w)/2,T=75,B=T+h,cut=L+v*unit,R=L+w;
    const brace=(a,b)=>`M${a} 47V40H${b}V47`;
    const svg=(partitioned)=>`<svg class="area-model" viewBox="0 0 500 270" role="img" aria-label="${partitioned?'The same rectangle partitioned into two joined pieces':'A whole rectangle'} with height ${height} and length x plus ${constant}. ${partitioned?'The widths are x and '+constant+'. No area is added or removed.':'The full length is x plus '+constant+'.'}"><rect data-area-whole="" x="${L}" y="${T}" width="${w}" height="${h}" fill="#e4ebff"/>${partitioned?`<rect data-area-joined="constant" x="${cut}" y="${T}" width="${constant*unit}" height="${h}" fill="#cfdbff"/><line x1="${cut}" x2="${cut}" y1="${T}" y2="${B}" stroke="#2147df" stroke-width="2.5"/>`:''}<rect x="${L}" y="${T}" width="${w}" height="${h}" fill="none" stroke="#2147df" stroke-width="2.5"/><path d="${partitioned?brace(L,cut)+' '+brace(cut,R):brace(L,R)} M${L-15} ${T}H${L-23}V${B}H${L-15}" class="model-dimension"/><text x="${L-42}" y="${T+h/2+7}" text-anchor="middle" class="model-label">${height}</text>${partitioned?`<text x="${L+v*unit/2}" y="28" text-anchor="middle" class="model-label">${showAreas?'x = '+v:'x'}</text><text x="${cut+constant*unit/2}" y="28" text-anchor="middle" class="model-label">${constant}</text>`:`<text x="250" y="28" text-anchor="middle" class="model-label">${showAreas?'x + '+constant+' = '+(v+constant):'x + '+constant}</text><text x="250" y="${T+h/2+9}" text-anchor="middle" class="model-area">${height}(x + ${constant})</text>`}</svg>`;
    const arrow=label=>`<li class="area-transition"><svg viewBox="0 0 24 34" width="24" height="34" aria-hidden="true"><path d="M12 2V29M5 22L12 29L19 22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${label}</span></li>`;
    return `<ol class="area-sequence" aria-label="Area model: whole rectangle, partition, then separate pieces"><li class="area-step" data-area-stage="whole"><h3>1 · Start with the whole</h3>${svg(false)}</li>${arrow('Split the length into x and '+constant)}<li class="area-step" data-area-stage="partition"><h3>2 · Mark the two parts</h3>${svg(true)}</li>${arrow('Move the pieces apart; keep their sizes')}<li class="area-step" data-area-stage="separate"><h3>3 · Add the two areas</h3>${separateAreaDiagram(v,showAreas,model)}</li></ol>`;
  }
  function visualClue(id){return state.records[id]?.visualHelp?.[id==='C3'?'lap-time':'rectangle-split']??null;}
  function visualHelpButton(id,label){
    const seen=visualClue(id),r=state.records[id];
    return `<button class="secondary visual-help-button" type="button" data-visual-help="${id==='C3'?'lap-time':'rectangle-split'}"${seen?' disabled':''}>${seen?'Visual clue opened':r?.complete!==null&&r?.complete!==undefined?'Edit with a visual clue':label}</button><p class="help visual-help-note">${seen?'This clue is recorded as support for your next saved answer.':'Try your own answer first, or open the visual clue. Both are welcome.'}</p>`;
  }
  function openVisualHelp(id){
    if(state.phase!=='assessment'||id!==current()||!['C3','C5'].includes(id))throw Error('This visual clue is unavailable.');
    const r=ensure(id),key=id==='C3'?'lap-time':'rectangle-split';if(r.visualHelp?.[key])return;
    const answerBeforeHelp=collect(),attemptsBeforeHelp=r.attempts.length,wasComplete=r.complete!==null;noteAction();
    r.visualHelp??={};r.visualHelp[key]={at:clock(),answerBeforeHelp:structuredClone(answerBeforeHelp),attemptsBeforeHelp};
    r.hints.push({id:`${id}-${key}`,at:clock(),type:'visual_clue',text:id==='C3'?'Equal-lap time breakdown, including 7.5 ÷ 3 = 2.5.':'Areas of the separate pieces: 3x and 3 × 2, with positive x examples.'});
    refreshConceptModel(id);
    const button=document.querySelector('[data-visual-help]');if(button){button.disabled=true;button.textContent='Visual clue opened';}
    const note=document.querySelector('.visual-help-note');if(note)note.textContent='This clue is recorded as support for your next saved answer.';
    document.querySelectorAll('[data-area-control]').forEach(el=>el.hidden=false);
    if(wasComplete){
      document.querySelectorAll('.question input[data-n],.question textarea,.question button[data-choice],.question button[data-sign]').forEach(el=>el.disabled=false);
      const submitButton=document.querySelector('#submit');submitButton.textContent='Save revised answer';submitButton.onclick=()=>submit();
      document.querySelector('#skip').style.display='';document.querySelector('#feedback').innerHTML='<div class="feedback"><p>Your first saved answer is kept. You can now revise it with the visual clue.</p></div>';
    }
  }
  function refreshConceptModel(id){
    const r=ensure(id),a=collect(),put=(selector,html)=>{const el=document.querySelector(selector);if(el)el.innerHTML=html;};
    if(id==='C3'){
      const n=r.lapView??3,help=!!visualClue(id),key={1:'one',2:'two',5:'five'}[n];
      put('#lap-diagram',lapDiagram(n,help));put('#lap-time-groups',timeGroups(n,help));
      put('#lap-clue',help?'<p class="model-equation">7.5 ÷ 3 = 2.5 minutes per lap</p><p class="help">At a steady pace on the same track, equal laps take equal time. Multiply that one-lap time by the number of laps.</p>':'');
      put('#lap-own-entry',key&&Number.isFinite(a[key])?`Your entered total for ${n} ${n===1?'lap':'laps'}: ${esc(a[key])} min`:'');
      document.querySelectorAll('[data-laps]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.laps)===n)));
    }
    if(id==='C5'){
      const help=!!visualClue(id),x=r.areaX??3;
      put('#rectangle-diagram',areaDiagram(x,help));
      put('#rectangle-equation',help?`<p class="model-equation">3(x + 2) = 3x + 3 × 2</p><p class="model-equation numeric-example">At x = ${x}: 3 × ${x} + 2 × 3 = ${3*x} + 6 = ${3*(x+2)}</p><p class="help">Each part gets multiplied by the full height, 3. A single numerical match is not enough to prove that two expressions match for every x.</p>`:'');
      const output=document.querySelector('#area-x-value');if(output)output.textContent=String(x);
    }
  }
  function solidBoard(){
    const v=window.QuidenceGeometry.normalize(state.records.V1?.solidView);
    return `<div class="solid-stage-nav" role="group" aria-label="Volume-model stages">${['Whole','Partition','Separate & add'].map((label,i)=>`${i?'<span aria-hidden="true">→</span>':''}<button type="button" data-solid-stage="${i}" aria-pressed="${v.stage===i}">${i+1} · ${label}</button>`).join('')}</div><div id="solid-viewport" class="solid-viewport" tabindex="0" role="group" aria-label="Interactive 3D prism. Drag to rotate. Arrow keys rotate; plus and minus zoom; Home resets the view.">${window.QuidenceGeometry.render(v)}</div><div class="solid-controls" role="group" aria-label="Change the 3D view">${[['left','Turn left'],['right','Turn right'],['up','Tilt up'],['down','Tilt down'],['in','Zoom in'],['out','Zoom out'],['reset','Reset view']].map(([key,label])=>`<button class="secondary" type="button" data-solid-action="${key}">${label}</button>`).join('')}</div><p class="help">Drag with a mouse or one finger to rotate. Zoom changes the view, not the lengths. The gaps in stage 3 are only for display.</p><div class="solid-x-control"><label for="solid-x">Explore positive lengths: x = <span id="solid-x-value">${v.x}</span></label><input id="solid-x" data-solid-x type="range" min="1" max="5" step="1" value="${v.x}"></div><p id="solid-lengths" class="help"></p><p id="solid-stage-note" class="model-caption"></p><div class="piece-dimensions">${table(['Part','Height','Width','Depth'],[['A','8','x','2x'],['B','8','x','5'],['C','8','3','2x'],['D','8','3','5']])}</div><p class="help">The ordinary solid model uses x > 0. The algebraic identity also holds for other real x.</p>`;
  }
  function refreshSolid(){
    const r=ensure('V1');r.solidView=window.QuidenceGeometry.normalize(r.solidView);
    const v=r.solidView,el=document.querySelector('#solid-viewport');if(el)el.innerHTML=window.QuidenceGeometry.render(v);
    document.querySelectorAll('[data-solid-stage]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.solidStage)===v.stage)));
    const output=document.querySelector('#solid-x-value');if(output)output.textContent=String(v.x);
    const lengths=document.querySelector('#solid-lengths');if(lengths)lengths.textContent=`Full lengths at x = ${v.x}: height 8 · width x + 3 = ${v.x+3} · depth 2x + 5 = ${2*v.x+5}.`;
    const note=document.querySelector('#solid-stage-note');if(note)note.textContent=['The whole prism has dimensions 8, x + 3, and 2x + 5.','Split both horizontal lengths. The four parts exactly fill the original solid.','Every part still has height 8. Add their four volumes; the spaces between parts are not extra volume.'][v.stage];
  }
  function changeSolid(action){
    const r=ensure('V1'),v=window.QuidenceGeometry.normalize(r.solidView);
    if(action==='left')v.yaw-=.22;if(action==='right')v.yaw+=.22;if(action==='up')v.pitch+=.15;if(action==='down')v.pitch-=.15;
    if(action==='in')v.zoom*=1.15;if(action==='out')v.zoom/=1.15;
    if(action==='reset'){v.yaw=-.65;v.pitch=.42;v.zoom=1;}
    r.solidView=window.QuidenceGeometry.normalize(v);refreshSolid();
  }
  function bindSolidControls(){
    const r=ensure('V1');
    document.querySelectorAll('[data-solid-action]').forEach(el=>el.onclick=()=>changeSolid(el.dataset.solidAction));
    document.querySelectorAll('[data-solid-stage]').forEach(el=>el.onclick=()=>{
      const stage=Number(el.dataset.solidStage);r.solidView={...window.QuidenceGeometry.normalize(r.solidView),stage};
      r.views??=[];r.views.push({view:['whole_solid','partitioned_solid','separated_solids'][stage],at:clock()});refreshSolid();
    });
    const surface=document.querySelector('#solid-viewport');let drag=null;
    surface.onpointerdown=e=>{if(e.button!==undefined&&e.button!==0)return;drag={x:e.clientX,y:e.clientY,id:e.pointerId};surface.setPointerCapture?.(e.pointerId);surface.focus();};
    surface.onpointermove=e=>{if(!drag||e.pointerId!==drag.id)return;const v=window.QuidenceGeometry.normalize(r.solidView);v.yaw+=(e.clientX-drag.x)*.009;v.pitch+=(e.clientY-drag.y)*.009;drag.x=e.clientX;drag.y=e.clientY;r.solidView=v;refreshSolid();};
    const stop=e=>{if(drag&&e.pointerId===drag.id){drag=null;if(surface.hasPointerCapture?.(e.pointerId))surface.releasePointerCapture(e.pointerId);}};
    surface.onpointerup=stop;surface.onpointercancel=stop;surface.onlostpointercapture=()=>{drag=null;};
    surface.onkeydown=e=>{const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out',Home:'reset'}[e.key];if(action){e.preventDefault();changeSolid(action);}};
  }
  function subtractionDiagram(value=7){
    const x=Number.isInteger(value)&&value>=4&&value<=9?value:7;
    const unit=27,h=135,w=x*unit,kept=(x-3)*unit,L=(500-w)/2,T=66,B=T+h;
    const svg=(stage)=>{
      const left=stage===2?(500-w-42)/2:L,right=left+kept+(stage===2?42:0);
      const red=`<rect data-removed-strip="" x="${right}" y="${T}" width="81" height="135" fill="url(#removed-${stage})" stroke="#ba303b" stroke-width="2.5"/>`;
      const body=stage===0?`<rect data-subtraction-whole="" x="${L}" y="${T}" width="${w}" height="135" fill="#e4ebff" stroke="#2147df" stroke-width="2.5"/><text x="250" y="${T+h/2+8}" text-anchor="middle" class="model-area">5x</text>`:`<rect data-kept-area="" x="${left}" y="${T}" width="${kept}" height="135" fill="#e4ebff" stroke="#2147df" stroke-width="2.5"/>${red}<text x="${left+kept/2}" y="${T+h/2+8}" text-anchor="middle" class="model-small">?</text><text x="${right+40.5}" y="${T+h/2+8}" text-anchor="middle" class="subtraction-text">−</text>`;
      return `<svg class="area-model" viewBox="0 0 500 280" role="img" aria-label="${['Whole rectangle of width x and height 5','A width-3 red strip marked for removal','The kept blue rectangle and the removed red strip'][stage]}. At x=${x}, the kept width is ${x-3}. Red means removed; it is excluded from the remaining area."><defs><pattern id="removed-${stage}" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#fff0f1"/><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#efb3b8" stroke-width="1.5"/></pattern></defs>${body}${stage===2?`<text x="${left+kept/2}" y="245" text-anchor="middle" class="model-small">Kept</text><text x="${right+40.5}" y="245" text-anchor="middle" class="subtraction-text">Removed</text>`:''}<path d="M${left-14} ${T}H${left-22}V${B}H${left-14}" class="model-dimension"/><text x="${left-40}" y="${T+h/2+8}" text-anchor="middle" class="model-label">5</text>${stage===0?`<text x="250" y="35" text-anchor="middle" class="model-label">x = ${x}</text>`:`<text x="${left+kept/2}" y="27" text-anchor="middle" class="model-label">x − 3</text><text x="${left+kept/2}" y="50" text-anchor="middle" class="model-small">= ${x-3}</text><text x="${right+40.5}" y="35" text-anchor="middle" class="subtraction-text">3</text><text x="${right+112}" y="${T+h/2+8}" text-anchor="middle" class="subtraction-text">${stage===2?'5':''}</text>`}</svg>`;
    };
    const arrow='<li class="area-transition"><svg viewBox="0 0 24 34" width="24" height="34" aria-hidden="true"><path d="M12 2V29M5 22L12 29L19 22" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></li>';
    return `<ol class="area-sequence subtraction-sequence">${['Start with the whole area','Mark the strip to subtract','Remove the red strip'].map((label,i)=>`${i?arrow:''}<li class="area-step"><h3>${i+1} · ${label}</h3>${svg(i)}</li>`).join('')}</ol><p class="model-caption">Remaining area = whole area − removed area. Blue stays; the red strip is excluded.</p>`;
  }
  function form(id) {
    if(integrated.handles(id))return integrated.form(id,{number,choices,writing,optionalPanel,board,workspace,state});
    const adaptive=state.adaptiveItems[id];
    if(adaptive){
      const fields=adaptive.fields.map(f=>f.type==='choice'?choices(f.key,f.options,f.label):number(f.key,f.label,f.unit??'')).join('');
      return `<p class="lead">${esc(adaptive.prompt)}</p>${adaptive.table?board('Read the relationship',table(adaptive.table.heads,adaptive.table.rows)):''}${adaptiveHelper(id,adaptive)}${response(fields+writing('Explain the central idea. A short reason or calculation is enough.'))}`;
    }
    switch(id) {
      case "C1": return `<p class="lead">Two small decisions about negative numbers.</p>${board('01 / Place a number',`${equation('−1.5')} ${line("point",[-2,-1.75,-1.5,-1.25,-1],"Where does −1.5 belong?")}`)}${response(`<span class="step-label">02 / Compare distances</span>${choices("near",[["-1.5","−1.5"],["-0.5","−0.5"]],"Which is closer to zero?")}`)}`;
      case "C2": return `<p class="lead">Start at −3. Move 5 spaces left. Where do you land?</p>${workspace(board('Move on the number line',`<div id="token-visual">${miniLine(-3)}</div><label for="token">Move the point</label><input id="token" type="range" min="-10" max="2" step="1" value="-3" data-slider="token"><span class="slider-readout" id="token-value">−3</span><p class="help">Drag, or use the arrow keys. The line shows your choice.</p>`),`${number("end","Enter your ending position")}<div class="claim-note">A classmate answered 2. Your move can help you check that claim.</div>`)}`;
      case "C3": return `<p class="lead">A runner completes 3 equal laps on the same track in 7.5 minutes, at a steady pace.</p>${workspace(board('Equal laps · equal time',optionalPanel('C3','lap-model','Need a visual? Explore equal laps',`<div class="given-strip"><span>GIVEN</span><strong>3 laps</strong><span>in</span><strong>7.5 minutes</strong></div><div class="lap-tabs" role="group" aria-label="Show a lap count">${[1,2,3,5].map(n=>`<button type="button" data-laps="${n}" aria-pressed="${(state.records.C3?.lapView??3)===n}">${n} ${n===1?'lap':'laps'}</button>`).join('')}</div><div id="lap-diagram">${lapDiagram(state.records.C3?.lapView??3,!!visualClue('C3'))}</div><div id="lap-time-groups">${timeGroups(state.records.C3?.lapView??3,!!visualClue('C3'))}</div><p class="help student-entry-preview" id="lap-own-entry"></p>${visualHelpButton('C3','Show the equal-time breakdown')}<div id="lap-clue" aria-live="polite"></div>`)),`<p class="response-intro">How long would 1, 2, and 5 laps take at this pace?</p><div class="rate-table"><div class="rate-head"><span>Laps</span><span>Minutes</span></div>${[['1','one'],['2','two'],['5','five']].map(([n,k])=>`<div class="rate-row"><strong>${n}</strong>${number(k,`Time for ${n} ${n==='1'?'lap':'laps'}`,'min')}</div>`).join('')}</div><div class="unit-rate">${number("rate","How many minutes per lap?","min/lap")}</div>`)}`;
      case "C4": return `<p class="lead">Which puzzle challenge gives points in direct proportion to puzzles solved?</p>${workspace(board('Compare the patterns',`<div class="compare-tables"><div><span class="plan-label">Challenge A</span>${table(['Puzzles','Points'],[[1,3],[2,6],[3,9]])}</div><div><span class="plan-label alt">Challenge B</span>${table(['Puzzles','Points'],[[0,2],[1,5],[2,8]])}</div></div>`),`${choices("table",[["A","A"],["B","B"],["both","Both"],["neither","Neither"]],"Choose a challenge")}${writing("What makes one pattern proportional? Explain why the other does or does not fit.")}`)}`;
      case "C5": return `<p class="lead">Compare the expressions for every value of x. Use your own approach, or explore a rectangle.</p>${workspace(board('Whole → split → add',optionalPanel('C5','area-model','Need a visual? Explore the rectangle',`<div id="rectangle-diagram">${areaDiagram(state.records.C5?.areaX??3,!!visualClue('C5'))}</div>${visualHelpButton('C5','Show how the areas add')}<div class="area-controls" data-area-control${visualClue('C5')?'':' hidden'}><label for="area-x">Try a positive value: x = <span id="area-x-value">${state.records.C5?.areaX??3}</span></label><input id="area-x" data-area-x type="range" min="1" max="6" step="1" value="${state.records.C5?.areaX??3}"><p class="help">Only x changes. The width-2 piece keeps its size and area.</p></div><div id="rectangle-equation" aria-live="polite"></div><details class="reason-help"><summary>What about zero or negative x?</summary><p>The rectangle shows positive lengths. The distributive identity also holds for zero and negative x, even though this ordinary area picture does not show negative lengths.</p></details>`)),`<p class="response-intro">Which expressions match 3(x + 2) for every x?</p><div class="expression-sort area-sort">${[['3x + 6','cardA'],['3x + 2','cardB']].map(([text,key])=>`<section class="sort-card"><div class="expression-title">${text}</div>${choices(key,[['same','Matches'],['different','Does not match']],`Does ${text} match?`)}</section>`).join('')}</div>`)}`;
      case "C6": return `<p class="lead">A student claims x² = 2x for every value of x. Test the claim at x = 3.</p>${workspace(board('Check a claim',`${equation('x² = 2x?')}<p>A single unequal pair is enough to disprove a claim about every x.</p>`),`${number("left","x² when x = 3")}${number("right","2x when x = 3")}${choices("step",[["not-always","The claim is not true for every x"],["always","The claim is true for every x"]],"What does your check show?")}${writing("Show your substitution, then say what it tells you about the claim.")}`)}`;
      case "C7": return `<p class="lead">Solve the inequality. Use the controls to sketch your solution set.</p>${workspace(board('Build your number-line sketch',`${equation('3x + 2 ≥ 11')}<div id="inequality-visual">${inequalityView()}</div><p class="help">The sketch follows your entries. It does not check the answer.</p>`),`${number("boundary","Boundary value of x")}${choices("dot",[["closed","Filled · included"],["open","Hollow · excluded"]],"Is the boundary included?")}${choices("ray",[["left","Left"],["right","Right"]],"Which direction contains solutions?")}`)}`;
      case "C8": return `<p class="lead">Find the rule of this line. Switch between its table and graph.</p>${workspace(board('One relationship · two views',`<div class="view-tabs" role="group" aria-label="Representation"><button data-view="table" aria-pressed="true">Table</button><button data-view="graph" aria-pressed="false">Graph</button></div><div data-view-panel="table">${table(['x','y'],[[0,3],[1,5],[2,7]])}<p class="help">These are three points on the same line.</p></div><div data-view-panel="graph" hidden>${coordinateGraph({xMin:0,xMax:3,yMin:0,yMax:8,points:[[0,3],[1,5],[2,7]],line:[[0,3],[2.5,8]],description:'Line through (0, 3), (1, 5), and (2, 7), with equal unit spacing.'})}</div>`),`${equation('y = mx + b')}${number("m","m · change in y per +1 in x")}${number("b","b · y when x = 0")}${choices("pair",[["0,3","(0, 3)"],["1,5","(1, 5)"],["2,7","(2, 7)"]],"Which point directly shows b?")}`)}`;
      case "C9": return `<p class="lead">Read the line through the two marked points.</p>${workspace(board('Read the graph',coordinateGraph({xMin:-1,xMax:3,yMin:-1,yMax:3,points:[[0,2],[2,0]],line:[[-1,3],[3,-1]],description:'Descending line through (0, 2) and (2, 0). Both axes use equal unit spacing.'})),`${number("m","Slope m")}${number("b","Starting value b")}${writing("When you move right, what happens to y? How does that explain the slope’s sign?")}`)}`;
      case "C10": return `<p class="lead">A recreation center charges a sign-up fee and an amount for each open-gym visit.</p>${workspace(board('Open-gym costs',`<div class="fee-card"><span>PAID ONCE</span><strong>$12</strong><small>Sign-up fee</small></div><div class="fee-card alt"><span>EACH VISIT</span><strong>$5</strong><small>Per visit</small></div><p class="help">v = visits · C = total cost in dollars</p>`),`${choices("model",[["12+5v","C = 12 + 5v"],["5+12v","C = 5 + 12v"],["17v","C = 17v"]],"Which rule matches the fees?")}${number("cost","Total for 3 visits","$")}${writing("At 0 visits, why is the cost $12 rather than $0?")}`)}`;
      case "S1": return `<p class="lead">Write a cost rule for each plan. n is the number of players.</p><div class="plan-fields"><fieldset><legend><span class="plan-label">Plan A</span></legend>${number("setupA","Amount paid once","$")}${number("rateA","Amount for each player","$/player")}<div class="rule-preview" id="rule-A">C = ? + ? × n</div></fieldset><fieldset><legend><span class="plan-label alt">Plan B</span></legend>${number("setupB","Amount paid once","$")}${number("rateB","Amount for each player","$/player")}<div class="rule-preview" id="rule-B">C = ? + ? × n</div></fieldset></div>${writing("Why do we add one amount, but multiply the other by the number of players?")}`;
      case "S2": return `<p class="lead">Use your rules to complete the two rows. Notice what happens when the group gets larger.</p>${studentModelNotice()}<div class="cost-table"><div class="cost-row cost-head"><span>Players</span><span>Plan A · $</span><span>Plan B · $</span></div>${[6,12].map(n=>`<div class="cost-row"><strong>${n}</strong>${number('a'+n,`A at ${n} players`)}${number('b'+n,`B at ${n} players`)}</div>`).join('')}</div>`;
      case "S3": return `<p class="lead">Plot both plans. Find the player count where their total costs are equal.</p>${studentModelNotice()}${workspace(board('Your cost graph',`<div id="sports-graph">${sportsGraph({})}</div><p class="help">Earlier entries are carried forward if available. You can edit them. Lines are drawn from your entries, not from an answer key.</p>`),`<details class="point-editor" open><summary>Points used to draw each line</summary><div class="plan-fields"><fieldset><legend>Plan A</legend>${number("a0","At 0 players","$")}${number("a12","At 12 players","$")}</fieldset><fieldset><legend>Plan B</legend>${number("b0","At 0 players","$")}${number("b12","At 12 players","$")}</fieldset></div></details>${number("meetN","Player count where costs match","players")}${number("meetC","Each plan’s cost there","$")}${writing("What does that meeting point tell the school?")}`)}`;
      case "S6": return `<p class="lead">Can a lower setup fee guarantee the lower total?</p>${workspace(board('Test the claim',`<blockquote>“Plan B is always cheaper because its setup fee is smaller.”</blockquote><p>Find one whole-number group size where <strong>Plan A costs less</strong>.</p><p class="help">Use the plan fees above. You can use a group size from your table, or choose another.</p>${state.records.S3?.answer?`<details><summary>Your saved graph</summary>${sportsGraph(state.records.S3.answer)}</details>`:''}`),`${number("counterN","Choose a player count","players")}<div class="plan-fields">${number("counterA","Plan A total","$")}${number("counterB","Plan B total","$")}</div>${writing("How does your example show that B is not always cheaper?")}`)}`;
      case "S4": return `<p class="lead">The school has $90. Find the greatest whole number of players each plan can cover.</p>${studentModelNotice()}<div class="budget-header"><span>AVAILABLE BUDGET</span><strong>$90</strong><small>Whole players · no extra fees</small></div><div class="plan-fields">${['A','B'].map(plan=>`<fieldset><legend><span class="plan-label ${plan==='B'?'alt':''}">Plan ${plan}</span></legend>${number('max'+plan,'Largest group that fits','players')}${number('cost'+plan,'Cost of that group','$')}${number('next'+plan,'Total cost for this group plus 1 player','$')}</fieldset>`).join('')}</div>${writing("Explain the limit. You may leave this blank if your cost checks already show that the chosen group fits and one more exceeds $90.")}`;
      case "V1": return `<p class="lead">Expand 8(x + 3)(2x + 5). You can use algebra, or explore a rectangular prism with height 8.</p>${workspace(board('Volume · whole → partition → add',optionalPanel('V1','volume-model','Need a visual? Explore the 3D prism',solidBoard())),`<p class="response-intro">Rewrite the expression as ax² + bx + c.</p>${number('quad','a · coefficient of x²')}${number('linear','b · coefficient of x')}${number('constant','c · constant term')}${number('volume2','Volume at x = 2','cubic units')}<p class="help">This answer uses x = 2, even if you change the preview.</p>${writing('Can you briefly show your work here?')}`)}`;
      case "D1": return `<p class="lead">A height-5 rectangle has width x. Remove a width-3 strip. A student says the remaining area is 5x − 3. Check the student's expression.</p>${workspace(board('Check the removed area',optionalPanel('D1','subtraction-model','Need a visual? Explore removing an area',`<div class="operation-key"><span class="positive-key">Blue: kept</span><span class="negative-key">Red: removed</span></div><label for="minus-x">Preview width: x = <span id="minus-x-value">${state.records.D1?.minusX??7}</span></label><input id="minus-x" data-minus-x type="range" min="4" max="9" step="1" value="${state.records.D1?.minusX??7}"><div id="minus-diagram">${subtractionDiagram(state.records.D1?.minusX??7)}</div><p class="help">This length picture uses x &gt; 3. The algebraic identity holds for all real x.</p>`)),`${choices('rewrite',[['5x-15','5x − 15'],['5x-3','5x − 3'],['5x+15','5x + 15']],'Choose a correct expression for the remaining area')}${number('areaAt7','Remaining area at x = 7','square units')}<p class="help">Use x = 7 for your saved answer, whatever the preview shows.</p>${writing('Check the student’s expression. Show the calculation or describe what the 3 measures.')}`)}`;
      case "FN": return `<p class="lead">It is −2°C at sunrise. Then it gets 4°C colder.</p>${workspace(board('Follow the temperature change',`${equation('Start: −2°C','Change: 4°C colder')}${optionalPanel('FN','temperature-model','Need a visual? Explore a number line',`<div id="temperature-visual">${miniLine(null,-2)}</div>`)}`),`${number("temp","New temperature","°C")}${writing("Does getting colder move the temperature toward larger or smaller numbers? Explain your calculation.")}`)}`;
      case "FP": return `<p class="lead">Which graph starts at (0, 0)? Compare what each situation gives at zero.</p>${workspace(board('Two starting points',`<div class="comparison-card"><span class="plan-label">Running time</span><strong>2 minutes per lap</strong><p>No laps completed yet.</p></div><div class="comparison-card"><span class="plan-label alt">Gym cost</span><strong>$4 sign-up + $2 per visit</strong><p>Signed up, but no visits yet.</p></div>`),`${choices("origin",[["run","Running time"],["gym","Gym cost"],["both","Both"],["neither","Neither"]],"Which relationship passes through (0, 0)?")}${writing("At zero laps and zero visits, what are the starting time and cost? Use those to explain your choice.")}`)}`;
      case "FE": return `<p class="lead">Each of four groups has x red tokens and 2 blue tokens. A student counted only 4x + 2.</p>${workspace(board('Count all four groups',`<div class="bag-groups">${[1,2,3,4].map(i=>`<div><span>GROUP ${i}</span><strong>x red + 2 blue</strong></div>`).join('')}</div>${equation('4(x + 2) = 20')}${optionalPanel('FE','area-model','Need a visual? Explore the area',areaDiagram(3,false,{height:4,constant:2}))}`),`${choices("step",[["4x+8=20","4x + 8 = 20"],["4x+2=20","4x + 2 = 20"],["4x+8=80","4x + 8 = 80"]],"Choose the corrected step")}${writing("How many blue tokens are there altogether? Why?")}`)}`;
      case "FG": return `<p class="lead">Which line has the larger increase in y for each +1 in x?</p>${workspace(board('Compare rates across views',`<div class="comparison-card"><span class="plan-label">Line A · two points</span>${equation('(0, 1) · (2, 7)')}</div><div class="comparison-card"><span class="plan-label alt">Line B · rule</span>${equation('y = 2x + 5')}</div>`),`${choices("faster",[["A","Line A"],["B","Line B"],["same","Same rate"]],"Larger rate of change")}${writing("How did you find each rate? Which numbers did you compare?")}`)}`;
      case "FM": return `<p class="lead">The rules are supplied this time. Find both totals for 8 players.</p>${workspace(board('Use these rules',`${equation('P = 10 + 4n')}${equation('Q = 22 + 2n')}`),`${number("p8","P at 8 players","$")}${number("q8","Q at 8 players","$")}${choices("lower",[["P","P"],["Q","Q"],["same","Same cost"]],"Which total is lower?")}`)}`;
      case "FB": return `<p class="lead">A new budget: $100. Use the supplied rule to find the largest whole-number group.</p>${workspace(board('A second budget check',`${equation('C = 6 + 5n')}<div class="budget-header"><span>BUDGET</span><strong>$100</strong></div>`),`${number("max","Maximum players","players")}${number("chosenCost","Cost for that group","$")}${number("nextCost","Cost for one more player","$")}${writing("Why does your check establish the limit?")}`)}`;
    }
    return '<p>This activity is unavailable.</p>';
  }
  const required = {
    C11:["operation","amount","x","why"],QP:["a","b","c","opening","x1","y1","x2","y2","x3","y3","vx","vy","kind","why"],QN:["a","b","c","opening","x1","y1","x2","y2","x3","y3","vx","vy","kind","why"],
    C1:["point","near"],C2:["token","end"],C3:["one","two","five","rate"],C4:["table","why"],
    C5:["cardA","cardB"],C6:["left","right","step","why"],C7:["boundary","dot","ray"],C8:["m","b","pair"],
    C9:["m","b","why"],C10:["model","cost","why"],V1:["quad","linear","constant","volume2","why"],D1:["rewrite","areaAt7","why"],FN:["temp","why"],FP:["origin","why"],
    FE:["step","why"],FG:["faster","why"],
    S1:["setupA","rateA","setupB","rateB"],S2:["a6","b6","a12","b12"],S3:["a0","a12","b0","b12","meetN","meetC"],S4:["maxA","maxB","costA","nextA","costB","nextB"],S5:["a20","b20","fits"],S6:["counterN","counterA","counterB"],FM:["p8","q8","lower"],FB:["max","chosenCost","nextCost"]
  };
  const expected = {
    C11:{operation:"add",amount:3,x:3},QP:{a:1,b:-4,c:9,opening:"up",vx:2,vy:5,kind:"minimum"},QN:{a:-1,b:4,c:1,opening:"down",vx:2,vy:5,kind:"maximum"},
    C1:{point:-1.5,near:"-0.5"},C2:{token:-8,end:-8},C3:{one:2.5,two:5,five:12.5,rate:2.5},
    C4:{table:"A"},C5:{cardA:"same",cardB:"different"},C6:{left:9,right:6,step:"not-always"},
    C7:{boundary:3,dot:"closed",ray:"right"},C8:{m:2,b:3,pair:"0,3"},
    C9:{m:-1,b:2},C10:{model:"12+5v",cost:27},V1:{quad:16,linear:88,constant:120,volume2:360},D1:{rewrite:"5x-15",areaAt7:20},
    FN:{temp:-6},FP:{origin:"run"},FE:{step:"4x+8=20"},FG:{faster:"A"},
    S1:{setupA:24,rateA:3,setupB:6,rateB:5},S2:{a6:42,b6:36,a12:60,b12:66},S3:{a0:24,a12:60,b0:6,b12:66,meetN:9,meetC:51},S4:{maxA:22,maxB:16,costA:90,nextA:93,costB:86,nextB:91},S5:{a20:84,b20:106,fits:"A"},S6:{},FM:{p8:42,q8:38,lower:"Q"},FB:{max:18,chosenCost:96,nextCost:101}
  };
  const questionPrompts={
    C1:'Place −1.5 on the number line and compare the distance of −1.5 and −0.5 from zero.',C2:'Start at −3 and move 5 spaces left. Find the ending position.',C3:'At a steady pace, 3 equal laps take 7.5 minutes. Find the times for 1, 2 and 5 laps and the minutes per lap.',C4:'Challenge A gives (puzzles, points): (1,3), (2,6), (3,9). Challenge B gives (0,2), (1,5), (2,8). Which is proportional? Explain.',C5:'Which expressions match 3(x + 2) for every x: 3x + 6 and 3x + 2?',C6:'A student claims x² = 2x for every x. Evaluate both sides at x = 3, then check the claim.',C7:'Solve 3x + 2 ≥ 11. Give the boundary, its inclusion, and the solution direction.',C8:'A line has points (0,3), (1,5), (2,7). Find m and b in y = mx + b and the point that shows b.',C9:'A line passes through (0,2) and (2,0). Find m and b and explain the sign of its slope.',C10:'A gym charges $12 once plus $5 per visit. Choose its cost rule, find the cost for 3 visits and explain the cost at 0 visits.',C11:'Solve 4x − 3 = 9. Choose a cancelling operation applied to both sides and find x.',V1:'Expand 8(x + 3)(2x + 5) as ax² + bx + c, then find its volume at x = 2. Briefly show your work.',D1:'Remove a width-3 strip from a height-5 rectangle of width x. Check the claim that the remaining area is 5x − 3. Choose a correct expression and find the remaining area at x = 7.',QP:'Expand (x − 2)² + 5, calculate three chosen points, and identify its opening, turning point and extremum.',QN:'Expand −(x − 2)² + 5, calculate three chosen points, and identify its opening, turning point and extremum.',FN:'The temperature starts at −2° and drops 4°. Find the new temperature.',FP:'Compare steady running time with gym costs including a $4 starting fee. Which graph passes through the origin?',FE:'Correct the expansion of 4(x + 2) = 20 and explain the constant term.',FG:'Line A passes through (0,1) and (2,7). Plan B follows y = 2x + 5. Compare their rates.',S1:'Sports Day: Plan A charges $24 once + $3 per player; B charges $6 once + $5 per player. Build both rules.',S2:'Using the Sports Day rules A = 24 + 3n and B = 6 + 5n, compare the costs at 6 and 12 players.',S3:'Plot the Sports Day costs at 0 and 12 players and identify where both plans have the same cost.',S6:'Check the claim that Plan B is always cheaper. Choose a whole-number group with A cheaper and calculate both totals.',S4:'With a $90 budget, find the maximum whole players for each Sports Day plan, the total at that limit, and the total after adding one player.',FM:'Given P = 10 + 4n and Q = 22 + 2n, find and compare the totals at n = 8.',FB:'Given C = 6 + 5n and a $100 budget, find the maximum whole players and check the totals at that limit and one player above.'
  };
  function questionContext(id){const task=state.records[id]?.taskSnapshot??state.adaptiveItems[id];return{title:titles[id],prompt:task?.prompt??questionPrompts[id]??titles[id],version:'0.6',fields:required[id]?.filter(k=>k!=='why').map(key=>({key,label:componentLabel(id,key)}))??[]};}
  function parseMagnitude(raw) {
    const s=String(raw).trim();
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:\/(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)) return NaN;
    const p=s.split("/").map(Number);
    return p.length===1?p[0]:(p[1]===0?NaN:p[0]/p[1]);
  }
  function collect() {
    const a={};
    document.querySelectorAll("[data-n]").forEach(el=>{
      const raw=el.value.trim().replace(/−/g,"-"),typed=/^[+-]/.test(raw),v=parseMagnitude(typed?raw.slice(1):raw);
      a[el.dataset.n]=el.value.trim()===""?null:(Number.isFinite(v)?v*(typed?(raw[0]==="-"?-1:1):(document.querySelector(`[data-sign="${el.dataset.n}"]`).textContent==="−"?-1:1)):NaN);
    });
    document.querySelectorAll("[data-choice][aria-pressed=true], [data-line][aria-pressed=true]").forEach(el=>{
      // Number-line positions are numbers; named choices keep their string IDs.
      if(el.dataset.line)a[el.dataset.line]=Number(el.dataset.value);
      else a[el.dataset.choice]=el.dataset.value;
    });
    document.querySelectorAll("[data-text]").forEach(el=>{a[el.dataset.text]=el.value.trim()});
    const slider=document.querySelector("[data-slider]");if(slider)a[slider.dataset.slider]=Number(slider.value);
    return a;
  }
  function check(id,a) {
    if(integrated.handles(id))return integrated.check(id,a);
    const missing=required[id].filter(k=>k!=="why").filter(k=>a[k]===undefined||a[k]===null||a[k]===""||Number.isNaN(a[k]));
    const numericKeys=required[id].filter(k=>typeof expected[id][k]==="number"||id==="S6"&&["counterN","counterA","counterB"].includes(k));
    for(const key of numericKeys)if(typeof a[key]!=="number"||!Number.isFinite(a[key]))if(!missing.includes(key))missing.push(key);
    if(a.why!==undefined&&(typeof a.why!=="string"||a.why.length>1200))missing.push("valid explanation text");
    if(missing.length) return {missing,score:null};
    const parts={};for(const [key,val] of Object.entries(expected[id]))parts[key]=typeof val==="number"?Math.abs(Number(a[key])-val)<1e-8:a[key]===val;
    if(id==="S6") {
      parts.counterN=Number.isInteger(a.counterN)&&a.counterN>9;
      parts.counterA=Number.isFinite(a.counterN)&&Math.abs(a.counterA-(24+3*a.counterN))<1e-8;
      parts.counterB=Number.isFinite(a.counterN)&&Math.abs(a.counterB-(6+5*a.counterN))<1e-8;
      parts.less=Number.isFinite(a.counterA)&&Number.isFinite(a.counterB)&&a.counterA<a.counterB;
    }
    for(const key of state.adaptiveItems[id]?.integerKeys??[])parts[key]=parts[key]&&Number.isInteger(a[key])&&a[key]>=0;
    if(id==="S4")for(const key of ["maxA","maxB"])parts[key]=parts[key]&&Number.isInteger(a[key])&&a[key]>=0;
    return {missing:[],score:{parts,correct:Object.values(parts).every(Boolean)}};
  }
  const clock=()=>Date.now();
  function current() {return state.queue[state.index]}
  function ensure(id) {return state.records[id]??(state.records[id]={id,topic:topics[id],feedback:id==="C1"||id==="C2"||integrated.handles(id)?"immediate":"delayed",started:clock(),firstAction:null,attempts:[],hints:[],complete:null,skip:false,score:null,answer:null,reason:null,review:"Not applicable",...(state.adaptiveItems[id]?{taskSnapshot:structuredClone(state.adaptiveItems[id])}:{})})}
  function noteAction() {const r=ensure(current());if(r.complete!==null){beginRevision(r);const button=document.querySelector('#submit');if(button){button.textContent=r.feedback==='immediate'?'Check answer':'Save answer';button.onclick=()=>submit();}const skip=document.querySelector('#skip');if(skip)skip.style.display='';}if(integrated.handles(r.id)){delete r.quadraticRoute;r.score=null;r.reason=null;const fb=document.querySelector('#feedback');if(fb)fb.innerHTML='';const button=document.querySelector('#submit');if(button){button.textContent='Check answer';button.onclick=()=>submit();}const skip=document.querySelector('#skip');if(skip)skip.style.display='';}if(!r.firstAction)r.firstAction=clock()}
  function elapsed(ms) {if(ms==null)return "—";const s=Math.max(0,Math.round(ms/1000));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}
  const sections=[{name:'Number sense',ids:['C1','C2'],label:'01',note:'Place · move'},{name:'Patterns & rates',ids:['C3','C4'],label:'02',note:'Tables · compare'},{name:'Algebra workshop',ids:['C5','C6','C7','C11'],label:'03',note:'Match · repair · sketch'},{name:'Functions & graphs',ids:['C8','C9','C10'],label:'04',note:'Read · connect'},{name:'Sports Day',ids:sports,label:'05',note:'One project · four views'},{name:'Geometry lab',ids:geometryLab,label:'06',note:'Volume · subtract'},{name:'Quadratic graphs',ids:['QP','QN'],label:'07',note:'Optional · two sign stages'}];
  const missionViews=[{title:'Build',id:'S1'},{title:'Compare',id:'S2'},{title:'Explore',id:'S3'},{title:'Decide',id:'S4'}];
  function sectionFor(id){return sections.find(g=>g.ids.includes(id))??{name:'Your next clue',ids:state.queue.filter(x=>x.startsWith('F')),label:'07',note:'A focused follow-up'};}
  function goto(index){
    if(!Number.isInteger(index)||index<0||index>=state.queue.length)return;
    const target=state.queue[index];if(['QP','QN'].includes(target)&&!state.quadraticReady){openQuadratic();return;}
    if(target==='QN'&&!state.quadraticUnlocked)return;
    if(state.phase==='report')preserveReviewDrafts();
    if(state.phase==='assessment'&&!state.quadraticGate){
      const r=ensure(current());if(r.complete===null){r.draft=collect();rememberRaw(r);pauseActivity(r);}
    }
    state.quadraticGate=false;state.index=index;state.phase='assessment';renderQuestion();
  }
  function pauseActivity(r){if(r.complete===null&&!r.paused){r.elapsedBeforeRevision=(r.elapsedBeforeRevision??0)+clock()-r.started;r.started=clock();r.paused=true;}}
  function activityTime(r){return (r.elapsedBeforeRevision??0)+(r.paused?0:(r.complete??clock())-r.started);}
  function rememberRaw(r){
    r.rawDraft={};document.querySelectorAll('[data-n]').forEach(el=>r.rawDraft[el.dataset.n]={value:el.value,sign:document.querySelector(`[data-sign="${el.dataset.n}"]`).textContent});
    r.rawTextDraft={};document.querySelectorAll('[data-text]').forEach(el=>r.rawTextDraft[el.dataset.text]=el.value);
  }
  function restoreRaw(r){
    document.querySelectorAll('[data-n]').forEach(el=>{const raw=r.rawDraft?.[el.dataset.n];if(raw){el.value=raw.value;document.querySelector(`[data-sign="${el.dataset.n}"]`).textContent=raw.sign;}});
    document.querySelectorAll('[data-text]').forEach(el=>{if(r.rawTextDraft?.[el.dataset.text]!==undefined)el.value=r.rawTextDraft[el.dataset.text];});
  }
  function openQuadratic(){
    if(state.quadraticReady){goto(state.queue.indexOf('QP'));return;}
    if(state.phase==='report')preserveReviewDrafts();
    else {const r=ensure(current());r.draft=collect();rememberRaw(r);pauseActivity(r);}
    state.phase='assessment';state.quadraticGate=true;renderQuadraticGate();
  }
  function renderQuadraticGate(){
    app.innerHTML=`<section class="studio"><div class="studio-head"><div><span class="eyebrow">P4 · QUADRATIC CHECK-IN</span><h1>One sign, two curves</h1></div></div><div class="studio-grid">${sidebar('QP')}<div class="work-area"><article class="card"><h2>Before you begin</h2><p>This activity uses expanding a square, plotting quadratic functions and reading a turning point.</p><p>Have you already studied quadratic graphs?</p><div class="actions"><button class="primary" id="quadratic-ready">Yes, open the activity</button><button class="secondary" id="quadratic-not-yet">Not yet studied · record this</button></div><p class="help">P4 is part of your check-in. If this topic is new to you, record that here; it is kept separate from an incorrect answer.</p></article></div></div></section>`;
    document.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>goto(Number(el.dataset.goto)));
    document.querySelector('[data-open-quadratic]').onclick=openQuadratic;
    document.querySelector('#catalog-toggle').onclick=()=>{state.catalogOpen=!state.catalogOpen;renderQuadraticGate();};
    document.querySelector('#quadratic-ready').onclick=()=>{
      state.quadraticReady=true;if(state.records.QP?.notStudied){const r=state.records.QP;beginRevision(r);delete r.notStudied;r.questionSnapshot=questionContext('QP');r.answer=null;r.draft=null;delete r.rawDraft;delete r.rawTextDraft;}state.quadraticDecisions.push({type:'readiness_choice',ready:true,at_ms:clock(),interpretation:'self_report_only'});
      if(!state.queue.includes('QP'))state.queue.push('QP');goto(state.queue.indexOf('QP'));
    };
    document.querySelector('#quadratic-not-yet').onclick=()=>{state.quadraticDecisions.push({type:'readiness_choice',ready:false,at_ms:clock(),interpretation:'self_report_only'});const r=ensure('QP');r.questionSnapshot={title:'One sign, two curves · readiness',prompt:'This activity uses expanding a square, plotting quadratic functions and reading a turning point. Have you already studied quadratic graphs?',version:'0.6',fields:[]};r.notStudied=true;r.skip=true;r.complete=clock();r.answer={why:'Quadratic graphs have not yet been studied.'};r.score=null;r.reason=null;captureEvent(r,null);state.quadraticGate=false;if(current()==='QP'){state.phase='report';renderReport();}else renderQuestion();saveProgress();};
  }
  function showIntegratedFeedback(r){
    const el=document.querySelector('#feedback');if(!el||!r.score||r.skip)return;
    const route=r.quadraticRoute;
    el.innerHTML=`<div class="feedback${r.score.correct?'':' try'}"><p>${r.score.correct?'The answer components match.':'Some components need another look. The clock continues.'}</p><ul>${Object.entries(r.score.parts).map(([k,ok])=>`<li>${esc(componentLabel(r.id,k))}: ${ok?'matched':'recheck'}</li>`).join('')}</ul><p class="help">Explanation: ${esc(r.reason?.status??'Not entered')}. Suggested credit remains open to review.</p>${route?`<p>${esc(route.message)}</p><button class="secondary" type="button" id="quadratic-next-step">${route.target==='negative'?'Try the sign change':route.target==='comparison'?'Compare the two signs':route.target==='review'?'Review my session':'Recheck this part'}</button>`:''}</div>`;
    if(route)document.querySelector('#quadratic-next-step').onclick=followQuadratic;
  }
  function followQuadratic(){
    const r=ensure(current()),route=r.quadraticRoute;if(!route||!r.score||!['QP','QN'].includes(r.id))return;
    const decision={type:'route_followed',source_item_id:r.id,source_event_id:r.lastEventId,route:structuredClone(route),at_ms:clock()};state.quadraticDecisions.push(decision);
    if(route.target==='negative'||route.target==='comparison'){
      state.quadraticUnlocked=true;
      if(!state.queue.includes('QN'))state.queue.splice(state.queue.indexOf('QP')+1,0,'QN');
      if(!state.records.QN){const next=ensure('QN');next.paused=true;next.quadraticSource={source_event_id:r.lastEventId,source_item_id:r.id,purpose:route.purpose};}
      if(route.target==='comparison'){
        state.quadraticComparison=true;
        for(const id of ['QP','QN']){const rec=ensure(id);if(!rec.hints.some(h=>h.type==='sign_contrast'))rec.hints.push({id:'quadratic-sign-contrast',type:'sign_contrast',at:clock(),text:'Both given formulas displayed together; minus applies to the entire square and +5 stays unchanged.'});}
      }
      goto(state.queue.indexOf('QN'));return;
    }
    if(route.target==='review'){r.draft=collect();rememberRaw(r);pauseActivity(r);state.phase='report';renderReport();return;}
    const target=document.querySelector('#part-'+route.target);if(target){target.classList.add('target');target.scrollIntoView({behavior:'smooth',block:'start'});}
  }
  function bindIntegrated(r){
    document.querySelectorAll('[data-restore-stage]').forEach(el=>el.onclick=()=>{
      const stage=Number(el.dataset.restoreStage);if(![0,1,2].includes(stage))return;r.restoreStage=stage;
      if(r.visualPanels?.['restore-model'])r.visualPanels['restore-model'].stage=stage;
      document.querySelector('#restore-drawing').innerHTML=integrated.equationDrawing(stage);document.querySelector('#restore-caption').textContent=integrated.stageCaption(stage);
      document.querySelectorAll('[data-restore-stage]').forEach(btn=>btn.setAttribute('aria-pressed',String(Number(btn.dataset.restoreStage)===stage)));
    });
    if(r.complete!==null){document.querySelector('#submit').textContent='Next';document.querySelector('#submit').onclick=advance;document.querySelector('#skip').style.display='none';}
    showIntegratedFeedback(r);
  }
  function quadraticPathReview(){
    return `<article class="card report-card"><h2>Quadratic extension</h2><p>${state.quadraticReady?'P4 was selected after a readiness self-report. This does not establish mastery.':(state.records.QP?.notStudied?'You recorded that quadratic graphs have not yet been studied. This is missing topic evidence, not an incorrect answer.':'P4 has not yet been answered; this supplies no evidence about quadratic skills.')}</p>${state.quadraticDecisions.filter(d=>d.type==='route_followed').map(d=>`<p>${esc(d.source_item_id)} → ${esc(d.route.purpose)}: ${esc(d.route.message)}</p>`).join('')}<p>Positive and negative stages belong to one family. Their results, support and source submissions are retained separately.</p></article>`;
  }

  function renderWelcome(){state.phase='assessment';renderQuestion();}
  function sidebar(id){
    const saved=ids=>ids.filter(x=>state.records[x]?.complete!=null).length;
    const entry=(x,label,title,note,ids=[x])=>`<button class="area-nav ${ids.includes(id)?'active':''}" data-catalog-item="${x}" data-goto="${state.queue.indexOf(x)}"${ids.includes(id)?' aria-current="step"':''}><span class="area-number">${label}</span><span><strong>${esc(title)}</strong><small>${esc(note)}</small></span><span class="area-count">${saved(ids)}/${ids.length}<span class="sr-only"> parts saved or skipped</span></span></button>`;
    const extras=state.queue.filter(x=>x.startsWith('F'));
    return `<aside class="activity-sidebar"><div class="catalog-heading"><span class="rail-caption">15 MAIN ACTIVITIES</span><button type="button" class="text-button" id="catalog-toggle" aria-controls="question-list" aria-expanded="${state.catalogOpen}">${state.catalogOpen?'Hide list':'Show list'}</button></div><div id="question-list"${state.catalogOpen?'':' hidden'}><h2 class="catalog-label">11 core questions</h2><nav class="core-catalog" aria-label="All eleven core questions">${core.map((x,i)=>entry(x,`Q${i+1}`,titles[x],topics[x])).join('')}</nav><h2 class="catalog-label">4 larger activities</h2><nav class="project-catalog" aria-label="Projects and geometry activities">${entry('S1','P1','Plan a Sports Day','Four views · five linked parts',sports)}${entry('V1','P2','Four parts of a volume','8(x + 3)(2x + 5) · explore 3D')}${entry('D1','P3','Take away an area strip','5(x − 3) · check an area claim')}<button class="area-nav ${['QP','QN'].includes(id)?'active':''}" data-catalog-item="QP" data-open-quadratic><span class="area-number">P4</span><span><strong>One sign, two curves</strong><small>Quadratic work or not yet studied</small></span><span class="area-count">${state.records.QP?.notStudied?'Recorded':saved(['QP','QN'])+'/2'}</span></button></nav>${extras.length?`<details class="extra-catalog"><summary>Extra checks · ${extras.length} optional</summary><nav aria-label="Selected follow-up questions">${extras.map((x,i)=>entry(x,`+${i+1}`,titles[x],'Selected from earlier work')).join('')}</nav></details>`:''}</div><section class="sidebar-note"><label class="help"><input type="checkbox" id="include-stretch"${state.includeStretch?' checked':''}> Include extra challenges</label><span class="rail-caption">GO AT YOUR PACE</span><p>Try a different view when it helps. A short explanation is enough to share an idea.</p><p id="progress-status" class="help">${esc(savedNotice||'Progress is saved in this browser when saving is available.')}</p></section></aside>`;
  }
  function renderQuestion() {
    if(current()==='QP'&&!state.quadraticReady){if(state.records.QP?.notStudied){state.phase='report';renderReport();return;}state.quadraticGate=true;renderQuadraticGate();saveProgress();return;}
    if(state.quadraticGate){renderQuadraticGate();return;}
    const id=current(),r=ensure(id);if(r.paused){r.started=clock();r.paused=false;}
    const warm=r.feedback==='immediate',group=sectionFor(id),done=state.queue.filter(x=>state.records[x]?.complete!==null&&state.records[x]?.complete!==undefined).length,isSports=id.startsWith('S');
    app.innerHTML=`<section class="studio"><div class="studio-head"><div><span class="eyebrow">${isSports?'PROJECT / SCHOOL SPORTS DAY':esc(group.name)}</span><h1>${isSports?'Plan a Sports Day':esc(titles[id])}</h1></div><div class="session-tools"><span>${done} parts saved or skipped</span><button class="secondary" id="snapshot">Finish & review</button></div></div><p class="help sequence-note">11 core questions + 4 larger activities (P4 records quadratic work or “not yet studied”). Open any entry in the question list. Your work may select up to three optional extra checks in total. You can skip an extra check or review your work at any time.</p><div class="mobile-area-nav"><label for="area-select">Jump to a question or project step</label><select id="area-select">${state.queue.map((x,i)=>`<option value="${i}"${x===id?' selected':''}>${esc(core.includes(x)?`Q${core.indexOf(x)+1} · ${titles[x]}`:x.startsWith('S')?`P1 · ${titles[x]}`:['QP','QN'].includes(x)?`P4 · ${titles[x]}`:x==='D1'?`P3 · ${titles[x]}`:x==='V1'?`P2 · ${titles[x]}`:`Extra check · ${titles[x]}`)}</option>`).join('')}</select></div><div class="studio-grid">${sidebar(id)}<div class="work-area">${isSports?`${sportsContext()}<nav class="mission-tabs" aria-label="Sports Day views">${missionViews.map((v,i)=>`<button data-goto="${state.queue.indexOf(v.id)}" ${v.id===id||v.id==='S3'&&id==='S6'?'aria-current="step"':''}><span>${i+1}</span>${v.title}</button>`).join('')}</nav>${id==='S3'||id==='S6'?`<nav class="explore-tabs" aria-label="Explore steps"><button data-goto="${state.queue.indexOf('S3')}" ${id==='S3'?'aria-current="step"':''}>Connect the graph</button><button data-goto="${state.queue.indexOf('S6')}" ${id==='S6'?'aria-current="step"':''}>Challenge the claim</button></nav>`:''}`:`<nav class="activity-tabs" aria-label="Activities in this area">${group.ids.map(x=>`<button data-goto="${state.queue.indexOf(x)}" ${id===x?'aria-current="step"':''}${x==='QN'&&!state.quadraticUnlocked?' disabled':''}>${esc(titles[x])}</button>`).join('')}</nav>`}<article class="card question"><div class="q-header"><span class="q-id">${core.includes(id)?`Question ${core.indexOf(id)+1} of 11`:isSports?`P1 · ${missionViews.find(v=>v.id===id||v.id==='S3'&&id==='S6')?.title}`:['QP','QN'].includes(id)?'P4 · Quadratic graphs':id==='D1'?'P3 · Subtraction area':id==='V1'?'P2 · 3D volume':'Extra check'}</span><span class="q-mode">${warm?'Check and try again':'Save now · review at the end'}</span><span class="time-label">Time <span id="timer">0:00</span></span></div>${costHelper(id)}${state.adaptiveItems[id]?'<p class="adaptive-note">A new check based on your earlier work. Try your own approach; this is a fresh example.</p>':''}${form(id)}<div id="feedback" aria-live="polite"></div><div id="validation" class="validation" role="alert"></div><div class="actions"><button class="ghost" id="skip">Skip this part</button>${warm&&!integrated.handles(id)?'<button class="secondary" id="hint">Give me a clue</button>':''}<button class="primary push" id="submit">${warm?'Check answer':'Save answer'}</button></div><p class="timing-help help">${warm?'The clock stops when the answer is correct. An incorrect try keeps it running.':'The clock pauses when you save. Correctness appears in your session snapshot.'}</p></article></div></div></section>`;
    document.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>goto(Number(el.dataset.goto)));
    document.querySelector('[data-open-quadratic]').onclick=openQuadratic;
    const stretch=document.querySelector('#include-stretch');if(stretch)stretch.onchange=()=>{state.includeStretch=stretch.checked;saveProgress();};
    document.querySelector('#area-select').onchange=e=>e.target.value==='quadratic'?openQuadratic():goto(Number(e.target.value));
    document.querySelector('#catalog-toggle').onclick=()=>{
      state.catalogOpen=!state.catalogOpen;
      document.querySelector('#question-list').hidden=!state.catalogOpen;
      const toggle=document.querySelector('#catalog-toggle');
      toggle.setAttribute('aria-expanded',String(state.catalogOpen));
      toggle.textContent=state.catalogOpen?'Hide list':'Show list';
    };
    document.querySelectorAll('[data-choice],[data-line]').forEach(el=>el.addEventListener('click',()=>{
      noteAction();document.querySelectorAll(`[data-${el.dataset.choice?'choice':'line'}="${el.dataset.choice||el.dataset.line}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===el)));refreshVisuals(id);
    }));
    document.querySelectorAll('[data-sign]').forEach(el=>el.addEventListener('click',()=>{noteAction();el.textContent=el.textContent==='+'?'−':'+';refreshVisuals(id);}));
    document.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',()=>{
      if(el.dataset.costCount!==undefined){const n=Number(el.value);if(!Number.isInteger(n)||n<0||n>24)return;r.costCount=n;refreshCostBlocks();return;}
      if(el.dataset.solidX!==undefined){const x=Number(el.value);if(!Number.isInteger(x)||x<1||x>5)return;r.solidView={...window.QuidenceGeometry.normalize(r.solidView),x};refreshSolid();return;}
      if(el.dataset.minusX!==undefined){const x=Number(el.value);if(!Number.isInteger(x)||x<4||x>9)return;r.minusX=x;refreshVisuals(id);return;}
      if(el.dataset.areaX!==undefined){const x=Number(el.value);if(!Number.isInteger(x)||x<1||x>6)return;r.areaX=x;refreshConceptModel(id);return;}
      noteAction();
      if(el.dataset.n){const raw=el.value.trim().replace(/−/g,'-');if(/^[+-](?:\d|\.)/.test(raw)){document.querySelector(`[data-sign="${el.dataset.n}"]`).textContent=raw[0]==='-'?'−':'+';el.value=raw.slice(1);}}
      refreshVisuals(id);
    }));
    document.querySelectorAll('[data-laps]').forEach(el=>el.onclick=()=>{const n=Number(el.dataset.laps);if(![1,2,3,5].includes(n))return;r.lapView=n;refreshConceptModel(id);});
    document.querySelectorAll('[data-visual-help]').forEach(el=>el.onclick=()=>openVisualHelp(id));
    document.querySelectorAll('[data-optional-visual]').forEach(el=>el.onclick=()=>openOptionalVisual(el.dataset.optionalVisual));
    document.querySelectorAll('[data-cost-step]').forEach(el=>el.onclick=()=>{r.costCount=Math.max(0,Math.min(24,(r.costCount??0)+Number(el.dataset.costStep)));refreshCostBlocks();});
    refreshCostBlocks();
    document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{
      r.views??=[];r.views.push({view:el.dataset.view,at:clock()});
      document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===el)));
      document.querySelectorAll('[data-view-panel]').forEach(x=>x.hidden=x.dataset.viewPanel!==el.dataset.view);
    });
    document.querySelector('#snapshot').onclick=()=>{r.draft=collect();rememberRaw(r);pauseActivity(r);state.phase='report';renderReport();};
    document.querySelector('#submit').onclick=()=>submit();
    document.querySelector('#skip').onclick=()=>{if(r.complete!==null)beginRevision(r);r.skip=true;r.complete=clock();r.answer=collect();r.score=null;r.reason=null;delete r.verifiedReason;delete r.reasonSource;captureEvent(r,null);r.review='Not applicable';advance();};
    if(id==='V1')bindSolidControls();
    if(warm&&!integrated.handles(id))document.querySelector('#hint').onclick=()=>{const h=id==='C1'?'The middle mark is halfway between −2 and −1. To compare distance, look at how far each number is from zero.':'Start at −3, then count five moves toward smaller numbers: −4, −5, …';r.hints.push({at:clock(),text:h});document.querySelector('#feedback').innerHTML=`<div class="feedback try"><p>${esc(h)}</p></div>`;};
    let a=r.draft??r.answer;
    if(!a&&id==='S3'){
      const m=state.records.S1?.answer,t=state.records.S2?.answer;
      a={};if(Number.isFinite(m?.setupA))a.a0=m.setupA;if(Number.isFinite(m?.setupB))a.b0=m.setupB;if(Number.isFinite(t?.a12))a.a12=t.a12;if(Number.isFinite(t?.b12))a.b12=t.b12;
      r.carriedFields=Object.keys(a);
    }
    restoreFields(a);restoreRaw(r);refreshVisuals(id);if(integrated.handles(id))bindIntegrated(r);updateTimer();
    if(r.complete!==null){document.querySelector('#submit').textContent='Next';document.querySelector('#submit').onclick=advance;document.querySelector('#skip').style.display='none';}
    saveProgress();
    window.scrollTo({top:0,behavior:'auto'});
  }
  function refreshVisuals(id){
    if(integrated.handles(id))rememberRaw(ensure(id));
    if(['QP','QN'].includes(id)){const el=document.querySelector('#quadratic-preview');if(el)el.innerHTML=integrated.preview(id,collect(),state.quadraticComparison);}
    const a=collect(),put=(key,html)=>{const el=document.querySelector('#'+key);if(el)el.innerHTML=html;};
    if(state.adaptiveItems[id]?.modelType==='optional_number_line_preview'){const el=document.querySelector('#adaptive-numberline');if(el){const raw=a.value??a.choice,n=raw==='-5/4'?-1.25:Number(raw);el.innerHTML=miniLine(raw===undefined||raw===null?null:n,0);}}
    if(id==='V1')refreshSolid();
    if(id==='D1'){const x=ensure(id).minusX??7;put('minus-diagram',subtractionDiagram(x));const el=document.querySelector('#minus-x-value');if(el)el.textContent=String(x);}
    if(id==='C2'){const el=document.querySelector('#token-value');if(el)el.textContent=String(a.token??-3).replace('-','−');put('token-visual',miniLine(a.token??-3));}
    if(id==='C7')put('inequality-visual',inequalityView(a));
    if(id==='FN')put('temperature-visual',miniLine(Number.isFinite(a.temp)?a.temp:null,-2));
    if(id==='S1')for(const plan of ['A','B'])put('rule-'+plan,`C = ${Number.isFinite(a['setup'+plan])?esc(a['setup'+plan]):'?'} + ${Number.isFinite(a['rate'+plan])?esc(a['rate'+plan]):'?'} × n`);
    if(id==='S3')refreshSportsGraph();
    if(id==='C3'||id==='C5')refreshConceptModel(id);
  }
  function beginRevision(r){
    r.elapsedBeforeRevision=(r.elapsedBeforeRevision??0)+r.complete-r.started;
    r.started=clock();r.firstAction=null;r.complete=null;r.skip=false;r.score=null;r.reason=null;r.paused=false;r.revisiting=true;delete r.reasonSource;delete r.verifiedReason;delete state.reviewDrafts[r.id];delete state.reviewMessages[r.id];delete r.quadraticRoute;
  }
  function restoreFields(a){
    if(!a)return;
    document.querySelectorAll('[data-n]').forEach(el=>{const v=a[el.dataset.n];if(typeof v==='number'&&Number.isFinite(v)){el.value=String(Math.abs(v));document.querySelector(`[data-sign="${el.dataset.n}"]`).textContent=v<0?'−':'+';}});
    document.querySelectorAll('[data-choice],[data-line]').forEach(el=>el.setAttribute('aria-pressed',String(String(a[el.dataset.choice||el.dataset.line])===el.dataset.value)));
    document.querySelectorAll('[data-slider]').forEach(el=>{if(Number.isFinite(a[el.dataset.slider]))el.value=String(a[el.dataset.slider]);});
    document.querySelectorAll('[data-text]').forEach(el=>el.value=a[el.dataset.text]??'');
    if(current()==='S3')refreshSportsGraph();
  }
  function reasonObjectiveCorrect(id,score) {
    const keys={V1:['linear'],D1:['rewrite'],C4:['table'],C6:['left','right','step'],C9:['m'],C10:['model'],FN:['temp'],FP:['origin'],FE:['step'],FG:['faster'],S3:['meetN','meetC']};
    return (keys[id]??Object.keys(score.parts)).every(key=>score.parts[key]===true);
  }
  function explanationAnchors(id){if(id==='C6')return window.QuidenceReasoning.counterexampleAnchors;if(integrated.handles(id))return integrated.anchors(id);return state.adaptiveItems[id]?[state.adaptiveItems[id].anchor]:window.QuidenceReasoning.anchors(id);}
  function submit(override) {
    const id=current(),r=ensure(id),a=override?{...override}:collect();
    if(explanationAnchors(id).length&&!Object.prototype.hasOwnProperty.call(a,"why"))a.why="";
    const result=check(id,a),notice=document.querySelector("#validation");
    if(result.missing.length){notice.textContent=`Still needed: ${result.missing.map(k=>componentLabel(id,k)).join(", ")}. Choose a value or enter a valid number. You can also skip this part.`;return}
    notice.textContent="";
    if(override){restoreFields(override);refreshVisuals(id);noteAction();}
    if(r.complete!==null)beginRevision(r);
    const at=clock();r.attempts.push({at,answer:structuredClone(a),score:result.score,hintsShown:r.hints.length,support: supportSnapshot(r)});
    r.answer=a;r.draft=null;r.score=result.score;
    rememberRaw(r);
    r.reason=Object.prototype.hasOwnProperty.call(a,"why")?(id==='C6'?window.QuidenceReasoning.counterexample(a.why,result.score.correct):integrated.handles(id)?integrated.reasoning(id,a,result.score):state.adaptiveItems[id]?window.QuidenceAdaptive.reasoning(state.adaptiveItems[id],a.why,result.score.correct):window.QuidenceReasoning.evaluate(id,a.why,reasonObjectiveCorrect(id,result.score),{answer:a})):null;
    if(id==='S4'&&!(a.why??'').trim()&&result.score.correct){r.reason={points:2,max:2,connection:1,connectionMax:1,status:'Provisional credit',matched:window.QuidenceReasoning.anchors(id),anchors:window.QuidenceReasoning.anchors(id),contradicted:false,objectiveConflict:false,reviewReasons:[],method:'structured_boundary_checks_bs02',evidenceSpans:[]};r.reasonSource='Submitted costs show both chosen groups fit and both next players exceed $90.';}
    if(r.reason&&r.reason.method!=='structured_boundary_checks_bs02')r.reason=window.QuidenceReasoning.needsSemanticReview(r.reason);
    r.review=r.reason?.status??"Not applicable";
    if(['QP','QN'].includes(id))r.quadraticRoute=integrated.route(id,result.score);
    if(r.feedback==="immediate"&&!result.score.correct){
      captureEvent(r,result.score);
      saveProgress();
      if(integrated.handles(id)){showIntegratedFeedback(r);updateTimer();return;}
      document.querySelector("#feedback").innerHTML=`<div class="feedback try"><p>Something needs another look. Try checking ${id==="C1"?"the position and distance to zero":"the direction of the move and the ending number"}.</p></div>`;
      return;
    }
    r.complete=at;captureEvent(r,result.score);
    saveProgress();
    if(r.feedback==="immediate"){
      document.querySelector("#feedback").innerHTML=`<div class="feedback"><p>That fits. ${esc(answers[id])}</p>${r.attempts.length>1||r.hints.length?"<p>The report will distinguish this final answer from an answer after another try or a hint.</p>":""}</div>`;
    } else {
      document.querySelector("#feedback").innerHTML='<div class="feedback"><p>Answer saved. We will look at the answer and evidence together at the end.</p></div>';
    }
    document.querySelectorAll(".question input[data-n],.question input[data-slider],.question textarea,.question button[data-choice],.question button[data-line],.question button[data-sign]").forEach(el=>el.disabled=true);
    document.querySelector("#submit").textContent="Next";document.querySelector("#submit").onclick=advance;
    document.querySelector("#skip").style.display="none";const hint=document.querySelector("#hint");if(hint)hint.style.display="none";
    const visualButton=document.querySelector('[data-visual-help]');if(visualButton&&!visualClue(id))visualButton.textContent='Open clue and revise';
    if(integrated.handles(id))showIntegratedFeedback(r);
    updateTimer();
  }
  function route() {
    if(state.planned)return;state.planned=true;state.queue.push(...sports);
  }
  function routeFollowups() {
    if(state.followPlanned)return;state.followPlanned=true;
    const remaining=3-state.queue.filter(id=>id.startsWith('F')).length;if(remaining<=0)return;
    const groups=[["FN",["C1","C2","FAN"]],["FP",["C3","C4","FAR"]],["FE",["C5","C6","C7","FAE"]],["FG",["C8","C9","C10","FAF","FAM"]]];
    const priorities=groups.map(([f,ids])=>({f,weight:ids.reduce((n,id)=>{const r=state.records[id];return n+(r?.reason?.objectiveConflict?4:0)+(r?.reason?.contradicted?3:0)+(r?.skip?2:0)+(r?.score&&!r.score.correct?2:0)+(r?.hints.length?1:0)},0)}));
    const modelResult=state.records.S1,budgetResult=state.records.S4;
    if(modelResult?.skip||modelResult?.score&&!modelResult.score.correct)priorities.push({f:'FM',weight:10});
    else if(budgetResult?.score&&!budgetResult.score.correct)priorities.push({f:'FB',weight:10});
    const follow=priorities.sort((a,b)=>b.weight-a.weight).filter(x=>x.weight>0&&!state.queue.includes(x.f)).slice(0,Math.min(2,remaining)).map(x=>x.f);
    state.queue.push(...follow);
  }
  function advance() {
    if(ensure(current()).complete===null)return;
    if(['QP','QN'].includes(current())){const r=ensure(current());if(r.skip){state.phase='report';renderReport();return;}followQuadratic();return;}
    routeAdaptive(current());
    if(!state.planned&&state.index===9)route();
    if(current()==="S4")routeFollowups();
    state.index++;
    if(state.index>=state.queue.length){state.phase="report";renderReport()}else renderQuestion();
  }
  function routeAdaptive(anchor){
    const adaptive=window.QuidenceAdaptive;if(!adaptive?.checkpoints[anchor])return;
    const r=state.records[anchor],decision=adaptive.select(anchor,r);if(!decision)return;
    if(state.queue.filter(id=>id.startsWith('F')).length>=3)return;
    if(decision.mode==='stretch'&&!state.includeStretch)return;
    // Never replace a question the student has already seen or answered.
    if(state.records[decision.id])return;
    if(state.adaptiveItems[decision.id]?.source_event_id===decision.source_event_id)return;
    const task={...decision.task,source_event_id:decision.source_event_id,selection_mode:decision.mode,source_anchor:anchor};
    state.adaptiveItems[decision.id]=task;
    registerAdaptiveTask(decision.id,task);
    state.adaptiveDecisions.push({...decision,task:undefined,at_ms:clock(),policy_version:'reviewed-branches-0.4.1'});
    if(!state.queue.includes(decision.id))state.queue.splice(state.index+1,0,decision.id);
  }
  function registerAdaptiveTask(id,task){
    titles[id]=task.title;topics[id]=task.topic;required[id]=[...task.fields.map(f=>f.key),'why'];expected[id]=structuredClone(task.answer);
    answers[id]=`${Object.entries(task.answer).map(([k,v])=>`${task.fields.find(f=>f.key===k)?.label??k}: ${v}`).join('; ')}. ${task.anchor}`;
  }
  function updateTimer() {
    if(state.phase!=="assessment")return;
    const r=state.records[current()],el=document.querySelector("#timer");if(el&&r)el.textContent=elapsed(activityTime(r));
  }
  setInterval(updateTimer,1000);
  function signal(ids) {
    const rs=ids.map(id=>state.records[id]).filter(Boolean);
    const first=rs.filter(r=>r.score?.correct&&!r.skip&&r.attempts[0]?.score?.correct&&!(r.supportAtSubmission?.hint_ids.length??r.hints.length));
    const supported=rs.filter(r=>r.score?.correct&&((r.supportAtSubmission?.hint_ids.length??r.hints.length)||r.attempts.length>1));
    const difficult=rs.filter(r=>r.score&&!r.score.correct);
    const skipped=rs.filter(r=>r.skip);
    const pending=rs.filter(r=>r.reason||r.review==="Needs review");
    const objectiveClean=first.length>=2&&difficult.length===0&&skipped.length===0;
    let heading,description;
    if(difficult.length>=2) {heading="Area to investigate";description=`Objective parts on ${difficult.map(r=>r.id).join(" and ")} were not yet correct. Try another representation before deciding why.`}
    else if(objectiveClean&&!pending.length){heading="Observed success in this session";description=`Objective answers on ${first.map(r=>r.id).join(" and ")} were correct on the first try across different tasks. This is a session observation, not mastery of a course.`}
    else if(objectiveClean&&pending.length){heading="Promising objective evidence; explanations provisional";description=`Objective parts on ${first.map(r=>r.id).join(" and ")} were correct. Written reasoning on ${pending.map(r=>r.id).join(", ")} still needs a person to confirm the meaning.`}
    else if(first.length||supported.length){heading="Promising, but needs confirmation";description=`Correct objective result on ${[...first,...supported].map(r=>r.id).join(", ")}. Another independent check is needed${difficult.length?`; ${difficult.map(r=>r.id).join(", ")} had an objective difficulty`:""}.`}
    else {heading="Insufficient evidence";description=`This session has too little confirmed evidence here${skipped.length?`; ${skipped.map(r=>r.id).join(", ")} was skipped`:""}.`}
    return {heading,description,first,difficult,skipped,pending};
  }
  function sportsContext() {
    return `<section class="project-context"><div class="project-intro"><span class="eyebrow">THE BRIEF</span><p>Help your school compare two equipment plans.</p><details><summary>Shared rules</summary><p>Both plans provide the same equipment. There are no extra charges or capacity limits. Players are nonnegative whole numbers.</p></details></div><div class="plan-offer"><span class="plan-label">Plan A</span><div><strong>$24</strong><small>paid once</small><span>+</span><strong>$3</strong><small>per player</small></div></div><div class="plan-offer"><span class="plan-label alt">Plan B</span><div><strong>$6</strong><small>paid once</small><span>+</span><strong>$5</strong><small>per player</small></div></div></section>`;
  }
  function model() {return state.records.S1?.answer??null;}
  function studentModelNotice() {
    const m=model();if(!m||state.records.S1.skip)return '<p class="model-note">No saved rules yet. Build your rules first, or work from the plan fees above.</p>';
    return `<p class="model-note">Your rules · A: C = ${esc(m.setupA)} + ${esc(m.rateA)}n; B: C = ${esc(m.setupB)} + ${esc(m.rateB)}n. No correctness feedback has been shown.</p>`;
  }
  function sportsGraph(a) {
    const L=58,R=500,T=25,B=280,x=n=>L+n/24*(R-L),y=c=>B-c/126*(B-T);
    const finite=k=>a[k]!==null&&a[k]!==undefined&&Number.isFinite(a[k]);
    const make=(plan,c0,c12,color)=>finite(c0)&&finite(c12)?`<g clip-path="url(#sports-clip)"><line x1="${x(0)}" y1="${y(a[c0])}" x2="${x(24)}" y2="${y(a[c0]+2*(a[c12]-a[c0]))}" stroke="${color}" stroke-width="3"/>${[[0,a[c0]],[12,a[c12]]].map(([n,c])=>`<circle cx="${x(n)}" cy="${y(c)}" r="5" fill="${color}"/><text x="${x(n)+8}" y="${y(c)-9}" fill="${color}" class="graph-point-label">${plan} (${n}, ${c})</text>`).join('')}</g>`:'';
    const entered=finite('a0')&&finite('a12')||finite('b0')&&finite('b12');
    const labels=entered?`Your graph: ${finite('a0')&&finite('a12')?`A points (0, ${a.a0}), (12, ${a.a12}). `:''}${finite('b0')&&finite('b12')?`B points (0, ${a.b0}), (12, ${a.b12}).`:''}`:'Your graph is empty; enter both points for a plan to draw its line.';
    return `<figure class="graph-card"><svg viewBox="0 0 550 340" role="img" aria-label="${esc(labels)}"><defs><clipPath id="sports-clip"><rect x="${L}" y="${T}" width="${R-L}" height="${B-T}"/></clipPath></defs><g class="graph-grid">${Array.from({length:9},(_,i)=>i*3).map(n=>`<line x1="${x(n)}" x2="${x(n)}" y1="${T}" y2="${B}"/>`).join('')}${Array.from({length:7},(_,i)=>i*21).map(c=>`<line x1="${L}" x2="${R}" y1="${y(c)}" y2="${y(c)}"/>`).join('')}</g><path class="graph-axis" d="M${L} ${T}V${B}H${R}"/><g class="graph-ticks">${Array.from({length:9},(_,i)=>i*3).map(n=>`<text x="${x(n)}" y="${B+23}" text-anchor="middle">${n}</text>`).join('')}${Array.from({length:7},(_,i)=>i*21).map(c=>`<text x="${L-10}" y="${y(c)+5}" text-anchor="end">${c}</text>`).join('')}</g>${make('A','a0','a12','#2147df')}${make('B','b0','b12','#b75508')}${finite('meetN')&&finite('meetC')?`<g clip-path="url(#sports-clip)"><circle cx="${x(a.meetN)}" cy="${y(a.meetC)}" r="7" fill="#e6a83c" stroke="#102b3f"/><title>Your meeting point (${esc(a.meetN)}, ${esc(a.meetC)})</title></g>`:''}<text x="${(L+R)/2}" y="${B+52}" class="graph-axis-label" text-anchor="middle">Number of players, n</text><text x="14" y="155" transform="rotate(-90 14 155)" class="graph-axis-label" text-anchor="middle">Total cost, C ($)</text></svg><figcaption><span class="legend-a">Plan A</span> · <span class="legend-b">Plan B</span> · Your meeting point. Grid: 3 players horizontally, $21 vertically. Values outside the displayed range are clipped.</figcaption><p class="help">${esc(labels)}</p></figure>`;
  }
  function refreshSportsGraph(){const el=document.querySelector('#sports-graph');if(el)el.innerHTML=sportsGraph(collect());}
  function conditionalResults(id,a) {
    const m=model();if(!m||state.records.S1?.skip)return null;
    const cost=(plan,n)=>m['setup'+plan]+m['rate'+plan]*n;
    let ref=null;
    if(id==='S2')ref={a6:cost('A',6),b6:cost('B',6),a12:cost('A',12),b12:cost('B',12)};
    if(id==='S3')ref={a0:cost('A',0),b0:cost('B',0),a12:cost('A',12),b12:cost('B',12)};
    if(id==='S5')ref={a20:cost('A',20),b20:cost('B',20)};
    if(id==='S4'&&m.rateA>0&&m.rateB>0&&m.setupA<=90&&m.setupB<=90)ref={maxA:Math.floor((90-m.setupA)/m.rateA),maxB:Math.floor((90-m.setupB)/m.rateB),costA:cost('A',a.maxA),nextA:cost('A',a.maxA+1),costB:cost('B',a.maxB),nextB:cost('B',a.maxB+1)};
    return ref?Object.fromEntries(Object.entries(ref).map(([key,value])=>[key,{expected_under_student_model:value,correct:Number.isFinite(a[key])&&Math.abs(a[key]-value)<1e-8}])):null;
  }
  function captureEvent(r,score) {
    r.questionSnapshot??=questionContext(r.id);
    const a=structuredClone(r.answer??{}),now=clock(),support=supportSnapshot(r);
    const e={event_id:crypto.randomUUID(),session_id:state.sessionId,item_id:r.id,item_version:'0.6',item_variant:r.taskSnapshot?.variant_id??'base',adaptive_source:r.taskSnapshot?{anchor:r.taskSnapshot.source_anchor,event_id:r.taskSnapshot.source_event_id,mode:r.taskSnapshot.selection_mode}:null,rubric_version:integrated.handles(r.id)?'sketch-central-reasons-0.5':r.taskSnapshot?'adaptive-anchors-0.4.1':'0.4-conservative-2',quadratic_route:r.quadraticRoute?structuredClone(r.quadraticRoute):null,quadratic_source:r.quadraticSource??null,dependency_group:['QP','QN'].includes(r.id)?'QUADRATIC_SIGNS':r.id.startsWith('S')?'SPORTS_DAY':r.id,attempt_index:Math.max(1,r.attempts.length),phase:r.revisiting||r.attempts.length>1?'revision':r.id.startsWith('F')?'followup':'first_attempt',feedback_mode:r.feedback,status:r.notStudied?'not_yet_studied':r.skip?'skipped':'submitted',response:{fields:Object.fromEntries(Object.entries(a).filter(([k])=>k!=='why')),raw_explanation:a.why??null},objective_components:score?Object.entries(score.parts).map(([key,correct])=>({subpart:key,construct:componentLabel(r.id,key),observed:integrated.handles(r.id)?integrated.componentEvidence(r.id,key,a).observed:a[key]??null,expected:integrated.handles(r.id)?integrated.componentEvidence(r.id,key,a).expected:expected[r.id]?.[key]??(r.id==='S6'?'Valid counterexample under the reference plans':null),correct,support_level:support.hint_ids.length?'hinted':r.taskSnapshot?.suppliedModel?'supplied_model':r.id==='FM'||r.id==='FB'?'supplied_model':r.id==='S3'?'supported_plot':r.id.startsWith('S')&&r.id!=='S1'&&state.records.S1?.skip?'supplied_descriptions':'independent'})):[],reason_assessment:{interpretation_policy_version:'meaning-review-required-1',provisional:r.skip?null:r.reason?structuredClone(r.reason):null,verified:null,review_required:!!r.reason&&r.reason.status==='Needs review',review_reasons:r.reason?.reviewReasons??[],evidence_spans:r.reason?.evidenceSpans??[]},support:{...support,cost_preview:costSpec(r.id)?{count:r.costCount??0,reference_fees:costSpec(r.id).plans}:null,visual_help:structuredClone(r.visualHelp??{}),given_representation:!Object.keys(r.visualPanels??{}).length?null:r.taskSnapshot?.modelType??(r.id==='C11'?'restore_and_equal_groups':['QP','QN'].includes(r.id)?'quadratic_function_graph':r.id==='V1'?'interactive_four_part_volume_model':r.id==='D1'?'subtraction_area_model':r.id==='C3'?'equal_lap_schematic':r.id==='C5'||r.id==='C6'?'three_stage_rectangle_area_model':r.id==='FE'?'token_groups_with_optional_area_sequence':null),visual_state:r.id==='C11'?{stage:r.restoreStage??0}:['QP','QN'].includes(r.id)?{comparison:state.quadraticComparison}:r.id==='V1'?structuredClone(r.solidView):r.id==='D1'?{positive_x_preview:r.minusX??7}:r.id==='C3'?{lap_count:r.lapView??3}:r.id==='C5'?{positive_x_preview:visualClue(r.id)?r.areaX??3:null}:null,supplied_model:r.taskSnapshot?.suppliedModel?r.taskSnapshot.prompt:r.id==='FM'?'P=10+4n; Q=22+2n':r.id==='FB'?'C=6+5n':r.id.startsWith('S')&&r.id!=='S1'&&state.records.S1?.skip?'Plan descriptions supplied after skipped model':null,strategy_prompt:null,student_model:r.id.startsWith('S')?model():null,carried_fields:r.carriedFields??[],views:r.views??[],plot_support:r.id==='S3'?'Automatic plot from entered values at supplied x positions':null},timing:{started_at_ms:r.started,first_action_at_ms:r.firstAction,submitted_at_ms:now,completed_at_ms:r.complete,elapsed_wall_ms:(r.complete??now)-r.started,total_active_ms:activityTime(r)},conditional_arithmetic:conditionalResults(r.id,a)};
    e.question=structuredClone(r.questionSnapshot);
    state.events.push(e);r.lastEventId=e.event_id;r.supportAtSubmission=structuredClone(e.support);r.conditionalAtSubmission=e.conditional_arithmetic;r.studentModelAtSubmission=structuredClone(e.support.student_model);
  }
  const componentNames={quad:'x² coefficient',linear:'x coefficient',constant:'constant term',volume2:'volume at x = 2',rewrite:'subtraction rewrite',areaAt7:'remaining area at x = 7',point:'number-line location',near:'distance from zero',token:'leftward token position',end:'ending position',one:'one-lap time',two:'two-lap time',five:'five-lap time',rate:'unit rate',table:'proportional table',cardA:'equivalent expression',cardB:'non-equivalent expression',step:'selected conclusion',left:'x² at x = 3',right:'2x at x = 3',boundary:'inequality boundary',dot:'boundary inclusion',ray:'solution direction',m:'slope',b:'starting value',pair:'zero-input point',model:'cost model',cost:'substitution',temp:'new temperature',origin:'origin relationship',faster:'rate comparison',setupA:'A setup amount',rateA:'A per-player rate',setupB:'B setup amount',rateB:'B per-player rate',a6:'A at 6 players',b6:'B at 6 players',a12:'A at 12 players',b12:'B at 12 players',a0:'A at 0 players',b0:'B at 0 players',meetN:'meeting-point players',meetC:'meeting-point cost',maxA:'A maximum whole players',maxB:'B maximum whole players',costA:'A cost at chosen limit',nextA:'A cost at next player',costB:'B cost at chosen limit',nextB:'B cost at next player',a20:'A at 20 players',b20:'B at 20 players',fits:'budget decision',counterN:'counterexample player count',p8:'P cost at 8 players',q8:'Q cost at 8 players',lower:'lower supplied-model total',max:'maximum whole players',chosenCost:'cost at chosen limit',nextCost:'cost at next player',counterA:'counterexample A cost',counterB:'counterexample B cost',less:'A costs less than B'};
  function componentLabel(id,key){if(integrated.handles(id)){const names={operation:'cancelling operation on both sides',amount:'operation amount',x:'value of x',expansion:'expanded coefficients',points:'three chosen-point calculations',opening:'opening direction',vertex:'turning-point coordinates',extremum:'minimum or maximum',a:'x² coefficient',b:'x coefficient',c:'constant',vx:'turning-point x',vy:'turning-point y',kind:'minimum or maximum',reason:'chosen central reason'};return names[key]??key;}const task=state.records[id]?.taskSnapshot??state.adaptiveItems[id];return task?.fields.find(f=>f.key===key)?.label??componentNames[key]??key;}
  function findings(){
    const fs=[],get=id=>state.records[id]?.complete!==null||integrated.handles(id)&&state.records[id]?.attempts.length?state.records[id]:null,ok=(id,key)=>get(id)?.score?.parts?.[key]===true,not=(id,key)=>get(id)?.score?.parts?.[key]===false;
    const add=(priority,title,evidence,action,check,ids)=>fs.push({priority,title,evidence,action,check,ids});
    for(const [id,task]of Object.entries(state.adaptiveItems)){
      const r=get(id);if(!r||r.skip||!r.score)continue;
      const supported=!!r.supportAtSubmission?.hint_ids.length;
      if(!r.score.correct)add(8,`Recheck ${task.title.toLowerCase()}`,`The new example still has a mismatch in ${Object.keys(r.score.parts).filter(k=>!r.score.parts[k]).map(k=>componentLabel(id,k)).join(', ')}. This is a specific observation, not a permanent weakness.`,task.anchor,'Try another example with changed numbers and explain the central relationship.',[task.source_anchor,id]);
      else if(task.selection_mode==='confirm')add(6,'A fresh check matched after earlier support or revision',`${task.title}: all objective components matched ${supported?'with optional support opened':'without opening its optional helper'}. The explanation remains provisional. Earlier and later work are kept separate.`,supported?'Use the model, then try another example with the helper closed.':'Ask for the same idea in a different context before treating it as a stable strength.','Use changed numbers and request the central reason.',[task.source_anchor,id]);
    }
    const s6Conflict=get('S6')?.reason?.contradicted&&(get('S6')?.verifiedReason?.points??0)<2;
    if(s6Conflict)add(12,'Match your conclusion to your cost comparison','S6: your written comparison conflicts with the reference plans. Above 9 players, A costs less than B. Check whether the plan letter in your explanation matches your calculations.','Read your two totals, then name the cheaper plan and explain what that shows about “always cheaper”.','At 12 players, compare A = $60 and B = $66. Does this support or challenge the claim about B?',['S6']);
    const changedRuleSteps=['S2','S3','S4','S5'].filter(id=>get(id)?.studentModelAtSubmission&&JSON.stringify(get(id).studentModelAtSubmission)!==JSON.stringify(model())&&get(id)?.score&&!get(id).score.correct);
    if(changedRuleSteps.length)add(11,'Recheck the work after changing your rule',`You changed the saved S1 rule after submitting ${changedRuleSteps.join(', ')}. Those steps preserve the rule used at their submission. Recheck them before interpreting a budget or arithmetic difficulty.`,'Apply your revised rule to one earlier calculation and compare the result.','Check both plans again for 6 players.', ['S1',...changedRuleSteps]);
    if(not('C9','m')){
      const r=get('C9'),v=r.answer.m;
      add(10,Math.abs(v)===1?'Check the direction of change':'Connect point changes to slope',`C9: you entered m = ${v}${ok('C9','b')?' and correctly identified b = 2':''}. ${r.reason?.points===2?'The numeric answer and the written reasoning need to be checked together.':'The sign and size of the change need another check.'}`,'Write the change in y and the change in x before dividing.','For (0, 4) and (2, 2), determine the signed slope.', ['C9']);
    }
    if(not('S1','setupA')||not('S1','rateA')||not('S1','setupB')||not('S1','rateB')){
      const dependent=['S2','S3','S4','S5'].filter(id=>{const c=get(id)?.conditionalAtSubmission;return c&&Object.values(c).every(v=>v.correct)});
      add(9,'Separate the setup cost from each-player cost',`S1: your rule differs from one or both plan descriptions.${dependent.length?` Your later calculations in ${dependent.join(', ')} follow your saved rules; that is useful arithmetic evidence, even though the model needs checking.`:''}`,'Label the amount paid once and the amount repeated for each player before building the rule.','A plan charges $10 once plus $4 per player. Build its total-cost rule.', ['S1',...dependent]);
    }else if((not('S4','maxA')||not('S4','maxB'))&&!changedRuleSteps.includes('S4')){
      const r=get('S4');add(9,'Check the whole-number budget boundary',`S1 uses the correct rules. S4 gives A = ${r.answer.maxA} and B = ${r.answer.maxB} players; at least one limit needs checking.`,'Calculate the cost of your chosen whole number and the next one.','With a $100 budget, find Plan B\'s maximum whole number and check the next player.', ['S1','S4']);
    }
    if(not('C6','left')||not('C6','right')||not('C6','step'))add(8,'Test the claim with the same input','Q6: the substituted values or the conclusion need another check.','Evaluate both sides at x = 3, then compare 9 and 6.','Is x² = 2x true at x = 4?',['C6']);
    if(not('FE','step')){
      const ids=['FE'].filter(id=>not(id,'step'));add(8,'Apply the multiplier to the constant too',`${ids.join(' and ')}: the selected distribution step needs another look.${ids.some(id=>get(id).reason?.points===2)?' Check that the selected step follows the written reasoning.':''}`,'Use two groups of x red tokens and 3 blue tokens to account for both terms.','Explain why 2(x + 3) contains six blue tokens.',ids);
    }
    for(const [id,key,topic,next] of [['C3','lap-time','equal-time breakdown','A runner completes 4 equal laps in 10 minutes. Without the breakdown, find the time for 1 lap and for 8 laps.'],['C5','rectangle-split','area explanation','Without the area clue, rewrite 2(x + 5) and explain what happens to the 5.']]){
      const r=get(id),help=r?.visualHelp?.[key];if(!r?.score?.correct||!help)continue;
      const first=help.attemptsBeforeHelp?r.attempts[help.attemptsBeforeHelp-1]:null;
      add(7,first?.score?.correct?'Keep your first result separate from guided practice':first?'A correct revision after a visual clue':'Correct work with a visual clue',first?`Your saved ${id} answer before the ${topic} was ${first.score.correct?'correct':'not fully correct'}. Your current answer is correct. The clue displayed key quantities, so the later result is supported evidence.`:`You opened the ${topic} before saving an answer. Your current answer is correct, and the clue displayed key quantities. No unassisted submitted result was collected on this item.`,'Use the diagram to explain the relationship, then check a new example with the clue hidden.',next,[id]);
    }
    if(not('V1','linear'))add(8,'Account for both mixed volume parts',`V1: your x coefficient was ${get('V1').answer.linear}. Both A/B and C/D pairings matter: the two x terms contribute 40x and 48x. Rotating the model does not alter those dimensions.`,'Write one height × width × depth product for each of the four parts before combining like terms.','Use the same four-part method to expand 2(x + 1)(x + 4).',['V1']);
    if(not('D1','rewrite'))add(8,'Subtract an area, not just a width',`D1: you selected ${get('D1').answer.rewrite}. Removing width 3 from a height-5 rectangle removes area 15.`,'Multiply the removed width by the full height, then subtract that area from the whole.','Rewrite 4(x − 3) and describe the removed strip.',['D1']);
    if(get('V1')?.score?.correct&&get('D1')?.score?.correct)add(5,'Area and volume products matched in two tasks',`Your expanded volume expression, numerical volume, subtraction rewrite, and remaining area matched. ${['V1','D1'].some(id=>get(id).supportAtSubmission?.hint_ids.length)?'Visual support was opened before at least one submission.':'No optional geometric support was opened before these submissions.'}`,'Try a new product with the partitions hidden; explain how you decide which parts to add or subtract.','Expand 2(x + 1)(x + 4), then rewrite 4(x − 3).',['V1','D1']);
    if(ok('C3','rate')&&(not('C3','two')||not('C3','five')))add(7,'Use the unit rate consistently','C3: you found 2.5 minutes per lap, but at least one scaled time differs from that rate.','Multiply the minutes per lap by the number of laps and keep the units.','At this pace, how long do 4 laps take?',['C3']);
    if(not('C7','dot')||not('C7','ray'))add(6,'Connect the boundary to its solution set',`C7: ${not('C7','dot')?'the boundary inclusion':''}${not('C7','dot')&&not('C7','ray')?' and ':''}${not('C7','ray')?'the ray direction':''} needs checking.`,'Test the boundary itself and one number on each side.','For x ≥ 4, test x = 4, 3 and 5, then describe the point and ray.',['C7']);
    if(ok('C8','b')&&ok('C10','model'))add(4,'Starting values appeared in two task formats','C8: b = 3 was correct. C10: you selected the rule with the $12 setup fee and $5 per visit.','Keep separating the starting amount from the change per unit.','If only the sign-up fee changes to $18, which part of the rule changes?',['C8','C10']);
    if(get('S4')?.score?.correct&&get('S6')?.score?.correct&&!s6Conflict)add(5,'You checked a budget boundary and challenged a claim','In Decide, both maximum groups and their next-player costs were correct. In Explore, your numeric example made A cheaper than B. These are connected parts of one project.','Try changing a setup fee and see whether your comparison still holds.','Raise A\'s setup fee to $36. Which plan is cheaper at 12 players?',['S4','S6']);
    for(const id of ['C11','QP','QN']){const r=get(id);if(!r?.score||r.skip)continue;if(!r.score.correct)add(8,`Recheck ${titles[id]}`,`The latest try needs a check in ${Object.keys(r.score.parts).filter(k=>!r.score.parts[k]).map(k=>componentLabel(id,k)).join(', ')}. Earlier submissions remain in the record.`,integrated.anchors(id)[0],'Try changed numbers with the helper initially closed.',[id]);else add(5,`A matched check in ${titles[id]}`,`All objective components matched ${r.supportAtSubmission?.hint_ids.length?'with visual support available':'without opening its optional visual'}. The reason remains provisional.`,'Explain the central reason, then try a different example.','A matched task is a session observation, not established mastery.',[id]);}
    if(!fs.length){const finished=state.queue.filter(id=>get(id)?.complete!==null&&get(id)?.score&&!get(id)?.skip);add(1,finished.length?'A starting point for another check':'More evidence is needed',finished.length?`Objective answers were recorded in ${finished.join(', ')}. This report has no specific confirmed pattern to add yet.`:'Skipped activities are missing evidence, not wrong answers.','Review one completed activity together and explain its central idea.','Try the same idea in a different representation.',finished.slice(0,3));}
    const sorted=fs.sort((a,b)=>b.priority-a.priority),strength=sorted.find(f=>f.priority===4||f.priority===5);
    return strength&&sorted.length>3?[...sorted.filter(f=>f!==strength).slice(0,2),strength]:sorted.slice(0,3);
  }
  function preserveReviewDrafts(){
    document.querySelectorAll('[data-review]').forEach(form=>{
      state.reviewDrafts[form.dataset.review]={credit:form.elements.credit.value,note:form.elements.note.value};
    });
  }
  function reportNotice(message,isError=false){
    const el=document.querySelector('#report-status');if(!el)return;
    el.hidden=false;el.textContent=message;el.className=isError?'report-status error':'report-status';
    const dialog=document.querySelector('#restart-dialog'),status=document.querySelector('#restart-status');
    if(dialog?.open&&status)status.textContent=message;
  }
  function sessionExport(){
    preserveReviewDrafts();
    return {version:'0.6',quadratic_activity:{ready:state.quadraticReady,unlocked:state.quadraticUnlocked,decisions:structuredClone(state.quadraticDecisions)},base_version:'0.4.0',interface_variant:'Quidence main',adaptive_policy_version:'bounded-reviewed-branches-0.6',adaptive_decisions:structuredClone(state.adaptiveDecisions),adaptive_items:structuredClone(state.adaptiveItems),session_id:state.sessionId,exported_at:new Date().toISOString(),events:structuredClone(state.events),reviewer_decisions:structuredClone(state.reviewed),reviewer_drafts:structuredClone(state.reviewDrafts),records:structuredClone(state.records),findings:findings(),markdown:sessionMarkdown()};
  }
  function downloadFile(contents,type,filename){
    const blob=new Blob([contents],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=filename;link.hidden=true;
    try{document.body.appendChild(link);link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  }
  function downloadSession(){
    try{
      downloadFile(JSON.stringify(sessionExport(),null,2),'application/json',`quidence-session-${state.sessionId}.json`);
      const message='Session record download requested. Check your browser downloads. Saved reviews and any unsaved review drafts are included separately.';
      reportNotice(message);
    }catch{reportNotice('The download could not start. Please try again in a full browser tab.',true);}
  }
  function itemLabel(id){return core.includes(id)?'Q'+(core.indexOf(id)+1):id.startsWith('S')?'P1':id==='V1'?'P2':id==='D1'?'P3':['QP','QN'].includes(id)?'P4':'Extra · '+id;}
  function responseText(r){const a=r.complete===null?(r.draft??r.answer??{}):(r.answer??{});return Object.entries(a).filter(([key])=>key!=='why').map(([key,value])=>`${componentLabel(r.id,key)}: ${typeof value==='object'?JSON.stringify(value):({same:'Matches',different:'Does not match','not-always':'Not true for every x',always:'True for every x'}[value]??value??'not entered')}`).join('\n');}
  function feedbackText(r){
    if(r.notStudied)return'Topic not yet studied. No incorrect-answer or mastery judgment is made.';
    if(r.skip)return'Skipped; evidence is missing. Partial work is retained.';
    if(r.complete===null)return'Not submitted. This draft has not been scored.';
    const lines=[];
    if(r.score){const bad=Object.entries(r.score.parts).filter(([,ok])=>!ok);lines.push(bad.length?'Recheck: '+bad.map(([key])=>componentLabel(r.id,key)).join(', ')+'.':'All submitted answer components match.');
      for(const[key]of bad){const event=state.events.filter(e=>e.item_id===r.id).at(-1),c=event?.objective_components.find(c=>c.subpart===key);if(c)lines.push(`${c.construct}: you entered ${JSON.stringify(c.observed)}; reference ${JSON.stringify(c.expected)}.`);}
      if(r.id==='S4'&&(r.answer.nextA===3||r.answer.nextB===5))lines.push('The next-player field asks for the new total, including the setup fee and all players. $3 and $5 are the increases; the new totals are $93 and $91.');
    }
    const q=r.verifiedReason??r.reason;
    if(q){lines.push(r.verifiedReason?`Reviewed explanation: ${q.points===null?'open':q.points+'/2'}. ${q.note}`:r.reason?.method==='structured_boundary_checks_bs02'?'Submitted cost checks support the budget boundary; this does not automatically assess written understanding.':'Explanation retained for review; its meaning is not automatically graded and no automatic zero is assigned.');
      for(const e of r.reason?.calculationChecks??[])if(!e.correct)lines.push(`Recheck the calculation ${e.text}${e.value!==null?'; the left side is '+e.value:''}.`);
      if(r.verifiedReason&&q.points===1)lines.push('Part of the reasoning is visible. Check the remaining step before treating the explanation as complete.');
    }
    if(r.supportAtSubmission?.hint_ids.length)lines.push('A helper was opened before this submission. That records support being available; it does not establish that it was needed.');
    return lines.join('\n');
  }
  function sessionMarkdown(){
    const quote=s=>String(s??'').split('\n').map(line=>'> '+line).join('\n');
    let out=`# Quidence · Algebra learning report\n\nSession: ${state.sessionId}\n\n## Request for an AI tutor\n\n${window.QuidenceReportStore?.HANDOFF??'Read my questions and work, check the calculations and reasoning, then teach one next idea.'}\n\n`;
    for(const f of findings())out+=`## ${f.title}\n\n${f.evidence}\n\nNext: ${f.action}\n\n`;
    for(const id of state.queue){const r=state.records[id];if(!r)continue;const q=r.questionSnapshot??questionContext(id);out+=`## ${itemLabel(id)} · ${q.title}\n\nQuestion: ${q.prompt}\n\n### My work\n\n${quote(responseText(r))}\n\n${quote(r.answer?.why||r.draft?.why||r.reasonSource||'No written explanation entered.')}\n\n### Feedback\n\n${feedbackText(r)}\n\n`;
      if(r.complete!==null&&!r.skip)out+=`Reference: ${answers[id]}\n\n`;
      if(r.attempts.length>1){out+='### Submission history\n\n';r.attempts.forEach((a,i)=>out+=`Attempt ${i+1} · ${a.support?.hint_ids?.length?'support available':'before recorded support'}\n\n${quote(JSON.stringify(a.answer))}\n\n`);}
      if(state.reviewDrafts[id]?.note)out+=`Unsaved reviewer draft (not a scoring decision): ${state.reviewDrafts[id].note}\n\n`;
    }
    return out+'This report samples selected foundations. Missing work, calculation errors and explanations remain separate.\n';
  }
  function printableReport(){
    const all=state.queue.map(id=>state.records[id]).filter(Boolean);
    const body=`<header><h1>Quidence · Algebra learning report</h1><p class="report-meta">Session ${esc(state.sessionId)}</p><p>${all.filter(r=>r.complete!==null&&!r.skip).length} submitted · ${all.filter(r=>r.notStudied).length} not yet studied · ${all.filter(r=>r.skip&&!r.notStudied).length} skipped · ${state.queue.filter(id=>state.records[id]?.complete==null).length} not submitted</p></header><section><h2>Useful next steps</h2>${findings().map(f=>`<div class="report-feedback"><h3>${esc(f.title)}</h3><p>${esc(f.evidence)}</p><p>Next: ${esc(f.action)}</p></div>`).join('')}</section><h2>Questions, your work and feedback</h2>${all.map(r=>{const q=r.questionSnapshot??questionContext(r.id);return`<section class="report-item"><h3>${esc(itemLabel(r.id))} · ${esc(q.title)}</h3><p class="question-text">Question: ${esc(q.prompt)}</p><div class="student-work">Your work\n${esc(responseText(r))}\n${esc(r.complete===null?r.draft?.why??'':r.answer?.why||r.reasonSource||'No written explanation entered.')}</div><div class="report-feedback"><p style="white-space:pre-wrap">${esc(feedbackText(r))}</p>${r.complete!==null&&!r.skip?`<p>Reference: ${esc(answers[r.id])}</p>`:''}</div></section>`;}).join('')}<p class="report-meta">Written reasoning is reviewed provisionally. This short check is not a complete measure of the subject. The downloadable record keeps all submissions, support and review history.</p>`;
    return window.QuidenceReportTools.documentHtml('Quidence · Session report',body);
  }
  function printReport(){
    preserveReviewDrafts();
    saveProgress();
    try{
      const html=printableReport(),preview=window.open('','_blank');
      if(!preview){reportNotice('The printable report was blocked. Allow pop-ups for this page, or use Download printable report below.',true);return;}
      preview.opener=null;preview.document.open();preview.document.write(html);preview.document.close();
      reportNotice('A printable report opened in a new tab. Use Print / save as PDF there. Your session remains open here.');
      preview.focus();
    }catch{reportNotice('The print view could not open. Use Download printable report below, then open that file in your browser.',true);}
  }
  function downloadPrintable(){
    try{downloadFile(printableReport(),'text/html',`quidence-report-${state.sessionId}.html`);reportNotice('Printable report download requested. Open the HTML file in your browser, then choose Print / save as PDF.');}
    catch{reportNotice('The printable report could not download. Please try again in a full browser tab.',true);}
  }
  function resetSession(){
    state.phase='assessment';state.queue=[...core,...sports,...geometryLab,'QP'];state.index=0;state.records={};state.catalogOpen=true;state.quadraticReady=false;state.quadraticUnlocked=false;state.quadraticComparison=false;state.quadraticGate=false;state.quadraticDecisions=[];state.planned=true;state.followPlanned=false;state.events=[];state.reviewed=[];state.reviewMode=false;state.reviewDrafts={};state.reviewMessages={};state.adaptiveItems={};state.adaptiveDecisions=[];state.lastMessage='';state.includeStretch=false;state.sessionId=crypto.randomUUID();renderWelcome();window.scrollTo({top:0,behavior:'auto'});
  }
  const reviewMessages={semantic_review_required:'A reviewer must check the mathematical meaning, the link to this question and the justification; a pattern match cannot confirm these.',missing_explanation:'No explanation was entered.',objective_conflict:'The selected or numeric answer needs checking alongside this explanation.',quoted_claim_unclear:'It is unclear whether the quoted claim is being supported or challenged.',answer_explanation_conflict:'The written comparison conflicts with the mathematical result.',internal_contradiction:'Two parts of the explanation appear to disagree.',incorrect_retained_claim:'A mathematical claim in the explanation needs checking.',unresolved_negation:'The automatic check could not resolve what the negative statement means.',unknown_or_conflicting_wording:'The explanation is kept for a tutor to review. Different wording is not automatically wrong.',arithmetic_error:'A calculation in the explanation needs checking. The written approach and answer components are considered separately.'};
  function visualSupportReview(all){
    const rows=all.filter(r=>r.visualPanels).map(r=>{
      const count=Math.min(...Object.values(r.visualPanels).map(p=>p.attemptsBeforeHelp));
      const before=r.attempts.slice(0,count).filter(a=>!a.support?.hint_ids.length&&!a.hintsShown).at(-1);
      const after=r.attempts.slice(count).filter(a=>a.support?.hint_ids.length).at(-1);
      return `<li><strong>${esc(titles[r.id])}</strong><p>${before?`Before optional support: ${before.score.correct?'answer components matched':'some components needed checking'}.`:'No independent submitted answer was collected before opening support; the earlier draft is retained separately.'} ${after?`With support available: ${after.score.correct?'answer components matched':'some components still need checking'}.`:'No new answer has been submitted after opening this visual.'}</p></li>`;
    }).join('');
    return `<article class="card report-card"><h2>Independent work and visual support</h2><p>Opening a visual is a choice, not proof that it was needed. A draft is not a submitted result. Hiding a visual does not erase having seen it. Sports Day support carries across its connected steps.</p>${rows?`<ul>${rows}</ul>`:'<p>No optional visual models were opened in this session.</p>'}<p>Next check: use a new example with the helper initially closed. Compare the independent attempt with any later supported attempt before choosing a teaching approach.</p></article>`;
  }
  function adaptivePathReview(){
    const decisions=Object.values(state.adaptiveItems).map(task=>state.adaptiveDecisions.filter(d=>d.key===task.variant_id&&d.id===window.QuidenceAdaptive.checkpoints[task.source_anchor]).at(-1)).filter(Boolean);
    return `<article class="card report-card"><h2>How your next checks were chosen</h2><p>These short checks use earlier submitted components, retries and recorded support. Time and unfamiliar explanation wording do not create ability labels. The original ten core activities remain common reference points. Q11 adds an equation check; P4 records quadratic work or a not-yet-studied response.</p>${decisions.length?`<ol class="adaptive-path">${decisions.map(d=>{const r=state.records[d.id];return `<li><strong>${esc(titles[d.anchor])} → ${esc(titles[d.id])}</strong><p>${esc(d.reason)} ${!r||r.complete===null?'This check is not yet submitted.':r.skip?'This check was skipped; evidence is missing.':r.score?.correct?'The new answer components matched.':'The new components need another check.'}</p></li>`;}).join('')}</ol>`:'<p>No tailored check has been selected yet. Continue from a saved core activity to collect a next check.</p>'}<p>This is an experimental branching policy, not a validated mastery estimate. The record keeps the source submission and selected variant for review.</p></article>`;
  }
  const reviewMessage=k=>reviewMessages[k]??'A reviewer should check the meaning.';
  function renderReport({keepPosition=false}={}){
    const scrollY=window.scrollY??0;
    const all=state.queue.map(id=>state.records[id]).filter(Boolean),texts=all.filter(r=>(r.complete!==null||integrated.handles(r.id)&&r.attempts.length&&r.reason)&&Object.prototype.hasOwnProperty.call(r.answer??{},'why'));
    const insight=findings().map(f=>`<div class="evidence insight"><span class="badge">Evidence: ${f.ids.map(esc).join(' · ')||'Missing work'}</span><h3>${esc(f.title)}</h3><p>${esc(f.evidence)}</p><p><span class="label">Try next</span> ${esc(f.action)}</p><p><span class="label">Confirm with</span> ${esc(f.check)}</p></div>`).join('');
    const reasonCards=texts.map(r=>{
      const q=r.reason,review=r.verifiedReason,draft=state.reviewDrafts[r.id]??{credit:review?.points==null?'':String(review.points),note:review?.note??''},score=review?`Reviewed: ${review.points===null?'Still open':review.points+'/2'}`:r.skip?'Skipped · partial work retained':q?.reviewReasons?.includes('missing_explanation')?'No explanation entered':q?.reviewReasons?.some(x=>x==='answer_explanation_conflict'||x==='internal_contradiction')?'Comparison needs a second look':r.reason?.method==='structured_boundary_checks_bs02'?'Budget boundary checks recorded':'Meaning needs review';
      return `<div class="evidence"><h3>${esc(r.id)} · ${esc(titles[r.id])}</h3><div class="reason-status ${review?(review.points===null?'review':''):q?.status==='Needs review'?'review':''}">${esc(score)}</div><p>${review?.points===2?'A local reviewer recorded evidence for the key connection.':'Your reasoning is retained; its meaning is not automatically assessed.'}</p>${r.reasonSource?`<p>${esc(r.reasonSource)}</p>`:""}${r.skip?'<p>Skipped; partial text is preserved.</p>':''}${review?`<details><summary>Earlier detector record</summary><p>Pattern candidates remain in the JSON record for audit. They are not confirmed understanding grades. Your local review is shown above.</p></details>`:q?.reviewReasons?.length?`<p>Check: ${q.reviewReasons.map(x=>esc(reviewMessage(x))).join(' ')}.</p>`:'<p>The detected reason is provisional and remains open to review.</p>'}<div class="quote"><span class="field-label">Your explanation</span>${r.answer.reason?`<p>Chosen reason: ${esc(integrated.reasonText(r.id,r.answer.reason))}</p>`:''}${r.answer.why?esc(r.answer.why):r.reasonSource?esc(r.reasonSource):'No explanation entered.'}</div>${review?`<p>Reviewer note: ${esc(review.note)}</p>`:''}<p class="help">${esc(feedbackText(r))}</p><details><summary>Example reasoning · other valid approaches are welcome</summary><ul>${explanationAnchors(r.id).map(a=>`<li>${esc(a)}</li>`).join('')}</ul></details>${state.reviewMode?`<form data-review="${esc(r.id)}"><label class="field-label">Core reason credit <select name="credit"><option value=""${draft.credit===''?' selected':''}>Leave open</option>${[0,1,2].map(v=>`<option value="${v}"${draft.credit===String(v)?' selected':''}>${v}/2</option>`).join('')}</select></label><label class="field-label">Review note<textarea name="note" maxlength="1200" required placeholder="Explain the scoring decision or what still needs confirmation.">${esc(draft.note)}</textarea></label><p class="validation" data-review-error role="alert"></p><button type="submit" class="secondary">Save local review</button><p role="status">${esc(state.reviewMessages[r.id]??'')}</p></form>`:''}</div>`;
    }).join('');
    const objective=all.map(r=>{const conditional=r.conditionalAtSubmission;return `<details><summary>${esc(r.id)} · ${esc(titles[r.id])} · ${r.complete===null?r.attempts.length?r.score?'Latest try needs checking':'Revision not yet submitted':'Not submitted':r.skip?'Skipped · missing evidence':r.score?.correct?'Answer components match':'Check these components'}</summary><p>${r.complete!==null?esc(answers[r.id]):"Save your answer before viewing its comparison."}</p>${(r.complete!==null&&r.supportAtSubmission?.hint_ids.length||integrated.handles(r.id)&&r.attempts.length>1)?`${r.supportAtSubmission?.hint_ids.length?`<p class="supported-note">Support seen before this submission: ${esc(r.supportAtSubmission.hint_ids.join(', '))}. This is supported work. Opening a visual alone does not establish that it was needed.</p>`:''}<details class="attempt-history"><summary>Submissions and support available at each save</summary><ol>${r.attempts.map((attempt,i)=>`<li><strong>Submission ${i+1}</strong> · ${(attempt.support?.hint_ids.length??attempt.hintsShown)?'With support available':'Before visual support'} · ${attempt.score.correct?'Answer components match':'Some components need checking'}<p>${Object.entries(attempt.answer).filter(([key])=>key!=='why').map(([key,v])=>`${esc(componentLabel(r.id,key))}: ${esc(v)}`).join('; ')}</p></li>`).join('')}</ol></details>`:""}${r.complete!==null&&r.score?`<ul>${Object.entries(r.score.parts).map(([key,correct])=>`<li>${esc(componentLabel(r.id,key))}: ${esc(integrated.handles(r.id)?JSON.stringify(integrated.componentEvidence(r.id,key,r.answer).observed):r.answer[key]??'derived check')} · ${correct?'matches':'needs another look'}</li>`).join('')}</ul>`:''}${conditional?`<p>Under the S1 model you used for this submission: ${Object.entries(conditional).map(([key,v])=>`${esc(componentLabel(r.id,key))} ${v.correct?'computed consistently':'needs an arithmetic check'}`).join('; ')}. This does not establish a correct real-world model.</p>`:''}</details>`}).join('');
    app.innerHTML=`<section class="report-head"><div class="eyebrow">Your session snapshot</div><h1>What your work shows.</h1><p>Look at the evidence, then choose one useful next step. These are observations from this session, not permanent labels.</p><div class="report-actions"><button class="primary" id="return-work">Return to activities</button><button class="secondary" id="print">Print / save as PDF</button><button class="secondary" id="review-mode" aria-expanded="${state.reviewMode}" aria-controls="explanation-review">${state.reviewMode?'Hide review controls':'Review explanations'}</button><button class="secondary" id="download">Download session record</button><button class="ghost" id="restart">Start a new session</button></div><p id="report-status" class="report-status" role="status" hidden></p><p class="help report-export-help">If printing is blocked, <button type="button" class="text-button" id="download-printable">Download printable report</button> and open the file in your browser.</p></section><dialog id="restart-dialog" aria-labelledby="restart-title"><h2 id="restart-title">Start a new session?</h2><p>This clears the current answers and review notes from this tab. Download your record first if you want to keep it.</p><div class="report-actions"><button type="button" class="secondary" id="keep-report">Keep this report</button><button type="button" class="secondary" id="download-before-restart">Download record first</button><button type="button" class="primary" id="confirm-restart">Start new session</button></div><p id="restart-status" role="status"></p></dialog><div class="report-grid"><div><article class="card report-card"><h2>Specific findings and next checks</h2><div class="evidence-list">${insight}</div></article><article class="card report-card" id="explanation-review"><h2 id="review-heading" tabindex="-1">Explanation review</h2><p>A short reason or a clear calculation can show the key idea. Missing text, unfamiliar wording, and conflicting claims have different statuses. Written explanations are not automatically given understanding credit. Review whether the claim answers this question, whether the steps follow from the stated conditions, and whether the conclusion is justified. Ask a targeted follow-up when evidence is missing or ambiguous. A concise equation, diagram or different valid method can be enough; keywords and answer length are not proof. This website does not call an AI grading model.</p><div class="evidence-list">${reasonCards||'<p>No explanations were recorded.</p>'}</div></article>${adaptivePathReview()}${quadraticPathReview()}${visualSupportReview(all)}<article class="card report-card answer-key"><h2>Component and answer review</h2><p>All sports-day steps share one situation. Repeated answers and dependent errors are not separate ability findings.</p>${objective}</article></div><aside><article class="card report-card"><h2>This session</h2><p>${all.reduce((n,r)=>n+r.attempts.length,0)} submitted attempts recorded, including retries.</p><p>${all.filter(r=>r.complete!==null&&!r.skip).length} submitted · ${all.filter(r=>r.skip).length} skipped · ${state.queue.filter(id=>state.records[id]?.complete==null).length} not yet submitted</p><p>Time on activities: ${elapsed(all.reduce((n,r)=>n+activityTime(r),0))}. Interruptions affect this time; it does not measure effort or ability.</p><div class="small-divider"></div>${all.map(r=>`<p><span class="label">${esc(r.id)}</span> ${r.complete===null?'Not submitted':r.skip?'Skipped':`${r.attempts.length} ${r.attempts.length===1?'try':'tries'}`} · ${elapsed(activityTime(r))}${r.hints.length?` · ${r.hints.length} hint(s)`:''}</p>`).join('')}</article><article class="card report-card"><h2>What remains uncertain</h2><p>The token-bag follow-up offers a different representation, but transfer still needs more evidence. Supplied-model follow-ups check arithmetic with support. The sports graph uses your values at supplied inputs, so it is supported plotting.</p><p>Suggestions need confirmation in new work. We have not measured learning gains or established a reliable semantic grader.</p><p>Your progress is saved in this browser when saving is available. Opening this report keeps a separate report copy. Download or print a copy for another device or AI tutor. Local reviews are included in the saved report.</p></article></aside></div>`;
    document.querySelector('#return-work').onclick=()=>goto(state.index);
    document.querySelector('#print').onclick=printReport;
    document.querySelector('#download-printable').onclick=downloadPrintable;
    document.querySelector('#review-mode').onclick=()=>{
      preserveReviewDrafts();state.reviewMode=!state.reviewMode;renderReport({keepPosition:true});
      if(state.reviewMode){const heading=document.querySelector('#review-heading');heading.scrollIntoView({behavior:'smooth',block:'start'});heading.focus({preventScroll:true});}
    };
    document.querySelectorAll('[data-review]').forEach(form=>form.onsubmit=e=>{
      e.preventDefault();preserveReviewDrafts();
      const id=form.dataset.review,value=form.elements.credit.value,note=form.elements.note.value.trim(),error=form.querySelector('[data-review-error]');
      if(!['','0','1','2'].includes(value)||!note||note.length>1200){error.textContent='Choose a credit value and add a review note before saving.';return;}
      const points=value===''?null:Number(value),decision={event_id:state.records[id].lastEventId,item_id:id,rubric_version:integrated.handles(id)?'sketch-central-reasons-0.5':state.records[id].taskSnapshot?'adaptive-anchors-0.4.1':'0.4-conservative-2',points,max:2,note,source:'local_reviewer',at_ms:clock()};
      state.reviewed.push(decision);state.records[id].verifiedReason=decision;delete state.reviewDrafts[id];state.reviewMessages[id]='Review saved for this session. Download the record to keep a copy.';
      renderReport({keepPosition:true});const saved=document.querySelector(`[data-review="${id}"] button[type="submit"]`);if(saved)saved.focus({preventScroll:true});
    });
    document.querySelector('#download').onclick=downloadSession;
    const dialog=document.querySelector('#restart-dialog');
    document.querySelector('#restart').onclick=()=>{preserveReviewDrafts();dialog.showModal();};
    document.querySelector('#keep-report').onclick=()=>dialog.close();
    document.querySelector('#download-before-restart').onclick=downloadSession;
    document.querySelector('#confirm-restart').onclick=()=>{dialog.close();resetSession();};
    saveProgress();
    if(window.QuidenceReportStore){const saved=window.QuidenceReportStore.save('aa01',{...sessionExport(),reportText:app.innerText||app.textContent||'',taskContext:Object.values(state.records).map(r=>({id:r.id,title:titles[r.id],reasonAnchors:explanationAnchors(r.id),reference:r.complete!==null?answers[r.id]:null,prompt:r.questionSnapshot?.prompt??questionContext(r.id).prompt}))},state.sessionId);window.QuidenceReportStore.appendNotice(app,saved);}
    window.scrollTo({top:keepPosition?scrollY:0,behavior:keepPosition?'auto':'smooth'});
  }

  function registerPageTools() {
    const ctx=document.modelContext;if(!ctx?.registerTool)return;const lifecycle=new AbortController();window.addEventListener?.('pagehide',()=>lifecycle.abort(),{once:true});
    const add=tool=>{try{Promise.resolve(ctx.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}};
    add({name:"read_quidence_session",title:"Read Quidence session",description:"Read the current activity and session phase without changing answers.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({phase:state.phase,activityId:state.phase==="assessment"&&!state.quadraticGate?current():null,title:state.phase==="assessment"?titles[current()]:null,completed:Object.keys(state.records).filter(id=>state.records[id].complete!==null).length,total:state.queue.length})});
    add({name:"start_quidence_session",title:"Start Quidence session",description:"Open the first activity when no submitted answer exists. The page already opens on the first activity.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:()=>{if(Object.values(state.records).some(r=>r.attempts.length||r.skip))throw Error("Session has already started.");goto(0);return {phase:state.phase,activityId:current()}}});
    add({name:"submit_quidence_answer",title:"Submit Quidence answer",description:"Submit all fields for the current activity, using the same scoring and feedback as the visible Save or Check button. Numeric values may be signed.",inputSchema:{type:"object",properties:{activityId:{type:"string"},answer:{type:"object"}},required:["activityId","answer"],additionalProperties:false},annotations:{readOnlyHint:false},execute:({activityId,answer})=>{if(state.quadraticGate||state.phase!=="assessment"||activityId!==current()||state.records[activityId]?.complete!==null&&state.records[activityId]?.complete!==undefined)throw Error("Activity is not open.");if(!answer||typeof answer!=="object"||Array.isArray(answer)||check(activityId,answer).missing.length)throw Error("Answer is missing a required field.");submit(answer);const r=state.records[activityId];return {activityId,accepted:true,complete:r.complete!==null,objectiveCorrect:r.feedback==="immediate"?(r.score?.correct??false):null,feedbackMode:r.feedback}}});
    add({name:"skip_quidence_activity",title:"Skip Quidence activity",description:"Mark the current activity as missing evidence and move to the next.",inputSchema:{type:"object",properties:{activityId:{type:"string"}},required:["activityId"],additionalProperties:false},annotations:{readOnlyHint:false},execute:({activityId})=>{if(state.quadraticGate||state.phase!=="assessment"||activityId!==current()||state.records[activityId]?.complete!==null&&state.records[activityId]?.complete!==undefined)throw Error("Activity is not open.");document.querySelector("#skip").click();return {phase:state.phase,nextActivityId:state.phase==="assessment"?current():null}}});
    add({name:"continue_quidence_session",title:"Continue Quidence session",description:"After a correct warm-up or saved answer, show the next activity or final report.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:()=>{if(state.quadraticGate||state.phase!=="assessment"||state.records[current()]?.complete===null)throw Error("Complete or skip the current activity first.");advance();return {phase:state.phase,activityId:state.phase==="assessment"&&!state.quadraticGate?current():null}}});
  }
  restoreProgress();
  app.addEventListener('input',scheduleSave);
  app.addEventListener('change',scheduleSave);
  app.addEventListener('click',scheduleSave);
  window.addEventListener?.('pagehide',saveProgress);
  window.addEventListener?.('blur',saveProgress);
  document.addEventListener?.('visibilitychange',()=>{if(document.hidden)saveProgress();});
  registerPageTools();
  if(savingBlocked){
    app.innerHTML=`<section class="card"><h1>Your saved progress needs attention.</h1><p>${esc(savedNotice)}</p><div class="actions"><button id="recover-download" class="secondary">Download saved progress</button><button id="recover-replace" class="primary">Start a new session</button></div></section>`;
    document.querySelector('#recover-download').onclick=()=>downloadFile((window.QuidenceStorage||window.localStorage).getItem(sessionStore.KEY),'application/json','Quidence_Algebra_Unreadable_Progress.json');
    document.querySelector('#recover-replace').onclick=()=>{savingBlocked=false;resetSession();};
  }else if(state.phase==='report')renderReport();else if(state.quadraticGate)renderQuadraticGate();else renderQuestion();
})();
