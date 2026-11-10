(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceAlgorithms=api;})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
// Algorithms course: content, step-by-step traces, challenge checks and recommendation rules.
// Everything here is pure, so tests can run it without a browser. Text is held as {en}.
const L=en=>({en});
const VERSION='algorithms-1';
const term=(id,x,y,w,h,text)=>({id,kind:'term',x,y,w,h,text}),proc=(id,x,y,w,h,text)=>({id,kind:'proc',x,y,w,h,text}),dec=(id,x,y,w,h,text)=>({id,kind:'dec',x,y,w,h,text});
const YES=L('yes'),NO=L('no');
const Q=t=>L(t+' ?');
function uniq(xs){const out=[];for(const x of xs)if(!out.includes(x))out.push(x);let k=1;while(out.length<3){if(!out.includes(out[0]+k))out.push(out[0]+k);k++;}return out;}
// Multiple-choice options in random order, so the answer is not always in the same place.
function shuffle(ask,rnd){const order=ask.options.en.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 return{...ask,options:L(order.map(i=>ask.options.en[i])),answer:order.indexOf(ask.answer)};}
const nums=(xs)=>L(xs.map(String));
const yesNo=L(['Yes','No']);
const sorted=a=>a.every((x,i)=>!i||a[i-1]<=x);

/* ---------------- #1 Find the maximum ---------------- */
const findMax={num:1,id:'find-max',level:L('Middle school'),kind:'list',
 name:L('Find the maximum'),
 problem:L('Find the largest number in a list. Look at each item once and remember the largest one seen so far.'),
 pseudo:L(['best ← a[0]','for i from 1 to n − 1:','    if a[i] > best:','        best ← a[i]','return best']),
 flow:{w:420,h:440,nodes:[term('start',170,24,90,30,L('Start')),proc('init',170,80,170,32,'best ← a[0], i ← 1'),dec('check',170,158,150,60,Q('i < n')),dec('cmp',170,250,170,62,Q('a[i] > best')),proc('upd',350,250,110,32,'best ← a[i]'),proc('inc',170,340,110,32,'i ← i + 1'),term('done',66,410,124,30,L('return best'))],
  edges:[['start','init',[[170,39],[170,64]]],['init','check',[[170,96],[170,128]]],['check','cmp',[[170,188],[170,219]],YES,[178,207]],['check','done',[[95,158],[66,158],[66,395]],NO,[72,150]],['cmp','upd',[[255,250],[295,250]],YES,[264,242]],['cmp','inc',[[170,281],[170,324]],NO,[178,305]],['upd','inc',[[350,266],[350,340],[225,340]]],['inc','check',[[170,356],[170,380],[410,380],[410,158],[245,158]]]]},
 code:{
  python:{lines:['def find_max(a):','    best = a[0]','    for i in range(1, len(a)):','        if a[i] > best:','            best = a[i]','    return best'],map:[[2],[3],[4],[5],[6]]},
  java:{lines:['static int findMax(int[] a) {','    int best = a[0];','    for (int i = 1; i < a.length; i++) {','        if (a[i] > best) {','            best = a[i];','        }','    }','    return best;','}'],map:[[2],[3],[4],[5],[8]]},
  matlab:{lines:['function best = find_max(a)','    best = a(1);','    for i = 2:numel(a)','        if a(i) > best','            best = a(i);','        end','    end','end'],map:[[2],[3],[4],[5],[8]]}},
 teach:[
  {step:L('Start with the first item as the largest seen so far.'),python:L('a[0] is the first item: Python counts positions from 0.'),java:L('Declare best as an int and give it a[0].'),matlab:L('MATLAB counts positions from 1, so the first item is a(1).')},
  {step:L('Look at every other item in turn.'),python:L('range(1, len(a)) gives 1, 2, …, n − 1.'),java:L('i starts at 1, because item 0 is already in best.'),matlab:L('2:numel(a) skips the first item.')},
  {step:L('Ask whether this item is bigger than the largest so far.'),python:L('> compares two numbers.'),java:L('The same comparison in Java.'),matlab:L('Round brackets read a position: a(i).')},
  {step:L('If it is, remember it instead.'),python:L('best = a[i] replaces the old value.'),java:L('best = a[i]; replaces the old value.'),matlab:L('best = a(i); replaces the old value.')},
  {step:L('When every item has been seen, best is the answer.'),python:L('return hands best back to whoever called the function.'),java:L('return best; ends the method.'),matlab:L('The output variable best is returned when the function ends.')}],
 defaults:{list:[4,9,2,11,7,11,3]},
 trace:L(['Step','i','a[i]','best','a[i] > best?']),
 gen(a,_,rnd=Math.random){const E=[],n=a.length;let best=a[0],ups=0;for(let i=1;i<n;i++)if(a[i]>best){best=a[i];ups++;}best=a[0];
  E.push({line:-1,node:'start',note:L(`Find the largest of ${n} numbers.`),ask:shuffle({q:L('Before you start: after its first value, how many times will best change?'),options:nums(uniq([ups,n-1,0,1])),answer:0,why:L(`best changes each time a bigger number appears: ${ups} time${ups===1?'':'s'}.`)},rnd)});
  E.push({line:0,node:'init',note:L(`Start with the first item: <b>best = ${best}</b>, and look next at <b>i = 1</b>.`),ptr:{i:1},mark:[0],vars:{best}});
  for(let i=1;;i++){const go=i<n;
   E.push({line:1,node:'check',chip:go?L(`item ${i+1} of ${n}`):L('loop ends'),note:go?L(`Is i = ${i} &lt; n = ${n}? Yes, so look at position ${i}.`):L(`Is i = ${i} &lt; n = ${n}? No: every item has been seen.`),ptr:go?{i}:{},mark:[a.indexOf(best)],vars:{best}});
   if(!go)break;const big=a[i]>best;
   E.push({line:2,node:'cmp',chip:L(`${a[i]} > ${best}? ${big?'yes':'no'}`),note:L(`Is a[${i}] = ${a[i]} bigger than best = ${best}? <b>${big?'Yes':'No'}</b>.`),cmp:[i],ptr:{i},mark:[a.indexOf(best)],vars:{best},row:[i,a[i],best,big?YES:NO],ask:{q:L(`Is a[${i}] = ${a[i]} bigger than best = ${best}?`),options:yesNo,answer:big?0:1,why:L(`${a[i]} ${big?'is':'is not'} bigger than ${best}.${!big&&a[i]===best?' Equal is not bigger, so best stays.':''}`)}});
   if(big){best=a[i];E.push({line:3,node:'upd',chip:L(`best = ${best}`),note:L(`Remember the new largest: <b>best = ${best}</b>.`),ptr:{i},mark:[i],vars:{best}});}
   E.push({line:1,node:'inc',note:L(`Move on: <b>i = ${i+1}</b>.`),ptr:{i:i+1},mark:[a.indexOf(best)],vars:{best}});}
  E.push({line:4,node:'done',note:L(`Return <b>${best}</b>. Comparisons made: ${n-1}.`),hit:[a.indexOf(best)],vars:{best},done:true});return E;}
};

/* ---------------- #2 Linear search ---------------- */
const linear={num:2,id:'linear-search',level:L('Middle school'),kind:'search',
 name:L('Linear search'),
 problem:L('Find the position of a target number in a list. Look at the items one by one. If the target is not there, answer −1.'),
 pseudo:L(['for i from 0 to n − 1:','    if a[i] = target:','        return i','return −1']),
 flow:{w:420,h:380,nodes:[term('start',170,26,90,32,L('Start')),proc('init',170,86,110,34,'i ← 0'),dec('check',170,164,150,62,Q('i < n')),dec('cmp',170,262,170,66,Q('a[i] = target')),term('found',170,352,110,32,L('return i')),proc('inc',350,262,100,34,'i ← i + 1'),term('notfound',58,352,108,32,L('return −1'))],
  edges:[['start','init',[[170,42],[170,69]]],['init','check',[[170,103],[170,133]]],['check','cmp',[[170,195],[170,229]],YES,[178,215]],['check','notfound',[[95,164],[58,164],[58,336]],NO,[66,156]],['cmp','found',[[170,295],[170,336]],YES,[178,318]],['cmp','inc',[[255,262],[300,262]],NO,[266,254]],['inc','check',[[350,245],[350,164],[245,164]]]]},
 code:{
  python:{lines:['def linear_search(a, target):','    for i in range(len(a)):','        if a[i] == target:','            return i','    return -1'],map:[[2],[3],[4],[5]]},
  java:{lines:['static int linearSearch(int[] a, int target) {','    for (int i = 0; i < a.length; i++) {','        if (a[i] == target) {','            return i;','        }','    }','    return -1;','}'],map:[[2],[3],[4],[7]]},
  matlab:{lines:['function idx = linear_search(a, target)','    idx = -1;','    for i = 1:numel(a)','        if a(i) == target','            idx = i;','            return','        end','    end','end'],map:[[3],[4],[5,6],[2,9]]}},
 teach:[
  {step:L('Go through the positions one at a time.'),python:L('range(len(a)) gives 0, 1, …, n − 1, one position per pass.'),java:L('Start at 0, keep going while i < a.length, add 1 after each pass.'),matlab:L('MATLAB counts positions from 1, so the loop runs i = 1, …, n.')},
  {step:L('Compare the item with the target.'),python:L('Use == to compare. A single = would store a value instead.'),java:L('== compares two int values.'),matlab:L('MATLAB reads a position with round brackets: a(i).')},
  {step:L('Stop as soon as it matches.'),python:L('return ends the function at once and hands back i.'),java:L('return i; ends the method at once.'),matlab:L('Store the answer in idx, then return.')},
  {step:L('After the loop, report that it is missing.'),python:L('This line is outside the loop, so it runs only if no item matched.'),java:L('Reached only when the loop finishes without a match.'),matlab:L('MATLAB sets idx = -1 first and changes it only if the target is found.')}],
 defaults:{list:[7,3,9,12,5,18,2,11],target:5},
 trace:L(['Check','i','a[i]','= target?']),
 gen(a,t,rnd=Math.random){const E=[],n=a.length;const pos=a.indexOf(t),checks=pos<0?n:pos+1;
  E.push({line:-1,node:'start',note:L(`Search for ${t} in a list of ${n} items.`),ask:shuffle({q:L('Before you start: how many items will be checked before the search stops?'),options:nums(uniq([checks,n,1,Math.ceil(n/2)])),answer:0,why:pos<0?L(`${t} is not in the list, so all ${n} items are checked.`):pos===0?L(`${t} is at position 0, so only 1 item is checked.`):L(`${t} is first found at position ${pos}, so positions 0 to ${pos} are checked: ${checks} items.`)},rnd)});
  E.push({line:0,node:'init',note:L('Start at the first position: <b>i = 0</b>.'),ptr:{i:0},vars:{i:0}});
  for(let i=0;;i++){const go=i<n;
   E.push({line:0,node:'check',chip:go?L(`item ${i+1} of ${n}`):L('loop ends'),note:go?L(`Is i = ${i} &lt; n = ${n}? Yes, so look at position ${i}.`):L(`Is i = ${i} &lt; n = ${n}? No: every item has been checked.`),ptr:go?{i}:{},vars:{i}});
   if(!go)break;const eq=a[i]===t;
   E.push({line:1,node:'cmp',chip:L(`${a[i]} = ${t}? ${eq?'yes':'no'}`),note:L(`Is a[${i}] = ${a[i]} equal to ${t}? <b>${eq?'Yes':'No'}</b>.`),cmp:[i],ptr:{i},row:[i,a[i],eq?YES:NO],ask:{q:L(`Is a[${i}] equal to the target ${t}?`),options:yesNo,answer:eq?0:1,why:L(`a[${i}] is ${a[i]}, which ${eq?'is':'is not'} ${t}.`)}});
   if(eq){E.push({line:2,node:'found',note:L(`Return <b>${i}</b>: ${t} is at position ${i}. Checks made: ${i+1}.`),hit:[i],ptr:{i},done:true});return E;}
   E.push({line:0,node:'inc',note:L(`Move on: <b>i = ${i+1}</b>.`),ptr:{i:i+1}});}
  E.push({line:3,node:'notfound',note:L(`Return <b>−1</b>: ${t} is not in the list. Checks made: ${n}.`),done:true});return E;}
};

/* ---------------- #3 Bubble sort ---------------- */
function passSum(n){const t=n*(n-1)/2;if(n===2)return L('There is one pass with one comparison.');
 if(n===3)return L('Pass 1 makes 2 comparisons and pass 2 makes 1: 2 + 1 = 3.');
 return L(`Pass 1 makes ${n-1} comparisons, pass 2 makes ${n-2}, and so on down to 1: ${n-1} + … + 1 = ${t}.`);}

const bubble={num:3,id:'bubble-sort',level:L('Middle school'),kind:'list',
 name:L('Bubble sort'),
 problem:L('Sort a list from smallest to largest by comparing neighbours again and again, and swapping them when they are out of order.'),
 pseudo:L(['for p from 1 to n − 1:','    for i from 0 to n − 1 − p:','        if a[i] > a[i + 1]:','            swap a[i] and a[i + 1]','the list is sorted']),
 flow:{w:490,h:510,nodes:[term('start',215,24,90,30,L('Start')),proc('pinit',215,78,110,30,'p ← 1'),dec('pcheck',215,152,170,58,Q('p ≤ n − 1')),proc('iinit',215,226,110,30,'i ← 0'),dec('icheck',215,302,200,60,Q('i ≤ n − 1 − p')),dec('cmp',215,392,190,62,Q('a[i] > a[i+1]')),proc('swap',58,392,100,32,L('swap')),proc('inc',215,482,110,30,'i ← i + 1'),proc('pinc',410,302,110,30,'p ← p + 1'),term('done',410,152,100,30,L('sorted'))],
  edges:[['start','pinit',[[215,39],[215,63]]],['pinit','pcheck',[[215,93],[215,123]]],['pcheck','iinit',[[215,181],[215,211]],YES,[223,198]],['pcheck','done',[[300,152],[360,152]],NO,[316,144]],['iinit','icheck',[[215,241],[215,272]]],['icheck','cmp',[[215,332],[215,361]],YES,[223,349]],['icheck','pinc',[[315,302],[355,302]],NO,[324,294]],['cmp','swap',[[120,392],[108,392]],YES,[100,382]],['cmp','inc',[[215,423],[215,467]],NO,[223,448]],['swap','inc',[[58,408],[58,482],[160,482]]],['inc','icheck',[[270,482],[340,482],[340,258],[215,258],[215,272]]],['pinc','pcheck',[[465,302],[480,302],[480,108],[215,108],[215,123]]]]},
 code:{
  python:{lines:['def bubble_sort(a):','    n = len(a)','    for p in range(1, n):','        for i in range(0, n - p):','            if a[i] > a[i + 1]:','                a[i], a[i + 1] = a[i + 1], a[i]','    return a'],map:[[3],[4],[5],[6],[7]]},
  java:{lines:['static void bubbleSort(int[] a) {','    int n = a.length;','    for (int p = 1; p <= n - 1; p++) {','        for (int i = 0; i <= n - 1 - p; i++) {','            if (a[i] > a[i + 1]) {','                int tmp = a[i];','                a[i] = a[i + 1];','                a[i + 1] = tmp;','            }','        }','    }','}'],map:[[3],[4],[5],[6,7,8],[12]]},
  matlab:{lines:['function a = bubble_sort(a)','    n = numel(a);','    for p = 1:n-1','        for i = 1:n-p','            if a(i) > a(i+1)','                a([i i+1]) = a([i+1 i]);','            end','        end','    end','end'],map:[[3],[4],[5],[6],[10]]}},
 teach:[
  {step:L('Make n − 1 passes over the list.'),python:L('range(1, n) gives p = 1, …, n − 1.'),java:L('p runs from 1 up to n − 1.'),matlab:L('1:n-1 lists the passes.')},
  {step:L('In pass p, compare each item with the next one, up to the part that is already in place.'),python:L('range(0, n - p) gives i = 0, …, n − p − 1, so the last pair compared is a[n − p − 1] and a[n − p]. The p − 1 items after it are already in their final places.'),java:L('i runs from 0 up to n − 1 − p.'),matlab:L('MATLAB counts from 1, so i runs from 1 to n − p.')},
  {step:L('Check whether the pair is out of order.'),python:L('> compares the two neighbours.'),java:L('The same comparison in Java.'),matlab:L('Round brackets read a position: a(i).')},
  {step:L('If so, swap them.'),python:L('Python can swap two items in one line.'),java:L('Java needs a temporary variable to swap.'),matlab:L('MATLAB can swap by reordering two positions at once.')},
  {step:L('After the last pass the list is sorted.'),python:L('Return the list so the caller can use it.'),java:L('The array was sorted in place, so nothing is returned.'),matlab:L('The function returns the sorted a.')}],
 defaults:{list:[5,1,4,2,8,3]},
 trace:L(['Pass','i','a[i]','a[i+1]','Action']),
 gen(a0,_,rnd=Math.random){const a=[...a0],n=a.length,E=[],total=n*(n-1)/2;
  E.push({line:-1,node:'start',note:L(`Sort a list of ${n} items.`),arr:[...a],ask:shuffle({q:L(`Before you start: how many comparisons will bubble sort make on these ${n} items?`),options:nums(uniq([total,n,n-1,n*n])),answer:0,why:passSum(n)},rnd)});
  E.push({line:0,node:'pinit',chip:L('p = 1'),note:L('Start with pass <b>p = 1</b>.'),arr:[...a]});
  for(let p=1;;p++){const go=p<=n-1;
   E.push({line:0,node:'pcheck',chip:go?L(`pass ${p} of ${n-1}`):L('loop ends'),note:go?L(`Is p = ${p} ≤ n − 1 = ${n-1}? Yes: pass <b>${p}</b> compares positions 0 to ${n-1-p} with their right neighbours.`):L(`Is p = ${p} ≤ n − 1 = ${n-1}? No: every pass is done.`),arr:[...a],sortedFrom:go?n-p+1:0});
   if(!go)break;
   E.push({line:1,node:'iinit',chip:L('i = 0'),note:L('Start this pass at the left end: <b>i = 0</b>.'),arr:[...a],sortedFrom:n-p+1,ptr:{i:0}});
   for(let i=0;;i++){const more=i<=n-1-p;
    E.push({line:1,node:'icheck',chip:more?L(`i = ${i}`):L(`pass ${p} done`),note:more?L(`Is i = ${i} ≤ n − 1 − p = ${n-1-p}? Yes, so compare a[${i}] and a[${i+1}].`):L(`Is i = ${i} ≤ n − 1 − p = ${n-1-p}? No: this pass is over.`),arr:[...a],sortedFrom:n-p+1,ptr:more?{i}:{}});
    if(!more)break;const gt=a[i]>a[i+1];
    E.push({line:2,node:'cmp',chip:L(`${a[i]} > ${a[i+1]}? ${gt?'yes':'no'}`),note:gt?L(`Compare a[${i}] = ${a[i]} with a[${i+1}] = ${a[i+1]}: ${a[i]} &gt; ${a[i+1]}, so they are out of order.`):L(`Compare a[${i}] = ${a[i]} with a[${i+1}] = ${a[i+1]}: already in order.`),arr:[...a],cmp:[i,i+1],sortedFrom:n-p+1,ptr:{i},row:[p,i,a[i],a[i+1],gt?L('swap'):'—'],ask:{q:L(`Will a[${i}] = ${a[i]} and a[${i+1}] = ${a[i+1]} be swapped?`),options:L(['Swap','No swap']),answer:gt?0:1,why:gt?L(`${a[i]} is bigger than ${a[i+1]}.`):L(`${a[i]} is not bigger than ${a[i+1]}.`)}});
    if(gt){[a[i],a[i+1]]=[a[i+1],a[i]];E.push({line:3,node:'swap',chip:L('swap'),note:L(`Swap: now a[${i}] = ${a[i]} and a[${i+1}] = ${a[i+1]}.`),arr:[...a],swapped:[i,i+1],cmp:[i,i+1],sortedFrom:n-p+1,ptr:{i}});}
    E.push({line:1,node:'inc',chip:L(`i = ${i+1}`),note:L(`Move to the next pair: <b>i = ${i+1}</b>.`),arr:[...a],sortedFrom:n-p+1,ptr:{i:i+1}});}
   E.push({line:0,node:'pinc',chip:L(`p = ${p+1}`),note:L(`End of pass ${p}: <b>${a[n-p]}</b> has reached its final place. Next, <b>p = ${p+1}</b>.`),arr:[...a],sortedFrom:n-p});}
  E.push({line:4,node:'done',note:L(`The list is sorted after ${total} comparison${total===1?'':'s'}.`),arr:[...a],sortedFrom:0,done:true});return E;}
};

/* ---------------- #4 Insertion sort ---------------- */
const insertion={num:4,id:'insertion-sort',level:L('Middle school'),kind:'list',
 name:L('Insertion sort'),
 problem:L('Sort a list by taking each item in turn and sliding it left into its place among the items before it, which are already sorted.'),
 pseudo:L(['for i from 1 to n − 1:','    key ← a[i],  j ← i − 1','    while j ≥ 0 and a[j] > key:','        a[j + 1] ← a[j],  j ← j − 1','    a[j + 1] ← key','the list is sorted']),
 flow:{w:490,h:500,nodes:[term('start',215,24,90,30,L('Start')),proc('init',215,78,90,30,'i ← 1'),dec('icheck',215,152,150,58,Q('i < n')),proc('take',215,226,200,32,'key ← a[i], j ← i − 1'),dec('wcheck',215,312,240,66,L('j ≥ 0 and a[j] > key ?')),proc('shift',215,402,220,32,'a[j+1] ← a[j], j ← j − 1'),proc('place',415,402,130,32,'a[j+1] ← key'),proc('inc',415,470,110,30,'i ← i + 1'),term('done',62,152,96,30,L('sorted'))],
  edges:[['start','init',[[215,39],[215,63]]],['init','icheck',[[215,93],[215,123]]],['icheck','take',[[215,181],[215,210]],YES,[223,198]],['icheck','done',[[140,152],[110,152]],NO,[118,144]],['take','wcheck',[[215,242],[215,279]]],['wcheck','shift',[[215,345],[215,386]],YES,[223,368]],['wcheck','place',[[335,312],[415,312],[415,386]],NO,[345,304]],['shift','wcheck',[[105,402],[70,402],[70,262],[215,262],[215,279]]],['place','inc',[[415,418],[415,455]]],['inc','icheck',[[470,470],[482,470],[482,108],[215,108],[215,123]]]]},
 code:{
  python:{lines:['def insertion_sort(a):','    for i in range(1, len(a)):','        key = a[i]','        j = i - 1','        while j >= 0 and a[j] > key:','            a[j + 1] = a[j]','            j -= 1','        a[j + 1] = key','    return a'],map:[[2],[3,4],[5],[6,7],[8],[9]]},
  java:{lines:['static void insertionSort(int[] a) {','    for (int i = 1; i < a.length; i++) {','        int key = a[i];','        int j = i - 1;','        while (j >= 0 && a[j] > key) {','            a[j + 1] = a[j];','            j--;','        }','        a[j + 1] = key;','    }','}'],map:[[2],[3,4],[5],[6,7],[9],[11]]},
  matlab:{lines:['function a = insertion_sort(a)','    for i = 2:numel(a)','        key = a(i);','        j = i - 1;','        while j >= 1 && a(j) > key','            a(j + 1) = a(j);','            j = j - 1;','        end','        a(j + 1) = key;','    end','end'],map:[[2],[3,4],[5],[6,7],[9],[11]]}},
 teach:[
  {step:L('Take the items one at a time, starting from the second.'),python:L('range(1, len(a)) gives 1, …, n − 1.'),java:L('i starts at 1: a single item is already sorted.'),matlab:L('MATLAB counts from 1, so start at 2.')},
  {step:L('Hold the item aside as key, and look at the item just before it.'),python:L('key keeps the value safe while other items move into its place.'),java:L('Two local variables: key and j.'),matlab:L('The same two variables in MATLAB.')},
  {step:L('While there is an item to the left and it is bigger than key, keep going.'),python:L('and checks j >= 0 first, so a[j] is never read at position −1.'),java:L('&& stops at the first false condition.'),matlab:L('&& also stops early in MATLAB; positions start at 1, so the test is j >= 1.')},
  {step:L('Shift that bigger item one place to the right and step left.'),python:L('j -= 1 is short for j = j - 1.'),java:L('j-- subtracts 1 from j.'),matlab:L('MATLAB writes j = j - 1.')},
  {step:L('Put key into the gap.'),python:L('The gap is at j + 1, just right of the last item that stayed.'),java:L('The same position in Java.'),matlab:L('The same position in MATLAB.')},
  {step:L('After the last item the list is sorted.'),python:L('Return the list so the caller can use it.'),java:L('The array was sorted in place, without a copy.'),matlab:L('The function returns the sorted a.')}],
 defaults:{list:[6,2,5,1,4,3]},
 trace:L(['i','key','j','a[j]','Action']),
 gen(a0,_,rnd=Math.random){const a=[...a0],n=a.length,E=[];const shifts=insertionCounts(a0).shifts;
  E.push({line:-1,node:'start',note:L(`Sort a list of ${n} items.`),arr:[...a],ask:shuffle({q:L('Before you start: how many times will an item be shifted one place to the right?'),options:nums(uniq([shifts,n-1,n*(n-1)/2,0])),answer:0,why:shifts===0?L('No pair of items is in the wrong order, so nothing shifts.'):L(`Each pair of items in the wrong order causes one shift: ${shifts===1?'there is 1 such pair':`there are ${shifts} such pairs`}.`)},rnd)});
  E.push({line:0,node:'init',chip:L('i = 1'),note:L('A single item is already sorted, so start with the second one: <b>i = 1</b>.'),arr:[...a],sortedTo:1,ptr:{i:1}});
  for(let i=1;;i++){const go=i<n;
   E.push({line:0,node:'icheck',chip:go?L(`item ${i+1} of ${n}`):L('loop ends'),note:go?L(`Is i = ${i} &lt; n = ${n}? Yes: insert a[${i}] = ${a[i]} into the sorted part.`):L(`Is i = ${i} &lt; n = ${n}? No: every item has been inserted.`),arr:[...a],sortedTo:go?i:n,ptr:go?{i}:{}});
   if(!go)break;const key=a[i];let j=i-1;
   E.push({line:1,node:'take',chip:L(`key = ${key}`),note:L(`Take <b>key = a[${i}] = ${key}</b>. The ${i} item${i===1?'':'s'} before it ${i===1?'is':'are'} already sorted.`),arr:[...a],sortedTo:i,ptr:{j},aside:key,hole:i});
   for(;;){
    if(j<0){E.push({line:2,node:'wcheck',chip:L('j = −1'),note:L('j = −1: we reached the start of the list, so the loop stops.'),arr:[...a],sortedTo:i+1,aside:key,hole:0,row:[i,key,j,'—',L('stop: start of list')]});break;}
    const big=a[j]>key;
    E.push({line:2,node:'wcheck',chip:L(`${a[j]} > ${key}? ${big?'yes':'no'}`),note:L(`Is a[${j}] = ${a[j]} bigger than key = ${key}? <b>${big?'Yes':'No'}</b>.`),arr:[...a],sortedTo:i+1,ptr:{j},cmp:[j],aside:key,hole:j+1,row:[i,key,j,a[j],big?L('shift'):L('stop')],ask:{q:L(`Will a[${j}] = ${a[j]} move one place right?`),options:yesNo,answer:big?0:1,why:big?L(`${a[j]} is bigger than key = ${key}, so it moves right.`):L(`${a[j]} is not bigger than key = ${key}, so key goes just after it.`)}});
    if(!big)break;a[j+1]=a[j];
    E.push({line:3,node:'shift',chip:L(`j = ${j-1}`),note:L(`Shift ${a[j]} right into position ${j+1}; now <b>j = ${j-1}</b>.`),arr:[...a],sortedTo:i+1,swapped:[j+1],ptr:{j:j-1},aside:key,hole:j});j--;}
   a[j+1]=key;
   E.push({line:4,node:'place',chip:L(`a[${j+1}] = ${key}`),note:L(`Put key = ${key} into position ${j+1}. The first ${i+1} items are now sorted.`),arr:[...a],sortedTo:i+1,hit:[j+1]});
   E.push({line:0,node:'inc',chip:L(`i = ${i+1}`),note:L(`Move on to the next item: <b>i = ${i+1}</b>.`),arr:[...a],sortedTo:i+1,ptr:i+1<n?{i:i+1}:{}});}
  E.push({line:5,node:'done',note:L(`The list is sorted. Shifts made: ${shifts}.`),arr:[...a],sortedTo:n,done:true});return E;}
};

/* ---------------- #5 Euclid's algorithm ---------------- */
const euclid={num:5,id:'euclid',level:L('Middle school'),kind:'pair',
 name:L('Euclid’s algorithm'),
 problem:L('Find the greatest common divisor of two whole numbers. Replace the pair (a, b) with (b, a mod b) until the second number is 0.'),
 pseudo:L(['while b ≠ 0:','    r ← a mod b','    a ← b,  b ← r','return a']),
 flow:{w:380,h:300,nodes:[term('start',150,24,90,30,L('Start')),dec('check',150,100,140,58,Q('b ≠ 0')),proc('rem',150,180,130,32,'r ← a mod b'),proc('move',150,250,140,32,'a ← b, b ← r'),term('done',315,100,110,30,L('return a'))],
  edges:[['start','check',[[150,39],[150,71]]],['check','rem',[[150,129],[150,164]],YES,[158,150]],['check','done',[[220,100],[260,100]],NO,[228,92]],['rem','move',[[150,196],[150,234]]],['move','check',[[80,250],[30,250],[30,58],[150,58],[150,71]]]]},
 code:{
  python:{lines:['def gcd(a, b):','    while b != 0:','        r = a % b','        a, b = b, r','    return a'],map:[[2],[3],[4],[5]]},
  java:{lines:['static int gcd(int a, int b) {','    while (b != 0) {','        int r = a % b;','        a = b;','        b = r;','    }','    return a;','}'],map:[[2],[3],[4,5],[7]]},
  matlab:{lines:['function a = euclid_gcd(a, b)','    while b ~= 0','        r = mod(a, b);','        a = b;','        b = r;','    end','end'],map:[[2],[3],[4,5],[7]]}},
 teach:[
  {step:L('Repeat while the second number is not 0.'),python:L('!= means “is not equal to”.'),java:L('while (b != 0) { … }'),matlab:L('MATLAB writes “not equal” as ~=.')},
  {step:L('Divide a by b and keep the remainder.'),python:L('% gives the remainder: 48 % 18 is 12.'),java:L('% gives the remainder for positive ints.'),matlab:L('mod(a, b) gives the remainder.')},
  {step:L('The pair (b, remainder) has the same common divisors as (a, b): move on to it.'),python:L('Python can update both at once: a, b = b, r.'),java:L('Two separate assignments; r keeps the remainder so nothing is lost.'),matlab:L('Two separate assignments, as in Java.')},
  {step:L('When the remainder reaches 0, a is the greatest common divisor.'),python:L('return a hands back the answer.'),java:L('return a; ends the method.'),matlab:L('MATLAB has its own gcd, so this function is named euclid_gcd. The output variable a is returned when it ends.')}],
 defaults:{a:252,b:105},
 trace:L(['Step','a','b','a mod b']),
 gen(_l,_t,rnd=Math.random,pair){let [a,b]=pair;const E=[];const steps=euclidSteps(a,b);
  const cells=(r)=>({arr:[a,b,r==null?'—':r],labels:['a','b','r']});
  E.push({line:-1,node:'start',note:L(`Find the greatest common divisor of ${a} and ${b}.`),...cells(null),ask:shuffle({q:L('Before you start: how many times will a mod b be computed?'),options:nums(uniq([steps,Math.max(a,b),Math.min(a,b),1])),answer:0,why:L(`Each remainder is smaller than the number it divides by, so the pair shrinks quickly: it takes ${steps} remainder step${steps===1?'':'s'}.`)},rnd)});
  let k=0;
  for(;;){const go=b!==0;
   E.push({line:0,node:'check',chip:go?L(`step ${k+1}`):L('b = 0'),note:go?L(`Is b = ${b} ≠ 0? Yes, so divide again.`):L('b = 0, so the loop stops.'),...cells(null),cmp:[1],ask:k?{q:L(`b is now ${b}. Will the loop run again?`),options:yesNo,answer:go?0:1,why:go?L(`b = ${b} is not 0.`):L('b is 0: nothing is left to divide by.')}:null});
   if(!go)break;const r=a%b;k++;
   E.push({line:1,node:'rem',chip:L(`${a} mod ${b} = ${r}`),note:L(`${a} = ${Math.floor(a/b)} × ${b} + ${r}, so <b>r = ${r}</b>.`),...cells(r),cmp:[2],row:[k,a,b,r],ask:shuffle({q:L(`What is ${a} mod ${b}?`),options:nums(uniq([r,a-b,Math.floor(a/b),r+1])),answer:0,why:L(`${b} fits into ${a} ${Math.floor(a/b)} time${Math.floor(a/b)===1?'':'s'}, leaving ${r}.`)},rnd)});
   const swapOnly=r===a;a=b;b=r;
   E.push({line:2,node:'move',chip:L(`(${a}, ${b})`),note:swapOnly?L(`${b} was smaller than ${a}, so ${b} mod ${a} = ${b}: this step only swaps the two numbers. Now <b>a = ${a}</b>, <b>b = ${b}</b>.`):L(`Move on to the smaller pair: <b>a = ${a}</b>, <b>b = ${b}</b>.`),...cells(null),swapped:[0,1]});}
  E.push({line:3,node:'done',note:L(`Return <b>${a}</b>: the greatest common divisor, after ${k} remainder step${k===1?'':'s'}.`),...cells(null),hit:[0],done:true});return E;}
};

/* ---------------- #6 Binary search ---------------- */
const pl=(n,one,many)=>n===1?one:many;
function binaryRun(a,t){let low=0,high=a.length-1,checks=0;while(low<=high){const mid=Math.floor((low+high)/2);checks++;if(a[mid]===t)return{index:mid,checks};if(a[mid]<t)low=mid+1;else high=mid-1;}return{index:-1,checks};}
const binary={num:6,id:'binary-search',level:L('High school'),kind:'search',sorted:true,
 name:L('Binary search'),
 problem:L('Find a target in a sorted list by checking the middle item and keeping only the half that can still hold it. If the target is not there, answer −1.'),
 pseudo:L(['low ← 0,  high ← n − 1','while low ≤ high:','    mid ← ⌊(low + high) / 2⌋','    if a[mid] = target: return mid','    if a[mid] < target: low ← mid + 1','    else: high ← mid − 1','return −1']),
 flow:{w:520,h:520,nodes:[term('start',250,24,90,30,L('Start')),proc('init',250,78,210,32,'low ← 0, high ← n − 1'),dec('check',250,154,170,58,Q('low ≤ high')),term('notfound',70,154,112,32,L('return −1')),proc('mid',250,230,210,32,'mid ← ⌊(low + high) / 2⌋'),dec('eq',250,306,200,60,Q('a[mid] = target')),term('found',70,306,112,32,L('return mid')),dec('lt',250,396,180,60,Q('a[mid] < target')),proc('lo',400,480,140,32,'low ← mid + 1'),proc('hi',100,480,150,32,'high ← mid − 1')],
  edges:[['start','init',[[250,39],[250,62]]],['init','check',[[250,94],[250,125]]],['check','mid',[[250,183],[250,214]],YES,[258,202]],['check','notfound',[[165,154],[126,154]],NO,[136,146]],['mid','eq',[[250,246],[250,276]]],['eq','found',[[150,306],[126,306]],YES,[130,298]],['eq','lt',[[250,336],[250,366]],NO,[258,354]],['lt','lo',[[340,396],[400,396],[400,464]],YES,[348,388]],['lt','hi',[[160,396],[100,396],[100,464]],NO,[118,388]],['lo','check',[[470,480],[505,480],[505,116],[250,116],[250,125]]],['hi','check',[[100,496],[100,510],[505,510],[505,116],[250,116],[250,125]]]]},
 code:{
  python:{lines:['def binary_search(a, target):','    low, high = 0, len(a) - 1','    while low <= high:','        mid = (low + high) // 2','        if a[mid] == target:','            return mid','        if a[mid] < target:','            low = mid + 1','        else:','            high = mid - 1','    return -1'],map:[[2],[3],[4],[5,6],[7,8],[9,10],[11]]},
  java:{lines:['static int binarySearch(int[] a, int target) {','    int low = 0, high = a.length - 1;','    while (low <= high) {','        int mid = low + (high - low) / 2;','        if (a[mid] == target) {','            return mid;','        }','        if (a[mid] < target) {','            low = mid + 1;','        } else {','            high = mid - 1;','        }','    }','    return -1;','}'],map:[[2],[3],[4],[5,6],[8,9],[10,11],[14]]},
  matlab:{lines:['function idx = binary_search(a, target)','    idx = -1;','    low = 1; high = numel(a);','    while low <= high','        mid = floor((low + high) / 2);','        if a(mid) == target','            idx = mid;','            return','        end','        if a(mid) < target','            low = mid + 1;','        else','            high = mid - 1;','        end','    end','end'],map:[[3],[4],[5],[6,7,8],[10,11],[12,13],[2,16]]}},
 teach:[
  {step:L('At first the target can be anywhere: from the first position to the last.'),python:L('Python can set two variables at once.'),java:L('Two int variables in one declaration.'),matlab:L('MATLAB positions run from 1 to numel(a).')},
  {step:L('Keep going while the range still holds at least one item.'),python:L('When low passes high, the range is empty.'),java:L('The same test in Java.'),matlab:L('The same test in MATLAB.')},
  {step:L('Look at the middle of the range.'),python:L('// divides and rounds down.'),java:L('low + (high − low) / 2 gives the same middle, but never overflows for very large arrays.'),matlab:L('floor rounds down.')},
  {step:L('If the middle item is the target, you are done.'),python:L('return ends the search at once.'),java:L('return mid; ends the method.'),matlab:L('Store the answer in idx, then return.')},
  {step:L('If it is smaller, the target can only be to its right: move low past mid.'),python:L('mid itself is ruled out, so low becomes mid + 1.'),java:L('The same update in Java.'),matlab:L('The same update in MATLAB.')},
  {step:L('Otherwise it can only be to the left: move high before mid.'),python:L('else covers the case a[mid] > target.'),java:L('} else { covers the case a[mid] > target.'),matlab:L('else covers the case a(mid) > target.')},
  {step:L('If the range becomes empty, the target is not in the list.'),python:L('Reached only when the loop ends without a match.'),java:L('Reached only when the loop ends without a match.'),matlab:L('idx was set to −1 at the start and was never changed.')}],
 defaults:{list:[2,5,8,12,16,23,38,56,72,91],target:23},
 trace:L(['Round','low','high','mid','a[mid]','Next']),
 gen(a,t,rnd=Math.random){const E=[],n=a.length,checks=binaryRun(a,t).checks;
  E.push({line:-1,node:'start',note:L(`Search for ${t} in a list of ${n} items by halving the range.`),ask:shuffle({q:L('Before you start: how many rounds will it take? Each round chooses a new mid.'),options:nums(uniq([checks,n,Math.ceil(n/2),1])),answer:0,why:L(`Each round throws away about half of what is left, so ${checks} ${pl(checks,'round is','rounds are')} enough for ${n} items here.`)},rnd)});
  let low=0,high=n-1;const dim=()=>a.map((_,i)=>i).filter(i=>i<low||i>high);
  E.push({line:0,node:'init',chip:L(`low = 0, high = ${high}`),note:L(`The target could be anywhere: <b>low = 0</b>, <b>high = ${high}</b>.`),ptr:{low,high}});
  for(;;){const go=low<=high,left=high-low+1;
   E.push({line:1,node:'check',chip:go?L(`${left} left`):L('nothing left'),note:go?L(`Is low = ${low} ≤ high = ${high}? Yes: ${pl(left,'1 item','the '+left+' items')} from ${low} to ${high} can still hold ${t}.`):L(`Is low = ${low} ≤ high = ${high}? No: no item is left to check.`),ptr:go?{low,high}:{},dim:dim()});
   if(!go)break;const mid=Math.floor((low+high)/2),half=(low+high)/2;
   E.push({line:2,node:'mid',chip:L(`mid = ${mid}`),note:L(`mid = ⌊(${low} + ${high}) / 2⌋ = <b>${mid}</b>.`),ptr:{low,mid,high},dim:dim(),ask:shuffle({q:L(`low = ${low} and high = ${high}. What is mid?`),options:nums(uniq([mid,mid+1,low+high])),answer:0,why:L(`(${low} + ${high}) / 2 = ${half}${Number.isInteger(half)?'':', rounded down to '+mid}.`)},rnd)});
   const eq=a[mid]===t,lt=a[mid]<t,act=eq?L('found'):lt?L('right half'):L('left half');
   E.push({line:3,node:'eq',chip:L(`${a[mid]} = ${t}? ${eq?'yes':'no'}`),note:L(`Is a[${mid}] = ${a[mid]} equal to ${t}? <b>${eq?'Yes':'No'}</b>.`),cmp:[mid],ptr:{low,mid,high},dim:dim(),row:[low,high,mid,a[mid],act]});
   if(eq){E.push({line:3,node:'found',note:L(`Return <b>${mid}</b>: ${t} is at position ${mid}.`),hit:[mid],ptr:{mid},dim:dim(),done:true});return E;}
   E.push({line:4,node:'lt',chip:L(`${a[mid]} < ${t}? ${lt?'yes':'no'}`),note:lt?L(`a[${mid}] = ${a[mid]} is smaller than ${t}, so ${t} can only be to the right of mid.`):L(`a[${mid}] = ${a[mid]} is bigger than ${t}, so ${t} can only be to the left of mid.`),cmp:[mid],ptr:{low,mid,high},dim:dim(),
    ask:{q:L(`a[${mid}] = ${a[mid]} is not ${t}. Where can ${t} still be?`),options:L(['Right of mid','Left of mid']),answer:lt?0:1,why:lt?L(`In a sorted list, everything left of mid is at most ${a[mid]}, which is smaller than ${t}.`):L(`In a sorted list, everything right of mid is at least ${a[mid]}, which is bigger than ${t}.`)}});
   if(lt){low=mid+1;E.push({line:4,node:'lo',chip:L(`low = ${low}`),note:L(`Discard mid and everything left of it: <b>low = ${low}</b>.`),ptr:{low,high},dim:dim()});}
   else{high=mid-1;E.push({line:5,node:'hi',chip:L(`high = ${high}`),note:L(`Discard mid and everything right of it: <b>high = ${high}</b>.`),ptr:{low,high},dim:dim()});}}
  E.push({line:6,node:'notfound',note:L(`Return <b>−1</b>: ${t} is not in the list. Rounds: ${checks}.`),dim:a.map((_,i)=>i),done:true});return E;}
};

/* ---------------- #7 Merge sort (bottom-up) ---------------- */
const span=(x,y)=>x===y?L(`position ${x}`):L(`positions ${x} to ${y}`);
function mergeCounts(a0,o={}){const a=[...a0],n=a.length;let comps=0;
 for(let width=1;width<n;width*=2)for(let left=0;left<n;left+=2*width){const m=Math.min(left+width,n),e=Math.min(left+2*width,n);
  if(o.skip&&m<e){comps++;if(a[m-1]<=a[m])continue;}
  let i=left,j=m;const out=[];
  if(o.firstOnly){if(i<m&&j<e){comps++;if(a[i]<=a[j]){out.push(...a.slice(i,m),...a.slice(j,e));}else{out.push(...a.slice(j,e),...a.slice(i,m));}}else out.push(...a.slice(i,m),...a.slice(j,e));}
  else{while(i<m&&j<e){comps++;out.push(a[i]<=a[j]?a[i++]:a[j++]);}while(i<m)out.push(a[i++]);while(j<e)out.push(a[j++]);}
  for(let k=0;k<out.length;k++)a[left+k]=out[k];}
 return{comps,arr:a,sorted:sorted(a)};}
const merge={num:7,id:'merge-sort',level:L('High school'),kind:'merge',
 name:L('Merge sort'),
 problem:L('Sort a list by merging: single items are sorted runs; merge neighbouring runs in pairs into longer sorted runs, doubling their length each round.'),
 pseudo:L(['width ← 1','while width < n:','    for left from 0 to n − 1, in steps of 2 × width:','        i ← left,  j ← left + width,  out ← empty','        while both runs still have items:','            if a[i] ≤ a[j]: move a[i] to out,  i ← i + 1','            else: move a[j] to out,  j ← j + 1','        move what is left to out;  copy out back into a','    width ← 2 × width','the list is sorted']),
 flow:{w:620,h:640,nodes:[term('start',300,24,90,30,L('Start')),proc('winit',300,72,110,30,'width ← 1'),dec('wcheck',300,136,170,54,Q('width < n')),term('done',500,136,110,30,L('sorted')),proc('linit',300,200,110,30,'left ← 0'),dec('lcheck',300,264,170,54,Q('left < n')),proc('winc',100,264,170,30,'width ← 2 × width'),proc('take',300,330,260,30,'i ← left, j ← left + width'),dec('both',300,404,300,60,L('items in both runs ?')),proc('rest',510,470,190,30,L('rest → out; out → a')),dec('cmp',300,490,170,56,Q('a[i] ≤ a[j]')),proc('ti',120,560,190,30,'out ← a[i], i ← i + 1'),proc('tj',300,600,190,30,'out ← a[j], j ← j + 1'),proc('linc',510,540,190,30,'left ← left + 2 × width')],
  edges:[['start','winit',[[300,39],[300,57]]],['winit','wcheck',[[300,87],[300,109]]],['wcheck','linit',[[300,163],[300,185]],YES,[308,177]],['wcheck','done',[[385,136],[445,136]],NO,[395,128]],['linit','lcheck',[[300,215],[300,237]]],['lcheck','take',[[300,291],[300,315]],YES,[308,305]],['lcheck','winc',[[215,264],[185,264]],NO,[190,256]],['winc','wcheck',[[100,249],[100,104],[300,104],[300,109]]],['take','both',[[300,345],[300,374]]],['both','cmp',[[300,434],[300,462]],YES,[308,450]],['both','rest',[[450,404],[510,404],[510,455]],NO,[458,396]],['cmp','ti',[[215,490],[120,490],[120,545]],YES,[180,482]],['cmp','tj',[[300,518],[300,585]],NO,[308,550]],['ti','both',[[25,560],[12,560],[12,368],[300,368],[300,374]]],['tj','both',[[205,600],[12,600],[12,368],[300,368],[300,374]]],['rest','linc',[[510,485],[510,525]]],['linc','lcheck',[[605,540],[612,540],[612,230],[300,230],[300,237]]]]},
 code:{
  python:{lines:['def merge_sort(a):','    n = len(a)','    width = 1','    while width < n:','        for left in range(0, n, 2 * width):','            mid, end = min(left + width, n), min(left + 2 * width, n)','            i, j, out = left, mid, []','            while i < mid and j < end:','                if a[i] <= a[j]:','                    out.append(a[i])','                    i += 1','                else:','                    out.append(a[j])','                    j += 1','            out += a[i:mid] + a[j:end]','            a[left:end] = out','        width *= 2','    return a'],map:[[3],[4],[5],[6,7],[8],[9,10,11],[12,13,14],[15,16],[17],[18]]},
  java:{lines:['static void mergeSort(int[] a) {','    int n = a.length;','    for (int width = 1; width < n; width *= 2) {','        for (int left = 0; left < n; left += 2 * width) {','            int mid = Math.min(left + width, n), end = Math.min(left + 2 * width, n);','            int i = left, j = mid, k = 0;','            int[] out = new int[end - left];','            while (i < mid && j < end) {','                if (a[i] <= a[j]) {','                    out[k++] = a[i++];','                } else {','                    out[k++] = a[j++];','                }','            }','            while (i < mid) out[k++] = a[i++];','            while (j < end) out[k++] = a[j++];','            System.arraycopy(out, 0, a, left, out.length);','        }','    }','}'],map:[[3],[3],[4],[5,6,7],[8],[9,10],[11,12],[15,16,17],[3],[20]]},
  matlab:{lines:['function a = merge_sort(a)','    % a is a row vector, such as [5 3 8].','    n = numel(a);','    width = 1;','    while width < n','        for left = 1:2*width:n','            mid = min(left + width, n + 1);','            stop = min(left + 2*width, n + 1);','            i = left; j = mid; out = [];','            while i < mid && j < stop','                if a(i) <= a(j)','                    out(end+1) = a(i); i = i + 1;','                else','                    out(end+1) = a(j); j = j + 1;','                end','            end','            out = [out, a(i:mid-1), a(j:stop-1)];','            a(left:stop-1) = out;','        end','        width = 2 * width;','    end','end'],map:[[4],[5],[6],[7,8,9],[10],[11,12],[13,14],[17,18],[20],[22]]}},
 teach:[
  {step:L('Start with runs of one item: one item is always sorted.'),python:L('width is the length of the runs being merged.'),java:L('The outer for loop starts width at 1.'),matlab:L('MATLAB positions start at 1, but width still starts at 1.')},
  {step:L('Keep merging while one run does not yet hold the whole list.'),python:L('The loop ends once width reaches n.'),java:L('The test width < n is part of the for header.'),matlab:L('The same test in MATLAB.')},
  {step:L('Take the runs in pairs: left marks where each pair starts.'),python:L('range(0, n, 2 * width) jumps two runs at a time.'),java:L('left grows by 2 × width each time.'),matlab:L('1:2*width:n jumps two runs at a time.')},
  {step:L('Point i at the start of the left run and j at the start of the right run; out is empty.'),python:L('min(…, n) stops the last runs at the end of the list.'),java:L('Math.min stops the runs at the end of the array.'),matlab:L('stop is one past the end of the right run, because end is a MATLAB keyword.')},
  {step:L('Merge while both runs still have items.'),python:L('and needs both conditions to hold.'),java:L('&& needs both conditions to hold.'),matlab:L('&& needs both conditions to hold.')},
  {step:L('If the left front item is not bigger, it goes next. On a tie the left item goes first, which keeps equal items in order.'),python:L('append adds to the end of out.'),java:L('out[k++] = a[i++] copies, then moves both counters on by one.'),matlab:L('out(end+1) adds to the end of out.')},
  {step:L('Otherwise the right front item goes next.'),python:L('The same two lines with j.'),java:L('The same copy with j.'),matlab:L('The same lines with j.')},
  {step:L('One run is used up: the rest of the other is already sorted, so it goes to out as it is. Then out replaces the pair in a.'),python:L('Slices copy the rest in one line; a[left:end] = out writes it back.'),java:L('Two short loops copy the rest; System.arraycopy writes out back.'),matlab:L('[out, …] joins the rest; a(left:stop-1) = out writes it back.')},
  {step:L('Every run is now twice as long.'),python:L('width *= 2 is short for width = width * 2.'),java:L('width *= 2 runs at the end of each pass of the outer for.'),matlab:L('MATLAB writes width = 2 * width.')},
  {step:L('When one run holds every item, the list is sorted.'),python:L('Return the list so the caller can use it.'),java:L('The array was sorted in place, so nothing is returned.'),matlab:L('The function returns the sorted a.')}],
 defaults:{list:[38,27,43,3,9,82,10,5]},
 trace:L(['Comparison','width','a[i]','a[j]','To out']),
 gen(a0,_,rnd=Math.random){const a=[...a0],n=a.length,E=[],total=mergeCounts(a0).comps;
  E.push({line:-1,node:'start',note:L(`Sort a list of ${n} items by merging runs.`),arr:[...a],runs:1,ask:shuffle({q:L(`Before you start: how many comparisons will merge sort make on these ${n} items?`),options:nums(uniq([total,n*(n-1)/2,n-1,n*Math.ceil(Math.log2(n))+1])),answer:0,why:L(`Each comparison sends one item to out, and the items left at the end of a merge move without one. Here that makes ${total} ${pl(total,'comparison','comparisons')}.`)},rnd)});
  E.push({line:0,node:'winit',chip:L('width = 1'),note:L('Start with runs of length 1: a single item is already a sorted run.'),arr:[...a],runs:1});
  for(let width=1;;width*=2){const go=width<n;
   E.push({line:1,node:'wcheck',chip:go?L(`width = ${width}`):L('loop ends'),note:go?L(`Is width = ${width} &lt; n = ${n}? Yes: merge the runs of length ${width} in pairs.`):L(`Is width = ${width} &lt; n = ${n}? No: one run holds every item.`),arr:[...a],runs:go?width:n});
   if(!go)break;
   E.push({line:2,node:'linit',chip:L('left = 0'),note:L('Begin with the first pair of runs: <b>left = 0</b>.'),arr:[...a],runs:width});
   for(let left=0;;left+=2*width){const more=left<n;
    E.push({line:2,node:'lcheck',chip:more?L(`left = ${left}`):L('round done'),note:more?L(`Is left = ${left} &lt; n = ${n}? Yes: work on positions ${left} to ${Math.min(left+2*width,n)-1}.`):L(`Is left = ${left} &lt; n = ${n}? No: every pair of runs of length ${width} is merged.`),arr:[...a],runs:width,range:more?[left,Math.min(left+2*width,n)]:null});
    if(!more)break;const m=Math.min(left+width,n),e=Math.min(left+2*width,n);let i=left,j=m;const out=[];
    E.push({line:3,node:'take',chip:L(`i = ${i}, j = ${j}`),note:m<e?L(`Left run: ${span(left,m-1).en}. Right run: ${span(m,e-1).en}. Start with <b>i = ${i}</b> and <b>j = ${j}</b>.`):L(`Only one run is left (${span(left,e-1).en}); it has no partner this round.`),arr:[...a],runs:width,range:[left,e],ptr:{i,j},out:[]});
    for(;;){const both=i<m&&j<e;
     E.push({line:4,node:'both',chip:both?L(`${m-i} and ${e-j} left`):L('one run used up'),note:both?L(`Both runs still have items: a[${i}] = ${a[i]} and a[${j}] = ${a[j]} are at the front.`):m<e?L(`The ${i<m?'right':'left'} run is used up, so no more comparisons are needed for this pair.`):L('There is nothing to compare.'),arr:[...a],runs:width,range:[left,e],ptr:{i,j},out:[...out]});
     if(!both)break;const le=a[i]<=a[j];
     E.push({line:5,node:'cmp',chip:L(`${a[i]} ≤ ${a[j]}? ${le?'yes':'no'}`),note:L(`Is a[${i}] = ${a[i]} ≤ a[${j}] = ${a[j]}? <b>${le?'Yes':'No'}</b>.`),arr:[...a],runs:width,range:[left,e],cmp:[i,j],ptr:{i,j},out:[...out],row:[width,a[i],a[j],le?'a[i]':'a[j]'],
      ask:{q:L('Which item goes into out next?'),options:L([`a[i] = ${a[i]}`,`a[j] = ${a[j]}`]),answer:le?0:1,why:le?L(a[i]===a[j]?`They are equal, and on a tie the left item goes first.`:`${a[i]} is smaller than ${a[j]}.`):L(`${a[j]} is smaller than ${a[i]}.`)}});
     if(le){out.push(a[i]);i++;E.push({line:5,node:'ti',chip:L(`i = ${i}`),note:L(`Move ${out.at(-1)} to out; now <b>i = ${i}</b>.`),arr:[...a],runs:width,range:[left,e],ptr:{i,j},out:[...out]});}
     else{out.push(a[j]);j++;E.push({line:6,node:'tj',chip:L(`j = ${j}`),note:L(`Move ${out.at(-1)} to out; now <b>j = ${j}</b>.`),arr:[...a],runs:width,range:[left,e],ptr:{i,j},out:[...out]});}}
    while(i<m)out.push(a[i++]);while(j<e)out.push(a[j++]);for(let k=0;k<out.length;k++)a[left+k]=out[k];
    E.push({line:7,node:'rest',note:L(`The rest goes to out as it is, and out is copied back: ${span(left,e-1).en} now ${left===e-1?'holds':'hold'} one sorted run.`),arr:[...a],runs:width,range:[left,e],out:[...out],hit:Array.from({length:e-left},(_,k)=>left+k)});
    E.push({line:2,node:'linc',chip:L(`left = ${left+2*width}`),note:L(`Next pair: left = ${left} + 2 × ${width} = <b>${left+2*width}</b>.`),arr:[...a],runs:width});}
   E.push({line:8,node:'winc',chip:L(`width = ${2*width}`),note:L(`Every run is now up to ${2*width} items long: <b>width = ${2*width}</b>.`),arr:[...a],runs:2*width});}
  E.push({line:9,node:'done',note:L(`The list is sorted after ${total} ${pl(total,'comparison','comparisons')}.`),arr:[...a],runs:n,sortedFrom:0,done:true});return E;}
};

/* ---------------- #8 Recursion: the Tower of Hanoi ---------------- */
function hanoiMoves(n,from='A',to='C',via='B',out=[]){if(n===0)return out;hanoiMoves(n-1,from,via,to,out);out.push([n,from,to]);hanoiMoves(n-1,via,to,from,out);return out;}
const hanoi={num:8,id:'hanoi',level:L('High school'),kind:'hanoi',
 name:L('Recursion: the Tower of Hanoi'),
 problem:L('Move a stack of disks from peg A to peg C, one disk at a time, never putting a bigger disk on a smaller one. The method calls itself on a smaller stack.'),
 pseudo:L(['hanoi(n, from, to, via):','    if n = 0: return','    hanoi(n − 1, from, via, to)','    move disk n from “from” to “to”','    hanoi(n − 1, via, to, from)','    return']),
 flow:{w:440,h:400,nodes:[term('start',220,24,220,30,'hanoi(n, from, to, via)'),dec('base',220,96,140,54,Q('n = 0')),term('ret',380,96,100,30,L('return')),proc('call1',220,170,250,30,'hanoi(n − 1, from, via, to)'),proc('move',220,236,250,30,L('move disk n: from → to')),proc('call2',220,302,250,30,'hanoi(n − 1, via, to, from)'),term('end',220,368,100,30,L('return'))],
  edges:[['start','base',[[220,39],[220,69]]],['base','ret',[[290,96],[330,96]],YES,[296,88]],['base','call1',[[220,123],[220,155]],NO,[228,142]],['call1','move',[[220,185],[220,221]]],['move','call2',[[220,251],[220,287]]],['call2','end',[[220,317],[220,353]]],
   ['call1','start',[[95,170],[40,170],[40,24],[110,24]],L('call'),[46,96],'dash'],['call2','start',[[95,302],[24,302],[24,24],[110,24]],null,null,'dash']]},
 code:{
  python:{lines:['def hanoi(n, source, target, via, moves):','    if n == 0:','        return','    hanoi(n - 1, source, via, target, moves)','    moves.append((n, source, target))','    hanoi(n - 1, via, target, source, moves)'],map:[[1],[2,3],[4],[5],[6],[]]},
  java:{lines:['// At the top of the file: import java.util.*;','static void hanoi(int n, char from, char to, char via, List<String> moves) {','    if (n == 0) {','        return;','    }','    hanoi(n - 1, from, via, to, moves);','    moves.add(n + " " + from + " " + to);','    hanoi(n - 1, via, to, from, moves);','}'],map:[[2],[3,4],[6],[7],[8],[9]]},
  matlab:{lines:['function moves = hanoi(n, from, to, via, moves)','    if n == 0','        return','    end','    moves = hanoi(n - 1, from, via, to, moves);','    moves(end+1, :) = [n, from, to];','    moves = hanoi(n - 1, via, to, from, moves);','end'],map:[[1],[2,3],[5],[6],[7],[8]]}},
 teach:[
  {step:L('The method receives how many disks to move and the three pegs: where they are, where they go, and the spare one.'),python:L('from is a reserved word in Python, so the listing calls the pegs source and target. moves collects the moves.'),java:L('Pegs are chars such as \'A\'; moves collects the moves as text.'),matlab:L('In MATLAB the pegs are the numbers 1, 2 and 3.')},
  {step:L('Base case: with no disks there is nothing to do. Without it the calls would never stop.'),python:L('return with no value just ends this call.'),java:L('return; ends this call of a void method.'),matlab:L('return ends this call; moves comes back unchanged.')},
  {step:L('Trust the method with one disk fewer: it moves the n − 1 smaller disks out of the way, onto the spare peg.'),python:L('The call passes via as the target and target as the spare.'),java:L('The same call in Java.'),matlab:L('The call returns the longer list of moves.')},
  {step:L('Now disk n is free: move it to its target peg.'),python:L('A tuple (disk, from, to) records the move.'),java:L('The move is stored as text such as "3 A C".'),matlab:L('end+1 adds a row to the moves matrix.')},
  {step:L('Trust it once more: move the n − 1 disks from the spare peg onto disk n.'),python:L('The roles of the pegs change again.'),java:L('The same call in Java.'),matlab:L('The same call in MATLAB.')},
  {step:L('This call is finished; control returns to the call that started it.'),python:L('A Python function returns at its last line.'),java:L('The closing brace ends the method.'),matlab:L('end closes the function, which returns moves.')}],
 defaults:{disks:3},
 trace:L(['Move','disk','from','to']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const N=Math.min(5,Math.max(1,input.disks||3)),E=[],pegs={A:[],B:[],C:[]},stack=[],total=2**N-1;let count=0;for(let d=N;d>=1;d--)pegs.A.push(d);
  const snap=()=>({pegs:{A:[...pegs.A],B:[...pegs.B],C:[...pegs.C]},stack:stack.map(f=>({...f}))});
  E.push({line:-1,node:'start',note:L(`Move ${N} ${pl(N,'disk','disks')} from A to C, using B as the spare peg.`),...snap(),ask:shuffle({q:L(`Before you start: how many moves will ${N} ${pl(N,'disk','disks')} take?`),options:nums(uniq([total,N*N,2*N,2**N])),answer:0,why:L(`Moving n disks takes twice the moves for n − 1 disks, plus one: 1, 3, 7, 15, 31, … that is 2ⁿ − 1 = ${total}.`)},rnd)});
  const call=(n,from,to,via)=>{stack.push({n,from,to,via,line:1});
   E.push({line:1,node:'base',jump:true,chip:L(`hanoi(${n}, ${from}, ${to}, ${via})`),note:n===0?L(`Call hanoi(0, ${from}, ${to}, ${via}). Is n = 0? <b>Yes</b>: there is nothing to move.`):L(`Call hanoi(${n}, ${from}, ${to}, ${via}): move ${n} ${pl(n,'disk','disks')} from ${from} to ${to}. Is n = 0? <b>No</b>.`),...snap()});
   if(n===0){E.push({line:1,node:'ret',note:L('Return to the call that made this one.'),...snap()});stack.pop();return;}
   stack.at(-1).line=2;E.push({line:2,node:'call1',chip:L(`hanoi(${n-1}, ${from}, ${via}, ${to})`),note:n===1?L(`Call hanoi(0, …) first: there is nothing above disk 1.`):L(`First move the ${n-1} ${pl(n-1,'disk','disks')} above disk ${n} onto the spare peg ${via}.`),...snap()});
   call(n-1,from,via,to);
   stack.at(-1).line=3;const others=['A','B','C'].filter(p=>p!==from&&p!==to);
   const ask=shuffle({q:L('Which move comes next?'),options:L([`disk ${n}: ${from} → ${to}`,`disk ${n}: ${from} → ${others[0]}`,`disk ${n}: ${to} → ${from}`]),answer:0,why:L(`Disk ${n} is now free on ${from}, and this call moves it to ${to}.`)},rnd);
   const d=pegs[from].pop();pegs[to].push(d);count++;
   E.push({line:3,node:'move',jump:true,chip:L(`move ${count} of ${total}`),note:L(`Move disk ${d} from ${from} to ${to}.`),...snap(),moved:{disk:d,from,to},row:[d,from,to],ask});
   stack.at(-1).line=4;E.push({line:4,node:'call2',chip:L(`hanoi(${n-1}, ${via}, ${to}, ${from})`),note:n===1?L('Call hanoi(0, …): nothing goes on top of disk 1 here.'):L(`Now move the ${n-1} ${pl(n-1,'disk','disks')} from ${via} onto disk ${n} on ${to}.`),...snap()});
   call(n-1,via,to,from);
   stack.at(-1).line=5;E.push({line:5,node:'end',jump:true,note:L(`hanoi(${n}, ${from}, ${to}, ${via}) is done: ${n} ${pl(n,'disk is','disks are')} now on ${to}.`),...snap()});stack.pop();};
  call(N,'A','C','B');
  const last=E.at(-1);last.done=true;last.note=L(`${last.note.en} All ${N} ${pl(N,'disk is','disks are')} on C after ${total} ${pl(total,'move','moves')}.`);return E;}
};

/* ---------------- Grid mazes for #9 and #10 ---------------- */
// A 5 × 7 grid read row by row: '.' open, '#' wall, '~' mud (open, but costs 3 to enter). S is the top-left cell, G the bottom-right.
const GR=5,GC=7,GN=GR*GC,START=0,GOAL=GN-1;
const DIRS=[['up',-1,0],['right',0,1],['down',1,0],['left',0,-1]];
const DIRL={up:L('up'),right:L('right'),down:L('down'),left:L('left')};
const cellName=i=>`(${Math.floor(i/GC)}, ${i%GC})`;
function parseMaze(s){const m=String(s??'').replace(/[^.#~]/g,'').slice(0,GN).padEnd(GN,'.').split('');m[START]='.';m[GOAL]='.';return m.join('');}
function around(i){const r=Math.floor(i/GC),c=i%GC;return DIRS.map(([dir,dr,dc])=>{const rr=r+dr,cc=c+dc;return[dir,rr>=0&&rr<GR&&cc>=0&&cc<GC?rr*GC+cc:-1];});}
const toGoal=i=>(GR-1-Math.floor(i/GC))+(GC-1-i%GC);
function pathTo(parent,c){const p=[];while(c!==-1){p.push(c);c=parent.get(c);}return p.reverse();}
function bfsRun(maze){const m=parseMaze(maze),parent=new Map([[START,-1]]),queue=[START];let taken=0;
 while(queue.length){const c=queue.shift();taken++;if(c===GOAL)return{found:true,path:pathTo(parent,c),marked:parent.size,taken};
  for(const [,d] of around(c))if(d>=0&&m[d]!=='#'&&!parent.has(d)){parent.set(d,c);queue.push(d);}}
 return{found:false,path:null,marked:parent.size,taken};}
// o.toward: the free neighbour closest to G is taken next. o.only2: look only right and down (a broken change).
function dfsRun(maze,o={}){const m=parseMaze(maze),parent=new Map([[START,-1]]),marked=new Set(),stack=[START];
 while(stack.length){const c=stack.pop();if(marked.has(c))continue;marked.add(c);if(c===GOAL)return{found:true,path:pathTo(parent,c),marked:marked.size};
  let nb=around(c).filter(([,d])=>d>=0&&m[d]!=='#'&&!marked.has(d));
  if(o.only2)nb=nb.filter(([dir])=>dir==='right'||dir==='down');
  if(o.toward)nb=[...nb].sort((x,y)=>toGoal(y[1])-toGoal(x[1]));
  for(const [,d] of nb){parent.set(d,c);stack.push(d);}}
 return{found:false,path:null,marked:marked.size};}
// The cheapest route when mud costs 3 to enter (Dijkstra's method, which #14 will teach).
function cheapest(maze){const m=parseMaze(maze),cost=new Array(GN).fill(Infinity),done=new Array(GN).fill(false);cost[START]=0;
 for(;;){let c=-1;for(let i=0;i<GN;i++)if(!done[i]&&cost[i]<Infinity&&(c<0||cost[i]<cost[c]))c=i;if(c<0)return Infinity;if(c===GOAL)return cost[c];done[c]=true;
  for(const [,d] of around(c))if(d>=0&&m[d]!=='#'){const w=cost[c]+(m[d]==='~'?3:1);if(w<cost[d])cost[d]=w;}}}
const pathCost=(maze,path)=>{const m=parseMaze(maze);return path.slice(1).reduce((s,i)=>s+(m[i]==='~'?3:1),0);};
function randomMaze(rnd=Math.random,walls=.25){let s='';for(let i=0;i<GN;i++)s+=i===START||i===GOAL?'.':rnd()<walls?'#':'.';return s;}
const queueText=q=>q.length?q.map(cellName).join(' '):'—';
function pathAsk(ref,rnd){const opts=ref.found?uniq([ref.path.length-1,ref.path.length+1,toGoal(START)+4]).map(String):['10','12','14'];
 const en=[...opts,'No path'],es=[...opts,'No hay camino'],answer=ref.found?0:3;
 return shuffle({q:L('Before you start: how many steps long will the path from S to G be?'),options:L(en),answer,why:ref.found?L(`The path found has ${ref.path.length-1} steps.`):L('Walls cut G off from S, so there is no path.')},rnd);}
function skippedText(list){if(!list.length)return L('');return L(list.map(x=>x.en).join(' ')+' ');}
const skipNote=(dir,why)=>L(`${DIRL[dir].en[0].toUpperCase()+DIRL[dir].en.slice(1)}: ${why.en}.`);
const WHY_SKIP={out:L('outside the grid'),wall:L('a wall'),marked:L('already marked')};
const DEFAULT_MAZE='....#...##.#.#.#......#.###....#...';
const helpGrid=L('Choose “Edit walls”, then click cells to add or remove walls. S and G stay in their corners.');

/* ---------------- #9 Breadth-first search ---------------- */
const bfs={num:9,id:'bfs',level:L('High school'),kind:'grid',frontier:'queue',
 name:L('Breadth-first search'),
 problem:L('Find a shortest path from S to G in a maze. Explore in rings: first every cell one step away, then two steps away, and so on. A free neighbour is open and not yet marked.'),
 pseudo:L(['mark start;  queue ← [start]','while queue is not empty:','    c ← remove the front of queue','    if c = goal: return the path through parent','    for each free neighbour d of c, in order up, right, down, left:','        mark d;  parent[d] ← c;  add d to the back of queue','return “no path”']),
 flow:{w:520,h:480,nodes:[term('start',260,24,90,30,L('Start')),proc('init',260,74,250,30,L('mark start; queue ← [start]')),dec('qcheck',260,142,210,56,L('queue not empty ?')),term('nopath',450,142,110,30,L('no path')),proc('take',260,212,230,30,L('c ← front of queue')),dec('goal',260,282,150,56,Q('c = goal')),term('found',450,282,130,30,L('return path')),dec('nb',260,370,280,60,L('next free neighbour d ?')),proc('add',260,450,360,30,L('mark d; parent[d] ← c; d → back of queue'))],
  edges:[['start','init',[[260,39],[260,59]]],['init','qcheck',[[260,89],[260,114]]],['qcheck','take',[[260,170],[260,197]],YES,[268,186]],['qcheck','nopath',[[365,142],[395,142]],NO,[370,134]],['take','goal',[[260,227],[260,254]]],['goal','found',[[335,282],[385,282]],YES,[343,274]],['goal','nb',[[260,310],[260,340]],NO,[268,328]],['nb','add',[[260,400],[260,435]],YES,[268,420]],['add','nb',[[80,450],[40,450],[40,370],[120,370]]],['nb','qcheck',[[400,370],[512,370],[512,104],[260,104],[260,114]],NO,[410,362]]]},
 code:{
  python:{lines:['from collections import deque','','def bfs(grid, start, goal):','    parent = {start: None}','    queue = deque([start])','    while queue:','        c = queue.popleft()','        if c == goal:','            return path_to(parent, goal)','        for d in free_neighbours(grid, c, parent):','            parent[d] = c','            queue.append(d)','    return None','','# Helpers. Cells are (row, column); a cell is marked once it has a parent.','def free_neighbours(grid, c, marked):','    r, k = c','    for dr, dk in ((-1, 0), (0, 1), (1, 0), (0, -1)):','        d = (r + dr, k + dk)','        if 0 <= d[0] < len(grid) and 0 <= d[1] < len(grid[0]) and grid[d[0]][d[1]] != "#" and d not in marked:','            yield d','','def path_to(parent, c):','    path = []','    while c is not None:','        path.append(c)','        c = parent[c]','    return path[::-1]'],map:[[4,5],[6],[7],[8,9],[10],[11,12],[13]]},
  java:{lines:['// At the top of the file: import java.util.*;','static List<Integer> bfs(String[] grid, int start, int goal) {','    Map<Integer, Integer> parent = new HashMap<>();','    parent.put(start, -1);','    ArrayDeque<Integer> queue = new ArrayDeque<>();','    queue.add(start);','    while (!queue.isEmpty()) {','        int c = queue.poll();','        if (c == goal) {','            return pathTo(parent, goal);','        }','        for (int d : freeNeighbours(grid, c, parent.keySet())) {','            parent.put(d, c);','            queue.add(d);','        }','    }','    return null;','}','','// Helpers. A cell is the number row × columns + column.','static List<Integer> freeNeighbours(String[] grid, int c, Set<Integer> marked) {','    int rows = grid.length, cols = grid[0].length(), r = c / cols, k = c % cols;','    int[][] steps = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};','    List<Integer> out = new ArrayList<>();','    for (int[] s : steps) {','        int rr = r + s[0], kk = k + s[1], d = rr * cols + kk;','        if (rr >= 0 && rr < rows && kk >= 0 && kk < cols && grid[rr].charAt(kk) != \'#\' && !marked.contains(d)) {','            out.add(d);','        }','    }','    return out;','}','','static List<Integer> pathTo(Map<Integer, Integer> parent, int c) {','    LinkedList<Integer> path = new LinkedList<>();','    for (; c != -1; c = parent.get(c)) path.addFirst(c);','    return path;','}'],map:[[3,4,5,6],[7],[8],[9,10],[12],[13,14],[17]]},
  matlab:{lines:['function path = bfs(walls, start, goal)','    parent = zeros(size(walls));','    parent(start) = start;','    queue = start;','    while ~isempty(queue)','        c = queue(1); queue(1) = [];','        if c == goal','            path = path_to(parent, goal);','            return','        end','        for d = free_neighbours(walls, c, parent ~= 0)','            parent(d) = c;','            queue(end+1) = d;','        end','    end','    path = [];','end','','% Helpers. Save each one as its own file (free_neighbours.m, path_to.m) so dfs.m can use them too.','% Cells are linear indices, counted down each column; walls is true where a wall stands.','function out = free_neighbours(walls, c, marked)','    [r, k] = ind2sub(size(walls), c);','    out = [];','    for s = [-1 0; 0 1; 1 0; 0 -1]\'','        rr = r + s(1); kk = k + s(2);','        if rr >= 1 && rr <= size(walls, 1) && kk >= 1 && kk <= size(walls, 2)','            d = sub2ind(size(walls), rr, kk);','            if ~walls(d) && ~marked(d)','                out(end+1) = d;','            end','        end','    end','end','','function path = path_to(parent, c)','    path = c;','    while parent(c) ~= c','        c = parent(c);','        path = [c, path];','    end','end'],map:[[2,3,4],[5],[6],[7,8,9],[11],[12,13],[16]]}},
 teach:[
  {step:L('Mark the start so it is never added twice, and put it in the queue.'),python:L('A cell counts as marked once it is a key of parent. deque, from the collections module, is a queue.'),java:L('ArrayDeque works as a queue; parent doubles as the set of marked cells.'),matlab:L('parent(start) = start marks the start; 0 means “not marked”.')},
  {step:L('Keep going while some cell is waiting in the queue.'),python:L('An empty deque counts as false.'),java:L('isEmpty() tells whether the queue is empty.'),matlab:L('~isempty(queue) is true while the queue has cells.')},
  {step:L('Take the cell that has waited longest: the front of the queue.'),python:L('popleft() removes from the front.'),java:L('poll() removes from the front.'),matlab:L('queue(1) = [] deletes the front cell.')},
  {step:L('If it is the goal, follow the parents back to S to get the path.'),python:L('path_to walks back from the goal and reverses the list.'),java:L('pathTo puts each cell at the front, so the path reads from S to G.'),matlab:L('path_to stops at the start, whose parent is itself.')},
  {step:L('Look at the neighbours that are open and not yet marked.'),python:L('free_neighbours yields them in the order up, right, down, left.'),java:L('freeNeighbours returns them in the order up, right, down, left.'),matlab:L('The columns of the step matrix are the four directions.')},
  {step:L('Mark each one, remember where it came from, and send it to the back of the queue.'),python:L('Setting parent[d] also marks d.'),java:L('put both marks d and records its parent.'),matlab:L('end+1 adds to the back of the queue.')},
  {step:L('If the queue runs out, G cannot be reached.'),python:L('None means “no path”.'),java:L('null means “no path”.'),matlab:L('An empty path means “no path”.')}],
 defaults:{maze:DEFAULT_MAZE},
 trace:L(['Step','taken','queue after (front first)']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const maze=parseMaze(input.maze),E=[],ref=bfsRun(maze),parent=new Map([[START,-1]]),queue=[START];
  const view=(x={})=>({maze,marked:[...parent.keys()],frontier:[...queue],...x});
  E.push({line:-1,node:'start',note:L('Find a shortest path from S to G, exploring ring by ring.'),...view(),ask:pathAsk(ref,rnd)});
  E.push({line:0,node:'init',chip:L('queue: S'),note:L(`Mark S ${cellName(START)} and put it in the queue.`),...view()});
  for(;;){const go=queue.length>0;
   E.push({line:1,node:'qcheck',chip:go?L(`${queue.length} in queue`):L('queue empty'),note:go?L(`The queue holds ${queue.length} ${pl(queue.length,'cell','cells')}: ${queueText(queue)}.`):L('The queue is empty.'),...view()});
   if(!go)break;
   const ask=queue.length>=2?shuffle({q:L('Which cell comes out of the queue next?'),options:L([...new Set([queue[0],queue.at(-1),queue[1]])].map(cellName)),answer:0,why:L(`A queue is first come, first served: ${cellName(queue[0])} has waited longest.`)},rnd):null;
   const c=queue.shift();
   E.push({line:2,node:'take',chip:L(`c = ${cellName(c)}`),note:L(`Take ${cellName(c)} from the front of the queue.`),...view({current:c}),row:[cellName(c),queueText(queue)],ask});
   const isGoal=c===GOAL;
   E.push({line:3,node:'goal',chip:L(`${cellName(c)} = G? ${isGoal?'yes':'no'}`),note:L(`Is ${cellName(c)} the goal G? <b>${isGoal?'Yes':'No'}</b>.`),...view({current:c})});
   if(isGoal){const path=pathTo(parent,c);E.push({line:3,node:'found',note:L(`Follow the parents back from G: a path of <b>${path.length-1} steps</b>. No path is shorter, because BFS reaches every cell first by a shortest route.`),...view({current:c,path}),done:true});return E;}
   let skipped=[];
   for(const [dir,d] of around(c)){
    if(d<0){skipped.push(skipNote(dir,WHY_SKIP.out));continue;}if(maze[d]==='#'){skipped.push(skipNote(dir,WHY_SKIP.wall));continue;}if(parent.has(d)){skipped.push(skipNote(dir,WHY_SKIP.marked));continue;}
    const pre=skippedText(skipped);skipped=[];
    E.push({line:4,node:'nb',chip:L(`${DIRL[dir].en}: ${cellName(d)}`),note:L(`${pre.en}${DIRL[dir].en[0].toUpperCase()+DIRL[dir].en.slice(1)}: ${cellName(d)} is free.`),...view({current:c,look:d})});
    parent.set(d,c);queue.push(d);
    E.push({line:5,node:'add',chip:L(`queue: ${queue.length}`),note:L(`Mark ${cellName(d)}, note that it came from ${cellName(c)}, and add it to the back of the queue.`),...view({current:c,look:d})});}
   const pre=skippedText(skipped);
   E.push({line:4,node:'nb',chip:L('no more'),note:L(`${pre.en}No more free neighbours of ${cellName(c)}.`),...view({current:c})});}
  E.push({line:6,node:'nopath',note:L('The queue is empty and G was never reached: there is no path.'),...view(),done:true});return E;}
};

/* ---------------- #10 Depth-first search ---------------- */
const dfs={num:10,id:'dfs',level:L('High school'),kind:'grid',frontier:'stack',
 name:L('Depth-first search'),
 problem:L('Find a path from S to G by going as deep as possible: always continue from the newest cell, and back up only at a dead end. A free neighbour is open and not yet marked.'),
 pseudo:L(['stack ← [start]','while stack is not empty:','    c ← remove the top of stack','    if c is marked: go back to the while line','    mark c;  if c = goal: return the path through parent','    for each free neighbour d of c, in order up, right, down, left:','        parent[d] ← c;  put d on top of stack','return “no path”']),
 flow:{w:520,h:620,nodes:[term('start',260,24,90,30,L('Start')),proc('init',260,74,180,30,'stack ← [start]'),dec('scheck',260,142,210,56,L('stack not empty ?')),term('nopath',450,142,110,30,L('no path')),proc('take',260,212,230,30,L('c ← top of stack')),dec('marked',260,284,190,56,L('c marked ?')),proc('mark',260,354,160,30,L('mark c')),dec('goal',260,424,150,56,Q('c = goal')),term('found',450,424,130,30,L('return path')),dec('nb',260,506,280,60,L('next free neighbour d ?')),proc('push',260,586,320,30,L('parent[d] ← c; d → top of stack'))],
  edges:[['start','init',[[260,39],[260,59]]],['init','scheck',[[260,89],[260,114]]],['scheck','take',[[260,170],[260,197]],YES,[268,186]],['scheck','nopath',[[365,142],[395,142]],NO,[370,134]],['take','marked',[[260,227],[260,256]]],['marked','scheck',[[165,284],[30,284],[30,104],[260,104],[260,114]],YES,[140,276]],['marked','mark',[[260,312],[260,339]],NO,[268,328]],['mark','goal',[[260,369],[260,396]]],['goal','found',[[335,424],[385,424]],YES,[343,416]],['goal','nb',[[260,452],[260,476]],NO,[268,466]],['nb','push',[[260,536],[260,571]],YES,[268,556]],['push','nb',[[100,586],[60,586],[60,506],[120,506]]],['nb','scheck',[[400,506],[512,506],[512,104],[260,104],[260,114]],NO,[410,498]]]},
 code:{
  python:{lines:['def dfs(grid, start, goal):','    parent = {start: None}','    marked = set()','    stack = [start]','    while stack:','        c = stack.pop()','        if c in marked:','            continue','        marked.add(c)','        if c == goal:','            return path_to(parent, goal)','        for d in free_neighbours(grid, c, marked):','            parent[d] = c','            stack.append(d)','    return None','','# free_neighbours and path_to are the helpers shown with #9 Breadth-first search.'],map:[[2,3,4],[5],[6],[7,8],[9,10,11],[12],[13,14],[15]]},
  java:{lines:['// At the top of the file: import java.util.*;','static List<Integer> dfs(String[] grid, int start, int goal) {','    Map<Integer, Integer> parent = new HashMap<>();','    parent.put(start, -1);','    Set<Integer> marked = new HashSet<>();','    ArrayDeque<Integer> stack = new ArrayDeque<>();','    stack.push(start);','    while (!stack.isEmpty()) {','        int c = stack.pop();','        if (marked.contains(c)) {','            continue;','        }','        marked.add(c);','        if (c == goal) {','            return pathTo(parent, goal);','        }','        for (int d : freeNeighbours(grid, c, marked)) {','            parent.put(d, c);','            stack.push(d);','        }','    }','    return null;','}','','// freeNeighbours and pathTo are the helpers shown with #9 Breadth-first search.'],map:[[3,4,5,6,7],[8],[9],[10,11,12],[13,14,15],[17],[18,19],[22]]},
  matlab:{lines:['function path = dfs(walls, start, goal)','    parent = zeros(size(walls));','    parent(start) = start;','    marked = false(size(walls));','    stack = start;','    while ~isempty(stack)','        c = stack(end); stack(end) = [];','        if marked(c)','            continue','        end','        marked(c) = true;','        if c == goal','            path = path_to(parent, goal);','            return','        end','        for d = free_neighbours(walls, c, marked)','            parent(d) = c;','            stack(end+1) = d;','        end','    end','    path = [];','end','','% free_neighbours.m and path_to.m are the helper files shown with #9 Breadth-first search.'],map:[[2,3,4,5],[6],[7],[8,9,10],[11,12,13,14],[16],[17,18],[21]]}},
 teach:[
  {step:L('Put the start on the stack. Nothing is marked yet.'),python:L('A Python list works as a stack.'),java:L('ArrayDeque also works as a stack, with push and pop.'),matlab:L('An array works as a stack; its last element is the top.')},
  {step:L('Keep going while the stack holds cells.'),python:L('An empty list counts as false.'),java:L('isEmpty() tells whether the stack is empty.'),matlab:L('~isempty(stack) is true while the stack has cells.')},
  {step:L('Take the newest cell: the top of the stack.'),python:L('pop() removes the last item.'),java:L('pop() removes the top.'),matlab:L('stack(end) is the top; stack(end) = [] removes it.')},
  {step:L('A cell can be on the stack more than once. If it was already handled, skip it.'),python:L('continue jumps back to the while line.'),java:L('continue jumps back to the while line.'),matlab:L('continue jumps back to the while line.')},
  {step:L('Mark it now. If it is the goal, follow the parents back to S.'),python:L('DFS marks a cell when it is taken, not when it is added.'),java:L('The same order as in Python.'),matlab:L('marked is a logical array, as large as the maze.')},
  {step:L('Look at the free neighbours, in the order up, right, down, left.'),python:L('The helper is the same as for BFS.'),java:L('The helper is the same as for BFS.'),matlab:L('The helper is the same as for BFS.')},
  {step:L('Remember where each came from and put it on top. The last one added is taken first: the left neighbour, when it is free.'),python:L('append adds to the top.'),java:L('push adds to the top.'),matlab:L('end+1 adds to the top.')},
  {step:L('If the stack runs out, G cannot be reached.'),python:L('None means “no path”.'),java:L('null means “no path”.'),matlab:L('An empty path means “no path”.')}],
 defaults:{maze:DEFAULT_MAZE},
 trace:L(['Step','taken','stack after (top first)']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const maze=parseMaze(input.maze),E=[],ref=dfsRun(maze),parent=new Map([[START,-1]]),marked=new Set(),stack=[START];
  const view=(x={})=>({maze,marked:[...marked],frontier:[...stack].reverse(),...x});
  E.push({line:-1,node:'start',note:L('Find a path from S to G, going as deep as possible first.'),...view(),ask:pathAsk(ref,rnd)});
  E.push({line:0,node:'init',chip:L('stack: S'),note:L(`Put S ${cellName(START)} on the stack.`),...view()});
  for(;;){const go=stack.length>0,top=[...stack].reverse();
   E.push({line:1,node:'scheck',chip:go?L(`${stack.length} on stack`):L('stack empty'),note:go?L(`The stack holds ${stack.length} ${pl(stack.length,'entry','entries')}, top first: ${queueText(top)}.`):L('The stack is empty.'),...view()});
   if(!go)break;
   const cand=[...new Set([top[0],top.at(-1),top[1]])].filter(x=>x!==undefined);
   const ask=cand.length>=2?shuffle({q:L('Which cell comes off the stack next?'),options:L(cand.map(cellName)),answer:0,why:L(`A stack serves the newest first: ${cellName(top[0])} is on top.`)},rnd):null;
   const c=stack.pop();
   E.push({line:2,node:'take',chip:L(`c = ${cellName(c)}`),note:L(`Take ${cellName(c)} from the top of the stack.`),...view({current:c}),row:[cellName(c),queueText([...stack].reverse())],ask});
   const was=marked.has(c);
   E.push({line:3,node:'marked',chip:L(`marked? ${was?'yes':'no'}`),note:was?L(`${cellName(c)} is already marked: this is an old copy. Skip it.`):L(`${cellName(c)} is not marked yet.`),...view({current:c})});
   if(was)continue;
   marked.add(c);
   E.push({line:4,node:'mark',chip:L(`${marked.size} marked`),note:L(`Mark ${cellName(c)}.`),...view({current:c})});
   const isGoal=c===GOAL;
   E.push({line:4,node:'goal',chip:L(`${cellName(c)} = G? ${isGoal?'yes':'no'}`),note:L(`Is ${cellName(c)} the goal G? <b>${isGoal?'Yes':'No'}</b>.`),...view({current:c})});
   if(isGoal){const path=pathTo(parent,c),best=bfsRun(maze).path.length-1;E.push({line:4,node:'found',note:L(`Follow the parents back from G: a path of <b>${path.length-1} steps</b>.${path.length-1>best?` A shortest path has ${best}.`:''}`),...view({current:c,path}),done:true});return E;}
   let skipped=[];
   for(const [dir,d] of around(c)){
    if(d<0){skipped.push(skipNote(dir,WHY_SKIP.out));continue;}if(maze[d]==='#'){skipped.push(skipNote(dir,WHY_SKIP.wall));continue;}if(marked.has(d)){skipped.push(skipNote(dir,WHY_SKIP.marked));continue;}
    const pre=skippedText(skipped);skipped=[];
    E.push({line:5,node:'nb',chip:L(`${DIRL[dir].en}: ${cellName(d)}`),note:L(`${pre.en}${DIRL[dir].en[0].toUpperCase()+DIRL[dir].en.slice(1)}: ${cellName(d)} is free.`),...view({current:c,look:d})});
    parent.set(d,c);stack.push(d);
    E.push({line:6,node:'push',chip:L(`stack: ${stack.length}`),note:L(`Note that ${cellName(d)} came from ${cellName(c)}, and put it on top of the stack.`),...view({current:c,look:d})});}
   const pre=skippedText(skipped);
   E.push({line:5,node:'nb',chip:L('no more'),note:L(`${pre.en}No more free neighbours of ${cellName(c)}.`),...view({current:c})});}
  E.push({line:7,node:'nopath',note:L('The stack is empty and G was never reached: there is no path.'),...view(),done:true});return E;}
};

/* ---------------- #11 Greedy change ---------------- */
function greedyRun(coins,amount){const taken=[];let left=amount;for(const c of [...new Set(coins)].sort((x,y)=>y-x))while(left>=c){taken.push(c);left-=c;}return{taken,left};}
function fewestCoins(coins,amount){const best=new Array(amount+1).fill(Infinity);best[0]=0;for(let v=1;v<=amount;v++)for(const c of coins)if(c<=v&&best[v-c]+1<best[v])best[v]=best[v-c]+1;return best[amount];}
function fewestSet(coins,amount){const best=new Array(amount+1).fill(Infinity),pick=new Array(amount+1).fill(0);best[0]=0;for(let v=1;v<=amount;v++)for(const c of coins)if(c<=v&&best[v-c]+1<best[v]){best[v]=best[v-c]+1;pick[v]=c;}if(best[amount]===Infinity)return null;const out=[];for(let v=amount;v>0;v-=pick[v])out.push(pick[v]);return out.sort((x,y)=>y-x);}
const greedy={num:11,id:'greedy-change',level:L('High school'),kind:'coins',
 name:L('Greedy change'),
 problem:L('Pay an amount by always taking the largest coin that still fits, hoping to use few coins. This is called a greedy method: it never reconsiders a choice.'),
 pseudo:L(['sort the coins from largest to smallest','for each coin c:','    while amount ≥ c:','        take c;  amount ← amount − c','return the coins taken']),
 flow:{w:460,h:360,nodes:[term('start',220,24,90,30,L('Start')),proc('sort',220,74,240,30,L('sort coins, largest first')),dec('ccheck',220,142,180,56,L('another coin c ?')),term('done',60,142,100,30,L('return')),dec('wcheck',220,230,170,56,Q('amount ≥ c')),proc('take',220,310,260,30,L('take c; amount ← amount − c'))],
  edges:[['start','sort',[[220,39],[220,59]]],['sort','ccheck',[[220,89],[220,114]]],['ccheck','wcheck',[[220,170],[220,202]],YES,[228,188]],['ccheck','done',[[130,142],[110,142]],NO,[112,134]],['wcheck','take',[[220,258],[220,295]],YES,[228,278]],['take','wcheck',[[90,310],[30,310],[30,196],[220,196],[220,202]]],['wcheck','ccheck',[[305,230],[430,230],[430,108],[220,108],[220,114]],NO,[312,222]]]},
 code:{
  python:{lines:['def greedy_change(coins, amount):','    taken = []','    for c in sorted(coins, reverse=True):','        while amount >= c:','            taken.append(c)','            amount -= c','    return taken'],map:[[2,3],[3],[4],[5,6],[7]]},
  java:{lines:['// At the top of the file: import java.util.*;','static List<Integer> greedyChange(int[] coins, int amount) {','    List<Integer> taken = new ArrayList<>();','    int[] sorted = coins.clone();','    Arrays.sort(sorted);','    for (int k = sorted.length - 1; k >= 0; k--) {','        int c = sorted[k];','        while (amount >= c) {','            taken.add(c);','            amount -= c;','        }','    }','    return taken;','}'],map:[[3,4,5],[6,7],[8],[9,10],[13]]},
  matlab:{lines:['function taken = greedy_change(coins, amount)','    % coins is a row vector, such as [25 10 5 1].','    taken = [];','    for c = sort(coins, \'descend\')','        while amount >= c','            taken(end+1) = c;','            amount = amount - c;','        end','    end','end'],map:[[3,4],[4],[5],[6,7],[10]]}},
 teach:[
  {step:L('Line the coins up from largest to smallest.'),python:L('sorted(…, reverse=True) gives a new list, largest first.'),java:L('Arrays.sort sorts a copy from smallest to largest; the loop then reads it backwards.'),matlab:L('sort(…, \'descend\') puts the largest first.')},
  {step:L('Try each coin in that order.'),python:L('The for loop walks through the sorted list.'),java:L('k runs from the last position down to 0.'),matlab:L('for walks through the columns of the sorted row.')},
  {step:L('Keep taking this coin while it still fits in what is left.'),python:L('>= means “at least”.'),java:L('The same test in Java.'),matlab:L('The same test in MATLAB.')},
  {step:L('Take it, and subtract its value from the amount.'),python:L('amount -= c is short for amount = amount − c.'),java:L('The same two steps in Java.'),matlab:L('end+1 adds the coin to the list.')},
  {step:L('The coins taken are the answer. If some amount is left, no coin was small enough.'),python:L('Return the list of coins.'),java:L('Return the list of coins.'),matlab:L('The output variable taken is returned.')}],
 defaults:{coins:[25,10,5,1],amount:68},
 trace:L(['Check','c','amount','take c?']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const coins=[...new Set(input.coins||[])].sort((x,y)=>y-x),E=[];let amount=input.amount;const taken=[],ref=greedyRun(coins,amount);
  const view=(x={})=>({coins,amount,taken:[...taken],...x});const k0=ref.taken.length;
  E.push({line:-1,node:'start',note:L(`Pay ${amount} with the coins ${coins.join(', ')}.`),...view(),ask:shuffle({q:L('Before you start: how many coins will the greedy method take?'),options:nums(uniq([k0,k0+1,Math.max(1,k0-1)])),answer:0,why:L(`Taking the largest coin that fits each time gives ${ref.taken.join(' + ')||'nothing'}: ${k0} ${pl(k0,'coin','coins')}${ref.left?`, with ${ref.left} left over`:''}.`)},rnd)});
  E.push({line:0,node:'sort',chip:L(coins.join(' > ')),note:L(`Sort the coins from largest to smallest: ${coins.join(', ')}.`),...view()});
  for(let k=0;;k++){const go=k<coins.length;
   E.push({line:1,node:'ccheck',chip:go?L(`c = ${coins[k]}`):L('no coins left'),note:go?L(`Next coin: <b>c = ${coins[k]}</b>.`):L('Every coin has been tried.'),...view({coin:go?coins[k]:null})});
   if(!go)break;const c=coins[k];
   for(;;){const fits=amount>=c;
    E.push({line:2,node:'wcheck',chip:L(`${amount} ≥ ${c}? ${fits?'yes':'no'}`),note:L(`Is amount = ${amount} ≥ ${c}? <b>${fits?'Yes':'No'}</b>.`),...view({coin:c}),row:[c,amount,fits?YES:NO],
     ask:{q:L(`${amount} is left. Will the greedy method take another ${c}?`),options:yesNo,answer:fits?0:1,why:fits?L(`${c} fits into ${amount}.`):L(`${c} is more than the ${amount} that is left.`)}});
    if(!fits)break;taken.push(c);amount-=c;
    E.push({line:3,node:'take',chip:L(`amount = ${amount}`),note:L(`Take ${c}: now <b>amount = ${amount}</b>.`),...view({coin:c,fresh:true})});}}
  E.push({line:4,node:'done',note:amount?L(`Return ${taken.join(' + ')||'no coins'}, but <b>${amount}</b> is still left: no coin is small enough.`):L(`Return <b>${taken.length} ${pl(taken.length,'coin','coins')}</b>: ${taken.join(' + ')}.`),...view(),done:true});return E;}
};

/* ---------------- #12 Quicksort ---------------- */
// The ranges still to sort wait on an explicit stack: the job the call stack does in #8.
// pick: 'last' (as taught), 'middle', 'first', or a random-number function for a random pivot.
function quickRun(a0,pick='last'){const a=[...a0];let comps=0;const stack=[[0,a.length-1]];
 while(stack.length){const [lo,hi]=stack.pop();if(lo>=hi)continue;
  if(pick!=='last'){const p=pick==='middle'?Math.floor((lo+hi)/2):pick==='first'?lo:lo+Math.floor(pick()*(hi-lo+1));[a[p],a[hi]]=[a[hi],a[p]];}
  const pivot=a[hi];let i=lo;for(let j=lo;j<hi;j++){comps++;if(a[j]<pivot){[a[i],a[j]]=[a[j],a[i]];i++;}}[a[i],a[hi]]=[a[hi],a[i]];stack.push([lo,i-1],[i+1,hi]);}
 return{arr:a,comps,sorted:sorted(a)};}
const rangeText=r=>`(${r[0]}, ${r[1]})`;
const quick={num:12,id:'quicksort',level:L('University'),kind:'quick',
 name:L('Quicksort'),
 problem:L('Sort a list by choosing a pivot, moving every smaller item to its left, and then sorting the two sides the same way. The ranges still to sort wait on a stack.'),
 pseudo:L(['stack ← [(0, n − 1)]','while stack is not empty:','    (lo, hi) ← take the top of stack;  if lo ≥ hi: go back to the while line','    pivot ← a[hi],  i ← lo','    for j from lo to hi − 1:','        if a[j] < pivot: swap a[i] and a[j],  i ← i + 1','    swap a[i] and a[hi]','    put (lo, i − 1) and then (i + 1, hi) on stack','the list is sorted']),
 flow:{w:600,h:620,nodes:[term('start',280,24,90,30,L('Start')),proc('init',280,74,200,30,'stack ← [(0, n − 1)]'),dec('scheck',280,142,210,56,L('stack not empty ?')),term('done',500,142,110,30,L('sorted')),proc('take',280,212,240,30,L('(lo, hi) ← top of stack')),dec('small',280,284,150,56,Q('lo ≥ hi')),proc('push',480,284,220,30,L('push (lo, i−1), (i+1, hi)')),proc('pivot',280,354,260,30,'pivot ← a[hi], i ← lo, j ← lo'),dec('jcheck',280,426,170,56,Q('j < hi')),proc('place',480,426,150,30,'a[i] ⇄ a[hi]'),dec('cmp',280,506,170,56,Q('a[j] < pivot')),proc('swap',480,506,190,30,'a[i] ⇄ a[j], i ← i + 1'),proc('inc',280,590,110,30,'j ← j + 1')],
  edges:[['start','init',[[280,39],[280,59]]],['init','scheck',[[280,89],[280,114]]],['scheck','take',[[280,170],[280,197]],YES,[288,186]],['scheck','done',[[385,142],[445,142]],NO,[395,134]],['take','small',[[280,227],[280,256]]],['small','scheck',[[205,284],[24,284],[24,104],[280,104],[280,114]],YES,[176,276]],['small','pivot',[[280,312],[280,339]],NO,[288,328]],['pivot','jcheck',[[280,369],[280,398]]],['jcheck','cmp',[[280,454],[280,478]],YES,[288,468]],['jcheck','place',[[365,426],[405,426]],NO,[372,418]],['place','push',[[480,411],[480,299]]],['push','scheck',[[590,284],[596,284],[596,104],[280,104],[280,114]]],['cmp','swap',[[365,506],[385,506]],YES,[366,498]],['cmp','inc',[[280,534],[280,575]],NO,[288,556]],['swap','inc',[[480,521],[480,590],[335,590]]],['inc','jcheck',[[225,590],[60,590],[60,392],[280,392],[280,398]]]]},
 code:{
  python:{lines:['def quicksort(a):','    stack = [(0, len(a) - 1)]','    while stack:','        lo, hi = stack.pop()','        if lo >= hi:','            continue','        pivot, i = a[hi], lo','        for j in range(lo, hi):','            if a[j] < pivot:','                a[i], a[j] = a[j], a[i]','                i += 1','        a[i], a[hi] = a[hi], a[i]','        stack.append((lo, i - 1))','        stack.append((i + 1, hi))','    return a'],map:[[2],[3],[4,5,6],[7],[8],[9,10,11],[12],[13,14],[15]]},
  java:{lines:['// At the top of the file: import java.util.*;','static void quicksort(int[] a) {','    ArrayDeque<int[]> stack = new ArrayDeque<>();','    stack.push(new int[]{0, a.length - 1});','    while (!stack.isEmpty()) {','        int[] r = stack.pop();','        int lo = r[0], hi = r[1];','        if (lo >= hi) {','            continue;','        }','        int pivot = a[hi], i = lo;','        for (int j = lo; j < hi; j++) {','            if (a[j] < pivot) {','                int t = a[i]; a[i] = a[j]; a[j] = t;','                i++;','            }','        }','        int t = a[i]; a[i] = a[hi]; a[hi] = t;','        stack.push(new int[]{lo, i - 1});','        stack.push(new int[]{i + 1, hi});','    }','}'],map:[[3,4],[5],[6,7,8,9],[11],[12],[13,14,15],[18],[19,20],[22]]},
  matlab:{lines:['function a = quicksort(a)','    % a is a row vector, such as [5 3 8].','    stack = [1, numel(a)];','    while ~isempty(stack)','        lo = stack(end, 1); hi = stack(end, 2); stack(end, :) = [];','        if lo >= hi','            continue','        end','        pivot = a(hi); i = lo;','        for j = lo:hi-1','            if a(j) < pivot','                a([i j]) = a([j i]);','                i = i + 1;','            end','        end','        a([i hi]) = a([hi i]);','        stack(end+1, :) = [lo, i - 1];','        stack(end+1, :) = [i + 1, hi];','    end','end'],map:[[3],[4],[5,6,7,8],[9],[10],[11,12,13],[16],[17,18],[20]]}},
 teach:[
  {step:L('At first the whole list is one range still to sort.'),python:L('A list of pairs works as the stack.'),java:L('Each range is a small int array {lo, hi}; ArrayDeque works as a stack.'),matlab:L('Each row of stack is one range [lo, hi], counted from 1.')},
  {step:L('Keep going while some range is waiting.'),python:L('An empty list counts as false.'),java:L('isEmpty() tells whether the stack is empty.'),matlab:L('~isempty(stack) is true while rows are left.')},
  {step:L('Take the newest range. With one item or none, it is already sorted.'),python:L('pop() takes the last pair added; continue jumps back to the while line.'),java:L('pop() takes the newest range; continue jumps back to the while line.'),matlab:L('stack(end, :) = [] removes the top row.')},
  {step:L('Use the last item of the range as the pivot. i marks where the next smaller item goes.'),python:L('Two names get values at once.'),java:L('Two int variables in one declaration.'),matlab:L('Two statements on one line, separated by ;.')},
  {step:L('Look at every other item of the range, left to right.'),python:L('range(lo, hi) stops just before the pivot.'),java:L('j < hi stops just before the pivot.'),matlab:L('lo:hi-1 stops just before the pivot.')},
  {step:L('A smaller item swaps into the left part, which then grows by one.'),python:L('Python swaps two items in one line.'),java:L('Java swaps through a temporary t.'),matlab:L('a([i j]) = a([j i]) swaps two positions.')},
  {step:L('Put the pivot between the two parts: that is its final place.'),python:L('The same one-line swap.'),java:L('The same swap through t.'),matlab:L('The same swap of two positions.')},
  {step:L('Both sides still need sorting: put them on the stack. The right side, added last, is taken first.'),python:L('append adds to the top.'),java:L('push adds to the top.'),matlab:L('end+1 adds a row at the top.')},
  {step:L('When no range is left, the list is sorted.'),python:L('Return the list.'),java:L('The array was sorted in place.'),matlab:L('The function returns the sorted a.')}],
 defaults:{list:[7,2,9,4,1,8,5,3]},
 trace:L(['Comparison','range','a[j]','pivot','a[j] < pivot?']),
 gen(a0,_t,rnd=Math.random){const a=[...a0],n=a.length,E=[],total=quickRun(a0).comps,stack=[[0,n-1]],placed=new Set();
  const view=(x={})=>({arr:[...a],ranges:stack.map(rangeText).reverse(),placed:[...placed],...x});
  E.push({line:-1,node:'start',note:L(`Sort a list of ${n} items with quicksort.`),...view(),ask:shuffle({q:L('Before you start: how many comparisons with a pivot will quicksort make here?'),options:nums(uniq([total,n*(n-1)/2,n-1,total+3])),answer:0,why:L(`A range of m items costs m − 1 comparisons. Here the ranges add up to ${total}.`)},rnd)});
  E.push({line:0,node:'init',chip:L(`(0, ${n-1})`),note:L(`The whole list, positions 0 to ${n-1}, waits on the stack.`),...view()});
  for(;;){const go=stack.length>0;
   E.push({line:1,node:'scheck',chip:go?L(`${stack.length} waiting`):L('stack empty'),note:go?L(`Ranges waiting, top first: ${stack.map(rangeText).reverse().join(' ')}.`):L('No range is waiting.'),...view()});
   if(!go)break;const [lo,hi]=stack.pop(),rg=(x={})=>({range:[lo,hi+1],...x});
   E.push({line:2,node:'take',chip:L(`(${lo}, ${hi})`),note:L(`Take the range (${lo}, ${hi}) from the top of the stack.`),...view(rg())});
   const tiny=lo>=hi;if(lo===hi)placed.add(lo);
   E.push({line:2,node:'small',chip:L(`${lo} ≥ ${hi}? ${tiny?'yes':'no'}`),note:tiny?L(`lo = ${lo} ≥ hi = ${hi}: ${lo===hi?'a single item is':'an empty range is'} already sorted.`):L(`lo = ${lo} &lt; hi = ${hi}: ${hi-lo+1} items to sort.`),...view(rg())});
   if(tiny)continue;
   const pivot=a[hi];let i=lo,j=lo;
   E.push({line:3,node:'pivot',chip:L(`pivot = ${pivot}`),note:L(`The pivot is the last item of the range, <b>${pivot}</b>. Smaller items will gather on the left, from <b>i = ${lo}</b>.`),...view(rg({pivot,mark:[hi],ptr:{i,j}}))});
   for(;;){const more=j<hi;
    E.push({line:4,node:'jcheck',chip:more?L(`j = ${j}`):L('range done'),note:more?L(`Is j = ${j} &lt; hi = ${hi}? Yes: look at a[${j}] = ${a[j]}.`):L(`Is j = ${j} &lt; hi = ${hi}? No: every other item has been compared with the pivot.`),...view(rg({pivot,mark:[hi],ptr:more?{i,j}:{i}}))});
    if(!more)break;const lt=a[j]<pivot;
    E.push({line:5,node:'cmp',chip:L(`${a[j]} < ${pivot}? ${lt?'yes':'no'}`),note:L(`Is a[${j}] = ${a[j]} smaller than the pivot ${pivot}? <b>${lt?'Yes':'No'}</b>.`),...view(rg({pivot,mark:[hi],cmp:[j],ptr:{i,j}})),row:[`${lo}–${hi}`,a[j],pivot,lt?YES:NO],
     ask:{q:L(`Does a[${j}] = ${a[j]} join the left part?`),options:yesNo,answer:lt?0:1,why:lt?L(`${a[j]} is smaller than the pivot ${pivot}.`):L(`${a[j]} is not smaller than the pivot ${pivot}, so it stays where it is for now.`)}});
    if(lt){[a[i],a[j]]=[a[j],a[i]];i++;E.push({line:5,node:'swap',chip:L(`i = ${i}`),note:i-1===j?L(`a[${j}] is already at the end of the left part, so the swap changes nothing. Now <b>i = ${i}</b>.`):L(`Swap a[${i-1}] and a[${j}]: the left part now ends at position ${i-1}, and <b>i = ${i}</b>.`),...view(rg({pivot,mark:[hi],swapped:[i-1,j],ptr:{i,j}}))});}
    j++;E.push({line:4,node:'inc',chip:L(`j = ${j}`),note:L(`Move on: <b>j = ${j}</b>.`),...view(rg({pivot,mark:[hi],ptr:{i,j}}))});}
   [a[i],a[hi]]=[a[hi],a[i]];placed.add(i);
   E.push({line:6,node:'place',chip:L(`pivot at ${i}`),note:L(`Swap the pivot ${pivot} into position ${i}. In this range everything to its left is smaller and nothing to its right is, so it never moves again.`),...view(rg({pivot,hit:[i]}))});
   stack.push([lo,i-1],[i+1,hi]);
   E.push({line:7,node:'push',chip:L(`${rangeText([lo,i-1])} ${rangeText([i+1,hi])}`),note:L(`Put the left side ${rangeText([lo,i-1])} and then the right side ${rangeText([i+1,hi])} on the stack.`),...view()});}
  E.push({line:8,node:'done',note:L(`The list is sorted after ${total} ${pl(total,'comparison','comparisons')}.`),...view({sortedFrom:0}),done:true});return E;}
};

/* ---------------- #13 Dynamic programming: the fewest coins ---------------- */
// o.down: fill the table from the amount down (broken). o.zero: start each entry at 0 (broken).
// o.first: keep the first way found for each amount (broken).
function dpRun(coins,amount,o={}){const cs=[...new Set(coins)].sort((x,y)=>x-y),best=new Array(amount+1).fill(Infinity),last=new Array(amount+1).fill(0);let comps=0;best[0]=0;
 for(let k=1;k<=amount;k++){const v=o.down?amount+1-k:k;best[v]=o.zero?0:Infinity;
  for(const c of cs){if(c>v)break;comps++;if(best[v-c]+1<best[v]){best[v]=best[v-c]+1;last[v]=c;if(o.first)break;}}}
 const taken=[];if(best[amount]<Infinity&&best[amount]>0)for(let v=amount;v>0&&last[v];v-=last[v])taken.push(last[v]);
 return{best,last,taken,comps};}
const DP_BREAKS=['down','zero','first'],DP_OUTCOMES=['cannot','zero','worse','works'];
function dpBreak(change,coins=[1,3,4],amount=6){const got=dpRun(coins,amount,{[change]:true}).best[amount],want=fewestCoins(coins,amount);return got===Infinity?'cannot':got===0?'zero':got>want?'worse':'works';}
const dp={num:13,id:'fewest-coins',level:L('University'),kind:'dp',
 name:L('Dynamic programming: the fewest coins'),
 problem:L('Find the fewest coins that pay an amount exactly, for any set of coins. Fill a table from small amounts up: the best way to pay v is the best way to pay a smaller amount, plus one coin.'),
 pseudo:L(['best[0] ← 0','for v from 1 to amount:','    best[v] ← ∞','    for each coin c with c ≤ v, smallest first:','        if best[v − c] + 1 < best[v]: best[v] ← best[v − c] + 1,  last[v] ← c','follow last[] back from amount to list the coins']),
 flow:{w:520,h:480,nodes:[term('start',260,24,90,30,L('Start')),proc('init',260,74,180,30,'best[0] ← 0, v ← 1'),dec('vcheck',260,142,180,56,Q('v ≤ amount')),term('read',450,142,120,30,L('read coins')),proc('inf',260,212,170,30,'best[v] ← ∞'),dec('ccheck',260,288,260,58,L('next coin c ≤ v ?')),proc('vinc',60,288,100,30,'v ← v + 1'),dec('cmp',260,372,300,58,Q('best[v − c] + 1 < best[v]')),proc('upd',260,452,330,30,'best[v] ← best[v − c] + 1, last[v] ← c')],
  edges:[['start','init',[[260,39],[260,59]]],['init','vcheck',[[260,89],[260,114]]],['vcheck','inf',[[260,170],[260,197]],YES,[268,186]],['vcheck','read',[[350,142],[390,142]],NO,[358,134]],['inf','ccheck',[[260,227],[260,259]]],['ccheck','cmp',[[260,317],[260,343]],YES,[268,333]],['ccheck','vinc',[[130,288],[110,288]],NO,[112,280]],['vinc','vcheck',[[60,273],[60,104],[260,104],[260,114]]],['cmp','ccheck',[[410,372],[470,372],[470,246],[260,246],[260,259]],NO,[418,364]],['cmp','upd',[[260,401],[260,437]],YES,[268,422]],['upd','ccheck',[[425,452],[492,452],[492,246],[260,246],[260,259]]]]},
 code:{
  python:{lines:['def fewest_coins(coins, amount):','    best = [0] + [float("inf")] * amount','    last = [0] * (amount + 1)','    for v in range(1, amount + 1):','        for c in sorted(coins):','            if c <= v and best[v - c] + 1 < best[v]:','                best[v] = best[v - c] + 1','                last[v] = c','    taken = []','    while amount > 0 and best[amount] < float("inf"):','        taken.append(last[amount])','        amount -= last[amount]','    return taken'],map:[[2,3],[4],[2],[5],[6,7,8],[9,10,11,12,13]]},
  java:{lines:['// At the top of the file: import java.util.*;','static List<Integer> fewestCoins(int[] coins, int amount) {','    int[] best = new int[amount + 1], last = new int[amount + 1];','    Arrays.fill(best, Integer.MAX_VALUE);','    best[0] = 0;','    int[] cs = coins.clone();','    Arrays.sort(cs);','    for (int v = 1; v <= amount; v++) {','        for (int c : cs) {','            if (c <= v && best[v - c] != Integer.MAX_VALUE && best[v - c] + 1 < best[v]) {','                best[v] = best[v - c] + 1;','                last[v] = c;','            }','        }','    }','    List<Integer> taken = new ArrayList<>();','    for (int v = amount; v > 0 && best[v] != Integer.MAX_VALUE; v -= last[v]) taken.add(last[v]);','    return taken;','}'],map:[[3,5],[8],[4],[6,7,9],[10,11,12],[16,17,18]]},
  matlab:{lines:['function taken = fewest_coins(coins, amount)','    % coins is a row vector; best(v + 1) is the fewest coins to pay v.','    best = [0, inf(1, amount)];','    last = zeros(1, amount + 1);','    for v = 1:amount','        for c = sort(coins)','            if c <= v && best(v - c + 1) + 1 < best(v + 1)','                best(v + 1) = best(v - c + 1) + 1;','                last(v + 1) = c;','            end','        end','    end','    taken = [];','    while amount > 0 && best(amount + 1) < inf','        taken(end+1) = last(amount + 1);','        amount = amount - last(amount + 1);','    end','end'],map:[[3,4],[5],[3],[6],[7,8,9],[13,14,15,16]]}},
 teach:[
  {step:L('Paying 0 takes no coins.'),python:L('float("inf") stands for “no way found yet”.'),java:L('Integer.MAX_VALUE stands for ∞.'),matlab:L('MATLAB counts from 1, so best(v + 1) holds the answer for v.')},
  {step:L('Fill the table from small amounts up, so that every smaller answer is ready when it is needed.'),python:L('range(1, amount + 1) gives 1, …, amount.'),java:L('v runs from 1 to amount.'),matlab:L('1:amount lists the amounts.')},
  {step:L('No way to pay v is known yet.'),python:L('The whole table started at ∞ in the first lines.'),java:L('Arrays.fill set the whole table to ∞ at the start.'),matlab:L('inf(1, amount) set the table to ∞ at the start.')},
  {step:L('Try each coin that fits as the last coin paid.'),python:L('sorted(coins) tries the smallest coin first.'),java:L('The sorted copy cs is tried smallest first.'),matlab:L('sort(coins) tries the smallest coin first.')},
  {step:L('Paying v − c the best way, plus this coin, may beat what is known: then remember it, and remember the coin.'),python:L('last[v] remembers which coin did it.'),java:L('Java must not add 1 to MAX_VALUE, so it checks that first.'),matlab:L('inf + 1 is still inf, so no extra check is needed.')},
  {step:L('Walk back through last[] to list the coins.'),python:L('Each step subtracts the coin it used.'),java:L('The for loop walks back from amount.'),matlab:L('The while loop walks back from amount.')}],
 defaults:{coins:[1,3,4],amount:10},
 trace:L(['Check','v','c','best[v − c] + 1','best[v]','better?']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const coins=[...new Set(input.coins||[])].sort((x,y)=>x-y),amount=input.amount,E=[],ref=dpRun(coins,amount),best=new Array(amount+1).fill(null),last=new Array(amount+1).fill(0);best[0]=0;
  const inf=x=>x===Infinity?'∞':String(x),k0=ref.best[amount],g=greedyRun([...coins],amount),gk=g.left?null:g.taken.length;
  const view=(x={})=>({coins,amount,best:best.map(b=>b===null?'':inf(b)),last:last.map(c=>c?String(c):''),...x});
  E.push({line:-1,node:'start',note:L(`Find the fewest coins from ${coins.join(', ')} that pay ${amount} exactly.`),...view(),ask:shuffle({q:L(`Before you start: how many coins will the fewest way to pay ${amount} use?`),options:k0===Infinity?L(['It cannot be paid','1','2']):(o=>L([...o,'It cannot be paid']))(uniq([k0,gk!==null&&gk>k0?gk:k0+1]).slice(0,2).map(String)),answer:0,why:k0===Infinity?L('No combination of these coins makes this amount.'):L(`The table ends with best[${amount}] = ${k0}: ${ref.taken.join(' + ')}.`)},rnd)});
  E.push({line:0,node:'init',chip:L('best[0] = 0'),note:L('Paying 0 takes <b>0</b> coins. Start with <b>v = 1</b>.'),...view({cur:0})});
  for(let v=1;;v++){const go=v<=amount;
   E.push({line:1,node:'vcheck',chip:go?L(`v = ${v}`):L('table full'),note:go?L(`Is v = ${v} ≤ ${amount}? Yes: find the best way to pay ${v}.`):L(`Is v = ${v} ≤ ${amount}? No: the table is full.`),...view({cur:go?v:null})});
   if(!go)break;best[v]=Infinity;
   E.push({line:2,node:'inf',chip:L(`best[${v}] = ∞`),note:L(`No way to pay ${v} is known yet: <b>best[${v}] = ∞</b>.`),...view({cur:v})});
   const fit=coins.filter(c=>c<=v);
   for(let k=0;;k++){const more=k<fit.length;
    E.push({line:3,node:'ccheck',chip:more?L(`c = ${fit[k]}`):L('no more coins'),note:more?L(`Next coin that fits into ${v}: <b>c = ${fit[k]}</b>.`):L(`No more coins fit into ${v}. best[${v}] = ${inf(best[v])}.`),...view({cur:v,coin:more?fit[k]:null})});
    if(!more)break;const c=fit[k],cand=best[v-c]+1,better=cand<best[v],had=best[v];
    E.push({line:4,node:'cmp',chip:L(`${inf(cand)} < ${inf(had)}? ${better?'yes':'no'}`),note:L(`Pay ${v-c} the best way (${best[v-c]===Infinity?'no way is known':`${best[v-c]} ${pl(best[v-c],'coin','coins')}`}) plus one coin of ${c}: ${inf(cand)}. Is that less than best[${v}] = ${inf(had)}? <b>${better?'Yes':'No'}</b>.`),...view({cur:v,look:v-c,coin:c}),row:[v,c,inf(cand),inf(had),better?YES:NO],
     ask:had===Infinity?null:{q:L(`best[${v-c}] + 1 = ${inf(cand)}. Does it beat best[${v}] = ${had}?`),options:yesNo,answer:better?0:1,why:better?L(`${inf(cand)} is less than ${had}.`):L(`${inf(cand)} is not less than ${had}, so the way already found stays.`)}});
    if(better){best[v]=cand;last[v]=c;E.push({line:4,node:'upd',chip:L(`best[${v}] = ${cand}`),note:L(`Remember it: <b>best[${v}] = ${cand}</b>, with <b>last[${v}] = ${c}</b> as the last coin.`),...view({cur:v,look:v-c,coin:c,fresh:true})});}}
   E.push({line:1,node:'vinc',chip:L(`v = ${v+1}`),note:L(`best[${v}] = ${inf(best[v])} is final. Move on: <b>v = ${v+1}</b>.`),...view({cur:v})});}
  const trail=[];if(k0<Infinity)for(let v=amount;v>0;v-=last[v])trail.push(v);
  E.push({line:5,node:'read',note:k0===Infinity?L(`best[${amount}] = ∞: these coins cannot pay ${amount} exactly.`):L(`Walk back through last[] from ${amount}: <b>${ref.taken.join(' + ')}</b>, ${k0} ${pl(k0,'coin','coins')}.`),...view({trail,taken:ref.taken}),done:true});return E;}
};

/* ---------------- Road maps for #14 and #15 ---------------- */
// Six towns A to F and nine roads; the learner chooses each road's length.
const TOWNS=['A','B','C','D','E','F'],TN=TOWNS.length;
const ROADS=[[0,1],[0,2],[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,5]];
const roadName=r=>TOWNS[ROADS[r][0]]+TOWNS[ROADS[r][1]];
const RI={};ROADS.forEach(([u,v],i)=>{RI[u+'-'+v]=i;RI[v+'-'+u]=i;});
const mapRoads=len=>ROADS.map(([u,v],i)=>[u,v,len[i]]);
// Each town's roads, in the order the roads are listed: for these towns that is alphabetical.
function nearList(n,roads){const near=Array.from({length:n},()=>[]);roads.forEach(([u,v,w],i)=>{near[u].push([v,w,i]);near[v].push([u,w,i]);});return near;}
// v: 0 finish every town (as taught). 1 stop when t is finished. 2 stop when t first gets a distance (broken).
// 3 finish towns in the order they were first reached, as BFS does (broken).
function dijkstraRun(n,roads,s,t,v=0){const near=nearList(n,roads),dist=new Array(n).fill(Infinity),prev=new Array(n).fill(-1),fin=new Array(n).fill(false),queue=[s];let finished=0,lowered=0,firstT=null;dist[s]=0;
 for(;;){let c=-1;
  if(v===3){while(queue.length&&fin[queue[0]])queue.shift();c=queue.length?queue.shift():-1;}
  else for(let i=0;i<n;i++)if(!fin[i]&&dist[i]<Infinity&&(c<0||dist[i]<dist[c]))c=i;
  if(c<0)break;fin[c]=true;finished++;if(v===1&&c===t)break;
  for(const [d,w] of near[c])if(!fin[d]&&dist[c]+w<dist[d]){if(dist[d]<Infinity)lowered++;else if(v===3)queue.push(d);dist[d]=dist[c]+w;prev[d]=c;if(d===t&&firstT===null)firstT=dist[d];}
  if(v===2&&firstT!==null)break;}
 const route=[];if(dist[t]<Infinity)for(let c=t;c!==-1;c=prev[c])route.unshift(c);
 return{dist:v===2&&firstT!==null?firstT:dist[t],all:dist,prev,route,finished,lowered};}
// #14 counterexample: walk along the shortest road to a town not yet visited, until t. Ties go to the road listed first.
function nearestWalk(n,roads,s,t){const near=nearList(n,roads),seen=new Set([s]),route=[s];let c=s,len=0;
 while(c!==t){let best=null;for(const [d,w] of near[c])if(!seen.has(d)&&(best===null||w<best[1]))best=[d,w];
  if(!best)return{stuck:true,at:c,route,len};seen.add(best[0]);route.push(best[0]);len+=best[1];c=best[0];}
 return{stuck:false,route,len};}
// v: 0 look at every road (as taught). 1 stop once n − 1 roads are kept. 2 keep each town's shortest road (broken).
// 3 keep the n − 1 shortest roads (broken). Roads of equal length keep their listed order.
function kruskalRun(n,roads,v=0){const idx=roads.map((_,i)=>i).sort((x,y)=>roads[x][2]-roads[y][2]||x-y);
 if(v===2){const set=new Set();for(let t=0;t<n;t++){let b=-1;roads.forEach(([p,q,w],i)=>{if((p===t||q===t)&&(b<0||w<roads[b][2]))b=i;});if(b>=0)set.add(b);}return treeOf(n,roads,[...set],roads.length);}
 if(v===3)return treeOf(n,roads,idx.slice(0,n-1),n-1);
 const group=Array.from({length:n},(_,i)=>i),kept=[];let looked=0;
 for(const i of idx){if(v===1&&kept.length===n-1)break;looked++;const [p,q]=roads[i];if(group[p]!==group[q]){kept.push(i);const old=group[q];for(let t=0;t<n;t++)if(group[t]===old)group[t]=group[p];}}
 return treeOf(n,roads,kept,looked);}
function treeOf(n,roads,kept,looked){const g=Array.from({length:n},(_,i)=>i),find=x=>g[x]===x?x:(g[x]=find(g[x]));let loop=false;
 for(const i of kept){const a=find(roads[i][0]),b=find(roads[i][1]);if(a===b)loop=true;else g[a]=b;}
 const pieces=new Set(Array.from({length:n},(_,i)=>find(i))).size;
 return{kept,total:kept.reduce((s,i)=>s+roads[i][2],0),looked,tree:!loop&&pieces===1&&kept.length===n-1};}

/* ---------------- #14 Dijkstra's shortest paths ---------------- */
const D=x=>x===Infinity?'∞':String(x);
const dijkstra={num:14,id:'dijkstra',level:L('University'),kind:'graph',
 name:L('Dijkstra’s shortest paths'),
 problem:L('Find the shortest route from A to every town when roads have different lengths. Keep the best distance found so far for each town, and always finish the closest unfinished town: no route found later can beat it.'),
 pseudo:L(['dist[A] ← 0;  dist of every other town ← ∞','while some unfinished town has dist < ∞:','    c ← the unfinished town with the smallest dist;  finish c','    for each road (c, d) to an unfinished town d:','        if dist[c] + length(c, d) < dist[d]:  dist[d] ← dist[c] + length(c, d),  prev[d] ← c','return dist[F] and the route to F through prev']),
 flow:{w:560,h:480,nodes:[term('start',260,24,90,30,L('Start')),proc('init',260,74,300,30,L('dist[A] ← 0, others ← ∞')),dec('qcheck',260,146,280,60,L('town left with dist < ∞ ?')),term('done',480,146,120,30,L('return route')),proc('take',260,222,330,30,L('c ← closest unfinished; finish c')),dec('nb',260,300,390,60,L('another road c–d, d unfinished ?')),dec('cmp',260,390,330,60,Q('dist[c] + length < dist[d]')),proc('upd',260,456,360,30,'dist[d] ← dist[c] + length; prev[d] ← c')],
  edges:[['start','init',[[260,39],[260,59]]],['init','qcheck',[[260,89],[260,116]]],['qcheck','take',[[260,176],[260,207]],YES,[268,194]],['qcheck','done',[[400,146],[420,146]],NO,[402,138]],['take','nb',[[260,237],[260,270]]],['nb','cmp',[[260,330],[260,360]],YES,[268,348]],['nb','qcheck',[[455,300],[552,300],[552,106],[260,106],[260,116]],NO,[460,292]],['cmp','upd',[[260,420],[260,441]],YES,[268,434]],['cmp','nb',[[95,390],[40,390],[40,300],[65,300]],NO,[60,382]],['upd','nb',[[80,456],[24,456],[24,300],[65,300]]]]},
 code:{
  python:{lines:['def dijkstra(roads, n, start, goal):','    near = [[] for _ in range(n)]','    for u, v, length in roads:','        near[u].append((v, length))','        near[v].append((u, length))','    dist = [float("inf")] * n','    prev = [None] * n','    finished = [False] * n','    dist[start] = 0','    while True:','        c = closest_unfinished(dist, finished)','        if c is None:','            break','        finished[c] = True','        for d, length in near[c]:','            if not finished[d] and dist[c] + length < dist[d]:','                dist[d] = dist[c] + length','                prev[d] = c','    return dist[goal], route_to(prev, goal)','','# Helpers. Towns are 0, 1, …, n − 1; each road is (u, v, length).','def closest_unfinished(dist, finished):','    best = None','    for t in range(len(dist)):','        if not finished[t] and dist[t] < float("inf") and (best is None or dist[t] < dist[best]):','            best = t','    return best','','def route_to(prev, c):','    route = []','    while c is not None:','        route.append(c)','        c = prev[c]','    return route[::-1]'],map:[[2,3,4,5,6,7,8,9],[10,12,13],[11,14],[15],[16,17,18],[19]]},
  java:{lines:['// At the top of the file: import java.util.*;','static int dijkstra(int[][] roads, int n, int start, int goal, List<Integer> route) {','    List<List<int[]>> near = new ArrayList<>();','    for (int t = 0; t < n; t++) near.add(new ArrayList<>());','    for (int[] r : roads) {','        near.get(r[0]).add(new int[]{r[1], r[2]});','        near.get(r[1]).add(new int[]{r[0], r[2]});','    }','    int[] dist = new int[n], prev = new int[n];','    boolean[] finished = new boolean[n];','    Arrays.fill(dist, Integer.MAX_VALUE);','    Arrays.fill(prev, -1);','    dist[start] = 0;','    while (true) {','        int c = -1;','        for (int t = 0; t < n; t++) {','            if (!finished[t] && dist[t] != Integer.MAX_VALUE && (c == -1 || dist[t] < dist[c])) c = t;','        }','        if (c == -1) break;','        finished[c] = true;','        for (int[] e : near.get(c)) {','            int d = e[0], length = e[1];','            if (!finished[d] && dist[c] + length < dist[d]) {','                dist[d] = dist[c] + length;','                prev[d] = c;','            }','        }','    }','    for (int c = goal; c != -1; c = prev[c]) route.add(0, c);','    return dist[goal];','}'],map:[[3,4,5,6,7,8,9,10,11,12,13],[14,19],[15,16,17,18,20],[21,22],[23,24,25],[29,30]]},
  matlab:{lines:['function [d_goal, route] = dijkstra(roads, n, start, goal)','    % roads has one row [u v length] per road; towns are 1 to n.','    dist = inf(1, n);','    prev = zeros(1, n);','    finished = false(1, n);','    dist(start) = 0;','    while true','        todo = find(~finished & dist < inf);','        if isempty(todo)','            break','        end','        [~, k] = min(dist(todo));','        c = todo(k);','        finished(c) = true;','        for r = 1:size(roads, 1)','            u = roads(r, 1); v = roads(r, 2);','            if u == c || v == c','                d = u + v - c;','                if ~finished(d) && dist(c) + roads(r, 3) < dist(d)','                    dist(d) = dist(c) + roads(r, 3);','                    prev(d) = c;','                end','            end','        end','    end','    d_goal = dist(goal);','    route = goal;','    while prev(route(1)) ~= 0','        route = [prev(route(1)), route];','    end','end'],map:[[3,4,5,6],[7,8,9,10,11],[12,13,14],[15,16,17,18],[19,20,21],[26,27,28,29,30]]}},
 teach:[
  {step:L('A is 0 away from itself. No route to any other town is known yet, so their distances start at ∞.'),python:L('near lists each town’s roads, both ways; float("inf") is ∞.'),java:L('Integer.MAX_VALUE stands for ∞; near lists each town’s roads.'),matlab:L('inf(1, n) gives a row of ∞; towns are numbered from 1.')},
  {step:L('Keep going while some unfinished town can be reached.'),python:L('The loop stops when closest_unfinished finds nothing.'),java:L('c stays −1 when no town is left.'),matlab:L('find lists the unfinished towns with dist < inf.')},
  {step:L('Finish the closest unfinished town. Its distance is final: any other route would leave the finished towns through a town at least as far away.'),python:L('closest_unfinished checks every town; ties go to the first.'),java:L('The for loop checks every town; ties go to the first.'),matlab:L('min returns the first position of the smallest dist.')},
  {step:L('Look along each road from c to a town that is not finished.'),python:L('near[c] holds (town, length) pairs.'),java:L('Each entry of near.get(c) is {town, length}.'),matlab:L('u + v − c is the town at the other end of the road.')},
  {step:L('Going through c may be shorter than the best route known to d. If so, remember the new distance and that it comes from c.'),python:L('prev[d] = c records where the route to d comes from.'),java:L('dist[c] is never ∞ here, so adding a length cannot overflow.'),matlab:L('roads(r, 3) is the road’s length.')},
  {step:L('dist[F] is the shortest distance. Following prev back from F gives the route.'),python:L('route_to walks back and reverses the list.'),java:L('route.add(0, c) puts each town at the front.'),matlab:L('prev is 0 at A, where the route starts.')}],
 defaults:{roads:[4,1,2,5,8,10,2,6,3]},
 trace:L(['Check','c','d','dist[c] + length','dist[d]','shorter?']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const len=input.roads,roads=mapRoads(len),near=nearList(TN,roads),dist=new Array(TN).fill(Infinity),prev=new Array(TN).fill(-1),fin=new Array(TN).fill(false),E=[],S=0,G=TN-1,ref=dijkstraRun(TN,roads,S,G),walk=nearestWalk(TN,roads,S,G),T=i=>TOWNS[i];
  const known=()=>[...Array(TN).keys()].filter(i=>!fin[i]&&dist[i]<Infinity).sort((x,y)=>dist[x]-dist[y]||x-y);
  const view=(x={})=>({roads:len,dist:dist.map(D),fin:[...fin],tree:prev.map((p,i)=>p<0?-1:RI[p+'-'+i]).filter(r=>r>=0),...x});
  const skipped=list=>list.length?L(`${list.join(', ')} ${list.length===1?'is':'are'} already finished. `):L('');
  E.push({line:-1,node:'start',note:L('Find the shortest route from A to F. The number on each road is its length.'),...view(),ask:shuffle({q:L('Before you start: how long is the shortest route from A to F?'),options:nums(uniq([ref.dist,!walk.stuck&&walk.len!==ref.dist?walk.len:ref.dist+1,ref.dist+2])),answer:0,why:L(`The route ${ref.route.map(T).join(' → ')} has length ${ref.dist}, and no route is shorter.`)},rnd)});
  dist[S]=0;
  E.push({line:0,node:'init',chip:L('dist[A] = 0'),note:L('A is <b>0</b> away from itself. Every other town starts at <b>∞</b>: no route to it is known yet.'),...view()});
  for(;;){const open=known(),go=open.length>0;
   E.push({line:1,node:'qcheck',chip:go?L(`${open.length} waiting`):L('none left'),note:go?L(`Unfinished towns with a known distance: ${[...open].sort((x,y)=>x-y).map(i=>`${T(i)} (${dist[i]})`).join(', ')}.`):L('Every town is finished.'),...view()});
   if(!go)break;const c=open[0],farther=open.filter(x=>dist[x]>dist[c]),opts=[...new Set([c,farther[0],farther.at(-1)])].filter(x=>x!==undefined);
   const ask=opts.length>=2?shuffle({q:L('Which town is finished next?'),options:L(opts.map(T)),answer:0,why:L(`${T(c)} has the smallest distance among the unfinished towns: ${dist[c]}.${open.some(x=>x!==c&&dist[x]===dist[c])?' On a tie, the town that comes first in the alphabet is finished first.':''}`)},rnd):null;
   fin[c]=true;
   E.push({line:2,node:'take',chip:L(`${T(c)}: ${dist[c]}`),note:c===S?L('Finish A, the only town with a known distance.'):L(`Finish ${T(c)}, the closest unfinished town: dist[${T(c)}] = <b>${dist[c]}</b> is final. Any other route to ${T(c)} would leave the finished towns through a town at least as far away, and no road has a negative length.`),...view({current:c}),ask});
   let skip=[];
   for(const [d,w,ri] of near[c]){if(fin[d]){skip.push(T(d));continue;}
    const pre=skipped(skip);skip=[];
    E.push({line:3,node:'nb',chip:L(`${T(c)}–${T(d)}: ${w}`),note:L(`${pre.en}The road ${T(c)}–${T(d)} has length ${w}, and ${T(d)} is not finished.`),...view({current:c,look:ri})});
    const cand=dist[c]+w,had=dist[d],better=cand<had;
    E.push({line:4,node:'cmp',chip:L(`${cand} < ${D(had)}? ${better?'yes':'no'}`),note:L(`Through ${T(c)}: ${dist[c]} + ${w} = ${cand}. Is that less than dist[${T(d)}] = ${D(had)}? <b>${better?'Yes':'No'}</b>.`),...view({current:c,look:ri}),row:[T(c),T(d),cand,D(had),better?YES:NO],
     ask:had===Infinity?null:{q:L(`dist[${T(d)}] = ${had}. Is the route through ${T(c)}, ${dist[c]} + ${w} = ${cand}, shorter?`),options:yesNo,answer:better?0:1,why:better?L(`${cand} is less than ${had}, so the route through ${T(c)} replaces the one found before.`):L(`${cand} is not less than ${had}, so the route found before stays.`)}});
    if(better){dist[d]=cand;prev[d]=c;E.push({line:4,node:'upd',chip:L(`dist[${T(d)}] = ${cand}`),note:had===Infinity?L(`The first route found to ${T(d)}: <b>dist[${T(d)}] = ${cand}</b>, coming from ${T(c)}.`):L(`A shorter route: <b>dist[${T(d)}] = ${cand}</b> instead of ${had}, now coming from ${T(c)}.`),...view({current:c,look:ri,fresh:d})});}}
   const pre=skipped(skip);
   E.push({line:3,node:'nb',chip:L('no more roads'),note:L(`${pre.en}No more roads from ${T(c)} to an unfinished town.`),...view({current:c})});}
  const route=[];for(let x=G;x!==-1;x=prev[x])route.unshift(x);
  E.push({line:5,node:'done',note:L(`dist[F] = <b>${dist[G]}</b>. Follow prev back from F: <b>${route.map(T).join(' → ')}</b>.`),...view({path:route,pathRoads:route.slice(1).map((x,i)=>RI[route[i]+'-'+x])}),done:true});return E;}
};

/* ---------------- #15 Spanning trees: Kruskal's method ---------------- */
const kruskal={num:15,id:'kruskal',level:L('University'),kind:'graph',
 name:L('Spanning trees: Kruskal’s method'),
 problem:L('Choose roads that join every town using as little road as possible in total: a minimum spanning tree. Take the roads from shortest to longest, and skip any road whose towns are already joined.'),
 pseudo:L(['sort the roads from shortest to longest','put every town in a group of its own','for each road (u, v) in that order:','    if u and v are in different groups:','        keep the road;  merge the two groups into one','the kept roads join every town with the least total length']),
 flow:{w:560,h:410,nodes:[term('start',240,24,90,30,L('Start')),proc('sort',240,74,300,30,L('sort roads, shortest first')),proc('groups',240,124,300,30,L('each town: its own group')),dec('rcheck',240,196,260,58,L('another road (u, v) ?')),term('done',475,196,170,30,L('return kept roads')),dec('diff',240,284,280,60,Q('group(u) ≠ group(v)')),proc('keep',240,370,320,30,L('keep it; merge the two groups'))],
  edges:[['start','sort',[[240,39],[240,59]]],['sort','groups',[[240,89],[240,109]]],['groups','rcheck',[[240,139],[240,167]]],['rcheck','diff',[[240,225],[240,254]],YES,[248,243]],['rcheck','done',[[370,196],[390,196]],NO,[372,188]],['diff','keep',[[240,314],[240,355]],YES,[248,336]],['diff','rcheck',[[100,284],[40,284],[40,155],[240,155],[240,167]],NO,[70,276]],['keep','rcheck',[[80,370],[24,370],[24,155],[240,155],[240,167]]]]},
 code:{
  python:{lines:['def kruskal(roads, n):','    # roads: a list of (u, v, length); towns are 0, 1, …, n − 1.','    order = sorted(roads, key=lambda r: r[2])','    group = list(range(n))','    kept = []','    for u, v, length in order:','        if group[u] != group[v]:','            kept.append((u, v, length))','            old = group[v]','            group = [group[u] if g == old else g for g in group]','    return kept'],map:[[3],[4,5],[6],[7],[8,9,10],[11]]},
  java:{lines:['// At the top of the file: import java.util.*;','static List<int[]> kruskal(int[][] roads, int n) {','    int[][] order = roads.clone();','    Arrays.sort(order, (x, y) -> Integer.compare(x[2], y[2]));','    int[] group = new int[n];','    for (int t = 0; t < n; t++) group[t] = t;','    List<int[]> kept = new ArrayList<>();','    for (int[] r : order) {','        if (group[r[0]] != group[r[1]]) {','            kept.add(r);','            int old = group[r[1]];','            for (int t = 0; t < n; t++) {','                if (group[t] == old) group[t] = group[r[0]];','            }','        }','    }','    return kept;','}'],map:[[3,4],[5,6,7],[8],[9],[10,11,12,13],[17]]},
  matlab:{lines:['function kept = kruskal(roads, n)','    % roads has one row [u v length] per road; towns are 1 to n.','    [~, order] = sort(roads(:, 3));','    group = 1:n;','    kept = zeros(0, 3);','    for r = order\'','        u = roads(r, 1); v = roads(r, 2);','        if group(u) ~= group(v)','            kept(end+1, :) = roads(r, :);','            group(group == group(v)) = group(u);','        end','    end','end'],map:[[3],[4,5],[6,7],[8],[9,10],[13]]}},
 teach:[
  {step:L('Line the roads up from shortest to longest. Roads of the same length keep their listed order.'),python:L('sorted is stable: equal lengths keep their order.'),java:L('Arrays.sort on arrays of objects is stable too.'),matlab:L('sort is stable, and its second output is the order of the rows.')},
  {step:L('At first no road is chosen, so each town is a group by itself.'),python:L('group[t] names the group of town t; kept starts empty.'),java:L('group[t] = t: every town starts as its own group.'),matlab:L('1:n gives every town its own group number.')},
  {step:L('Look at each road once, shortest first.'),python:L('The for loop unpacks each road into u, v and length.'),java:L('r[0] and r[1] are the towns, r[2] the length.'),matlab:L('order\' turns the column into a row, so for takes one road at a time.')},
  {step:L('If its towns are already joined, the road would only close a loop: skip it.'),python:L('Different group names mean the towns are not joined yet.'),java:L('The same test in Java.'),matlab:L('~= means “is not equal to”.')},
  {step:L('Otherwise keep it: the two groups become one.'),python:L('Every town of v’s group takes the name of u’s group.'),java:L('The inner loop renames v’s group.'),matlab:L('group == group(v) picks every town of v’s group at once.')},
  {step:L('The kept roads join every town, with the least total length possible.'),python:L('Return the kept roads.'),java:L('Return the kept roads.'),matlab:L('kept has one row per kept road.')}],
 defaults:{roads:[4,1,2,5,8,10,2,6,3]},
 trace:L(['Road','length','different groups?']),
 gen(_a,_t,rnd=Math.random,_p,input={}){const len=input.roads,roads=mapRoads(len),order=ROADS.map((_,i)=>i).sort((x,y)=>len[x]-len[y]||x-y),group=TOWNS.map((_,i)=>i),kept=[],skipped=[],E=[],ref=kruskalRun(TN,roads),R=roadName;
  const groupOf=t=>`{${TOWNS.filter((_,s)=>group[s]===group[t]).join(', ')}}`;
  const groups=()=>[...new Set(group)].map(g=>`{${TOWNS.filter((_,s)=>group[s]===g).join(', ')}}`).join(' ');
  const view=(x={})=>({roads:len,order,kept:[...kept],skipped:[...skipped],groups:groups(),...x});
  const short=kruskalRun(TN,roads,3).total;
  E.push({line:-1,node:'start',note:L('Join all six towns with as little road as possible. The number on each road is its length.'),...view(),ask:shuffle({q:L('Before you start: what will the lengths of the kept roads add up to?'),options:nums(uniq([ref.total,short!==ref.total?short:ref.total+1,ref.total+3])),answer:0,why:L(`Kruskal’s method keeps ${ref.kept.map(R).join(', ')}: ${ref.kept.map(i=>len[i]).join(' + ')} = ${ref.total}.`)},rnd)});
  E.push({line:0,node:'sort',chip:L(order.map(R).join(' ')),note:L(`Sort the roads from shortest to longest: ${order.map(i=>`${R(i)} ${len[i]}`).join(', ')}. Roads of the same length keep their listed order.`),...view()});
  E.push({line:1,node:'groups',chip:L('6 groups'),note:L(`Every town starts in a group of its own: ${groups()}.`),...view()});
  for(let k=0;;k++){const more=k<order.length,i=order[k];
   E.push({line:2,node:'rcheck',chip:more?L(`${R(i)}: ${len[i]}`):L('no roads left'),note:more?L(`Next road: <b>${R(i)}</b>, length ${len[i]}.`):L('Every road has been looked at.'),...view(more?{look:i}:{})});
   if(!more)break;const [p,q]=ROADS[i],diff=group[p]!==group[q];
   E.push({line:3,node:'diff',chip:L(`${diff?'different':'same group'}`),note:diff?L(`${TOWNS[p]} is in ${groupOf(p)} and ${TOWNS[q]} is in ${groupOf(q)}: <b>different groups</b>.`):L(`${TOWNS[p]} and ${TOWNS[q]} are both in ${groupOf(p)}: <b>the same group</b>. The road would close a loop, so skip it.`),...view({look:i}),row:[R(i),len[i],diff?YES:NO],
    ask:{q:L(`Will the road ${R(i)} be kept?`),options:yesNo,answer:diff?0:1,why:diff?L(`${TOWNS[p]} and ${TOWNS[q]} are in different groups, so the road joins them.`):L(`${TOWNS[p]} and ${TOWNS[q]} are already joined, so the road would close a loop.`)}});
   if(!diff){skipped.push(i);continue;}
   kept.push(i);const old=group[q];for(let t=0;t<TN;t++)if(group[t]===old)group[t]=group[p];
   E.push({line:4,node:'keep',chip:L(`${kept.length} kept`),note:L(`Keep ${R(i)} and merge the two groups: ${groupOf(p)}.`),...view({look:i,fresh:i})});}
  const total=kept.reduce((s,i)=>s+len[i],0);
  E.push({line:5,node:'done',note:L(`The kept roads ${kept.map(R).join(', ')} join every town, with total length <b>${total}</b>. No other set of roads that joins every town is shorter.`),...view(),done:true});return E;}
};

/* ---------------- #16 P versus NP: subset sum ---------------- */
const subsetOf=(a,mask)=>a.filter((_,i)=>mask>>i&1);
const setText=s=>s.length?`{${s.join(', ')}}`:'{ }';
// Brute force: masks 0, 1, 2, … in order; returns the first subset that works and how many were tried.
function subsetRun(a,t){const n=a.length;for(let m=0;m<2**n;m++){const s=subsetOf(a,m);if(s.reduce((x,y)=>x+y,0)===t)return{mask:m,set:s,tried:m+1};}return{mask:-1,set:null,tried:2**n};}
function greedySubset(a,t){const out=[];let sum=0;for(const x of [...a].sort((p,q)=>q-p))if(sum+x<=t){out.push(x);sum+=x;}return{set:out,sum,ok:sum===t};}
// v: 0 every subset (as taught). 1 sorted, built one number at a time, dropping a partial subset once its sum passes
// the target. 2 only subsets of at most 3 numbers (broken). 3 largest first (broken). Counts the subsets looked at.
function subsetVariant(a,t,v){if(v===0){const r=subsetRun(a,t);return{set:r.set,tried:r.tried};}
 if(v===3){const g=greedySubset(a,t);return{set:g.ok?g.set:null,tried:1};}
 const s=[...a].sort((p,q)=>p-q);let tried=0,found=null;
 const go=(i,sum,picked)=>{tried++;if(sum===t){found=[...picked];return true;}if(v===2&&picked.length===3)return false;
  for(let j=i;j<s.length;j++){if(v===1&&sum+s[j]>t)break;picked.push(s[j]);if(go(j+1,sum+s[j],picked))return true;picked.pop();}return false;};
 go(0,0,[]);return{set:found,tried};}
const subset={num:16,id:'subset-sum',level:L('University'),kind:'subset',
 name:L('P versus NP: subset sum'),
 problem:L('Find some of the numbers that add up exactly to a target. Checking a proposed answer is quick: add it up. This method tries every subset, and n numbers have 2ⁿ of them. Whether every problem whose answers can be checked quickly can also be solved quickly is the P versus NP question, which is still open.'),
 pseudo:L(['for mask from 0 to 2ⁿ − 1:','    S ← the numbers a[i] whose bit i in mask is 1','    if the sum of S = target: return S','return “no subset”']),
 flow:{w:520,h:410,nodes:[term('start',240,24,90,30,L('Start')),proc('init',240,74,140,30,'mask ← 0'),dec('mcheck',240,142,200,56,Q('mask < 2ⁿ')),term('none',440,142,150,30,L('no subset')),proc('pick',240,212,320,30,L('S ← a[i] where bit i of mask is 1')),dec('test',240,288,220,58,Q('sum(S) = target')),term('found',440,288,130,30,L('return S')),proc('inc',240,376,170,30,'mask ← mask + 1')],
  edges:[['start','init',[[240,39],[240,59]]],['init','mcheck',[[240,89],[240,114]]],['mcheck','pick',[[240,170],[240,197]],YES,[248,186]],['mcheck','none',[[340,142],[365,142]],NO,[344,134]],['pick','test',[[240,227],[240,259]]],['test','found',[[350,288],[375,288]],YES,[354,280]],['test','inc',[[240,317],[240,361]],NO,[248,340]],['inc','mcheck',[[155,376],[40,376],[40,104],[240,104],[240,114]]]]},
 code:{
  python:{lines:['def subset_sum(a, target):','    n = len(a)','    for mask in range(2 ** n):','        s = [a[i] for i in range(n) if mask >> i & 1]','        if sum(s) == target:','            return s','    return None'],map:[[2,3],[4],[5,6],[7]]},
  java:{lines:['// At the top of the file: import java.util.*;','static List<Integer> subsetSum(int[] a, int target) {','    int n = a.length;','    for (int mask = 0; mask < (1 << n); mask++) {','        List<Integer> s = new ArrayList<>();','        int sum = 0;','        for (int i = 0; i < n; i++) {','            if ((mask >> i & 1) == 1) {','                s.add(a[i]);','                sum += a[i];','            }','        }','        if (sum == target) {','            return s;','        }','    }','    return null;','}'],map:[[3,4],[5,6,7,8,9,10],[13,14],[17]]},
  matlab:{lines:['function s = subset_sum(a, target)','    % a is a row vector; bit i of mask, counted from 0, picks a(i + 1).','    n = numel(a);','    for mask = 0:2^n - 1','        s = a(bitget(mask, 1:n) == 1);','        if sum(s) == target','            return','        end','    end','    s = [];','end'],map:[[3,4],[5],[6,7],[10]]}},
 teach:[
  {step:L('Count mask from 0 up to 2ⁿ − 1: its n binary digits say which numbers are in, so every subset comes up exactly once.'),python:L('2 ** n is 2 to the power n.'),java:L('1 << n is 2ⁿ: the bit 1 moved n places left.'),matlab:L('2^n is 2 to the power n.')},
  {step:L('Bit i of mask, counted from 0 on the right, says whether a[i] is in S.'),python:L('mask >> i & 1 is bit i of mask.'),java:L('The inner loop adds up S while it builds it.'),matlab:L('bitget(mask, 1:n) lists the bits from the right, counted from 1.')},
  {step:L('Check the proposed answer: quick, just one sum.'),python:L('sum(s) adds up the list.'),java:L('sum was added up in the loop above.'),matlab:L('return leaves with the current s.')},
  {step:L('After all 2ⁿ subsets, there is no answer.'),python:L('None means “no subset”.'),java:L('null means “no subset”.'),matlab:L('An empty s means “no subset”.')}],
 defaults:{list:[5,8,3,9,6],target:20},
 trace:L(['mask','binary','S','sum','= target?']),
 gen(a0,t,rnd=Math.random){const a=[...a0],n=a.length,N=2**n,E=[],bits=m=>m.toString(2).padStart(n,'0');
  const view=(m,x={})=>({arr:a,mask:m,bits:m==null?null:bits(m),target:t,...x});
  E.push({line:-1,node:'start',note:L(`Find numbers among ${a.join(', ')} that add up to ${t}.`),...view(null),ask:shuffle({q:L(`Before you start: how many subsets do these ${n} numbers have, counting the empty one?`),options:nums(uniq([N,n*n,2*n])),answer:0,why:L(`Each number is either in or out: 2 × 2 × … × 2 = 2^${n} = ${N}.`)},rnd)});
  E.push({line:0,node:'init',chip:L('mask = 0'),note:L('Start with <b>mask = 0</b>: no bit is 1, so S is empty.'),...view(0)});
  for(let m=0;;m++){const go=m<N;
   E.push({line:0,node:'mcheck',chip:go?L(`mask = ${m}`):L(`mask = ${N}`),note:go?L(`Is mask = ${m} &lt; 2^${n} = ${N}? Yes.`):L(`Is mask = ${m} &lt; ${N}? No: every subset has been tried.`),...view(go?m:null)});
   if(!go)break;const S=subsetOf(a,m),on=[...Array(n).keys()].filter(i=>m>>i&1);
   // The first fifteen subsets are the ones of the first four numbers: enough to learn to read the bits.
   const rev=parseInt(bits(m).split('').reverse().join(''),2),opts=[...new Set([setText(S),setText(subsetOf(a,rev)),setText(subsetOf(a,(N-1)^m))])];
   const ask=m>=1&&m<16&&opts.length>=2?shuffle({q:L(`mask = ${m} is ${bits(m)} in binary. Which numbers does it pick?`),options:L(opts),answer:0,why:L(`Read the bits from the right, starting at bit 0: ${on.length?`bit${on.length>1?'s':''} ${on.join(', ')} ${on.length>1?'are':'is'} 1, so S = ${setText(S)}`:'no bit is 1, so S is empty'}.`)},rnd):null;
   E.push({line:1,node:'pick',chip:L(bits(m)),note:L(`mask = ${m} is <b>${bits(m)}</b> in binary. ${on.length?`Bit${on.length>1?'s':''} ${on.join(', ')}, counted from the right, ${on.length>1?'are':'is'} 1, so S = <b>${setText(S)}</b>.`:'No bit is 1, so S is empty.'}`),...view(m,{on}),ask});
   const sum=S.reduce((x,y)=>x+y,0),hit=sum===t;
   E.push({line:2,node:'test',chip:L(`sum = ${sum}`),note:L(`The sum of S is ${S.length?S.join(' + ')+' = ':''}${sum}. Is it ${t}? <b>${hit?'Yes':'No'}</b>.`),...view(m,{on,sum}),row:[m,bits(m),setText(S),sum,hit?YES:NO]});
   if(hit){E.push({line:2,node:'found',note:L(`Return S = <b>${setText(S)}</b>: it adds up to ${t}. That took ${m+1} of the ${N} subsets.`),...view(m,{on,sum,hit:on}),done:true});return E;}
   E.push({line:0,node:'inc',chip:L(`mask = ${m+1}`),note:L(`Next subset: <b>mask = ${m+1}</b>.`),...view(m,{on,sum})});}
  E.push({line:3,node:'none',note:L(`All ${N} subsets were tried, and none adds up to ${t}.`),...view(null),done:true});return E;}
};

const ALGS={'find-max':findMax,'linear-search':linear,'bubble-sort':bubble,'insertion-sort':insertion,euclid,'binary-search':binary,'merge-sort':merge,hanoi,bfs,dfs,'greedy-change':greedy,quicksort:quick,'fewest-coins':dp,dijkstra,kruskal,'subset-sum':subset};
const ORDER=['find-max','linear-search','bubble-sort','insertion-sort','euclid','binary-search','merge-sort','hanoi','bfs','dfs','greedy-change','quicksort','fewest-coins','dijkstra','kruskal','subset-sum'];

/* ---------------- Route map ---------------- */
const MAP={rows:[[L('MIDDLE SCHOOL'),50],[L('HIGH SCHOOL'),160],[L('UNIVERSITY'),270]],nodes:[
 [1,L('Find the\nmaximum'),85,50],[2,L('Linear search'),235,50],[3,L('Bubble sort'),385,50],[4,L('Insertion sort'),535,50],[5,L('Euclid’s\nalgorithm'),685,50],
 [10,L('Depth-first\nsearch'),85,160],[6,L('Binary search'),235,160],[7,L('Merge sort'),385,160],[8,L('Recursion:\nTower of Hanoi'),535,160],[11,L('Greedy change'),685,160],[9,L('Breadth-first\nsearch'),835,160],
 [16,L('P versus NP'),85,270],[15,L('Spanning trees'),235,270],[12,L('Quicksort'),385,270],[13,L('Dynamic\nprogramming'),685,270],[14,L('Dijkstra’s\nshortest paths'),835,270]],
 edges:[[1,2],[2,6,L('sorted: halve it')],[3,4],[3,7,L('divide and merge')],[4,7],[5,8],[8,7],[7,12],[10,15],[11,13,L('greedy can fail')],[9,14,L('add weights')],[6,7]]};
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
const BUILD={cond:L(['low ≤ high','low < high','i < n']),
 steps:L(['(nothing)','mid ← ⌊(low + high) / 2⌋','if a[mid] = target: return mid','if a[mid] < target: low ← mid + 1, else: high ← mid − 1','if a[mid] < target: low ← mid, else: high ← mid','i ← i + 1'])};
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

/* ---------------- Challenge checks for #6 to #11 ---------------- */
// #6 counterexample: "if the target is in the list, binary search finds it".
function checkBinary(list,t){const r=binaryRun(list,t),present=list.includes(t);return{present,index:r.index,sortedList:sorted(list),counter:present&&r.index<0};}
// #6 improvement: return the first position of a repeated target. 0: as taught. 1: on a match, remember mid and keep
// searching left. 2: on a match, step left one item at a time. 3: on a match, keep searching right (a broken change).
function binaryFirst(a,t,v){let low=0,high=a.length-1,checks=0,found=-1;
 while(low<=high){const mid=Math.floor((low+high)/2);checks++;
  if(a[mid]===t){if(v===0)return{index:mid,checks};if(v===2){let k=mid;while(k>0){checks++;if(a[k-1]!==t)break;k--;}return{index:k,checks};}found=mid;if(v===1)high=mid-1;else low=mid+1;}
  else if(a[mid]<t)low=mid+1;else high=mid-1;}
 return{index:found,checks};}
function testFirst(v,rnd=Math.random){const n=50,kinds={repeats:()=>Array.from({length:n},()=>Math.floor(rnd()*10)).sort((x,y)=>x-y),equal:()=>Array(n).fill(7),distinct:()=>sample(n,rnd)};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const a=f(),x=a[Math.floor(rnd()*n)],r=binaryFirst(a,x,v);if(r.index===a.indexOf(x))ok++;base=Math.max(base,binaryFirst(a,x,0).checks);mine=Math.max(mine,r.checks);}if(ok<100)correct=false;rows.push([k,ok,base,mine]);}
 return{v,rows,correct};}
// #7 counterexample: "merge sort always makes fewer comparisons than insertion sort".
function checkMerge(list){const m=mergeCounts(list).comps,ins=insertionCounts(list).comps;return{merge:m,ins,counter:m>=ins};}
// #7 improvement. 0: as taught. 1: skip a merge when the left run already ends below the right run's start. 2: compare only the first items (a broken change).
function testMergeImprove(v,rnd=Math.random){const n=64,o=v===1?{skip:true}:v===2?{firstOnly:true}:{};
 const kinds={random:()=>Array.from({length:n},()=>Math.floor(rnd()*1000)),nearly:()=>{const a=[...Array(n).keys()];for(let k=0;k<3;k++){const i=Math.floor(rnd()*(n-1));[a[i],a[i+1]]=[a[i+1],a[i]];}return a;},reversed:()=>[...Array(n).keys()].reverse()};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const a=f(),r=mergeCounts(a,o);if(r.sorted)ok++;base+=mergeCounts(a).comps;mine+=r.comps;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}
// #8: what breaks when one line changes. Simulated on 3 disks, with every move checked against the rules.
const HANOI_BREAKS=['nobase','nosecond','nomove'],HANOI_OUTCOMES=['forever','wrongplace','illegal','works'];
function hanoiBreak(change,N=3){const pegs={A:[],B:[],C:[]};for(let d=N;d>=1;d--)pegs.A.push(d);let calls=0,illegal=false;
 const move=(n,from,to)=>{const d=pegs[from].at(-1);if(d===undefined||(pegs[to].length&&pegs[to].at(-1)<d))illegal=true;else pegs[to].push(pegs[from].pop());};
 const h=(n,from,to,via)=>{if(++calls>5000||illegal)throw 0;if(n===0&&change!=='nobase')return;if(n<-50)throw 0;
  h(n-1,from,via,to);if(illegal)throw 0;if(change!=='nomove')move(n,from,to);if(illegal)throw 0;if(change!=='nosecond')h(n-1,via,to,from);};
 try{h(N,'A','C','B');}catch{return illegal?'illegal':'forever';}
 return pegs.C.length===N?'works':'wrongplace';}
function hanoiCounts(N){const p=2**N;return{start:1,base:2*p-1,ret:p,call1:p-1,move:p-1,call2:p-1,end:p-1};}
// How often each flowchart box runs on a given input, read from the trace itself.
function traceCounts(key,input){const g=ALGS[key],E=g.gen(input.list,input.target,()=>0,[input.a,input.b],input),c={};for(const n of g.flow.nodes)c[n.id]=0;for(const e of E)if(e.node in c)c[e.node]++;return c;}
// #9 counterexample: with mud cells costing 3, the path BFS finds may not be the cheapest.
function checkMud(maze){const r=bfsRun(maze);if(!r.found)return{found:false};const cost=pathCost(maze,r.path),best=cheapest(maze),mud=parseMaze(maze).split('').filter(ch=>ch==='~').length;return{found:true,steps:r.path.length-1,cost,best,mud,counter:cost>best};}
// #10 counterexample: "DFS finds a shortest path".
function checkDfs(maze){const d=dfsRun(maze),b=bfsRun(maze);if(!b.found)return{found:false};return{found:true,dfs:d.path.length-1,bfs:b.path.length-1,counter:d.path.length>b.path.length};}
// #10 improvement. 0: as taught. 1: take the free neighbour closest to G first. 2: look only right and down (a broken change).
const SNAKE='.......'+'######.'+'.......'+'.######'+'.......';
function testDfsImprove(v,rnd=Math.random){const o=v===1?{toward:true}:v===2?{only2:true}:{},kinds={open:()=>'.'.repeat(GN),sparse:()=>randomMaze(rnd,.2),dense:()=>randomMaze(rnd,.35)};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const m=k==='dense'&&t===0?SNAKE:f(),want=bfsRun(m).found,r=dfsRun(m,o);if(r.found===want)ok++;base+=dfsRun(m).marked;mine+=r.marked;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}
// #11 counterexample: "taking the largest coin first always uses the fewest coins".
function checkGreedy(coins,amount){const g=greedyRun(coins,amount),best=fewestCoins(coins,amount);return{greedy:g.left?null:g.taken.length,greedyCoins:g.taken,left:g.left,best:best===Infinity?null:best,bestCoins:fewestSet(coins,amount),counter:best!==Infinity&&(g.left>0||g.taken.length>best)};}
// #11 improvement. 0: subtract one coin at a time. 1: take ⌊amount / c⌋ coins of c at once. 2: use only the largest coin (a broken change).
function changeSteps(coins,amount,v){const cs=[...new Set(coins)].sort((x,y)=>y-x),out=[];let left=amount,steps=0;
 for(const c of v===2?cs.slice(0,1):cs){if(v===0){while(left>=c){steps++;out.push(c);left-=c;}}else{const k=Math.floor(left/c);steps++;for(let i=0;i<k;i++)out.push(c);left-=k*c;}}
 return{coins:out,left,steps};}
function testChange(v,rnd=Math.random){const coins=[25,10,5,1],kinds={small:()=>1+Math.floor(rnd()*99),medium:()=>100+Math.floor(rnd()*9900),large:()=>10000+Math.floor(rnd()*990000)};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const amt=f(),r=changeSteps(coins,amt,v),g=greedyRun(coins,amt);if(!r.left&&r.coins.join()===g.taken.join())ok++;base+=changeSteps(coins,amt,0).steps;mine+=r.steps;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}

/* ---------------- Challenge checks for #12 to #16 ---------------- */
// #12 counterexample: "like insertion sort, quicksort has less work to do when the list is already sorted".
function checkQuick(list){const given=quickRun(list).comps,sortedComps=quickRun([...list].sort((x,y)=>x-y)).comps;return{given,sortedComps,already:sorted(list),counter:sortedComps>given};}
// #12 improvement: the pivot. 0 the last item (as taught), 1 the middle item, 2 a random item, 3 the first item.
function testPivot(v,rnd=Math.random){const n=64,pick=['last','middle',rnd,'first'][v],kinds={random:()=>Array.from({length:n},()=>Math.floor(rnd()*1000)),sorted:()=>[...Array(n).keys()],reversed:()=>[...Array(n).keys()].reverse()};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const a=f(),r=quickRun(a,pick);if(r.sorted)ok++;base+=quickRun(a).comps;mine+=r.comps;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}
// #14 counterexample: "walking along the shortest road to a new town, again and again, reaches F by a shortest route".
function checkWalk(len){const roads=mapRoads(len),w=nearestWalk(TN,roads,0,TN-1),d=dijkstraRun(TN,roads,0,TN-1);return{stuck:w.stuck,at:w.stuck?w.at:null,walk:w.len,walkRoute:w.route,best:d.dist,bestRoute:d.route,counter:w.stuck||w.len>d.dist};}
// Maps for the improvement tests: the six towns with random lengths, a 5 × 7 street grid, and larger random maps.
const randomLengths=(rnd,max=20)=>ROADS.map(()=>1+Math.floor(rnd()*max));
function gridRoads(rnd){const roads=[];for(let i=0;i<GN;i++){if(i%GC<GC-1)roads.push([i,i+1,1+Math.floor(rnd()*9)]);if(i+GC<GN)roads.push([i,i+GC,1+Math.floor(rnd()*9)]);}return roads;}
// A chain through every town in a random order keeps the map connected; the extra roads join random towns.
function randomRoads(n,extra,rnd){const p=[...Array(n).keys()],roads=[];for(let i=n-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[p[i],p[j]]=[p[j],p[i]];}
 for(let i=1;i<n;i++)roads.push([p[i-1],p[i],1+Math.floor(rnd()*20)]);for(let k=0;k<extra;k++){const u=Math.floor(rnd()*n),v=Math.floor(rnd()*n);if(u!==v)roads.push([u,v,1+Math.floor(rnd()*20)]);}return roads;}
function completeRoads(n,rnd){const roads=[];for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)roads.push([u,v,1+Math.floor(rnd()*20)]);return roads;}
// #14 improvement. 0 as taught, 1 stop when F is finished, 2 stop when F first gets a distance, 3 the order towns were reached.
function testDijkstraStop(v,rnd=Math.random){const kinds={map:()=>[TN,mapRoads(randomLengths(rnd)),0,TN-1],grid:()=>[GN,gridRoads(rnd),START,GOAL],large:()=>[40,randomRoads(40,60,rnd),0,39]};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const [n,roads,s,g]=f(),want=dijkstraRun(n,roads,s,g),r=dijkstraRun(n,roads,s,g,v);if(r.dist===want.dist)ok++;base+=want.finished;mine+=r.finished;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}
// #15 counterexample: "in the cheapest network that joins every town, every trip is as short as on the full map".
function checkTreeRoutes(len){const roads=mapRoads(len),k=kruskalRun(TN,roads),tree=k.kept.map(i=>roads[i]);let worst=null;
 for(let a=0;a<TN;a++)for(let b=a+1;b<TN;b++){const inTree=dijkstraRun(TN,tree,a,b),best=dijkstraRun(TN,roads,a,b);if(inTree.dist>best.dist&&(!worst||inTree.dist-best.dist>worst.tree-worst.best))worst={a,b,tree:inTree.dist,best:best.dist,treeRoute:inTree.route,bestRoute:best.route};}
 return{kept:k.kept,total:k.total,counter:!!worst,...(worst||{})};}
// #15 improvement. 0 as taught, 1 stop once n − 1 roads are kept, 2 each town's shortest road, 3 the n − 1 shortest roads.
function testKruskalStop(v,rnd=Math.random){const kinds={map:()=>[TN,mapRoads(randomLengths(rnd))],sparse:()=>[30,randomRoads(30,30,rnd)],dense:()=>[15,completeRoads(15,rnd)]};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const [n,roads]=f(),want=kruskalRun(n,roads),r=kruskalRun(n,roads,v);if(r.tree&&r.total===want.total)ok++;base+=want.looked;mine+=r.looked;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}
// #16 counterexample: "taking the largest number that still fits finds a subset with the target sum whenever there is one".
function checkGreedySubset(a,t){const g=greedySubset(a,t),r=subsetRun(a,t);return{exists:!!r.set,greedy:g.set,sum:g.sum,best:r.set,counter:!!r.set&&!g.ok};}
const isSubOf=(s,a)=>{const c=[...a];return s.every(x=>{const i=c.indexOf(x);if(i<0)return false;c.splice(i,1);return true;});};
// #16 improvement, on 12 numbers: targets some subset reaches, odd targets for even numbers (no answer), and large numbers.
function testSubset(v,rnd=Math.random){const n=12,some=a=>{let s=0;for(const x of a)if(rnd()<.5)s+=x;return s||a[0];};
 const kinds={reach:()=>{const a=Array.from({length:n},()=>1+Math.floor(rnd()*50));return[a,some(a)];},none:()=>{const a=Array.from({length:n},()=>2+2*Math.floor(rnd()*30)),tot=a.reduce((x,y)=>x+y,0);return[a,2*Math.floor(rnd()*(tot/2))+1];},big:()=>{const a=Array.from({length:n},()=>1+Math.floor(rnd()*1000));return[a,some(a)];}};
 const rows=[];let correct=true;for(const [k,f] of Object.entries(kinds)){let ok=0,base=0,mine=0;for(let t=0;t<100;t++){const [a,tg]=f(),want=subsetRun(a,tg),r=subsetVariant(a,tg,v),good=r.set?r.set.reduce((x,y)=>x+y,0)===tg&&isSubOf(r.set,a):!want.set;if(good)ok++;base+=want.tried;mine+=r.tried;}if(ok<100)correct=false;rows.push([k,ok,Math.round(base/100),Math.round(mine/100)]);}
 return{v,rows,correct};}
const BREAKS={hanoi:{changes:HANOI_BREAKS,outcomes:HANOI_OUTCOMES,run:c=>hanoiBreak(c,3)},'fewest-coins':{changes:DP_BREAKS,outcomes:DP_OUTCOMES,run:c=>dpBreak(c)}};

/* ---------------- Complexity questions ---------------- */
const CPLX={
 quicksort:{q:L('Quicksort as taught, with the last item as pivot, on 1,000 items that are already sorted: how many comparisons?'),options:L(['999','about 11,000','499,500','1,000,000']),answer:2,why:L('Each pivot is the largest item of its range, so each range shrinks by just one: 999 + 998 + … + 1 = 499,500, as many as bubble sort’s worst case. On a shuffled list quicksort averages about 11,000 comparisons.')},
 'fewest-coins':{q:L('The fewest coins for 1,000 with coins of 1, 5, 10 and 25: how many comparisons best[v − c] + 1 < best[v] does the table make?'),options:L(['1,000','3,963','250,000','1,000,000']),answer:1,why:L('Each of the 1,000 amounts tries every coin that fits: 1,000 + 996 + 991 + 976 = 3,963. The work grows with the amount times the number of coins. There are 142,511 different ways to pay 1,000 with these coins, so trying them all would take far longer.')},
 dijkstra:{q:L('The listings find the closest unfinished town by checking all the towns in every round. With 1,000,000 towns, about how many of those checks in all?'),options:L(['about 1,000,000','about 20,000,000','about 1,000,000,000,000','about 10¹⁸']),answer:2,why:L('Each town is finished in its own round, and each round checks all 1,000,000 towns: 1,000,000 × 1,000,000 = 10¹² checks. Checking only the unfinished towns halves that, which is still far too many. When each town has only a few roads, a heap, which keeps the smallest distance on top, brings the whole search down to a few tens of millions of steps.')},
 kruskal:{q:L('Kruskal’s method on 1,000 towns where every two towns have a road: how many roads are sorted, and how many are kept?'),options:L(['999 sorted, 999 kept','499,500 sorted, 999 kept','499,500 sorted, 499,500 kept','1,000,000 sorted, 1,000 kept']),answer:1,why:L('Every pair has a road: 1,000 × 999 / 2 = 499,500 roads to sort. A tree that joins 1,000 towns always has 999 roads: each kept road merges two groups into one, and 1,000 groups become one after 999 merges. Sorting is most of the work.')},
 'subset-sum':{q:L('Trying every subset of 60 numbers, at a billion subsets per second: about how long does it take?'),options:L(['about a minute','about a day','about 36 years','about 36,000 years']),answer:2,why:L('2⁶⁰ ≈ 1.15 × 10¹⁸ subsets take about 1.15 × 10⁹ seconds, about 36.5 years, and each extra number doubles that. Cleverer methods help but still grow exponentially: splitting the numbers into two halves takes on the order of 2³⁰ steps for 60 numbers. When the numbers are small whole numbers, a table like the one in #13 answers in about n × target steps, but a target with many digits makes that slow too. Subset sum is NP-complete: a method whose time grows only like a power of the length of the input exists if and only if P = NP, which nobody has proved or disproved.')},
 'find-max':{q:L('How many comparisons a[i] > best does find-the-maximum make on a list of 1,000 items?'),options:L(['10','500','999','1,000,000']),answer:2,why:L('Every item after the first is compared once: 1,000 − 1 = 999. The work grows in step with n.')},
 'linear-search':{q:L('Linear search on 1,000,000 items: how many checks in the worst case?'),options:L(['20','1,000','500,000','1,000,000']),answer:3,why:L('In the worst case the target is last or missing, so every item is checked.')},
 'bubble-sort':{q:L('Bubble sort with early stopping, on 100 items: how many comparisons in the worst case?'),options:L(['99','664','4,950','10,000']),answer:2,why:L('A reversed list needs every pass: 99 + 98 + … + 1 = 4,950. Early stopping helps only when passes run out of swaps early.')},
 'insertion-sort':{q:L('Insertion sort on a list of 1,000 items that is already sorted: how many comparisons?'),options:L(['999','1,000','499,500','1,000,000']),answer:0,why:L('Each new item is compared once with the item before it, finds it smaller, and stays: 999 comparisons. Bubble sort would still make 499,500.')},
 'binary-search':{q:L('Binary search on 1,000,000 sorted items: at most how many rounds, each choosing a new mid?'),options:L(['20','1,000','500,000','1,000,000']),answer:0,why:L('Each round halves what is left. Twenty halvings shrink 1,000,000 items to nothing, because 2²⁰ = 1,048,576.')},
 'merge-sort':{q:L('Merge sort on 1,024 items: at most how many comparisons?'),options:L(['1,023','9,217','523,776','1,048,576']),answer:1,why:L('There are 10 rounds of merging, because 2¹⁰ = 1,024. Each merge makes at most one comparison fewer than the items it merges, so a round makes at most 1,024 minus its number of merges. In all: 10 × 1,024 − 1,023 = 9,217. Insertion sort can need 523,776.')},
 hanoi:{q:L('How many moves does the Tower of Hanoi need for 20 disks?'),options:L(['40','400','1,048,575','20,000,000']),answer:2,why:L('Each extra disk doubles the moves and adds one, so 20 disks need 2²⁰ − 1 = 1,048,575 moves. At one move per second, that is about 12 days.')},
 bfs:{q:L('In an open grid of 1,000 × 1,000 cells, at most how many cells can BFS mark?'),options:L(['2,000','1,000,000','4,000,000','1,000,000,000,000']),answer:1,why:L('Each cell is marked at most once, so at most 1,000,000. Each cell taken looks at 4 neighbours, so there are at most 4,000,000 neighbour checks: the work grows in step with the number of cells.')},
 dfs:{q:L('In this DFS a cell can be on the stack more than once. At most how many copies of one cell can be put on the stack?'),options:L(['1','4','1,000','1,000,000']),answer:1,why:L('A copy is added only by a neighbour taken while the cell is still unmarked. A cell has at most 4 neighbours, so it gets at most 4 copies.')},
 'greedy-change':{q:L('Paying 1,000,000 cents with coins of 25, 10, 5 and 1, one subtraction at a time: how many subtractions?'),options:L(['4','40,000','1,000,000','25,000,000']),answer:1,why:L('1,000,000 = 40,000 × 25, so the greedy method takes 40,000 coins of 25, one subtraction each. Dividing instead needs one step per kind of coin: 4.')},
 euclid:{q:L('For two numbers below 1,000,000, at most about how many remainder steps does Euclid’s algorithm need?'),options:L(['about 30','about 1,000','about 500,000','about 1,000,000']),answer:0,why:L('Never more than 29. The worst pairs are neighbouring Fibonacci numbers: 832,040 and 514,229 take 28 steps, and one more if they are given in the other order.')}};

/* ---------------- Ideas in the learner's own words ---------------- */
const IDEAS={
 'find-max':L('How could you find both the largest and the smallest number? How many comparisons would that take?'),
 'linear-search':L('If the list were sorted, how could you find the target with fewer checks? Write your idea in your own words.'),
 'bubble-sort':L('Bubble sort keeps comparing neighbours. When is that wasted work? Describe an idea to avoid it.'),
 'insertion-sort':L('Insertion sort is fast on lists that are nearly sorted. Why? Explain in your own words.'),
 euclid:L('Why does (b, a mod b) have the same greatest common divisor as (a, b)? Explain in your own words.'),
 'binary-search':L('Why does binary search need a sorted list? Explain in your own words.'),
 'merge-sort':L('Merging two sorted runs never needs to look back. Why does that give a sorted result?'),
 hanoi:L('Why can you trust hanoi(n − 1, …) to work before you have traced it? Explain in your own words.'),
 bfs:L('Why does BFS always reach a cell first by a shortest route? Explain in your own words.'),
 dfs:L('DFS uses a stack where BFS uses a queue. What does that change in the order the cells are visited?'),
 'greedy-change':L('Describe a set of coins where taking the largest coin first goes wrong. Why does it go wrong?'),
 quicksort:L('After one partition, why is the pivot in its final place? Explain in your own words.'),
 'fewest-coins':L('Why must the table be filled from small amounts up? What would go wrong otherwise?'),
 dijkstra:L('Why is the closest unfinished town safe to finish? What would a road of negative length break?'),
 kruskal:L('Why does Kruskal’s method skip a road whose two towns are already in the same group? What would keeping it add?'),
 'subset-sum':L('Checking a proposed subset is quick: add it up. Why might finding one be much harder? Explain in your own words.')};

/* ---------------- Recommendation rules ---------------- */
// Each rule reads what the learner did in this section: challenge results, and on #1 and #2 how many
// predictions matched, which the advice then states. No rule rates the learner.
const NUM_OF=Object.fromEntries(ORDER.map(k=>[k,ALGS[k].num]));
const NAMES={12:L('#12 Quicksort'),15:L('#15 Spanning trees'),16:L('#16 P versus NP'),6:L('#6 Binary search'),8:L('#8 Recursion: the Tower of Hanoi'),9:L('#9 Breadth-first search'),10:L('#10 Depth-first search'),11:L('#11 Greedy change'),13:L('#13 Dynamic programming'),14:L('#14 Dijkstra’s shortest paths'),1:L('#1 Find the maximum'),2:L('#2 Linear search'),3:L('#3 Bubble sort'),4:L('#4 Insertion sort'),5:L('#5 Euclid’s algorithm'),7:L('#7 Merge sort')};
const FIND_REASON=L('Find the reason'),WHY_PENDING=L('You found a counterexample. Now answer the question under it: what makes it work?');
function recommend(key,e={},pred){const items=[],add=(text,good)=>items.push({text,good}),c=e.cplx,x=e.counter,im=e.improve,b=e.bottle,bt=e.built;
 const low=!!pred&&pred.asked>=5&&pred.matched/pred.asked<.6,found=!!x&&x.status==='counter',reason=found&&x.why===0;
 if(pred)add(L(`Predictions: ${pred.matched} of ${pred.asked} matched`),false);
 if(c)add(c.ok?L('Predicted how the cost grows'):L('Missed how the cost grows'),c.ok);
 if(e.idea)add(L('Wrote an idea in your own words (kept in this browser)'),false);
 const r=(num,title,why,alt=[])=>({num,key:NUM[num]||null,title,why,alt,items});
 const lowWhy=(n,more)=>L(`${pred.matched} of your ${pred.asked} predictions matched. Run #${n} again with a random list and predict each step${more?more.en:''}.`);
 const counterItem=good=>add(reason?good:L('Found a counterexample'),reason);
 if(key==='find-max'){if(found)counterItem(L('Found a counterexample and its reason'));
  if(im)add(im.v===1?L('Tested the pairing method: about 3n/2 comparisons'):L('Tested a way to find the largest and the smallest'),im.v===1);
  if(reason||im&&im.v===1)return r(2,NAMES[2],reason?L('You found the hidden assumption in “start at 0”. #2 uses the same loop to search, and it can stop early.'):L('You saw that pairing the items cuts comparisons. #2 uses the same loop to search, and it can stop early.'),[[3,NAMES[3],L('each pass carries the maximum to the end')]]);
  if(found)return r(1,FIND_REASON,WHY_PENDING);
  if(low)return r(1,L('Stay with #1 on a new list'),lowWhy(1));
  return r(1,L('Try “Does it always work?”'),L('Look for a list where starting with best ← 0 gives the wrong answer. That shows why the algorithm starts with a[0].'),[[2,NAMES[2],L('the same loop, used to search')]]);}
 if(key==='linear-search'){if(found)counterItem(L('Found that linear search returns the first match'));
  const pass=!!bt&&bt.passed===bt.total,own=pass&&!(bt.hints>=4);
  if(bt)add(!pass?L(`Built a search that passed ${bt.passed} of ${bt.total} tests`):own?L(`Built a halving search that passed all ${bt.total} tests`):L(`Assembled the halving search with every hint; it passed all ${bt.total} tests`),pass);
  if(pass)return r(3,L('#3 Bubble sort, then #6 Binary search'),own?L('You built the halving idea yourself. It only works on sorted lists, so learn how to sort next (#3). #6 Binary search, in the high-school part, studies your idea in full.'):L('Your halving search passed every test. It only works on sorted lists, so learn how to sort next (#3). #6 Binary search, in the high-school part, explains why each block is needed.'),[[4,NAMES[4],L('another way to sort')]]);
  if(found&&!reason)return r(2,FIND_REASON,WHY_PENDING);
  if(low)return r(2,L('Stay with #2 on a new list'),lowWhy(2,L(', or look at #1, which uses the same loop with less to track')),[[1,NAMES[1],L('the same loop, simpler')]]);
  return r(2,L('Try “Faster on a sorted list”'),L('Build a faster search in Think further. If it passes the tests, you have found the idea behind #6 Binary search.'),[[3,NAMES[3],L('another middle-school algorithm')]]);}
 if(key==='bubble-sort'){if(b)add(b.ok?L('Found the bottleneck: the inner loop'):L('Looked for the bottleneck'),b.ok);
  if(im)add(im.correct&&im.early?L('Stopped early and saw that it does not help reversed lists'):im.correct?L('Tested a change that kept the list sorted'):L('Tested a change that broke the sorting'),im.correct&&im.early);
  if(b&&b.ok&&im&&im.correct&&im.early)return r(4,NAMES[4],L('You found that comparisons are the cost and that stopping early only helps nearly sorted lists. #4 is fast on nearly sorted lists. #7 Merge sort, in the high-school part, stays fast even in the worst case.'),[[7,NAMES[7],L('fast in every case')]]);
  if(!b||!b.ok)return r(3,b?L('Look again at the bottleneck'):L('Find the bottleneck first'),b?L('Use the table under your choice: which box ran most often, and why?'):L('Count which step runs most often. Every improvement starts there.'),[[2,NAMES[2],L('a simpler loop')]]);
  return r(3,L('Try “Less comparing”'),L('Test a change that cuts comparisons, and check it on reversed lists too.'));}
 if(key==='insertion-sort'){if(found)counterItem(L('Found where insertion sort is as slow as bubble sort'));
  if(b)add(b.ok?L('Found the box that runs most on the list'):L('Looked for the bottleneck'),b.ok);
  if(reason)return r(5,NAMES[5],L('You found the worst case of insertion sort: a list in decreasing order. #7 Merge sort, in the high-school part, avoids it. Meanwhile #5 shows a different kind of algorithm: it shrinks numbers instead of moving items.'),[[7,NAMES[7],L('no slow worst case')]]);
  if(found)return r(4,FIND_REASON,WHY_PENDING);
  return r(4,L('Try “Is it always faster?”'),L('Look for a list where insertion sort makes as many comparisons as bubble sort. That shows when insertion sort is slow.'),[[3,NAMES[3],L('compare the two sorts')]]);}
 if(key==='binary-search'){if(found)counterItem(L('Found that binary search needs a sorted list'));
  if(im)add(im.v===1&&im.correct?L('Made binary search return the first match and kept it fast'):im.v===2&&im.correct?L('Returned the first match, but slowly on long runs of equal items'):L('Tested a change for repeated items'),im.v===1&&im.correct);
  if(reason)return r(7,NAMES[7],L('You found that binary search relies on a sorted list. #7 sorts any list quickly, so the two together search fast.'),[[2,NAMES[2],L('works on any list, but slower')]]);
  if(found)return r(6,FIND_REASON,WHY_PENDING);
  return r(6,L('Try “Does it always work?”'),L('Look for a list where binary search misses a target that is there. It shows what the method relies on.'),[[7,NAMES[7],L('how to sort fast')]]);}
 if(key==='merge-sort'){if(found)counterItem(L('Found when insertion sort beats merge sort'));
  if(im)add(im.v===1&&im.correct?L('Skipped merges that were already in order'):im.correct?L('Tested a change that kept the list sorted'):L('Tested a change that broke the sorting'),im.v===1&&im.correct);
  if(reason)return r(8,NAMES[8],L('You found that merge sort pays its full cost even on sorted lists. Merge sort is usually written with recursion: split, sort each half, merge. #8 shows how a method can call itself.'),[[4,NAMES[4],L('the fast choice for nearly sorted lists')],[12,NAMES[12],L('a sort that splits around a pivot, in place')]]);
  if(found)return r(7,FIND_REASON,WHY_PENDING);
  return r(7,L('Try “Is it always faster?”'),L('Look for a list where insertion sort makes no more comparisons than merge sort.'),[[8,NAMES[8],L('the usual way to write merge sort')]]);}
 if(key==='hanoi'){const bk=e.breaks,tried=bk?Object.keys(bk):[],right=tried.filter(k=>bk[k].pred===bk[k].actual);
  if(bk)add(right.includes('nobase')?L('Predicted what happens without the base case'):L(`Predicted ${right.length} of ${tried.length} broken ${pl(tried.length,'version','versions')}`),right.includes('nobase'));
  if(b)add(b.ok?L('Found that the n = 0 check runs most'):L('Looked for the bottleneck'),b.ok);
  if(right.includes('nobase')&&b&&b.ok)return r(9,NAMES[9],L('You saw why the base case is needed and how often the calls run. #9 explores a maze ring by ring; #10 goes deep first, the way recursion does.'),[[10,NAMES[10],L('a search that behaves like recursion')],[7,NAMES[7],L('split, sort, merge')]]);
  if(!right.includes('nobase'))return r(8,L('Try “Break it on purpose”'),L('Delete the line “if n = 0: return” and predict what goes wrong. It shows what the base case is for.'),[[7,NAMES[7],L('split, sort, merge')]]);
  return r(8,b?L('Look again at the bottleneck'):L('Find the bottleneck'),L('Count which box runs most often, and compare it with the number of moves.'));}
 if(key==='bfs'){if(found)counterItem(L('Found that BFS counts steps, not costs'));
  if(b)add(b.ok?L('Found the box that runs most'):L('Looked for the bottleneck'),b.ok);
  if(reason)return r(14,NAMES[14],L('You found that the fewest steps are not always the cheapest route. #14 Dijkstra’s method, in the university part, finds the cheapest route when steps cost different amounts.'),[[10,NAMES[10],L('the same search with a stack')]]);
  if(found)return r(9,FIND_REASON,WHY_PENDING);
  return r(9,L('Try “Fewest steps, lowest cost?”'),L('Put mud on the grid until the path BFS finds is not the cheapest one.'),[[10,NAMES[10],L('the same search with a stack')]]);}
 if(key==='dfs'){if(found)counterItem(L('Found that DFS can take a long way round'));
  if(im)add(im.v===1&&im.correct?L('Steered DFS toward the goal and tested it'):im.v===0?L('Tested DFS as taught'):L('Tested a change that missed some paths'),im.v===1&&im.correct);
  if(reason)return r(9,NAMES[9],L('You showed that DFS can find a long path. #9 explores ring by ring and always finds a shortest one.'),[[15,NAMES[15],L('the cheapest tree that joins every town')]]);
  if(found)return r(10,FIND_REASON,WHY_PENDING);
  return r(10,L('Try “Is the path the shortest?”'),L('Build a maze where DFS finds a longer path than it needs to.'),[[9,NAMES[9],L('a search that finds shortest paths')]]);}
 if(key==='greedy-change'){if(found)counterItem(L('Found coins where greedy does not give the fewest'));
  if(im)add(im.v===1&&im.correct?L('Replaced repeated subtraction with division'):im.correct?L('Tested a change to the method'):L('Tested a change that gave wrong change'),im.v===1&&im.correct);
  if(reason)return r(13,NAMES[13],L('You found that a greedy choice can block a better one. #13 Dynamic programming, in the university part, finds the fewest coins for any set of coins.'),[[5,NAMES[5],L('the same division idea')]]);
  if(found)return r(11,FIND_REASON,WHY_PENDING);
  return r(11,L('Try “Always the fewest coins?”'),L('Choose your own coins and an amount where the greedy method is beaten.'),[[5,NAMES[5],L('the same division idea')]]);}
 if(key==='quicksort'){if(found)counterItem(L('Found that a sorted list is quicksort’s slow case'));
  const good=!!im&&(im.v===1||im.v===2)&&im.correct;
  if(im)add(im.v===2&&im.correct?L('Tested a random pivot: no order of the list stays slow'):im.v===1&&im.correct?L('Tested the middle item as pivot'):L('Tested a pivot that keeps the slow case'),good);
  if(reason||good)return r(13,NAMES[13],L(`${good?'You saw how a better pivot avoids quicksort’s slow case.':'You found what makes quicksort slow: a pivot that is the largest item of its range.'} #13 shows another way to save work: when the same smaller problems come up again and again, a table keeps their answers.`),[[7,NAMES[7],L('never slow, but it needs an extra list')]]);
  if(found)return r(12,FIND_REASON,WHY_PENDING);
  return r(12,L('Try “Easy when sorted?”'),L('Compare a shuffled list with the same numbers sorted. Which one is harder for quicksort?'),[[7,NAMES[7],L('another sort that splits the list')]]);}
 if(key==='fewest-coins'){const bk=e.breaks,tried=bk?Object.keys(bk):[],right=tried.filter(k=>bk[k].pred===bk[k].actual);
  if(bk)add(right.includes('down')?L('Predicted what happens when the table is filled from the top'):L(`Predicted ${right.length} of ${tried.length} broken ${pl(tried.length,'version','versions')}`),right.includes('down'));
  if(b)add(b.ok?L('Found where the table spends its time'):L('Looked for the bottleneck'),b.ok);
  if(right.includes('down')&&b&&b.ok)return r(14,NAMES[14],L('You saw that each entry needs smaller entries that are already final. Dijkstra’s method keeps a table too, the shortest distance known to each town, and makes each entry final in order of distance.'),[[16,NAMES[16],L('a table also helps when the numbers are small')]]);
  if(!right.includes('down'))return r(13,L('Try “Break it on purpose”'),L('Fill the table from the top down and predict what goes wrong. It shows why the order of the loop matters.'),[[11,NAMES[11],L('the greedy method this table corrects')]]);
  return r(13,b?L('Look again at the bottleneck'):L('Find the bottleneck'),L('Count which box runs most often, and compare it with the amount times the number of coins.'));}
 if(key==='dijkstra'){if(found)counterItem(L('Found that the nearest town can lead the wrong way'));
  if(im)add(im.v===1&&im.correct?L('Stopped as soon as the goal was finished, and stayed right'):im.v===0?L('Tested the method as taught'):L('Tested a change that gave some wrong distances'),im.v===1&&im.correct);
  if(reason||im&&im.v===1&&im.correct)return r(15,NAMES[15],L('You saw why Dijkstra’s method waits until a town is the closest before finishing it. #15 asks a different question about the same map: the least road that joins every town.'),[[11,NAMES[11],L('another greedy choice that can fail')]]);
  if(found)return r(14,FIND_REASON,WHY_PENDING);
  return r(14,L('Try “Nearest town first?”'),L('Choose road lengths where always taking the shortest next road does not give the shortest route.'),[[9,NAMES[9],L('the same idea when every step costs 1')]]);}
 if(key==='kruskal'){if(found)counterItem(L('Found that the cheapest network does not give the shortest trips'));
  if(im)add(im.v===1&&im.correct?L('Stopped once n − 1 roads were kept, and stayed right'):im.v===0?L('Tested the method as taught'):L('Tested a shortcut that did not always give the cheapest network'),im.v===1&&im.correct);
  if(reason||im&&im.v===1&&im.correct)return r(16,NAMES[16],L('You saw what a minimum spanning tree promises and what it does not. #16 asks what happens when no clever order is known and every possibility seems to need checking.'),[[14,NAMES[14],L('shortest routes from one town')]]);
  if(found)return r(15,FIND_REASON,WHY_PENDING);
  return r(15,L('Try “The best routes too?”'),L('Choose road lengths where the network that Kruskal’s method keeps makes some trip longer than it needs to be.'),[[14,NAMES[14],L('shortest routes from one town')]]);}
 if(key==='subset-sum'){if(found)counterItem(L('Found that largest first can miss an answer'));
  if(im)add(im.v===1&&im.correct?L('Cut the search without missing an answer'):im.v===0?L('Tested the method as taught'):L('Tested a shortcut that missed some answers'),im.v===1&&im.correct);
  if(reason||im&&im.v===1&&im.correct)return r(13,NAMES[13],L(`${im&&im.v===1&&im.correct?'You saw that a safe cut only trims the search.':'You saw that a greedy shortcut can miss answers.'} When the numbers are small whole numbers, a table like the one in #13 answers in about n × target steps, without trying every subset.`),[[1,NAMES[1],L('back to the start of the route')]]);
  if(found)return r(16,FIND_REASON,WHY_PENDING);
  return r(16,L('Try “Largest first?”'),L('Choose numbers and a target where taking the largest number that fits misses an answer that exists.'),[[11,NAMES[11],L('the same greedy idea with coins')]]);}
 if(key!=='euclid')return r(NUM_OF[key],L('Explore this algorithm'),L('Step through it and try a challenge.'));
 if(found)counterItem(L('Found that size does not decide the steps, and named the worst pairs'));
 if(im)add(im.v===1&&im.ok===im.total?L('Replaced repeated subtraction with a remainder'):L('Tested a change to the subtraction method'),im.v===1&&im.ok===im.total);
 if(reason)return r(8,L('#8 Recursion, and Number Theory'),L('You found that neighbouring Fibonacci numbers are the slowest pairs. Euclid’s algorithm can call itself on a smaller pair, gcd(b, a mod b): #8 shows how such recursion works, with the Tower of Hanoi. The Number Theory project “Square tiles and Euclid’s shortcut” proves why the method works.'),[[1,NAMES[1],L('back to the start of the route')]]);
 if(found)return r(5,FIND_REASON,WHY_PENDING);
 return r(5,L('Try “Do bigger numbers need more steps?”'),L('Find a bigger pair that needs fewer steps than a smaller one.'),[[4,NAMES[4],L('another middle-school algorithm')]]);}

return{VERSION,L,ALGS,ORDER,MAP,NUM,BUILD,CPLX,IDEAS,TOWNS,ROADS,roadName,mapRoads,quickRun,checkQuick,testPivot,dpRun,dpBreak,DP_BREAKS,DP_OUTCOMES,BREAKS,dijkstraRun,nearestWalk,checkWalk,testDijkstraStop,kruskalRun,checkTreeRoutes,testKruskalStop,subsetOf,subsetRun,greedySubset,subsetVariant,checkGreedySubset,testSubset,randomLengths,gridRoads,randomRoads,completeRoads,GR,GC,GN,START,GOAL,DEFAULT_MAZE,parseMaze,randomMaze,around,cellName,binaryRun,mergeCounts,hanoiMoves,bfsRun,dfsRun,cheapest,pathCost,greedyRun,fewestCoins,fewestSet,checkBinary,binaryFirst,testFirst,checkMerge,testMergeImprove,HANOI_BREAKS,HANOI_OUTCOMES,hanoiBreak,hanoiCounts,traceCounts,checkMud,checkDfs,testDfsImprove,checkGreedy,changeSteps,testChange,helpGrid,sorted,uniq,shuffle,maxStartingAtZero,checkMaxZero,minMaxVariant,testMinMax,checkLinearFirst,insertionBoxCounts,boxCounts,judgeInsertionBox,runBuilt,testBuilder,bubbleCounts,judgeBottleneck,bubbleVariant,testImprove,insertionCounts,checkInsertion,euclidSteps,gcdRef,checkEuclidPairs,subtractVariant,testEuclidVariant,recommend};
});
