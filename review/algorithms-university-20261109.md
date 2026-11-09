# Algorithms, part 3: the university algorithms 12 to 16 · 2026-11-09

Part 3 completes the route of the Algorithms course. Parts 1 and 2 are described in `review/algorithms-middle-school-20261109.md` and `review/algorithms-high-school-20261109.md`. The new algorithms work like the first eleven:
- a flowchart, numbered steps and data that move together;
- Python, Java and MATLAB listings with a line-by-line guide;
- predictions;
- an idea card and three challenges;
- a suggested next step from fixed rules.

## The five algorithms

| # | Algorithm | What the data view shows | Predictions |
| --- | --- | --- | --- |
| 12 | Quicksort | the range being partitioned, the pivot, pointers i and j, items already in their final place, and the ranges waiting on the stack | whether a[j] joins the left part |
| 13 | Dynamic programming: the fewest coins | the coins, and the table best[v] and last[v] for every amount up to the target, with v and v − c marked | whether a coin beats the best way known |
| 14 | Dijkstra’s shortest paths | six towns A to F and nine roads, each town’s distance from A, finished towns, the road being checked, and the roads that lead back through prev | which town is finished next; whether a route through c is shorter |
| 15 | Spanning trees: Kruskal’s method | the same map, the roads in sorted order, kept and skipped roads, and the groups of joined towns | whether a road is kept |
| 16 | P versus NP: subset sum | the numbers with the bit of mask under each one, mask in decimal and binary, and the sum of the subset | which numbers a mask picks (for the first 15 masks) |

Every run also starts with a prediction about the whole run: comparisons, coins, the shortest distance, the total length kept, or the number of subsets.

Choices made for this part:
- **Quicksort uses an explicit stack of ranges.** It is the same job that the call stack does in #8, but every waiting range stays visible. The partition is Lomuto’s, with the last item as pivot, because it has one pointer pair and one swap rule.
- **Dynamic programming is taught with the coins of #11.** The default coins 1, 3 and 4 are the ones for which greedy change fails, so the table answers the question #11 leaves open.
- **Dijkstra’s method runs on a road map, not on the mud maze.** In the maze of #9 the cost of a step is the cost of the cell it enters. Then every route into a cell pays the same last step, so the first distance a cell receives is already final, and the comparison “dist[c] + length < dist[d]” never lowers a known distance. That would hide the step that makes Dijkstra’s method different from BFS. On the road map, the default lengths make four distances drop after they were first found. The PR② review asked for a check that learners can move from grids to graphs drawn as nodes and edges; #14 and #15 now use such a graph.
- **#14 and #15 share one map.** The same nine roads answer two different questions: the shortest route from one town, and the least road that joins every town. The counterexample of #15 is about exactly that difference.
- **#16 counts masks in binary.** Each mask from 0 to 2ⁿ − 1 names one subset, so trying every subset is a single loop. The first 15 masks come with a prediction about which numbers they pick, enough to learn to read the bits; later masks do not.

## Challenges

| # | Counterexample, or break it | Improvement or bottleneck | Cost |
| --- | --- | --- | --- |
| 12 | “Like insertion sort, quicksort has less work to do on a sorted list.” A shuffled list takes fewer comparisons than the same numbers sorted, e.g. 6 against 10 for 3, 1, 2, 5, 4. | The pivot: the middle item or a random item brings sorted lists of 64 from 2,016 to about 260–370 comparisons; the first item does not help. The message says that the middle item can still be slow on other orders. | 499,500 comparisons for 1,000 sorted items; about 11,000 on shuffled lists |
| 13 | Break it on purpose, with coins 1, 3 and 4 for 6: filling the table from the top says 6 cannot be paid; starting at 0 says no coins are needed; keeping the first way found gives 6 coins. The learner predicts first. | The busiest box is “try the next coin”: once per coin that fits each amount, plus once per amount. The comparison beside it also counts as a right answer. | 3,963 comparisons for 1,000 with coins 1, 5, 10 and 25 (there are 142,511 ways to pay it) |
| 14 | “Walking along the shortest road to a new town, again and again, reaches F by a shortest route.” A long last road after two short ones defeats it; the walk can also get stuck. | Stop as soon as the goal is finished: still right, and 21 instead of 40 towns finished on maps of 40 towns. Stopping when the goal first gets a distance, or finishing towns in the order they were reached, gives wrong distances. | about 10¹² checks for 1,000,000 towns when, as in the listings, every round checks all the towns |
| 15 | “In the cheapest network, every trip is as short as on the full map.” A triangle with roads 2, 2 and 3 already breaks it. | Stop once n − 1 roads are kept: 23 instead of 105 roads looked at when every two of 15 towns are joined. Keeping the n − 1 shortest roads often closes a loop. Each town’s shortest road always belongs to a cheapest network, but those roads alone often leave the towns in pieces. | 499,500 roads sorted and 999 kept for 1,000 towns joined in pairs |
| 16 | “Taking the largest number that still fits finds a subset whenever there is one.” {6, 5, 5} with target 10 breaks it. | Sorting and dropping a partial subset once its sum passes the target stays right and tries about a quarter as many subsets when the target is reachable. Trying only subsets of at most 3 numbers, or largest first, misses answers. | about 36 years for 2⁶⁰ subsets at 10⁹ per second |

Every improvement is tested on 300 generated inputs, and the table shows what changed.

The “Break it on purpose” card, written for #8, now takes its changes, outcomes and explanations from a description per algorithm, so #13 uses the same card.

## On the homepage

- The course card, the page header and both knowledge maps say that algorithms 1 to 16 are open.
- On the Classic map, the Dynamic programming and Complexity nodes now lead to the course.
- The route map has no planned nodes left; its note now says that all sixteen are open.

## Sources and their gaps

1. **Quicksort.** Hoare (1962, *The Computer Journal*) introduced the method. The partition used here is Lomuto’s, as presented by Bentley (*Programming Pearls*, 1986) and in Cormen et al. (*Introduction to Algorithms*). With a fixed pivot rule, a sorted list costs n(n − 1)/2 comparisons; on random orders the expected count is 2(n + 1)Hₙ − 4n, about 10,986 for 1,000 items, which the tests check by simulation.
   - **Gap:** McIlroy (1999, *Software: Practice and Experience*) showed that any deterministic pivot rule can be forced into the slow case, which is why the course says that the middle item “can still be slow on other orders”. The tests build such an order for 64 items. A random pivot only makes the slow case unlikely, in expectation.
   - **Gap:** repeated items are only mentioned. With “a[j] < pivot”, a list of equal items is as slow as a sorted one whatever the pivot; the improvement message says so. Three-way partitioning (Bentley and McIlroy, 1993) fixes that, but the course does not show it.
   - **Gap:** the stack of ranges can hold up to about n ranges in the slow case. Real libraries push the larger side first, or switch method (Musser’s introsort, 1997). The course does not discuss memory.
2. **Dynamic programming.** Bellman (1957, *Dynamic Programming*) named the method. The coin table is the standard unbounded version.
   - **Gap:** only the bottom-up table is shown. The same answer can be computed top-down, by recursion that remembers its results, which would connect to #8; the course mentions neither memoization nor its cost.
   - **Gap:** the work grows with the amount itself, not with the number of its digits. This matters in #16, where the same idea gives a pseudo-polynomial method for subset sum. The cost explanation of #16 says so, but #13 does not.
3. **Dijkstra’s method.** Dijkstra (1959, *Numerische Mathematik*, “A note on two problems in connexion with graphs”) described the shortest-path method with a scan for the closest town, as taught here. The same short paper also treats the minimum spanning tree problem, which is why #14 and #15 share a map.
   - **Gap:** the correctness argument needs road lengths of at least 0. The idea card asks what a negative length would break, but the inputs only allow lengths 1 to 20, so learners cannot try it.
   - **Gap:** the heap version is mentioned in the cost explanation but not shown. The listings check every town in every round, n² checks in all, which is what the cost question counts; checking only the unfinished towns would halve it.
   - **Gap:** as explained above, the mud maze of #9 is not used, because with costs paid on entering a cell no distance is ever lowered. Learners may still expect to see the maze again; the suggestion after #9 says only that steps cost different amounts.
4. **Kruskal’s method.** Kruskal (1956, *Proceedings of the American Mathematical Society*). Groups are merged by renaming every town of one group, which is easy to read but can take about n² renamings in all. Union–find structures (Galler and Fischer, 1964; Tarjan, 1975) make merging nearly constant time.
   - **Gap:** the course does not prove that the result is a minimum spanning tree (the cut property). The tests compare it with every set of five roads on the six-town map.
   - **Gap:** when several roads have the same length there can be several cheapest networks. The course keeps the listed order and says so, but does not show the other networks.
5. **P versus NP.** Cook (1971, *STOC*) and Levin (1973) defined NP-completeness, and Karp (1972) listed a knapsack problem equivalent to subset sum among the first NP-complete problems. The question is one of the Clay Mathematics Institute’s Millennium Prize Problems (2000).
   - **Trying every subset is not the fastest known exact method.** Horowitz and Sahni (1974) split the numbers into two halves, about 2ⁿᐟ² work, so 60 numbers need on the order of 2³⁰ steps rather than 2⁶⁰. The cost explanation now says so, so that 36 years is not read as the best possible. **Gap:** the course does not show that method.
   - **Gap:** the pruned search in the improvement card relies on every number being positive and on the numbers being sorted. With negative numbers it would miss answers; the card says why the cut is safe, but does not let learners test negative numbers.
   - **Gap:** P versus NP is about how the work grows with the length of the input in digits. The course states the question in words and does not define polynomial time.

## Pre-release review

A separate review checked the five algorithms, their listings, the Spanish and the new parts of the page. It confirmed the numbers above and the MATLAB listings by reading, and these changes followed.

- **False or overstated statements.**
  - The Kruskal improvement said that each town’s shortest road can close a loop. With ties broken by listed order it never does: those roads always belong to a cheapest network. The message now says that they can leave the towns in pieces.
  - “No kind of list stays slow” with a random pivot was too strong: with this partition, a list of equal items stays slow whatever the pivot. The evidence now says “no order of the list”, and the message mentions equal items.
  - The Dijkstra cost question counted only the unfinished towns, about 5 × 10¹¹, while all three listings check every town in every round. The question now matches the listings, 10¹², and the explanation says that checking only the unfinished towns halves it.
  - The subset-sum cost explanation could be read as contradicting itself: a table answers in about n × target steps, yet no fast method is known. It now says that a target with many digits makes the table slow too, states the P versus NP link as “if and only if”, and mentions the two-halves method.
  - The quicksort card said “the claim holds” for a list exactly as slow as its sorted copy. It now says that such a list is not a counterexample.
- **Predictions that gave away or blurred their answer.**
  - In #16, the bits under each number appeared while the question about them was open. They now appear once the answer is shown.
  - In #14, a wrong option for “Which town is finished next?” could have the same distance as the answer, about 9% of the time with lengths 1 to 12. Wrong options are now farther away, and a tie is explained. The note before the question lists the towns alphabetically instead of by distance.
  - In #13, “It cannot be paid” was offered only when it was the answer. It is now always offered.
- **Logic.**
  - The #13 bottleneck card accepted the comparison box even when other boxes ran more often, for example coins 5 for 12. It is now accepted only when nothing but the loop check beside it runs more.
  - A saved record whose improvement or bottleneck evidence did not fit the algorithm’s card passed validation and then stopped the page. Such a record is now treated as unreadable, kept, and offered for export. The browser test checks this.
  - The “Choose a change and a prediction first” message and an unrun prediction carried over from #8 to #13. Opening an algorithm now clears them.
- **Wording.**
  - The pruning message now says that the cut is safe because the numbers are positive and sorted.
  - The quicksort note on placing the pivot now says “in this range”.
  - The quicksort and subset-sum suggestions now describe what the learner actually did.
  - The road inputs on the cards have the same labels for screen readers as the workbench.
  - The DFS suggestion now describes #15 as the cheapest tree that joins every town.
  - A table column named like one of its rows now reads “Ended sorted”.
- **Spanish.** “Los demás pueblos”, “una ruta mínima” in the #14 claim, “¿Se elegirá…?”, singular and plural of “elegida”, “que paguen exactamente”, “en su lugar”, “el vector a ya ordenado” (also in parts 1 and 2), “lleva el pivote … con un intercambio”, and “omitir” instead of “saltar” for skipped roads.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- **`npm test`:** 413 of 413 Node tests pass. `tests/algorithms.test.cjs` now covers all sixteen algorithms:
  - traces against independent references: Floyd–Warshall distances for #14, every set of five roads for #15, plain recursion for #13 and the set of reachable sums for #16, with each prediction key checked against what the trace does next;
  - in #14, every wrong option for the next town is farther than the answer, never tied;
  - every move along a flowchart arrow, except recursive calls and returns;
  - the Python listings run with python3, and the Java listings compiled with javac and run;
  - the challenge checks, including an order of 64 items that makes the middle pivot slow, and every cost number.
- **Browser suites:** all 18 suites in `checks.yml` pass. The Algorithms suite steps through all sixteen algorithms (993 steps, 197 predictions) and checks 33 challenge results, with the road lengths, coins and lists typed in. It also checks Spanish, export, reload, a second-tab change, an unreadable record, a record whose evidence does not fit its card, and ten layouts, with every flowchart label inside its box.
- **Other checks:** the Coordinate Geometry and Math Voice checks pass.
- **By eye:** each new algorithm at 1280 px in English, and #13 to #15 at 320 px in Spanish.
- **Not checked:** Safari, real devices, and running the MATLAB listings.

## Not in this part

- The foundation and understanding checks and the Intuition Lab activity (part 4).
- Running learner code, and running the MATLAB listings.
