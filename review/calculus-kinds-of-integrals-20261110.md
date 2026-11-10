# Calculus lesson 5: kinds of integrals · 2026-11-10

Calculus gets a fifth lesson, "One symbol, four questions." It sets the four integral symbols side by side and gives two of them their own graphs, which the learner controls. Multivariable integrals (∬, ∭, ∮) are left for a later course: they need double sums and surfaces that this course does not build.

## The lesson

| Part | Content |
| --- | --- |
| Step 1 | What is written at the ends of ∫ decides the question. ∫ₐᵇ f(x) dx is a number, the signed area (lesson 3). ∫ₐˣ f(t) dt is a function of x (lesson 4). ∫ f(x) dx is the family F(x) + C. ∫ₐ^∞ f(x) dx is defined by a limit: if ∫ₐᵇ f(x) dx has a limit as b grows without bound, the improper integral is that number; otherwise it diverges. ∞ is not a number to substitute. |
| Step 2 | x² and x² + 3 have the same derivative, because shifting a curve does not change its slopes. The converse is also stated: on an interval, two functions with the same derivative differ by a constant, so x² + C lists every antiderivative of 2x. C cancels in F(b) − F(a). |
| Step 3 | Since (−1/x)′ = 1/x², lesson 4's F(b) − F(a) gives ∫₁ᵇ 1/x² dx = 1 − 1/b. The area stays below 1 for every b, and the improper integral is the limit itself, exactly 1. |
| Step 4 | Since (ln x)′ = 1/x, the area under 1/x from 1 to b is ln b. Each tenfold step in b adds ln 10 ≈ 2.3; for any N > 0, b = eᴺ gives area N, so the integral diverges. Under 1/x² the same steps add 0.9, 0.09, 0.009, … and never pass 1. |
| Predict | Is the area of the endless region under 1/x² to the right of x = 1 finite? (Yes.) The distractors are "a region that never ends must have infinite area" and "it depends on how far the graph is drawn". |
| Check c9 | x² and x² + 5: both are antiderivatives of 2x. The distractors are "only x², because ∫ 2x dx means exactly x²" and "at most one, because different functions must have different derivatives". |
| Check c10 | Which of ∫₁^∞ 1/x³ dx and ∫₁^∞ 1/x dx is finite? (Only the first, value 1/2.) The distractors include "both, because both curves fall towards 0". |

The explorer has a card with the four symbols. The first two tiles open lessons 3 and 4, and the last two switch this lesson's graphs:
- **Family.** A slider moves C from −2 to 2. Five grey members of x² + C stay in view, with the chosen one highlighted and its tangent at x = 1. Below, f(x) = 2x does not move.
- **Endless region.** One select chooses 1/x² or 1/x. A slider moves log₁₀ b from 0 to 3 (b from 1 to 1,000). The upper graph shades the region; the lower graph plots area against log₁₀ b, with the other function's area in grey and a dashed line at 1. The slider's accessible value reads "b = 1,000", not the logarithm.

Both sliders can play as an animation, which stops at the end value and never submits an answer.

## Saved sessions from the four-lesson version

The content version becomes `ad01-beta-0.2`; the session schema is unchanged. A record saved with version 0.1, with four lessons, four labs and its events, is upgraded in memory when it is opened:
- lesson 5 is added with no steps seen, and its lab gets the default settings;
- every answer, record and event is kept as it was, and a `content_upgraded` event is added;
- a record that had reached the four-lesson summary moves to lesson 5's prediction, because the summary now needs five lessons.

`modules/ad01/tests/session.test.cjs` opens such a record and compares every earlier submission with the original.

## Independent review

A separate reviewer read the diff, recomputed every number and looked at the screenshots. It confirmed ln 10 ≈ 2.3026, ln 1000 ≈ 6.9078, 1 − 1/b, 1/2 − 1/(2b²), e⁵ ≈ 148.4 (the slider brackets it at b ≈ 141 and 158), and that each question has one defensible answer. It found these problems, all fixed:

| Finding | Change |
| --- | --- |
| Lesson 4's "continue" still assumed four lessons. With lesson 4 done and earlier lessons open, it sent the learner back instead of on to lesson 5, and the button said "Visit an unfinished lesson". The summary heading said "four-lesson". | Both now use the number of lessons. A new flow test finishes lesson 4 alone and checks that "Continue to the next lesson" opens lesson 5. |
| The review page printed `^∞` literally in three places: the prediction's explanation, the learner's chosen option and the next-step line. | These now use the same superscript rendering as the lesson text. Only authored text is rendered this way; learner explanations stay escaped. The flow test fails if `^∞` reaches the page. |
| "A limit" was offered as a fourth kind of answer beside a number, a function and a family. A convergent improper integral is a number. | The goal, step 1 and the tile now say "defined by a limit", and that the value is a number when the limit exists. |
| "Defined as the limit of 1 − 1/b" mixed the definition with the result, and "approaches 1 but never reaches it" invites the belief that a limit is never reached. | Step 3 defines the integral as the limit of ∫₁ᵇ, and says no finite b reaches 1 but the integral is the limit itself. The graph text now says the area stays below 1 and its limit is 1. |
| "Never levels off" is false for the shape of ln b, whose slope tends to 0. "No upper limit" in the readout clashes with b as the upper limit of integration. | "Its growth slows, but it has no ceiling", with N > 0. The readout says "no ceiling: ln b passes every number". |
| Lessons 1–4 never give (−1/x)′ = 1/x² or (ln x)′ = 1/x, which steps 3 and 4 rely on. | Both derivatives are stated where they are used, through lesson 4's F(b) − F(a). They are stated, not derived; ln is not taught in this course. |
| "Every antiderivative" was argued in one direction only. | Step 2 adds the converse on an interval. |
| The family graph was titled F(x) = x² + C, while step 2 and c9 use F for x² alone. | The title and readout say x² + C. |
| The 1/x² formula line could be read as "∞ = 1". | It now reads "limit of (1 − 1/b) as b → ∞, which is 1". |
| Three graph descriptions did not match the drawing: the predict graph said it stops at 8 but runs to 8.5, with a dot that looked like an endpoint; the c10 graph said "from x = 1" but drew the curves from 0.7 and 0.9, where 1/x³ is the upper one; c9's description omitted the parallel tangents. | The curves start at x = 1 with a marker, the dot is replaced by a "continues →" label, and the descriptions match. |
| c10 lacked the "both fall to 0, so both are finite" misconception, and c9's third option was weak. | Both distractors were added or replaced, as in the table above. |
| Against log₁₀ b, ln b is a straight line, which looks like steady growth rather than slow growth, and step 4's "compare" had nothing to compare with. | Step 4 and the graph text now use the tenfold steps as the argument, and the other function's area is drawn in grey. |

Two smaller points:
- **The family graph's clipping (fixed).** At C = 2 and x = ±2.2, x² + C is 6.84 against a window top of 6.5. The top is now 7.
- **Leaving the lesson resets the step (not changed).** The first two tiles open lessons 3 and 4. Coming back starts lesson 5 at step 1 again, as every lesson switch in this course does. Saving the step position would change all five lessons, so step 1's "try" line says so instead.

The reviewer also saw `modules/ad01/tests/flow.browser.cjs` fail. That test expects 6 subject links on the homepage, which now has 20; it fails on `main` too, is not part of CI, and is not changed here.

## Checks

- `modules/ad01/tests/math.test.cjs` compares 1 − 1/b and ln b with midpoint-rule integration, checks the family's common slope, and checks c10's area 1/2 − 1/(2b²).
- `modules/ad01/tests/flow.test.cjs` drives the real handlers: it clicks the symbol tiles, switches curves, moves both sliders, reads the readouts, the formula and the slider's accessible value, and checks that no graph control saves an answer. It also finishes lesson 4 alone and then lesson 5.
- `modules/ad01/tests/session.test.cjs` covers five-lesson completion and the upgrade of a four-lesson record.
- `npm test` and all 19 browser suites pass. Screenshots were checked at 1280 px (Classic) and 375 px (Geometric Studio). The homepage description was shortened after the themes suite found that the Calculus card wrapped to a fifth line at 960 px.

## What the research says, and where it stops

The lesson's pictures and distractors were chosen against known difficulties. The evidence behind each is thinner than the textbook folklore around it, so the lesson is a design choice, not a tested remedy.

- **An endless region with a finite area.** González-Martín and Camacho studied first-year mathematics students and improper integrals (PME 28, 2004; a fuller Spanish article in *Enseñanza de las Ciencias* 23(1), 2005, 81–96). From the abstracts and summaries that could be reached:
  - many students did not coordinate the algebraic and the graphic register;
  - some did not accept a graph as a valid mathematical argument;
  - some difficulties seemed to come from the concept itself, others from weak meanings of limits and other calculus ideas.

  This is why the lesson sets the shaded region beside a graph of the area against b, and asks for a prediction before any formula. But the 2004 teaching sequence involved about 25 students on one course, the work is twenty years old, and its sequence is not the one used here. It does not show that a slider changes what students believe.
- **Everyday ideas of size get in the way.** Wijeratne and Zazkis (*International Journal of Research in Undergraduate Mathematics Education* 1, 2015, 163–186) asked calculus students about Gabriel's horn, a solid with finite volume and infinite surface area. They report that real-world ideas of area and volume hindered students from resolving the paradox mathematically. The prediction's distractor "a region that never ends must have infinite area" is written for that intuition. The study concerns a three-dimensional paradox and a small group, so it supports the distractor's plausibility, not the claim that one lesson removes it.
- **A limit that is never reached.** Williams (*Journal for Research in Mathematics Education* 22(3), 1991, 219–236) followed 10 college calculus students and found mostly dynamic models of limit, in which the limit is something approached but not attained; these models were very resistant to change. This cuts against the lesson's own design. Dragging b towards 1,000 *is* a dynamic picture, and an animation that creeps towards the dashed line at 1 may strengthen the very image Williams found hard to shift. The text tries to counter it by saying plainly that the improper integral is the limit, a number, and that no finite b is meant to reach it. Whether text placed beside an animation can outweigh the animation is untested.
- **The constant of integration.** A search for empirical work on how students understand "+ C" found mostly curriculum notes and a few small studies of antiderivatives in general, such as Moru and Qhobela (*Pythagoras*, 2019) on social-science students in Lesotho. It found no study that tests a family-of-curves picture against a rule such as "always add C". The lesson's argument, that shifting a curve does not change its slopes, is standard mathematics; its effect on learners is untested.

Two further limits apply to all of these points:
- Only abstracts and secondary summaries were read. The full papers could not be fetched from this environment, so details of method and results are not checked here.
- None of these studies used an interactive graph like this one. Whether moving b to 1,000 persuades or misleads is open: a learner may read "6.9 at b = 1,000" as levelling off. Step 4's tenfold argument and the b = eᴺ sentence are there for that reason, but no learner has tried them.

## Not done

- No students have tried the lesson, and no teacher outside the project has read it.
- Saved reports and the Markdown export show the infinite upper limit as plain text, `∫₁^∞`, since neither renders superscripts.
- Multivariable integrals are left for a later course.
