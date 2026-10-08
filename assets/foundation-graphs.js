(function(root){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let sequence=0;const tableObservers=new WeakMap();
function table(t){return'<p class="f-table-scroll-hint">Swipe or scroll sideways to view every column. Keyboard users can focus the table and use the left and right arrows.</p><div class="f-table-shell"><div class="f-table-wrap" data-table-scroll tabindex="0" role="region" aria-label="Data table. Scroll horizontally to view all columns."><table><thead><tr>'+t.headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+t.rows.map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><span class="f-table-edge" data-table-edge aria-hidden="true" hidden>→</span></div>';}
function prepareTables(host){
 tableObservers.get(host)?.disconnect();tableObservers.delete(host);
 const updates=[];
 for(const box of host.querySelectorAll('[data-table-scroll]')){
 const edge=box.parentElement?.querySelector('[data-table-edge]');if(!edge)continue;
 const update=()=>{edge.hidden=box.scrollWidth<=box.clientWidth+1||box.scrollLeft+box.clientWidth>=box.scrollWidth-1;};
 update();box.addEventListener('scroll',update,{passive:true});
 updates.push({box,update});
 }
 if(root.ResizeObserver&&updates.length){const observer=new root.ResizeObserver(()=>{for(const {update}of updates)update();});for(const {box}of updates)observer.observe(box);tableObservers.set(host,observer);}
}
function matrix(values){return'<div class="f-matrix" role="img" aria-label="Matrix rows: '+esc(values.map(r=>r.join(', ')).join('; '))+'"><table aria-hidden="true">'+values.map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</table></div>';}
function game(v){return'<figure class="f-game"><figcaption>'+esc(v.description)+'</figcaption>'+table({headers:['A row / B column',...v.cols],rows:v.rows.map((r,i)=>[r,...v.payoffs[i].map(pair=>'('+pair.join(', ')+')')])})+'</figure>';}
function plot(v,width=520){
 const w=Math.max(240,Math.min(620,width)),left=48,right=20,top=22,bottom=42;
 const x0=v.xmin??-2,x1=v.xmax??3,y0=v.ymin??-2,y1=v.ymax??6;
 const equalScale=v.equalScale??!!(v.arrows?.length||v.polygons?.length);
 const h=equalScale?top+bottom+(w-left-right)*(y1-y0)/(x1-x0):280,pw=w-left-right,ph=h-top-bottom;
 const x=n=>left+(n-x0)/(x1-x0)*pw,y=n=>top+(y1-n)/(y1-y0)*ph,fmt=n=>Number(n.toFixed(2)).toString();
 const id='f-plot-'+(++sequence),maxTicks=w<400?4:5;
 function ticks(min,max){for(const step of [0.5,1,2,2.5,5,10,20,50]){const first=Math.ceil(min/step),last=Math.floor(max/step);if(last-first+1<=maxTicks&&last-first>=1)return Array.from({length:last-first+1},(_,i)=>(first+i)*step);}return[min,max];}
 const xt=ticks(x0,x1),yt=ticks(y0,y1);
 let marks='';
 const xgrid=v.unitGrid?Array.from({length:Math.floor(x1)-Math.ceil(x0)+1},(_,i)=>Math.ceil(x0)+i):xt;
 const ygrid=v.unitGrid?Array.from({length:Math.floor(y1)-Math.ceil(y0)+1},(_,i)=>Math.ceil(y0)+i):yt;
 for(const a of xgrid)marks+='<path class="f-grid" d="M'+x(a)+' '+top+'V'+(h-bottom)+'"/>';
 for(const b of ygrid)marks+='<path class="f-grid" d="M'+left+' '+y(b)+'H'+(w-right)+'"/>';
 for(const a of xt)marks+='<text x="'+x(a)+'" y="'+(h-bottom+18)+'" text-anchor="middle">'+fmt(a)+'</text>';
 for(const b of yt)marks+='<text x="'+(left-8)+'" y="'+(y(b)+4)+'" text-anchor="end">'+fmt(b)+'</text>';
 function piecewise(n){const k=v.knots;const i=Math.min(k.length-2,Math.max(0,k.findIndex((p,j)=>j<k.length-1&&n>=p[0]&&n<=k[j+1][0])));const[a,b]=[k[i],k[i+1]];return a[1]+(b[1]-a[1])*(n-a[0])/(b[0]-a[0]);}
 const curve=n=>v.curve==='square'?n*n:v.curve==='absolute'?Math.abs(n):v.curve==='hole'?n+1:v.curve==='jump'?(n<0?-1:1):v.curve==='piecewise'?piecewise(n):v.m*n+v.b;
 const path=(a,b)=>Array.from({length:101},(_,i)=>{const xx=a+(b-a)*i/100;return(i?'L':'M')+x(xx)+' '+y(curve(xx));}).join(' ');
 let data='';
 for(const p of v.polygons||[])data+='<polygon data-polygon="'+esc(p.style)+'" points="'+p.points.map(([a,b])=>x(a)+','+y(b)).join(' ')+'" fill="none" stroke="'+(p.style==='mapped'?'#76519d':'#225e9e')+'" stroke-width="2.5" '+(p.style==='original'?'stroke-dasharray="6 4"':'')+'/>';
 for(const [i,line]of (v.lines||[]).entries())data+='<path data-line="'+esc(line.label)+'" d="M'+x(x0)+' '+y(line.m*x0+line.b)+'L'+x(x1)+' '+y(line.m*x1+line.b)+'" fill="none" stroke="'+(i?'#76519d':'#225e9e')+'" stroke-width="2.5" '+(i?'stroke-dasharray="6 4"':'')+'/>';
 for(const[a,b,height]of v.rectangles||[])data+='<rect class="f-area positive" x="'+x(a)+'" y="'+Math.min(y(0),y(height))+'" width="'+(x(b)-x(a))+'" height="'+Math.abs(y(height)-y(0))+'"/>';
 if(v.area)for(const[a,b]of [[v.area[0],0],[0,v.area[1]]])data+='<path class="f-area '+(curve((a+b)/2)<0?'negative':'positive')+'" d="M'+x(a)+' '+y(0)+' L'+x(a)+' '+y(curve(a))+' L'+x(b)+' '+y(curve(b))+' L'+x(b)+' '+y(0)+'Z"/>';
 if(v.curve!=='none'){
  if(v.curve==='jump')data+='<path class="f-curve" d="'+path(x0,-.001)+' '+path(.001,x1)+'"/>';
  else if(v.curve==='piecewise')data+='<path class="f-curve" d="'+v.knots.map(([a,b],i)=>(i?'L':'M')+x(a)+' '+y(b)).join(' ')+'"/>';
  else data+='<path class="f-curve" d="'+path(x0,x1)+'"/>';
 }
 if(v.segment)data+='<path class="f-secondary" d="M'+x(v.segment[0][0])+' '+y(v.segment[0][1])+' L'+x(v.segment[1][0])+' '+y(v.segment[1][1])+'"/>';
 for(const[a,b,c,d]of v.arrows||[])data+='<path class="f-secondary" marker-end="url(#'+id+'-arrow)" d="M'+x(a)+' '+y(b)+'L'+x(c)+' '+y(d)+'"/>';
 if(v.curve==='hole')data+='<circle class="f-open" cx="'+x(1)+'" cy="'+y(2)+'" r="5"/><circle class="f-dot" cx="'+x(1)+'" cy="'+y(5)+'" r="4"/>';
 if(v.curve==='jump')for(const a of [-1,1])data+='<circle class="f-open" cx="'+x(0)+'" cy="'+y(a)+'" r="5"/>';
 for(const[a,b,label]of v.points||[])data+='<circle class="f-dot" cx="'+x(a)+'" cy="'+y(b)+'" r="4"/>';
 let labels='';for(const[a,b,label]of v.points||[]){
  const polygon=v.hideCoordinates&&(v.polygons||[]).find(p=>p.points.some(([px,py])=>px===a&&py===b));
  const center=polygon?polygon.points.reduce((c,p)=>[c[0]+p[0]/polygon.points.length,c[1]+p[1]/polygon.points.length],[0,0]):null;
  const anchor=center?(a<center[0]?'end':'start'):x(a)>w/2?'end':'start',direction=anchor==='start'?1:-1;
  const arrow=(v.arrows||[]).find(([sx,sy,ex,ey])=>sx===a&&sy===b||ex===a&&ey===b);
  const segment=v.segment,dx=arrow?arrow[2]-arrow[0]:segment?segment[1][0]-segment[0][0]:null;
  const slope=arrow&&dx?(arrow[3]-arrow[1])/dx:segment&&dx?(segment[1][1]-segment[0][1])/dx:v.curve==='square'?2*a:v.curve==='line'?v.m:0;
  let below=center?b<center[1]:slope*direction>=0;
  if(!center){if(below&&y(b)+22>h-bottom-4)below=false;else if(!below&&y(b)-12<top+15)below=true;}
  labels+='<text class="f-point-label" x="'+Math.max(left+4,Math.min(w-right-4,x(a)+(anchor==='end'?-8:8)))+'" y="'+Math.max(center?12:top+15,Math.min(center?h-8:h-bottom-4,y(b)+(below?22:-12)))+'" text-anchor="'+anchor+'" stroke="#fff" stroke-width="4" stroke-linejoin="round" paint-order="stroke">'+esc(label=== ''?'':label+(v.hideCoordinates?'':' ('+a+', '+b+')'))+'</text>';
 }
 return'<figure class="f-figure"><svg viewBox="0 0 '+w+' '+h+'" role="img" aria-labelledby="'+id+'-title '+id+'-desc"><title id="'+id+'-title">Coordinate graph</title><desc id="'+id+'-desc">'+esc(v.description)+'</desc><defs><clipPath id="'+id+'-clip"><rect x="'+left+'" y="'+top+'" width="'+pw+'" height="'+ph+'"/></clipPath><marker id="'+id+'-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path class="f-arrowhead" d="M0 0L7 3.5L0 7Z"/></marker></defs>'+marks+'<g clip-path="url(#'+id+'-clip)"><path class="f-axis" d="M'+x(0)+' '+top+'V'+(h-bottom)+' M'+left+' '+y(0)+'H'+(w-right)+'"/>'+data+'</g>'+labels+'<text x="'+(left+pw/2)+'" y="'+(h-5)+'" text-anchor="middle">'+esc(v.xLabel||'x')+'</text><text x="15" y="'+(top+ph/2)+'" text-anchor="middle" '+(v.yLabel?'transform="rotate(-90 15 '+(top+ph/2)+')"':'')+'>'+esc(v.yLabel||'y')+'</text></svg><figcaption>'+esc(v.description)+'</figcaption></figure>';
}
function numberline(v,width=520){const w=Math.max(240,Math.min(620,width)),left=28,right=w-28,y=42,x=n=>left+(n-v.min)/(v.max-v.min)*(right-left),id='f-line-'+(++sequence);let ticks='';for(let n=v.min;n<=v.max;n+=2)ticks+='<path d="M'+x(n)+' 37v10"/><text x="'+x(n)+'" y="65" text-anchor="middle">'+n+'</text>';return'<figure class="f-figure"><svg viewBox="0 0 '+w+' 80" role="img" aria-labelledby="'+id+'"><title id="'+id+'">'+esc(v.description)+'</title><path class="f-axis" d="M'+left+' '+y+'H'+right+'"/><g class="f-ticks">'+ticks+'</g><circle class="f-dot" cx="'+x(v.start)+'" cy="'+y+'" r="5"/></svg><figcaption>'+esc(v.description)+'</figcaption></figure>';}
function areaStrip(v,width=520){const w=Math.max(240,Math.min(620,width)),scale=Math.min((w-80)/v.width,45),x=55,y=40,rw=v.width*scale,rh=v.height*scale,strip=v.removed*scale,id='f-area-'+(++sequence);return'<figure class="f-figure"><svg viewBox="0 0 '+w+' '+(rh+120)+'" role="img" aria-labelledby="'+id+'"><title id="'+id+'">'+esc(v.description)+'</title><rect class="f-area positive" x="'+x+'" y="'+y+'" width="'+rw+'" height="'+rh+'"/><rect class="f-area negative" x="'+x+'" y="'+y+'" width="'+strip+'" height="'+rh+'"/><text x="'+(x+rw/2)+'" y="25" text-anchor="middle">w = '+v.width+' cm</text><text x="8" y="'+(y+rh/2)+'">'+v.height+' cm</text><text x="'+(x+strip/2)+'" y="'+(y+rh+22)+'" text-anchor="middle">'+v.removed+' cm</text><text x="'+(x+strip/2)+'" y="'+(y+rh+42)+'" text-anchor="middle">removed</text></svg><figcaption>'+esc(v.description)+'</figcaption></figure>';}
function visual(t,width){let v=t.visual;
 // This item names an ordered triangle. Label the given vertices without
 // adding the withheld image or changing its stored task definition.
 if(t.id==='la-c08'&&v){const triangle=v.polygons?.find(p=>p.style==='original');if(triangle?.points.length===3)v={...v,hideCoordinates:true,points:triangle.points.map((p,i)=>[...p,['O','U','V'][i]])};}
 return(t.table?table(t.table):'')+(t.matrix?matrix(t.matrix):'')+(v?v.kind==='game'?game(v):v.kind==='numberline'?numberline(v,width):v.kind==='area-strip'?areaStrip(v,width):plot(v,width):'');}
const api={table,prepareTables,matrix,game,plot,numberline,visual};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceFoundationGraphs=api;
})(typeof window==='undefined'?globalThis:window);

