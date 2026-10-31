(function(root){
  'use strict';
  // Geometry behind the cross-disciplinary labs. Every piece is convex (a disc or ball cut by half-planes or
  // half-spaces), so cutting a piece with a line splits one convex polygon into at most two.
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),scale=(a,s)=>a.map(x=>x*s),sub=(a,b)=>a.map((x,i)=>x-b[i]),unit=a=>scale(a,1/Math.hypot(...a));
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  // A line is {n:[cos θ, sin θ], d}: the points p with n · p = d. Its "+" side has n · p > d.
  const line=(degrees,d)=>({n:[Math.cos(degrees*Math.PI/180),Math.sin(degrees*Math.PI/180)],d});
  // Five pizza cuts: every two cross inside the pizza, and no three meet at one point.
  const PIZZA=[line(118.8,-.199),line(335,-.265),line(11.1,.163),line(46.8,-.235),line(83.1,.246)];
  // Three cuts through the center, for the arrangement that loses a piece.
  const CONCURRENT=[line(90,0),line(30,0),line(150,0)];
  // Three cuts around a large triangle, for labeling every piece with its address.
  const TRIANGLE=[line(100,.3),line(30,-.33),line(335,.31)];
  // Five ball cuts as planes {u, d} with unit normal u (z towards the viewer) and u · x = d. Every three meet at a
  // point inside the ball, and no four share a point, so each new cut adds as many pieces as its face has.
  const plane=(u,d)=>{const n=unit(u);return n[2]<0?{u:scale(n,-1),d:-d}:{u:n,d};};
  const BALL=[plane([.748,-.172,.641],.198),plane([.302,.737,-.605],.259),plane([.56,-.714,-.42],.221),plane([-.89,-.211,.403],-.043),plane([-.519,-.598,-.61],-.332)];
  function disc(r=1,sides=120){return Array.from({length:sides},(_,i)=>[r*Math.cos(2*Math.PI*i/sides),r*Math.sin(2*Math.PI*i/sides)]);}
  // Splits a convex polygon by a line into its "−" and "+" parts; a part is empty when the line misses that side.
  function split(poly,l){
    const minus=[],plus=[],side=p=>dot(l.n,p)-l.d;
    poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],a=side(p),b=side(q);
      if(a<=0)minus.push(p);if(a>=0)plus.push(p);
      if((a<0&&b>0)||(a>0&&b<0)){const t=a/(a-b),x=[p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])];minus.push(x);plus.push(x);}
    });
    const area=pts=>Math.abs(pts.reduce((s,p,i)=>{const q=pts[(i+1)%pts.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;
    return [minus.length>2&&area(minus)>1e-9?minus:null,plus.length>2&&area(plus)>1e-9?plus:null];
  }
  // The pieces of a disc of radius r after the given cuts, each with its address: one "+" or "−" per cut.
  function pieces(lines,r=1){
    let out=[{poly:disc(r),address:''}];
    for(const l of lines)out=out.flatMap(({poly,address})=>split(poly,l).map((part,i)=>part&&{poly:part,address:address+(i?'+':'−')}).filter(Boolean));
    return out;
  }
  // Where a cut line meets the boundary of the disc, and where the earlier cuts cross it, as distances along the line.
  function chord(l,r=1){
    const foot=scale(l.n,l.d),dir=[-l.n[1],l.n[0]],half=Math.sqrt(Math.max(0,r*r-l.d*l.d));
    return {foot,dir,half,at:t=>[foot[0]+t*dir[0],foot[1]+t*dir[1]]};
  }
  function crossings(l,earlier){
    const c=chord(l);return earlier.map(e=>{const den=dot(e.n,c.dir);return Math.abs(den)<1e-12?null:(e.d-dot(e.n,c.foot))/den;}).filter(t=>t!==null&&Math.abs(t)<c.half).sort((a,b)=>a-b);
  }
  // The face of ball cut k: a disc of radius √(1 − d²) centered at d·u, with basis vectors e1 and e2 and the lines
  // where the earlier cuts meet it, in face coordinates scaled to a unit disc.
  function face(k,planes=BALL){
    const {u,d}=planes[k],center=scale(u,d),r=Math.sqrt(1-d*d),e1=unit(sub([1,0,0],scale(u,u[0]))),e2=cross(u,e1);
    const lines=planes.slice(0,k).map(q=>{const a=dot(q.u,e1),b=dot(q.u,e2),h=Math.hypot(a,b);return {n:[a/h,b/h],d:(q.d-dot(q.u,center))/h/r};});
    return {center,r,e1,e2,lines,toSpace:([a,b])=>center.map((c,i)=>c+r*(a*e1[i]+b*e2[i]))};
  }
  // Pieces of the ball after each number of cuts, found by counting the pieces of each new cut's face.
  function ballCounts(planes=BALL){let total=1;return [1,...planes.map((_,k)=>total+=pieces(face(k,planes).lines).length)];}
  function choose(n,k){if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r);}
  // The address of a point: for each cut, "+" when the point is on the side its normal points to.
  function addressOf(p,cuts){return cuts.map(c=>dot(c.n||c.u,p)-c.d>0?'+':'−').join('');}
  function solve3(rows,rhs){
    const det=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
    const D=det(rows);return [0,1,2].map(c=>det(rows.map((r,i)=>r.map((x,j)=>j===c?rhs[i]:x)))/D);
  }
  // The addresses that have a piece of the ball, for three or more cuts in general position with every corner
  // inside the ball: each piece touches a corner where three cuts meet, and the eight points just around that
  // corner land in the eight pieces that meet there.
  function ballAddresses(planes=BALL,epsilon=1e-4){
    const found=new Set();
    for(let i=0;i<planes.length;i++)for(let j=i+1;j<planes.length;j++)for(let k=j+1;k<planes.length;k++){
      const rows=[planes[i].u,planes[j].u,planes[k].u],corner=solve3(rows,[planes[i].d,planes[j].d,planes[k].d]);
      for(let s=0;s<8;s++){const w=solve3(rows,[s&1?1:-1,s&2?1:-1,s&4?1:-1]),p=corner.map((x,a)=>x+epsilon*w[a]);if(Math.hypot(...p)<1)found.add(addressOf(p,planes));}
    }
    return [...found].sort();
  }
  // The bounded piece cut out by the first four ball cuts: the tetrahedron whose corners are the four triple points.
  function tetrahedron(planes=BALL.slice(0,4)){
    const corners=[[0,1,2],[0,1,3],[0,2,3],[1,2,3]].map(t=>solve3(t.map(i=>planes[i].u),t.map(i=>planes[i].d)));
    const center=[0,1,2].map(a=>corners.reduce((s,c)=>s+c[a],0)/4);return {corners,center,address:addressOf(center,planes)};
  }
  const flip=address=>[...address].map(s=>s==='+'?'−':'+').join('');
  const api={PIZZA,CONCURRENT,TRIANGLE,BALL,dot,cross,unit,disc,split,pieces,chord,crossings,face,ballCounts,choose,addressOf,ballAddresses,tetrahedron,flip};
  root.CrossCore=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(globalThis);
