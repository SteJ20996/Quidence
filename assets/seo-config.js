(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QuidenceSEOConfig=api;
})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const ORIGIN='https://www.quidence.com';
// Only authored public entries belong in the sitemap. Student records are never read here.
const COURSES={
  'pre-algebra':['/courses/pre-algebra/','Pre-Algebra','Preálgebra','Review signed numbers, fractions, ratios, and expressions with introductory lessons and checks.','Repasa los números con signo, las fracciones, las razones y las expresiones con lecciones y ejercicios introductorios.'],
  'algebra-1':['/courses/algebra-1/','Algebra I','Álgebra I','Explore equations, linear functions, systems, and quadratic roots with introductory activities.','Explora ecuaciones, funciones lineales, sistemas y raíces cuadráticas con actividades introductorias.'],
  geometry:['/courses/geometry/','Geometry','Geometría','Review angles, triangle relationships, similarity, and measurement with introductory activities.','Repasa ángulos, relaciones entre triángulos, semejanza y medición con actividades introductorias.'],
  'algebra-2':['/courses/algebra-2/','Algebra II','Álgebra II','Explore polynomial factors, rational expressions, exponentials, and logarithms in introductory lessons.','Explora factores de polinomios, expresiones racionales, funciones exponenciales y logaritmos en lecciones introductorias.'],
  'coordinate-geometry':['/courses/coordinate-geometry/','Coordinate Geometry','Geometría analítica','Connect coordinates, distance and equations through four lessons and two guided projects with six steps each.','Relaciona coordenadas, distancias y ecuaciones mediante cuatro lecciones y dos proyectos guiados de seis pasos cada uno.'],
  af01:['/modules/af01/dist/','Pre-calculus','Precálculo','Connect functions to graphs, angles, and growth through selected introductory activities.','Relaciona las funciones con sus gráficas, los ángulos y el crecimiento mediante actividades introductorias seleccionadas.'],
  ad01:['/modules/ad01/dist/','Calculus','Cálculo','Explore limits, derivatives, and accumulation through interactive graphs and introductory questions.','Explora límites, derivadas y acumulación mediante gráficas interactivas y preguntas introductorias.'],
  ae01:['/modules/ae01/dist/','Statistics','Estadística','Read distributions, compare summaries, and examine study design with introductory statistics activities.','Interpreta distribuciones, compara resúmenes de datos y examina el diseño de estudios con actividades introductorias de estadística.'],
  ab01:['/modules/ab01/dist/','Linear Algebra','Álgebra lineal','Connect two-dimensional vectors and matrices with geometric transformations and introductory checks.','Relaciona vectores y matrices en dos dimensiones con transformaciones geométricas y ejercicios introductorios.'],
  'number-theory':['/courses/number-theory/','Number Theory','Teoría de números','Explore divisibility, primes, and congruences through ten projects with step-by-step reference proofs.','Explora divisibilidad, números primos y congruencias mediante diez proyectos con demostraciones de referencia paso a paso.'],
  ac01:['/modules/ac01/dist/','Game Theory Foundations','Fundamentos de teoría de juegos','Explore payoff tables, best responses, dominant strategies, and pure Nash equilibria in four English lessons.','Explora tablas de pagos, mejores respuestas, estrategias dominantes y equilibrios de Nash puros en cuatro lecciones en inglés.'],
  'physics-1':['/courses/physics-1/','Physics 1 Foundations','Fundamentos de Física 1','Explore motion, forces, energy, momentum, rotation, oscillations, and fluids in introductory lessons.','Explora movimiento, fuerzas, energía, cantidad de movimiento, rotación, oscilaciones y fluidos en lecciones introductorias.'],
  'physics-2':['/courses/physics-2/','Physics 2 Foundations','Fundamentos de Física 2','Explore heat, electric fields, circuits, magnetism, optics, waves, and photons after basic mechanics.','Explora calor, campos eléctricos, circuitos, magnetismo, óptica, ondas y fotones después de estudiar mecánica básica.'],
};
const PAGES={
  '/checks/':{en:['Test your understanding','Choose an interactive model and explanation activity or continue with the original subject check.'],es:['Comprueba tu comprensión','Elige una actividad con modelos interactivos y explicaciones o continúa con la evaluación original de la materia.']},
  '/explain/':{fixedLocale:'en',locales:['en'],en:['Math Voice Lab','Explore six mathematics models, explain your reasoning, and keep original responses with local recording and scripted follow-ups. This activity is English only.']},
  '/intuition/':{en:['Intuition Lab','Test a mathematical hunch with interactive models, calculations and reflection across thirteen subjects.'],es:['Laboratorio de intuición','Pon a prueba una idea matemática con modelos interactivos, cálculos y reflexión en trece materias.'],'zh-Hant':['直覺實驗室','透過十二個學科的互動模型、計算與反思，檢驗你的數學猜想。'],locales:['en','es','zh-Hant'],sitemap:true},
  '/modules/ad01/dist/checks/':{en:['Calculus · Test your understanding','Choose a graph-based reasoning activity or the original four-problem Calculus check.'],es:['Cálculo · Comprueba tu comprensión','Elige una actividad de razonamiento gráfico o la evaluación original de cuatro problemas de cálculo.']},
  '/modules/ad01/dist/think/':{fixedLocale:'en',en:['Calculus · Think in motion','Explore a claim about velocity and acceleration through graphs and your own explanation. This dialogue activity is English only.']},

  '/modules/ac01/dist/projects/':{en:['Game Theory Projects and Cases','Explore food-truck choices, shared maintenance and a missed deadline with payoff models and evidence-based plans.'],es:['Proyectos y casos de teoría de juegos','Explora decisiones de puestos de comida, mantenimiento compartido y un plazo incumplido con modelos de pagos y planes basados en pruebas.'],sitemap:true},
  '/':{en:['Mathematics and Science Learning','Explore the mathematics knowledge map, choose introductory lessons, and test your understanding with multi-part problems.'],es:['Aprendizaje de Matemáticas y Ciencias','Explora el mapa de conocimientos de matemáticas, elige lecciones introductorias y comprueba tu comprensión con problemas de varios pasos.'],sitemap:true},
  '/data-use/':{en:['Data Use and Local Records','Learn how Quidence keeps answers and reports in your browser during public testing and how to export or delete them.'],es:['Uso de datos y registros locales','Conoce cómo Quidence guarda respuestas e informes en tu navegador durante las pruebas públicas y cómo exportarlos o eliminarlos.'],sitemap:true},
  '/account/':{en:['Account','Account information during public testing.'],es:['Cuenta','Información de la cuenta durante las pruebas públicas.'],noindex:true},
  '/records/':{en:['Manage Local Records','Export, restore, or delete learning records stored in this browser.'],es:['Administrar registros locales','Exporta, restaura o elimina los registros de aprendizaje guardados en este navegador.'],noindex:true},
  '/reports/':{en:['Saved Reports','Review learning reports saved in this browser.'],es:['Informes guardados','Revisa los informes de aprendizaje guardados en este navegador.'],noindex:true},
  '/modules/aa01/dist/':{en:['Visual Algebra','Explore equations and algebra through visual activities and reasoning checks.'],es:['Álgebra visual','Explora ecuaciones y álgebra mediante actividades visuales y ejercicios de razonamiento.']},
  '/modules/ab01/dist/vectors.html':{en:['Vectors','Explore two-dimensional vectors with interactive visual models.'],es:['Vectores','Explora vectores en dos dimensiones con modelos visuales interactivos.']},
  '/modules/ab01/dist/matrix.html':{en:['Matrices and Transformations','Explore matrices and their geometric transformations with interactive visual models.'],es:['Matrices y transformaciones','Explora matrices y sus transformaciones geométricas con modelos visuales interactivos.']},
  '/courses/physics/':{en:['Introductory Physics','Explore selected introductory physics models and questions.'],es:['Introducción a la física','Explora modelos y preguntas seleccionados de física introductoria.']},
};
for(const c of Object.values(COURSES))PAGES[c[0]]={en:[c[1],c[3]],es:[c[2],c[4]],sitemap:true};
PAGES['/courses/coordinate-geometry/'].locales=['en','es','zh-Hant'];
PAGES['/courses/coordinate-geometry/']['zh-Hant']=['解析幾何','透過兩個各六步的引導式專題，連接座標、距離與方程式。'];
const ACTIVITIES={
  '/checks/':{en:'Test Your Understanding',es:'Comprueba tu comprensión'},
  '/diagnostics/':{en:'Test Your Understanding',es:'Comprueba tu comprensión'},
  '/projects/':{en:'Field Projects',es:'Proyectos de aplicación'},
  '/foundations/':{en:'Foundation Check',es:'Evaluación de fundamentos'},
};
const FOUNDATION_IDS=new Set(['aa01','ab01','ac01','ad01','ae01','af01']);
function normalizePath(path){
  const normalized=path.replace(/\/index\.html$/,'/')||'/';
  return PAGES[normalized+'/']||ACTIVITIES[normalized+'/']?normalized+'/':normalized;
}
function resolve(input,actualLocale){
  const url=new URL(input,ORIGIN),pathname=normalizePath(url.pathname);
  const supported=PAGES[pathname]?.locales||['en','es'];
  const locale=PAGES[pathname]?.fixedLocale||(supported.includes(actualLocale)?actualLocale:supported.includes(url.searchParams.get('lang'))?url.searchParams.get('lang'):'en');
  let page=PAGES[pathname],moduleId=null;
  if(ACTIVITIES[pathname]){
    const id=url.searchParams.get('module'),valid=pathname==='/checks/'?['ab01','ae01','af01','ac01','geometry','algebra-2'].includes(id):pathname==='/foundations/'?FOUNDATION_IDS.has(id):Object.hasOwn(COURSES,id)&&id!=='ac01'&&(!['number-theory','coordinate-geometry'].includes(id)||pathname==='/diagnostics/')||id==='physics';
    const title=id==='aa01'?(locale==='es'?'Preálgebra y Álgebra I':'Pre-Algebra and Algebra I'):id==='physics'?(locale==='es'?'Física':'Physics'):COURSES[id]?.[locale==='es'?2:1];
    moduleId=valid?id:null;
    const label=ACTIVITIES[pathname][locale];
    page={noindex:!valid,[locale]:[title&&valid?title+' · '+label:label,locale==='es'?'Trabaja en problemas de varios pasos y guarda tus respuestas y explicaciones en este navegador.':'Work through multi-part problems and save your answers and explanations in this browser.']};
  }
  if(!page)return null;
  const canonical=new URL(pathname,ORIGIN);
  if(moduleId)canonical.searchParams.set('module',moduleId);
  canonical.searchParams.set('lang',locale);
  const alternate=lang=>{const u=new URL(canonical);u.searchParams.set('lang',lang);return u.href;};
  return{pathname,locale,title:page[locale][0]+' · Quidence',description:page[locale][1],canonical:canonical.href,noindex:!!page.noindex,
    alternates:page.noindex?[]:page.fixedLocale?[[page.fixedLocale,alternate(page.fixedLocale)]]:[...supported.map(lang=>[lang,alternate(lang)]),['es-MX',alternate('es')]],sitemap:!!page.sitemap};
}
return{ORIGIN,COURSES,PAGES,ACTIVITIES,normalizePath,resolve};
});
