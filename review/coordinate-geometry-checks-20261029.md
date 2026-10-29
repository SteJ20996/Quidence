# Coordinate Geometry checks · 2026-10-29

Coordinate Geometry now has a 15-question foundation check and a four-problem understanding check, in English and Spanish. Stephen approved the direction from the demo of the missing Coordinate Geometry and Number Theory activities. Lessons and the Intuition Lab activity follow in separate PRs.

## Foundation check

`foundations/?module=coordinate-geometry` checks what the course assumes, not what it teaches. The distance and midpoint formulas, slopes, and equations of lines and circles are listed as not checked.

| Group | Questions |
| --- | --- |
| Signed numbers on a line | distance between two numbers; a signed change; halfway between two numbers |
| Points on a grid | quadrants, including a point on an axis; moving a point; two reflections |
| Right triangles and square roots | legs do not simply add (13 and √5 ≈ 2.24); a missing leg; is it a right triangle? |
| Equations and substitution | distributing over a bracket (x = −5); substituting into a rule; where two rules agree |
| Rates and linear patterns | a constant rate and its starting value; a linear table; (−5)² and (x − 3)² |

The level follows the other foundation checks: 1 to 3 parts per question, five groups of three, and most items aimed at a common mistake. Two plain drafts were replaced: "3x − 7 = 11" repeated Pre-Algebra's "3x − 4 = 11", and a 6-8-10 triangle checked recall only. Their replacements test distributing over a bracket and adding the legs instead of using the Pythagorean theorem.

`tests/additional-foundations.test.cjs` recomputes all 29 answer parts from each question's conditions.

## Understanding check

`diagnostics/?module=coordinate-geometry` has four problems and 16 answer parts, sized like the other courses' checks.

| Problem | Group | What it checks |
| --- | --- | --- |
| How far, and where is the middle? (medium) | Distance, midpoint and lines | distance from coordinate changes, midpoint as an average, comparing distances |
| A path at a right angle (medium) | Distance, midpoint and lines | slope from two points, a line's equation, perpendicular slopes |
| A fair place to meet (challenging) | Equal distances and circles | the perpendicular bisector, its x-axis point 13/3, and that the midpoint is not the only fair point |
| A circle on a diameter (challenging) | Equal distances and circles | center and radius from a diameter, and Thales' right angle |

`scripts/audit-challenges.py` recomputes the answers without reading the authored keys. For problem 3 it also enumerates every grid point equally far from A and B and checks that all of them lie on the line. The audit now covers 66 tasks and 259 parts. Both implementations were written in this project, so this is a consistency check, not independent certification.

## Saved work

- **Diagnostic bank.** Version 7 is frozen as `assets/challenge-bank-v7.js`, and `challenge-bank.js` becomes `quidence-challenges-8`, adding `assets/coordinate-geometry-challenge-bank.js`. The earlier twelve subjects are unchanged. A test opens records saved under versions 6 and 7 and checks that each gains an empty module for the subject added after it.
- **Foundation records.** The foundation engine accepts a saved record only when its subjects match a published set. Adding a tenth subject without listing the nine-subject set would have made every saved foundation record unreadable. The nine-subject set is now listed, and a new test opens a nine-subject record, checks that it is unchanged, and checks that it gains an empty Coordinate Geometry module.
- **Report store.** The report store knows Coordinate Geometry, so its reports are archived like the other subjects'.

## Where the checks appear

- **Homepage card:** shows both checks. The "not available yet" note now lists only what is missing: lessons and the Intuition Lab activity. In Classic, the note takes the empty project row, which is tall enough for three lines, and the bridge label takes the Intuition Lab row, so neighbouring cards keep the same height. CI's wider DejaVu Sans fonts wrap the note to three lines at 960px, so this was checked with both fonts. The scope line is shortened so it does not add a line at 960px.
- **Course overview:** "Your starting tools" links to both checks. In Traditional Chinese the links say the checks are in English and Spanish.
- **Knowledge map and diagnostics page:** the map now offers "Test your understanding". On the diagnostics page Coordinate Geometry has no "Field projects" link, because its projects are on the course page. The diagnostic check can be indexed by search engines; `projects/?module=coordinate-geometry` stays out of the index.
- **Homepage scope line:** 60 diagnostic problems and foundation checks in ten tracks, in English and Spanish.

## Language

Both checks follow the existing check languages, English and Spanish. Neither is a voice or AI activity. The foundation check's Spanish is written next to each English string, as in the other foundation modules. The 69 understanding-check strings are in `localization/coordinate-geometry-diagnostic-extra-es.json`. They use "mediatriz", "ordenada al origen" and the gender-neutral "dos amistades". English uses "center", like the rest of the site.

## Validation

Local runs used Node 22; CI uses the pinned 24.19.

- `npm test`: 333 of 333 Node tests pass. This includes the 74 independently recomputed foundation answers, the 66-task math audit, the bank 6 and 7 compatibility tests, and the nine-subject foundation upgrade test.
- All 14 browser suites in `checks.yml` pass in Chromium, and so does the Coordinate Geometry suite.
  - Activity suite: 96 pages and 52 drafts, with no page errors or failed requests.
  - Spanish suite: 80 tasks and 22 reports with no English residue.
  - New-subject suite: all 60 new foundation questions answered in Spanish, with reports and exports and no missing strings.
  - Themes suite: Classic row alignment and the Physics 1 card height hold.
  - Coordinate Geometry suite: 288 layouts. It also checks the course links in English and Traditional Chinese, and the map's check link.
- Not checked: Safari and real devices.
