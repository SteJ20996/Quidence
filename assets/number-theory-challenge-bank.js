(function(root){
'use strict';
// Number Theory "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
const VERSION='number-theory-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Divisibility and factorization','Congruences and powers'];
// Skill names keep their proper nouns: "Recheck the Euclidean algorithm", not "euclidean".
const phrase=skill=>/^Fermat/.test(skill)?skill:/^Euclidean/.test(skill)?'the '+skill:skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Show the calculation and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill)=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which mathematical condition applies.'});
const m=(id,label,options,answer,skill)=>({...c(id,label,options,answer,skill),kind:'multi'});
const yn=[['yes','Yes'],['no','No']];
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'number-theory',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'number-theory':{
 title:'Number Theory',course:'../courses/number-theory/',
 scope:'The Euclidean algorithm and linear combinations, divisor counting, linear congruences, and powers modulo n',
 prerequisite:'Division with remainder, prime factorization, gcd and lcm, and adding or multiplying with remainders. The foundation check covers these.',
 groups,
 notChecked:['Complete written proofs, induction, the Chinese remainder theorem with several moduli, quadratic residues and analytic number theory'],
 suppliedInformation:[],
 tasks:[
  t('nt-c01',0,'medium','One gcd, many combinations',
   'Integers x and y can be negative. Find gcd(252, 198). Decide whether 252x + 198y = 30 has an integer solution. Then find the solution of 252x + 198y = gcd(252, 198) with 0 ≤ x < 11.',
   [n('gcd','gcd(252, 198)',18,'Euclidean algorithm'),
    c('thirty','Does 252x + 198y = 30 have an integer solution?',yn,'no','Which totals a linear combination can reach'),
    n('x','x with 0 ≤ x < 11',4,'Back-substitution',['gcd']),
    n('y','Matching y',-5,'Back-substitution',['gcd','x'])],
   'Show your remainder chain or factorization, explain which totals 252x + 198y can reach, and check your pair by substitution.',
   '252 = 1 × 198 + 54, 198 = 3 × 54 + 36, 54 = 1 × 36 + 18 and 36 = 2 × 18, so gcd(252, 198) = 18. Every value of 252x + 198y is a multiple of 18; 30 is not, so 30 cannot be reached. Dividing by 18 gives 14x + 11y = 1. Since 14 ≡ 3 (mod 11) and 3 × 4 = 12 ≡ 1 (mod 11), x = 4 and y = (1 − 56) ÷ 11 = −5. Check: 252 × 4 + 198 × (−5) = 1008 − 990 = 18. Every other solution changes x by a multiple of 11.',
   'Take a pair with gcd 1, find one solution, and describe every other solution from it.'),
  t('nt-c02',0,'challenging','Count divisors without listing them',
   '360 = 2³ × 3² × 5. Count without listing every divisor. A designer also wants rectangles with area 360 square units and whole-number side lengths; a 10 × 36 and a 36 × 10 rectangle count as the same rectangle.',
   [n('divisors','Positive divisors of 360',24,'Divisor counting from prime exponents'),
    n('odd','Odd positive divisors of 360',6,'Restricting a prime exponent'),
    n('rectangles','Different rectangles',12,'Pairing divisors',['divisors']),
    n('squares','Divisors of 360 that are perfect squares',4,'Even exponents in square divisors')],
   'Explain how a divisor corresponds to a choice of exponents, and why the rectangle count uses pairs of divisors.',
   'A divisor has the form 2ᵃ × 3ᵇ × 5ᶜ with 0 ≤ a ≤ 3, 0 ≤ b ≤ 2 and 0 ≤ c ≤ 1, giving 4 × 3 × 2 = 24 divisors. An odd divisor needs a = 0, giving 3 × 2 = 6. Each rectangle pairs a divisor d with 360 ÷ d; 360 is not a perfect square, so the 24 divisors form 12 pairs. A square divisor needs even exponents: a ∈ {0, 2}, b ∈ {0, 2} and c = 0, giving 1, 4, 9 and 36.',
   'Predict which numbers have an odd number of divisors, then test your rule on 36 and 360.'),
  t('nt-c03',1,'medium','When can you divide in a congruence?',
   'Find the inverse of 11 modulo 26, a number from 0 to 25. Use it to solve 11x ≡ 7 (mod 26). Then count the solutions with 0 ≤ x < 10 of 6x ≡ 4 (mod 10) and of 6x ≡ 5 (mod 10).',
   [n('inverse','Inverse of 11 modulo 26',19,'Modular inverse'),
    n('x','x with 0 ≤ x < 26 and 11x ≡ 7 (mod 26)',3,'Solving with an inverse',['inverse']),
    n('countFour','Solutions of 6x ≡ 4 (mod 10)',2,'Solvability and the gcd'),
    n('countFive','Solutions of 6x ≡ 5 (mod 10)',0,'Solvability and the gcd')],
   'Show how you found the inverse and check your solution. For the two counts, explain the role of gcd(6, 10).',
   '11 × 19 = 209 = 8 × 26 + 1, so 19 is the inverse of 11 modulo 26. Then x ≡ 19 × 7 = 133 ≡ 3 (mod 26); check: 11 × 3 = 33 ≡ 7. Since gcd(6, 10) = 2, the congruence 6x ≡ c (mod 10) can hold only when 2 divides c. For c = 4 there are 2 solutions, x = 4 and x = 9. For c = 5 there are none, because 6x − 5 is always odd.',
   'Before solving 9x ≡ 6 (mod 15), predict how many solutions it has from gcd(9, 15).'),
  t('nt-c04',1,'challenging','Powers repeat in cycles',
   'Find the smallest positive k with 2ᵏ ≡ 1 (mod 11), and use it to find the remainder when 2²⁰²⁶ is divided by 11. Find the last digit of 7²⁰²⁶. Then choose every prime that divides n⁵ − n for every integer n.',
   [n('order','Smallest positive k with 2ᵏ ≡ 1 (mod 11)',10,'Repeating powers modulo n'),
    n('remainder','Remainder when 2²⁰²⁶ is divided by 11',9,'Reducing an exponent with a cycle',['order']),
    n('digit','Last digit of 7²⁰²⁶',9,'Repeating last digits'),
    m('primes','Primes that divide n⁵ − n for every integer n',[['2','2'],['3','3'],['5','5'],['7','7']],['2','3','5'],'Fermat’s little theorem and counterexamples')],
   'Show the repeating pattern you used. For each prime, give a reason it always divides n⁵ − n or a counterexample.',
   'Powers of 2 modulo 11 are 2, 4, 8, 5, 10, 9, 7, 3, 6, 1, so k = 10. As 2026 = 10 × 202 + 6, 2²⁰²⁶ ≡ 2⁶ = 64 ≡ 9 (mod 11). The last digits of powers of 7 repeat 7, 9, 3, 1; 2026 leaves remainder 2 when divided by 4, so the last digit is 9. For 2 and 3, n² ≡ n (mod 2) and n³ ≡ n (mod 3) reduce n⁵ to n; for 5, Fermat’s little theorem gives n⁵ ≡ n (mod 5). For 7, n = 2 gives 2⁵ − 2 = 30, which 7 does not divide.',
   'Find the last two digits of 7²⁰²⁶ by working modulo 100.')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceNumberTheoryChallenges=api;
})(typeof window==='undefined'?globalThis:window);
