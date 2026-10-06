# Homepage scope and graphics review

Reviewed 2026-10-06 against merged main `c6999a2`.

## Homepage scope

Keep six subject areas, six existing exploration links, the learning-request entry, and access to saved reports. Following the latest feedback, the duplicate “Find a starting point” filter panel is temporarily removed. The homepage presents: 1. Pick your subject; 2. Tell us what you need (optional); 3. Try our problems. Learners can skip the request and start through any of the six subject cards. Order the catalogue from school mathematics to pre-calculus, calculus, statistics, linear algebra, and game theory. Course names belong inside those six cards rather than becoming twelve competing homepage cards.

| Subject area | Course routes | Current scope |
| --- | --- | --- |
| School mathematics | Pre-Algebra, Algebra I, Geometry, Algebra II | One shared sampler of selected Pre-Algebra / Algebra I foundations. Geometry and Algebra II are planned. |
| Pre-calculus | Pre-calculus | Existing four-lesson exploration, separate from calculus and linked to it. |
| Calculus | Visual calculus, AP Calculus AB, AP Calculus BC | Existing conceptual exploration. Both AP routes are planned; this is not a full AP syllabus. |
| Statistics | Statistics foundations, AP Statistics | Existing foundations exploration. AP route planned. |
| Linear algebra | Linear algebra foundations | Existing vectors and matrix transformations. |
| Game theory | Game theory foundations | Existing choices, payoffs, best responses and equilibria. |

There are twelve course-route labels, including five planned routes. Seven labels describe available material, but the two school labels share one activity: six working explorations in total. Planned routes have no active launch links. The unused filter API remains available for a later redesign; it is not loaded by the homepage. AP routes are catalogue placeholders, not a claim of current curriculum alignment.

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

`node scripts/build-hub-illustrations.cjs` regenerates all six standalone vector covers. No generated raster art or network image dependency is used.

`node scripts/audit-graphics.cjs /absolute/output/path` produces 303 static SVG fixtures and a manifest from active renderers: six covers; algebra number lines, inequality rays, line graphs, area operations, equation groups, cost blocks and projected prisms; linear-algebra diagnostics, six matrix presets and seven guided steps at 280/480px; all calculus question diagrams plus lab endpoints; statistics dot plots; pre-calculus function plots, unit circles, sine and growth; entry and further foundation-check diagrams at 320/520px. Quadratic comparisons include both signs and large accepted sample inputs.

Fixtures were rasterized with Sharp/librsvg and visually inspected by figure family and boundary cases. Numerical tests independently check the cover curve, tangent slope, rectangle heights, circle radius, catalogue counts, finite outputs and bounded calculus annotations. Existing matrix, volume, integral, probability and game tests check the mathematical relationships. Game payoff grids, statistics tables and matrices are semantic HTML; their values and interaction states are covered by existing engine/UI tests rather than SVG snapshots.

Archived `ab01/dist/beta01` and the standalone Sketch Lab are outside this active-product review. The shared quadratic math used in the active algebra module is included. Static SVG rendering and DOM fixtures do not reproduce Safari/Chrome text metrics, pointer events or macOS printing; native browser QA remains necessary for those behaviors. No claim is made that every continuous slider/rotation state has been manually inspected.

Validation: `node scripts/test-all.cjs`, including `tests/graphics-audit.test.cjs`.
