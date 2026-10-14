(function(){'use strict';
const home=document.getElementById('quidence-home');if(!home)return;
const copy={en:{note:'Your learning records stay in this browser.',break:'Take a puzzle break at',question:'A question, a topic, or something you want to understand.'},es:{note:'Tus registros de aprendizaje se guardan en este navegador.',break:'Tómate un descanso en',question:'Una pregunta, un tema o algo que quieras comprender.'}};
function label(tag,key,className){const el=document.createElement(tag);el.dataset.studioCopy=key;el.setAttribute('data-no-translate','');el.className=className||'';return el;}
for(const card of home.querySelectorAll('.subject-card')){const art=document.createElement('div');art.className='q-studio-only q-studio-cover';art.setAttribute('aria-hidden','true');art.setAttribute('data-no-translate','');art.innerHTML=QuidenceStudioArt.icon(card.dataset.subject);card.querySelector('.q-cartoon-cover').after(art);}
const shapes=document.createElement('div');shapes.className='q-studio-only q-studio-shapes';shapes.innerHTML=QuidenceStudioArt.shapes();shapes.setAttribute('aria-hidden','true');home.querySelector('.qf-page-heading').append(shapes);
const bulb=document.createElement('div');bulb.className='q-studio-only q-studio-bulb';bulb.innerHTML=QuidenceStudioArt.bulb();bulb.setAttribute('aria-hidden','true');home.querySelector('.learning-request').prepend(bulb);
const heading=home.querySelector('.qf-request-heading'),marker=document.createComment('Geometric Studio request heading position');heading.before(marker);
const intro=document.createElement('div');intro.className='q-studio-only q-studio-intro';const question=label('p','question','q-studio-request-note');intro.append(question);home.querySelector('.learning-request').prepend(intro);
const footer=document.createElement('div');footer.className='q-studio-only q-studio-footer';const records=label('a','note','q-studio-record-note');records.href='records/';const qido=document.createElement('a');qido.className='q-studio-qidolab';qido.href='https://qidolab.com/';const logo=home.querySelector('.q-header-qidolab img').cloneNode();logo.width=125;logo.height=45;qido.append(label('span','break'),logo);footer.append(records,qido);home.querySelector('.feedback-section').before(footer);
function theme(){if(document.documentElement.dataset.uiTheme==='studio')intro.prepend(heading);else marker.after(heading);}
function language(){const text=copy[window.QuidenceI18n?.locale==='es'?'es':'en'];for(const el of home.querySelectorAll('[data-studio-copy]'))el.textContent=text[el.dataset.studioCopy];}
document.addEventListener('quidence:theme',theme);document.addEventListener('quidence:language',language);theme();language();
})();
