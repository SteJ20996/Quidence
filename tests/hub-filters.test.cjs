'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const F=require('../assets/hub-filters.js'),Element=require('./foundation-dom.cjs');
const ids=Object.keys(F.SUBJECTS);
test('both selectors intersect across every stage and direction, with overlapping stage memberships',()=>{
 const expected={all:{all:ids,foundational:['aa01','ae01','af01'],advanced:['ab01','ac01','ad01']},middle:{all:['aa01','ae01'],foundational:['aa01','ae01'],advanced:[]},high:{all:ids,foundational:['aa01','ae01','af01'],advanced:['ab01','ac01','ad01']},college:{all:['ab01','ac01','ad01','ae01','af01'],foundational:['ae01','af01'],advanced:['ab01','ac01','ad01']}};
 for(const[stage,directions]of Object.entries(expected))for(const[direction,wanted]of Object.entries(directions))assert.deepEqual(ids.filter(id=>F.matches(id,{stage,direction})),wanted);
 assert.equal(F.matches('unknown',{stage:'all',direction:'all'}),false);
});
test('URL filters recover safely, clear All, and preserve unrelated parameters',()=>{
 assert.deepEqual(F.fromSearch('?stage=college&direction=foundational'),{stage:'college',direction:'foundational'});
 assert.deepEqual(F.fromSearch('?stage=__proto__&direction=invalid'),{stage:'all',direction:'all'});
 const p=new URLSearchParams(F.toSearch('?stage=high&direction=advanced&ref=teacher',{stage:'all',direction:'all'}));assert.equal(p.get('ref'),'teacher');assert.equal(p.has('stage'),false);assert.equal(p.has('direction'),false);
 assert.equal(F.toSearch('',{stage:'middle',direction:'advanced'}),'stage=middle&direction=advanced');
});
function harness(href='https://example.test/index.html?ref=teacher#subjects',denyHistory=false){
 const host=new Element('div');host.innerHTML=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const document={getElementById:id=>host.querySelector('#'+id),querySelectorAll:s=>host.querySelectorAll(s)},listeners={},window={location:new URL(href),history:{state:{keep:true},replaceState(state,unused,url){if(denyHistory)throw Error('disabled');this.state=state;window.location=new URL(url,window.location);}},addEventListener:(type,fn)=>listeners[type]=fn};
 F.mount(document,window);
 return{host,document,window,listeners,visible:()=>host.querySelectorAll('[data-subject]').filter(x=>!x.hidden).map(x=>x.dataset.subject),select(stage,direction){document.getElementById('filter-stage').value=stage;document.getElementById('filter-direction').value=direction;document.getElementById('filter-stage').events.change();}};
}
test('actual homepage controls hide cards, show empty guidance, reset, and restore shared URLs without touching storage',()=>{
 const h=harness();assert.deepEqual(h.visible(),ids);assert.equal(h.document.getElementById('subject-filters').hidden,false);assert.equal(h.document.getElementById('filter-reset').disabled,true);
 h.select('college','foundational');assert.deepEqual(h.visible(),['ae01','af01']);assert.equal(h.window.location.search,'?ref=teacher&stage=college&direction=foundational');assert.equal(h.window.location.hash,'#subjects');assert.match(h.document.getElementById('filter-status').textContent,/Showing 2 of 6/);
 assert.deepEqual(harness(h.window.location.href).visible(),['ae01','af01']);h.select('middle','advanced');assert.deepEqual(h.visible(),[]);assert.equal(h.document.getElementById('filter-empty').hidden,false);h.document.getElementById('filter-reset').events.click();assert.deepEqual(h.visible(),ids);assert.equal(h.document.getElementById('filter-empty').hidden,true);assert.equal(h.window.location.search,'?ref=teacher');assert.equal(h.document.getElementById('filter-stage').focused,true);
 h.window.location=new URL('https://example.test/?stage=high&direction=advanced');h.listeners.popstate();assert.deepEqual(h.visible(),['ab01','ac01','ad01']);
 assert.deepEqual(harness('https://example.test/?stage=middle&direction=advanced',true).visible(),[]);
});
test('static page preserves all six entries without JavaScript and card labels match the catalogue',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');assert.equal([...source.matchAll(/class="subject-link"/g)].length,6);assert.equal([...source.matchAll(/data-subject="/g)].length,6);assert.doesNotMatch(source,/<article[^>]*\bhidden\b/);assert.match(source,/id="subject-filters"[^>]*hidden/);
 const h=harness();for(const card of h.host.querySelectorAll('[data-subject]')){const labels=card.querySelector('[data-subject-tags]').innerHTML;assert.match(labels,/school|College/);assert.match(labels,/Foundational math|Advanced math/);}
 assert.match(fs.readFileSync(path.join(__dirname,'../assets/hub.css'),'utf8'),/\[hidden\]\{display:none!important\}/);
});
