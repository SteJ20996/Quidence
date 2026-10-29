(function(){'use strict';
const home=document.getElementById('quidence-home'),host=document.getElementById('intuition-view');if(!home||!host)return;
const D=window.IntuitionData,ids={multiply:'pre-algebra',plans:'algebra-1',perimeter:'geometry',square:'algebra-2',waves:'af01',sphere:'ad01',groups:'ae01',transforms:'ab01',primes:'number-theory',choices:'ac01',apex:'physics-1',circuit:'physics-2'};
const spanishSubjects={'pre-algebra':'Preálgebra','algebra-1':'Álgebra I',geometry:'Geometría','algebra-2':'Álgebra II',af01:'Precálculo',ad01:'Cálculo',ae01:'Estadística',ab01:'Álgebra lineal','number-theory':'Teoría de números',ac01:'Teoría de juegos','physics-1':'Fundamentos de física 1','physics-2':'Fundamentos de física 2'};
const copy={
 en:{name:'Intuition Lab',eyebrow:'PREDICT · EXPLORE · CHECK · REVISIT',title:'Does your intuition hold up?',lead:'Start with a hunch. Give it a fair test.',note:'Your first guess is not scored. Use a model, a calculation or a proof to decide what holds—and when.',groups:['All subjects','School Mathematics','Further Mathematics','Science'],filterLabel:'Filter explorations',random:'Pick a question for me',count:'12 subjects · one question worth investigating in each',start:'Make a prediction',resume:'Continue exploring',time:'5–10 min',reason:'A good reason matters more than a lucky guess.',guide:'How an investigation works',kicker:'Field notes',noteTitle:'A note',records:'Your learning records stay in this browser.',
  steps:[['Predict','Choose an answer and give your reason. It is not scored.'],['Explore','Change the model and note what you see.'],['Check','Use the idea on a new value.'],['Revisit','Decide whether your first reason still holds.']],
  notes:{school:'Familiar rules worth a second look.',further:'Claims to test with models, data and proofs.',science:'Predictions about motion and circuits.'}},
 es:{name:'Laboratorio de intuición',eyebrow:'PREDECIR · EXPLORAR · COMPROBAR · REVISAR',title:'¿Tu intuición se sostiene?',lead:'Empieza con una idea. Ponla a prueba.',note:'La primera respuesta no se califica. Usa un modelo, un cálculo o una demostración para decidir qué se cumple y cuándo.',groups:['Todas las materias','Matemáticas escolares','Matemáticas avanzadas','Ciencias'],filterLabel:'Filtrar exploraciones',random:'Elige una pregunta para mí',count:'12 materias · una pregunta para investigar en cada una',start:'Haz una predicción',resume:'Seguir explorando',time:'5–10 min',reason:'Una buena razón vale más que un acierto por casualidad.',guide:'Cómo funciona una investigación',kicker:'Notas de campo',noteTitle:'Una nota',records:'Tus registros de aprendizaje se guardan en este navegador.',
  steps:[['Predecir','Elige una respuesta y explica tu razón. No se califica.'],['Explorar','Cambia el modelo y anota lo que observas.'],['Comprobar','Aplica la idea a un valor nuevo.'],['Revisar','Decide si tu primera razón sigue siendo válida.']],
  notes:{school:'Reglas conocidas que merecen una segunda mirada.',further:'Afirmaciones para comprobar con modelos, datos y demostraciones.',science:'Predicciones sobre el movimiento y los circuitos.'}}
};
const GROUPS=['school','further','science'];
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let filter='all';
function locale(){return window.QuidenceI18n?.locale==='es'?'es':'en';}
// Each appearance draws its own composition; an unknown value falls back to the default appearance.
function appearance(){const value=document.documentElement.dataset.uiTheme;return ['classic','paper','atlas','studio'].includes(value)?value:'studio';}
function saved(){try{return JSON.parse(window.QuidenceStorage.getItem('quidence_intuition_v1')||'{}').activities||{};}catch{return {};}}
function started(record){return Boolean((Array.isArray(record?.attempts)?record.attempts.at(-1):null)?.original);}
function picture(d,lang,theme){
 const subject=ids[d.id];
 if(theme==='paper'&&window.QuidencePaperArt)return window.QuidencePaperArt.icon(subject);
 if(theme==='atlas'&&window.QuidenceAtlasArt)return window.QuidenceAtlasArt.icon(subject,'qi-atlas');
 const course=window.QuidenceCourseCatalog.COURSES[subject],special=['sphere','groups','transforms'].includes(d.id);
 return `<img src="assets/${special?'intuition-'+d.id+'.svg':'illustrations/'+course.illustration+(lang==='es'?'-es':'')+'.svg'}" alt="" width="320" height="164" loading="lazy">`;
}
function card(d,lang,c,theme,progress){
 const subject=lang==='es'?spanishSubjects[ids[d.id]]:window.QuidenceCourseCatalog.COURSES[ids[d.id]].title,arrow={classic:'→',atlas:'›'}[theme]||'↗';
 return `<a class="qi-card" href="intuition/?lang=${lang}#${d.id}" data-intuition-activity="${d.id}" data-intuition-subject="${ids[d.id]}"><span class="qi-card-art" aria-hidden="true">${picture(d,lang,theme)}</span><span class="qi-card-copy"><span class="qi-eyebrow">${e(subject)}</span><h3>${e(d.title[lang])}</h3><span class="qi-card-meta">${c.time} · ${c.reason}</span><span class="qi-card-action">${started(progress[d.id])?c.resume:c.start} <i aria-hidden="true">${arrow}</i></span></span></a>`;
}
function filters(c,theme){
 // Paper Explorer reuses the category drawings already placed in its subject tabs.
 const icon=group=>theme==='paper'&&group!=='all'?(home.querySelector('#subject-categories [data-category="'+group+'"] .q-paper-category-icon')?.outerHTML||''):'';
 return `<div class="qi-filters" role="group" aria-label="${c.filterLabel}">${['all',...GROUPS].map((g,i)=>`<button type="button" data-intuition-filter="${g}" aria-pressed="${filter===g}">${icon(g)}<span>${c.groups[i]}</span></button>`).join('')}</div><p class="qi-count">${c.count}</p>`;
}
function grouped(items,render,c){
 return GROUPS.filter(g=>items.some(d=>d.group===g)).map(g=>`<section class="qi-group" data-intuition-group="${g}" aria-labelledby="qi-group-${g}"><div class="qi-group-heading"><h2 id="qi-group-${g}">${c.groups[GROUPS.indexOf(g)+1]}</h2><p>${c.notes[g]}</p></div><div class="qi-grid">${items.filter(d=>d.group===g).map(render).join('')}</div></section>`).join('');
}
function intro(c,art=''){return `<header class="qi-intro"><div class="qi-intro-copy"><p class="qi-eyebrow">${c.eyebrow}</p><h1 id="intuition-title">${c.title}</h1><p class="qi-lead">${c.lead}</p><p class="qi-note">${c.note}</p></div>${art}</header>`;}
function steps(c){return `<ol class="qi-steps">${c.steps.map(([title,text],i)=>`<li><span class="qi-step-number" aria-hidden="true">${i+1}</span><span class="qi-step-copy"><strong>${title}</strong> <span>${text}</span></span></li>`).join('')}</ol>`;}
function guide(c,lang,random,theme){
 const button=`<a class="qi-random" href="intuition/?lang=${lang}#${random.id}">${c.random} <span aria-hidden="true">${theme==='paper'?'↗':'→'}</span></a>`;
 if(theme==='classic')return `<aside class="qi-guide" aria-labelledby="qi-guide-title"><h2 id="qi-guide-title">${c.guide}</h2>${steps(c)}${button}</aside>`;
 if(theme==='paper')return `<aside class="qi-guide" aria-labelledby="qi-guide-title"><div class="qi-shelf" aria-hidden="true"></div><div class="qi-guide-card"><div class="qi-guide-body"><h2 id="qi-guide-title">${c.guide}</h2>${steps(c)}${button}</div></div><a class="qi-records" href="records/">${c.records}</a></aside>`;
 const book='<svg viewBox="0 0 44 40" aria-hidden="true" fill="none" stroke="currentColor"><path d="M22 7Q12 0 3 5v28q11-5 19 2 8-7 19-2V5Q32 0 22 7v28M7 10q7-3 11 1m-11 5q7-3 11 1m-11 5q7-3 11 1m8-11q5-4 11-1m-11 7q5-4 11-1m-11 7q5-4 11-1"/></svg>';
 return `<aside class="qi-guide" aria-labelledby="qi-guide-title"><div class="qi-guide-card"><div class="qi-guide-body"><p class="qi-kicker">${window.QuidenceAtlasArt?.compass()||''}<span>${c.kicker}</span></p><h2 id="qi-guide-title">${c.guide}</h2>${steps(c)}${button}</div><a class="qi-records" href="records/">${book}<span><span class="qi-records-title">${c.noteTitle}</span>${c.records}</span></a><div class="qi-books" aria-hidden="true"></div></div></aside>`;
}
function render(){
 const lang=locale(),c=copy[lang],theme=appearance(),progress=saved();
 home.querySelector('[data-home-view="intuition"]').textContent=c.name;
 for(const subjectCard of home.querySelectorAll('.subject-card')){const a=subjectCard.querySelector('.intuition-link'),course=window.QuidenceCourseCatalog.COURSES[subjectCard.dataset.subject];if(a&&course?.intuition){a.textContent=lang==='es'?'Pon a prueba tu intuición →':'Test your intuition →';a.href=course.intuition.replace('/#','/?lang='+lang+'#');}}
 // Classic shows every group in its own section, so it has no filter.
 if(theme==='classic')filter='all';
 const random=D[Math.floor(Math.random()*D.length)],items=D.filter(d=>filter==='all'||d.group===filter),cardFor=d=>card(d,lang,c,theme,progress);
 host.dataset.qiTheme=theme;
 if(theme==='classic')host.innerHTML=intro(c)+guide(c,lang,random,theme)+`<div class="qi-main">${grouped(items,cardFor,c)}</div>`;
 else if(theme==='paper')host.innerHTML=`<div class="qi-layout">${intro(c)}<div class="qi-main">${filters(c,theme)}<div class="qi-grid">${items.map(cardFor).join('')}</div></div>${guide(c,lang,random,theme)}</div>`;
 else if(theme==='atlas')host.innerHTML=`<div class="qi-layout">${intro(c,'<div class="qi-intro-art" aria-hidden="true"></div>')}<div class="qi-main">${filters(c,theme)}${grouped(items,cardFor,c)}</div>${guide(c,lang,random,theme)}</div>`;
 else host.innerHTML=intro(c,`<a class="qi-random" href="intuition/?lang=${lang}#${random.id}">${c.random} ↗</a><div class="qi-intro-art" aria-hidden="true">${window.QuidenceStudioArt?.shapes()||''}</div>`)+filters(c,theme)+`<div class="qi-grid">${items.map(cardFor).join('')}</div>`;
 host.querySelectorAll('[data-intuition-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.intuitionFilter;render();host.querySelector('[data-intuition-filter="'+filter+'"]')?.focus();}));
}
render();document.addEventListener('quidence:language',render);document.addEventListener('quidence:theme',render);document.addEventListener('quidence:home-view',event=>{if(event.detail.view==='intuition')render();});window.addEventListener('pageshow',()=>{if(home.dataset.homeView==='intuition')render();});
})();
