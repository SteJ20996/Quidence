# Quantitative Reasoning, part 1: fast estimates and quick rounds · 2026-11-17

This note records what Part 1 teaches, how each model and quick-round answer was checked, and what an independent review found and changed. The course plan and its sources are in [quantitative-plan-20261117.md](quantitative-plan-20261117.md).

## The four lessons

| # | Lesson | Model | What the learner controls |
| --- | --- | --- | --- |
| 1 | Fermi estimates | 4,000 seeded simulated estimates. Each factor's error is a multiplier between 1/spread and spread, uniform in its logarithm. Shown as a histogram of how many times too big or too small. | Number of factors (1–8), spread (1.5–5 times) |
| 2 | Mental approximations | Exact doubling time ln 2 ÷ ln(1 + r) against 72 ÷ rate and 69.3 ÷ rate | Growth rate (1–25% a year) |
| 3 | The square-root law | Exact binomial probabilities, from log-factorials, for 10 to 10,000 fair tosses, beside the bell curve | Number of tosses |
| 4 | Quick bounds | Exact 1 − (1 − p)ⁿ against the union bound n × p and 1 − e^(−np) | Chance per try (1–50%), tries (1–50) |

Each lesson has four steps and three questions, in the same form as the other courses on the shared course engine.

## How the numbers were checked

The unit tests in `tests/quantitative.test.cjs` recompute each model by a different route:
- **Fermi.** The simulated spread of the log error is compared with the exact standard deviation, log(spread) × √(n ÷ 3).
- **Square-root law.** The binomial shares are checked against a direct sum.
- **Quick bounds.** The bounds are checked by enumerating outcomes, and the inequality 1 − e^(−np) ≤ P ≤ n × p is checked at every setting.

The independent reviewer recomputed every number in the lessons in Python, using exact Irwin–Hall and binomial sums. The numbers it confirmed include:
- **Lesson 1:** 144,000 napkins; 3.3 million kg of dog food; a median error of 1.75 times with 60% of estimates within 2 times.
- **Lesson 2:** 11.9 years at 6%; 9.01 years at 8%.
- **Lesson 3:** 96.5% of results within 40–60 heads; 6.3 standard deviations.
- **Lesson 4:** 65.1% and 63.2%; 0.99³⁰⁰ = 4.9%.

All twelve answer keys were found unambiguous.

## Quick rounds

A round takes five different question templates in a seeded random order, so that lessons are interleaved and a saved round can be rebuilt exactly. Nine templates cover the four lessons.

**Order.** The learner sees the question and, for number questions, the rule for counting as right, such as "within 10% of the exact value". They answer, rate how sure they are, and only then see the check.

**Confidence ratings.**
- Number questions offer 10, 30, 50, 70, 90 and 100%. A guess at a number is right far less than half the time.
- The two-option question offers 50% to 100%, since 50% is a pure guess.

**Scores.**
- Each round shows how many were right, the average confidence, and the Brier score.
- Calibration (whether confidence matches accuracy) is judged only on the last 20 answers across rounds.
- With fewer than 20 answers, the panel says that five answers are too few to judge.

**Storage.**
- Rounds are saved under `quidence_quick_rounds_v1` and sync like other records.
- A saved round is rebuilt from its seed on load. A record whose questions, answers or ratings do not match is rejected, and it is never repaired or overwritten.

**Tolerances.** The tests play every template over 4,000 seeds. They check that each lesson's shortcut is accepted wherever the bank asks for it:
- the rule of 72, 69.3 ÷ rate and 69 ÷ rate;
- 1 − e^(−np);
- the rounded product shown in the feedback;
- 1.96 and 2 standard deviations;
- the exact rule-of-three bound.

They also check that common wrong methods are rejected:
- 100 ÷ rate;
- n × p when n × p is above 0.3;
- one standard deviation instead of two;
- 1 ÷ n;
- a fall given as a rise.

## What the independent review found

The reviewer had not written the course. It reported 2 errors, 10 items that should be fixed and 6 minor items, and all were checked before fixing.

**Errors (both fixed).**
- **Lesson 4, step 4.** It asked for 300 tries, but the control stops at 50. It now uses 6% and 50 tries: the chance of none is 4.5%, so a chance as high as 3 ÷ 50 would rarely give zero events.
- **The "at least one" question.** It accepted answers within 3 points. But at 5 tries of 20%, the lesson's own 1 − e^(−np) is 4.0 points off the exact value. The tolerance is now 5 points.

**Should fix (all fixed).**
- **Doubling time.** The rate 24% made 69 ÷ rate miss by 10.8%. It is now 20%.
- **Price change.** The question now says to give a fall as a negative number, and an en dash is read as a minus sign.
- **Product.**
  - Rounding each factor to one figure missed the 15% tolerance in 47 of 150 cases. The tolerance is now 25%.
  - The feedback now shows the rounding to easy numbers, which is accepted in all 150 cases.
- **Confidence and the Brier score.**
  - The 50% floor forced overconfidence on number questions.
  - A verdict from five answers was mostly noise: a perfectly calibrated learner at 80% gets 4 of 5 right only 41% of the time.
  - Both are changed as described above.
- **Lesson 3.**
  - "6 heads happens about 1 time in 5" did not match the lab, which shows 6 *or more*: 37.7%.
  - The poll example now says that a margin of error is about 2 standard deviations and counts only sampling luck.
  - "Less likely than winning a lottery" was ambiguous and used gambling as the benchmark. It is now "about 1 chance in 7 billion".
- **Two step activities did not match their predictions.**
  - In Lesson 2, step 4 asked about a 10% rise and fall, but the activity was about doubling times.
  - In Lesson 1, step 4 asked about an anchor, but its settings gave a worst case of 5 times against a 100-times error.
  - Both activities now answer their own prediction.
- **Accessibility.**
  - Each check replaced the whole panel, so focus fell back to the page and the feedback might not be announced.
  - One live region outside the redrawn markup now announces each check and the round's result. Focus moves to the Next button, then to the next question.
  - The answer box is described by the question and its rule.

**Minor (all fixed).**
- **Lesson 1.**
  - "Spreads like √n" now names the logarithm of the error.
  - The Fermi note adds that errors cancel only when each factor is as likely to be too big as too small.
- **Lesson 2.** "72 is closer than 69 near 8%" became "beats 69 at every rate above about 4%". Continuous growth is now "100 ln 2 ÷ rate ≈ 69.3 ÷ rate".
- **Lesson 4.**
  - The rule of three now says "about 95% confident" and states its conditions.
  - The "at least one" feedback no longer calls n × p an overcount where it was accepted as a close bound.
- **Wording.** Small wording fixes: "1 tries", a comma splice, and the dog-food question now says one dog per household.

## Gaps that remain

- **Quick rounds can be learned by heart.** Nine templates with new numbers each time can be recognised after many rounds. The Cognitive Reflection Test lost value the same way once its items were familiar (Haigh, 2016). Parts 2 and 3 add templates. A held-out set for the understanding check is planned to test transfer.
- **Calibration needs 20 answers.** This is a judgement, not a standard. At 20 answers, a perfectly calibrated learner at 80% is still told otherwise about 16% of the time, because |gap| > 10 points. The verdict says "over your last 20 answers" so that it is read as a running estimate.
- **The cartoon appearance's hand-drawn map does not show the course.** It is a curated subset of courses. It also leaves out Integrated Science and others, and adding a node needs a new layout. The course is on the main knowledge map and on every homepage appearance.
- **Fermi errors.** The Fermi model assumes independent, unbiased errors that have a cap. The lesson says so, but the lab cannot yet show what correlated errors do. A later revision could add a "shared assumption" control.
- **Evidence for speed training.** No study we found shows that confidence-rated quick practice improves 15- to 18-year-olds' quantitative judgement. The design follows adult calibration research and classroom research on interleaving. A learner's improving scores show fluency with these question types, not general skill.
