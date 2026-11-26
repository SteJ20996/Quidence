# What Quidence still needs · 2026-11-26

The repository owner asked what the site still needs to strengthen. This note records:
1. what this change fixed;
2. what it left, and why;
3. the inventory itself.

## How the inventory was built

**Sources.** The inventory gathers every item still open in the project's own notes:
- the "Gaps", "Sources and their gaps", "What was left" and "Follow-up" sections of every note in `review/`;
- the scope lines in `assets/course-catalog.js` and `assets/school-course-content.js`;
- the open points in README.md and CURRENT_STATUS.md.

**Checks.** Each item was checked against later notes and commits, and items already fixed were dropped. The published text was also searched for statements that contradict the current site, such as "bilingual" on an English-only site. The points listed under "Fixed in this change" were confirmed in the code first.

## Fixed in this change

| Problem | Where | Fix |
| --- | --- | --- |
| "Four lessons in English … two bilingual projects" | Game Theory card on the homepage | "Four lessons, a 15-question foundation check, two projects and one case study" |
| "Ten bilingual projects" | Knowledge map: Number Theory, Discrete Mathematics, Probability | "proof projects"; Number Theory now says eleven, its real count |
| "Coordinate geometry comes later" | Geometry course page | Coordinate Geometry is published, so the page now names it as its own course |
| "Quidence now focuses on theoretical and applied mathematics" | The two retired economics pages | "Quidence now offers courses in mathematics, science and computer science"; the link reads "Choose a course" |
| The Science panel had no Integrated Science | Hand-drawn map | Integrated Science 6–10 is a course node with a useful connection to Physics 1 |
| "8 course entrances" beside nine courses | Hand-drawn map, Further Mathematics | Each panel's count is now computed from its course nodes, so it cannot drift again |
| The Kelly problem (qr-c04) had no gambling-harm notice | Quantitative Reasoning understanding check | See below |

**The gambling-harm notice.** The notice uses the course's own words and US helpline. It shows as a note beside the question and in the saved report.
- Published problems are never edited in place. The notice is therefore in a new problem version, `quantitative-items-2`, and a new bank, `quidence-challenges-17`.
- Bank 16 is kept as published (`assets/challenge-bank-v16.js`), and checks saved with it keep their earlier wording.
- The question, fields, answers and solution of qr-c04 are unchanged. The other three problems are carried over as published.

## Left, and why

- **Foundation question bl-f10** ("Children under 12 ride free"). The key treats a sufficient condition as the whole fare rule. That is a real error, and an awkward one in a logic course.
  - Changing the wording would change what earlier saved foundation checks show, because the foundation bank has no version history.
  - It needs that history first (deep-audit-fixes-20261101.md), which is a separate change to the check engine.
- **`∫₁^∞` in saved reports and the Markdown export.** Unicode has no superscript infinity, so plain text cannot do better. The lesson page itself sets the ∞ as a superscript.

## The inventory

The notes record 57 open items; the main ones follow. The source notes give the details.

**Content that courses say comes later.**
- **School mathematics** has four introductory lessons per course. The courses themselves say what comes later:
  - Geometry: formal proof, circles and transformations;
  - Algebra I: inequalities and full quadratic analysis;
  - Algebra II: full function analysis;
  - Basic Logic: symbolic logic with ∀ and ∃, and formal proof;
  - Pre-calculus: identities, conics and sequences.
- **Courses built later go deeper:** Integrated Science has 24 lessons, Algorithms 16 and Quantitative Reasoning 12.
- **Statistics** has no inference or t distribution, and no simulation of sample-to-sample variation.
- **Calculus** stops before multivariable integrals; **Linear Algebra** works in two dimensions only.

**Known weaknesses inside courses.**
- **Integrated Science:**
  - some standards are taught only in part or as text;
  - learners cannot plan their own investigations;
  - several models are idealized.
- **Algorithms:**
  - several university topics are named but not shown;
  - input limits block key cases (negative road lengths, negative numbers in subset sums).
- **Quantitative Reasoning:**
  - the quick-round templates can be learned by heart;
  - the planned transfer set is not built;
  - the understanding check covers 10 of 12 lessons.

**Site-wide layout.** Both spot-checks repeat these items:
- chart labels shrink to 5–9 px on phones;
- flowcharts scroll sideways;
- knowledge-map edges run through labels, and its route numbering is out of order;
- outlined labels that cannot be clicked look like buttons.

**Checks and records.**
- **No review.** Explanations and proofs are saved "pending review", and there is no reviewer.
- **Exact matching** counts a right number from a wrong method as a match, and a sensible different rounding as a mismatch.
- **Storage.** Records live only in one browser's storage. Accounts and sync are paused.

**Not solvable by code.**
- No learner has tried the site.
- No outside teacher or expert has reviewed it.
- Source and rights review is open: none of the 694 source-ledger records has been cleared.
- Safari, Firefox, real phones and screen readers are unverified.

## Gaps

- **Recorded items only.** The inventory lists what the notes recorded; problems nobody wrote down are not in it.
- **Not ranked by harm.** The order follows the kind of gap, not measured harm to learners.
- **Search coverage.** The search for contradicting text looked for known phrases ("bilingual", "comes later", "focuses on"). Other stale wording may remain.
