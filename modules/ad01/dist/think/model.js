export const velocity = t => (t-2)*(t-4);
export const acceleration = t => (2*t-6)/60;
export const position = t => 20*t*t*t-180*t*t+480*t;
export function motion(t, transfer=false){
 const v=transfer?4-t:velocity(t), a=transfer?-1/60:acceleration(t);
 return {v,a,direction:Math.abs(v)<1e-9?'still':v>0?'forward':'backward',speed:Math.abs(v)<1e-9&&Math.abs(a)>1e-9?'turning':Math.abs(v*a)<1e-9?'instant':v*a>0?'faster':'slower'};
}
export const KEY='quidence:calculus-think-in-motion:v1';
export const initial=()=>({version:1,stage:0,t:1,claim:'',draft:'',original:'',samples:[],challenge:null,transfer:null,hints:[],reflection:'',correction:'',challengeDraft:'',transferDraft:''});
const textOK=x=>typeof x==='string'&&x.length<=10000;
const answerOK=a=>!!a&&textOK(a.reason)&&typeof a.hinted==='boolean'&&(a.mode==='custom'?a.direction===null&&a.speed===null&&a.reason.trim().length>0:['forward','backward','still','unsure'].includes(a.direction)&&['faster','slower','instant','unsure'].includes(a.speed));
export function valid(s){return !!s&&validVoiceState(s)&&s.version===1&&Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=4&&Number.isFinite(s.t)&&s.t>=0&&s.t<=5&&['claim','draft','original','reflection','correction','challengeDraft','transferDraft'].every(k=>textOK(s[k]))&&['','yes','no','unsure','custom'].includes(s.claim)&&Array.isArray(s.samples)&&s.samples.length<=20&&s.samples.every(x=>x&&Number.isFinite(x.t)&&x.t>=0&&x.t<=5&&textOK(x.note))&&Array.isArray(s.hints)&&s.hints.every(x=>['challenge','transfer'].includes(x))&&['challenge','transfer'].every(k=>(s[k]===null||answerOK(s[k]))&&(s[k+'Pick']===undefined||['','a','b','c','custom'].includes(s[k+'Pick']))&&(s[k+'Revision']===undefined||textOK(s[k+'Revision'])))&&(s.stage<1||s.claim!==''&&(s.claim!=='custom'||s.original.trim().length>0))&&(s.stage<2||s.samples.length>0)&&(s.stage<3||!!s.challenge)&&(s.stage<4||!!s.transfer);}
export function grade(answer,t,transfer=false){if(answer.mode==='custom')return {direction:null,speed:null};const m=motion(t,transfer);return {direction:answer.direction===m.direction,speed:answer.speed===m.speed};}

// Prewritten viewpoints are numerical claims, never a classifier for learner prose.
export const viewpoints = {
 challenge:[
  {id:'a',direction:'forward',speed:'faster',zh:'向前走，而且越來越快。',en:'Moving forward and speeding up.'},
  {id:'b',direction:'backward',speed:'slower',zh:'向後走，但正在慢下來。',en:'Moving backward, but slowing down.'},
  {id:'c',direction:'backward',speed:'faster',zh:'向後走，而且越來越快。',en:'Moving backward and speeding up.'}
 ],
 transfer:[
  {id:'a',direction:'backward',speed:'faster',zh:'加速度是負的，所以向後走，而且越來越快。',en:'Acceleration is negative, so the rider moves backward and speeds up.'},
  {id:'b',direction:'forward',speed:'faster',zh:'速度是正的，所以向前走，而且越來越快。',en:'Velocity is positive, so the rider moves forward and speeds up.'},
  {id:'c',direction:'still',speed:'instant',zh:'速度圖一直往下，因此此刻已經停下來。',en:'The velocity graph is falling, so the rider has already stopped.'}
 ]
};
export function makeAnswer(kind,pick,reason,hinted){
 if(typeof reason!=='string'||reason.length>2000)throw Error('Invalid explanation');
 if(pick==='custom'){if(!reason.trim())throw Error('Write your own response');return {mode:'custom',direction:null,speed:null,reason,hinted:!!hinted};}
 const p=viewpoints[kind]?.find(p=>p.id===pick);if(!p)throw Error('Choose a viewpoint');
 return {mode:'preset',pick,direction:p.direction,speed:p.speed,reason,hinted:!!hinted};
}

// Optional fields keep existing v1 records readable, while bounding new local data.
export function validVoiceState(s){
 const short=x=>typeof x==='string'&&x.length<=2000;
 if(s.voiceRecords!==undefined&&(!Array.isArray(s.voiceRecords)||s.voiceRecords.length>20||!s.voiceRecords.every(r=>r&&['draft','reason','revision','reflection','correction'].includes(r.field)&&short(r.rawTranscript)&&short(r.confirmedTranscript)&&r.kind==='transcription_correction'&&r.context&&Number.isInteger(r.context.stage)&&r.context.stage>=0&&r.context.stage<=4&&Number.isFinite(r.context.t)&&r.context.t>=0&&r.context.t<=5)))return false;
 if(s.aiReviews!==undefined){
  if(!s.aiReviews||typeof s.aiReviews!=='object'||Array.isArray(s.aiReviews))return false;
  for(const [k,r] of Object.entries(s.aiReviews))if(!['challenge','transfer'].includes(k)||!r?.request||r.request.kind!==k||!short(r.request.text)||!['zh','en'].includes(r.request.lang)||!['a','b','c','custom'].includes(r.request.pick)||typeof r.request.hinted!=='boolean'||!Number.isFinite(r.request.t)||r.request.t<0||r.request.t>5||!r.review||!['quote','observation','question'].every(f=>typeof r.review[f]==='string'&&r.review[f].trim()&&r.review[f].length<900)||!r.request.text.includes(r.review.quote))return false;
 }
 return true;
}
