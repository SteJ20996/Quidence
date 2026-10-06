(function(root){
'use strict';
const Models=typeof module==='object'&&module.exports?require('./course-models.js'):root.ClueveraCourseModels;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.abs(n)<1e-9?'0':Number(n.toFixed(3)).toString();
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const median=a=>{const v=[...a].sort((a,b)=>a-b),i=Math.floor(v.length/2);return v.length%2?v[i]:(v[i-1]+v[i])/2;};
const probability=a=>({joint:a/100,conditional:a/20,overall:.3,reverse:a/30});
const value=(s,x)=>s.fn==='sqrt'?(x>=s.k?Math.sqrt(x-s.k):null):s.fn==='reciprocal'?(Math.abs(x-s.k)<1e-9?null:1/(x-s.k)):s.fn==='exp'?s.initial*Math.pow(s.factor,x):(s.a??1)*Math.pow(x-(s.h??0),2)+(s.k??0);
let serial=0;
function svg(title,description,body,w=520,h=290){const id='course-plot-'+(++serial);return`<svg class="calculus-graph" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc>${body}</svg>`;}
const figure=(graphic,caption)=>`<figure class="graph-figure">${graphic}<figcaption>${esc(caption)}</figcaption></figure>`;
function table(headers,rows,caption){return`<figure class="graph-figure"><div class="table-wrap"><table class="summary-table course-data"><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i===0?`<th scope="row">${esc(v)}</th>`:`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><figcaption>${esc(caption)}</figcaption></figure>`;}
function dots(values,caption='Each dot is one observation; the horizontal axis gives waiting time in minutes.'){
 const counts=new Map();for(const x of values)counts.set(x,(counts.get(x)||0)+1);
 const min=Math.min(...values)-1,max=Math.max(...values)+1,px=x=>48+(x-min)/(max-min)*444,base=223;
 let b=`<path d="M48 ${base}H493" stroke="#8595ac"/><text x="270" y="276" text-anchor="middle" class="axis-label">Waiting time (minutes)</text><text x="14" y="30" class="tick">Stacked dots count observations</text>`;
 const tick=Math.max(1,Math.ceil((max-min)/12));for(let x=Math.ceil(min);x<=max;x+=tick)b+=`<path d="M${px(x)} ${base}v5" stroke="#8595ac"/><text x="${px(x)}" y="246" text-anchor="middle" class="tick">${x}</text>`;
 for(const[x,n]of counts)for(let i=0;i<n;i++)b+=`<circle cx="${px(x)}" cy="${base-13-19*i}" r="7" fill="#276a9c"/>`;
 return figure(svg('Dot plot of waiting times',values.join(', ')+' minutes. '+caption,b),caption+' Values: '+values.join(', ')+'.');
}
function plot(s){
 const exponential=s.fn==='exp',xmin=exponential?0:-5,xmax=exponential?4:7,ymin=s.ymin??(exponential?Math.min(0,s.initial*(1+4*(s.factor-1))):s.fn==='square'?-5:-4),ymax=s.ymax??(exponential?Math.max(s.initial,s.initial*s.factor**4)*1.15:s.fn==='square'?10:5);
 const px=x=>52+(x-xmin)/(xmax-xmin)*442,py=y=>244-(y-ymin)/(ymax-ymin)*209,clip='course-clip-'+(++serial);
 const rule=s.fn==='sqrt'?`f(x) = √(x − (${s.k}))`:s.fn==='reciprocal'?`f(x) = 1/(x − (${s.k}))`:exponential?`f(t) = ${s.initial} × ${s.factor}ᵗ`:`f(x) = ${s.a??1}(x − (${s.h??0}))² + (${s.k??0})`;
 let b=`<defs><clipPath id="${clip}"><rect x="52" y="35" width="442" height="209"/></clipPath></defs>`;
 const xtick=exponential?1:2,ytick=exponential?Math.max(1,Math.ceil((ymax-ymin)/5/10)*10):ymax-ymin>12?5:2;
 for(let x=Math.ceil(xmin/xtick)*xtick;x<=xmax;x+=xtick)b+=`<path d="M${px(x)} 35V244" stroke="#e4e8ef"/><text x="${px(x)}" y="264" text-anchor="middle" class="tick">${x}</text>`;
 for(let y=Math.ceil(ymin/ytick)*ytick;y<=ymax;y+=ytick)b+=`<path d="M52 ${py(y)}H494" stroke="#e4e8ef"/><text x="44" y="${py(y)+4}" text-anchor="end" class="tick">${y}</text>`;
 if(ymin<=0&&ymax>=0)b+=`<path d="M52 ${py(0)}H494" stroke="#8391a5"/>`;
 if(xmin<=0)b+=`<path d="M${px(0)} 35V244" stroke="#8391a5"/>`;
 function curve(fn,color,split=false){let d='',last=null;for(let i=0;i<=300;i++){const x=xmin+(xmax-xmin)*i/300,y=fn(x);if(y===null||!Number.isFinite(y)){last=null;continue;}const jump=split&&last!==null&&(last-s.k)*(x-s.k)<=0;d+=(last===null||jump?'M':'L')+fmt(px(x))+' '+fmt(py(y))+' ';last=x;}return`<path d="${d}" clip-path="url(#${clip})" fill="none" stroke="${color}" stroke-width="3"/>`;}
 b+=curve(x=>value(s,x),'#6542c0',s.fn==='reciprocal');
 if(s.compare)b+=curve(x=>s.initial*(1+x*(s.factor-1)),'#087f76');
 const probe=s.x??s.t,output=probe===undefined?null:value(s,probe);
 if(output!==null&&output>=ymin&&output<=ymax)b+=`<circle cx="${px(probe)}" cy="${py(output)}" r="5" fill="#a84324"/>`;
 if(s.fn==='sqrt')b+=`<circle cx="${px(s.k)}" cy="${py(0)}" r="4" fill="#6542c0"/>`;
 if(s.fn==='reciprocal')b+=`<path d="M${px(s.k)} 35V244" stroke="#a84324" stroke-dasharray="5 4"/>`;
 b+=`<text x="500" y="284" text-anchor="end" class="axis-label">${exponential?'time t':'x'}</text>`;
 return figure(svg(rule,rule+(s.compare?'; teal line has the same initial value and first-unit change.':''),b),rule+'. '+(s.compare?'Purple: exponential. Teal: matched first-step line. ':'')+(s.caption||'Read the horizontal input and vertical output. The viewing window may hide distant parts of the curve.'));
}
function circle(angle){const r=angle*Math.PI/180,x=Math.cos(r),y=Math.sin(r),cx=153,cy=145,radius=95;let b=`<path d="M35 145H272M153 27V263" stroke="#a8b3c4"/><circle cx="153" cy="145" r="95" fill="none" stroke="#bec9db" stroke-width="2"/><path d="M153 145L${cx+radius*x} ${cy-radius*y}" stroke="#6542c0" stroke-width="3"/><path d="M${cx+radius*x} 145V${cy-radius*y}H153" stroke="#087f76" fill="none" stroke-dasharray="4 4"/><circle cx="${cx+radius*x}" cy="${cy-radius*y}" r="6" fill="#a84324"/><g class="tick"><text x="253" y="163">1</text><text x="144" y="39">1</text><text x="36" y="163">−1</text><text x="142" y="260">−1</text><text x="265" y="133">x</text><text x="164" y="28">y</text></g><text x="300" y="90" class="axis-label">θ = ${angle}°</text><text x="300" y="127" class="axis-label">cos θ = ${fmt(x)}</text><text x="300" y="157" class="axis-label">sin θ = ${fmt(y)}</text><text x="300" y="203" class="tick">(cos θ, sin θ)</text>`;return figure(svg('A point on the unit circle',`Angle ${angle} degrees; horizontal coordinate ${fmt(x)}; vertical coordinate ${fmt(y)}.`,b),`Counterclockwise angle ${angle}° = ${fmt(angle/180)}π radians. Coordinates (${fmt(x)}, ${fmt(y)}). Rounded values are displayed.`);}
function sine(angle){const px=a=>50+a/360*445,py=y=>140-y*88;let d='';for(let a=0;a<=360;a+=2)d+=(a===0?'M':'L')+px(a)+' '+py(Math.sin(a*Math.PI/180))+' ';let b=`<path d="M50 140H495M50 36V244" stroke="#a8b3c4"/><path d="${d}" fill="none" stroke="#087f76" stroke-width="3"/><circle cx="${px(angle)}" cy="${py(Math.sin(angle*Math.PI/180))}" r="5" fill="#a84324"/>`;for(const a of[0,90,180,270,360])b+=`<text x="${px(a)}" y="264" text-anchor="middle" class="tick">${a}°</text>`;b+='<text x="41" y="56" text-anchor="end" class="tick">1</text><text x="41" y="232" text-anchor="end" class="tick">−1</text>';return figure(svg('Sine as a function of angle','One full period from 0 to 360 degrees, or 0 to 2π radians.',b),'The height of the circle point becomes sin θ on this angle graph. One full period is 2π radians.');}
function sampling(s){const dorm=s.sampling==='volunteer'?8:5;return table(['Group','Population (100)','Illustrative sample (10)'],[['Dorm residents',50,dorm],['Commuters',50,10-dorm]],'Illustrative counts, not a simulated random draw. Random samples can be unbalanced; the selection method is the evidence about design.');}
function task(s){if(s.type==='course-model')return Models.model(s.course,s.index,s.settings).graph;if(s.type==='dots')return dots(s.values,s.caption);if(s.type==='table')return table(s.headers,s.rows,s.caption);if(s.type==='circle')return circle(s.angle);return plot(s);}
function lab(module,index,s){
 if(['pre-algebra','algebra-1','geometry','algebra-2','microeconomics'].includes(module))return Models.model(module,index,s);
 if(module==='ae01'){
  if(index===0){const data={symmetric:[1,2,2,3,3,3,4,4,5],skew:[1,2,2,3,3,4,5,9,13],split:[1,1,2,2,3,8,9,9,10]}[s.shape].map(x=>x+s.shift);return{graph:dots(data),readout:`n = ${data.length} · Minimum = ${Math.min(...data)} · Maximum = ${Math.max(...data)} · Shift = ${s.shift}`,formula:'Horizontal position = measured value; stacked dots = frequency.',note:'These are illustrative data sets. A shape does not establish its cause.'};}
  if(index===1){const data=[2,3,3,4,4,5,5,6,s.tail];return{graph:dots(data),readout:`n = 9 · Total = ${32+s.tail} · Mean = ${fmt(mean(data))} · Median = ${median(data)} · Range = ${s.tail-2}`,formula:'Mean = total / n; median = middle sorted value; range = max − min.',note:'Only the largest observation changes. The middle sorted observation stays at 4.'};}
  if(index===2)return{graph:sampling(s),readout:`Selection: ${s.sampling==='random'?'random selection from all students':'dorm volunteers'} · Design: ${s.design==='assigned'?'randomly assigned method':'observed existing habits'}`,formula:'Random selection concerns the target population. Random assignment concerns the treatment comparison.',note:s.design==='assigned'?'A well-run randomized trial can support a causal comparison for participants. Recruitment still limits generalization.':'Existing habits can be confounded. Random sampling alone does not isolate a causal effect.'};
  const p=probability(s.overlap);return{graph:table(['','Passed','Did not pass','Total'],[['Club',s.overlap,20-s.overlap,20],['No club',30-s.overlap,50+s.overlap,80],['Total',30,70,100]],'Select one student uniformly from the indicated reference group.'),readout:`Reference group: ${s.condition==='club'?'20 club members':'all 100 students'} · Relevant fraction = ${s.overlap}/${s.condition==='club'?20:100} = ${fmt(s.condition==='club'?p.conditional:p.joint)} · Overall P(pass) = 0.3`,formula:s.condition==='club'?'P(pass | club) = overlap / club total':'P(pass and club) = overlap / all students',note:'Compare P(pass | club) with P(pass) to check independence. Neither probability establishes causation.'};
 }
 if(index===0){const output=value({fn:s.kind,k:s.k},s.x);return{graph:plot({fn:s.kind,k:s.k,x:s.x}),readout:`x = ${fmt(s.x)} · f(x) = ${output===null?'undefined':fmt(output)} · Real domain: ${s.kind==='sqrt'?`x ≥ ${s.k}`:`x ≠ ${s.k}`}`,formula:s.kind==='sqrt'?`f(x) = √(x − (${s.k})); x − (${s.k}) ≥ 0`:`f(x) = 1/(x − (${s.k})); x − (${s.k}) ≠ 0`,note:'Undefined inputs have no plotted output. The reciprocal branches do not connect across the excluded input.'};}
 if(index===1)return{graph:plot({fn:'square',...s}),readout:`Vertex = (${fmt(s.h)}, ${fmt(s.k)}) · Axis x = ${fmt(s.h)} · Opens ${s.a>0?'up':'down'} · Vertical scale |a| = ${Math.abs(s.a)}`,formula:`y = ${s.a}(x − (${s.h}))² + (${s.k})`,note:'A positive h moves the vertex right. All settings in this lab have a nonzero multiplier.'};
 if(index===2)return{graph:circle(s.angle)+sine(s.angle),readout:`θ = ${s.angle}° = ${fmt(s.angle/180)}π radians · cos θ = ${fmt(Math.cos(s.angle*Math.PI/180))} · sin θ = ${fmt(Math.sin(s.angle*Math.PI/180))}`,formula:'Unit-circle point = (cos θ, sin θ); cos²θ + sin²θ = 1.',note:'Displayed decimals are rounded. A full turn adds 2π to the radian input and repeats both coordinates.'};
 const y=s.initial*s.factor**s.t,linear=s.initial*(1+s.t*(s.factor-1));return{graph:plot({fn:'exp',...s,compare:true}),readout:`t = ${fmt(s.t)} · Exponential amount = ${fmt(y)} · Matched line = ${fmt(linear)} · First-unit change = ${fmt(s.initial*(s.factor-1))}`,formula:`y = ${s.initial} × ${s.factor}ᵗ; t = log base ${s.factor} of (y/${s.initial})`,note:'The line shares the initial value and first time step. Its later values need not match the multiplicative model.'};
}
const api={fmt,mean,median,probability,value,task,lab};
if(typeof module==='object'&&module.exports)module.exports=api;else root.ClueveraCourseGraphs=api;
})(typeof window==='undefined'?globalThis:window);
