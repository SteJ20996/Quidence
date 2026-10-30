# Basic Logic field projects · 2026-10-30

Basic Logic has two field projects, in English and Spanish. This is the second of four parts; the four lessons came first (`review/basic-logic-course-20261030.md`). The foundation and understanding checks and an Intuition Lab activity follow separately, and the card still lists them as not available yet.

## The projects

Like the other courses' field projects, each project has three steps with California-inspired invented data. Number answers are checked automatically, and written explanations are saved for review. Projects have no multiple-choice fields, so each logical idea is checked through a count: how many members or shoppers make a statement true, break it, or must be included.

| Project | Step | What the learner finds |
| --- | --- | --- |
| Who may use the power tools? (a robotics club in Sacramento, 40 members) | Count with connectives | Members for whom "P or Q", "P or Q, but not both" and "not (P and Q)" are true, with De Morgan's law as the check |
| | Test a conditional against the records | Counterexamples to "If P, then Q", the members for whom it is true, and counterexamples to its converse |
| | Read a rule with parentheses | Members allowed by "Q and (P or H)", by the misreading "(Q and P) or H", and the 4 members the misreading would let in without passing the safety quiz |
| Which claims does the market survey support? (a farmers' market in Fresno, 120 shoppers) | Fill the three-group diagram | Shoppers in none of the groups, in the Fruit group only, and in Fruit and Veg but not App |
| | Test claims with counterexamples | Counterexamples to an "all" claim, witnesses for a "some" claim, and shoppers who make the negation of an "every" claim true |
| | What must follow, and what only happens to be true | The smallest and largest number of fruit buyers who could have received a receipt, and why an argument with a true conclusion can still be invalid |

The second project connects the lessons' Venn diagrams to counts. Its groups are named Fruit, Veg and App rather than F, V and A, because the lessons' truth tables use F for false, and the Spanish tables use V for true. The bounds in step 3 come only from what the premises force: every app user received a receipt, so at least 25 fruit buyers did. The other 7 receipts went to the 79 shoppers without the app, of whom 45 bought fruit and 34 did not, so anywhere from 25 to 32 fruit buyers could have received one.

## Checking the answers

`scripts/audit-projects.py` recomputes all 17 numeric answers without reading the authored keys:
- **Club:** it lists the 40 members one by one, each with three truth values, and evaluates every statement member by member.
- **Survey:** it rebuilds the eight parts of the diagram from the totals, checks them against every total, and counts each claim part by part. For the receipt bounds it tries every way to place the 7 extra receipts.

`tests/projects.test.cjs` compares each answer with this recomputation, as it does for the other courses. Both were written in this project, so this is a consistency check, not independent certification.

## Pre-release review

A separate review checked all 17 answers, confirmed that both receipt bounds can be reached, and reran the recomputation with the same result. These changes followed:
- **Ambiguity.** "Bought only fruit" could mean fruit without vegetables (38) as well as fruit with nothing else (24), since paying with the app is not a purchase. The field now asks for "the Fruit group only".
- **Counting a conditional.** Step 2 now says to treat the coach's statement as "If P, then Q" for each member, and the solution adds that, as a claim about the whole club, one counterexample makes it false.
- **Follow-ups that can be done.** The first project's next step now asks for the rule's negation by De Morgan's law, which is true for exactly the 17 excluded members. The second asks for one claim about the receipts that must be true and one that might not be. The original asked for a survey claim that could be either, but the survey counts decide every claim about the three groups.
- **Wording.**
  - "Did not complete" and "did not pass" match the statements P and Q.
  - "App users" is defined as shoppers who paid with the app.
  - Step 1 of the survey project says to start in the center, since the lessons do not teach three-set counting.
  - The negation of claim 3 is written "At least one fruit buyer did not buy vegetables".
- **Spanish.** Volunteer hours are now in «el laboratorio del club», so «taller» means only the safety workshop. Two questions were reworded.

The interface review completed both projects in English and Spanish at 1280, 768 and 375 px. It found no page errors, no horizontal scroll, and no translated learner text. It also found some issues that all subjects' project pages share and that this change leaves as they were:
- **Spanish report:** the saved-answer block shows the site's English field labels next to the learner's answers, because label and answer are protected together.
- **Spanish PDF pop-up:** its subtitle and suggested file name stay in English.
- **Spanish at 375 px:** the "Probar problemas de diagnóstico más breves" pill wraps and its second line covers the first.
- **Spanish headings:** small headings are not in capitals.

The Basic Logic projects page shows two activity links in a three-column bar, as the Number Theory and Discrete Mathematics check pages already do. The third column fills when the understanding check is added.

## Saved work

- The field-project bank is now `quidence-projects-7`.
- **Version 6** is frozen as `assets/project-bank-v6.js`, and the Basic Logic projects are in `assets/basic-logic-project-bank.js`.
- **Earlier subjects:** their projects are unchanged.
- **New test:** it opens a project record saved under version 6 and checks that its work is unchanged and that it gains an empty Basic Logic module.
- **Pre-rename records:** these also gain the empty module and are otherwise unchanged.

## Where the projects appear

- **Homepage card:** "Explore two field projects →". In Classic, the "Not available yet" note now lists only the foundation check, the understanding check and the Intuition Lab activity.
- **Course page:** the top bar links to "Field projects".
- **Projects page:** Basic Logic appears in the subject menu after Algebra II. Its top bar has no "Test your understanding" link until the check exists.
- **Search engines:** `projects/?module=basic-logic` can now be indexed; the understanding check stays out until it exists.
- **Homepage scope line:** 22 field projects.

## Language

The projects are not voice or AI activities, so they use English and Spanish, like the other field projects. The 81 new Spanish strings are in `localization/basic-logic-projects-extra-es.json`, using the lessons' terms ("proposición", "recíproca", "contraejemplo", "conjunto"). The dictation button in explanation fields stays in English, as the language policy requires. Learner answers and explanations are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 355 of 355 Node tests pass, including the version 6 compatibility test and the 17 recomputed answers.
- Both projects were completed in English and Spanish at 1280 and 375 px, with one wrong number in each, through to the report. There were no page errors, no horizontal scroll and no untranslated text.
- Not checked: Safari and real devices.
