(function(root){
'use strict';
// Discrete Mathematics "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
const VERSION='discrete-math-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Counting and recurrences','Graphs, induction and invariants'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Show the calculation and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which mathematical condition applies.',dependsOn});
const yn=[['yes','Yes'],['no','No']];
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'discrete-math',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'discrete-math':{
 title:'Discrete Mathematics',course:'../courses/discrete-math/',
 scope:'Counting with and without order, recurrences found from a first choice, degrees in graphs, and proofs by induction and invariants',
 prerequisite:'Careful counting, number patterns, parity and remainders, reading logical statements, and the algebra the course uses. The foundation check covers these.',
 groups,
 notChecked:['Generating functions, graph algorithms and formal logic. Written explanations are saved for review but not scored'],
 suppliedInformation:[],
 tasks:[
  t('dm-c01',0,'medium','Committees and roles',
   'A club has 7 members, including Ana. How many different 3-person committees can it choose? In how many ways can it fill the roles of president, treasurer and secretary with three different members? How many 3-person committees include Ana, and how many do not?',
   [n('committees','3-person committees',35,'Choosing without order'),
    n('roles','Ways to fill the three roles',210,'Counting ordered choices'),
    n('withAna','Committees that include Ana',15,'Fixing one member'),
    n('withoutAna','Committees without Ana',20,'Splitting a count into cases',['committees','withAna'])],
   'Explain why the roles count is larger than the committee count, and check that your two cases add up to the total.',
   'The roles can be filled in 7 × 6 × 5 = 210 ways. Each committee can be given the three roles in 3! = 6 ways, so there are 210 ÷ 6 = 35 committees, which is C(7, 3). With Ana on the committee, choose 2 of the other 6 members: C(6, 2) = 15. Without Ana, choose 3 of the other 6: C(6, 3) = 20. Every committee either includes Ana or does not, so 15 + 20 = 35. This is Pascal’s rule.',
   'How many 3-person committees include Ana or Ben, or both?'),
  t('dm-c02',0,'medium','Paths made of 1s and 3s',
   'A garden path of length n is laid in a row, from left to right, with stones of length 1 and length 3. Let W(n) be the number of ways to lay a path of length n, so W(1) = 1, W(2) = 1 and W(3) = 2. Find W(4). Which rule do the values follow? Find W(8), and count the paths of length 8 that start with a stone of length 3.',
   [n('w4','W(4)',3,'Listing small cases'),
    c('rule','For n ≥ 4, W(n) equals',[['three','W(n − 1) + W(n − 3)'],['two','W(n − 1) + W(n − 2)'],['double','2W(n − 1)'],['plus','W(n − 1) + 3']],'three','Finding a recurrence from the first stone'),
    n('w8','W(8)',13,'Using a recurrence',['rule']),
    n('startThree','Paths of length 8 that start with a stone of length 3',4,'Counting by the first choice',['rule'])],
   'Explain how the first stone splits the paths into two groups, and why those groups give your rule.',
   'For n = 4 the paths are 1 + 1 + 1 + 1, 1 + 3 and 3 + 1, so W(4) = 3. The first stone is either a 1, which leaves a path of length n − 1, or a 3, which leaves a path of length n − 3, so W(n) = W(n − 1) + W(n − 3). From 1, 1, 2, 3 the values continue 4, 6, 9, 13, so W(8) = 13. A path of length 8 that starts with a 3 leaves a path of length 5, so there are W(5) = 4 of them.',
   'Set W(0) = 1 and check the rule at n = 3. What does W(0) count?'),
  t('dm-c03',1,'challenging','A league table',
   'Eight teams play in a league, and two teams play each other at most once. If every pair of teams plays once, how many games are played? Midway through a season, could the numbers of games the teams have played be 1, 2, 3, 3, 4, 4, 5 and 5? If every team has played exactly 3 games, how many games have been played? Could all eight teams have played different numbers of games?',
   [n('all','Games if every pair plays once',28,'Counting pairs'),
    c('possible','Could the teams have played 1, 2, 3, 3, 4, 4, 5 and 5 games?',yn,'no','The handshake lemma'),
    n('regular','Games played if every team has played 3',12,'Degrees and edges'),
    c('different','Could all eight teams have played different numbers of games?',yn,'no','The pigeonhole principle with degrees')],
   'Model the league as a graph. Use the sum of the degrees for the second and third answers, and the possible degrees for the fourth.',
   'If every pair plays once, there are C(8, 2) = 8 × 7 ÷ 2 = 28 games. Each game adds 1 to the count of two teams, so the counts always add up to an even number. 1 + 2 + 3 + 3 + 4 + 4 + 5 + 5 = 27 is odd, so those counts are impossible. If every team has played 3 games, the counts add up to 8 × 3 = 24, twice the number of games, so 12 games have been played. Each count is between 0 and 7, but 0 and 7 cannot both occur, because a team with 7 games has played every other team. So at most 7 different counts are possible for 8 teams, and two teams must share a count.',
   'Draw a league of 8 teams in which every team has played exactly 3 games.'),
  t('dm-c04',1,'challenging','An induction and an invariant',
   'Find 1 + 3 + 5 + ⋯ + 29, and choose the equation that makes the inductive step work for 1 + 3 + ⋯ + (2n − 1) = n². Then the numbers 1 to 10 are written on a board. Repeatedly erase two numbers a and b and write a + b, until one number is left. What is it? If instead you write |a − b| each time, can the last number be 0?',
   [n('odd','1 + 3 + 5 + ⋯ + 29',225,'Summing odd numbers'),
    c('step','The inductive step uses',[['next','n² + (2n + 1) = (n + 1)²'],['same','n² + (2n − 1) = (n + 1)²'],['double','n² + 2n = (n + 1)²']],'next','The inductive step'),
    n('last','Last number when writing a + b',55,'An invariant sum'),
    c('zero','Can the last number be 0 when writing |a − b|?',yn,'no','A parity invariant')],
   'Explain the inductive step in words, and name the quantity that never changes on the board in each version.',
   '1 + 3 + ⋯ + 29 has 15 odd numbers, so it equals 15² = 225. If 1 + 3 + ⋯ + (2n − 1) = n², adding the next odd number, 2n + 1, gives n² + 2n + 1 = (n + 1)². Writing a + b keeps the total unchanged, so the last number is 1 + 2 + ⋯ + 10 = 55. Writing |a − b| can change the total, but a + b and |a − b| differ by twice the smaller number, an even number, so the total keeps its parity. It starts odd, at 55, so the last number is odd and cannot be 0.',
   'Start with the numbers 1 to 11 instead. Can the last number be 0 now? Find a way or explain why not.')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceDiscreteMathChallenges=api;
})(typeof window==='undefined'?globalThis:window);
