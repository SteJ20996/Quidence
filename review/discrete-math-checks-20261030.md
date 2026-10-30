# Discrete Mathematics checks · 2026-10-30

Discrete Mathematics now has a 15-question foundation check and a four-problem understanding check, in English and Spanish. This is the second part of the course; the ten proof projects came first (`review/discrete-math-projects-20261030.md`), and the Intuition Lab activity follows separately.

## Foundation check

`foundations/?module=discrete-math` checks what the course assumes, not what it teaches. Like the other foundation checks, it has five groups of three questions, one to three parts each (31 parts in all), and most items target a common mistake.

| Group | Questions | Common mistake targeted |
| --- | --- | --- |
| Counting carefully | whole numbers from 15 to 42 and the even ones; 3 soups × 4 sandwiches and two-letter codes; listing the cups with 2 of 4 flavors, against choosing a captain and a vice-captain | 42 − 15 = 27 numbers; adding choices instead of multiplying; counting AB and BA as different cups, or ignoring order when it matters |
| Patterns and sequences | the 20th term of 7, 11, 15, … and the position of 99; the 6th term of 3, 6, 12, … and 1 + 2 + ⋯ + 32; terms from aₙ = 3aₙ₋₁ − 1 and from a two-term rule | 7 + 20 × 4; one doubling too many |
| Even, odd and divisibility | the parity of a sum of 7 odd numbers and of an even × odd product; 100 ÷ 7 and the weekday 100 days after a Monday; multiples of 6, and of both 4 and 6, up to 100 | using 4 × 6 = 24 instead of the least common multiple 12 |
| Logic in words | what "not every student passed" means; one counterexample to "every prime is odd"; a true statement whose converse is false | reading "not every" as "none"; believing a converse follows |
| The algebra the course uses | 2⁵ × 2³ and 2ⁿ⁺¹ − 2ⁿ; the formula n(n − 1)/2 used both ways; solving r² − r − 6 = 0 | multiplying exponents; a wrong sign when factoring |

What the course teaches is listed as not checked: proof by induction, the pigeonhole principle, binomial coefficients, recurrences and graphs, and formal logic with truth tables and quantifiers. The pair-counting formula in `dm-f14` is supplied, and the report says so, because the course derives it.

`tests/additional-foundations.test.cjs` recomputes all 31 parts from each question's conditions, without reading the stored key. Counts come from listing the cases, sequence terms from running each rule, parity from every choice of seven numbers from {1, 3, 5}, the "not every" item from every pass/fail pattern of four students, and the powers item by testing each option for n = 0 to 12. It also checks that changing each numeric answer by 1 is not matched.

## Understanding check

`diagnostics/?module=discrete-math` has four problems and 16 answer parts, sized like the other courses' checks.

| Problem | Group | What it checks |
| --- | --- | --- |
| Committees and roles (medium) | Counting and recurrences | committees against ordered roles, fixing one member, and splitting a count into cases (Pascal's rule) |
| Paths made of 1s and 3s (medium) | Counting and recurrences | listing small cases, finding W(n) = W(n − 1) + W(n − 3) from the first stone, using it, and counting by the first choice |
| A league table (challenging) | Graphs, induction and invariants | counting pairs, the handshake lemma, degrees and edges, and why eight teams cannot all have different numbers of games |
| An induction and an invariant (challenging) | Graphs, induction and invariants | the sum of odd numbers, the inductive step, an invariant sum, and a parity invariant |

Later parts that depend on an earlier wrong value are marked "recheck after", as in the other checks. The new problems use different numbers and settings from the course projects, so they test transfer rather than recall: the stone path has a different recurrence from the domino strips, and the league reuses the handshake lemma outside Königsberg.

`scripts/audit-challenges.py` recomputes the answers without reading the authored keys. It lists committees as sets, lists every stone path, tests degree sequences with the Havel–Hakimi algorithm, builds a 3-regular graph on 8 vertices (the cube), and searches every way of merging the numbers on the board, for both a + b and |a − b|. From 1 to 10, the |a − b| version can end only at 1, 3, 5, 7 or 9. The audit now covers 70 tasks and 275 parts. Both implementations were written in this project, so this is a consistency check, not independent certification.

## Pre-release review

A separate review recomputed every keyed answer, including an exhaustive search for the board problem and a degree-sequence test for the league. All 22 graded keys were correct. These changes followed:

- **Stone paths.** The question asked which rule "the values" follow, but the first values 1, 1, 2, 3 also fit the Fibonacci distractor, so a student matching the pattern would get W(8) = 21. The question now asks for the rule that holds for every n ≥ 4 and points to the first stone. The solution shows W(5) = 4, not 5.
- **Scope.** A handshake question in the foundation check used the pair count and double counting that the course teaches. It now asks students to list the cups with 2 of 4 flavors. The not-checked list now says "setting up and solving recurrences", since one item does ask students to evaluate a given rule.
- **Wording.**
  - A follow-up asked about "whole numbers" from −5 to 5, and in US usage whole numbers are not negative; it now says "integers".
  - Ben is introduced before the committee follow-up mentions him.
  - The counterexample and powers solutions say what they mean more directly.
- **Spanish.** Five corrections, including "Una tabla de posiciones" and "Una elección tras otra".

The follow-up for the board problem, starting from 1 to 11, has a definite answer: the last number can be 0.

## Saved work

- **Diagnostic bank.** Version 8 is frozen as `assets/challenge-bank-v8.js`, and `challenge-bank.js` becomes `quidence-challenges-9`, adding `assets/discrete-math-challenge-bank.js`. The thirteen earlier subjects are unchanged. A test opens records saved under versions 6, 7 and 8 and checks that each gains an empty module for each subject added after it.
- **Foundation records.** Saved foundation records are accepted only when their subjects match a published set. The engine now lists the twelve-subject set from before this change, so existing records still open. A new test opens a twelve-subject record, checks that it is unchanged, and checks that it gains an empty Discrete Mathematics module. Sets that were never published are still rejected.
- **Older records.** Records saved under the earlier brand name, and four-subject records from before the newer subjects, gain an empty Discrete Mathematics module and are otherwise unchanged.

## Where the checks appear

- **Homepage card:** shows both checks. The "not available yet" note now lists only the Intuition Lab activity. In Classic, a single-item Intuition note was placed in row 8, where this card's project link sits; that would have repeated the overlap fixed in part 1. It now uses the row that the Intuition link uses on other cards. No other card shows this note.
- **Course page:** the top bar links to both checks, as on the Number Theory page.
- **Knowledge map:** the "Proof & discrete math" node offers "Test your understanding".
- **Check pages:** Discrete Mathematics is in the subject menus. Like Number Theory and Coordinate Geometry, it has no "Field projects" link, because its projects are on the course page. The understanding check can be indexed by search engines; `projects/?module=discrete-math` stays out of the index.
- **Homepage scope line:** 64 diagnostic problems, and foundation checks in thirteen tracks, in English and Spanish.

## Language

Both checks are in English and Spanish, like the site's other checks; neither is a voice or AI activity. The foundation check's Spanish is written next to each English string. The 70 understanding-check strings are in `localization/discrete-math-diagnostic-extra-es.json`, using the course's terms ("principio de las casillas", "lema de los apretones de manos", "recíproca", "residuo"). The dictation button in explanation fields stays in English, as the language policy requires. Learner answers are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 352 of 352 Node tests pass, including the 31 recomputed foundation answers, the 70-task math audit, the bank 6, 7 and 8 compatibility tests and the twelve-subject foundation upgrade test.
- All 15 browser suites in `checks.yml` pass in Chromium. The activity suite's homepage link counts rose by one for the new understanding check. After the review changes, the suites that answer the new questions (illustrated map, Spanish layouts and activities) were run again and pass:
  - illustrated map suite: every foundation question answered in Spanish, with reports;
  - Spanish layout suite: the understanding check in Spanish;
  - activity suite: 100 pages and 54 drafts, with no page errors or failed requests.
- Screenshots of both checks in English and Spanish, and of the Classic card at 960px, show no clipped or overlapping content.
- Not checked: Safari and real devices.
