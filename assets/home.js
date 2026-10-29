(function(){
  'use strict';
  const root=document.getElementById('quidence-home'),mapView=root?.querySelector('.home-map-view'),courseView=root?.querySelector('.home-course-view');
  if(!root||!mapView||!courseView||document.getElementById('knowledge-map').hidden)return;
  const defaultView=document.documentElement.dataset.uiTheme==='classic'?'map':'courses';
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
    if(updateURL){const url=new URL(location.href);if(cards)url.searchParams.set('view','courses');else url.searchParams.set('view','map');history.replaceState(history.state,'',url);}
    document.dispatchEvent(new CustomEvent('quidence:home-view',{detail:{view:root.dataset.homeView}}));
  }
  for(const choice of choices)choice.addEventListener('click',()=>show(choice.dataset.homeView));
  root.querySelector('.q-brand').addEventListener('click',event=>{event.preventDefault();show(document.documentElement.dataset.uiTheme==='classic'?'map':'courses');window.scrollTo({top:0,behavior:'instant'});});
  for(const anchor of root.querySelectorAll('a[href="#practice-heading"]'))anchor.addEventListener('click',()=>show('courses'));
  window.addEventListener('popstate',()=>show(new URL(location.href).searchParams.get('view')||(document.documentElement.dataset.uiTheme==='classic'?'map':'courses'),false));
  for(const card of root.querySelectorAll('.subject-card'))card.id='subject-'+card.dataset.subject;
  function guide(){const es=window.QuidenceI18n?.locale==='es';root.querySelector('[data-map-guide-title]').textContent=es?'Conoce una idea. Elige tu siguiente paso.':'Meet an idea. Choose your next step.';root.querySelector('[data-map-guide-copy]').textContent=es?'Selecciona un nodo para ver una breve introducción y sus enlaces. Para lecciones, evaluaciones y proyectos, abre Materias.':'Select a node for a short introduction and links. For lessons, checks and projects, open Subjects.';const check=root.querySelector('.subject-card[data-subject="ad01"] .challenge-link');if(check){check.setAttribute('data-no-translate','');check.textContent=es?'Comprueba tu comprensión →':'Test your understanding →';check.href='modules/ad01/dist/checks/?lang='+(es?'es':'en');}const a=root.querySelector('.q-map-subjects');a.textContent=es?'Ir a Materias →':'Go to Subjects →';a.href='?view=courses&lang='+(es?'es':'en');}
  document.addEventListener('quidence:language',guide);guide();
  root.addEventListener('click',event=>{const a=event.target.closest('a[data-map-subjects]');if(!a||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();const module=a.dataset.mapSubjects;
    if(module)root.querySelector('[data-learning-subject="'+module+'"]')?.click();
    root.querySelector('[data-category="all"]')?.click();show('courses');const target=module?root.querySelector('.subject-card[data-subject="'+module+'"]'):courseView;target?.scrollIntoView({block:'start',behavior:'instant'});if(module)target?.querySelector('.subject-link')?.focus({preventScroll:true});
  });
  const requested=new URL(location.href).searchParams.get('view');show(requested==='map'?'map':requested==='courses'||location.hash==='#practice-heading'?'courses':defaultView,false);
})();

