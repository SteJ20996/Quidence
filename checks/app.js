(()=>{'use strict';
const subjects={
 ab01:{name:'Linear Algebra',title:'Think in Vectors',hash:'linear',count:12,description:'Stretch one coordinate and test whether every vector changes length in the same way.'},
 ae01:{name:'Statistics',title:'Think with Data',hash:'statistics',count:4,description:'Separate the variation among individuals from uncertainty about a population mean.'},
 af01:{name:'Precalculus',title:'Think in Waves',hash:'precalculus',count:4,description:'Change a sine curve and compare its amplitude with its period.'},
 ac01:{name:'Game Theory',title:'Think in Choices',hash:'game-theory',count:15,foundation:true,description:'Compare a good shared outcome with each player’s incentive to change their own move.'},
 geometry:{name:'Geometry',title:'Think in Shapes',hash:'geometry',count:4,description:'Keep a rectangle’s perimeter fixed and investigate what can happen to its area.'},
 'algebra-2':{name:'Algebra II',title:'Think in Growth',hash:'algebra2',count:4,description:'Compare changing differences with a fixed multiplier in an exponential model.'}
};
const copy={en:{back:'Back to subjects',title:'Test your understanding',intro:'Choose how you want to explore. Both routes leave room for your own reasoning.',idea:'01 / FOLLOW AN IDEA',problems:'02 / WORK THROUGH THE QUESTIONS','voice-note':'About 5–8 minutes · English only. Optional English speech-to-text with student review. Example follow-ups are scripted; explanations are not automatically assessed.',explore:'Explore the model & explain','original-description':'Continue with the existing subject check. Keep your calculations and explanations in its original learning record.','original-note':'Your earlier answers, saved checks and reports remain available.','original-start':'Start the original check',limits:'These activities collect evidence for reflection. They do not certify mastery. Written notes stay in this browser when saving is available.'}};
const params=new URLSearchParams(location.search),id=Object.hasOwn(subjects,params.get('module'))?params.get('module'):'ab01',cfg=subjects[id];
function render(){
 document.querySelectorAll('[data-copy]').forEach(e=>e.textContent=copy.en[e.dataset.copy]);document.querySelector('#subject-caption').textContent='QUIDENCE / '+cfg.name.toUpperCase();document.querySelector('#activity-title').textContent=cfg.title;document.querySelector('#activity-description').textContent=cfg.description;document.querySelector('#original-title').textContent='Work through '+cfg.count+' '+(cfg.foundation?'questions':'problems');
 document.querySelector('#dialogue-route').removeAttribute('aria-disabled');document.querySelector('#original-route').removeAttribute('aria-disabled');document.documentElement.dataset.checkModule=id;
 document.querySelector('#dialogue-route').href='../explain/?lang=en#'+cfg.hash;document.querySelector('#original-route').href='../'+(cfg.foundation?'foundations':'diagnostics')+'/?module='+id+'&v='+document.querySelector('main').dataset[cfg.foundation?'foundationVersion':'diagnosticVersion'];document.querySelector('#back-subject').href='../?view=courses#subject-'+id;
 const nav=document.querySelector('#check-subjects');nav.setAttribute('aria-label','Choose a subject');nav.replaceChildren();for(const [key,s]of Object.entries(subjects)){const a=document.createElement('a');a.href='?module='+key;a.textContent=s.name;if(key===id)a.setAttribute('aria-current','page');nav.append(a);}
}
render();
})();
