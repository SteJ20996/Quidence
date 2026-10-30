# Discrete Mathematics, part 1: ten proof projects · 2026-10-30

Discrete Mathematics is the seventh Further Mathematics course and the fourteenth subject card. This first part adds the course page at `courses/discrete-math/` with ten proof projects. It follows the Number Theory model: each project has four steps, every step has a complete reference proof, and an interactive lab sits beside the work. Calculations and choices are checked. Written proofs are saved for review and never scored.

The foundation check, the understanding check and an Intuition Lab activity come in later parts. Until then the homepage card lists them under "Not available yet".

## Projects

| Id | Level | Project | Main idea | Lab |
| --- | --- | --- | --- | --- |
| `dm-p01` | High school | Exam timetables | graph coloring; an odd cycle forces three colors; greedy coloring uses at most Δ + 1 | color the clash graph |
| `dm-p02` | High school | City routes & Pascal | routes as words, C(n, k), Pascal's rule, a closed intersection, the binomial theorem | grid paths with an optional closed corner |
| `dm-p03` | High school | Pigeonholes | socks, pairs adding to 21, the odd-part argument for "one number divides another" | pick numbers and watch the boxes fill |
| `dm-p04` | High school | Tower of Hanoi | the recurrence 2Mₙ₋₁ + 1, its closed form by induction, and why nobody can do better | three or four discs, illegal moves refused |
| `dm-p05` | Bridge | A broken chessboard | coloring invariant: two removed corners leave 30 dark and 32 light squares | board colors |
| `dm-p06` | Bridge, challenging | Tromino tilings | induction on 2ⁿ × 2ⁿ boards with one square missing | the covering from the proof, for any removed square |
| `dm-p07` | Bridge | Königsberg bridges | the handshake lemma, odd vertices come in pairs, Euler's condition | add the B–C or A–D bridge |
| `dm-p08` | University | Dominoes & Fibonacci | a 2 × n strip, the Fibonacci recurrence, the characteristic equation | list every tiling for n ≤ 6 |
| `dm-p09` | University, challenging | Mixed-up hats | inclusion–exclusion, derangements, the limit 1/e | permutations of four hats |
| `dm-p10` | University, challenging | The cheapest network | trees have n − 1 edges, Kruskal's algorithm, the exchange argument | Kruskal step by step |

In total there are 40 steps and 90 answer fields: 55 numbers, 19 single choices, 2 multiple choices and 14 written proofs. The proof toolkit has four foundation proofs (induction and strong induction, the pigeonhole principle, binomial coefficients and the handshake lemma).

The topics follow the scope agreed for the course: logic and proof techniques, counting and binomials, recurrences and graph theory. Truth tables, valid arguments, fallacies and quantifiers are left to the planned Basic Logic course. The proof projects here use contradiction (`dm-p05`), invariants (`dm-p05`, `dm-p07`), induction (`dm-p04`, `dm-p06`, `dm-p10`), the pigeonhole principle (`dm-p03`) and exchange arguments (`dm-p10`).

## Mathematics

`tests/discrete-math.test.cjs` recomputes every checked answer without reading the authored keys:

- `dm-p03`: brute force over subsets of 1–20. It finds the smallest size at which every subset contains a pair adding to 21, and checks every 11-element subset for a pair where one number divides the other.
- `dm-p04`: breadth-first search over Hanoi positions for 3, 4 and 5 discs. The 10- and 20-disc counts come from running the recurrence, not from search.
- `dm-p05`, `dm-p06`: exact-cover search for domino coverings of n × n boards with two opposite corners removed (n = 2 to 6), for tromino coverings of 4 × 4 boards with each possible square removed, and for the 5 × 5 claim in the follow-up question (only 9 of the 25 removed squares leave a coverable board).
- `dm-p07`: degree sums, odd-vertex counts, and the fewest added bridges found by trying every combination of up to three.
- `dm-p02`, `dm-p08`, `dm-p09`: enumeration of grid paths, strip tilings and permutations.
- `dm-p10`: every spanning tree of the cable graph, to confirm that 17 is the minimum and that the alternative network costs 25.

The lab helpers in `courses/discrete-math/core.js` are tested separately. The tromino covering they draw is valid for every removed square on boards up to 8 × 8, the path, tiling, derangement and Kruskal counts match the projects, the 7-move Hanoi solution ends on the right peg, and an illegal Hanoi move returns no position. The rounded answer for `dm-p09` (11/30) uses the shared Number Theory rule: fractions or at least two correctly rounded decimal places.

The tests and the answers were written in the same project, so this is a consistency check, not independent human certification. The 14 written-proof fields have criteria and a follow-up question, but no one has reviewed sample proofs against them yet.

## Language

The source is bilingual: `content/discrete-math/projects.cjs` holds every title, prompt, proof paragraph, label, option, criterion and follow-up in English and Spanish. `scripts/build-discrete-math.cjs` writes the English `courses/discrete-math/data.json` and gives the Spanish catalog to `scripts/build-locales.cjs`. Lab and interface strings are in `localization/discrete-math-ui-extra-es.json`, and 16 number templates (such as "Trominoes used: [n]") are in `localization/quantity-templates-es.json`.

This is not a voice or AI activity, so it uses English and Spanish like the other courses. Learner answers are never translated or rewritten.

The course is called "Matemáticas discretas" everywhere: the page, the card, both maps and the search text. The Spanish uses the same Latin American terms as the Number Theory course (for example "mcd", "residuo", "entre"). It was written alongside the English, not reviewed by a native-speaking teacher.

One conflict was found and fixed. The step title "Count the tiles" already existed in Number Theory as "Cuenta las losetas", while this course used "Cuenta las fichas". The catalog keeps one Spanish string per English string, so the Discrete Mathematics version would have silently changed the Number Theory title. The step is now "Count the trominoes" / "Cuenta los triminós". `scripts/build-locales.cjs` now stops the build if a Discrete Mathematics string gives an existing English string a different Spanish translation.

## Integration

- **Homepage:** a card in Further Mathematics, with its own illustration in the four appearances (Classic SVG in English and Spanish, Paper, Atlas, Studio and a new cartoon `graph` icon). The scope line now counts twelve mathematics courses and "10 Number Theory and 10 Discrete Mathematics proof projects".
- **Card layout:** this is the first card with a project link but neither check. In Classic at 960px and wider, its "Not available yet" box was placed in rows 7–9, where the project link and scope note already sit, so the grid pushed it into a second column and squeezed the rest of the card to 27px. The browser theme suite caught this. A new `checks` variant now puts the box in the two empty check rows (6–7). The existing variants are unchanged.
- **Knowledge map:** the "Proof & discrete math" node in both chapters now opens Discrete Mathematics. Its concept preview links there instead of Number Theory.
- **Illustrated map:** Discrete Mathematics sits directly right of "Proof & logic". Number Theory moves one column right, next to "Algebra & numbers"; "Proof & logic" still leads to it, routed below the new node. Number Theory's dashed link to "Algebra & numbers" now leaves from the top of its node and crosses the multivariable branch once, instead of running alongside it and looking like a link to "Geometry & space". Further Mathematics now shows 7 course entrances.
- **Records:** saved under `quidence:discrete-math:v1`, which is listed in the backup policy (`assets/sync-policy.js`). The report store names the subject. Learning requests opted into reports are attached only to Discrete Mathematics checks.
- **Release and search:** the course is in the static bundle and the sitemap, with English and Spanish SEO text. `content/` stays out of the bundle. The local backend serves `courses/discrete-math/data.json`.
- **Source inventory:** the ten projects are in `review/source-ledger.json` (529 records). Like every other entry they are "not-cleared". The problems are classic exercises (Königsberg, Hanoi, the mutilated chessboard, Golomb's trominoes, derangements, Kruskal), and the wording, numbers and proofs were written for this course, but no source comparison has been done.

Two unit tests now exclude Discrete Mathematics from rules that do not apply yet or do not apply to it:

- `tests/challenges.test.cjs` expects every course to have diagnostic problems. The exclusion is removed when the understanding check is added.
- `tests/projects.test.cjs` expects two field projects per course. Like Number Theory, this course keeps its own projects instead.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 351 of 351 Node tests pass, including 12 new Discrete Mathematics tests and the source inventory check.
- New browser suite `npm run test:discrete-math:browser`, added to `checks.yml`:
  - It opens all 40 steps and compares every Spanish title and proof paragraph with the authored source, in both 1440px and 375px layouts.
  - It runs every lab control and checks that the Hanoi lab solves in 7 moves and that Kruskal's algorithm totals 17.
  - It checks the rounded-fraction rule and the multiple-choice rule, and that option order survives a language switch and a reload.
  - It checks that learner text, including HTML-like text, is preserved through a language switch, a report and an export.
  - It checks that corrupted saved data is left untouched and that failed saves are reported.
  - It finds no horizontal overflow at six widths from 1920px to 320px in either language, no untranslated text, no page errors and no failed requests.
- All 15 browser suites in `checks.yml` pass in Chromium. The existing suites' card and course-node counts were updated from 13 to 14, Further Mathematics from 6 to 7 and College Level from 5 to 6. The themes suite caught the Classic card layout problem described above, and the illustrated map suite caught the edge crossing.
- Not checked: Safari and real devices.
