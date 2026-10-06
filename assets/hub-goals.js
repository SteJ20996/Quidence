(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.ClueveraLearningGoals=api;api.mount(root.document,root);}})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const KEY='cluevera_learning_goal_v1';
const SUBJECTS={aa01:{title:'School mathematics',course:'modules/aa01/dist/'},ab01:{title:'Linear algebra',course:'modules/ab01/dist/'},ac01:{title:'Game theory',course:'modules/ac01/dist/'},ad01:{title:'Visual calculus',course:'modules/ad01/dist/'},ae01:{title:'Statistics',course:'modules/ae01/dist/'},af01:{title:'Pre-calculus',course:'modules/af01/dist/'}};
function prompt(goal,report=''){
 if(!SUBJECTS[goal.subject])return'';
 return`# My mathematics learning request\n\nSubject: ${SUBJECTS[goal.subject].title}\n\nLearning goal or homework question:\n\n${String(goal.text||'Help me choose a useful starting point.').split('\n').map(s=>'> '+s).join('\n')}\n\nPlease first ask what I have tried and what is unclear. Read any work below, check my calculations and reasoning, then help me work through one step at a time. Accept a different valid approach. When I am ready, give one new example and adapt to my answer.\n\n${report?'## My saved learning report\n\n'+report:'If no report is attached, ask for my current work before drawing conclusions about my understanding.'}\n`;
}
function hydrate(value){return value?.schema===KEY&&SUBJECTS[value.subject]&&typeof value.text==='string'&&value.text.length<=3000?{subject:value.subject,text:value.text}:null;}
function mount(document,window){
 const host=document.getElementById('learning-entry');if(!host)return;
 const text=document.getElementById('learning-goal'),status=document.getElementById('goal-status'),course=document.getElementById('goal-course'),foundation=document.getElementById('goal-foundations'),copy=document.getElementById('goal-copy'),area=document.getElementById('goal-markdown'),report=document.getElementById('goal-report');
 let goal={subject:'aa01',text:''},saving=true,reports=[];
 try{const raw=window.localStorage.getItem(KEY);if(raw){const restored=hydrate(JSON.parse(raw));if(restored)goal=restored;}const saved=window.ClueveraReportStore?.read(window.localStorage);if(saved?.ok)reports=saved.data.items;}catch{saving=false;}
 function persist(){try{window.localStorage.setItem(KEY,JSON.stringify({schema:KEY,...goal}));}catch{saving=false;status.textContent='Browser saving is unavailable. Copy your request before leaving.';}}
 function render(){
  for(const button of host.querySelectorAll('[data-learning-subject]'))button.setAttribute('aria-pressed',String(button.dataset.learningSubject===goal.subject));
  document.getElementById('goal-subject-label').textContent=SUBJECTS[goal.subject].title;
  course.href=SUBJECTS[goal.subject].course;foundation.href='foundations/?module='+goal.subject;
  report.innerHTML='<option value="">Start with my question only</option>'+reports.filter(r=>r.module===goal.subject).map(r=>'<option value="'+window.ClueveraReportTools.escape(r.id)+'">'+window.ClueveraReportTools.escape(new Date(r.versions.at(-1).savedAt).toLocaleString())+' · '+window.ClueveraReportTools.escape(r.versions.at(-1).payload.check||'learning report')+'</option>').join('');
  text.value=goal.text;area.hidden=true;persist();
 }

 for(const button of host.querySelectorAll('[data-learning-subject]'))button.addEventListener('click',()=>{goal.subject=button.dataset.learningSubject;status.textContent='';render();});
 text.addEventListener('input',()=>{goal.text=text.value;persist();});
 copy.addEventListener('click',async()=>{
  const item=reports.find(r=>r.id===report.value),saved=item?.versions.at(-1),record=saved?window.ClueveraReportTools.markdown(item.subject,saved.payload):'';
  const ok=await window.ClueveraReportTools.copy(prompt(goal,record),area);area.hidden=ok;
  status.textContent=ok?'Learning request copied. Open your AI tutor and paste it.':'Use your device’s Copy command on the selected request below.';
 });
 render();host.hidden=false;
 return{goal:()=>({...goal}),saving:()=>saving};
}
return{KEY,SUBJECTS,prompt,hydrate,mount};
});
