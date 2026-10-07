(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else{root.QuidenceLearningGoals=api;api.mount(root.document,root);}})(typeof window==='object'?window:globalThis,(root)=>{
'use strict';
// Legacy persistence identifiers are intentionally retained; see BRAND_MIGRATION.md.
const KEY='cluevera_learning_goal_v1';
const CATALOG=typeof module==='object'&&module.exports?require('./course-catalog.js'):root.QuidenceCourseCatalog;
const SUBJECTS=Object.fromEntries(Object.entries(CATALOG.COURSES).filter(([,c])=>!c.planned));
function prompt(goal,report=''){
 if(!SUBJECTS[goal.subject])return'';
 return`# My learning request\n\nBefore sharing: remove names, school, contact details and other personal information. Use only a tool you are allowed to use; younger learners should review with a parent or teacher.\n\nSubject: ${SUBJECTS[goal.subject].title}\n\nLearning goal or homework question:\n\n${String(goal.text||'Help me choose a useful starting point.').split('\n').map(s=>'> '+s).join('\n')}\n\nPlease first ask what I have tried and what is unclear. Read any work below, check my calculations and reasoning, then help me work through one step at a time. Accept a different valid approach. When I am ready, give one new example and adapt to my answer.\n\n${report?'## My saved learning report\n\n'+report:'If no report is attached, ask for my current work before drawing conclusions about my understanding.'}\n`;
}
function hydrate(value){const subject=value?.subject==='aa01'?'algebra-1':value?.subject;return value?.schema===KEY&&SUBJECTS[subject]&&typeof value.text==='string'&&value.text.length<=3000?{subject,text:value.text}:null;}
function mount(document,window){
 const host=document.getElementById('learning-entry');if(!host)return;
 const text=document.getElementById('learning-goal'),status=document.getElementById('goal-status'),course=document.getElementById('goal-course'),foundation=document.getElementById('goal-foundations'),copy=document.getElementById('goal-copy'),area=document.getElementById('goal-markdown'),report=document.getElementById('goal-report');
 const original=document.getElementById('goal-original'),reset=document.getElementById('goal-reset');
 let goal={subject:'pre-algebra',text:''},saving=true,reports=[],blocked=false,rawOriginal=null;
 function blockedNotice(){status.textContent='The saved learning request could not be read. Its original is kept. You can copy it before explicitly starting a new saved request; new edits are not saved yet.';}
 try{
  rawOriginal=(window.QuidenceStorage||window.localStorage).getItem(KEY);
  if(rawOriginal!==null){const restored=hydrate(JSON.parse(rawOriginal));if(restored)goal=restored;else blocked=true;}
 }catch{blocked=true;}
 if(blocked){saving=false;if(original)original.hidden=rawOriginal===null;if(reset)reset.hidden=false;blockedNotice();}
 try{const saved=window.QuidenceReportStore?.read((window.QuidenceStorage||window.localStorage));if(saved?.ok)reports=saved.data.items;}catch{}
 function persist(){
  if(blocked){blockedNotice();return;}
  try{(window.QuidenceStorage||window.localStorage).setItem(KEY,JSON.stringify({schema:KEY,...goal}));saving=true;}
  catch{saving=false;status.textContent='Browser saving is unavailable. Copy your request before leaving.';}
 }
 original?.addEventListener('click',()=>{area.hidden=false;area.value=rawOriginal;area.focus?.();area.select?.();blockedNotice();});
 reset?.addEventListener('click',()=>{
  if(!window.confirm?.('Copy the saved original first. Replace it with your current learning request?'))return;
  try{
   if((window.QuidenceStorage||window.localStorage).getItem(KEY)!==rawOriginal){status.textContent='The saved record changed. Reload and inspect it before replacing it.';return;}
   (window.QuidenceStorage||window.localStorage).setItem(KEY,JSON.stringify({schema:KEY,...goal}));
   blocked=false;saving=true;original.hidden=true;reset.hidden=true;status.textContent='Your new request is saved.';
  }catch{blockedNotice();}
 });
 function render(){
  for(const button of host.querySelectorAll('[data-learning-subject]'))button.setAttribute('aria-pressed',String(button.dataset.learningSubject===goal.subject));
  document.getElementById('goal-subject-label').textContent=SUBJECTS[goal.subject].title;
  course.href=SUBJECTS[goal.subject].course;foundation.hidden=!SUBJECTS[goal.subject].foundation;foundation.textContent=SUBJECTS[goal.subject].foundationLabel||'Complete a foundation check →';if(SUBJECTS[goal.subject].foundation)foundation.href=SUBJECTS[goal.subject].foundation;else foundation.removeAttribute('href');
  report.innerHTML='<option value="">Start with my question only</option>'+reports.filter(r=>r.module===goal.subject||(['pre-algebra','algebra-1'].includes(goal.subject)&&r.module==='aa01')).map(r=>'<option value="'+window.QuidenceReportTools.escape(r.id)+'">'+window.QuidenceReportTools.escape(new Date(r.versions.at(-1).savedAt).toLocaleString())+' · '+window.QuidenceReportTools.escape(r.versions.at(-1).payload.check||'learning report')+'</option>').join('');
  text.value=goal.text;area.hidden=true;persist();
 }

 for(const button of host.querySelectorAll('[data-learning-subject]'))button.addEventListener('click',()=>{goal.subject=button.dataset.learningSubject;status.textContent='';render();});
 text.addEventListener('input',()=>{goal.text=text.value;persist();});
 copy.addEventListener('click',async()=>{
  const item=reports.find(r=>r.id===report.value),saved=item?.versions.at(-1),record=saved?window.QuidenceReportTools.markdown(item.subject,saved.payload):'';
  const ok=await window.QuidenceReportTools.copy(prompt(goal,record),area);area.hidden=ok;
  status.textContent=ok?'Learning request copied. Review it for personal details before sharing with your chosen tutor.':'Use your device’s Copy command on the selected request below.';
 });
 render();host.hidden=false;
 return{goal:()=>({...goal}),saving:()=>saving};
}
return{KEY,SUBJECTS,prompt,hydrate,mount};
});
