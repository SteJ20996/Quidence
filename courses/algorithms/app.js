'use strict';
(()=>{
const A=window.QuidenceAlgorithms,KEY='quidence:algorithms:v1',L=A.L;
const backing=()=>window.QuidenceStorage||window.localStorage;
const storage={getItem:k=>backing().getItem(k),setItem:(k,v)=>backing().setItem(k,v),removeItem:k=>backing().removeItem(k)};
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// The page is in English only; text is held as {en}.
const lc=()=>'en';
const tx=v=>v&&typeof v==='object'&&!Array.isArray(v)?(v[lc()]??v.en??''):String(v??'');
const fmt=(s,v={})=>String(s).replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m);
const plain=html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent;};
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const LANGS=['python','java','matlab'],LANG_NAMES={python:'Python',java:'Java',matlab:'MATLAB'};

/* ---------------- Interface text ---------------- */
const U={
 workbench:L('Algorithm workbench'),
 mapTitle:L('Route map'),
 mapNote:L('All sixteen algorithms are open, from middle school to university. A gold outline marks the suggested next step.'),
 rangesTitle:L('Ranges waiting on the stack (top first)'),
 helpDp:L('1 to 4 different coin values from 1 to 20, and an amount from 1 to 20.'),
 errDpCoins:L('Enter 1 to 4 different whole numbers from 1 to 20 for the coins.'),errDpAmount:L('The amount must be a whole number from 1 to 20.'),
 dpLegend:L('best[v] is the fewest coins known for the amount v, and last[v] is the last coin of that way. ∞ means no way is known yet. The gold column is v; the outlined column is v − c.'),
 dpTable:L('Table for amounts 0 to {n}'),
 roadsGroup:L('Road lengths'),helpRoads:L('Each road’s length: a whole number from 1 to 20.'),errRoads:L('Every road needs a length: a whole number from 1 to 20.'),
 roadLabel:L('Length of road {name}'),
 distLegend:L('Each town shows dist, its shortest distance from A found so far. Filled towns are finished, the gold town is c, the gold road is being checked, and the coloured roads lead back to A through prev.'),
 treeLegend:L('Green roads are kept, dashed roads are skipped, and the gold road is being checked.'),
 groupsTitle:L('Groups'),orderTitle:L('Roads, shortest first'),
 graphLabel:L('Map of towns A to F. Roads and lengths: {roads}.'),
 graphNames:L('Map of towns A to F with the roads AB, AC, BC, BD, CD, CE, DE, DF and EF.'),
 helpSubset:L('2 to 6 whole numbers from 1 to 99, and a target from 1 to 600.'),
 errSubset:L('Enter 2 to 6 whole numbers from 1 to 99, separated by commas.'),errSubsetTarget:L('The target must be a whole number from 1 to 600.'),
 subsetTarget:L('Target sum (target)'),
 bitNote:L('Under each number is its bit of mask. In the binary form of mask, bit 0 is the rightmost digit.'),
 matlabTowns:L('MATLAB numbers the towns 1 to 6 for A to F.'),
 helpSorted:L('A sorted list of 2 to 12 whole numbers between −999 and 999. An unsorted list also runs, so you can see what goes wrong.'),
 warnUnsorted:L('This list is not sorted. Binary search will run anyway: watch whether it still finds the target.'),
 disks:L('Disks'),helpDisks:L('1 to 5 disks. Each extra disk doubles the moves and adds one.'),
 editWalls:L('Edit walls'),clearWalls:L('Clear walls'),defaultMaze:L('Starting maze'),randomMaze:L('Random maze'),
 helpGrid:L('Choose “Edit walls”, then click cells to add or remove walls. S and G stay in their corners.'),
 cellLabel:L('Cell {name}'),wall:L('wall'),open:L('open'),mud:L('mud'),
 mazeLegend:L('Cells are named (row, column), counting from 0 at the top left. Light cells are marked. Outlined cells wait in the frontier. The gold cell is the one being handled; green cells form the path.'),
 mazeSummary:L('Maze of 5 rows and 7 columns, S at the top left and G at the bottom right. {walls} walls, {marked} cells marked.'),
 queueTitle:L('queue (front first)'),stackTop:L('stack (top first)'),
 callStack:L('Call stack (newest on top)'),stackEmpty:L('No call is running.'),lineN:L('line {n}'),
 pegsLabel:L('Peg A: {a}. Peg B: {b}. Peg C: {c}.'),empty:L('empty'),
 coinsLabel:L('Coins'),amountLabel:L('Amount'),takenTitle:L('Coins taken'),
 helpCoins:L('1 to 5 different coin values from 1 to 100, and an amount from 1 to 99.'),
 errCoins:L('Enter 1 to 5 different whole numbers from 1 to 100 for the coins.'),errAmount:L('The amount must be a whole number from 1 to 99.'),
 mapScroll:L('Route map. Scroll sideways to see all of it.'),
 openAlg:L('Open #{n} {name}'),planned:L('planned'),
 tabs:L('Algorithms in this part'),
 list:L('List'),target:L('Number to find (target)'),
 use:L('Use this input'),random:L('Random input'),
 helpList:L('2 to 12 whole numbers between −999 and 999, separated by commas.'),
 helpPair:L('Two whole numbers from 1 to 999,999.'),
 errList:L('Enter 2 to 12 whole numbers between −999 and 999, separated by commas.'),
 errTarget:L('The target must be a whole number between −999 and 999.'),
 errPair:L('Enter two whole numbers from 1 to 999,999.'),
 chain:L('Logic chain'),chainNote:L('The flowchart and the steps move together.'),
 flowLabel:L('Flowchart of {name}'),steps:L('Steps'),
 pickNote:L('Choose a box in the flowchart: the one you think runs the most times on this list.'),
 data:L('Data'),begin:L('Press <strong>Next step</strong> to begin.'),
 back:L('← Back'),next:L('Next step →'),play:L('Play'),pause:L('Pause'),restart:L('Restart'),
 force:L('Predict this step'),skip:L('Skip predictions in this section'),
 tally:L('Predictions in #{n}: {m} of {a} matched'),
 predict:L('Predict:'),skipOne:L('Skip this one'),
 matched:L('Your prediction matched.'),missed:L('Not this time.'),
 trace:L('Trace table'),traceEmpty:L('Rows appear as the algorithm runs.'),
 code:L('The same logic in code'),langGroup:L('Programming language'),
 matlabNote:L('MATLAB counts positions from 1, so its positions are one higher than the ones shown above.'),
 teachOpen:L('Teach me to write it'),teachClose:L('Close the guide'),
 guide:L('Guide · line {i} of {n}'),logic:L('Logic:'),
 newCode:L('The new code is highlighted above.'),
 prevLine:L('← Previous line'),nextLine:L('Next line →'),
 codeNote:L('The code is shown, not run: follow it line by line with the steps above.'),
 think:L('Think further'),
 kindIdea:L('In your own words'),kindBreak:L('Break it and predict'),matlabGrid:L('MATLAB numbers the cells from 1, down each column; the trace above names them (row, column) from 0.'),kindCounter:L('Find a counterexample'),kindBottle:L('Find the bottleneck'),kindImprove:L('Propose an improvement'),kindCost:L('Predict the cost'),
 saved:L('evidence saved'),
 ideaNote:L('Not scored. Your words are kept exactly as you write them.'),
 ideaSaved:L('Kept in this browser exactly as written · not scored'),
 ideaPlaceholder:L('For example: first I would look at…'),
 claim:L('Claim:'),checkEx:L('Check my example'),
 cplxTitle:L('How does it grow?'),yes:L('Yes.'),notQuite:L('Not quite.'),again:L('Try again'),
 recTitle:L('Suggested next'),recBasis:L('Based on what you did, not on a score'),
 evidence:L('Evidence from this section'),nothing:L('Nothing yet: make predictions or try a challenge.'),
 others:L('Other good choices'),open:L('Open'),openN:L('Open #{n}'),
 plannedHigh:L('planned for the high-school part'),plannedUni:L('planned for the university part'),
 anyNote:L('You can open any open algorithm on the route map. This suggestion only explains a good next step.'),
 review:L('Review my work'),
 statusIdle:L('Your work stays on this device.'),statusSaved:L('Saved on this device.'),
 statusNoSave:L('Could not save in this browser. Export your session to keep a copy.'),
 statusConflict:L('Saved work changed in another tab. Export your current notes before reloading; new work is not saved.'),
 statusUnreadable:L('The saved record could not be read. Export your current notes and the saved original before resetting; new work is not saved.'),
 sessionTitle:L('Your algorithms session'),
 sessionLead:L('This is a record of what you did in this browser. Predictions and challenge results describe actions, not ability. Your own words are kept exactly as written.'),
 statPred:L('Predictions matched'),statEvidence:L('Challenges with evidence'),statIdeas:L('Ideas in your own words'),
 ofN:L('{m} of {a}'),
 noWork:L('Nothing yet. Step through an algorithm or try a challenge, then come back here.'),
 yourIdea:L('Your idea'),history:L('Check history'),
 historyNote:L('Each entry keeps the input you gave at that time.'),
 export:L('Export session notes'),exportCurrent:L('Export current notes'),exportOriginal:L('Export saved original separately'),
 reset:L('Reset Algorithms'),resetTitle:L('Reset Algorithms?'),
 resetLead:L('This clears only your Algorithms work: predictions, challenge results, ideas and history. You can export your current notes and the saved original first.'),
 resetConfirm:L('Clear Algorithms work'),keep:L('Keep my work'),
 cleared:L('Your Algorithms work has been cleared.'),
 resetChanged:L('The saved original changed. Reload before resetting.'),
 resetFailed:L('The original could not be cleared. Your work is kept.'),
 exported:L('Your current session notes have been exported.'),
 exportedOriginal:L('The previously saved original has been exported separately.'),
 downloadFailed:L('The download could not start. Your current notes are still visible.'),
 close:L('Close dialog'),
 mdTitle:L('Algorithms'),
 mdLead:L('Work from this browser. Predictions and challenge results describe actions, not ability. Ideas are quoted exactly as written.'),
 mdUnsaved:L('These notes include current work that could not be saved in this browser. The previously saved record is kept separately.'),
 mdPred:L('Predictions: {m} of {a} matched'),mdInput:L('Input'),
 suggested:L('Suggested next: {t}'),
 kinds:{breaks:L('Break it on purpose'),counter:L('Counterexample'),built:L('Improvement'),improve:L('Improvement'),bottle:L('Bottleneck'),cplx:L('Cost prediction'),why:L('Reason for the counterexample')}
};
const u=(k,v)=>fmt(tx(U[k]),v);

/* ---------------- Saved record ---------------- */
const blank=()=>({version:1,alg:'find-max',lang:'python',skip:{},pred:{},evidence:{},ideas:{},builder:{cond:1,slots:[0,0,0],hint:0},improveOpts:{early:false,skip2:false,back:false},log:[]});
let state=blank(),saveTimer,toastTimer,storeAvailable=true,blockedOriginal=null,lastStored=null,saveBlocked=false,blockedReason='unreadable',unsavedWork=false,statusKey='statusIdle';
const isObj=x=>!!x&&typeof x==='object'&&!Array.isArray(x),isInt=Number.isInteger,isNum=x=>typeof x==='number'&&Number.isFinite(x),isStr=x=>typeof x==='string',isBool=x=>typeof x==='boolean';
// Records saved before the site became English-only also hold Spanish; they stay readable and unchanged.
const isLText=x=>isObj(x)&&isStr(x.en)&&(x.es===undefined||isStr(x.es));
const validRows=r=>Array.isArray(r)&&r.every(x=>Array.isArray(x)&&x.length===4&&isStr(x[0])&&x.slice(1).every(isInt));
function validEvidence(e,key){if(!isObj(e))return false;
 for(const [k,v] of Object.entries(e)){if(!isObj(v))return false;
  if(k==='counter'){if(!['counter','holds','bad'].includes(v.status)||!isObj(v.input)||!Object.values(v.input).every(isStr)||!(v.why===null||isInt(v.why))||!isObj(v.data)||!Object.values(v.data).every(x=>isNum(x)||isBool(x)||isStr(x)))return false;}
  else if(k==='built'){if(!['passed','total','worst','linWorst','avg','linAvg'].every(f=>isNum(v[f]))||!isBool(v.halving)||!(v.hints===undefined||isInt(v.hints))||!(v.fail===null||isObj(v.fail)&&Array.isArray(v.fail.list)&&v.fail.list.every(isInt)&&isInt(v.fail.target)&&isInt(v.fail.want)&&(v.fail.got===null||isInt(v.fail.got))&&(v.fail.error===null||isStr(v.fail.error))))return false;}
  else if(k==='bottle'){if(!BOX[key]||!Object.hasOwn(BOX[key],v.node)||!isObj(v.counts)||!Object.keys(BOX[key]).every(n=>isInt(v.counts[n]))||!isBool(v.ok)||!isStr(v.verdict)||!isObj(v.counts)||!Object.values(v.counts).every(isInt)||!Array.isArray(v.list)||!v.list.every(isInt)||!(v.inputText===undefined||isStr(v.inputText)))return false;}
  else if(k==='breaks'){const B=A.BREAKS[key];if(!B||!Object.entries(v).every(([c,r])=>B.changes.includes(c)&&isObj(r)&&B.outcomes.includes(r.pred)&&B.outcomes.includes(r.actual)))return false;}
  else if(k==='improve'){const I=IMPROVE[key];if(!I||I.kind!==v.kind)return false;if(I.options&&!(isInt(v.v)&&v.v>=0&&v.v<I.options.length))return false;if(I.names&&!(Array.isArray(v.rows)&&Object.keys(I.names).every(n=>v.rows.some(r=>Array.isArray(r)&&r[0]===n))))return false;
   if(v.kind==='bubble'){if(!isObj(v.o)||!['early','skip2','back'].every(f=>isBool(v.o[f]))||!validRows(v.rows)||!isBool(v.correct)||!isBool(v.early))return false;}
   else if(v.kind==='minmax'){if(![0,1,2].includes(v.v)||!validRows(v.rows)||!isBool(v.correct)||!isInt(v.worst))return false;}
   else if(['first','mergeskip','dfsimp','change','pivot','dijkstop','kstop','prune'].includes(v.kind)){if(![0,1,2,3].includes(v.v)||!validRows(v.rows)||!isBool(v.correct))return false;}
   else if(v.kind==='euclid'){if(![0,1,2,3].includes(v.v)||!['ok','total','base','mine'].every(f=>isNum(v[f]))||!(v.fail===null||isObj(v.fail)&&['a','b','want'].every(f=>isInt(v.fail[f]))&&(v.fail.got===null||isInt(v.fail.got))))return false;}
   else return false;}
  else if(k==='cplx'){if(!isBool(v.ok)||!isInt(v.choice))return false;}
  else return false;}
 return true;}
const known=(o,check)=>isObj(o)&&Object.entries(o).every(([k,v])=>A.ORDER.includes(k)&&check(v,k));
function validRecord(d){return isObj(d)&&d.version===1&&A.ORDER.includes(d.alg)&&LANGS.includes(d.lang)&&known(d.skip,isBool)&&known(d.pred,v=>isObj(v)&&isInt(v.asked)&&isInt(v.matched)&&v.matched>=0&&v.matched<=v.asked)&&known(d.evidence,validEvidence)&&known(d.ideas,isStr)
 &&isObj(d.builder)&&[0,1,2].includes(d.builder.cond)&&Array.isArray(d.builder.slots)&&d.builder.slots.length===3&&d.builder.slots.every(s=>isInt(s)&&s>=0&&s<6)&&isInt(d.builder.hint)&&d.builder.hint>=0&&d.builder.hint<=4
 &&isObj(d.improveOpts)&&['early','skip2','back'].every(k=>isBool(d.improveOpts[k]))&&Array.isArray(d.log)&&d.log.every(x=>isObj(x)&&isStr(x.time)&&A.ORDER.includes(x.alg)&&isStr(x.kind)&&(isStr(x.input)||isLText(x.input))&&isLText(x.summary));}
function status(k){statusKey=k;const el=$('save-status');if(el)el.textContent=u(k);}
function blockedKey(){return blockedReason==='conflict'?'statusConflict':'statusUnreadable';}
function persist(){clearTimeout(saveTimer);if(saveBlocked){unsavedWork=true;status(blockedKey());return;}
 try{const live=storage.getItem(KEY);if(live!==lastStored){blockedOriginal=live;lastStored=live;saveBlocked=true;blockedReason='conflict';unsavedWork=true;status(blockedKey());return;}
  const s=JSON.stringify(state);storage.setItem(KEY,s);lastStored=s;storeAvailable=true;unsavedWork=false;status('statusSaved');}
 catch{storeAvailable=false;unsavedWork=true;status('statusNoSave');}}
function queueSave(){unsavedWork=true;clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);}
function restore(){let raw;try{raw=storage.getItem(KEY);}catch{storeAvailable=false;statusKey='statusNoSave';return;}lastStored=raw;if(raw===null)return;
 try{const d=JSON.parse(raw);if(!validRecord(d))throw Error('Unreadable record');state=d;}catch{blockedOriginal=raw;saveBlocked=true;blockedReason='unreadable';statusKey=blockedKey();}}
const ev=()=>state.evidence[cur.key]||(state.evidence[cur.key]={});
function record(kind,input,summary){state.log.push({time:new Date().toISOString(),alg:cur.key,kind,input:typeof input==='string'?input:{en:String(input.en)},summary});}

/* ---------------- Workbench state ---------------- */
const cur={cardMaze:{},key:'find-max',input:null,events:[],idx:-1,pending:false,feedback:null,forcePredict:false,playing:false,timer:0,teach:-1,pick:false,msg:null};
const alg=()=>A.ALGS[cur.key];
const skipOn=()=>!!state.skip[cur.key];
const tally=()=>state.pred[cur.key]||{asked:0,matched:0};
function defaults(){const d=alg().defaults;if(d.list)return{list:[...d.list],target:d.target};if(d.maze!=null)return{maze:d.maze};if(d.disks)return{disks:d.disks};if(d.coins)return{coins:[...d.coins],amount:d.amount};if(d.roads)return{roads:[...d.roads]};return{a:d.a,b:d.b};}
function build(){cur.events=alg().gen(cur.input.list,cur.input.target,Math.random,[cur.input.a,cur.input.b],cur.input);cur.idx=-1;cur.pending=false;cur.feedback=null;cur.forcePredict=false;}
const step=()=>cur.idx>=0?cur.events[cur.idx]:null;
function openAlg(key,scroll){if(!A.ORDER.includes(key))return;const fromTabs=$('tabs').contains(document.activeElement);stop();state.alg=key;cur.key=key;cur.teach=-1;cur.pick=false;cur.msg=null;cur.editWalls=false;cur.breakMsg=false;cur.breakChange=cur.breakPred=null;cur.input=defaults();build();renderAll();persist();
 if(fromTabs)$('tab-'+key).focus();else if(scroll){$('alg').scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});$('alg-title').focus({preventScroll:true});}}

/* ---------------- Route map ---------------- */
function renderMap(recNum){const pos=Object.fromEntries(A.MAP.nodes.map(([n,name,x,y])=>[n,{x,y}]));
 let s=`<svg viewBox="0 0 920 305" aria-labelledby="map-title"><defs><marker id="mh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="mh"/></marker><marker id="mhl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="mhl"/></marker></defs>`;
 for(const [label,y] of A.MAP.rows)s+=`<text class="maprow" x="10" y="${y-29}">${esc(tx(label))}</text>`;
 for(const [a,b,label] of A.MAP.edges){const p=pos[a],q=pos[b];let x1=p.x,y1=p.y,x2=q.x,y2=q.y;if(y1===y2){x1+=x2>x1?70:-70;x2+=x2>x1?-70:70;}else{y1+=22;y2-=22;}
  const live=A.NUM[a]&&A.NUM[b];s+=`<path class="mapedge${live?' live':''}" d="M${x1} ${y1}L${x2} ${y2}" marker-end="url(#mh${live?'l':''})"/>`;
  if(label)s+=`<text class="mapedgelabel" x="${(x1+x2)/2+6}" y="${(y1+y2)/2+4}">${esc(tx(label))}</text>`;}
 for(const [n,name,x,y] of A.MAP.nodes){const key=A.NUM[n],parts=tx(name).split('\n'),label=parts.join(' ');
  const cls=['mapnode',key?'live':'',key===cur.key?'on':'',n===recNum?'rec':''].filter(Boolean).join(' ');
  const text=parts.length>1?`<text x="${x-40}" y="${y-3}">${esc(parts[0])}</text><text x="${x-40}" y="${y+12}">${esc(parts[1])}</text>`:`<text x="${x-40}" y="${y+5}">${esc(label)}</text>`;
  s+=`<g class="${cls}"${key?` tabindex="0" role="button" data-open="${key}" aria-label="${esc(u('openAlg',{n,name:label}))}"${key===cur.key?' aria-current="true"':''}`:''}><title>#${n} ${esc(label)}${key?'':' ('+esc(u('planned'))+')'}</title><rect x="${x-70}" y="${y-22}" width="140" height="44" rx="8"/><text class="num" x="${x-60}" y="${y+5}">${n}</text>${text}</g>`;}
 $('map').innerHTML=s+'</svg>';}
function renderTabs(){$('tabs').setAttribute('aria-label',u('tabs'));$('tabs').innerHTML=A.ORDER.map(k=>`<button type="button" id="tab-${k}" aria-pressed="${k===cur.key}" data-alg="${k}"><span class="n">#${A.ALGS[k].num}</span>${esc(tx(A.ALGS[k].name))}</button>`).join('');}

/* ---------------- Logic chain ---------------- */
function flowSvg(){const a=alg(),f=a.flow,e=step(),now=e?e.node:null,prev=cur.idx>0?cur.events[cur.idx-1].node:null;
 let s=`<svg viewBox="0 0 ${f.w} ${f.h}" style="--fw:${f.w}px" role="${cur.pick?'group':'img'}" aria-label="${esc(u('flowLabel',{name:tx(a.name)}))}"><defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="fah"/></marker><marker id="fac" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="fahc"/></marker></defs>`;
 for(const [from,to,pts,label,lp,style] of f.edges){const on=prev===from&&(now===to||style==='dash'&&now==='base'&&e&&e.jump);s+=`<path class="fe${on?' cur':''}${style==='dash'?' dash':''}" d="M${pts.map(p=>p.join(' ')).join('L')}" marker-end="url(#fa${on?'c':''})"/>`;if(label)s+=`<text class="fl" x="${lp[0]}" y="${lp[1]}">${esc(tx(label))}</text>`;}
 const chosen=ev().bottle?.node;
 for(const n of f.nodes){const pick=cur.pick&&n.id!=='start',text=tx(n.text);
  const shape=n.kind==='dec'?`<polygon points="${n.x},${n.y-n.h/2} ${n.x+n.w/2},${n.y} ${n.x},${n.y+n.h/2} ${n.x-n.w/2},${n.y}"/>`:`<rect x="${n.x-n.w/2}" y="${n.y-n.h/2}" width="${n.w}" height="${n.h}" rx="${n.kind==='term'?n.h/2:4}"/>`;
  s+=`<g class="fn${n.id===now?' cur':''}${pick?' pick':''}${!cur.pick&&chosen===n.id&&['bubble-sort','insertion-sort'].includes(cur.key)?' chosen':''}" data-node="${n.id}"${pick?` tabindex="0" role="button" aria-label="${esc(text)}"`:''}>${shape}<text x="${n.x}" y="${n.y+1}">${esc(text)}</text></g>`;}
 return s+'</svg>';}
function stepsList(){const e=step();return alg().pseudo[lc()].map((l,i)=>{const on=e&&e.line===i;return `<li class="${on?'cur':''}"${on?' aria-current="step"':''}><span class="ln">${i+1}</span><span class="tx">${esc(l)}</span>${on&&e.chip?`<span class="chip">${esc(tx(e.chip))}</span>`:''}</li>`;}).join('');}

/* ---------------- Data view ---------------- */
function dataView(){const a=alg();if(a.kind==='hanoi')return hanoiView();if(a.kind==='grid')return gridView();if(a.kind==='coins')return coinsView();if(a.kind==='dp')return dpView();if(a.kind==='graph')return graphView();if(a.kind==='subset')return subsetView();
 return `<div class="arr${a.kind==='pair'?' pair':''}">${cellsHtml()}</div>${a.kind==='merge'?outRow():''}${varsHtml()}${a.kind==='quick'?rangesView():''}`;}
function rangesView(){const e=step(),r=e&&e.ranges||[];return `<div class="frontier"><span class="eyebrow">${esc(u('rangesTitle'))}</span>${r.length?r.map(x=>`<span class="var">${esc(x)}</span>`).join(''):'<span class="muted small-print">—</span>'}</div>`;}
function dpView(){const e=step(),coins=e&&e.coins||[...new Set(cur.input.coins)].sort((x,y)=>x-y),amount=cur.input.amount,best=e&&e.best||['0'],last=e&&e.last||[],trail=new Set(e&&e.trail||[]),at=e?e.cur:null,look=e?e.look:null,coin=e?e.coin:null,taken=e&&e.taken||[];
 const col=v=>[v===at?'cur':'',v===look?'look':'',trail.has(v)?'path':''].filter(Boolean).join(' '),cells=(name,vals)=>Array.from({length:amount+1},(_,v)=>`<td class="${col(v)}${name==='best'&&e&&e.fresh&&v===at?' fresh':''}">${esc(vals[v]??'')}</td>`).join('');
 return `<div class="coinset">${coins.map(c=>`<span class="coin${c===coin?' cur':''}">${c}</span>`).join('')}</div><div class="tablewrap dpwrap" tabindex="0" role="region" aria-label="${esc(u('dpTable',{n:amount}))}"><table class="dptable"><thead><tr><th scope="col">v</th>${Array.from({length:amount+1},(_,v)=>`<th scope="col" class="${col(v)}">${v}</th>`).join('')}</tr></thead><tbody><tr><th scope="row">best</th>${cells('best',best)}</tr><tr><th scope="row">last</th>${cells('last',last)}</tr></tbody></table></div>${taken.length?`<div class="taken"><span class="eyebrow">${esc(u('takenTitle'))}</span>${taken.map(c=>`<span class="coin small">${c}</span>`).join('')}</div>`:''}<p class="small-print muted">${esc(u('dpLegend'))}</p>`;}
// The six towns: positions, and where each road's label sits so that it clears the roads and towns.
const TXY=[[50,125],[170,40],[170,210],[330,40],[330,210],[450,125]],RLXY=[[100,72],[100,180],[156,125],[250,27],[266,136],[250,224],[344,125],[400,72],[400,180]];
function graphSvg(o){let s=`<svg viewBox="26 0 448 250" class="gsvg" role="img" aria-label="${esc(o.label)}">`;
 A.ROADS.forEach(([p,q],i)=>{const [x1,y1]=TXY[p],[x2,y2]=TXY[q],has=k=>o[k]&&o[k].includes(i),cls=['road',has('kept')?'kept':'',has('skipped')?'skip':'',has('tree')?'tree':'',has('path')?'path':'',o.look===i?'look':''].filter(Boolean).join(' ');
  s+=`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="rl${o.look===i?' look':''}" x="${RLXY[i][0]}" y="${RLXY[i][1]}">${o.names?A.roadName(i):o.len[i]}</text>`;});
 A.TOWNS.forEach((t,i)=>{const [x,y]=TXY[i],cls=['town',o.fin&&o.fin[i]?'fin':'',o.current===i?'cur':'',o.fresh===i?'fresh':''].filter(Boolean).join(' '),dy=y<125?-27:31;
  s+=`<g class="${cls}"><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y+1}">${t}</text>${o.dist?`<text class="dl" x="${x}" y="${y+dy}">${esc(o.dist[i])}</text>`:''}</g>`;});
 return s+'</svg>';}
function graphView(){const a=alg(),e=step(),len=cur.input.roads,o={len,label:u('graphLabel',{roads:A.ROADS.map((_,i)=>A.roadName(i)+' '+len[i]).join(', ')})};
 if(a.id==='dijkstra'){Object.assign(o,{dist:e?e.dist:A.TOWNS.map(()=>'∞'),fin:e&&e.fin,current:e?e.current:null,look:e?e.look:null,tree:e&&e.tree,path:e&&e.pathRoads,fresh:e?e.fresh:null});
  o.label+=' '+tx(L(`Distances: ${A.TOWNS.map((t,i)=>t+' '+o.dist[i]).join(', ')}.`));
  return `<div class="graph">${graphSvg(o)}</div><p class="small-print muted">${esc(u('distLegend'))}</p>`;}
 const order=e?e.order:A.ROADS.map((_,i)=>i).sort((x,y)=>len[x]-len[y]||x-y),kept=e&&e.kept||[],skipped=e&&e.skipped||[],look=e?e.look:null;Object.assign(o,{kept,skipped,look});
 if(kept.length)o.label+=' '+tx(L(`Kept: ${kept.map(A.roadName).join(', ')}.`));
 return `<div class="graph">${graphSvg(o)}</div><div class="frontier"><span class="eyebrow">${esc(u('groupsTitle'))}</span><span class="var">${esc(e?e.groups:A.TOWNS.map(t=>`{${t}}`).join(' '))}</span></div><div class="frontier roadorder"><span class="eyebrow">${esc(u('orderTitle'))}</span>${order.map(i=>`<span class="var${kept.includes(i)?' kept':skipped.includes(i)?' skip':''}${i===look?' cur':''}">${A.roadName(i)} ${len[i]}</span>`).join('')}</div><p class="small-print muted">${esc(u('treeLegend'))}</p>`;}
function subsetView(){const e=step(),a=cur.input.list,on=new Set(e&&e.on||[]),hit=new Set(e&&e.hit||[]),mask=e?e.mask:null;
 const cells=a.map((v,i)=>`<div class="cell${hit.has(i)?' hit':on.has(i)?' cmp':''}"><span class="ix">${i}</span><span class="v">${esc(v)}</span>${e&&e.on?`<span class="pt">bit ${mask>>i&1}</span>`:''}</div>`).join('');
 const chips=[...(mask!=null?[['mask',`${mask} = ${e.bits}₂`]]:[]),...(e&&e.sum!=null?[['sum(S)',e.sum]]:[]),['target',cur.input.target]];
 return `<div class="arr">${cells}</div><div class="vars">${chips.map(([k,v])=>`<span class="var"><span>${k}</span> = <b>${esc(v)}</b></span>`).join('')}</div><p class="small-print muted">${esc(u('bitNote'))}</p>`;}
function outRow(){const e=step();if(!e||!e.out)return '';return `<div class="outrow"><span class="eyebrow">out</span><div class="arr out">${e.out.length?e.out.map(v=>`<div class="cell">${esc(v)}</div>`).join(''):'<span class="muted small-print">—</span>'}</div></div>`;}
function hanoiView(){const e=step(),N=cur.input.disks,pegs=e&&e.pegs||{A:Array.from({length:N},(_,k)=>N-k),B:[],C:[]},mv=e&&e.moved,stack=e&&e.stack||[],list=p=>pegs[p].length?pegs[p].join(', '):tx(U.empty);
 const peg=p=>`<div class="peg"><div class="disks">${pegs[p].map(d=>`<div class="disk${mv&&mv.disk===d?' moved':''}" style="--w:${28+d*14}%"><span>${d}</span></div>`).join('')}</div><div class="pegbase"></div><span class="peglabel">${p}${mv&&mv.to===p?' ↓':mv&&mv.from===p?' ↑':''}</span></div>`;
 return `<div class="hanoi" role="img" aria-label="${esc(u('pegsLabel',{a:list('A'),b:list('B'),c:list('C')}))}">${['A','B','C'].map(peg).join('')}</div><div class="callstack"><span class="eyebrow">${esc(u('callStack'))}</span>${stack.length?`<ol>${[...stack].reverse().map((f,i)=>`<li${i===0?' class="cur"':''}>hanoi(${f.n}, ${f.from}, ${f.to}, ${f.via}) · ${esc(u('lineN',{n:f.line+1}))}</li>`).join('')}</ol>`:`<p class="muted small-print">${esc(u('stackEmpty'))}</p>`}</div>`;}
function mazeGrid(cells,extra=''){let h=`<div class="maze ${extra}" style="--cols:${A.GC}"><span class="ax"></span>`;for(let c=0;c<A.GC;c++)h+=`<span class="ax">${c}</span>`;for(let r=0;r<A.GR;r++){h+=`<span class="ax">${r}</span>`;for(let c=0;c<A.GC;c++)h+=cells[r*A.GC+c];}return h+'</div>';}
function gridView(){const a=alg(),e=step(),maze=e&&e.maze||A.parseMaze(cur.input.maze),marked=new Set(e&&e.marked||[]),front=e&&e.frontier||[],fset=new Set(front),path=new Set(e&&e.path||[]),at=e?e.current:null,look=e?e.look:null;
 const cells=[...maze].map((ch,i)=>{const cls=['mc',ch==='#'?'wall':ch==='~'?'mud':'',marked.has(i)?'marked':'',fset.has(i)?'front':'',path.has(i)?'path':'',i===at?'cur':'',i===look?'look':''].filter(Boolean).join(' '),label=i===A.START?'S':i===A.GOAL?'G':'';
  return cur.editWalls&&i!==A.START&&i!==A.GOAL?`<button type="button" id="cell-${i}" class="${cls} edit" data-cell="${i}" tabindex="${i===(cur.lastCell??1)?0:-1}" aria-pressed="${ch==='#'}" aria-label="${esc(u('cellLabel',{name:A.cellName(i)}))}"></button>`:`<div class="${cls}">${label}</div>`;});
 const desc=u('mazeSummary',{walls:[...maze].filter(c=>c==='#').length,marked:marked.size})+(at!=null?' '+tx(L(`Current cell ${A.cellName(at)}.`)):'')+(path.size?' '+tx(L(`Path: ${[...path].map(A.cellName).join(', ')}.`)):'');
 return `<div role="${cur.editWalls?'group':'img'}" aria-label="${esc(desc)}">${mazeGrid(cells)}</div><div class="frontier"><span class="eyebrow">${esc(u(a.frontier==='queue'?'queueTitle':'stackTop'))}</span>${front.length?front.map(i=>`<span class="var">${A.cellName(i)}</span>`).join(''):'<span class="muted small-print">—</span>'}</div><p class="small-print muted">${esc(u('mazeLegend'))}</p>`;}
function coinsView(){const e=step(),coins=e&&e.coins||[...new Set(cur.input.coins)].sort((x,y)=>y-x),amount=e?e.amount:cur.input.amount,taken=e&&e.taken||[],coin=e?e.coin:null;
 return `<div class="coinset">${coins.map(c=>`<span class="coin${c===coin?' cur':''}">${c}</span>`).join('')}</div><div class="vars"><span class="var key"><span>amount</span> = <b>${esc(amount)}</b></span></div><div class="taken"><span class="eyebrow">${esc(u('takenTitle'))}</span>${taken.length?taken.map((c,i)=>`<span class="coin small${e&&e.fresh&&i===taken.length-1?' fresh':''}">${c}</span>`).join(''):'<span class="muted small-print">—</span>'}</div>`;}
function cellsHtml(){const a=alg(),e=step(),pair=a.kind==='pair';
 const arr=e&&e.arr?e.arr:pair?[cur.input.a,cur.input.b,'—']:cur.input.list,labels=pair?['a','b','r']:null,n=arr.length;
 const S=k=>new Set(e&&e[k]||[]),cmp=S('cmp'),hit=S('hit'),swp=S('swapped'),dim=S('dim'),range=e&&e.range,runs=e&&e.runs||1,sortedFrom=e&&e.sortedFrom!=null?e.sortedFrom:n+1,sortedTo=e&&e.sortedTo!=null?e.sortedTo:0,hole=e&&e.hole!=null?e.hole:-1,mark=new Set(e&&e.mark||[]),placed=S('placed');
 const ptrAt={};for(const [k,v] of Object.entries(e&&e.ptr||{}))if(v!=null&&v>=0&&v<n)(ptrAt[v]=ptrAt[v]||[]).push(k);
 return arr.map((v,i)=>{const cls=['cell',dim.has(i)||range&&(i<range[0]||i>=range[1])?'dim':'',a.kind==='merge'&&Math.floor(i/runs)%2?'runB':'',cmp.has(i)?'cmp':'',hit.has(i)?'hit':'',swp.has(i)?'swap':'',i>=sortedFrom||placed.has(i)?'done':'',i<sortedTo&&i!==hole?'sorted':'',i===hole?'hole':'',mark.has(i)?'best':''].filter(Boolean).join(' ');
  return `<div class="${cls}"><span class="ix">${labels?labels[i]:i}</span><span class="v">${i===hole?'':esc(v)}</span>${ptrAt[i]?`<span class="pt">${ptrAt[i].join(' ')}</span>`:''}</div>`;}).join('');}
function varsHtml(){const a=alg(),e=step(),chips=[];
 if(a.id==='find-max')chips.push(['best',e&&e.vars&&e.vars.best!=null?e.vars.best:'—']);
 if(a.kind==='search')chips.push(['target',cur.input.target]);
 if(a.id==='insertion-sort'&&e&&e.aside!=null)chips.push(['key',e.aside]);
 if(a.kind==='quick'&&e&&e.pivot!=null)chips.push(['pivot',e.pivot]);
 return chips.length?`<div class="vars">${chips.map(([k,v])=>`<span class="var${k==='key'?' key':''}"><span>${k}</span> = <b>${esc(v)}</b></span>`).join('')}</div>`:'';}
function traceTable(){const a=alg(),cols=a.trace[lc()],rows=cur.events.slice(0,cur.idx+1).filter(x=>x.row).map(x=>x.row),prefix=rows.length&&rows[0].length===cols.length-1;
 const body=rows.length?rows.map((r,i)=>`<tr${i===rows.length-1?' class="last"':''}>${prefix?`<td>${i+1}</td>`:''}${r.map(c=>`<td>${esc(tx(c))}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="muted">${esc(u('traceEmpty'))}</td></tr>`;
 return `<table><thead><tr>${cols.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`;}
function predictBox(ask){return `<div class="predict" role="group" aria-labelledby="predict-q"><p id="predict-q"><strong>${esc(u('predict'))}</strong> ${esc(tx(ask.q))}</p><div class="opts">${tx(ask.options).map((o,i)=>`<button type="button" data-opt="${i}">${esc(o)}</button>`).join('')}</div><button type="button" class="quiet" id="b-skipone">${esc(u('skipOne'))}</button></div>`;}

/* ---------------- Code and the guide ---------------- */
function codeBlock(){const a=alg(),c=a.code[state.lang],e=step(),on=new Set(e&&e.line>=0?c.map[e.line]:[]),fresh=cur.teach>=0?new Set(c.map[cur.teach]):null;
 return `<pre class="code" data-no-frac aria-label="${esc(LANG_NAMES[state.lang])}">${c.lines.map((l,i)=>`<div class="${on.has(i+1)?'cur':''}${fresh&&fresh.has(i+1)?' new':''}"><span class="n" aria-hidden="true">${i+1}</span>${esc(l)}</div>`).join('')}</pre>`;}
function teachBlock(){const a=alg(),i=cur.teach,s=a.teach[i];
 return `<div class="teach"><span class="eyebrow">${esc(u('guide',{i:i+1,n:a.teach.length}))}</span><p><strong>${esc(u('logic'))}</strong> ${esc(tx(s.step))}</p><p class="mono" data-no-frac>${esc(a.pseudo[lc()][i].trim())}</p><p><strong>${LANG_NAMES[state.lang]}:</strong> ${esc(tx(s[state.lang]))} ${esc(u('newCode'))}</p><div class="row"><button type="button" id="t-prev"${i?'':' disabled'}>${esc(u('prevLine'))}</button><button type="button" class="primary" id="t-next"${i<a.teach.length-1?'':' disabled'}>${esc(u('nextLine'))}</button></div></div>`;}

/* ---------------- The workbench ---------------- */
function inputsHtml(){const a=alg(),i=cur.input,btn=(id,k,x='')=>`<button type="button" id="${id}"${x}>${esc(u(k))}</button>`;
 if(a.kind==='grid')return `<div class="inputs">${btn('in-edit','editWalls',` aria-pressed="${!!cur.editWalls}"`)}${btn('in-random','randomMaze')}${btn('in-clear','clearWalls')}${btn('in-default','defaultMaze')}<span id="in-help" class="muted small-print">${esc(u('helpGrid'))}</span></div>`;
 if(a.kind==='hanoi')return `<div class="inputs"><label for="in-disks">${esc(u('disks'))} <select id="in-disks">${[1,2,3,4,5].map(n=>`<option value="${n}"${n===i.disks?' selected':''}>${n}</option>`).join('')}</select></label>${btn('in-apply','use')}${btn('in-random','random')}<span id="in-help" class="muted small-print">${esc(u('helpDisks'))}</span></div>`;
 if(a.kind==='graph')return `<div class="inputs roads" role="group" aria-label="${esc(u('roadsGroup'))}">${A.ROADS.map((_,r)=>`<label for="in-r${r}">${A.roadName(r)} <input type="text" inputmode="numeric" class="tiny" id="in-r${r}" value="${esc(i.roads[r])}" aria-label="${esc(u('roadLabel',{name:A.roadName(r)}))}"></label>`).join('')}${btn('in-apply','use')}${btn('in-random','random')}<span id="in-help" class="muted small-print">${esc(u('helpRoads'))}</span></div>${cur.msg?`<p class="fb no" role="alert">${esc(u(cur.msg))}</p>`:''}`;
 if(a.kind==='coins'||a.kind==='dp')return `<div class="inputs"><label for="in-coins">${esc(u('coinsLabel'))} <input type="text" id="in-coins" value="${esc(i.coins.join(', '))}" aria-describedby="in-help"></label><label for="in-amount">${esc(u('amountLabel'))} <input type="text" inputmode="numeric" class="small" id="in-amount" value="${esc(i.amount)}"></label>${btn('in-apply','use')}${btn('in-random','random')}<span id="in-help" class="muted small-print">${esc(u(a.kind==='dp'?'helpDp':'helpCoins'))}</span></div>${cur.msg?`<p class="fb no" role="alert">${esc(u(cur.msg))}</p>`:''}`;
 const fields=a.kind==='pair'?`<label for="in-a">a <input type="text" inputmode="numeric" class="small" id="in-a" value="${esc(i.a)}"></label><label for="in-b">b <input type="text" inputmode="numeric" class="small" id="in-b" value="${esc(i.b)}"></label>`
  :`<label for="in-list">${esc(u('list'))} <input type="text" id="in-list" value="${esc(i.list.join(', '))}" aria-describedby="in-help"></label>${a.kind==='search'||a.kind==='subset'?`<label for="in-target">${esc(u(a.kind==='subset'?'subsetTarget':'target'))} <input type="text" inputmode="numeric" class="small" id="in-target" value="${esc(i.target)}"></label>`:''}`;
 return `<div class="inputs">${fields}<button type="button" id="in-apply">${esc(u('use'))}</button><button type="button" id="in-random">${esc(u('random'))}</button><span id="in-help" class="muted small-print">${esc(u(a.kind==='pair'?'helpPair':a.kind==='subset'?'helpSubset':a.sorted?'helpSorted':'helpList'))}</span></div>${cur.msg?`<p class="fb no" role="alert">${esc(u(cur.msg))}</p>`:''}`;}
function renderBench(){const a=alg(),e=step(),nx=cur.events[cur.idx+1],asking=cur.pending&&nx&&nx.ask,t=tally(),active=document.activeElement&&$('alg').contains(document.activeElement)?document.activeElement.id:null;
 $('alg').innerHTML=`
 <div class="alg-head"><p class="eyebrow">#${a.num} · ${esc(tx(a.level))}</p><h2 id="alg-title" tabindex="-1">${esc(tx(a.name))}</h2><p>${esc(tx(a.problem))}</p></div>
 ${inputsHtml()}
 <div class="bench">
  <div class="panel chain">
   <div class="panel-head"><span class="eyebrow">${esc(u('chain'))}</span><span class="muted small-print">${esc(u('chainNote'))}</span></div>
   ${cur.pick?`<p class="fb pick-note" role="status">${esc(u('pickNote'))}</p>`:''}
   <div class="flow" id="flow" tabindex="-1">${flowSvg()}</div>
  </div>
  <div class="side">
   <div class="panel steps-panel"><span class="eyebrow">${esc(u('steps'))}</span><ol class="steps" id="steps" aria-label="${esc(u('steps'))}" data-no-frac>${stepsList()}</ol></div>
   <div class="panel data-panel">
    <span class="eyebrow">${esc(u('data'))}</span>
    ${dataView()}
    <p class="narr">${e?tx(e.note):tx(U.begin)}</p>
    ${asking?predictBox(nx.ask):''}
    ${cur.feedback?`<div class="fb ${cur.feedback.ok?'ok':'no'}">${esc(u(cur.feedback.ok?'matched':'missed'))} ${esc(tx(cur.feedback.why))}</div>`:''}
    <div class="controls">
     <button type="button" id="b-back"${cur.idx<0?' disabled':''}>${esc(u('back'))}</button>
     <button type="button" class="primary" id="b-next"${cur.idx>=cur.events.length-1||asking?' disabled':''}>${esc(u('next'))}</button>
     <button type="button" id="b-play"${cur.idx>=cur.events.length-1?' disabled':''} aria-pressed="${cur.playing}">${esc(u(cur.playing?'pause':'play'))}</button>
     <button type="button" id="b-reset">${esc(u('restart'))}</button>
     ${skipOn()&&!asking&&nx&&nx.ask&&!nx.answered?`<button type="button" id="b-force">${esc(u('force'))}</button>`:''}
    </div>
    <label class="toggle" for="skip"><input type="checkbox" id="skip"${skipOn()?' checked':''}> ${esc(u('skip'))}</label>
    <span class="tally">${esc(u('tally',{n:a.num,m:t.matched,a:t.asked}))}</span>
   </div>
   <div class="panel trace-panel"><span class="eyebrow">${esc(u('trace'))}</span><div class="tracewrap" tabindex="0" aria-label="${esc(u('trace'))}">${traceTable()}</div></div>
  </div>
 </div>
 <div class="panel code-panel">
  <div class="panel-head"><span class="eyebrow">${esc(u('code'))}</span><div class="codetabs" role="group" aria-label="${esc(u('langGroup'))}">${LANGS.map(l=>`<button type="button" id="lang-${l}" data-lang="${l}" aria-pressed="${state.lang===l}">${LANG_NAMES[l]}</button>`).join('')}</div></div>
  ${codeBlock()}
  <p class="muted small-print">${esc(u('codeNote'))}${state.lang==='matlab'&&['list','search','merge','quick','subset'].includes(a.kind)?' '+esc(u('matlabNote')):state.lang==='matlab'&&a.kind==='grid'?' '+esc(u('matlabGrid')):state.lang==='matlab'&&a.kind==='graph'?' '+esc(u('matlabTowns')):''}</p>
  <div class="row"><button type="button" id="b-teach" aria-expanded="${cur.teach>=0}">${esc(u(cur.teach>=0?'teachClose':'teachOpen'))}</button></div>
  ${cur.teach>=0?teachBlock():''}
 </div>`;
 const tw=document.querySelector('#alg .tracewrap');if(tw)tw.scrollTop=tw.scrollHeight;
 if(asking){const o=document.querySelector('[data-opt]');if(o)o.focus();}
 else if(active){const el=$(active);if(el&&!el.disabled)el.focus();else if(active==='b-next'||active==='b-back'||active==='b-play'){const f=$('b-next')&&!$('b-next').disabled?$('b-next'):$('b-reset');f.focus();}}}
function say(text){const el=$('announce');el.textContent='';setTimeout(()=>{el.textContent=text;},40);}
function announce(){const e=step();say(e?plain(tx(e.note)):'');}
function focusNext(){const n=$('b-next');(n&&!n.disabled?n:$('b-reset')).focus();}
function next(){const nx=cur.events[cur.idx+1];if(!nx)return;cur.feedback=null;if(nx.ask&&(!skipOn()||cur.forcePredict)&&!nx.answered){cur.pending=true;renderBench();return;}advance();}
function advance(){cur.idx++;cur.pending=false;cur.forcePredict=false;renderBench();announce();renderRec();}
function back(){stop();if(cur.idx<0)return;cur.idx--;cur.pending=false;cur.feedback=null;renderBench();announce();}
function answer(i){const nx=cur.events[cur.idx+1];if(!nx||!nx.ask)return;const ok=i===nx.ask.answer,t=tally();
 state.pred[cur.key]={asked:t.asked+1,matched:t.matched+(ok?1:0)};nx.answered=true;persist();
 cur.idx++;cur.pending=false;cur.forcePredict=false;cur.feedback={ok,why:nx.ask.why};renderBench();focusNext();say(`${u(ok?'matched':'missed')} ${tx(nx.ask.why)} ${plain(tx(cur.events[cur.idx].note))}`);renderRec();if(cur.playing)schedule();}
function play(){cur.playing=true;renderBench();schedule();}
function schedule(){clearTimeout(cur.timer);cur.timer=setTimeout(()=>{if(!cur.playing)return;if(cur.idx>=cur.events.length-1){stop();renderBench();return;}next();if(!cur.pending)schedule();},reduced()?1500:950);}
function stop(){cur.playing=false;clearTimeout(cur.timer);}
function parseOne(s,min,max){const t=String(s).trim().replace(/(\d)[,\s](?=\d{3}\b)/g,'$1');const x=parseInts(t,min,max);return x&&x.length===1?x[0]:null;}
function parseInts(s,min,max){const parts=String(s).split(/[\s,;]+/).filter(Boolean);if(!parts.length||parts.some(p=>!/^[−-]?\d+$/.test(p)))return null;const xs=parts.map(p=>Number(p.replace('−','-')));return xs.every(x=>Number.isSafeInteger(x)&&x>=min&&x<=max)?xs:null;}
function applyInput(){const a=alg();stop();cur.msg=null;
 if(a.kind==='hanoi'){cur.input={disks:Math.min(5,Math.max(1,+$('in-disks').value||3))};}
 else if(a.kind==='coins'){const cs=parseInts($('in-coins').value,1,100),amt=parseOne($('in-amount').value,1,99);if(!cs||cs.length>5||new Set(cs).size!==cs.length){cur.msg='errCoins';renderBench();return;}if(amt===null){cur.msg='errAmount';renderBench();return;}cur.input={coins:cs,amount:amt};}
 else if(a.kind==='dp'){const cs=parseInts($('in-coins').value,1,20),amt=parseOne($('in-amount').value,1,20);if(!cs||cs.length>4||new Set(cs).size!==cs.length){cur.msg='errDpCoins';renderBench();return;}if(amt===null){cur.msg='errDpAmount';renderBench();return;}cur.input={coins:cs,amount:amt};}
 else if(a.kind==='graph'){const r=A.ROADS.map((_,k)=>parseOne($('in-r'+k).value,1,20));if(r.includes(null)){cur.msg='errRoads';renderBench();return;}cur.input={roads:r};}
 else if(a.kind==='subset'){const xs=parseInts($('in-list').value,1,99),t=parseOne($('in-target').value,1,600);if(!xs||xs.length<2||xs.length>6){cur.msg='errSubset';renderBench();return;}if(t===null){cur.msg='errSubsetTarget';renderBench();return;}cur.input={list:xs,target:t};}
 else if(a.kind==='pair'){const x=parseOne($('in-a').value,1,999999),y=parseOne($('in-b').value,1,999999);if(x===null||y===null){cur.msg='errPair';renderBench();return;}cur.input={a:x,b:y};}
 else{const xs=parseInts($('in-list').value,-999,999);if(!xs||xs.length<2||xs.length>12){cur.msg='errList';renderBench();return;}
  let t=cur.input.target;if(a.kind==='search'){const tt=parseInts($('in-target').value,-999,999);if(!tt||tt.length!==1){cur.msg='errTarget';renderBench();return;}t=tt[0];}
  cur.input={list:xs,target:t};if(a.sorted&&!A.sorted(xs))cur.msg='warnUnsorted';}
 build();cur.pick=false;renderBench();renderChallenges();renderRec();$('announce').textContent='';}
function setMaze(m){stop();cur.input={maze:A.parseMaze(m)};build();renderBench();renderChallenges();renderRec();}
function toggleWall(i){cur.lastCell=i;const m=[...A.parseMaze(cur.input.maze)];m[i]=m[i]==='#'?'.':'#';setMaze(m.join(''));const el=$('cell-'+i);if(el)el.focus();}
function randomInput(){const a=alg(),r=n=>Math.floor(Math.random()*n);stop();cur.msg=null;
 if(a.kind==='grid'){let m;for(let k=0;k<50;k++){m=A.randomMaze(Math.random,.28);if(A.bfsRun(m).found)break;}cur.input={maze:m};}
 else if(a.kind==='hanoi')cur.input={disks:2+r(4)};
 else if(a.kind==='coins'){const sets=[[25,10,5,1],[1,3,4],[1,5,12],[1,7,10],[50,20,10,5,1]],cs=sets[r(sets.length)];cur.input={coins:[...cs],amount:5+r(55)};}
 else if(a.kind==='dp'){const sets=[[1,3,4],[1,5,6],[2,5],[1,4,7],[3,5,7],[1,2,5]];cur.input={coins:[...sets[r(sets.length)]],amount:6+r(15)};}
 else if(a.kind==='graph')cur.input={roads:A.ROADS.map(()=>1+r(12))};
 else if(a.kind==='subset'){const n=4+r(3),pool=[...Array(30).keys()].map(x=>x+1);for(let k=pool.length-1;k>0;k--){const j=r(k+1);[pool[k],pool[j]]=[pool[j],pool[k]];}const list=pool.slice(0,n),some=list.filter(()=>Math.random()<.5);cur.input={list,target:Math.random()<.75&&some.length?some.reduce((x,y)=>x+y,0):1+r(list.reduce((x,y)=>x+y,0))};}
 else if(a.kind==='pair'){const x=10+r(990),y=10+r(990);cur.input={a:Math.max(x,y),b:Math.min(x,y)};}
 else{const n=a.kind==='search'?8+r(4):6+r(3),pool=[...Array(60).keys()].map(x=>x+1);for(let i=pool.length-1;i>0;i--){const j=r(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}
  const list=pool.slice(0,n),t=Math.random()<.75?list[r(n)]:61+r(30);if(a.sorted)list.sort((x,y)=>x-y);cur.input={list,target:t};}
 build();cur.pick=false;renderBench();renderChallenges();renderRec();}

/* ---------------- Challenges ---------------- */
const LEADS={
 'find-max':L('Find the maximum looks at every item once. Test the rule it relies on, then try to find two answers with less work.'),
 'linear-search':L('Linear search checks every item in the worst case. Find out exactly what it returns, then do better on a sorted list.'),
 'bubble-sort':L('Bubble sort does a lot of comparing. Find where the work goes, then try to cut it.'),
 'insertion-sort':L('Insertion sort can be quick or slow. Find out when, and where its time goes.'),
 'binary-search':L('Binary search is fast, but it relies on something. Find out what, then make it handle repeated numbers.'),
 'merge-sort':L('Merge sort is fast on every list. Is it always the best choice? Find out, then try to make it smarter.'),
 hanoi:L('A method that calls itself needs every one of its lines. Break it on purpose, then find where its time goes.'),
 bfs:L('BFS finds the fewest steps. Is that always what you want? Then find where its time goes.'),
 dfs:L('DFS goes deep first. Find out what that costs, then try to point it toward the goal.'),
 'greedy-change':L('Taking the largest coin feels right. Find out when it is wrong, then make it faster.'),
 euclid:L('Euclid’s algorithm is famous for being fast. Test that, and rebuild its key idea.'),
 quicksort:L('Quicksort is fast on most lists. Find the lists that make it slow, then choose a better pivot.'),
 'fewest-coins':L('The table finds the fewest coins for any set of coins. Break it on purpose to see why each line matters, then find where its time goes.'),
 dijkstra:L('Dijkstra’s method waits until a town is the closest before finishing it. See what goes wrong without that, then make it stop sooner.'),
 kruskal:L('Kruskal’s method joins every town with the least road. Find out what that does not promise, then make it stop sooner.'),
 'subset-sum':L('Trying every subset always finds an answer, but slowly. Test a shortcut that is not safe, then one that is.')};
const CARDS={'binary-search':['idea','counter','first','cplx'],'merge-sort':['idea','counter','mergeskip','cplx'],hanoi:['idea','breaks','bottle','cplx'],bfs:['idea','counter','bottle','cplx'],dfs:['idea','counter','dfsimp','cplx'],'greedy-change':['idea','counter','change','cplx'],'find-max':['idea','counter','minmax','cplx'],'linear-search':['idea','counter','builder','cplx'],'bubble-sort':['idea','bottle','bubble','cplx'],'insertion-sort':['idea','counter','bottle','cplx'],euclid:['idea','counter','euclid','cplx'],quicksort:['idea','counter','pivot','cplx'],'fewest-coins':['idea','breaks','bottle','cplx'],dijkstra:['idea','counter','dijkstop','cplx'],kruskal:['idea','counter','kstop','cplx'],'subset-sum':['idea','counter','prune','cplx']};
function card(kind,done,title,body){return `<div class="ch${done?' done':''}"><span class="kind">${esc(u(kind))}${done?` <span class="got">✓ ${esc(u('saved'))}</span>`:''}</span>${title?`<h3>${esc(tx(title))}</h3>`:''}${body}</div>`;}
function ideaCard(){const k=cur.key,v=state.ideas[k]||'';return card('kindIdea',false,null,`<label for="idea">${esc(tx(A.IDEAS[k]))}</label><textarea id="idea" rows="4" class="student-work" placeholder="${esc(U.ideaPlaceholder.en)}">${esc(v)}</textarea><span class="muted small-print" id="idea-s">${esc(u(v?'ideaSaved':'ideaNote'))}</span>`);}

// Counterexamples: each claim, its inputs, how it is checked and the follow-up question.
// Road lengths for the two map cards: one small input per road.
const roadFields=def=>A.ROADS.map((_,i)=>['r'+i,L(A.roadName(i)),String(def[i]),'tiny']),readRoads=v=>A.ROADS.map((_,i)=>parseOne(v['r'+i],1,20)),townRoute=xs=>xs.map(i=>A.TOWNS[i]).join(' → ');
const COUNTER={
 quicksort:{title:L('Easy when sorted?'),claim:L('Like insertion sort, quicksort has less work to do when the list is already sorted.'),
  fields:[['list',L('List'),'5, 4, 3, 2, 1']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkQuick(xs);return{status:r.counter?'counter':'holds',data:{given:r.given,sorted:r.sortedComps,already:r.already}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: your list takes ${d.given} comparisons, but the same numbers already sorted take ${d.sorted}.`):d.already?L(`Your list is already sorted: it takes ${d.sorted} comparisons. Shuffle the same numbers and compare.`):L(`Your list takes ${d.given} comparisons, the same as the same numbers sorted (${d.sorted}), so it is not a counterexample. Try a shuffled order.`),
  why:{q:L('Why is a sorted list slow for quicksort?'),options:L(['Each pivot is the largest item of its range, so each range shrinks by only one','A sorted list has more pairs to compare','The stack holds too many ranges']),
   good:L('Yes. With the last item as pivot, a sorted range puts every other item on the left, so the next range is just one item shorter and the work adds up to n(n − 1)/2. A shuffled list usually splits nearer the middle.'),
   bad:L('Step through a sorted list in the workbench above and watch where each pivot lands.')}},
 dijkstra:{title:L('Nearest town first?'),claim:L('Walking along the shortest road to a town not yet visited, again and again, reaches F by a shortest route. Ties go to the road listed first.'),
  pic:()=>graphSvg({names:true,label:u('graphNames')}),fields:roadFields([1,5,5,1,5,5,5,1,5]),
  check(v){const len=readRoads(v);if(len.includes(null))return{status:'bad',data:{msg:'errRoads'}};const r=A.checkWalk(len);return{status:r.counter?'counter':'holds',data:{stuck:r.stuck,at:r.stuck?A.TOWNS[r.at]:'',walk:r.walk,wr:townRoute(r.walkRoute),best:r.best,br:townRoute(r.bestRoute)}};},
  text:(s,d)=>s==='counter'?(d.stuck?L(`Counterexample: the walk ${d.wr} gets stuck at ${d.at}, where every road leads to a town already visited, but ${d.br} reaches F with length ${d.best}.`):L(`Counterexample: the walk ${d.wr} has length ${d.walk}, but ${d.br} has length ${d.best}.`)):L(`The walk ${d.wr} has length ${d.walk}, the shortest possible here. The claim holds for these lengths. Make a short road lead toward long ones.`),
  why:{q:L('Why can the nearest town be the wrong next step?'),options:L(['A short road now can lead to long roads later','The roads were looked at in the wrong order','Some towns were visited twice']),
   good:L('Yes. The walk commits to one road at a time and never comes back, like greedy change in #11. Dijkstra’s method keeps the best distance known to every unfinished town and always finishes the closest one, so a route found later can still lower a distance.'),
   bad:L('Put these lengths into the workbench above and compare the walk with the route Dijkstra’s method finds.')}},
 kruskal:{title:L('The best routes too?'),claim:L('In the network that joins every town with the least total road, the route between any two towns is as short as on the full map.'),
  pic:()=>graphSvg({names:true,label:u('graphNames')}),fields:roadFields([2,1,1,1,2,3,1,2,1]),
  check(v){const len=readRoads(v);if(len.includes(null))return{status:'bad',data:{msg:'errRoads'}};const r=A.checkTreeRoutes(len),kept=r.kept.map(A.roadName).join(', ');return{status:r.counter?'counter':'holds',data:r.counter?{kept,total:r.total,a:A.TOWNS[r.a],b:A.TOWNS[r.b],tree:r.tree,best:r.best,tr:townRoute(r.treeRoute),br:townRoute(r.bestRoute)}:{kept,total:r.total}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: the cheapest network keeps ${d.kept} (total ${d.total}). In it, the trip from ${d.a} to ${d.b} is ${d.tr}, length ${d.tree}, but on the full map ${d.br} has length ${d.best}.`):L(`The cheapest network keeps ${d.kept} (total ${d.total}), and every trip in it is as short as on the full map. The claim holds for these lengths. Try a triangle of roads with lengths 2, 2 and 3.`),
  why:{q:L('What does the cheapest network promise?'),options:L(['The smallest total length, not the shortest route for every trip','The shortest route between every two towns','The fewest roads at every town']),
   good:L('Yes. It joins every town with as little road as possible in total, so some trips take a detour: with roads of 2, 2 and 3 around a triangle it keeps the two roads of 2, and the trip along the road of 3 becomes 4. The shortest routes from one town form a different tree, the one Dijkstra’s method builds in #14.'),
   bad:L('Look at the two towns named above and compare the trip in the network with the one on the full map.')}},
 'subset-sum':{title:L('Largest first?'),claim:L('Taking the largest number that still fits, again and again, finds a subset with the target sum whenever there is one.'),
  fields:[['list',L('Numbers'),'8, 6, 5, 3'],['target',L('Target'),'11',true]],
  check(v){const xs=parseInts(v.list,1,99),t=parseOne(v.target,1,999);if(!xs||xs.length<2||xs.length>10)return{status:'bad',data:{msg:'errSubsetCard'}};if(t===null)return{status:'bad',data:{msg:'errSubsetCardTarget'}};
   const r=A.checkGreedySubset(xs,t);if(!r.exists)return{status:'bad',data:{msg:'noSubset'}};const S=x=>`{${x.join(', ')}}`;return{status:r.counter?'counter':'holds',data:{g:S(r.greedy),sum:r.sum,b:S(r.best),target:t}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: largest first takes ${d.g}, which adds up to ${d.sum}, but ${d.b} adds up to ${d.target}.`):L(`Largest first takes ${d.g}, which adds up to ${d.target}. The claim holds here. Try numbers where one large number leaves a gap that the smaller ones cannot fill.`),
  why:{q:L('What went wrong?'),options:L(['An early large number left a gap that the rest cannot fill','The numbers were not sorted','The target was too large']),
   good:L('Yes. As with greedy change in #11, a choice is never undone. Trying every subset never misses an answer, but the number of subsets doubles with each extra number.'),
   bad:L('Compare the two subsets: which number did largest first take that the answer leaves out?')}},
 'binary-search':{title:L('Does it always work?'),claim:L('If the target is in the list, binary search finds it.'),
  fields:[['list',L('List'),'1, 3, 5, 7, 9'],['target',L('Target'),'9',true]],
  check(v){const xs=parseInts(v.list,-999,999),t=parseInts(v.target,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};if(!t||t.length!==1)return{status:'bad',data:{msg:'errTarget'}};
   const r=A.checkBinary(xs,t[0]);if(!r.present)return{status:'bad',data:{target:t[0],missing:true}};return{status:r.counter?'counter':'holds',data:{target:t[0],index:r.index}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: ${d.target} is in your list, but binary search returns −1.`):L(`Binary search finds ${d.target} at position ${d.index}. The claim holds for this list. Try a list where keeping one half throws the target away.`),
  missing:d=>L(`${d.target} is not in your list, so binary search should return −1. The claim is about a target that is in the list.`),
  why:{q:L('What did your list break?'),options:L(['It is not sorted','It has repeated numbers','It is too short']),
   good:L('Yes. Throwing away half the list is safe only when the list is sorted: only then can the target not be in the discarded half.'),
   bad:L('Look at the order of your numbers. What does binary search assume about it?')}},
 'merge-sort':{title:L('Is it always faster?'),claim:L('Merge sort always makes fewer comparisons than insertion sort.'),
  fields:[['list',L('List'),'8, 3, 6, 1, 7, 2, 5, 4']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkMerge(xs);return{status:r.counter?'counter':'holds',data:{merge:r.merge,ins:r.ins}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: merge sort made ${d.merge} comparisons and insertion sort made ${d.ins}.`):L(`Merge sort made ${d.merge} comparisons and insertion sort made ${d.ins}. The claim holds for this list. Try a list that insertion sort finds easy.`),
  why:{q:L('Which lists favour insertion sort?'),options:L(['Lists that are already sorted or nearly sorted','Lists in decreasing order','Lists with no repeated numbers']),
   good:L('Yes. On a sorted list insertion sort compares each item once with the one before it, n − 1 comparisons in all, while merge sort still merges every pair of runs.'),
   bad:L('Run both sorts on a list that is already in order, and count.')}},
 bfs:{title:L('Fewest steps, lowest cost?'),claim:L('Even when mud cells cost 3 to enter, the path BFS finds is the cheapest.'),
  grid:{modes:['.','~','#']},
  check(v){const r=A.checkMud(v.maze);if(!r.found)return{status:'bad',data:{msg:'noPath'}};return{status:r.counter?'counter':'holds',data:{steps:r.steps,cost:r.cost,best:r.best}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: BFS finds a path of ${d.steps} steps that costs ${d.cost}, but the cheapest route costs ${d.best}.`):L(`The path BFS finds costs ${d.cost}, and no route is cheaper. The claim holds for this maze. Put mud on the short route and leave a longer route dry.`),
  why:{q:L('Why can the BFS path cost more?'),options:L(['BFS counts steps, not what each step costs','BFS skips cells with mud','BFS stops before it reaches G']),
   good:L('Yes. BFS finds a path with the fewest steps and ignores what each step costs. A cheaper route may be longer, or just as long but drier, and finding it needs #14 Dijkstra’s method.'),
   bad:L('Count the steps of the BFS path, then add up what they cost.')}},
 dfs:{title:L('Is the path the shortest?'),claim:L('DFS always finds a shortest path from S to G.'),
  grid:{modes:['.','#']},
  check(v){const r=A.checkDfs(v.maze);if(!r.found)return{status:'bad',data:{msg:'noPath'}};return{status:r.counter?'counter':'holds',data:{dfs:r.dfs,bfs:r.bfs}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: DFS finds a path of ${d.dfs} steps, but a path of ${d.bfs} steps exists.`):L(`DFS finds a path of ${d.dfs} steps, the shortest possible here. The claim holds for this maze. Add walls so that the first way DFS tries is a long detour.`),
  why:{q:L('Why can DFS find a longer path?'),options:L(['It follows one route as far as it can before trying another','It looks at fewer neighbours','It marks cells too early']),
   good:L('Yes. DFS keeps going from the newest cell and stops at G however it got there, so the route can be long. BFS explores ring by ring instead.'),
   bad:L('Put your maze in the workbench above and watch the order in which DFS takes cells.')}},
 'greedy-change':{title:L('Always the fewest coins?'),claim:L('Taking the largest coin that fits, again and again, always uses the fewest coins.'),
  fields:[['coins',L('Coins'),'25, 10, 5, 1'],['amount',L('Amount'),'30',true]],
  check(v){const cs=parseInts(v.coins,1,100),amt=parseOne(v.amount,1,99);if(!cs||cs.length>5||new Set(cs).size!==cs.length)return{status:'bad',data:{msg:'errCoins'}};if(amt===null)return{status:'bad',data:{msg:'errAmount'}};
   const r=A.checkGreedy(cs,amt);if(r.best===null)return{status:'bad',data:{msg:'cantPay'}};return{status:r.counter?'counter':'holds',data:{greedy:r.greedy===null?-1:r.greedy,gc:r.greedyCoins.join(' + ')||'—',left:r.left,best:r.best,bc:r.bestCoins.join(' + ')}};},
  text:(s,d)=>s==='counter'?(d.greedy<0?L(`Counterexample: the greedy method takes ${d.gc} and is stuck with ${d.left} left, but ${d.bc} pays exactly.`):L(`Counterexample: the greedy method uses ${d.greedy} coins (${d.gc}), but ${d.best} are enough: ${d.bc}.`)):L(`The greedy method uses ${d.greedy} ${d.greedy===1?'coin':'coins'} (${d.gc}), and no way uses fewer. The claim holds here. Try coins without a 5 or a 10, where a large coin can block a better mix.`),
  why:{q:L('What went wrong?'),options:L(['A large coin blocked a better mix of smaller coins','The amount was too large','The coins were not in order']),
   good:L('Yes. The greedy method never gives a coin back, so one early large coin can force a worse finish. Coins such as 25, 10, 5 and 1 are chosen so that this never happens.'),
   bad:L('Compare the two answers coin by coin: where do they first differ?')}},
 'find-max':{title:L('Does it always work?'),claim:L('Starting with best ← 0 instead of best ← a[0], and comparing every item including a[0], gives the same answer.'),
  fields:[['list',L('List'),'3, -2, 8']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkMaxZero(xs);return{status:r.counter?'counter':'holds',data:{right:r.right,zero:r.zero}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: the largest number is ${d.right}, but starting with best ← 0 returns ${d.zero}.`):L(`Both give ${d.right}. The claim holds for this list. Try a list where 0 would beat every number.`),
  why:{q:L('Why does best end up as 0?'),options:L(['0 is bigger than every number in the list','The largest number comes first','A number is repeated']),
   good:L('Yes. 0 is bigger than every negative number, so best never changes and stays 0, which is not even in the list. Starting with a[0] always uses a value from the list.'),
   bad:L('Compare 0 with each number in your list. Which is bigger?')}},
 'linear-search':{title:L('Is it the only place?'),claim:L('The position that linear search returns is the only place where the target appears.'),
  fields:[['list',L('List'),'4, 7, 1, 9'],['target',L('Target'),'7',true]],
  check(v){const xs=parseInts(v.list,-999,999),t=parseInts(v.target,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};if(!t||t.length!==1)return{status:'bad',data:{msg:'errTarget'}};
   const r=A.checkLinearFirst(xs,t[0]);if(r.first<0)return{status:'bad',data:{target:t[0],missing:true}};return{status:r.counter?'counter':'holds',data:{target:t[0],first:r.first,count:r.count}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: ${d.target} appears ${d.count} times, but linear search returns only position ${d.first}.`):L(`${d.target} appears only at position ${d.first}. The claim holds for this list. Try a list where the target appears more than once.`),
  missing:d=>L(`${d.target} is not in your list, so linear search returns −1. The claim is about a target that is in the list.`),
  why:{q:L('Which position does linear search return?'),options:L(['The first position where the target appears','The last position where it appears','Any position where it appears']),
   good:L('Yes. It stops at the first match. To find every position, it would have to keep going to the end and collect each match.'),
   bad:L('Put your list and target into the workbench above and step through it: where does the loop stop?')}},
 'insertion-sort':{title:L('Is it always faster?'),claim:L('Insertion sort always makes fewer comparisons than bubble sort.'),
  fields:[['list',L('List'),'1, 2, 3, 4, 5']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkInsertion(xs);return{status:r.counter?'counter':'holds',data:{ins:r.ins,bub:r.bub}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: insertion sort made ${d.ins} comparisons and bubble sort made ${d.bub}, so insertion sort was not faster.`):L(`Insertion sort made ${d.ins} comparisons and bubble sort made ${d.bub}. The claim holds for this list. Try an order where every new item has to travel far.`),
  why:{q:L('Which order of a list makes insertion sort do the most work?'),options:L(['Decreasing order','Already sorted','All numbers equal']),
   good:L('Yes. In decreasing order every new item slides all the way to the front: 1 + 2 + … + (n − 1) = n(n − 1)/2 comparisons, exactly as many as bubble sort.'),
   bad:L('Try each order on a short list and count the comparisons. Which one makes every item travel furthest?')}},
 euclid:{title:L('Do bigger numbers need more steps?'),claim:L('A pair of bigger numbers never needs fewer remainder steps than a pair of smaller numbers.'),
  fields:[['a1',L('Pair 1: a'),'21',true],['b1',L('Pair 1: b'),'14',true],['a2',L('Pair 2: a'),'40',true],['b2',L('Pair 2: b'),'30',true]],
  check(v){const n=k=>parseOne(v[k],1,999999),p=[n('a1'),n('b1')],q=[n('a2'),n('b2')];if([...p,...q].includes(null))return{status:'bad',data:{msg:'errPair'}};
   const ge=(x,y)=>x[0]>=y[0]&&x[1]>=y[1]&&(x[0]>y[0]||x[1]>y[1]);let small,big;if(ge(q,p)){small=p;big=q;}else if(ge(p,q)){small=q;big=p;}else return{status:'bad',data:{msg:'pairOrder'}};
   const r=A.checkEuclidPairs(small,big);return{status:r.counter?'counter':'holds',data:{small:small.join(', '),big:big.join(', '),s1:r.s1,s2:r.s2}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: the bigger pair (${d.big}) needs ${d.s2} step${d.s2===1?'':'s'}, but the smaller pair (${d.small}) needs ${d.s1}.`):L(`The bigger pair (${d.big}) needs ${d.s2} step${d.s2===1?'':'s'} and the smaller pair (${d.small}) needs ${d.s1}. The claim holds for these pairs. Try a small pair where each remainder is only a little smaller than the number before it.`),
  why:{q:L('Which pairs need the most steps for their size?'),options:L(['Neighbouring Fibonacci numbers, such as 34 and 21','Two equal numbers','A number and its double']),
   good:L('Yes. With neighbouring Fibonacci numbers every quotient except the last is 1, so each step shrinks the pair as little as possible. Even so, the number of steps grows only with the number of digits.'),
   bad:L('Count the steps for your smaller pair: how big was each quotient?')}}};
const ERR={errRoads:U.errRoads,errSubsetCard:L('Enter 2 to 10 whole numbers from 1 to 99, separated by commas.'),errSubsetCardTarget:L('The target must be a whole number from 1 to 999.'),noSubset:L('No subset of these numbers adds up to the target, so there is nothing to find. Choose a target that some subset reaches.'),errCoins:U.errCoins,errAmount:U.errAmount,noPath:L('There is no path from S to G in this maze. Open a way through first.'),cantPay:L('No combination of these coins pays this amount exactly. Choose another amount or add a coin.'),errList:U.errList,errTarget:U.errTarget,errPair:U.errPair,pairOrder:L('Make both numbers of one pair at least as big as the other pair’s numbers, with at least one of them bigger.')};
const CELL_STATE={'.':U.open,'#':U.wall,'~':U.mud};
function cardMaze(){const c=COUNTER[cur.key],x=ev().counter;return cur.cardMaze[cur.key]??(x&&x.input.maze!=null?A.parseMaze(x.input.maze):'.'.repeat(A.GN));}
function gridEditor(maze,modes){return `<div role="group" aria-label="${esc(tx(L('Maze for your example')))}">${mazeGrid([...maze].map((ch,i)=>{const cls=['mc',ch==='#'?'wall':ch==='~'?'mud':''].filter(Boolean).join(' ');return i===A.START||i===A.GOAL?`<div class="${cls}">${i===A.START?'S':'G'}</div>`:`<button type="button" id="cx-cell-${i}" class="${cls} edit" data-cx-cell="${i}" tabindex="${i===(cur.lastCxCell??1)?0:-1}" aria-label="${esc(A.cellName(i)+': '+tx(CELL_STATE[ch]))}"></button>`;}),'small')}</div><p class="small-print muted">${esc(tx(modes.includes('~')?L('Click a cell to change it: open → mud (costs 3 to enter) → wall → open.'):L('Click a cell to add or remove a wall.')))}</p>`;}
function cycleCell(i){cur.lastCxCell=i;const c=COUNTER[cur.key],m=[...cardMaze()],modes=c.grid.modes;m[i]=modes[(modes.indexOf(m[i])+1)%modes.length];cur.cardMaze[cur.key]=m.join('');renderChallenges();const el=$('cx-cell-'+i);if(el)el.focus();}
function counterCard(){const c=COUNTER[cur.key],x=ev().counter,val=f=>x&&x.input[f[0]]!=null?x.input[f[0]]:f[2];
 if(c.grid)return card('kindCounter',x&&x.status==='counter'&&x.why===0,c.title,`<p><em>${esc(u('claim'))}</em> ${esc(tx(c.claim))}</p>${gridEditor(cardMaze(),c.grid.modes)}<div class="row"><button type="button" class="primary" id="cx-go">${esc(u('checkEx'))}</button></div><div class="result" id="cx-result" tabindex="-1">${x?counterText(c,x):''}</div>`);
 const fields=c.fields.map(f=>`<label for="cx-${f[0]}">${esc(tx(f[1]))} <input type="text" id="cx-${f[0]}"${f[3]?` class="${f[3]==='tiny'?'tiny':'small'}" inputmode="numeric"`:''}${f[3]==='tiny'?` aria-label="${esc(u('roadLabel',{name:tx(f[1])}))}"`:''} value="${esc(val(f))}"></label>`).join('');
 return card('kindCounter',x&&x.status==='counter'&&x.why===0,c.title,`<p><em>${esc(u('claim'))}</em> ${esc(tx(c.claim))}</p>${c.pic?`<div class="graph small">${c.pic()}</div>`:''}<div class="inputs${c.pic?' roads':''}">${fields}<button type="button" class="primary" id="cx-go">${esc(u('checkEx'))}</button></div><div class="result" id="cx-result" tabindex="-1">${x?counterText(c,x):''}</div>`);}
function counterText(c,x){if(x.status==='bad')return `<div class="fb no">${esc(tx(x.data.missing?c.missing(x.data):ERR[x.data.msg]))}</div>`;
 const head=`<div class="fb ${x.status==='counter'?'ok':'no'}">${esc(tx(c.text(x.status,x.data)))}</div>`;if(x.status!=='counter')return head;
 return head+`<p>${esc(tx(c.why.q))}</p><div class="opts row">${tx(c.why.options).map((o,i)=>`<button type="button" data-why="${i}"${x.why!=null?' disabled':''}${x.why===i?' aria-pressed="true"':''}>${esc(o)}</button>`).join('')}</div>${x.why!=null?`<div class="fb ${x.why===0?'ok':'no'}">${esc(tx(x.why===0?c.why.good:c.why.bad))}</div>${x.why!==0?`<button type="button" class="quiet" id="why-again">${esc(u('again'))}</button>`:''}`:''}`;}
function checkCounter(){const c=COUNTER[cur.key],input=c.grid?{maze:cardMaze()}:Object.fromEntries(c.fields.map(f=>[f[0],$('cx-'+f[0]).value])),r=c.check(input);
 const x={status:r.status,input,why:null,data:r.data};ev().counter=x;
 if(r.status!=='bad')record('counter',c.grid?L('Maze, row by row: '+input.maze.match(/.{7}/g).join(' / ')):L(c.fields.map(f=>f[1].en+': '+input[f[0]]).join(' · ')),c.text(r.status,r.data));persist();renderChallenges('cx-result');renderRec();say($('cx-result').textContent);}
function answerWhy(i){const c=COUNTER[cur.key],x=ev().counter;if(!x||x.status!=='counter')return;x.why=i;record('why',L(c.why.options.en[i]),L(c.why.options.en[i]+(i===0?' ✓':'')));persist();renderChallenges('cx-result');renderRec();say([...$('cx-result').querySelectorAll('.fb')].at(-1)?.textContent||'');}

// Break it on purpose: each change is run, and the learner's prediction is compared with what happened.
const BREAK={
 hanoi:{main:'nobase',lead:L('Change one line, predict what happens with 3 disks, then run it. Every move is checked against the rules, and the run stops at the first problem.'),
  changes:{nobase:L('Delete the line “if n = 0: return”'),nosecond:L('Delete the second call, hanoi(n − 1, via, to, from)'),nomove:L('Delete the line that moves disk n')},
  outcomes:{forever:L('Its calls never finish'),wrongplace:L('It stops with disks in the wrong place'),illegal:L('It puts a bigger disk on a smaller one'),works:L('It still works')},
  why:{nobase:L('Without a base case each call makes another with n one smaller: 2, 1, 0, −1, −2, … No call ever finishes and no disk moves. A real program stops only when it runs out of room for calls: Python raises a RecursionError, Java a StackOverflowError.'),nosecond:L('The smaller disks are moved out of the way but never brought back, so disk 1 stays on C. Then disk 3 is put on top of it.'),nomove:L('The calls still happen, but no disk ever moves: all 3 disks stay on A.')}},
 'fewest-coins':{main:'down',lead:L('Change one line, predict what the table says for the coins 1, 3 and 4 and the amount 6, then run it. The fewest is 2 coins: 3 + 3.'),
  changes:{down:L('Fill the table from amount down to 1'),zero:L('Start each best[v] at 0 instead of ∞'),first:L('Keep the first way found for v, without looking for a better one')},
  outcomes:{cannot:L('It says 6 cannot be paid'),zero:L('It says no coins are needed'),worse:L('It pays 6 with more coins than needed'),works:L('It still finds 2 coins')},
  why:{down:L('Filling from the top, best[6] is worked out first, while best[5], best[3] and best[2] are still ∞, so no way to pay 6 is found. Each entry needs the smaller entries to be final already.'),zero:L('No number of coins is less than 0, so best[v] never changes and every amount seems to need no coins. Starting at ∞ means “no way found yet”, which every real way beats.'),first:L('The smallest coin, 1, is tried first, so the first way found for v is always best[v − 1] + 1: one more coin of 1. The table just counts up, 6 coins for 6. Each entry must keep the best way, not the first.')}}};
function breaksCard(){const B=BREAK[cur.key],R=A.BREAKS[cur.key],bk=ev().breaks||{},ch=R.changes.includes(cur.breakChange)?cur.breakChange:R.changes[0],pd=R.outcomes.includes(cur.breakPred)?cur.breakPred:'';
 return card('kindBreak',!!bk[B.main]&&bk[B.main].pred===bk[B.main].actual,L('Break it on purpose'),`<p>${esc(tx(B.lead))}</p>
 <fieldset class="choices"><legend class="small-print muted">${esc(tx(L('Change')))}</legend>${R.changes.map(k=>`<label class="toggle"><input type="radio" name="bk-change" value="${k}"${k===ch?' checked':''}> ${esc(tx(B.changes[k]))}</label>`).join('')}</fieldset>
 <fieldset class="choices"><legend class="small-print muted">${esc(tx(L('Your prediction')))}</legend>${R.outcomes.map(k=>`<label class="toggle"><input type="radio" name="bk-pred" value="${k}"${k===pd?' checked':''}> ${esc(tx(B.outcomes[k]))}</label>`).join('')}</fieldset>
 <div class="row"><button type="button" class="primary" id="bk-go">${esc(tx(L('Run it')))}</button></div>
 <div class="result" id="bk-result" tabindex="-1">${cur.breakMsg?`<div class="fb no" role="alert">${esc(tx(L('Choose a change and a prediction first.')))}</div>`:''}${R.changes.filter(k=>bk[k]).map(k=>{const r=bk[k],ok=r.pred===r.actual,O=B.outcomes;return `<div class="fb ${ok?'ok':'no'}"><b>${esc(tx(B.changes[k]))}.</b> ${esc(tx(ok?L(`Your prediction matched: ${O[r.actual].en.toLowerCase()}.`):L(`You predicted “${O[r.pred].en.toLowerCase()}”, but ${O[r.actual].en.toLowerCase()}.`)))} ${esc(tx(B.why[k]))}</div>`;}).join('')}</div>`);}
function runBreak(){const ch=document.querySelector('input[name="bk-change"]:checked')?.value,pd=document.querySelector('input[name="bk-pred"]:checked')?.value;if(!ch||!pd){cur.breakMsg=true;renderChallenges('bk-result');return;}cur.breakMsg=false;
 const B=BREAK[cur.key],O=B.outcomes,actual=A.BREAKS[cur.key].run(ch),bk=ev().breaks||(ev().breaks={});bk[ch]={pred:pd,actual};cur.breakChange=ch;cur.breakPred='';
 record('breaks',L(B.changes[ch].en+' → '+O[pd].en),L(O[actual].en+(pd===actual?' ✓':'')));persist();renderChallenges('bk-result');document.querySelectorAll('input[name="bk-pred"]').forEach(r=>{r.checked=false;});renderRec();say(tx(O[actual])+'. '+tx(B.why[ch]));}

// Bottleneck: the learner picks a box in the flowchart; every box's run count is then shown.
const BOX={
 'bubble-sort':{pinit:L('set p ← 1'),pcheck:L('check the outer loop'),iinit:L('reset i ← 0'),icheck:L('check the inner loop'),cmp:L('compare neighbours'),swap:L('swap'),inc:L('move to the next pair'),pinc:L('end a pass'),done:L('finish')},
 hanoi:{base:L('check n = 0'),ret:L('return from an empty call'),call1:L('first call'),move:L('move a disk'),call2:L('second call'),end:L('finish a call')},
 bfs:{init:L('start the queue'),qcheck:L('check the queue'),take:L('take the front cell'),goal:L('check for G'),found:L('return the path'),nb:L('look for a free neighbour'),add:L('mark and add a neighbour'),nopath:L('report no path')},
 'fewest-coins':{init:L('start the table'),vcheck:L('check the amount loop'),inf:L('set best[v] ← ∞'),ccheck:L('try the next coin'),cmp:L('compare with best[v]'),upd:L('remember a better way'),vinc:L('move to the next amount'),read:L('read the coins back')},
 'insertion-sort':{init:L('set i ← 1'),icheck:L('check the outer loop'),take:L('take the next key'),wcheck:L('check the while loop'),shift:L('shift an item right'),place:L('put key in the gap'),inc:L('move to the next item'),done:L('finish')}};
function bottleCard(){const b=ev().bottle,on=cur.key==='hanoi'?L('With the current number of disks'):cur.key==='bfs'?L('On the current maze'):cur.key==='fewest-coins'?L('With the current coins and amount'):L('On the current list');return card('kindBottle',b&&b.ok,L('Where does the time go?'),`<p>${esc(tx(L(`${on.en}, which box in the flowchart runs the most times? Choose it in the flowchart above.`)))}</p><div class="row"><button type="button" class="primary" id="bn-go" aria-pressed="${cur.pick}">${esc(tx(cur.pick?L('Cancel'):L('Choose in the flowchart')))}</button></div><div class="result" id="bn-result" tabindex="-1">${b?bottleText(b):''}</div>`);}
function bottleMessage(b){const c=b.counts,names=BOX[cur.key],name=k=>tx(names[k]),max=Math.max(...Object.values(c)),top=Object.keys(c).find(k=>c[k]===max&&names[k]),n=c[b.node]??1;
 if(cur.key==='bubble-sort')return({
  icheck:L(`Yes. The inner loop check runs ${c.icheck} times: once before every comparison, plus once per pass to stop the loop. The comparison it guards runs ${c.cmp} times, even when nothing needs to move. The inner loop is where the time goes.`),
  inner:L(`Yes, this box is inside the inner loop: it runs ${c.cmp} times, once for every pair in every pass, even when nothing needs to move. Only the loop check beside it runs more (${c.icheck} times).`),
  'swap-tie':L(`On this list every comparison led to a swap (${c.swap} of each), but the inner loop check still runs more: ${c.icheck} times. On most lists, comparisons also happen when no swap is needed.`),
  swap:L(`Swaps run ${c.swap} times, but comparisons run ${c.cmp} times: every swap needs a comparison first. Look at what runs before every swap.`),
  max:L(`Yes. This box runs ${n} times, as often as any box on this input.`),
  outer:L(`That box runs only ${n} time${n===1?'':'s'}. Look inside the inner loop.`)})[b.verdict];
 if(cur.key==='hanoi'&&b.verdict==='max'&&b.node==='base')return L(`Yes. The n = 0 check runs ${c.base} times, once per call, and ${c.ret} of those calls, more than half, find nothing to move. Stopping at n = 1 instead would skip them and make the same ${c.move} moves.`);
 if(cur.key==='bfs'&&b.verdict==='max'&&b.node==='nb')return L(`Yes. Looking for a free neighbour runs ${c.nb} times: once for each neighbour added and once more per cell when none is left. Each cell taken looks at up to four neighbours, so this is where the time goes.`);
 if(cur.key==='fewest-coins'&&b.verdict==='max'&&b.node==='ccheck')return L(`Yes. Trying the next coin runs ${c.ccheck} times: once for each coin that fits each amount, plus once per amount when no coin is left. The comparison beside it runs ${c.cmp} times. The work grows with the amount times the number of coins.`);
 if(cur.key==='fewest-coins'&&b.verdict==='inner')return L(`Yes, this is the heart of the inner loop: the comparison runs ${c.cmp} times, once for each coin that fits each amount. Only the loop check beside it runs more (${c.ccheck} times).`);
 if(b.verdict==='max'){if(b.node==='wcheck')return L(`Yes. The while check runs ${c.wcheck} times: once before every shift (${c.shift}), plus once for each item when it stops. On a list that is far from sorted, this is where the time goes.`);
  if(b.node==='icheck'&&c.shift===0)return L(`Yes, on this list. It is already sorted, so no item moves: the while check runs only ${c.wcheck} times, once per item, and the outer loop check runs ${c.icheck} times. Try a list in decreasing order and count again.`);
  return L(`Yes. This box runs ${n} times, as often as any box on this input.`);}
 if(b.verdict==='shift')return L(`Shifts run ${c.shift} times, but the while check runs ${c.wcheck} times: it runs before every shift, and once more for each item when it stops.`);
 return L(`That box runs ${n} time${n===1?'':'s'}. The box that runs most on this input is “${names[top].en}”, with ${max} runs.`);}
function bottleText(b){const names=BOX[cur.key],rows=Object.entries(b.counts).filter(([k])=>names[k]).sort((x,y)=>y[1]-x[1]);
 const what=cur.key==='hanoi'?L(`Disks: ${b.list[0]}`):cur.key==='bfs'?L('The maze these counts come from:'):cur.key==='fewest-coins'?L(`Coins: ${b.list.slice(1).join(', ')} · amount: ${b.list[0]}`):L(`List: ${b.list.join(', ')}`);
 return `<p class="small-print muted">${esc(tx(what))}</p>${b.inputText!=null?mazeGrid([...A.parseMaze(b.inputText)].map((ch,i)=>`<div class="mc${ch==='#'?' wall':ch==='~'?' mud':''}">${i===A.START?'S':i===A.GOAL?'G':''}</div>`),'small')+'':''}<div class="tablewrap" tabindex="0"><table><thead><tr><th scope="col">${esc(tx(L('Box')))}</th><th scope="col">${esc(tx(L('Runs')))}</th></tr></thead><tbody>${rows.map(([k,v])=>`<tr${k===b.node?' class="last"':''}><td>${esc(tx(names[k]))}</td><td>${v}</td></tr>`).join('')}</tbody></table></div><div class="fb ${b.ok?'ok':'no'}">${esc(tx(bottleMessage(b)))}</div>`;}
function chooseBox(node){let list=[],counts,verdict,ok,inputText;
 if(cur.key==='bubble-sort'||cur.key==='insertion-sort'){list=[...cur.input.list];counts=A.boxCounts(cur.key,list);if(cur.key==='bubble-sort'){verdict=A.judgeBottleneck(node,counts);ok=['icheck','inner','max'].includes(verdict);}else{verdict=A.judgeInsertionBox(node,counts);ok=verdict==='max';}}
 else{counts=A.traceCounts(cur.key,cur.input);delete counts.start;const max=Math.max(...Object.values(counts));verdict=counts[node]===max?'max':cur.key==='fewest-coins'&&node==='cmp'&&counts.cmp>0&&Object.entries(counts).every(([k,v])=>k==='ccheck'||v<=counts.cmp)?'inner':'low';ok=verdict!=='low';if(cur.key==='hanoi')list=[cur.input.disks];else if(cur.key==='fewest-coins')list=[cur.input.amount,...cur.input.coins];else inputText=cur.input.maze;}
 cur.pick=false;const b={node,ok,verdict,counts,list};if(inputText!==undefined)b.inputText=inputText;ev().bottle=b;record('bottle',cur.key==='hanoi'?L(`${list[0]} disks`):cur.key==='fewest-coins'?L(`Coins ${list.slice(1).join(', ')}, amount ${list[0]}`):inputText!==undefined?L('Maze, row by row: '+inputText.match(/.{7}/g).join(' / ')):list.join(', '),L(BOX[cur.key][node].en+(ok?' ✓':'')));persist();renderBench();renderChallenges('bn-result');renderRec();
 $('bn-result').scrollIntoView({block:'nearest',behavior:reduced()?'instant':'smooth'});say(tx(bottleMessage(b)));}

// Improvements, each tested on many inputs.
const BUILD_HINTS=[L('Look at the middle item first.'),L('If the middle item is smaller than the target, every item to its left is smaller too, so they can all be skipped.'),L('After checking mid, do not check it again: move low to mid + 1 or high to mid − 1.'),L('One working order: mid ← …, then the equality test, then the rule that moves low or high, with the loop running while low ≤ high.')];
function builderCard(){const b=ev().built,s=state.builder,sel=(id,opts,v,label)=>`<select id="${id}" aria-label="${esc(tx(label))}">${opts.map((o,i)=>`<option value="${i}"${i===v?' selected':''}>${esc(o)}</option>`).join('')}</select>`,steps=A.BUILD.steps[lc()];
 return card('kindImprove',b&&b.passed===b.total,L('Faster on a sorted list'),`<p>${esc(tx(L('The list is sorted. Build a search from these blocks that checks fewer items than linear search.')))}</p>
 <div class="builder" data-no-frac><div class="row">low ← 0,  high ← n − 1</div><div class="row">${tx(L('while'))} ${sel('b-cond',A.BUILD.cond[lc()],s.cond,L('Loop condition'))}:</div>${[0,1,2].map(i=>`<div class="row"><span class="ind"></span>${sel('b-slot'+i,steps,s.slots[i],L(`Step ${i+1} inside the loop`))}</div>`).join('')}<div class="row">${tx(L('return −1'))}</div></div>
 <div class="row"><button type="button" class="primary" id="b-test">${esc(tx(L('Test it on 300 lists')))}</button><button type="button" id="b-hint"${s.hint>=BUILD_HINTS.length?' disabled':''}>${esc(tx(s.hint<BUILD_HINTS.length?L('Teach me: give a hint'):L('No more hints')))}</button></div>
 ${s.hint?`<ol class="hints">${BUILD_HINTS.slice(0,s.hint).map(h=>`<li>${esc(tx(h))}</li>`).join('')}</ol>`:''}<div class="result" id="b-result" tabindex="-1">${b?builtText(b):''}</div>`);}
function builtSummary(r){if(r.passed===r.total)return L(`Passed ${r.passed} of ${r.total} lists. Worst case: ${r.worst} checks for 100 items, against ${r.linWorst} for linear search; on average ${r.avg} against ${r.linAvg}.`);
 const f=r.fail,shown=f.list.length>10?`[${f.list.slice(0,5).join(', ')}, …, ${f.list.slice(-2).join(', ')}] (${f.list.length})`:`[${f.list.join(', ')}]`;
 const why=f.error==='unset'?L('mid is used before it has a value'):f.error==='outside'?L('mid points outside the list'):f.error==='stuck'?L('it never stops: low and high stop changing'):L(`it returned ${f.got}`);
 return L(`Passed ${r.passed} of ${r.total} lists. First failure: list ${shown}, target ${f.target}. Expected ${f.want}, but ${why.en}.`);}
function builtText(r){return `<div class="fb ${r.passed===r.total?'ok':'no'}">${esc(tx(builtSummary(r)))}</div>`;}
function testBuilder(){const cond=+$('b-cond').value,slots=[0,1,2].map(i=>+$('b-slot'+i).value);state.builder.cond=cond;state.builder.slots=slots;
 const r={...A.testBuilder(cond,slots),hints:state.builder.hint};ev().built=r;const B=A.BUILD;record('built',L(`while ${B.cond.en[cond]}: ${slots.map(s=>B.steps.en[s]).join(' | ')}`),builtSummary(r));persist();renderChallenges('b-result');renderRec();say(tx(builtSummary(r)));}

const IMPROVE={
 quicksort:{kind:'pivot',title:L('A better pivot'),lead:L('Choose which item of each range becomes the pivot, then test it on random, sorted and reversed lists of 64 items.'),
  options:[L('The last item (as taught)'),L('The middle item'),L('A random item'),L('The first item')],
  cols:[L('List'),L('Ended sorted'),L('Comparisons before'),L('Comparisons now')],names:{random:L('Random'),sorted:L('Sorted'),reversed:L('Reversed')},
  run:v=>({kind:'pivot',...A.testPivot(v)}),ok:r=>(r.v===1||r.v===2)&&r.correct,
  message:r=>{const row=k=>r.rows.find(x=>x[0]===k)[3],lo=Math.min(...r.rows.map(x=>x[3])),hi=Math.max(...r.rows.map(x=>x[3]));return[
   L(`This is quicksort as taught: ${row('sorted')} comparisons on sorted and on reversed lists, because every pivot is the largest or the smallest item of its range.`),
   L(`Sorted lists drop to ${row('sorted')} comparisons and reversed lists to ${row('reversed')}, while random lists stay about the same. The middle item suits these two orders, but other orders can still make it slow.`),
   L(`Every kind of list now takes about the same work: ${lo} to ${hi} comparisons on average. A random pivot makes the slow case unlikely for every list, whatever its order. Lists with many equal items stay slow with this partition.`),
   L(`The first item is as bad a pivot as the last: sorted and reversed lists still need ${row('sorted')} comparisons.`)][r.v];}},
 dijkstra:{kind:'dijkstop',title:L('Stop sooner?'),lead:L('The question is only the distance from the start to the goal. Choose when to stop, then test it on 300 maps: the six towns with random lengths, a street grid of 35 corners, and maps of 40 towns.'),
  options:[L('Finish every town (as taught)'),L('Stop as soon as the goal is finished'),L('Stop as soon as the goal first gets a distance'),L('Finish the towns in the order they were first reached, as BFS does')],
  cols:[L('Maps'),L('Right distance'),L('Towns finished before'),L('Towns finished now')],names:{map:L('Six towns'),grid:L('Street grid'),large:L('40 towns')},
  run:v=>({kind:'dijkstop',...A.testDijkstraStop(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const row=k=>r.rows.find(x=>x[0]===k);if(r.v===0)return L('This is Dijkstra’s method as taught: it finishes every town, which also gives the shortest distance to each of them.');
   if(r.v===1)return L(`Right on every map, with fewer towns finished: ${row('large')[3]} instead of ${row('large')[2]} on maps of 40 towns. Once the goal is finished its distance is final, so the rest of the work cannot change the answer.`);
   if(r.v===2)return L('Some distances are too long: the first distance the goal gets can still be lowered by a route found later.');
   return L('Some distances are too long: finishing towns in the order they were reached can finish a town before its shortest route is found. BFS gets away with this only because every step costs the same.');}},
 kruskal:{kind:'kstop',title:L('Stop sooner?'),lead:L('Choose a change to Kruskal’s method, then test it on 300 maps: the six towns with random lengths, 30 towns with few roads, and 15 towns where every two are joined.'),
  options:[L('Look at every road (as taught)'),L('Stop as soon as n − 1 roads are kept'),L('Keep each town’s shortest road'),L('Keep the n − 1 shortest roads')],
  cols:[L('Maps'),L('Cheapest network'),L('Roads looked at before'),L('Roads looked at now')],names:{map:L('Six towns'),sparse:L('30 towns, few roads'),dense:L('15 towns, every pair')},
  run:v=>({kind:'kstop',...A.testKruskalStop(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const row=k=>r.rows.find(x=>x[0]===k);if(r.v===0)return L('This is Kruskal’s method as taught: it looks at every road, even after every town is joined.');
   if(r.v===1)return L(`Right on every map. A tree on n towns has n − 1 roads, so once that many are kept every remaining road would be skipped: ${row('dense')[3]} roads looked at instead of ${row('dense')[2]} when every two of 15 towns are joined. Sorting all the roads still comes first.`);
   if(r.v===2)return L('Often wrong: each town’s shortest road belongs to a cheapest network, but on their own these roads can leave the towns in separate pieces.');
   return L('Often wrong: the n − 1 shortest roads can close a loop and leave a town out.');}},
 'subset-sum':{kind:'prune',title:L('Cut the search'),lead:L('Choose a shortcut, then test it on 300 lists of 12 numbers: targets that some subset reaches, targets that none can reach, and numbers up to 1,000.'),
  options:[L('Try every subset (as taught)'),L('Sort the numbers, build each subset one number at a time, and drop it as soon as its sum passes the target'),L('Try only subsets of at most 3 numbers'),L('Take the largest numbers that still fit')],
  cols:[L('Lists'),L('Right answer'),L('Subsets tried before'),L('Subsets tried now')],names:{reach:L('Target reachable'),none:L('No answer'),big:L('Numbers up to 1,000')},
  run:v=>({kind:'prune',...A.testSubset(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const row=k=>r.rows.find(x=>x[0]===k);if(r.v===0)return L('This is the method as taught: when no subset works, it tries all 4,096 subsets of 12 numbers.');
   if(r.v===1)return L(`Right every time, with fewer subsets tried: ${row('reach')[3]} instead of ${row('reach')[2]} on average when the target is reachable, and ${row('none')[3]} instead of 4,096 when it is not. Dropping a subset is safe because every number is positive and the numbers are sorted, so every later number would pass the target too. In the worst case the count still doubles with each extra number.`);
   if(r.v===2)return L('Some answers are missed: sometimes only a subset of four or more numbers works.');
   return L('Some answers are missed: as with greedy change, taking the largest numbers first never undoes a choice.');}},
 'find-max':{kind:'minmax',title:L('Largest and smallest together'),lead:L('You need both the largest and the smallest number. Choose a method, then test it on random, increasing and decreasing lists of 100 items.'),
  options:[L('Find the maximum, then make a second pass for the minimum'),L('Take the items in pairs: compare the two, then the larger with the maximum and the smaller with the minimum'),L('One pass: compare an item with the minimum only when it is not a new maximum')],
  cols:[L('List'),L('Correct'),L('Two passes'),L('Yours')],names:{random:L('Random'),increasing:L('Increasing'),decreasing:L('Decreasing')},
  run:v=>({kind:'minmax',...A.testMinMax(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>[L('This is the starting point: 198 comparisons on every list, two for each item after the first. Can you save some?'),L('Correct on every list, with 148 comparisons instead of 198 on each kind: about 3n/2 instead of 2n. Each pair costs 3 comparisons instead of 4.'),L('Correct on every list. It saves a lot on increasing lists (99) but nothing on decreasing ones (198): the worst case is unchanged.')][r.v]},
 'binary-search':{kind:'first',title:L('The first of repeated items'),lead:L('With repeated numbers, binary search can return any of their positions. Choose a change that always returns the first one, then test it on 300 sorted lists of 50 items.'),
  options:[L('Return mid as soon as a[mid] = target (as taught)'),L('When a[mid] = target, remember mid and keep searching the left half'),L('When a[mid] = target, step left one item at a time while the item before is also the target'),L('When a[mid] = target, remember mid and keep searching the right half')],
  cols:[L('List'),L('First position'),L('Most checks before'),L('Most checks now')],names:{repeats:L('Many repeats'),equal:L('All equal'),distinct:L('All different')},
  run:v=>({kind:'first',...A.testFirst(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const most=Math.max(...r.rows.map(x=>x[3])),eq=r.rows.find(x=>x[0]==='equal')[3];return[L('As taught, it returns one of the matching positions, often not the first. Change what happens on a match.'),L(`Always the first position, with at most ${most} checks for 50 items: still about log₂ n.`),L(`Always the first position, but stepping left takes up to ${eq} checks when many items are equal: the worst case grows like n again.`),L('It returns the last matching position, not the first.')][r.v];}},
 'merge-sort':{kind:'mergeskip',title:L('Skip what is already in order'),lead:L('Choose a change to merge sort, then test it on random, nearly sorted and reversed lists of 64 items.'),
  options:[L('No change (as taught)'),L('Before a merge, compare the last item of the left run with the first of the right run; if they are in order, skip the merge'),L('Compare only the first items of the two runs, then put one whole run before the other')],
  cols:[L('List'),L('Sorted'),L('Before'),L('Yours')],names:{random:L('Random'),nearly:L('Nearly sorted'),reversed:L('Reversed')},
  run:v=>({kind:'mergeskip',...A.testMergeImprove(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const row=k=>r.rows.find(x=>x[0]===k);if(!r.correct)return L('Some lists end up unsorted: deciding from the first items alone cannot interleave two runs.');if(r.v===0)return L('This is merge sort as taught. Random lists need the most comparisons; nearly sorted and reversed lists need fewer, because one run is often used up early.');
   return L(`Correct on every list. Nearly sorted lists drop from ${row('nearly')[2]} to ${row('nearly')[3]} comparisons, but random and reversed lists pay for the extra check: ${row('random')[3]} and ${row('reversed')[3]} instead of ${row('random')[2]} and ${row('reversed')[2]}. A change can help one kind of input and cost another.`);}},
 dfs:{kind:'dfsimp',title:L('Head toward the goal'),lead:L('Choose an order for trying neighbours, then test it on 300 mazes: open, with few walls and with many.'),
  options:[L('Up, right, down, left (as taught)'),L('Take the free neighbour closest to G first'),L('Look only right and down, since G is down and to the right')],
  cols:[L('Mazes'),L('Right answer'),L('Cells marked before'),L('Cells marked now')],names:{open:L('Open'),sparse:L('Few walls'),dense:L('Many walls')},
  run:v=>({kind:'dfsimp',...A.testDfsImprove(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>!r.correct||r.v===2?L('Some mazes got the wrong answer: when the only way round goes up or left, looking only right and down misses it.'):r.v===0?L('This is DFS as taught.'):L('Right on every maze, and fewer cells are marked on average. It is only a guess about where G is: a maze can still fool it, and its path is still not always the shortest.')},
 'greedy-change':{kind:'change',title:L('Divide instead of subtracting'),lead:L('With coins of 25, 10, 5 and 1, choose a change and test it on 300 amounts, from small to very large.'),
  options:[L('Subtract one coin at a time (as taught)'),L('For each coin c, take ⌊amount / c⌋ coins at once and keep the remainder'),L('Use only the largest coin, as many times as it fits')],
  cols:[L('Amounts'),L('Same coins'),L('Steps before'),L('Steps now')],names:{small:L('Up to 99'),medium:L('100 to 9,999'),large:L('10,000 to 999,999')},
  run:v=>({kind:'change',...A.testChange(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>!r.correct?L('Often wrong: whatever is left after the largest coin is never paid.'):r.v===0?L('This is the method as taught: one subtraction per coin, so large amounts take many steps.'):L('The same coins every time, in 4 steps whatever the amount: one division per kind of coin. It is the same idea as the remainder in Euclid’s algorithm.')},
 euclid:{kind:'euclid',title:L('From subtraction to remainders'),lead:L('Euclid’s own method subtracts the smaller number from the larger until the two are equal. Choose a change, then test it on 200 random pairs below 1,000.'),
  options:[L('Keep subtracting the smaller number (the original method)'),L('Replace all the subtractions by one remainder: a mod b'),L('Subtract 1 from the larger number instead'),L('Halve the larger number whenever it is even')],
  run:v=>({kind:'euclid',...A.testEuclidVariant(v)}),ok:r=>r.v===1&&r.ok===r.total,
  message:r=>{if(r.ok===r.total)return r.v===1?L(`Correct on all ${r.total} pairs, with ${r.mine} steps on average instead of ${r.base}. One remainder does the work of many subtractions in a row.`):L(`Correct on all ${r.total} pairs, with ${r.mine} steps on average. This is the starting point: when one number is much bigger, it subtracts the same number again and again.`);
   const f=r.fail,why=r.v===2?L('Subtracting 1 does not keep the common divisors.'):L('Halving one number is safe only when the other is odd. When both are even, it removes a factor of 2 that they share.');
   return L(`Only ${r.ok} of ${r.total} pairs gave the greatest common divisor. First failure: for (${f.a}, ${f.b}) the answer is ${f.want}, but this method gave ${f.got??'no answer'}. ${why.en}`);}},
 'bubble-sort':{kind:'bubble',title:L('Less comparing'),lead:L('Choose changes to bubble sort, then test them on random, nearly sorted and reversed lists of 50 items.'),
  checks:[['early',L('Stop as soon as a pass makes no swaps')],['skip2',L('Compare a[i] with a[i + 2] to move faster')],['back',L('Run each pass from right to left')]],
  cols:[L('List'),L('Sorted'),L('Before'),L('Yours')],names:{random:L('Random'),nearly:L('Nearly sorted'),reversed:L('Reversed')},
  run:o=>({kind:'bubble',...A.testImprove(o)}),ok:r=>r.correct&&r.early,
  message:r=>!r.correct?L('Some lists did not end up sorted. Comparing a[i] with a[i + 2] never compares direct neighbours, so two neighbours can stay out of order.'):r.early?L('Correct on every list. Stopping early saves a lot on nearly sorted lists, but nothing on reversed ones: every pass still finds a swap. The worst case is unchanged.'):L('Correct, but the comparisons did not drop. Which pass could tell you that the list is already sorted?')}};
function improveCard(){const c=IMPROVE[cur.key],r=ev().improve;let controls;
 if(c.kind==='bubble'){const o=state.improveOpts;controls=c.checks.map(([k,label])=>`<label class="toggle"><input type="checkbox" id="im-${k}"${o[k]?' checked':''}> ${esc(tx(label))}</label>`).join('');}
 else{const chosen=r?r.v:0;controls=`<fieldset class="choices"><legend class="sr">${esc(tx(c.title))}</legend>${c.options.map((o,i)=>`<label class="toggle"><input type="radio" name="im-v" value="${i}"${i===chosen?' checked':''}> ${esc(tx(o))}</label>`).join('')}</fieldset>`;}
 return card('kindImprove',r&&c.ok(r),c.title,`<p>${esc(tx(c.lead))}</p>${controls}<div class="row"><button type="button" class="primary" id="im-go">${esc(tx(L('Test my version')))}</button></div><div class="result" id="im-result" tabindex="-1">${r?improveText(c,r):''}</div>`);}
function improveText(c,r){const msg=`<div class="fb ${c.ok(r)?'ok':'no'}">${esc(tx(c.message(r)))}</div>`;if(!r.rows)return msg;
 return `<div class="tablewrap" tabindex="0"><table><thead><tr>${c.cols.map(h=>`<th scope="col">${esc(tx(h))}</th>`).join('')}</tr></thead><tbody>${r.rows.map(([k,ok,b,m])=>`<tr><td>${esc(tx(c.names[k]||k))}</td><td>${ok}/100</td><td>${b}</td><td>${m}</td></tr>`).join('')}</tbody></table></div>`+msg;}
function testImprove(){const c=IMPROVE[cur.key];let arg,input;
 if(c.kind==='bubble'){arg=Object.fromEntries(c.checks.map(([k])=>[k,$('im-'+k).checked]));state.improveOpts=arg;const on=c.checks.filter(([k])=>arg[k]).map(([,l])=>l);input=L(on.map(l=>l.en).join(' + ')||'(no change)');}
 else{const v=document.querySelector('input[name="im-v"]:checked');arg=v?+v.value:0;input=c.options[arg];}
 const r=c.run(arg);ev().improve=r;record('improve',input,c.message(r));persist();renderChallenges('im-result');renderRec();say(tx(c.message(r)));}

function cplxCard(){const c=A.CPLX[cur.key],r=ev().cplx;return card('kindCost',r&&r.ok,U.cplxTitle,`<p>${esc(tx(c.q))}</p><div class="opts row">${tx(c.options).map((o,i)=>`<button type="button" data-cx="${i}"${r?' disabled':''}${r&&r.choice===i?' aria-pressed="true"':''}>${esc(o)}</button>`).join('')}</div><div class="result" id="cplx-result" tabindex="-1">${r?`<div class="fb ${r.ok?'ok':'no'}">${esc(u(r.ok?'yes':'notQuite'))} ${esc(tx(c.why))}</div><button type="button" class="quiet" id="cx-again">${esc(u('again'))}</button>`:''}</div>`);}
function answerCplx(i){const c=A.CPLX[cur.key],ok=i===c.answer;ev().cplx={ok,choice:i};record('cplx',L(c.options.en[i]),L(c.options.en[i]+(ok?' ✓':'')));persist();renderChallenges('cplx-result');renderRec();say($('cplx-result').textContent);}

function renderChallenges(focusId){$('think-title').textContent=u('think');$('think-lead').textContent=tx(LEADS[cur.key]);
 const box=$('challenges'),active=box.contains(document.activeElement)?document.activeElement.id:null;
 const drafts=box.dataset.drafts===cur.key?[...box.querySelectorAll('input,select')].map(el=>({id:el.id,name:el.name,value:el.value,checked:el.checked,type:el.type})):[];
 const make={idea:ideaCard,counter:counterCard,bottle:bottleCard,builder:builderCard,breaks:breaksCard,first:improveCard,mergeskip:improveCard,dfsimp:improveCard,change:improveCard,minmax:improveCard,bubble:improveCard,euclid:improveCard,pivot:improveCard,dijkstop:improveCard,kstop:improveCard,prune:improveCard,cplx:cplxCard};
 box.innerHTML=CARDS[cur.key].map(k=>make[k]()).join('');box.dataset.drafts=cur.key;
 for(const d of drafts){const el=d.type==='radio'?box.querySelector(`input[name="${d.name}"][value="${d.value}"]`):d.id?$(d.id):null;if(!el||!box.contains(el))continue;if(d.type==='radio'||d.type==='checkbox')el.checked=d.checked;else el.value=d.value;}
 const target=focusId&&$(focusId)||active&&$(active);if(target&&!target.disabled)target.focus();}

/* ---------------- Recommendation ---------------- */
function currentRec(){const e={...state.evidence[cur.key],idea:!!(state.ideas[cur.key]||'').trim()};return A.recommend(cur.key,e,state.pred[cur.key]);}
function renderRec(){const r=currentRec();renderMap(r.num);
 const planned=n=>n>=12?u('plannedUni'):u('plannedHigh');
 $('recbox').innerHTML=`<div class="rec-head"><h2 id="rec-title">${esc(u('recTitle'))}</h2><span class="eyebrow">${esc(u('recBasis'))}</span></div>
 <div class="pick"><span class="big">${esc(tx(r.title))}</span>${r.key&&r.key!==cur.key?`<button type="button" class="primary" data-go="${r.key}">${esc(u('openN',{n:r.num}))}</button>`:''}</div><p>${esc(tx(r.why))}</p>
 <div><span class="eyebrow">${esc(u('evidence'))}</span><div class="evid">${r.items.length?r.items.map(i=>`<span class="${i.good?'good':''}">${esc(tx(i.text))}</span>`).join(''):`<span>${esc(u('nothing'))}</span>`}</div></div>
 ${r.alt.length?`<div><span class="eyebrow">${esc(u('others'))}</span><ul>${r.alt.map(([n,t,why])=>`<li>${esc(tx(t))}: ${esc(tx(why))}${A.NUM[n]?` <button type="button" class="quiet" data-go="${A.NUM[n]}">${esc(u('open'))}</button>`:` (${esc(planned(n))})`}</li>`).join('')}</ul></div>`:''}
 <p class="muted small-print">${esc(u('anyNote'))}</p>`;}

/* ---------------- Session record ---------------- */
function totals(){let asked=0,matched=0,evid=0,ideas=0;for(const k of A.ORDER){const p=state.pred[k];if(p){asked+=p.asked;matched+=p.matched;}const e=state.evidence[k];if(e)evid+=Object.keys(e).length;if((state.ideas[k]||'').trim())ideas++;}return{asked,matched,evid,ideas};}
function touched(k){return !!(state.pred[k]||state.evidence[k]&&Object.keys(state.evidence[k]).length||(state.ideas[k]||'').trim()||state.log.some(x=>x.alg===k));}
function recFor(k){const e={...state.evidence[k],idea:!!(state.ideas[k]||'').trim()};return A.recommend(k,e,state.pred[k]);}
const when=t=>window.QuidenceI18n?.date?window.QuidenceI18n.date(t):t;
function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;$('close-modal').setAttribute('aria-label',u('close'));if(!$('modal').open)$('modal').showModal();}
function showSession(){const t=totals();let body='';
 for(const k of A.ORDER){if(!touched(k))continue;const a=A.ALGS[k],r=recFor(k),idea=state.ideas[k]||'',log=state.log.filter(x=>x.alg===k);
  body+=`<section class="session-alg"><h3>#${a.num} ${esc(tx(a.name))}</h3><div class="evid">${r.items.map(i=>`<span class="${i.good?'good':''}">${esc(tx(i.text))}</span>`).join('')}</div><p class="small-print">${esc(u('suggested',{t:tx(r.title)}))}</p>
  ${idea.trim()?`<h4>${esc(u('yourIdea'))}</h4><p class="student-work" data-no-translate>${esc(idea)}</p>`:''}
  ${log.length?`<details><summary>${esc(u('history'))} (${log.length})</summary><p class="small-print muted">${esc(u('historyNote'))}</p><ul class="history">${log.map(x=>`<li><span class="muted">${esc(when(x.time))} · ${esc(tx(U.kinds[x.kind]||x.kind))}</span><br><span class="student-work" data-no-translate>${esc(tx(x.input))}</span><br>${esc(tx(x.summary))}</li>`).join('')}</ul></details>`:''}</section>`;}
 showModal(u('sessionTitle'),`<p>${esc(u('sessionLead'))}</p><div class="summary-stats"><div><span>${esc(u('ofN',{m:t.matched,a:t.asked}))}</span>${esc(u('statPred'))}</div><div><span>${t.evid}</span>${esc(u('statEvidence'))}</div><div><span>${t.ideas}</span>${esc(u('statIdeas'))}</div></div>${body||`<p>${esc(u('noWork'))}</p>`}
 <div class="modal-actions"><button type="button" class="primary" id="export">${esc(u('export'))}</button>${blockedOriginal!==null?`<button type="button" id="export-original">${esc(u('exportOriginal'))}</button>`:''}<button type="button" id="reset-open">${esc(u('reset'))}</button></div>`);}
function showReset(){showModal(u('resetTitle'),`<p>${esc(u('resetLead'))}</p><div class="modal-actions"><button type="button" id="export">${esc(u('exportCurrent'))}</button>${blockedOriginal!==null?`<button type="button" id="export-original">${esc(u('exportOriginal'))}</button>`:''}<button type="button" class="primary" id="reset-confirm">${esc(u('resetConfirm'))}</button><button type="button" id="reset-cancel">${esc(u('keep'))}</button></div>`);}
function sessionMarkdown(){let text=`# Quidence · ${u('mdTitle')}\n\n${u('mdLead')}\n`;if(saveBlocked||!storeAvailable)text+=`\n${u('mdUnsaved')}\n`;
 for(const k of A.ORDER){if(!touched(k))continue;const a=A.ALGS[k],r=recFor(k),p=state.pred[k],idea=state.ideas[k]||'',log=state.log.filter(x=>x.alg===k);
  text+=`\n## #${a.num} ${tx(a.name)}\n\n`;if(p)text+=`${u('mdPred',{m:p.matched,a:p.asked})}\n\n`;
  for(const i of r.items)if(!p||i!==r.items[0])text+=`- ${tx(i.text)}\n`;text+=`\n${u('suggested',{t:tx(r.title)})}\n`;
  if(idea.trim())text+=`\n### ${u('yourIdea')}\n\n${idea}\n`;
  if(log.length){text+=`\n### ${u('history')}\n\n${u('historyNote')}\n`;for(const x of log)text+=`\n- ${when(x.time)} · ${tx(U.kinds[x.kind]||x.kind)}\n  ${u('mdInput')}: ${tx(x.input)}\n  ${tx(x.summary)}\n`;}}
 return text;}
function downloadNotes(text,name,type){try{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;}catch{toast(u('downloadFailed'));return false;}}
function exportSession(){persist();if(downloadNotes(sessionMarkdown(),'Quidence-algorithms-session.md','text/markdown;charset=utf-8'))toast(u('exported'));}
function exportOriginal(){if(blockedOriginal===null)return;let json=true;try{JSON.parse(blockedOriginal);}catch{json=false;}if(downloadNotes(blockedOriginal,'Quidence-algorithms-saved-original.'+(json?'json':'txt'),json?'application/json':'text/plain;charset=utf-8'))toast(u('exportedOriginal'));}
function resetAll(){if(saveBlocked){try{if(storage.getItem(KEY)!==lastStored){toast(u('resetChanged'));return;}storage.removeItem(KEY);blockedOriginal=null;lastStored=null;saveBlocked=false;}catch{toast(u('resetFailed'));return;}}
 const keep=cur.key;state=blank();state.alg=keep;persist();cur.input=defaults();build();renderAll();$('modal').close();toast(u('cleared'));}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}

/* ---------------- Wiring ---------------- */
function renderAll(){renderTabs();renderBench();renderChallenges();renderRec();$('alg').setAttribute('aria-label',u('workbench'));$('map-title').textContent=u('mapTitle');$('map-note').textContent=u('mapNote');$('map').setAttribute('aria-label',u('mapScroll'));$('review-session').textContent=u('review')+' ↗';status(statusKey);}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled||!$('app').contains(b)&&!$('modal').contains(b)&&b.id!=='session')return;
 if(b.dataset.alg)openAlg(b.dataset.alg);else if(b.dataset.go)openAlg(b.dataset.go,true);
 else if(b.id==='b-next')next();else if(b.id==='b-back')back();else if(b.id==='b-reset'){stop();build();renderBench();renderRec();$('announce').textContent='';}
 else if(b.id==='b-play'){if(cur.playing){stop();renderBench();}else play();}
 else if(b.id==='b-force'){cur.forcePredict=true;cur.pending=true;renderBench();}
 else if(b.id==='b-skipone'){cur.pending=false;cur.forcePredict=false;advance();focusNext();if(cur.playing)schedule();}
 else if(b.dataset.opt!==undefined)answer(+b.dataset.opt);
 else if(b.dataset.lang){state.lang=b.dataset.lang;persist();renderBench();}
 else if(b.id==='b-teach'){cur.teach=cur.teach>=0?-1:0;renderBench();}else if(b.id==='t-prev'){cur.teach--;renderBench();}else if(b.id==='t-next'){cur.teach++;renderBench();}
 else if(b.id==='in-apply')applyInput();else if(b.id==='in-random')randomInput();
 else if(b.id==='in-edit'){cur.editWalls=!cur.editWalls;stop();renderBench();$('in-edit').focus();}else if(b.id==='in-clear')setMaze('');else if(b.id==='in-default')setMaze(alg().defaults.maze);else if(b.dataset.cell)toggleWall(+b.dataset.cell);
 else if(b.id==='cx-go')checkCounter();else if(b.dataset.why!==undefined)answerWhy(+b.dataset.why);else if(b.id==='why-again'){ev().counter.why=null;persist();renderChallenges();renderRec();}
 else if(b.id==='bn-go'){cur.pick=!cur.pick;stop();renderBench();renderChallenges();if(cur.pick){$('flow').scrollIntoView({block:'center',behavior:reduced()?'instant':'smooth'});document.querySelector('#flow .fn.pick')?.focus();say(u('pickNote'));}}
 else if(b.id==='b-test')testBuilder();else if(b.id==='b-hint'){state.builder.hint=Math.min(BUILD_HINTS.length,state.builder.hint+1);persist();renderChallenges();}
 else if(b.id==='im-go')testImprove();else if(b.id==='bk-go')runBreak();else if(b.dataset.cxCell)cycleCell(+b.dataset.cxCell);else if(b.dataset.cx!==undefined)answerCplx(+b.dataset.cx);else if(b.id==='cx-again'){delete ev().cplx;persist();renderChallenges();renderRec();}
 else if(b.id==='session'||b.id==='review-session')showSession();else if(b.id==='close-modal')$('modal').close();
 else if(b.id==='export')exportSession();else if(b.id==='export-original')exportOriginal();else if(b.id==='reset-open')showReset();else if(b.id==='reset-cancel')showSession();else if(b.id==='reset-confirm')resetAll();});
document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('#map [data-open]');if(g)openAlg(g.dataset.open,true);const n=e.target.closest&&e.target.closest('#flow .fn.pick');if(n)chooseBox(n.dataset.node);});
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const g=e.target.closest&&e.target.closest('#map [data-open]');if(g){e.preventDefault();openAlg(g.dataset.open,true);return;}const n=e.target.closest&&e.target.closest('#flow .fn.pick');if(n){e.preventDefault();chooseBox(n.dataset.node);}});
document.addEventListener('keydown',e=>{const b=e.target.closest&&e.target.closest('button[data-cell],button[data-cx-cell]');if(!b||!/^Arrow/.test(e.key))return;e.preventDefault();const card=b.dataset.cxCell!==undefined,i=+(card?b.dataset.cxCell:b.dataset.cell),d={ArrowUp:-A.GC,ArrowDown:A.GC,ArrowLeft:-1,ArrowRight:1}[e.key];
 for(let j=i+d;j>=0&&j<A.GN&&!(Math.abs(d)===1&&Math.floor(j/A.GC)!==Math.floor(i/A.GC));j+=d){const el=$((card?'cx-cell-':'cell-')+j);if(el){b.tabIndex=-1;el.tabIndex=0;el.focus();if(card)cur.lastCxCell=j;else cur.lastCell=j;break;}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur.pick){cur.pick=false;renderBench();renderChallenges();$('bn-go')?.focus();}});
document.addEventListener('change',e=>{if(e.target.id==='in-disks')applyInput();else if(e.target.name==='bk-change')cur.breakChange=e.target.value;else if(e.target.name==='bk-pred')cur.breakPred=e.target.value;else if(e.target.id==='skip'){state.skip[cur.key]=e.target.checked;cur.pending=false;cur.forcePredict=false;persist();renderBench();if(cur.playing)schedule();}});
document.addEventListener('input',e=>{if(e.target.id==='idea'){const v=e.target.value;state.ideas[cur.key]=v;const s=$('idea-s');if(s)s.textContent=u(v?'ideaSaved':'ideaNote');queueSave();renderRec();}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches&&e.target.matches('#alg .inputs input')){e.preventDefault();applyInput();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&unsavedWork)persist();});
window.addEventListener('pagehide',()=>{if(unsavedWork)persist();});
window.addEventListener('beforeunload',e=>{if(unsavedWork&&(saveBlocked||!storeAvailable)){e.preventDefault();e.returnValue='';}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
function boot(){if(!A||!A.ORDER.length){$('loading').textContent='The algorithms could not be loaded. Reload the page to try again.';return;}
 restore();const want=new URLSearchParams(location.search).get('algorithm');cur.key=A.ORDER.includes(want)?want:state.alg;state.alg=cur.key;cur.input=defaults();build();
 $('loading').hidden=true;$('app').hidden=false;renderAll();}
boot();
})();
