(function(root){
'use strict';
// Coordinate Geometry "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
const VERSION='coordinate-geometry-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Distance, midpoint and lines','Equal distances and circles'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Show the calculation and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill)=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which mathematical condition applies.'});
const yn=[['yes','Yes'],['no','No']];
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'coordinate-geometry',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'coordinate-geometry':{
 title:'Coordinate Geometry',course:'../courses/coordinate-geometry/',
 scope:'Distance and midpoints from coordinates, slopes of parallel and perpendicular lines, the points equally far from two points, and circles from their center and radius',
 prerequisite:'Signed numbers, plotting points, the Pythagorean theorem, solving linear equations and reading a constant rate. The foundation check covers these.',
 groups,
 notChecked:['Vectors, conic sections other than circles, three-dimensional coordinates and written proofs'],
 suppliedInformation:[],
 tasks:[
  t('cg-c01',0,'medium','How far, and where is the middle?',
   'A(−2, 1) and B(4, 9) are two stations on a map grid. Find the distance AB and the midpoint M of AB. Then decide whether P(8, 1) is the same distance from A as B is.',
   [n('distance','Distance AB',10,'Distance from coordinate changes'),
    n('mx','x-coordinate of M',1,'Midpoint as an average'),
    n('my','y-coordinate of M',5,'Midpoint as an average'),
    c('same','Is AP equal to AB?',yn,'yes','Comparing distances')],
   'Show the horizontal and vertical changes you used, and explain why the midpoint uses averages.',
   'From A to B, x changes by 6 and y by 8, so AB = √(6² + 8²) = √100 = 10. The midpoint averages the coordinates: ((−2 + 4) ÷ 2, (1 + 9) ÷ 2) = (1, 5). From A to P, x changes by 10 and y by 0, so AP = 10 = AB.',
   'Find another grid point exactly 10 units from A that is neither straight across from A nor directly above or below it.'),
  t('cg-c02',0,'medium','A path at a right angle',
   'A straight road passes through A(1, 2) and B(5, 10). Find its slope and y-intercept. A footpath meets the road at a right angle and passes through C(4, 1). Find the footpath’s slope and y-intercept.',
   [n('slope','Slope of the road',2,'Slope from two points'),
    n('intercept','y-intercept of the road',0,'Equation of a line',['slope']),
    n('perpendicular','Slope of the footpath',-0.5,'Perpendicular slopes',['slope']),
    n('pathIntercept','y-intercept of the footpath',3,'Line through a point with a given slope',['perpendicular'])],
   'Explain how you found each slope, and check that C lies on your footpath equation.',
   'The road rises 10 − 2 = 8 while running 5 − 1 = 4, so its slope is 2. Then 2 = 2 × 1 + b gives b = 0: the road is y = 2x. A perpendicular slope multiplies with 2 to give −1, so it is −1/2. Then 1 = −1/2 × 4 + b gives b = 3: the footpath is y = −x/2 + 3.',
   'Find where the road and the footpath meet, and check that point on both equations.'),
  t('cg-c03',1,'challenging','A fair place to meet',
   'Two friends live at A(0, 0) and B(6, 4). Every point equally far from A and B lies on one line. Find that line’s slope and y-intercept. Then find the point on the x-axis that is equally far from A and B, and decide whether the midpoint of AB is the only fair point.',
   [n('slope','Slope of the line of fair points',-1.5,'Perpendicular bisector'),
    n('intercept','y-intercept of that line',6.5,'Line through the midpoint',['slope']),
    n('axis','x-coordinate of the fair point on the x-axis',13/3,'Intersecting with an axis',['slope','intercept']),
    c('only','Is the midpoint of AB the only point equally far from A and B?',yn,'no','Which points are equally far')],
   'Explain why the fair points form a line through the midpoint, and check your x-axis point by computing both distances.',
   'The midpoint of AB is (3, 2), and AB has slope 4 ÷ 6 = 2/3. Fair points lie on the perpendicular bisector, with slope −3/2 through (3, 2): 2 = −3/2 × 3 + b gives b = 13/2 = 6.5. On the x-axis, 0 = −1.5x + 6.5 gives x = 13/3. Check: the distance to A is 13/3, and to B it is √((13/3 − 6)² + 4²) = √(25/9 + 144/9) = 13/3. The midpoint is one fair point among infinitely many.',
   'Add a third friend at C(0, 6) and find the one point equally far from all three.'),
  t('cg-c04',1,'challenging','A circle on a diameter',
   'A(−1, 2) and B(5, 10) are the ends of a diameter of a circle. Find the center and radius. Then decide whether the angle at P(5, 2) in triangle APB is a right angle.',
   [n('cx','x-coordinate of the center',2,'Center as a midpoint'),
    n('cy','y-coordinate of the center',6,'Center as a midpoint'),
    n('radius','Radius',5,'Radius from a distance',['cx','cy']),
    c('right','Is the angle at P a right angle?',yn,'yes','Points on a circle and right angles')],
   'Write the circle’s equation, show whether P is on it, and explain what that tells you about the angle at P.',
   'The center is the midpoint ((−1 + 5) ÷ 2, (2 + 10) ÷ 2) = (2, 6). The radius is half of AB = √(6² + 8²) = 10, so 5. The circle is (x − 2)² + (y − 6)² = 25. For P, 3² + (−4)² = 25, so P is on the circle. A point on a circle sees a diameter at a right angle (Thales’ theorem). Directly: PA runs 6 units left and PB runs 8 units up, so they are perpendicular.',
   'Find a second grid point on this circle and check the angle it makes with A and B.')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceCoordinateGeometryChallenges=api;
})(typeof window==='undefined'?globalThis:window);
