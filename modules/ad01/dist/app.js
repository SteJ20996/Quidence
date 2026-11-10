(function(){
'use strict';
const C=window.AD01Content,E=window.AD01Engine,M=window.AD01Math,G=window.AD01Graphs;
const app=document.getElementById('app'),KEY=E.SCHEMA;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Authored mathematics only: an upper limit of infinity is written ^∞ and shown as a superscript.
const math=x=>esc(x).replace(/\^∞/g,'<sup>∞</sup>');
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
function nav(){return`<nav class="lesson-nav" aria-label="Calculus lessons">${button('home','Start here','quiet')}${C.LESSONS.map((l,i)=>`<button class="lesson-link ${state.view==='lesson'&&state.lessonIndex===i?'active':''}" data-action="open" data-index="${i}" ${state.view==='lesson'&&state.lessonIndex===i?'aria-current="page"':''}><span class="lesson-number">${E.lessonDone(state,i)?'✓':i+1}</span>${esc(l.short)}</button>`).join('')}${button('summary','My summary','quiet',E.allDone(state)?'':'disabled')}</nav>`;}
function phases(){return`<ol class="phase-path" aria-label="Current lesson phases">${[['predict','First thought'],['learn','Explore & learn'],['check','Fresh questions'],['review','Feedback']].map(([id,name])=>`<li class="${state.stage===id?'current':''}" ${state.stage===id?'aria-current="step"':''}>${name}</li>`).join('')}</ol>`;}
function orientation(){return`<section class="hero"><p class="eyebrow">CALCULUS · FIVE CONNECTED IDEAS</p><h1>See the change.<br>See what adds up.</h1><p class="lead">Move a point, shrink an interval, and build an area. Connect each picture to numbers and a formula, then try the idea in a new situation.</p><div class="actions">${button('start',Object.keys(state.records).length?'Resume learning →':'Start exploring →','primary')}<span class="tiny">Know coordinates and the slope of a line? You can start here.</span></div><p><a class="q-link-button" href="../../af01/dist/" target="_blank" rel="noopener">Need a function or trigonometry review? Explore Pre-calculus →</a></p><div class="calculus-hero-art" aria-hidden="true"><svg viewBox="0 0 340 215"><path d="M25 170h285M65 195V25" fill="none" stroke="#c9c2e0" stroke-width="2"/><path d="M70 159l25-17v28H70zm25-17 25-22v50H95zm25-22 25-26v76h-25zm25-26 25-31v107h-25z" fill="#b7e3d8"/><path d="M36 171Q150 170 265 32" fill="none" stroke="#6542c0" stroke-width="4"/><path d="M130 160l111-130" stroke="#087f76" stroke-width="3"/><circle cx="179" cy="103" r="6" fill="#6542c0"/><text x="210" y="180" fill="#6542c0" font-size="15">change + accumulation</text></svg></div></section><section class="orientation-grid"><article class="card"><p class="eyebrow">HOW IT WORKS</p><h2>Predict. Move. Explain.</h2><ol class="simple-list"><li>Save a first thought. “I’m not sure” is welcome.</li><li>Explore four short steps with graphs and sliders.</li><li>Answer two new questions, then review feedback.</li></ol><p class="muted">The graphs have text descriptions and numerical readouts. Every control works with a keyboard. Explanations are optional and kept for review.</p></article><article class="card"><p class="eyebrow">WHAT YOU’LL CONNECT</p><h2>From nearby values to accumulation.</h2><ul class="topic-list">${C.LESSONS.map((l,i)=>`<li><span>${i+1}</span><div>${esc(l.short)}<small>${esc(l.goal)}</small></div></li>`).join('')}</ul></article></section><p class="privacy-note">A first look at single-variable calculus. No sign-up needed. Your progress and answers stay in this browser; export them after all five lessons.</p>`;}
function taskHtml(t){
 const r=E.record(state,t.id),pre=state.stage==='predict';
 return`<section class="card task-card"><p class="eyebrow">${pre?'BEFORE THIS LESSON':`NEW SITUATION · QUESTION ${state.questionIndex+1} OF 2`}</p><h2>${pre?'What do you think?':'Try the idea yourself.'}</h2><p class="muted">${pre?'Save a first prediction before the explanation. Feedback comes after the two new questions.':'Use this new graph. Save both answers before seeing feedback.'}</p><div class="task-layout"><div class="task-stimulus">${G.task(t.graph)}</div><form id="answer-form"><fieldset><legend>${math(t.prompt)}</legend><div class="answer-options">${t.options.concat({id:'unsure',label:'I’m not sure yet'}).map(o=>`<label class="answer-option"><input type="radio" name="choice" value="${o.id}" ${r.draft.choices.includes(o.id)?'checked':''}><span>${math(o.label)}</span></label>`).join('')}</div></fieldset><label class="explanation-label" for="explanation">Explain your thinking <span class="tiny">(optional; saved for review)</span></label><p class="review-text">Equations, calculations, or a short explanation are welcome. Your reasoning helps us build a clearer report about what this work shows and what still needs checking. Quidence saves your reasoning for a teacher or tutor to review. A reviewer should judge the mathematics, not grammar, keywords or answer length.</p><textarea id="explanation" name="explanation" rows="3" maxlength="3000" placeholder="What do you see in the graph?">${esc(r.draft.explanation)}</textarea><label class="help-label"><input type="checkbox" name="otherHelp" ${r.draft.otherHelp?'checked':''}> I used other help on this question.</label><div class="actions"><button type="submit" class="btn primary">${r.submissions.length?'Save this answer':'Save my answer'}</button>${button('next',pre?'Explore the idea →':state.questionIndex===0?'Next question →':'See the feedback →','',r.status==='submitted'?'':'disabled')}</div><p id="answer-status" class="status" role="status">${esc(notice||(r.status==='submitted'?'Answer saved. Continue when you are ready.':''))}</p></form></div></section>`;
}
function select(name,label,options,value){return`<label class="control-label" for="lab-${name}">${label}<select id="lab-${name}" data-lab="${name}">${options.map(([v,t])=>`<option value="${v}" ${String(value)===String(v)?'selected':''}>${t}</option>`).join('')}</select></label>`;}
function slider(name,label,min,max,inc,value){return`<label class="control-label" for="lab-${name}">${label}<span class="range-row"><input id="lab-${name}" data-lab="${name}" type="range" min="${min}" max="${max}" step="${inc}" value="${value}"><output id="out-${name}" for="lab-${name}">${value}</output></span></label>`;}
function controls(){
 const l=state.labs[state.lessonIndex],side=select('side','Approach direction',[[-1,'From the left (h < 0)'],[1,'From the right (h > 0)']],l.side);
 if(state.lessonIndex===0)return select('kind','Example',[['hole','A hole: near 1, f(1) = 4'],['jump','A jump at 0'],['wiggle','A wiggle: x·sin(1/x) near 0'],['nines','The decimals 0.9, 0.99, 0.999, …']],l.kind)+(l.kind==='nines'?slider('digits','Number of nines n',1,12,1,l.digits):slider('exponent','Log₁₀ of distance |x − target|',-2.3,-.3,.05,l.exponent)+side)+`<label class="help-label"><input type="checkbox" id="lab-showBand" data-lab="showBand" ${l.showBand?'checked':''}> Show an error band</label>`+(l.showBand?slider('band','Log₁₀ of the band’s half-width',-3,0,.05,l.band):'');
 if(state.lessonIndex===1)return select('kind','Curve',[['square','f(x) = x²'],['absolute','f(x) = |x|']],l.kind)+slider('a','First point a',-2,2,.05,l.a)+slider('h','Distance |h| between the two x-values',.001,1,.001,l.h)+side+`<label class="help-label"><input type="checkbox" id="lab-showDerivative" data-lab="showDerivative" ${l.showDerivative?'checked':''}> Also show the derivative graph</label>`;
 if(state.lessonIndex===2)return select('kind','Curve and starting point',[['square','Positive curve: x², starting at 0'],['linear','Signed example: x, starting at −2']],l.kind)+slider('b','Right endpoint b',.25,2,.05,l.b)+slider('n','Number of equal-width rectangles n',2,64,2,l.n)+select('method','Sample each rectangle at',[['left','Left endpoint'],['midpoint','Midpoint'],['right','Right endpoint']],l.method);
 if(state.lessonIndex===4)return select('kind','Kind of integral',[['family','Indefinite: the family x² + C'],['tail','Improper: an endless region from 1 to ∞']],l.kind)+(l.kind==='family'?slider('c','Constant C',-2,2,.1,l.c):select('fn','Curve',[['inverse-square','f(x) = 1/x²'],['inverse','f(x) = 1/x']],l.fn)+slider('e','Log₁₀ of the right end b',0,3,.05,l.e));
 return slider('x','Accumulation endpoint x',-2,2,.05,l.x)+slider('h','Width |h| of the new interval',.02,1,.02,l.h)+side;
}
function formula(){return[
 {hole:'limₓ→₁ f(x) = 2, while f(1) = 4',jump:'limₓ→₀⁻ f(x) = −1 ≠ 1 = limₓ→₀⁺ f(x)',wiggle:'−|x| ≤ x·sin(1/x) ≤ |x|, so limₓ→₀ x·sin(1/x) = 0',nines:'0.999… = limₙ→∞ (1 − 10⁻ⁿ) = 1'}[state.labs[0].kind],
 'f′(a) = limₕ→₀ [f(a + h) − f(a)] / h',
 '∫ₐᵇ f(x) dx = limₙ→∞ Σᵢ₌₁ⁿ f(xᵢ) Δx',
 'A(x) = ∫₀ˣ f(t) dt   →   A′(x) = f(x)',
 state.labs[4].kind==='family'?'∫ 2x dx = x² + C,   because (x² + C)′ = 2x':state.labs[4].fn==='inverse-square'?'∫₁^∞ 1/x² dx = limit of (1 − 1/b) as b → ∞, which is 1':'∫₁^∞ 1/x dx: ln b grows without bound as b → ∞, so the integral diverges'
 ][state.lessonIndex];}
// Lesson 5: the four kinds of integral side by side, each opening its own picture.
function kindsCard(){
 const art={definite:'<path d="M8 44h64" stroke="#99a7bc"/><path d="M18 44V27q12-14 22-12t22 10V44z" fill="#b7e3d8"/><path d="M10 34q14-26 30-19t32 14" fill="none" stroke="#6542c0" stroke-width="2.5"/>',accumulation:'<path d="M8 44h64" stroke="#99a7bc"/><path d="M14 44V30q10-12 20-12t12 3V44z" fill="#b7e3d8"/><path d="M10 34q14-26 30-19t32 14" fill="none" stroke="#6542c0" stroke-width="2.5"/><path d="M46 12v34" stroke="#087f76" stroke-width="2"/><path d="M46 8l-4 6h8z" fill="#087f76"/>',family:'<path d="M10 40q20-36 30 0t30 0" fill="none" stroke="#c6cbd8" stroke-width="2"/><path d="M10 30q20-36 30 0t30 0" fill="none" stroke="#6542c0" stroke-width="2.5"/><path d="M10 20q20-36 30 0t30 0" fill="none" stroke="#c6cbd8" stroke-width="2"/>',improper:'<path d="M8 44h64" stroke="#99a7bc"/><path d="M16 44V12q6 18 18 25t32 6V44z" fill="#b7e3d8"/><path d="M14 6q6 22 20 31t36 6" fill="none" stroke="#6542c0" stroke-width="2.5"/><path d="M62 47h10m-4-3 4 3-4 3" stroke="#087f76" fill="none" stroke-width="2"/>'};
 const tiles=[['definite','∫ₐᵇ f(x) dx','A number: the signed area from a to b.','open','2','Open lesson 3'],['accumulation','∫ₐˣ f(t) dt','A function of x: the accumulation function.','open','3','Open lesson 4'],['family','∫ f(x) dx = F(x) + C','A family of functions: every antiderivative.','kinds-view','family','Show the family'],['improper','∫ₐ^∞ f(x) dx','Defined by a limit: a number when ∫ₐᵇ f(x) dx has a limit as b → ∞.','kinds-view','tail','Show the endless region']];
 const current=state.labs[4].kind==='family'?'family':'improper';
 return`<div class="kinds-card" role="group" aria-label="Four kinds of integral">${tiles.map(([id,symbol,gives,action,arg,label])=>`<div class="kinds-tile ${id===current?'active':''}"><svg viewBox="0 0 80 52" aria-hidden="true">${art[id]}</svg><p class="kinds-symbol">${math(symbol)}</p><p class="kinds-gives">${math(gives)}</p><button type="button" class="btn quiet small" data-action="${action}" ${action==='open'?'data-index':'data-kind'}="${arg}" ${id===current?'aria-pressed="true"':''}>${esc(label)}</button></div>`).join('')}</div>`;
}
function explorer(){return`<article class="card explorer"><p class="eyebrow">MOVE · COMPARE · EXPLAIN</p><h2>Try it on the graph.</h2>${state.lessonIndex===4?kindsCard():''}<div class="lab-controls">${controls()}</div><div class="motion-controls"><button type="button" class="btn primary" id="play-motion" data-action="play-motion" aria-pressed="false">Play animation</button><p id="motion-note" class="tiny" role="status">Watch the change, then pause or use the controls.</p></div><div id="live-readout" class="lab-readout" role="status" aria-live="polite" aria-atomic="true"></div><div id="lab-graphs"></div><p class="graph-legend"><span class="legend-item curve">${state.lessonIndex===0&&state.labs[0].kind==='nines'?'● Terms 0.9, 0.99, …':'● Function'}</span>${state.lessonIndex===0&&state.labs[0].showBand?'<span class="legend-item tangent">▧ Error band</span>'+(state.labs[0].kind==='hole'||state.labs[0].kind==='wiggle'?'<span class="legend-item secant">▧ Window that works</span>':state.labs[0].kind==='nines'?'<span class="legend-item tangent">● Terms inside the band</span>':''):''}${state.lessonIndex===1||state.lessonIndex===3?'<span class="legend-item secant">┄ Secant</span><span class="legend-item tangent">— Tangent</span>':''}${state.lessonIndex===2||state.lessonIndex===3?'<span class="legend-item tangent">▧ Positive contribution</span><span class="legend-item secant">▧ Negative contribution</span>':state.lessonIndex===4?(state.labs[4].kind==='family'?'<span class="legend-item tangent">— Common slope at x = 1</span>':'<span class="legend-item tangent">▧ Area from 1 to b</span>'):''}</p><div id="lab-formula" class="formula-box">${math(formula())}</div><p class="tiny">${state.lessonIndex===0?(state.labs[0].kind==='nines'?'The slider sets how many nines are written. There is no last nine: 0.999… names the limit of the list, which is exactly 1. An infinitely small but positive gap is a natural picture, but the real numbers used in calculus contain no such number.':'The distance slider uses a logarithmic scale. Each step changes the distance proportionally.')+(state.labs[0].showBand?` The band slider is logarithmic${state.labs[0].kind==='nines'?'':' too'}, from ±1 down to ±0.001. Inside means strictly inside: the edge does not count.`:''):state.lessonIndex===2?'n equal-width rectangles; increasing n makes each width smaller.':state.lessonIndex===4?(state.labs[4].kind==='family'?'C slides the curve up or down without changing its slope at any x, so the derivative alone cannot recover C.':'The b slider uses a logarithmic scale, from b = 1 to b = 1,000. A finite b only suggests the limit; the formula decides it.'):'Sliders show finite steps. A limit requires reasoning about arbitrarily small nonzero steps.'} Controls explore the example; they do not submit an answer.</p>${button('reset-lab','Reset this graph','quiet small')}</article>`;}
function learnHtml(){
 const l=lesson();
 if(!state.lessons[state.lessonIndex].seenSteps.includes(step)){state.lessons[state.lessonIndex].seenSteps.push(step);E.log(state,'lesson_step_viewed',{lesson:l.id,step});}
 return`<section class="learning-grid"><article class="card lesson-copy"><p class="eyebrow">STEP ${step+1} OF 4</p><div class="step-tabs" aria-label="Worked lesson steps">${l.steps.map((_,i)=>`<button data-action="step" data-index="${i}" class="step-dot ${step===i?'active':''}" aria-label="Read step ${i+1}" ${step===i?'aria-current="step"':''}>${i+1}</button>`).join('')}</div><h2>${math(l.steps[step].title)}</h2><p class="lesson-text">${math(l.steps[step].text)}</p><div class="try-note"><h3>Try this</h3><p>${math(l.steps[step].try)}</p></div><div class="actions">${button('prev-step','← Previous','quiet',step===0?'disabled':'')}${button('next-step',step<3?'Next step →':'Try fresh questions →','primary',step===3&&state.lessons[state.lessonIndex].seenSteps.length<4?'disabled':'')}</div><p class="tiny">${state.lessons[state.lessonIndex].seenSteps.length} of 4 steps opened. Take time to compare the graphs.</p></article>${explorer()}</section>`;
}
function motionSpec(){
 const index=state.lessonIndex,l=state.labs[index];
 if(index===0)return l.kind==='nines'?{key:'digits',start:l.digits,end:12,replay:1}:{key:'exponent',start:l.exponent,end:-2.3,replay:-.3};
 if(index===1)return{key:'h',start:l.h,end:.001,replay:1};
 if(index===2)return{key:'n',start:l.n,end:64,replay:4};
 if(index===4)return l.kind==='family'?{key:'c',start:l.c,end:2,replay:-2}:{key:'e',start:l.e,end:3,replay:0};
 return{key:'x',start:l.x,end:2,replay:-2};
}
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
 if(spec.key==='n')value=Math.max(2,Math.min(64,2*Math.round(value/2)));
 else if(spec.key==='digits')value=Math.max(1,Math.min(12,Math.round(value)));
 else if(spec.key==='h')value=Math.max(.001,Math.min(1,value));
 state.labs[state.lessonIndex][spec.key]=value;
 const input=document.getElementById('lab-'+spec.key);if(input)input.value=String(value);
 updateExplorer();
}
function playMotion(){
 if(motion){stopMotion('paused');return;}
 if(blocked||state.view!=='lesson'||state.stage!=='learn')return;
 const spec=motionSpec();if(Math.abs(spec.start-spec.end)<.00001)spec.start=spec.replay;
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
 const l=state.labs[state.lessonIndex],f=G.fmt;
 let graph='',readout='';
 if(state.lessonIndex===0){const eps=l.showBand?10**l.band:null;
  if(l.kind==='nines'){const n=l.digits;graph=G.limits('nines',n,1,eps);readout=`${n} ${n===1?'nine':'nines'}: 0.${'9'.repeat(n)} · gap to 1 = 0.${'0'.repeat(n-1)}1`+(eps===null?'':` · inside the band 1 ± ${f(eps)} from n = ${M.ninesInside(eps)} on`);}
  else{const d=10**l.exponent,info=M.LIMITS[l.kind],x=info.target+l.side*d,y=M.limitValue(l.kind,x);graph=G.limits(l.kind,d,l.side,eps);readout=`Distance = ${f(d)} · x = ${f(x)} · f(x) = ${f(y)} · `+(info.value===null?`f(${info.target}) is undefined`:`f(${info.target}) = ${info.value}`)+(eps===null?'':info.limit===null?` · band 0 ± ${f(eps)}, a trial centre: −1 and 1 never both fit, whatever the centre, so no window works`:` · band ${info.limit} ± ${f(eps)}: every x ≠ ${info.target} within ${f(M.bandWindow(l.kind,eps))} of ${info.target} keeps f(x) inside`);}}
 if(state.lessonIndex===1){const h=l.side*l.h,m=M.secant(l.kind,l.a,h),t=M.FUNCTIONS[l.kind].derivative(l.a);graph=G.derivative(l.kind,l.a,h,l.showDerivative);readout=`h = ${f(h)} · Δy/Δx = ${f(m)} · f′(${f(l.a)}) = ${t===null?'undefined':f(t)}`;}
 if(state.lessonIndex===2){const a=l.kind==='square'?0:-2,r=M.riemann(l.kind,a,l.b,l.n,l.method),exact=M.integral(l.kind,a,l.b);graph=G.integral(l.kind,l.b,l.n,l.method);readout=`Δx = ${f(r.width)} · Rectangle sum = ${f(r.sum)} · Signed integral = ${f(exact)} · |error| = ${f(Math.abs(r.sum-exact))} · Total area = ${f(M.totalArea(l.kind,a,l.b))}`;}
 if(state.lessonIndex===3){const h=l.side*l.h;graph=G.connection(l.x,h);readout=`A(x) = ${f(M.accumulation(l.x))} · ΔA = ${f(M.accumulation(l.x+h)-M.accumulation(l.x))} · h = ${f(h)} · ΔA/h = ${f(M.accumulationSecant(l.x,h))} · A′(x) = f(x) = ${f(M.FUNCTIONS.rate.value(l.x))}`;}
 if(state.lessonIndex===4){if(l.kind==='family'){graph=G.kinds('family',l.c);readout=`C = ${f(l.c)} · x² + C at x = 1: 1 + C = ${f(M.family(1,l.c))} · slope at x = 1: 2 · f(1) = 2`;}else{const b=10**l.e,area=M.tailArea(l.fn,b);graph=G.kinds('tail',0,l.fn,b);readout=`b = ${b>=100?Math.round(b).toLocaleString('en-US'):f(b)} · area from 1 to b = ${f(area)} · `+(l.fn==='inverse-square'?`distance to 1 = 1/b = ${f(1/b)}`:'no ceiling: ln b passes every number');}}
 document.getElementById('lab-graphs').innerHTML=graph;
 document.getElementById('live-readout').textContent=readout;
 const box=document.getElementById('lab-formula');if(box){const text=formula();if(text.includes('^∞'))box.innerHTML=math(text);else box.textContent=text;}
 for(const [name,value]of Object.entries(l)){const out=document.getElementById('out-'+name);if(out)out.textContent=String(value);}
 const range=document.getElementById('lab-exponent');if(range)range.setAttribute('aria-valuetext',`distance ${f(10**l.exponent)}`);
 const bandRange=state.lessonIndex===0&&document.getElementById('lab-band');if(bandRange){bandRange.setAttribute('aria-valuetext',`band ± ${f(10**l.band)}`);const out=document.getElementById('out-band');if(out)out.textContent=`±${f(10**l.band)}`;}
 const right=state.lessonIndex===4&&document.getElementById('lab-e');if(right){const b=10**l.e;right.setAttribute('aria-valuetext',`b = ${b>=100?Math.round(b).toLocaleString('en-US'):f(b)}`);}
 updateMotionButton();
}
const resultLabel=result=>result==='correct'?'Correct on this question':result==='unsure'?'Not sure yet':'Revisit this idea';
function answerText(t,a){return a.choices.map(id=>id==='unsure'?'I’m not sure yet':t.options.find(o=>o.id===id)?.label||id).join('; ');}
function reviewHtml(){
 const l=lesson(),initial=state.records[l.predict.id].submissions[0];
 return`<section class="card review"><p class="eyebrow">LESSON ${state.lessonIndex+1} · FEEDBACK</p><h2>What does your work show?</h2><div class="first-thought"><h3>Your first saved prediction</h3><p>${math(answerText(l.predict,initial.answer))}</p><p class="tiny">${resultLabel(initial.result)}. ${initial.support.lessonSeen?'An earlier lesson visit was recorded before this prediction.':'Saved before opening this lesson.'}</p><p>${math(l.predict.explanation)}</p></div><h3>Fresh questions after instruction</h3>${l.checks.map((t,i)=>{const r=state.records[t.id],s=E.last(state,t.id);return`<article class="feedback-item"><span class="feedback-label ${s.result==='correct'?'correct':'revisit'}">${resultLabel(s.result)}</span><h4>${i+1}. ${math(t.prompt)}</h4><p class="answer-line">Your answer: ${math(answerText(t,s.answer))}</p><p>${math(t.explanation)}</p>${s.answer.explanation?`<p class="written-answer">Your explanation: <span data-no-translate>${esc(s.answer.explanation)}</span></p>`:''}<p class="tiny">${s.support.otherHelp?'Other help was reported. ':''}${s.support.feedbackSeen?'This submission followed earlier feedback. ':''}${r.submissions.length} saved attempt${r.submissions.length===1?'':'s'}; earlier answers remain in your history.</p>${button('revise','Revise this question','quiet small',`data-index="${i}"`)}</article>`;}).join('')}<div class="next-step-note"><h3>A useful next step</h3><p>${math(l.next)}</p></div><p class="tiny">Feedback on these questions, rather than a course grade. Written explanations are saved for human review.</p><div class="actions">${button('relearn','Reopen the lesson','quiet')}${button('continue',E.allDone(state)?'See my summary →':state.lessonIndex<C.LESSONS.length-1?'Continue to the next lesson →':'Visit an unfinished lesson →','primary')}</div></section>`;
}
function summaryHtml(){return`<section class="summary-heading"><p class="eyebrow">YOUR FIVE-LESSON SUMMARY</p><h1>Connect the picture<br>to the mathematics.</h1><p class="lead">First predictions and questions after instruction are separate observations. These activities give you starting points for practice, rather than a complete measure of calculus understanding.</p></section><div class="card"><div class="table-wrap"><table class="summary-table"><thead><tr><th scope="col">Concept</th><th scope="col">First saved prediction</th><th scope="col">Fresh questions</th></tr></thead><tbody>${C.LESSONS.map((l,i)=>`<tr><th scope="row">${esc(l.short)}</th><td>${resultLabel(state.records[l.predict.id].submissions[0].result)}</td><td>${l.checks.map(t=>resultLabel(E.last(state,t.id).result)).join('<br>')}${button('open','View feedback','quiet small',`data-index="${i}"`)}</td></tr>`).join('')}</tbody></table></div><p class="tiny">History includes first attempts, revisions, previous feedback, and self-reported help. Explanations are saved and are not automatically scored.</p><div class="actions">${button('export-json','Download answer history','primary')}${button('export-md','Download readable summary')}${button('print','Print summary','quiet')}</div></div><section class="card next-steps"><h2>Practice the connections</h2><ul>${C.LESSONS.map(l=>`<li>${esc(l.short)}: ${math(l.next)}</li>`).join('')}</ul></section>`;}
function render(focus=false){
 stopMotion('navigation',false);
 if(blocked){app.innerHTML=`<section class="card recovery"><h1>Your saved session needs attention.</h1><p>It could not be read and has been kept unchanged. Download a copy before replacing it.</p><div class="actions">${button('raw','Download saved record','primary')}${button('reset-blocked','Replace with a new session')}</div></section><dialog id="reset-dialog"><h2>Replace the unreadable Calculus record?</h2><p>Download the record first if you want to keep it.</p><div class="actions">${button('cancel-reset','Keep it')}${button('confirm-reset','Replace record','primary')}</div></dialog>`;return;}
 app.innerHTML=nav()+(state.view==='orientation'?orientation():state.view==='summary'?summaryHtml():`<section class="lesson-heading"><p class="eyebrow">LESSON ${state.lessonIndex+1} OF ${C.LESSONS.length}</p><h1>${esc(lesson().title)}</h1><p class="muted">${esc(lesson().goal)}</p>${phases()}</section>`+(state.stage==='learn'?learnHtml():state.stage==='review'?reviewHtml():taskHtml(currentTask())));
 if(state.view==='summary'&&window.QuidenceReportStore){const saved=window.QuidenceReportStore.save('ad01',E.exportRecord(state),state.createdAt);window.QuidenceReportStore.appendNotice(app,saved);}
 const form=document.getElementById('answer-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const t=currentTask();if(E.submit(state,t.id,state.stage)){notice='Answer saved. Continue when you are ready.';save();render();document.querySelector('[data-action="next"]').focus();}else{notice='Choose an answer or “I’m not sure yet,” then save it.';document.getElementById('answer-status').textContent=notice;}});
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
  const name=target.dataset.lab;state.labs[state.lessonIndex][name]=target.type==='checkbox'?target.checked:target.tagName==='SELECT'&&name!=='side'?target.value:Number(target.value);
  if((state.lessonIndex===4&&name==='kind')||(state.lessonIndex===0&&(name==='kind'||name==='showBand'))){render();document.getElementById('lab-'+name)?.focus();save();return;}
  updateExplorer();save();return;
 }
 if(!target.closest('#answer-form'))return;
 const t=currentTask();if(!t)return;const form=document.getElementById('answer-form'),r=E.record(state,t.id);
 E.update(state,t.id,{choices:Array.from(form.querySelectorAll('[name="choice"]:checked')).map(x=>x.value),explanation:form.querySelector('[name="explanation"]').value,otherHelp:form.querySelector('[name="otherHelp"]').checked});
 notice=r.submissions.length?'Edited. Save again before continuing.':'';
 document.getElementById('answer-status').textContent=notice;document.querySelector('[data-action="next"]').disabled=true;save();
});
app.addEventListener('change',event=>{if(event.target.dataset.lab){E.log(state,'graph_explored',{lesson:lesson().id,control:event.target.dataset.lab,settings:{...state.labs[state.lessonIndex]}});save();}});
function download(name,content,mime){if(mime==='text/markdown') content=window.QuidenceI18n?.markdown(content)||content;const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function reportPayload(){return window.QuidenceReportStore.prepare('ad01',E.exportRecord(state),state.createdAt);}
function markdown(){
 let s='# Calculus\n\n'+`Session started: ${state.createdAt}\n\n`+'Initial predictions and checks after instruction are separate observations. Optional explanations need human review.\n\n';
 for(const l of C.LESSONS){s+=`## ${l.short}\n\n`;for(const t of [l.predict,...l.checks]){s+=`### ${t===l.predict?'Initial prediction':'Fresh question'}: ${t.prompt}\n\n`;state.records[t.id].submissions.forEach((r,i)=>{s+=`Attempt ${i+1}: ${answerText(t,r.answer)}\n\nResult: ${resultLabel(r.result)}\n\nSupport: lesson seen=${r.support.lessonSeen}; earlier feedback=${r.support.feedbackSeen}; other help reported=${r.support.otherHelp}\n\n`;if(r.answer.explanation)s+=`Explanation (not automatically scored):\n\n${r.answer.explanation.split('\n').map(line=>'> '+line).join('\n')}\n\n`;});s+=`${t.explanation}\n\n`;}s+=`Next step: ${l.next}\n\n`;}
 return s;
}
app.addEventListener('click',event=>{
 const b=event.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action,i=Number(b.dataset.index);notice='';
 if(action==='raw'){download('Quidence_Calculus_Saved_Record.json',raw,'application/json');return;}
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
 else if(action==='kinds-view'){stopMotion('control',false);state.labs[4].kind=b.dataset.kind==='family'?'family':'tail';E.log(state,'integral_kind_opened',{kind:state.labs[4].kind});render();document.getElementById('lab-kind')?.focus();save();return;}
 else if(action==='reset-lab'){state.labs[state.lessonIndex]=E.defaultLabs()[state.lessonIndex];render();document.getElementById('lab-'+(state.lessonIndex===3?'x':'kind')).focus();return;}
 else if(action==='relearn'){state.stage='learn';step=0;}
 else if(action==='revise'){state.stage='check';state.questionIndex=i;}
 else if(action==='continue'){if(E.allDone(state))state.view='summary';else{const next=state.lessonIndex<C.LESSONS.length-1?state.lessonIndex+1:C.LESSONS.findIndex((_,j)=>!E.lessonDone(state,j));openLesson(next);return;}}
 else if(action==='export-json'){download('Quidence_Calculus_Answer_History.json',JSON.stringify(reportPayload(),null,2),'application/json');return;}
 else if(action==='export-md'){download('Quidence_Calculus_Learning_Summary.md',window.QuidenceReportTools.markdown('Calculus',{...reportPayload(),markdown:markdown()}),'text/markdown');return;}
 else if(action==='print'){try{const ok=window.QuidenceReportTools.openPrint(window.QuidenceReportTools.printable(document.title,{...reportPayload(),markdown:markdown()}));notice=ok?'The report opened in a new tab. Print / save as PDF there.':'Allow pop-ups or download the readable report.';}catch{notice='The report tab could not open. Download the readable report.';}render();return;}
 else return;
 const local=state.stage==='learn'&&['step','prev-step','next-step'].includes(action);
 render(!local);if(local){const h=app.querySelector('h2');h.tabIndex=-1;h.focus();}
});
render();
})();

