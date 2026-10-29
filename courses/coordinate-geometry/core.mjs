export const VERSION=1, STORAGE_KEY='quidence-coordinate-project-studio-v1';
export const PROJECTS={plan:{steps:6,scale:2,bounds:[10,8],start:{x:5,y:2}},station:{steps:6,scale:10,bounds:[12,10],start:{x:4,y:5}}};
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function numberValue(raw){
 const input=String(raw??'').trim().replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/').replaceAll('√','sqrt');
 if(!input||input.length>150)return NaN;
 const tokens=input.match(/sqrt|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[()+\-*/^]/gi)||[];
 if(tokens.join('').toLowerCase()!==input.replace(/\s/g,'').toLowerCase())return NaN;
 let pos=0,depth=0;
 function atom(){if(++depth>25)throw Error();let v,t=tokens[pos++];if(t==='('){v=sum();if(tokens[pos++]!==')')throw Error();}else if(t?.toLowerCase()==='sqrt'){v=Math.sqrt(atom());}else{v=Number(t);if(t===undefined||!Number.isFinite(v)||['+','-','*','/','^',')'].includes(t))throw Error();}depth--;return v;}
 function power(){let v=atom();if(tokens[pos]==='^'){pos++;const exp=unary();if(Math.abs(exp)>12)throw Error();v=v**exp;}return v;}
 function unary(){if(tokens[pos]==='+'||tokens[pos]==='-'){const sign=tokens[pos++];return (sign==='-'?-1:1)*unary();}return power();}
 function product(){let v=unary();while(tokens[pos]==='*'||tokens[pos]==='/'){const op=tokens[pos++],r=unary();v=op==='*'?v*r:v/r;}return v;}
 function sum(){let v=product();while(tokens[pos]==='+'||tokens[pos]==='-'){const op=tokens[pos++],r=product();v=op==='+'?v+r:v-r;}return v;}
 try{const v=sum();return pos===tokens.length&&Number.isFinite(v)&&Math.abs(v)<1e12?v:NaN;}catch{return NaN;}
}
export function scenario(project,step){
 if(project==='plan')return {scale:2,bounds:[10,8],a:{x:1,y:step===5?7:1},b:{x:9,y:7},zone:{xmin:2,xmax:8,ymin:2,ymax:6},maxA:10,minB:8};
 return {scale:10,bounds:[12,10],a:{x:2,y:2},b:{x:10,y:step>=4?6:2},road:{m:1,c:-1,xmin:3,xmax:9},maxA:50};
}
export function inZone(p,z){return p.x>=z.xmin-1e-8&&p.x<=z.xmax+1e-8&&p.y>=z.ymin-1e-8&&p.y<=z.ymax+1e-8;}
export function metrics(project,step,p){const s=scenario(project,step);return {a:distance(s.a,p)*s.scale,b:distance(s.b,p)*s.scale,dx:p.x-s.a.x,dy:p.y-s.a.y,mapDistance:distance(s.a,p),squared:(p.x-s.a.x)**2+(p.y-s.a.y)**2};}
export function equalDistanceLine(a,b){return {a:2*(b.x-a.x),b:2*(b.y-a.y),c:b.x*b.x+b.y*b.y-a.x*a.x-a.y*a.y};}
export function equivalentLine(a,b,c,expected){const norm=Math.hypot(a,b),enorm=Math.hypot(expected.a,expected.b);if(!Number.isFinite(norm)||norm<1e-9||![a,b,c].every(Number.isFinite))return false;const k=(a*expected.a+b*expected.b)/(enorm*enorm);return Math.abs(k)>1e-10&&Math.abs(a-k*expected.a)<=1e-6*norm&&Math.abs(b-k*expected.b)<=1e-6*norm&&Math.abs(c-k*expected.c)<=1e-5*norm;}
export function validate(project,step,p,answers={},candidates=[]){
 const s=scenario(project,step),m=metrics(project,step,p),out=[];
 const add=(id,ok,expected)=>out.push({id,ok:!!ok,expected});
 const num=(id,n,tolerance=.06)=>add(id,Number.isFinite(numberValue(answers[id]))&&Math.abs(numberValue(answers[id])-n)<=tolerance,n);
 const fair=q=>Math.abs(distance(s.a,q)-distance(s.b,q))<.025;
 const road=q=>Math.abs(q.y-(q.x-1))<.025&&q.x>=3&&q.x<=9;
 const bounds=p.x>=0&&p.x<=s.bounds[0]&&p.y>=0&&p.y<=s.bounds[1]&&[p.x,p.y].every(Number.isFinite);
 if(!bounds)return [{id:'bounds',ok:false}];
 if(project==='plan'){
  if(step===0){add('origin',answers.origin==='lower-left');num('scale',8,.001);}
  if(step===1){add('zone',inZone(p,s.zone));}
  if(step===2){num('dx',m.dx,.001);num('dy',m.dy,.001);}
  if(step===3){num('squared',m.squared,.001);num('mapDistance',m.mapDistance);num('realDistance',m.a);}
  if(step===4||step===5){add('zone',inZone(p,s.zone));num('distanceA',m.a);num('distanceB',m.b);add('reach',m.a<=s.maxA+1e-8);add('separation',m.b>=s.minB-1e-8);}
 }else{
  if(step===0){num('distanceA',m.a,.1);num('distanceB',m.b,.1);const nearest=Math.abs(m.a-m.b)<.01?'same':m.a<m.b?'a':'b';add('nearest',answers.nearest===nearest);}
  if(step===1){const pts=candidates.filter(q=>q.x>=0&&q.x<=12&&q.y>=0&&q.y<=10);add('candidates',pts.length>=2&&pts.every(fair)&&pts.some(q=>distance(q,pts[0])>=.5));}
  if(step===2){num('midX',6,.001);num('midY',2,.001);num('lineX',6,.001);}
  if(step===3||step===5){add('fair',fair(p));add('road',road(p));num('distanceA',m.a,.1);num('distanceB',m.b,.1);if(step===5)add('reach',Math.max(m.a,m.b)<=50+1e-8);}
  if(step===4){const l=equalDistanceLine(s.a,s.b);add('line',equivalentLine(numberValue(answers.lineA),numberValue(answers.lineB),numberValue(answers.lineC),l));}
 }
 return out;
}
export function newState(){return {version:VERSION,lang:'en',active:'plan',step:0,lastSteps:{plan:0,station:0},view:'home',models:{plan:{...PROJECTS.plan.start},station:{...PROJECTS.station.start}},candidates:[],baseline:null,drafts:{},history:[],hints:{},measures:{},revision:0,updatedAt:null};}
export const keyFor=(project,step)=>`${project}:${step}`;
// Lesson quick-check answers are optional; records saved before the lessons existed have none.
export const LESSON_IDS=['changes','distance','midpoint','equations'];
export function validLessons(raw){
 const dictionary=o=>o&&typeof o==='object'&&!Array.isArray(o);
 if(!dictionary(raw)||!dictionary(raw.answers)||!dictionary(raw.checked))return false;
 return Object.entries(raw.answers).every(([id,a])=>LESSON_IDS.includes(id)&&dictionary(a)&&Object.keys(a).length<=10&&Object.values(a).every(v=>typeof v==='string'&&v.length<=200))&&Object.entries(raw.checked).every(([id,v])=>LESSON_IDS.includes(id)&&typeof v==='boolean');
}
export function validState(raw){
 if(!raw||raw.version!==1||!PROJECTS[raw.active]||!Number.isInteger(raw.step)||raw.step<0||raw.step>5||!['home','project','notebook'].includes(raw.view)||!['en','zh-TW','es'].includes(raw.lang))return false;
 if(raw.lessons!==undefined&&!validLessons(raw.lessons))return false;
 if(!raw.models||!Array.isArray(raw.history)||raw.history.length>3000||!Array.isArray(raw.candidates)||raw.candidates.length>30||!Number.isInteger(raw.revision)||raw.revision<0)return false;
 if(raw.lastSteps&&(!['plan','station'].every(id=>Number.isInteger(raw.lastSteps[id])&&raw.lastSteps[id]>=0&&raw.lastSteps[id]<=5)))return false;
 for(const id of Object.keys(PROJECTS)){const p=raw.models[id],b=PROJECTS[id].bounds;if(!p||![p.x,p.y].every(Number.isFinite)||p.x<0||p.x>b[0]||p.y<0||p.y>b[1])return false;}
 const dictionary=o=>o&&typeof o==='object'&&!Array.isArray(o),answerSet=o=>dictionary(o)&&Object.values(o).every(v=>typeof v==='string'&&v.length<=200),key=k=>/^(plan|station):[0-5]$/.test(k);
 if(!['drafts','hints','measures'].every(k=>dictionary(raw[k])))return false;
 if(!Object.entries(raw.drafts).every(([k,d])=>key(k)&&dictionary(d)&&answerSet(d.answers)&&typeof d.reason==='string'&&d.reason.length<=12000))return false;
 if(!Object.entries(raw.hints).every(([k,n])=>key(k)&&Number.isInteger(n)&&n>=0&&n<=3)||!Object.entries(raw.measures).every(([k,v])=>key(k)&&typeof v==='boolean'))return false;
 return raw.history.every(a=>a&&PROJECTS[a.project]&&Number.isInteger(a.step)&&a.step>=0&&a.step<=5&&typeof a.reason==='string'&&a.reason.length<=12000&&answerSet(a.answers)&&Array.isArray(a.checks)&&a.checks.every(c=>c&&typeof c.id==='string'&&typeof c.ok==='boolean')&&a.point&&[a.point.x,a.point.y].every(Number.isFinite))&&raw.candidates.every(p=>p&&[p.x,p.y].every(Number.isFinite)&&p.x>=0&&p.x<=12&&p.y>=0&&p.y<=10);
}
export function makeAttempt(state,answers,reason){const id=state.active,step=state.step,k=keyFor(id,step),point={...state.models[id]};return {project:id,step,at:new Date().toISOString(),point,answers:{...answers},reason:String(reason).slice(0,12000),speechReviews:JSON.parse(JSON.stringify(state.drafts[k]?.speechReviews||[])),checks:validate(id,step,point,answers,state.candidates),hints:state.hints[k]||0,measurements:!!state.measures[k],candidates:state.candidates.map(p=>({...p})),scenario:scenario(id,step)};}
export function currentAttempt(state){const k=keyFor(state.active,state.step),draft=state.drafts[k]||{},last=state.history.filter(h=>h.project===state.active&&h.step===state.step).at(-1);if(!last)return null;return {attempt:last,fresh:JSON.stringify(last.point)===JSON.stringify(state.models[state.active])&&JSON.stringify(last.answers)===JSON.stringify(draft.answers||{})&&last.reason===(draft.reason||'')&&(state.step!==1||state.active!=='station'||JSON.stringify(last.candidates)===JSON.stringify(state.candidates))};}
export function learningNotes(state){let lines=['# Quidence · Coordinate Geometry','',`Exported: ${new Date().toISOString()}`,'','This is a project learning record, not a mastery certificate. Numerical checks use the stated model. Explanations are preserved for review and are not automatically assessed. Hints and displayed measurements are recorded.',''];for(const id of Object.keys(PROJECTS)){lines.push(`## ${id==='plan'?'01 · A map others can use':'02 · A fair place to meet'}`,'');for(let step=0;step<6;step++){const arr=state.history.filter(a=>a.project===id&&a.step===step);lines.push(`### Step ${step+1}`,arr.length?`${arr.length} recorded submission(s).`:'No submission recorded.','');for(const a of arr){lines.push(`Time: ${a.at}`,`Point: (${a.point.x}, ${a.point.y}); scenario: ${JSON.stringify(a.scenario)}`,`Answers: ${JSON.stringify(a.answers)}`,`Numerical/constraint checks: ${a.checks.filter(x=>x.ok).length}/${a.checks.length}`,`Hints opened: ${a.hints}; measurements shown: ${a.measurements?'yes':'no'}`,`Reviewed speech evidence: ${JSON.stringify(a.speechReviews||[])}`,`Learning request captured with this submission: ${JSON.stringify(a.learningRequest||null)}`,'','Original explanation:',a.reason||'[No explanation provided]','');}}}lines.push('## Lesson quick checks','');for(const id of LESSON_IDS)lines.push(`${id}: ${state.lessons?.checked?.[id]?'checked':'not checked'}; answers ${JSON.stringify(state.lessons?.answers?.[id]||{})}`);lines.push('');lines.push('## Current drafts','',JSON.stringify(state.drafts,null,2));return lines.join('\n');}
