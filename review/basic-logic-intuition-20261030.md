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
| Explore | A slider picks the card to inspect and shows its face (E, K, 4 or 7), which is also what screen readers announce. The picture shows example hidden sides: 2 and 3 behind a letter, and A and B behind a number. It marks the one that would break the rule and says whether the card must be turned over. The readouts show the card, the kind of hidden side that would break the rule, and "Must you turn it over?". |
| Check | The explanation uses the Conditionals lesson: "If P, then Q" is false only when P is true and Q is false. So only a card that could show a vowel with an odd number matters: E, whose number could be odd, and 7, whose letter could be a vowel. Choosing 4 tests the converse, a different rule. The transfer question uses six cards, A, B, 2, 5, 8 and 9, and asks how many must be turned over (3: A, 5 and 9). |
| Revisit | The learner's first reason is shown next to what the model showed, as in the other activities. |

This is a well-known reasoning task: many people choose E and 4. It fits the course's theme of reading a conditional precisely and of telling a statement from its converse. It applies the lessons to a new setting instead of repeating a lesson example.

## Checking the model

`tests/intuition.test.cjs` checks the model without using its code:
- For each visible card, it tries every letter behind a number and every digit behind a letter. A whole number's last digit decides whether it is odd, so the ten digits cover every whole number.
- It marks a card as one to turn exactly when some hidden side would break the rule.
- It checks that this agrees with the model for E, K, 4 and 7, that the cards to turn are E and 7 (the keyed option), and that the transfer answer is 3. The answer 3 is not one of the transfer cards' faces, so typing a card's face cannot be marked correct by accident.

This is a consistency check written in this project, not independent certification.

## Where it appears

- **Intuition Lab:**
  - The homepage view and the lab page list it with School Mathematics, after Algebra II.
  - It uses the Basic Logic card art in each appearance.
  - The counts now read 15 subjects, and so does the search description.
- **Homepage card:** shows "Test your intuition", and the "not available yet" note is gone.
- **Course page:** the shared Intuition Lab panel links to the activity.
- **Source ledger:** lists the activity under Basic Logic.

## Pre-release review

A separate review confirmed the model, the keyed answer, the explanation and the transfer answer. It also walked through the activity in English and Spanish at 1280, 768 and 375 px. These changes followed:
- **Clipped text.** With the CI font (DejaVu Sans), «No hace falta voltearla» ran past the picture's right edge. It now reads «No hay que voltearla», matching the readout «¿Hay que voltearla?», and the verdict starts further left. The widest label now ends inside the picture in both languages.
- **Slider value.** The slider showed 3 while card 4 was selected. It now shows the card's face, and its label is simply "Card to inspect".
- **Transfer cards.** The six cards were A, B, 2, 3, 8 and 9, so the answer, 3, was also a card face, and "A could hide…" read like an article. Card 3 became 5, and the feedback now says "Card A".
- **Wording.**
  - The claim says the cards lie "with E, K, 4, and 7 face up".
  - "Turn it" is now "turn it over" throughout.
  - The Spanish explanation adds the articles («La E», «el 7»).
  - The formula line is a short statement, "Rule fails ⇔ vowel and odd number", like the other activities' formulas.
  - The small labels in the picture are larger, so they stay readable at 375 px.

## Language

It is not a voice-recognition or AI activity, so, like the other Intuition Lab activities, its content is in English and Spanish. The Spanish uses "tarjeta" for card and the course's terms ("vocal", "par", "impar", "recíproca"). Its optional dictation button stays English-only, as the language policy requires. Learner answers and reasons are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 357 of 357 Node tests pass, including the new card test.
- The activity was walked through in English and Spanish at 1280, 768 and 375 px, with all four cards inspected. There were no page errors, no horizontal scroll and no untranslated text, and the picture's text was measured inside its frame with the CI font.
- All 15 browser suites in `checks.yml` pass; the Intuition Lab suite now counts 15 activities.
- Not checked: Safari and real devices.
