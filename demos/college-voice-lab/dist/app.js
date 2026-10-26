import {KEY,copy,fmt,parseNumber,blank,defaults,subject,modelFor,followup,targetFor,numericMatch,validDB,exampleAttempt,ids,checkpointCopy} from './core.js?v=six-subjects-1';
import {extraView,sampleLabel} from './views.js?v=six-subjects-1';
import {VoiceRecorder,appendTranscript} from './recorder.js';
const $=id=>document.getElementById(id),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>new Date().toISOString(),fresh=()=>Object.fromEntries([['version',1],...ids.map(id=>[id,[blank(id)]])]);
let db=fresh(),lastRaw=null,blocked=false,recovery=null,saveFailed=false,storage;
try{storage=globalThis.QuidenceStorage||globalThis.localStorage;}catch{}
try{lastRaw=storage.getItem(KEY);if(lastRaw!==null){const parsed=JSON.parse(lastRaw);if(!validDB(parsed))throw Error('Unreadable notes');db=parsed;}}catch{blocked=true;recovery=lastRaw;}
for(const key of ids)if(!db[key])db[key]=[blank(key)];
const route=()=>{const key=location.hash.slice(1),alias={statistics:'stats','algebra-2':'algebra2'}[key]||key;return ids.includes(alias)?alias:'linear';};
let id=route();
const session=()=>db[id].at(-1);
function status(){const bad=blocked||saveFailed;$('save-status').textContent=bad?'Browser saving is unavailable or these notes changed elsewhere. Export before leaving.':'Demo field notes stay in this browser.';$('save-status').classList.toggle('error',bad);}
function save(){if(!blocked)try{if(storage.getItem(KEY)!==lastRaw){blocked=true;}else{const raw=JSON.stringify(db);storage.setItem(KEY,raw);lastRaw=raw;saveFailed=false;}}catch{saveFailed=true;}status();}
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){blocked=true;status();}});
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
const labels=['Your idea','Find evidence','Test the claim','Try a new case','Reflect'];
const mic='<svg viewBox="0 0 18 22" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="2" width="6" height="11" rx="3"/><path d="M3 10a6 6 0 0 0 12 0M9 16v4M6 20h6"/></g></svg>';
const quote=text=>'<div class="quote">'+E(text||'No written reason was added.')+'</div>';
function bubble(text,key){return '<div class="bubble"'+(key?' id="'+key+'"':'')+'><span class="speaker">Q / QUIDENCE</span><p>'+E(text)+'</p></div>';}
function primary(key,label){return '<button class="primary" id="'+key+'">'+label+' <span aria-hidden="true">↗</span></button>';}
function field(key,label,value,optional=false,disabled=false){return '<label class="field" for="'+key+'">'+label+(optional?' <small>(optional)</small>':'')+'</label><textarea id="'+key+'" maxlength="2000"'+(disabled?' disabled':'')+'>'+E(value)+'</textarea>'+(disabled?'':'<button class="voice-button" type="button" data-voice="'+key+'">'+mic+' Audio playback or examples</button>');}
function numberField(key,label,value,disabled=false){return '<label class="field" for="'+key+'">'+E(label)+'</label><input type="text" inputmode="decimal" id="'+key+'" value="'+E(value)+'"'+(disabled?' disabled':'')+'><p class="hint">Use a decimal point or comma. Two decimal places are enough.</p>';}
function bindField(key,property,dirty){const e=$(key);if(!e||e.disabled)return;e.oninput=()=>{session()[property||key]=e.value;if(dirty)dirty();save();};}
function advance(phase){const s=session();s.phase=phase;s.reached=Math.max(s.reached,phase);save();render();$('conversation-title').scrollIntoView({block:'start'});}
function svg(body,label){return '<svg viewBox="0 0 600 380" role="img" aria-label="'+E(label)+'"><defs><marker id="arrow" viewBox="0 0 10 10" markerWidth="6" markerHeight="6" refX="8" refY="5" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#15565b"/></marker><marker id="oldarrow" viewBox="0 0 10 10" markerWidth="6" markerHeight="6" refX="8" refY="5" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#a89abf"/></marker></defs>'+body+'</svg>';}
const line=(x1,y1,x2,y2,color='#c8d7d0',extra='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" '+extra+'/>';
const text=(x,y,content,size=12,extra='')=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" '+extra+'>'+E(content)+'</text>';
function vectorPlot(m){
 const scale=Math.min(470/(Math.max(m.k*m.x,m.x)+1),240/(Math.max(m.y,1)+1),60),X=x=>75+x*scale,Y=y=>300-y*scale;
 let b='';for(let i=0;i<=Math.floor(480/scale);i++)b+=line(X(i),40,X(i),315,'#e0e7df');for(let j=0;j<=Math.floor(260/scale);j++)b+=line(55,Y(j),560,Y(j),'#e0e7df');
 b+='<polygon points="'+X(0)+','+Y(0)+' '+X(m.k)+','+Y(0)+' '+X(m.k)+','+Y(1)+' '+X(0)+','+Y(1)+'" fill="#e7eee3" opacity=".8"/>';
 b+=line(55,300,560,300,'#8da69e')+line(75,35,75,325,'#8da69e');
 b+=line(X(0),Y(0),X(m.x),Y(m.y),'#a89abf','stroke-width="4" marker-end="url(#oldarrow)"')+line(X(0),Y(0),X(m.k*m.x),Y(m.y),'#15565b','stroke-width="4" marker-end="url(#arrow)"');
 b+='<circle cx="'+X(m.x)+'" cy="'+Y(m.y)+'" r="5" fill="#a89abf"/><circle cx="'+X(m.k*m.x)+'" cy="'+Y(m.y)+'" r="5" fill="#15565b"/>';
 b+=text(X(m.x)+9,Y(m.y)-12,'v',16)+text(X(m.k*m.x)+9,Y(m.y)+24,'T(v)',16);
 b+=text(64,320,'0',11)+text(562,319,'x',14)+text(60,36,'y',14);
 for(let i=1;i<=Math.floor(470/scale);i++)b+=text(X(i),320,i,10,'text-anchor="middle"');
 for(let j=1;j<=Math.floor(250/scale);j++)b+=text(61,Y(j)+4,j,10,'text-anchor="end"');
 b+='<circle cx="38" cy="356" r="5" fill="#a89abf"/>'+text(50,360,'Original vector',11)+'<circle cx="205" cy="356" r="5" fill="#15565b"/>'+text(217,360,'After horizontal stretch',11);
 return svg(b,'The original vector and its horizontal stretch share the same vertical coordinate. Both axes use the same scale.');
}
function intervalPlot(m){
 const X=x=>40+(x+24)*520/54;let pts=[],shade=[];for(let i=0;i<=100;i++){const x=m.mean-24+i*.48,y=185-105*Math.exp(-.5*((x-m.mean)/m.sigma)**2);pts.push(X(x)+','+y);shade.push(X(x)+','+y);}
 let b=text(30,32,'Individual score changes',14)+text(30,53,'Illustrative spread around the sample mean · SD = 8 points',11);
 b+='<polygon points="'+X(m.mean-24)+',185 '+shade.join(' ')+' '+X(m.mean+24)+',185" fill="#e8e0f1"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#aa98bf" stroke-width="2"/>';
 b+=line(40,185,560,185)+line(X(m.mean),70,X(m.mean),300,'#8ba79a','stroke-dasharray="4 5"');
 b+=text(30,226,m.level+'% confidence interval for the population mean',14);
 b+='<rect x="'+X(m.lo)+'" y="246" width="'+(X(m.hi)-X(m.lo))+'" height="22" rx="6" fill="#97c6b0"/>'+line(X(m.lo),238,X(m.lo),276,'#15565b','stroke-width="2"')+line(X(m.hi),238,X(m.hi),276,'#15565b','stroke-width="2"')+'<circle cx="'+X(m.mean)+'" cy="257" r="5" fill="#15565b"/>';
 b+=text(X(m.lo)-6,296,fmt(m.lo),12,'text-anchor="end"')+text(X(m.hi)+6,296,fmt(m.hi),12);
 b+=line(40,327,560,327,'#8da69e');for(const x of [-20,-10,0,10,20])b+=line(X(x),322,X(x),332,'#8da69e')+text(X(x),348,x,11,'text-anchor="middle"');
 b+=text(300,372,'Score change (points) · one shared horizontal scale',11,'text-anchor="middle"');
 return svg(b,'Individual changes have a broad spread with standard deviation 8. The confidence interval below estimates the population mean, on the same horizontal scale.');
}
function renderModel(keepControls=false){
 const s=session(),transfer=s.phase>=3,m=modelFor(id,s,transfer);let v;
 if(id==='linear')v={title:'One stretch. Many directions.',tag:'T(x, y) = ('+m.k+'x, y)',description:'v = ('+fmt(m.x)+', '+fmt(m.y)+') → T(v) = ('+fmt(m.k*m.x)+', '+fmt(m.y)+')',plot:vectorPlot(m),note:'Purple: original vector. Teal: transformed vector. Both axes use the same scale.',controls:'<label class="control-label" for="angle"><span>Direction of the original vector</span><output data-output="angle" data-suffix="°">'+s.model.angle+'°</output></label><input id="angle" data-model-prop="angle" type="range" min="0" max="90" step="15" value="'+s.model.angle+'"><div class="range-ends"><span>Horizontal</span><span>Vertical</span></div>',metrics:[['Original length',fmt(m.before)],['New length',fmt(m.after)],['Length factor',fmt(m.factor,3)]],conditions:'Both axes use the same unit scale. This transformation multiplies x by '+m.k+' and leaves y unchanged. Length means Euclidean length. The faint rectangle shows how a unit square is stretched.'};
 else if(id==='stats')v={title:'An interval is not a population.',tag:m.level+'% confidence',description:'Sample mean = 3.2 points · known population SD = 8 points',plot:intervalPlot(m),note:'Lavender: individual variation. Green: uncertainty about the population mean. Both rows use the same horizontal scale.',controls:'<label class="control-label" for="sample-size"><span>Sample size n</span><output data-output="n">'+s.model.n+'</output></label><input id="sample-size" data-model-prop="n" type="range" min="20" max="200" step="20" value="'+s.model.n+'"><div class="range-ends"><span>20 observations</span><span>200 observations</span></div><label class="confidence-choice" for="confidence-level">Confidence <select id="confidence-level" data-model-prop="level"'+(s.phase===0?' disabled':'')+'><option value="95"'+(s.model.level===95?' selected':'')+'>95%</option><option value="99"'+(s.model.level===99?' selected':'')+'>99%</option></select></label>',metrics:[['Sample size',m.n],['Interval endpoints',fmt(m.lo)+' to '+fmt(m.hi)],['Half-width',fmt(m.half,3)]],conditions:'Illustrative data, not a real study. Independent observations from a normal population with known SD = 8 points. Interval = sample mean ± z × 8/√n, where z = 1.96 for 95% and 2.576 for 99%. This estimates a population mean change; a before-and-after change alone does not establish causation.'};
 else v=extraView(id,m,s,transfer);
 $('model-kicker').textContent=transfer?'A FRESH CASE':'PLAY WITH THE MODEL';$('model-title').textContent=v.title;$('model-tag').textContent=v.tag;$('model-description').textContent=v.description;$('plot').innerHTML=v.plot;$('plot-note').textContent=v.note;
 if(!keepControls)$('model-controls').innerHTML=transfer?'<p class="hint">This new case is fixed. Your earlier settings and answers remain in the notes.</p>':v.controls;
 $('metrics').innerHTML=v.metrics.map(x=>'<div class="metric"><span>'+E(x[0])+'</span><strong>'+E(x[1])+'</strong></div>').join('');$('conditions').textContent=v.conditions;
 $('capture').disabled=transfer||s.samples.length>=12;$('capture').textContent=transfer?'Your earlier evidence is kept below':s.samples.length>=12?'12 settings kept':'＋ Keep this setting as evidence';
 $('samples').innerHTML=s.samples.map((x,i)=>'<button data-sample="'+i+'"'+(transfer?' disabled':'')+'>'+E(id==='linear'?x.model.angle+'° · factor '+fmt(x.result.factor,2):id==='stats'?'n '+x.model.n+' · '+x.model.level+'%':sampleLabel(id,x))+'</button>').join('');
 $('samples').querySelectorAll('button').forEach(b=>b.onclick=()=>{s.model=copy(s.samples[+b.dataset.sample].model);save();renderModel();});
 if(s.phase===2&&!s.review){const c=checkpointCopy(id,m),p=document.querySelector('#checkpoint-prompt p'),label=document.querySelector('label[for="number"]');if(p)p.textContent=c.prompt;if(label)label.textContent=c.label;}
 document.querySelectorAll('[data-output]').forEach(out=>out.textContent=s.model[out.dataset.output]+(out.dataset.suffix||''));
 document.querySelectorAll('[data-model-prop]').forEach(el=>{const update=()=>{s.model[el.dataset.modelProp]=+el.value;save();renderModel(true);};if(el.tagName==='SELECT')el.onchange=update;else el.oninput=update;});
}
function storedNumber(review){return '<div class="evidence-box'+(review.matches?'':' warning')+'"><p><strong>Numerical check: '+(review.matches?'matches the model':'needs another look')+'</strong></p><p>Your value: '+E(review.raw)+' · Model value: '+fmt(review.target,3)+'</p><p class="hint">Checked at your submitted setting. Written reasoning is not automatically graded.</p></div>';}
function renderDialogue(){
 const s=session(),cfg=subject[id],phase=s.phase;let html='';
 if(phase===0){
  html=bubble(cfg.question);
  if(s.first)html+='<p class="summary-heading">Your original thought</p>'+quote(s.first.text)+'<p class="hint">'+E(s.first.claimText)+'</p><div class="actions">'+primary('begin','Continue to the evidence')+'</div>';
  else{
   const choices=cfg.choices||(id==='linear'?['Yes, in every direction.','No, direction matters.','I want to test it.']:['Yes, it describes individual students.','No, it estimates a mean.','I want to test it.']);
   html+='<div class="choices">'+choices.map((x,i)=>'<button type="button" class="choice" data-claim="'+i+'" aria-pressed="'+(s.claim===String(i))+'">'+E(x)+'</button>').join('')+'</div>'+field('draft','What makes you think so?',s.draft,true)+'<p class="hint">Your first answer is a starting point. It is not scored.</p><p class="error" id="form-error" role="status"></p><div class="actions">'+primary('begin','Keep my first thought')+'</div>';
  }
 }
 if(phase===1)html=bubble(cfg.evidence||(id==='linear'?'Keep the horizontal stretch at 2. Compare a diagonal vector with a horizontal or vertical one. Which setting makes the claim easiest to test?':'Change the sample size and confidence level. Compare the width of the mean’s interval with the spread of individual changes.'))+'<p class="summary-heading">Your first words</p>'+quote(s.first.text)+'<p class="hint">Keep at least one setting using the button beneath the graph. You can collect up to 12.</p>'+field('observation','What did you notice?',s.observation,true)+'<p class="error" id="form-error" role="status"></p><div class="actions">'+primary('checkpoint','Test my explanation')+'</div>';
 if(phase===2){
  if(!s.review){
   const c=checkpointCopy(id,modelFor(id,s));html=bubble(c.prompt,'checkpoint-prompt')+numberField('number',c.label,s.number)+field('reason','Put the idea in your own words',s.reason)+'<label class="field" for="focus">Which part should we examine next?</label><select class="focus-select" id="focus"><option value="">Choose a reasoning focus</option>'+cfg.focus.map(x=>'<option value="'+x[0]+'"'+(s.focus===x[0]?' selected':'')+'>'+E(x[1])+'</option>').join('')+'</select><p class="hint">In this demo, your selected focus routes the follow-up. Free text is kept for discussion.</p><p class="error" id="form-error" role="status"></p><div class="actions">'+primary('review','Preview my follow-up')+'</div>';
  }else{
   const r=s.review,f=followup(id,r.focus),a=s.followSaved;
   html='<p class="summary-heading">Your confirmed answer</p>'+quote(r.text)+storedNumber(r)+'<div class="review-card"><span class="review-label">Scripted conversation preview</span><h3>A question for this line of thinking.</h3><p>'+E(f.observation)+'</p><p>'+E(f.question)+'</p><button class="secondary" id="probe">Show this setting in the model ↗</button></div>';
   html+=(f.label?numberField('followNumber',f.label,s.followNumber,!!a):'')+field('followText','My response to the follow-up',s.followText,false,!!a);
   if(a)html+=(a.target!==null?storedNumber(a):'')+'<div class="complete">Follow-up saved. Your wording is kept for discussion.</div><details class="conditions"><summary>See the mathematical reference</summary><p>'+E(f.reason||'There is no single numerical claim to check here. Your explanation is preserved for review.')+'</p></details><div class="actions">'+primary('transfer-go','Try a fresh case')+'</div>';
   else html+='<p class="error" id="form-error" role="status"></p><div class="actions">'+primary('follow-save','Keep this response')+'</div>';
   html+='<details class="mini-rule"><summary class="hint">That is not what I meant / add context</summary>'+field('correction','A clarification, kept beside the original',s.correction,true)+'</details>';
  }
 }
 if(phase===3)html=bubble(cfg.transfer)+numberField('transferNumber',cfg.transferNumber,s.transferNumber)+field('transferText','Explain what transfers to the new case',s.transferText)+'<p class="hint">Your calculation and explanation are kept separately. This is a new case, not a mastery score.</p><p class="error" id="form-error" role="status"></p><div class="actions">'+primary('transfer-save','Keep my new-case response')+'</div>';
 if(phase===4)html=bubble('Look back at your first thought. What would you keep, change, or explain more carefully?')+'<p class="summary-heading">My first thought</p>'+quote(s.first.text)+'<p class="summary-heading">My explanation after exploring</p>'+quote(s.review.text)+'<p class="summary-heading">My response in the new case</p>'+quote(s.transfer.text)+storedNumber(s.transfer)+field('reflection','What I think now — and why',s.reflection)+'<div class="actions">'+primary('reflect-save','Keep my reflection')+'<button class="secondary" id="export-here">Export field notes ↓</button></div><div id="reflection-status" role="status">'+(s.reflectedAt?'<div class="complete">Reflection saved. Your earlier answers are still in the notes.</div>':'')+'</div><p class="hint">Your export includes this attempt and any earlier attempts. Recordings are not exported.</p>';
 $('dialogue').innerHTML=html;
 bindField('draft');bindField('observation');bindField('number');bindField('reason');bindField('followNumber');bindField('followText');bindField('transferNumber');bindField('transferText');bindField('correction');bindField('reflection',null,()=>{s.reflectedAt=null;if($('reflection-status'))$('reflection-status').textContent='';});
 const on=(key,fn)=>{if($(key))$(key).onclick=fn;},error=msg=>{$('form-error').textContent=msg;};
 document.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{s.claim=b.dataset.claim;save();renderDialogue();});
 const focus=$('focus');if(focus)focus.onchange=()=>{s.focus=focus.value;save();};
 on('begin',()=>{if(!s.first){if(!s.claim)return error('Choose a first thought. It is fine to be unsure.');const choice=document.querySelector('[data-claim][aria-pressed="true"]');s.first={text:s.draft,claim:s.claim,claimText:choice.textContent,model:copy(modelFor(id,s)),sources:copy(s.voiceSources),at:now()};}advance(1);});
 on('checkpoint',()=>{if(!s.samples.length)return error('Keep one setting as evidence first.');s.model=defaults(id);advance(2);});
 on('review',()=>{const target=targetFor(id,modelFor(id,s)),matches=numericMatch(s.number,target);if(matches===null)return error('Enter a finite number for the numerical check.');if(!s.reason.trim())return error('Add your explanation, or use an example transcript to preview the flow.');if(!s.focus)return error('Choose a reasoning focus for the scripted follow-up.');s.review={text:s.reason,raw:s.number,target,matches,focus:s.focus,model:copy(modelFor(id,s)),sources:copy(s.voiceSources),kind:'scripted_demo',at:now()};save();renderDialogue();});
 on('probe',()=>{Object.assign(s.model,followup(id,s.review.focus).probe);save();renderModel();});
 on('follow-save',()=>{const f=followup(id,s.review.focus),matches=f.target===null?null:numericMatch(s.followNumber,f.target);if(f.target!==null&&matches===null)return error('Enter a finite number for the follow-up.');if(!s.followText.trim())return error('Keep a short explanation with your response.');s.followSaved={text:s.followText,raw:s.followNumber,target:f.target,matches,model:copy(modelFor(id,s)),at:now()};save();renderDialogue();});
 on('transfer-go',()=>advance(3));
 on('transfer-save',()=>{const m=modelFor(id,s,true),target=targetFor(id,m,true),matches=numericMatch(s.transferNumber,target);if(matches===null)return error('Enter a finite number for the new case.');if(!s.transferText.trim())return error('Keep your explanation with the new-case response.');s.transfer={text:s.transferText,raw:s.transferNumber,target,matches,model:copy(m),at:now()};advance(4);});
 on('reflect-save',()=>{if(!s.reflection.trim())return toast('Add a reflection first.');s.reflectedAt=now();s.reflections.push({text:s.reflection,at:s.reflectedAt});save();$('reflection-status').innerHTML='<div class="complete">Reflection saved. Your earlier answers are still in the notes.</div>';toast('Reflection saved');});
 on('export-here',exportNotes);
 document.querySelectorAll('[data-voice]').forEach(b=>b.onclick=()=>openVoice(b.dataset.voice));
}
function render(){
 const s=session(),cfg=subject[id];document.title=cfg.title+' · Quidence demo';$('subject-tag').textContent=cfg.tag;$('page-title').textContent=cfg.title;$('subtitle').textContent=cfg.subtitle;
 document.querySelectorAll('[data-subject]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.subject===id)));
 $('steps').innerHTML=labels.map((x,i)=>'<button data-step="'+i+'"'+(i>s.reached?' disabled':'')+(i===s.phase?' aria-current="step"':'')+' class="'+(i<s.reached?'done':'')+'"><b>'+String(i+1).padStart(2,'0')+'</b>'+x+'</button>').join('');
 $('steps').querySelectorAll('button').forEach(b=>b.onclick=()=>advance(+b.dataset.step));$('stage-kicker').textContent=(s.isExample?'EXAMPLE JOURNEY · ':'')+String(s.phase+1).padStart(2,'0')+' / YOUR CONVERSATION';$('conversation-title').textContent=labels[s.phase];renderModel();renderDialogue();status();
}
function exportNotes(){
 let out='# Quidence · Math Voice Lab\n\nTeaching demo. Example transcripts and follow-ups are scripted. Numerical checks use the displayed model. Written reasoning has not been automatically assessed. Recordings are not exported.\n';
 for(const key of ids)for(const [i,s]of db[key].entries()){
  out+='\n## '+subject[key].name+' — attempt '+(i+1)+'\nCreated: '+s.createdAt+'\n\n### First thought\n'+(s.first?.claimText||'Not submitted')+'\n'+(s.first?.text||'')+'\n\n### Evidence settings\n'+s.samples.map(x=>JSON.stringify(x)).join('\n')+'\n'+(s.observation||'')+'\n\n### Confirmed explanation\n'+(s.review?.text||'Not submitted')+'\nNumerical check: '+(s.review?JSON.stringify({raw:s.review.raw,target:s.review.target,matches:s.review.matches,model:s.review.model}):'Not submitted')+'\n\n### Follow-up\n'+(s.review?followup(key,s.review.focus).question:'')+'\n'+(s.followSaved?.text||s.followText)+'\nNumerical check: '+(s.followSaved?JSON.stringify({raw:s.followSaved.raw,target:s.followSaved.target,matches:s.followSaved.matches,model:s.followSaved.model}):'Not submitted')+'\n\n### Clarification\n'+s.correction+'\n\n### New case\n'+(s.transfer?.text||s.transferText)+'\nNumerical check: '+(s.transfer?JSON.stringify({raw:s.transfer.raw,target:s.transfer.target,matches:s.transfer.matches}):'Not submitted')+'\n\n### Reflection draft\n'+s.reflection+'\n\n### Saved reflections\n'+s.reflections.map(x=>x.at+'\n'+x.text).join('\n\n')+'\n\n### Wording sources (raw and confirmed)\n'+s.voiceSources.map(x=>JSON.stringify(x)).join('\n')+'\n';
 }
 if(recovery!==null)out+='\n## Unreadable original local record (preserved)\n'+recovery+'\n';
 const blob=new Blob([out],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob);let dialog=$('notes-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='notes-dialog';dialog.setAttribute('aria-labelledby','notes-title');document.body.append(dialog);}if(dialog.dataset.downloadUrl)URL.revokeObjectURL(dialog.dataset.downloadUrl);dialog.dataset.downloadUrl=url;
 dialog.innerHTML='<button class="dialog-close" id="notes-close" aria-label="Close field notes">×</button><p class="eyebrow">YOUR LEARNING RECORD</p><h2 id="notes-title">The path your thinking took.</h2><p>Your first words, confirmed wording and later responses stay separate. Review the notes here, then keep a copy.</p><label class="field" for="notes-content">Field notes preview</label><textarea id="notes-content" readonly style="min-height:330px;font-size:12px"></textarea><div class="actions"><a class="primary" id="notes-download">Download Markdown ↓</a></div><p class="hint">This file includes all six subjects and every attempt. Audio is not included.</p>';
 $('notes-content').value=out;$('notes-download').href=url;$('notes-download').download='Quidence_Math_Voice_Lab_Notes.md';$('notes-close').onclick=()=>dialog.close();dialog.showModal();
}
let voiceTarget=null,rawExample='',sampleFocus='',audioURL=null,voiceUI={},timer=null,confirmingDiscard=false;
const vd=$('voice-dialog');
const recorder=new VoiceRecorder({media:navigator.mediaDevices,Recorder:globalThis.MediaRecorder,onState:event=>{
 if(!vd.open||!voiceUI.start)return;clearInterval(timer);voiceUI.start.disabled=['requesting','recording','stopping','ready'].includes(event.state);voiceUI.stop.disabled=event.state!=='recording';voiceUI.again.hidden=event.state!=='ready';
 const errors={permission_denied:'Microphone access was denied. You can type or try an example transcript.',unsupported:'Recording is unavailable in this browser. You can type or try an example.',no_microphone:'No microphone was found. You can still try the example transcripts.',empty_audio:'No audio was captured. Please try again.',too_large:'This recording is too large. Try a shorter answer.'};
 voiceUI.status.textContent=event.error?(errors[event.error]||'Recording failed. Your existing answer is safe.'):({idle:'Start when ready. Up to 60 seconds.',requesting:'Waiting for microphone permission…',stopping:'Finishing recording…',ready:'Replay your answer, then type the wording you want to keep. This demo does not transcribe audio.'}[event.state]||'');
 voiceUI.status.classList.toggle('recording',event.state==='recording');
 if(event.state==='recording'){const started=Date.now();const tick=()=>voiceUI.status.textContent='Recording · '+Math.min(60,Math.floor((Date.now()-started)/1000))+'/60 sec';tick();timer=setInterval(tick,500);}
 if(event.state==='ready'&&event.blob){if(audioURL)URL.revokeObjectURL(audioURL);audioURL=URL.createObjectURL(event.blob);voiceUI.audio.src=audioURL;voiceUI.audio.hidden=false;}
}});
function clearAudio(){recorder.cancel();clearInterval(timer);if(voiceUI.audio){voiceUI.audio.pause();voiceUI.audio.removeAttribute('src');}if(audioURL)URL.revokeObjectURL(audioURL);audioURL=null;}
function closeVoice(){clearAudio();vd.close();voiceTarget=null;}
function requestCloseVoice(){if(recorder.blob||['requesting','recording','stopping'].includes(recorder.state)||voiceUI.note.value.trim()){confirmingDiscard=true;voiceUI.discard.hidden=false;voiceUI.keep.hidden=false;voiceUI.status.textContent='Discard this recording and uninserted wording? Your existing answer will stay.';}else closeVoice();}
function openVoice(target){
 voiceTarget=target;rawExample='';sampleFocus='';confirmingDiscard=false;
 vd.innerHTML='<button class="dialog-close" id="voice-close" aria-label="Close voice window">×</button><p class="eyebrow">VOICE / REVIEW YOUR WORDING</p><h2 id="voice-title">Say it, then shape it.</h2><p class="hint">Record and replay locally, or try an example transcript below. Automatic transcription is not active in this demo. Closing this window clears the recording.</p><p class="voice-status" id="voice-status" role="status"></p><div class="actions"><button class="primary" id="record-start"><span class="record-dot"></span>Start recording</button><button class="secondary" id="record-stop" disabled>Stop</button><button class="text-button" id="record-again" hidden>Discard & record again</button></div><audio id="voice-audio" controls hidden></audio><details id="sample-options" open><summary class="field">Try an example transcript</summary><p class="hint">These examples use the starting checkpoint. Edit them to match your setting.</p><div class="sample-options">'+subject[id].sample.map((x,i)=>'<button type="button" data-example="'+i+'">'+E(x.name)+'<span>'+E(x.text)+'</span></button>').join('')+'</div></details><div class="voice-editor"><p class="review-label" id="wording-kind">Your wording — typed after listening</p><p class="source-quote" id="raw-example" hidden></p><label class="field" for="voice-note">Review the wording before inserting it</label><textarea id="voice-note" maxlength="2000" placeholder="Type what you meant, or choose an example above."></textarea><p class="hint">You can correct symbols, numbers and meaning. Confirming appends this text; your existing answer stays.</p><div class="actions"><button class="primary" id="voice-confirm" disabled>Use these words ↗</button><button class="secondary" id="voice-discard" hidden>Discard & return</button><button class="secondary" id="voice-keep" hidden>Keep working</button></div></div>';
 voiceUI={status:$('voice-status'),start:$('record-start'),stop:$('record-stop'),again:$('record-again'),audio:$('voice-audio'),note:$('voice-note'),discard:$('voice-discard'),keep:$('voice-keep')};
 $('voice-close').onclick=requestCloseVoice;voiceUI.start.onclick=()=>recorder.start();voiceUI.stop.onclick=()=>recorder.stop();voiceUI.again.onclick=()=>{clearAudio();voiceUI.audio.hidden=true;};
 voiceUI.note.oninput=()=>{$('voice-confirm').disabled=!voiceUI.note.value.trim();};
 vd.querySelectorAll('[data-example]').forEach(b=>b.onclick=()=>{const e=subject[id].sample[+b.dataset.example];rawExample=e.text;sampleFocus=e.focus;voiceUI.note.value=e.text;$('raw-example').hidden=false;$('raw-example').textContent='Original example: '+e.text;$('wording-kind').textContent='Example transcript — editable';$('voice-confirm').disabled=false;});
 voiceUI.discard.onclick=closeVoice;voiceUI.keep.onclick=()=>{confirmingDiscard=false;voiceUI.discard.hidden=voiceUI.keep.hidden=true;voiceUI.status.textContent='Keep reviewing your wording.';};
 $('voice-confirm').onclick=()=>{
  const fieldEl=$(voiceTarget);if(!fieldEl||fieldEl.disabled||!fieldEl.isConnected)return;
  try{
   const note=voiceUI.note.value,wasEmpty=!fieldEl.value.trim(),combined=appendTranscript(fieldEl.value,note),s=session();
   s[voiceTarget]=combined;fieldEl.value=combined;fieldEl.dispatchEvent(new Event('input',{bubbles:true}));
   if(voiceTarget==='reason'){s.focus=rawExample&&note===rawExample&&wasEmpty?sampleFocus:'custom';if($('focus'))$('focus').value=s.focus;}
   s.voiceSources.push({field:voiceTarget,rawText:rawExample||note,confirmedText:note,kind:rawExample?'example_transcript':'typed_after_rehearsal',model:copy(s.model),at:now()});save();closeVoice();fieldEl.focus();toast('Confirmed wording added. Earlier text is preserved.');
  }catch{voiceUI.status.textContent='The combined answer would exceed 2,000 characters. Shorten this wording first; your existing answer is safe.';}
 };
 vd.showModal();recorder.emit('idle');
}
vd.addEventListener('cancel',e=>{e.preventDefault();requestCloseVoice();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)recorder.stop();});
window.addEventListener('pagehide',clearAudio);
window.addEventListener('beforeunload',e=>{if(vd.open&&(recorder.blob||voiceUI.note?.value)){e.preventDefault();e.returnValue='';}});
$('capture').onclick=()=>{const s=session();if(s.phase>=3||s.samples.length>=12)return;s.samples.push({model:copy(s.model),result:copy(modelFor(id,s)),at:now()});save();renderModel();toast('Setting kept as evidence');};
document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.subject==='stats'?'statistics':b.dataset.subject;});
window.addEventListener('hashchange',()=>{if(vd.open)closeVoice();id=route();render();});
$('export-top').onclick=exportNotes;$('export-footer').onclick=exportNotes;
$('preview-sample').onclick=()=>{db[id].push(exampleAttempt(id));save();render();$('conversation-title').scrollIntoView({block:'start'});toast('Authored example loaded. Your own attempts stay in the notes.');};
$('new-attempt').onclick=()=>{db[id].push(blank(id));save();render();toast('New attempt started. Earlier attempts stay in your export.');};
$('how-demo').onclick=()=>$('about-dialog').showModal();$('close-about').onclick=()=>$('about-dialog').close();
render();

document.addEventListener('quidence:speech-reviewed',event=>{if(!event.target.closest('#dialogue'))return;const s=session(),r=event.detail;s.voiceSources.push({field:event.target.id,rawText:r.rawTranscript,confirmedText:r.reviewedText,kind:r.kind,model:copy(s.model),at:r.confirmedAt});if(event.target.id==='reason'){s.focus='custom';if($('focus'))$('focus').value='custom';}save();});
