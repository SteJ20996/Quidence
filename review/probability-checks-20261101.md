# Probability course · part 2: foundation and understanding checks · 2026-11-01

The Probability course gets the two checks every other course has:

- a 15-question foundation check of what the course assumes;
- a four-problem understanding check of what it teaches.

Both are in English and Spanish. The course page, homepage card and check menus link to them. The card now lists only the Intuition Lab activity as not yet available.

## Foundation check (15 questions, 30 parts)

It checks prerequisites, not course content. Each solution names the usual mistake.

| Group | Questions |
| --- | --- |
| Fractions, decimals and percents | Compare and subtract (5/8 − 7/12 = 1/24); multiply, including a cancelling chain; 3/8 as a decimal and 1.5% of 10,000 |
| Counting outcomes | A coin and a die (12); exactly two heads in three coins (3); finishing orders (24) and pairs (15); marbles drawn at random |
| Powers of fractions | (1/2)⁵ and (2/3)³; 1 − (1/2)⁴ and whether 0.9¹⁰ < 0.5; the smallest n with (1/2)ⁿ < 0.01 (7) |
| Averages | Plain means (5 and 3.5); a weighted class mean (65, not 70); the mean of squared distances (8/3) |
| Inequalities and reading events | The smallest whole n in two inequalities; the opposite of "at least one head"; soccer or basketball (25) and neither (5) |

The course's own topics stay out: conditional probability, Bayes' rule, expectation, variance, the binomial distribution and the law of large numbers. Only one question uses probability directly: drawing marbles, which is middle-school content.

The Spanish uses águila/sol for heads and tails, as the course does.

## Understanding check (4 problems, 16 parts)

Each problem uses a new setting, not one from the projects.

| Problem | Parts |
| --- | --- |
| pr-c01 At least one red | (4/5)³ = 64/125; the complement 61/125; the smallest number of spins over 1/2 is 4; why 3 × 1/5 overcounts |
| pr-c02 Which machine made it? | 120 faulty parts from A out of 10,000; P(faulty) = 4/125; P(B \| faulty) = 5/8; not independent |
| pr-c03 Expected values without the distribution | Expected winnings 2; letters in the right envelope 1; linearity needs no independence; 3 rolls until a 1 or 2 |
| pr-c04 A bound and the exact value | P(X = 3) = 5/16; Var(X) = 3/2; Chebyshev's bound 1/6 against the exact 1/32 |

## Checks made while building

- **Independent recomputation of every answer, without reading the answer keys:**
  - `tests/additional-foundations.test.cjs` recomputes the 30 foundation parts by listing outcomes, permutations and class splits, and by searching n upward;
  - `scripts/audit-challenges.py` recomputes the 16 understanding parts by listing every equally likely spin, coin and letter arrangement, building all 10,000 factory parts, and using exact derangement counts;
  - the two choice keys that cannot be computed are supported by asserting the conditions behind them. The envelope events are dependent, yet expectations still add. The mean number of reds is 3/5, larger than P(at least one red).
- **A wording bug fixed before release:** recheck messages lower-case the first letter of a skill name, which produced "Recheck bayes’ rule". The two skills now start with "Applying", so proper names keep their capitals.
- **Saved records:**
  - foundation records saved with the fourteen earlier subjects are registered as a published layout, so they still open;
  - a new test fails if that layout is removed;
  - the understanding-check bank becomes `quidence-challenges-11`, with version 10 kept in its history.
- **Test setups:** two tests built "old" records by deleting newer subjects from a fresh record. They now also delete Probability. Without that change they built a five-subject set that was never published, which the engine correctly rejects.
- **Spanish and layout:** both checks were walked question by question in Spanish at 375 and 1280 px. No text was untranslated, nothing overflowed horizontally, and there were no page errors.

## Counts

- 72 diagnostic problems (68 before).
- Foundation checks in fifteen tracks (fourteen before).
- 16 understanding-check modules and 307 checked parts in the audit.
