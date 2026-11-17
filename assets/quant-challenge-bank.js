(function(root){
'use strict';
// Quantitative Reasoning "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
// Each problem uses the course's own shortcuts and states every value it needs.
const VERSION='quantitative-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Estimates and bounds','Shortcuts and decisions'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Write out the shortcut you used and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which model decides it.',dependsOn});
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'quantitative',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'quantitative':{
 title:'Quantitative Reasoning',course:'../courses/quantitative/',
 scope:'Fermi estimates with bounds, doubling times, the square-root law, “at least one” chances, indicators, symmetry, Bayes’ rule in counts, ruin, the Kelly share and waiting times for patterns, as the course’s lessons model them',
 prerequisite:'Percents and ratios, powers and roots, rounding, simple chances and counting, and averages and odds. The foundation check covers these.',
 groups,
 notChecked:['Choosing which shortcut fits a new situation without a prompt, and judging in words when a shortcut fails; the explanations are kept for review, not graded','First-step analysis (taking turns and collecting) and quoting a price with informed traders; the course teaches them, but these problems do not test them'],
 suppliedInformation:[],
 tasks:[
  t('qr-c01',0,'medium','Water for a school year',
   'A school of 600 students wants a quick estimate of the drinking water its students use at school in a 180-day year. You are sure each student drinks more than 0.25 L and less than 1 L a day at school. What single daily amount is equally many times from both bounds? Using exactly that amount, how many liters do the students drink in the year? The number of students grows by 4% a year: by the rule of 72, about how many years until it doubles? Then choose why the fair middle of the two bounds is not their average.',
   [n('perStudent','Liters per student per day, equally many times from both bounds',0.5,'Taking the geometric mean of two bounds'),
    n('total','Liters for the whole school in the year',54000,'Multiplying the factors of a Fermi estimate',['perStudent']),
    n('double','Years to double at 4% a year, by the rule of 72',18,'Using the rule of 72'),
    c('why','The fair middle of the bounds is not their average because…',[['times','the uncertainty is in how many times too big or too small, so the fair middle is equally many times from each bound'],['smaller','the smaller number is always the safer estimate'],['exact','the geometric mean is always the exact answer']],'times','Explaining the geometric mean of bounds')],
   'Show each factor of the estimate, and say how far off you think the total could be.',
   'The geometric mean √(0.25 × 1) = 0.5 L is 2 times the low bound and half the high bound; the average, 0.625 L, is 2.5 times the low bound but only 1.6 times below the high one. The total is 600 × 0.5 × 180 = 54,000 L. The rule of 72 gives 72 ÷ 4 = 18 years; exactly, ln 2 ÷ ln 1.04 ≈ 17.7. When the uncertainty is in how many times too big or too small a number might be, the fair middle is equally many times from each bound.',
   'If you were only sure the amount was between 0.1 L and 2 L, what would the geometric mean be, and how many times could the total then be off?'),
  t('qr-c02',0,'challenging','Spread and “at least one”',
   'You may use a calculator. A fair coin is tossed 400 times. What is the standard deviation of the number of heads? About 95% of results lie within 2 standard deviations of 200: what is the lowest number of heads in that range? Each of 10 independent tries succeeds with chance 20%. What is the chance of at least one success, to the nearest 10 percent? Then choose why 10 × 20% = 200% cannot be that chance.',
   [n('sd','Standard deviation of the number of heads',10,'Using the square-root law'),
    n('low','Lowest number of heads within 2 standard deviations of 200',180,'Using 2 standard deviations for about 95%',['sd']),
    n('atLeast','Chance of at least one success, to the nearest 10 percent (%)',90,'Using the complement rule'),
    c('overcount','10 × 20% = 200% cannot be the chance because…',[['overlap','adding counts every outcome with two or more successes more than once'],['small','20% is too small to add'],['rounding','the percents should be rounded before adding']],'overlap','Explaining why the union bound overcounts')],
   'Show the formula you used for each number, and explain why the complement rule is easier here.',
   'The standard deviation of the count is √400 ÷ 2 = 10 heads, so about 95% of results lie from 200 − 20 = 180 to 220. The chance of no success is 0.8¹⁰ ≈ 0.107, so the chance of at least one is 1 − 0.107 ≈ 0.893, or 90% to the nearest 10 percent. The quick routes agree: 0.8¹⁰ = 2³⁰ ÷ 10¹⁰ ≈ 10⁹ ÷ 10¹⁰ = 0.1 gives 90%, and 1 − e^(−10 × 0.2) = 1 − e⁻² ≈ 86% also rounds to 90%. Adding 10 × 20% counts every outcome with two or more successes more than once, so it is only an upper bound, and here a useless one, since no chance exceeds 100%.',
   'How many tosses would make the standard deviation of the share of heads half as large as at 400 tosses?'),
  t('qr-c03',1,'medium','Averages, positions and a positive test',
   'You may use a calculator. Twelve friends put their names in a hat and each draws one. On average, how many draw their own name? A shuffled pile of 29 cards holds 4 special cards: on average, at which position is the first special card? A condition affects 30 in 1,000 people. A test is positive for 90% of people who have it and for 10% of people who do not. What is the chance that someone who tests positive has the condition, to the nearest whole percent? Then choose why most positive results here are false alarms.',
   [n('matches','Average number who draw their own name',1,'Adding indicators'),
    n('position','Average position of the first special card',6,'Using symmetry: equal gaps'),
    n('positive','Chance that a positive result is right, to the nearest whole percent (%)',22,'Using Bayes’ rule with counts'),
    c('alarms','Most positive results are false alarms because…',[['many','a small share of the many people without it test positive, and they outnumber the true positives from the few who have it'],['inaccurate','the test is wrong most of the time'],['rare','rare conditions are hard to test for']],'many','Explaining the base rate')],
   'Write each answer as a sum of indicators, a symmetry argument or counts of people.',
   'Each friend draws their own name with chance 1/12, so the 12 indicators add to 12 × 1/12 = 1. The 4 special cards cut the other 25 into 5 gaps of the same average size, 5 cards, so the first special card is on average at position 5 + 1 = 6 = (29 + 1) ÷ (4 + 1). In 1,000 people, 30 have the condition and 27 of them test positive; 10% of the other 970, 97 people, test positive too. So 27 of 124 positive results are right: about 22%.',
   'If the condition affected 300 in 1,000 people, with the same test, what share of positive results would be right?'),
  t('qr-c04',1,'challenging','Ruin, stakes and patterns',
   'In a fair game you win or lose 1 point each round with equal chance. You start with 18 points and stop at 0 or at 60: what is the chance of reaching 60, in percent? In another game, each round you win what you stake with chance 65%, or lose your stake: what share of your points should you stake each round, in percent, to grow them fastest over many rounds? On average, how many flips of a fair coin does it take until HTHT first appears? Then, in Penney’s game, where each player picks a pattern of three flips and the one that appears first wins, your friend picks THT: choose the pattern that beats it most often.',
   [n('reach','Chance of reaching 60 points (%)',30,'Using the fair-game ruin result'),
    n('kelly','Share of points staked each round for the fastest long-run growth (%)',30,'Using the Kelly share'),
    n('wait','Average flips until HTHT appears',20,'Using the overlap rule for waiting times'),
    c('beats','The pattern that beats THT most often',[['tth','TTH'],['hth','HTH'],['ttt','TTT']],'tth','Using the second-player rule')],
   'Explain each answer with the rule from the lesson, and say what each rule assumes.',
   'In a fair game the expected points never change, so 18 = P × 60 and P = 30%. The Kelly share for a 1 to 1 payoff is p − (1 − p) = 0.65 − 0.35 = 30%. HTHT overlaps itself at lengths 2 and 4, so its average wait is 4 + 16 = 20 flips. The second-player rule takes the opposite of THT’s second letter, T, then THT’s first two letters: TTH, which comes first 2 times in 3. HTH comes first only half the time against THT, and TTT 2 times in 5.',
   'Which pattern beats TTH most often, and how often does it win?')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantChallenges=api;
})(typeof window==='undefined'?globalThis:window);
