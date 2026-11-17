# Quantitative Reasoning, part 3: decisions under uncertainty · 2026-11-17

Part 3 completes the twelve lessons planned in [quantitative-plan-20261117.md](quantitative-plan-20261117.md). It adds four lessons and six quick-round templates. Everything is in points, never money.

## The four lessons

| # | Lesson | Model | What the learner controls |
| --- | --- | --- | --- |
| 9 | Expected value and ruin | The chance of reaching 20 points before 0, from every starting amount. One line bets 1 point a round, from the ruin formula. The other uses bold play (stake what is needed, or everything you have), solved by repeated sweeps. | Chance per round (40–60%), points at the start (1–19) |
| 10 | How much to stake | Long-run growth for every share staked, with the Kelly share. After 100 rounds: the typical (median) and average results, the chance of ending below the start, and the chance of losing more than half. All are exact, from the binomial distribution. | Chance per round (51–80%), payoff (1 to 1 or 2 to 1), share staked (0–100%) |
| 11 | Waiting for patterns | Exact chances that each of two patterns first appears on each flip, the average wait from the overlap rule, and the chance of winning a race | Two patterns of two or three flips |
| 12 | Quoting a price | Expected points per trader for each half-spread, the break-even spread, and the box's value after a buy. The box is worth a uniform 0–100 points; some traders know the value. | Share of informed traders (0–60%), half-spread (0–50) |

**Saved progress.** The course content is now version 3. Records saved with Part 1 alone, or with Parts 1 and 2, gain the new lessons and keep every answer.

**Quick rounds.** Rounds saved before Part 3 are rebuilt exactly. The tests fingerprint 300 Part 1 rounds and 300 Part 2 rounds and compare them with earlier versions.

## How the numbers were checked

The tests in `tests/quantitative.test.cjs` check each model by a different route:
- **Ruin and bold play.** Gaussian elimination on the walk's equations, for the chance and for the expected number of rounds.
- **Stake sizing.**
  - The Kelly share is found by a fine numerical search.
  - The results after 100 rounds come from convolving one round at a time.
- **Patterns.**
  - The mean of each exact waiting-time distribution is computed over 600 flips.
  - Every race between patterns of the same length is checked against Conway's leading numbers.
  - The second-player rule is checked against all eight three-flip patterns.
- **Quoting.**
  - Profit and the value after a buy come from direct integration over the box's value.
  - The break-even spread is found by bisection.
  - At break-even, the selling price equals the value after a buy.

The independent reviewer recomputed every number with its own code: exact fractions, linear solves, enumeration and a Monte Carlo run. It found all of them correct, including:
- **Lesson 9:** 25%; 88% and 76 rounds; 12% and 45%; 1.7%, 12% and 40%.
- **Lesson 10:** a typical ×7.49 at the Kelly share; −0.0024 a round and 53.8% ending below the start at twice the Kelly share; 0.747 of the growth at half the Kelly share.
- **Lesson 11:** waits of 4, 6, 8, 10 and 14 flips; races of 1/2, 3/4 and 7/8.
- **Lesson 12:** 55.05; break-even half-spreads of 2.5, 7.7 and 16.7.

## What the independent review found

The reviewer had not written the lessons. It found no errors, and reported 5 items that should be fixed and 6 minor items. All were checked and fixed.

**Should fix**
- **Safety.** Lesson 9's step 3 and question 2 showed that one bold bet beats many small ones when the odds are against you. A teenager could read that as "bet everything".
  - Both now add that the best choice is not to play: every plan loses points on average.
  - Bold play from 10 points ends with 9 on average, and not playing keeps 10.
  - The step's title changed to "Against the odds, a long game is worse".
- **Twice the Kelly share.** Growth falls back to zero near twice the Kelly share only when the edge is small. The question now names 60%. The formula line now says "when the edge is small".
- **The value after a buy (quick round).**
  - The lesson only stated 55.05. Step 3 now shows the computation in counts of traders.
  - The quick round's wording now matches the model.
  - Its numbers and tolerance were changed so that a common wrong method fails: mixing by the share of traders rather than of buyers.
- **Penney's game (quick round).** About a third of the possible pairs needed Conway's rule, which the lesson never teaches. The round now asks only races the lesson explains:
  - a pattern against the second player's reply;
  - two patterns sharing their first two letters, a tie;
  - two patterns that swap H and T, also a tie.
- **Expected value (quick round).** A tolerance of 0.5 points let "forgetting to weight the loss" pass 16 times in 60. Every exact answer has at most two decimals, so the tolerance is now 0.1.

**Minor**
- **Lesson 12.**
  - Step 2 now matches the lab: 0.8 × 5 and 0.2 × 20.25.
  - Step 1 defines the spread.
  - Step 4 now says that real traders without inside information trade for their own reasons, and that in this model they always stay.
- **Lesson 9.**
  - The note says "points in a game, not money".
  - The answer to question 3 names the goal.
  - Step 4 asks which plan gives the better chance of reaching 20, instead of which is "safer".
- **Other wording.**
  - "Tokens" replaces "counters".
  - The die activity rounds each stake to a whole token.
  - Lesson 10 names John Kelly (1956).

## Gaps that remain

- **Real stakes.** The lessons stay with points, and lesson 10 says the Kelly share is 0 when the edge is negative, as in casino games and lotteries.
  - Even so, a lesson on stake sizing could be misused.
  - The course does not discuss gambling harms. A link to age-appropriate guidance could be added if the owner wants one.
- **Kelly's assumptions.**
  - The Kelly share assumes the chance and payoff are known exactly and that the rounds repeat many times. The lesson names both, and Samuelson's (1979) objection that the fastest long-run growth is not the same as what is best for a person.
  - It does not model uncertainty about p. That uncertainty is the main practical reason for staking a fraction of the Kelly share (MacLean, Thorp & Ziemba, 2011).
- **The market model.** The model follows the logic of Glosten and Milgrom (1985), but is much simpler:
  - one trade;
  - a uniform value;
  - guessing traders who never leave.

  It shows why a spread must cover informed trading, but not how prices move over many trades.
- **Bold play.** Bold play is optimal in a game with a fixed goal that is unfavorable to the player (Dubins & Savage, 1965). The lab shows only one goal, 20 points, and one-point steps for the cautious plan.
- **Quick rounds.** There are now 22 templates. The concern from Part 1 still applies: recognising a template is easier than transferring the method. A held-out set for the understanding check is the planned test of transfer.

## Sources

- Dubins, L. E., & Savage, L. J. (1965). *How to Gamble If You Must: Inequalities for Stochastic Processes*. McGraw-Hill.
- Glosten, L. R., & Milgrom, P. R. (1985). Bid, ask and transaction prices in a specialist market with heterogeneously informed traders. *Journal of Financial Economics*, 14(1), 71–100.
- Kelly, J. L. (1956). A new interpretation of information rate. *Bell System Technical Journal*, 35(4), 917–926.
- Li, S.-Y. R. (1980). A martingale approach to the study of occurrence of sequence patterns in repeated experiments. *Annals of Probability*, 8(6), 1171–1176.
- MacLean, L. C., Thorp, E. O., & Ziemba, W. T. (Eds.). (2011). *The Kelly Capital Growth Investment Criterion*. World Scientific.
- Penney, W. (1969). Problem 95: Penney-Ante. *Journal of Recreational Mathematics*, 2, 241.
- Samuelson, P. A. (1979). Why we should not make mean log of wealth big though years to act are long. *Journal of Banking & Finance*, 3(4), 305–307.
