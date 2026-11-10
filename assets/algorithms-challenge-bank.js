(function(root){
'use strict';
// Algorithms "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
// Each problem follows the course's own definitions (the pseudocode on courses/algorithms/).
const VERSION='algorithms-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Searching, sorting and recursion','Graphs, tables and cost'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Trace the steps and compare them with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which step or condition decides it.',dependsOn});
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'algorithms',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'algorithms':{
 title:'Algorithms',course:'../courses/algorithms/',
 scope:'Binary search, merging and insertion sort, counting the calls of a recursion, shortest routes and the cheapest network, greedy and best change, and why trying every subset grows so fast',
 prerequisite:'Ordering numbers and reading positions, division with remainders, counting and sums, powers of 2 and binary, and following written steps exactly. The foundation check covers these.',
 groups,
 notChecked:['Writing or running code, proving that an algorithm is correct, and formal running-time notation'],
 suppliedInformation:[],
 tasks:[
  t('al-c01',0,'medium','Halving a sorted list',
   'The sorted list 3, 8, 11, 15, 19, 24, 27, 31, 36, 40, 44, 52, 57, 63, 70 has 15 numbers at positions 0 to 14. Binary search, as in the course, looks for 44. Positions low and high are the first and last positions still possible, at first 0 and 14. Each round looks at the middle position mid = (low + high) ÷ 2, rounded down. If the number there is not 44, mid is ruled out too: low becomes mid + 1 or high becomes mid − 1. Which number is looked at in the first round? In the second round? How many rounds does it take, counting the round that finds 44? Then explain why one round may throw half of the range away.',
   [n('first','Number looked at in the first round',31,'Choosing the middle position'),
    n('second','Number looked at in the second round',52,'Keeping the half that can contain the target',['first']),
    n('rounds','Rounds in all, including the round that finds 44',4,'Following binary search to the end',['second']),
    c('why','After one round, half the range can be discarded because…',[['sorted','the list is sorted, so every number on the discarded side is on the wrong side of 44'],['half','binary search only ever needs to look at half of the numbers'],['lucky','44 happens to be in the right half of this particular list']],'sorted','Seeing why sorting makes halving safe')],
   'Explain how you found each middle position, and what would go wrong if the list were not sorted.',
   'With low = 0 and high = 14, mid = 7 and the number there is 31. 31 < 44, so low becomes 8. Now mid = (8 + 14) ÷ 2 = 11, which holds 52. 52 > 44, so high becomes 10. Then mid = 9 holds 40 < 44, so low becomes 10, and mid = 10 holds 44: found in the fourth round. Because the list is sorted, every number before 31 is smaller than 31 and so smaller than 44; none of them can be 44. In an unsorted list, 44 could be anywhere, and discarding a half could throw it away.',
   'How many rounds can binary search need, at most, for a sorted list of 1,000 numbers?'),
  t('al-c02',0,'challenging','Count the work',
   'Merging the sorted runs 2, 9, 14 and 5, 6, 20, 25 compares the first remaining number of each run and moves the smaller one, until one run is empty; the rest is then copied without comparing. How many comparisons does the merge make? Insertion sort, as in the course, sorts 4, 3, 2, 1, 5: each new number is compared with the sorted numbers to its left, from right to left, until it meets one that is not larger or reaches the start. How many comparisons does it make? Finally, a recursive procedure fold(n) does this: if n = 0, it stops; otherwise it prints one line and then calls fold(n − 1) three times. For fold(4), how many lines are printed, and how many calls of fold are made, counting the first call fold(4)?',
   [n('merge','Comparisons in the merge',5,'Counting the comparisons of a merge'),
    n('insertion','Comparisons when insertion sort sorts 4, 3, 2, 1, 5',7,'Counting the comparisons of insertion sort'),
    n('lines','Lines printed by fold(4)',40,'Counting the work of a recursion'),
    n('calls','Calls of fold, including fold(4) itself',121,'Counting the calls of a recursion',['lines'])],
   'Explain how you counted the merge, why insertion sort makes so few comparisons for the last number 5, and how lines(n) and calls(n) depend on lines(n − 1) and calls(n − 1).',
   'The merge compares 2 with 5 (moves 2), 9 with 5 (moves 5), 9 with 6 (moves 6), 9 with 20 (moves 9) and 14 with 20 (moves 14). The first run is now empty, so 20 and 25 are copied: 5 comparisons. Insertion sort compares 3 with 4 (1 comparison), then 2 with 4 and 3 (2), then 1 with 4, 3 and 2 (3), and finally 5 with 4, which is not larger, so 5 stays (1): 7 in all. For fold, lines(0) = 0 and lines(n) = 1 + 3 × lines(n − 1), so lines gives 1, 4, 13, 40 for n = 1 to 4. Calls satisfy calls(0) = 1 and calls(n) = 1 + 3 × calls(n − 1), giving 4, 13, 40, 121. Each level of the recursion triples the work.',
   'How many comparisons does insertion sort make for 5, 4, 3, 2, 1? Which order of five numbers needs the fewest?'),
  t('al-c03',1,'challenging','Five towns',
   'Five towns P, Q, R, S and T are joined by roads of these lengths: P–Q 4, P–R 1, Q–R 2, Q–S 10, R–S 8, R–T 9 and S–T 3. Every road can be used in both directions. What is the length of the shortest route from P to T? A traveller instead always takes the shortest road to a town not yet visited, starting at P and stopping on reaching T. How long is that walk? The cheapest network keeps the shortest roads that join all five towns without closing a loop, as Kruskal’s method does. What is its total length? Is the route from P to T inside that network a shortest route from P to T?',
   [n('shortest','Shortest route from P to T',10,'Finding a shortest route'),
    n('nearest','Length of the nearest-town walk from P to T',16,'Following a greedy walk'),
    n('network','Total length of the cheapest network',14,'Building the cheapest network'),
    c('treeRoute','Is the route from P to T inside the cheapest network a shortest route?',[['yes','Yes'],['no','No']],'no','Comparing a cheapest network with shortest routes',['shortest','network'])],
   'Explain why the nearest-town walk is not the shortest route, and why the cheapest network does not keep every shortest route.',
   'The shortest route is P–R–T = 1 + 9 = 10; P–R–S–T = 1 + 8 + 3 = 12 is the next best. The traveller goes P–R (1), then R–Q (2), the shortest road from R to a new town, but from Q the only new town is S, so Q–S (10), then S–T (3): 16. Taking the nearest town at each step can lead into a long road later. Kruskal’s method keeps P–R 1, Q–R 2 and S–T 3, skips P–Q 4 because it would close the loop P–Q–R, and keeps R–S 8, which joins the two groups: 1 + 2 + 3 + 8 = 14. Inside that network the only way from P to T is P–R–S–T = 12, not 10. A cheapest network minimises the total length of all its roads, not the length of every trip.',
   'Change one road length so that the cheapest network does contain a shortest route from P to T.'),
  t('al-c04',1,'challenging','Change and choices',
   'Coins are worth 1, 6 and 10. To pay 12, the greedy method takes the largest coin that still fits, again and again. How many coins does it use? What is the smallest number of coins that can pay 12? A list has 20 different numbers. How many subsets does it have, counting the empty set and the whole list? Subset sum asks for numbers in a list that add up to a target. Which statement about it is true?',
   [n('greedy','Coins used by the greedy method for 12',3,'Following the greedy method'),
    n('fewest','Fewest coins that pay 12',2,'Finding the best change'),
    n('subsets','Subsets of a list of 20 numbers',1048576,'Counting subsets with powers of 2'),
    c('claim','Which statement about subset sum is true?',[['check','Checking a proposed subset is quick: add up its numbers. But no known method finds a subset quickly for every list'],['impossible','No computer can ever solve subset sum for a list of 20 numbers'],['largest','Taking numbers from largest to smallest always finds a subset when one exists']],'check','Telling checking apart from finding',['subsets'])],
   'Explain where the greedy method goes wrong for 12, and why the number of subsets matters for subset sum.',
   'The greedy method takes 10, then 1 and 1, because 6 no longer fits after 10: 3 coins. Two 6s pay 12 with only 2 coins, so taking the largest coin first is not always best, and dynamic programming finds the true minimum. Each of the 20 numbers is either in a subset or not, so there are 2²⁰ = 1,048,576 subsets. Checking one subset is quick, but trying them all doubles the work with every extra number. A list of 20 numbers is easy for a computer to try exhaustively, and largest first can miss an answer: for 6, 5, 4 and target 9 it takes 6, then neither 5 nor 4 fits, while 5 + 4 = 9.',
   'For coins worth 1, 6 and 10, find every amount from 1 to 20 that the greedy method pays with more coins than necessary.')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceAlgorithmsChallenges=api;
})(typeof window==='undefined'?globalThis:window);
