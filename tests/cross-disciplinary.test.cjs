'use strict';
// Cross-disciplinary projects: structure, English-only text, and every checked answer recomputed independently.
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

test('four English projects in six steps each, with up-to-date page data and homepage entries',()=>{
 assert.equal(fs.readFileSync(build.OUT,'utf8'),build.serialized(),'run node scripts/build-cross-disciplinary.cjs');
 assert.deepEqual(data.map(p=>p.id),['cross-p01','cross-p02','cross-p03','cross-p04']);assert.deepEqual(data.map(p=>p.steps.length),[6,6,6,6]);
 assert.deepEqual(data.map(p=>p.steps.reduce((n,s)=>n+s.fields.length,0)),[25,22,24,28]);
 assert.deepEqual(Object.keys(CROSS.projects),data.map(p=>p.id));
 const ids=data.flatMap(p=>p.steps.flatMap(s=>s.fields.map(f=>f.id)));assert.equal(new Set(ids).size,ids.length,'field ids are unique across projects');
 // The page data is English only: no Spanish punctuation or letters, and no second-language copy in the source.
 assert.doesNotMatch(build.serialized(),/[¿¡ñ]/);assert.equal(build.crossCatalog,undefined);
 const text=x=>typeof x==='string'&&x.trim().length>0;
 for(const p of data){
  for(const key of ['name','title','topic','prompt','approach','uses','nextCheck'])assert.ok(text(p[key]),p.id+'.'+key);
  assert.deepEqual(p.subjects,CROSS.projects[p.id].subjects,'the homepage card lists the same courses');
  for(const s of p.steps){
   assert.ok(s.connects.length&&s.connects.every(id=>COURSES[id]&&p.subjects.includes(id)),s.title+' links courses of the project');
   assert.ok(s.banner&&!/[A-Za-z]{3}/.test(s.banner.replace(/\b[LPB]\(|C\(|log₁₀/g,'')),'the banner is symbols only');
   assert.ok(s.proof.split(/\n\s*\n/).every(text),s.title+' proof');
   for(const f of s.fields){
    assert.ok(text(f.label),f.id+' label');
    if(f.type==='number'){assert.equal(C.grade(f,f.answer).status,'correct',f.id);assert.equal(C.grade(f,String(Number(f.answer)+1)).status,'retry',f.id+' off by one');}
    if(f.type==='choice'){assert.ok(f.options.some(o=>o.value===f.answer));assert.equal(new Set(f.options.map(o=>o.value)).size,f.options.length);
     assert.ok(f.options.every(o=>text(o.label)),f.id+' options');}
    if(f.type==='reason')assert.ok(f.criteria.length>=2&&f.criteria.every(text),f.id+' criteria');
   }
  }
 }
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

// First digits. Every count is read from the decimal digits of exact whole numbers (BigInt), and every share and
// statistic is computed here from those counts, not with the lab's helpers.
const lead=n=>Number(String(n)[0]);
const powersOf=(b,count)=>{const out=[];let x=1n;for(let i=0;i<count;i++){x*=BigInt(b);out.push(x);}return out;};
const firstDigits=values=>{const c=Array(9).fill(0);for(const v of values)c[lead(v)-1]++;return c;};
const P=d=>Math.log10(1+1/d),chi=c=>{const n=c.reduce((a,b)=>a+b,0);return c.reduce((s,o,i)=>s+(o-n*P(i+1))**2/(n*P(i+1)),0);};
const close=(id,value,places)=>{const f=field(id);assert.equal(f.minDecimalPlaces,places,id+' places');assert.ok(Math.abs(Number(f.answer)-value)<1e-12,id+': stored '+f.answer+', recomputed '+value);
 const rounded=value.toFixed(places);assert.equal(C.grade(f,rounded).status,'correct',id+' accepts '+rounded);
 const off=(Number(rounded)+10**-places).toFixed(places);assert.equal(C.grade(f,off).status,'retry',id+' rejects '+off);
 if(places>1)assert.equal(C.grade(f,value.toFixed(places-1)).status,'retry',id+' needs '+places+' places');};

test('first digits: powers of 2, log stretches, Benford’s shares and the first powers to start with 7 and 9',()=>{
 const two=powersOf(2,1000),c10=firstDigits(two.slice(0,10)),c100=firstDigits(two.slice(0,100));
 expect('ones10',c10[0]);expect('ones100',c100[0]);expect('nines100',c100[8]);
 assert.deepEqual(c100,[30,17,13,10,7,7,6,5,5],'the counts the proofs quote');
 expect('firstSeven',two.findIndex(v=>lead(v)===7)+1);expect('firstNine',two.findIndex(v=>lead(v)===9)+1);
 assert.equal(String(2n**46n),'70368744177664');assert.equal(String(2n**53n),'9007199254740992');
 expect('equalShares','no');
 close('width1',Math.log10(2),3);
 // A calculator's display, ten significant digits, and a full double for log₁₀ 2 and log₁₀ 4 are correct roundings too.
 for(const [id,v]of [['width1',(Math.log10(2)).toPrecision(10)],['width9',(Math.log10(10/9)).toPrecision(10)],['share123',(Math.log10(4)).toPrecision(10)],['width1',String(Math.log10(2))],['share123',String(Math.log10(4))]])assert.equal(C.grade(field(id),v).status,'correct',id+' accepts '+v);close('width9',Math.log10(10/9),3);close('mantissa1024',Math.log10(1024)-3,3);
 close('share123',P(1)+P(2)+P(3),3);close('oneToNine',P(1)/P(9),1);
 assert.ok(Math.abs([1,2,3,4,5,6,7,8,9].reduce((s,d)=>s+P(d),0)-1)<1e-12,'the nine shares add up to 1');
 expect('expected1000',Math.round(1000*P(1)));assert.equal(firstDigits(two)[0],301,'301 of 2¹ to 2¹⁰⁰⁰ start with 1');
 expect('tensCircle','zero');assert.ok(powersOf(10,30).every(v=>lead(v)===1));
 // log₁₀ 2 = p/q would give 2^q = 10^p; no power of 2 is a power of 10 with p ≥ 1.
 assert.ok(two.every(v=>!/^10*$/.test(String(v))));
});

test('first digits: changing units, the chi-square test and data that should not follow the law',()=>{
 // 2x starts with 1 exactly when x starts with 5 to 9: check every first digit of the whole numbers up to 99999.
 for(let x=1;x<100000;x++)assert.equal(lead(2*x)===1,lead(x)>=5,'x = '+x);
 expect('doublingDigits','five');close('shareFiveUp',Math.log10(10/5),3);
 const whole=Array.from({length:999},(_,i)=>BigInt(i+1));
 assert.deepEqual(firstDigits(whole),Array(9).fill(111));expect('doubled999',firstDigits(whole.map(x=>2n*x))[0]);
 // Turning evenly spread mantissas keeps the shares: the powers of 2 in new units stay within 5 of Benford's counts.
 for(const c of [2n,3n,6n,1024n,729n]){const shifted=firstDigits(powersOf(2,1000).map(v=>v*c));shifted.forEach((n,i)=>assert.ok(Math.abs(n-1000*P(i+1))<5,'c = '+c+', digit '+(i+1)));}
 close('chiPowers',chi(firstDigits(powersOf(2,100))),2);expect('chiWhole',Math.round(chi(firstDigits(whole))));
 assert.ok(chi(firstDigits(whole))>15.51&&chi(firstDigits(powersOf(2,100)))<15.51);
 expect('notBenford','heights');
 const heights=Array.from({length:61},(_,i)=>140+i);assert.ok(firstDigits(heights)[0]>=60,'heights from 140 to 200 cm almost all start with 1');
 assert.ok(chi(firstDigits(powersOf(3,1000)))<15.51,'the powers of 3 pass the test');
 // The lab's data sets and helpers agree with the counts above.
 assert.deepEqual(X.tally(X.powers(2,100)),[30,17,13,10,7,7,6,5,5]);assert.ok(Math.abs(X.chiSquare(X.tally(X.powers(2,100)))-chi([30,17,13,10,7,7,6,5,5]))<1e-12);
 assert.deepEqual(X.tally(X.fibonacci(100)),firstDigits((()=>{const f=[1n,1n];while(f.length<100)f.push(f.at(-1)+f.at(-2));return f;})()));
 assert.ok(Math.abs(X.mantissa(1024n)-(Math.log10(1024)-3))<1e-12&&Math.abs(X.mantissa(2n**53n)-(53*Math.log10(2)-15))<1e-9);
});


// Li Ye's round city. The story alone fixes each answer: the start is written in terms of the city's radius r (the
// corners and gates of a city with centre (0, 0)), and r is found where the line of sight is exactly r from the centre
// (through the centre in problem 5). No rule from the proofs is used, and the hypotenuses are exact whole numbers.
const CITY={1:[[-1,1],[320,0],[0,-600]],2:[[-1,0],[256,0],[0,-480]],3:[[0,1],[200,0],[0,-375]],4:[[0,0],[136,0],[0,-255]],5:[[-1,1],[180,0],[0,-360]],
 6:[[-1,-1],[192,0],[0,-360]],7:[[1,1],[80,0],[0,-150]],8:[[1,-1],[-48,0],[0,90]],9:[[0,-1],[72,0],[0,-135]],10:[[1,0],[16,0],[0,-30]]};
function cityDiameters(n){const [s,e,t]=CITY[n],through=n===5;
 const f=r=>{const S=[s[0]*r,s[1]*r],A=[S[0]+e[0],S[1]+e[1]],B=[S[0]+t[0],S[1]+t[1]];return Math.abs(A[0]*B[1]-A[1]*B[0])/Math.hypot(B[0]-A[0],B[1]-A[1])-(through?0:r);};
 const out=[];for(let r=1;r<2000;r++){if(Math.sign(f(r))===Math.sign(f(r+1)))continue;let lo=r,hi=r+1;for(let i=0;i<90;i++){const m=(lo+hi)/2;if(Math.sign(f(m))===Math.sign(f(lo)))lo=m;else hi=m;}out.push(lo+hi);}
 return out;}
const wholeHypotenuse=(a,b)=>{const n=BigInt(a)**2n+BigInt(b)**2n;let c=BigInt(Math.round(Math.sqrt(Number(n))));while(c*c>n)c--;while((c+1n)*(c+1n)<=n)c++;assert.equal(c*c,n,`${a}, ${b}: the hypotenuse is a whole number`);return Number(c);};
test('the round city: every problem’s story gives a city 240 across, and the line-of-sight lengths are whole numbers',()=>{
 for(let n=1;n<=10;n++){const d=cityDiameters(n);assert.ok(d.some(x=>Math.abs(x-240)<1e-6),`problem ${n} gives ${d}`);
  // Problems 1 and 8 also fit a second circle on the same line of sight: the one across the hypotenuse and the one inside.
  // Li Ye's diagram decides which is meant; the other one's diameter times 240 is 2ab, the identity of step 6.
  const [,e,t]=CITY[n],twoab=2*Math.abs(e[0]*t[1]);for(const x of d)if(Math.abs(x-240)>1e-6){assert.ok([1,8].includes(n),`problem ${n} has a second circle ${x}`);assert.ok(Math.abs(x*240-twoab)<1e-6);}}
 for(const id of ['d1','d2','d5','d6','d8','d9','d10'])expect(id,240);
 expect('xian1',wholeHypotenuse(320,600));expect('xian2',wholeHypotenuse(256,480));expect('xian6',wholeHypotenuse(192,360));expect('xian9',wholeHypotenuse(72,135));
 assert.equal(wholeHypotenuse(320,600),680);assert.equal(wholeHypotenuse(16,30),34);
});
test('the round city: Li Ye’s ten circles touch the right lines, and their signed pieces make up the triangle',()=>{
 const rnd=random(20261110);
 for(let i=0;i<300;i++){const a=.5+rnd()*30,b=.5+rnd()*30;
  for(const kind of Object.keys(X.LIYE)){const q=X.liye(kind,a,b),[x,y]=q.centre;
   // Distances to the lines of the east leg (y = 0), the south leg (x = 0) and the hypotenuse, measured directly.
   const dist=[Math.abs(y),Math.abs(x),Math.abs(b*x-a*y-a*b)/Math.hypot(a,b)];
   q.signs.forEach((g,j)=>{if(g)assert.ok(Math.abs(dist[j]-q.r)<1e-9*(1+q.r),`${kind} touches side ${j}`);else assert.ok(dist[j]<1e-9*(1+q.r),`${kind}: centre on side ${j}`);});
   // The sign says whether the centre is on the triangle's side of each line (+1), the far side (−1) or on it (0).
   const inside=[-1,1,-1],side=[y,x,b*x-a*y-a*b].map((v,j)=>Math.abs(v)<1e-9*(1+q.r)?0:Math.sign(v)*inside[j]);assert.deepEqual(side,q.signs,kind+' signs');
   const total=q.signs.reduce((s,g,j)=>s+g*q.r*[a,b,q.c][j]/2,0);assert.ok(Math.abs(total-a*b/2)<1e-9*a*b,kind+' pieces');}}
 // The choices: the rule from the centre divides by c, and the piece on the east leg is taken away in problem 6.
 assert.equal(X.LIYE.corner.divText,'c');expect('vertex','c');assert.equal(X.LIYE.acrossEast.signs[0],-1);expect('minus','outside');
});
test('the round city: nine of Li Ye’s triangles are multiples of (8, 15, 17), each by its own rule’s divisor',()=>{
 const unit=[8,15,17],divisors=Object.fromEntries(Object.entries(X.LIYE).map(([k,v])=>[k,v.div(...unit)]));
 assert.deepEqual(Object.values(divisors),[40,32,25,17,23,24,10,6,9,2]);
 const used={1:'inside',2:'eastLeg',3:'southLeg',4:'corner',6:'acrossEast',7:'acrossSouth',8:'acrossHypotenuse',9:'halfEast',10:'halfSouth'};
 for(const [n,kind] of Object.entries(used)){const [,e,t]=CITY[n],a=Math.abs(e[0]),b=Math.abs(t[1]),k=a/8;
  assert.ok(Number.isInteger(k)&&15*k===b&&17*k===wholeHypotenuse(a,b),`problem ${n} is a multiple of (8, 15, 17)`);assert.equal(k,divisors[kind],`problem ${n}: k equals the divisor`);
  assert.ok(Math.abs(X.liye(kind,a,b).d-240)<1e-9);}
 expect('k6',192/8);expect('div6',15+17-8);expect('twoab',2*8*15);
 // On one map, the line of sight of problem n runs from (start + east walk) to (start + south walk), with the city's radius 120.
 const sight=n=>{const [s,e,t]=CITY[n],S=[s[0]*120,s[1]*120];return [[S[0]+e[0],S[1]+e[1]],[S[0]+t[0],S[1]+t[1]]];};
 const onLine=([p,q],x)=>Math.abs((q[0]-p[0])*(x[1]-p[1])-(q[1]-p[1])*(x[0]-p[0]))<1e-9;
 const lines=[];for(let n=1;n<=10;n++){const L=sight(n);if(!lines.some(M=>onLine(M,L[0])&&onLine(M,L[1])))lines.push(L);}
 assert.equal(lines.length,2);assert.ok([1,2,3,4,6,7,8,9,10].every(n=>sight(n).every(x=>onLine(sight(1),x))),'nine lines of sight lie on problem 1’s');expect('sameLine','two');
 // The lab's map uses the same walks.
 for(const q of X.CITY_PROBLEMS){const [s,e,t]=CITY[q.n];assert.deepEqual(q.start,[s[0]*120,s[1]*120]);assert.deepEqual(q.walk,[e[0],t[1]]);}
 assert.notEqual(180*15,360*8);expect('p5','no');assert.ok(Math.abs(120/180+120/360-1)<1e-12);
 assert.ok(Math.abs(X.liye('hypotenuse',8*23,15*23).d-240)<1e-9,'23 × (8, 15, 17) also fits problem 5’s rule');
});
test('the round city: four diameters need no division, checked with the textbook radius formulas',()=>{
 // Problem 7's diameter, 240 from the story, against the three sums of its sides.
 const [a7,b7,c7]=[80,150,170];assert.deepEqual([b7+c7-a7,a7+c7-b7,a7+b7-c7],[240,100,60]);expect('d7','bca');
 // For a triangle with area K and semiperimeter s, the circle inside has radius K/s and the circle across side c has K/(s − c).
 const circles=(a,b,c)=>{const K=a*b/2,s=(a+b+c)/2;return {inside:2*K/s,acrossC:2*K/(s-c),acrossA:2*K/(s-a),acrossB:2*K/(s-b)};};
 const t=circles(3,4,5);expect('in345',t.inside);expect('out345',t.acrossC);expect('product','2ab');
 for(const [a,b,c] of [[3,4,5],[5,12,13],[8,15,17],[20,21,29],[320,600,680],[48,90,102]]){const q=circles(a,b,c);
  assert.ok(Math.abs(q.inside-(a+b-c))<1e-9&&Math.abs(q.acrossC-(a+b+c))<1e-9,`${a}, ${b}, ${c}`);assert.ok(Math.abs(q.inside*q.acrossC-2*a*b)<1e-9);
  assert.ok(Math.abs(q.acrossA-(a+c-b))<1e-9&&Math.abs(q.acrossB-(b+c-a))<1e-9);}
});
