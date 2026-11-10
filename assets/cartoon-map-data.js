(function(root){'use strict';
const tr=en=>({en});
const node=(id,x,y,title,kind,icon,desc,extra=[])=>({id,x,y,title,kind,icon,desc,extra});
const maps=[
{id:'school',number:'01',name:tr('School Mathematics'),count:6,
 intro:tr('A few strong foundations. More than one way forward.'),
 note:tr('Algebra and geometry connect; they do not have to be studied in one fixed order.'),
 selected:'algebra1',nodes:[
 node('arithmetic',20,225,tr('Arithmetic'),'concept','abacus',tr('Operations, order of operations and numerical sense.')),
 node('fractions',260,115,tr('Fractions & ratios'),'concept','fraction',tr('Equal parts, equivalent fractions, ratios and unit rates.')),
 node('signed',260,335,tr('Signed numbers'),'concept','numberline',tr('Connect direction, change and position on a number line.')),
 node('prealgebra',500,225,tr('Pre-Algebra'),'course','calculator',tr('An available course: signed numbers, fractions, ratios and expressions.')),
 node('algebra1',740,225,tr('Algebra I'),'course','balance',tr('An available course: equations, linear functions, systems and quadratic roots.')),
 node('algebra2',980,225,tr('Algebra II'),'course','parabola',tr('An available course: polynomials, rational restrictions, exponentials and logarithms.')),
 node('logic',740,380,tr('Basic Logic'),'course','venn',tr('An available course: statements, conditionals, valid arguments and syllogisms.')),
 node('shapes',20,535,tr('Shapes & measurement'),'concept','shapes',tr('Length, angle, area, volume and spatial relationships.')),
 node('geometry',500,535,tr('Geometry'),'course','triangle',tr('An available course: angles, triangles, similarity and measurement.')),
 node('coordinate',980,535,tr('Coordinate geometry'),'course','axes',tr('Use coordinates to connect algebraic relationships and geometric figures.')),
 node('data',500,10,tr('Data & graphs'),'concept','bars',tr('Read scales and representations; this connects to probability and statistics.'))
 ],edges:[['arithmetic','fractions'],['arithmetic','signed'],['fractions','prealgebra'],['signed','prealgebra'],['prealgebra','algebra1'],['algebra1','algebra2'],['shapes','geometry'],['geometry','coordinate'],['algebra1','coordinate','related'],['fractions','data','related'],['algebra1','logic','related'],['geometry','logic','related']]},
{id:'further',number:'02',name:tr('Further Mathematics'),count:7,
 intro:tr('Functions, proof and data — connected, without one compulsory route.'),
 note:tr('Advanced branches are concept previews. Select one to see its topics; a node does not promise a complete course.'),
 selected:'calculus',nodes:[
 node('schoolbridge',20,283,tr('From the school map'),'bridge','book',tr('Bring the algebra, geometry and graph skills relevant to your chosen direction.')),
 node('precalc',260,5,tr('Pre-calculus'),'course','wave',tr('Functions, trigonometry and growth. A common bridge into calculus.')),
 node('linear',260,190,tr('Linear Algebra'),'course','vectors',tr('Vectors, linear combinations and matrices.')),
 node('proof',260,375,tr('Proof & logic'),'concept','proof',tr('Statements, examples, counterexamples and reasoning. These grow alongside subject knowledge.')),
 node('probability',260,560,tr('Probability'),'course','dice',tr('Equally likely outcomes, conditional probability, expected value and the law of large numbers, in ten proof projects.')),
 node('calculus',500,5,tr('Calculus'),'course','integral',tr('Rates of change, derivatives and integrals.')),
 node('game',500,190,tr('Game Theory'),'course','game',tr('Choices, payoffs and strategic interaction. Dashed links are useful connections, not universal prerequisites.')),
 node('number',740,375,tr('Number Theory'),'course','dots',tr('Integers, divisibility, congruence and proof projects. Elementary work does not require calculus.')),
 node('discrete',500,375,tr('Discrete Mathematics'),'course','graph',tr('Graphs, counting, recurrences and induction through proof projects. No calculus needed.')),
 node('statistics',500,560,tr('Statistics'),'course','bars',tr('Describe data, study variation and reason from evidence.')),
 node('multivar',740,5,tr('Beyond one variable'),'concept','surface',tr('Multivariable calculus and ordinary differential equations.')),
 node('analysis',980,5,tr('Analysis'),'branch','wave',tr('An expandable concept family, not an available course.'),[tr('Real & complex analysis'),tr('Measure, functional & harmonic analysis'),tr('Partial differential equations')]),
 node('algebra',980,210,tr('Algebra & numbers'),'branch','dots',tr('Explore deeper algebraic structures and number theory.'),[tr('Advanced linear & abstract algebra'),tr('Groups, rings & fields'),tr('Algebraic number theory')]),
 node('space',980,410,tr('Geometry & space'),'branch','shapes',tr('Geometric structures connect with calculus, linear algebra and proof.'),[tr('Topology'),tr('Differential geometry')]),
 node('applied',980,590,tr('Data & computation'),'branch','axes',tr('Directions that combine several mathematical tools.'),[tr('Numerical analysis & optimization'),tr('Probability theory & mathematical statistics')])
 ],edges:[['schoolbridge','precalc'],['schoolbridge','linear'],['schoolbridge','proof'],['schoolbridge','probability','related'],['precalc','calculus'],['proof','number'],['proof','discrete'],['probability','statistics'],['linear','game','related'],['calculus','multivar'],['multivar','analysis','related'],['number','algebra','related'],['multivar','space','related'],['statistics','applied','related']]},
{id:'science',number:'03',name:tr('Science'),count:2,
 intro:tr('Start with the physics we offer. See where the ideas can lead.'),
 note:tr('Physics 1 and 2 use algebra and graphs; no calculus is required. Later branches introduce more advanced mathematics.'),
 selected:'physics2',nodes:[
 node('mathbridge',20,295,tr('Algebra, graphs & ratios'),'bridge','axes',tr('The introductory physics courses supply physical relationships and use algebraic reasoning.')),
 node('physics1',260,120,tr('Physics 1 Foundations'),'course','pendulum',tr('Motion, forces, energy, momentum, rotation, oscillations and fluids.')),
 node('physics2',260,485,tr('Physics 2 Foundations'),'course','circuit',tr('Build on mechanics with heat, electric fields, circuits, magnetism, optics, waves and photons.')),
 node('motion',500,20,tr('Motion & forces'),'concept','pendulum',tr('Graphs, acceleration, forces and rotation.')),
 node('energy',500,205,tr('Energy & systems'),'concept','balance',tr('Energy, momentum, oscillations and fluids.')),
 node('heat',500,390,tr('Heat & matter'),'concept','bars',tr('Heat transfer, temperature and energy balance.')),
 node('fields',500,590,tr('Fields & circuits'),'concept','circuit',tr('Electric fields, circuits, magnetism and induction.')),
 node('waves',740,485,tr('Waves & photons'),'concept','wave',tr('Geometric optics, waves, signals and photon thresholds.')),
 node('mechanics',740,20,tr('Classical mechanics'),'branch','pendulum',tr('A later branch. Calculus-based models extend the introductory ideas.')),
 node('thermal',740,240,tr('Thermal & statistical physics'),'branch','dots',tr('Thermodynamics and statistical physics connect macroscopic and microscopic models.')),
 node('relativity',980,20,tr('Relativity & the universe'),'branch','orbit',tr('A family of later directions, with additional mathematical preparation.'),[tr('Special & general relativity'),tr('Astrophysics')]),
 node('quantum',980,285,tr('Quantum & particles'),'branch','orbit',tr('Wave ideas connect to later quantum models; several other foundations are also needed.'),[tr('Quantum mechanics & nuclear physics'),tr('Quantum fields & particle physics')]),
 node('materials',980,590,tr('Fields & materials'),'branch','shapes',tr('Electromagnetism, optics and material systems.'),[tr('Electromagnetism & optics'),tr('Condensed matter & plasma')])
 ],edges:[['mathbridge','physics1'],['physics1','physics2'],['physics1','motion'],['physics1','energy'],['physics2','heat'],['physics2','fields'],['physics2','waves'],['motion','mechanics','related'],['energy','mechanics','related'],['heat','thermal','related'],['mechanics','relativity','related'],['waves','quantum','related'],['fields','materials','related'],['thermal','materials','related'],['quantum','materials','related']]}
,
{id:'cs',number:'04',name:tr('Computer Science'),count:1,
 intro:tr('Follow the logic. Then question it and improve it.'),
 note:tr('Algorithms draw on logic, number theory and discrete mathematics, and lead on to graphs and the P versus NP question.'),
 selected:'algorithms',nodes:[
 node('csbridge',20,283,tr('Logic & patterns'),'bridge','venn',tr('Clear statements, careful counting and patterns are a good start for algorithms.')),
 node('algorithms',260,283,tr('Algorithms'),'course','flow',tr('An available course: algorithms 1 to 16 as flowcharts, steps and code, with challenges that question and improve them.')),
 node('searching',500,60,tr('Searching'),'concept','numberline',tr('Linear search checks items one by one; binary search halves a sorted list again and again.')),
 node('sorting',500,283,tr('Sorting'),'concept','bars',tr('Bubble sort and insertion sort first; merge sort and quicksort later.')),
 node('numberalgo',500,506,tr('Number algorithms'),'concept','dots',tr('Euclid’s algorithm finds a greatest common divisor in a few remainder steps.')),
 node('graphalgo',740,60,tr('Graph algorithms'),'concept','graph',tr('Breadth-first and depth-first search, shortest paths and spanning trees.')),
 node('recursion',740,283,tr('Recursion'),'concept','proof',tr('A method that solves a smaller case of the same problem first, such as the Tower of Hanoi.')),
 node('complexity',980,60,tr('Complexity'),'branch','parabola',tr('How the cost of an algorithm grows with the size of its input.'),[tr('Polynomial and exponential growth'),tr('P versus NP')]),
 node('dynamic',980,283,tr('Dynamic programming'),'branch','calculator',tr('Reuse the answers to smaller problems instead of solving them again.'),[tr('Greedy choices and when they fail'),tr('Shortest paths and knapsack problems')])],
 edges:[['csbridge','algorithms'],['algorithms','searching'],['algorithms','sorting'],['algorithms','numberalgo'],['searching','graphalgo','related'],['sorting','recursion','related'],['numberalgo','recursion','related'],['graphalgo','complexity','related'],['recursion','dynamic','related']]}
];

const bindings={prealgebra:'pre-algebra',algebra1:'algebra-1',algebra2:'algebra-2',logic:'basic-logic',geometry:'geometry',coordinate:'coordinate-geometry',precalc:'af01',linear:'ab01',calculus:'ad01',game:'ac01',number:'number-theory',discrete:'discrete-math',probability:'probability',statistics:'ae01',physics1:'physics-1',physics2:'physics-2',algorithms:'algorithms'};for(const m of maps)for(const n of m.nodes)if(n.kind==='course')n.module=bindings[n.id];
// Suggested starting courses only, never promises of a complete advanced course.
const related={arithmetic:'pre-algebra',fractions:'pre-algebra',signed:'pre-algebra',shapes:'geometry',coordinate:'coordinate-geometry',data:'ae01',schoolbridge:'pre-algebra',proof:'discrete-math',multivar:'ad01',analysis:'ad01',algebra:'number-theory',space:'geometry',applied:'ae01',mathbridge:'algebra-1',motion:'physics-1',energy:'physics-1',heat:'physics-2',fields:'physics-2',waves:'physics-2',mechanics:'physics-1',thermal:'physics-2',relativity:'physics-1',quantum:'physics-2',materials:'physics-2',csbridge:'basic-logic',searching:'algorithms',sorting:'algorithms',numberalgo:'number-theory',graphalgo:'algorithms',recursion:'algorithms',complexity:'algorithms',dynamic:'algorithms'};
for(const m of maps)for(const n of m.nodes)if(!n.module)n.relatedModule=related[n.id];
const api={maps};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceCartoonMapData=api;})(typeof window==='undefined'?globalThis:window);

