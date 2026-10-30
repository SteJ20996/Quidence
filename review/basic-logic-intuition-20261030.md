# Basic Logic Intuition Lab activity · 2026-10-30

Intuition Lab has a fifteenth activity, "Which cards would you turn over?", in English and Spanish. It is the fourth and last part of Basic Logic. The parts before it were:
- the four lessons (`review/basic-logic-course-20261030.md`);
- two field projects (`review/basic-logic-projects-20261030.md`);
- the foundation and understanding checks (`review/basic-logic-checks-20261030.md`).

With it, the Basic Logic card has every activity the other cards have, and its "not available yet" note is gone.

## The activity

| Step | What happens |
| --- | --- |
| Predict | Each card has a letter on one side and a whole number on the other. The rule is "If a card has a vowel on one side, then it has an even number on the other side." Four cards show E, K, 4 and 7. The learner predicts which cards must be turned over to find out whether any card breaks the rule. The options are E and 4, E and 7, only E, or not sure, and the reason is not scored. |
| Explore | A slider picks the card to inspect. The picture shows what the hidden side could be (an even or odd number behind a letter, a vowel or consonant behind a number), marks the one that would break the rule, and says whether the card must be turned. The readouts show the card, the hidden side that would break the rule, and "Must you turn it?". |
| Check | The explanation uses the Conditionals lesson: "If P, then Q" is false only when P is true and Q is false. So only a card that could show a vowel with an odd number matters: E, whose number could be odd, and 7, whose letter could be a vowel. Choosing 4 tests the converse, a different rule. The transfer question uses six cards, A, B, 2, 3, 8 and 9, and asks how many must be turned (3: A, 3 and 9). |
| Revisit | The learner's first reason is shown next to what the model showed, as in the other activities. |

This is a well-known reasoning task: many people choose E and 4. It fits the course's theme of reading a conditional precisely and of telling a statement from its converse. It applies the lessons to a new setting instead of repeating a lesson example.

## Checking the model

`tests/intuition.test.cjs` checks the model without using its code:
- For each visible card, it tries every possible hidden side: all 26 letters behind a number, and all 10 digits behind a letter.
- It marks a card as one to turn exactly when some hidden side would break the rule.
- It checks that this agrees with the model for E, K, 4 and 7, that the cards to turn are E and 7 (the keyed option), and that the transfer answer is 3.

This is a consistency check written in this project, not independent certification.

## Where it appears

- **Intuition Lab:**
  - The homepage view and the lab page list it with School Mathematics, after Algebra II.
  - It uses the Basic Logic card art in each appearance.
  - The counts now read 15 subjects, and so does the search description.
- **Homepage card:** shows "Test your intuition", and the "not available yet" note is gone.
- **Course page:** the shared Intuition Lab panel links to the activity.
- **Source ledger:** lists the activity under Basic Logic.

## Language

Like the other Intuition Lab activities, it has no voice recognition or AI analysis, so it uses English and Spanish. The Spanish uses "tarjeta" for card and the course's terms ("vocal", "par", "impar", "recíproca"). The dictation button in the reason fields stays in English, as the language policy requires. Learner answers and reasons are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 357 of 357 Node tests pass, including the new card test.
- The activity was walked through in English and Spanish at 1280 and 375 px, with all four cards inspected. There were no page errors, no horizontal scroll and no untranslated text.
- Not checked: Safari and real devices.
