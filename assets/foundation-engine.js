(function(root){
'use strict';
// Legacy persistence identifiers are intentionally retained; see BRAND_MIGRATION.md.
const B=typeof module==='object'&&module.exports?require('./foundation-bank.js'):root.QuidenceFoundationBank;
const X=typeof module==='object'&&module.exports?require('./foundation-extension.js'):root.QuidenceFoundationExtension;
function build(B,X,settings={}){
const SCHEMA=settings.schema||'cluevera_foundation_portfolio_v1',clone=v=>JSON.parse(JSON.stringify(v));
const ENTRY_VERSIONS=[B.VERSION,...Object.keys(B.HISTORY||{})],LEGACY_NUMERIC_POLICY='decimal-final-2dp-1',PREVIOUS_NUMERIC_POLICY='written-precision-2',NUMERIC_POLICY='written-precision-3';
const SUBJECTS={aa01:'Secondary-school math',ab01:'Linear Algebra',ac01:'Game theory foundations',ad01:'Calculus',ae01:'Statistics',af01:'Pre-calculus','pre-algebra':'Pre-Algebra','algebra-1':'Algebra I',geometry:'Geometry','algebra-2':'Algebra II'};
const subjectTitle=id=>SUBJECTS[typeof id==='string'?id:id.module]||B.MODULES[typeof id==='string'?id:id.module].title;
// Standardize authored display text only; task definitions and student work stay intact.
function authoredText(value){return String(value??'').replace(/\bAnalyse\b/g,'Analyze').replace(/\banalyse\b/g,'analyze').replace(/\bmodelling\b/g,'modeling').replace(/\btravelled\b/g,'traveled').replace(/\bkilometres\b/g,'kilometers').replace(/\bkilometre\b/g,'kilometer').replace(/\bmetres\b/g,'meters').replace(/\bmetre\b/g,'meter').replace(/\blitres\b/g,'liters').replace(/\blitre\b/g,'liter').replace('For non-rational numerical answers round final numeric answers to at least two decimal places.','For irrational results, round only the final answer; keep at least two decimal places and two significant figures.');}
function displayTask(t){const out={...t};for(const key of ['title','prompt','reason','solution','next','groupName'])if(typeof t[key]==='string')out[key]=authoredText(t[key]);if(t.steps)out.steps=t.steps.map(step=>({...step,title:authoredText(step.title),prompt:authoredText(step.prompt)}));return out;}
const studentTaskNote=id=>({
 'aa-f12':'Use the given horizontal and vertical moves to locate the endpoint.',
 'ab-f12':'Try the zero vector in this map and check the condition you are given.',
 'ad-f05':'Use the supplied tangent slope to connect derivative notation with local change. Keep it separate from the function value.',
 'ad-f11':'Compare the errors of the two supplied approximations.',
 'ae-f08':'Use the supplied mean and squared deviations to calculate the sample standard deviation.',
 'af-f09':'Use the supplied difference quotient to calculate change over the interval.'
})[id];
const unit=settings.projects?'projects':'questions';
const UNCHECKED={
 aa01:['Multiplication and division of rational numbers; powers and roots','Equations with variables on both sides, no solution, or infinitely many solutions','Inequality steps involving multiplication or division by a negative number','General systems of equations, function domains, and quadratic equations'],
 ab01:['Matrix composition and multiplication order','Elimination and systems with no solution or infinitely many solutions','Nullspace, rank, basis, dimension, and inverse matrices','Dot products, orthogonality, projections, determinants, and eigenvectors'],
 ac01:['Constructing a payoff model from a story and stating its assumptions','Expected payoffs and mixed strategies','Sequential decisions, backward induction, and credible threats','Repeated games and incomplete information'],
 ad01:['Constructing a difference quotient and derivative without a supplied slope','Product, quotient, chain, implicit, and inverse-function differentiation rules','Antiderivatives, integration constants, and finding definite integrals analytically','Function analysis, optimization, differential equations, and wider integration applications']
};
UNCHECKED.ae01=['Quartiles, IQR, boxplots, histograms, and calculating spread without supplied deviations','Regression, residuals, correlation, sampling distributions, confidence intervals, and hypothesis tests','Bayes’ rule, probability distributions, and evaluating assumptions of real studies'];
UNCHECKED.af01=['Full polynomial and rational analysis, trigonometric identities, and general trigonometric equations','Conics, sequences, series, vectors, polar coordinates, and complex numbers','Constructing and validating models from unfamiliar real situations'];
const CONDITIONS={
 aa01:[{task:'aa-f12',note:'The graph description supplies the horizontal and vertical moves. This checks converting directions to coordinates; independent graph reading needs a new task.'}],
 ab01:[{task:'ab-f12',note:'The reasoning prompt supplies the zero-vector test. It checks applying this necessary condition to a translation, not independently choosing a test or proving an arbitrary map linear.'}],
 ac01:[{task:'ac-f08',note:'The comparison pattern is stated in the question. This checks interpreting that pattern; identifying dominance independently needs a new table.'}],
 ad01:[{task:'ad-f05',note:'The tangent slope is supplied. This checks the meaning of derivative notation, not calculating a tangent slope independently.'},{task:'ad-f11',note:'The rectangle sums and exact integral are supplied. This checks comparing errors, not constructing a rectangle sum independently.'}]
};
CONDITIONS.ae01=[{task:'ae-f08',note:'The mean and sum of squared deviations are supplied. This checks the sample divisor, square root, and units; constructing the deviations requires another task.'}];
CONDITIONS.af01=[{task:'af-f09',note:'The difference-quotient form is supplied. This checks computing and interpreting a secant slope, not independently choosing the method.'}];
const stamp=()=>new Date().toISOString();
let sequence=0;
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
function legacyNumeric(value){
 if(typeof value!=='string'&&typeof value!=='number')return null;
 const s=String(value).trim().replace(/−/g,'-');
 if(s.length>80||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return null;
 const parts=s.split('/').map(Number),n=parts.length===1?parts[0]:parts[0]/parts[1];
 return Number.isFinite(n)?n:null;
}
// Read bounded numeric notation, never JavaScript or arbitrary expressions.
// A unit suffix is accepted only when it matches the unit requested by the field.
const normalizeUnit=s=>s.replace(/\s/g,'').replace(/²/g,'^2').replace(/³/g,'^3').replace(/·/g,'*');
function fieldUnit(f){return f.unit||f.label?.match(/\((m|m\/s|m\/s²|s|N|kg·m\/s|J|Wh|h|W|kg|Hz|cm|m²|°)\)\s*$/)?.[1]||null;}
function numericReading(value,unit=null,allowX=true){
 if(!['string','number'].includes(typeof value))return null;
 let s=String(value).trim().replace(/−/g,'-');if(s.length>80)return null;
 if(allowX)s=s.replace(/([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*[xX]\s*(?=10\s*\^)/g,'$1×');
 s=s.replace(/([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*[×*]\s*10\s*\^\s*(?:\(([+-]?\d{1,3})\)|([+-]?\d{1,3}))/g,(_,a,b,c)=>a+'e'+(b||c));
 const atom='[+-]?(?:\\d{1,3}(?:,\\d{3})+(?:\\.\\d*)?|\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d{1,3})?';
 const match=s.match(new RegExp('^('+atom+'(?:\\s*/\\s*'+atom+')?)(.*?)$'));if(!match)return null;
 const suffix=match[2].trim();if(suffix&&(!unit||normalizeUnit(suffix)!==normalizeUnit(unit)))return null;
 const tokens=match[1].split('/').map(x=>x.trim().replace(/,/g,''));
 const values=tokens.map(x=>{const [mantissa,exponent='0']=x.toLowerCase().split('e');if(Math.abs(Number(exponent))>308)return NaN;const n=Number(x);return n===0&&/[1-9]/.test(mantissa)?NaN:n;});
 const n=values.length===1?values[0]:values[0]/values[1];if(!Number.isFinite(n)||n===0&&values[0]!==0)return null;
 const [mantissa,exponent='0']=tokens[0].toLowerCase().split('e');
 const digits=mantissa.replace(/[-+.]/g,'').replace(/^0+/,'');
 const significant=(mantissa.includes('.')?digits:digits.replace(/0+$/,'')).length;
 return{value:n,fraction:tokens.length===2,places:(mantissa.split('.')[1]?.length||0)-Number(exponent),significant};
}
function numeric(value,unit=null){return numericReading(value,unit)?.value??null;}
// A UI confirmation gate; historical parsing and saved outcomes stay intact.
function numericFormatIssues(t,a){
 if(a.unsure||a.notStudied)return[];
 return t.fields.filter(f=>f.kind==='number').flatMap(f=>{
  const raw=a.values[f.id]?.trim()||'';if(!raw)return[];
  if(raw.includes(','))return[{field:f.id,label:f.label,raw,kind:'comma'}];
  const dotted=raw.split('/').some(token=>!/^\s*[+-−]?\d+(?:\.\d*)?\s*[xX×*]\s*10\s*\^/.test(token)&&/^\s*[+-−]?[1-9]\d*(?:\.\d{3})+(?![\d.eE])(?:\s|$)/.test(token));
  if(dotted){const value=numeric(raw,fieldUnit(f));return [{field:f.id,label:f.label,raw,kind:value===null?'separator':'decimal',value}];}
  return[];
 });
}
function minimumPlaces(answer){return answer===0?2:Math.max(2,1-Math.floor(Math.log10(Math.abs(answer))));}
function currentNumberMatches(f,value,previous=false){
 const read=numericReading(value,fieldUnit(f),!previous);if(!read||!Number.isFinite(f.answer))return false;
 const n=read.value;if(n===f.answer)return true;
 const physics=!previous&&f.precision==='significant';
 if(!physics&&Number.isInteger(f.answer)||n===0)return false;
 const scale=Math.abs(f.answer),strict=Math.max(8*Number.EPSILON*scale,Math.min(f.absoluteTolerance??1e-8*scale,1e-8*scale));
 if(Math.abs(n-f.answer)<=strict)return true;
 if(read.fraction||!physics&&read.places<minimumPlaces(f.answer))return false;
 const significant=physics?read.significant:read.places+Math.floor(Math.log10(scale))+1;
 if(significant<(physics?(f.significantFigures||3):2)||significant>100)return false;
 const rounded=Number(f.answer.toPrecision(significant));
 const epsilon=8*Number.EPSILON*Math.max(Math.abs(n),Math.abs(rounded));
 if(Math.abs(n-rounded)<=epsilon)return true;
 // Binary storage must not choose a required tie convention at a true midpoint.
 const halfStep=10**(Math.floor(Math.log10(scale))-significant+1)/2;
 return physics&&Math.abs(Math.abs(n-f.answer)-halfStep)<=epsilon;
}
function fresh(){return{schema:SCHEMA,bankVersion:B.VERSION,modules:Object.fromEntries(Object.keys(B.MODULES).map(id=>[id,{active:null,sessions:[]}]))};}
function session(portfolio,module){const m=portfolio.modules[module];return m?.sessions.find(s=>s.id===m.active)||null;}
function createSession(portfolio,module,check='entry'){
 if(!B.MODULES[module])throw Error('Unknown subject');
 if(check==='followup'&&!X.MODULES[module])throw Error('No further check is available for this subject');
 if(!['entry','followup'].includes(check))throw Error('Unknown check');
 const s={id:stamp()+'-'+(++sequence)+'-'+Math.random().toString(36).slice(2,9),module,bankVersion:check==='followup'?X.VERSION:B.VERSION,createdAt:stamp(),view:'intro',index:0,records:{},events:[]};
 if(check==='followup')s.check=check;
 portfolio.modules[module].sessions.push(s);portfolio.modules[module].active=s.id;return s;
}
const definition=s=>s.bankVersion===X.VERSION?X.MODULES[s.module]:(B.HISTORY?.[s.bankVersion]||B.MODULES)[s.module];
const tasks=s=>definition(s).tasks;
const checkName=s=>definition(s)?.checkTitle||settings.checkTitle||(s.bankVersion===X.VERSION?'Further foundation check':'Entry foundation check');
const task=s=>tasks(s)[s.index];
function blank(t){return{values:Object.fromEntries(t.fields.map(f=>[f.id,settings.fieldTypes?.[f.kind]?.blank?.()??(f.kind==='multi'?[]:'')])),explanation:'',unsure:false,otherHelp:false,...(settings.challenge||B.MODULES[t.module]?.allowNotStudied?{notStudied:false}:{})};}
function record(s,t){return s.records[t.id]||(s.records[t.id]={draft:blank(t),status:'draft',submissions:[],reviews:[],...(settings.projects?{partReviews:[]}: {})});}
function edit(s,t,answer){const r=record(s,t);r.draft=clone(answer);r.status='draft';}
function validDraft(t,a){
 if(!object(a)||!object(a.values)||typeof a.explanation!=='string'||a.explanation.length>3000||typeof a.unsure!=='boolean'||typeof a.otherHelp!=='boolean'||a.notStudied!==undefined&&typeof a.notStudied!=='boolean'||a.unsure&&a.notStudied)return false;
 if(Object.keys(a.values).some(k=>!t.fields.some(f=>f.id===k)))return false;
 return t.fields.every(f=>{const v=a.values[f.id];if(settings.fieldTypes?.[f.kind])return settings.fieldTypes[f.kind].valid(f,v);return f.kind==='multi'?Array.isArray(v)&&v.every(x=>typeof x==='string'&&f.options.some(o=>o.value===x))&&new Set(v).size===v.length:typeof v==='string'&&v.length<=80&&(f.kind==='number'||v===''||f.options.some(o=>o.value===v));});
}
function validate(t,a,policy=NUMERIC_POLICY){
 if(!validDraft(t,a))return'An answer could not be read. Please check the fields.';
 if(!a.explanation.trim())return'Add your reasoning, a calculation, or where you got stuck before saving.';
 if(a.unsure||a.notStudied)return'';
 for(const f of t.fields){const v=a.values[f.id];if(f.kind==='number'&&!(settings.projects&&v.trim()==='')&&([NUMERIC_POLICY,PREVIOUS_NUMERIC_POLICY].includes(policy)?numericReading(v,fieldUnit(f),policy===NUMERIC_POLICY)?.value??null:legacyNumeric(v))===null)return'Enter a number, fraction, or scientific notation'+(fieldUnit(f)?' with no unit or the requested '+fieldUnit(f)+' unit':'')+' for '+f.label+'.';if(f.kind==='choice'&&!v)return'Choose an answer for '+f.label+'.';if(f.kind==='multi'&&!v.length)return'Select at least one answer for '+f.label+'.';}
 return'';
}
function precisionField(t,f){return /^physics-[12]$/.test(t.module)?{...f,precision:'significant',significantFigures:3}:f;}
function numberMatches(f,value,policy){if([NUMERIC_POLICY,PREVIOUS_NUMERIC_POLICY].includes(policy))return currentNumberMatches(f,value,policy===PREVIOUS_NUMERIC_POLICY);const n=legacyNumeric(value);if(n===null)return false;const base=Math.max(f.absoluteTolerance||0,1e-8*Math.max(1,Math.abs(f.answer)));const rounding=policy===LEGACY_NUMERIC_POLICY&&!String(value).includes('/')&&!Number.isInteger(f.answer)?0.005:0,epsilon=policy===LEGACY_NUMERIC_POLICY?Number.EPSILON*Math.max(1,Math.abs(f.answer)):0;return Math.abs(n-f.answer)<=Math.max(base,rounding)+epsilon;}
function evaluate(t,a,policy){
 if(a.notStudied)return{state:'not-studied',parts:{}};
 if(a.unsure)return{state:'unsure',parts:{}};
 const parts={};for(const f of t.fields){const v=a.values[f.id];if(settings.fieldTypes?.[f.kind]){parts[f.id]=settings.fieldTypes[f.kind].check(f,v);continue;}if(settings.projects&&v.trim()===''){parts[f.id]=null;continue;}parts[f.id]=f.kind==='number'?numberMatches(precisionField(t,f),v,policy):f.kind==='multi'?JSON.stringify([...v].sort())===JSON.stringify([...f.answer].sort()):v===f.answer;}
 if(settings.projects)return{state:Object.values(parts).some(v=>v===false)?'recheck':t.fields.some(f=>parts[f.id]===null&&(f.kind==='drawing'?settings.fieldTypes.drawing.check(f,a.values[f.id])===null:!a.values[f.id].trim()))?'partial':Object.values(parts).some(v=>v===null)?'review':'matched',parts};
 return{state:Object.values(parts).every(Boolean)?'matched':'recheck',parts};
}
function submit(s,t){
 const r=record(s,t),error=validate(t,r.draft);if(error)return{ok:false,error};
 const submission={at:stamp(),answer:clone(r.draft),objective:evaluate(t,r.draft,NUMERIC_POLICY),numericPolicy:NUMERIC_POLICY,feedbackSeen:s.events.some(e=>e.type==='report_opened'),taskVersion:s.bankVersion};
 r.submissions.push(submission);r.status='submitted';s.events.push({type:'answer_saved',at:stamp(),task:t.id,submission:r.submissions.length});return{ok:true};
}
function last(s,t){return s.records[t.id]?.status==='submitted'?s.records[t.id].submissions.at(-1):null;}
function done(s){return tasks(s).every(t=>!!last(s,t));}
function review(s,t,points,note){
 const r=s.records[t.id];if(!r||!last(s,t)||![null,0,1,2].includes(points)||typeof note!=='string'||!note.trim()||note.length>2000)return false;
 r.reviews.push({submission:r.submissions.length,points,note:note.trim(),at:stamp()});return true;
}
function latestReview(s,t){const r=s.records[t.id];return r?.reviews.filter(x=>x.submission===r.submissions.length).at(-1)||null;}
function reviewPart(s,t,field,points,note){
 const r=s.records[t.id];if(!settings.projects||!r||!last(s,t)||!t.fields.some(f=>f.id===field)||![null,0,1,2].includes(points)||typeof note!=='string'||!note.trim()||note.length>2000)return false;
 (r.partReviews||(r.partReviews=[])).push({field,submission:r.submissions.length,points,note:note.trim(),at:stamp()});return true;
}
function latestPartReview(s,t,field){if(!last(s,t))return null;const r=s.records[t.id];return r?.partReviews?.filter(x=>x.submission===r.submissions.length&&x.field===field).at(-1)||null;}
function componentChecks(t,a){return t.fields.map(f=>{
 let state=!a?'missing':a.answer.notStudied?'not-studied':a.answer.unsure?'unsure':a.objective.parts[f.id]===null?(f.kind==='drawing'?!Object.keys(a.answer.values[f.id].points).length:!a.answer.values[f.id].trim())?'missing':'review':a.objective.parts[f.id]?'matched':'recheck';
 if(a&&['matched','recheck'].includes(state)&&f.kind==='number'&&a.numericPolicy!==NUMERIC_POLICY&&a.objective.parts[f.id]!==numberMatches(precisionField(t,f),a.answer.values[f.id],NUMERIC_POLICY))state='rounding-review';
 const result={id:f.id,label:f.label,state};if(state==='rounding-review')result.feedback='This saved result used an earlier precision rule. Its original outcome is retained; recheck the preserved calculation under the current rule before drawing a conclusion.';if(settings.projects){result.answer=settings.fieldTypes?.[f.kind]?.text(f,a?.answer.values[f.id])??(a?.answer.values[f.id]||'not entered');if(f.kind==='drawing'&&a){result.drawing=settings.fieldTypes.drawing.valid(f,a.answer.values[f.id])?clone(a.answer.values[f.id]):null;result.drawingSpec={id:f.id,label:f.label,board:clone(f.board)};if(!a.answer.unsure&&!a.answer.notStudied)result.constructionParts=settings.fieldTypes.drawing.parts(f,a.answer.values[f.id]);}result.reviewCriteria=f.reviewCriteria||[];if(state==='review')result.feedback=f.kind==='drawing'?'Construction is incomplete; inspect the preserved points and segments rather than treating missing construction as incorrect.':f.kind==='formula'?'Expression preserved for review; it is outside the bounded polynomial checker.':'Review the mathematical meaning of this response; no keyword, grammar, or length score is assigned.';}
 if(f.skill){result.skill=f.skill;if(state==='recheck'){const upstream=(f.dependsOn||[]).filter(id=>a.objective.parts[id]===false&&!(!a.numericPolicy&&numberMatches(t.fields.find(x=>x.id===id),a.answer.values[id],NUMERIC_POLICY)));result.feedback=upstream.length?'Recheck after '+upstream.map(id=>t.fields.find(x=>x.id===id).label).join(', ')+'. This result may follow from an earlier value; it is not separate evidence of another weakness.':f.onMismatch;}if(state==='not-studied')result.feedback='Not studied yet; this is readiness information, not evidence of a failed concept.';}
 if(a&&!a.answer.unsure&&!a.answer.notStudied&&f.kind==='multi'){const selected=a.answer.values[f.id];result.selection={correct:selected.filter(v=>f.answer.includes(v)).map(v=>f.options.find(o=>o.value===v).label),extra:selected.filter(v=>!f.answer.includes(v)).map(v=>f.options.find(o=>o.value===v).label),missing:f.answer.filter(v=>!selected.includes(v)).map(v=>f.options.find(o=>o.value===v).label)};}
 return result;
});}
function reviewedComponents(s,t){return componentChecks(t,last(s,t)).map(c=>{if(!settings.projects)return c;const review=latestPartReview(s,t,c.id);return{...c,state:c.state==='review'&&review&&review.points!==null?'reviewed':c.state,review};});}
function observations(s){return tasks(s).map(t=>{const r=s.records[t.id],a=last(s,t);return{id:t.id,group:t.groupName,title:t.title,status:a?a.objective.state:'missing',parts:a?.objective.parts||{},components:reviewedComponents(s,t),explanation:a?.answer.explanation||r?.draft.explanation||'',explanationReview:a?latestReview(s,t):null,otherHelp:a?.answer.otherHelp||false,attempts:r?.submissions.length||0,next:t.next,...(t.difficulty?{difficulty:t.difficulty}:{} )};});}
const FOLLOWUP_UNCHECKED={
 aa01:['Powers and roots, general systems, function domains, and quadratic equations','Independent graphical construction and wider fraction, percentage, and equation transfer'],
 ab01:['General elimination algorithms, formal basis/dimension/rank, and inverse matrix construction','Dot products, orthogonality, projections, determinants, and eigenvectors','A complete proof of linearity for an arbitrary map'],
 ac01:['Expected payoffs and mixed strategies','Sequential decisions, backward induction, repeated games, and incomplete information','Larger action spaces and independent construction of a complete payoff model'],
 ad01:['General differentiation rules and wider limit techniques','Function analysis, optimization, differential equations, and wider integration applications','Exact derivatives inferred from finite data alone']
};
function scopeReview(s){const further=s.bankVersion===X.VERSION,d=definition(s);return{scope:B.MODULES[s.module].scope,groups:[...d.groups],notChecked:[...(settings.challenge?d.notChecked:((further?FOLLOWUP_UNCHECKED:UNCHECKED)[s.module]||d.notChecked||[]))],suppliedInformation:settings.challenge?clone(d.suppliedInformation||[]):further?[]:clone(CONDITIONS[s.module]||d.suppliedInformation||[]),interpretation:(settings.projects?'These limits describe these '+(tasks(s).length===2?'two':tasks(s).length)+' California-inspired field projects.':'These limits describe this '+tasks(s).length+'-question '+checkName(s).toLowerCase()+'.')+' Matching components do not establish complete subject mastery.'};}
function evidenceSummary(s){const obs=observations(s),parts=obs.flatMap(o=>o.components);return{matched:parts.filter(x=>x.state==='matched').length,recheck:parts.filter(x=>x.state==='recheck').length,unsure:parts.filter(x=>x.state==='unsure').length,notStudied:parts.filter(x=>x.state==='not-studied').length,missing:parts.filter(x=>x.state==='missing').length,review:parts.filter(x=>x.state==='review').length,reviewed:parts.filter(x=>x.state==='reviewed').length,roundingReview:parts.filter(x=>x.state==='rounding-review').length,explanations:{open:obs.filter(o=>!o.explanationReview||o.explanationReview.points===null).length,revise:obs.filter(o=>o.explanationReview?.points===0).length,partial:obs.filter(o=>o.explanationReview?.points===1).length,connected:obs.filter(o=>o.explanationReview?.points===2).length}};}
function nextChecks(s){return observations(s).flatMap(o=>{
 const a=last(s,tasks(s).find(t=>t.id===o.id)),reasons=[];
 if(o.status==='recheck'){const groups=new Map();for(const c of o.components.filter(c=>c.state==='recheck')){const text=c.feedback||'Recheck: '+c.label+(/[.?!]$/.test(c.label)?'':'.');groups.set(text,[...(groups.get(text)||[]),c.label]);}for(const[text,labels]of groups)reasons.push(text+(labels.length>1?' Affected components: '+labels.join(', ')+'.':''));}
 if(o.components.some(c=>c.state==='rounding-review'))reasons.push('An earlier answer used a different precision rule. Review the preserved calculation before inferring a knowledge gap or verified accuracy.');
 if(o.status==='not-studied')reasons.push('This topic was marked not studied. Check prerequisites before attempting another diagnostic; do not interpret it as a demonstrated weakness.');
 if(settings.projects&&o.components.some(c=>c.state==='review'||c.state==='missing'))reasons.push('Read the open responses and missing parts before interpreting the fixed checks. Accept equivalent methods; ask a targeted follow-up about an unclear mathematical connection.');
 if(settings.projects)for(const c of o.components.filter(c=>c.review?.points===0||c.review?.points===1)){const f=tasks(s).find(t=>t.id===o.id).fields.find(f=>f.id===c.id);reasons.push('Local mathematical review of '+c.label+' identifies '+(c.review.points===0?'a connection to revise':'a remaining connection')+'. '+(f.followup||'Ask for an independent check using another representation.'));}
 if(o.status==='unsure')reasons.push('You marked this answer as uncertain.');
 if(o.explanationReview?.points===0)reasons.push('The local explanation review asks for a revised reason.');
 if(o.explanationReview?.points===1)reasons.push('The local explanation review confirms part of the connection; check the remaining part.');
 if(a?.answer.otherHelp)reasons.push('Other help was reported. Use a new question if you want to check independent use.');
 if(a?.feedbackSeen)reasons.push('This response was saved after a report was opened. Use a new question to check transfer.');
 else if(o.attempts>1)reasons.push('Earlier attempts are available. Review what changed and try a new question.');
 return reasons.length?[{...o,followupReasons:reasons}]:[];
});}
function studentSummary(s){
 const obs=observations(s);
 const counts=evidenceSummary(s),overview=counts.matched+' answer components matched · '+counts.recheck+' need another check · '+counts.roundingReview+' earlier precision checks await review. '+(counts.review+counts.missing+counts.unsure+counts.notStudied)+' response parts are open, missing, uncertain or not studied. '+counts.explanations.open+' whole-answer explanations await review.';
 const matched=obs.filter(o=>o.components.some(c=>c.state==='matched')).slice(0,3).map(o=>({title:o.title,detail:o.components.filter(c=>c.state==='matched').slice(0,2).map(c=>c.label).join('; ')}));
 const rank=o=>o.components.some(c=>c.state==='recheck')?0:o.explanationReview?.points===0||o.explanationReview?.points===1||o.components.some(c=>c.review?.points===0||c.review?.points===1)?1:o.components.some(c=>c.state==='rounding-review')?2:3;
 const checks=nextChecks(s).map((o,i)=>({o,i})).sort((a,b)=>rank(a.o)-rank(b.o)||a.i-b.i).slice(0,2).map(({o})=>({title:authoredText(o.title),detail:authoredText(o.followupReasons.join(' ')).replace('Read the open responses and missing parts before interpreting the fixed checks. Accept equivalent methods; ask a targeted follow-up about an unclear mathematical connection.','Bring your calculations or diagrams to a teacher or tutor. Together, check any unclear connection and discuss how to finish missing parts.'),next:authoredText(o.next)}));
 if(!checks.length){for(const o of obs.filter(o=>!o.explanationReview||o.explanationReview.points===null).slice(0,2))checks.push({title:o.title,detail:'The explanation is still open for review. This is missing verification, not a demonstrated mistake.',next:'Ask a teacher or tutor to read your calculation or diagram and check the key connection.'});}
 return{overview,matched,checks,selection:'The examples below show up to three tasks with matching fixed components, not your complete set of matching answers. Next checks prioritize mismatched components, then saved reviews asking for revision, then earlier precision checks, then other evidence limits. Ties keep question order. If none applies, unreviewed explanations are selected. This is a conversation starter, not a ranking of ability.'};
}
function portable(s){return{product:'Quidence',kind:settings.projects?'field-project':settings.challenge?'diagnostic-challenge':'foundation-check',check:checkName(s),schema:SCHEMA,bankVersion:s.bankVersion,exportedAt:stamp(),markdown:markdown(s),scope:B.MODULES[s.module].scope,subject:subjectTitle(s),session:clone(s),taskDefinitions:clone(tasks(s)),observations:observations(s),studentSummary:studentSummary(s),evidenceSummary:evidenceSummary(s),scopeReview:scopeReview(s),recommendedFollowups:nextChecks(s),interpretation:'Objective answer components are checked with fixed mathematics. Explanations require human or AI-tutor review. These observations do not establish mastery, effort, AI use, or a complete course diagnosis.'};}
function answerText(t,a){return t.fields.map(f=>{const v=a?.values[f.id];if(settings.fieldTypes?.[f.kind])return f.label+': '+settings.fieldTypes[f.kind].text(f,v);return f.label+': '+(f.kind==='number'?v||'not entered':f.kind==='multi'?(v||[]).map(x=>f.options.find(o=>o.value===x)?.label||x).join('; ')||'not selected':f.options.find(o=>o.value===v)?.label||'not selected');}).join('\n');}
const quoteOriginal=value=>String(value??'').split('\n').map(line=>'> '+line).join('\n');
function answerMarkdown(t,a){return t.fields.map(f=>{const single={...t,fields:[f]},line=answerText(single,a),prefix=f.label+': ';return f.label+':\n'+quoteOriginal(line.startsWith(prefix)?line.slice(prefix.length):line);}).join('\n');}
function markdown(s){
 const module={...B.MODULES[s.module],scope:authoredText(B.MODULES[s.module].scope)},brief=studentSummary(s);let out='# Quidence · '+subjectTitle(s)+'\n\nScope: '+module.scope+'\nSession: '+s.id+'\n\n## Your next conversation\n\n'+brief.overview+'\n\n### Matching answer components\n\n'+(brief.matched.map(x=>'- '+x.title+': '+x.detail).join('\n')||'No matching fixed components are available in this record.')+'\n\n### One or two things to check next\n\n'+(brief.checks.map(x=>'- '+x.title+': '+x.detail+' '+x.next).join('\n')||'No specific next check was selected. Ask about a new task before making a broader claim.')+'\n\n## How to read this report\n\nMatching answer fields do not verify the explanation or establish mastery. Written reasons remain open until a reviewer checks their mathematical meaning. '+brief.selection+'\n\n## A useful request for a teacher or tutor\n\nBefore sharing, remove names, school, contact details and other personal information. Use only tools you are allowed to use; younger learners should work with a parent or teacher.\n\nUse the actual answers and explanations below to suggest one or two learning priorities. Explain which specific responses support each suggestion, and ask a follow-up question when the reasoning is ambiguous. Keep arithmetic errors, conceptual explanations, missing evidence, and reported help distinct. Do not treat this short check as a complete course assessment or infer effort or AI use from it. Start with a short explanation and one changed-number practice question, then adapt to my response.\n\n';
 const summary=evidenceSummary(s);out+='Check: '+checkName(s)+' · '+tasks(s).length+' '+unit+'\n\n## Fixed components and separate explanation reviews\n\nMatched components: '+summary.matched+'; need another check: '+summary.recheck+'; uncertain: '+summary.unsure+'; not studied: '+summary.notStudied+'; locally reviewed responses: '+(summary.reviewed||0)+'; mathematical response parts awaiting review: '+(summary.review||0)+'; earlier precision checks awaiting review: '+summary.roundingReview+'; missing: '+summary.missing+'. These are component counts, not a weighted grade or mastery estimate.\nWhole-answer explanations awaiting review: '+summary.explanations.open+'; revision: '+summary.explanations.revise+'; partial: '+summary.explanations.partial+'; key connection explained: '+summary.explanations.connected+'. Reviews concern only the current submitted attempt.\n\n';
 const scope=scopeReview(s);out+='## Scope and evidence limits\n\n'+scope.interpretation+'\n\nNot checked in these '+tasks(s).length+' '+unit+':\n'+scope.notChecked.map(x=>'- '+x).join('\n')+'\n\nSupplied information affecting interpretation:\n'+(scope.suppliedInformation.length?scope.suppliedInformation.map(x=>'- '+tasks(s).find(t=>t.id===x.task).title+': '+x.note).join('\n'):'No separate supplied-answer condition is flagged here. The full prompts remain above each answer; they still define the support and limits of the evidence.')+'\n\n';
 const followups=nextChecks(s);out+='## Possible next checks\n\n'+(followups.length?followups.map(o=>'- '+o.title+': '+o.followupReasons.join(' ')+' Next: '+o.next).join('\n'):'No specific follow-up was selected from the fixed checks, reported support, or saved local reviews. Unreviewed written reasons and untested topics still need evidence.')+'\n\n';
 out+='## Answer and explanation history\n\n';
 for(const[i,original]of tasks(s).entries()){
  const t=displayTask(original),r=s.records[t.id];out+='### '+t.title+' · '+t.groupName+'\n\n'+t.prompt+'\n\n';
  if(t.steps)out+=t.steps.map(step=>'#### '+step.title+'\n\n'+step.prompt+'\n').join('\n')+'\n';
  if(settings.projects){let draw=0;for(const c of reviewedComponents(s,t))if(c.drawing&&c.drawingSpec)out+='![Student construction: '+c.label.replace(/[\[\]\n]/g,' ')+'](Quidence_Drawing_'+(i+1)+'_'+(++draw)+'.svg)\n\n';}
  if(t.table)out+='Given table: '+JSON.stringify(t.table)+'\n\n';if(t.matrix)out+='Given matrix: '+JSON.stringify(t.matrix)+'\n\n';if(t.referenceVisual)out+='Reference diagram description: '+t.referenceVisual.description+'\n\n';if(t.visual)out+='Graph/table description: '+t.visual.description+'\n'+(t.visual.kind==='game'?'Payoffs: '+JSON.stringify(t.visual)+'\n':'')+'\n';
  out+='Reasoning prompt: '+t.reason+'\n\n';
  out+='Current component checks:\n'+reviewedComponents(s,t).map(x=>'- '+x.label+': '+x.state+(x.skill?' · '+x.skill:'')+(x.feedback?' · '+x.feedback:'')+(x.reviewCriteria?.length?' · review criteria: '+x.reviewCriteria.join('; '):'')+(x.selection?' · correct selections: '+x.selection.correct.join(', ')+'; extra selections: '+x.selection.extra.join(', ')+'; missing selections: '+x.selection.missing.join(', '):'')).join('\n')+'\n\n';
  for(const [i,a]of (r?.submissions||[]).entries())out+='Attempt '+(i+1)+' · '+a.objective.state+' · '+a.at+'\n'+(a.answer.notStudied?'Student marked this topic not studied.\n':'')+(a.answer.unsure?'Student selected “I’m not sure”.\n':'')+answerMarkdown(t,a.answer)+'\nStudent explanation:\n'+quoteOriginal(a.answer.explanation)+'\nOther help reported: '+a.answer.otherHelp+'\nEarlier report viewed: '+a.feedbackSeen+'\n\n';
  if(!r?.submissions.length)out+='No submitted answer.\n\n';else if(r.status==='draft')out+='Current revision is not submitted. Draft explanation:\n'+quoteOriginal(r.draft.explanation)+'\n\n';
  for(const x of r?.partReviews||[])out+='Local review of part '+x.field+' on attempt '+x.submission+': '+(x.points===null?'open':x.points+'/2')+'\n'+quoteOriginal(x.note)+'\n';
  out+='Reference mathematics: '+t.solution+'\nNext check: '+t.next+'\n';for(const x of r?.reviews||[])out+='Local review of attempt '+x.submission+': '+(x.points===null?'open':x.points+'/2')+'\n'+quoteOriginal(x.note)+'\n';out+='\n';
 }
 return out+'These are task observations. All original explanations and earlier attempts remain available for review.\n';
}
function hydrate(value){
 // Every published set of entry subjects stays readable; hydrate adds the subjects added since.
 const entryLayouts=[['aa01','ab01','ac01','ad01'],['aa01','ab01','ac01','ad01','ae01','af01'],['aa01','ab01','ac01','ad01','ae01','af01','number-theory','physics-1','physics-2'],['aa01','ab01','ac01','ad01','ae01','af01','number-theory','physics-1','physics-2','coordinate-geometry'],['aa01','ab01','ac01','ad01','ae01','af01','number-theory','physics-1','physics-2','coordinate-geometry','geometry','algebra-2'],['aa01','ab01','ac01','ad01','ae01','af01','number-theory','physics-1','physics-2','coordinate-geometry','geometry','algebra-2','discrete-math'],Object.keys(B.MODULES)];
 if(!object(value)||value.schema!==SCHEMA||!ENTRY_VERSIONS.includes(value.bankVersion)||!object(value.modules)||Object.keys(value.modules).some(id=>!B.MODULES[id])||(settings.challenge?Object.keys(B.HISTORY?.[value.bankVersion]||B.MODULES):['aa01','ab01','ac01','ad01']).some(id=>!value.modules[id])||!settings.challenge&&!entryLayouts.some(ids=>ids.length===Object.keys(value.modules).length&&ids.every(id=>Object.hasOwn(value.modules,id))))return null;
 const ids=new Set();
 for(const [module,m]of Object.entries(value.modules)){
  if(!object(m)||!Array.isArray(m.sessions)||!(m.active===null||typeof m.active==='string'))return null;
  if(m.active!==null&&!m.sessions.some(s=>s?.id===m.active))return null;
  for(const s of m.sessions){
   if(!object(s)||typeof s.id!=='string'||ids.has(s.id)||s.module!==module||(s.bankVersion===X.VERSION&&!X.MODULES[module])||![...ENTRY_VERSIONS,X.VERSION].includes(s.bankVersion)||(s.bankVersion===X.VERSION?s.check!=='followup':s.check!==undefined&&s.check!=='entry')||!Number.isFinite(Date.parse(s.createdAt))||!['intro','task','report'].includes(s.view)||!definition(s)||!Number.isInteger(s.index)||s.index<0||s.index>=tasks(s).length||!object(s.records)||!Array.isArray(s.events)||s.events.some(e=>!object(e)||typeof e.type!=='string'||!Number.isFinite(Date.parse(e.at))))return null;
   ids.add(s.id);
   for(const [id,r]of Object.entries(s.records)){
    const t=tasks(s).find(t=>t.id===id);
    if(!t||!object(r)||!validDraft(t,r.draft)||!['draft','submitted'].includes(r.status)||!Array.isArray(r.submissions)||!Array.isArray(r.reviews)||r.status==='submitted'&&!r.submissions.length)return null;
    for(const a of r.submissions)if(!object(a)||(a.numericPolicy!==undefined&&![NUMERIC_POLICY,PREVIOUS_NUMERIC_POLICY,LEGACY_NUMERIC_POLICY].includes(a.numericPolicy))||a.taskVersion!==s.bankVersion||validate(t,a.answer,a.numericPolicy||'legacy-strict')||typeof a.feedbackSeen!=='boolean'||!Number.isFinite(Date.parse(a.at))||JSON.stringify(a.objective)!==JSON.stringify(evaluate(t,a.answer,a.numericPolicy)))return null;
    if(r.status==='submitted'&&JSON.stringify(r.draft)!==JSON.stringify(r.submissions.at(-1).answer))return null;
    if(r.partReviews!==undefined&&(!settings.projects||!Array.isArray(r.partReviews)||r.partReviews.some(x=>!object(x)||!t.fields.some(f=>f.id===x.field)||!Number.isInteger(x.submission)||x.submission<1||x.submission>r.submissions.length||![null,0,1,2].includes(x.points)||typeof x.note!=='string'||!x.note.trim()||x.note.length>2000||!Number.isFinite(Date.parse(x.at)))))return null;
    if(r.reviews.some(x=>!object(x)||!Number.isInteger(x.submission)||x.submission<1||x.submission>r.submissions.length||![null,0,1,2].includes(x.points)||typeof x.note!=='string'||!x.note.trim()||x.note.length>2000||!Number.isFinite(Date.parse(x.at))))return null;
   }
   if(s.view==='report'&&!done(s))return null;
  }
 }
 const migrated=clone(value);for(const id of Object.keys(B.MODULES))if(!migrated.modules[id])migrated.modules[id]={active:null,sessions:[]};
 return migrated;
}
const api={settings,SCHEMA,NUMERIC_POLICY,PREVIOUS_NUMERIC_POLICY,LEGACY_NUMERIC_POLICY,subjectTitle,authoredText,displayTask,studentTaskNote,numberMatches,numeric,numericFormatIssues,minimumPlaces,fresh,session,createSession,definition,checkName,tasks,task,blank,record,edit,validate,evaluate,submit,last,done,review,latestReview,reviewPart,latestPartReview,observations,componentChecks,evidenceSummary,studentSummary,scopeReview,nextChecks,portable,answerText,markdown,hydrate};
return api;
}
const api=build(B,X);api.forBank=build;
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceFoundationEngine=api;
})(typeof window==='undefined'?globalThis:window);

