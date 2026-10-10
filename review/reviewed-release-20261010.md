# Quidence reviewed release — 2026-10-10

This release integrates the supplied `Quidence_full_site_test_2026-10-10_evidence.zip` and `Quidence_20261010_FIX_evidence.zip`, with the reproduced failures checked against the current source. Publication to Cloudflare remains a manual user action.

## Changes and independent checks

| Reported issue | Result |
| --- | --- |
| Number Theory tab B exports tab A's JSON as Markdown and loses B's unsaved proof | Current notes export as actual Markdown containing B's exact unsaved proof; the previously stored original exports separately as exact JSON/text. Conflict, unreadable record and storage-full scenarios are covered. Neither export overwrites the original. |
| Conflict later mislabeled as unreadable data | Separate conflict/unreadable messages persist through repeated edits and export. A reset still checks that the stored original has not changed again. |
| Fast Matrix Guide navigation produces invalid animation progress | Clamp both ends of the RAF interval. Thirty rapid cycles were exercised with normal motion enabled; progress remained in [0,1] without page errors. |
| Browsing Next changes selected subject and report opt-in | Browse-only Next/Back/chapter/layer/language updates do not choose a course. Explicit node/course choices and course launch remain selection actions. Original learning request text stays intact. |
| English in Spanish course steps, graph readouts, summaries and reports | Reviewed complete Mexican Spanish captions and number formats; dynamic numbers, signs and equations stay intact. Added college-level explorations and readable summary exports to the audit. Unknown authored sentences remain visible for review, never silently concealed. |
| Original explanations can coincide with a translated UI caption | Original explanations are explicitly protected in Calculus feedback and Linear Algebra submission history, as they already are in the other course views. |
| Report storage exhaustion | Old saved data stays unchanged and current report download tools remain available. No silent deletion or fixed report-count limit was introduced. |
| Marginal text contrast and nested/unnamed landmarks | Slightly darkened the affected home, Number Theory and Linear Algebra text; labeled the Number Theory navigation; removed the nested complementary role from the math activity's internal sidebar. |
| Cached assets may retain the buggy matrix code | Updated source digests on public document references, including Matrix Guide JS and Linear Algebra styles. |

## Validation

- Authored mathematics reference audits and `npm test` passed. Existing Number Theory rounding/X/choice-order regressions remain intact.
- Number Theory: 10 projects, 43 authored steps, 86 Spanish proof-step views, 10 interactive models and 12 bilingual layouts.
- Spanish course audit: 45 lessons, 180 steps, 836 control states, all course summaries/readable exports and four numeric-punctuation cases; zero missing authored captions in these tested paths.
- Localization: 92 layouts, 72 diagnostic/project tasks, 20 complete report flows; zero page errors and English residue in checked screens.
- Brand: 23 pages, both languages, 184 layouts and two offline reports; no clipped/overlapping logos or failed assets.
- Main activities: 80 pages/layout checks, 40 draft checks, completed report exports and real old-cache upgrade checks; zero page errors/failed requests.
- Knowledge map: 12 layouts, 36 map states, 200 subject changes, repeated page/language changes and archive preservation.
- Added a mandatory CI browser regression for real-motion navigation, Number Theory recovery exports, exact learning-request preservation and supported/skipped legacy Spanish reports.

## Scope and limits

The pressure test used local Chromium and a local static server, with CPU rates 1 and 4. It covered archives of 10/50 reports where browser quota allowed, histories of 10/100/250 sessions, quota exhaustion, cross-tab record preservation, 8 isolated concurrent browser environments and 500 local requests at concurrency 100. There were no page errors or lost/overwritten prior records. The raw measurements are in `performance-reviewed-release-20261010.json`.

This is not a production Cloudflare load test or a physical-phone benchmark. Browser storage is finite: the 100-report fixture exceeded the available quota, which was explicitly recorded rather than counted as a passing capacity test. A 250-session history under 4× CPU throttling still produced a 573 ms long task; moving large archives away from synchronous localStorage is a future scalability improvement. These checks do not establish unlimited traffic capacity or guarantee that every possible path is defect-free.

The three-decimal numeric confirmation screens in the supplied evidence are input-format safeguards, not evidence that correct answers were graded wrong. False rounded zero for a small nonzero force is still rejected. Written proof review stays separate from numeric matching. Question wording and mathematical reference answers were not changed in this release; source inventories remain change-detection records, not copyright clearance or human mathematical certification.
