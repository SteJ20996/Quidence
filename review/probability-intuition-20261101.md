# Probability Intuition Lab activity · 2026-11-01

Intuition Lab has a sixteenth activity, "More tosses. More often exactly half?", in English and Spanish. It is the third part of the Probability course. The parts before it were:
- the ten proof projects (`review/probability-projects-20261101.md`);
- the foundation and understanding checks (`review/probability-checks-20261101.md`).

With it, the Probability card has every activity the other cards have, and its "not available yet" note is gone.

## The activity

| Step | What happens |
| --- | --- |
| Predict | "Toss a fair coin n times. People often say that heads and tails even out in the long run. Is getting exactly half heads more likely with 100 tosses than with 10?" The options are more likely with 100, less likely with 100, equally likely, or not sure. The reason is not scored. |
| Explore | A slider sets n from 10 to 100 in steps of 10. The picture is the distribution of the number of heads. Each count is placed at k/n, so the distribution visibly narrows into the shaded 40%–60% band as n grows. The exactly-half bar is a different colour. The legend gives the live values of P(exactly n/2 heads) and of the shaded band; the axis title says that bar height is probability. The readouts show P(exactly n/2 heads), P(0.4 ≤ heads/n ≤ 0.6) and the expected value of \|heads − n/2\|. |
| Check | Two more tosses make 4 times as many sequences but multiply the number with exactly half heads by only 4(n + 1)/(n + 2). So P(exactly half) is multiplied by (n + 1)/(n + 2) < 1: from 0.246 at 10 tosses to about 0.08 at 100. What evens out is the proportion: P(0.4 ≤ heads/n ≤ 0.6) rises from about 0.656 to about 0.965, while the expected gap \|heads − n/2\| grows from about 1.23 to about 3.98. The transfer question asks how many of the 64 sequences of 6 tosses have exactly 3 heads (20). |
| Revisit | The learner's first reason is shown next to what the model showed, as in the other activities. |

It applies two of the course's projects to a new question instead of repeating them:
- pr-p09, the binomial distribution;
- pr-p10, the law of large numbers.

The course proves that the proportion of heads settles. This activity asks what that does *not* imply: the count does not settle, and an exact tie becomes rarer.

## Sources and their gaps

1. **The belief being tested.** Tversky and Kahneman, "Belief in the law of small numbers" (*Psychological Bulletin*, 1971), describe people expecting even short sequences to look like the population. They treat the gambler's fallacy as one result: after a run of heads, tails seems "due".
   - **Gap:** that work and most of what followed use next-outcome predictions and judgments of how random a sequence looks. They do not ask whether people expect an exact tie to become more likely with more tosses.
   - **What this means for the activity:** it does not claim that most learners hold the count version of "even out". The phrase is ambiguous between counts and proportions. The activity turns it into one precise question, and the Check step separates the two readings.
   - **Limit:** a learner may choose "more likely with 100" for reasons other than this confusion. The written reason in Predict is kept so that a teacher can see which.
2. **The mathematics.** Feller's *An Introduction to Probability Theory and Its Applications*, volume 1, chapter III, is the standard treatment of fluctuations in coin tossing:
   - returns to equilibrium (ties) become rarer, with C(2m, m)/2²ᵐ ≈ 1/√(πm);
   - long leads are typical.

   This activity uses only the exact, elementary part, the ratio (n + 1)/(n + 2). It does not state the asymptotic formula; the text says only that the gap grows "roughly like √n". The expected gap is √(n/(2π)) to first order.
3. **The fair coin is an idealization.** Diaconis, Holmes and Montgomery, "Dynamical bias in the coin toss" (*SIAM Review*, 2007), model real tosses and find a slight bias toward the side that started up, about 0.51.
   - **Effect on the activity:** the claim says "a fair coin", so its answer is exact for the model.
   - **What the activity does not settle:** how a physical coin behaves.
   - **Why the direction still holds:** for a coin with P(heads) = p and q = 1 − p, two more tosses multiply P(exactly half) by 4pq(n + 1)/(n + 2). Since pq ≤ 1/4, this is still less than 1. The activity states only the fair case.

## Choices made while building

- **Slider steps of 10.** Over every n, P(0.4 ≤ heads/n ≤ 0.6) is not monotone. It falls from 0.656 at n = 10 to 0.451 at n = 11, because the band holds fewer whole counts. On multiples of 10 it rises at every step. The test checks the values the slider can reach and records why the step matters.
- **Only even n.** P(exactly n/2 heads) needs an even number of tosses. The formula says "(n even)", and the explanation says "For even n".
- **Bar height is probability, not density.** With heights as probabilities, the exactly-half bar visibly shrinks, which is the activity's point.
  - The cost: at n = 100 each bar is short and thin, so the band holds less coloured area even though its probability is higher.
  - The legend therefore states the band's probability.
  - A density scale would show the narrowing better, but it would make the exactly-half bar taller, against the main point.

## Checking the model

`tests/intuition.test.cjs` checks the model without using its code:
- **Exact values:** for every slider value it computes C(n, k) exactly with BigInt. It compares P(exactly half), P(0.4 ≤ heads/n ≤ 0.6) and the expected gap with the model to 10⁻¹².
- **Monotone trends:** it asserts that the first falls, the second rises and the third grows at every step.
- **Expected gap identity:** E\|heads − n/2\| = (n/2) · P(exactly half), checked in whole numbers.
- **The ratio:** it checks the identity C(n + 2, n/2 + 1)(n + 2) = 4 C(n, n/2)(n + 1) for every even n up to 200.
- **The explanation's numbers:** each number the explanation states, in both languages, is checked against the model, rounded as the text rounds it.
- **The transfer answer:** it lists all 64 sequences of 6 tosses (20 with exactly 3 heads) and all 16 of 4 tosses (6 with exactly 2), the comparison the feedback makes.

`scripts/test-intuition-browser.cjs` also checks the readouts at n = 100 in both languages, the slider value, and that only the exactly-half bar and its legend key use that bar's colour.

This is a consistency check written in this project, not independent certification.

## Where it appears

- **Intuition Lab:**
  - the homepage view and the lab page list it with Further Mathematics, after Statistics, matching the course order;
  - it uses the Probability card art in each appearance, including the Paper Explorer and Learning Atlas drawings;
  - the counts now read 16 subjects, and so does the search description.
- **Homepage card:** shows "Test your intuition", and the "not available yet" note is gone.
- **Course page:** the shared Intuition Lab panel links to the activity.
- **Source ledger:** lists the activity under Probability.

## Pre-release review

A separate review recomputed every number with exact fractions and confirmed the keyed option, the ratio argument and the transfer answer. These changes followed:
- **"Inclusive".** The English explanation now says "from 40% to 60%, inclusive", as the Spanish did. At n = 10 this matters: the band with its ends has probability 0.656, and without them 0.246. The readout label is now the exact statement P(0.4 ≤ heads/n ≤ 0.6).
- **Legend.**
  - Before: the legend called the green bars "40%–60% heads". The exactly-half bar is in that band too, but in a different colour.
  - Now: the legend names the shaded band and gives its probability.
  - A red value label above the bar was removed, because red marks "breaks the rule" in another activity.
- **Matching numbers.** The explanation uses the readouts' values (0.08, 0.656, 0.965, 1.23, 3.98), not different roundings.
- **Wording.**
  - "Average gap" became "expected gap": it is an average over all sequences, not over the learner's tosses.
  - The feedback names "the probability of exactly 2 heads in 4 tosses" instead of "it".
  - The formula says "(n even)".
- **Spanish.** Percentages are written without a space ("40%"), as elsewhere on the site.

## Language

This is not a voice-recognition or AI activity. Like the other Intuition Lab activities, its content is in English and Spanish. The Spanish uses "águila" and "sol" for heads and tails, and "moneda justa", as the Probability course does. Its optional dictation button stays English-only, as the language policy requires. Learner answers and reasons are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 393 of 393 Node tests pass, including the new coin test.
- All 17 browser suites in `checks.yml` pass. The Intuition Lab suite now counts 16 activities and walks this one at 320, 768 and 1280 px in both languages. At both ends of the slider it checks for no page errors, no horizontal scroll and no picture element outside its frame.
- The Coordinate Geometry and Math Voice checks pass.
- Not checked: Safari and real devices.
