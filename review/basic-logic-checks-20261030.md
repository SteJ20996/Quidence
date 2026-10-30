# Basic Logic checks · 2026-10-30

Basic Logic now has a 15-question foundation check and a four-problem understanding check, in English and Spanish. This is the third of four parts:
- the four lessons came first (`review/basic-logic-course-20261030.md`);
- the two field projects came second (`review/basic-logic-projects-20261030.md`);
- the Intuition Lab activity comes last.

## Foundation check

`foundations/?module=basic-logic` checks what the course assumes, not what it teaches. Like the other foundation checks, it has five groups of three questions, with one to three parts each (40 parts in all). Most items target a common mistake.

| Group | Questions | Common mistake targeted |
| --- | --- | --- |
| Facts about integers | whether 51 and 1 are prime; 0 and −7 as even and odd, and the even numbers from −4 to 4; a number that is even but not divisible by 4 | taking 51 or 1 for a prime; leaving out 0 |
| Inequalities | integers with 3 < x ≤ 7 and −3 ≤ x < 2; comparing −5 and −2, and whether 3 solves x > 3; which integers satisfy both x > 3 and x ≤ 5 | including or dropping an end; reading −5 as greater |
| Counting cases | a class of 32 with 18 in a sport, 12 with an instrument and 7 doing both; outcomes for two coins and settings for three switches; odd numbers and perfect squares in a list | subtracting both groups from the total; counting HT and TH once |
| Reading rules and definitions precisely | "children under 12 ride free"; "at least 3 meetings and no more than 2 missed practices"; whether every square is a rectangle and every rectangle a square | treating "under 12" as including 12; treating "at least" as "more than"; believing a rectangle must have unequal sides |
| Equations and parts of a whole | when x + 1 = 5 is true, and the value that makes 2x = x true; (−4)², −4² and the negative n with n² = 49; 3/8 of 40 members and the members who did not pass | squaring the sign in −4²; forgetting the negative square root |

What the course teaches is listed as not checked: truth tables, conditionals and their converses, valid arguments, and quantifiers.

`tests/additional-foundations.test.cjs` recomputes all 40 parts without reading the stored key:
- **Numbers and lists:** primes by trial division, parity and ranges by listing every whole number, and the list questions by filtering the list.
- **Class:** the counts in each group come from searching every possible split of the 32 students.
- **Shapes:** squares and rectangles are checked against their definitions over a family of quadrilaterals.
- **Rules:** each case is tested against the rule as written.

It also checks that changing each numeric answer by 1 is not matched.

## Understanding check

`diagnostics/?module=basic-logic` has four problems and 16 answer parts, sized like the other courses' checks.

| Problem | Group | What it checks |
| --- | --- | --- |
| Three statements and parentheses (medium) | Statements and conditionals | the 8 rows for P, Q and R; counting the rows where "P and (Q or R)" and "(P and Q) or R" are true; whether the two mean the same thing |
| A rule about numbers that end in 5 (medium) | Statements and conditionals | a true conditional, its false converse, the 5 counterexamples from 1 to 50, and which statement is its contrapositive |
| Three arguments (challenging) | Arguments and quantifiers | reasoning by cases in "If P, then Q. If not P, then R. So Q or R." (with the 4 rows where both premises are true), ruling out one part of an "or", and the inclusive "or" in "P or Q. P. So not Q." |
| Clubs and classes (challenging) | Arguments and quantifiers | what "all", "no" and "some" statements force, a counterexample diagram, and counting two groups with no overlap |

The problems move the lessons' ideas to new settings: three statements instead of two, a number rule instead of a shape rule, and four school groups instead of the A, B and C of the lesson diagrams.

`scripts/audit-challenges.py` recomputes the 16 answers without reading the authored keys:
- **Truth tables:** it lists all 8 truth assignments for P, Q and R.
- **Number rule:** it tests the rule on every whole number from 0 to 999 and counts the counterexamples from 1 to 50.
- **Arguments:** it tests each form row by row.
- **Clubs:** it tries all 2¹⁶ ways to fill the 16 parts of the robotics, physics, art and music diagram. No fitting school puts anyone in both physics and art, so the two counts add.

The audit now covers 74 tasks and 291 parts. Both implementations were written in this project, so this is a consistency check, not independent certification.

## Pre-release review

A separate review recomputed every keyed answer, and the recomputations agreed. These changes followed:
- **Integers.** In US usage "whole numbers" are not negative, so a student could count only 0 and 1 for −3 ≤ x < 2, and "a negative whole number with n² = 49" would have no answer. Items with negative values now say "integer"; the Spanish «números enteros» already meant integers.
- **Transfer.** Argument A repeated the Arguments lesson's own final task (chaining two conditionals). It now reasons by cases, and its key (valid, 4 rows) is unchanged.
- **Scope.** "Must x be greater than 1 if x > 3?" tested the conditional that the Conditionals lesson teaches. It became "which integers satisfy both x > 3 and x ≤ 5". A list-reading item was replaced by squares and rectangles, which the lesson questions rely on and the check did not cover.
- **Answers that coincided.** With 30 students, "neither" also came to 7, the same as "both"; the class now has 32 students and the answer is 9.
- **Wording.**
  - "At least one music student" now matches the question before it.
  - The "next" task for the clubs problem can no longer be answered by restating its conclusion.
  - "Between 30 and 40" now says "greater than 30 and less than 40".
  - The English uses serial commas, as the lessons do.
- **Spanish.** «todo», «algún» y «ningún» follow the course, «no faltar a más de 2 prácticas» replaces an awkward phrase, and the coin uses «cara o sello», which is more common in Latin America.

A separate interface review completed both checks in English and Spanish at 1280, 768 and 375 px, twelve runs in all, with wrong answers in each. It found:
- **No problems:** no page errors, failed requests, horizontal scroll or untranslated text.
- **Correct reports:** 38 matched and 2 to recheck for the foundation check, and 14 and 2 for the understanding check.
- **Shared issues, left as they were:**
  - **Inconsistent Spanish labels:** the Spanish names for "Test your understanding" and "Check foundations" differ between the map, the cards and the activity bar.
  - **Difficulty tags:** they read «INTERMEDIO» and «AVANZADA» with different genders.
  - **Word break:** "Discrete Mathematics" breaks inside a word in the Classic map's subject panel.
  - **English labels:** the saved-answer block in Spanish reports keeps English labels.

## Saved work

- **Diagnostic bank:** version 9 is frozen as `assets/challenge-bank-v9.js`. `challenge-bank.js` becomes `quidence-challenges-10`, and the Basic Logic problems are in `assets/basic-logic-challenge-bank.js`. A test opens records saved under versions 6, 7, 8 and 9 and checks that each gains an empty module for each subject added after it.
- **Foundation records:** saved records are accepted only when their subjects match a published set. The engine now lists the thirteen-subject set from before this change. A new test opens a thirteen-subject record, checks that it is unchanged, and checks that it gains an empty Basic Logic module.
- **Older records:** records saved under the earlier brand name, and older four-, six-, nine-, ten- and twelve-subject records, gain the empty module and are otherwise unchanged.

## A shared report fix

When an answer part needs another check, the report's next-step list says so. For foundation questions this sentence was built as "Recheck " + the part's label + ".". That had two effects:
- **Every subject:** the sentence was never translated to Spanish.
- **Question labels:** a label written as a question produced "Recheck Is 51 prime?.".

It now reads "Recheck: Is 51 prime?", and the Spanish site translates it as «Vuelve a comprobar: ¿Es 51 primo?» whenever the label has a reviewed translation. Spanish sentence splitting also accepts a question mark, so the longer next-step lines that contain it are translated too. The change affects only how this sentence is shown; no saved answer changes.

## Where the checks appear

- **Homepage card:** shows both checks and the field projects. The "Not available yet" note now lists only the Intuition Lab activity, in the row the Intuition link uses on other cards.
- **Course page:** the top bar links to both checks and the field projects.
- **Knowledge map:** the "Logic" node offers "Test your understanding".
- **Check pages:** Basic Logic is in the subject menus after Algebra II. Its projects page now has the "Test your understanding" link like the other subjects.
- **Search engines:** the understanding check can be indexed.
- **Homepage scope line:** 68 diagnostic problems, and foundation checks in fourteen tracks.

## Language

Both checks are in English and Spanish, like the site's other checks; neither is a voice or AI activity. The foundation check's Spanish is written next to each English string. The 75 understanding-check strings are in `localization/basic-logic-diagnostic-extra-es.json`, using the course's terms ("proposición", "recíproca", "contrarrecíproca", "contraejemplo"). The dictation button in explanation fields stays in English, as the language policy requires. Learner answers are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- **Node tests:** `npm test` passes, 356 of 356, including:
  - the 40 recomputed foundation answers;
  - the 74-task math audit;
  - the bank 6–9 compatibility tests;
  - the thirteen-subject foundation upgrade test.
- **Manual run:** both checks were completed in English and Spanish at 1280 and 375 px, with one wrong answer each, through to the report. There were no page errors, no horizontal scroll and no untranslated text.
- **Not checked:** Safari and real devices.
