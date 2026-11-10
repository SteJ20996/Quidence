(function(root){
'use strict';
const M=root.AD01Math;
let serial=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.abs(n)<.0000001?'0':Number(n.toFixed(4)).toString();
const COLORS={curve:'#6542c0',positive:'#087f76',negative:'#aa4c13',secant:'#a25117',tangent:'#087f76',muted:'#52647b'};
function plot({title,description,xmin=-2.5,xmax=2.5,ymin=-2,ymax=6,xstep=0,ystep=0,xlabel='x',ylabel='y',draw}){
 const W=620,H=310,L=54,R=22,T=30,B=45,pw=W-L-R,ph=H-T-B,id='ad-plot-'+(++serial);
 const X=x=>L+(x-xmin)/(xmax-xmin)*pw,Y=y=>T+(ymax-y)/(ymax-ymin)*ph;
 const line=(x1,y1,x2,y2,color,cls='')=>`<path d="M${X(x1)} ${Y(y1)}L${X(x2)} ${Y(y2)}" fill="none" stroke="${color}" ${cls.includes("stroke-width")?"":"stroke-width=\"2.4\""} ${cls}/>`;
 // Keep annotations readable when a point approaches the frame. Data still clips to the plot.
 const labels=[],labelBoxes=[];
 const text=(x,y,s,color=COLORS.muted,dx=9,dy=-10)=>{
  const width=String(s).length*8.5,tx=Math.max(L+6,Math.min(W-R-width-6,X(x)+dx));let ty;
  for(const offset of[0,-22,22,-44,44]){ty=Math.max(T+18,Math.min(H-B-7,Y(y)+dy+offset));if(!labelBoxes.some(b=>tx<b.x+b.width+5&&tx+width+5>b.x&&Math.abs(ty-b.y)<19))break;}
  labelBoxes.push({x:tx,y:ty,width});labels.push(`<text x="${tx}" y="${ty}" fill="${color}" class="plot-label">${esc(s)}</text>`);return'';
 };
 const point=(x,y,label='',color=COLORS.curve,open=false,dx=10,dy=-10)=>`<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="${open?'white':color}" stroke="${color}" stroke-width="2.3"/>${label?text(x,y,label,color,dx,dy):''}`;
 const curve=(f,color=COLORS.curve,a=xmin,b=xmax,dash=false)=>{const n=220,pts=Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return`${i?'L':'M'}${X(x).toFixed(2)} ${Y(f(x)).toFixed(2)}`;});return`<path d="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="3" ${dash?'stroke-dasharray="7 5"':''}/>`;};
 const area=(f,a,b,roots=[0],orientation=1)=>{
  if(a>b)[a,b]=[b,a];if(a===b)return'';
  const cuts=[a,...roots.filter(x=>x>a&&x<b),b];return cuts.slice(1).map((end,i)=>{const start=cuts[i],mid=(start+end)/2,color=f(mid)*orientation>=0?COLORS.positive:COLORS.negative,n=70,points=Array.from({length:n+1},(_,j)=>{const x=start+(end-start)*j/n;return`${X(x)},${Y(f(x))}`;});return`<polygon points="${X(start)},${Y(0)} ${points.join(' ')} ${X(end)},${Y(0)}" fill="${color}" opacity=".17"/>`;}).join('');
 };
 const rect=(r)=>`<rect x="${X(r.left)}" y="${Y(Math.max(0,r.height))}" width="${pw*r.width/(xmax-xmin)}" height="${ph*Math.abs(r.height)/(ymax-ymin)}" fill="${r.height>=0?COLORS.positive:COLORS.negative}" fill-opacity=".16" stroke="${r.height>=0?COLORS.positive:COLORS.negative}" stroke-width=".9"/>`;
 let grid='';
 const step=(max,min,given)=>given||Math.max(1,Math.ceil((max-min)/7)),tick=v=>String(+v.toFixed(4));
 const sx=step(xmax,xmin,xstep),sy=step(ymax,ymin,ystep);
 for(let i=Math.ceil(xmin/sx-1e-9);i*sx<=xmax+1e-9;i++){const x=i*sx;grid+=line(x,ymin,x,ymax,'#e8eaf1','stroke-width="1"')+`<text x="${X(x)}" y="${H-22}" text-anchor="middle" class="tick">${tick(x)}</text>`;}
 for(let i=Math.ceil(ymin/sy-1e-9);i*sy<=ymax+1e-9;i++){const y=i*sy;grid+=line(xmin,y,xmax,y,'#e8eaf1','stroke-width="1"')+`<text x="${L-10}" y="${Y(y)+4}" text-anchor="end" class="tick">${tick(y)}</text>`;}
 const axes=(xmin<=0&&xmax>=0?line(0,ymin,0,ymax,'#99a7bc'):'')+(ymin<=0&&ymax>=0?line(xmin,0,xmax,0,'#99a7bc'):'');
 const marks=draw({line,text,point,curve,area,rect,X,Y});
 return`<figure class="graph-figure"><svg class="calculus-graph" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc><defs><clipPath id="${id}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs>${grid}${axes}<g clip-path="url(#${id})">${marks}</g><g class="plot-annotations">${labels.join('')}</g><text x="${W-R}" y="${H-7}" text-anchor="end" class="axis-label">${esc(xlabel)}</text><text x="${L}" y="17" class="axis-label">${esc(ylabel)}</text></svg><figcaption>${esc(description)}</figcaption></figure>`;
}
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',sup=n=>(n<0?'⁻':'')+String(Math.abs(n)).split('').map(d=>SUP[d]).join('');
// An error band (horizontal) and, when one exists, a window (vertical) that keeps every output inside it.
function bandMarks(g,x0,x1,center,eps,target,delta,ymin,ymax){
 // Narrow bands and windows are drawn at least 5 units wide, as solid strips: dashed edges that close would merge
 // into a smear. The readout gives the exact width.
 const MIN=5,lo=Math.max(ymin,center-eps),hi=Math.min(ymax,center+eps),bandH=g.Y(lo)-g.Y(hi);
 let s=bandH>=MIN?`<rect x="${g.X(x0)}" y="${g.Y(hi)}" width="${g.X(x1)-g.X(x0)}" height="${bandH}" fill="${COLORS.positive}" fill-opacity=".14"/>`+g.line(x0,center-eps,x1,center-eps,COLORS.positive,'stroke-width="1.4" stroke-dasharray="5 4"')+g.line(x0,center+eps,x1,center+eps,COLORS.positive,'stroke-width="1.4" stroke-dasharray="5 4"')
  :`<rect x="${g.X(x0)}" y="${g.Y(center)-MIN/2}" width="${g.X(x1)-g.X(x0)}" height="${MIN}" fill="${COLORS.positive}" fill-opacity=".5"/>`;
 if(delta!==null){const w=g.X(target+delta)-g.X(target-delta);
  s+=w>=MIN?`<rect x="${g.X(target-delta)}" y="${g.Y(ymax)}" width="${w}" height="${g.Y(ymin)-g.Y(ymax)}" fill="${COLORS.secant}" fill-opacity=".09"/>`+g.line(target-delta,ymin,target-delta,ymax,COLORS.secant,'stroke-width="1.4" stroke-dasharray="3 4"')+g.line(target+delta,ymin,target+delta,ymax,COLORS.secant,'stroke-width="1.4" stroke-dasharray="3 4"')
   :`<rect x="${g.X(target)-MIN/2}" y="${g.Y(ymax)}" width="${MIN}" height="${g.Y(ymin)-g.Y(ymax)}" fill="${COLORS.secant}" fill-opacity=".3"/>`;}
 return s;
}
function ninesGraphs(n,eps){
 const terms=Array.from({length:n},(_,i)=>i+1),from=eps===null?null:M.ninesInside(eps);
 const bandText=eps===null?'':` Error band 1 ± ${fmt(eps)}: from n = ${from} on, every term is inside it.`;
 return plot({title:'0.9, 0.99, 0.999, … and the number 1',description:`The term${n>1?`s 1 − 10${sup(-1)} to 1 − 10${sup(-n)} lie`:` 1 − 10${sup(-1)} lies`} below the dashed line y = 1.${n>=3?' From n = 3 on the gap is too small to see at this scale.':''}${bandText} The list never ends; 0.999… names its limit, 1.`,xmin:0,xmax:12.5,ymin:.85,ymax:1.03,xstep:2,ystep:.05,xlabel:'n (number of nines)',ylabel:'value',draw:g=>(eps===null?'':bandMarks(g,0,12.5,1,eps,0,null,.85,1.03))+g.line(0,1,12.5,1,COLORS.muted,'stroke-dasharray="6 5"')+terms.map(k=>g.point(k,M.nines(k),k===n?`n = ${n}`:'',eps!==null&&k>=from?COLORS.positive:COLORS.curve)).join('')})
  +plot({title:'The gap to 1, on a log scale',description:`log₁₀ of the gap 10${sup(-n)} is −${n}: each extra nine moves the gap down one step.${eps===null?'':` The dashed line is at log₁₀ ${fmt(eps)} = ${fmt(Math.log10(eps)).replace('-','−')}; the gap drops below it at n = ${from} and stays below.`} However low the line is set, the gaps eventually drop below it.`,xmin:0,xmax:12.5,ymin:-12.5,ymax:0,xstep:2,ystep:2,xlabel:'n (number of nines)',ylabel:'log₁₀ of the gap',draw:g=>(eps===null?'':g.line(0,Math.log10(eps),12.5,Math.log10(eps),COLORS.positive,'stroke-dasharray="6 5"'))+g.line(1,-1,n,-n,'#c6cbd8')+terms.map(k=>g.point(k,-k,k===n?`gap 10${sup(-k)}`:'',eps!==null&&k>=from?COLORS.positive:COLORS.curve)).join('')});
}
function wiggleGraph(distance,side,eps){
 const x=side*distance,y=M.limitValue('wiggle',x),xmin=-.6,xmax=.6,ymin=-.65,ymax=.65;
 const half=(a,b)=>{const n=900;return Array.from({length:n+1},(_,i)=>{const t=a+(b-a)*i/n;return t;});};
 const bandText=eps===null?'':` Error band 0 ± ${fmt(eps)}, with the window of x within ${fmt(eps)} of 0: for every x ≠ 0 there, |f(x)| ≤ |x| < ${fmt(eps)}.`;
 return plot({title:'A wiggle that keeps landing on its limit',description:`f(x) = x·sin(1/x) is undefined at 0 and stays between the dashed lines y = x and y = −x. It equals 0 at x = 1/(kπ) for every whole number k, so in every window around 0. Its limit at 0 is 0. Moving point: x = ${fmt(x)}, f(x) = ${fmt(y)}.${bandText}`,xmin,xmax,ymin,ymax,xstep:.2,ystep:.25,draw:g=>{
  const path=pts=>`<path d="${pts.map((t,i)=>`${i?'L':'M'}${g.X(t).toFixed(2)} ${g.Y(t*Math.sin(1/t)).toFixed(2)}`).join(' ')}" fill="none" stroke="${COLORS.curve}" stroke-width="2.2"/>`;
  return (eps===null?'':bandMarks(g,xmin,xmax,0,eps,0,M.bandWindow('wiggle',eps),ymin,ymax))+g.line(xmin,xmin,xmax,xmax,'#99a7bc','stroke-width="1.3" stroke-dasharray="5 5"')+g.line(xmin,-xmin,xmax,-xmax,'#99a7bc','stroke-width="1.3" stroke-dasharray="5 5"')+path(half(xmin,-.0008))+path(half(.0008,xmax))+g.point(0,0,'f(0) undefined',COLORS.curve,true,-150,78)+g.point(x,y,'moving',COLORS.positive,true,12,-19);
 }});
}
function limits(kind,distance,side,eps=null){
 if(kind==='nines')return ninesGraphs(distance,eps);
 if(kind==='wiggle')return wiggleGraph(distance,side,eps);
 const target=kind==='hole'?1:0,x=target+side*distance,y=M.limitValue(kind,x),left=kind==='hole'?2:-1,right=kind==='hole'?2:1,value=kind==='hole'?4:1;
 const description=`Moving point: x = ${fmt(x)}, f(x) = ${fmt(y)}. At the target ${target}, f(${target}) = ${value}. Left-hand limit: ${left}; right-hand limit: ${right}.`+(eps===null?'':kind==='hole'?` Error band 2 ± ${fmt(eps)}, with the window of x within ${fmt(eps)} of 1: for every x ≠ 1 there, |f(x) − 2| = |x − 1| < ${fmt(eps)}. The filled dot f(1) = 4 is not part of the test.`:` Error band 0 ± ${fmt(eps)}: just left of 0 the outputs are −1 and just right they are 1. A band of ±1 or narrower cannot hold both, wherever it is centred, so no window works.`);
 return plot({title:kind==='hole'?'A hole and a separate function value':'Different limits at a jump',description,xmin:-1,xmax:3,ymin:-2,ymax:5,draw:g=>{
  const path=kind==='hole'?g.curve(x=>x+1):g.curve(()=>-1,COLORS.curve,-1,0)+g.curve(()=>1,COLORS.curve,0,3);
  return (eps===null?'':bandMarks(g,-1,3,kind==='hole'?2:0,eps,target,M.bandWindow(kind,eps),-2,5))+path+g.line(target,-2,target,5,'#c1bfd3','stroke-dasharray="4 5"')+g.point(target,left,'open',COLORS.curve,true,-52,20)+(kind==='hole'?g.point(1,4,'f(1) = 4'):g.point(0,1,'f(0) = 1'))+g.point(x,y,'moving',COLORS.positive,true,12,-19);
 }});
}
function derivative(id,a,h,showDerivative){
 const f=M.FUNCTIONS[id],m=M.secant(id,a,h),t=f.derivative(a),y=f.value(a),q=f.value(a+h),description=`P = (${fmt(a)}, ${fmt(y)}); Q = (${fmt(a+h)}, ${fmt(q)}). Secant slope ${fmt(m)}. ${t===null?'No derivative at this corner.':`Tangent slope ${fmt(t)}.`}`;
 let html=plot({title:f.label+' · secant and tangent',description,xmin:-3.2,xmax:3.2,ymin:-1,ymax:id==='absolute'?4:10,draw:g=>g.curve(f.value)+(t===null?'':g.curve(x=>y+t*(x-a),COLORS.tangent))+g.curve(x=>y+m*(x-a),COLORS.secant,-3.2,3.2,true)+g.line(a,y,a+h,y,'#8795ac','stroke-dasharray="3 3"')+g.line(a+h,y,a+h,q,'#8795ac','stroke-dasharray="3 3"')+g.point(a,y,'P',COLORS.curve,false,-20,-13)+g.point(a+h,q,'Q',COLORS.secant,false,12,23)});
 if(showDerivative)html+=plot({title:id==='square'?'The derivative f′(x) = 2x':'The derivative of |x| away from 0',description:id==='square'?`f′(${fmt(a)}) = ${fmt(2*a)}. This graph plots slopes, not the original function values.`:'f′(x) = −1 for x < 0 and 1 for x > 0; f′(0) is undefined.',ymin:-5,ymax:5,ylabel:'f′(x)',draw:g=>id==='square'?g.curve(x=>2*x,COLORS.tangent)+g.point(a,2*a,'slope',COLORS.tangent):g.curve(()=>-1,COLORS.tangent,-2.5,0)+g.curve(()=>1,COLORS.tangent,0,2.5)+g.point(0,-1,'',COLORS.tangent,true)+g.point(0,1,'undefined at 0',COLORS.tangent,true)});
 return html;
}
function integral(id,b,n,method){const a=id==='square'?0:-2,f=M.FUNCTIONS[id],r=M.riemann(id,a,b,n,method),exact=M.integral(id,a,b),total=M.totalArea(id,a,b);return plot({title:f.label+' · rectangle approximation',description:`On [${a}, ${fmt(b)}], ${n} ${method} rectangles give ${fmt(r.sum)}. Exact signed integral: ${fmt(exact)}. Total geometric area: ${fmt(total)}.`,xmin:-2.5,xmax:2.5,ymin:-2.5,ymax:4.5,draw:g=>g.area(f.value,a,b)+r.rectangles.map(g.rect).join('')+g.curve(f.value)+g.line(a,0,a,f.value(a),'#52647b')+g.line(b,0,b,f.value(b),'#52647b')});}
function connection(x,h){
 const f=M.FUNCTIONS.rate.value,A=M.accumulation,rate=f(x),change=A(x+h)-A(x),slope=change/h;
 const xmin=Math.min(-2.3,x+h-.2),xmax=Math.max(2.3,x+h+.2),top=Math.max(f(xmin),f(xmax))+1,bound=Math.max(2,Math.abs(A(xmin))+.3,Math.abs(A(xmax))+.3);
 return plot({title:'Original rate f(t) = t² − 1',description:`Oriented accumulation from 0 to ${fmt(x)}: A(x) = ${fmt(A(x))}. Original height f(x) = ${fmt(rate)}.${x<0?' The endpoint is negative, so integration from 0 to x reverses orientation.':''}`,xmin,xmax,ymin:-2,ymax:top,ylabel:'f(t)',xlabel:'t',draw:g=>g.area(f,0,x,[-1,1],x<0?-1:1)+g.area(f,x,x+h,[-1,1],h<0?-1:1)+g.curve(f)+g.line(x,0,x,rate,'#087f76')+g.point(x,rate,'height f(x)',COLORS.positive,false,x<0?12:-80,-13)+g.line(x+h,0,x+h,f(x+h),COLORS.secant,'stroke-dasharray="4 4"')+g.point(x+h,f(x+h),'x+h',COLORS.secant,true,12,24)})+plot({title:'Accumulation A(x) = x³/3 − x',description:`A(${fmt(x)}) = ${fmt(A(x))}. Average change ΔA/h = ${fmt(slope)}. Tangent slope A′(x) = f(x) = ${fmt(rate)}.`,xmin,xmax,ymin:-bound,ymax:bound,ylabel:'A(x)',draw:g=>g.curve(A)+g.curve(t=>A(x)+rate*(t-x),COLORS.tangent)+g.curve(t=>A(x)+slope*(t-x),COLORS.secant,-3.2,3.2,true)+g.point(x,A(x),'A(x)',COLORS.curve,false,-48,30)+g.point(x+h,A(x+h),'A(x+h)',COLORS.secant,false,13,-20)});
}
// Lesson 5. The family view shows five members of x² + C and the one chosen, with the common tangent slope at x = 1;
// the tail view shades the region under 1/x² or 1/x from 1 to b and plots that area against log₁₀ b.
function kinds(kind,c,fn,b){
 if(kind==='family'){
  const x0=1,members=[-2,-1,0,1,2],y0=M.family(x0,c);
  return plot({title:'The family x² + C',description:`Five members, C = −2 to 2, in grey; C = ${fmt(c)} is highlighted. At x = 1 every member has slope 2, because each is an antiderivative of f(x) = 2x.`,xmin:-2.2,xmax:2.2,ymin:-2.5,ymax:7,ylabel:'x² + C',draw:g=>members.map(m=>g.curve(x=>M.family(x,m),'#c6cbd8')).join('')+g.curve(x=>M.family(x,c))+g.curve(x=>y0+2*(x-x0),COLORS.tangent,x0-.85,x0+.85)+g.point(x0,y0,'slope 2 at x = 1',COLORS.tangent)})
   +plot({title:'Their common derivative f(x) = 2x',description:'Moving C shifts the family graph up or down, but this graph stays put: the derivative cannot tell the members apart.',xmin:-2.2,xmax:2.2,ymin:-4.5,ymax:4.5,ylabel:'f(x)',draw:g=>g.curve(x=>2*x)+g.point(x0,2,'f(1) = 2',COLORS.positive)});
 }
 const T=M.TAILS[fn],area=M.tailArea(fn,b),edge=Math.min(b,10.5),shown=b>=1000?'1,000':b>=100?String(Math.round(b)):fmt(b);
 return plot({title:T.label+', shaded from 1 to b',description:`b = ${shown}. The shaded area is ${fmt(area)}.${b>10.5?' The window shows x up to 10.5; the shading continues to b.':''}`,xmin:0,xmax:10.5,ymin:-.15,ymax:1.6,draw:g=>g.area(T.value,1,edge,[])+g.curve(T.value,COLORS.curve,.6,10.5)+g.line(1,0,1,1,COLORS.positive,'stroke-dasharray="4 4"')+(b<=10.5?g.line(b,0,b,T.value(b),COLORS.secant,'stroke-dasharray="4 4"')+g.point(b,T.value(b),'b',COLORS.secant):'')})
  +plot({title:'Area from 1 to b, as b grows',description:fn==='inverse-square'?`Area = 1 − 1/b = ${fmt(area)}. It stays below 1 for every b, and its limit is 1. The grey line is the area under 1/x, for comparison.`:`Area = ln b = ${fmt(area)}. On this log scale each tenfold step in b adds ln 10 ≈ 2.3, so the area has no ceiling. The grey curve is the area under 1/x², which stays below the dashed line at 1.`,xmin:0,xmax:3,ymin:0,ymax:7.5,xlabel:'log₁₀ b',ylabel:'area',draw:g=>g.line(0,1,3,1,COLORS.positive,'stroke-dasharray="6 5"')+g.curve(t=>M.TAILS[fn==='inverse'?'inverse-square':'inverse'].area(10**t),'#c6cbd8')+g.curve(t=>T.area(10**t))+g.point(Math.log10(b),area,'area '+fmt(area),COLORS.curve)});
}
function task(id){
 if(id==='improper-predict')return plot({title:'An endless region',description:'The region under y = 1/x² to the right of x = 1 never ends; the picture is cut off at x = 8.5.',xmin:0,xmax:8.5,ymin:-.1,ymax:1.5,draw:g=>g.area(x=>1/(x*x),1,8.5,[])+g.curve(x=>1/(x*x),COLORS.curve,.6,8.5)+g.line(1,0,1,1,COLORS.positive,'stroke-dasharray="4 4"')+g.text(6.4,.2,'continues →',COLORS.muted)});
 if(id==='family-transfer')return plot({title:'Two curves, one derivative',description:'F(x) = x² (lower) and G(x) = x² + 5 (upper), each with its tangent at x = 1. The two tangents are parallel.',xmin:-2.2,xmax:2.2,ymin:-1,ymax:10,draw:g=>g.curve(x=>x*x)+g.curve(x=>x*x+5,COLORS.secant)+g.curve(x=>1+2*(x-1),COLORS.tangent,.2,1.8)+g.curve(x=>6+2*(x-1),COLORS.tangent,.2,1.8)+g.point(1,1,'F',COLORS.curve,false,10,22)+g.point(1,6,'G',COLORS.secant)});
 if(id==='improper-transfer')return plot({title:'Two tails',description:'y = 1/x (upper) and y = 1/x³ (lower), from x = 1 onward. Both start at (1, 1).',xmin:0,xmax:8.5,ymin:-.1,ymax:1.5,draw:g=>g.line(1,0,1,1,COLORS.positive,'stroke-dasharray="4 4"')+g.curve(x=>1/x,COLORS.secant,1,8.5)+g.curve(x=>1/(x*x*x),COLORS.curve,1,8.5)+g.point(4,.25,'1/x',COLORS.secant)+g.point(2,.125,'1/x³',COLORS.curve,false,10,22)});
 if(id==='limit-predict')return plot({title:'A nearby trend and a separate dot',description:'For x ≠ 1 the graph follows x + 1. The open circle is (1, 2); the filled dot is (1, 4).',xmin:-1,xmax:3,ymin:-1,ymax:5,draw:g=>g.curve(x=>x+1)+g.point(1,2,'(1, 2) open',COLORS.curve,true,-103,25)+g.point(1,4,'(1, 4) filled')});
 if(id==='limit-transfer')return plot({title:'A new hole example',description:'For x ≠ 2, f(x) = x + 2. Open circle (2, 4); filled dot (2, 1).',xmin:-1,xmax:4,ymin:0,ymax:7,draw:g=>g.curve(x=>x+2)+g.point(2,4,'(2, 4) open',COLORS.curve,true,-107,-14)+g.point(2,1,'(2, 1) filled')});
 if(id==='jump-transfer')return plot({title:'A new jump example',description:'f(x) = 0 for x < 0; f(x) = 3 for x ≥ 0. Open circle (0, 0); filled dot (0, 3).',ymin:-1,ymax:4,draw:g=>g.curve(()=>0,COLORS.curve,-2.5,0)+g.curve(()=>3,COLORS.curve,0,2.5)+g.point(0,0,'open',COLORS.curve,true)+g.point(0,3,'filled')});
 if(id==='derivative-predict')return plot({title:'f(x) = x² near x = −1',description:'At (−1, 1), the curve is falling from left to right; the green line is its tangent.',ymin:-1,ymax:7,draw:g=>g.curve(x=>x*x)+g.curve(x=>-2*x-1,COLORS.tangent)+g.point(-1,1,'(−1, 1)')});
 if(id==='derivative-transfer')return plot({title:'A tangent to x³',description:'P = (−1, −1). Along its tangent, a run of 1 reaches (0, 2), a rise of 3.',ymin:-5,ymax:5,draw:g=>g.curve(x=>x**3)+g.curve(x=>3*x+2,COLORS.tangent)+g.line(-1,-1,0,-1,'#52647b','stroke-dasharray="3 3"')+g.line(0,-1,0,2,'#52647b','stroke-dasharray="3 3"')+g.point(-1,-1,'P')+g.text(-.6,-1,'run 1','#52647b',0,20)+g.text(0,.5,'rise 3')});
 if(id==='corner-transfer')return plot({title:'A corner at x = 0',description:'f(x) = |x| is continuous at 0. Left-hand slope: −1; right-hand slope: 1.',ymin:-1,ymax:3,draw:g=>g.curve(Math.abs)+g.point(0,0,'corner')});
 if(id==='integral-predict')return plot({title:'Equal regions on opposite sides of the axis',description:'f(x) = x on [−2, 2]. One triangular region lies below the axis and one equally sized region lies above it.',ymin:-3,ymax:3,draw:g=>g.area(x=>x,-2,2)+g.curve(x=>x)});
 if(id==='constant-transfer')return plot({title:'Constant velocity',description:'v(t) = 3 m/s on [0, 4 s]. The shaded rectangle has height 3 and width 4.',xmin:-.5,xmax:4.5,ymin:-1,ymax:4,xlabel:'t (s)',ylabel:'v(t) (m/s)',draw:g=>g.area(()=>3,0,4)+g.curve(()=>3,COLORS.curve,0,4)+g.line(0,0,0,3,'#087f76')+g.line(4,0,4,3,'#087f76')});
 if(id==='signed-transfer')return plot({title:'Velocity changes sign',description:'v(t) = t − 2 m/s from 0 to 4 s. The signed contributions are −2 m and +2 m.',xmin:-.5,xmax:4.5,ymin:-3,ymax:3,xlabel:'t (s)',ylabel:'v(t) (m/s)',draw:g=>g.area(t=>t-2,0,4,[2])+g.curve(t=>t-2,COLORS.curve,0,4)+g.text(.5,-.7,'−2 m',COLORS.negative)+g.text(2.7,.6,'+2 m',COLORS.positive)});
 if(id==='connection-transfer')return plot({title:'B(x) = x² − 1',description:'The accumulation B(x) = ∫₁ˣ 2t dt. The highlighted point is (1.5, 1.25).',ymin:-2,ymax:5,draw:g=>g.curve(x=>x*x-1)+g.point(1.5,1.25,'(1.5, 1.25)',COLORS.curve,false,-115,-12)});
 return plot({title:'Original rate f(x) = x² − 1',description:'The continuous rate is zero at −1 and 1, below the axis between them, and above the axis outside them. f(0) = −1.',ymin:-2,ymax:5,ylabel:'f(x)',draw:g=>g.curve(M.FUNCTIONS.rate.value)+g.point(-1,0,'−1',COLORS.curve,false,-20,23)+g.point(1,0,'1',COLORS.curve,false,10,23)+g.point(0,-1,'(0, −1)',COLORS.curve,false,12,-14)});
}
root.AD01Graphs={plot,limits,derivative,integral,connection,kinds,task,fmt,COLORS};
})(window);
