'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const F=require('../assets/hub-filters.js'),Element=require('./foundation-dom.cjs');
const ids=Object.keys(F.SUBJECTS),order=Object.keys(require('../assets/course-catalog.js').COURSES);
test('both selectors intersect across every stage and direction, with overlapping stage memberships',()=>{
 const expected={all:{all:ids,foundational:['aa01','ae01','af01'],advanced:['ab01','ad01']},middle:{all:['aa01','ae01'],foundational:['aa01','ae01'],advanced:[]},high:{all:ids,foundational:['aa01','ae01','af01'],advanced:['ab01','ad01']},college:{all:['ab01','ad01','ae01','af01'],foundational:['ae01','af01'],advanced:['ab01','ad01']}};
 for(const[stage,directions]of Object.entries(expected))for(const[direction,wanted]of Object.entries(directions))assert.deepEqual(ids.filter(id=>F.matches(id,{stage,direction})),wanted);
 assert.equal(F.matches('unknown',{stage:'all',direction:'all'}),false);
});
test('URL filters recover safely, clear All, and preserve unrelated parameters',()=>{
 assert.deepEqual(F.fromSearch('?stage=college&direction=foundational'),{stage:'college',direction:'foundational'});
 assert.deepEqual(F.fromSearch('?stage=__proto__&direction=invalid'),{stage:'all',direction:'all'});
 const p=new URLSearchParams(F.toSearch('?stage=high&direction=advanced&ref=teacher',{stage:'all',direction:'all'}));assert.equal(p.get('ref'),'teacher');assert.equal(p.has('stage'),false);assert.equal(p.has('direction'),false);
 assert.equal(F.toSearch('',{stage:'middle',direction:'advanced'}),'stage=middle&direction=advanced');
});
test('homepage temporarily removes filters and keeps separate course starts without a learning request',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.doesNotMatch(source,/id="subject-filters"|id="filter-stage"|id="filter-direction"|src="assets\/hub-filters.js"/);
 assert.match(source,/Tell us what you're looking for/);assert.match(source,/>Optional</);assert.match(source,/No learning request is needed/);
 assert.match(source,/data-home-view="map"/);assert.match(source,/data-home-view="courses"/);assert.match(source,/id="knowledge-map"/);
 assert.match(source,/>Middle School</);assert.match(source,/>High School</);assert.match(source,/>College Level</);assert.match(source,/>Cross-disciplinary Projects</);
 // Fifteen course starts and two cross-disciplinary projects; a learning request names a course, not a project.
 assert.equal([...source.matchAll(/class="subject-link"/g)].length,17);assert.equal([...source.matchAll(/data-learning-subject="/g)].length,15);
 assert.deepEqual([...source.matchAll(/data-subject="([^\"]+)"/g)].map(m=>m[1]).sort(),[...order,...Object.keys(require('../assets/course-catalog.js').CROSS.projects)].sort());
 assert.doesNotMatch(source,/<article[^>]*\bhidden\b/);
});
