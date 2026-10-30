(function(root){
'use strict';
// Basic Logic "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
const VERSION='basic-logic-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Statements and conditionals','Arguments and quantifiers'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Show the calculation and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which mathematical condition applies.',dependsOn});
const yn=[['yes','Yes'],['no','No']];
// Option values must not contain one another: saved answers and checks compare them as strings.
const valid=[['follows','Valid'],['fails','Invalid']];
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'basic-logic',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'basic-logic':{
 title:'Basic Logic',course:'../courses/basic-logic/',
 scope:'Truth tables with three statements, conditionals and their converses, valid and invalid arguments, and statements with “all”, “some”, and “no”',
 prerequisite:'Facts about integers, inequalities, counting cases, reading rules and definitions precisely, and simple equations. The foundation check covers these.',
 groups,
 notChecked:['Symbolic logic with ∀ and ∃, formal proof systems, and set theory'],
 suppliedInformation:[],
 tasks:[
  t('bl-c01',0,'medium','Three statements and parentheses',
   'A truth table for three statements P, Q, and R lists every combination of truth values. How many rows does it have? In how many rows is “P and (Q or R)” true? In how many rows is “(P and Q) or R” true? Do the two statements mean the same thing?',
   [n('rows','Rows in a truth table for P, Q, and R',8,'Counting the rows of a truth table'),
    n('first','Rows where “P and (Q or R)” is true',3,'Evaluating a grouped statement',['rows']),
    n('second','Rows where “(P and Q) or R” is true',5,'Grouping with parentheses',['rows']),
    c('same','Do the two statements mean the same thing?',yn,'no','Comparing two statements',['first','second'])],
   'Explain how you counted the rows for each statement, and name one row where the two statements differ.',
   'Each of P, Q, and R is true or false, so there are 2 × 2 × 2 = 8 rows. “P and (Q or R)” needs P true and at least one of Q and R true: 3 of the 4 rows with P true. “(P and Q) or R” is true in the 4 rows with R true, and in 1 more row where R is false and P and Q are both true: 5 rows. The statements differ, for example when P is false and R is true: the first is false and the second is true.',
   'Write a statement that uses P, Q, and R and is true in exactly one row.'),
  t('bl-c02',0,'medium','A rule about numbers that end in 5',
   'Statement S: “If a whole number ends in 5, then it is divisible by 5.” Is S true? Is its converse, “If a whole number is divisible by 5, then it ends in 5”, true? How many whole numbers from 1 to 50 are counterexamples to the converse? Which statement means the same as S?',
   [c('s','Is statement S true?',yn,'yes','Testing a conditional'),
    c('converse','Is the converse true?',yn,'no','Separating a conditional from its converse'),
    n('counter','Counterexamples to the converse from 1 to 50',5,'Counting counterexamples',['converse']),
    c('equivalent','Which statement means the same as S?',[['contra','If a whole number is not divisible by 5, then it does not end in 5.'],['inverse','If a whole number does not end in 5, then it is not divisible by 5.'],['converse','If a whole number is divisible by 5, then it ends in 5.']],'contra','The contrapositive')],
   'Explain what a counterexample to the converse must look like, and why the statement you chose means the same as S.',
   'A number that ends in 5 is 10k + 5 = 5(2k + 1), so S is true. The converse fails for any multiple of 5 that ends in 0. From 1 to 50 these are 10, 20, 30, 40, and 50: 5 counterexamples. The contrapositive, “If a whole number is not divisible by 5, then it does not end in 5”, always has the same truth value as S. The inverse matches the converse and is false: 10 does not end in 5 but is divisible by 5.',
   'Find a true conditional about whole numbers whose converse is also true.'),
  t('bl-c03',1,'challenging','Three arguments',
   'Decide whether each argument is valid. Argument A: “If P, then Q. If not P, then R. So Q or R.” Argument B: “P or Q. Not P. So Q.” Argument C: “P or Q. P. So not Q.” For argument A, also find in how many of the 8 rows of a truth table for P, Q, and R both premises are true.',
   [c('a','Argument A',valid,'follows','Reasoning by cases'),
    n('rows','Rows where both premises of argument A are true',4,'Finding the rows with true premises'),
    c('b','Argument B',valid,'follows','Ruling out one part of an “or”'),
    c('c','Argument C',valid,'fails','Reading the inclusive or')],
   'For each invalid argument, give a row with true premises and a false conclusion. For each valid argument, explain why no such row exists.',
   'Argument A has both premises true in 4 rows: P and Q true, with R either way; and P false with R true, with Q either way. In each of these rows “Q or R” is true, so A is valid. In B, “not P” makes P false, and “P or Q” then needs Q true, so B is valid. C is invalid because “or” is inclusive: when P and Q are both true, both premises are true and “not Q” is false.',
   'Change argument C so that it becomes valid, and explain the change.'),
  t('bl-c04',1,'challenging','Clubs and classes',
   'At a school, every robotics member takes physics. No physics student takes art. Some art students take music. Must it be true that no robotics member takes art? Must at least one robotics member take music? Must at least one music student not take physics? If 80 students take physics and 50 take art, how many students take physics or art?',
   [c('noArt','Must it be true that no robotics member takes art?',yn,'yes','Combining an “all” and a “no” statement'),
    c('music','Must at least one robotics member take music?',yn,'no','Finding a counterexample diagram'),
    c('notPhysics','Must at least one music student not take physics?',yn,'yes','Combining a “some” and a “no” statement'),
    n('either','Students who take physics or art',130,'Counting two groups with no overlap')],
   'Draw a diagram for the robotics, physics, art, and music groups. Use it to support each answer, and explain why the last count needs no subtraction.',
   'Every robotics member is inside the physics group, and the physics and art groups do not overlap, so no robotics member takes art. Nothing links robotics to music: a school where no robotics member takes music fits every statement, so that does not have to be true. The art students who take music are not in physics, because no physics student takes art, so at least one music student does not take physics. The physics and art groups have no one in common, so 80 + 50 = 130 students take physics or art.',
   'Suppose the school has at least one robotics member. Add one fact about physics students so that at least one robotics member must take music.')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceBasicLogicChallenges=api;
})(typeof window==='undefined'?globalThis:window);
