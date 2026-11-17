# Quantitative Reasoning, part 4: checks and an Intuition Lab activity · 2026-11-17

This note records the course's foundation check, understanding check and Intuition Lab activity. It covers their design, how their answers were checked, what an independent read changed, and what remains unverified. It completes the plan in [quantitative-plan-20261117.md](quantitative-plan-20261117.md).

## What was added

| Item | Size | Where |
| --- | --- | --- |
| Foundation check | 15 questions, 30 parts, five groups | `assets/additional-foundations.js` (`qr-f01` to `qr-f15`) |
| Understanding check | 4 problems, 16 parts, two groups | `assets/quant-challenge-bank.js` (`qr-c01` to `qr-c04`), bank `quidence-challenges-14` |
| Intuition Lab | 1 activity, "HH or HT: which comes sooner?" | `intuition/data.js`, `intuition/math.js`, `intuition/lab.js` (`patterns`) |

**Links.** The homepage card, the course page's navigation and the check menus now link to the checks. The card's "not yet available" note is gone, and its height still matches its row.

**Homepage counts.** The homepage line now counts:
- 84 diagnostic problems;
- twelve quantitative reasoning lessons with quick rounds;
- eighteen foundation tracks.

## Design choices

- **The foundation check covers what the course assumes.** Its five groups:
  - percents and ratios;
  - powers, roots and scientific notation;
  - rounding and estimating;
  - chance and counting;
  - averages and odds.

  Odds replaced a slope question. The independent read noted that no lesson uses slope, while lesson 8 uses odds.
- **The understanding check uses the course's shortcuts on new numbers.** Each problem draws on several lessons, and every value is stated:
  - `qr-c01`: Fermi bounds and the geometric mean, a Fermi product, and the rule of 72.
  - `qr-c02`: the square-root law, 2 standard deviations, and the complement rule.
  - `qr-c03`: indicators, symmetry, and Bayes in counts.
  - `qr-c04`: fair-game ruin, the Kelly share, the overlap rule, and Penney's game.
- **The Intuition Lab question is the course's signature surprise.**
  - HH and HT each need two flips with chance 1/4, yet HT takes 4 flips on average and HH takes 6.
  - The learner moves n and sees the exact chance that each pattern has appeared by flip n.
  - The explanation adds that a race between the two is still even.

## How the answers were checked

- **Foundation check.** `tests/additional-foundations.test.cjs` recomputes all 30 parts from the stated numbers. It enumerates the orders of A, B and C, and searches for the whole number below √50.
- **Understanding check.** `scripts/audit-challenges.py` recomputes the 16 parts in exact fractions:
  - **Waits:** HTHT's average wait comes from a linear solve of the waiting equations.
  - **Races:** each race in Penney's game comes from the equations on the partial-match states. TTH against THT is 2/3, HTH 1/2, TTT 2/5, and TTH is the best reply.
  - **Kelly:** the Kelly share sets the derivative of the growth rate to zero.
  - **Other parts:** matches are averaged over all 5,040 orders of seven names. The first special card is checked over every set of 4 positions among 29.
- **Intuition Lab.** `tests/intuition.test.cjs` checks the chances against every sequence of up to 14 flips. It recovers the averages 6 and 4 as sums of the chances that a pattern has not yet appeared. The transfer answer, THT = 10, comes from solving the waiting equations.

## What the independent read changed

The reviewer had not written the items. It found every answer key correct, recomputing each by a different method, and reported no errors.

The most important finding was about design: 6 of the 16 understanding-check parts copied numbers from the lessons, so they tested recall, not understanding. All six now use new numbers:

| Part | Lesson's numbers | New numbers |
| --- | --- | --- |
| Rule of 72 | 6% → 12 years | 4% → 18 years |
| Bayes | 20 in 1,000, 90%, 5% → 27% | 30 in 1,000, 90%, 10% → 27 of 124 ≈ 22% |
| Fair-game ruin | 30 of 100 | 18 of 60 → 30% |
| Kelly share | 60% → 20% | 65% → 30% |
| Overlap rule | HTH → 10 | HTHT → 4 + 16 = 20 |
| Penney's game | against HHT | against THT: TTH wins 2 times in 3 |

**Other fixes**
- **The "at least one" part.** Getting 89% needed a calculator, while the course's shortcuts give 90% or 86%. It now asks for the nearest 10 percent, and every method gives 90.
- **Calculators.** The two problems with divisions now say a calculator is fine.
- **"About how many liters".** This invited a rounded answer that would be marked wrong. It now says "using exactly that amount".
- **Corrected statements.**
  - "2 times each bound" became "2 times the low bound and half the high bound".
  - "An impossible upper bound" became "a useless one".
  - The foundation check's "not checked" list no longer claims the course builds e and logarithms, which it only uses.
- **Units.** Percent fields now show "(%)" in their labels.
- **Wording.** Clearer wording for two answer options, Penney's game defined in the prompt, and three foundation follow-up prompts reworded.
- **The intuition activity.**
  - The right option no longer gives away the numbers ("6 flips against 4").
  - Its formula now separates the two chances with a semicolon instead of "·".
  - Its transfer question, HHH, repeated a lesson question; it is now THT.
- **The understanding check's "not checked" list** now names first-step analysis and quoting a price, which these problems do not test.

## Gaps that remain

- **Coverage.** The four problems cover ten of the twelve lessons. First-step analysis and quoting a price are not tested, and the check says so.
- **Recall is still possible.** The new numbers stop a learner copying a lesson's answer, but every method appears in a lesson. The understanding check tests applying a taught shortcut, not choosing one unprompted. The quick rounds share this limit (see the Part 1 note).
- **Matching is exact.** A learner who rounds differently from the prompt is marked as not matched, though their explanation stays open for review. The prompts say how to round, but the matcher cannot judge a sensible different rounding.
- **No human review yet.** As with the other courses, explanations are kept for a person to review; nothing in these checks grades reasoning automatically.
