# Algorithms part 4: checks and an Intuition Lab activity · 2026-11-10

This note records the design of the Algorithms foundation check, its understanding check and its Intuition Lab activity. It also records how their answers were checked, what an independent read changed, and what remains unverified.

## What was added

| Item | Size | Where |
| --- | --- | --- |
| Foundation check | 15 questions, 30 parts, five groups | `assets/additional-foundations.js` (`al-f01` to `al-f15`) |
| Understanding check | 4 problems, 16 parts, two groups | `assets/algorithms-challenge-bank.js` (`al-c01` to `al-c04`), bank `quidence-challenges-12` |
| Intuition Lab | 1 activity, "Ten times the data. Ten times the work?" | `intuition/data.js`, `intuition/math.js`, `intuition/lab.js` (`halves`) |
| Computer Science group | filter and group in all four appearances | `intuition/lab.js`, `assets/intuition-home.js`, `assets/intuition-home.css` |

The course page, the homepage card and the check menus link to the checks. The course page shows the activity's banner.

## Design choices

- **The foundation check starts at middle school.** The course's route begins at middle school, so the check covers what algorithm 1 already assumes:
  - comparing signed numbers;
  - reading positions counted from 0;
  - remainders and divisors;
  - sums such as 1 + ⋯ + n;
  - powers of 2 and binary;
  - executing assignments and loops exactly.

  Two higher items, `al-f12` (2ⁿ − 1) and `al-f15` (halving to 1), prepare for the recursion and binary-search ideas without requiring them.
- **The understanding check uses the course's own definitions.** Every problem states the convention it relies on, and each one matches the pseudocode on `courses/algorithms/`:
  - the middle rounded down;
  - a missed middle ruled out;
  - one comparison for each `a[j] > key` test;
  - Kruskal's order.

  A problem that silently assumed another convention would test the convention, not the idea.
- **Contrasts over recall.** Each problem puts two plausible methods side by side, so that a learner who knows only the name of an algorithm cannot answer by recognition:
  - the nearest-town walk, the shortest route and the cheapest network, which give 16, 10 and 14 for the same map;
  - greedy change and the fewest coins;
  - checking a subset and finding one.
- **The activity shows that work grows slowly as the input grows.** The slider moves through powers of ten, from 10 to 1,000,000 names, while the bars show the halving. The point is that ten times the data adds about 3.3 rounds (log₂ 10), not ten times the work.

## How the answers were checked

- `tests/additional-foundations.test.cjs` recomputes all 30 foundation parts by running what each question describes. It scans the list, searches for divisors, lists pairs and grid cells, halves and doubles, and executes the assignments and the loop.
- `scripts/audit-challenges.py` recomputes the 16 understanding parts without reading the bank:
  - binary search, merging and insertion sort run with counters;
  - the recursion `fold` is called and counted;
  - routes come from listing every simple path;
  - the cheapest network comes from trying every set of four roads (it is unique);
  - change comes from trying every coin combination;
  - the subsets of 20 numbers are counted by listing every 0/1 choice;
  - a counterexample confirms that largest first can miss a subset.
- `tests/intuition.test.cjs` checks the activity's model against the course's binary search, run for every target in sorted lists of up to 100,000 names. It also checks the transfer for 4,095 names (12) and 4,096 names (13).

All three were written by the same author as the items, so they show the items are consistent with code. They are not an independent proof.

## Independent read

A separate review recomputed every key with its own scripts and found no wrong answer. It raised two ambiguities, both fixed before publication.

1. **`al-c01` said "comparisons" where the course says "rounds".** The course's trace asks two questions per round ("Is a[mid] = target?", then "a[mid] < target?"). A learner counting those tests would get 7, not 4. The problem now counts rounds, as the course does, and so does the activity.
2. **`al-c01` did not say that a missed middle is ruled out.** A learner who kept it in the range would get 44 in the second round. The prompt now defines low and high and states the update rule from the course.

Suggestions taken:
- The road map in `al-c03` was changed (Q–S from 5 to 10). With the old lengths, the nearest-town walk used exactly the roads of the cheapest network, so a learner who confused the two still answered both parts correctly. Now the three answers differ: 10, 16 and 14.
- The binary-search middle is written "(low + high) ÷ 2, rounded down" instead of a floor bracket around a stacked fraction.
- `al-f07` now explains the odd case, with 49 pairs and the middle 50.
- `al-f15` says "positive whole number" and defines a step.
- The `al-c04` counterexample uses three different numbers (6, 5, 4 and target 9).
- Unsupported claims of "the most common slip" were softened.

## Gaps

- **No learner data.** Difficulty labels are design targets, and none of the items has been tried by students.
- **The research behind the choice of misconceptions is thin for this audience.**
  - Gal-Ezer and Zur (2004) report misconceptions about efficiency, such as judging an algorithm by features like the length of its program rather than by how its work grows with the input. That motivates the activity and `al-c02`.
  - Danielsiek, Paul and Vahrenhold (2012) collect misconceptions from an introductory algorithms and data structures course, including ones about shortest paths and greedy choices. That motivates `al-c03` and `al-c04`.

  Both studies come from particular courses and settings with modest samples, and they describe misconceptions rather than test ways to address them. They do not show that the same misconceptions appear in the younger learners this course starts with. Nor do they show that a contrast problem like `al-c03` helps more than a plain one. The items should be revised once real responses exist.
- **Exact matching only.** Number answers are matched exactly. The explanations are kept for review and not graded, so a correct number reached by a wrong method is recorded as a match.
- **Breadcrumb links.** On Intuition Lab activity pages, the breadcrumb links ("Quidence / All explorations") still look like plain links. This predates the change, applies to every activity and is left for a separate change.
