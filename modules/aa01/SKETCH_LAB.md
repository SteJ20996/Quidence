> Beta 0.5 integrates these prototypes as main Q11 and optional P4. The upper-right entry and separate record are superseded by the main catalog, report and export. `dist/sketch-lab/` remains historical source; `math.js` is also a shared reviewed dependency. See README.md and tests/integrated-activities.cjs.

# Sketch Lab 0.1 · Restore & share / One sign, two curves

Design discussion translated into an optional experimental route on the main private Site: `dist/sketch-lab/index.html`. The main Q1–Q10 and P1–P3 journey is unchanged. The root header opens the lab in a separate tab to retain main assessment responses; its records and timer are separate from the main assessment. Beta_Style02 remains frozen. These experiments are not yet part of a calibrated adaptive diagnosis or the main report.

## Sources and status

The user supplied two new handwritten design sketches on October 2, 2026 (America/Los_Angeles):

- IMG_CD2F2C2B-9104-4A8C-B7FD-8D89D8EC412A.jpeg: the equation box/unit restoration and grouping proposal.
- IMG_AAFCCD7E-461F-4E44-AEB9-58C37758E6E7.jpeg: positive/negative square functions and a separate quadratic-formula derivation.

The page uses original SVGs and locally composed interface text; it does not publish the scanned notes. D01 and D08 are the project-composed candidate IDs in Quidence_Beta04_Questions_Projects_Activities.md. Their earlier B01/B08 inspiration references in the mixed-source PDF remain uncertain. The new design sketches do not resolve rights in that earlier material. Preserve this distinction; no comprehensive copyright-clearance claim.

## Equation: 4x − 3 = 9

Prompt: Four boxes contain equal amounts. Taking away 3 units from their combined contents leaves 9 units. Choose an operation that cancels the −3, apply it to both sides, then find x.

Answers: add 3 to both sides (or subtract −3), obtaining 4x=12; divide both sides by 4; x=3.

Reason anchor: the same addition/subtraction on both sides preserves equality. Cancelling the left constant alone is not the whole equality reason.

Optional model begins closed:

1. Four equal box contents minus three removed units equals nine units. The red outlines denote removed units, not physically negative weights.
2. Restore the removed three; the four full boxes now equal twelve units. Do not draw four full boxes plus three extra units on the left as though that were 4x.
3. Split twelve units into four groups of three, one group per box.

The model does not fill answer fields. Its stages remain a chosen support route. The objective question specifies cancelling −3 first; it does not claim that dividing by four first is an invalid general solution method.

## Quadratic family: one activity, separate answer stages

The activity first asks whether the student has studied quadratic graphs. This selects the candidate activity; it is self-report, not evidence of mastery. It is not automatically assigned to Pre-algebra students.

| Stage | Function | Expanded coefficients | Turning point | Bound |
|---|---|---|---|---|
| Positive square | (x−2)²+5 | a=1, b=−4, c=9 | (2,5) | Minimum 5 |
| Negative square | −(x−2)²+5 | a=−1, b=4, c=1 | (2,5) | Maximum 5 |

Students expand, choose three distinct x-values and calculate their y-values, predict the opening, locate the turning point, and explain. Different x-values may have the same y-value. Arbitrary finite samples alone do not establish a global bound.

The optional graph uses the given expression, not an incorrect student expansion. Calculated points and axis scales are labelled; the two curves use the same coordinate system for comparison. Axes may have different scales. Preview input is limited to −50≤x≤50 to keep plotted values readable; the functions are defined for all real x. Blue/solid marks the positive square, red/dashed marks the negative square, with explicit text labels.

Three distinct x-values determine a degree-at-most-two polynomial when the model family is specified. This experiment plots the known function and checks student-calculated points; it does not silently connect three points with straight segments or treat the smallest sample as the global extremum.

## Branch rules

Branches use submitted objective components. Unknown explanation wording stays reviewable and does not choose a remedial route.

| Observed component | Next step |
|---|---|
| Expansion differs | Remain on the same function and recheck expansion |
| Chosen-point calculations differ | Remain on the same function and recheck substitution |
| Opening or minimum/maximum differs | Show the positive/negative comparison and work on the negative-square stage |
| Turning-point coordinates differ | Remain on the same function and locate the turning point |
| Positive-stage components match | Unlock a fresh negative-square check; no answers carry into its fields |
| Negative-stage components match | Review both submitted records and their mathematical comparison |

Every contrast/confirmation keeps a separate stage ID, source submission ID and immutable answer/support snapshot. A revision clears stale feedback and routing. Numeric partial drafts survive navigation. Viewing support after a matched answer leaves that submitted result intact; a later edited answer is a new revision.

## Central reasons and separate root concept

- Positive: (x−2)²≥0 for every real x; at x=2 it is zero. Thus y≥5 and 5 is achieved.
- Negative: −(x−2)²≤0 for every real x; at x=2 it is zero. Thus y≤5 and 5 is achieved.
- Opening is determined by the coefficient a of x², not by x² being positive or negative.
- The two curves reflect across y=5, not across the x-axis; corresponding values sum to 10.
- Completing the square gives h=−b/(2a), k=c−b²/(4a), a≠0.
- The quadratic formula finds roots (y=0), not extrema. The positive-square function has no real roots; the negative-square function has roots 2±√5.

The UI accepts a prewritten mathematical reason or a short explanation. Narrow pattern matches are provisional; conflicting or unrecognized language remains Needs review, not automatic zero. Main assessment grading has not changed.

## Evidence and verification

Timers count active work on a stage, continue after incorrect submissions, pause on matched objective components, and resume on revision. Topic changes and lab review pause active timing. First support opening freezes the draft and preceding attempt count. Earlier submission snapshots remain unchanged. The mathematical comparison in the record is revealed only after both stages have submissions, and is logged as support for later revisions.

JSON download includes drafts, immutable attempts, support openings, deliberate stage changes, component-specific route decisions, source IDs and elapsed active time. It is memory-only and separate from the main assessment's export. No continuous mouse/touch tracking.

`node tests/sketch-lab.cjs` verifies the expansions, bounds, vertices, roots, reflection, signed/fraction inputs, distinct x validation, all branch types, timers, partial drafts, separate stages, immutable support history and stale-route invalidation. SVG stages and the two-curve plot are rendered from actual output and visually inspected. Native browser layout, mobile touch and download manager behavior remain unverified; these checks do not establish diagnostic or learning-gain validity.
