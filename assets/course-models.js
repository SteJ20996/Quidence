(function(root){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n.toFixed(3)).toString();
let serial=0;
function graphic(title,description,body){const id='model-'+(++serial);return`<figure class="graph-figure"><svg class="calculus-graph course-model-graph" viewBox="0 0 520 300" role="img" aria-labelledby="${id}-t ${id}-d"><title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(description)}</desc>${body}</svg><figcaption>${esc(description)}</figcaption></figure>`;}
function table(title,headers,rows,note,kind){return`<figure class="graph-figure"><div class="table-wrap"><table class="summary-table${kind?' '+kind:''}"><caption>${esc(title)}</caption><thead><tr>${headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>`<${i?'td':'th scope="row"'}>${x&&typeof x==='object'?x.html:esc(x)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>${note?`<figcaption>${esc(note)}</figcaption>`:''}</figure>`;}
function cartesian(title,series,{xmin=0,xmax=12,ymin=0,ymax=12,xlabel='x',ylabel='y',point,left=70,ylabelX=12,xticks,yticks}={}){
 const px=x=>left+(x-xmin)/(xmax-xmin)*(470-left),py=y=>240-(y-ymin)/(ymax-ymin)*195,clip='model-clip-'+(++serial);
 let b=`<defs><clipPath id="${clip}"><rect x="${left}" y="45" width="${470-left}" height="195"/></clipPath></defs>`;
 const ticks=(lo,hi)=>{const step=(hi-lo)/4;let values=Array.from({length:5},(_,i)=>lo+step*i);if(lo<0&&hi>0&&!values.some(x=>Math.abs(x)<1e-9)){values=values.filter((x,i)=>i===0||i===4||Math.abs(x)>step*.6);values.push(0);}return values.sort((a,b)=>a-b);};
 for(const x of (xticks||ticks(xmin,xmax)))b+=`<path d="M${px(x)} 45V240" stroke="#e4e8ef"/><text x="${px(x)}" y="262" text-anchor="middle" class="tick">${fmt(x)}</text>`;
 for(const y of (yticks||ticks(ymin,ymax)))b+=`<path d="M${left} ${py(y)}H470" stroke="#e4e8ef"/><text x="${left-10}" y="${py(y)+4}" text-anchor="end" class="tick">${fmt(y)}</text>`;
 b+=`<path d="M${left} 45V240H470" fill="none" stroke="#8391a5"/>`;
 if(ymin<0&&ymax>0)b+=`<path data-zero-axis="y" d="M${left} ${py(0)}H470" stroke="#8391a5"/>`;
 if(xmin<0&&xmax>0)b+=`<path data-zero-axis="x" d="M${px(0)} 45V240" stroke="#8391a5"/>`;
 series.forEach((s,j)=>{let d='',previous=null;for(let i=0;i<=240;i++){const x=xmin+(xmax-xmin)*i/240,y=s.fn(x);if(y===null||!Number.isFinite(y)){previous=null;continue;}const split=s.gap!==undefined&&previous!==null&&(previous-s.gap)*(x-s.gap)<=0;d+=(previous===null||split?'M':'L')+fmt(px(x))+' '+fmt(py(y))+' ';previous=x;}b+=`<path d="${d}" clip-path="url(#${clip})" fill="none" stroke="${j?'#087f76':'#6542c0'}" stroke-width="3" ${j?'stroke-dasharray="7 4"':''}/>`;});
 if(point&&point.every(Number.isFinite)&&point[0]>=xmin&&point[0]<=xmax&&point[1]>=ymin&&point[1]<=ymax)b+=`<circle cx="${px(point[0])}" cy="${py(point[1])}" r="5" fill="#a84324"/>`;
 b+=`<text x="270" y="291" text-anchor="middle" class="axis-label">${esc(xlabel)}</text><text x="${ylabelX}" y="145" transform="rotate(-90 ${ylabelX} 145)" text-anchor="middle" class="axis-label">${esc(ylabel)}</text>`;
 return '<div class="course-model-legend">'+series.map((s,j)=>'<span>'+ (j?'Dashed: ':'Solid: ')+esc(s.label)+'</span>').join('')+'</div>'+graphic(title,title+'. '+series.map(s=>s.label).join('; ')+'. Axes: '+xlabel+', '+ylabel+'.',b);
}
const market=shift=>({price:6+shift/2,quantity:6+shift/2});
const midpointElasticity=(p1,q1,p2,q2)=>Math.abs(((q2-q1)/((q1+q2)/2))/((p2-p1)/((p1+p2)/2)));
const unitRatio=(parts,whole)=>parts/whole;
function model(course,index,s){
 let graph,readout,formula,note='Values describe this example. Explain how the picture supports your answer.';
 if(course==='pre-algebra'){
  if(index===0){const end=s.start+s.change;let b='<path d="M50 155H470" stroke="#8391a5"/>';const px=x=>50+(x+10)*21;for(let x=-10;x<=10;x+=5)b+=`<path d="M${px(x)} 149V161" stroke="#8391a5"/><text x="${px(x)}" y="182" text-anchor="middle" class="tick">${x}</text>`;b+=`<path d="M${px(s.start)} 118H${px(end)}" stroke="#6542c0" stroke-width="4"/><circle cx="${px(s.start)}" cy="118" r="5" fill="#087f76"/><circle cx="${px(end)}" cy="118" r="6" fill="#a84324"/><text x="260" y="70" text-anchor="middle" class="axis-label">${s.start} + (${s.change}) = ${end}</text><text x="260" y="235" text-anchor="middle" class="tick">Start: ${s.start} · Change: ${s.change} · End: ${end}</text>`;graph=graphic('Signed change on a number line',`Start at ${s.start}; add ${s.change}; end at ${end}.`,b);readout=`Start ${s.start} · Change ${s.change} · End ${end}`;formula=`${s.start} + (${s.change}) = ${end}`;}
  if(index===1){const w=400/s.denominator;let b='';for(let i=0;i<s.denominator;i++)b+=`<rect x="${60+i*w}" y="100" width="${w}" height="70" fill="${i<s.numerator?'#dcd3f3':'#f1f4f8'}" stroke="#8595ac"/>`;b+=`<text x="260" y="65" text-anchor="middle" class="axis-label">${s.numerator}/${s.denominator} of one whole</text>`;graph=graphic('Equal parts of one whole',`${s.numerator} shaded parts among ${s.denominator} equal parts.`,b);readout=`Fraction = ${s.numerator}/${s.denominator} · Decimal = ${fmt(unitRatio(s.numerator,s.denominator))}`;formula='A fraction compares a number of equal parts with the parts in one whole.';}
  if(index===2){graph=table('Constant unit price',['Items','Total cost ($)'],[1,2,3,5].map(n=>[n,n*s.rate]),'No fixed fee. The cost per item remains constant.');readout=`Unit price = $${s.rate} · Five items cost $${5*s.rate}`;formula=`Cost = ${s.rate} × number of items`;} 
  if(index===3){graph=table('Evaluate the same expression',['x','2x + 3'],[-2,0,2,s.x].map(x=>[x,2*x+3]),'Substitute each input before calculating. Repeated rows can occur when an input matches.');readout=`x = ${s.x} · 2x + 3 = ${2*s.x+3}`;formula=`2(${s.x}) + 3 = ${2*s.x+3}`;}
 }
 if(course==='algebra-1'){
  if(index===0){graph=table('Keep an equation balanced',['Operation','Equivalent equation'],[['Start',`2x + 3 = ${2*s.x+3}`],['Subtract 3',`2x = ${2*s.x}`],['Divide by 2',`x = ${s.x}`]],'Apply the same reversible operation to both sides.');readout=`Solution x = ${s.x} · Substitution: ${2*s.x+3} = ${2*s.x+3}`;formula=`2x + 3 = ${2*s.x+3}`;}
  if(index===1){graph=cartesian('A linear rule',[{label:`y = ${s.m}x + ${s.b}`,fn:x=>s.m*x+s.b}],{xmin:-4,xmax:4,ymin:-12,ymax:12});readout=`Slope = ${s.m} · y-intercept = ${s.b}`;formula=`For an input change of 1, output changes by ${s.m}.`;}
  if(index===2){graph=cartesian('Two simultaneous linear rules',[{label:'y = x + 2',fn:x=>x+2},{label:`y = −x + ${s.b}`,fn:x=>-x+s.b}],{xmin:0,xmax:6,ymin:0,ymax:10,point:[(s.b-2)/2,s.b/2+1]});readout=`Intersection = (${fmt((s.b-2)/2)}, ${fmt(s.b/2+1)})`;formula=`x + 2 = −x + ${s.b}; 2x = ${s.b-2}`;}
  if(index===3){graph=cartesian('A factored quadratic',[{label:`y = (x − 1)(x − ${s.r})`,fn:x=>(x-1)*(x-s.r)}],{xmin:-1,xmax:6,ymin:-8,ymax:16});readout=`Zeros: x = 1 and x = ${s.r}`;formula=`A product is zero when at least one factor is zero.`;}
 }
 if(course==='geometry'){
  if(index===0){const a=s.angle,r=a*Math.PI/180;graph=graphic('Adjacent angles on a straight line',`One angle is ${a} degrees. Its adjacent angle is ${180-a} degrees.`, `<path d="M65 215H455M260 215L${260+145*Math.cos(r)} ${215-145*Math.sin(r)}" stroke="#6542c0" stroke-width="3" fill="none"/><circle cx="260" cy="215" r="4" fill="#a84324"/><text x="260" y="70" text-anchor="middle" class="axis-label">${a}° + ${180-a}° = 180°</text>`);readout=`Adjacent angles: ${a}° and ${180-a}°`;formula='Angles forming a straight line sum to 180°.';}
  if(index===1){const h=Math.sqrt(s.a*s.a+16),scale=24;graph=graphic('Right triangle with perpendicular legs',`Legs ${s.a} and 4; hypotenuse ${fmt(h)}. Equal drawing scale on both axes.`,`<path d="M130 225V${225-4*scale}L${130+s.a*scale} 225Z" fill="#f1edf9" stroke="#6542c0" stroke-width="3"/><path d="M130 211H144V225" fill="none" stroke="#8391a5"/><text x="105" y="179" class="axis-label">4</text><text x="${130+s.a*scale/2}" y="250" text-anchor="middle" class="axis-label">${s.a}</text><text x="${150+s.a*scale/2}" y="162" class="axis-label">c</text>`);readout=`Legs ${s.a}, 4 · c² = ${s.a*s.a+16} · c = ${fmt(h)}`;formula='For a right triangle, a² + b² = c²; c is opposite the right angle.';}
  if(index===2){const k=s.k;graph=table('Similar rectangles',['Measure','Original','Scaled'],[['Width',3,3*k],['Height',2,2*k],['Perimeter',10,10*k],['Area',6,6*k*k]],'Corresponding lengths all multiply by the same positive scale factor.');readout=`Scale factor ${k} · Perimeter factor ${k} · Area factor ${k*k}`;formula='Lengths multiply by k; areas multiply by k².';}
  if(index===3){const scale=25,w=s.width,h=3;graph=graphic('Rectangle measurement',`Width ${w} units and height 3 units. Area ${3*w} square units; perimeter ${2*(w+3)} units.`,`<rect x="110" y="80" width="${w*scale}" height="${h*scale}" fill="#dcd3f3" stroke="#6542c0" stroke-width="2"/><text x="${110+w*scale/2}" y="185" text-anchor="middle" class="axis-label">${w} units</text><text x="95" y="124" text-anchor="end" class="axis-label">3</text>`);readout=`Area ${3*w} square units · Perimeter ${2*(w+3)} units`;formula='A = width × height; P = 2(width + height).';}
 }
 if(course==='algebra-2'){
  if(index===0){graph=cartesian('A cubic with three factors',[{label:`y = (x + 1)(x − 1)(x − ${s.r})`,fn:x=>(x+1)*(x-1)*(x-s.r)}],{xmin:-3,xmax:5,ymin:-20,ymax:20});readout=`Zeros: −1, 1, ${s.r}`;formula='Each distinct linear factor contributes a zero; distant outputs can lie outside the window.';}
  if(index===1){const k=s.k;graph=table('Original rational expression',['Input','(x² − k²)/(x − k)'],[k-1,k,k+1].map(x=>[x,x===k?'Undefined':x+k]),`k = ${k}. Cancellation is valid only when x ≠ k.`);readout=`Simplified rule: x + ${k}, for x ≠ ${k}`;formula=`(x² − ${k*k})/(x − ${k}) = x + ${k}, x ≠ ${k}`;}
  if(index===2){graph=cartesian('Repeated percentage change',[{label:`y = 100(${s.factor})ᵗ`,fn:t=>100*s.factor**t}],{xmin:0,xmax:4,ymin:0,ymax:250,xlabel:'Time (periods)',ylabel:'Amount'});readout=`Factor ${s.factor} · At t = 2: ${fmt(100*s.factor**2)}`;formula=`Amount after t periods = 100 × ${s.factor}ᵗ`;}
  if(index===3){graph=table('Powers and inverse questions',['Exponent x',`${s.base}ˣ`],[0,1,2,3,4].map(x=>[x,s.base**x]),'Read a power from left to right; a logarithm asks for the exponent from the positive output.');readout=`log base ${s.base} of ${s.base**3} = 3`;formula=`log_b(y) = x means bˣ = y, with b > 0, b ≠ 1, y > 0.`;}
 }
 if(course==='basic-logic'){
  const T=v=>({html:`<span class="truth-value"><span class="truth-letter" aria-hidden="true" data-no-translate><span class="truth-en">${v?'T':'F'}</span><span class="truth-es">${v?'V':'F'}</span></span><span class="truth-word">${v?'True':'False'}</span></span>`}),rows=[[1,1],[1,0],[0,1],[0,0]];
  if(index===0){
   const ops={and:['P and Q',(p,q)=>p&&q,'“And” is true only when both parts are true.'],or:['P or Q',(p,q)=>p||q,'“Or” is true when at least one part is true, including both.'],xor:['P or Q, but not both',(p,q)=>p!==q,'The exclusive or is true when exactly one part is true.'],not:['not P',p=>!p,'“Not” gives the opposite truth value.']},[name,fn,rule]=ops[s.op]||ops.and;
   const shown=s.op==='not'?[[1],[0]]:rows,trueRows=shown.filter(r=>fn(!!r[0],!!r[1])).length;
   graph=table('Truth table: '+name,s.op==='not'?['P',name]:['P','Q',name],shown.map(r=>[...r.map(T),T(fn(!!r[0],!!r[1]))]),'T means true and F means false. Each row is one possible case.','truth-table');
   readout=`True rows: ${trueRows} of ${shown.length}`;formula=rule;
  }
  if(index===1){
   const imp=(a,b)=>!a||b,forms={converse:['If Q, then P',(p,q)=>imp(q,p)],inverse:['If not P, then not Q',(p,q)=>imp(!p,!q)],contrapositive:['If not Q, then not P',(p,q)=>imp(!q,!p)]},[name,fn]=forms[s.form]||forms.converse;
   const same=rows.filter(([p,q])=>imp(!!p,!!q)===fn(!!p,!!q)).length;
   graph=table('A conditional and a related statement',['P','Q','If P, then Q',name],rows.map(([p,q])=>[T(p),T(q),T(imp(!!p,!!q)),T(fn(!!p,!!q))]),'T means true and F means false. “If P, then Q” is false only in the row where P is true and Q is false.','truth-table');
   readout=same===4?'Same truth value in all 4 rows':`Same truth value in ${same} of 4 rows`;formula=same===4?`“${name}” is equivalent to “If P, then Q”.`:`“${name}” is a different statement from “If P, then Q”.`;
  }
  if(index===2){
   const imp=(a,b)=>!a||b,forms={mp:['Modus ponens','P',(p,q)=>p,'Q',(p,q)=>q],mt:['Modus tollens','not Q',(p,q)=>!q,'not P',(p,q)=>!p],ac:['Affirming the consequent','Q',(p,q)=>q,'P',(p,q)=>p],da:['Denying the antecedent','not P',(p,q)=>!p,'not Q',(p,q)=>!q]},[name,second,premise,conclusion,result]=forms[s.form]||forms.mp;
   // A premise or conclusion that is just P or Q is read from that column, so the table never repeats a column.
   const extra=[[second,premise],[conclusion,result]].filter(([label])=>!['P','Q'].includes(label));
   const marked=rows.filter(([p,q])=>imp(!!p,!!q)&&premise(!!p,!!q)),bad=marked.find(([p,q])=>!result(!!p,!!q));
   graph=table('Test the form row by row',['P','Q','If P, then Q',...extra.map(([label])=>label),'Premises true?'],rows.map(([p,q])=>[T(p),T(q),T(imp(!!p,!!q)),...extra.map(([,fn])=>T(fn(!!p,!!q))),imp(!!p,!!q)&&premise(!!p,!!q)?'Yes':'No']),`T means true and F means false. Premises: “If P, then Q” and “${second}”. Conclusion: “${conclusion}”. Look only at the rows where both premises are true.`,'truth-table');
   readout=bad?`Invalid: when P is ${bad[0]?'true':'false'} and Q is ${bad[1]?'true':'false'}, the premises are true and the conclusion is false.`:'Valid: every row with true premises has a true conclusion.';formula=name;
  }
  if(index===3){
   // Eight parts of the diagram, one for each choice of inside or outside A, B and C. A brute-force search over which parts are occupied decides validity.
   const has=(r,x)=>!!(r>>'ABC'.indexOf(x)&1),parts=[0,1,2,3,4,5,6,7],forms={barbara:[[['all','A','B'],['all','B','C']],['all','A','C'],'All A are B. All B are C. So all A are C.'],middle:[[['all','A','B'],['all','C','B']],['all','A','C'],'All A are B. All C are B. So all A are C.'],ferio:[[['no','B','C'],['some','A','B']],['someNot','A','C'],'No B are C. Some A are B. So some A are not C.']},[premises,conclusion,text]=forms[s.form]||forms.barbara;
   const holds=(occupied,[q,x,y])=>{const hit=f=>parts.some(r=>occupied[r]&&f(r));return q==='all'?!hit(r=>has(r,x)&&!has(r,y)):q==='no'?!hit(r=>has(r,x)&&has(r,y)):q==='some'?hit(r=>has(r,x)&&has(r,y)):hit(r=>has(r,x)&&!has(r,y));};
   const models=[];for(let m=0;m<256;m++){const occupied=parts.map(r=>!!(m>>r&1));if(premises.every(p=>holds(occupied,p)))models.push(occupied);}
   const counter=models.find(o=>!holds(o,conclusion)),empty=parts.filter(r=>models.every(o=>!o[r])),some=premises.filter(p=>p[0]==='some').map(([,x,y])=>parts.filter(r=>has(r,x)&&has(r,y)&&!empty.includes(r))).filter(c=>c.length===1).map(c=>c[0]);
   const C={A:[215,128],B:[260,205],C:[305,128]},R=82,inside=(r,[x,y])=>['A','B','C'].every(k=>has(r,k)===((x-C[k][0])**2+(y-C[k][1])**2<R*R));
   const centre=r=>{let sx=0,sy=0,n=0;for(let x=120;x<=400;x+=3)for(let y=40;y<=295;y+=3)if(inside(r,[x,y])){sx+=x;sy+=y;n++;}return [sx/n,sy/n];};
   const id='venn-'+(++serial);let defs='',shade='';
   for(const k of 'ABC')defs+=`<clipPath id="${id}-${k}"><circle cx="${C[k][0]}" cy="${C[k][1]}" r="${R}"/></clipPath>`;
   for(const r of empty.filter(r=>r)){const ins=[...'ABC'].filter(k=>has(r,k)),outs=[...'ABC'].filter(k=>!has(r,k));defs+=`<mask id="${id}-m${r}"><rect width="520" height="300" fill="white"/>${outs.map(k=>`<circle cx="${C[k][0]}" cy="${C[k][1]}" r="${R}" fill="black"/>`).join('')}</mask>`;let g=`<rect width="520" height="300" fill="#c9c3d6"/>`;for(const k of ins)g=`<g clip-path="url(#${id}-${k})">${g}</g>`;shade+=`<g mask="url(#${id}-m${r})">${g}</g>`;}
   let body=`<defs>${defs}</defs>${shade}`+Object.entries(C).map(([k,[x,y]])=>`<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="#6542c0" stroke-width="2.5"/><text x="${k==='A'?x-R-14:k==='C'?x+R+6:x+R*0.75}" y="${k==='B'?y+R*0.75+14:y-R+12}" class="axis-label">${k}</text>`).join('');
   for(const r of some){const [x,y]=centre(r);body+=`<text x="${x}" y="${y+7}" text-anchor="middle" font-size="22" fill="#087f76">×</text>`;}
   const red=counter&&parts.find(r=>counter[r]&&(conclusion[0]==='all'?has(r,conclusion[1])&&!has(r,conclusion[2]):has(r,conclusion[1])&&has(r,conclusion[2])));
   if(counter){const [x,y]=centre(red);body+=`<circle cx="${x}" cy="${y}" r="7" fill="#a84324"/>`;}
   // The caption names every marked part, so the diagram can be read without seeing it.
   const part=r=>{const ins=[...'ABC'].filter(k=>has(r,k)),outs=[...'ABC'].filter(k=>!has(r,k));return outs.length?ins.join(' and ')+' outside '+outs.join(' and '):'the part inside all three circles';};
   const caption=`Shaded parts are empty: ${empty.filter(r=>r).map(part).join('; ')}.`+(some.length?` An × marks ${some.map(part).join('; ')}, which must contain something.`:'')+(counter?` The red point, in ${part(red)}, fits both premises but makes the conclusion false.`:' Every diagram that fits the premises shows the conclusion.');
   graph=graphic('Three-set Venn diagram',caption,body);
   readout=counter?'Invalid: one diagram fits the premises but not the conclusion.':'Valid: the premises force the conclusion.';formula=text;note='A part is shaded when no diagram that fits the premises puts anything there.';
  }
 }
 if(!graph)throw new Error('Unknown course model: '+course+' / '+index);
 return{graph,readout,formula,note};
}
const api={model,cartesian,graphic,table,midpointElasticity,unitRatio};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceCourseModels=api;
})(typeof window==='undefined'?globalThis:window);
