(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceAlgorithms=api;})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
// Algorithms course: content, step-by-step traces, challenge checks and recommendation rules.
// Everything here is pure, so tests can run it without a browser. Text is bilingual: {en, es}.
const L=(en,es)=>({en,es});
const VERSION='algorithms-1';
const term=(id,x,y,w,h,text)=>({id,kind:'term',x,y,w,h,text}),proc=(id,x,y,w,h,text)=>({id,kind:'proc',x,y,w,h,text}),dec=(id,x,y,w,h,text)=>({id,kind:'dec',x,y,w,h,text});
const YES=L('yes','sí'),NO=L('no','no');
const Q=t=>L(t+' ?','¿'+t+'?');
function uniq(xs){const out=[];for(const x of xs)if(!out.includes(x))out.push(x);let k=1;while(out.length<3){if(!out.includes(out[0]+k))out.push(out[0]+k);k++;}return out;}
// Multiple-choice options in random order, so the answer is not always in the same place.
function shuffle(ask,rnd){const order=ask.options.en.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 return{...ask,options:L(order.map(i=>ask.options.en[i]),order.map(i=>ask.options.es[i])),answer:order.indexOf(ask.answer)};}
const nums=(xs)=>L(xs.map(String),xs.map(String));
const yesNo=L(['Yes','No'],['Sí','No']);
const sorted=a=>a.every((x,i)=>!i||a[i-1]<=x);

/* ---------------- #1 Find the maximum ---------------- */
const findMax={num:1,id:'find-max',level:L('Middle school','Secundaria'),kind:'list',
 name:L('Find the maximum','Encontrar el máximo'),
 problem:L('Find the largest number in a list. Look at each item once and remember the largest one seen so far.','Encuentra el número más grande de una lista. Mira cada elemento una vez y recuerda el mayor que hayas visto hasta ahora.'),
 pseudo:L(['best ← a[0]','for i from 1 to n − 1:','    if a[i] > best:','        best ← a[i]','return best'],['best ← a[0]','para i desde 1 hasta n − 1:','    si a[i] > best:','        best ← a[i]','devolver best']),
 flow:{w:420,h:440,nodes:[term('start',170,24,90,30,L('Start','Inicio')),proc('init',170,80,170,32,'best ← a[0], i ← 1'),dec('check',170,158,150,60,Q('i < n')),dec('cmp',170,250,170,62,Q('a[i] > best')),proc('upd',350,250,110,32,'best ← a[i]'),proc('inc',170,340,110,32,'i ← i + 1'),term('done',66,410,124,30,L('return best','devolver best'))],
  edges:[['start','init',[[170,39],[170,64]]],['init','check',[[170,96],[170,128]]],['check','cmp',[[170,188],[170,219]],YES,[178,207]],['check','done',[[95,158],[66,158],[66,395]],NO,[72,150]],['cmp','upd',[[255,250],[295,250]],YES,[264,242]],['cmp','inc',[[170,281],[170,324]],NO,[178,305]],['upd','inc',[[350,266],[350,340],[225,340]]],['inc','check',[[170,356],[170,380],[410,380],[410,158],[245,158]]]]},
 code:{
  python:{lines:['def find_max(a):','    best = a[0]','    for i in range(1, len(a)):','        if a[i] > best:','            best = a[i]','    return best'],map:[[2],[3],[4],[5],[6]]},
  java:{lines:['static int findMax(int[] a) {','    int best = a[0];','    for (int i = 1; i < a.length; i++) {','        if (a[i] > best) {','            best = a[i];','        }','    }','    return best;','}'],map:[[2],[3],[4],[5],[8]]},
  matlab:{lines:['function best = find_max(a)','    best = a(1);','    for i = 2:numel(a)','        if a(i) > best','            best = a(i);','        end','    end','end'],map:[[2],[3],[4],[5],[8]]}},
 teach:[
  {step:L('Start with the first item as the largest seen so far.','Empieza tomando el primer elemento como el mayor visto hasta ahora.'),python:L('a[0] is the first item: Python counts positions from 0.','a[0] es el primer elemento: Python cuenta las posiciones desde 0.'),java:L('Declare best as an int and give it a[0].','Declara best como int y dale el valor a[0].'),matlab:L('MATLAB counts positions from 1, so the first item is a(1).','MATLAB cuenta las posiciones desde 1, así que el primer elemento es a(1).')},
  {step:L('Look at every other item in turn.','Mira cada uno de los demás elementos, uno por uno.'),python:L('range(1, len(a)) gives 1, 2, …, n − 1.','range(1, len(a)) da 1, 2, …, n − 1.'),java:L('i starts at 1, because item 0 is already in best.','i empieza en 1, porque el elemento 0 ya está en best.'),matlab:L('2:numel(a) skips the first item.','2:numel(a) se salta el primer elemento.')},
  {step:L('Ask whether this item is bigger than the largest so far.','Pregunta si este elemento es mayor que el mayor hasta ahora.'),python:L('> compares two numbers.','> compara dos números.'),java:L('The same comparison in Java.','La misma comparación en Java.'),matlab:L('Round brackets read a position: a(i).','Los paréntesis leen una posición: a(i).')},
  {step:L('If it is, remember it instead.','Si lo es, recuerda ese en lugar del anterior.'),python:L('best = a[i] replaces the old value.','best = a[i] reemplaza el valor anterior.'),java:L('best = a[i]; replaces the old value.','best = a[i]; reemplaza el valor anterior.'),matlab:L('best = a(i); replaces the old value.','best = a(i); reemplaza el valor anterior.')},
  {step:L('When every item has been seen, best is the answer.','Cuando ya se vieron todos los elementos, best es la respuesta.'),python:L('return hands best back to whoever called the function.','return devuelve best a quien llamó a la función.'),java:L('return best; ends the method.','return best; termina el método.'),matlab:L('The output variable best is returned when the function ends.','La variable de salida best se devuelve cuando termina la función.')}],
 defaults:{list:[4,9,2,11,7,11,3]},
 trace:L(['Step','i','a[i]','best','a[i] > best?'],['Paso','i','a[i]','best','¿a[i] > best?']),
 gen(a,_,rnd=Math.random){const E=[],n=a.length;let best=a[0],ups=0;for(let i=1;i<n;i++)if(a[i]>best){best=a[i];ups++;}best=a[0];
  E.push({line:-1,node:'start',note:L(`Find the largest of ${n} numbers.`,`Encuentra el mayor de ${n} números.`),ask:shuffle({q:L('Before you start: after its first value, how many times will best change?','Antes de empezar: después de su primer valor, ¿cuántas veces cambiará best?'),options:nums(uniq([ups,n-1,0,1])),answer:0,why:L(`best changes each time a bigger number appears: ${ups} time${ups===1?'':'s'}.`,`best cambia cada vez que aparece un número mayor: ${ups} ${ups===1?'vez':'veces'}.`)},rnd)});
  E.push({line:0,node:'init',note:L(`Start with the first item: <b>best = ${best}</b>, and look next at <b>i = 1</b>.`,`Empieza con el primer elemento: <b>best = ${best}</b>, y luego mira <b>i = 1</b>.`),ptr:{i:1},mark:[0],vars:{best}});
  for(let i=1;;i++){const go=i<n;
   E.push({line:1,node:'check',chip:go?L(`item ${i+1} of ${n}`,`elemento ${i+1} de ${n}`):L('loop ends','fin del ciclo'),note:go?L(`Is i = ${i} &lt; n = ${n}? Yes, so look at position ${i}.`,`¿i = ${i} &lt; n = ${n}? Sí, así que mira la posición ${i}.`):L(`Is i = ${i} &lt; n = ${n}? No: every item has been seen.`,`¿i = ${i} &lt; n = ${n}? No: ya se vieron todos los elementos.`),ptr:go?{i}:{},mark:[a.indexOf(best)],vars:{best}});
   if(!go)break;const big=a[i]>best;
   E.push({line:2,node:'cmp',chip:L(`${a[i]} > ${best}? ${big?'yes':'no'}`,`${a[i]} > ${best}? ${big?'sí':'no'}`),note:L(`Is a[${i}] = ${a[i]} bigger than best = ${best}? <b>${big?'Yes':'No'}</b>.`,`¿a[${i}] = ${a[i]} es mayor que best = ${best}? <b>${big?'Sí':'No'}</b>.`),cmp:[i],ptr:{i},mark:[a.indexOf(best)],vars:{best},row:[i,a[i],best,big?YES:NO],ask:{q:L(`Is a[${i}] = ${a[i]} bigger than best = ${best}?`,`¿a[${i}] = ${a[i]} es mayor que best = ${best}?`),options:yesNo,answer:big?0:1,why:L(`${a[i]} ${big?'is':'is not'} bigger than ${best}.${!big&&a[i]===best?' Equal is not bigger, so best stays.':''}`,`${a[i]} ${big?'es':'no es'} mayor que ${best}.${!big&&a[i]===best?' Igual no es mayor, así que best no cambia.':''}`)}});
   if(big){best=a[i];E.push({line:3,node:'upd',chip:L(`best = ${best}`,`best = ${best}`),note:L(`Remember the new largest: <b>best = ${best}</b>.`,`Recuerda el nuevo mayor: <b>best = ${best}</b>.`),ptr:{i},mark:[i],vars:{best}});}
   E.push({line:1,node:'inc',note:L(`Move on: <b>i = ${i+1}</b>.`,`Avanza: <b>i = ${i+1}</b>.`),ptr:{i:i+1},mark:[a.indexOf(best)],vars:{best}});}
  E.push({line:4,node:'done',note:L(`Return <b>${best}</b>. Comparisons made: ${n-1}.`,`Devuelve <b>${best}</b>. Comparaciones hechas: ${n-1}.`),hit:[a.indexOf(best)],vars:{best},done:true});return E;}
};

/* ---------------- #2 Linear search ---------------- */
const linear={num:2,id:'linear-search',level:L('Middle school','Secundaria'),kind:'search',
 name:L('Linear search','Búsqueda lineal'),
 problem:L('Find the position of a target number in a list. Look at the items one by one. If the target is not there, answer −1.','Encuentra la posición de un número buscado en una lista. Mira los elementos uno por uno. Si el número no está, responde −1.'),
 pseudo:L(['for i from 0 to n − 1:','    if a[i] = target:','        return i','return −1'],['para i desde 0 hasta n − 1:','    si a[i] = target:','        devolver i','devolver −1']),
 flow:{w:420,h:380,nodes:[term('start',170,26,90,32,L('Start','Inicio')),proc('init',170,86,110,34,'i ← 0'),dec('check',170,164,150,62,Q('i < n')),dec('cmp',170,262,170,66,Q('a[i] = target')),term('found',170,352,110,32,L('return i','devolver i')),proc('inc',350,262,100,34,'i ← i + 1'),term('notfound',58,352,108,32,L('return −1','devolver −1'))],
  edges:[['start','init',[[170,42],[170,69]]],['init','check',[[170,103],[170,133]]],['check','cmp',[[170,195],[170,229]],YES,[178,215]],['check','notfound',[[95,164],[58,164],[58,336]],NO,[66,156]],['cmp','found',[[170,295],[170,336]],YES,[178,318]],['cmp','inc',[[255,262],[300,262]],NO,[266,254]],['inc','check',[[350,245],[350,164],[245,164]]]]},
 code:{
  python:{lines:['def linear_search(a, target):','    for i in range(len(a)):','        if a[i] == target:','            return i','    return -1'],map:[[2],[3],[4],[5]]},
  java:{lines:['static int linearSearch(int[] a, int target) {','    for (int i = 0; i < a.length; i++) {','        if (a[i] == target) {','            return i;','        }','    }','    return -1;','}'],map:[[2],[3],[4],[7]]},
  matlab:{lines:['function idx = linear_search(a, target)','    idx = -1;','    for i = 1:numel(a)','        if a(i) == target','            idx = i;','            return','        end','    end','end'],map:[[3],[4],[5,6],[2,9]]}},
 teach:[
  {step:L('Go through the positions one at a time.','Recorre las posiciones una por una.'),python:L('range(len(a)) gives 0, 1, …, n − 1, one position per pass.','range(len(a)) da 0, 1, …, n − 1, una posición por vuelta.'),java:L('Start at 0, keep going while i < a.length, add 1 after each pass.','Empieza en 0, sigue mientras i < a.length y suma 1 después de cada vuelta.'),matlab:L('MATLAB counts positions from 1, so the loop runs i = 1, …, n.','MATLAB cuenta las posiciones desde 1, así que el ciclo va de i = 1 a n.')},
  {step:L('Compare the item with the target.','Compara el elemento con el número buscado.'),python:L('Use == to compare. A single = would store a value instead.','Usa == para comparar. Un solo = guardaría un valor.'),java:L('== compares two int values.','== compara dos valores int.'),matlab:L('MATLAB reads a position with round brackets: a(i).','MATLAB lee una posición con paréntesis: a(i).')},
  {step:L('Stop as soon as it matches.','Detente en cuanto coincida.'),python:L('return ends the function at once and hands back i.','return termina la función de inmediato y devuelve i.'),java:L('return i; ends the method at once.','return i; termina el método de inmediato.'),matlab:L('Store the answer in idx, then return.','Guarda la respuesta en idx y luego usa return.')},
  {step:L('After the loop, report that it is missing.','Después del ciclo, informa que no está.'),python:L('This line is outside the loop, so it runs only if no item matched.','Esta línea está fuera del ciclo, así que solo se ejecuta si ningún elemento coincidió.'),java:L('Reached only when the loop finishes without a match.','Solo se llega aquí cuando el ciclo termina sin coincidencia.'),matlab:L('MATLAB sets idx = -1 first and changes it only if the target is found.','MATLAB pone idx = -1 al principio y solo lo cambia si encuentra el número.')}],
 defaults:{list:[7,3,9,12,5,18,2,11],target:5},
 trace:L(['Check','i','a[i]','= target?'],['Revisión','i','a[i]','¿= target?']),
 gen(a,t,rnd=Math.random){const E=[],n=a.length;const pos=a.indexOf(t),checks=pos<0?n:pos+1;
  E.push({line:-1,node:'start',note:L(`Search for ${t} in a list of ${n} items.`,`Busca ${t} en una lista de ${n} elementos.`),ask:shuffle({q:L('Before you start: how many items will be checked before the search stops?','Antes de empezar: ¿cuántos elementos se revisarán antes de que la búsqueda se detenga?'),options:nums(uniq([checks,n,1,Math.ceil(n/2)])),answer:0,why:pos<0?L(`${t} is not in the list, so all ${n} items are checked.`,`${t} no está en la lista, así que se revisan los ${n} elementos.`):pos===0?L(`${t} is at position 0, so only 1 item is checked.`,`${t} está en la posición 0, así que solo se revisa 1 elemento.`):L(`${t} is first found at position ${pos}, so positions 0 to ${pos} are checked: ${checks} items.`,`${t} aparece primero en la posición ${pos}, así que se revisan las posiciones 0 a ${pos}: ${checks} elementos.`)},rnd)});
  E.push({line:0,node:'init',note:L('Start at the first position: <b>i = 0</b>.','Empieza en la primera posición: <b>i = 0</b>.'),ptr:{i:0},vars:{i:0}});
  for(let i=0;;i++){const go=i<n;
   E.push({line:0,node:'check',chip:go?L(`item ${i+1} of ${n}`,`elemento ${i+1} de ${n}`):L('loop ends','fin del ciclo'),note:go?L(`Is i = ${i} &lt; n = ${n}? Yes, so look at position ${i}.`,`¿i = ${i} &lt; n = ${n}? Sí, así que mira la posición ${i}.`):L(`Is i = ${i} &lt; n = ${n}? No: every item has been checked.`,`¿i = ${i} &lt; n = ${n}? No: ya se revisaron todos los elementos.`),ptr:go?{i}:{},vars:{i}});
   if(!go)break;const eq=a[i]===t;
   E.push({line:1,node:'cmp',chip:L(`${a[i]} = ${t}? ${eq?'yes':'no'}`,`${a[i]} = ${t}? ${eq?'sí':'no'}`),note:L(`Is a[${i}] = ${a[i]} equal to ${t}? <b>${eq?'Yes':'No'}</b>.`,`¿a[${i}] = ${a[i]} es igual a ${t}? <b>${eq?'Sí':'No'}</b>.`),cmp:[i],ptr:{i},row:[i,a[i],eq?YES:NO],ask:{q:L(`Is a[${i}] equal to the target ${t}?`,`¿a[${i}] es igual al número buscado, ${t}?`),options:yesNo,answer:eq?0:1,why:L(`a[${i}] is ${a[i]}, which ${eq?'is':'is not'} ${t}.`,`a[${i}] es ${a[i]}, que ${eq?'es':'no es'} ${t}.`)}});
   if(eq){E.push({line:2,node:'found',note:L(`Return <b>${i}</b>: ${t} is at position ${i}. Checks made: ${i+1}.`,`Devuelve <b>${i}</b>: ${t} está en la posición ${i}. Revisiones hechas: ${i+1}.`),hit:[i],ptr:{i},done:true});return E;}
   E.push({line:0,node:'inc',note:L(`Move on: <b>i = ${i+1}</b>.`,`Avanza: <b>i = ${i+1}</b>.`),ptr:{i:i+1}});}
  E.push({line:3,node:'notfound',note:L(`Return <b>−1</b>: ${t} is not in the list. Checks made: ${n}.`,`Devuelve <b>−1</b>: ${t} no está en la lista. Revisiones hechas: ${n}.`),done:true});return E;}
};

/* ---------------- #3 Bubble sort ---------------- */
function passSum(n){const t=n*(n-1)/2;if(n===2)return L('There is one pass with one comparison.','Hay una sola pasada con una comparación.');
 if(n===3)return L('Pass 1 makes 2 comparisons and pass 2 makes 1: 2 + 1 = 3.','La pasada 1 hace 2 comparaciones y la pasada 2 hace 1: 2 + 1 = 3.');
 return L(`Pass 1 makes ${n-1} comparisons, pass 2 makes ${n-2}, and so on down to 1: ${n-1} + … + 1 = ${t}.`,`La pasada 1 hace ${n-1} comparaciones, la pasada 2 hace ${n-2}, y así hasta 1: ${n-1} + … + 1 = ${t}.`);}

const bubble={num:3,id:'bubble-sort',level:L('Middle school','Secundaria'),kind:'list',
 name:L('Bubble sort','Ordenamiento burbuja'),
 problem:L('Sort a list from smallest to largest by comparing neighbours again and again, and swapping them when they are out of order.','Ordena una lista de menor a mayor comparando vecinos una y otra vez, e intercambiándolos cuando están en desorden.'),
 pseudo:L(['for p from 1 to n − 1:','    for i from 0 to n − 1 − p:','        if a[i] > a[i + 1]:','            swap a[i] and a[i + 1]','the list is sorted'],['para p desde 1 hasta n − 1:','    para i desde 0 hasta n − 1 − p:','        si a[i] > a[i + 1]:','            intercambiar a[i] y a[i + 1]','la lista está ordenada']),
 flow:{w:490,h:510,nodes:[term('start',215,24,90,30,L('Start','Inicio')),proc('pinit',215,78,110,30,'p ← 1'),dec('pcheck',215,152,170,58,Q('p ≤ n − 1')),proc('iinit',215,226,110,30,'i ← 0'),dec('icheck',215,302,200,60,Q('i ≤ n − 1 − p')),dec('cmp',215,392,190,62,Q('a[i] > a[i+1]')),proc('swap',58,392,100,32,L('swap','intercambiar')),proc('inc',215,482,110,30,'i ← i + 1'),proc('pinc',410,302,110,30,'p ← p + 1'),term('done',410,152,100,30,L('sorted','ordenada'))],
  edges:[['start','pinit',[[215,39],[215,63]]],['pinit','pcheck',[[215,93],[215,123]]],['pcheck','iinit',[[215,181],[215,211]],YES,[223,198]],['pcheck','done',[[300,152],[360,152]],NO,[316,144]],['iinit','icheck',[[215,241],[215,272]]],['icheck','cmp',[[215,332],[215,361]],YES,[223,349]],['icheck','pinc',[[315,302],[355,302]],NO,[324,294]],['cmp','swap',[[120,392],[108,392]],YES,[100,382]],['cmp','inc',[[215,423],[215,467]],NO,[223,448]],['swap','inc',[[58,408],[58,482],[160,482]]],['inc','icheck',[[270,482],[340,482],[340,258],[215,258],[215,272]]],['pinc','pcheck',[[465,302],[480,302],[480,108],[215,108],[215,123]]]]},
 code:{
  python:{lines:['def bubble_sort(a):','    n = len(a)','    for p in range(1, n):','        for i in range(0, n - p):','            if a[i] > a[i + 1]:','                a[i], a[i + 1] = a[i + 1], a[i]','    return a'],map:[[3],[4],[5],[6],[7]]},
  java:{lines:['static void bubbleSort(int[] a) {','    int n = a.length;','    for (int p = 1; p <= n - 1; p++) {','        for (int i = 0; i <= n - 1 - p; i++) {','            if (a[i] > a[i + 1]) {','                int tmp = a[i];','                a[i] = a[i + 1];','                a[i + 1] = tmp;','            }','        }','    }','}'],map:[[3],[4],[5],[6,7,8],[12]]},
  matlab:{lines:['function a = bubble_sort(a)','    n = numel(a);','    for p = 1:n-1','        for i = 1:n-p','            if a(i) > a(i+1)','                a([i i+1]) = a([i+1 i]);','            end','        end','    end','end'],map:[[3],[4],[5],[6],[10]]}},
 teach:[
  {step:L('Make n − 1 passes over the list.','Haz n − 1 pasadas por la lista.'),python:L('range(1, n) gives p = 1, …, n − 1.','range(1, n) da p = 1, …, n − 1.'),java:L('p runs from 1 up to n − 1.','p va de 1 a n − 1.'),matlab:L('1:n-1 lists the passes.','1:n-1 enumera las pasadas.')},
  {step:L('In pass p, compare each item with the next one, up to the part that is already in place.','En la pasada p, compara cada elemento con el siguiente, hasta la parte que ya está en su lugar.'),python:L('range(0, n - p) gives i = 0, …, n − p − 1, so the last pair compared is a[n − p − 1] and a[n − p]. The p − 1 items after it are already in their final places.','range(0, n - p) da i = 0, …, n − p − 1, así que el último par que se compara es a[n − p − 1] y a[n − p]. Los p − 1 elementos que siguen ya están en su posición final.'),java:L('i runs from 0 up to n − 1 − p.','i va de 0 a n − 1 − p.'),matlab:L('MATLAB counts from 1, so i runs from 1 to n − p.','MATLAB cuenta desde 1, así que i va de 1 a n − p.')},
  {step:L('Check whether the pair is out of order.','Comprueba si el par está en desorden.'),python:L('> compares the two neighbours.','> compara los dos vecinos.'),java:L('The same comparison in Java.','La misma comparación en Java.'),matlab:L('Round brackets read a position: a(i).','Los paréntesis leen una posición: a(i).')},
  {step:L('If so, swap them.','Si es así, intercámbialos.'),python:L('Python can swap two items in one line.','Python puede intercambiar dos elementos en una sola línea.'),java:L('Java needs a temporary variable to swap.','Java necesita una variable temporal para intercambiar.'),matlab:L('MATLAB can swap by reordering two positions at once.','MATLAB puede intercambiar reordenando dos posiciones a la vez.')},
  {step:L('After the last pass the list is sorted.','Después de la última pasada la lista está ordenada.'),python:L('Return the list so the caller can use it.','Devuelve la lista para que quien llamó a la función pueda usarla.'),java:L('The array was sorted in place, so nothing is returned.','El arreglo se ordenó directamente, sin hacer una copia, así que no se devuelve nada.'),matlab:L('The function returns the sorted a.','La función devuelve a ya ordenada.')}],
 defaults:{list:[5,1,4,2,8,3]},
 trace:L(['Pass','i','a[i]','a[i+1]','Action'],['Pasada','i','a[i]','a[i+1]','Acción']),
 gen(a0,_,rnd=Math.random){const a=[...a0],n=a.length,E=[],total=n*(n-1)/2;
  E.push({line:-1,node:'start',note:L(`Sort a list of ${n} items.`,`Ordena una lista de ${n} elementos.`),arr:[...a],ask:shuffle({q:L(`Before you start: how many comparisons will bubble sort make on these ${n} items?`,`Antes de empezar: ¿cuántas comparaciones hará el ordenamiento burbuja con estos ${n} elementos?`),options:nums(uniq([total,n,n-1,n*n])),answer:0,why:passSum(n)},rnd)});
  E.push({line:0,node:'pinit',chip:L('p = 1','p = 1'),note:L('Start with pass <b>p = 1</b>.','Empieza con la pasada <b>p = 1</b>.'),arr:[...a]});
  for(let p=1;;p++){const go=p<=n-1;
   E.push({line:0,node:'pcheck',chip:go?L(`pass ${p} of ${n-1}`,`pasada ${p} de ${n-1}`):L('loop ends','fin del ciclo'),note:go?L(`Is p = ${p} ≤ n − 1 = ${n-1}? Yes: pass <b>${p}</b> compares positions 0 to ${n-1-p} with their right neighbours.`,`¿p = ${p} ≤ n − 1 = ${n-1}? Sí: la pasada <b>${p}</b> compara las posiciones 0 a ${n-1-p} con su vecino de la derecha.`):L(`Is p = ${p} ≤ n − 1 = ${n-1}? No: every pass is done.`,`¿p = ${p} ≤ n − 1 = ${n-1}? No: ya se hicieron todas las pasadas.`),arr:[...a],sortedFrom:go?n-p+1:0});
   if(!go)break;
   E.push({line:1,node:'iinit',chip:L('i = 0','i = 0'),note:L('Start this pass at the left end: <b>i = 0</b>.','Empieza esta pasada en el extremo izquierdo: <b>i = 0</b>.'),arr:[...a],sortedFrom:n-p+1,ptr:{i:0}});
   for(let i=0;;i++){const more=i<=n-1-p;
    E.push({line:1,node:'icheck',chip:more?L(`i = ${i}`,`i = ${i}`):L(`pass ${p} done`,`pasada ${p} terminada`),note:more?L(`Is i = ${i} ≤ n − 1 − p = ${n-1-p}? Yes, so compare a[${i}] and a[${i+1}].`,`¿i = ${i} ≤ n − 1 − p = ${n-1-p}? Sí, así que compara a[${i}] y a[${i+1}].`):L(`Is i = ${i} ≤ n − 1 − p = ${n-1-p}? No: this pass is over.`,`¿i = ${i} ≤ n − 1 − p = ${n-1-p}? No: esta pasada terminó.`),arr:[...a],sortedFrom:n-p+1,ptr:more?{i}:{}});
    if(!more)break;const gt=a[i]>a[i+1];
    E.push({line:2,node:'cmp',chip:L(`${a[i]} > ${a[i+1]}? ${gt?'yes':'no'}`,`${a[i]} > ${a[i+1]}? ${gt?'sí':'no'}`),note:gt?L(`Compare a[${i}] = ${a[i]} with a[${i+1}] = ${a[i+1]}: ${a[i]} &gt; ${a[i+1]}, so they are out of order.`,`Compara a[${i}] = ${a[i]} con a[${i+1}] = ${a[i+1]}: ${a[i]} &gt; ${a[i+1]}, así que están en desorden.`):L(`Compare a[${i}] = ${a[i]} with a[${i+1}] = ${a[i+1]}: already in order.`,`Compara a[${i}] = ${a[i]} con a[${i+1}] = ${a[i+1]}: ya están en orden.`),arr:[...a],cmp:[i,i+1],sortedFrom:n-p+1,ptr:{i},row:[p,i,a[i],a[i+1],gt?L('swap','intercambio'):'—'],ask:{q:L(`Will a[${i}] = ${a[i]} and a[${i+1}] = ${a[i+1]} be swapped?`,`¿Se intercambiarán a[${i}] = ${a[i]} y a[${i+1}] = ${a[i+1]}?`),options:L(['Swap','No swap'],['Intercambiar','No intercambiar']),answer:gt?0:1,why:gt?L(`${a[i]} is bigger than ${a[i+1]}.`,`${a[i]} es mayor que ${a[i+1]}.`):L(`${a[i]} is not bigger than ${a[i+1]}.`,`${a[i]} no es mayor que ${a[i+1]}.`)}});
    if(gt){[a[i],a[i+1]]=[a[i+1],a[i]];E.push({line:3,node:'swap',chip:L('swap','intercambio'),note:L(`Swap: now a[${i}] = ${a[i]} and a[${i+1}] = ${a[i+1]}.`,`Intercambio: ahora a[${i}] = ${a[i]} y a[${i+1}] = ${a[i+1]}.`),arr:[...a],swapped:[i,i+1],cmp:[i,i+1],sortedFrom:n-p+1,ptr:{i}});}
    E.push({line:1,node:'inc',chip:L(`i = ${i+1}`,`i = ${i+1}`),note:L(`Move to the next pair: <b>i = ${i+1}</b>.`,`Pasa al siguiente par: <b>i = ${i+1}</b>.`),arr:[...a],sortedFrom:n-p+1,ptr:{i:i+1}});}
   E.push({line:0,node:'pinc',chip:L(`p = ${p+1}`,`p = ${p+1}`),note:L(`End of pass ${p}: <b>${a[n-p]}</b> has reached its final place. Next, <b>p = ${p+1}</b>.`,`Fin de la pasada ${p}: <b>${a[n-p]}</b> llegó a su lugar final. Ahora <b>p = ${p+1}</b>.`),arr:[...a],sortedFrom:n-p});}
  E.push({line:4,node:'done',note:L(`The list is sorted after ${total} comparison${total===1?'':'s'}.`,`La lista quedó ordenada después de ${total} comparaci${total===1?'ón':'ones'}.`),arr:[...a],sortedFrom:0,done:true});return E;}
};

/* ---------------- #4 Insertion sort ---------------- */
const insertion={num:4,id:'insertion-sort',level:L('Middle school','Secundaria'),kind:'list',
 name:L('Insertion sort','Ordenamiento por inserción'),
 problem:L('Sort a list by taking each item in turn and sliding it left into its place among the items before it, which are already sorted.','Ordena una lista tomando los elementos uno por uno y deslizando cada uno hacia la izquierda hasta su lugar entre los anteriores, que ya están ordenados.'),
 pseudo:L(['for i from 1 to n − 1:','    key ← a[i],  j ← i − 1','    while j ≥ 0 and a[j] > key:','        a[j + 1] ← a[j],  j ← j − 1','    a[j + 1] ← key','the list is sorted'],['para i desde 1 hasta n − 1:','    key ← a[i],  j ← i − 1','    mientras j ≥ 0 y a[j] > key:','        a[j + 1] ← a[j],  j ← j − 1','    a[j + 1] ← key','la lista está ordenada']),
 flow:{w:490,h:500,nodes:[term('start',215,24,90,30,L('Start','Inicio')),proc('init',215,78,90,30,'i ← 1'),dec('icheck',215,152,150,58,Q('i < n')),proc('take',215,226,200,32,'key ← a[i], j ← i − 1'),dec('wcheck',215,312,240,66,L('j ≥ 0 and a[j] > key ?','¿j ≥ 0 y a[j] > key?')),proc('shift',215,402,220,32,'a[j+1] ← a[j], j ← j − 1'),proc('place',415,402,130,32,'a[j+1] ← key'),proc('inc',415,470,110,30,'i ← i + 1'),term('done',62,152,96,30,L('sorted','ordenada'))],
  edges:[['start','init',[[215,39],[215,63]]],['init','icheck',[[215,93],[215,123]]],['icheck','take',[[215,181],[215,210]],YES,[223,198]],['icheck','done',[[140,152],[110,152]],NO,[118,144]],['take','wcheck',[[215,242],[215,279]]],['wcheck','shift',[[215,345],[215,386]],YES,[223,368]],['wcheck','place',[[335,312],[415,312],[415,386]],NO,[345,304]],['shift','wcheck',[[105,402],[70,402],[70,262],[215,262],[215,279]]],['place','inc',[[415,418],[415,455]]],['inc','icheck',[[470,470],[482,470],[482,108],[215,108],[215,123]]]]},
 code:{
  python:{lines:['def insertion_sort(a):','    for i in range(1, len(a)):','        key = a[i]','        j = i - 1','        while j >= 0 and a[j] > key:','            a[j + 1] = a[j]','            j -= 1','        a[j + 1] = key','    return a'],map:[[2],[3,4],[5],[6,7],[8],[9]]},
  java:{lines:['static void insertionSort(int[] a) {','    for (int i = 1; i < a.length; i++) {','        int key = a[i];','        int j = i - 1;','        while (j >= 0 && a[j] > key) {','            a[j + 1] = a[j];','            j--;','        }','        a[j + 1] = key;','    }','}'],map:[[2],[3,4],[5],[6,7],[9],[11]]},
  matlab:{lines:['function a = insertion_sort(a)','    for i = 2:numel(a)','        key = a(i);','        j = i - 1;','        while j >= 1 && a(j) > key','            a(j + 1) = a(j);','            j = j - 1;','        end','        a(j + 1) = key;','    end','end'],map:[[2],[3,4],[5],[6,7],[9],[11]]}},
 teach:[
  {step:L('Take the items one at a time, starting from the second.','Toma los elementos uno por uno, empezando por el segundo.'),python:L('range(1, len(a)) gives 1, …, n − 1.','range(1, len(a)) da 1, …, n − 1.'),java:L('i starts at 1: a single item is already sorted.','i empieza en 1: un solo elemento ya está ordenado.'),matlab:L('MATLAB counts from 1, so start at 2.','MATLAB cuenta desde 1, así que empieza en 2.')},
  {step:L('Hold the item aside as key, and look at the item just before it.','Aparta el elemento como key y mira el que está justo antes.'),python:L('key keeps the value safe while other items move into its place.','key guarda el valor mientras otros elementos ocupan su lugar.'),java:L('Two local variables: key and j.','Dos variables locales: key y j.'),matlab:L('The same two variables in MATLAB.','Las mismas dos variables en MATLAB.')},
  {step:L('While there is an item to the left and it is bigger than key, keep going.','Mientras haya un elemento a la izquierda y sea mayor que key, sigue.'),python:L('and checks j >= 0 first, so a[j] is never read at position −1.','and revisa primero j >= 0, así que nunca se lee a[j] en la posición −1.'),java:L('&& stops at the first false condition.','&& se detiene en la primera condición falsa.'),matlab:L('&& also stops early in MATLAB; positions start at 1, so the test is j >= 1.','&& también se detiene antes en MATLAB; las posiciones empiezan en 1, así que la condición es j >= 1.')},
  {step:L('Shift that bigger item one place to the right and step left.','Desplaza ese elemento mayor un lugar a la derecha y avanza a la izquierda.'),python:L('j -= 1 is short for j = j - 1.','j -= 1 es una forma corta de j = j - 1.'),java:L('j-- subtracts 1 from j.','j-- resta 1 a j.'),matlab:L('MATLAB writes j = j - 1.','MATLAB escribe j = j - 1.')},
  {step:L('Put key into the gap.','Coloca key en el hueco.'),python:L('The gap is at j + 1, just right of the last item that stayed.','El hueco está en j + 1, justo a la derecha del último elemento que no se movió.'),java:L('The same position in Java.','La misma posición en Java.'),matlab:L('The same position in MATLAB.','La misma posición en MATLAB.')},
  {step:L('After the last item the list is sorted.','Después del último elemento la lista está ordenada.'),python:L('Return the list so the caller can use it.','Devuelve la lista para que quien llamó a la función pueda usarla.'),java:L('The array was sorted in place, without a copy.','El arreglo se ordenó directamente, sin hacer una copia.'),matlab:L('The function returns the sorted a.','La función devuelve a ya ordenada.')}],
 defaults:{list:[6,2,5,1,4,3]},
 trace:L(['i','key','j','a[j]','Action'],['i','key','j','a[j]','Acción']),
 gen(a0,_,rnd=Math.random){const a=[...a0],n=a.length,E=[];const shifts=insertionCounts(a0).shifts;
  E.push({line:-1,node:'start',note:L(`Sort a list of ${n} items.`,`Ordena una lista de ${n} elementos.`),arr:[...a],ask:shuffle({q:L('Before you start: how many times will an item be shifted one place to the right?','Antes de empezar: ¿cuántas veces se desplazará un elemento un lugar a la derecha?'),options:nums(uniq([shifts,n-1,n*(n-1)/2,0])),answer:0,why:shifts===0?L('No pair of items is in the wrong order, so nothing shifts.','Ningún par de elementos está en el orden equivocado, así que nada se desplaza.'):L(`Each pair of items in the wrong order causes one shift: ${shifts===1?'there is 1 such pair':`there are ${shifts} such pairs`}.`,`Cada par de elementos en el orden equivocado causa un desplazamiento: ${shifts===1?'hay 1 par así':`hay ${shifts} pares así`}.`)},rnd)});
  E.push({line:0,node:'init',chip:L('i = 1','i = 1'),note:L('A single item is already sorted, so start with the second one: <b>i = 1</b>.','Un solo elemento ya está ordenado, así que empieza con el segundo: <b>i = 1</b>.'),arr:[...a],sortedTo:1,ptr:{i:1}});
  for(let i=1;;i++){const go=i<n;
   E.push({line:0,node:'icheck',chip:go?L(`item ${i+1} of ${n}`,`elemento ${i+1} de ${n}`):L('loop ends','fin del ciclo'),note:go?L(`Is i = ${i} &lt; n = ${n}? Yes: insert a[${i}] = ${a[i]} into the sorted part.`,`¿i = ${i} &lt; n = ${n}? Sí: inserta a[${i}] = ${a[i]} en la parte ordenada.`):L(`Is i = ${i} &lt; n = ${n}? No: every item has been inserted.`,`¿i = ${i} &lt; n = ${n}? No: ya se insertaron todos los elementos.`),arr:[...a],sortedTo:go?i:n,ptr:go?{i}:{}});
   if(!go)break;const key=a[i];let j=i-1;
   E.push({line:1,node:'take',chip:L(`key = ${key}`,`key = ${key}`),note:L(`Take <b>key = a[${i}] = ${key}</b>. The ${i} item${i===1?'':'s'} before it ${i===1?'is':'are'} already sorted.`,`Toma <b>key = a[${i}] = ${key}</b>. ${i===1?'El elemento anterior ya está ordenado':`Los ${i} elementos anteriores ya están ordenados`}.`),arr:[...a],sortedTo:i,ptr:{j},aside:key,hole:i});
   for(;;){
    if(j<0){E.push({line:2,node:'wcheck',chip:L('j = −1','j = −1'),note:L('j = −1: we reached the start of the list, so the loop stops.','j = −1: llegamos al inicio de la lista, así que el ciclo termina.'),arr:[...a],sortedTo:i+1,aside:key,hole:0,row:[i,key,j,'—',L('stop: start of list','alto: inicio de la lista')]});break;}
    const big=a[j]>key;
    E.push({line:2,node:'wcheck',chip:L(`${a[j]} > ${key}? ${big?'yes':'no'}`,`${a[j]} > ${key}? ${big?'sí':'no'}`),note:L(`Is a[${j}] = ${a[j]} bigger than key = ${key}? <b>${big?'Yes':'No'}</b>.`,`¿a[${j}] = ${a[j]} es mayor que key = ${key}? <b>${big?'Sí':'No'}</b>.`),arr:[...a],sortedTo:i+1,ptr:{j},cmp:[j],aside:key,hole:j+1,row:[i,key,j,a[j],big?L('shift','desplazar'):L('stop','alto')],ask:{q:L(`Will a[${j}] = ${a[j]} move one place right?`,`¿Se moverá a[${j}] = ${a[j]} un lugar a la derecha?`),options:yesNo,answer:big?0:1,why:big?L(`${a[j]} is bigger than key = ${key}, so it moves right.`,`${a[j]} es mayor que key = ${key}, así que se mueve a la derecha.`):L(`${a[j]} is not bigger than key = ${key}, so key goes just after it.`,`${a[j]} no es mayor que key = ${key}, así que key va justo después.`)}});
    if(!big)break;a[j+1]=a[j];
    E.push({line:3,node:'shift',chip:L(`j = ${j-1}`,`j = ${j-1}`),note:L(`Shift ${a[j]} right into position ${j+1}; now <b>j = ${j-1}</b>.`,`Desplaza ${a[j]} a la derecha, a la posición ${j+1}; ahora <b>j = ${j-1}</b>.`),arr:[...a],sortedTo:i+1,swapped:[j+1],ptr:{j:j-1},aside:key,hole:j});j--;}
   a[j+1]=key;
   E.push({line:4,node:'place',chip:L(`a[${j+1}] = ${key}`,`a[${j+1}] = ${key}`),note:L(`Put key = ${key} into position ${j+1}. The first ${i+1} items are now sorted.`,`Coloca key = ${key} en la posición ${j+1}. Los primeros ${i+1} elementos ya están ordenados.`),arr:[...a],sortedTo:i+1,hit:[j+1]});
   E.push({line:0,node:'inc',chip:L(`i = ${i+1}`,`i = ${i+1}`),note:L(`Move on to the next item: <b>i = ${i+1}</b>.`,`Pasa al siguiente elemento: <b>i = ${i+1}</b>.`),arr:[...a],sortedTo:i+1,ptr:i+1<n?{i:i+1}:{}});}
  E.push({line:5,node:'done',note:L(`The list is sorted. Shifts made: ${shifts}.`,`La lista quedó ordenada. Desplazamientos hechos: ${shifts}.`),arr:[...a],sortedTo:n,done:true});return E;}
};

/* ---------------- #5 Euclid's algorithm ---------------- */
const euclid={num:5,id:'euclid',level:L('Middle school','Secundaria'),kind:'pair',
 name:L('Euclid’s algorithm','Algoritmo de Euclides'),
 problem:L('Find the greatest common divisor of two whole numbers. Replace the pair (a, b) with (b, a mod b) until the second number is 0.','Encuentra el máximo común divisor de dos números enteros. Reemplaza el par (a, b) por (b, a mod b) hasta que el segundo número sea 0.'),
 pseudo:L(['while b ≠ 0:','    r ← a mod b','    a ← b,  b ← r','return a'],['mientras b ≠ 0:','    r ← a mod b','    a ← b,  b ← r','devolver a']),
 flow:{w:380,h:300,nodes:[term('start',150,24,90,30,L('Start','Inicio')),dec('check',150,100,140,58,Q('b ≠ 0')),proc('rem',150,180,130,32,'r ← a mod b'),proc('move',150,250,140,32,'a ← b, b ← r'),term('done',315,100,110,30,L('return a','devolver a'))],
  edges:[['start','check',[[150,39],[150,71]]],['check','rem',[[150,129],[150,164]],YES,[158,150]],['check','done',[[220,100],[260,100]],NO,[228,92]],['rem','move',[[150,196],[150,234]]],['move','check',[[80,250],[30,250],[30,58],[150,58],[150,71]]]]},
 code:{
  python:{lines:['def gcd(a, b):','    while b != 0:','        r = a % b','        a, b = b, r','    return a'],map:[[2],[3],[4],[5]]},
  java:{lines:['static int gcd(int a, int b) {','    while (b != 0) {','        int r = a % b;','        a = b;','        b = r;','    }','    return a;','}'],map:[[2],[3],[4,5],[7]]},
  matlab:{lines:['function a = euclid_gcd(a, b)','    while b ~= 0','        r = mod(a, b);','        a = b;','        b = r;','    end','end'],map:[[2],[3],[4,5],[7]]}},
 teach:[
  {step:L('Repeat while the second number is not 0.','Repite mientras el segundo número no sea 0.'),python:L('!= means “is not equal to”.','!= significa “no es igual a”.'),java:L('while (b != 0) { … }','while (b != 0) { … }'),matlab:L('MATLAB writes “not equal” as ~=.','MATLAB escribe “distinto de” como ~=.')},
  {step:L('Divide a by b and keep the remainder.','Divide a entre b y guarda el residuo.'),python:L('% gives the remainder: 48 % 18 is 12.','% da el residuo: 48 % 18 es 12.'),java:L('% gives the remainder for positive ints.','% da el residuo para enteros positivos.'),matlab:L('mod(a, b) gives the remainder.','mod(a, b) da el residuo.')},
  {step:L('The pair (b, remainder) has the same common divisors as (a, b): move on to it.','El par (b, residuo) tiene los mismos divisores comunes que (a, b): pasa a él.'),python:L('Python can update both at once: a, b = b, r.','Python puede actualizar ambos a la vez: a, b = b, r.'),java:L('Two separate assignments; r keeps the remainder so nothing is lost.','Dos asignaciones separadas; r guarda el residuo para no perder nada.'),matlab:L('Two separate assignments, as in Java.','Dos asignaciones separadas, como en Java.')},
  {step:L('When the remainder reaches 0, a is the greatest common divisor.','Cuando el residuo llega a 0, a es el máximo común divisor.'),python:L('return a hands back the answer.','return a devuelve la respuesta.'),java:L('return a; ends the method.','return a; termina el método.'),matlab:L('MATLAB has its own gcd, so this function is named euclid_gcd. The output variable a is returned when it ends.','MATLAB ya tiene gcd, así que esta función se llama euclid_gcd. La variable de salida a se devuelve al terminar.')}],
 defaults:{a:252,b:105},
 trace:L(['Step','a','b','a mod b'],['Paso','a','b','a mod b']),
 gen(_l,_t,rnd=Math.random,pair){let [a,b]=pair;const E=[];const steps=euclidSteps(a,b);
  const cells=(r)=>({arr:[a,b,r==null?'—':r],labels:['a','b','r']});
  E.push({line:-1,node:'start',note:L(`Find the greatest common divisor of ${a} and ${b}.`,`Encuentra el máximo común divisor de ${a} y ${b}.`),...cells(null),ask:shuffle({q:L('Before you start: how many times will a mod b be computed?','Antes de empezar: ¿cuántas veces se calculará a mod b?'),options:nums(uniq([steps,Math.max(a,b),Math.min(a,b),1])),answer:0,why:L(`Each remainder is smaller than the number it divides by, so the pair shrinks quickly: it takes ${steps} remainder step${steps===1?'':'s'}.`,`Cada residuo es menor que el número entre el que se divide, así que el par se achica rápido: se necesita${steps===1?'':'n'} ${steps} paso${steps===1?'':'s'} con residuo.`)},rnd)});
  let k=0;
  for(;;){const go=b!==0;
   E.push({line:0,node:'check',chip:go?L(`step ${k+1}`,`paso ${k+1}`):L('b = 0','b = 0'),note:go?L(`Is b = ${b} ≠ 0? Yes, so divide again.`,`¿b = ${b} ≠ 0? Sí, así que divide otra vez.`):L('b = 0, so the loop stops.','b = 0, así que el ciclo termina.'),...cells(null),cmp:[1],ask:k?{q:L(`b is now ${b}. Will the loop run again?`,`Ahora b es ${b}. ¿Se repetirá el ciclo?`),options:yesNo,answer:go?0:1,why:go?L(`b = ${b} is not 0.`,`b = ${b} no es 0.`):L('b is 0: nothing is left to divide by.','b es 0: ya no hay entre qué dividir.')}:null});
   if(!go)break;const r=a%b;k++;
   E.push({line:1,node:'rem',chip:L(`${a} mod ${b} = ${r}`,`${a} mod ${b} = ${r}`),note:L(`${a} = ${Math.floor(a/b)} × ${b} + ${r}, so <b>r = ${r}</b>.`,`${a} = ${Math.floor(a/b)} × ${b} + ${r}, así que <b>r = ${r}</b>.`),...cells(r),cmp:[2],row:[k,a,b,r],ask:shuffle({q:L(`What is ${a} mod ${b}?`,`¿Cuánto es ${a} mod ${b}?`),options:nums(uniq([r,a-b,Math.floor(a/b),r+1])),answer:0,why:L(`${b} fits into ${a} ${Math.floor(a/b)} time${Math.floor(a/b)===1?'':'s'}, leaving ${r}.`,`${b} cabe en ${a} ${Math.floor(a/b)} ${Math.floor(a/b)===1?'vez':'veces'} y sobran ${r}.`)},rnd)});
   const swapOnly=r===a;a=b;b=r;
   E.push({line:2,node:'move',chip:L(`(${a}, ${b})`,`(${a}, ${b})`),note:swapOnly?L(`${b} was smaller than ${a}, so ${b} mod ${a} = ${b}: this step only swaps the two numbers. Now <b>a = ${a}</b>, <b>b = ${b}</b>.`,`${b} era menor que ${a}, así que ${b} mod ${a} = ${b}: este paso solo intercambia los dos números. Ahora <b>a = ${a}</b>, <b>b = ${b}</b>.`):L(`Move on to the smaller pair: <b>a = ${a}</b>, <b>b = ${b}</b>.`,`Pasa al par más pequeño: <b>a = ${a}</b>, <b>b = ${b}</b>.`),...cells(null),swapped:[0,1]});}
  E.push({line:3,node:'done',note:L(`Return <b>${a}</b>: the greatest common divisor, after ${k} remainder step${k===1?'':'s'}.`,`Devuelve <b>${a}</b>: el máximo común divisor, después de ${k} paso${k===1?'':'s'} con residuo.`),...cells(null),hit:[0],done:true});return E;}
};

const ALGS={'find-max':findMax,'linear-search':linear,'bubble-sort':bubble,'insertion-sort':insertion,euclid};
const ORDER=['find-max','linear-search','bubble-sort','insertion-sort','euclid'];

/* ---------------- Route map ---------------- */
const MAP={rows:[[L('MIDDLE SCHOOL','SECUNDARIA'),50],[L('HIGH SCHOOL','PREPARATORIA'),160],[L('UNIVERSITY','UNIVERSIDAD'),270]],nodes:[
 [1,L('Find the\nmaximum','Encontrar\nel máximo'),85,50],[2,L('Linear search','Búsqueda lineal'),235,50],[3,L('Bubble sort','Ordenamiento\nburbuja'),385,50],[4,L('Insertion sort','Ordenamiento\npor inserción'),535,50],[5,L('Euclid’s\nalgorithm','Algoritmo\nde Euclides'),685,50],
 [10,L('Depth-first\nsearch','Búsqueda en\nprofundidad'),85,160],[6,L('Binary search','Búsqueda binaria'),235,160],[7,L('Merge sort','Ordenamiento\npor mezcla'),385,160],[8,L('Recursion:\nTower of Hanoi','Recursión:\ntorre de Hanói'),535,160],[11,L('Greedy change','Cambio voraz'),685,160],[9,L('Breadth-first\nsearch','Búsqueda en\nanchura'),835,160],
 [16,L('P versus NP','P contra NP'),85,270],[15,L('Spanning trees','Árboles\ngeneradores'),235,270],[12,L('Quicksort','Ordenamiento\nrápido'),385,270],[13,L('Dynamic\nprogramming','Programación\ndinámica'),685,270],[14,L('Dijkstra’s\nshortest paths','Caminos mínimos\nde Dijkstra'),835,270]],
 edges:[[1,2],[2,6,L('sorted: halve it','ordenada: a la mitad')],[3,4],[3,7,L('divide and merge','dividir y mezclar')],[4,7],[5,8],[8,7],[7,12],[10,15],[11,13,L('greedy can fail','lo voraz puede fallar')],[9,14,L('add weights','con pesos')],[6,7]]};
const NUM={};for(const k of ORDER)NUM[ALGS[k].num]=k;

/* ---------------- Challenge checks ---------------- */
function maxStartingAtZero(a){let best=0;for(const x of a)if(x>best)best=x;return best;}
// #1 counterexample: the claim "starting with best ← 0 gives the same answer".
function checkMaxZero(list){const right=Math.max(...list),zero=maxStartingAtZero(list);return{right,zero,counter:right!==zero};}

// #1 improvement: find the largest and the smallest together. Each variant counts its comparisons.
// 0: two separate passes. 1: take the items in pairs, compare the pair first, then the larger with the maximum
// and the smaller with the minimum. 2: one pass; compare with the minimum only when the item is not a new maximum.
function minMaxVariant(a,v){const n=a.length;let comps=0,mx=a[0],mn=a[0];
 if(v===0){for(let i=1;i<n;i++){comps++;if(a[i]>mx)mx=a[i];}for(let i=1;i<n;i++){comps++;if(a[i]<mn)mn=a[i];}}
 else if(v===1){let i;if(n%2===0){comps++;if(a[0]>a[1]){mx=a[0];mn=a[1];}else{mx=a[1];mn=a[0];}i=2;}else i=1;
  for(;i+1<n;i+=2){comps++;const [big,small]=a[i]>a[i+1]?[a[i],a[i+1]]:[a[i+1],a[i]];comps++;if(big>mx)mx=big;comps++;if(small<mn)mn=small;}}
 else for(let i=1;i<n;i++){comps++;if(a[i]>mx)mx=a[i];else{comps++;if(a[i]<mn)mn=a[i];}}
 return{max:mx,min:mn,comps};}
function testMinMax(v,rnd=Math.random){const n=100,kinds={random:()=>[...Array(n)].map(()=>Math.floor(rnd()*1000)),increasing:()=>[...Array(n).keys()],decreasing:()=>[...Array(n).keys()].reverse()};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const a=f(),r=minMaxVariant(a,v);if(r.max===Math.max(...a)&&r.min===Math.min(...a))ok++;base+=minMaxVariant(a,0).comps;mine+=r.comps;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct,worst:Math.max(...rows.map(r=>r[3]))};}

// #2 counterexample: "the position linear search returns is the only place the target appears".
function checkLinearFirst(list,t){const first=list.indexOf(t),count=list.filter(x=>x===t).length;return{first,count,counter:count>1};}

// #2 builder: a search on a sorted list assembled from blocks, run with a step limit.
const BUILD={cond:L(['low ≤ high','low < high','i < n'],['low ≤ high','low < high','i < n']),
 steps:L(['(nothing)','mid ← ⌊(low + high) / 2⌋','if a[mid] = target: return mid','if a[mid] < target: low ← mid + 1, else: high ← mid − 1','if a[mid] < target: low ← mid, else: high ← mid','i ← i + 1'],['(nada)','mid ← ⌊(low + high) / 2⌋','si a[mid] = target: devolver mid','si a[mid] < target: low ← mid + 1, si no: high ← mid − 1','si a[mid] < target: low ← mid, si no: high ← mid','i ← i + 1'])};
function runBuilt(a,t,cond,slots){let low=0,high=a.length-1,mid,i=0,checks=0;const seen=new Set();
 for(let guard=0;guard<500;guard++){const ok=cond===0?low<=high:cond===1?low<high:i<a.length;if(!ok)return{res:-1,checks};let looked=false;
  for(const s of slots){if(s===1)mid=Math.floor((low+high)/2);
   else if(s>=2&&s<=4){if(mid===undefined)return{error:'unset'};if(mid<0||mid>=a.length)return{error:'outside',mid};if(!looked){checks++;looked=true;}
    if(s===2&&a[mid]===t)return{res:mid,checks};if(s===3){if(a[mid]<t)low=mid+1;else high=mid-1;}if(s===4){if(a[mid]<t)low=mid;else high=mid;}}
   else if(s===5)i++;}
  const key=low+','+high+','+mid+','+i;if(seen.has(key)&&!slots.includes(5))return{error:'stuck',checks};seen.add(key);}
 return{error:'stuck',checks};}
function sample(n,rnd){const pool=[...Array(400).keys()];for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,n).sort((x,y)=>x-y);}
function testBuilder(cond,slots,rnd=Math.random){let passed=0,fail=null,worst=0,sum=0,linWorst=0,linSum=0;const total=300;
 for(let k=0;k<total;k++){const n=k<200?1+Math.floor(rnd()*100):100,a=sample(n,rnd),present=k%2===0;
  let t;if(present)t=a[Math.floor(rnd()*a.length)];else do t=Math.floor(rnd()*420)-10;while(a.includes(t));
  const r=runBuilt(a,t,cond,slots),want=a.indexOf(t),ok=!r.error&&(want<0?r.res===-1:r.res===want);
  if(ok){passed++;if(k>=200){worst=Math.max(worst,r.checks);sum+=r.checks;const lin=want<0?n:want+1;linWorst=Math.max(linWorst,lin);linSum+=lin;}}
  else if(!fail)fail={list:a,target:t,want,got:r.error?null:r.res,error:r.error||null};}
 return{passed,total,worst,linWorst,avg:+(sum/100).toFixed(1),linAvg:+(linSum/100).toFixed(1),fail,halving:slots.includes(1)&&slots.includes(3)&&cond===0};}

// #3 bottleneck: how often each flowchart box runs, and improvements to bubble sort.
function bubbleCounts(a0){const a=[...a0],n=a.length;let comps=0,swaps=0;for(let p=1;p<=n-1;p++)for(let i=0;i<=n-1-p;i++){comps++;if(a[i]>a[i+1]){[a[i],a[i+1]]=[a[i+1],a[i]];swaps++;}}
 // Each loop check runs once more per loop, when it stops the loop.
 return{icheck:comps+(n-1),cmp:comps,inc:comps,swap:swaps,iinit:n-1,pinc:n-1,pcheck:n,pinit:1,done:1};}
function judgeBottleneck(node,counts){if(node==='icheck')return'icheck';if(counts[node]===Math.max(...Object.values(counts)))return'max';if(node==='cmp'||node==='inc')return'inner';if(node==='swap')return counts.swap===counts.cmp?'swap-tie':'swap';return'outer';}
function bubbleVariant(a0,o={}){const a=[...a0],n=a.length,gap=o.skip2?2:1;let comps=0;
 for(let p=1;p<=n-1;p++){let swapped=false;
  if(o.back){for(let i=n-1-gap;i>=p-1;i--){comps++;if(a[i]>a[i+gap]){[a[i],a[i+gap]]=[a[i+gap],a[i]];swapped=true;}}}
  else for(let i=0;i<=n-gap-p;i++){comps++;if(a[i]>a[i+gap]){[a[i],a[i+gap]]=[a[i+gap],a[i]];swapped=true;}}
  if(o.early&&!swapped)break;}
 return{sorted:sorted(a),comps};}
function testImprove(o,rnd=Math.random){const kinds={random:()=>[...Array(50)].map(()=>Math.floor(rnd()*1000)),nearly:()=>{const a=[...Array(50).keys()];for(let k=0;k<2;k++){const i=Math.floor(rnd()*49);[a[i],a[i+1]]=[a[i+1],a[i]];}return a;},reversed:()=>[...Array(50).keys()].reverse()};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const a=f(),r=bubbleVariant(a,o);if(r.sorted)ok++;base+=bubbleVariant(a).comps;mine+=r.comps;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{o,rows,correct,early:!!o.early&&!o.skip2};}

// #4 counterexample: "insertion sort always makes fewer comparisons than bubble sort".
function insertionCounts(a0){const a=[...a0];let comps=0,shifts=0;for(let i=1;i<a.length;i++){const key=a[i];let j=i-1;while(j>=0){comps++;if(a[j]>key){a[j+1]=a[j];shifts++;j--;}else break;}a[j+1]=key;}return{comps,shifts};}
// #4 bottleneck: how often each flowchart box of insertion sort runs. The while check runs once per shift,
// plus once per item when it stops; on a list that is already sorted, the outer loop check runs most.
function insertionBoxCounts(a0){const n=a0.length,{shifts}=insertionCounts(a0);return{start:1,init:1,icheck:n,take:n-1,wcheck:shifts+(n-1),shift:shifts,place:n-1,inc:n-1,done:1};}
function boxCounts(key,list){return key==='bubble-sort'?bubbleCounts(list):insertionBoxCounts(list);}
function judgeInsertionBox(node,counts){const max=Math.max(...Object.values(counts));if(counts[node]===max)return'max';if(node==='shift')return'shift';return'low';}
function checkInsertion(list){const ins=insertionCounts(list).comps,bub=list.length*(list.length-1)/2;return{ins,bub,counter:ins>=bub};}

// #5 counterexample: "bigger numbers always need more steps", and improving subtraction.
function euclidSteps(a,b){let k=0;while(b!==0){[a,b]=[b,a%b];k++;}return k;}
function gcdRef(a,b){while(b)[a,b]=[b,a%b];return a;}
function checkEuclidPairs(p1,p2){const s1=euclidSteps(...p1),s2=euclidSteps(...p2),bigger=p2[0]>=p1[0]&&p2[1]>=p1[1]&&(p2[0]>p1[0]||p2[1]>p1[1]);return{s1,s2,bigger,counter:bigger&&s2<s1};}
// Variant 0: repeated subtraction (the starting point). 1: replace subtraction by a remainder. 2: subtract 1. 3: halve an even number.
function subtractVariant(a,b,v){let steps=0;const cap=200000;
 if(v===1){while(a>0&&b>0){if(a>=b)a%=b;else b%=a;steps++;}return{value:a+b,steps};}
 while(a!==b&&steps<cap){if(v===0){if(a>b)a-=b;else b-=a;}else if(v===2){if(a>b)a-=1;else b-=1;}else{if(a>b){if(a%2===0)a/=2;else a-=b;}else{if(b%2===0)b/=2;else b-=a;}}steps++;}
 return steps>=cap?{stuck:true,steps}:{value:a,steps};}
function testEuclidVariant(v,rnd=Math.random){let ok=0,base=0,mine=0,fail=null;const total=200;
 for(let k=0;k<total;k++){const a=1+Math.floor(rnd()*1000),b=1+Math.floor(rnd()*1000),want=gcdRef(a,b),r=subtractVariant(a,b,v),r0=subtractVariant(a,b,0);base+=r0.steps;mine+=r.steps;
  if(!r.stuck&&r.value===want)ok++;else if(!fail)fail={a,b,want,got:r.stuck?null:r.value};}
 return{v,ok,total,base:+(base/total).toFixed(1),mine:+(mine/total).toFixed(1),fail};}

/* ---------------- Complexity questions ---------------- */
const CPLX={
 'find-max':{q:L('How many comparisons a[i] > best does find-the-maximum make on a list of 1,000 items?','¿Cuántas veces compara a[i] > best el algoritmo para encontrar el máximo en una lista de 1,000 elementos?'),options:L(['10','500','999','1,000,000'],['10','500','999','1,000,000']),answer:2,why:L('Every item after the first is compared once: 1,000 − 1 = 999. The work grows in step with n.','Cada elemento después del primero se compara una vez: 1,000 − 1 = 999. El trabajo crece al mismo ritmo que n.')},
 'linear-search':{q:L('Linear search on 1,000,000 items: how many checks in the worst case?','Búsqueda lineal en 1,000,000 elementos: ¿cuántas revisiones en el peor caso?'),options:L(['20','1,000','500,000','1,000,000'],['20','1,000','500,000','1,000,000']),answer:3,why:L('In the worst case the target is last or missing, so every item is checked.','En el peor caso el número está al final o no está, así que se revisan todos los elementos.')},
 'bubble-sort':{q:L('Bubble sort with early stopping, on 100 items: how many comparisons in the worst case?','Ordenamiento burbuja con parada anticipada, en 100 elementos: ¿cuántas comparaciones en el peor caso?'),options:L(['99','664','4,950','10,000'],['99','664','4,950','10,000']),answer:2,why:L('A reversed list needs every pass: 99 + 98 + … + 1 = 4,950. Early stopping helps only when passes run out of swaps early.','Una lista invertida necesita todas las pasadas: 99 + 98 + … + 1 = 4,950. Parar antes solo ayuda cuando las pasadas se quedan pronto sin intercambios.')},
 'insertion-sort':{q:L('Insertion sort on a list of 1,000 items that is already sorted: how many comparisons?','Ordenamiento por inserción en una lista de 1,000 elementos ya ordenada: ¿cuántas comparaciones?'),options:L(['999','1,000','499,500','1,000,000'],['999','1,000','499,500','1,000,000']),answer:0,why:L('Each new item is compared once with the item before it, finds it smaller, and stays: 999 comparisons. Bubble sort would still make 499,500.','Cada elemento nuevo se compara una vez con el anterior, lo encuentra menor y se queda: 999 comparaciones. El ordenamiento burbuja haría 499,500 de todos modos.')},
 euclid:{q:L('For two numbers below 1,000,000, at most about how many remainder steps does Euclid’s algorithm need?','Para dos números menores que 1,000,000, ¿aproximadamente cuántos pasos con residuo necesita como máximo el algoritmo de Euclides?'),options:L(['about 30','about 1,000','about 500,000','about 1,000,000'],['unos 30','unos 1,000','unos 500,000','unos 1,000,000']),answer:0,why:L('Never more than 29. The worst pairs are neighbouring Fibonacci numbers: 832,040 and 514,229 take 28 steps, and one more if they are given in the other order.','Nunca más de 29. Los peores pares son números de Fibonacci consecutivos: 832,040 y 514,229 necesitan 28 pasos, y uno más si se dan en el orden contrario.')}};

/* ---------------- Ideas in the learner's own words ---------------- */
const IDEAS={
 'find-max':L('How could you find both the largest and the smallest number? How many comparisons would that take?','¿Cómo encontrarías a la vez el número más grande y el más pequeño? ¿Cuántas comparaciones necesitarías?'),
 'linear-search':L('If the list were sorted, how could you find the target with fewer checks? Write your idea in your own words.','Si la lista estuviera ordenada, ¿cómo encontrarías el número con menos revisiones? Escribe tu idea con tus propias palabras.'),
 'bubble-sort':L('Bubble sort keeps comparing neighbours. When is that wasted work? Describe an idea to avoid it.','El ordenamiento burbuja compara vecinos una y otra vez. ¿Cuándo es trabajo desperdiciado? Describe una idea para evitarlo.'),
 'insertion-sort':L('Insertion sort is fast on lists that are nearly sorted. Why? Explain in your own words.','El ordenamiento por inserción es rápido en listas casi ordenadas. ¿Por qué? Explícalo con tus propias palabras.'),
 euclid:L('Why does (b, a mod b) have the same greatest common divisor as (a, b)? Explain in your own words.','¿Por qué (b, a mod b) tiene el mismo máximo común divisor que (a, b)? Explícalo con tus propias palabras.')};

/* ---------------- Recommendation rules ---------------- */
// Each rule reads what the learner did in this section: challenge results, and on #1 and #2 how many
// predictions matched, which the advice then states. No rule rates the learner.
const NAMES={1:L('#1 Find the maximum','#1 Encontrar el máximo'),2:L('#2 Linear search','#2 Búsqueda lineal'),3:L('#3 Bubble sort','#3 Ordenamiento burbuja'),4:L('#4 Insertion sort','#4 Ordenamiento por inserción'),5:L('#5 Euclid’s algorithm','#5 Algoritmo de Euclides'),7:L('#7 Merge sort','#7 Ordenamiento por mezcla')};
const FIND_REASON=L('Find the reason','Encuentra la causa'),WHY_PENDING=L('You found a counterexample. Now answer the question under it: what makes it work?','Encontraste un contraejemplo. Ahora responde la pregunta que aparece debajo: ¿qué hace que funcione?');
function recommend(key,e={},pred){const items=[],add=(text,good)=>items.push({text,good}),c=e.cplx,x=e.counter,im=e.improve,b=e.bottle,bt=e.built;
 const low=!!pred&&pred.asked>=5&&pred.matched/pred.asked<.6,found=!!x&&x.status==='counter',reason=found&&x.why===0;
 if(pred)add(L(`Predictions: ${pred.matched} of ${pred.asked} matched`,`Predicciones: ${pred.matched} de ${pred.asked} acertadas`),false);
 if(c)add(c.ok?L('Predicted how the cost grows','Predijiste cómo crece el costo'):L('Missed how the cost grows','No acertaste cómo crece el costo'),c.ok);
 if(e.idea)add(L('Wrote an idea in your own words (kept in this browser)','Escribiste una idea con tus palabras (guardada en este navegador)'),false);
 const r=(num,title,why,alt=[])=>({num,key:NUM[num]||null,title,why,alt,items});
 const lowWhy=(n,more)=>L(`${pred.matched} of your ${pred.asked} predictions matched. Run #${n} again with a random list and predict each step${more?more.en:''}.`,`${pred.matched} de tus ${pred.asked} predicciones acertaron. Vuelve a ejecutar el #${n} con una lista al azar y predice cada paso${more?more.es:''}.`);
 const counterItem=good=>add(reason?good:L('Found a counterexample','Encontraste un contraejemplo'),reason);
 if(key==='find-max'){if(found)counterItem(L('Found a counterexample and its reason','Encontraste un contraejemplo y su causa'));
  if(im)add(im.v===1?L('Tested the pairing method: about 3n/2 comparisons','Probaste el método por pares: unas 3n/2 comparaciones'):L('Tested a way to find the largest and the smallest','Probaste una forma de encontrar el mayor y el menor'),im.v===1);
  if(reason||im&&im.v===1)return r(2,NAMES[2],reason?L('You found the hidden assumption in “start at 0”. #2 uses the same loop to search, and it can stop early.','Encontraste la suposición oculta en “empezar en 0”. El #2 usa el mismo ciclo para buscar, y puede detenerse antes.'):L('You saw that pairing the items cuts comparisons. #2 uses the same loop to search, and it can stop early.','Viste que formar pares reduce las comparaciones. El #2 usa el mismo ciclo para buscar, y puede detenerse antes.'),[[3,NAMES[3],L('each pass carries the maximum to the end','cada pasada lleva el máximo al final')]]);
  if(found)return r(1,FIND_REASON,WHY_PENDING);
  if(low)return r(1,L('Stay with #1 on a new list','Sigue con el #1 en una lista nueva'),lowWhy(1));
  return r(1,L('Try “Does it always work?”','Prueba “¿Siempre funciona?”'),L('Look for a list where starting with best ← 0 gives the wrong answer. That shows why the algorithm starts with a[0].','Busca una lista donde empezar con best ← 0 dé una respuesta equivocada. Así verás por qué el algoritmo empieza con a[0].'),[[2,NAMES[2],L('the same loop, used to search','el mismo ciclo, usado para buscar')]]);}
 if(key==='linear-search'){if(found)counterItem(L('Found that linear search returns the first match','Encontraste que la búsqueda lineal devuelve la primera coincidencia'));
  const pass=!!bt&&bt.passed===bt.total,own=pass&&!(bt.hints>=4);
  if(bt)add(!pass?L(`Built a search that passed ${bt.passed} of ${bt.total} tests`,`Armaste una búsqueda que pasó ${bt.passed} de ${bt.total} pruebas`):own?L(`Built a halving search that passed all ${bt.total} tests`,`Armaste una búsqueda por mitades que pasó las ${bt.total} pruebas`):L(`Assembled the halving search with every hint; it passed all ${bt.total} tests`,`Armaste la búsqueda por mitades con todas las pistas; pasó las ${bt.total} pruebas`),pass);
  if(pass)return r(3,L('#3 Bubble sort, then #6 Binary search','#3 Ordenamiento burbuja y luego #6 Búsqueda binaria'),own?L('You built the halving idea yourself. It only works on sorted lists, so learn how to sort next (#3). #6 Binary search, in the high-school part, studies your idea in full.','Construiste tú mismo la idea de partir a la mitad. Solo funciona en listas ordenadas, así que aprende a ordenar (#3). El #6 Búsqueda binaria, en la parte de preparatoria, estudia tu idea a fondo.'):L('Your halving search passed every test. It only works on sorted lists, so learn how to sort next (#3). #6 Binary search, in the high-school part, explains why each block is needed.','Tu búsqueda por mitades pasó todas las pruebas. Solo funciona en listas ordenadas, así que aprende a ordenar (#3). El #6 Búsqueda binaria, en la parte de preparatoria, explica por qué hace falta cada bloque.'),[[4,NAMES[4],L('another way to sort','otra forma de ordenar')]]);
  if(found&&!reason)return r(2,FIND_REASON,WHY_PENDING);
  if(low)return r(2,L('Stay with #2 on a new list','Sigue con el #2 en una lista nueva'),lowWhy(2,L(', or look at #1, which uses the same loop with less to track',', o mira el #1, que usa el mismo ciclo con menos que seguir')),[[1,NAMES[1],L('the same loop, simpler','el mismo ciclo, más sencillo')]]);
  return r(2,L('Try “Faster on a sorted list”','Prueba “Más rápido en una lista ordenada”'),L('Build a faster search in Think further. If it passes the tests, you have found the idea behind #6 Binary search.','Construye una búsqueda más rápida en Piensa más allá. Si pasa las pruebas, encontraste la idea del #6 Búsqueda binaria.'),[[3,NAMES[3],L('another middle-school algorithm','otro algoritmo de secundaria')]]);}
 if(key==='bubble-sort'){if(b)add(b.ok?L('Found the bottleneck: the inner loop','Encontraste el cuello de botella: el ciclo interior'):L('Looked for the bottleneck','Buscaste el cuello de botella'),b.ok);
  if(im)add(im.correct&&im.early?L('Stopped early and saw that it does not help reversed lists','Paraste antes y viste que no ayuda con listas invertidas'):im.correct?L('Tested a change that kept the list sorted','Probaste un cambio que mantuvo la lista ordenada'):L('Tested a change that broke the sorting','Probaste un cambio que rompió el ordenamiento'),im.correct&&im.early);
  if(b&&b.ok&&im&&im.correct&&im.early)return r(4,NAMES[4],L('You found that comparisons are the cost and that stopping early only helps nearly sorted lists. #4 is fast on nearly sorted lists. #7 Merge sort, in the high-school part, stays fast even in the worst case.','Encontraste que el costo está en las comparaciones y que parar antes solo ayuda con listas casi ordenadas. El #4 es rápido con listas casi ordenadas. El #7 Ordenamiento por mezcla, en la parte de preparatoria, sigue siendo rápido incluso en el peor caso.'),[[7,NAMES[7],L('fast in every case','rápido en todos los casos')]]);
  if(!b||!b.ok)return r(3,b?L('Look again at the bottleneck','Vuelve a mirar el cuello de botella'):L('Find the bottleneck first','Primero encuentra el cuello de botella'),b?L('Use the table under your choice: which box ran most often, and why?','Usa la tabla debajo de tu elección: ¿qué caja se ejecutó más veces, y por qué?'):L('Count which step runs most often. Every improvement starts there.','Cuenta qué paso se ejecuta más veces. Toda mejora empieza ahí.'),[[2,NAMES[2],L('a simpler loop','un ciclo más sencillo')]]);
  return r(3,L('Try “Less comparing”','Prueba “Comparar menos”'),L('Test a change that cuts comparisons, and check it on reversed lists too.','Prueba un cambio que reduzca las comparaciones y revísalo también con listas invertidas.'));}
 if(key==='insertion-sort'){if(found)counterItem(L('Found where insertion sort is as slow as bubble sort','Encontraste dónde el ordenamiento por inserción es tan lento como el ordenamiento burbuja'));
  if(b)add(b.ok?L('Found the box that runs most on the list','Encontraste la caja que más se ejecuta con la lista'):L('Looked for the bottleneck','Buscaste el cuello de botella'),b.ok);
  if(reason)return r(5,NAMES[5],L('You found the worst case of insertion sort: a list in decreasing order. #7 Merge sort, in the high-school part, avoids it. Meanwhile #5 shows a different kind of algorithm: it shrinks numbers instead of moving items.','Encontraste el peor caso del ordenamiento por inserción: una lista en orden decreciente. El #7 Ordenamiento por mezcla, en la parte de preparatoria, lo evita. Mientras tanto, el #5 muestra otra clase de algoritmo: achica números en lugar de mover elementos.'),[[7,NAMES[7],L('no slow worst case','sin un peor caso lento')]]);
  if(found)return r(4,FIND_REASON,WHY_PENDING);
  return r(4,L('Try “Is it always faster?”','Prueba “¿Siempre es más rápido?”'),L('Look for a list where insertion sort makes as many comparisons as bubble sort. That shows when insertion sort is slow.','Busca una lista donde el ordenamiento por inserción haga tantas comparaciones como el ordenamiento burbuja. Así verás cuándo es lento.'),[[3,NAMES[3],L('compare the two sorts','compara los dos ordenamientos')]]);}
 if(found)counterItem(L('Found that size does not decide the steps, and named the worst pairs','Encontraste que el tamaño no decide los pasos y nombraste los peores pares'));
 if(im)add(im.v===1&&im.ok===im.total?L('Replaced repeated subtraction with a remainder','Reemplazaste la resta repetida por un residuo'):L('Tested a change to the subtraction method','Probaste un cambio al método de la resta'),im.v===1&&im.ok===im.total);
 if(reason)return r(8,L('#8 Recursion, and Number Theory','#8 Recursión y Teoría de números'),L('You found that neighbouring Fibonacci numbers are the slowest pairs. #8 Recursion, in the high-school part, rewrites Euclid’s algorithm in one line. The Number Theory project “Square tiles and Euclid’s shortcut” proves why it works.','Encontraste que los números de Fibonacci consecutivos son los pares más lentos. El #8 Recursión, en la parte de preparatoria, reescribe el algoritmo de Euclides en una línea. El proyecto de Teoría de números “Losetas cuadradas y el atajo de Euclides” demuestra por qué funciona.'),[[1,NAMES[1],L('back to the start of the route','de vuelta al inicio de la ruta')]]);
 if(found)return r(5,FIND_REASON,WHY_PENDING);
 return r(5,L('Try “Do bigger numbers need more steps?”','Prueba “¿Los números más grandes necesitan más pasos?”'),L('Find a bigger pair that needs fewer steps than a smaller one.','Encuentra un par más grande que necesite menos pasos que uno más pequeño.'),[[4,NAMES[4],L('another middle-school algorithm','otro algoritmo de secundaria')]]);}

return{VERSION,L,ALGS,ORDER,MAP,NUM,BUILD,CPLX,IDEAS,sorted,uniq,shuffle,maxStartingAtZero,checkMaxZero,minMaxVariant,testMinMax,checkLinearFirst,insertionBoxCounts,boxCounts,judgeInsertionBox,runBuilt,testBuilder,bubbleCounts,judgeBottleneck,bubbleVariant,testImprove,insertionCounts,checkInsertion,euclidSteps,gcdRef,checkEuclidPairs,subtractVariant,testEuclidVariant,recommend};
});
