(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceI18n=api;})(typeof window==='object'?window:globalThis,root=>{
'use strict';
// COORDINATE_UI_ES_START
const coordinateUI=Object.freeze({
  "Coordinate Geometry": "Geometría analítica",
  "COORDINATE GEOMETRY": "GEOMETRÍA ANALÍTICA",
  "Start Coordinate Geometry": "Empieza Geometría analítica",
  "High school → university bridge": "Puente entre secundaria y universidad",
  "Connect coordinates, distance and equations through two guided projects.": "Relaciona coordenadas, distancias y ecuaciones mediante dos proyectos guiados.",
  "Two six-step projects. Start with arithmetic and simple equations; later spatial work is planned.": "Dos proyectos de seis pasos. Basta saber aritmética y ecuaciones sencillas; el trabajo espacial vendrá después.",
  "Explore coordinate projects →": "Explorar proyectos de geometría analítica →",
  "Related coordinate geometry projects →": "Proyectos relacionados de geometría analítica →",
  "Related coordinate geometry projects ↗": "Proyectos relacionados de geometría analítica ↗",
  "Coordinate Geometry illustration": "Ilustración de geometría analítica",
  "Coordinate Geometry projects": "Proyectos de geometría analítica",
  "Explore coordinate projects": "Explorar proyectos de geometría analítica",
  "Guided projects": "Proyectos guiados",
  "Foundation check: not available yet": "Comprobación de fundamentos: aún no disponible",
  "Understanding check: not available yet": "Comprobación de comprensión: aún no disponible",
  "Not available yet": "Aún no disponible",
  "Lessons": "Lecciones",
  "Foundation check": "Comprobación de fundamentos",
  "Understanding check": "Comprobación de comprensión",
  "Intuition Lab activity": "Actividad del Laboratorio de intuición",
  "Thirteen mathematics courses and two physics foundations courses · 64 diagnostic problems, 20 field projects, two Coordinate Geometry projects, 10 Number Theory and 10 Discrete Mathematics proof projects, two Game Theory projects and one case study, and separate 15-question foundation checks in thirteen tracks. Coordinate Geometry, Number Theory and Discrete Mathematics keep separate project notebooks; explanations and proofs remain pending review.": "Trece cursos de matemáticas y dos cursos de fundamentos de física · 64 problemas de diagnóstico, 20 proyectos de aplicación, dos proyectos de geometría analítica, 10 proyectos de demostración de teoría de números y 10 de matemáticas discretas, dos proyectos de teoría de juegos y un caso de estudio, y evaluaciones de fundamentos de 15 preguntas en trece áreas. La geometría analítica, la teoría de números y las matemáticas discretas tienen cuadernos de proyectos separados; las explicaciones y demostraciones quedan pendientes de revisión.",
  "Lessons: not available yet": "Lecciones: aún no disponibles",
  "Intuition Lab activity: not available yet": "Actividad del Laboratorio de intuición: aún no disponible",
  "Four short lessons, two six-step projects, and foundation and understanding checks.": "Cuatro lecciones breves, dos proyectos de seis pasos y comprobaciones de fundamentos y de comprensión.",
  "Connect coordinates, distance and equations through four lessons and two guided projects.": "Relaciona coordenadas, distancias y ecuaciones mediante cuatro lecciones y dos proyectos guiados.",
  "Lessons and guided projects": "Lecciones y proyectos guiados",
  "Four lessons · two projects with six steps each": "Cuatro lecciones · dos proyectos de seis pasos cada uno"
});
// COORDINATE_UI_ES_END
const KEY='quidence_ui_locale_v1',normalize=s=>String(s??'').replace(/\s+/g,' ').trim();
const protectedSelector='[data-no-translate],textarea,input,pre,code,blockquote,[contenteditable],.student-work,.f-quote,.f-answer-text';
const textMemory=new WeakMap(),attributeMemory=new WeakMap(),imageMemory=new WeakMap();
let locale='en',observer=null,pending=false,control=null,catalogPromise=null,requestSequence=0;
const missing=new Set(),sourceURL=root.document?.currentScript?.src;
// English-only dialogue pages must not overwrite the rest of the site's language preference.
const fixedEnglish=root.document?.documentElement?.getAttribute('data-fixed-language')==='en';
function preferredLocale(){try{return root.localStorage.getItem(KEY)==='es'?'es':'en';}catch{return 'en';}}
const markdownMemory=new WeakMap();
const catalog=()=>root.QuidenceSpanish||{};
const caption=source=>{const direct=coordinateUI[source]??coordinateUI[source+'.']??catalog()[source]??catalog()[source+'.'];return direct===undefined?null:direct;};
let quantitiesSource=null,quantities=[],quantityIndex=new Map();
const quantityBucket=key=>key.match(/^[^\s\d−+.-]+/)?.[0]||'#number';
function quantityCandidates(key){return quantityIndex.get(quantityBucket(key))||[];}
// Only reviewed, complete formats are interpolated. An unknown sentence is
// never assembled from translated words or arbitrary substrings.
function template(key){
 if(quantitiesSource!==root.QuidenceSpanishQuantities){quantitiesSource=root.QuidenceSpanishQuantities;quantityIndex=new Map();quantities=(quantitiesSource||[]).map(([en,es])=>{const item=[new RegExp('^'+en.split('[n]').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('([-−+]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)')+'$'),es],bucket=en.startsWith('[n]')?'#number':quantityBucket(en.split('[n]')[0]);if(!quantityIndex.has(bucket))quantityIndex.set(bucket,[]);quantityIndex.get(bucket).push(item);return item;});}
 for(const [pattern,output]of quantityCandidates(key)){const m=key.match(pattern);if(m){let i=0;return output.replace(/\[n\]/g,()=>m[++i]);}}
 const patterns=[
  [/^Point (\d+)$/,m=>'Punto '+m[1]],
  [/^Change sign for (.+)$/,m=>{const label=translate(m[1],false);return label!==m[1]?'Cambiar el signo de '+label:null;}],
  [/^(.+) magnitude$/,m=>{const label=translate(m[1],false);return label!==m[1]?'Magnitud de '+label:null;}],
  [/^Support: lesson seen=(true|false); earlier feedback=(true|false); other help reported=(true|false)$/,m=>'Apoyo: lección vista='+(m[1]==='true'?'sí':'no')+'; comentarios anteriores='+(m[2]==='true'?'sí':'no')+'; otra ayuda declarada='+(m[3]==='true'?'sí':'no')],
  [/^(\d+)\. (.+)$/,m=>{const label=translate(m[2],false);return label!==m[2]?m[1]+'. '+label:null;}],
  [/^(\d+) steps$/,m=>m[1]+' pasos'],
  [/^(\d+) of (\d+) steps have responses$/,m=>m[1]+' de '+m[2]+' pasos tienen respuestas'],
  [/^REFERENCE PROOF · STEP (\d+)$/,m=>'DEMOSTRACIÓN DE REFERENCIA · PASO '+m[1]],
  [/^STEP (\d+) OF (\d+)$/i,m=>'PASO '+m[1]+' DE '+m[2]],
  [/^(\d+) of (\d+) calculations or choices match\.(?: (\d+) explanations? saved for review\.)?(?: (\d+) responses? still open\.)?$/,m=>m[1]+' de '+m[2]+' cálculos u opciones coinciden.'+(m[3]?' '+m[3]+(m[3]==='1'?' explicación guardada':' explicaciones guardadas')+' para revisión.':'')+(m[4]?' '+m[4]+(m[4]==='1'?' respuesta aún pendiente.':' respuestas aún pendientes.'):'')],
  [/^(\d+) explanations? saved for review\.(?: (\d+) responses? still open\.)?$/,m=>m[1]+(m[1]==='1'?' explicación guardada':' explicaciones guardadas')+' para revisión.'+(m[2]?' '+m[2]+(m[2]==='1'?' respuesta aún pendiente.':' respuestas aún pendientes.'):'')],
  [/^(\d+) responses? still open\.$/,m=>m[1]+(m[1]==='1'?' respuesta aún pendiente.':' respuestas aún pendientes.')],
  [/^(High school|Bridge to university|University) · (\d+)\/(\d+) responses$/,m=>(m[1]==='High school'?'Preparatoria':m[1]==='University'?'Universidad':'Puente a la universidad')+' · '+m[2]+'/'+m[3]+' pasos con respuestas'],
  [/^(\d+) L jug$/,m=>'Jarra de '+m[1]+' L'],
  [/^Capacity (\d+) L$/,m=>'Capacidad: '+m[1]+' L'],
  [/^Fill (\d+) L$/,m=>'Llena '+m[1]+' L'],
  [/^Empty (\d+) L$/,m=>'Vacía '+m[1]+' L'],
  [/^Fill, empty or pour until a jug is full or empty\. (Can you leave 1 L in the larger jug\?|Notice the multiple-of-3 invariant\.)$/,m=>'Llena, vacía o vierte hasta que una jarra esté llena o vacía. '+translate(m[1],false)],
  [/^\((\d+), (\d+)\) · (\d+) moves( · Target reached!)?$/,m=>'('+m[1]+', '+m[2]+') · '+m[3]+' operaciones'+(m[4]?' · ¡Objetivo alcanzado!':'')],
  [/^Threshold: (.+)$/,m=>'Umbral: '+m[1]],
  [/^(\d+) is below its threshold\. It is impossible\.$/,m=>m[1]+' está por debajo de su umbral. Es imposible.'],
  [/^x² \+ y² = 1 · slope t = (\d+)\/(\d+)$/,m=>'x² + y² = 1 · pendiente t = '+m[1]+'/'+m[2]],
  [/^Sides: (.+)$/,m=>'Lados: '+m[1]],
  [/^Not primitive: the three sides have gcd (\d+)\.$/,m=>'No es primitiva: los tres lados tienen máximo común divisor '+m[1]+'.'],
  [/^Saved checks \((\d+)\)$/,m=>'Comprobaciones guardadas ('+m[1]+')'],
  [/^(\d+) saved attempts?; earlier answers remain in your history\.$/,m=>m[1]+(m[1]==='1'?' intento guardado':' intentos guardados')+'; las respuestas anteriores permanecen en tu historial.'],
  [/^(\d+) saved attempt\(s\)$/,m=>m[1]+(m[1]==='1'?' intento guardado':' intentos guardados')],
  [/^(\d+) saved versions?$/,m=>m[1]+(m[1]==='1'?' versión guardada':' versiones guardadas')],
  [/^(\d+)\/(\d+) saved$/,m=>m[1]+'/'+m[2]+' guardadas'],
  [/^Reference answers appear after (?:all (\d+) responses|both responses) are saved\. Answer checks and explanation review stay separate\.$/,m=>'Las respuestas de referencia aparecen después de guardar '+(m[1]?'las '+m[1]+' respuestas':'ambas respuestas')+'. La comprobación de respuestas y la revisión de explicaciones se mantienen separadas.'],
  [/^You can start these multi-step (projects|diagnostics) directly\. Mark unfamiliar topics not studied; that is different from a difficulty after learning\.$/,m=>'Puedes empezar directamente estos '+(m[1]==='projects'?'proyectos':'diagnósticos')+' de varios pasos. Marca como no estudiados los temas que no conoces; eso es distinto de tener una dificultad después de aprender.'],
  [/^(?:QUESTION|Question) (\d+) OF (\d+)$/,m=>'Pregunta '+m[1]+' de '+m[2]],
  [/^PROJECT (\d+) OF (\d+)$/,m=>'Proyecto '+m[1]+' de '+m[2]],
  [/^LESSON (\d+) OF (\d+)$/,m=>'LECCIÓN '+m[1]+' DE '+m[2]],
  [/^LESSON (\d+)$/,m=>'LECCIÓN '+m[1]],
  [/^NEW SITUATION$/,()=> 'NUEVA SITUACIÓN'],
  [/^NEW SITUATION · QUESTION (\d+) OF (\d+)$/,m=>'NUEVA SITUACIÓN · PREGUNTA '+m[1]+' DE '+m[2]],
  [/^Attempt (\d+)$/,m=>'Intento '+m[1]],
  [/^version (\d+)$/,m=>'versión '+m[1]],
  [/^(\d+) (questions|projects)$/i,m=>m[1]+' '+(m[2].toLowerCase()==='projects'?'proyectos':'preguntas')],
  [/^(\d+) (answer )?components? matched$/,m=>m[1]+' '+(m[1]==='1'?'componente coincide':'componentes coinciden')],
  [/^(\d+) need another check$/,m=>m[1]+' '+(m[1]==='1'?'necesita':'necesitan')+' otra comprobación'],
  [/^(\d+) uncertain$/,m=>m[1]+' '+(m[1]==='1'?'incierto':'inciertos')],
  [/^(\d+) not studied$/,m=>m[1]+' sin estudiar'],
  [/^(\d+) missing\.?$/,m=>m[1]+' '+(m[1]==='1'?'faltante':'faltantes')+'.'],
  [/^(\d+) pending$/,m=>m[1]+' '+(m[1]==='1'?'pendiente':'pendientes')],
  [/^(\d+) need revision$/,m=>m[1]+' '+(m[1]==='1'?'necesita revisión':'necesitan revisión')],
  [/^(\d+) partly explained$/,m=>m[1]+' '+(m[1]==='1'?'parcialmente explicado':'parcialmente explicados')],
  [/^(\d+) key connection explained\.?$/,m=>m[1]+' '+(m[1]==='1'?'conexión clave explicada':'conexiones clave explicadas')+'.'],
  [/^(\d+) mathematical response parts awaiting review$/,m=>m[1]+' '+(m[1]==='1'?'parte de respuesta matemática pendiente':'partes de respuestas matemáticas pendientes')+' de revisión'],
  [/^(\d+) responses locally reviewed\.?$/,m=>m[1]+' '+(m[1]==='1'?'respuesta revisada':'respuestas revisadas')+' localmente.'],
  [/^(\d+) earlier precision checks awaiting review$/,m=>m[1]+' comprobaciones de precisión anteriores pendientes de revisión'],
  [/^(\d+) earlier precision checks await review\. (\d+) response parts are open, missing, uncertain or not studied\. (\d+) whole-answer explanations await review\.$/,m=>m[1]+' comprobaciones de precisión anteriores pendientes de revisión. '+m[2]+' partes de respuesta están abiertas, faltantes, inciertas o sin estudiar. '+m[3]+' explicaciones completas están pendientes de revisión.'],
  [/^These limits describe this (\d+)-question (.+)\. Matching components do not establish complete subject mastery\.$/,m=>{const title=caption(m[2])||caption(m[2][0].toUpperCase()+m[2].slice(1));return title?'Estos límites describen este diagnóstico de '+m[1]+' preguntas ('+title+'). La coincidencia de componentes no demuestra el dominio completo de la materia.':null;}],
  [/^These limits describe these (two|\d+) California-inspired field projects\. Matching components do not establish complete subject mastery\.$/,m=>'Estos límites describen estos '+(m[1]==='two'?'dos':m[1])+' proyectos de campo inspirados en California. La coincidencia de componentes no demuestra el dominio completo de la materia.'],
  [/^Whole-answer explanations awaiting review: (\d+) pending$/,m=>'Explicaciones completas pendientes de revisión: '+m[1]+' '+(m[1]==='1'?'pendiente':'pendientes')],
  [/^(\d+) input components → (\d+) output components$/,m=>m[1]+' componentes de entrada → '+m[2]+' componentes de salida'],
  [/^(\d+) × (\d+) matrix$/,m=>'Matriz '+m[1]+' × '+m[2]],
  [/^(\d+) rows and (\d+) columns: (.+)$/,m=>m[1]+' '+(m[1]==='1'?'fila':'filas')+' y '+m[2]+' '+(m[2]==='1'?'columna':'columnas')+': '+m[3]],
  [/^Position (\d+) of (\d+) between ([-\d.]+) and ([-\d.]+)$/,m=>'Posición '+m[1]+' de '+m[2]+' entre '+m[3]+' y '+m[4]],
  [/^(\d+) \/ (\d+) recorded$/,m=>m[1]+' / '+m[2]+' registradas'],
  [/^(\d+) parts saved or skipped$/,m=>m[1]+' partes guardadas u omitidas'],
  [/^(\d+) record groups$/,m=>m[1]+' grupos de registros'],
  [/^approximately ([\d.]+) MiB of local record text\. This estimate counts UTF-16 characters; it is not the browser’s remaining quota\.$/,m=>'aproximadamente '+m[1]+' MiB de texto de registros locales. Esta estimación cuenta caracteres UTF-16; no indica la cuota restante del navegador.'],
  [/^Use ([A-Za-z]) as the variable\. Equivalent expanded or factored forms are accepted\. Unsupported notation is kept for review\.$/,m=>'Usa '+m[1]+' como variable. Se aceptan formas desarrolladas o factorizadas equivalentes. La notación no compatible se conserva para revisión.'],
  [/^Whole-answer explanations awaiting review: (\d+); revision: (\d+); partial: (\d+); key connection explained: (\d+)\. Reviews concern only the current submitted attempt\.$/,m=>'Explicaciones completas pendientes de revisión: '+m[1]+'; por revisar: '+m[2]+'; parciales: '+m[3]+'; conexión clave explicada: '+m[4]+'. Las revisiones se refieren solo al intento enviado actual.'],
  [/^Legs ([-\d.]+) and ([-\d.]+); hypotenuse ([-\d.]+)\. Equal drawing scale on both axes\.$/,m=>'Catetos '+m[1]+' y '+m[2]+'; hipotenusa '+m[3]+'. Ambos ejes del dibujo tienen la misma escala.'],
  [/^Unit price = (.+)$/,m=>'Precio unitario = '+m[1]],
  [/^Five items cost (.+)$/,m=>'Cinco artículos cuestan '+m[1]],
  [/^Not checked in these (\d+) (questions|projects)$/,m=>'No comprobado en '+(m[2]==='projects'?'estos '+m[1]+' proyectos':'estas '+m[1]+' preguntas')],
  [/^Matrix entry, row (\d+), column (\d+)$/,m=>'Entrada de la matriz, fila '+m[1]+', columna '+m[2]],
  [/^TASK (\d+) \/ (\d+)$/,m=>'TAREA '+m[1]+' / '+m[2]],
  [/^Task (\d+): (.+), (draft|not started|submitted)$/,m=>{const title=translate(m[2],false),status=translate(m[3],false);return title!==m[2]&&status!==m[3]?'Tarea '+m[1]+': '+title+', '+status:null;}],
  [/^Matched components: (\d+); need another check: (\d+); uncertain: (\d+); not studied: (\d+); locally reviewed responses: (\d+); mathematical response parts awaiting review: (\d+); earlier precision checks awaiting review: (\d+); missing: (\d+)\. These are component counts, not a weighted grade or mastery estimate\.$/,m=>'Componentes que coinciden: '+m[1]+'; necesitan otra comprobación: '+m[2]+'; inciertos: '+m[3]+'; sin estudiar: '+m[4]+'; respuestas revisadas localmente: '+m[5]+'; partes de respuestas matemáticas pendientes de revisión: '+m[6]+'; comprobaciones de precisión anteriores pendientes de revisión: '+m[7]+'; faltantes: '+m[8]+'. Son conteos de componentes, no una calificación ponderada ni una estimación de dominio.'],
  [/^(Input|Output) plane; first basis (.+); second basis (.+); (transformed )?v (.+)\. Both planes use the same scale: one unit is one coordinate unit\.$/,m=>(m[1]==='Input'?'Plano de entrada':'Plano de salida')+'; primer vector de la base '+m[2]+'; segundo vector de la base '+m[3]+'; '+(m[4]?'v transformado ':'v ')+m[5]+'. Ambos planos usan la misma escala: una unidad equivale a una unidad de coordenadas.'],
  [/^Output ([xy]) = (.+)$/,m=>'Salida '+m[1]+' = '+m[2]],
  [/^The selected map A sends v to (.+)\. Colored endpoints can be dragged to change A\.$/,m=>'La transformación A seleccionada lleva v a '+m[1]+'. Puedes arrastrar los extremos de colores para cambiar A.'],
  [/^det\(A\) = ([-−\d.]+); area scale = ([-−\d.]+)\.$/,m=>'det(A) = '+m[1]+'; factor de escala del área = '+m[2]+'.'],
  [/^!\[Student construction: (.+)\]\((Quidence_Drawing_\d+_\d+\.svg)\)$/,m=>{const title=translate(m[1],false);return title!==m[1]?'![Construcción del estudiante: '+title+']('+m[2]+')':null;}],
  [/^Enter a number, fraction, or scientific notation( with no unit or the requested (.+) unit)? for (.+)\.$/,m=>{const label=translate(m[3]);return 'Ingresa un número, una fracción o notación científica '+(m[2]?'sin unidad o con la unidad solicitada ('+m[2]+') ':'')+'para '+label+'. Usa punto decimal y evita separadores de miles.';}],
 ];
 for(const [pattern,format]of patterns){const m=key.match(pattern);if(m){const out=format(m);if(out!==null)return out;}}
 if(key.endsWith(' ✓')){const base=translate(key.slice(0,-2),false);if(base!==key.slice(0,-2))return base+' ✓';}
 if(key.endsWith(':')){const base=translate(key.slice(0,-1),false);if(base!==key.slice(0,-1)||Object.hasOwn(catalog(),key.slice(0,-1)))return base+':';}
 if(key.endsWith(' ·')){const base=translate(key.slice(0,-2),false);if(base!==key.slice(0,-2))return base+' ·';}
 if(key.startsWith('· ')){const base=translate(key.slice(2),false);if(base!==key.slice(2))return '· '+base;}
 if(key.endsWith(' (opens in a new tab)')){const base=translate(key.slice(0,-21),false);if(base!==key.slice(0,-21))return base+' (se abre en una pestaña nueva)';}
 // A row composed of reviewed captions, counts, dates or mathematics is safe
 // only when every caption is known. Never partly translate a row.
 const safe=(part,out)=>out!==part||Object.hasOwn(catalog(),part)||quantityCandidates(part).some(([pattern])=>pattern.test(part))||!/[A-Za-z]{3}/.test(part)||/^\d{1,2} (?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\b/i.test(part)||/^\d{4}-\d\d-\d\dT/.test(part);
 for(const separator of [' · ','; '])if(key.includes(separator)){const parts=key.split(separator),outputs=parts.map(part=>translate(part,false));if(parts.every((part,i)=>safe(part,outputs[i])))return outputs.join(separator);}
 for(const match of key.matchAll(/; /g)){const parts=[key.slice(0,match.index),key.slice(match.index+2)],outputs=parts.map(part=>translate(part,false));if(parts.every((part,i)=>safe(part,outputs[i])))return outputs.join('; ');}
 for(const match of key.matchAll(/: /g)){const parts=[key.slice(0,match.index),key.slice(match.index+2)],outputs=parts.map(part=>translate(part,false));if(parts.every((part,i)=>safe(part,outputs[i])))return outputs.join(': ');}
 for(const match of key.matchAll(/\. (?=[A-Z])/g)){const parts=[key.slice(0,match.index+1),key.slice(match.index+2)],outputs=parts.map(part=>translate(part,false));if(parts.every((part,i)=>safe(part,outputs[i])))return outputs.join(' ');}
 if(key.endsWith('.')&&Object.hasOwn(catalog(),key.slice(0,-1)))return catalog()[key.slice(0,-1)]+'.';
 return null;
}
let uppercaseCatalog=null,uppercaseIndex=null,memoCatalog=null;
const memo=new Map();
function translate(key,track=true){
 const direct=coordinateUI[key]??catalog()[key];if(direct!==undefined)return direct;
 if(memoCatalog!==catalog()){memoCatalog=catalog();memo.clear();}
 if(memo.has(key)){const out=memo.get(key);if(track&&out===key&&/[A-Za-z]{3}/.test(key)&&!quantityCandidates(key).some(([pattern])=>pattern.test(key)))missing.add(key);return out;}
 for(const mark of ['.',':'])if(catalog()[key+mark]!==undefined)return catalog()[key+mark].replace(/[.:]$/,'');
 const count=key.match(/^All (\d+) questions$/);if(count)return 'Todas las '+count[1]+' preguntas';
 const question=key.match(/^Question (\d+) of (\d+)$/);if(question)return 'Pregunta '+question[1]+' de '+question[2];
 if(key===key.toUpperCase()){
  if(uppercaseCatalog!==catalog()){uppercaseCatalog=catalog();uppercaseIndex=new Map(Object.entries(catalog()).map(([k,v])=>[k.toUpperCase(),v.toUpperCase()]));}if(uppercaseIndex.has(key))return uppercaseIndex.get(key);
 }
 const rendered=template(key);if(rendered!==null){memo.set(key,rendered);return rendered;}
 if(track&&/[A-Za-z]{3}/.test(key))missing.add(key);
 memo.set(key,key);
 return key;
}
function text(source){
 const input=String(source??'');if(locale!=='es')return input;
 const key=normalize(input);if(!key)return input;
 return input.match(/^\s*/)[0]+translate(key)+input.match(/\s*$/)[0];
}
function protect(element){return !!element?.closest?.(protectedSelector)||['SCRIPT','STYLE','NOSCRIPT'].includes(element?.tagName);}
function apply(scope=root.document){
 if(!scope)return;const document=scope.ownerDocument||scope;
 for(const option of scope.querySelectorAll?.('option:not([value])')||[])option.setAttribute('value',option.textContent);
 const walker=document.createTreeWalker(scope,4),nodes=[];let node;
 while((node=walker.nextNode()))nodes.push(node);
 for(node of nodes){
  if(protect(node.parentElement))continue;
  let saved=textMemory.get(node);if(!saved||node.data!==saved.output)saved={source:node.data,output:node.data};
  const output=text(saved.source);saved.output=output;textMemory.set(node,saved);if(node.data!==output)node.data=output;
 }
 for(const element of scope.querySelectorAll?.('[aria-label],[placeholder],[title],[alt],option')||[]){
  if(protect(element)&&element.tagName!=='INPUT'&&element.tagName!=='TEXTAREA')continue;
  // An option without an explicit value otherwise changes its answer value
  // when its visible caption changes language.
  if(element.tagName==='OPTION'&&!element.hasAttribute('value'))element.setAttribute('value',element.textContent);
  let memory=attributeMemory.get(element);if(!memory){memory={};attributeMemory.set(element,memory);}
  for(const name of ['aria-label','placeholder','title','alt']){
   if(!element.hasAttribute(name))continue;const current=element.getAttribute(name);
   let saved=memory[name];if(!saved||current!==saved.output)saved={source:current,output:current};
   const output=text(saved.source);saved.output=output;memory[name]=saved;if(current!==output)element.setAttribute(name,output);
  }
 }
 for(const area of scope.querySelectorAll?.('textarea[data-i18n-markdown]')||[]){
  let saved=markdownMemory.get(area);if(!saved||area.value!==saved.output)saved={source:area.value,output:area.value};
  saved.output=markdown(saved.source);markdownMemory.set(area,saved);area.value=saved.output;
 }
 for(const img of scope.querySelectorAll?.('img[src*="assets/illustrations/"]')||[]){
  let saved=imageMemory.get(img);if(!saved){saved=img.getAttribute('src');imageMemory.set(img,saved);}
  img.setAttribute('src',locale==='es'?saved.replace(/(?<!-es)\.svg(?=\?|$)/,'-es.svg'):saved);
 }
 for(const element of scope.querySelectorAll?.('[data-i18n-date]')||[])element.textContent=date(element.getAttribute('data-i18n-date'))+(element.hasAttribute('data-date-caption')?' · '+text(element.getAttribute('data-date-caption')):'');
 for(const link of scope.querySelectorAll?.('a[href]')||[]){
  const href=link.getAttribute('href');if(!href||link.hasAttribute('download')||/^(?:#|mailto:|blob:|data:|javascript:)/i.test(href))continue;
  try{const url=new URL(href,root.location.href);if(url.origin!==root.location.origin||/\.(?:json|md|zip|pdf)$/i.test(url.pathname))continue;url.searchParams.set('lang',link.getAttribute('data-fixed-language')==='en'?'en':fixedEnglish?preferredLocale():locale);const next=href.split(/[?#]/)[0]+url.search+url.hash;if(href!==next)link.setAttribute('href',next);}catch{}
 }
 document.documentElement.lang=locale;
 if(control)control.value=locale;
}
function schedule(){if(pending)return;pending=true;root.queueMicrotask(()=>{pending=false;observer?.disconnect();apply();observe();});}
function observe(){observer?.observe(root.document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});}
function loadCatalog(){
 if(catalogPromise)return catalogPromise;
 if(root.QuidenceSpanish||!root.document)return Promise.resolve();
 if(!catalogPromise){
  const pathname=root.location?.pathname||'',moduleId=new URL(root.location.href).searchParams.get('module');
  const all=/^\/(?:records|reports)\//.test(pathname);
  const group=pathname.match(/\/modules\/(aa01|ab01|ac01|ad01|ae01|af01)\//)?.[1]||
    (pathname.includes('/number-theory/')?'number-theory':pathname.includes('/discrete-math/')?'discrete-math':moduleId);
  const names=all?['i18n-es.js']:['i18n-es/common.js',...(['aa01','ab01','ac01','ad01','ae01','af01','number-theory','discrete-math'].includes(group)?['i18n-es/'+group+'.js']:[])];
  const loaded=[];
  catalogPromise=(async()=>{
   try{for(const name of names)await new Promise((resolve,reject)=>{
    const script=root.document.createElement('script'),url=new URL(name,sourceURL);
    url.search=root.document.querySelector('script[data-es-catalog]')?.dataset.esCatalog||'';
    script.src=url.href;script.onload=()=>{loaded.push(script);resolve();};script.onerror=()=>{script.remove();reject(Error('Spanish translations could not load.'));};root.document.head.appendChild(script);
   });}catch(error){loaded.forEach(script=>script.remove());delete root.QuidenceSpanish;delete root.QuidenceSpanishQuantities;catalogPromise=null;throw error;}
  })();
 }return catalogPromise;
}
async function setLocale(next){
 const sequence=++requestSequence;
 if(fixedEnglish)next='en';
 if(next==='es'&&(!root.QuidenceSpanish||catalogPromise)&&root.document){
  control?.setAttribute('aria-busy','true');
  try{await loadCatalog();}catch{if(sequence!==requestSequence)return locale;if(control){control.value=locale;control.removeAttribute('aria-busy');}const note=root.document.createElement('p');note.className='language-error';note.setAttribute('role','status');note.textContent='No se pudieron cargar las traducciones. Selecciona Español para intentarlo de nuevo.';control?.closest('nav')?.appendChild(note);return locale;}
  if(sequence!==requestSequence)return locale;
 }
 control?.removeAttribute('aria-busy');root.document?.querySelectorAll('.language-error').forEach(e=>e.remove());
 locale=next==='es'?'es':'en';if(!fixedEnglish)try{root.localStorage.setItem(KEY,locale);}catch{}
 if(root.location&&root.history){const url=new URL(root.location.href);url.searchParams.set('lang',locale);root.history.replaceState(root.history.state,'',url);}
 observer?.disconnect();apply();observe();root.document?.dispatchEvent(new root.CustomEvent('quidence:language',{detail:{locale}}));return locale;
}
const dateFormatters=new Map();
function date(source){const d=new Date(source);if(Number.isNaN(d.getTime()))return String(source);if(!dateFormatters.has(locale))dateFormatters.set(locale,new Intl.DateTimeFormat(locale==='es'?'es-MX':'en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}));return dateFormatters.get(locale).format(d);}
function markdown(source){
 // Never translate quoted original answers or code/JSON records. For mixed
 // evidence lines only a known heading is translated; the student suffix stays.
 let fenced=false,originalBlock=false;return String(source).split('\n').map(line=>{
  if(/^\s*(```+|~~~+)/.test(line)){fenced=!fenced;return line;}
  if(fenced||/^\s*>/.test(line))return line;
  if(originalBlock){if(!line.trim()||/^(?:Other help reported|Earlier report viewed|Reference mathematics|Next check):/.test(line))originalBlock=false;else return line;}
  if(/^(?:Student explanation|Explanation \(human review\)|Explanation for (?:human )?review|Current revision is not submitted\. Draft explanation|Unsaved reviewer draft|Reviewed explanation|Reviewer note)/.test(line)){const colon=line.indexOf(':');originalBlock=true;return colon<0?line:text(line.slice(0,colon+1))+line.slice(colon+1);}
  if(/^(?:Unsaved reviewer draft|Reviewer note|Review note|Local review of|Local review:|Local part review|Part review)/.test(line)){const colon=line.indexOf(':');return colon<0?line:text(line.slice(0,colon+1))+line.slice(colon+1);}
  const heading=line.match(/^(#{1,6}\s+|[-*]\s+)?(.*)$/);return (heading[1]||'')+text(heading[2]);
 }).join('\n');
}
function markdownArea(area,source){const output=markdown(source);if(area){area.setAttribute('data-i18n-markdown','');markdownMemory.set(area,{source,output});area.value=output;}return output;}
function html(source){
 if(locale==='en'||!root.DOMParser)return source;
 const doc=new root.DOMParser().parseFromString(source,'text/html');apply(doc);return '<!doctype html>\n'+doc.documentElement.outerHTML;
}
function start(){
 const requested=new URL(root.location.href).searchParams.get('lang');let stored='';try{stored=root.localStorage.getItem(KEY)||'';}catch{}
 const desired=requested==='es'||requested==='en'?requested:stored==='es'?'es':'en';
 if(!fixedEnglish){
 const toolbar=root.document.createElement('nav');toolbar.className='language-toolbar';toolbar.setAttribute('aria-label','Language');
 const label=root.document.createElement('label');label.className='language-label';label.appendChild(root.document.createTextNode('Language'));
 control=root.document.createElement('select');control.setAttribute('aria-label','Language');control.id='quidence-language';
 label.setAttribute('for','quidence-language');
 for(const [value,caption]of [['en','English'],['es','Español']]){const option=root.document.createElement('option');option.value=value;option.textContent=caption;option.lang=value;option.setAttribute('data-no-translate','');control.appendChild(option);}
 control.value=locale;control.addEventListener('change',()=>setLocale(control.value));label.appendChild(control);toolbar.appendChild(label);
 const header=root.document.querySelector('.site-header'),languageHost=root.document.querySelector('[data-language-host]');
 if(languageHost){control.classList.add('qa-language');languageHost.appendChild(toolbar);}
 else if(header){const group=root.document.createElement('div');group.className='header-tools';const preview=header.querySelector('.preview-label');if(preview)group.appendChild(preview);group.appendChild(toolbar);header.appendChild(group);}
 else root.document.body.prepend(toolbar);
 }
 apply();observer=new root.MutationObserver(schedule);observe();setLocale(desired);
 root.addEventListener('storage',event=>{if(event.key===KEY){if(fixedEnglish)apply();else setLocale(event.newValue);}});
}
if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
return {text,markdown,markdownArea,html,apply,setLocale,date,get missing(){return [...missing];},clearMissing(){missing.clear();},get locale(){return locale;},normalize,KEY,protectedSelector};
});
