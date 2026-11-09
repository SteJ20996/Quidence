# Algorithms, part 2: the high-school algorithms 6 to 11 · 2026-11-09

Part 2 of the Algorithms course opens the high-school row of the route. Part 1 is described in `review/algorithms-middle-school-20261109.md`. The new algorithms work like the first five:
- a flowchart, numbered steps and data that move together;
- Python, Java and MATLAB listings with a line-by-line guide;
- predictions;
- an idea card and three challenges;
- a suggested next step from fixed rules.

## The six algorithms

| # | Algorithm | What the data view shows | Predictions |
| --- | --- | --- | --- |
| 6 | Binary search | low, mid and high on a sorted list; the discarded part is faded | the value of mid; which half can still hold the target |
| 7 | Merge sort (bottom-up) | runs of width 1, 2, 4 …, pointers i and j, the out row | which front item goes to out next |
| 8 | Recursion: the Tower of Hanoi | three pegs and the call stack, newest call on top | the next move |
| 9 | Breadth-first search | a 5 × 7 maze, marked cells, the queue, the final path | which cell leaves the queue next |
| 10 | Depth-first search | the same maze with the stack | which cell leaves the stack next |
| 11 | Greedy change | the coins, the amount left, the coins taken | whether another coin of the current value is taken |

Every run also starts with a prediction about the whole run, such as the number of comparisons, moves, path steps or coins.

Choices made for this part:
- **Merge sort is taught bottom-up.** It merges runs of width 1, 2, 4 and so on, so the whole method is loops. The recursive version is mentioned in the suggestion after #7 and connects to #8.
- **Recursion jumps between calls.** In the Tower of Hanoi, a call or a return jumps between frames rather than following an arrow. The flowchart shows one call, with dashed arrows for the two recursive calls. The call stack shows which call is running and on which line. Disks are limited to 1–5, because 5 disks already take 31 moves and about 220 steps.
- **BFS and DFS search a grid maze, not an abstract graph.** Learners draw walls on the workbench, or choose a random or the starting maze. DFS marks a cell when it takes it from the stack, so a cell can be on the stack more than once. The trace says so, and a cost question asks how many copies are possible: at most 4.
- **Loops and recursion step by step.** As in part 1, every loop check is its own step. The tests check that each move follows an arrow of the flowchart, except the call and return jumps of the recursion.

## Challenges

| # | Counterexample, or break it | Bottleneck or improvement | Cost |
| --- | --- | --- | --- |
| 6 | An unsorted list hides a target that is there; why: "it is not sorted". | Return the first of repeated items: remember mid and keep searching left, at most 6 checks for 50 items. Stepping left one at a time also works but takes up to 25 checks when all items are equal; searching right returns the last. | 20 comparisons for 1,000,000 items |
| 7 | "Merge sort always makes fewer comparisons than insertion sort": a sorted list of 8 needs 12 against 7. | Skip a merge when the runs are already in order: nearly sorted lists need less than half the comparisons, but random and reversed lists pay for the extra check. Comparing only the first items breaks the sort. | at most 9,217 for 1,024 items |
| 8 | Break it on purpose, with 3 disks: without the base case the calls never stop; without the second call disk 3 lands on disk 1; without the move nothing moves. The learner predicts first. | The busiest box is the n = 0 check: 2ⁿ⁺¹ − 1 runs, and 2ⁿ of those calls move nothing. | 1,048,575 moves for 20 disks |
| 9 | With mud costing 3, the path BFS finds can cost more than a longer dry route. Learners paint mud and walls on a small maze. | The busiest box is the search for a free neighbour. | at most 1,000,000 cells marked in a 1,000 × 1,000 grid |
| 10 | DFS can find a longer path than necessary. Learners draw walls until it does. | Take the free neighbour closest to G first: still correct, and fewer cells marked on average. Looking only right and down misses some mazes. | at most 4 copies of a cell on the stack |
| 11 | Coins such as 1, 3 and 4 for 6: greedy takes 4 + 1 + 1, but 3 + 3 is enough. Coins such as 3 and 5 for 9: greedy gets stuck. The fewest coins come from a separate exact count. | Divide instead of subtracting: 4 steps for any amount with 25, 10, 5 and 1, the same idea as Euclid's remainder. | 40,000 subtractions for 1,000,000 cents |

Every improvement is tested on 300 generated inputs, and the table shows what changed.

Some suggestions point to the university part, which is not open yet. The map then marks the planned algorithm and offers an open one as well:
- the mud counterexample (#9) leads to #14 Dijkstra's method;
- the coin counterexample (#11) leads to #13 dynamic programming.

## On the homepage

- The course card, the page header and both knowledge maps now say that algorithms 1 to 11 are open.
- On the Classic map, the Recursion and Graph algorithms nodes now lead to the course, alongside Discrete Mathematics.

## Sources and their gaps

1. **Binary search is easy to get subtly wrong.**
   - Knuth (*The Art of Computer Programming*, vol. 3, §6.2.1) notes that the details of binary search are surprisingly tricky, and that early published versions contained errors.
   - Bloch (2006, Google Research blog) showed that `(low + high) / 2` overflows in Java for arrays of more than about 2³⁰ items. The Java listing therefore uses `low + (high − low) / 2`, and the guide says why.
   - **Gap:** the course lists have at most 12 items, so the overflow is explained, not shown. Python integers do not overflow, and MATLAB uses doubles.
2. **Novices' models of recursion.** Kahney (1983, CHI) found that many novices think of a recursive call as a loop rather than as a new copy of the procedure with its own values. The call stack view shows each call as its own frame, with its own n, pegs and current line, to support the "copies" model.
   - **Gap:** that study used university novices and a different notation. Whether a visible call stack helps high-school learners here has not been measured.
3. **Mazes instead of graphs.** A grid is a special kind of graph: every cell has at most four neighbours, and they come in a fixed order.
   - **Gap:** learners may not carry the method over to general graphs. Part 3 (spanning trees, Dijkstra's method) needs graphs drawn as nodes and edges, and should check that transfer.
4. **When greedy change is optimal.** Kozen and Zaks (1994, *Theoretical Computer Science*) showed that if greedy change fails for a set of coins, it already fails for some amount below the sum of the two largest coins. For 25, 10, 5 and 1 that bound is 35, so the test that greedy is optimal for every amount from 1 to 99 settles these coins completely.
   - **Gap:** other coin sets typed by learners are checked only up to 99, the largest amount the page accepts. That is enough to show a counterexample, but it does not prove that a set is safe.
5. **Bottom-up and top-down merge sort.** For a list whose length is a power of 2 they make the same merges. For other lengths the runs differ slightly, so comparison counts can differ from a recursive version.
   - **Gap:** learners who meet the recursive version elsewhere may find different counts for the same list.
6. **The Tower of Hanoi.** That 2ⁿ − 1 moves are necessary, not only enough, follows from an induction: the largest disk must move at least once, and only when the other n − 1 disks are all on the third peg. The course states the count and its doubling but does not prove the lower bound.

## Pre-release review

A separate review checked the six algorithms, their listings, the Spanish and the new parts of the page. These changes followed.

- **Wrong or ambiguous statements.**
  - Binary search counted rounds but asked about comparisons, while the trace shows two tests per round. The question, the cost question and the final note now count rounds, each of which chooses a new mid.
  - The Euclid suggestion said #8 rewrites Euclid's algorithm. #8 is the Tower of Hanoi, so the text now says that Euclid's algorithm can call itself on a smaller pair and that #8 shows how recursion works.
  - Several smaller statements were false or too strong, and now say what is true:
    - greedy change is no longer said to use the fewest coins;
    - an extra disk "doubles the moves and adds one";
    - the left neighbour is taken first only when it is free;
    - merge sort's work does depend on the kind of list.
  - The mud explanation also covers a cheaper route that is just as long but drier.
- **Results that could mislead.**
  - Looking only right and down could pass 300 random mazes by chance and get the success message. One test maze now needs left moves, so this change always fails, and the message checks the choice too.
  - Deleting the second call of the Tower of Hanoi could be read as either an illegal move or a wrong final place. The card now says that every move is checked and the run stops at the first problem.
  - The missing base case now also explains that a real program ends with a recursion error.
- **The "break it" card.**
  - After a run, the old prediction stayed selected.
  - With no prediction chosen, only a screen reader heard the message; it is now shown on the page.
  - The card is labelled "Break it and predict".
- **Bottleneck wording.** The bottleneck card for #8 and #9 talked about a "list". It now names the disks or the maze, and the BFS result shows the maze its counts come from.
- **Listings.**
  - The Python Hanoi `return` no longer lights the second call.
  - The Python BFS start no longer lights the `import` line.
  - The Java listings that use collections say they need `import java.util.*`.
  - The MATLAB merge sort and greedy change say their input is a row vector.
  - The MATLAB helpers are saved as their own files, so DFS can use them.
  - For mazes, a MATLAB note explains that its cells are numbered down each column.
- **Mazes.**
  - Rows and columns are numbered, and the legend says cells are named (row, column) from 0.
  - Arrow keys move between cells in both maze editors, with one tab stop per maze.
  - The maze's spoken description names the current cell and the path.
- **Recursion.** When a call starts a new frame, its dashed arrow lights up.
- **Spanish.**
  - "Un camino más corto" means "a shorter path". It is now "un camino mínimo" wherever a shortest path is meant.
  - "Estaca de repuesto" is now "estaca auxiliar".
  - Ten other phrasings were corrected, including a decision box that still read "c marked".

## Not in this part

- The university algorithms 12 to 16.
- The foundation and understanding checks and the Intuition Lab activity.
- Running learner code, and running the MATLAB listings.
