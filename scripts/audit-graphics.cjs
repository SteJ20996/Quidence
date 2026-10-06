'use strict';
// Static fixtures for every active figure family. This is not a native browser test.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function collect(){
 const samples=[];function add(group,name,html){let i=0;for(const m of html.matchAll(/<svg\b[\s\S]*?<\/svg>/g))if(!m[0].includes('aria-hidden="true"'))samples.push({group,name:name+'-'+(++i),svg:m[0]});}
 for(const[id,svg]of Object.entries(require('./build-hub-illustrations.cjs').build()))add('hub',id,svg);
 for(const[id,svg]of Object.entries(require('./build-course-illustrations.cjs').covers()))add('course-covers',id,svg);
 const extra=require('../assets/school-course-content.js'),models=require('../assets/course-models.js');for(const id of extra.IDS){const c=extra.create(id);for(let i=0;i<c.LESSONS.length;i++){const l=c.LESSONS[i],cases=[l.defaults];for(const control of l.controls)for(const value of control.options?control.options.map(x=>x[0]):[control.min,control.max])cases.push({...l.defaults,[control.name]:value});for(let j=0;j<cases.length;j++)add('course-models',id+'-'+i+'-'+j,models.model(id,i,cases[j]).graph);}}
 const h=require('../modules/aa01/tests/workspace.cjs').load({expose:'window.testOnly={state,goto,miniLine,inequalityView,lapDiagram,timeGroups,separateAreaDiagram,areaDiagram,subtractionDiagram,coordinateGraph,costBlockDiagram,I:window.QuidenceIntegrated}; registerPageTools();'}),a=h.api;
 for(let i=0;i<a.state.queue.length;i++){a.goto(i);add('aa01',a.state.queue[i],h.app.innerHTML);}
 for(const x of[1,6]){add('aa01','area-'+x,a.areaDiagram(x,true));add('aa01','subtraction-'+x,a.subtractionDiagram(x+3));}
 for(const id of['QP','QN'])for(const x of[2,50])add('aa01',id+'-'+x,a.I.preview(id,{x1:x,x2:-x,x3:0},true));
 for(let stage=0;stage<3;stage++)add('aa01','equation-'+stage,a.I.equationDrawing(stage));
 add('aa01','cost-24',a.costBlockDiagram({unit:'players',plans:[['Plan A',24,3],['Plan B',6,5]],budget:90},24));
 const solid=require('../modules/aa01/dist/geometry.js');for(const stage of[0,1,2])for(const yaw of[-.65,0,1.57])for(const zoom of[1,1.75])add('aa01',`solid-${stage}-${yaw}-${zoom}`,solid.render({stage,yaw,zoom,x:5}));
 const context={window:{},console};vm.createContext(context);for(const file of['math.js','graphs.js'])vm.runInContext(read('modules/ad01/dist/'+file),context);
 const G=context.window.AD01Graphs,C=require('../modules/ad01/dist/content.js');
 for(const l of C.LESSONS)for(const t of[l.predict,...l.checks])add('ad01',t.graph,G.task(t.graph));
 for(const kind of['hole','jump'])for(const side of[-1,1])for(const d of[.5,.005])add('ad01',`limit-${kind}-${side}-${d}`,G.limits(kind,d,side));
 for(const kind of['square','absolute'])for(const x of[-2,0,2])for(const d of[-1,-.001,.001,1])add('ad01',`derivative-${kind}-${x}-${d}`,G.derivative(kind,x,d,true));
 for(const kind of['square','linear'])for(const n of[2,64])for(const method of['left','midpoint','right'])add('ad01',`integral-${kind}-${n}-${method}`,G.integral(kind,2,n,method));
 for(const x of[-2,-1,0,1,2])for(const d of[-1,-.02,.02,1])add('ad01',`connection-${x}-${d}`,G.connection(x,d));
 const course=require('../assets/course-graphs.js');for(const id of['ae01','af01']){const content=require('../modules/'+id+'/dist/content.js');for(let i=0;i<content.LESSONS.length;i++){const l=content.LESSONS[i];for(const t of[l.predict,...l.checks])add(id,t.id,course.task(t.graph));const cases=[l.defaults];for(const control of l.controls)for(const value of control.options?control.options.map(x=>x[0]):[control.min,control.max])cases.push({...l.defaults,[control.name]:value});for(let j=0;j<cases.length;j++)add(id,`lab-${i}-${j}`,course.lab(id,i,cases[j]).graph);}}
 const bank=require('../assets/foundation-bank.js'),foundation=require('../assets/foundation-graphs.js');for(const bankSet of[bank,require('../assets/foundation-extension.js')])for(const[id,subject]of Object.entries(bankSet.MODULES))for(const task of subject.tasks)for(const width of[320,520])add('foundations',task.id+'-'+width,foundation.visual(task,width));
 // Reuse the existing UI fixtures to exercise the actual matrix renderers.
 const ab=path.join(root,'modules/ab01'),prior=process.cwd();process.chdir(ab);
 try{const fixture=read('modules/ab01/tests/matrix-flow.test.cjs').split('const h=harness();')[0];const c={require,console,Blob,URL,structuredClone,AbortController,__dirname:path.join(ab,'tests')};vm.createContext(c);vm.runInContext(fixture+';globalThis.load=harness;',c);const m=c.load();
 for(const p of require('../modules/ab01/dist/matrix-engine.js').PRESETS){m.configure({matrix:p.matrix,vector:[3,-3]});for(const plane of['input','output'])add('ab01',p.id+'-'+plane,`<svg viewBox="0 0 440 440">${m.document.getElementById(plane+'-svg').innerHTML}</svg>`);}
 const diagnostic=read('modules/ab01/tests/flow.test.cjs').split('(async()=>{')[0],dc={require,console,Blob,URL,structuredClone,__dirname:path.join(ab,'tests')};vm.createContext(dc);vm.runInContext(diagnostic+';globalThis.load=harness;',dc);const dh=dc.load();for(let i=0;i<12;i++){add('ab01','diagnostic-'+i,dh.document.getElementById('app').innerHTML);dh.click('skip');}
 const Element=require('../modules/ab01/tests/learning-dom.cjs'),body=new Element();body.innerHTML='<div id="guided-workspace"></div>';const doc={getElementById:id=>body.querySelector('#'+id),querySelectorAll:s=>body.querySelectorAll(s)};
 for(const width of[280,480]){const c={window:{},document:doc,AbortController,console,performance:{now:()=>0},requestAnimationFrame:f=>{f(5000);return 1;},cancelAnimationFrame(){},setTimeout(){},clearTimeout(){}};vm.createContext(c);vm.runInContext(read('modules/ab01/dist/matrix-guide-engine.js'),c);vm.runInContext(read('modules/ab01/dist/matrix-guide.js').replace('width=Math.max(280,svg.getBoundingClientRect().width)',`width=${width}`),c);for(let i=0;i<7;i++){c.window.MatrixGuide.show(i);const svg=doc.getElementById('guide-svg');add('ab01',`guide-${width}-${i}`,`<svg viewBox="${svg.getAttribute('viewBox')}">${svg.innerHTML}</svg>`);}}
 }finally{process.chdir(prior);}
 return samples;
}
function styles(group){const paths={aa01:'modules/aa01/dist/style.css',ab01:'modules/ab01/dist/style.css',ad01:'modules/ad01/dist/style.css',ae01:'modules/ad01/dist/style.css',af01:'modules/ad01/dist/style.css','course-models':'modules/ad01/dist/style.css',foundations:'assets/foundation.css'};return `:root{--blue:#2147df;--ink:#182446;--f-teal:#087f76} text{font-family:sans-serif}`+(paths[group]?read(paths[group]).split('}').filter(r=>/graph-|model-|equation-model|solid-|positive-curve|negative-curve|f-(grid|curve|axis|dot|open|area|ticks|point|secondary|arrowhead)|\.tick|plot-label|axis-label/.test(r)).map(r=>r+'}').join(''):'');}
function standalone(sample){return sample.svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"').replace('xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"','xmlns="http://www.w3.org/2000/svg"').replace(/(<svg[^>]*>)/,'$1<style>'+styles(sample.group)+'</style>');}
function write(destination){fs.mkdirSync(destination,{recursive:true});const all=collect();for(let i=0;i<all.length;i++){const s=all[i];s.file=String(i).padStart(3,'0')+'-'+s.group+'-'+s.name.replace(/[^\w.-]/g,'-')+'.svg';fs.writeFileSync(path.join(destination,s.file),standalone(s));}fs.writeFileSync(path.join(destination,'manifest.json'),JSON.stringify(all.map(({svg,...s})=>s),null,2));console.log(`${all.length} static SVG fixtures written to ${destination}`);return all;}
module.exports={collect,standalone,write};if(require.main===module)write(path.resolve(process.argv[2]||path.join(root,'graphics-audit')));
