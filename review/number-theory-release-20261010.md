# Number Theory release · 2026-10-10

The approved ten-project English preview is now a public course under `courses/number-theory/`. It has 43 steps, 120 response fields, complete expandable reference proofs and the three foundation proofs (Bézout, Euclid’s lemma and unique factorization). The homepage offers this eleventh course through its subject rail, College Level cards and the Number Theory node in University Maths.

Update: the complete Number Theory Spanish translation is now supplied using Mexican Latin American wording, including all project text, proofs, models and readable exports. The English source and all answer values remain unchanged. Student reasoning can use either language; language changes preserve the exact original response. See mexican-spanish-20261010.md for the follow-up audit and CI repair.

Calculations and choices can be checked; free-form proofs remain pending review. Number Theory has ten proof projects and its own exportable notebook, not a claimed standalone diagnostic test or mastery score. The existing ten courses retain their 52 diagnostic problems and 20 field projects. Course-specific opted-in learning requests are captured with each Number Theory check; old checks keep their original context.

Records participate in the existing device backup and explicit clearing tools. An unreadable original is retained, can be exported, and requires an explicit reset. Before writing, the module compares the saved original so a stale page cannot overwrite another tab’s changed record. Local storage failures are visible. Exact fractions and signed numbers are accepted; number input uses a decimal point without thousands separators.

The two unexplained decorative map region fills were removed. Roads, course markers, branch selectors and the existing legend retain their meanings and contrast. Foundations and University Maths keep the previously approved matching map proportions. The wordmark has a full row on narrow phones so the language control cannot compress it.

Validation:
- `npm test`: all existing regression suites and 1,862 Number Theory content/logic checks passed.
- Number Theory browser: all 43 steps; 12 layouts (1920, 1440, 1024, 768, 375, 320px; English/Spanish), original answers, grade revisions, export history, learning criteria, unreadable originals and storage failure; no page errors or failed requests.
- Homepage browser: 12 bilingual layouts, 36 chapter views, preserved records through 200 subject changes and 20 view changes; 120 local requests at concurrency 40 with no failures. This is local verification, not a production capacity guarantee.
- Existing activity browser: 80 pages, 40 drafts, four widths, old-cache upgrades; zero page errors or failed requests.
- Localization browser: 72 tasks and 20 reports; zero unintended English residue in reviewed Spanish UI.
- Brand browser: 184 layouts plus two offline reports; no errors or failed requests.

Source: the supplied v2 Markdown is retained at `content/number-theory/source-v2.md`; `scripts/import-number-theory.py` reproduces the content JSON. The source ledger records the ten projects and content fingerprints. Its status remains an inventory, not legal copyright clearance or independent human mathematical certification. No new Calculus or Linear Algebra question set is included in this release.

Deployment: use `scripts/build-static-release.cjs`. The whitelist includes only the Number Theory public JSON, scripts, page and stylesheet, along with the full existing website; source drafts, tests, internal reviews, database files, account/sync code and Site hosting configuration stay outside the public bundle. Update the existing Cloudflare static-assets project with the complete bundle, preserving all folders. GitHub publication and Cloudflare publication are separate operations.
