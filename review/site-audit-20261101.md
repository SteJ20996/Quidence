# Site audit fixes · 2026-11-01

An outside audit of quidence.com listed seven problems. Each was checked against the source before changing anything. All seven were confirmed; this note records the cause of each, the fix, and what the fix deliberately leaves alone.

## 1. A correct fraction such as 0.3/0.1 was marked wrong

**Cause.** The shared foundation engine (`assets/foundation-engine.js`) serves the foundation checks, the understanding checks and the field projects. It read `0.3/0.1` as the binary floating-point quotient 2.9999999999999996. For an integer answer, any value other than the exact integer was rejected before the tolerance check, so `0.3/0.1` and `0.6/0.2` failed while `0.9/0.3` passed by rounding luck. The Number Theory family of courses (`NTCore.rational`) and the Algebra module (1e-8 tolerance) were not affected.

**Fix.** A new numeric policy, `written-precision-4`, compares a written fraction with an integer answer as an exact ratio of integers. `0.3/0.1`, `3e-1/1e-1` and `-0.3/-0.1` now match 3; `2.9999999`, `2999999999/1000000000` and `0.30000001/0.1` still do not.

**Saved work.** Each saved submission is re-checked on load against the policy it was saved under, so `written-precision-3` keeps its original rule. Changing it in place would have made a saved `0.3/0.1` record fail that check. An earlier result that the current rule would change is shown as "earlier precision check needs review"; it is not rewritten. The saved-report viewer shows its precision notice for a `written-precision-3` snapshot only when an answer is a fraction written with decimals or an exponent. Those are the only answers the two rules can grade differently, because an integer divided by an integer is exact in floating point.

## 2. An inexact vector was marked correct

**Cause.** Linear Algebra (`modules/ab01/dist/engine.js`) accepted any component within 0.01 of the answer, so (3.009, −2.009) matched (3, −2) and counted toward "Independent evidence".

**Fix.** Every answer in this module is an integer or a half-integer, so a typed component must now match exactly. The module recomputes evidence from the saved answers each time it reports. A saved (3.009, −2.009) now reads as a mismatch, and the answer itself is unchanged. The archived `beta01` copy is not published (`build-static-release.cjs` excludes it) and was left as is.

## 3. An answer entered after seeing the reference counted as independent

**Cause.** In the Algebra module (`modules/aa01/dist/app.js`), skipping a question set its completion time. The report then showed that question's reference answer. Skipping does not create an attempt, so an answer typed in afterwards became the first attempt. It was recorded with `support_level: 'independent'` and counted as "correct on the first try". The other modules already track this: foundation checks store `feedbackSeen`, and Linear Algebra records solution exposures.

**Fix.** The first time the report or immediate feedback shows a question's reference answer, the time is kept as `referenceShownAt`. A later attempt is marked `afterReference`. Its event has `support_level: 'after_reference_answer'` and `support.reference_answer_shown_at_ms`. Such an attempt is no longer first-try evidence, and the report and the Markdown export say it came after the reference was shown. Earlier events and attempts are not rewritten.

## 4. The on-page foundation report left out the given tables and graphs

**Cause.** The question view drew each task's given table, matrix, game table, number line or graph, but the report showed only the prompt text. The Markdown export did include them.

**Fix.** The report draws the same given material under each prompt, using the same renderer as the question.

**Not changed here.** The saved-report viewer (`reports/`) still showed the given material only inside its Markdown text. **Correction:** this note first said the snapshot format would have to change, because snapshots store only observations. That was wrong: portable snapshots already include `taskDefinitions`. The viewer now draws the given material from them; see `review/deep-audit-fixes-20261101.md`.

## 5. The cross-disciplinary page header said 2 projects and 12 steps

**Cause.** The header was not updated when the third project (Benford) was added; the data have 3 projects and 18 steps.

**Fix.** The header and its Spanish entry now read 3 projects and 18 steps. A new test compares the header counts on the cross-disciplinary, Number Theory and Discrete Mathematics pages with each page's `data.json`.

## 6. The Basic Logic tool rule said "if" but was counted as "exactly when"

**Cause.** In project `bl-p01`, stage 3 says a member "may use the power tools if" a condition holds, and the answer (23) counts exactly the members who meet it. "May use the tools if C" only says C is enough, so it doesn't settle whether other members are excluded. The stage just before this one teaches that a conditional is not its converse. The Basic Logic lessons do not teach "if and only if", so the fix uses plain words instead.

**Fix.** The rule now reads "may use the power tools exactly when … Members who do not meet this condition may not use them." Only that sentence and the task's version change. The project bank becomes `quidence-projects-8`. Because the bank file says published tasks are never edited in place, `quidence-projects-7` stays in its history with the original wording, so records saved under it reopen with the question they answered.

## 7. The Benford test lab stated its conclusion too strongly

**Cause.** Step 6's lab said "these first digits do not follow Benford's law" whenever χ² exceeded 15.51. The 5% cutoff assumes a random sample, and none of the lab's three data sets is one. The worked solution already explains this; the lab's status line did not.

**Fix.** Above the cutoff the lab now says: "if these numbers were a random sample from Benford's law, a value this large would happen less than 5% of the time, so the test rejects the law at the 5% level." Below it, it says the test finds no evidence against the law at the 5% level, and that passing the test does not prove that the data follow it.

## Checks

- `tests/flow-review.test.cjs`: three new tests cover exact fractions, the viewer notice and the report's given material.
- `tests/site-audit-20261101.test.cjs`: five new tests cover vectors, the reference flag, page counts, the Basic Logic wording and the Benford wording.
- Each of the eight new tests fails on the code before these fixes.
- The cross-disciplinary browser test now checks both Benford status lines in full.
- `tests/projects.test.cjs` expects bank 8.
