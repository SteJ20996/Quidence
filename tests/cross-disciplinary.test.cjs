'use strict';
// Cross-disciplinary projects: structure, Spanish coverage, and every checked answer recomputed independently.
// Region counts come from the sign patterns realized next to the corners of each arrangement, not from the
// formulas the proofs use or from the polygon splitting the labs draw with.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),build=require('../scripts/build-cross-disciplinary.cjs'),C=require('../courses/number-theory/core.js'),X=require('../cross-disciplinary/core.js');
const {CROSS,COURSES}=require('../assets/course-catalog.js');
const data=JSON.parse(fs.readFileSync(path.join(root,'cross-disciplinary/data.json'),'utf8'));
const field=id=>{for(const p of data)for(const s of p.steps)for(const f of s.fields)if(f.id===id)return f;throw Error('No field '+id);};
const expect=(id,value)=>{const f=field(id);if(f.type==='number')assert.ok(C.equalNumber(f.answer,String(value)),id+': stored '+f.answer+', recomputed '+value);else assert.equal(f.answer,value,id);};

// A deterministic generator, so that every run tests the same random arrangements.
function random(seed){return()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sign=(p,cuts)=>cuts.map(c=>dot(c.n,p)-c.d>0?1:0).join('');
function solve(rows,rhs){
 // Gaussian elimination with partial pivoting.
 const n=rows.length,m=rows.map((r,i)=>[...r,rhs[i]]);
 for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(m[r][c])>Math.abs(m[p][c]))p=r;[m[c],m[p]]=[m[p],m[c]];if(Math.abs(m[c][c])<1e-12)return null;
  for(let r=0;r<n;r++)if(r!==c){const f=m[r][c]/m[c][c];for(let k=c;k<=n;k++)m[r][k]-=f*m[c][k];}}
 return m.map((r,i)=>r[n]/r[i]);
}
const subsets=(n,k)=>{const out=[];(function go(start,pick){if(pick.length===k){out.push(pick.slice());return;}for(let i=start;i<n;i++){pick.push(i);go(i+1,pick);pick.pop();}})(0,[]);return out;};
// Pieces of a disc or ball of radius R cut by hyperplanes {n, d} in d dimensions. With at least d cuts in general
// position and every corner inside, each piece touches a corner where d cuts meet, and the 2^d points just around
// that corner lie in the 2^d pieces that meet there; so collecting their sign patterns counts every piece once.
function piecesAroundCorners(cuts,dim,R){
 const found=new Set();
 for(const pick of subsets(cuts.length,dim)){
  const rows=pick.map(i=>cuts[i].n),corner=solve(rows,pick.map(i=>cuts[i].d));assert.ok(corner&&Math.hypot(...corner)<R,'every corner lies inside');
  for(let s=0;s<2**dim;s++){const w=solve(rows,pick.map((_,j)=>s>>j&1?1:-1)),p=corner.map((x,a)=>x+1e-6*w[a]);found.add(sign(p,cuts));}
 }
 return found;
}
// Random cuts near the middle. The first seed from the given one whose cuts are in general position, with every
// corner inside a ball of radius 10 and no other cut passing near it, is used, so every run tests the same cuts.
function generalCuts(count,dim,seed){
 for(;;seed++){
  const r=random(seed),cuts=Array.from({length:count},()=>{const n=Array.from({length:dim},()=>r()-.5),h=Math.hypot(...n);return {n:n.map(x=>x/h),d:(r()-.5)*.6};});
  const fine=subsets(count,dim).every(pick=>{const p=solve(pick.map(i=>cuts[i].n),pick.map(i=>cuts[i].d));return p&&Math.hypot(...p)<10&&cuts.every((c,m)=>pick.includes(m)||Math.abs(dot(c.n,p)-c.d)>1e-3);});
  if(fine)return cuts;
 }
}
function counts(dim,max,seed){const cuts=generalCuts(max,dim,seed);return Array.from({length:max+1},(_,k)=>k<dim?2**k:piecesAroundCorners(cuts.slice(0,k),dim,10).size);}

test('one bilingual project in six steps, with up-to-date page data and a homepage entry',()=>{
 assert.equal(fs.readFileSync(build.OUT,'utf8'),build.serialized(),'run node scripts/build-cross-disciplinary.cjs');
 assert.deepEqual(data.map(p=>p.id),['cross-p01']);assert.equal(data[0].steps.length,6);
 assert.equal(data[0].steps.reduce((n,s)=>n+s.fields.length,0),25);
 const catalog=build.crossCatalog();
 for(const p of data){
  for(const key of ['name','title','topic','prompt','approach','uses','nextCheck'])assert.ok(catalog[p[key]],p.id+'.'+key+' has Spanish');
  assert.deepEqual(p.subjects,CROSS.projects[p.id].subjects,'the homepage card lists the same courses');
  for(const s of p.steps){
   assert.ok(s.connects.length&&s.connects.every(id=>COURSES[id]&&p.subjects.includes(id)),s.title+' links courses of the project');
   assert.ok(s.banner&&!/[A-Za-z]{3}/.test(s.banner.replace(/\b[LPB]\(|C\(/g,'')),'the banner is symbols only');
   for(const para of s.proof.split(/\n\s*\n/))assert.ok(catalog[para.replace(/\s+/g,' ').trim()],'Spanish proof paragraph: '+para.slice(0,40));
   for(const f of s.fields){
    if(/[A-Za-z]{3}/.test(f.label.replace(/\b[LPBC]\(/g,'')))assert.ok(catalog[f.label],'Spanish label '+f.label);
    if(f.type==='number'){assert.equal(C.grade(f,f.answer).status,'correct',f.id);assert.equal(C.grade(f,String(Number(f.answer)+1)).status,'retry',f.id+' off by one');}
    if(f.type==='choice'){assert.ok(f.options.some(o=>o.value===f.answer));assert.equal(new Set(f.options.map(o=>o.value)).size,f.options.length);
     for(const o of f.options)if(/[A-Za-z]{3}/.test(o.label.replace(/\bP\(n\)/g,'')))assert.ok(catalog[o.label],'Spanish option '+o.label);}
    if(f.type==='reason')assert.ok(f.criteria.length>=2&&f.criteria.every(c=>catalog[c]),f.id+' criteria');
   }
  }
 }
 for(const [en,es]of Object.entries(catalog))if(/[A-Za-z]{4}/.test(en.replace(/\bPascal\b/g,'')))assert.notEqual(es,en,'untranslated: '+en.slice(0,60));
});

test('the stick: each cut at a new point adds one piece, and a repeated cut adds none',()=>{
 const pieces=cuts=>new Set(cuts).size+1,r=random(7);
 for(let n=0;n<=12;n++){const cuts=Array.from({length:n},()=>r());assert.equal(pieces(cuts),n+1);}
 expect('stick3',pieces([.2,.5,.7]));expect('stick10',pieces([...Array(10)].map((_,i)=>(i+1)/11)));
 expect('repeat',pieces([.2,.5,.5])-pieces([.2,.5]));expect('why','one');
});

test('the pizza: regions counted around the corners of random cuts, and three cuts through one point',()=>{
 const P=counts(2,10,11);assert.deepEqual(P,[1,2,4,7,11,16,22,29,37,46,56]);
 expect('pizza4',P[4]);expect('pizza10',P[10]);
 // The fourth cut crosses each earlier cut once, at different points, and those points cut it into segments.
 const cuts=generalCuts(4,2,11),crossings=cuts.slice(0,3).map(c=>solve([cuts[3].n,c.n],[cuts[3].d,c.d]));
 assert.equal(new Set(crossings.map(p=>p.map(x=>x.toFixed(9)).join())).size,3);expect('cross4',crossings.length);expect('segments4',crossings.length+1);
 expect('crossings10',subsets(10,2).length);
 // Three cuts: through one point, or crossing at three points (one of them possibly the center). Count by a fine grid.
 const grid=lines=>{const seen=new Set();for(let i=-400;i<=400;i++)for(let j=-400;j<=400;j++){const p=[i/400,j/400];if(Math.hypot(...p)<.999&&lines.every(l=>Math.abs(dot(l.n,p)-l.d)>.004))seen.add(sign(p,lines));}return seen.size;};
 const L=(deg,d)=>({n:[Math.cos(deg*Math.PI/180),Math.sin(deg*Math.PI/180)],d});
 const options={point:[L(90,0),L(30,0),L(150,0)],triangle:[L(100,.3),L(30,-.33),L(335,.31)],center:[L(90,0),L(30,0),L(150,.3)]};
 const six=Object.entries(options).filter(([,lines])=>grid(lines)===6).map(([k])=>k);assert.deepEqual(six,['point']);expect('fewer',six[0]);
 for(const k of ['triangle','center'])assert.equal(grid(options[k]),7);
 // Only the keyed formula matches every count.
 const formulas={quadratic:n=>(n*n+n+2)/2,power:n=>2**n,triangle:n=>n*(n+1)/2};
 assert.deepEqual(Object.keys(formulas).filter(k=>P.every((v,n)=>formulas[k](n)===v)),['quadratic']);expect('formula','quadratic');
 assert.deepEqual(field('formula').options.map(o=>o.value).sort(),Object.keys(formulas).sort());
});

test('the ball: pieces counted around the corners of random planes, faces, addresses and stacking',()=>{
 const B=counts(3,10,5);assert.deepEqual(B,[1,2,4,8,15,26,42,64,93,130,176]);
 expect('ball4',B[4]);expect('ball5',B[5]);expect('ball6',B[6]);expect('ball10',B[10]);
 // The face of the fourth plane carries the lines where the three earlier planes meet it; count its pieces in the plane.
 const planes=generalCuts(4,3,5),u=planes[3].n,e1=(()=>{const a=[1,0,0].map((x,i)=>x-u[0]*u[i]),h=Math.hypot(...a);return a.map(x=>x/h);})(),e2=[u[1]*e1[2]-u[2]*e1[1],u[2]*e1[0]-u[0]*e1[2],u[0]*e1[1]-u[1]*e1[0]],c=u.map(x=>x*planes[3].d);
 const faceLines=planes.slice(0,3).map(q=>{const a=dot(q.n,e1),b=dot(q.n,e2),h=Math.hypot(a,b);return {n:[a/h,b/h],d:(q.d-dot(q.n,c))/h};});
 expect('faceLines',faceLines.length);expect('facePieces',piecesAroundCorners(faceLines,2,10).size);
 // Addresses: 4 planes realize 15 of the 16 sign patterns; the missing one is the opposite of the bounded tetrahedron's.
 const found=piecesAroundCorners(planes,3,10);expect('missing',2**4-found.size);
 const corners=subsets(4,3).map(t=>solve(t.map(i=>planes[i].n),t.map(i=>planes[i].d))),center=[0,1,2].map(a=>corners.reduce((s,p)=>s+p[a],0)/4);
 const inside=sign(center,planes),opposite=[...inside].map(b=>b==='1'?'0':'1').join('');assert.ok(found.has(inside));assert.ok(!found.has(opposite));
 // Stacking: when every cut may go through every piece, each cut splits every piece in two.
 let stacked=1;for(let k=0;k<4;k++)stacked*=2;expect('stacked',stacked);expect('pattern','conjecture');
 expect('c103',subsets(10,3).length);
 let row=B.slice(0,8);for(let k=0;k<3;k++)row=row.slice(1).map((v,i)=>v-row[i]);assert.ok(row.every(v=>v===row[0]));expect('third',row[0]);
});

test('the lab arrangements are in general position and give the counts the labs show',()=>{
 const L=lines=>lines.map(l=>({n:l.n,d:l.d}));
 for(const [name,lines]of [['pizza',X.PIZZA],['triangle',X.TRIANGLE]]){
  const corners=subsets(lines.length,2).map(([i,j])=>solve([lines[i].n,lines[j].n],[lines[i].d,lines[j].d]));
  assert.ok(corners.every(p=>Math.hypot(...p)<.9),name+' crossings lie inside the pizza');
  for(const [k,p]of corners.entries()){const [i,j]=subsets(lines.length,2)[k];lines.forEach((l,m)=>{if(m!==i&&m!==j)assert.ok(Math.abs(dot(l.n,p)-l.d)>.1,name+': no three cuts meet');});}
 }
 assert.deepEqual([0,1,2,3,4,5].map(n=>n<2?2**n:piecesAroundCorners(L(X.PIZZA.slice(0,n)),2,1).size),[1,2,4,7,11,16]);
 assert.deepEqual([0,1,2,3,4,5].map(n=>X.pieces(X.PIZZA.slice(0,n)).length),[1,2,4,7,11,16]);
 assert.equal(X.pieces(X.CONCURRENT).length,6);assert.equal(X.pieces(X.TRIANGLE).length,7);
 const planes=X.BALL.map(p=>({n:p.u,d:p.d}));
 for(const t of subsets(5,3)){const p=solve(t.map(i=>planes[i].n),t.map(i=>planes[i].d));assert.ok(Math.hypot(...p)<.95,'triple points lie inside the ball');
  planes.forEach((q,m)=>{if(!t.includes(m))assert.ok(Math.abs(dot(q.n,p)-q.d)>.02,'no four ball cuts meet');});}
 assert.deepEqual([3,4,5].map(n=>piecesAroundCorners(planes.slice(0,n),3,1).size),[8,15,26]);
 assert.deepEqual(X.ballCounts(),[1,2,4,8,15,26]);
 assert.deepEqual(X.ballAddresses(X.BALL.slice(0,4)).length,15);
 assert.equal(X.flip(X.tetrahedron().address).length,4);assert.ok(!X.ballAddresses(X.BALL.slice(0,4)).includes(X.flip(X.tetrahedron().address)));
});
