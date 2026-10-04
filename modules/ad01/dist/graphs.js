(function(root){
'use strict';
const M=root.AD01Math;
let serial=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.abs(n)<.0000001?'0':Number(n.toFixed(4)).toString();
const COLORS={curve:'#6542c0',positive:'#087f76',negative:'#aa4c13',secant:'#a25117',tangent:'#087f76',muted:'#52647b'};
function plot({title,description,xmin=-2.5,xmax=2.5,ymin=-2,ymax=6,xlabel='x',ylabel='y',draw}){
 const W=620,H=310,L=54,R=22,T=30,B=45,pw=W-L-R,ph=H-T-B,id='ad-plot-'+(++serial);
 const X=x=>L+(x-xmin)/(xmax-xmin)*pw,Y=y=>T+(ymax-y)/(ymax-ymin)*ph;
 const line=(x1,y1,x2,y2,color,cls='')=>`<path d="M${X(x1)} ${Y(y1)}L${X(x2)} ${Y(y2)}" fill="none" stroke="${color}" ${cls.includes("stroke-width")?"":"stroke-width=\"2.4\""} ${cls}/>`;
 const text=(x,y,s,color=COLORS.muted,dx=9,dy=-10)=>`<text x="${X(x)+dx}" y="${Y(y)+dy}" fill="${color}" class="plot-label">${esc(s)}</text>`;
 const point=(x,y,label='',color=COLORS.curve,open=false,dx=10,dy=-10)=>`<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="${open?'white':color}" stroke="${color}" stroke-width="2.3"/>${label?text(x,y,label,color,dx,dy):''}`;
 const curve=(f,color=COLORS.curve,a=xmin,b=xmax,dash=false)=>{const n=220,pts=Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return`${i?'L':'M'}${X(x).toFixed(2)} ${Y(f(x)).toFixed(2)}`;});return`<path d="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="3" ${dash?'stroke-dasharray="7 5"':''}/>`;};
 const area=(f,a,b,roots=[0],orientation=1)=>{
  if(a>b)[a,b]=[b,a];if(a===b)return'';
  const cuts=[a,...roots.filter(x=>x>a&&x<b),b];return cuts.slice(1).map((end,i)=>{const start=cuts[i],mid=(start+end)/2,color=f(mid)*orientation>=0?COLORS.positive:COLORS.negative,n=70,points=Array.from({length:n+1},(_,j)=>{const x=start+(end-start)*j/n;return`${X(x)},${Y(f(x))}`;});return`<polygon points="${X(start)},${Y(0)} ${points.join(' ')} ${X(end)},${Y(0)}" fill="${color}" opacity=".17"/>`;}).join('');
 };
 const rect=(r)=>`<rect x="${X(r.left)}" y="${Y(Math.max(0,r.height))}" width="${pw*r.width/(xmax-xmin)}" height="${ph*Math.abs(r.height)/(ymax-ymin)}" fill="${r.height>=0?COLORS.positive:COLORS.negative}" fill-opacity=".16" stroke="${r.height>=0?COLORS.positive:COLORS.negative}" stroke-width=".9"/>`;
 let grid='';
 const step=(max,min)=>Math.max(1,Math.ceil((max-min)/7));
 for(let x=Math.ceil(xmin/step(xmax,xmin))*step(xmax,xmin);x<=xmax;x+=step(xmax,xmin))grid+=line(x,ymin,x,ymax,'#e8eaf1','stroke-width="1"')+`<text x="${X(x)}" y="${H-22}" text-anchor="middle" class="tick">${x}</text>`;
 for(let y=Math.ceil(ymin/step(ymax,ymin))*step(ymax,ymin);y<=ymax;y+=step(ymax,ymin))grid+=line(xmin,y,xmax,y,'#e8eaf1','stroke-width="1"')+`<text x="${L-10}" y="${Y(y)+4}" text-anchor="end" class="tick">${y}</text>`;
 const axes=(xmin<=0&&xmax>=0?line(0,ymin,0,ymax,'#99a7bc'):'')+(ymin<=0&&ymax>=0?line(xmin,0,xmax,0,'#99a7bc'):'');
 return`<figure class="graph-figure"><svg class="calculus-graph" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc><defs><clipPath id="${id}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs>${grid}${axes}<g clip-path="url(#${id})">${draw({line,text,point,curve,area,rect,X,Y})}</g><text x="${W-R}" y="${H-7}" text-anchor="end" class="axis-label">${esc(xlabel)}</text><text x="${L}" y="17" class="axis-label">${esc(ylabel)}</text></svg><figcaption>${esc(description)}</figcaption></figure>`;
}
function limits(kind,distance,side){
 const target=kind==='hole'?1:0,x=target+side*distance,y=M.limitValue(kind,x),left=kind==='hole'?2:-1,right=kind==='hole'?2:1,value=kind==='hole'?4:1;
 const description=`Moving point: x = ${fmt(x)}, f(x) = ${fmt(y)}. At the target ${target}, f(${target}) = ${value}. Left-hand limit: ${left}; right-hand limit: ${right}.`;
 return plot({title:kind==='hole'?'A hole and a separate function value':'Different limits at a jump',description,xmin:-1,xmax:3,ymin:-2,ymax:5,draw:g=>{
  const path=kind==='hole'?g.curve(x=>x+1):g.curve(()=>-1,COLORS.curve,-1,0)+g.curve(()=>1,COLORS.curve,0,3);
  return path+g.line(target,-2,target,5,'#c1bfd3','stroke-dasharray="4 5"')+g.point(target,left,'open',COLORS.curve,true,-52,20)+(kind==='hole'?g.point(1,4,'f(1) = 4'):g.point(0,1,'f(0) = 1'))+g.point(x,y,'moving',COLORS.positive,true,12,-19);
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
function task(id){
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
root.AD01Graphs={plot,limits,derivative,integral,connection,task,fmt,COLORS};
})(window);
