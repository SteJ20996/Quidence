'use strict';
// Discrete Mathematics projects: structure, Spanish coverage, and every checked answer recomputed independently,
// mostly by brute force rather than by the formulas the proofs use.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),build=require('../scripts/build-discrete-math.cjs'),C=require('../courses/number-theory/core.js');
const data=JSON.parse(fs.readFileSync(path.join(root,'courses/discrete-math/data.json'),'utf8'));
const field=(project,id)=>{const p=data.find(p=>p.id===project);for(const s of p.steps)for(const f of s.fields)if(f.id===id)return f;throw Error('No field '+project+'.'+id);};
const combinations=(items,k)=>{const out=[];(function go(start,pick){if(pick.length===k){out.push(pick.slice());return;}for(let i=start;i<items.length;i++){pick.push(items[i]);go(i+1,pick);pick.pop();}})(0,[]);return out;};
const permutations=n=>{const out=[];(function go(prefix,rest){if(!rest.length){out.push(prefix);return;}rest.forEach((x,i)=>go([...prefix,x],[...rest.slice(0,i),...rest.slice(i+1)]));})([],Array.from({length:n},(_,i)=>i));return out;};
// Exact-cover search: can the cells in `free` (a Set of "r,c") be covered by the given tile shapes?
function coverable(free,shapes){
 const cells=[...free].map(k=>k.split(',').map(Number)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),key=([r,c])=>r+','+c,left=new Set(free),memo=new Map();
 function go(){
  if(!left.size)return true;const id=[...left].sort().join('|');if(memo.has(id))return memo.get(id);
  const first=cells.find(c=>left.has(key(c)));let ok=false;
  for(const shape of shapes)for(const [ar,ac] of shape){const placed=shape.map(([r,c])=>[first[0]+r-ar,first[1]+c-ac]);
   if(!ok&&placed.every(c=>left.has(key(c)))&&placed.every(c=>c[0]>first[0]||(c[0]===first[0]&&c[1]>=first[1]))){placed.forEach(c=>left.delete(key(c)));ok=go();placed.forEach(c=>left.add(key(c)));}}
  memo.set(id,ok);return ok;
 }
 return go();
}
const DOMINO=[[[0,0],[0,1]],[[0,0],[1,0]]],TROMINO=[[[0,0],[1,0],[0,1]],[[0,0],[1,0],[1,1]],[[0,0],[0,1],[1,1]],[[1,0],[0,1],[1,1]]];
const board=(rows,cols,removed=[])=>{const s=new Set();for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(!removed.some(([a,b])=>a===r&&b===c))s.add(r+','+c);return s;};
const expect=(project,id,value)=>{const f=field(project,id);if(f.type==='number')assert.ok(C.equalNumber(f.answer,String(value)),project+'.'+id+': stored '+f.answer+', recomputed '+value);else assert.deepEqual(f.answer,value,project+'.'+id);};

test('ten bilingual projects with well-formed fields and up-to-date page data',()=>{
 assert.equal(fs.readFileSync(build.OUT,'utf8'),build.serialized(),'run node scripts/build-discrete-math.cjs');
 assert.deepEqual(data.map(p=>p.id),Array.from({length:10},(_,i)=>'dm-p'+String(i+1).padStart(2,'0')));
 assert.equal(data.reduce((n,p)=>n+p.steps.length,0),40);
 const catalog=build.discreteMathCatalog();
 for(const p of data){
  for(const key of ['title','topic','prompt','approach','uses','nextCheck'])assert.ok(catalog[p[key]],p.id+'.'+key+' has Spanish');
  for(const s of p.steps){
   assert.ok(s.fields.length&&s.proof.length>100,p.id+' '+s.title);
   for(const para of s.proof.split(/\n\s*\n/))assert.ok(catalog[para.replace(/\s+/g,' ').trim()],'Spanish proof paragraph: '+para.slice(0,40));
   for(const f of s.fields){
    assert.ok(catalog[f.label],'Spanish label '+f.label);
    if(f.type==='number'){assert.equal(C.grade(f,f.answer).status,'correct',p.id+'.'+f.id);assert.ok(f.accepted.includes(f.answer));}
    if(f.type==='choice'){assert.ok(f.options.some(o=>o.value===f.answer));assert.equal(new Set(f.options.map(o=>o.value)).size,f.options.length);assert.equal(C.grade(f,f.answer).status,'correct');}
    if(f.type==='multi'){assert.ok(f.answer.every(v=>f.options.some(o=>o.value===v)));assert.equal(C.grade(f,f.answer.slice()).status,'correct');assert.equal(C.grade(f,f.answer.slice(0,-1)).status,'retry');}
    if(f.type==='reason')assert.ok(f.criteria.length>=2&&f.criteria.every(c=>catalog[c]),p.id+'.'+f.id+' criteria');
    for(const o of f.options||[])assert.ok(catalog[o.label],'Spanish option '+o.label);
   }
  }
 }
 // Prose that should read differently in Spanish was really translated.
 for(const [en,es]of Object.entries(catalog))if(/[A-Za-z]{4}/.test(en.replace(/\b(?:Königsberg|Kruskal|Fibonacci|Binet|Brooks|Gomory|Euler|Pascal)\b/g,'')))assert.notEqual(es,en,'untranslated: '+en.slice(0,60));
});

test('exam timetables: the clash graph needs exactly three slots',()=>{
 const prompt=data[0].prompt,edges=[...prompt.matchAll(/\b([A-F])–([A-F])\b/g)].map(m=>[m[1],m[2]]),V='ABCDEF'.split('');
 assert.equal(edges.length,7);expect('dm-p01','edges',edges.length);expect('dm-p01','degree',edges.filter(e=>e.includes('A')).length);
 const ok=col=>edges.every(([a,b])=>col[a]!==col[b]);let chi=0;
 for(let k=1;k<=6&&!chi;k++)for(let code=0;code<k**6&&!chi;code++){const col={};V.forEach((v,i)=>col[v]=Math.floor(code/k**i)%k);if(ok(col))chi=k;}
 expect('dm-p01','slots',chi);expect('dm-p01','bound',Math.max(...V.map(v=>edges.filter(e=>e.includes(v)).length))+1);
 const cycle=['A','B','C','D','E','A'];assert.ok(cycle.slice(1).every((v,i)=>edges.some(([a,b])=>(a===cycle[i]&&b===v)||(b===cycle[i]&&a===v))));expect('dm-p01','cycle',cycle.length-1);
 const plan=field('dm-p01','plan'),valid=plan.options.filter(o=>{const col={};o.label.split('·').forEach((slot,i)=>slot.replace(/.*:/,'').split(',').forEach(x=>col[x.trim()]=i));return V.every(v=>v in col)&&ok(col);}).map(o=>o.value);
 assert.deepEqual(valid,[plan.answer]);
});

test('city routes: shortest paths, a closed corner and row sums',()=>{
 const routes=(x,y,closed)=>{const f=(i,j)=>closed&&i===closed[0]&&j===closed[1]?0:i===0&&j===0?1:(i>0?f(i-1,j):0)+(j>0?f(i,j-1):0);return f(x,y);};
 expect('dm-p02','blocks',8);expect('dm-p02','routes',routes(5,3));expect('dm-p02','west',routes(4,3));expect('dm-p02','south',routes(5,2));
 expect('dm-p02','avoid',routes(5,3,[2,1]));expect('dm-p02','through',routes(5,3)-routes(5,3,[2,1]));
 let poly=[1];for(let i=0;i<8;i++)poly=poly.map((c,k)=>c+(poly[k-1]||0)).concat(1);
 expect('dm-p02','rowsum',poly.reduce((a,b)=>a+b,0));expect('dm-p02','coefficient',poly[3]);
});

test('pigeonholes: sums to 21 and dividing pairs, checked over every choice',()=>{
 const nums=Array.from({length:20},(_,i)=>i+1),sum21=s=>s.some((a,i)=>s.slice(i+1).some(b=>a+b===21)),divides=s=>s.some((a,i)=>s.slice(i+1).some(b=>b%a===0||a%b===0));
 let picks=0;for(let k=1;k<=20&&!picks;k++)if(combinations(nums,k).every(sum21))picks=k;expect('dm-p03','picks',picks);
 expect('dm-p03','boxes',new Set(nums.map(n=>Math.min(n,21-n))).size);
 const sets={low:nums.slice(0,10),high:nums.slice(10),odd:nums.filter(n=>n%2),mixed:[...nums.slice(0,9),12]};
 expect('dm-p03','safe',field('dm-p03','safe').options.map(o=>o.value).filter(v=>!sum21(sets[v])));
 const odd=n=>{while(n%2===0)n/=2;return n;};expect('dm-p03','parts',new Set(nums.map(odd)).size);expect('dm-p03','part12',odd(12));
 assert.ok(combinations(nums,11).every(divides),'every 11 numbers contain a dividing pair');
 const examples={high:nums.slice(10),low:nums.slice(0,10),even:nums.filter(n=>n%2===0),odd:nums.filter(n=>n%2)};
 expect('dm-p03','example',field('dm-p03','example').options.map(o=>o.value).find(v=>!divides(examples[v])));
 // Socks: the smallest draw that forces a pair or three of a kind in 4 colors.
 const force=k=>{for(let n=1;;n++)if(n>4*(k-1))return n;};expect('dm-p03','pair',force(2));expect('dm-p03','triple',force(3));
});

test('Tower of Hanoi: shortest solutions by search',()=>{
 const shortest=n=>{const start='0'.repeat(n),goal='2'.repeat(n),seen=new Map([[start,0]]),queue=[start];
  while(queue.length){const s=queue.shift();if(s===goal)return seen.get(s);
   for(let from=0;from<3;from++){const disc=[...s].findIndex(p=>p==String(from));if(disc<0)continue;
    for(let to=0;to<3;to++){if(to===from)continue;const blocked=[...s].slice(0,disc).some(p=>p==String(to));if(blocked)continue;const next=s.slice(0,disc)+to+s.slice(disc+1);if(!seen.has(next)){seen.set(next,seen.get(s)+1);queue.push(next);}}}}};
 // Disc 0 is the smallest; a disc may move if no smaller disc sits on its peg, onto a peg with no smaller disc.
 expect('dm-p04','m3',shortest(3));expect('dm-p04','m4',shortest(4));assert.equal(shortest(5),31);
 let m=1;for(let n=2;n<=20;n++){m=2*m+1;if(n===10)expect('dm-p04','m10',m);}expect('dm-p04','m20',m);
 const moves=[];const hanoi=(n,a,b,c)=>{if(!n)return;hanoi(n-1,a,c,b);moves.push(n);hanoi(n-1,b,a,c);};hanoi(5,0,1,2);expect('dm-p04','smallest',moves.filter(d=>d===1).length);
});

test('broken chessboards: color counts and exhaustive searches on small boards',()=>{
 const left=board(8,8,[[0,0],[7,7]]);expect('dm-p05','dark',[...left].filter(k=>{const [r,c]=k.split(',').map(Number);return (r+c)%2===0;}).length);
 expect('dm-p05','light',[...left].filter(k=>{const [r,c]=k.split(',').map(Number);return (r+c)%2===1;}).length);expect('dm-p05','covered',31);
 for(let n=2;n<=6;n++)assert.equal(coverable(board(n,n,[[0,0],[n-1,n-1]]),DOMINO),false,n+'×'+n+' without opposite corners');
 assert.equal(coverable(board(6,6,[[0,0],[0,1]]),DOMINO),true,'one dark and one light square removed');
});

test('L-trominoes: counts and coverings found by search',()=>{
 for(let r=0;r<4;r++)for(let c=0;c<4;c++)assert.ok(coverable(board(4,4,[[r,c]]),TROMINO),'4×4 without '+r+','+c);
 expect('dm-p06','base',(4-1)/3);expect('dm-p06','t3',(4**3-1)/3);expect('dm-p06','t5',(4**5-1)/3);expect('dm-p06','t4',(4**4-1)/3);
 // The 5 × 5 claim in the next challenge: some single removals make a covering impossible.
 const fits=[];for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(coverable(board(5,5,[[r,c]]),TROMINO))fits.push(r+','+c);
 assert.deepEqual(fits,['0,0','0,2','0,4','2,0','2,2','2,4','4,0','4,2','4,4']);
});

test('Königsberg: degrees, parity and the fewest new bridges',()=>{
 const bridges=[['A','B'],['A','B'],['A','C'],['A','C'],['A','D'],['B','D'],['C','D']],deg=list=>{const d={A:0,B:0,C:0,D:0};list.forEach(([a,b])=>{d[a]++;d[b]++;});return d;};
 const d=deg(bridges),odd=list=>Object.values(deg(list)).filter(v=>v%2).length;
 expect('dm-p07','sum',Object.values(d).reduce((a,b)=>a+b,0));expect('dm-p07','bridges',bridges.length);expect('dm-p07','odd',odd(bridges));
 const pairs=combinations(['A','B','C','D'],2),fewest=target=>{for(let k=0;k<=3;k++)if(combinations([...pairs,...pairs],k).some(extra=>odd([...bridges,...extra])<=target))return k;};
 expect('dm-p07','trail',fewest(2));expect('dm-p07','closed',fewest(0));
});

test('domino strips and the characteristic equation',()=>{
 const T=n=>{let count=0;(function go(filled){if(filled===n){count++;return;}go(filled+1);if(filled+2<=n)go(filled+2);})(0);return count;};
 // Cross-check the left-end decomposition against an exact-cover search of the 2 × n board.
 for(let n=1;n<=7;n++)assert.equal(T(n),(()=>{let c=0;const cells=[...board(2,n)];(function go(left){if(!left.size){c++;return;}const first=[...left].map(k=>k.split(',').map(Number)).sort((a,b)=>a[1]-b[1]||a[0]-b[0])[0];for(const [dr,dc] of [[0,1],[1,0]]){const other=(first[0]+dr)+','+(first[1]+dc);if(left.has(other)){const k=first.join(',');left.delete(k);left.delete(other);go(left);left.add(k);left.add(other);}}})(new Set(cells));return c;})());
 expect('dm-p08','t3',T(3));expect('dm-p08','t4',T(4));expect('dm-p08','t10',T(10));expect('dm-p08','n144',Array.from({length:20},(_,i)=>i).find(n=>T(n)===144));
 const roots=[];for(let r=-10;r<=10;r++)if(r*r-5*r+6===0)roots.push(r);expect('dm-p08','root',Math.max(...roots));
 const a=[2,5];for(let n=2;n<=5;n++)a.push(5*a[n-1]-6*a[n-2]);expect('dm-p08','a5',a[5]);
});

test('mixed-up hats: inclusion–exclusion and derangements by enumeration',()=>{
 const upto=Array.from({length:1000},(_,i)=>i+1);
 expect('dm-p09','a23',upto.filter(n=>n%2===0&&n%3===0).length);expect('dm-p09','union',upto.filter(n=>n%2===0||n%3===0||n%5===0).length);expect('dm-p09','none',upto.filter(n=>n%2&&n%3&&n%5).length);
 const D=n=>permutations(n).filter(p=>p.every((x,i)=>x!==i)).length;
 expect('dm-p09','f1',permutations(4).filter(p=>p[0]===0).length);expect('dm-p09','d4',D(4));expect('dm-p09','d5',D(5));expect('dm-p09','d6',D(6));
 expect('dm-p09','p5',D(5)+'/120');assert.equal(C.grade(field('dm-p09','p5'),'0.37').status,'correct');assert.equal(C.grade(field('dm-p09','p5'),'0.36').status,'retry');
 assert.ok(Math.abs(D(5)/120-1/Math.E)<0.002);expect('dm-p09','limit','e');
});

test('cheapest network: every spanning tree checked',()=>{
 const prompt=data[9].prompt,cables=[...prompt.matchAll(/\b([A-F])–([A-F]) (\d+)/g)].map(m=>[m[1],m[2],Number(m[3])]);assert.equal(cables.length,9);
 const spanning=set=>{const parent={};const find=x=>parent[x]===undefined||parent[x]===x?x:find(parent[x]);for(const [a,b] of set){const ra=find(a),rb=find(b);if(ra===rb)return false;parent[ra]=rb;}return new Set('ABCDEF'.split('').map(find)).size===1;};
 const best=list=>Math.min(...combinations(list,5).filter(spanning).map(s=>s.reduce((n,c)=>n+c[2],0)));
 expect('dm-p10','edges',5);expect('dm-p10','cost',best(cables));expect('dm-p10','newCost',best(cables.map(c=>c[0]+c[1]==='EF'?[c[0],c[1],10]:c)));
 const tree=combinations(cables,5).filter(spanning).find(s=>s.reduce((n,c)=>n+c[2],0)===best(cables));
 expect('dm-p10','leaves','ABCDEF'.split('').filter(v=>tree.filter(c=>c.includes(v)).length===1).length);
 // Kruskal's rejections: cables whose ends are already joined when they are reached.
 const parent={};const find=x=>parent[x]===undefined||parent[x]===x?x:find(parent[x]);const rejected=[];
 for(const [a,b,w] of cables.slice().sort((x,y)=>x[2]-y[2])){const ra=find(a),rb=find(b);if(ra===rb)rejected.push((a+b).toLowerCase());else parent[ra]=rb;}
 expect('dm-p10','rejected',field('dm-p10','rejected').options.map(o=>o.value).filter(v=>rejected.includes(v)));
});

test('lab helpers agree with the projects',()=>{
 const D=require('../courses/discrete-math/core.js');
 // Every tromino covering drawn by the lab is valid, for each removed square on boards up to 8 × 8.
 for(let n=1;n<=3;n++)for(let r=0;r<2**n;r++)for(let c=0;c<2**n;c++){
  const {grid,count}=D.tromino(n,[r,c]),cells=new Map();assert.equal(count,(4**n-1)/3);
  grid.forEach((row,i)=>row.forEach((id,j)=>{if(id===-1)assert.deepEqual([i,j],[r,c]);else{assert.ok(id>0);cells.set(id,[...(cells.get(id)||[]),[i,j]]);}}));
  for(const piece of cells.values()){assert.equal(piece.length,3);const rows=piece.map(x=>x[0]),cols=piece.map(x=>x[1]);assert.equal(Math.max(...rows)-Math.min(...rows),1);assert.equal(Math.max(...cols)-Math.min(...cols),1);}
 }
 assert.equal(D.pathCounts(5,3)[5][3],56);assert.equal(D.pathCounts(5,3,[2,1])[5][3],26);
 assert.equal(D.stripTilings(6).length,13);assert.equal(D.stripTilings(10).length,89);
 assert.equal(D.permutations(4).filter(D.derangement).length,9);assert.equal(D.permutations(5).filter(D.derangement).length,44);
 assert.equal(D.kruskal(D.CABLES).at(-1).total,17);assert.deepEqual(D.kruskal(D.CABLES).filter(x=>!x.accepted).map(x=>x.a+x.b),['AB','CD','CE','DF']);
 assert.deepEqual(D.clashes({A:1,B:2,C:1,D:2,E:3,F:2}),[]);assert.equal(D.clashes({A:1,B:1,C:1,D:1,E:1,F:1}).length,7);
 assert.equal(Object.values(D.degrees([])).filter(d=>d%2).length,4);assert.equal(Object.values(D.degrees([['B','C']])).filter(d=>d%2).length,2);assert.equal(Object.values(D.degrees([['B','C'],['A','D']])).filter(d=>d%2).length,0);
 let pegs=D.hanoiStart(3);for(const [f,t] of [[0,2],[0,1],[2,1],[0,2],[1,0],[1,2],[0,2]])pegs=D.hanoiMove(pegs,f,t);assert.deepEqual(pegs,[[],[],[3,2,1]]);
 assert.equal(D.hanoiMove(D.hanoiMove(D.hanoiStart(3),0,1),0,1),null);
});
