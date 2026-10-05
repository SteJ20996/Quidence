# Student-feedback revision · 2026-10-05

This revision follows the approved order: progress/print stability, question variety and extra-check load, report/Markdown handoff, then the homepage learning request. The supplied 21-page student report was inspected; its actual session, personal IDs and full PDF are not committed.

## Progress and printing

AA01 Beta 0.6 saves exact unfinished input, signs, multiline explanations, submitted history, support, activity time and reviewer state in the current browser. Refresh resumes the same session; time away is excluded. A corrupt record is preserved and can be downloaded before starting over. Storage failures remain visible.

All active module report workflows use a separate printable document with an explicit Print / save PDF button. Opening the report no longer automatically invokes the native print dialog on the original activity page. AA01 saves before opening the preview. The original window is detached from the print preview, and a blocked popup has an HTML-download fallback.

The reported macOS freeze after PDF output could not be reproduced here. This change reduces coupling to the live activity page and provides recovery; it does not establish the native-browser root cause. Retest on the affected Mac: export/save a PDF, return to the activity page, scroll/use buttons, then refresh and confirm the draft/history survives. Also test cancelling the print dialog. Record Safari/Chrome version if freezing persists.

## Questions and feedback

| Area | Current behavior |
| --- | --- |
| Q5 / Q6 overlap | Q5 keeps distribution; Q6 uses x²=2x and a counterexample at x=3 |
| P2 writing | “Can you briefly show your work here?” accepts equivalent expansion methods |
| P3 variety | Height 5, removed width 3, area at x=7; rewrite 5x−15 and area 20 |
| Primary work | Q1–Q11 and P1–P4 are primary entries; P4 records readiness without penalizing “not yet studied” |
| Extra checks | At most three across both selection systems; clean work gets no forced extra unless stretch practice is requested |
| Budget ambiguity | The next-player field explicitly asks for the total cost; a fee increase of 3/5 is distinguished from totals 93/91 |
| Explanation uncertainty | Unknown text remains reviewable, separate from objective errors; selecting an example is not independent proof |

Thirteen valid explanations from the supplied feedback now receive provisional core-reason credit. They include an origin comparison for proportionality, a negative-slope calculation, fixed-fee descriptions, equal-price and threshold statements, sequential expansion, distribution, a budget boundary and four adaptive variants. Regression fixtures keep only the student-authored mathematical explanations.

FG's `(7−1)/(2−0)=3.5` is now flagged as a calculation error with value 3; it cannot receive full explanation credit merely because the conclusion names the steeper line. A bounded parser checks arithmetic and polynomial identities without executing input. This is still a rule-based suggestion with human review, not a validated general language grader or ability score.

## Reports and learning requests

AA01's compact print document includes the actual prompt, original student work, specific feedback and available review/history. Print text is 10.5pt. Questions are blue, work uses a separate block, and feedback is green. A complete sample with 19 primary nodes and P4 recorded as not yet studied was rendered separately for visual inspection; pagination depends on content and browser.

Shared report controls support Markdown copy, PDF preview and opening ChatGPT/Claude. Students paste the copied content manually. A clipboard failure exposes selectable text. Markdown carries question/work/history; legacy reports also retain their JSON rather than dropping unfamiliar fields.

The homepage has subjects on the left and a learning-goal/homework text area on the right. Both existing filters apply to subjects; a selected subject can open its course/check, copy a learning request, or include one of its saved reports. No AI request is automatically sent. Learning-goal text is saved locally and retained when switching subjects.

## Verification and limits

`node scripts/test-all.cjs` passed across AA01, AB01, AC01, AD01, foundations, AE01/AF01 and shared handoff controls. This covers objective mathematics, thirteen feedback transcriptions, arithmetic-error feedback, bounded extra checks, raw draft recovery, immutable events, corruption preservation, report actions and homepage copy/filter callbacks. P3 geometry checks also verify dimensions and displayed/accessibility width labels.

Print HTML was rendered to PDF and page images and inspected for legibility, clipping and short-item page breaks. Native macOS printing, Safari/Chrome layout, touch and full browser interaction remain unverified because a browser runtime was unavailable. These checks do not establish diagnostic validity or learning gains.

Full simultaneous-equation and quadratic-equation curricula are still future content decisions; this revision does not expand the existing readiness activity into those courses. Publishing this GitHub change does not deploy the earlier private Site or enable GitHub Pages.
