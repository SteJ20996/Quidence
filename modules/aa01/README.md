# Quidence · Math Discovery Beta 0.6

Current development is in the GitHub subject hub. The interface originated in Beta_Style02; its archive and earlier releases remain historical sources.

## Beta 0.6 · Student-feedback revision

Local autosave restores unfinished numeric text, signs, explanations, views, submitted attempts, helper snapshots, active time and report/reviewer state. Unreadable progress is kept unchanged for recovery. Browser storage is not cloud synchronization.

Q6 now tests a counterexample to x² = 2x instead of repeating Q5 distribution. P2 asks “Can you briefly show your work here?” P3 uses a height-5 rectangle with a width-3 strip removed: 5(x−3) = 5x−15, with area 20 at x=7. Q1–Q11 and P1–P4 are primary entries; P4 includes a readiness check-in, and “not yet studied” records exposure without treating it as an error. Extra checks are capped at three; clean work does not automatically generate stretch practice.

Explanation feedback accepts concrete equivalent arithmetic, distribution and everyday descriptions. Unknown wording stays reviewable. The report separates objective mismatches, arithmetic errors, partial reasoning and insufficient evidence, with the original question and work retained. This remains a bounded rule-based suggestion, not general semantic grading.

PDF export opens a detached compact report with its own explicit print button. It does not invoke printing automatically. Question, student-work and feedback colors differ; Markdown copy includes actual prompts, explanations and revision history. Shared handoff controls let students copy and then open ChatGPT or Claude to paste manually.

See [the feedback review](../../FEEDBACK_REVIEW_2026-10-05.md) for exact changes and remaining macOS verification. The sections below document earlier releases; their optional-P4, mandatory-extra-check and old P3 descriptions are historical.

## Experience

- Opens directly on the first activity. The default-open question list exposes Q1–Q11 individually and P1–P4 separately on desktop and mobile. Hide/show retains the current draft. Mobile jump navigation includes every individual question and project part.
- Number lines, editable table rows, expression cards, worked steps, table/graph switching, and a live inequality sketch.
- Sports Day has four views: Build (S1), Compare (S2), Explore (S3 + S6), Decide (S4). S5 is removed from this variant's journey.
- Previous model/table entries carry into the graph; students may edit them.
- Signed numbers, decimals, and fractions; negative values may be typed or selected with the sign control.
- First two activities have immediate feedback. Later submissions pause the timer and show correctness in the snapshot.
- Missing explanation, ambiguous wording, conflict, and suggested credit are separate report statuses. No general semantic grading claim.
- Decide includes explicit chosen-group and next-player cost checks. Complete correct checks can serve as an explanation without extra prose.
- Reports include local review, JSON export, detached print view, Markdown copy and restart confirmation. Local autosave restores the session after refresh.

## Source and deployment

Buildless HTML/CSS/JavaScript in `dist/`, linked from the GitHub subject hub. Publishing the repository changes does not deploy or alter the earlier private Site.
Math prompts were composed within the Quidence project. Q6 and P3 were revised following student feedback. The larger mixed-source PDF bank is not copied into this prototype.

## Limits

This is an interface experiment, not a validated diagnostic or learning-gain measure. Pattern-based explanation grading remains limited. Browser-native print dialogs and download policies depend on the user's browser. Local storage depends on the current browser and can be cleared; export records for portability.

## Verification

`node tests/workspace.cjs` exercises selections, active timers, signed inputs, drafts, views, project flow, report states, and prior explanation transcriptions. `node tests/report-actions.cjs` covers reviewer drafts, exports, print-view fallback, and restart confirmation. The original journey was replayed through 16 steps before the two geometry activities were added. These checks use a lightweight DOM harness; they are not a real browser rendering, print-dialog, or download-manager test. Native WebMCP validation is unavailable in this static preview environment; registered action paths were exercised through a mocked registry.

## bs02.4 · Mathematical visual models

Track practice shows equal-size outlines for repeated laps on one track, with equal-time blocks and selectable lap counts (1, 2, 3, 5). Every circle has the same radius; small offsets separate them for counting. They do not represent different track lengths. An optional visual clue reveals the one-lap division and repeated time groups without filling the answer fields.

The matching-expression activity follows the supplied sketch: a whole rectangle → the same rectangle partitioned into joined x and 2 pieces → the two pieces separated by a display gap. Two downward arrows connect the three stages. Sizes and colors remain consistent; no area is added or removed. The display gap is not part of the length. Its optional area explanation reveals 3x and 3 × 2, beginning with x=3: 3 × 3 + 2 × 3 = 9 + 6 = 15. A slider tests positive integer x values while preserving the fixed width-2 piece. The ordinary rectangle illustrates positive lengths; the algebraic identity remains valid for all real x. A single numerical example is not proof of equivalence.

Opening a clue preserves the draft and records its support level, time, and the number of earlier submitted attempts. Earlier attempts remain immutable. Reports distinguish answers submitted before the clue from supported practice; they do not infer a fixed visual learning style or claim measured learning gains.

The three-stage rectangle sequences before/after the clue, including x=1, x=3, and x=6, and the equivalent 2(x+3) and 4(x+2) sequences were rendered from actual SVG output and inspected. The slider uses one fixed graphical unit, so the height and constant-area piece retain the same pixel size across values. These checks do not cover full-page layout in a live browser.

The same area renderer is used for the repair task 2(x+3), and as an optional area view alongside the token-counting task 4(x+2). Answer fields, scoring, timers, and original submission history retain their existing behavior. Puzzle points (C4), the lap diagram, remain unchanged within the interface experiment.

## Product-model convention

For future geometric multiplication activities, use whole → partition in place → separate and add. The initial and partitioned objects must have identical dimensions; separated parts must preserve their dimensions and sum to the original area or volume. For products of two sums, partition both directions and display every subrectangle. For products of three positive lengths, show a solid and every resulting subsolid, and label the sum as volume rather than area. An ordinary area/volume sketch is a model for positive lengths, not a geometric depiction of negative lengths. Algebraic identities still apply outside that domain. The geometry lab now includes one three-dimensional volume item (V1) and one subtraction-area item (D1). Addition/included regions use blue; removed regions use red with hatching and explicit subtraction labels.

## bs02.5 · Geometry lab

The new Geometry lab contains V1: 8(x+3)(2x+5), with actual cuboid coordinates, orthographic 3D projection, hidden internal faces in the joined partition, and four separated cuboids of unchanged dimensions. Students drag with mouse/touch, rotate with buttons or arrow keys, zoom with buttons or +/− keys, and reset the view with Home. Whole, Partition, and Separate & add stages share view settings. An x slider previews positive values 1–5. The answer asks for polynomial coefficients and volume specifically at x=2, independently of the preview.

D1: 3(x−2) follows whole rectangle → mark a width-2 strip → remove it. The kept part is blue; the excluded strip is red and hatched, with no second subtraction operator between the already-kept and removed parts. The x slider is 3–9, guaranteeing positive remaining lengths. The response asks for an equivalent expression, area specifically at x=5, and the reason the removed area is 6.

New prewritten reason anchors and objective components are documented in GEOMETRY_ACTIVITIES.md. Unrecognized explanations remain reviewable. Reports can recommend checking both mixed volume products or multiplying the removed width by height. They do not infer visual learning styles, executive function, or mastery from view controls. Only final view settings and deliberate stage changes are retained; continuous pointer positions are not logged.

`node tests/geometry-lab.cjs` checks volume conservation, all four cross-products, rotation invariance, finite projections, zoom/rotation/stage and pointer callback behavior, view state versus answer state, subtraction dimensions, new rubrics, and report evidence. All four regression suites pass. SVGs were rendered and visually inspected across stages and multiple angles, and subtraction at x=3,5,9. Native browser pointer/touch dispatch and full-page responsive layout have not been verified in this static environment. This earlier revision left the original main Site unchanged; promotion is documented below.

## bs02.6 · Local dimension labels

Whole-prism dimensions use silhouette edges, short perpendicular end lines, and a parallel dimension line. Labels follow their edges and remain upright within ±90 degrees. Placement selects outside edges and avoids overlapping labels where space permits. Exactly end-on dimensions have no visible projected edge and are omitted from the drawing; complete lengths remain in its accessible description. Rotation, zoom, activity answers and grading retain their behavior. This revision is also promoted to the main Beta 0.4 Site, preserving its previous source in Git history.

## Optional-support convention

Supplementary geometric, lap, temperature and cost-block models start closed. Graph-reading and graphical-response tasks retain their necessary stimulus. Students may request support before attempting an answer or after saving one. Opening or closing the panel does not change answers, clocks or credit. Actual answer edits invoke the existing revision behavior. Detailed lap/area explanations remain a second level of optional support.

The cost-block model uses the reference fees on a shared dollar scale: Sports Day A is 24+3n; B is 6+5n. It starts at zero, supports integer counts 0–24, and never jumps to the matching count or fills fields. Budget variants mark the stated budget. Reference fees are explicitly distinguished from student-entered rules. The same renderer supports open-gym, supplied-model and second-budget activities.

Every first opening preserves the current draft and number of prior submissions. Each submission freezes support IDs, source activity IDs and visible-panel states. Sports Day support carries across related project steps; later viewing never rewrites earlier snapshots. The report distinguishes independent submitted work, supported submissions, and an unsubmitted draft. It does not infer dependence on visuals, a fixed learning style, or necessity of support from opening a panel. A different example with support initially hidden is recommended to confirm transfer.

`node tests/optional-visuals.cjs` verifies the optional convention, exact costs/block counts, unchanged answers and saved credit, pre/post support snapshots, connected-project support and report wording.

## Active development line and reviewed adaptation

Beta_Style02 is archived at the source/version listed in VERSION_HISTORY.md. Only the main Site is updated from now on. The header, footer, exports and item snapshots identify release 0.5; the reviewed adaptive policy and unchanged question variants remain version 0.4.1.

Five checkpoints (C1, C3, C5, C8, C10) choose one reviewed next check immediately when continuing, rather than waiting for the end. Selection distinguishes missing evidence, component errors, retry/support, and a first matched result without optional help. There are 18 local variants across these checkpoints: multiple-choice, numerical, table-to-rule and short-explanation forms. The anchors remain common; the inserted checks vary in their prompt, numbers, context and response form. No remote generation or psychometric calibration is claimed.

Each decision records the source event, variant, selection reason, component errors and prior support. Already-served questions retain their task snapshot when earlier answers change. Timing and unknown explanation wording do not drive selection. Later follow-up selection includes the intermediate checks’ observed results. Support models stay optional, including new cost, area, number-line, equal-unit and coordinate-graph variants. A report section explains the selected path and preserves independent versus supported submissions.

See CONTENT_INDEX.md, ADAPTIVE_QUESTION_BANK.md and VISUAL_DESIGN_BACKLOG.md. `node tests/adaptive-routing.cjs` validates component-specific choices, all 18 variants, complete clean/supported/mixed/skipped journeys, immutable served tasks and export provenance. Five existing suites remain applicable. Diagnostic validity, learning gains and native browser layout/touch behavior have not been established by these callback tests.

## 0.4.2 · Complete, visible question inventory

The previous UI numbered six subject areas, and its mobile menu exposed only those areas. That made the full ten-question inventory easy to miss. Q1–Q10 now each have a titled, directly clickable entry. P1 is the five-part Sports Day project; P2 is the volume activity; P3 is the subtraction activity. These are thirteen primary entries, not thirteen independent psychometrically calibrated items. The seventeen response steps and optional selected checks remain intact.

The list begins open on both desktop and mobile, can be hidden without submitting work, and is restored for a new session. The mobile jump menu exposes every part, including selected checks. Question numbering remains Q1–Q10 even when adaptive checks are inserted between them. Saved/skipped part counts do not imply correctness. Student-facing text remains English. Assets have release-specific cache keys; the deployment is the main owner-private Site, not the archived BS02 Site.

`node tests/question-navigation.cjs` opens all ten real forms and all three larger activities through their visible entries, exercises every mobile destination, verifies shifted destinations after an adaptive insertion, and checks draft/timing integrity, list state and restart. The six existing regression suites still cover grading, reports, support and adaptive journeys. This is DOM/state verification; native browser rendering and touch behavior have not been verified for this release.

## Sketch Lab 0.1 · New handwritten design prototypes

This historical prototype opened from the header at `sketch-lab/`; Beta 0.5 integrates its activities below. Restore & share implements the user's box/unit model for 4x−3=9. One sign, two curves implements separate positive/negative quadratic stages with component-specific next steps, a quadratic-graph readiness choice, optional graphs, distinct answer histories and a separate lab export. Main Q1–Q10/P1–P3 and main assessment scoring remain intact. See SKETCH_LAB.md for the mathematical anchors, route rules and provenance uncertainty. `node tests/sketch-lab.cjs` verifies the new math and interaction callbacks.

## Beta 0.5 · Integrated sketch activities

The header shortcut is removed. Q11 Restore & share is in the core list; P4 One sign, two curves is in the larger-activity list. The original ten questions and P1–P3 remain. Fifteen primary entries are visible: eleven core questions and four larger activities. The base queue is eighteen response steps; P4 is optional and registers its positive stage only after a quadratic-graph readiness self-report. It registers the negative stage when a submitted component-based route selects confirmation or sign contrast. Readiness does not establish mastery and declining supplies no failure evidence.

Both additions use the main signed-input widgets, active timers, optional support snapshots, immutable submission events, report, local reviewer controls and JSON export. Incorrect tries keep timing; matched objective components stop timing. Revisions clear obsolete routes and current credit while retaining earlier events. The sign pair is one dependency family with separate responses and a frozen source event for the served negative stage. Unfamiliar wording and time never select a branch. Support is optional; deliberate contrast displays are recorded as support.

Q11 follows the box model 4x−3=9 → 4x=12 → four groups of 3. Both adding 3 and subtracting −3 on both sides are accepted. P4 uses y=(x−2)²+5 and y=−(x−2)²+5. Expansions, three distinct chosen inputs, opening, turning-point coordinates and extremum type are checked separately. Reason choices and short writing provide provisional central-reason evidence; selecting a supplied reason is not independent proof production.

The old standalone lab is retained as historical source, without a live header entry; the main report/export is the current workflow. BS02 remains frozen. All nine suites include integrated navigation, gate draft/timing preservation, sign-source provenance, support snapshots, stale-route revision handling and export records. SVG rendering is checked separately; native full-page layout, touch and print/download behavior remain unverified.


## 基础检查与报告副本

公共导航新增 [15 题基础检查](../../foundations/index.html?module=aa01) 和 [Saved reports](../../reports/index.html)。新检查要求每题解释，保留草稿、历次提交和审核；原课程题目和旧记录格式保持兼容。打开本模块报告时，在浏览器另存一份报告副本。保存不等于云端同步，跨设备使用请下载报告。范围与限制见 [全站基础审核](../../FOUNDATION_AUDIT.md)。
