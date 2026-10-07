# FLOW review: Linear Algebra, Calculus and Pre-calculus

This change addresses the two FLOW issue lists supplied on 7 October 2026. The uploaded answer histories are used locally for compatibility checks and are not included in the repository.

## Evidence and limits

| Subject | Diagnostic | Entry foundations | Field projects | Still outside FLOW's coverage |
| --- | --- | --- | --- | --- |
| Linear Algebra | 12 tasks, 57 fixed components | 15 tasks, 27 components | 2 projects, 26 fixed components | Further foundations, matrix learning routes, vector diagnostic, interactive matrix tools |
| Calculus | 4 tasks, 14 fixed components | 15 tasks, 16 components | 2 projects, 21 fixed components including 2 formula fields | Further foundations, introductory lessons and visual activities |
| Pre-calculus | 4 tasks, 15 fixed components | 15 tasks, 23 components | 2 projects, 15 fixed components | Further foundations, introductory lessons and visual activities |

FLOW reported correct references after separately recalculating the answers. Its environment was a local code copy in headless Chromium at 1280px, with 375px checks; it did not test the deployed website or macOS/Safari printing. The Pre-calculus project answers were seen in source before those projects were solved, so this part is mathematical verification rather than a blind trial. Written explanations remained open. Matching fixed components does not validate explanation quality or establish mastery.

## Changes

| Issue | Result | Scope |
| --- | --- | --- |
| Recurring decimals rejected without a clear precision rule | New submissions accept exact fractions or non-integer final decimal values within the error of rounding to two decimal places. Integers and fractions keep their existing exact-value checks. The page says to round only final fields. Current project instructions agree with the shared rule; more decimal places are welcome. | Entry/further foundations, diagnostics and projects using the shared engine |
| Historical results could be silently regraded | Each new submission stores its numeric policy. Earlier submissions without that marker retain the original checker and stored outcomes. Earlier decimal mismatches that fit the current rule are identified as precision reviews, without rewriting the original result or calling rounding a confirmed conceptual gap. | Shared engine and report presentation |
| Opening an entry page creates empty saved sessions | Previews are held in memory. A persistent session begins on Start/Continue or a project/question selection. Browsing another subject or preparing a new check creates no empty saved session. | Three shared activity interfaces |
| Reports use foundation-specific course names | Canonical subject titles and check type appear separately in menus, report views and new exports. Existing stored report titles are displayed canonically without editing old payloads. | Reports and shared activity menus |
| Labels cross arrows, secants or lines; vector scales differ | Vector/polygon plots use equal coordinate units. Labels choose above/below based on the direction of the line and their text anchor, with a white outline. Function plots keep their intentionally different axis scales. | Shared coordinate renderer |
| Incorrect rank shortcut produces the correct answer | The new parameter matrix has last diagonal entry k−1. At k=1 it has rank 2 but only one nonzero diagonal entry; counting the diagonal now fails. | New Linear Algebra diagnostic version |
| Inverse mapping can be copied from the previous part | The new mapped target is (−4,2), with preimage (1,4), different from the previously calculated image of w. | New Linear Algebra project version |
| Mapped triangle shown before area calculation | The question shows only the original triangle; its image is retained as a reference diagram in the completed report. | New Linear Algebra diagnostic version |
| Exponential maximum format reveals its location | Students give the maximum's numerical value instead of a coefficient multiplying the supplied e^(−2). The derivative and endpoint comparison remain required reasoning. | New Calculus diagnostic version |
| Pre-calculus angle instructions contradict full-angle options | Removed the obsolete statement that the displayed angles are coefficients of π. | New Pre-calculus diagnostic version |
| Inverse-function options visibly named correct/wrong | Rendered choice attributes use neutral option indexes. They map back to the original stored identifiers, so old answers remain readable. Frontend answer banks remain inspectable; this is not an exam-security boundary. | Shared choice rendering |
| Supplied tangent slope provides weak evidence | Retained as a derivative-notation teaching check and made its limitation visible beside the prompt. It cannot establish independent differentiation; the further-foundation difference-quotient task collects different evidence. | Calculus entry foundations |
| Repeated downstream advice and ambiguous open-review counts | Repeated advice is grouped while retaining every affected component. Counts distinguish mathematical response parts from whole-answer explanations. Project wording uses two projects and removes duplicate labels. | Shared reports and project interface |
| Backup restoration stops on conflicts without enough explanation | Preview identifies missing, identical and conflicting storage groups. Any conflict blocks the complete import without writes. Instructions explain how to inspect in a separate browser profile or back up current work before replacing it. | Local-record controls |

## History and restoration

Previously served diagnostic and project definitions are retained in `challenge-bank-v1.js` and `project-bank-v1.js`. New sessions use version 2; existing sessions hydrate against the definitions they actually received. Original prompts, expected values, submitted work, feedback-exposure flags and stored outcomes remain available. Opening a report under the revised presentation may append a new report snapshot; older snapshots are retained.

The numeric rule is intended to collect mathematical evidence rather than test formatting accuracy. It does not grade intermediate calculations or written understanding. The complete present set of non-integer numeric fields was checked against the displayed two-decimal rule, with incorrect nearby values and exact-fraction/integer controls. Future questions involving tiny values or special precision requirements need a reviewed field-specific policy rather than assuming this tolerance fits every mathematical task.

Backup import does not merge conflicting portfolios. A record group may contain several checks; counts are storage groups, not student attempts or reports. Combining histories requires a separately designed conflict-resolution feature that preserves chronology and prior feedback exposure.

## Verification

- Full repository regression: 165 Node test entries pass, alongside the existing Algebra workspace checks and source-inventory consistency check. These are programmatic/DOM-fixture checks, not native browser certification.
- Diagnostic references: 40 tasks and 156 components recalculated by the separate Python verifier. Rational operations are exact; the exponential maximum uses double precision with analytic derivative signs and endpoint comparisons.
- Project references: 16 projects, 123 numeric components, 6 formula components and 2 drawing tasks checked by the separate verifier and project tests.
- Both uploaded backups restore exact raw storage strings: the first has 3 complete sessions/3 reports and 29 attempts; the expanded backup has 9 complete sessions/9 reports and 71 attempts. Inputs and stored submissions remain unchanged during hydration.
- Targeted regression covers decimals from both FLOW lists, lazy session creation, history versions, neutral option restoration, answer-revealing diagrams, repeated advice and conflict inspection.
- SVGs for the reported vector, secant and line-label issues were rendered and visually inspected at 375px and 620px. Geometry scale/label checks also cover 240px and 520px. The environment has no installed Chromium executable; no new native-browser run is claimed.

The rebuilt source ledger records changed definitions and their archived dependencies. Its entries remain not cleared for source rights and not human certified for mathematics. Tests and renamed option values do not change those review statuses.

## Next FLOW pass

1. Recheck the reported failures in these three subjects using a clean browser profile and the revised branch. Include correct two/four-decimal answers, exact fractions, nearby wrong values, negative values, missing parts and incorrect choices.
2. Cover Statistics and Geometry next, then the remaining school courses. Exercise conditional probability denominators, weighted estimates, interval endpoints, angle conventions, equal geometric units and drawing controls.
3. Run the untested further-foundation and lesson/visual routes. State the route and question count explicitly instead of claiming the whole subject is finished.
4. Use valid formulas, concise explanations, alternative methods, incorrect-but-fluent prose and ambiguous reasoning. Check that explanation review stays separate from fixed-answer matches; unresolved meaning should lead to a targeted follow-up.
5. Test restore into empty, identical and conflicting workspaces; verify cancellation, exact drafts, earlier attempts and feedback-view flags. Use synthetic records for shared screenshots.
6. Reproduce PDF export on macOS Safari and Chrome: verify scrolling, button response, progress restoration and repeated print/export after the PDF is produced. This original device-specific issue is still not verified by this change.
