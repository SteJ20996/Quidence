# Calculus: kinds of integrals, and limits as numbers · 2026-11-10

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

## Lesson 1: a limit is a number, not a motion

The research below, and the owner's question about 0.999… = 1, showed a gap that predates lesson 5. Lesson 1, step 1, said "the moving point gets closer to the target without landing on it", and lesson 3 said only that more rectangles "illustrate convergence". Both are true, but the course never said that the limit itself is one exact number. Lesson 5's b slider then repeats the moving picture. Lesson 1 now says it, in three ways, without new steps or questions:

| Change | What it shows |
| --- | --- |
| Step 1 text | x never equals the target, but the limit is one fixed number, and outputs may equal it: for f(x) = 5 every output is 5. |
| New example: x·sin(1/x) near 0 | The function is undefined at 0, stays between y = x and y = −x, and equals its limit 0 infinitely often near 0. A limit can be reached, and the approach need not be from one side. |
| Error band (optional, in every example) | The learner narrows a band around the limit, from ±1 to ±0.001. For the hole and the wiggle, a window of the same width around the target keeps every output inside, since \|f(x) − 2\| = \|x − 1\| and \|x·sin(1/x)\| ≤ \|x\|. At the jump no window works: −1 and 1 cannot both fit in a band of ±1 or narrower, wherever it is centred. Step 4 states this test in words as the idea behind the ε–δ definition. |
| New example: 0.9, 0.99, 0.999, … | One graph shows the terms below y = 1; a second plots log₁₀ of the gap, −n, against the band's line. The readout gives the first n inside the band (4 for ±0.001). Step 4 argues 0.999… = 1 with the same test: the notation names the limit, the gap after n nines is 10⁻ⁿ, and no positive gap survives every band. |
| Lessons 3 and 5 | One sentence each: no finite n or b gives the exact value, and the integral is the limit itself, just as 0.999… is exactly 1. |

Three alternatives were considered and not used:
- **The algebraic "proofs"** (1/3 = 0.333… times 3; x = 0.999…, 10x − x = 9). They assume that infinite decimals can be multiplied and subtracted digit by digit, which already treats 0.999… as a number, the point in question.
- **"1 − 0.999… = 0.000… with no last 1, so it is 0."** This is the step where a learner who believes in infinitesimals answers that 0.000…1 exists. The band test does not depend on writing out the difference.
- **A shooting-game metaphor** ("I claim the target is 4; name the error and I will hit it"). It reverses the roles in the definition and does not suit the site. "Error band" and "window" carry the same idea.

Saved work: lesson 1's lab gains three settings (`showBand`, `band`, `digits`). A record saved with the four-lesson version keeps its lesson-1 settings and gains the defaults; `modules/ad01/tests/session.test.cjs` checks this. The questions p1, c1 and c2 are unchanged.

Checks:
- `modules/ad01/tests/math.test.cjs` checks \|x·sin(1/x)\| ≤ \|x\| and the first 200 zeros on each side. It samples 4,000 points in each window to confirm that every output lies inside the band. For the jump, it confirms that no centre from −1.5 to 1.5 holds both −1 and 1. It also checks the band boundaries (±0.001 needs 4 nines, ±0.0011 needs 3) and each 1 − 10⁻ⁿ against the written decimal.
- `modules/ad01/tests/flow.test.cjs` drives the new examples, the band and its accessible value, and the animation of n through the real handlers. It checks that the animation keeps a whole number of nines.

### Second independent review

A separate reviewer read the lesson 1 diff and re-derived the mathematics. It confirmed that a window as wide as the band works for the hole and the wiggle, that no centre works at the jump when inside means strictly inside, and that the band boundary for the nines is right at all 61 slider values. It found:

| Finding | Change |
| --- | --- |
| The hole's readout said "every x within … of 1", but the window contains x = 1, whose filled dot at 4 lies outside the band. | The readouts and descriptions say "every x ≠ 1" (and "x ≠ 0" for the wiggle), and the hole's description notes that f(1) is not part of the test. |
| Whether a point on the band's edge counts was never said. The jump claim at ε = 1, and "4 nines for ±0.001" (0.999 is exactly 0.001 from 1), both depend on it. | Step 4 says "strictly inside", the lab note says the edge does not count, and the try question asks how many nines make the gap smaller than 0.001. |
| "The gap fits inside any band" confused a length with a region, and "no positive gap survives every band, so 0.999… = 1" compressed two steps and used the Archimedean property silently. | Step 4 now says the gap drops below any band's half-width, so the list passes the test for 1, and that 0.999… is not a term but the limit. The nines note adds that an infinitely small positive gap is a natural picture, but the real numbers used in calculus contain no such number. |
| Step 1 still opened with a motion definition, which step 4 then contradicted; "the outputs may even equal it" could be read as f(target). | Step 1 opens with "the value that f(x) stays close to whenever x is close to, but not equal to, a target", says "outputs at nearby x ≠ target", and names the wiggle's zeros 1/(kπ). |
| Step 4 had grown from 41 to 148 words. A fifth step is not possible, because saved sessions require exactly four. | Step 4 is shorter; the jump sentence moved to step 3. |
| The checkbox said "around the limit", but the jump has none; narrow bands and windows were drawn about 1 unit wide and vanished under other lines; the band slider showed its logarithm; teal points in the nines graph were not in the legend; the nines description read oddly at n = 1. | The checkbox says "Show an error band", and the jump's band is called a trial centre. Narrow bands and windows are drawn at least 5 units wide. The slider shows ±0.316 and so on. The legend adds "Terms inside the band". The descriptions were rewritten. |
| A record saved by the unpushed lesson 5 commit (version 0.2, without the new lesson 1 settings) would be rejected. | Only version 0.1 has been published, and both Calculus commits ship together, so no such record exists outside local testing. |

### What the research says about this choice

- **The belief is common, and it is about process.** Tall and Schwarzenberger (*Mathematics Teaching* 82, 1978) asked first-year university mathematics students whether 0.999… equals 1; most said it is less, often citing an "infinitely small" gap. The authors read this as students rationalising conflicts with their earlier experience of limiting processes. This is the same dynamic model that Williams (1991) found hard to change, so 0.999…, Riemann sums and improper integrals are treated here as one idea, not three.
- **Error size is a productive metaphor.** Oehrtman (*Journal for Research in Mathematics Education* 40(4), 2009, 396–426) catalogued the metaphors introductory calculus students use for limits. Secondary accounts report that approximation, coded only when students attached a size to the error, was not the most common metaphor but was the most effective. Swinyard and Larsen (*JRME* 43(4), 2012, 465–493) found that students reinventing the formal definition had to move away from attending first to the input variable. The band begins with the output, which is why the learner sets the band and the page answers with the window.
- **Intuitions about infinitesimals are not simply errors.** Ely (*JRME* 41(2), 2010, 117–146) describes one undergraduate whose infinitesimal conceptions were coherent and resembled Leibniz's and Robinson's nonstandard analysis. The lesson therefore says what holds "in the real numbers that calculus uses", rather than calling the intuition wrong. This rests on a single case.
- **Teaching 0.999… = 1 takes more than a sentence.** Weller, Arnon and Dubinsky (*Canadian Journal of Science, Mathematics and Technology Education* 9, 2009; 11, 2011) gave 77 preservice teachers a designed unit on repeating decimals and compared them with 127 who had ordinary instruction, then interviewed 47 of them four months later. The unit lasted several sessions, the participants were future teachers, and the outcome figures could not be read here. A few sentences and a slider in lesson 1 are a much smaller intervention.

The gap that matters most: no study found here tests whether meeting 0.999… = 1 inside a limits lesson changes how students read later limits, such as Riemann sums or improper integrals. The connection is plausible, and the lesson is built on it, but it is untested. As in lesson 5, only abstracts and secondary summaries were read.

## Not done

- No students have tried lesson 5 or the new lesson 1 material, and no teacher outside the project has read them.
- Saved reports and the Markdown export show the infinite upper limit as plain text, `∫₁^∞`, since neither renders superscripts.
- Multivariable integrals are left for a later course.
