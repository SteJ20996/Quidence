(function(){
  'use strict';
  const root=document.getElementById('quidence-home'),mapView=root?.querySelector('.home-map-view'),courseView=root?.querySelector('.home-course-view');
  if(!root||!mapView||!courseView||document.getElementById('knowledge-map').hidden)return;
  const choices=[...root.querySelectorAll('[data-home-view]')];
  function compactSubjectLabels(){
    const es=window.QuidenceI18n?.locale==='es';
    for(const button of root.querySelectorAll('[data-compact-physics]')){
      const number=button.dataset.learningSubject==='physics-1'?'1':'2';
      button.textContent=es?'Fundamentos de física '+number:'Physics '+number+' Foundations';
      // The visible course name is also its accessible name.
      button.removeAttribute('aria-label');
    }
  }
  document.addEventListener('quidence:language',compactSubjectLabels);compactSubjectLabels();
  function show(view,updateURL=true){
    const cards=view==='courses';mapView.hidden=cards;courseView.hidden=!cards;root.dataset.homeView=cards?'courses':'map';
    for(const choice of choices){const active=choice.dataset.homeView===root.dataset.homeView;if(active)choice.setAttribute('aria-current','page');else choice.removeAttribute('aria-current');choice.setAttribute('aria-controls',choice.dataset.homeView==='courses'?'course-cards':'knowledge-map');}
    if(updateURL){const url=new URL(location.href);if(cards)url.searchParams.set('view','courses');else url.searchParams.delete('view');history.replaceState(history.state,'',url);}
    document.dispatchEvent(new CustomEvent('quidence:home-view',{detail:{view:root.dataset.homeView}}));
  }
  for(const choice of choices)choice.addEventListener('click',()=>show(choice.dataset.homeView));
  root.querySelector('.q-brand').addEventListener('click',event=>{event.preventDefault();show('map');window.scrollTo({top:0,behavior:'instant'});});
  for(const anchor of root.querySelectorAll('a[href="#practice-heading"]'))anchor.addEventListener('click',()=>show('courses'));
  window.addEventListener('popstate',()=>show(new URL(location.href).searchParams.get('view'),false));
  show(new URL(location.href).searchParams.get('view')==='courses'||location.hash==='#practice-heading'?'courses':'map',false);
})();
