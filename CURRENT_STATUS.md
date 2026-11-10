## 2026-11-10 · Quidence is English only

The repository owner limited Quidence to English, including future subjects. [AGENTS.md](AGENTS.md) records the policy.

- **Removed.**
  - The Spanish catalogues (`assets/i18n-es.js`, `assets/i18n-es/`), the whole `localization/` folder and the 22 Spanish illustrations (`*-es.svg`).
  - Every language menu, the language row in the appearance menu and the "English and Spanish" labels on course pages.
  - The second-language copy in the course, project, Intuition Lab, map, Game Theory project and Calculus check sources.
  - `?lang=` on links, hreflang alternates and the Spanish sitemap entries. The sitemap lists each of the 22 pages once.
  - The scripts that produced Spanish (`build-locales`, `extract-localization`, `number-theory-locales`) and `test:spanish:review`.
- **Kept on purpose.**
  - A `?lang=es` address or a Spanish site language saved by an earlier version opens the page in English. The saved preference stays in the browser, unchanged.
  - Answers, drafts and records saved while Spanish was offered are not rewritten. The course validators still accept their earlier language fields, so they open and export as before. Course pages ask for responses in English.
  - The foundation grader still reads the Spanish unit spellings (for example litros, horas) that earlier answers may contain, so earlier work is graded the same way. They are never shown.
  - Dates and numbers use an English format, whatever the browser's language.
- **Checks.**
  - `tests/english-only.test.cjs` scans every published file for language menus, Spanish catalogues, `?lang=es` and Spanish punctuation.
  - `npm run test:english:browser` replaces `test:localization:browser`. The browser is set to Mexican Spanish, every address carries `?lang=es` and a Spanish preference is saved. It opens every released page at four widths, follows every same-site link from the homepage (119 routes), checks each page is English with no language control, no Spanish and no failed load, and checks that original answers reach reports exactly as written.
  - A one-off audit, also with the browser set to Mexican Spanish, followed every same-site link from the homepage in all four appearances (119 routes each, 476 page loads). On every route in Classic, and on the homepage in the other three, it then clicked each control that does not delete, download, record or send data (1,435 clicks) and read the page again. It found no Spanish, no page error and no failed load.
  - A static scan of every released text file found Spanish only in the grader's unit spellings described above.
  - Before-and-after screenshots of all 36 pages, at two widths in two appearances, show no layout change apart from the removed menus. Two places needed a fix: an empty column in the Classic homepage header and a lost margin on the Calculus check page.
  - The other browser suites and unit tests lost their Spanish steps; their English checks are unchanged.

See [the review note](review/english-only-20261110.md).

## 2026-11-09 · Algorithms part 3: algorithms 12 to 16

The Algorithms course opens its university row, in English and Spanish, and the route is complete:
- 12 Quicksort, with the waiting ranges on an explicit stack
- 13 Dynamic programming: the fewest coins
- 14 Dijkstra’s shortest paths and 15 Kruskal’s spanning trees, on one six-town map whose road lengths learners choose
- 16 P versus NP, through subset sum and masks counted in binary

Each has the same three synchronized views, code listings, predictions, an idea card and three challenges as parts 1 and 2.

- **Why #14 does not use the mud maze.** In the maze a step costs what the entered cell costs, so the first distance a cell receives is already final and the update step never lowers one. On the road map the default lengths lower four distances.
- **Challenges.** For example:
  - a shuffled list that quicksort sorts with fewer comparisons than the same numbers sorted;
  - breaking the coin table on purpose, predicting the outcome first;
  - road lengths where always taking the nearest town is not the shortest route;
  - a triangle of roads 2, 2 and 3 where the cheapest network lengthens a trip;
  - {6, 5, 5} and target 10, where largest first misses the answer.
- **Improvements.** Each one is tested on 300 generated inputs: pivot choice, stopping Dijkstra’s method at the goal, stopping Kruskal’s method after n − 1 roads, and pruning the subset search.
- **Homepage.** The card, the page header and both knowledge maps say algorithms 1 to 16 are open. On the Classic map, Dynamic programming and Complexity lead to the course.
- **Checks.**
  - Traces are compared with independent references: Floyd–Warshall distances, every set of five roads, and reachable subset sums.
  - The Python listings are run, and the Java listings compiled and run.
  - Cost numbers are tested, such as 499,500 comparisons, 3,963 table comparisons and 142,511 ways to pay 1,000.
  - The browser test steps through all sixteen algorithms.

See [the review note](review/algorithms-university-20261109.md).

## 2026-11-09 · Algorithms part 2: algorithms 6 to 11

The Algorithms course opens its high-school row, in English and Spanish:
- 6 Binary search
- 7 Merge sort, taught bottom-up
- 8 Recursion: the Tower of Hanoi, with a call stack
- 9 Breadth-first search and 10 Depth-first search, on a 5 × 7 maze that learners can edit
- 11 Greedy change

Each has the same three synchronized views, code listings, predictions, an idea card and three challenges as part 1.

- **Challenges.** For example:
  - an unsorted list that defeats binary search;
  - a sorted list on which insertion sort beats merge sort;
  - breaking the Tower of Hanoi on purpose, predicting the outcome first;
  - mud cells that make the BFS path not the cheapest;
  - a maze where DFS takes a long way round;
  - coins 1, 3 and 4 for 6, where greedy change is not the fewest.
- **Improvements.** Each one is tested on 300 generated inputs.
- **Suggestions** after the BFS and greedy counterexamples point to #14 and #13 in the university part. The map marks those as planned and also offers an open algorithm.
- **Homepage.** The card, the page header and both knowledge maps say algorithms 1 to 11 are open. On the Classic map, Recursion and Graph algorithms lead to the course.
- **Checks.**
  - Traces are compared with reference results.
  - The Python listings are run, and the Java listings compiled and run.
  - Cost numbers are tested, such as 9,217 comparisons for 1,024 items and 2ⁿ − 1 moves.
  - The browser test steps through all eleven algorithms.

See [the review note](review/algorithms-high-school-20261109.md).

## 2026-11-09 · New course: Algorithms (part 1, algorithms 1 to 5)

The homepage has a new group, Computer Science, and its first course, Algorithms (`courses/algorithms/`), in English and Spanish. The course is one numbered route of 16 algorithms from middle school to university. This part opens the middle-school algorithms: 1 Find the maximum, 2 Linear search, 3 Bubble sort, 4 Insertion sort and 5 Euclid's algorithm.

- **Three synchronized views.** A flowchart, numbered steps and the data (pointers, the key set aside, a growing trace table) follow the same event. Python, Java and MATLAB listings highlight the matching lines, and a guide teaches the code line by line. Code is shown, not run.
- **Predictions.** On by default before each comparison. A section can skip them, and a single step can still be predicted on request. Predictions are counted, not scored.
- **Four observable behaviours, no ability score.** Each algorithm has an idea card, kept exactly as written and not scored, and three cards drawn from: find a counterexample (with a follow-up on why), find the bottleneck in the flowchart, propose an improvement and test it on hundreds of inputs, and predict the cost.
- **Suggested next algorithm.** Fixed, readable rules in `core.js` name the next number and list the evidence used. Every open algorithm stays reachable from the route map.
- **Records.** Saved under `quidence:algorithms:v1` with the same conflict, unreadable-record and export handling as the other project courses.
- **Checks.** Traces are compared with independent reference results, and each prediction's key with what the trace does next. The Python listings run under python3, and the Java listings are compiled and run. MATLAB is checked by pattern only.

- **Homepage.** Computer Science is a section in Classic and a category in the other three appearances. Each appearance draws the Algorithms card in its own style. Both knowledge maps gain a Computer Science chapter, and both are now titled "Knowledge Map". The card lists the foundation check, understanding check and Intuition Lab activity as not available yet.

Current inventory: 17 subject cards (6 School Mathematics, 8 Further Mathematics, 2 Science, 1 Computer Science) and 3 cross-disciplinary projects.

See [the review note](review/algorithms-middle-school-20261109.md).

## 2026-11-01 · Stacked fractions on screen

Fractions written with a slash are drawn stacked on every published page, in English and Spanish:
- numbers such as 2/3;
- expressions such as n/2, σ/√n, (n + 1)/(n + 2) and C(n, n/2) / 2ⁿ.

It is display-only. Content, translations, answer checking, learner answers, records and exports keep the slash. The page text keeps it too, so copying, search and screen readers get the slash form. Units (m/s, km/h, J/(kg·K)), words, labels, dates, counters, form fields, charts and learner text are not drawn. Translation passes restore the original text before translating and draw again afterwards. The parser was checked against all 25,495 catalog strings. See [the review note](review/stacked-fractions-20261101.md).

## 2026-11-01 · Probability part 4: Statistics lesson on sampling distributions

Statistics has a fifth lesson, "How much does a sample mean vary?", in English and Spanish. It finishes the Probability course plan.

- **The lesson.** A right-skewed spinner (μ = 2.2, σ = 1.4) shows that E(x̄) = μ, that the standard error is σ/√n, and that the distribution of x̄ approaches a normal curve while the data keep their skew. The chart shows the exact distribution of the mean for n = 1 to 16, with an optional normal curve.
- **Saved sessions.** A session saved with the four earlier lessons opens unchanged, with an empty place for lesson 5 and a `lessons_added` event. A finished session resumes at lesson 5, and the page says that a lesson was added.
- **Pointers to Probability.** The Benford "uses" line, the Discrete Mathematics hats project and the Game Theory shared-printer step 08 now point to the Probability course.
- **Checks.** The test computes the exact distribution with BigInt for every n, and builds a finished record with the earlier version's engine to check the upgrade.

See [the review note](review/statistics-sampling-20261101.md).

## 2026-11-01 · Probability part 3: Intuition Lab activity

Intuition Lab has a sixteenth activity, "More tosses. More often exactly half?", in English and Spanish. The Probability card now has every activity, and its "not available yet" note is gone.

- **The question.** Is exactly half heads more likely with 100 tosses than with 10? No: two more tosses multiply that probability by (n + 1)/(n + 2), so it falls from 0.246 to about 0.08.
- **What does settle.** The proportion of heads: P(0.4 ≤ heads/n ≤ 0.6) rises from about 0.656 to about 0.965, while the expected gap |heads − n/2| grows from about 1.23 to about 3.98.
- **Checks.** The test computes every readout exactly with BigInt and checks the ratio identity. It lists all 64 sequences of 6 tosses for the transfer answer (20) and checks each number the explanation states.

Current inventory: 16 subject cards, each with a foundation check, an understanding check and an Intuition Lab activity. See [the review note](review/probability-intuition-20261101.md).

## 2026-11-01 · Fixes from an outside deep audit

A deep audit recomputed the published questions independently. It found no wrong answer key, proof or translation of meaning. It did confirm grading, input and wording problems. All of these are now fixed, each with a test that fails on the previous code:

- **Units:** a matching unit from the field label is accepted in all 244 unit-labelled number fields, including Spanish unit words and $ written in front. Before, 47 fields refused units such as cm², L, km and kW.
- **Linear Algebra:** the learning engine, the lesson checkpoint and the Matrix Explorer prediction now require exact answers.
- **Matrix Explorer:** entries follow the declared steps of 0.5, so rank is exact and a tiny invertible matrix is no longer called singular.
- **Coordinate Geometry:** the project checks distances to two decimal places, and checks "equal distances" and "on the road" exactly.
- **MathVoice:** a number matches only when it rounds correctly to two places.
- **Saved reports:** they draw each question's given table, matrix and graph from the snapshot.
- **Wording and translation:**
  - Benford's step 1 and step 6 no longer speak of chance about a fixed list;
  - the Intuition Lab chord condition says "inside the circle";
  - two Number Theory sentences are now exact;
  - the Linear Algebra follow-up count reads 4;
  - one Algebra II option is now translated.

Foundation question bl-f10 needs a versioned foundation bank before its wording can change, so it is left for a later change. See [the review note](review/deep-audit-fixes-20261101.md).

## 2026-11-01 · Probability part 2: foundation and understanding checks

Probability now has a 15-question foundation check (30 parts) and a four-problem understanding check (16 parts), in English and Spanish. The course page, homepage card and check menus link to both.

- **Foundation check.** It covers fractions, decimals and percents, counting outcomes, powers of fractions, averages, inequalities, and reading "at least one", "and" and "or".
- **Understanding check.** It tests complements, Bayes' rule, linearity of expectation, waiting times, and the binomial distribution against Chebyshev's bound, each in a new setting.
- **Independent recomputation.** A separate test recomputes every foundation answer by listing outcomes, and `scripts/audit-challenges.py` recomputes every understanding answer the same way.
- **Saved records.** Records saved with the fourteen earlier foundation subjects still open. The understanding-check bank becomes `quidence-challenges-11`.

See [the review note](review/probability-checks-20261101.md).

Current inventory: 72 diagnostic problems, and foundation checks in fifteen tracks.

## 2026-11-01 · New course: Probability (part 1, ten proof projects)

Probability is now its own Further Mathematics course (`courses/probability/`), instead of the last lesson of Statistics. Ten projects of four steps each run from de Méré's dice, the problem of points and a positive screening test, through Bertrand's boxes and Monty Hall, shared birthdays, fixed points of a shuffle, waiting for a six and collecting stickers, to the Galton board and the law of large numbers. They are in English and Spanish.

- Numeric answers are exact fractions. Where a field says so, correctly rounded decimals are also accepted. Written proofs are saved for review.
- Each project has a seeded simulation lab, which shows counts only after the learner acts.
- A toolkit of four proofs supplies the rules the projects use.
- An independent content review found one blocker (a stated number of decimal places that did not match the grader) and twelve other fixes; all were made. See [the review note](review/probability-projects-20261101.md).
- Foundation and understanding checks, an Intuition Lab activity, and a Statistics lesson on sampling distributions come in later parts.

Current inventory: 16 subject cards (6 School Mathematics, 8 Further Mathematics, 2 Science) and 3 cross-disciplinary projects. Probability has 10 proof projects, 40 steps and 83 answer fields.

## 2026-11-01 · Fixes from an outside site audit

An outside audit listed seven problems, and all seven were confirmed in the source.

- A fraction written with decimals, such as 0.3/0.1, now matches an integer answer in the foundation checks, understanding checks and field projects. The new numeric policy is `written-precision-4`.
- A Linear Algebra vector component must match exactly; before, (3.009, −2.009) counted as (3, −2).
- In the Algebra module, an answer entered after the report showed the reference answer is recorded as `after_reference_answer`. It is no longer counted as independent first-try evidence.
- The on-page foundation report now shows each question's given table, matrix and graph.
- The cross-disciplinary page header now says 3 projects and 18 steps.
- The Basic Logic tool rule now says "exactly when". The project bank becomes `quidence-projects-8`, and records saved under bank 7 keep the original wording.
- The Benford test lab now states its 5% conclusion together with its random-sample premise.

Saved answers are not rewritten. Earlier results stay readable under the rule they were saved with. See [the review note](review/site-audit-20261101.md).

## 2026-11-01 · Two course descriptions corrected (probability)

The basics of probability, events, conditional probability and independence, are taught systematically only in the last Statistics lesson. No course teaches random variables, expected value or probability distributions; the Benford project introduces expected counts and the chi-square test for its own step 6, and the Game Theory and Discrete Mathematics projects use probability directly. The Benford project's `uses` line no longer credits Statistics with expected counts and the chi-square test. The knowledge map's Probability node now says what the Statistics lesson covers and that the Statistics course does not yet teach random variables, expected value or probability distributions. In Spanish, the map's related-course links now show the course name in Spanish, such as «Estadística», instead of the English title. A separate Probability course is planned. See [cross-disciplinary-benford-20261101.md](review/cross-disciplinary-benford-20261101.md).

## 2026-11-01 · Cross-disciplinary projects, part 3: Benford's law

The Cross-disciplinary Projects section has a third project, "Why do so many numbers start with 1?" (`cross-disciplinary/?project=cross-p03`), in English and Spanish. It counts the first digits of the powers of 2, derives Benford's law P(d) = log₁₀(1 + 1/d) from the mantissa on a log scale, proves that log₁₀ 2 is irrational, shows why a change of units keeps the law, and ends with the chi-square test and why a failed test is not proof of fraud. It draws on Statistics, Algebra II, Pre-calculus and Number Theory. See [cross-disciplinary-benford-20261101.md](review/cross-disciplinary-benford-20261101.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science) and 3 cross-disciplinary projects.

## 2026-11-01 · Logo requests are no longer cancelled by the swap

When `themes.js` switched a logo to its other version while the first image was still loading, Chrome cancelled that request. Visitors saw nothing wrong, but on a busy machine the activity and brand browser tests counted it as a failed request. A request still loading is now handed to a detached image, so it finishes. The themes browser test delays the first version and checks that no request fails. See [logo-load-20261101.md](review/logo-load-20261101.md).

## 2026-11-01 · Number Theory project 11: fractions that force whole numbers

Number Theory has an eleventh project, "Fractions that force whole numbers" (`nt-p11`), in English and Spanish, fourth on the route after Tickets & thresholds. It starts from a word problem: 88 books shared between two classes, with 2/9 of one class's books math books and 13/16 of the other's literature books. The fractions become divisibility conditions, and 9x + 16y = 88 is solved modulo 8. Later steps cover inverses modulo 12, the hundred fowls problem from Zhang Qiujian's Mathematical Manual, the general solution of ax + by = c, and the gcd condition. Each step has an animated lab. See [number-theory-fractions-20261101.md](review/number-theory-fractions-20261101.md).

Current inventory: Number Theory has 11 proof projects, 48 steps and 137 answer fields.

## 2026-11-01 · Logo follow-up for slow devices

On a busy machine, Chrome can paint a page before it runs the first animation frame, so Classic could still show the dark logo briefly. Logos are now hidden by CSS until themes.js settles their version, and they are settled as soon as they are parsed. With the CPU slowed six times, no wrong-color logo shows after paint, in any appearance. See [logo-load-20261101.md](review/logo-load-20261101.md).

## 2026-11-01 · A steady logo while pages load

The records banner, the appearance bar and the language row now go in before a page is painted. Before, they were added after it was painted and pushed it down. The logo's color is chosen before its first paint, so Classic no longer shows the dark logo on its dark headers first. The themes browser test fails if the logo is swapped after paint or, in English, moves after paint. Spanish pages still move once while they are translated. See [logo-load-20261101.md](review/logo-load-20261101.md).

## 2026-10-31 · Readable header text in every appearance

Header text is now readable in every appearance. In Classic, the Math Voice Lab header had white text on a white background. In the illustrated appearances, the header subtitle on Discrete Mathematics, Number Theory and Cross-disciplinary Projects was light gray on a light background. The themes browser test now fails when header or toolbar text has less than 4.5:1 contrast. See [header-contrast-20261031.md](review/header-contrast-20261031.md).

## 2026-10-31 · Standalone links become buttons

Standalone navigation links and actions now look like buttons in every appearance, on every released page. Before, some were underlined or plain text, such as the Cross-disciplinary Projects top bar and the course navigation strip on course pages. Links inside sentences and in page footers stay links. The themes browser test now fails if a standalone link or action looks like plain text. See [link-buttons-20261031.md](review/link-buttons-20261031.md).

## 2026-10-31 · Cross-disciplinary projects, part 2

The Cross-disciplinary Projects section has a second project, "Two puzzles, one sequence" (`cross-disciplinary/?project=cross-p02`), in English and Spanish. It counts the regions made by the chords of a circle and the pieces made by cuts of a four-dimensional ball, and proves that the two always agree. See [cross-disciplinary-chords-20261031.md](review/cross-disciplinary-chords-20261031.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science) and 2 cross-disciplinary projects.

## 2026-10-31 · Cross-disciplinary projects

The homepage has a Cross-disciplinary Projects section with its first project, "How many pieces can n cuts make?" (`cross-disciplinary/`), in English and Spanish. It has six steps with animated labs, from a stick to a pizza to a ball, and draws on Geometry, Algebra II, Discrete Mathematics and Basic Logic. See [cross-disciplinary-ball-cuts-20261031.md](review/cross-disciplinary-ball-cuts-20261031.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science) and 1 cross-disciplinary project.

## 2026-10-30 · Basic Logic, part 4

Intuition Lab has a fifteenth activity, "Which cards would you turn over?", the card-selection task for Basic Logic. Every subject card now has a foundation check, an understanding check and an Intuition Lab activity. See [basic-logic-intuition-20261030.md](review/basic-logic-intuition-20261030.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science). Every card has a foundation check, an understanding check and an Intuition Lab activity; Intuition Lab has 15 activities.

## 2026-10-30 · Basic Logic, part 3

Basic Logic has a 15-question foundation check and a four-problem understanding check, in English and Spanish. The diagnostic bank is now `quidence-challenges-10`, with 68 current problems; foundation records saved with thirteen subjects still open. A shared report sentence, "Recheck: …", now reads correctly and is translated on the Spanish site. The Intuition Lab activity is the only activity the card still lists as not available. See [basic-logic-checks-20261030.md](review/basic-logic-checks-20261030.md).

Current inventory: 15 subject cards. Every card has a foundation check and an understanding check; every card except Basic Logic has an Intuition Lab activity.

## 2026-10-30 · Basic Logic, part 2

Basic Logic has two bilingual field projects: a robotics club's rule (connectives, a conditional and its converse, and a rule with parentheses) and a farmers' market survey (a three-set Venn diagram, all/some claims, and bounds that premises force). The field-project bank is now `quidence-projects-7`; version 6 is frozen and its records still open. See [basic-logic-projects-20261030.md](review/basic-logic-projects-20261030.md).

Current inventory: 15 subject cards. Every card except Basic Logic has a foundation check, an understanding check and an Intuition Lab activity; Basic Logic has its lessons and field projects. The homepage counts 22 field projects.

## 2026-10-30 · Basic Logic, part 1

Basic Logic is a new School Mathematics course at the High School level, with four bilingual lessons: statements and truth tables, conditionals, valid arguments and fallacies, and quantifiers and syllogisms. Its models are truth tables and a three-set Venn diagram. The knowledge map has a new "Logic" node, and the illustrated map has a Basic Logic course node. Lesson work is saved under `basic-logic_beta01_session_v1`. Two field projects, the foundation and understanding checks, and an Intuition Lab activity are planned as later parts; the card lists them as not available yet. See [basic-logic-course-20261030.md](review/basic-logic-course-20261030.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science). Every card except Basic Logic has a foundation check, an understanding check and an Intuition Lab activity; Intuition Lab has 14 activities. The source inventory has 561 records, all still not-cleared.

## 2026-10-30 · Discrete Mathematics, part 3

Intuition Lab has a fourteenth activity, "It doubles each time. Every time?", the circle-regions problem for Discrete Mathematics. Every subject card now has a foundation check, an understanding check and an Intuition Lab activity. See [discrete-math-intuition-20261030.md](review/discrete-math-intuition-20261030.md).

## 2026-10-30 · Discrete Mathematics, part 2

Discrete Mathematics has a 15-question foundation check and a four-problem understanding check, in English and Spanish. The diagnostic bank is now `quidence-challenges-9`, with 64 current problems. The Intuition Lab activity is the only activity the card still lists as not available. See [discrete-math-checks-20261030.md](review/discrete-math-checks-20261030.md).

Current inventory: 14 subject cards. Every card has a foundation check and an understanding check; every card except Discrete Mathematics has an Intuition Lab activity.

## 2026-10-30 · Discrete Mathematics, part 1

Discrete Mathematics is a new Further Mathematics course with ten bilingual proof projects (40 steps, 90 answer fields). Its labs cover graph coloring, grid paths, pigeonholes, Hanoi, chessboard and tromino coverings, Königsberg, domino strips, derangements and Kruskal's algorithm. The knowledge map and illustrated map open it, and its records are kept under `quidence:discrete-math:v1`. The foundation check, the understanding check and an Intuition Lab activity are planned as later parts; the card lists them as not available yet. See [discrete-math-projects-20261030.md](review/discrete-math-projects-20261030.md).

Current inventory: 14 subject cards (5 School Mathematics, 7 Further Mathematics, 2 Science). Every card except Discrete Mathematics has a foundation check, an understanding check and an Intuition Lab activity. The source inventory has 529 records, all still not-cleared.

## 2026-10-29 · Status update

Changes since the 2026-10-14 entries, with their release notes:

- **Appearances:** Classic card rows follow the Physics 1 layout (#40), Geometric Studio is built from the approved reference (#41), the illustrated themes lose their outer frames (#43), and the desktop subject hub is wider in all four appearances (#44). The homepage interface from before the Intuition Lab view is restored, with a fixed Atlas Geometry pyramid and new Coordinate Geometry card art (#56). Cards note the activities a course does not have yet (#57). See [classic-card-rows-20261014.md](review/classic-card-rows-20261014.md) and [geometric-studio-20261014.md](review/geometric-studio-20261014.md).
- **Game Theory:** bilingual projects and decision cases (#42).
- **Knowledge map and Calculus:** map topics link to learning, Calculus has a dialogue route (#45) and a wider exploration interface (#47).
- **Intuition Lab:** a third homepage view (#48, #49) with one design per appearance (#56). It now has 13 activities, one per subject. See [intuition-lab-integration.md](review/intuition-lab-integration.md).
- **Voice:** voice dialogue activities stay in English without changing other language preferences (#46). The Math Voice Lab covers six subjects (#50–#52, #54), and reviewed English dictation is available in explanation fields (#53). See [AGENTS.md](AGENTS.md), [the Math Voice Lab README](demos/college-voice-lab/README.md) and [reviewed-dictation-20261026.md](review/reviewed-dictation-20261026.md).
- **Coordinate Geometry:** two guided projects (#55), then a foundation check and understanding check (#59, with a card layout fix in #60), four lessons (#61), an Intuition Lab activity (#62) and a homepage projects link (#63). See [coordinate-geometry-integration.md](review/coordinate-geometry-integration.md) and the four 2026-10-29 notes in `review/`.
- **Number Theory:** a four-problem understanding check (#58). See [number-theory-understanding-check-20261029.md](review/number-theory-understanding-check-20261029.md).

Current inventory: 13 subject cards (5 School Mathematics, 6 Further Mathematics, 2 Science). The diagnostic bank has 60 current problems and 236 answer parts; Game Theory's 15-question check is separate. Every card has a foundation check, an understanding check and an Intuition Lab activity; Geometry and Algebra II gained their foundation checks on 2026-10-29. The 目前狀態 section below still reflects the 2026-10-08 review, except for its inventory bullets, which are updated.

## 2026-10-14 · Remembered site-wide appearance

Paper, Atlas and Studio are available on all 24 public pages. The shared head initializer restores the browser preference before styles load; live changes preserve locale, activity inputs and saved records. Portable reports embed the selected style and print on white paper. Validation and scope: [themes-2026-10-14.md](review/themes-2026-10-14.md).

## 2026-10-14 · Corrected external review

Implemented scope, evidence and remaining conditions: [external-review-2026-10-14.md](review/external-review-2026-10-14.md). The source inventory contains 405 records (385 active, 20 historical-only), all still not-cleared.

## 2026-10-13 · 下拉控制項箭頭間距

- 語言按鈕的箭頭距右邊框 12px，右側預留 36px，避免文字與箭頭重疊。
- 全部公開頁面的單選下拉選單共用同一規則，涵蓋 Subject、報告版本/評分、課程實驗與作圖選點；深色語言按鈕用白色箭頭，淺色控制項用深色箭頭。
- 保留原生下拉選擇、鍵盤操作及高對比度模式；更新各頁面的資源指紋。
- 數論頁語言控制項加寬至 144px，為手機上 16px 字級的 Español 保留充足空間。

## 2026-10-12 · 與 Qidolab 統一頁面背景

- 頁面底色使用 Qidolab 的暖奶油色 #F8F5EC；980px 以上螢幕沿用相同的淡綠灰與暖橙放射狀漸層。
- 首頁、課程、基礎檢查、專題與報告頁面使用同一背景規則，閱讀卡片保持白色，列印報告使用白色紙面。

## 2026-10-12 · 已審核配色與 Qidolab 導覽

- 23 個公開頁面採用薄霧紫、白色閱讀卡片和深青綠操作色；報告匯出樣式同步。
- 首頁底部保留 Qidolab 正式組合 Logo 與水壺小遊戲配圖，左側卡片以原生錨點捲動到該區域；支援英／西語和減少動態效果。
- 課程產生器、翻譯來源及快取指紋均已納入，避免重新建置後回退。範圍和驗證見 [本輪整合紀錄](review/mist-teal-qidolab-20261012.md)；原有實體裝置列印和 Safari 複測待辦繼續保留。

## 2026-10-10 · Number Theory 與知識地圖發布

- 新增數論：10 個專題、43 個步驟、120 個答題欄位及完整證明；首頁、學科卡片和知識地圖均可進入。現有十門課與歷史紀錄保持相容。
- 數論題目、完整證明、選項、互動模型與匯出均提供英/西雙語；西語按墨西哥常用拉美用詞複核。證明回答僅儲存待審，不自動判成正確。
- 修復數論的跨分頁儲存衝突保護；加入裝置備份。移除地圖中含義不明的大圓，並保持既定地圖比例。
- 發布範圍與驗證：[數論發布紀錄](review/number-theory-release-20261010.md)。

## 2026-10-09 · Logo / 西語審核修復

- 入門課回饋中的學生解釋加上獨立原文保護；停用逐詞替換，只翻譯已複核的完整文案/格式。未知句子保持完整並記錄待補譯。
- 數值輸入明確使用小數點、不使用千分位。逗號輸入留在草稿，點號可能表示千分位時先展示實際讀取值，要求主動確認；儲存原始輸入和確認紀錄。既有數值精度規則及歷史判定保持原樣。
- Saved reports 深色頁首改用白字 logo；報告去重標題、日期改成明確月份，兩張西語封面修正文字版面。新增 PNG 主螢幕圖示及分享圖；英文啟動不載入西語詞庫。
- 擴大自動檢查到課程步驟、實驗讀數、介紹、紀錄列表、回饋、完整報告與匯出；品牌檢查增加實際背景對比度。範圍及後續 SEO/印刷計畫見 [審核修復紀錄](review/logo-spanish-followup.md)。
- 本次程式碼和 Cloudflare 更新包按完整迴歸結果交付；正式網域部署仍以實際上傳為準。

## 2026-10-09 · 使用者新向量 logo 與雙語發布

- 採用 Stephen 上傳的向量圖，原檔案儲存在 `design/brand/quidence-logo-source.svg`；保留全部前景路徑及字形，去除顯示版藍色背景與外部留白。深色頁首用白字/薄荷綠，淺色頁面和報告用深藍字/深青綠。
- 22 個公開頁面的所有品牌入口、課程產生範本、瀏覽器圖示與離線報告統一使用新標誌；移除舊首頁 PNG 及其濾鏡裁切。品牌資源帶內容指紋，避免舊資源混用。英文和西班牙語共享同一標誌。
- 西班牙語版 PR #21 已合併；補齊專題介紹的兩個片段譯文，評分規則和學生原文不變。
- 檢查：完整 `npm test` 通過；雙語瀏覽器檢查 88 組版面、72 項題目/專題、20 個報告通過；既有瀏覽器快取/草稿檢查 80 組版面、40 份草稿通過。新標誌核對英/西兩種語言、22 頁、四種寬度共 176 組版面及兩份離線報告，均無標誌遮擋、裁切、橫向溢出和資源載入失敗。
- 上傳 Cloudflare 使用本次新 logo + Spanish ZIP；GitHub 合併與正式環境上傳分別完成，網站上傳狀態以實際部署為準。

## 2026-10-09 · English / Spanish version

- 新增 English / Español 切換；首頁、課程、題目、專題、回饋、報告和 SVG 封面支援中性西班牙語。URL 與本機語言偏好可保留選擇。
- 翻譯分科完成後統一複核：7,079 條編號譯文、動態條件與目前版本派生文案；修正第二個方程式右端的譯法，並補全 u<f 光學限制。數字、單位、符號、否定和精度 AND/OR 條件已核對。
- 切換僅更新展示，不重新載入課程、不改答案值、原文、評分規則或歷史紀錄。學生解釋、學習請求和審核筆記保持原文；Markdown/PDF 採用在地化展示副本，JSON 原始證據保留。
- 驗證：383 項題目指紋未變；22 個公開頁面 × 4 寬度；52 診斷題、20 專題和 20 報告；切換前後輸入/存檔一致，頁面錯誤及目前題目英語殘留為 0。既有數學/儲存/安全測試通過；瀏覽器快取迴歸及 CI 結果以該 PR 檢查為準。
- 上傳 Cloudflare 使用新 Spanish ZIP；尚未替使用者部署正式網站。原有使命、教學方向及研究/驗證邊界繼續有效。

# Quidence 目前狀態

更新：2026-10-08。本文是目前狀態入口；帶日期的審核文件保留其當時的測試範圍，不把過去的完成事項誤作待辦。新建議的逐項取捨見 [整體建議整改紀錄](OVERALL_REVIEW_2026-10-07.md)。目前物理分課範圍見 [兩課設計與審核](PHYSICS_TRACKS_DESIGN_2026-10-08.md)，[原 Physics 試點](PHYSICS_COURSE_DESIGN_2026-10-08.md)保留歷史範圍。Claude 複查摘要見 [第二輪迴歸整改](REGRESSION_REVIEW_2026-10-08.md)，隨後收到的完整文件及物理建議見 [完整報告補充核對](FULL_REGRESSION_FOLLOWUP_2026-10-08.md)。物理第三輪回饋與驗收範圍見 [物理 v3 整改](PHYSICS_V3_REVIEW_2026-10-08.md)。最新專題/檢查入口介面改動見 [活動導覽審核](ACTIVITY_NAVIGATION_REVIEW_2026-10-08.md)。

## 已完成

- 十科專題和檢查入口共用分層導覽：白色頁首與正文對齊，學科選擇與 Overview / My report 獨立分組，學習、檢查、專題標明目前活動。舊基礎檢查頁同步外殼；跨活動連結隨所選學科更新並開啟新分頁。原導覽 PR #17 已合併；隨後收到的舊資源混用問題已追加資源指紋及入口版本，真實 Chromium 的四種寬度共 80 組版面、40 組草稿流程和舊快取升級迴歸通過，已加入 CI。追加修復 PR #18 已按使用者批准合併，GitHub Actions 通過；範圍及實際截圖見 [資源版本修復](ACTIVITY_ASSET_FIX_2026-10-08.md)；正式網域、Safari 和實體裝置體驗仍需核對。

- 首頁右上角已補 Science 大寫及線上學習/基礎檢查/報告說明；需求下加入預設關閉的報告參考選項，原文隨對應學科新報告儲存，歷史、JSON、Markdown、完整/摘要 PDF 和圖包讀取儲存的上下文。頁底增加 hello@quidence.com 的郵件回饋入口。PR #19 已合併；行為及檢查見 [首頁需求與回饋審核](HOME_REQUEST_REVIEW_2026-10-08.md)。
- 首頁左上角採用使用者提供的放大鏡 Quidence Logo，保留原 PNG，深色頁首用 CSS 顯示白色字標，點選返回首頁。1440、768、375、320px Chromium 版面及首頁連結檢查通過；這次 Logo 更新在獨立審核分支，正式 Cloudflare 發布仍待上傳。見 [Logo 更新審核](HOME_LOGO_REVIEW_2026-10-08.md)。

- 物理學習頁課數從實際內容讀取；八個原表格活動補上本專案繪製的 SVG，數值讀數統一三位有效數字。修正源電荷固定約束、運動圖等距刻度、導覽間距和專題新分頁行為。手機表格已調整，仍待真實瀏覽器與 Safari 驗收。

- 2026-10-29 更新：11 個數學學科和 2 個物理基礎課；診斷題庫 60 道現行題、236 個答案分量，賽局理論 15 題另計；20 個 field projects，另有數論 10 個、賽局理論 2 個加 1 個決策案例、解析幾何 2 個專題；Intuition Lab 13 個活動。賽局理論已恢復，經濟學不提供活動。
- Science 現拆成 Physics 1 Foundations 與 Physics 2 Foundations。分別有 6/7 個學習單元、24/28 個活動、18/21 個學習題，各有 6 道多分量檢查和 2 道專題。（10-08 時為八個數學學科加兩個物理基礎課，共 52 道診斷、20 個專題；目前數字見上一條。）不宣稱完整進階課、實驗課程或考試準備。
- 兩個物理基礎課分別關聯目前 Physics 1/2 的部分主題；Physics 2 包含熱學、電磁學、光學、波和光子。公開入口暫用中性名稱；AP 相關產品表述需要另行完成商標樣稿程序。原四單元 Physics、舊題和紀錄保留供歷史讀取，不自動遷入新科目。
- 新物理活動從單變數比較推進到反例、約束和模型邊界，均分開呈現預測、比較、解釋。新題採用本專案編寫的虛構情境；獨立複算與自動流程驗證已加入，仍需教師審題、學生試做和實體裝置體驗。分課版本及第三輪整改（PR #16）已按使用者要求合併，網域正式發布另行核對。
- 本機儲存，帳戶及雲端同步暫停；備份、還原預檢查、刪除紀錄、公用裝置提醒。
- 數值按分量檢查；精確數和分數可直接填寫，非整數最終小數須正確捨入，數學題並至少有兩位小數及兩位有效數字；Physics 1/2 新提交接受正確捨入到至少三位有效數字的結果，不要求大數保留兩位小數。很小的非零值不能四捨五入成零。支援有界科學記號及與欄位標籤一致的可選單位，不自動換算其他單位。新提交記錄精度規則版本；舊判定保留，規則導致的新舊差異單列待複核。
- 新題已修正重複題、秩的捷徑、沿用前題答案、約束邊界及最大值格式洩題；保留舊題版本供已有紀錄讀取。
- 學生解釋和開放作答不自動認定理解；簡潔公式、圖和不同合理方法交給意義複核，不按關鍵字、文法、字數或速度扣分。
- 專題不顯示未經校準的 6.5/10；該設計目標保留在內部資料，不改已有作答定義。
- 共用基礎/診斷/專題報告先展示簡短證據摘要，可單獨開啟摘要 PDF；完整報告保留問題、解釋及歷史。完整 PDF 的正文資料已補全；幾何專題 PDF 包含學生實際作圖，Markdown 可連 SVG 一起打包。
- 新報告採用短指紋；重複判斷比較實際儲存內容。共用檢查報告僅改變呈現、摘要或瀏覽事件時不新增版本；真實作答、提交或複核變化仍留版本。舊報告可手動優化簽名，不刪除歷史。紀錄頁展示本機文字佔用估計及備份提醒。已累積的快照仍佔空間，IndexedDB/備份合併尚未完成。
- 診斷三選一題的顯示位置按工作階段穩定重排，並在連續三題組中分散正確位置；學習課選項也按工作階段穩定重排，頁面值使用顯示位置；答案身份與評分不變。是非題內容中 No 的比例仍須審題，不能用換位置代替內容改造。
- 新幾何作圖儲存手輸分數座標原文；舊作圖缺失的原文不猜測恢復。Geometry C 標籤在窄圖中向三角形外偏移。表格實際溢出時增加右邊緣漸層/箭頭；真實手機和瀏覽器仍待實測。
- 完整複查文件補充審核分支：規範千分位輸入、學生摘要總體計數、LA O/U/V 頂點名、首頁不隸屬說明，以及只針對作者文案的句子/美式拼寫修正。共享課程僅瀏覽介紹頁不存空紀錄，開始學習後儲存，舊紀錄和明確確認的還原保留。學生原文與原始題目定義不替換；評估範圍說明保留在報告，答題頁改用學生能讀懂的提示。這批補充改動與已合併 PR #14 分開審核。
- 靜態發布採用檔案清單，排除內部文件、審核資料、測試資料、舊設計頁和帳戶用戶端；附帶靜態回應安全標頭。持續檢查設定隨程式碼提交，雲端執行結果需另行查看。
- 頁尾對比度提高；“Sign in to sync” 遺留文案移除；儲存庫首頁說明目前能力，教師/輔導者優先於外部 AI 提示。
- 首頁 Linear Algebra / Statistics 配圖改為矩陣特徵方向和迴歸殘差。2026-10-07 使用者審核修正版後決定替換原檔案；產生腳本同步更新，矩陣欄距、變換箭頭標註和統計刻度已校正。
- 使用者原始 162 頁 PDF 已取得、可抽取文字並渲染。Q11/P4 來源比對和權利證據仍未完成；清單沒有任何題因此自動獲得版權清除結論。

## 需要使用者審核

| 順序 | 審核內容 | 具體做法 | 通過標準 / 需要回覆 |
| --- | --- | --- | --- |
| P1 | 專題/檢查入口導覽 | 從首頁進入任意數學科目及 Physics 1/2 的兩個入口；桌面及手機查看學科選擇、活動醒目提示、Overview / My report；填寫草稿後切換學科再回來 | 控制項不擠壓、不橫向溢出；跨入口到正確科目並在新分頁開啟；原草稿可繼續 |
| P0 | macOS 輸出 PDF 後卡死 | 在基礎檢查、診斷、專題各開啟完整報告及摘要；在獨立報告頁儲存 PDF，也測試取消列印；關報告頁後回活動，捲動、點按鈕、改答案並重新整理 | 頁面正常回應，原紀錄和新草稿都在；失敗時給瀏覽器名稱/版本、科目、儲存或取消的步驟 |
| P0 | 線上介紹頁承諾 | 確認 `www.quidence.com` 介紹頁的發布儲存庫或託管專案；採用整體整改紀錄中的替換文案，圖註標成範例解法 | 實際網頁與 meta description 均不再把自動逐步檢查說成已實作；該頁面尚未由本次儲存庫合併發布 |
| P0 | 原件來源與 Q11/P4 | 標記原 PDF 的自編頁和外部摘錄；先給出 Q11/P4 開發時參考的頁、教材/試卷/網站出處及許可（如有） | 能對應到具體來源並留下審核結論；僅有原件、換數字或程式碼重寫不能替代這一步 |
| P1 | 數學推理及題目診斷價值 | 優先重做改過的參數系統/秩、複合變換反推、Calculus 最大值、Algebra I 約束專題和 Geometry 輔助線題 | 不憑題幹洩露或前題答案過關；合理的簡潔公式能供意義複核；給出容易猜中或無法區分理解的題 |
| P1 | 備份和報告優化體驗 | 先下載備份，在獨立瀏覽器資料夾還原；點 Optimize saved report copies，比較所有報告版本及原始解釋；再次匯出 | 不丟版本、時間戳、圖或原文；遇到衝突明確停下、不覆蓋另一份紀錄 |
| P1 | 手機/iPad 圖表與作圖 | 375px 左右寬度查看 Statistics 的 B attempts 欄，橫向滑動；實體裝置放點、輸入分數、連線、復原及列印圖 | 表格溢出時右側有提示，滑到底提示消失；觸控不誤操作，圖和標籤清楚；新分數座標原文在重新整理、報告及備份後保留 |
| P1 | 摘要是否有用 | 對比學生摘要與完整報告，核對每條摘要的具體題目和選擇規則 | 沒把解釋未審說成不會；沒有把相符分量說成掌握；學生能據此開始下一次討論 |
| 產品決定 | 第一批使用者 | 選擇“你自己的小範圍學生 / 自學高中生 / 學校教師”，並說明是否用於正式研究 | 用此決定後續試做、回饋模式和教師功能；目前不自動收集學生資料或開啟研究用途 |
| P1 | 兩個 Physics 基礎課的範圍與難度 | 試做 6/7 單元、各 6 道檢查和 2 道專題；按兩課設計表核對熱學、電磁、轉動、流體、光學的假設和英文負擔 | 對應部分基礎，不冒充完整課程；數值核算與 DOM 流程驗證不替代教師專業複核或實體裝置體驗 |
| P1 | Safari / Firefox 升級與容量 | 先匯出舊備份；升級後依次開啟所有舊報告，比較版本數、紀錄頁文字佔用和瀏覽器儲存 | 僅瀏覽報告不增加快照；一次真實複核或新提交產生新版本。紀錄頁估計不是實際瀏覽器剩餘容量 |

商標、Logo 仍由使用者處理。帳戶、AI 語意評分、班級彙總、研究匯出等保持暫緩。

## 下一輪順序

1. 完成 P0 實體裝置和線上文案核對；補 Q11/P4 來源證據。
2. 在專題/檢查入口 Chromium 迴歸的基礎上，繼續補完整作答、報告/摘要、備份還原及手機圖表；更新其他舊瀏覽器腳本的過時六科斷言。
3. 為持久紀錄設計 IndexedDB/可重新產生報告及遷移方案；備份合併先定義工作階段身份、草稿/提交/回饋歷史衝突規則。
4. 在確定首批使用者之後開展小範圍試做，收集範圍、授權、用途由使用者先確認。
5. 線性方程式步驟檢查做有限試點：明確解集合和定義域規則；不把等式變形的正確性當成理解認證。
6. 後續再考慮練習模式、跨科作圖及教師檢視；進一步審題處理是非題內容偏向。

不要以測試通過、來源指紋、原件可讀或本機儲存為依據聲稱全面數學診斷認證、智慧財產權清除或法律免責。

## 2026-10-12 · Restore Game Theory (AC01)

- Restored the original four English lessons, payoff-table explorer, eight fresh checks, and existing record schema from the archive.
- Added Game Theory to Further Mathematics subject choices, College Level cards, and the University Maths map, with links to discrete reasoning, linear algebra, and optimization.
- Re-enabled the existing 15-question foundation check and 6-question further check. The diagnostic and field-project inventories keep their current counts.
- Included the restored public files in the release and SEO policies. Original question definitions and archived snapshots remain unchanged.
- Added the required Cloudflare previews block.
