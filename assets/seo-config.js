(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QuidenceSEOConfig=api;
})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const ORIGIN='https://www.quidence.com';
// Only authored public entries belong in the sitemap. Student records are never read here.
// Quidence is published in English only, so every page has one URL and no language alternates.
const COURSES={
  'pre-algebra':['/courses/pre-algebra/','Pre-Algebra','Review signed numbers, fractions, ratios, and expressions with introductory lessons and checks.'],
  'algebra-1':['/courses/algebra-1/','Algebra I','Explore equations, linear functions, systems, and quadratic roots with introductory activities.'],
  geometry:['/courses/geometry/','Geometry','Review angles, triangle relationships, similarity, and measurement with introductory activities.'],
  'algebra-2':['/courses/algebra-2/','Algebra II','Explore polynomial factors, rational expressions, exponentials, and logarithms in introductory lessons.'],
  'basic-logic':['/courses/basic-logic/','Basic Logic','Explore statements, truth tables, valid arguments, fallacies, and syllogisms in four introductory lessons.'],
  'coordinate-geometry':['/courses/coordinate-geometry/','Coordinate Geometry','Connect coordinates, distance and equations through four lessons and two guided projects with six steps each.'],
  af01:['/modules/af01/dist/','Pre-calculus','Connect functions to graphs, angles, and growth through selected introductory activities.'],
  ad01:['/modules/ad01/dist/','Calculus','Explore limits, derivatives, and accumulation through interactive graphs and introductory questions.'],
  ae01:['/modules/ae01/dist/','Statistics','Read distributions, compare summaries, and examine study design with introductory statistics activities.'],
  ab01:['/modules/ab01/dist/','Linear Algebra','Connect two-dimensional vectors and matrices with geometric transformations and introductory checks.'],
  'number-theory':['/courses/number-theory/','Number Theory','Explore divisibility, primes, and congruences through eleven projects with step-by-step reference proofs.'],
  'discrete-math':['/courses/discrete-math/','Discrete Mathematics','Explore graphs, counting, recurrences and proof techniques through ten projects with step-by-step reference proofs.'],
  probability:['/courses/probability/','Probability','Explore chance, conditional probability, expected value and the law of large numbers through ten projects with step-by-step reference proofs.'],
  ac01:['/modules/ac01/dist/','Game Theory Foundations','Explore payoff tables, best responses, dominant strategies, and pure Nash equilibria in four English lessons.'],
  'physics-1':['/courses/physics-1/','Physics 1 Foundations','Explore motion, forces, energy, momentum, rotation, oscillations, and fluids in introductory lessons.'],
  'physics-2':['/courses/physics-2/','Physics 2 Foundations','Explore heat, electric fields, circuits, magnetism, optics, waves, and photons after basic mechanics.'],
  algorithms:['/courses/algorithms/','Algorithms','Follow classic algorithms step by step as flowcharts, numbered steps and code in Python, Java and MATLAB, then find counterexamples, bottlenecks and improvements.'],
};
const PAGES={
  '/checks/':{en:['Test your understanding','Choose an interactive model and explanation activity or continue with the original subject check.']},
  '/explain/':{en:['Math Voice Lab','Explore six mathematics models, explain your reasoning, and keep original responses with local recording and scripted follow-ups. This activity is English only.'],fixedLocale:'en'},
  '/cross-disciplinary/':{en:['Cross-disciplinary Projects','Work through problems that need several subjects at once, with animated models, checked answers and step-by-step reference proofs.'],sitemap:true},
  '/intuition/':{en:['Intuition Lab','Test a mathematical hunch with interactive models, calculations and reflection across sixteen subjects.'],sitemap:true},
  '/modules/ad01/dist/checks/':{en:['Calculus · Test your understanding','Choose a graph-based reasoning activity or the original four-problem Calculus check.']},
  '/modules/ad01/dist/think/':{en:['Calculus · Think in motion','Explore a claim about velocity and acceleration through graphs and your own explanation. This dialogue activity is English only.'],fixedLocale:'en'},
  '/modules/ac01/dist/projects/':{en:['Game Theory Projects and Cases','Explore food-truck choices, shared maintenance and a missed deadline with payoff models and evidence-based plans.'],sitemap:true},
  '/':{en:['Mathematics and Science Learning','Explore the mathematics knowledge map, choose introductory lessons, and test your understanding with multi-part problems.'],sitemap:true},
  '/data-use/':{en:['Data Use and Local Records','Learn how Quidence keeps answers and reports in your browser during public testing and how to export or delete them.'],sitemap:true},
  '/account/':{en:['Account','Account information during public testing.'],noindex:true},
  '/records/':{en:['Manage Local Records','Export, restore, or delete learning records stored in this browser.'],noindex:true},
  '/reports/':{en:['Saved Reports','Review learning reports saved in this browser.'],noindex:true},
  '/modules/aa01/dist/':{en:['Visual Algebra','Explore equations and algebra through visual activities and reasoning checks.']},
  '/modules/ab01/dist/vectors.html':{en:['Vectors','Explore two-dimensional vectors with interactive visual models.']},
  '/modules/ab01/dist/matrix.html':{en:['Matrices and Transformations','Explore matrices and their geometric transformations with interactive visual models.']},
  '/courses/physics/':{en:['Introductory Physics','Explore selected introductory physics models and questions.']},
};
for(const c of Object.values(COURSES))PAGES[c[0]]={en:[c[1],c[2]],sitemap:true};
const ACTIVITIES={
  '/checks/':{en:'Test Your Understanding'},
  '/diagnostics/':{en:'Test Your Understanding'},
  '/projects/':{en:'Field Projects'},
  '/foundations/':{en:'Foundation Check'},
};
const FOUNDATION_IDS=new Set(['aa01','ab01','ac01','ad01','ae01','af01']);
function normalizePath(path){
  const normalized=path.replace(/\/index\.html$/,'/')||'/';
  return PAGES[normalized+'/']||ACTIVITIES[normalized+'/']?normalized+'/':normalized;
}
function resolve(input){
  const url=new URL(input,ORIGIN),pathname=normalizePath(url.pathname),locale='en';
  let page=PAGES[pathname],moduleId=null;
  if(ACTIVITIES[pathname]){
    const id=url.searchParams.get('module'),valid=pathname==='/checks/'?['ab01','ae01','af01','ac01','geometry','algebra-2'].includes(id):pathname==='/foundations/'?FOUNDATION_IDS.has(id):Object.hasOwn(COURSES,id)&&id!=='ac01'&&id!=='algorithms'&&(!['number-theory','discrete-math','probability','coordinate-geometry'].includes(id)||pathname==='/diagnostics/')||id==='physics';
    const title=id==='aa01'?'Pre-Algebra and Algebra I':id==='physics'?'Physics':COURSES[id]?.[1];
    moduleId=valid?id:null;
    const label=ACTIVITIES[pathname].en;
    page={noindex:!valid,en:[title&&valid?title+' · '+label:label,'Work through multi-part problems and save your answers and explanations in this browser.']};
  }
  if(!page)return null;
  const canonical=new URL(pathname,ORIGIN);
  if(moduleId)canonical.searchParams.set('module',moduleId);
  return{pathname,locale,title:page.en[0]+' · Quidence',description:page.en[1],canonical:canonical.href,noindex:!!page.noindex,alternates:[],sitemap:!!page.sitemap};
}
return{ORIGIN,COURSES,PAGES,ACTIVITIES,normalizePath,resolve};
});
