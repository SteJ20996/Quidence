# Homepage scope and graphics review

Reviewed 2026-10-06 against merged main `c6999a2`.

## Homepage scope

The homepage now has three groups and eleven independent course links. The duplicate filter panel remains removed. Students can pick a course, optionally describe a learning need, or start directly through the course cards.

| Group | Course links | Current scope |
| --- | --- | --- |
| School Mathematics | Pre-Algebra, Algebra I, Geometry, Algebra II | Four distinct introductory courses; each has four lessons, twelve original questions, its own session key, and separately archived reports. |
| Further Mathematics | Pre-calculus, Calculus, Statistics, Linear Algebra | Existing explorations and foundation checks. Calculus launches Visual Calculus; AP Calculus AB/BC and AP Statistics remain planned. |
| Economics & Decision-Making | Microeconomics, Macroeconomics, Game Theory | Microeconomics has four original introductory lessons. Macroeconomics links only to a clearly marked outline. Game Theory retains its existing independent activities. |

Ten course entries launch introductory activities; one launches a planned outline. These are not full school or university curricula. Original AA01 visual algebra activities and records remain accessible through the new school course pages. New course records do not relabel or overwrite AA01 session data. The learning-request entry migrates an old `aa01` subject choice to Algebra I while keeping the request text and original report title.

The course registry is `assets/course-catalog.js`. Generated pages and the homepage can be rebuilt with `node scripts/build-course-pages.cjs` and `node scripts/build-course-home.cjs`. Detailed content scope and remaining gaps are in `COURSE_EXPANSION_REVIEW.md`.

## Findings and repairs

| Figure | Finding | Repair |
| --- | --- | --- |
| Calculus cover | Hand-drawn curve, point and apparent tangent disagreed; rectangles did not follow a common function. | Original sampled curve `f(x)=0.4x²+0.4`; exact `P=(2,2)`, tangent `y=1.6x−1.2`, four midpoint rectangles and shading from the same function. |
| Pre-calculus cover | Point `(30,−30)` was outside a radius-42 circle; a freehand parabola lacked a specified rule. | Equal-scale unit-circle drawing with trigonometric coordinates; sampled `y=(x−1)²`. |
| Linear algebra cover | Arrowheads were hand-positioned rather than aligned with their vectors. | Arrowheads constructed from the vector direction; equal-scale before/after coordinate planes. |
| Game theory cover | The column-player label sat beside the rows, while the top arrow was unlabeled. | Explicit `A · row` and `B · column`, retaining A-first payoff ordering. |
| Statistics cover | The last spacing was arbitrary and two orange tick marks had no explanation. | Numeric positions for ten observations; one dot per observation and labelled values. |
| School mathematics cover | Number-line solution had no numeric ticks and point annotations could cross the graph. | Labelled solution `x=3`, exact line points and separated annotations. |
| Calculus lab | Annotations were inside the clipping group; labels at extreme endpoints were truncated. | Keep data clipped, render bounded annotations separately. |
| Algebra quadratic comparison | Four-digit negative y ticks could lose their minus sign at the left edge. | Derive the left margin from formatted tick widths. |
| Matrix walkthrough | The original endpoint had two competing labels that overlapped at narrow widths. | One endpoint label; bound other labels to the figure and avoid collisions between annotations. |

## Coverage and reproducibility

`node scripts/build-hub-illustrations.cjs` regenerates the original six vector covers. `node scripts/build-course-illustrations.cjs` builds six additional covers, including the reused Algebra I equation diagram. No generated raster art or network image dependency is used.

`node scripts/audit-graphics.cjs /absolute/output/path` produces 351 static SVG fixtures and a manifest from active renderers: the original covers, new course covers and boundary states of the new interactive models; algebra number lines, inequality rays, line graphs, area operations, equation groups, cost blocks and projected prisms; linear-algebra diagnostics, six matrix presets and seven guided steps at 280/480px; all calculus question diagrams plus lab endpoints; statistics dot plots; pre-calculus function plots, unit circles, sine and growth; entry and further foundation-check diagrams at 320/520px. Quadratic comparisons include both signs and large accepted sample inputs.

Fixtures were rasterized with Sharp/librsvg and visually inspected by figure family and boundary cases. Numerical tests independently check the cover curve, tangent slope, rectangle heights, circle radius, catalogue counts, finite outputs and bounded calculus annotations. Existing matrix, volume, integral, probability and game tests check the mathematical relationships. Game payoff grids, statistics tables and matrices are semantic HTML; their values and interaction states are covered by existing engine/UI tests rather than SVG snapshots.

Archived `ab01/dist/beta01` and the standalone Sketch Lab are outside this active-product review. The shared quadratic math used in the active algebra module is included. Static SVG rendering and DOM fixtures do not reproduce Safari/Chrome text metrics, pointer events or macOS printing; native browser QA remains necessary for those behaviors. No claim is made that every continuous slider/rotation state has been manually inspected.

Validation: `node scripts/test-all.cjs`, including `tests/graphics-audit.test.cjs`.
