export const KEY='quidence-college-voice-demo-v1';
export const copy=x=>JSON.parse(JSON.stringify(x));
export const fmt=(n,d=2)=>Number(n.toFixed(d)).toString();
export function parseNumber(raw){const s=String(raw).trim().replaceAll('−','-');if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s))return null;const n=Number(s.replace(',','.'));return Number.isFinite(n)?n:null;}
export function vectorModel(angle=45,transfer=false){
 const k=transfer?3:2,x=transfer?3:2*Math.cos(angle*Math.PI/180),y=transfer?4:2*Math.sin(angle*Math.PI/180);
 const before=Math.hypot(x,y),after=Math.hypot(k*x,y);return {x,y,k,before,after,factor:after/before,angle};
}
export function intervalModel(n=40,level=95){
 const mean=3.2,sigma=8,z=level===99?2.576:1.96,se=sigma/Math.sqrt(n),half=z*se;
 return {n,level,mean,sigma,z,se,half,lo:mean-half,hi:mean+half};
}
export const defaults=id=>id==='linear'?{angle:45}:{n:40,level:95};
export const blank=id=>({id:globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(36).slice(2),createdAt:new Date().toISOString(),phase:0,reached:0,model:defaults(id),claim:'',draft:'',first:null,samples:[],observation:'',number:'',reason:'',focus:'',review:null,correction:'',followNumber:'',followText:'',followSaved:null,transferNumber:'',transferText:'',transfer:null,reflection:'',reflectedAt:null,reflections:[],voiceSources:[]});
export function modelFor(id,s,transfer=false){return id==='linear'?vectorModel(s.model.angle,transfer):intervalModel(transfer?40:s.model.n,transfer?99:s.model.level);}
export const subject={
 linear:{name:'Linear Algebra',title:'Think in Vectors',subtitle:'Stretch one direction. Explain what changes.',tag:'DIRECTIONS, LENGTH & TRANSFORMATIONS',question:'“Double the horizontal coordinate, and every vector becomes twice as long.” Does that claim hold?',prompt:'Compare the two vector lengths. Explain whether a horizontal stretch by 2 doubles length in every direction.',number:'Length factor: transformed ÷ original',focus:[['universal','The claim about every direction'],['counterexample','A counterexample or a special direction'],['unsure','I am still separating the two ideas'],['custom','Keep my wording open for discussion']],transfer:'A new vector is v = (3, 4). This time T(x, y) = (3x, y). What is the length factor, and does it equal 3?',transferNumber:'New length factor',sample:[
 {name:'A common mix-up',focus:'universal',text:'The horizontal coordinate doubles, so every vector becomes twice as long.'},
 {name:'An explanation with evidence',focus:'counterexample',text:'The vertical component does not change. This vector grows by about 1.58, and a vertical vector would keep its length.'},
 {name:'An uncertain first thought',focus:'unsure',text:'I can see the arrow stretch, but I am not sure whether every direction changes by the same factor.'}
 ]},
 stats:{name:'Statistics',title:'Think with Data',subtitle:'Separate an average from the people behind it.',tag:'CONFIDENCE, VARIATION & MEANING',question:'“A 95% confidence interval contains the score changes of 95% of individual students.” Does that describe this interval?',prompt:'This interval estimates the population mean score change. Explain how it differs from a statement about individual students.',number:'Lower endpoint of the confidence interval',focus:[['individual','Individuals versus the mean'],['mean','Sample size, confidence and precision'],['coverage','What the confidence percentage describes'],['custom','Keep my wording open for discussion']],transfer:'Keep n = 40 and the sample mean at 3.2 points. Use 99% confidence instead of 95%. Find the upper endpoint, then explain what became wider and what did not.',transferNumber:'Upper endpoint of the 99% interval',sample:[
 {name:'A common mix-up',focus:'individual',text:'The interval tells us where 95 percent of the individual students’ score changes fall.'},
 {name:'An explanation with evidence',focus:'mean',text:'The interval estimates the population mean change. A larger sample can narrow that interval without making individual students more alike.'},
 {name:'A question about confidence',focus:'coverage',text:'I think the 95 percent is about the interval method, but I am not sure what repeats and what stays fixed.'}
 ]}
};
export function followup(id,focus){
 if(id==='linear'){
  if(focus==='counterexample')return {observation:'Let’s examine the special-direction argument you selected.',question:'Keep the horizontal stretch at 2 and point the vector along the horizontal axis. What is the length factor now? How does that fit with the vertical case?',label:'Length factor on the horizontal axis',target:2,probe:{angle:0},reason:'A horizontal vector has no vertical component, so its length doubles. A vertical vector keeps its length.'};
  if(focus==='custom')return {observation:'Your wording is preserved without an automatic judgment.',question:'Which direction would give the clearest test of your explanation? Use the diagram and say why you chose it.',label:null,target:null,probe:{angle:90},reason:''};
  return {observation:focus==='unsure'?'Let’s separate a change in one coordinate from a change in total length.':'The step from “horizontal coordinate” to “every length” is the claim to test.',question:'Keep the horizontal stretch at 2 and make the vector vertical. What is its length factor? What does that tell you about “every vector”?',label:'Length factor on the vertical axis',target:1,probe:{angle:90},reason:'A vertical vector has horizontal coordinate zero. The transformation leaves it unchanged, so the factor is 1.'};
 }
 if(focus==='mean')return {observation:'Let’s test the confidence-versus-precision distinction you selected.',question:'At the same sample size, switch from 95% to 99% confidence. What is the ratio of the new half-width to the old half-width? Explain the tradeoff.',label:'99% half-width ÷ 95% half-width',target:2.576/1.96,probe:{n:40,level:99},reason:'The ratio is 2.576 ÷ 1.96 ≈ 1.314. Higher confidence needs a wider interval at the same sample size.'};
 if(focus==='coverage')return {observation:'Let’s make the repeated-sampling meaning concrete.',question:'Imagine 100 independent samples and 100 intervals made by this 95% method. About how many intervals would cover the same population mean in the long run? What remains fixed?',label:'Expected number out of 100',target:95,probe:{n:40,level:95},reason:'About 95 out of 100 in the long run. The population mean is fixed; the samples and intervals vary.'};
 if(focus==='custom')return {observation:'Your wording is preserved without an automatic judgment.',question:'Are you describing individual students, the population mean, or repeated intervals? Choose the quantity you mean and connect it to the picture.',label:null,target:null,probe:{n:40,level:95},reason:''};
 return {observation:'Let’s compare individual variation with uncertainty about a mean.',question:'Compare n = 40 with n = 160. What is the ratio of the new confidence-interval half-width to the old one? Does the assumed individual standard deviation change?',label:'Half-width at n = 160 ÷ half-width at n = 40',target:.5,probe:{n:160,level:95},reason:'The ratio is √40 ÷ √160 = 0.5. The assumed individual standard deviation stays at 8 points.'};
}
export const numericMatch=(raw,target)=>{const n=parseNumber(raw);return n===null?null:Math.abs(n-target)<=.02;};
export const targetFor=(id,m,transfer=false)=>id==='linear'?m.factor:transfer?m.hi:m.lo;
export function exampleAttempt(id){
 const s=blank(id),at=new Date().toISOString(),sample=subject[id].sample[0];s.isExample=true;s.phase=s.reached=2;s.claim='0';
 s.first={text:sample.text,claim:'0',claimText:'Authored example — a first impression',model:copy(modelFor(id,s)),at};
 const settings=id==='linear'?[{angle:0},{angle:90}]:[{n:40,level:95},{n:160,level:95}];
 s.samples=settings.map(model=>({model,result:modelFor(id,{model}),at}));
 s.reason=sample.text;s.focus=sample.focus;s.number=id==='linear'?'2':'0.72';
 const m=modelFor(id,s),target=targetFor(id,m);s.review={text:s.reason,raw:s.number,target,matches:numericMatch(s.number,target),focus:s.focus,model:copy(m),sources:[],kind:'scripted_demo',at};
 s.voiceSources=[{field:'reason',rawText:sample.text,confirmedText:sample.text,kind:'example_transcript',model:copy(s.model),at}];return s;
}
export function validDB(db){
 const text=x=>typeof x==='string'&&x.length<=2000,object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
 const model=(id,m)=>object(m)&&(id==='linear'?Number.isInteger(m.angle)&&m.angle>=0&&m.angle<=90&&m.angle%15===0:Number.isInteger(m.n)&&m.n>=20&&m.n<=200&&m.n%20===0&&[95,99].includes(m.level));
 const response=r=>object(r)&&text(r.text)&&text(r.raw)&&((r.target===null&&r.matches===null)||(Number.isFinite(r.target)&&typeof r.matches==='boolean'))&&typeof r.at==='string';
 return object(db)&&db.version===1&&['linear','stats'].every(id=>Array.isArray(db[id])&&db[id].length&&db[id].every(s=>
  object(s)&&typeof s.id==='string'&&typeof s.createdAt==='string'&&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<5&&Number.isInteger(s.reached)&&s.reached>=s.phase&&s.reached<5&&model(id,s.model)&&
  ['draft','observation','number','reason','focus','correction','followText','followNumber','transferNumber','transferText','reflection'].every(k=>text(s[k]))&&['','0','1','2'].includes(s.claim)&&
  Array.isArray(s.samples)&&s.samples.length<=12&&s.samples.every(x=>object(x)&&model(id,x.model)&&object(x.result)&&Object.values(x.result).every(Number.isFinite)&&typeof x.at==='string')&&
  Array.isArray(s.reflections)&&s.reflections.every(x=>object(x)&&text(x.text)&&typeof x.at==='string')&&
  Array.isArray(s.voiceSources)&&s.voiceSources.every(x=>object(x)&&['draft','observation','reason','followText','correction','transferText','reflection'].includes(x.field)&&text(x.rawText)&&text(x.confirmedText)&&['example_transcript','typed_after_rehearsal'].includes(x.kind)&&model(id,x.model)&&typeof x.at==='string')&&
  (s.first===null||(object(s.first)&&text(s.first.text)&&text(s.first.claimText)&&typeof s.first.at==='string'))&&
  (s.review===null||(response(s.review)&&subject[id].focus.some(x=>x[0]===s.review.focus)))&&
  (s.followSaved===null||response(s.followSaved))&&(s.transfer===null||response(s.transfer))&&
  (s.reached<1||!!s.first)&&(s.reached<2||s.samples.length>0)&&(s.reached<3||!!s.review&&!!s.followSaved)&&(s.reached<4||!!s.transfer)
 ));
}
