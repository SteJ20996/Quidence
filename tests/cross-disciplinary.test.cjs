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

test('two bilingual projects in six steps each, with up-to-date page data and homepage entries',()=>{
 assert.equal(fs.readFileSync(build.OUT,'utf8'),build.serialized(),'run node scripts/build-cross-disciplinary.cjs');
 assert.deepEqual(data.map(p=>p.id),['cross-p01','cross-p02']);assert.deepEqual(data.map(p=>p.steps.length),[6,6]);
 assert.deepEqual(data.map(p=>p.steps.reduce((n,s)=>n+s.fields.length,0)),[25,22]);
 assert.deepEqual(Object.keys(CROSS.projects),data.map(p=>p.id));
 const ids=data.flatMap(p=>p.steps.flatMap(s=>s.fields.map(f=>f.id)));assert.equal(new Set(ids).size,ids.length,'field ids are unique across projects');
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

// Chords of a circle. Regions come from Euler's formula for the drawing as a planar graph: its vertices are the points and
// the crossings found by testing every two chords, its edges are the arcs and the pieces of chords between them.
const onCircle=deg=>[Math.cos(deg*Math.PI/180),Math.sin(deg*Math.PI/180)];
function crossesInside(p,q,r,s){
 const d=(q[0]-p[0])*(s[1]-r[1])-(q[1]-p[1])*(s[0]-r[0]);if(Math.abs(d)<1e-12)return null;
 const t=((r[0]-p[0])*(s[1]-r[1])-(r[1]-p[1])*(s[0]-r[0]))/d,u=((r[0]-p[0])*(q[1]-p[1])-(r[1]-p[1])*(q[0]-p[0]))/d;
 return t>1e-9&&t<1-1e-9&&u>1e-9&&u<1-1e-9?[p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]:null;
}
function chordDrawing(angles){
 const pts=angles.map(onCircle),chords=subsets(pts.length,2),crossings=[];const onChord=chords.map(()=>0);
 for(let a=0;a<chords.length;a++)for(let b=a+1;b<chords.length;b++){const [i,j]=chords[a],[k,l]=chords[b];if(new Set([i,j,k,l]).size<4)continue;const x=crossesInside(pts[i],pts[j],pts[k],pts[l]);if(x){crossings.push(x);onChord[a]++;onChord[b]++;}}
 const n=pts.length,V=n+crossings.length,E=(n>1?n:0)+onChord.reduce((s,c)=>s+c+1,0),regions=n<2?1:E-V+1;
 return {chords:chords.length,crossings,regions};
}
// Points at random angles, kept only when no three chords meet near one point, so that every run tests the same drawings.
function generalPoints(n,seed){
 for(;;seed++){const r=random(seed),angles=Array.from({length:n},()=>r()*360),{crossings}=chordDrawing(angles),pts=angles.map(onCircle);
  const apart=angles.every((a,i)=>angles.every((b,j)=>i===j||Math.abs(((a-b)%360+540)%360-180)>2));
  const fine=apart&&crossings.every((x,i)=>crossings.every((y,j)=>i===j||Math.hypot(x[0]-y[0],x[1]-y[1])>1e-4))&&crossings.every(x=>subsets(n,2).filter(([i,j])=>{const p=pts[i],q=pts[j],dx=q[0]-p[0],dy=q[1]-p[1];return Math.abs((x[0]-p[0])*dy-(x[1]-p[1])*dx)/Math.hypot(dx,dy)<1e-7;}).length===2);
  if(fine)return angles;}
}

test('chords of a circle: Euler’s formula, crossings from every four points, and the regular hexagon',()=>{
 const R=n=>chordDrawing(generalPoints(n,31+n)).regions;
 const regions=Array.from({length:12},(_,i)=>R(i+1));assert.deepEqual(regions,[1,2,4,8,16,31,57,99,163,256,386,562]);
 expect('added6',regions[5]-regions[4]);expect('guess',2*regions[4]);expect('six',regions[5]);expect('trap','refuted');
 const six=chordDrawing(generalPoints(6,7));expect('chords6',six.chords);expect('crossings6',six.crossings.length);
 const ten=chordDrawing(generalPoints(10,8));expect('chordCrossings10',ten.crossings.length);expect('regions10',ten.regions);
 expect('r7',regions[6]);expect('r12',regions[11]);
 // Four points: of the three ways to pair them, exactly one pair of chords crosses, for many random sets.
 for(let seed=1;seed<=200;seed++){const r=random(seed),pts=Array.from({length:4},()=>onCircle(r()*360));const crossing=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]].filter(([[a,b],[c,d]])=>crossesInside(pts[a],pts[b],pts[c],pts[d])).length;assert.equal(crossing,1);}
 expect('pairings',1);
 // Equally spaced points: three long diagonals of the hexagon meet at the center, and a fine grid finds 30 regions.
 const grid=lines=>{const seen=new Set();for(let i=-500;i<=500;i++)for(let j=-500;j<=500;j++){const p=[i/500,j/500];if(Math.hypot(...p)<.995&&lines.every(l=>Math.abs(dot(l.n,p)-l.d)>.003))seen.add(sign(p,lines));}return seen.size;};
 assert.equal(grid(X.chords(X.HEXAGON).map(c=>c.line)),30);
});

test('cuts in four dimensions: pieces around corners, one row per dimension, and the identity R(n) = H(n − 1)',()=>{
 const H=counts(4,10,13);assert.deepEqual(H,[1,2,4,8,16,31,57,99,163,256,386]);
 expect('h5',H[5]);expect('h6',H[6]);expect('faceShape','ball');
 // Each count is the count to its left plus the count one dimension lower, starting from a point that no cut splits.
 const B=counts(3,10,5),P=counts(2,10,11);
 for(let n=1;n<=10;n++){assert.equal(H[n],H[n-1]+B[n-1]);assert.equal(B[n],B[n-1]+P[n-1]);assert.equal(P[n],P[n-1]+n);}
 // The two puzzles agree: regions for n points equal the pieces for n − 1 cuts in four dimensions.
 for(let n=1;n<=11;n++)assert.equal(chordDrawing(generalPoints(n,31+n)).regions,H[n-1],'R('+n+') = H('+(n-1)+')');
 expect('proof','identity');
 // The difference table of the regions reaches the ball counts, then constant fourth differences.
 let row=Array.from({length:9},(_,i)=>chordDrawing(generalPoints(i+1,31+i+1)).regions);const first=row.slice(1).map((v,i)=>v-row[i]);
 assert.deepEqual(first,B.slice(0,8));expect('first','ball');
 for(let k=0;k<4;k++)row=row.slice(1).map((v,i)=>v-row[i]);assert.ok(row.every(v=>v===row[0]));expect('fourth',row[0]);
});

test('the chord lab arrangement is in general position and gives the counts the lab shows',()=>{
 const counted=[1,2,3,4,5,6,7].map(n=>X.pieces(X.chords(X.CIRCLE,n).map(c=>c.line)).length);assert.deepEqual(counted,[1,2,4,8,16,31,57]);
 assert.deepEqual([1,2,3,4,5,6,7].map(n=>chordDrawing(X.CIRCLE.slice(0,n)).regions),counted);
 const {crossings}=chordDrawing(X.CIRCLE),pts=X.CIRCLE.map(onCircle);
 for(const x of crossings){const near=subsets(7,2).filter(([i,j])=>{const p=pts[i],q=pts[j],dx=q[0]-p[0],dy=q[1]-p[1];return Math.abs((x[0]-p[0])*dy-(x[1]-p[1])*dx)/Math.hypot(dx,dy)<.05;}).length;assert.equal(near,2,'no third chord passes near a crossing');}
 assert.equal(X.pieces(X.chords(X.HEXAGON).map(c=>c.line)).length,30);
});
