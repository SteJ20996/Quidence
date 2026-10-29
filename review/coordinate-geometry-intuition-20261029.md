# Coordinate Geometry Intuition Lab activity · 2026-10-29

Intuition Lab has a thirteenth activity, "One midpoint. One fair spot?", in English, Traditional Chinese and Spanish. With it, Coordinate Geometry has every activity type the other courses have. Stephen approved the idea from the demo.

## The activity

| Step | What happens |
| --- | --- |
| Predict | Two friends live at A(−3, 1) and B(3, 5), and the midpoint (0, 3) is fair. The learner predicts whether the midpoint is the only fair meeting point and gives a reason that is not scored. The options are: only the midpoint, a whole line, a circle around the midpoint, or not sure. |
| Explore | A slider moves P along the dashed line 3x + 2y = 6, from (−2, 6) to (4, −3). The readouts show PA and PB, which stay equal. |
| Check | The explanation expands PA² = PB² to 12x + 8y = 24: the perpendicular bisector through M at a right angle to AB. The transfer question uses A(1, 1) and B(5, 3) and asks for y at x = 4. The answer is 0, because both squared distances are 10. |
| Revisit | The learner's first reason is shown next to what the model showed, as in the other activities. |

`tests/intuition.test.cjs` checks every slider position:

- P lies on 3x + 2y = 6.
- PA = PB.
- A point off the line, (0, 0), is closer to A (10 against 34).
- The transfer answer, recomputed independently from both squared distances.

## Where it appears

- **Intuition Lab:** the homepage view and the lab page list it with School Mathematics, between Geometry and Algebra II. Each appearance uses the existing Coordinate Geometry art. Both counts read 13 subjects, as does the search description.
- **Homepage card:** shows "Test your intuition". There is no "not available yet" note any more. In Classic the bridge label returns to the empty project row; it moves to the Intuition Lab row only while a note is present. Card rows stay aligned with both the local Inter font and CI's DejaVu Sans.
- **Course page:** the shared Intuition Lab panel now appears before the course app, so it stays when the app re-renders. The panel now has Traditional Chinese text as well as English and Spanish, and it links to the lab in the page's language.
- **Source ledger:** lists the new activity under Coordinate Geometry.

## Language

Intuition Lab activities are ordinary activities with no voice recognition or AI analysis. Their answers and reasons can be written in English, Traditional Chinese or Spanish.
