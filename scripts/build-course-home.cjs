'use strict';
const fs=require('node:fs'),path=require('node:path'),{GROUPS,COURSES}=require('../assets/course-catalog.js');
const root=path.join(__dirname,'..'),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(id,c){
 const challenge=c.challenge?`<a class="challenge-link" href="${c.challenge}">Test your understanding · ${c.challengeCount} ${id==='ac01'?'questions':'problems'} →</a>`:'';
 const foundation=c.foundation&&c.foundation!==c.challenge?`<a class="foundation-link" href="${c.foundation}">${esc(c.foundationCardLabel||'Check foundations · 15 questions →')}</a>`:'';
 // A missing activity gets a short note in its place, so Classic's aligned card rows have no unexplained gaps.
 const unavailable=c.projectOnly?['course','<strong>Not available yet</strong><ul><li>Lessons</li><li>Foundation check</li><li>Understanding check</li><li>Intuition Lab activity</li></ul>']:!c.foundation?['foundation','Foundation check: not available yet']:!c.challenge?['check','Understanding check: not available yet']:null;
 const project=c.project&&!c.projectOnly?`<a class="project-link" href="${c.project}">${c.projectLabel?esc(c.projectLabel):c.projectCount===2?'Explore two field projects →':'Explore '+c.projectCount+' proof projects →'}</a>`:'';
 return`<article class="subject-card ${c.group==='school'?'school':({af01:'precalculus',ad01:'calculus',ae01:'statistics',ab01:'linear',ac01:'game','physics-1':'physics','physics-2':'physics'}[id]||'')}" data-subject="${id}" data-course-state="${c.planned?'planned':'available'}"><div class="card-top"><span class="topic-label">${esc(c.title.toUpperCase())}</span><span class="version">${c.planned?'Planned':esc(c.projectOnly?'Guided projects':'Introductory activities')}</span></div><img class="subject-picture" src="assets/illustrations/${c.illustration}.svg" alt="${esc(c.title)} illustration" width="320" height="164"><h3>${esc(c.title)}</h3>${c.badge?`<span class="course-bridge-label">${esc(c.badge)}</span>`:''}<p>${esc(c.description)}</p><a class="subject-link" href="${c.course}">${c.planned?'View course outline':c.projectOnly?'Explore coordinate projects':'Start '+esc(c.title)} <span aria-hidden="true">→</span></a>${foundation||challenge}<details class="card-more" open><summary>More activities &amp; scope</summary>${foundation?challenge:''}${project}${c.intuition?`<a class="intuition-link" data-no-translate href="${c.intuition}">Test your intuition →</a>`:''}${unavailable?`<div class="availability-note" data-unavailable="${unavailable[0]}">${unavailable[1]}</div>`:''}<p class="scope-note">${esc(c.scope)}</p></details></article>`;
}
const LEVELS=[
 {id:'middle',title:'Middle School',courses:['pre-algebra']},
 {id:'high',title:'High School',courses:['algebra-1','geometry','algebra-2','af01','coordinate-geometry','physics-1','physics-2']},
 {id:'college',title:'College Level',courses:['ad01','ae01','ab01','number-theory','ac01']}
];
function replaceRegion(html,name,content){
 const start='<!-- '+name+'_START -->',end='<!-- '+name+'_END -->';
 const a=html.indexOf(start),b=html.indexOf(end);
 if(a<0||b<a)throw Error('Homepage region is missing: '+name);
 return html.slice(0,a+start.length)+'\n'+content+'\n'+html.slice(b);
}
function build(){
 const file=path.join(root,'index.html');let html=fs.readFileSync(file,'utf8');
 const choices=GROUPS.map(group=>`<div class="learning-course-group"><p class="choice-group-label">${esc(group.title)}</p><div class="learning-subject-buttons" role="group" aria-label="${esc(group.title)}">${Object.entries(COURSES).filter(([,course])=>course.group===group.id&&!course.planned).map(([id,course])=>`<button type="button" data-learning-subject="${id}" aria-pressed="${id==='pre-algebra'}"${id.startsWith('physics-')?' data-compact-physics data-no-translate':''}>${esc(course.title)}</button>`).join('')}</div></div>`).join('');
 html=replaceRegion(html,'SUBJECT_CHOICES',choices);
 html=replaceRegion(html,'REQUEST_SUBJECTS',Object.entries(COURSES).map(([id,c])=>`<option value="${id}">${esc(c.title)}</option>`).join(''));
 const cards=LEVELS.map(level=>`<section class="catalogue-group" aria-labelledby="${level.id}-heading"><div class="group-heading"><h2 id="${level.id}-heading">${esc(level.title)}</h2></div><div class="subject-grid" aria-label="${esc(level.title)} courses">${level.courses.map(id=>card(id,COURSES[id])).join('\n')}</div></section>`).join('\n');
 html=replaceRegion(html,'COURSE_CARDS',cards+'<p class="catalogue-scope">Eleven mathematics courses and two physics foundations courses · 56 diagnostic problems, 20 field projects, two Coordinate Geometry projects, 10 Number Theory proof projects, two Game Theory projects and one case study, and separate 15-question foundation checks in nine tracks. Coordinate Geometry and Number Theory keep separate project notebooks; explanations and proofs remain pending review.</p><p class="closing-note">You can start with any course. This choice does not assign you a level.</p>');
 fs.writeFileSync(file,html);
}
function buildVersioned(){build();require('./build-seo.cjs').buildSEO();require('./version-activity-assets.cjs').versionActivities();require('./build-seo.cjs').buildSEO();}
if(require.main===module)buildVersioned();module.exports={build:buildVersioned,card};
