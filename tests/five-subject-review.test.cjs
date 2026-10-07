'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process'),fs=require('node:fs');
const F=require('../assets/foundation-engine.js'),D=require('../assets/challenge-bank.js'),B=require('../assets/project-bank.js'),P=require('../assets/project-tools.js'),R=require('../assets/report-tools.js'),G=require('../assets/foundation-graphs.js');
const E=F.forBank(B,{VERSION:'none',MODULES:{}},{schema:'cluevera_project_portfolio_v1',challenge:true,projects:true,fieldTypes:P.fieldTypes});
function drawingPayload(){const t=B.MODULES.geometry.tasks[0],f=t.fields.find(f=>f.kind==='drawing');let d=P.emptyDrawing();d=P.place(f,d,'M',5,1);d=P.place(f,d,'N',1,4);d=P.place(f,d,'G',2,3);d=P.connect(f,d,'M','N');return{markdown:'# A synthetic report\n\n> <script>student text</script>',observations:[{title:'Synthetic construction',components:[{drawing:d,drawingSpec:{id:f.id,label:f.label,board:f.board}}]}]};}
test('all reported recurring decimal cases are accepted while exact fractions and wrong nearby values remain distinct',()=>{
 const cases={'la-c05':{c:'1.1111',r1:'0.8889',r2:'-1.2222',r3:'0.7778'},'la-c06':{alpha:'1.1667',sse:'0.1667'},'ca-c03':{net:'1.3333',position:'6.3333'},'pa-c03':{rate:'0.3333'},'ge-c03':{fraction:'0.0370',c:'138.6667'},'a2-c01':{small:'-0.3333'},'st-c01':{conditional:'0.6667'},'st-c02':{a:'0.2333'},'st-c03':{variance:'3.3333',newVariance:'13.3333'},'st-c04':{a:'0.3333',residual:'-1.3333',r2:'0.4286'}};
 let n=0;for(const[id,values]of Object.entries(cases)){const t=Object.values(D.MODULES).flatMap(m=>m.tasks).find(t=>t.id===id);for(const[key,value]of Object.entries(values)){const f=t.fields.find(f=>f.id===key);assert(f,id+' '+key);assert(F.numberMatches(f,value,F.NUMERIC_POLICY),id+' '+key);n++;}}
 for(const[id,key,value]of [['pa-p02','newSpeed','3.1818'],['st-p02','pocketGivenPlastic','0.1111']]){const t=Object.values(B.MODULES).flatMap(m=>m.tasks).find(t=>t.id===id);assert(F.numberMatches(t.fields.find(f=>f.id===key),value,F.NUMERIC_POLICY));n++;}
 const base=require('../assets/foundation-bank.js');for(const[module,id,key,value]of [['af01','af-f10','c','0.8333'],['ae01','ae-f14','reverse','0.4444']]){const t=base.MODULES[module].tasks.find(t=>t.id===id),f=t.fields.find(f=>f.id===key);assert(f,id+' '+key);assert(F.numberMatches(f,value,F.NUMERIC_POLICY));n++;}
 assert.equal(n,23);assert(!F.numberMatches({answer:1/9},'0.12',F.NUMERIC_POLICY));assert(!F.numberMatches({answer:1/9},'11/100',F.NUMERIC_POLICY));
});
test('new task definitions separate inherited answers and constrained optima, retaining version 2 for earlier checks',()=>{
 const a=D.MODULES['algebra-1'].tasks[0],la=D.MODULES.ab01.tasks[0];assert.notEqual(a.prompt,la.prompt);assert.equal(a.fields.find(f=>f.id==='k').answer,4);assert.equal(a.fields.find(f=>f.id==='y').answer,-0.5);
 const design=B.MODULES['algebra-1'].tasks[1];assert.equal(design.fields.find(f=>f.id==='constraint').answer,6);assert.equal(design.fields.find(f=>f.id==='maximum').answer,108);assert(30-2*7.5<3*7.5);
 assert.equal(B.HISTORY['quidence-projects-2']['algebra-1'].tasks[1].fields.find(f=>f.id==='maximum').answer,112.5);
 assert.deepEqual(D.HISTORY['quidence-challenges-2'],require('../assets/challenge-bank-v2.js').MODULES);
 const geo=D.MODULES.geometry.tasks[0];assert(!geo.visual.segment);assert(geo.referenceVisual.segment);assert.deepEqual(geo.visual.points.map(p=>p[2]),['A','B','C']);
 const claim=B.MODULES.ae01.tasks[0].steps[2].prompt;assert.match(claim,/mean d=A−B is positive/);assert.match(claim,/not as a separate significance test/);
});
test('table data stays intact and its horizontal scroll region is keyboard accessible',()=>{
 const table=D.MODULES.ae01.tasks[1].table,html=G.table(table);assert.match(html,/tabindex="0"/);assert.match(html,/Scroll horizontally/);assert.match(html,/B attempts/);for(const row of table.rows)for(const value of row)assert(html.includes(String(value)));
});
test('coordinate display is bounded while saved construction precision and distinct error reasons are retained',()=>{
 const f=B.MODULES.geometry.tasks[0].fields.find(f=>f.kind==='drawing'),v=P.place(f,P.emptyDrawing(),'G','11/3','3');assert.equal(v.points.G[0],11/3);assert.match(P.fieldTypes.drawing.text(f,v),/3\.6667/);assert.doesNotMatch(P.fieldTypes.drawing.text(f,v),/66666666/);
 assert.match(P.placementError(f,'G','13','3'),/Keep x between/);assert.match(P.placementError(f,'G','bad','3'),/number or fraction/);assert.match(P.connectionError(v,'G','G'),/different points/);assert.match(P.connectionError(v,'M','N'),/Place M and N/);
});
test('print exports include the student drawing rather than substituting a reference, and reject unsafe specifications',()=>{
 const payload=drawingPayload(),before=JSON.stringify(payload),html=R.printable('Geometry',payload),md=R.markdown('Geometry',payload);
 assert.match(html,/<svg xmlns=/);assert.match(html,/G=\(2, 3\)/);assert.doesNotMatch(html,/G=\(3\.6667/);assert.match(html,/&lt;script&gt;student text/);assert.doesNotMatch(html,/<script>student text/);assert.match(md,/!\[.*\]\(Quidence_Drawing_1_1\.svg\)/);assert.equal(JSON.stringify(payload),before);
 const bad=structuredClone(payload);bad.observations[0].components[0].drawingSpec.board.xmax='"><script>bad</script>';assert.doesNotMatch(R.printable('Geometry',bad),/<svg/);
 const huge=structuredClone(payload);huge.observations[0].components[0].drawingSpec.board.xmin=1e100;huge.observations[0].components[0].drawingSpec.board.xmax=1e100+10;assert.equal(P.reportDrawings(huge).length,0);
});
test('drawing packages are readable ZIP files with valid CRCs and matching Markdown image attachments',()=>{
 const payload=drawingPayload(),d=P.reportDrawings(payload)[0],md=R.markdown('Geometry',payload),bytes=P.zipFiles([{name:'Quidence_Report.md',content:md},{name:d.filename,content:P.svg(d.spec,d.drawing)}]);
 const r=spawnSync('python',['-c','import sys,io,zipfile; z=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read())); assert z.testzip() is None; md=z.read("Quidence_Report.md").decode(); svg=z.read("Quidence_Drawing_1_1.svg").decode(); assert "](Quidence_Drawing_1_1.svg)" in md; assert "<svg xmlns=" in svg; print(len(z.namelist()))'],{input:bytes,encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(r.stdout.trim(),'2');
 assert.throws(()=>P.zipFiles([{name:'../unsafe.svg',content:'x'}]),/Unsupported/);
});
test('the current publication removes AP promotion, the unused old logo and screenshot-derived fixtures',()=>{
 for(const file of ['index.html','assets/course-catalog.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/AP Calculus|AP Statistics/);
 assert(!fs.existsSync('modules/aa01/dist/cluevera-logo.png'));assert(!fs.existsSync('modules/aa01/tests/previous-response-fixture.json'));assert.match(fs.readFileSync('modules/aa01/tests/synthetic-response-fixture.json','utf8'),/Synthetic regression/);
 assert.match(fs.readFileSync('data-use/index.html','utf8'),/checked October 7, 2026/);
});

test('the shared school foundation entry names its actual coverage without pretending to cover Geometry or Algebra II',()=>{
 const C=require('../assets/course-catalog.js').COURSES;for(const id of ['pre-algebra','algebra-1']){assert.equal(C[id].foundation,'foundations/?module=aa01');assert.match(C[id].foundationLabel,/Shared Pre-Algebra \/ Algebra I/);}for(const id of ['geometry','algebra-2'])assert.equal(C[id].foundation,undefined);
 const home=fs.readFileSync('index.html','utf8');assert.equal((home.match(/href="foundations\/\?module=aa01"/g)||[]).length,2);
});
