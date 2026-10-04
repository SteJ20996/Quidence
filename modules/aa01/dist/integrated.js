(() => {
  'use strict';
  const M=window.ClueveraSketch;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const handles=id=>['C11','QP','QN'].includes(id);
  const functionId=id=>id==='QN'?'negative':'positive';
  function tiles(){return [0,1,2,3].map(i=>`<rect class="tile" x="${35+i%2*80}" y="${45+Math.floor(i/2)*78}" width="62" height="56" rx="5"/><text class="model-big" x="${66+i%2*80}" y="${81+Math.floor(i/2)*78}" text-anchor="middle">x</text>`).join('');}
  function coins(n,startY=45){return Array.from({length:n},(_,i)=>`<circle class="coin" cx="${385+i%3*48}" cy="${startY+Math.floor(i/3)*40}" r="11"/>`).join('');}
  function equationDrawing(stage){
    const removed=stage===0?`<text class="model-big" x="220" y="120">−</text>${[0,1,2].map(i=>`<circle class="removed" cx="270" cy="${65+i*40}" r="11"/>`).join('')}<text class="model-label" x="225" y="220">3 removed units</text>`:'';
    if(stage<2)return `<svg class="equation-model" viewBox="0 0 590 260" role="img" aria-label="${stage===0?'Four equal box contents, with three units removed, equal nine units.':'The full contents of four equal boxes equal twelve units after both sides increase by three.'}">${tiles()}${removed}<text class="model-big" x="325" y="120">=</text>${coins(stage===0?9:12)}<text class="model-label" x="30" y="242">${stage===0?'4 equal boxes, minus 3 units':'Full combined contents restored'}</text><text class="model-label" x="365" y="242">${stage===0?'9 units remaining':'9 + 3 = 12 units'}</text></svg>`;
    return `<svg class="equation-model" viewBox="0 0 590 300" role="img" aria-label="Twelve units split into four equal groups of three, one group for each box.">${tiles()}<text class="model-big" x="285" y="120">=</text>${[0,1,2,3].map(i=>`<rect x="345" y="${22+i*62}" width="174" height="48" rx="7" fill="none" stroke="#2147df"/>${[0,1,2].map(j=>`<circle class="coin" cx="${383+j*48}" cy="${46+i*62}" r="11"/>`).join('')}`).join('')}<text class="model-label" x="30" y="280">Each box gets one equal group.</text><text class="model-label" x="346" y="280">Four groups of three units</text></svg>`;
  }
  function eqGrade(a){
    const operation=a.operation==='add'&&M.close(a.amount,3)||a.operation==='subtract'&&M.close(a.amount,-3);
    const objective=operation&&M.close(a.x,3),raw=a.why??'',t=raw.toLowerCase();
    const contradiction=a.reason==='one-side'||/only (?:one|1) side/.test(t);
    const matched=a.reason==='same-both'||/(?:same|equal).{0,35}(?:both|each|two|2) sides?|both sides.{0,35}(?:same|equal)/.test(t);
    return {correct:objective,parts:{operation,x:M.close(a.x,3)},reason:{status:contradiction?'Needs review':matched?'Provisional central reason matched':raw||a.reason?'Needs review':'Missing explanation',points:matched&&!contradiction?2:null,max:2,raw,anchor:'Adding the same amount to both sides preserves equality; adding 3 cancels the −3.'}};
  }
  function graph(id,a={},compare=false){
    const points=[1,2,3].map(i=>({x:a['x'+i]})).filter(p=>Number.isFinite(p.x)&&Math.abs(p.x)<=50),xs=points.map(p=>p.x),xMin=Math.floor(Math.min(0,...xs))-1,xMax=Math.ceil(Math.max(4,...xs))+1;
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

  const anchors=id=>id==='C11'?['Adding the same amount to both sides preserves equality; adding 3 cancels the −3.','Divide 12 into four equal groups to get x = 3.']:[M.functions[functionId(id)].a>0?'The square is nonnegative and reaches zero at x = 2, so the minimum is 5.':'The negative square is nonpositive and reaches zero at x = 2, so the maximum is 5.','The sign of the leading coefficient determines the opening; three samples alone do not establish the global extremum.'];
  function check(id,a){
    if(a.why!==undefined&&(typeof a.why!=='string'||a.why.length>1200))return {missing:['valid explanation text'],score:null};
    if(a.reason!==undefined&&!['','same-both','one-side','cancel-only','bound-and-zero','three-samples','x-square-sign'].includes(a.reason))return {missing:['valid reason choice'],score:null};
    if(id==='C11'){
      const missing=[];if(!['add','subtract','multiply','divide'].includes(a.operation))missing.push('operation');for(const k of ['amount','x'])if(!Number.isFinite(a[k]))missing.push(k);
      return {missing,score:missing.length?null:eqGrade(a)};
    }
    const error=M.validate(functionId(id),a);return {missing:error?[error]:[],score:error?null:M.grade(functionId(id),a)};
  }
  function reasoning(id,a,score){
    const q=score.reason,conflict=!score.correct;
    const missing=!a.reason&&!(a.why??'').trim();
    return {...q,points:conflict?null:q.points,status:conflict?'Needs review':q.points===2?'Provisional credit':missing?'Missing explanation':'Needs review',connection:q.points===2&&!conflict?1:null,connectionMax:1,anchors:anchors(id),matched:q.points===2?[q.anchor]:[],objectiveConflict:conflict,reviewReasons:conflict?['objective_conflict']:missing?['missing_explanation']:q.points==null?['unknown_or_conflicting_wording']:[],method:'sketch-central-reasons-0.5',evidenceSpans:[]};
  }
  function form(id,h){
    const {number:n,choices:c,writing:w,optionalPanel:optional,board,workspace,state}=h,r=state.records[id]??{};
    if(id==='C11')return `<p class="lead">Four equal boxes contain x units each. Taking 3 units from their combined contents leaves 9 units.</p>${workspace(board('Restore & share',`<p class="model-equation">4x − 3 = 9</p>${optional(id,'restore-model','Need a visual? Restore and share the units',`<nav class="activity-tabs" aria-label="Restore and share stages">${['Start','Restore 3','Share equally'].map((label,i)=>`<button type="button" data-restore-stage="${i}" aria-pressed="${(r.restoreStage??0)===i}">${i+1} · ${label}</button>`).join('')}</nav><div id="restore-drawing">${equationDrawing(r.restoreStage??0)}</div><p id="restore-caption">${stageCaption(r.restoreStage??0)}</p>`)}`),`<p>Choose an operation that cancels −3. Apply it to both sides, then find x.</p>${c('operation',[['add','Add'],['subtract','Subtract'],['multiply','Multiply'],['divide','Divide']],'Operation on both sides')}${n('amount','Number used in the operation')}${n('x','Value of x')}${c('reason',[['same-both','The same change on both sides preserves equality.'],['one-side','Changing only one side always preserves equality.'],['cancel-only','It cancels −3 on the left.']],'Choose a reason, or write your own')}${w('Why must the operation be applied to both sides?')}`)}`;
    const f=M.functions[functionId(id)];
    return `<div class="integrated-activity"><p class="lead">${id==='QP'?'Part 1 · Positive square':'Part 2 · Negative square'}</p><p class="model-equation">y = ${f.formula}</p><p>Rewrite the function, choose three points, then locate its turning point.</p>${state.quadraticComparison?'<div class="sign-comparison"><p>Compare y = (x − 2)² + 5 and y = −(x − 2)² + 5.</p><p class="help">The minus sign applies to the whole square. The +5 stays unchanged.</p></div>':''}<section class="activity-part" id="part-expansion"><h3>1 · Rewrite & predict</h3><p>Write y = ax² + bx + c.</p><div class="plan-fields">${n('a','a · x² coefficient')}${n('b','b · x coefficient')}${n('c','c · constant')}</div>${c('opening',[['up','Upward'],['down','Downward']],'Which way will it open?')}</section><section class="activity-part" id="part-points"><h3>2 · Choose three points</h3><p class="help">Choose three different x-values between −50 and 50 for the preview. The function is defined for all real x.</p>${[1,2,3].map(i=>`<fieldset><legend>Point ${i}</legend><div class="plan-fields">${n('x'+i,'Point '+i+' · x')}${n('y'+i,'Point '+i+' · y')}</div></fieldset>`).join('')}</section><section class="activity-part" id="part-vertex"><h3>3 · Find the turning point</h3><div class="plan-fields">${n('vx','Turning-point x')}${n('vy','Turning-point y')}</div>${c('kind',[['minimum','A minimum'],['maximum','A maximum']],'What does this point give?')}<p class="help">A smallest sampled value is not necessarily the minimum over all real x.</p>${c('reason',[['bound-and-zero',id==='QP'?'The square is at least 0 and reaches 0 at x = 2; +5 gives the minimum.':'The negative square is at most 0 and reaches 0 at x = 2; +5 gives the maximum.'],['three-samples','My three samples alone prove the global extremum.'],['x-square-sign','x² can be negative, which determines the opening.']],'Choose a reason, or write your own')}${w('Explain why no other real x gives a lower or higher y-value.')}</section>${optional(id,'quadratic-graph','Need a visual? Explore the given function',`<div id="quadratic-preview">${preview(id,r.draft??r.answer??{},state.quadraticComparison)}</div><p class="help">Axes use the labelled scales, which can differ. The graph uses the given function and your chosen x-values, not your expanded coefficients. It does not change your answers.</p>`)}<p class="help">Your next step uses these answer components. Time and unfamiliar explanation wording do not create a weakness label.</p></div>`;
  }
  function preview(id,a,compare){const f=functionId(id),points=[1,2,3].map(i=>a['x'+i]).filter(x=>Number.isFinite(x)&&Math.abs(x)<=50);return graph(f,a,compare)+`<div class="operation-key">${f==='positive'||compare?'<span class="positive-key">Blue solid: positive square</span>':''}${f==='negative'||compare?'<span class="negative-key">Red dashed: negative square</span>':''}</div>${points.length?`<table class="table"><thead><tr><th>Chosen x</th><th>Calculated y</th></tr></thead><tbody>${points.map(x=>`<tr><td>${esc(x)}</td><td>${esc(M.value(f,x))}</td></tr>`).join('')}</tbody></table>`:''}`;}
  const stageCaption=s=>['The three removed units come from the combined contents of four equal boxes.','Add 3 to each side: 4x = 12. Restore the full combined contents.','Divide both sides by 4. Twelve units make four equal groups, so x = 3.'][s];
  function reasonText(id,key){return {'same-both':'The same change on both sides preserves equality.','one-side':'Changing only one side always preserves equality.','cancel-only':'It cancels −3 on the left.','bound-and-zero':id==='QP'?'The square is nonnegative and reaches zero at x = 2; adding 5 gives the minimum.':'The negative square is nonpositive and reaches zero at x = 2; adding 5 gives the maximum.','three-samples':'My three samples alone prove the global extremum.','x-square-sign':'x² can be negative, which determines the opening.'}[key]??key;}
  function componentEvidence(id,key,a){
    if(id==='C11')return key==='operation'?{observed:{operation:a.operation,amount:a.amount},expected:[{operation:'add',amount:3},{operation:'subtract',amount:-3}]}:{observed:a[key],expected:3};
    const f=M.functions[functionId(id)];
    if(key==='expansion')return {observed:{a:a.a,b:a.b,c:a.c},expected:{a:f.a,b:f.b,c:f.c}};
    if(key==='points')return {observed:[1,2,3].map(i=>({x:a['x'+i],y:a['y'+i]})),expected:[1,2,3].map(i=>({x:a['x'+i],y:M.value(functionId(id),a['x'+i])}))};
    if(key==='vertex')return {observed:{x:a.vx,y:a.vy},expected:{x:f.h,y:f.k}};
    return {observed:key==='extremum'?a.kind:a[key],expected:key==='extremum'?f.kind:f[key]};
  }
  window.ClueveraIntegrated={handles,functionId,anchors,check,reasoning,form,preview,componentEvidence,reasonText,equationDrawing,stageCaption,route:(id,score)=>M.route(functionId(id),score)};
})();
