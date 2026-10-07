(function(root){
'use strict';
const STAGES={all:'All stages',middle:'Middle school',high:'High school',college:'College'};
const DIRECTIONS={all:'All math areas',foundational:'Foundational math',advanced:'Advanced math'};
const SUBJECTS={
 aa01:{stages:['middle','high'],direction:'foundational'},
 ab01:{stages:['high','college'],direction:'advanced'},
 ad01:{stages:['high','college'],direction:'advanced'},
 ae01:{stages:['middle','high','college'],direction:'foundational'},
 af01:{stages:['high','college'],direction:'foundational'}
};
function normalize(stage,direction){return{stage:Object.hasOwn(STAGES,stage)?stage:'all',direction:Object.hasOwn(DIRECTIONS,direction)?direction:'all'};}
function matches(id,selection){const s=SUBJECTS[id];return!!s&&(selection.stage==='all'||s.stages.includes(selection.stage))&&(selection.direction==='all'||s.direction===selection.direction);}
function fromSearch(search){const p=new URLSearchParams(search);return normalize(p.get('stage'),p.get('direction'));}
function toSearch(search,selection){const p=new URLSearchParams(search);for(const key of['stage','direction']){if(selection[key]==='all')p.delete(key);else p.set(key,selection[key]);}return p.toString();}
function mount(document,window){
 const section=document.getElementById('subject-filters'),stage=document.getElementById('filter-stage'),direction=document.getElementById('filter-direction'),status=document.getElementById('filter-status'),empty=document.getElementById('filter-empty'),reset=document.getElementById('filter-reset');
 if(!section||!stage||!direction||!status||!empty||!reset)return;
 const cards=Array.from(document.querySelectorAll('[data-subject]'));
 for(const card of cards){const s=SUBJECTS[card.dataset.subject],tags=card.querySelector('[data-subject-tags]');if(s&&tags){const labels=s.stages.map(id=>STAGES[id]).concat(DIRECTIONS[s.direction]);tags.innerHTML=labels.map(label=>'<span>'+label+'</span>').join('');}}
 function render(updateUrl=false){
  const selection=normalize(stage.value,direction.value);stage.value=selection.stage;direction.value=selection.direction;
  let count=0;for(const card of cards){card.hidden=!matches(card.dataset.subject,selection);if(!card.hidden)count++;}
  status.textContent=`Showing ${count} of ${cards.length} subjects · ${STAGES[selection.stage]} · ${DIRECTIONS[selection.direction]}`;
  empty.hidden=count!==0;reset.disabled=selection.stage==='all'&&selection.direction==='all';
  if(updateUrl)try{const u=new URL(window.location.href);u.search=toSearch(u.search,selection);window.history.replaceState(window.history.state,'',u.pathname+u.search+u.hash);}catch{/* Filtering remains usable when URL updates are unavailable. */}
 }
 function restore(){const selected=fromSearch(window.location.search);stage.value=selected.stage;direction.value=selected.direction;render();}
 stage.addEventListener('change',()=>render(true));direction.addEventListener('change',()=>render(true));
 reset.addEventListener('click',()=>{stage.value='all';direction.value='all';render(true);stage.focus();});
 window.addEventListener('popstate',restore);restore();section.hidden=false;
 return{render,restore};
}
const api={STAGES,DIRECTIONS,SUBJECTS,normalize,matches,fromSearch,toSearch,mount};
if(typeof module==='object'&&module.exports)module.exports=api;else{root.QuidenceHubFilters=api;mount(root.document,root);}
})(typeof window==='undefined'?globalThis:window);
