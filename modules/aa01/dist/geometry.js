/* Actual cuboid coordinates, orthographic projection and face visibility.
   No remote assets, telemetry, or answer-field mutations. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ClueveraGeometry=api;})(typeof window==='object'?window:globalThis,()=>{
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const finite=(v,f)=>Number.isFinite(v)?v:f;
  function normalize(view={}){return {x:clamp(Math.round(finite(view.x,2)),1,5),stage:clamp(Math.round(finite(view.stage,0)),0,2),yaw:finite(view.yaw,-.65)%(2*Math.PI),pitch:clamp(finite(view.pitch,.42),-1.35,1.35),zoom:clamp(finite(view.zoom,1),.65,1.75)};}
  function model(view={}){
    const v=normalize(view),W=v.x+3,H=8,D=2*v.x+5,gap=v.stage===2?2.2:0;
    const dimensions={width:W,height:H,depth:D};
    const parts=v.stage===0?[{id:'whole',origin:[-W/2,-H/2,-D/2],size:[W,H,D],color:'#b9ceff'}]:[
      {id:'A',a:0,b:0,size:[v.x,H,2*v.x],color:'#e1eaff'},
      {id:'B',a:0,b:1,size:[v.x,H,5],color:'#bfd2ff'},
      {id:'C',a:1,b:0,size:[3,H,2*v.x],color:'#97b5fa'},
      {id:'D',a:1,b:1,size:[3,H,5],color:'#789eea'}
    ].map(p=>({...p,origin:[-W/2+(p.a?v.x:0)+(p.a?gap/2:-gap/2),-H/2,-D/2+(p.b?2*v.x:0)+(p.b?gap/2:-gap/2)]}));
    return {view:v,dimensions,parts,volume:W*H*D,partVolumes:parts.map(p=>p.size.reduce((a,b)=>a*b,1))};
  }
  function rotate(p,yaw,pitch){const c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),a=p[0]*c+p[2]*s,z=-p[0]*s+p[2]*c;return [a,p[1]*cp-z*sp,p[1]*sp+z*cp];}
  const faceDefs=[
    {indices:[0,3,2,1],normal:[0,0,-1],axis:2,side:0},
    {indices:[4,5,6,7],normal:[0,0,1],axis:2,side:1},
    {indices:[0,4,7,3],normal:[-1,0,0],axis:0,side:0},
    {indices:[1,2,6,5],normal:[1,0,0],axis:0,side:1},
    {indices:[0,1,5,4],normal:[0,-1,0],axis:1,side:0},
    {indices:[3,7,6,2],normal:[0,1,0],axis:1,side:1}
  ];
  function shade(hex,f){return '#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('');}
  // Choose silhouette edges and place dimensions immediately outside them.
  // Each annotation uses a parallel dimension line, never a distant callout.
  function dimensionLayout(input={}){
    const {view:v,dimensions:d}=model(input),half=[d.width/2,d.height/2,d.depth/2];
    const scale=300/(Math.hypot(d.width,d.height,d.depth)+5)*v.zoom;
    const project=p=>{const r=rotate(p,v.yaw,v.pitch);return [280+r[0]*scale,203-r[1]*scale];};
    const corners=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])corners.push(project([x*half[0],y*half[1],z*half[2]]));
    const names=['width','height','depth'],texts=[`x + 3 = ${d.width}`,'8',`2x + 5 = ${d.depth}`];
    const candidates=half.map((_,axis)=>{
      const other=[0,1,2].filter(a=>a!==axis),list=[];
      for(const s of [-1,1])for(const t of [-1,1]){
        const a=[0,0,0],b=[0,0,0];a[axis]=-half[axis];b[axis]=half[axis];
        for(const p of [a,b]){p[other[0]]=s*half[other[0]];p[other[1]]=t*half[other[1]];}
        const p=project(a),q=project(b),dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);
        if(length<1e-5)continue; // An exactly end-on length has no visible edge.
        const tangent=[dx/length,dy/length],mid=[(p[0]+q[0])/2,(p[1]+q[1])/2];
        let normal=[-tangent[1],tangent[0]];
        const sides=corners.map(c=>(c[0]-p[0])*normal[0]+(c[1]-p[1])*normal[1]);
        if(Math.min(...sides)<-1e-5&&Math.max(...sides)>1e-5)continue;
        if(Math.max(...sides)>1e-5)normal=normal.map(n=>-n);
        let angle=Math.atan2(dy,dx)*180/Math.PI;if(angle>90)angle-=180;if(angle< -90)angle+=180;
        const width=texts[axis].length*11.5+10,height=26;
        for(const offset of [27,42])for(const shift of [0,-.2,.2]){
          const center=mid.map((n,i)=>n+normal[i]*offset+tangent[i]*length*shift);
          const box=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,w])=>center.map((n,i)=>n+tangent[i]*u*width/2+normal[i]*w*height/2));
          const overflow=box.reduce((sum,c)=>sum+Math.max(0,8-c[0],c[0]-552)+Math.max(0,8-c[1],c[1]-412),0);
          list.push({axis:names[axis],text:texts[axis],p,q,tangent,normal,center,angle,box,offset,shift,cost:overflow*100+(offset-27)+Math.abs(shift)*8});
        }
      }
      return list;
    });
    const overlap=(a,b)=>{
      for(const n of [a.tangent,a.normal,b.tangent,b.normal]){
        const aa=a.box.map(p=>p[0]*n[0]+p[1]*n[1]),bb=b.box.map(p=>p[0]*n[0]+p[1]*n[1]);
        if(Math.max(...aa)+5<=Math.min(...bb)||Math.max(...bb)+5<=Math.min(...aa))return false;
      }return true;
    };
    let best=[],cost=Infinity;
    const choose=(i,picked,score)=>{
      if(score>=cost)return;
      if(i===3){best=picked;cost=score;return;}
      if(!candidates[i].length){choose(i+1,picked,score);return;}
      for(const c of candidates[i])choose(i+1,[...picked,c],score+c.cost+picked.reduce((s,p)=>s+(overlap(c,p)?10000:0),0));
    };choose(0,[],0);return best;
  }
  function render(input={}){
    const m=model(input),{view:v,dimensions:d}=m;
    const scale=300/(Math.hypot(d.width,d.height,d.depth)+5)*v.zoom;
    const project=p=>{const r=rotate(p,v.yaw,v.pitch);return [280+r[0]*scale,203-r[1]*scale,r[2]];};
    const faces=[];
    for(const p of m.parts){
      const [a,b,c]=p.origin,[w,h,z]=p.size;
      const corners=[[a,b,c],[a+w,b,c],[a+w,b+h,c],[a,b+h,c],[a,b,c+z],[a+w,b,c+z],[a+w,b+h,c+z],[a,b+h,c+z]];
      for(const f of faceDefs){
        const normal=rotate(f.normal,v.yaw,v.pitch);if(normal[2]<=1e-8)continue;
        // Joined partitions expose only the original solid's outer surface.
        if(v.stage===1&&f.axis===0&&((p.a===0&&f.side===1)||(p.a===1&&f.side===0)))continue;
        if(v.stage===1&&f.axis===2&&((p.b===0&&f.side===1)||(p.b===1&&f.side===0)))continue;
        const points=f.indices.map(i=>project(corners[i]));
        faces.push({id:p.id,points,depth:points.reduce((sum,q)=>sum+q[2],0)/4,fill:shade(p.color,f.axis===1?1:f.axis===0?.85:.95)});
      }
    }
    faces.sort((a,b)=>a.depth-b.depth);
    const polygons=faces.map(f=>`<polygon data-solid-piece="${f.id}" points="${f.points.map(p=>p.slice(0,2).map(n=>n.toFixed(2)).join(',')).join(' ')}" fill="${f.fill}" stroke="#2147df" stroke-width="1.7" stroke-linejoin="round"/>`).join('');
    const line=(a,b)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    const labels=v.stage===0?dimensionLayout(v).map(c=>{
      const a=c.p.map((n,i)=>n+c.normal[i]*(c.offset-15)),b=c.q.map((n,i)=>n+c.normal[i]*(c.offset-15));
      return `<g data-solid-dimension="${c.axis}"><g stroke="#596780" stroke-width="1.2">${line(c.p,a)}${line(c.q,b)}${line(a,b)}</g><text transform="translate(${c.center.join(' ')}) rotate(${c.angle})" y="7" text-anchor="middle" class="solid-label solid-dimension-label">${c.text}</text></g>`;
    }).join(''):m.parts.map(p=>{const pos=project([p.origin[0]+p.size[0]/2,p.origin[1]+p.size[1]+.3,p.origin[2]+p.size[2]/2]);return `<text x="${pos[0]}" y="${pos[1]}" text-anchor="middle" class="solid-label solid-piece-label">${p.id}</text>`;}).join('');
    return `<svg class="solid-svg" viewBox="0 0 560 420" role="img" aria-label="${['Whole rectangular prism','The same prism partitioned into four parts','Four separated rectangular prisms'][v.stage]}. At x=${v.x}, full dimensions are ${d.width} by 8 by ${d.depth}. Rotation and zoom change only the view. All parts retain height 8.">${polygons}${labels}</svg>`;
  }
  return {normalize,model,rotate,dimensionLayout,render};
});
