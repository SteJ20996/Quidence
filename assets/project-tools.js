(function(root){
'use strict';
const copy=v=>JSON.parse(JSON.stringify(v)),obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const numeric=v=>{if(!['string','number'].includes(typeof v))return null;const s=String(v).trim().replace(/−/g,'-');if(s.length>80||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return null;const a=s.split('/').map(Number),n=a.length===1?a[0]:a[0]/a[1];return Number.isFinite(n)?n:null;};
// A bounded polynomial parser, never eval/Function or sampled-point equivalence.
// Only one named variable, arithmetic, constant division and integer powers 0..6.
function polynomial(source,variable){
 try{
  if(typeof source!=='string'||source.length>300)return null;
  const s=source.replace(/−/g,'-').replace(/×/g,'*').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\s/g,'');
  const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)|[A-Za-z]|[+*/^()\-]/g)||[];
  if(tokens.join('')!==s||tokens.length>150)return null;
  let pos=0,depth=0;
  const trim=a=>{while(a.length>1&&Math.abs(a.at(-1))<1e-12)a.pop();if(a.length>7||a.some(x=>!Number.isFinite(x)||Math.abs(x)>1e12))throw Error();return a;};
  const add=(a,b,sign=1)=>trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]||0)+sign*(b[i]||0)));
  const mul=(a,b)=>{const c=Array(a.length+b.length-1).fill(0);a.forEach((x,i)=>b.forEach((y,j)=>c[i+j]+=x*y));return trim(c);};
  function primary(){if(++depth>30)throw Error();const token=tokens[pos++];let a;if(token==='('){a=sum();if(tokens[pos++]!==')')throw Error();}else if(token===variable){a=[0,1];}else if(token&&/^\d|^\./.test(token)){a=[Number(token)];}else throw Error();depth--;return a;}
  function power(){let a=primary();if(tokens[pos]==='^'){pos++;const e=tokens[pos++];if(!/^[0-6]$/.test(e||''))throw Error();let c=[1];for(let i=0;i<Number(e);i++)c=mul(c,a);a=c;}return a;}
  function unary(){const q=tokens[pos];if(q==='+'||q==='-'){pos++;const a=unary();return q==='-'?a.map(x=>-x):a;}return power();}
  function product(){let a=unary();while(pos<tokens.length){const q=tokens[pos],implicit=q==='('||q===variable||/^\d|^\./.test(q||'');if(q!=='*'&&q!=='/'&&!implicit)break;if(!implicit)pos++;const b=unary();if(q==='/'){if(b.length!==1||b[0]===0)throw Error();a=trim(a.map(x=>x/b[0]));}else a=mul(a,b);}return a;}
  function sum(){let a=product();while(tokens[pos]==='+'||tokens[pos]==='-'){const sign=tokens[pos++]==='+'?1:-1;a=add(a,product(),sign);}return a;}
  const result=sum();return pos===tokens.length?trim(result):null;
 }catch{return null;}
}
function equivalent(value,field){const a=polynomial(value,field.variable),b=polynomial(field.answer,field.variable);if(!a||!b)return null;return Array.from({length:Math.max(a.length,b.length)},(_,i)=>Math.abs((a[i]||0)-(b[i]||0))<=1e-9*Math.max(1,Math.abs(b[i]||0))).every(Boolean);}
const emptyDrawing=()=>({points:{},edges:[]});
const edgeKey=e=>[...e].sort().join('|');
function validDrawing(f,v){return obj(v)&&obj(v.points)&&Array.isArray(v.edges)&&Object.keys(v).every(k=>['points','edges','raw'].includes(k))&&Object.keys(v.points).every(k=>f.board.labels.includes(k))&&Object.values(v.points).every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=f.board.xmin&&p[0]<=f.board.xmax&&p[1]>=f.board.ymin&&p[1]<=f.board.ymax)&&(v.raw===undefined||obj(v.raw)&&Object.entries(v.raw).every(([k,p])=>Object.hasOwn(v.points,k)&&Array.isArray(p)&&p.length===2&&p.every((x,i)=>typeof x==='string'&&x.length<=80&&numeric(x)===v.points[k][i])))&&v.edges.length<=20&&v.edges.every(e=>Array.isArray(e)&&e.length===2&&e[0]!==e[1]&&e.every(k=>Object.hasOwn(v.points,k)))&&new Set(v.edges.map(edgeKey)).size===v.edges.length;}
function drawingParts(f,v){if(!validDrawing(f,v))return{};const tol=f.coordinateTolerance||0.13,result={};for(const[k,p]of Object.entries(f.answer.points))result[k]=!v.points[k]?null:p.every((x,i)=>Math.abs(x-v.points[k][i])<=tol);for(const e of f.answer.edges)result[edgeKey(e)]=v.edges.some(x=>edgeKey(x)===edgeKey(e))?true:null;return result;}
function checkDrawing(f,v){if(!Object.keys(v.points).length)return null;const parts=Object.values(drawingParts(f,v));if(parts.some(x=>x===false))return false;return parts.length>0&&parts.every(x=>x===true)?true:null;}
const fieldTypes={
 reason:{blank:()=>'',valid:(f,v)=>typeof v==='string'&&v.length<=2000,check:()=>null,text:(f,v)=>v||'not entered'},
 formula:{blank:()=>'',valid:(f,v)=>typeof v==='string'&&v.length<=300,check:(f,v)=>v.trim()?equivalent(v,f):null,text:(f,v)=>v||'not entered'},
 drawing:{blank:emptyDrawing,valid:validDrawing,check:checkDrawing,parts:drawingParts,text:(f,v)=>Object.entries(v?.points||{}).map(([k,p])=>k+'=('+ (v.raw?.[k]||p.map(coordinateText)).join(', ')+')').join('; ')+' · segments: '+((v?.edges||[]).map(e=>e.join('–')).join(', ')||'none')}
};
function coordinateText(n){return Number.isInteger(n)?String(n):String(Number(n.toFixed(4)));}
function placementError(f,label,x,y){if(!f.board.labels.includes(label))return'Choose an available point name.';if(numeric(x)===null||numeric(y)===null)return'Enter a number or fraction for both coordinates.';return'Keep x between '+f.board.xmin+' and '+f.board.xmax+', and y between '+f.board.ymin+' and '+f.board.ymax+'.';}
function connectionError(v,a,b){if(a===b)return'Choose two different points for a segment.';const missing=[a,b].filter(k=>!v.points[k]);return'Place '+missing.join(' and ')+' before drawing this segment.';}
function place(f,v,label,x,y){const original=[String(x),String(y)];x=numeric(x);y=numeric(y);if(!f.board.labels.includes(label)||x===null||y===null||x<f.board.xmin||x>f.board.xmax||y<f.board.ymin||y>f.board.ymax)return null;const next=copy(v);next.points[label]=[x,y];next.raw={...next.raw,[label]:original};return next;}
function connect(f,v,a,b){if(a===b||!v.points[a]||!v.points[b])return null;const next=copy(v),e=[a,b];if(!next.edges.some(x=>edgeKey(x)===edgeKey(e)))next.edges.push(e);return next;}
function fromPointer(f,event,rect){if(!rect||rect.width<=0||rect.height<=0||!Number.isFinite(event.clientX)||!Number.isFinite(event.clientY))return null;const b=f.board,W=500,H=500,M=40,xv=(event.clientX-rect.left)/rect.width*W,yv=(event.clientY-rect.top)/rect.height*H;if(xv<M||xv>W-M||yv<M||yv>H-M)return null;return[Math.round((b.xmin+(xv-M)/(W-2*M)*(b.xmax-b.xmin))*4)/4,Math.round((b.ymax-(yv-M)/(H-2*M)*(b.ymax-b.ymin))*4)/4];}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function svg(f,v){const b=f.board,W=500,H=500,M=40,px=x=>M+(x-b.xmin)/(b.xmax-b.xmin)*(W-2*M),py=y=>M+(b.ymax-y)/(b.ymax-b.ymin)*(H-2*M);let out='<svg xmlns="http://www.w3.org/2000/svg" data-project-board="'+esc(f.id)+'" viewBox="0 0 500 500" role="img" aria-label="Coordinate construction board: '+esc(f.label)+'"><title>'+esc(f.label)+'</title><desc>Equal coordinate units on both axes. Gray points and segments are given context; blue points and solid segments are the student construction. Use coordinate controls as an alternative to tapping.</desc><rect width="500" height="500" fill="#fff"/>';
 for(let x=Math.ceil(b.xmin);x<=b.xmax;x++)out+='<path d="M'+px(x)+' '+M+'V'+(H-M)+'" stroke="#e4eaf0"/><text x="'+px(x)+'" y="'+(H-20)+'" text-anchor="middle" font-size="16" fill="#52647b">'+x+'</text>';
 for(let y=Math.ceil(b.ymin);y<=b.ymax;y++)out+='<path d="M'+M+' '+py(y)+'H'+(W-M)+'" stroke="#e4eaf0"/><text x="25" y="'+(py(y)+4)+'" text-anchor="end" font-size="16" fill="#52647b">'+y+'</text>';
 const line=(a,c,color,dash='')=>'<path d="M'+px(a[0])+' '+py(a[1])+'L'+px(c[0])+' '+py(c[1])+'" fill="none" stroke="'+color+'" stroke-width="3" '+(dash?'stroke-dasharray="6 4"':'')+'/>';
 for(const e of b.givenEdges||[])out+=line(b.given[e[0]],b.given[e[1]],'#8794a6','dashed');
 if(b.circle)out+='<circle cx="'+px(b.circle.center[0])+'" cy="'+py(b.circle.center[1])+'" r="'+(b.circle.radius*(W-2*M)/(b.xmax-b.xmin))+'" fill="none" stroke="#8794a6" stroke-width="2"/>';
 for(const e of v.edges||[])if(v.points[e[0]]&&v.points[e[1]])out+=line(v.points[e[0]],v.points[e[1]],'#2147df');
 const point=(k,p,color)=>'<circle cx="'+px(p[0])+'" cy="'+py(p[1])+'" r="5" fill="'+color+'"/><text x="'+(px(p[0])+8)+'" y="'+(py(p[1])-9)+'" fill="'+color+'" font-size="20" stroke="#fff" stroke-width="4" paint-order="stroke">'+esc(k)+'</text>';
 for(const[k,p]of Object.entries(b.given))out+=point(k,p,'#52647b');for(const[k,p]of Object.entries(v.points||{}))out+=point(k,p,'#2147df');
 return out+'<text x="480" y="488" font-size="18">x</text><text x="15" y="15" font-size="18">y</text></svg>';
}
function render(f,v,disabled=false,readonly=false){const opts=f.board.labels.map(k=>'<option value="'+k+'">'+k+'</option>').join(''),disable=disabled?'disabled':'';return'<div class="project-board" data-project-field="'+f.id+'">'+svg(f,v)+(readonly?'':'<p>Choose a point name and tap the grid (snaps to ¼ unit), or type x and y for an exact construction. Fractions are allowed. Use the segment command to connect points.</p><div class="project-controls"><label>Point<select data-project-label '+disable+'>'+opts+'</select></label><label>x<input data-project-x type="text" maxlength="80" '+disable+'></label><label>y<input data-project-y type="text" maxlength="80" '+disable+'></label><button type="button" data-project-action="place" '+disable+'>Place / move point</button><label>From<select data-project-from '+disable+'>'+opts+'</select></label><label>To<select data-project-to '+disable+'>'+opts+'</select></label><button type="button" data-project-action="connect" '+disable+'>Draw segment</button><button type="button" data-project-action="undo" '+disable+'>Undo</button><button type="button" data-project-action="clear" '+disable+'>Clear construction</button></div>')+'<p class="project-coordinate-list">'+esc(fieldTypes.drawing.text(f,v))+'</p><p class="f-note">New typed coordinates keep your original fraction or decimal. Earlier coordinates without an original text copy display up to four decimal places.</p></div>';}
function validSpec(f){
 const b=f?.board,key=k=>typeof k==='string'&&/^[A-Za-z0-9′_-]{1,20}$/.test(k),point=p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&Math.abs(n)<=1000);
 return !!b&&key(f.id)&&typeof f.label==='string'&&f.label.length<=300&&[b.xmin,b.xmax,b.ymin,b.ymax].every(n=>Number.isFinite(n)&&Math.abs(n)<=1000)&&b.xmax>b.xmin&&b.ymax>b.ymin&&b.xmax-b.xmin<=40&&b.ymax-b.ymin<=40&&b.xmax-b.xmin===b.ymax-b.ymin&&Array.isArray(b.labels)&&b.labels.length<=12&&b.labels.every(key)&&obj(b.given)&&Object.keys(b.given).length<=12&&Object.entries(b.given).every(([k,p])=>key(k)&&point(p))&&(!b.givenEdges||Array.isArray(b.givenEdges)&&b.givenEdges.length<=20&&b.givenEdges.every(e=>Array.isArray(e)&&e.length===2&&e.every(k=>Object.hasOwn(b.given,k))))&&(!b.circle||point(b.circle.center)&&Number.isFinite(b.circle.radius)&&b.circle.radius>0&&b.circle.radius<=40);
}
function reportDrawings(payload){
 const out=[];
 for(const[i,o]of (Array.isArray(payload?.observations)?payload.observations:[]).slice(0,40).entries()){
  let j=0;for(const c of (Array.isArray(o?.components)?o.components:[]).slice(0,30))if(c?.drawing&&validSpec(c.drawingSpec)&&validDrawing(c.drawingSpec,c.drawing)){
   out.push({filename:'Quidence_Drawing_'+(i+1)+'_'+(++j)+'.svg',title:String(o.title||'Project')+' · '+c.drawingSpec.label,spec:c.drawingSpec,drawing:c.drawing});
  }
 }
 return out.slice(0,20);
}
// Portable uncompressed ZIP; no third-party code or server upload.
function zipFiles(files){
 if(!Array.isArray(files)||files.length>40||files.some(f=>!f||!/^[-A-Za-z0-9_.]+$/.test(f.name)||typeof f.content!=='string'))throw Error('Unsupported report package.');
 const enc=new TextEncoder(),table=Array.from({length:256},(_,i)=>{let n=i;for(let j=0;j<8;j++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;}),crc=bytes=>{let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0;};
 const entries=files.map(f=>({name:enc.encode(f.name),data:enc.encode(f.content)}));
 const size=entries.reduce((n,f)=>n+30+f.name.length+f.data.length+46+f.name.length,22);if(size>8*1024*1024)throw Error('The report package is too large. Export the answer history instead.');
 const bytes=new Uint8Array(size),v=new DataView(bytes.buffer);let pos=0;
 for(const f of entries){f.offset=pos;f.crc=crc(f.data);v.setUint32(pos,0x04034b50,true);v.setUint16(pos+4,20,true);v.setUint16(pos+6,0x800,true);v.setUint16(pos+12,33,true);v.setUint32(pos+14,f.crc,true);v.setUint32(pos+18,f.data.length,true);v.setUint32(pos+22,f.data.length,true);v.setUint16(pos+26,f.name.length,true);bytes.set(f.name,pos+30);bytes.set(f.data,pos+30+f.name.length);pos+=30+f.name.length+f.data.length;}
 const start=pos;
 for(const f of entries){v.setUint32(pos,0x02014b50,true);v.setUint16(pos+4,20,true);v.setUint16(pos+6,20,true);v.setUint16(pos+8,0x800,true);v.setUint16(pos+14,33,true);v.setUint32(pos+16,f.crc,true);v.setUint32(pos+20,f.data.length,true);v.setUint32(pos+24,f.data.length,true);v.setUint16(pos+28,f.name.length,true);v.setUint32(pos+42,f.offset,true);bytes.set(f.name,pos+46);pos+=46+f.name.length;}
 v.setUint32(pos,0x06054b50,true);v.setUint16(pos+8,entries.length,true);v.setUint16(pos+10,entries.length,true);v.setUint32(pos+12,pos-start,true);v.setUint32(pos+16,start,true);return bytes;
}
const api={numeric,polynomial,equivalent,fieldTypes,emptyDrawing,validDrawing,drawingParts,checkDrawing,place,connect,placementError,connectionError,coordinateText,fromPointer,svg,render,validSpec,reportDrawings,zipFiles};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectTools=api;
})(typeof window==='undefined'?globalThis:window);
