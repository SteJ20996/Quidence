# Quantitative Reasoning: plan · 2026-11-17

The repository owner asked for a quantitative course that builds a learner's ability to think quickly in random situations. This note sets the plan that later pull requests build on. It also explains which design choices rest on research and which rest only on judgement.

## The decisions taken

The owner accepted these defaults:
- **Level.** High school to early university. It assumes fractions, percents and exponents; Probability helps.
- **Money.** No money. Bets, stakes and market prices are in points, and bet sizing (the Kelly criterion) is taught as sharing out a resource.
- **Problems.** Every problem is original. Interview books in this genre, such as Zhou's *A Practical Guide to Quantitative Finance Interviews* (2008) and Mosteller's *Fifty Challenging Problems in Probability* (1965), are protected by copyright and were not copied. Classic public puzzles, such as the Monty Hall problem and the coupon collector, may be used, but only in new wording and with new numbers.

## The shape of the course

There are twelve lessons in three parts. Each lesson teaches one shortcut that can be used again. It uses the site's usual pattern: predict, test with a model, explain, then three questions. A model checks each intuition on the spot, by exact calculation or by a seeded simulation.

| Part | Lessons |
| --- | --- |
| **1 · Fast estimates** (open since 2026-11-17) | Fermi estimates; mental approximations (doubling times, 2¹⁰ ≈ 10³, percent changes); the square-root law and 68–95–99.7; quick bounds (complement, union bound, rule of three) |
| **2 · Probability shortcuts** (open since 2026-11-17) | Indicator variables and linearity of expectation; symmetry; first-step analysis; Bayes' rule with natural frequencies |
| **3 · Decisions under uncertainty** (third pull request) | Expected value, risk and ruin; bet sizing as resource allocation (Kelly); waiting times and patterns (why HH takes longer to appear than HT); quoting a price and adverse selection |

The course page also has **quick rounds**:
- each round has five short questions mixed across the open lessons;
- the learner answers, says how sure they are, and only then sees the check;
- the round reports accuracy, average confidence and a Brier score.

The fourth pull request adds a foundation check, an understanding check and an Intuition Lab activity. Until then the homepage card lists them as not yet available.

## What the research supports, and where it is thin

### Fermi estimates

Fermi problems are an established entry to mathematical modelling in school:
- Ärlebäck (2009) used realistic Fermi problems with upper-secondary students. He reported that their work on them involved every stage of the modelling cycle.
- Albarracín and Gorgorió (2014) studied how secondary students plan solutions to Fermi problems involving large numbers, and described the plans they made.

So lesson 1 teaches breaking a quantity into factors first. It then asks why the product is usually closer than its parts.

The textbook reason (Weinstein & Adam, 2008; Mahajan, 2010) is that independent errors in the factors partly cancel. That holds only if the errors are independent. One wrong assumption used in two factors adds its error twice. The lesson's model makes the independence assumption explicit, and its note names the failure case. The school studies above measure whether students *can* plan an estimate, not whether estimates *improve* with practice. For a course whose aim is speed, that gap matters.

### Calibration and the Brier score

The Brier score (Brier, 1950) is the mean squared difference between a stated probability and what happened. It rewards honest confidence.

The calibration literature consistently finds overconfidence on hard questions and underconfidence on easy ones (Lichtenstein, Fischhoff & Phillips, 1982). Interval estimates are especially poor: in Alpert and Raiffa's (1982) studies, intervals meant to miss only 2% of the time missed far more often.

Feedback does help. In the Good Judgment Project, a short training module in probabilistic reasoning improved forecasters' accuracy (Mellers et al., 2014). That is the case for asking for confidence *before* the check.

The evidence has two limits for this course:
- **Who was studied.** The participants were adults: university students in laboratory tasks, and self-selected forecasters. We found no study of calibration training with 15- to 18-year-olds.
- **How much evidence a round gives.** A Brier score from five questions is very noisy. A perfectly calibrated learner who says 80% gets 4 of 5 right only 41% of the time. So each round reports its score, but the calibration verdict waits for the last 20 answers across rounds. Even then, one learner in six who is perfectly calibrated is told otherwise.

### Speed

"Quick thinking" is the owner's goal, but the research gives two warnings about speed:
- **Fast first answers can be wrong.** The Cognitive Reflection Test (Frederick, 2005) shows that a fast intuitive answer is often confidently wrong. So the course teaches *fast moves that are then checked*, not fast answers alone.
- **Time pressure and anxiety.** Math anxiety takes up working memory (Ashcraft, 2002), and timed tests are often named as a cause. Boaler (2014) puts that in her title. The evidence she gathers, though, is mostly correlational and anecdotal: it does not show that a timer *itself* causes anxiety.

For both reasons the timer is off by default and only counts up. No score depends on time. This is a cautious default, not a research finding.

### Mixed practice

Quick rounds interleave questions from different lessons. Interleaved mathematics practice has been tested in a laboratory (Rohrer & Taylor, 2007) and in a randomized classroom study with seventh graders (Rohrer, Dedrick & Stershic, 2015). In both, mixed practice did better on delayed tests than practising one type at a time. Its benefit is attributed to having to *choose* a method, which matches what quick thinking needs. Retrieval practice adds a smaller, separate benefit (Roediger & Karpicke, 2006).

One risk from the same literature remains. The Cognitive Reflection Test lost much of its value once people had seen its items (Haigh, 2016; Stieger & Reips, 2016). Quick rounds draw from nine question templates with new numbers each time. After many rounds, a learner may recognise templates rather than think. Parts 2 and 3 add templates. A held-out set of templates for the understanding check would test transfer. Until then, good quick-round scores show fluency with these question types, not general quantitative skill.

### Shortcuts in later parts

- **Bayes with natural frequencies.** Gigerenzer and Hoffrage (1995) showed that counts ("10 in 1,000") make Bayes problems easier than probabilities. A meta-analysis (McDowell & Jacobs, 2017) finds that the improvement is real but that most people still answer wrongly even with counts. Lesson 8 will use counts *and* check them with a model, rather than promise that counts make Bayes easy.
- **The rule of three** (Hanley & Lippman-Hand, 1983). It is taught in Part 1 with its conditions: independent tries, the same chance on every try, and a 95% one-sided bound.
- **Waiting times and patterns.** These are in Part 3: Penney (1969) for the game, and Li (1980) for the waiting times.
- **Kelly.** Kelly (1956) maximizes long-run growth, but the path is volatile. Samuelson (1979) argued that maximizing growth is not the same as maximizing what a person wants. Part 3 will show both, and fractional Kelly as a common compromise.
- **Adverse selection.** Glosten and Milgrom (1985) explain why a quoted price must allow for the chance that the other side knows more. This is taught with points.

## Sources

- Albarracín, L., & Gorgorió, N. (2014). Devising a plan to solve Fermi problems involving large numbers. *Educational Studies in Mathematics*, 86(1), 79–96.
- Alpert, M., & Raiffa, H. (1982). A progress report on the training of probability assessors. In D. Kahneman, P. Slovic & A. Tversky (Eds.), *Judgment under Uncertainty* (pp. 294–305). Cambridge University Press.
- Ärlebäck, J. B. (2009). On the use of realistic Fermi problems for introducing mathematical modelling in school. *The Mathematics Enthusiast*, 6(3), 331–364.
- Ashcraft, M. H. (2002). Math anxiety: Personal, educational, and cognitive consequences. *Current Directions in Psychological Science*, 11(5), 181–185.
- Boaler, J. (2014). Research suggests that timed tests cause math anxiety. *Teaching Children Mathematics*, 20(8), 469–474.
- Brier, G. W. (1950). Verification of forecasts expressed in terms of probability. *Monthly Weather Review*, 78(1), 1–3.
- Frederick, S. (2005). Cognitive reflection and decision making. *Journal of Economic Perspectives*, 19(4), 25–42.
- Gigerenzer, G., & Hoffrage, U. (1995). How to improve Bayesian reasoning without instruction: Frequency formats. *Psychological Review*, 102(4), 684–704.
- Glosten, L. R., & Milgrom, P. R. (1985). Bid, ask and transaction prices in a specialist market with heterogeneously informed traders. *Journal of Financial Economics*, 14(1), 71–100.
- Haigh, M. (2016). Has the standard Cognitive Reflection Test become a victim of its own success? *Advances in Cognitive Psychology*, 12(3), 145–149.
- Hanley, J. A., & Lippman-Hand, A. (1983). If nothing goes wrong, is everything all right? Interpreting zero numerators. *JAMA*, 249(13), 1743–1745.
- Kelly, J. L. (1956). A new interpretation of information rate. *Bell System Technical Journal*, 35(4), 917–926.
- Li, S.-Y. R. (1980). A martingale approach to the study of occurrence of sequence patterns in repeated experiments. *Annals of Probability*, 8(6), 1171–1176.
- Lichtenstein, S., Fischhoff, B., & Phillips, L. D. (1982). Calibration of probabilities: The state of the art to 1980. In *Judgment under Uncertainty* (pp. 306–334).
- Mahajan, S. (2010). *Street-Fighting Mathematics*. MIT Press.
- McDowell, M., & Jacobs, P. (2017). Meta-analysis of the effect of natural frequencies on Bayesian reasoning. *Psychological Bulletin*, 143(12), 1273–1312.
- Mellers, B., et al. (2014). Psychological strategies for winning a geopolitical forecasting tournament. *Psychological Science*, 25(5), 1106–1115.
- Penney, W. (1969). Problem 95: Penney-Ante. *Journal of Recreational Mathematics*, 2, 241.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3), 249–255.
- Rohrer, D., Dedrick, R. F., & Stershic, S. (2015). Interleaved practice improves mathematics learning. *Journal of Educational Psychology*, 107(3), 900–908.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481–498.
- Samuelson, P. A. (1979). Why we should not make mean log of wealth big though years to act are long. *Journal of Banking & Finance*, 3(4), 305–307.
- Stieger, S., & Reips, U.-D. (2016). A limitation of the Cognitive Reflection Test: Familiarity. *PeerJ*, 4, e2395.
- Weinstein, L., & Adam, J. A. (2008). *Guesstimation*. Princeton University Press.
