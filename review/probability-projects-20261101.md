# Probability course · part 1: ten proof projects · 2026-11-01

Probability becomes its own Further Mathematics course (`courses/probability/`), instead of the last lesson of Statistics. Part 1 adds ten bilingual proof projects of four steps each: 40 steps and 83 answer fields. Foundation and understanding checks, an Intuition Lab activity, and a Statistics lesson on sampling distributions come in later parts.

## Projects

| Project | Level | Topic |
| --- | --- | --- |
| pr-p01 De Méré's dice | High school | Equally likely outcomes, complements; why adding chances fails |
| pr-p02 The problem of points | High school | Imagined rounds; a fair share as an expected value |
| pr-p03 A positive test | High school | Natural frequencies, conditional probability, Bayes' rule, base rates |
| pr-p04 Boxes and doors | Bridge | Bertrand's boxes, Monty Hall, and the host's rule |
| pr-p05 Shared birthdays | High school | Complements, counting pairs, independence in pairs |
| pr-p06 Cards in place | Bridge | Indicators, linearity of expectation, variance, derangements |
| pr-p07 Waiting for a six | Bridge | Geometric distribution, first-step analysis, memorylessness |
| pr-p08 Collecting all the stickers | Bridge | Stages of waiting, harmonic numbers |
| pr-p09 The Galton board | Bridge | Binomial distribution, mean, variance and mode |
| pr-p10 The law of large numbers | Intro undergraduate | Markov, Chebyshev, the weak law, and how loose the bound is |

A toolkit of four proofs supports the projects: the rules of probability, conditional probability and independence, Bayes' rule, and expectation and variance.

## Answers and grading

- Numeric answers are exact fractions, checked with the shared Number Theory grader. Where a field states a number of decimal places, it also accepts a correctly rounded decimal with at least that many places.
- Very long exact values are stored as 30-place decimals so that they stay within the grader's 80-character limit. Example: P(two of 23 share a birthday).
- Written reasons are saved exactly as entered and stay pending review.
- `tests/probability.test.cjs` recomputes every answer by exact enumeration or BigInt arithmetic. It also checks that each stated number of places matches the places the grader requires, in both languages.

## Labs

- Each project has one lab. The simulations use a seeded generator, so every visit sees the same sequence, and the labs say so: "Frequencies suggest; the proofs decide."
- A lab shows counts only after the learner acts. Before release, three labs showed a step's answer on opening, and these were fixed:
  - the dice lab preselected "sum of 7";
  - the screening lab printed "100 of 10000 people are sick";
  - the sticker lab listed the expected waits 6/6 … 6/1.

## Independent content review

A separate review checked the mathematics, history, Spanish and labs. Every finding was verified before it was fixed; the two numeric claims (findings 4 and 17) were recomputed exactly. All findings were fixed:

1. **Blocker.** `pairMatch` stated 3 decimal places but required 4. The label now says 4. A new test catches any such mismatch.
2. pr-p10 asked how many tosses "guarantee" the bound, which any n ≥ 2000 does. It now asks for the smallest n for which Chebyshev's bound guarantees it.
3. pr-p03 said a positive result is "six times as convincing" in the clinic. The evidence is the same in both places (likelihood ratio 10); only the posterior changes. The text now says so.
4. pr-p01: 1 − (1 − p)ⁿ ≤ np, with equality only when n = 1 or p = 0. The gap is larger for smaller p only when np is held fixed. Checked: with n = 4 the gap is 0.149 for p = 1/6 and 0.0045 for p = 1/36.
5. pr-p05: birthday match events are independent in pairs but not all together. The proof and the follow-up now say this.
6. The toolkit now covers what the projects use:
   - weighted finite spaces, with a note on infinite ones;
   - mutual independence;
   - P(A) > 0 in Bayes' rule;
   - monotonicity of expectation;
   - the definition of variance;
   - E[XY] = E[X]E[Y] for independent variables, so variances add.
7. The pr-p07 and pr-p09 banners gave step formulas. They now pose the question instead.
8. The birthday lab drew the whole curve, crossing 1/2 near 23, before any action. It now draws the curve only up to the current group size.
9. The bets view described "the one-die bet" at any number of rolls. It now states P(at least one six) and P(at least one double six) for the chosen number of rolls.
10. The pr-p01 and pr-p08 prompts now state fair dice and independent rolls.
11. The shuffle lab's expected outlines used the Poisson limit. They now use the exact law for 8 cards, C(8, k)·D(8 − k)/8!.
12. The screening lab's second test showed rounded counts (81 and 80), which give a wrong posterior. It now shows expected counts (81 and 80.19) and states the conditional-independence assumption.
13. Spanish calques were replaced:
    - "más probable que no" became "probabilidad mayor que 1/2";
    - "apuesta pareja" became "apuesta equilibrada";
    - "Colecciona" became "Junta", to match its button.
14. History wording:
    - de Méré is described as a writer and gambler;
    - the "fair share" rule is given in modern terms;
    - Selvin's two 1975 letters to *The American Statistician* are named;
    - Bernoulli's book is noted as posthumous.
15. Simulation honesty: a caption on each simulation lab, and a corrected comment in `core.js`.
16. Answers given away by surrounding text:
    - the step title "Two dice, 36 outcomes" was renamed;
    - a forward reference to step 4 was removed;
    - a hint of 0.4995 was removed.
    - **Found during the fix:** the pr-p05 explanation label said "Explain why 253 is…" while the same step asks for 253. It now says "your answer".
17. Detail fixes:
    - the recursion's boundary conditions were added;
    - "for n ≥ 2" was added to the fixed-point claim;
    - "make it fair" became "make it favorable";
    - the pr-p10 follow-up now asks for the n beyond which the exact tail stays ≤ 0.05. The tail is not monotone: it first drops to ≤ 0.05 at n = 371, rises above it again for most n from 372 to 400, and stays ≤ 0.05 from 401 on.
18. In six choice fields, the correct option was much longer than the others. The option lengths were rebalanced; keys and values are unchanged.
19. Spanish style fixes, for example "tiempo de espera esperado", "lanzamientos de una moneda justa" and "Tablero simétrico".

## Integration

- **Site placement:**
  - the homepage card in all four appearances;
  - the knowledge-map node, now a course node;
  - the course catalog, the SEO page list, sync policy, report store and the static release.
- **Spanish:**
  - a `probability` locale bundle;
  - quantity templates;
  - the course-count line on the homepage, kept in the inline Coordinate Geometry block of `i18n.js`.
- **Checks:**
  - CI runs `test:probability:browser`, which walks all 40 steps, every lab in Spanish, exports, saving and six layouts;
  - all 16 browser suites, `npm test`, Coordinate Geometry and the Math Voice Lab pass.

## Not in this part

- Foundation and understanding checks. The card lists them as not yet available.
- An Intuition Lab activity.
- The Statistics lesson on sampling distributions.
- Repointing the Benford, Game Theory and Discrete Mathematics "uses" lines to this course.
- Continuous distributions, the central limit theorem and the strong law are out of scope.
