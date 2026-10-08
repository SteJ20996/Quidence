(function(root){
'use strict';
const GROUPS=[{id:'school',title:'School Mathematics',description:'Four separate courses. Choose the class you are taking.'},{id:'further',title:'Further Mathematics',description:'Connect functions, change, data, and linear transformations.'},{id:'science',title:'Science',description:'Use models, data, and simple mathematics to investigate the physical world.'}];
const COURSES={
 'pre-algebra':{title:'Pre-Algebra',group:'school',course:'courses/pre-algebra/',description:'Signed numbers, fractions, ratios, and expressions.',scope:'Four introductory lessons; selected foundations, not a complete school course.',illustration:'pre-algebra'},
 'algebra-1':{title:'Algebra I',group:'school',course:'courses/algebra-1/',description:'Equations, linear functions, systems, and quadratic roots.',scope:'Four introductory lessons. Continue with the original visual algebra activities for more practice.',illustration:'algebra-1'},
 geometry:{title:'Geometry',group:'school',course:'courses/geometry/',description:'Angles, triangle relationships, similarity, and measurement.',scope:'Four introductory lessons. Formal proof, circles, and transformations come later.',illustration:'geometry'},
 'algebra-2':{title:'Algebra II',group:'school',course:'courses/algebra-2/',description:'Polynomial factors, rational restrictions, exponentials, and logarithms.',scope:'Four introductory lessons. A full function-analysis course comes later.',illustration:'algebra-2'},
 af01:{title:'Pre-calculus',group:'further',course:'modules/af01/dist/',foundation:'foundations/?module=af01',description:'Connect function rules to graphs, angles, and growth.',scope:'Selected introductory activities and a separate foundation check.',illustration:'af01'},
 ad01:{title:'Calculus',group:'further',course:'modules/ad01/dist/',foundation:'foundations/?module=ad01',description:'Explore limits, tangent slopes, and accumulation through interactive graphs.',scope:'Limits, derivatives, and accumulation activities are open.',illustration:'ad01'},
 ae01:{title:'Statistics',group:'further',course:'modules/ae01/dist/',foundation:'foundations/?module=ae01',description:'Read distributions, compare summaries, and examine study design.',scope:'Statistics foundations and applied projects are open.',illustration:'ae01'},
 ab01:{title:'Linear Algebra',group:'further',course:'modules/ab01/dist/',foundation:'foundations/?module=ab01',description:'Connect vectors and matrices with geometric transformations.',scope:'Selected two-dimensional vector and matrix activities.',illustration:'ab01'},
 physics:{title:'Physics',group:'science',course:'courses/physics/',description:'Investigate motion, forces, energy, and waves with simple algebra and evidence.',scope:'Four starting units for grades 9–10, connected to selected California NGSS expectations; not a complete school course.',illustration:'physics'},
};
for(const id of ['pre-algebra','algebra-1']){COURSES[id].foundation='foundations/?module=aa01';COURSES[id].foundationLabel='Shared Pre-Algebra / Algebra I foundation check →';COURSES[id].foundationCardLabel='Shared school foundations · 15 questions →';}
for(const[id,c]of Object.entries(COURSES)){c.project='projects/?module='+id;c.projectCount=2;c.challenge='diagnostics/?module='+id;c.challengeCount=id==='ab01'?12:id==='physics'?6:4;}
const api={GROUPS,COURSES};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceCourseCatalog=api;
})(typeof window==='undefined'?globalThis:window);
