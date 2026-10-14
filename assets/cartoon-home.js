(function(){
'use strict';
const home=document.getElementById('quidence-home');if(!home)return;
const catalog=window.QuidenceCourseCatalog,bar=document.getElementById('subject-categories');
const validGroup=id=>id==='all'||catalog.GROUPS.some(g=>g.id===id);
let group=new URL(location.href).searchParams.get('group')||'all';if(!validGroup(group))group='all';
const iconNames={'pre-algebra':'numberline','algebra-1':'balance',geometry:'shapes','algebra-2':'parabola',af01:'wave',ad01:'integral',ae01:'bars',ab01:'vectors','number-theory':'dots',ac01:'game','physics-1':'pendulum','physics-2':'circuit'};
const requestSelect=document.getElementById('request-subject');
function illustrated(){return document.documentElement.dataset.uiTheme!=='classic';}
for(const [i,[id,course]]of Object.entries(catalog.COURSES).entries()){
 const card=home.querySelector('.subject-card[data-subject="'+id+'"]');if(!card)continue;
 card.style.order=i;card.dataset.category=course.group;
 const art=document.createElement('div');art.className='q-cartoon-cover';art.setAttribute('aria-hidden','true');art.innerHTML=window.QuidenceCartoonArt.icon(iconNames[id]);card.querySelector('.subject-picture').after(art);
}
function filter(updateURL=true){
 for(const card of home.querySelectorAll('.subject-card'))card.hidden=illustrated()&&group!=='all'&&card.dataset.category!==group;
 for(const button of bar.querySelectorAll('[data-category]'))button.setAttribute('aria-pressed',String(button.dataset.category===group));
 document.dispatchEvent(new CustomEvent('quidence:category',{detail:{group}}));
 if(updateURL){const u=new URL(location.href);if(group==='all')u.searchParams.delete('group');else u.searchParams.set('group',group);history.replaceState(history.state,'',u);}
}
bar.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){group=b.dataset.category;filter();}});
requestSelect.addEventListener('change',()=>home.querySelector('[data-learning-subject="'+requestSelect.value+'"]')?.click());
document.addEventListener('quidence:subject',e=>{if(catalog.COURSES[e.detail.subject])requestSelect.value=e.detail.subject;});
function theme(){
 home.querySelectorAll('.card-more').forEach(el=>el.open=!illustrated());
 filter(false);
}
document.addEventListener('quidence:theme',theme);
window.addEventListener('popstate',()=>{const value=new URL(location.href).searchParams.get('group');group=validGroup(value)?value:'all';filter(false);});
requestSelect.value=home.querySelector('[data-learning-subject][aria-pressed="true"]')?.dataset.learningSubject||'pre-algebra';
theme();
})();
