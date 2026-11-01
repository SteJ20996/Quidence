(function(root){
'use strict';
// Probability "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
const VERSION='probability-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Chance and evidence','Expectation and the long run'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Show the calculation and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which mathematical condition applies.',dependsOn});
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'probability',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'probability':{
 title:'Probability',course:'../courses/probability/',
 scope:'Complements and “at least one”, conditional probability and Bayes’ rule, expectation and its linearity, waiting times, and the binomial distribution with Chebyshev’s bound',
 prerequisite:'Fractions, decimals and percents, counting outcomes, powers, averages, and reading “and”, “or” and “at least one”. The foundation check covers these.',
 groups,
 notChecked:['Continuous distributions, the normal approximation and the central limit theorem'],
 suppliedInformation:[],
 tasks:[
  t('pr-c01',0,'medium','At least one red',
   'A spinner lands on red with probability 1/5 on each spin, independently of earlier spins. Find the probability of no red in 3 spins and of at least one red in 3 spins. What is the smallest number of spins for which at least one red has probability greater than 1/2? Then explain what is wrong with the estimate 3 × 1/5 = 3/5 for at least one red in 3 spins.',
   [n('noRed','P(no red in 3 spins)',64/125,'Multiplying independent probabilities'),
    n('atLeastOne','P(at least one red in 3 spins)',61/125,'Using the complement',['noRed']),
    n('spins','Smallest number of spins with P(at least one red) > 1/2',4,'Comparing powers with 1/2'),
    c('estimate','3 × 1/5 overestimates because…',[['overlap','spin sequences with two or three reds are counted more than once'],['order','it ignores the order in which the reds appear'],['fair','a real spinner never lands on red exactly one time in five']],'overlap','Seeing why chances do not simply add')],
   'Explain why the complement is easier to compute than “at least one”, and how you found the smallest number of spins.',
   'Each spin misses red with probability 4/5, and the spins are independent, so P(no red in 3) = (4/5)³ = 64/125 = 0.512. The complement gives P(at least one red) = 1 − 64/125 = 61/125 = 0.488, less than 1/2. Four spins give P(no red) = (4/5)⁴ = 256/625 = 0.4096, so P(at least one red) = 0.5904 > 1/2, and 4 is the smallest number. Adding 1/5 three times counts a sequence with two reds twice and one with three reds three times; the overlap is why 3/5 is too large.',
   'Find the smallest number of spins for which at least one red has probability greater than 0.9.'),
  t('pr-c02',0,'challenging','Which machine made it?',
   'A factory has two machines. Machine A makes 60% of the parts, and 2% of its parts are faulty. Machine B makes the other 40%, and 5% of its parts are faulty. A part is chosen at random. Of 10,000 parts, how many are faulty parts from machine A? What is the probability that the chosen part is faulty? If it is faulty, what is the probability that machine B made it? Are the events “faulty” and “made by B” independent?',
   [n('faultyA','Faulty parts from machine A, out of 10,000',120,'Turning rates into counts'),
    n('faulty','P(faulty)',4/125,'The law of total probability'),
    n('fromB','P(made by B | faulty)',5/8,'Applying Bayes’ rule',['faulty']),
    c('independent','Are “faulty” and “made by B” independent?',[['yes','Yes'],['no','No']],'no','Testing independence',['faulty'])],
   'Explain how the two machines’ rates combine into P(faulty), and why a faulty part is more likely to come from machine B even though B makes fewer parts.',
   'Of 10,000 parts, machine A makes 6,000, and 2% of them, 120, are faulty. Machine B makes 4,000, and 5% of them, 200, are faulty. So P(faulty) = 320/10,000 = 0.032 = 4/125, which is 0.6 × 0.02 + 0.4 × 0.05 by the law of total probability. Given a faulty part, P(made by B) = 200/320 = 5/8 = 0.625. The events are not independent: P(made by B) = 0.4, but P(made by B | faulty) = 0.625. Equivalently, P(faulty and B) = 0.02 differs from P(faulty) × P(B) = 0.0128.',
   'Machine B is adjusted so that only 1% of its parts are faulty. Find P(made by B | faulty) now.'),
  t('pr-c03',1,'medium','Expected values without the distribution',
   'Roll a fair die. You win the number shown, in dollars, if it is even, and nothing if it is odd. What are your expected winnings? Ten letters are put into their ten addressed envelopes in a random order, with all orders equally likely. What is the expected number of letters in the right envelope? Does that argument need the events “letter k is in the right envelope” to be independent? Finally, roll a fair die until a 1 or a 2 appears. What is the expected number of rolls?',
   [n('winnings','Expected winnings, in dollars',2,'Expected value of a random variable'),
    n('envelopes','Expected number of letters in the right envelope',1,'Linearity of expectation'),
    c('independence','Does the envelope argument need independence?',[['no','No: expectations add for any random variables'],['yes','Yes: the probabilities must multiply'],['large','Only when the number of letters is large']],'no','Linearity without independence',['envelopes']),
    n('rolls','Expected number of rolls until a 1 or a 2',3,'The expected waiting time')],
   'Explain the indicator argument for the envelopes, and why the waiting time depends only on the chance of success on each roll.',
   'The winnings are 0, 2, 0, 4, 0 or 6 dollars, each with probability 1/6, so the expectation is 12/6 = 2. Let Iₖ be 1 if letter k is in the right envelope and 0 otherwise. Each letter is equally likely to be in any of the 10 envelopes, so E[Iₖ] = 1/10, and by linearity the expected number is 10 × 1/10 = 1. Linearity holds for any random variables, so no independence is needed, and the events are in fact dependent: if nine letters are right, the tenth must be. Each roll succeeds with probability 2/6 = 1/3, independently, so the number of rolls is geometric with expectation 1/(1/3) = 3.',
   'What is the expected number of letters in the right envelope when there are 100 letters? Explain why the answer does not change.'),
  t('pr-c04',1,'challenging','A bound and the exact value',
   'Toss a fair coin 6 times, and let X be the number of heads. Find P(X = 3) and the variance of X. Use Chebyshev’s inequality to bound P(|X − 3| ≥ 3). Then find the exact value of P(|X − 3| ≥ 3).',
   [n('three','P(X = 3)',5/16,'The binomial distribution'),
    n('variance','Var(X)',3/2,'Variance of a binomial count'),
    n('bound','Chebyshev’s bound on P(|X − 3| ≥ 3)',1/6,'Applying Chebyshev’s inequality',['variance']),
    n('exact','Exact P(|X − 3| ≥ 3)',1/32,'Comparing a bound with the exact value')],
   'Explain where the variance comes from, and why Chebyshev’s bound is so much larger than the exact probability.',
   'P(X = 3) = C(6, 3)/2⁶ = 20/64 = 5/16. X is a sum of 6 independent tosses, each with variance 1/2 × 1/2 = 1/4, so Var(X) = 6/4 = 3/2. Chebyshev gives P(|X − 3| ≥ 3) ≤ Var(X)/3² = (3/2)/9 = 1/6. Exactly, |X − 3| ≥ 3 happens only for X = 0 or X = 6, so the probability is 2/64 = 1/32. The bound uses only the mean and the variance, so it must hold for every distribution with them, including ones with much heavier tails.',
   'For 6 tosses, which value of X is most likely? Show that the probabilities rise up to it and then fall.')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProbabilityChallenges=api;
})(typeof window==='undefined'?globalThis:window);
