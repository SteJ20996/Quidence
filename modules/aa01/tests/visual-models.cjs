const assert=require('node:assert/strict'),{load}=require('./workspace.cjs');
const laps=load();laps.api.goto(2);
assert(laps.q('#lap-diagram').innerHTML.includes('3 equal laps'));
assert(laps.q('#lap-diagram').innerHTML.includes('not different track sizes'));
assert(!laps.q('#lap-diagram').innerHTML.includes('2.5 min'));
// A lap count must never imply a larger track or a longer lap.
for(const n of [1,2,3,5]){
  laps.q(`[data-laps="${n}"]`).click();
  const circles=[...laps.q('#lap-diagram').innerHTML.matchAll(/<circle data-lap-ring="\d+" cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)];
  assert.equal(circles.length,n);assert(circles.every(c=>Number(c[3])===98));
  const centers=circles.map(c=>[Number(c[1]),Number(c[2])]);
  assert(Math.max(...centers.map(c=>c[0]))-Math.min(...centers.map(c=>c[0]))<=24);
  assert(Math.max(...centers.map(c=>c[1]))-Math.min(...centers.map(c=>c[1]))<=12);
}
laps.q('[data-laps="3"]').click();
laps.input('one','3');laps.input('two','6');laps.input('five','15');laps.input('rate','3');laps.q('#submit').click();
assert.equal(laps.api.state.records.C3.score.correct,false);assert.equal(laps.api.state.records.C3.attempts[0].hintsShown,0);assert(!laps.q('[data-visual-help]').disabled);
laps.q('[data-optional-visual="lap-model"]').click();laps.q('[data-visual-help]').click();const r=laps.api.state.records.C3;
assert.equal(r.complete,null);assert.equal(r.hints.length,2);assert.equal(r.visualHelp['lap-time'].attemptsBeforeHelp,1);assert.equal(r.visualHelp['lap-time'].answerBeforeHelp.one,3);
assert.equal(laps.api.collect().one,3);assert(!laps.q('[data-n="one"]').disabled);assert(laps.q('#lap-clue').innerHTML.includes('7.5 ÷ 3 = 2.5'));assert(laps.q('#lap-diagram').innerHTML.includes('2.5 min'));
laps.q('[data-laps="5"]').click();assert.equal((laps.q('#lap-diagram').innerHTML.match(/data-lap-ring=/g)??[]).length,5);assert(laps.q('#lap-time-groups').innerHTML.includes('Total: 12.5 min'));assert.equal(laps.api.collect().five,15);
for(const [k,v]of Object.entries({one:2.5,two:5,five:12.5,rate:2.5}))laps.input(k,v);laps.q('#submit').click();
assert.equal(r.attempts.length,2);assert.equal(r.attempts[0].score.correct,false);assert.equal(r.attempts[1].score.correct,true);assert.equal(r.attempts[1].hintsShown,2);
const e=laps.api.state.events.at(-1);assert.equal(e.support.visual_help['lap-time'].attemptsBeforeHelp,1);assert.equal(e.support.given_representation,'equal_lap_schematic');assert(e.objective_components.every(c=>c.support_level==='hinted'));assert.equal(e.support.visual_state.lap_count,5);
laps.q('#snapshot').click();assert(laps.app.innerHTML.includes('A correct revision after a visual clue'));assert(laps.app.innerHTML.includes('Before visual support'));assert(laps.app.innerHTML.includes('later result is supported evidence'));
laps.q('#return-work').click();assert.equal(laps.api.collect().one,2.5);assert.equal(laps.q('[data-visual-help]').disabled,true);assert(laps.q('#lap-time-groups').innerHTML.includes('12.5'));
const area=load();area.api.goto(4);assert(area.q('#rectangle-diagram').innerHTML.includes('height 3 and length x plus 2'));assert(!area.q('#rectangle-diagram').innerHTML.includes('3 × 2'));assert(area.q('[data-area-control]').hidden);
const initial=area.q('#rectangle-diagram').innerHTML;
assert(initial.indexOf('data-area-stage="whole"')<initial.indexOf('data-area-stage="partition"'));
assert(initial.indexOf('data-area-stage="partition"')<initial.indexOf('data-area-stage="separate"'));
assert.equal((initial.match(/class="area-transition"/g)??[]).length,2);
const pieces=[...initial.matchAll(/<rect data-area-piece="(variable|constant)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)];
assert.equal(pieces.length,2);assert.equal(pieces[0][5],pieces[1][5]);
assert(Number(pieces[1][2])>Number(pieces[0][2])+Number(pieces[0][4]));
assert(initial.includes('Both pieces have height 3; their widths are x and 2.'));
area.q('[data-optional-visual="area-model"]').click();area.choose('cardA','different');area.choose('cardB','same');area.q('[data-visual-help]').click();const a=area.api.state.records.C5;
assert.equal(a.visualHelp['rectangle-split'].attemptsBeforeHelp,0);assert.equal(a.visualHelp['rectangle-split'].answerBeforeHelp.cardA,'different');assert.equal(area.api.collect().cardA,'different');assert(!area.q('[data-area-control]').hidden);assert(area.q('#rectangle-diagram').innerHTML.includes('3 × 2'));assert(area.q('#rectangle-equation').innerHTML.includes('3x + 3 × 2'));
assert(area.q('#rectangle-equation').innerHTML.includes('3 × 3 + 2 × 3 = 9 + 6 = 15'));
const slider=area.q('[data-area-x]');slider.value='6';slider.fire('input');assert.equal(a.areaX,6);assert(area.q('#rectangle-diagram').innerHTML.includes('Areas are 3x=18 and 3 times 2=6'));assert(area.q('#rectangle-equation').innerHTML.includes('18 + 6 = 24'));assert.equal(area.api.collect().cardB,'same');
slider.value='1';slider.fire('input');assert(area.q('#rectangle-equation').innerHTML.includes('3 + 6 = 9'));slider.value='-2';slider.fire('input');assert.equal(a.areaX,1);
area.choose('cardA','same');area.choose('cardB','different');area.q('#submit').click();assert.equal(a.score.correct,true);assert(!slider.disabled);slider.value='5';slider.fire('input');assert.equal(a.complete!==null,true);assert.equal(a.score.correct,true);
assert.equal(area.api.state.events.at(-1).support.given_representation,'three_stage_rectangle_area_model');
area.api.goto(4);assert.equal(area.api.collect().cardA,'same');assert.equal(a.areaX,5);assert.equal(a.hints.length,2);area.q('#snapshot').click();assert(area.app.innerHTML.includes('No unassisted submitted result was collected on this item.'));
// SVG bounds at both x extremes and all lap views are finite. All numeric identities use the same fixed part.
for(const x of [1,2,3,4,5,6]){area.api.goto(4);const el=area.q('[data-area-x]');el.value=String(x);el.fire('input');const svg=area.q('#rectangle-diagram').innerHTML;assert(!/NaN|Infinity/.test(svg));assert(svg.includes(`3x=${3*x}`));assert(svg.includes('3 times 2=6'));assert(svg.includes('width="84" height="126"'));
  const wholes=[...svg.matchAll(/<rect data-area-whole="" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)];
  const parts=[...svg.matchAll(/<rect data-area-piece="(?:variable|constant)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)];
  assert.equal(wholes.length,2);assert.equal(wholes[0][3],wholes[1][3]);assert.equal(wholes[0][4],wholes[1][4]);
  assert.equal(Number(wholes[0][3])*Number(wholes[0][4]),parts.reduce((sum,p)=>sum+Number(p[3])*Number(p[4]),0));
}
for(const [id,height,constant]of [['FE',4,2]]){
  const html=area.api.form(id);assert(html.includes('data-area-stage="whole"'));assert(html.includes('data-area-stage="partition"'));assert(html.includes('data-area-stage="separate"'));
  assert(html.includes(`Both pieces have height ${height}; their widths are x and ${constant}.`));
  assert(!html.includes(`>${height} × ${constant}</text>`));
}
console.log(JSON.stringify({result:'passed',scope:'mathematical SVG and state checks, not browser layout',checks:['equal repeated laps, not unequal tracks','lap count and time groups','original submission retained','visual support snapshots','positive x split area identity','constant piece remains 6','clue never auto-fills answers','report distinguishes aided results','view/slider state persists']}));

