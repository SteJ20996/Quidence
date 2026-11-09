'use strict';
(()=>{
const A=window.QuidenceAlgorithms,KEY='quidence:algorithms:v1',L=A.L;
const backing=()=>window.QuidenceStorage||window.localStorage;
const storage={getItem:k=>backing().getItem(k),setItem:(k,v)=>backing().setItem(k,v),removeItem:k=>backing().removeItem(k)};
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// The page renders its own English or Spanish; the shared translator leaves #app alone.
const lc=()=>window.QuidenceI18n?.locale==='es'?'es':'en';
const tx=v=>v&&typeof v==='object'&&!Array.isArray(v)?(v[lc()]??v.en??''):String(v??'');
const fmt=(s,v={})=>String(s).replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m);
const plain=html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent;};
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const LANGS=['python','java','matlab'],LANG_NAMES={python:'Python',java:'Java',matlab:'MATLAB'};

/* ---------------- Interface text ---------------- */
const U={
 workbench:L('Algorithm workbench','Banco de trabajo del algoritmo'),
 mapTitle:L('Route map','Mapa de la ruta'),
 mapNote:L('Numbers 1 to 11 are open. 12 to 16 are planned for the university part. A gold outline marks the suggested next step.','Los números 1 a 11 ya están abiertos. Del 12 al 16 están previstos para la parte de universidad. Un contorno dorado marca el siguiente paso sugerido.'),
 helpSorted:L('A sorted list of 2 to 12 whole numbers between −999 and 999. An unsorted list also runs, so you can see what goes wrong.','Una lista ordenada de 2 a 12 números enteros entre −999 y 999. Una lista sin ordenar también corre, para que veas qué sale mal.'),
 warnUnsorted:L('This list is not sorted. Binary search will run anyway: watch whether it still finds the target.','Esta lista no está ordenada. La búsqueda binaria correrá de todos modos: observa si todavía encuentra el número.'),
 disks:L('Disks','Discos'),helpDisks:L('1 to 5 disks. Each extra disk doubles the moves.','De 1 a 5 discos. Cada disco extra duplica los movimientos.'),
 editWalls:L('Edit walls','Editar paredes'),clearWalls:L('Clear walls','Quitar paredes'),defaultMaze:L('Starting maze','Laberinto inicial'),randomMaze:L('Random maze','Laberinto al azar'),
 helpGrid:L('Choose “Edit walls”, then click cells to add or remove walls. S and G stay in their corners.','Elige “Editar paredes” y luego haz clic en las celdas para poner o quitar paredes. S y G se quedan en sus esquinas.'),
 cellLabel:L('Cell {name}','Celda {name}'),wall:L('wall','pared'),open:L('open','libre'),mud:L('mud','lodo'),
 mazeLegend:L('Light cells are marked. Outlined cells wait in the frontier. The gold cell is the one being handled; green cells form the path.','Las celdas claras están marcadas. Las celdas con contorno esperan en la frontera. La celda dorada es la que se está atendiendo; las verdes forman el camino.'),
 mazeSummary:L('Maze of 5 rows and 7 columns, S at the top left and G at the bottom right. {walls} walls, {marked} cells marked.','Laberinto de 5 filas y 7 columnas, S arriba a la izquierda y G abajo a la derecha. {walls} paredes, {marked} celdas marcadas.'),
 queueTitle:L('queue (front first)','queue (primero al frente)'),stackTop:L('stack (top first)','stack (tope primero)'),
 callStack:L('Call stack (newest on top)','Pila de llamadas (la más nueva arriba)'),stackEmpty:L('No call is running.','No hay ninguna llamada en curso.'),lineN:L('line {n}','línea {n}'),
 pegsLabel:L('Peg A: {a}. Peg B: {b}. Peg C: {c}.','Estaca A: {a}. Estaca B: {b}. Estaca C: {c}.'),empty:L('empty','vacía'),
 coinsLabel:L('Coins','Monedas'),amountLabel:L('Amount','Cantidad'),takenTitle:L('Coins taken','Monedas tomadas'),
 helpCoins:L('1 to 5 different coin values from 1 to 100, and an amount from 1 to 99.','De 1 a 5 valores de moneda distintos, de 1 a 100, y una cantidad de 1 a 99.'),
 errCoins:L('Enter 1 to 5 different whole numbers from 1 to 100 for the coins.','Escribe de 1 a 5 números enteros distintos, de 1 a 100, para las monedas.'),errAmount:L('The amount must be a whole number from 1 to 99.','La cantidad debe ser un número entero de 1 a 99.'),
 mapScroll:L('Route map. Scroll sideways to see all of it.','Mapa de la ruta. Desplázate hacia los lados para verlo completo.'),
 openAlg:L('Open #{n} {name}','Abrir el #{n} {name}'),planned:L('planned','previsto'),
 tabs:L('Algorithms in this part','Algoritmos de esta parte'),
 list:L('List','Lista'),target:L('Number to find (target)','Número buscado (target)'),
 use:L('Use this input','Usar estos datos'),random:L('Random input','Datos al azar'),
 helpList:L('2 to 12 whole numbers between −999 and 999, separated by commas.','De 2 a 12 números enteros entre −999 y 999, separados por comas.'),
 helpPair:L('Two whole numbers from 1 to 999,999.','Dos números enteros de 1 a 999,999.'),
 errList:L('Enter 2 to 12 whole numbers between −999 and 999, separated by commas.','Escribe de 2 a 12 números enteros entre −999 y 999, separados por comas.'),
 errTarget:L('The target must be a whole number between −999 and 999.','El número buscado debe ser un entero entre −999 y 999.'),
 errPair:L('Enter two whole numbers from 1 to 999,999.','Escribe dos números enteros de 1 a 999,999.'),
 chain:L('Logic chain','Cadena lógica'),chainNote:L('The flowchart and the steps move together.','El diagrama y los pasos avanzan juntos.'),
 flowLabel:L('Flowchart of {name}','Diagrama de flujo de {name}'),steps:L('Steps','Pasos'),
 pickNote:L('Choose a box in the flowchart: the one you think runs the most times on this list.','Elige una caja del diagrama: la que crees que se ejecuta más veces con esta lista.'),
 data:L('Data','Datos'),begin:L('Press <strong>Next step</strong> to begin.','Presiona <strong>Siguiente paso</strong> para empezar.'),
 back:L('← Back','← Atrás'),next:L('Next step →','Siguiente paso →'),play:L('Play','Reproducir'),pause:L('Pause','Pausa'),restart:L('Restart','Empezar de nuevo'),
 force:L('Predict this step','Predecir este paso'),skip:L('Skip predictions in this section','Omitir las predicciones en esta sección'),
 tally:L('Predictions in #{n}: {m} of {a} matched','Predicciones en el #{n}: {m} de {a} acertadas'),
 predict:L('Predict:','Predice:'),skipOne:L('Skip this one','Omitir esta'),
 matched:L('Your prediction matched.','Tu predicción acertó.'),missed:L('Not this time.','Esta vez no.'),
 trace:L('Trace table','Tabla de seguimiento'),traceEmpty:L('Rows appear as the algorithm runs.','Las filas aparecen mientras se ejecuta el algoritmo.'),
 code:L('The same logic in code','La misma lógica en código'),langGroup:L('Programming language','Lenguaje de programación'),
 matlabNote:L('MATLAB counts positions from 1, so its positions are one higher than the ones shown above.','MATLAB cuenta las posiciones desde 1, así que cada posición en MATLAB es la de arriba más 1.'),
 teachOpen:L('Teach me to write it','Enséñame a escribirlo'),teachClose:L('Close the guide','Cerrar la guía'),
 guide:L('Guide · line {i} of {n}','Guía · línea {i} de {n}'),logic:L('Logic:','Lógica:'),
 newCode:L('The new code is highlighted above.','El código nuevo está resaltado arriba.'),
 prevLine:L('← Previous line','← Línea anterior'),nextLine:L('Next line →','Línea siguiente →'),
 codeNote:L('The code is shown, not run: follow it line by line with the steps above.','El código se muestra, no se ejecuta: síguelo línea por línea con los pasos de arriba.'),
 think:L('Think further','Piensa más allá'),
 kindIdea:L('In your own words','Con tus propias palabras'),kindCounter:L('Find a counterexample','Busca un contraejemplo'),kindBottle:L('Find the bottleneck','Encuentra el cuello de botella'),kindImprove:L('Propose an improvement','Propón una mejora'),kindCost:L('Predict the cost','Predice el costo'),
 saved:L('evidence saved','evidencia guardada'),
 ideaNote:L('Not scored. Your words are kept exactly as you write them.','Sin calificación. Tus palabras se guardan tal como las escribes.'),
 ideaSaved:L('Kept in this browser exactly as written · not scored','Guardado en este navegador tal como lo escribiste · sin calificación'),
 ideaPlaceholder:L('For example: first I would look at…','Por ejemplo: primero miraría…'),
 claim:L('Claim:','Afirmación:'),checkEx:L('Check my example','Revisar mi ejemplo'),
 cplxTitle:L('How does it grow?','¿Cómo crece?'),yes:L('Yes.','Sí.'),notQuite:L('Not quite.','No exactamente.'),again:L('Try again','Intentar de nuevo'),
 recTitle:L('Suggested next','Siguiente paso sugerido'),recBasis:L('Based on what you did, not on a score','Según lo que hiciste, no según una calificación'),
 evidence:L('Evidence from this section','Evidencia de esta sección'),nothing:L('Nothing yet: make predictions or try a challenge.','Nada todavía: haz predicciones o intenta un reto.'),
 others:L('Other good choices','Otras buenas opciones'),open:L('Open','Abrir'),openN:L('Open #{n}','Abrir el #{n}'),
 plannedHigh:L('planned for the high-school part','previsto para la parte de preparatoria'),plannedUni:L('planned for the university part','previsto para la parte de universidad'),
 anyNote:L('You can open any open algorithm on the route map. This suggestion only explains a good next step.','Puedes abrir cualquier algoritmo disponible en el mapa de la ruta. Esta sugerencia solo explica un buen siguiente paso.'),
 review:L('Review my work','Revisar mi trabajo'),
 statusIdle:L('Your work stays on this device.','Tu trabajo se queda en este dispositivo.'),statusSaved:L('Saved on this device.','Guardado en este dispositivo.'),
 statusNoSave:L('Could not save in this browser. Export your session to keep a copy.','No se pudo guardar en este navegador. Exporta tu sesión para conservar una copia.'),
 statusConflict:L('Saved work changed in another tab. Export your current notes before reloading; new work is not saved.','El trabajo guardado cambió en otra pestaña. Exporta tus notas actuales antes de recargar; el trabajo nuevo no se guarda.'),
 statusUnreadable:L('The saved record could not be read. Export your current notes and the saved original before resetting; new work is not saved.','No se pudo leer el registro guardado. Exporta tus notas actuales y el original guardado antes de reiniciar; el trabajo nuevo no se guarda.'),
 sessionTitle:L('Your algorithms session','Tu sesión de algoritmos'),
 sessionLead:L('This is a record of what you did in this browser. Predictions and challenge results describe actions, not ability. Your own words are kept exactly as written.','Este es un registro de lo que hiciste en este navegador. Las predicciones y los resultados de los retos describen acciones, no capacidad. Tus palabras se guardan tal como las escribiste.'),
 statPred:L('Predictions matched','Predicciones acertadas'),statEvidence:L('Challenges with evidence','Retos con evidencia'),statIdeas:L('Ideas in your own words','Ideas con tus palabras'),
 ofN:L('{m} of {a}','{m} de {a}'),
 noWork:L('Nothing yet. Step through an algorithm or try a challenge, then come back here.','Nada todavía. Recorre un algoritmo o intenta un reto y luego vuelve aquí.'),
 yourIdea:L('Your idea','Tu idea'),history:L('Check history','Historial de revisiones'),
 historyNote:L('Each entry keeps the input you gave at that time.','Cada entrada conserva los datos que diste en ese momento.'),
 export:L('Export session notes','Exportar notas de la sesión'),exportCurrent:L('Export current notes','Exportar las notas actuales'),exportOriginal:L('Export saved original separately','Exportar el original guardado por separado'),
 reset:L('Reset Algorithms','Borrar el trabajo de Algoritmos'),resetTitle:L('Reset Algorithms?','¿Borrar el trabajo de Algoritmos?'),
 resetLead:L('This clears only your Algorithms work: predictions, challenge results, ideas and history. You can export your current notes and the saved original first.','Esto borra solo tu trabajo de Algoritmos: predicciones, resultados de los retos, ideas e historial. Antes puedes exportar tus notas actuales y el original guardado.'),
 resetConfirm:L('Clear Algorithms work','Borrar el trabajo de Algoritmos'),keep:L('Keep my work','Conservar mi trabajo'),
 cleared:L('Your Algorithms work has been cleared.','Tu trabajo de Algoritmos se borró.'),
 resetChanged:L('The saved original changed. Reload before resetting.','El original guardado cambió. Recarga antes de reiniciar.'),
 resetFailed:L('The original could not be cleared. Your work is kept.','No se pudo borrar el original. Tu trabajo se conserva.'),
 exported:L('Your current session notes have been exported.','Tus notas actuales de la sesión se exportaron.'),
 exportedOriginal:L('The previously saved original has been exported separately.','El original guardado antes se exportó por separado.'),
 downloadFailed:L('The download could not start. Your current notes are still visible.','La descarga no pudo empezar. Tus notas actuales siguen visibles.'),
 close:L('Close dialog','Cerrar el diálogo'),
 mdTitle:L('Algorithms','Algoritmos'),
 mdLead:L('Work from this browser. Predictions and challenge results describe actions, not ability. Ideas are quoted exactly as written.','Trabajo de este navegador. Las predicciones y los resultados de los retos describen acciones, no capacidad. Las ideas se citan tal como se escribieron.'),
 mdUnsaved:L('These notes include current work that could not be saved in this browser. The previously saved record is kept separately.','Estas notas incluyen trabajo actual que no se pudo guardar en este navegador. El registro guardado antes se conserva por separado.'),
 mdPred:L('Predictions: {m} of {a} matched','Predicciones: {m} de {a} acertadas'),mdInput:L('Input','Datos'),
 suggested:L('Suggested next: {t}','Siguiente paso sugerido: {t}'),
 kinds:{breaks:L('Break it on purpose','Rómpelo a propósito'),counter:L('Counterexample','Contraejemplo'),built:L('Improvement','Mejora'),improve:L('Improvement','Mejora'),bottle:L('Bottleneck','Cuello de botella'),cplx:L('Cost prediction','Predicción del costo'),why:L('Reason for the counterexample','Causa del contraejemplo')}
};
const u=(k,v)=>fmt(tx(U[k]),v);

/* ---------------- Saved record ---------------- */
const blank=()=>({version:1,alg:'find-max',lang:'python',skip:{},pred:{},evidence:{},ideas:{},builder:{cond:1,slots:[0,0,0],hint:0},improveOpts:{early:false,skip2:false,back:false},log:[]});
let state=blank(),saveTimer,toastTimer,storeAvailable=true,blockedOriginal=null,lastStored=null,saveBlocked=false,blockedReason='unreadable',unsavedWork=false,statusKey='statusIdle';
const isObj=x=>!!x&&typeof x==='object'&&!Array.isArray(x),isInt=Number.isInteger,isNum=x=>typeof x==='number'&&Number.isFinite(x),isStr=x=>typeof x==='string',isBool=x=>typeof x==='boolean';
const isLText=x=>isObj(x)&&isStr(x.en)&&isStr(x.es);
const validRows=r=>Array.isArray(r)&&r.every(x=>Array.isArray(x)&&x.length===4&&isStr(x[0])&&x.slice(1).every(isInt));
function validEvidence(e){if(!isObj(e))return false;
 for(const [k,v] of Object.entries(e)){if(!isObj(v))return false;
  if(k==='counter'){if(!['counter','holds','bad'].includes(v.status)||!isObj(v.input)||!Object.values(v.input).every(isStr)||!(v.why===null||isInt(v.why))||!isObj(v.data)||!Object.values(v.data).every(x=>isNum(x)||isBool(x)||isStr(x)))return false;}
  else if(k==='built'){if(!['passed','total','worst','linWorst','avg','linAvg'].every(f=>isNum(v[f]))||!isBool(v.halving)||!(v.hints===undefined||isInt(v.hints))||!(v.fail===null||isObj(v.fail)&&Array.isArray(v.fail.list)&&v.fail.list.every(isInt)&&isInt(v.fail.target)&&isInt(v.fail.want)&&(v.fail.got===null||isInt(v.fail.got))&&(v.fail.error===null||isStr(v.fail.error))))return false;}
  else if(k==='bottle'){if(!isStr(v.node)||!isBool(v.ok)||!isStr(v.verdict)||!isObj(v.counts)||!Object.values(v.counts).every(isInt)||!Array.isArray(v.list)||!v.list.every(isInt)||!(v.inputText===undefined||isStr(v.inputText)))return false;}
  else if(k==='breaks'){if(!Object.entries(v).every(([c,r])=>A.HANOI_BREAKS.includes(c)&&isObj(r)&&A.HANOI_OUTCOMES.includes(r.pred)&&A.HANOI_OUTCOMES.includes(r.actual)))return false;}
  else if(k==='improve'){if(v.kind==='bubble'){if(!isObj(v.o)||!['early','skip2','back'].every(f=>isBool(v.o[f]))||!validRows(v.rows)||!isBool(v.correct)||!isBool(v.early))return false;}
   else if(v.kind==='minmax'){if(![0,1,2].includes(v.v)||!validRows(v.rows)||!isBool(v.correct)||!isInt(v.worst))return false;}
   else if(['first','mergeskip','dfsimp','change'].includes(v.kind)){if(![0,1,2,3].includes(v.v)||!validRows(v.rows)||!isBool(v.correct))return false;}
   else if(v.kind==='euclid'){if(![0,1,2,3].includes(v.v)||!['ok','total','base','mine'].every(f=>isNum(v[f]))||!(v.fail===null||isObj(v.fail)&&['a','b','want'].every(f=>isInt(v.fail[f]))&&(v.fail.got===null||isInt(v.fail.got))))return false;}
   else return false;}
  else if(k==='cplx'){if(!isBool(v.ok)||!isInt(v.choice))return false;}
  else return false;}
 return true;}
const known=(o,check)=>isObj(o)&&Object.entries(o).every(([k,v])=>A.ORDER.includes(k)&&check(v));
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
function record(kind,input,summary){state.log.push({time:new Date().toISOString(),alg:cur.key,kind,input:typeof input==='string'?input:{en:String(input.en),es:String(input.es)},summary});}

/* ---------------- Workbench state ---------------- */
const cur={cardMaze:{},key:'find-max',input:null,events:[],idx:-1,pending:false,feedback:null,forcePredict:false,playing:false,timer:0,teach:-1,pick:false,msg:null};
const alg=()=>A.ALGS[cur.key];
const skipOn=()=>!!state.skip[cur.key];
const tally=()=>state.pred[cur.key]||{asked:0,matched:0};
function defaults(){const d=alg().defaults;if(d.list)return{list:[...d.list],target:d.target};if(d.maze!=null)return{maze:d.maze};if(d.disks)return{disks:d.disks};if(d.coins)return{coins:[...d.coins],amount:d.amount};return{a:d.a,b:d.b};}
function build(){cur.events=alg().gen(cur.input.list,cur.input.target,Math.random,[cur.input.a,cur.input.b],cur.input);cur.idx=-1;cur.pending=false;cur.feedback=null;cur.forcePredict=false;}
const step=()=>cur.idx>=0?cur.events[cur.idx]:null;
function openAlg(key,scroll){if(!A.ORDER.includes(key))return;const fromTabs=$('tabs').contains(document.activeElement);stop();state.alg=key;cur.key=key;cur.teach=-1;cur.pick=false;cur.msg=null;cur.editWalls=false;cur.input=defaults();build();renderAll();persist();
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
 for(const [from,to,pts,label,lp,style] of f.edges){const on=prev===from&&now===to;s+=`<path class="fe${on?' cur':''}${style==='dash'?' dash':''}" d="M${pts.map(p=>p.join(' ')).join('L')}" marker-end="url(#fa${on?'c':''})"/>`;if(label)s+=`<text class="fl" x="${lp[0]}" y="${lp[1]}">${esc(tx(label))}</text>`;}
 const chosen=ev().bottle?.node;
 for(const n of f.nodes){const pick=cur.pick&&n.id!=='start',text=tx(n.text);
  const shape=n.kind==='dec'?`<polygon points="${n.x},${n.y-n.h/2} ${n.x+n.w/2},${n.y} ${n.x},${n.y+n.h/2} ${n.x-n.w/2},${n.y}"/>`:`<rect x="${n.x-n.w/2}" y="${n.y-n.h/2}" width="${n.w}" height="${n.h}" rx="${n.kind==='term'?n.h/2:4}"/>`;
  s+=`<g class="fn${n.id===now?' cur':''}${pick?' pick':''}${!cur.pick&&chosen===n.id&&['bubble-sort','insertion-sort'].includes(cur.key)?' chosen':''}" data-node="${n.id}"${pick?` tabindex="0" role="button" aria-label="${esc(text)}"`:''}>${shape}<text x="${n.x}" y="${n.y+1}">${esc(text)}</text></g>`;}
 return s+'</svg>';}
function stepsList(){const e=step();return alg().pseudo[lc()].map((l,i)=>{const on=e&&e.line===i;return `<li class="${on?'cur':''}"${on?' aria-current="step"':''}><span class="ln">${i+1}</span><span class="tx">${esc(l)}</span>${on&&e.chip?`<span class="chip">${esc(tx(e.chip))}</span>`:''}</li>`;}).join('');}

/* ---------------- Data view ---------------- */
function dataView(){const a=alg();if(a.kind==='hanoi')return hanoiView();if(a.kind==='grid')return gridView();if(a.kind==='coins')return coinsView();
 return `<div class="arr${a.kind==='pair'?' pair':''}">${cellsHtml()}</div>${a.kind==='merge'?outRow():''}${varsHtml()}`;}
function outRow(){const e=step();if(!e||!e.out)return '';return `<div class="outrow"><span class="eyebrow">out</span><div class="arr out">${e.out.length?e.out.map(v=>`<div class="cell">${esc(v)}</div>`).join(''):'<span class="muted small-print">—</span>'}</div></div>`;}
function hanoiView(){const e=step(),N=cur.input.disks,pegs=e&&e.pegs||{A:Array.from({length:N},(_,k)=>N-k),B:[],C:[]},mv=e&&e.moved,stack=e&&e.stack||[],list=p=>pegs[p].length?pegs[p].join(', '):tx(U.empty);
 const peg=p=>`<div class="peg"><div class="disks">${pegs[p].map(d=>`<div class="disk${mv&&mv.disk===d?' moved':''}" style="--w:${28+d*14}%"><span>${d}</span></div>`).join('')}</div><div class="pegbase"></div><span class="peglabel">${p}${mv&&mv.to===p?' ↓':mv&&mv.from===p?' ↑':''}</span></div>`;
 return `<div class="hanoi" role="img" aria-label="${esc(u('pegsLabel',{a:list('A'),b:list('B'),c:list('C')}))}">${['A','B','C'].map(peg).join('')}</div><div class="callstack"><span class="eyebrow">${esc(u('callStack'))}</span>${stack.length?`<ol>${[...stack].reverse().map((f,i)=>`<li${i===0?' class="cur"':''}>hanoi(${f.n}, ${f.from}, ${f.to}, ${f.via}) · ${esc(u('lineN',{n:f.line+1}))}</li>`).join('')}</ol>`:`<p class="muted small-print">${esc(u('stackEmpty'))}</p>`}</div>`;}
function gridView(){const a=alg(),e=step(),maze=e&&e.maze||A.parseMaze(cur.input.maze),marked=new Set(e&&e.marked||[]),front=e&&e.frontier||[],fset=new Set(front),path=new Set(e&&e.path||[]),at=e?e.current:null,look=e?e.look:null;
 const cells=[...maze].map((ch,i)=>{const cls=['mc',ch==='#'?'wall':ch==='~'?'mud':'',marked.has(i)?'marked':'',fset.has(i)?'front':'',path.has(i)?'path':'',i===at?'cur':'',i===look?'look':''].filter(Boolean).join(' '),label=i===A.START?'S':i===A.GOAL?'G':'';
  return cur.editWalls&&i!==A.START&&i!==A.GOAL?`<button type="button" id="cell-${i}" class="${cls} edit" data-cell="${i}" aria-pressed="${ch==='#'}" aria-label="${esc(u('cellLabel',{name:A.cellName(i)}))}"></button>`:`<div class="${cls}">${label}</div>`;}).join('');
 return `<div class="maze" style="--cols:${A.GC}" role="${cur.editWalls?'group':'img'}" aria-label="${esc(u('mazeSummary',{walls:[...maze].filter(c=>c==='#').length,marked:marked.size}))}">${cells}</div><div class="frontier"><span class="eyebrow">${esc(u(a.frontier==='queue'?'queueTitle':'stackTop'))}</span>${front.length?front.map(i=>`<span class="var">${A.cellName(i)}</span>`).join(''):'<span class="muted small-print">—</span>'}</div><p class="small-print muted">${esc(u('mazeLegend'))}</p>`;}
function coinsView(){const e=step(),coins=e&&e.coins||[...new Set(cur.input.coins)].sort((x,y)=>y-x),amount=e?e.amount:cur.input.amount,taken=e&&e.taken||[],coin=e?e.coin:null;
 return `<div class="coinset">${coins.map(c=>`<span class="coin${c===coin?' cur':''}">${c}</span>`).join('')}</div><div class="vars"><span class="var key"><span>amount</span> = <b>${esc(amount)}</b></span></div><div class="taken"><span class="eyebrow">${esc(u('takenTitle'))}</span>${taken.length?taken.map((c,i)=>`<span class="coin small${e&&e.fresh&&i===taken.length-1?' fresh':''}">${c}</span>`).join(''):'<span class="muted small-print">—</span>'}</div>`;}
function cellsHtml(){const a=alg(),e=step(),pair=a.kind==='pair';
 const arr=e&&e.arr?e.arr:pair?[cur.input.a,cur.input.b,'—']:cur.input.list,labels=pair?['a','b','r']:null,n=arr.length;
 const S=k=>new Set(e&&e[k]||[]),cmp=S('cmp'),hit=S('hit'),swp=S('swapped'),dim=S('dim'),range=e&&e.range,runs=e&&e.runs||1,sortedFrom=e&&e.sortedFrom!=null?e.sortedFrom:n+1,sortedTo=e&&e.sortedTo!=null?e.sortedTo:0,hole=e&&e.hole!=null?e.hole:-1,mark=new Set(e&&e.mark||[]);
 const ptrAt={};for(const [k,v] of Object.entries(e&&e.ptr||{}))if(v!=null&&v>=0&&v<n)(ptrAt[v]=ptrAt[v]||[]).push(k);
 return arr.map((v,i)=>{const cls=['cell',dim.has(i)||range&&(i<range[0]||i>=range[1])?'dim':'',a.kind==='merge'&&Math.floor(i/runs)%2?'runB':'',cmp.has(i)?'cmp':'',hit.has(i)?'hit':'',swp.has(i)?'swap':'',i>=sortedFrom?'done':'',i<sortedTo&&i!==hole?'sorted':'',i===hole?'hole':'',mark.has(i)?'best':''].filter(Boolean).join(' ');
  return `<div class="${cls}"><span class="ix">${labels?labels[i]:i}</span><span class="v">${i===hole?'':esc(v)}</span>${ptrAt[i]?`<span class="pt">${ptrAt[i].join(' ')}</span>`:''}</div>`;}).join('');}
function varsHtml(){const a=alg(),e=step(),chips=[];
 if(a.id==='find-max')chips.push(['best',e&&e.vars&&e.vars.best!=null?e.vars.best:'—']);
 if(a.kind==='search')chips.push(['target',cur.input.target]);
 if(a.id==='insertion-sort'&&e&&e.aside!=null)chips.push(['key',e.aside]);
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
 if(a.kind==='coins')return `<div class="inputs"><label for="in-coins">${esc(u('coinsLabel'))} <input type="text" id="in-coins" value="${esc(i.coins.join(', '))}" aria-describedby="in-help"></label><label for="in-amount">${esc(u('amountLabel'))} <input type="text" inputmode="numeric" class="small" id="in-amount" value="${esc(i.amount)}"></label>${btn('in-apply','use')}${btn('in-random','random')}<span id="in-help" class="muted small-print">${esc(u('helpCoins'))}</span></div>${cur.msg?`<p class="fb no" role="alert">${esc(u(cur.msg))}</p>`:''}`;
 const fields=a.kind==='pair'?`<label for="in-a">a <input type="text" inputmode="numeric" class="small" id="in-a" value="${esc(i.a)}"></label><label for="in-b">b <input type="text" inputmode="numeric" class="small" id="in-b" value="${esc(i.b)}"></label>`
  :`<label for="in-list">${esc(u('list'))} <input type="text" id="in-list" value="${esc(i.list.join(', '))}" aria-describedby="in-help"></label>${a.kind==='search'?`<label for="in-target">${esc(u('target'))} <input type="text" inputmode="numeric" class="small" id="in-target" value="${esc(i.target)}"></label>`:''}`;
 return `<div class="inputs">${fields}<button type="button" id="in-apply">${esc(u('use'))}</button><button type="button" id="in-random">${esc(u('random'))}</button><span id="in-help" class="muted small-print">${esc(u(a.kind==='pair'?'helpPair':a.sorted?'helpSorted':'helpList'))}</span></div>${cur.msg?`<p class="fb no" role="alert">${esc(u(cur.msg))}</p>`:''}`;}
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
  <p class="muted small-print">${esc(u('codeNote'))}${state.lang==='matlab'&&['list','search','merge'].includes(a.kind)?' '+esc(u('matlabNote')):''}</p>
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
 else if(a.kind==='pair'){const x=parseOne($('in-a').value,1,999999),y=parseOne($('in-b').value,1,999999);if(x===null||y===null){cur.msg='errPair';renderBench();return;}cur.input={a:x,b:y};}
 else{const xs=parseInts($('in-list').value,-999,999);if(!xs||xs.length<2||xs.length>12){cur.msg='errList';renderBench();return;}
  let t=cur.input.target;if(a.kind==='search'){const tt=parseInts($('in-target').value,-999,999);if(!tt||tt.length!==1){cur.msg='errTarget';renderBench();return;}t=tt[0];}
  cur.input={list:xs,target:t};if(a.sorted&&!A.sorted(xs))cur.msg='warnUnsorted';}
 build();cur.pick=false;renderBench();renderChallenges();renderRec();$('announce').textContent='';}
function setMaze(m){stop();cur.input={maze:A.parseMaze(m)};build();renderBench();renderChallenges();renderRec();}
function toggleWall(i){const m=[...A.parseMaze(cur.input.maze)];m[i]=m[i]==='#'?'.':'#';setMaze(m.join(''));const el=$('cell-'+i);if(el)el.focus();}
function randomInput(){const a=alg(),r=n=>Math.floor(Math.random()*n);stop();cur.msg=null;
 if(a.kind==='grid'){let m;for(let k=0;k<50;k++){m=A.randomMaze(Math.random,.28);if(A.bfsRun(m).found)break;}cur.input={maze:m};}
 else if(a.kind==='hanoi')cur.input={disks:2+r(4)};
 else if(a.kind==='coins'){const sets=[[25,10,5,1],[1,3,4],[1,5,12],[1,7,10],[50,20,10,5,1]],cs=sets[r(sets.length)];cur.input={coins:[...cs],amount:5+r(55)};}
 else if(a.kind==='pair'){const x=10+r(990),y=10+r(990);cur.input={a:Math.max(x,y),b:Math.min(x,y)};}
 else{const n=a.kind==='search'?8+r(4):6+r(3),pool=[...Array(60).keys()].map(x=>x+1);for(let i=pool.length-1;i>0;i--){const j=r(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}
  const list=pool.slice(0,n),t=Math.random()<.75?list[r(n)]:61+r(30);if(a.sorted)list.sort((x,y)=>x-y);cur.input={list,target:t};}
 build();cur.pick=false;renderBench();renderChallenges();renderRec();}

/* ---------------- Challenges ---------------- */
const LEADS={
 'find-max':L('Find the maximum looks at every item once. Test the rule it relies on, then try to find two answers with less work.','Encontrar el máximo mira cada elemento una vez. Pon a prueba la regla en la que se basa y luego intenta hallar dos respuestas con menos trabajo.'),
 'linear-search':L('Linear search checks every item in the worst case. Find out exactly what it returns, then do better on a sorted list.','La búsqueda lineal revisa todos los elementos en el peor caso. Averigua exactamente qué devuelve y luego hazlo mejor en una lista ordenada.'),
 'bubble-sort':L('Bubble sort does a lot of comparing. Find where the work goes, then try to cut it.','El ordenamiento burbuja compara mucho. Encuentra dónde está el trabajo y luego intenta reducirlo.'),
 'insertion-sort':L('Insertion sort can be quick or slow. Find out when, and where its time goes.','El ordenamiento por inserción puede ser rápido o lento. Averigua cuándo, y dónde se va su tiempo.'),
 'binary-search':L('Binary search is fast, but it relies on something. Find out what, then make it handle repeated numbers.','La búsqueda binaria es rápida, pero depende de algo. Averigua de qué y luego haz que maneje números repetidos.'),
 'merge-sort':L('Merge sort is fast on every list. Is it always the best choice? Find out, then try to make it smarter.','El ordenamiento por mezcla es rápido con cualquier lista. ¿Siempre es la mejor opción? Averígualo y luego intenta hacerlo más listo.'),
 hanoi:L('A method that calls itself needs every one of its lines. Break it on purpose, then find where its time goes.','Un método que se llama a sí mismo necesita cada una de sus líneas. Rómpelo a propósito y luego encuentra a dónde se va su tiempo.'),
 bfs:L('BFS finds the fewest steps. Is that always what you want? Then find where its time goes.','BFS encuentra la menor cantidad de pasos. ¿Siempre es eso lo que quieres? Luego encuentra a dónde se va su tiempo.'),
 dfs:L('DFS goes deep first. Find out what that costs, then try to point it toward the goal.','DFS va primero a lo profundo. Averigua cuánto cuesta eso y luego intenta dirigirlo hacia la meta.'),
 'greedy-change':L('Taking the largest coin feels right. Find out when it is wrong, then make it faster.','Tomar la moneda más grande parece correcto. Averigua cuándo falla y luego hazlo más rápido.'),
 euclid:L('Euclid’s algorithm is famous for being fast. Test that, and rebuild its key idea.','El algoritmo de Euclides es famoso por ser rápido. Ponlo a prueba y reconstruye su idea clave.')};
const CARDS={'binary-search':['idea','counter','first','cplx'],'merge-sort':['idea','counter','mergeskip','cplx'],hanoi:['idea','breaks','bottle','cplx'],bfs:['idea','counter','bottle','cplx'],dfs:['idea','counter','dfsimp','cplx'],'greedy-change':['idea','counter','change','cplx'],'find-max':['idea','counter','minmax','cplx'],'linear-search':['idea','counter','builder','cplx'],'bubble-sort':['idea','bottle','bubble','cplx'],'insertion-sort':['idea','counter','bottle','cplx'],euclid:['idea','counter','euclid','cplx']};
function card(kind,done,title,body){return `<div class="ch${done?' done':''}"><span class="kind">${esc(u(kind))}${done?` <span class="got">✓ ${esc(u('saved'))}</span>`:''}</span>${title?`<h3>${esc(tx(title))}</h3>`:''}${body}</div>`;}
function ideaCard(){const k=cur.key,v=state.ideas[k]||'';return card('kindIdea',false,null,`<label for="idea">${esc(tx(A.IDEAS[k]))}</label><textarea id="idea" rows="4" class="student-work" placeholder="${esc(U.ideaPlaceholder.en)}">${esc(v)}</textarea><span class="muted small-print" id="idea-s">${esc(u(v?'ideaSaved':'ideaNote'))}</span>`);}

// Counterexamples: each claim, its inputs, how it is checked and the follow-up question.
const COUNTER={
 'binary-search':{title:L('Does it always work?','¿Siempre funciona?'),claim:L('If the target is in the list, binary search finds it.','Si el número buscado está en la lista, la búsqueda binaria lo encuentra.'),
  fields:[['list',L('List','Lista'),'1, 3, 5, 7, 9'],['target',L('Target','Buscado'),'9',true]],
  check(v){const xs=parseInts(v.list,-999,999),t=parseInts(v.target,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};if(!t||t.length!==1)return{status:'bad',data:{msg:'errTarget'}};
   const r=A.checkBinary(xs,t[0]);if(!r.present)return{status:'bad',data:{target:t[0],missing:true}};return{status:r.counter?'counter':'holds',data:{target:t[0],index:r.index}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: ${d.target} is in your list, but binary search returns −1.`,`Contraejemplo: ${d.target} está en tu lista, pero la búsqueda binaria devuelve −1.`):L(`Binary search finds ${d.target} at position ${d.index}. The claim holds for this list. Try a list where keeping one half throws the target away.`,`La búsqueda binaria encuentra ${d.target} en la posición ${d.index}. La afirmación se cumple con esta lista. Prueba una lista donde quedarse con una mitad deje fuera al número.`),
  missing:d=>L(`${d.target} is not in your list, so binary search should return −1. The claim is about a target that is in the list.`,`${d.target} no está en tu lista, así que la búsqueda binaria debe devolver −1. La afirmación trata de un número que sí está en la lista.`),
  why:{q:L('What did your list break?','¿Qué rompió tu lista?'),options:L(['It is not sorted','It has repeated numbers','It is too short'],['No está ordenada','Tiene números repetidos','Es demasiado corta']),
   good:L('Yes. Throwing away half the list is safe only when the list is sorted: only then can the target not be in the discarded half.','Sí. Descartar la mitad de la lista solo es seguro cuando la lista está ordenada: solo así el número no puede estar en la mitad descartada.'),
   bad:L('Look at the order of your numbers. What does binary search assume about it?','Mira el orden de tus números. ¿Qué supone la búsqueda binaria sobre él?')}},
 'merge-sort':{title:L('Is it always faster?','¿Siempre es más rápido?'),claim:L('Merge sort always makes fewer comparisons than insertion sort.','El ordenamiento por mezcla siempre hace menos comparaciones que el ordenamiento por inserción.'),
  fields:[['list',L('List','Lista'),'8, 3, 6, 1, 7, 2, 5, 4']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkMerge(xs);return{status:r.counter?'counter':'holds',data:{merge:r.merge,ins:r.ins}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: merge sort made ${d.merge} comparisons and insertion sort made ${d.ins}.`,`Contraejemplo: el ordenamiento por mezcla hizo ${d.merge} comparaciones y el de inserción hizo ${d.ins}.`):L(`Merge sort made ${d.merge} comparisons and insertion sort made ${d.ins}. The claim holds for this list. Try a list that insertion sort finds easy.`,`El ordenamiento por mezcla hizo ${d.merge} comparaciones y el de inserción hizo ${d.ins}. La afirmación se cumple con esta lista. Prueba una lista que al ordenamiento por inserción le resulte fácil.`),
  why:{q:L('Which lists favour insertion sort?','¿Qué listas favorecen al ordenamiento por inserción?'),options:L(['Lists that are already sorted or nearly sorted','Lists in decreasing order','Lists with no repeated numbers'],['Listas ya ordenadas o casi ordenadas','Listas en orden decreciente','Listas sin números repetidos']),
   good:L('Yes. On a sorted list insertion sort compares each item once with the one before it, n − 1 comparisons in all, while merge sort still merges every pair of runs.','Sí. Con una lista ordenada, el ordenamiento por inserción compara cada elemento una vez con el anterior, n − 1 comparaciones en total, mientras que el de mezcla sigue mezclando cada par de tramos.'),
   bad:L('Run both sorts on a list that is already in order, and count.','Ejecuta los dos ordenamientos con una lista que ya esté en orden y cuenta.')}},
 bfs:{title:L('Fewest steps, lowest cost?','¿Menos pasos, menor costo?'),claim:L('Even when mud cells cost 3 to enter, the path BFS finds is the cheapest.','Aunque entrar a una celda de lodo cueste 3, el camino que encuentra BFS es el más barato.'),
  grid:{modes:['.','~','#']},
  check(v){const r=A.checkMud(v.maze);if(!r.found)return{status:'bad',data:{msg:'noPath'}};return{status:r.counter?'counter':'holds',data:{steps:r.steps,cost:r.cost,best:r.best}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: BFS finds a path of ${d.steps} steps that costs ${d.cost}, but the cheapest route costs ${d.best}.`,`Contraejemplo: BFS encuentra un camino de ${d.steps} pasos que cuesta ${d.cost}, pero la ruta más barata cuesta ${d.best}.`):L(`The path BFS finds costs ${d.cost}, and no route is cheaper. The claim holds for this maze. Put mud on the short route and leave a longer route dry.`,`El camino que encuentra BFS cuesta ${d.cost} y ninguna ruta es más barata. La afirmación se cumple con este laberinto. Pon lodo en la ruta corta y deja seca una ruta más larga.`),
  why:{q:L('Why can the BFS path cost more?','¿Por qué el camino de BFS puede costar más?'),options:L(['BFS counts steps, not what each step costs','BFS skips cells with mud','BFS stops before it reaches G'],['BFS cuenta pasos, no lo que cuesta cada paso','BFS se salta las celdas con lodo','BFS se detiene antes de llegar a G']),
   good:L('Yes. BFS finds the fewest steps. When steps cost different amounts, the cheapest route can have more steps, and finding it needs #14 Dijkstra’s method.','Sí. BFS encuentra la menor cantidad de pasos. Cuando los pasos cuestan distinto, la ruta más barata puede tener más pasos, y encontrarla requiere el método de Dijkstra, el #14.'),
   bad:L('Count the steps of the BFS path, then add up what they cost.','Cuenta los pasos del camino de BFS y luego suma lo que cuestan.')}},
 dfs:{title:L('Is the path the shortest?','¿El camino es el más corto?'),claim:L('DFS always finds a shortest path from S to G.','DFS siempre encuentra un camino más corto de S a G.'),
  grid:{modes:['.','#']},
  check(v){const r=A.checkDfs(v.maze);if(!r.found)return{status:'bad',data:{msg:'noPath'}};return{status:r.counter?'counter':'holds',data:{dfs:r.dfs,bfs:r.bfs}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: DFS finds a path of ${d.dfs} steps, but a path of ${d.bfs} steps exists.`,`Contraejemplo: DFS encuentra un camino de ${d.dfs} pasos, pero existe uno de ${d.bfs} pasos.`):L(`DFS finds a path of ${d.dfs} steps, the shortest possible here. The claim holds for this maze. Add walls so that the first way DFS tries is a long detour.`,`DFS encuentra un camino de ${d.dfs} pasos, el más corto posible aquí. La afirmación se cumple con este laberinto. Pon paredes para que el primer camino que pruebe DFS sea un rodeo largo.`),
  why:{q:L('Why can DFS find a longer path?','¿Por qué DFS puede encontrar un camino más largo?'),options:L(['It follows one route as far as it can before trying another','It looks at fewer neighbours','It marks cells too early'],['Sigue una ruta lo más lejos que puede antes de probar otra','Mira menos vecinos','Marca las celdas demasiado pronto']),
   good:L('Yes. DFS keeps going from the newest cell and stops at G however it got there, so the route can be long. BFS explores ring by ring instead.','Sí. DFS sigue desde la celda más nueva y se detiene en G sin importar cómo llegó, así que la ruta puede ser larga. BFS, en cambio, explora anillo por anillo.'),
   bad:L('Put your maze in the workbench above and watch the order in which DFS takes cells.','Pon tu laberinto en el banco de trabajo de arriba y observa en qué orden toma DFS las celdas.')}},
 'greedy-change':{title:L('Always the fewest coins?','¿Siempre la menor cantidad de monedas?'),claim:L('Taking the largest coin that fits, again and again, always uses the fewest coins.','Tomar una y otra vez la moneda más grande que cabe siempre usa la menor cantidad de monedas.'),
  fields:[['coins',L('Coins','Monedas'),'25, 10, 5, 1'],['amount',L('Amount','Cantidad'),'30',true]],
  check(v){const cs=parseInts(v.coins,1,100),amt=parseOne(v.amount,1,99);if(!cs||cs.length>5||new Set(cs).size!==cs.length)return{status:'bad',data:{msg:'errCoins'}};if(amt===null)return{status:'bad',data:{msg:'errAmount'}};
   const r=A.checkGreedy(cs,amt);if(r.best===null)return{status:'bad',data:{msg:'cantPay'}};return{status:r.counter?'counter':'holds',data:{greedy:r.greedy===null?-1:r.greedy,gc:r.greedyCoins.join(' + ')||'—',left:r.left,best:r.best,bc:r.bestCoins.join(' + ')}};},
  text:(s,d)=>s==='counter'?(d.greedy<0?L(`Counterexample: the greedy method takes ${d.gc} and is stuck with ${d.left} left, but ${d.bc} pays exactly.`,`Contraejemplo: el método voraz toma ${d.gc} y se queda con ${d.left} sin pagar, pero ${d.bc} paga exacto.`):L(`Counterexample: the greedy method uses ${d.greedy} coins (${d.gc}), but ${d.best} are enough: ${d.bc}.`,`Contraejemplo: el método voraz usa ${d.greedy} monedas (${d.gc}), pero bastan ${d.best}: ${d.bc}.`)):L(`The greedy method uses ${d.greedy} ${d.greedy===1?'coin':'coins'} (${d.gc}), and no way uses fewer. The claim holds here. Try coins without a 5 or a 10, where a large coin can block a better mix.`,`El método voraz usa ${d.greedy} ${d.greedy===1?'moneda':'monedas'} (${d.gc}) y ninguna forma usa menos. La afirmación se cumple aquí. Prueba monedas sin 5 ni 10, donde una moneda grande pueda bloquear una mejor combinación.`),
  why:{q:L('What went wrong?','¿Qué salió mal?'),options:L(['A large coin blocked a better mix of smaller coins','The amount was too large','The coins were not in order'],['Una moneda grande bloqueó una mejor combinación de monedas más chicas','La cantidad era demasiado grande','Las monedas no estaban en orden']),
   good:L('Yes. The greedy method never gives a coin back, so one early large coin can force a worse finish. Coins such as 25, 10, 5 and 1 are chosen so that this never happens.','Sí. El método voraz nunca devuelve una moneda, así que una moneda grande al principio puede obligar a un mal final. Monedas como 25, 10, 5 y 1 se eligen para que eso nunca pase.'),
   bad:L('Compare the two answers coin by coin: where do they first differ?','Compara las dos respuestas moneda por moneda: ¿dónde difieren por primera vez?')}},
 'find-max':{title:L('Does it always work?','¿Siempre funciona?'),claim:L('Starting with best ← 0 instead of best ← a[0], and comparing every item including a[0], gives the same answer.','Empezar con best ← 0 en lugar de best ← a[0], y comparar todos los elementos, incluido a[0], da la misma respuesta.'),
  fields:[['list',L('List','Lista'),'3, -2, 8']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkMaxZero(xs);return{status:r.counter?'counter':'holds',data:{right:r.right,zero:r.zero}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: the largest number is ${d.right}, but starting with best ← 0 returns ${d.zero}.`,`Contraejemplo: el número más grande es ${d.right}, pero empezar con best ← 0 devuelve ${d.zero}.`):L(`Both give ${d.right}. The claim holds for this list. Try a list where 0 would beat every number.`,`Ambos dan ${d.right}. La afirmación se cumple con esta lista. Prueba una lista donde 0 le gane a todos los números.`),
  why:{q:L('Why does best end up as 0?','¿Por qué best termina valiendo 0?'),options:L(['0 is bigger than every number in the list','The largest number comes first','A number is repeated'],['0 es mayor que todos los números de la lista','El número más grande va primero','Un número se repite']),
   good:L('Yes. 0 is bigger than every negative number, so best never changes and stays 0, which is not even in the list. Starting with a[0] always uses a value from the list.','Sí. 0 es mayor que cualquier número negativo, así que best nunca cambia y se queda en 0, que ni siquiera está en la lista. Empezar con a[0] siempre usa un valor de la lista.'),
   bad:L('Compare 0 with each number in your list. Which is bigger?','Compara 0 con cada número de tu lista. ¿Cuál es mayor?')}},
 'linear-search':{title:L('Is it the only place?','¿Es el único lugar?'),claim:L('The position that linear search returns is the only place where the target appears.','La posición que devuelve la búsqueda lineal es el único lugar donde aparece el número buscado.'),
  fields:[['list',L('List','Lista'),'4, 7, 1, 9'],['target',L('Target','Buscado'),'7',true]],
  check(v){const xs=parseInts(v.list,-999,999),t=parseInts(v.target,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};if(!t||t.length!==1)return{status:'bad',data:{msg:'errTarget'}};
   const r=A.checkLinearFirst(xs,t[0]);if(r.first<0)return{status:'bad',data:{target:t[0],missing:true}};return{status:r.counter?'counter':'holds',data:{target:t[0],first:r.first,count:r.count}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: ${d.target} appears ${d.count} times, but linear search returns only position ${d.first}.`,`Contraejemplo: ${d.target} aparece ${d.count} veces, pero la búsqueda lineal devuelve solo la posición ${d.first}.`):L(`${d.target} appears only at position ${d.first}. The claim holds for this list. Try a list where the target appears more than once.`,`${d.target} aparece solo en la posición ${d.first}. La afirmación se cumple con esta lista. Prueba una lista donde el número buscado aparezca más de una vez.`),
  missing:d=>L(`${d.target} is not in your list, so linear search returns −1. The claim is about a target that is in the list.`,`${d.target} no está en tu lista, así que la búsqueda lineal devuelve −1. La afirmación trata de un número que sí está en la lista.`),
  why:{q:L('Which position does linear search return?','¿Qué posición devuelve la búsqueda lineal?'),options:L(['The first position where the target appears','The last position where it appears','Any position where it appears'],['La primera posición donde aparece el número','La última posición donde aparece','Cualquier posición donde aparezca']),
   good:L('Yes. It stops at the first match. To find every position, it would have to keep going to the end and collect each match.','Sí. Se detiene en la primera coincidencia. Para encontrar todas las posiciones tendría que seguir hasta el final y juntar cada coincidencia.'),
   bad:L('Put your list and target into the workbench above and step through it: where does the loop stop?','Pon tu lista y el número buscado en el banco de trabajo de arriba y avanza paso a paso: ¿dónde se detiene el ciclo?')}},
 'insertion-sort':{title:L('Is it always faster?','¿Siempre es más rápido?'),claim:L('Insertion sort always makes fewer comparisons than bubble sort.','El ordenamiento por inserción siempre hace menos comparaciones que el ordenamiento burbuja.'),
  fields:[['list',L('List','Lista'),'1, 2, 3, 4, 5']],
  check(v){const xs=parseInts(v.list,-999,999);if(!xs||xs.length<2||xs.length>12)return{status:'bad',data:{msg:'errList'}};const r=A.checkInsertion(xs);return{status:r.counter?'counter':'holds',data:{ins:r.ins,bub:r.bub}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: insertion sort made ${d.ins} comparisons and bubble sort made ${d.bub}, so insertion sort was not faster.`,`Contraejemplo: la inserción hizo ${d.ins} comparaciones y la burbuja hizo ${d.bub}, así que la inserción no fue más rápida.`):L(`Insertion sort made ${d.ins} comparisons and bubble sort made ${d.bub}. The claim holds for this list. Try an order where every new item has to travel far.`,`La inserción hizo ${d.ins} comparaciones y la burbuja hizo ${d.bub}. La afirmación se cumple con esta lista. Prueba un orden donde cada elemento nuevo tenga que viajar lejos.`),
  why:{q:L('Which order of a list makes insertion sort do the most work?','¿Qué orden de una lista hace trabajar más al ordenamiento por inserción?'),options:L(['Decreasing order','Already sorted','All numbers equal'],['Orden decreciente','Ya ordenada','Todos los números iguales']),
   good:L('Yes. In decreasing order every new item slides all the way to the front: 1 + 2 + … + (n − 1) = n(n − 1)/2 comparisons, exactly as many as bubble sort.','Sí. En orden decreciente cada elemento nuevo se desliza hasta el principio: 1 + 2 + … + (n − 1) = n(n − 1)/2 comparaciones, exactamente tantas como la burbuja.'),
   bad:L('Try each order on a short list and count the comparisons. Which one makes every item travel furthest?','Prueba cada orden en una lista corta y cuenta las comparaciones. ¿Cuál hace que cada elemento viaje más lejos?')}},
 euclid:{title:L('Do bigger numbers need more steps?','¿Los números más grandes necesitan más pasos?'),claim:L('A pair of bigger numbers never needs fewer remainder steps than a pair of smaller numbers.','Un par de números más grandes nunca necesita menos pasos con residuo que un par de números más pequeños.'),
  fields:[['a1',L('Pair 1: a','Par 1: a'),'21',true],['b1',L('Pair 1: b','Par 1: b'),'14',true],['a2',L('Pair 2: a','Par 2: a'),'40',true],['b2',L('Pair 2: b','Par 2: b'),'30',true]],
  check(v){const n=k=>parseOne(v[k],1,999999),p=[n('a1'),n('b1')],q=[n('a2'),n('b2')];if([...p,...q].includes(null))return{status:'bad',data:{msg:'errPair'}};
   const ge=(x,y)=>x[0]>=y[0]&&x[1]>=y[1]&&(x[0]>y[0]||x[1]>y[1]);let small,big;if(ge(q,p)){small=p;big=q;}else if(ge(p,q)){small=q;big=p;}else return{status:'bad',data:{msg:'pairOrder'}};
   const r=A.checkEuclidPairs(small,big);return{status:r.counter?'counter':'holds',data:{small:small.join(', '),big:big.join(', '),s1:r.s1,s2:r.s2}};},
  text:(s,d)=>s==='counter'?L(`Counterexample: the bigger pair (${d.big}) needs ${d.s2} step${d.s2===1?'':'s'}, but the smaller pair (${d.small}) needs ${d.s1}.`,`Contraejemplo: el par más grande (${d.big}) necesita ${d.s2} paso${d.s2===1?'':'s'}, pero el par más pequeño (${d.small}) necesita ${d.s1}.`):L(`The bigger pair (${d.big}) needs ${d.s2} step${d.s2===1?'':'s'} and the smaller pair (${d.small}) needs ${d.s1}. The claim holds for these pairs. Try a small pair where each remainder is only a little smaller than the number before it.`,`El par más grande (${d.big}) necesita ${d.s2} paso${d.s2===1?'':'s'} y el más pequeño (${d.small}) necesita ${d.s1}. La afirmación se cumple con estos pares. Prueba un par pequeño donde cada residuo sea solo un poco menor que el número anterior.`),
  why:{q:L('Which pairs need the most steps for their size?','¿Qué pares necesitan más pasos para su tamaño?'),options:L(['Neighbouring Fibonacci numbers, such as 34 and 21','Two equal numbers','A number and its double'],['Números de Fibonacci consecutivos, como 34 y 21','Dos números iguales','Un número y su doble']),
   good:L('Yes. With neighbouring Fibonacci numbers every quotient except the last is 1, so each step shrinks the pair as little as possible. Even so, the number of steps grows only with the number of digits.','Sí. Con números de Fibonacci consecutivos todos los cocientes, menos el último, son 1, así que cada paso achica el par lo menos posible. Aun así, el número de pasos crece solo con la cantidad de cifras.'),
   bad:L('Count the steps for your smaller pair: how big was each quotient?','Cuenta los pasos de tu par más pequeño: ¿qué tan grande fue cada cociente?')}}};
const ERR={errCoins:U.errCoins,errAmount:U.errAmount,noPath:L('There is no path from S to G in this maze. Open a way through first.','En este laberinto no hay camino de S a G. Primero abre un paso.'),cantPay:L('No combination of these coins pays this amount exactly. Choose another amount or add a coin.','Ninguna combinación de estas monedas paga esta cantidad exacta. Elige otra cantidad o agrega una moneda.'),errList:U.errList,errTarget:U.errTarget,errPair:U.errPair,pairOrder:L('Make both numbers of one pair at least as big as the other pair’s numbers, with at least one of them bigger.','Haz que los dos números de un par sean al menos tan grandes como los del otro par, con al menos uno mayor.')};
const CELL_STATE={'.':U.open,'#':U.wall,'~':U.mud};
function cardMaze(){const c=COUNTER[cur.key],x=ev().counter;return cur.cardMaze[cur.key]??(x&&x.input.maze!=null?A.parseMaze(x.input.maze):'.'.repeat(A.GN));}
function gridEditor(maze,modes){return `<div class="maze small" style="--cols:${A.GC}" role="group" aria-label="${esc(tx(L('Maze for your example','Laberinto para tu ejemplo')))}">${[...maze].map((ch,i)=>{const cls=['mc',ch==='#'?'wall':ch==='~'?'mud':''].filter(Boolean).join(' ');return i===A.START||i===A.GOAL?`<div class="${cls}">${i===A.START?'S':'G'}</div>`:`<button type="button" id="cx-cell-${i}" class="${cls} edit" data-cx-cell="${i}" aria-label="${esc(A.cellName(i)+': '+tx(CELL_STATE[ch]))}"></button>`;}).join('')}</div><p class="small-print muted">${esc(tx(modes.includes('~')?L('Click a cell to change it: open → mud (costs 3 to enter) → wall → open.','Haz clic en una celda para cambiarla: libre → lodo (cuesta 3 entrar) → pared → libre.'):L('Click a cell to add or remove a wall.','Haz clic en una celda para poner o quitar una pared.')))}</p>`;}
function cycleCell(i){const c=COUNTER[cur.key],m=[...cardMaze()],modes=c.grid.modes;m[i]=modes[(modes.indexOf(m[i])+1)%modes.length];cur.cardMaze[cur.key]=m.join('');renderChallenges();const el=$('cx-cell-'+i);if(el)el.focus();}
function counterCard(){const c=COUNTER[cur.key],x=ev().counter,val=f=>x&&x.input[f[0]]!=null?x.input[f[0]]:f[2];
 if(c.grid)return card('kindCounter',x&&x.status==='counter'&&x.why===0,c.title,`<p><em>${esc(u('claim'))}</em> ${esc(tx(c.claim))}</p>${gridEditor(cardMaze(),c.grid.modes)}<div class="row"><button type="button" class="primary" id="cx-go">${esc(u('checkEx'))}</button></div><div class="result" id="cx-result" tabindex="-1">${x?counterText(c,x):''}</div>`);
 const fields=c.fields.map(f=>`<label for="cx-${f[0]}">${esc(tx(f[1]))} <input type="text" id="cx-${f[0]}"${f[3]?' class="small" inputmode="numeric"':''} value="${esc(val(f))}"></label>`).join('');
 return card('kindCounter',x&&x.status==='counter'&&x.why===0,c.title,`<p><em>${esc(u('claim'))}</em> ${esc(tx(c.claim))}</p><div class="inputs">${fields}<button type="button" class="primary" id="cx-go">${esc(u('checkEx'))}</button></div><div class="result" id="cx-result" tabindex="-1">${x?counterText(c,x):''}</div>`);}
function counterText(c,x){if(x.status==='bad')return `<div class="fb no">${esc(tx(x.data.missing?c.missing(x.data):ERR[x.data.msg]))}</div>`;
 const head=`<div class="fb ${x.status==='counter'?'ok':'no'}">${esc(tx(c.text(x.status,x.data)))}</div>`;if(x.status!=='counter')return head;
 return head+`<p>${esc(tx(c.why.q))}</p><div class="opts row">${tx(c.why.options).map((o,i)=>`<button type="button" data-why="${i}"${x.why!=null?' disabled':''}${x.why===i?' aria-pressed="true"':''}>${esc(o)}</button>`).join('')}</div>${x.why!=null?`<div class="fb ${x.why===0?'ok':'no'}">${esc(tx(x.why===0?c.why.good:c.why.bad))}</div>${x.why!==0?`<button type="button" class="quiet" id="why-again">${esc(u('again'))}</button>`:''}`:''}`;}
function checkCounter(){const c=COUNTER[cur.key],input=c.grid?{maze:cardMaze()}:Object.fromEntries(c.fields.map(f=>[f[0],$('cx-'+f[0]).value])),r=c.check(input);
 const x={status:r.status,input,why:null,data:r.data};ev().counter=x;
 if(r.status!=='bad')record('counter',c.grid?L('Maze, row by row: '+input.maze.match(/.{7}/g).join(' / '),'Laberinto, fila por fila: '+input.maze.match(/.{7}/g).join(' / ')):L(c.fields.map(f=>f[1].en+': '+input[f[0]]).join(' · '),c.fields.map(f=>f[1].es+': '+input[f[0]]).join(' · ')),c.text(r.status,r.data));persist();renderChallenges('cx-result');renderRec();say($('cx-result').textContent);}
function answerWhy(i){const c=COUNTER[cur.key],x=ev().counter;if(!x||x.status!=='counter')return;x.why=i;record('why',L(c.why.options.en[i],c.why.options.es[i]),L(c.why.options.en[i]+(i===0?' ✓':''),c.why.options.es[i]+(i===0?' ✓':'')));persist();renderChallenges('cx-result');renderRec();say([...$('cx-result').querySelectorAll('.fb')].at(-1)?.textContent||'');}

const BREAK_CHANGES={nobase:L('Delete the line “if n = 0: return”','Borrar la línea “si n = 0: terminar”'),nosecond:L('Delete the second call, hanoi(n − 1, via, to, from)','Borrar la segunda llamada, hanoi(n − 1, via, to, from)'),nomove:L('Delete the line that moves disk n','Borrar la línea que mueve el disco n')};
const OUTCOMES={forever:L('It never stops','Nunca termina'),wrongplace:L('It stops with disks in the wrong place','Termina con discos en el lugar equivocado'),illegal:L('It puts a bigger disk on a smaller one','Pone un disco más grande sobre uno más chico'),works:L('It still works','Sigue funcionando')};
const BREAK_WHY={nobase:L('Without a base case each call makes another with n one smaller: 2, 1, 0, −1, −2, … The calls never stop, and no disk ever moves.','Sin caso base, cada llamada hace otra con n una unidad menor: 2, 1, 0, −1, −2, … Las llamadas nunca terminan y ningún disco se mueve.'),nosecond:L('The smaller disks are moved out of the way but never brought back, so disk 1 stays on C. Then disk 3 is put on top of it.','Los discos más chicos se quitan del camino pero nunca regresan, así que el disco 1 se queda en C. Luego el disco 3 se pone encima de él.'),nomove:L('The calls still happen, but no disk ever moves: all 3 disks stay on A.','Las llamadas siguen ocurriendo, pero ningún disco se mueve: los 3 discos se quedan en A.')};
function breaksCard(){const bk=ev().breaks||{},ch=cur.breakChange||'nobase',pd=cur.breakPred||'';
 return card('kindCounter',!!bk.nobase&&bk.nobase.pred===bk.nobase.actual,L('Break it on purpose','Rómpelo a propósito'),`<p>${esc(tx(L('Change one line, predict what happens with 3 disks, then run it.','Cambia una línea, predice qué pasa con 3 discos y luego ejecútalo.')))}</p>
 <fieldset class="choices"><legend class="small-print muted">${esc(tx(L('Change','Cambio')))}</legend>${A.HANOI_BREAKS.map(k=>`<label class="toggle"><input type="radio" name="bk-change" value="${k}"${k===ch?' checked':''}> ${esc(tx(BREAK_CHANGES[k]))}</label>`).join('')}</fieldset>
 <fieldset class="choices"><legend class="small-print muted">${esc(tx(L('Your prediction','Tu predicción')))}</legend>${A.HANOI_OUTCOMES.map(k=>`<label class="toggle"><input type="radio" name="bk-pred" value="${k}"${k===pd?' checked':''}> ${esc(tx(OUTCOMES[k]))}</label>`).join('')}</fieldset>
 <div class="row"><button type="button" class="primary" id="bk-go">${esc(tx(L('Run it','Ejecutarlo')))}</button></div>
 <div class="result" id="bk-result" tabindex="-1">${A.HANOI_BREAKS.filter(k=>bk[k]).map(k=>{const r=bk[k],ok=r.pred===r.actual;return `<div class="fb ${ok?'ok':'no'}"><b>${esc(tx(BREAK_CHANGES[k]))}.</b> ${esc(tx(ok?L(`Your prediction matched: ${OUTCOMES[r.actual].en.toLowerCase()}.`,`Tu predicción acertó: ${OUTCOMES[r.actual].es.toLowerCase()}.`):L(`You predicted “${OUTCOMES[r.pred].en.toLowerCase()}”, but ${OUTCOMES[r.actual].en.toLowerCase()}.`,`Predijiste “${OUTCOMES[r.pred].es.toLowerCase()}”, pero ${OUTCOMES[r.actual].es.toLowerCase()}.`)))} ${esc(tx(BREAK_WHY[k]))}</div>`;}).join('')}</div>`);}
function runBreak(){const ch=document.querySelector('input[name="bk-change"]:checked')?.value,pd=document.querySelector('input[name="bk-pred"]:checked')?.value;if(!ch||!pd){say(tx(L('Choose a change and a prediction first.','Primero elige un cambio y una predicción.')));return;}
 const actual=A.hanoiBreak(ch,3),bk=ev().breaks||(ev().breaks={});bk[ch]={pred:pd,actual};cur.breakChange=ch;cur.breakPred='';
 record('breaks',L(BREAK_CHANGES[ch].en+' → '+OUTCOMES[pd].en,BREAK_CHANGES[ch].es+' → '+OUTCOMES[pd].es),L(OUTCOMES[actual].en+(pd===actual?' ✓':''),OUTCOMES[actual].es+(pd===actual?' ✓':'')));persist();renderChallenges('bk-result');renderRec();say(tx(OUTCOMES[actual])+'. '+tx(BREAK_WHY[ch]));}

// Bottleneck: the learner picks a box in the flowchart; every box's run count is then shown.
const BOX={
 'bubble-sort':{pinit:L('set p ← 1','poner p ← 1'),pcheck:L('check the outer loop','revisar el ciclo exterior'),iinit:L('reset i ← 0','reiniciar i ← 0'),icheck:L('check the inner loop','revisar el ciclo interior'),cmp:L('compare neighbours','comparar vecinos'),swap:L('swap','intercambiar'),inc:L('move to the next pair','pasar al siguiente par'),pinc:L('end a pass','terminar una pasada'),done:L('finish','terminar')},
 hanoi:{base:L('check n = 0','revisar n = 0'),ret:L('return from an empty call','regresar de una llamada vacía'),call1:L('first call','primera llamada'),move:L('move a disk','mover un disco'),call2:L('second call','segunda llamada'),end:L('finish a call','terminar una llamada')},
 bfs:{init:L('start the queue','iniciar la cola'),qcheck:L('check the queue','revisar la cola'),take:L('take the front cell','tomar la primera celda'),goal:L('check for G','revisar si es G'),found:L('return the path','devolver el camino'),nb:L('look for a free neighbour','buscar un vecino libre'),add:L('mark and add a neighbour','marcar y agregar un vecino'),nopath:L('report no path','informar que no hay camino')},
 'insertion-sort':{init:L('set i ← 1','poner i ← 1'),icheck:L('check the outer loop','revisar el ciclo exterior'),take:L('take the next key','tomar la siguiente key'),wcheck:L('check the while loop','revisar el ciclo while'),shift:L('shift an item right','desplazar un elemento a la derecha'),place:L('put key in the gap','poner key en el hueco'),inc:L('move to the next item','pasar al siguiente elemento'),done:L('finish','terminar')}};
function bottleCard(){const b=ev().bottle;return card('kindBottle',b&&b.ok,L('Where does the time go?','¿A dónde se va el tiempo?'),`<p>${esc(tx(L('On the current list, which box in the flowchart runs the most times? Choose it in the flowchart above.','Con la lista actual, ¿qué caja del diagrama se ejecuta más veces? Elígela en el diagrama de arriba.')))}</p><div class="row"><button type="button" class="primary" id="bn-go" aria-pressed="${cur.pick}">${esc(tx(cur.pick?L('Cancel','Cancelar'):L('Choose in the flowchart','Elegir en el diagrama')))}</button></div><div class="result" id="bn-result" tabindex="-1">${b?bottleText(b):''}</div>`);}
function bottleMessage(b){const c=b.counts,names=BOX[cur.key],name=k=>tx(names[k]),max=Math.max(...Object.values(c)),top=Object.keys(c).find(k=>c[k]===max&&names[k]),n=c[b.node]??1;
 if(cur.key==='bubble-sort')return({
  icheck:L(`Yes. The inner loop check runs ${c.icheck} times: once before every comparison, plus once per pass to stop the loop. The comparison it guards runs ${c.cmp} times, even when nothing needs to move. The inner loop is where the time goes.`,`Sí. La revisión del ciclo interior se ejecuta ${c.icheck} veces: una antes de cada comparación y una más por pasada para terminar el ciclo. La comparación que protege se ejecuta ${c.cmp} veces, aunque nada tenga que moverse. El tiempo se va en el ciclo interior.`),
  inner:L(`Yes, this box is inside the inner loop: it runs ${c.cmp} times, once for every pair in every pass, even when nothing needs to move. Only the loop check beside it runs more (${c.icheck} times).`,`Sí, esta caja está dentro del ciclo interior: se ejecuta ${c.cmp} veces, una por cada par en cada pasada, aunque nada tenga que moverse. Solo la revisión del ciclo, a su lado, se ejecuta más (${c.icheck} veces).`),
  'swap-tie':L(`On this list every comparison led to a swap (${c.swap} of each), but the inner loop check still runs more: ${c.icheck} times. On most lists, comparisons also happen when no swap is needed.`,`Con esta lista cada comparación llevó a un intercambio (${c.swap} intercambios y ${c.cmp} comparaciones), pero la revisión del ciclo interior se ejecuta todavía más: ${c.icheck} veces. En la mayoría de las listas también hay comparaciones sin intercambio.`),
  swap:L(`Swaps run ${c.swap} times, but comparisons run ${c.cmp} times: every swap needs a comparison first. Look at what runs before every swap.`,`Los intercambios se ejecutan ${c.swap} veces, pero las comparaciones ${c.cmp} veces: cada intercambio necesita antes una comparación. Mira qué se ejecuta antes de cada intercambio.`),
  max:L(`Yes. This box runs ${n} times, as often as any box on this list.`,`Sí. Esta caja se ejecuta ${n} veces, tanto como cualquier otra con esta lista.`),
  outer:L(`That box runs only ${n} time${n===1?'':'s'}. Look inside the inner loop.`,`Esa caja se ejecuta solo ${n} ${n===1?'vez':'veces'}. Mira dentro del ciclo interior.`)})[b.verdict];
 if(cur.key==='hanoi'&&b.verdict==='max'&&b.node==='base')return L(`Yes. The n = 0 check runs ${c.base} times, once per call, and ${c.ret} of those calls, more than half, find nothing to move. Stopping at n = 1 instead would skip them and make the same ${c.move} moves.`,`Sí. La revisión n = 0 se ejecuta ${c.base} veces, una por llamada, y ${c.ret} de esas llamadas, más de la mitad, no tienen nada que mover. Detenerse en n = 1 las evitaría y haría los mismos ${c.move} movimientos.`);
 if(cur.key==='bfs'&&b.verdict==='max'&&b.node==='nb')return L(`Yes. Looking for a free neighbour runs ${c.nb} times: once for each neighbour added and once more per cell when none is left. Each cell taken looks at up to four neighbours, so this is where the time goes.`,`Sí. Buscar un vecino libre se ejecuta ${c.nb} veces: una por cada vecino agregado y una más por celda cuando ya no queda ninguno. Cada celda tomada mira hasta cuatro vecinos, así que el tiempo se va aquí.`);
 if(b.verdict==='max'){if(b.node==='wcheck')return L(`Yes. The while check runs ${c.wcheck} times: once before every shift (${c.shift}), plus once for each item when it stops. On a list that is far from sorted, this is where the time goes.`,`Sí. La revisión del while se ejecuta ${c.wcheck} veces: una antes de cada desplazamiento (${c.shift}) y una más por cada elemento cuando se detiene. En una lista lejos de estar ordenada, el tiempo se va aquí.`);
  if(b.node==='icheck'&&c.shift===0)return L(`Yes, on this list. It is already sorted, so no item moves: the while check runs only ${c.wcheck} times, once per item, and the outer loop check runs ${c.icheck} times. Try a list in decreasing order and count again.`,`Sí, con esta lista. Ya está ordenada, así que ningún elemento se mueve: la revisión del while se ejecuta solo ${c.wcheck} veces, una por elemento, y la del ciclo exterior ${c.icheck} veces. Prueba una lista en orden decreciente y vuelve a contar.`);
  return L(`Yes. This box runs ${n} times, as often as any box on this list.`,`Sí. Esta caja se ejecuta ${n} veces, tanto como cualquier otra con esta lista.`);}
 if(b.verdict==='shift')return L(`Shifts run ${c.shift} times, but the while check runs ${c.wcheck} times: it runs before every shift, and once more for each item when it stops.`,`Los desplazamientos se ejecutan ${c.shift} veces, pero la revisión del while ${c.wcheck} veces: se ejecuta antes de cada desplazamiento y una vez más por cada elemento cuando se detiene.`);
 return L(`That box runs ${n} time${n===1?'':'s'}. The box that runs most on this list is “${names[top].en}”, with ${max} runs.`,`Esa caja se ejecuta ${n} ${n===1?'vez':'veces'}. La que más se ejecuta con esta lista es “${names[top].es}”, con ${max}.`);}
function bottleText(b){const names=BOX[cur.key],rows=Object.entries(b.counts).filter(([k])=>names[k]).sort((x,y)=>y[1]-x[1]);
 const what=cur.key==='hanoi'?L(`Disks: ${b.list[0]}`,`Discos: ${b.list[0]}`):cur.key==='bfs'?L('The maze in the workbench above','El laberinto del banco de trabajo de arriba'):L(`List: ${b.list.join(', ')}`,`Lista: ${b.list.join(', ')}`);
 return `<p class="small-print muted">${esc(tx(what))}</p><div class="tablewrap" tabindex="0"><table><thead><tr><th scope="col">${esc(tx(L('Box','Caja')))}</th><th scope="col">${esc(tx(L('Runs on this list','Veces con esta lista')))}</th></tr></thead><tbody>${rows.map(([k,v])=>`<tr${k===b.node?' class="last"':''}><td>${esc(tx(names[k]))}</td><td>${v}</td></tr>`).join('')}</tbody></table></div><div class="fb ${b.ok?'ok':'no'}">${esc(tx(bottleMessage(b)))}</div>`;}
function chooseBox(node){let list=[],counts,verdict,ok,inputText;
 if(cur.key==='bubble-sort'||cur.key==='insertion-sort'){list=[...cur.input.list];counts=A.boxCounts(cur.key,list);if(cur.key==='bubble-sort'){verdict=A.judgeBottleneck(node,counts);ok=['icheck','inner','max'].includes(verdict);}else{verdict=A.judgeInsertionBox(node,counts);ok=verdict==='max';}}
 else{counts=A.traceCounts(cur.key,cur.input);delete counts.start;const max=Math.max(...Object.values(counts));verdict=counts[node]===max?'max':'low';ok=verdict==='max';if(cur.key==='hanoi')list=[cur.input.disks];else inputText=cur.input.maze;}
 cur.pick=false;const b={node,ok,verdict,counts,list};if(inputText!==undefined)b.inputText=inputText;ev().bottle=b;record('bottle',cur.key==='hanoi'?L(`${list[0]} disks`,`${list[0]} discos`):inputText!==undefined?L('Maze, row by row: '+inputText.match(/.{7}/g).join(' / '),'Laberinto, fila por fila: '+inputText.match(/.{7}/g).join(' / ')):list.join(', '),L(BOX[cur.key][node].en+(ok?' ✓':''),BOX[cur.key][node].es+(ok?' ✓':'')));persist();renderBench();renderChallenges('bn-result');renderRec();
 $('bn-result').scrollIntoView({block:'nearest',behavior:reduced()?'instant':'smooth'});say(tx(bottleMessage(b)));}

// Improvements, each tested on many inputs.
const BUILD_HINTS=[L('Look at the middle item first.','Mira primero el elemento del medio.'),L('If the middle item is smaller than the target, every item to its left is smaller too, so they can all be skipped.','Si el elemento del medio es menor que el número buscado, todos los de su izquierda también lo son, así que puedes descartarlos.'),L('After checking mid, do not check it again: move low to mid + 1 or high to mid − 1.','Después de revisar mid, no lo revises otra vez: mueve low a mid + 1 o high a mid − 1.'),L('One working order: mid ← …, then the equality test, then the rule that moves low or high, with the loop running while low ≤ high.','Un orden que funciona: mid ← …, luego la prueba de igualdad y luego la regla que mueve low o high, con el ciclo mientras low ≤ high.')];
function builderCard(){const b=ev().built,s=state.builder,sel=(id,opts,v,label)=>`<select id="${id}" aria-label="${esc(tx(label))}">${opts.map((o,i)=>`<option value="${i}"${i===v?' selected':''}>${esc(o)}</option>`).join('')}</select>`,steps=A.BUILD.steps[lc()];
 return card('kindImprove',b&&b.passed===b.total,L('Faster on a sorted list','Más rápido en una lista ordenada'),`<p>${esc(tx(L('The list is sorted. Build a search from these blocks that checks fewer items than linear search.','La lista está ordenada. Arma con estos bloques una búsqueda que revise menos elementos que la búsqueda lineal.')))}</p>
 <div class="builder" data-no-frac><div class="row">low ← 0,  high ← n − 1</div><div class="row">${tx(L('while','mientras'))} ${sel('b-cond',A.BUILD.cond[lc()],s.cond,L('Loop condition','Condición del ciclo'))}:</div>${[0,1,2].map(i=>`<div class="row"><span class="ind"></span>${sel('b-slot'+i,steps,s.slots[i],L(`Step ${i+1} inside the loop`,`Paso ${i+1} dentro del ciclo`))}</div>`).join('')}<div class="row">${tx(L('return −1','devolver −1'))}</div></div>
 <div class="row"><button type="button" class="primary" id="b-test">${esc(tx(L('Test it on 300 lists','Probarla con 300 listas')))}</button><button type="button" id="b-hint"${s.hint>=BUILD_HINTS.length?' disabled':''}>${esc(tx(s.hint<BUILD_HINTS.length?L('Teach me: give a hint','Enséñame: dame una pista'):L('No more hints','No hay más pistas')))}</button></div>
 ${s.hint?`<ol class="hints">${BUILD_HINTS.slice(0,s.hint).map(h=>`<li>${esc(tx(h))}</li>`).join('')}</ol>`:''}<div class="result" id="b-result" tabindex="-1">${b?builtText(b):''}</div>`);}
function builtSummary(r){if(r.passed===r.total)return L(`Passed ${r.passed} of ${r.total} lists. Worst case: ${r.worst} checks for 100 items, against ${r.linWorst} for linear search; on average ${r.avg} against ${r.linAvg}.`,`Pasó ${r.passed} de ${r.total} listas. Peor caso: ${r.worst} revisiones para 100 elementos, contra ${r.linWorst} de la búsqueda lineal; en promedio ${r.avg} contra ${r.linAvg}.`);
 const f=r.fail,shown=f.list.length>10?`[${f.list.slice(0,5).join(', ')}, …, ${f.list.slice(-2).join(', ')}] (${f.list.length})`:`[${f.list.join(', ')}]`;
 const why=f.error==='unset'?L('mid is used before it has a value','mid se usa antes de tener un valor'):f.error==='outside'?L('mid points outside the list','mid apunta fuera de la lista'):f.error==='stuck'?L('it never stops: low and high stop changing','nunca termina: low y high dejan de cambiar'):L(`it returned ${f.got}`,`la búsqueda devolvió ${f.got}`);
 return L(`Passed ${r.passed} of ${r.total} lists. First failure: list ${shown}, target ${f.target}. Expected ${f.want}, but ${why.en}.`,`Pasó ${r.passed} de ${r.total} listas. Primera falla: lista ${shown}, buscado ${f.target}. Se esperaba ${f.want}, pero ${why.es}.`);}
function builtText(r){return `<div class="fb ${r.passed===r.total?'ok':'no'}">${esc(tx(builtSummary(r)))}</div>`;}
function testBuilder(){const cond=+$('b-cond').value,slots=[0,1,2].map(i=>+$('b-slot'+i).value);state.builder.cond=cond;state.builder.slots=slots;
 const r={...A.testBuilder(cond,slots),hints:state.builder.hint};ev().built=r;const B=A.BUILD;record('built',L(`while ${B.cond.en[cond]}: ${slots.map(s=>B.steps.en[s]).join(' | ')}`,`mientras ${B.cond.es[cond]}: ${slots.map(s=>B.steps.es[s]).join(' | ')}`),builtSummary(r));persist();renderChallenges('b-result');renderRec();say(tx(builtSummary(r)));}

const IMPROVE={
 'find-max':{kind:'minmax',title:L('Largest and smallest together','El mayor y el menor a la vez'),lead:L('You need both the largest and the smallest number. Choose a method, then test it on random, increasing and decreasing lists of 100 items.','Necesitas el número más grande y el más pequeño. Elige un método y pruébalo con listas al azar, crecientes y decrecientes de 100 elementos.'),
  options:[L('Find the maximum, then make a second pass for the minimum','Encontrar el máximo y luego hacer una segunda pasada para el mínimo'),L('Take the items in pairs: compare the two, then the larger with the maximum and the smaller with the minimum','Tomar los elementos por pares: comparar los dos y luego el mayor con el máximo y el menor con el mínimo'),L('One pass: compare an item with the minimum only when it is not a new maximum','Una pasada: comparar un elemento con el mínimo solo cuando no es un nuevo máximo')],
  cols:[L('List','Lista'),L('Correct','Correctas'),L('Two passes','Dos pasadas'),L('Yours','La tuya')],names:{random:L('Random','Al azar'),increasing:L('Increasing','Creciente'),decreasing:L('Decreasing','Decreciente')},
  run:v=>({kind:'minmax',...A.testMinMax(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>[L('This is the starting point: 198 comparisons on every list, two for each item after the first. Can you save some?','Este es el punto de partida: 198 comparaciones en cada lista, dos por cada elemento después del primero. ¿Puedes ahorrar algunas?'),L('Correct on every list, with 148 comparisons instead of 198 on each kind: about 3n/2 instead of 2n. Each pair costs 3 comparisons instead of 4.','Correcto en todas las listas, con 148 comparaciones en lugar de 198 en cada tipo: unas 3n/2 en lugar de 2n. Cada par cuesta 3 comparaciones en lugar de 4.'),L('Correct on every list. It saves a lot on increasing lists (99) but nothing on decreasing ones (198): the worst case is unchanged.','Correcto en todas las listas. Ahorra mucho en listas crecientes (99), pero nada en las decrecientes (198): el peor caso no cambia.')][r.v]},
 'binary-search':{kind:'first',title:L('The first of repeated items','El primero de varios iguales'),lead:L('With repeated numbers, binary search can return any of their positions. Choose a change that always returns the first one, then test it on 300 sorted lists of 50 items.','Con números repetidos, la búsqueda binaria puede devolver cualquiera de sus posiciones. Elige un cambio que siempre devuelva la primera y pruébalo con 300 listas ordenadas de 50 elementos.'),
  options:[L('Return mid as soon as a[mid] = target (as taught)','Devolver mid en cuanto a[mid] = target (como se enseñó)'),L('When a[mid] = target, remember mid and keep searching the left half','Cuando a[mid] = target, recordar mid y seguir buscando en la mitad izquierda'),L('When a[mid] = target, step left one item at a time while the item before is also the target','Cuando a[mid] = target, avanzar a la izquierda de uno en uno mientras el anterior también sea el número buscado'),L('When a[mid] = target, remember mid and keep searching the right half','Cuando a[mid] = target, recordar mid y seguir buscando en la mitad derecha')],
  cols:[L('List','Lista'),L('First position','Primera posición'),L('Most checks before','Más revisiones antes'),L('Most checks now','Más revisiones ahora')],names:{repeats:L('Many repeats','Muchos repetidos'),equal:L('All equal','Todos iguales'),distinct:L('All different','Todos distintos')},
  run:v=>({kind:'first',...A.testFirst(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const most=Math.max(...r.rows.map(x=>x[3])),eq=r.rows.find(x=>x[0]==='equal')[3];return[L('As taught, it returns one of the matching positions, often not the first. Change what happens on a match.','Como se enseñó, devuelve alguna de las posiciones que coinciden, a menudo no la primera. Cambia lo que pasa al encontrar una coincidencia.'),L(`Always the first position, with at most ${most} checks for 50 items: still about log₂ n.`,`Siempre la primera posición, con a lo más ${most} revisiones para 50 elementos: sigue siendo cerca de log₂ n.`),L(`Always the first position, but stepping left takes up to ${eq} checks when many items are equal: the worst case grows like n again.`,`Siempre la primera posición, pero avanzar a la izquierda toma hasta ${eq} revisiones cuando muchos elementos son iguales: el peor caso vuelve a crecer como n.`),L('It returns the last matching position, not the first.','Devuelve la última posición que coincide, no la primera.')][r.v];}},
 'merge-sort':{kind:'mergeskip',title:L('Skip what is already in order','Saltar lo que ya está en orden'),lead:L('Choose a change to merge sort, then test it on random, nearly sorted and reversed lists of 64 items.','Elige un cambio al ordenamiento por mezcla y pruébalo con listas al azar, casi ordenadas e invertidas de 64 elementos.'),
  options:[L('No change (as taught)','Sin cambios (como se enseñó)'),L('Before a merge, compare the last item of the left run with the first of the right run; if they are in order, skip the merge','Antes de mezclar, comparar el último del tramo izquierdo con el primero del derecho; si están en orden, saltar la mezcla'),L('Compare only the first items of the two runs, then put one whole run before the other','Comparar solo los primeros de los dos tramos y luego poner un tramo completo antes que el otro')],
  cols:[L('List','Lista'),L('Sorted','Ordenadas'),L('Before','Antes'),L('Yours','La tuya')],names:{random:L('Random','Al azar'),nearly:L('Nearly sorted','Casi ordenada'),reversed:L('Reversed','Invertida')},
  run:v=>({kind:'mergeskip',...A.testMergeImprove(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>{const row=k=>r.rows.find(x=>x[0]===k);if(!r.correct)return L('Some lists end up unsorted: deciding from the first items alone cannot interleave two runs.','Algunas listas quedan sin ordenar: decidir solo con los primeros elementos no puede intercalar dos tramos.');if(r.v===0)return L('This is merge sort as taught: it does about the same work on every kind of list.','Este es el ordenamiento por mezcla como se enseñó: hace más o menos el mismo trabajo con cualquier tipo de lista.');
   return L(`Correct on every list. Nearly sorted lists drop from ${row('nearly')[2]} to ${row('nearly')[3]} comparisons, but random and reversed lists pay for the extra check: ${row('random')[3]} and ${row('reversed')[3]} instead of ${row('random')[2]} and ${row('reversed')[2]}. A change can help one kind of input and cost another.`,`Correcto con todas las listas. Las casi ordenadas bajan de ${row('nearly')[2]} a ${row('nearly')[3]} comparaciones, pero las listas al azar e invertidas pagan la revisión extra: ${row('random')[3]} y ${row('reversed')[3]} en lugar de ${row('random')[2]} y ${row('reversed')[2]}. Un cambio puede ayudar a un tipo de entrada y perjudicar a otro.`);}},
 dfs:{kind:'dfsimp',title:L('Head toward the goal','Ir hacia la meta'),lead:L('Choose an order for trying neighbours, then test it on 300 mazes: open, with few walls and with many.','Elige un orden para probar los vecinos y pruébalo con 300 laberintos: abiertos, con pocas paredes y con muchas.'),
  options:[L('Up, right, down, left (as taught)','Arriba, derecha, abajo, izquierda (como se enseñó)'),L('Take the free neighbour closest to G first','Tomar primero el vecino libre más cercano a G'),L('Look only right and down, since G is down and to the right','Mirar solo a la derecha y abajo, porque G está abajo a la derecha')],
  cols:[L('Mazes','Laberintos'),L('Right answer','Respuesta correcta'),L('Cells marked before','Celdas marcadas antes'),L('Cells marked now','Celdas marcadas ahora')],names:{open:L('Open','Abiertos'),sparse:L('Few walls','Pocas paredes'),dense:L('Many walls','Muchas paredes')},
  run:v=>({kind:'dfsimp',...A.testDfsImprove(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>!r.correct?L('Some mazes got the wrong answer: when the only way round goes up or left, looking only right and down misses it.','Algunos laberintos recibieron la respuesta equivocada: cuando el único paso va hacia arriba o a la izquierda, mirar solo a la derecha y abajo no lo encuentra.'):r.v===0?L('This is DFS as taught.','Esta es la DFS como se enseñó.'):L('Right on every maze, and fewer cells are marked on average. It is only a guess about where G is: a maze can still fool it, and its path is still not always the shortest.','Correcta con todos los laberintos, y en promedio se marcan menos celdas. Es solo una suposición sobre dónde está G: un laberinto todavía puede engañarla, y su camino sigue sin ser siempre el más corto.')},
 'greedy-change':{kind:'change',title:L('Divide instead of subtracting','Dividir en vez de restar'),lead:L('With coins of 25, 10, 5 and 1, choose a change and test it on 300 amounts, from small to very large.','Con monedas de 25, 10, 5 y 1, elige un cambio y pruébalo con 300 cantidades, de chicas a muy grandes.'),
  options:[L('Subtract one coin at a time (as taught)','Restar una moneda a la vez (como se enseñó)'),L('For each coin c, take ⌊amount / c⌋ coins at once and keep the remainder','Para cada moneda c, tomar ⌊amount / c⌋ monedas de una vez y quedarse con el residuo'),L('Use only the largest coin, as many times as it fits','Usar solo la moneda más grande, tantas veces como quepa')],
  cols:[L('Amounts','Cantidades'),L('Same coins','Mismas monedas'),L('Steps before','Pasos antes'),L('Steps now','Pasos ahora')],names:{small:L('Up to 99','Hasta 99'),medium:L('100 to 9,999','100 a 9,999'),large:L('10,000 to 999,999','10,000 a 999,999')},
  run:v=>({kind:'change',...A.testChange(v)}),ok:r=>r.v===1&&r.correct,
  message:r=>!r.correct?L('Often wrong: whatever is left after the largest coin is never paid.','Muchas veces falla: lo que queda después de la moneda más grande nunca se paga.'):r.v===0?L('This is the method as taught: one subtraction per coin, so large amounts take many steps.','Este es el método como se enseñó: una resta por moneda, así que las cantidades grandes toman muchos pasos.'):L('The same coins every time, in 4 steps whatever the amount: one division per kind of coin. It is the same idea as the remainder in Euclid’s algorithm.','Las mismas monedas cada vez, en 4 pasos sin importar la cantidad: una división por tipo de moneda. Es la misma idea que el residuo en el algoritmo de Euclides.')},
 euclid:{kind:'euclid',title:L('From subtraction to remainders','De la resta al residuo'),lead:L('Euclid’s own method subtracts the smaller number from the larger until the two are equal. Choose a change, then test it on 200 random pairs below 1,000.','El método original de Euclides resta el número menor al mayor hasta que los dos son iguales. Elige un cambio y pruébalo con 200 pares al azar menores que 1,000.'),
  options:[L('Keep subtracting the smaller number (the original method)','Seguir restando el número menor (el método original)'),L('Replace all the subtractions by one remainder: a mod b','Reemplazar todas las restas por un residuo: a mod b'),L('Subtract 1 from the larger number instead','Restar 1 al número mayor, en vez de restarle el menor'),L('Halve the larger number whenever it is even','Dividir a la mitad el número mayor cuando sea par')],
  run:v=>({kind:'euclid',...A.testEuclidVariant(v)}),ok:r=>r.v===1&&r.ok===r.total,
  message:r=>{if(r.ok===r.total)return r.v===1?L(`Correct on all ${r.total} pairs, with ${r.mine} steps on average instead of ${r.base}. One remainder does the work of many subtractions in a row.`,`Correcto en los ${r.total} pares, con ${r.mine} pasos en promedio en lugar de ${r.base}. Un residuo hace el trabajo de muchas restas seguidas.`):L(`Correct on all ${r.total} pairs, with ${r.mine} steps on average. This is the starting point: when one number is much bigger, it subtracts the same number again and again.`,`Correcto en los ${r.total} pares, con ${r.mine} pasos en promedio. Este es el punto de partida: cuando un número es mucho mayor, resta el mismo número una y otra vez.`);
   const f=r.fail,why=r.v===2?L('Subtracting 1 does not keep the common divisors.','Restar 1 no conserva los divisores comunes.'):L('Halving one number is safe only when the other is odd. When both are even, it removes a factor of 2 that they share.','Dividir a la mitad un número solo es seguro cuando el otro es impar. Cuando los dos son pares, quita un factor 2 que comparten.');
   return L(`Only ${r.ok} of ${r.total} pairs gave the greatest common divisor. First failure: for (${f.a}, ${f.b}) the answer is ${f.want}, but this method gave ${f.got??'no answer'}. ${why.en}`,`Solo ${r.ok} de ${r.total} pares dieron el máximo común divisor. Primera falla: para (${f.a}, ${f.b}) la respuesta es ${f.want}, pero este método dio ${f.got??'ninguna respuesta'}. ${why.es}`);}},
 'bubble-sort':{kind:'bubble',title:L('Less comparing','Comparar menos'),lead:L('Choose changes to bubble sort, then test them on random, nearly sorted and reversed lists of 50 items.','Elige cambios para el ordenamiento burbuja y pruébalos con listas al azar, casi ordenadas e invertidas de 50 elementos.'),
  checks:[['early',L('Stop as soon as a pass makes no swaps','Parar en cuanto una pasada no haga intercambios')],['skip2',L('Compare a[i] with a[i + 2] to move faster','Comparar a[i] con a[i + 2] para avanzar más rápido')],['back',L('Run each pass from right to left','Hacer cada pasada de derecha a izquierda')]],
  cols:[L('List','Lista'),L('Sorted','Ordenadas'),L('Before','Antes'),L('Yours','La tuya')],names:{random:L('Random','Al azar'),nearly:L('Nearly sorted','Casi ordenada'),reversed:L('Reversed','Invertida')},
  run:o=>({kind:'bubble',...A.testImprove(o)}),ok:r=>r.correct&&r.early,
  message:r=>!r.correct?L('Some lists did not end up sorted. Comparing a[i] with a[i + 2] never compares direct neighbours, so two neighbours can stay out of order.','Algunas listas no quedaron ordenadas. Comparar a[i] con a[i + 2] nunca compara vecinos directos, así que dos vecinos pueden quedar en desorden.'):r.early?L('Correct on every list. Stopping early saves a lot on nearly sorted lists, but nothing on reversed ones: every pass still finds a swap. The worst case is unchanged.','Correcto en todas las listas. Parar antes ahorra mucho en listas casi ordenadas, pero nada en las invertidas: cada pasada sigue encontrando un intercambio. El peor caso no cambia.'):L('Correct, but the comparisons did not drop. Which pass could tell you that the list is already sorted?','Correcto, pero las comparaciones no bajaron. ¿Qué pasada podría avisarte que la lista ya está ordenada?')}};
function improveCard(){const c=IMPROVE[cur.key],r=ev().improve;let controls;
 if(c.kind==='bubble'){const o=state.improveOpts;controls=c.checks.map(([k,label])=>`<label class="toggle"><input type="checkbox" id="im-${k}"${o[k]?' checked':''}> ${esc(tx(label))}</label>`).join('');}
 else{const chosen=r?r.v:0;controls=`<fieldset class="choices"><legend class="sr">${esc(tx(c.title))}</legend>${c.options.map((o,i)=>`<label class="toggle"><input type="radio" name="im-v" value="${i}"${i===chosen?' checked':''}> ${esc(tx(o))}</label>`).join('')}</fieldset>`;}
 return card('kindImprove',r&&c.ok(r),c.title,`<p>${esc(tx(c.lead))}</p>${controls}<div class="row"><button type="button" class="primary" id="im-go">${esc(tx(L('Test my version','Probar mi versión')))}</button></div><div class="result" id="im-result" tabindex="-1">${r?improveText(c,r):''}</div>`);}
function improveText(c,r){const msg=`<div class="fb ${c.ok(r)?'ok':'no'}">${esc(tx(c.message(r)))}</div>`;if(!r.rows)return msg;
 return `<div class="tablewrap" tabindex="0"><table><thead><tr>${c.cols.map(h=>`<th scope="col">${esc(tx(h))}</th>`).join('')}</tr></thead><tbody>${r.rows.map(([k,ok,b,m])=>`<tr><td>${esc(tx(c.names[k]||k))}</td><td>${ok}/100</td><td>${b}</td><td>${m}</td></tr>`).join('')}</tbody></table></div>`+msg;}
function testImprove(){const c=IMPROVE[cur.key];let arg,input;
 if(c.kind==='bubble'){arg=Object.fromEntries(c.checks.map(([k])=>[k,$('im-'+k).checked]));state.improveOpts=arg;const on=c.checks.filter(([k])=>arg[k]).map(([,l])=>l);input=L(on.map(l=>l.en).join(' + ')||'(no change)',on.map(l=>l.es).join(' + ')||'(sin cambios)');}
 else{const v=document.querySelector('input[name="im-v"]:checked');arg=v?+v.value:0;input=c.options[arg];}
 const r=c.run(arg);ev().improve=r;record('improve',input,c.message(r));persist();renderChallenges('im-result');renderRec();say(tx(c.message(r)));}

function cplxCard(){const c=A.CPLX[cur.key],r=ev().cplx;return card('kindCost',r&&r.ok,U.cplxTitle,`<p>${esc(tx(c.q))}</p><div class="opts row">${tx(c.options).map((o,i)=>`<button type="button" data-cx="${i}"${r?' disabled':''}${r&&r.choice===i?' aria-pressed="true"':''}>${esc(o)}</button>`).join('')}</div><div class="result" id="cplx-result" tabindex="-1">${r?`<div class="fb ${r.ok?'ok':'no'}">${esc(u(r.ok?'yes':'notQuite'))} ${esc(tx(c.why))}</div><button type="button" class="quiet" id="cx-again">${esc(u('again'))}</button>`:''}</div>`);}
function answerCplx(i){const c=A.CPLX[cur.key],ok=i===c.answer;ev().cplx={ok,choice:i};record('cplx',L(c.options.en[i],c.options.es[i]),L(c.options.en[i]+(ok?' ✓':''),c.options.es[i]+(ok?' ✓':'')));persist();renderChallenges('cplx-result');renderRec();say($('cplx-result').textContent);}

function renderChallenges(focusId){$('think-title').textContent=u('think');$('think-lead').textContent=tx(LEADS[cur.key]);
 const box=$('challenges'),active=box.contains(document.activeElement)?document.activeElement.id:null;
 const drafts=box.dataset.drafts===cur.key?[...box.querySelectorAll('input,select')].map(el=>({id:el.id,name:el.name,value:el.value,checked:el.checked,type:el.type})):[];
 const make={idea:ideaCard,counter:counterCard,bottle:bottleCard,builder:builderCard,breaks:breaksCard,first:improveCard,mergeskip:improveCard,dfsimp:improveCard,change:improveCard,minmax:improveCard,bubble:improveCard,euclid:improveCard,cplx:cplxCard};
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
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur.pick){cur.pick=false;renderBench();renderChallenges();$('bn-go')?.focus();}});
document.addEventListener('change',e=>{if(e.target.name==='bk-change')cur.breakChange=e.target.value;else if(e.target.name==='bk-pred')cur.breakPred=e.target.value;else if(e.target.id==='skip'){state.skip[cur.key]=e.target.checked;cur.pending=false;cur.forcePredict=false;persist();renderBench();if(cur.playing)schedule();}});
document.addEventListener('input',e=>{if(e.target.id==='idea'){const v=e.target.value;state.ideas[cur.key]=v;const s=$('idea-s');if(s)s.textContent=u(v?'ideaSaved':'ideaNote');queueSave();renderRec();}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches&&e.target.matches('#alg .inputs input')){e.preventDefault();applyInput();}});
document.addEventListener('quidence:language',()=>{if($('app').hidden)return;renderAll();announce();if($('modal').open){if($('reset-confirm'))showReset();else showSession();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&unsavedWork)persist();});
window.addEventListener('pagehide',()=>{if(unsavedWork)persist();});
window.addEventListener('beforeunload',e=>{if(unsavedWork&&(saveBlocked||!storeAvailable)){e.preventDefault();e.returnValue='';}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
function boot(){if(!A||!A.ORDER.length){$('loading').textContent='The algorithms could not be loaded. Reload the page to try again.';return;}
 restore();const want=new URLSearchParams(location.search).get('algorithm');cur.key=A.ORDER.includes(want)?want:state.alg;state.alg=cur.key;cur.input=defaults();build();
 $('loading').hidden=true;$('app').hidden=false;renderAll();}
boot();
})();
