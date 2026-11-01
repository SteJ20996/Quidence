# Statistics lesson 5: sampling distributions · 2026-11-01

This is the fourth and last part of the Probability course plan. Statistics gets a fifth lesson, "How much does a sample mean vary?", in English and Spanish. Three pages that use probability now point to the Probability course. The parts before it were:
- the ten proof projects (`review/probability-projects-20261101.md`);
- the foundation and understanding checks (`review/probability-checks-20261101.md`);
- the Intuition Lab activity (`review/probability-intuition-20261101.md`).

The knowledge-map node already became a Probability course node in part 1.

## The lesson

The population is one spin of a right-skewed spinner. It lands on 1 to 6 with probabilities 0.40, 0.30, 0.15, 0.05, 0.05 and 0.05 (8, 6, 3, 1, 1, 1 out of 20). These values give exact, readable numbers: μ = 2.2, σ² = 1.96, σ = 1.4.

| Part | Content |
| --- | --- |
| Step 1 | A sample mean is a random quantity; its distribution over all samples is the sampling distribution. At n = 1 it is the population. |
| Step 2 | E(x̄) = μ by linearity of expectation, which needs no independence. The sample mean is unbiased. |
| Step 3 | For independent spins, Var(x̄) = σ²/n, so the standard error is σ/√n: 1.4, 0.7 and 0.35 at n = 1, 4 and 16. σ² is computed as Σ (x − μ)² P(x), the Probability course's variance. A study estimates the standard error with s/√n, as the field project "Same riders, two training routines" does. |
| Step 4 | The central limit theorem: for independent observations from a population with finite standard deviation, x̄ is close to normal when n is large. How large depends on the skew. The theorem is about means, not data: the observations keep the population's shape. |
| Predict | Means of 16 values have half the standard deviation of means of 4 values, not a quarter. |
| Check 1 | Scores with mean 70 and SD 12, samples of 36: center 70, standard error 2. The distractor 1/3 divides by n. |
| Check 2 | 200 strongly skewed waiting times: means of such samples are close to normal, but the 200 times stay skewed. |

The lab has a sample-size slider from 1 to 16, with an animation, and an optional normal curve with the same center and standard error.
- **Bars:** they show the **exact** distribution of the mean, built one spin at a time, not a simulation. Each bar's height is probability × n, so its area is proportional to probability and the curve shares its scale.
- **Markers:** a dashed line marks μ, and a bracket marks μ ± SE.
- **Readouts:** n, the center 2.2, and the standard error 1.4/√n.

## Saved sessions from the four-lesson version

The Statistics engine accepted a saved session only when its lesson count and content version matched the course. Without a change, every saved session would have opened as "needs attention", and a learner who had finished would have had to download and replace the record.

`assets/course-engine.js` now has an upgrade step for courses that append lessons. The content declares `PREVIOUS: [{version: 'ae01-beta-0.1', lessons: 4}]`. A record saved under that version, with exactly four lessons:
- **What it gains:** an empty place and default lab settings for lesson 5.
- **What stays exactly the same:** its answers, drafts, submissions and earlier history.
- **New event:** a `lessons_added` event records the change, naming the versions and the new lesson.
- **Finished sessions:** a session that was on its summary reopens at the course start, and "Resume learning" opens lesson 5, because the summary needs every lesson.

The page then says: "A new lesson was added after you started. Your earlier answers and reasons are unchanged, and so are reports you saved or exported."

The upgrade is idempotent and does not change the input object. It runs before the usual validation and never turns an invalid record into a valid one. For example, it leaves alone a record on its summary whose earlier lessons are not all finished. It refuses:
- an earlier record with a changed result;
- an unknown version;
- the wrong lesson count;
- any record that already holds an answer to lesson 5, which the earlier version could not have saved;
- a record on its summary whose four lessons are not all finished.

`tests/statistics-sampling.test.cjs` checks all of this with a finished record built by the earlier version's engine. It also checks the course page end to end.

**Not addressed:** a tab still running the earlier code, open during a deploy, can overwrite the upgraded record. No Quidence course page checks for changes from another tab, so this is unchanged from before.

## Pointers to the Probability course

- **Benford:** the "uses" line credited Statistics with expected counts. It now lists Probability for the distribution of first digits and for the expected count n × P(d), the mean of a binomial count (pr-p09). Statistics keeps relative frequencies and the chi-square statistic, which step 6 introduces.
- **Discrete Mathematics, mixed-up hats (dm-p09):** the "uses" line adds probability as a count over all n! equally likely orders. It says the Probability course continues with the expected number of fixed points ("How many cards stay in place?", pr-p06, which already points back here).
- **Game Theory, shared printer step 08:** the solution explains that expected points are an expected value and that the Probability course develops it. The Spanish of that step also gets "supón" for "supone".

## Sources and their gaps

1. **Sampling distributions are hard to learn.** delMas, Garfield and Chance (1999, *Journal of Statistics Education*) and Chance, delMas and Garfield (2004) report two persistent confusions even after simulation activities:
   - students mix up the distribution of the data with the sampling distribution of the mean;
   - they expect larger samples to make the data, rather than the means, look normal.

   Check 2 and the last sentence of step 4 target the first confusion.
   - **Gap:** this research favours simulation, so learners see many individual samples. This lesson shows the exact distribution instead. That makes it exact and reproducible, but learners do not see sample-to-sample variation directly; step 1 only says the exact distribution is what repeated sampling approaches. A simulation view would close this gap. It is not in this part.
2. **"How large is large?"** Textbooks often give n ≥ 30 as a rule.
   - **Gap:** the rule has no general basis. The distance from normality depends on the population's skew. For this spinner the skewness is about 1.28, and that of x̄ is 1.28/√n: 0.64 at n = 4 and 0.32 at n = 16, so the curve still visibly misfits at n = 16. The Berry–Esseen theorem bounds the error by a constant times E|X − μ|³/(σ³√n), which also depends on the population.
   - **What the lesson does:** it avoids a fixed n. It says more skew needs a larger n, and the chart note describes both tails: the bars fall short of the curve on the left and stay above it on the right.
3. **σ known versus estimated.** The lesson uses the population σ. The field project uses s/√n with a t multiplier.
   - **Gap:** the lesson does not teach why estimating σ calls for t instead of the normal curve. It names the project and says σ is estimated, but the t distribution remains a later topic. The course scope line still says inference procedures come later.

## Pre-release review

A separate review recomputed every number and confirmed the keys, the cross-references and the upgrade path's handling of answers. These changes followed:
- **Two defensible answers.** "A quarter of the standard deviation" was also true if read as a quarter of the population SD (σ/√16 = σ/4). Both options now say "of the means of 4 values".
- **A false chart note.** The note said the right tail is the last to match the normal curve. Exact tail probabilities beyond 3 SE at n = 16 are:
  - left tail: 0.00004;
  - right tail: 0.0042;
  - normal curve: 0.00135 each side.

  Both tails differ, so the note and step 4's activity now say so.
- **Untranslated strings.** "Standard deviation", "Sample size" and the heading "YOUR FIVE-LESSON SUMMARY" now have Spanish. The Spanish review suite had also caught the heading.
- **Upgrade path.**
  - A finished record now resumes at lesson 5 instead of lesson 4's feedback.
  - A four-lesson record holding a lesson-5 answer is refused.
  - The note cannot fail on an unknown lesson id.
- **Wording.**
  - σ² is computed before σ is used.
  - The field project is named.
  - The central limit theorem states its conditions.
  - The waiting-time dots are captioned as illustrative.
  - The chart says area is proportional to probability, and its curve is no longer cut off at x = 1.
  - The Spanish was polished in three places.
- **Page weight.** The lesson's long Spanish passages load only on the Statistics page.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 398 of 398 Node tests pass, including five new tests.
- All 17 browser suites in `checks.yml` pass. The Spanish review suite walks the five-lesson Statistics course to its summary.
- The Coordinate Geometry and Math Voice checks pass.
- The lesson was checked in English and Spanish at 1280 and 375 px, at n = 1 and n = 16, with and without the curve. There were no page errors and no horizontal scroll, and no chart element was outside its frame.
- Not checked: Safari and real devices.
