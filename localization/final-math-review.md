# Final mathematical translation review

Scope: all `localization/es-*.tsv` files against frozen `localization/source-inventory.json`. No TSV or source files changed during this review.

## Automated checks

- 7,079 unique translated inventory IDs checked; no conflicting duplicate IDs.
- Literal numeric-token sequences agree exactly except three harmless sentence-order changes listed below. Numeric multisets agree for all rows: no inserted, removed or changed numerical values detected.
- Counts of ≤, ≥, ≠, <, >, ±, −, ², ³, ⁴, ∩ and ∪ agree in every numeric/mathematical row. This checks preserved symbols rather than proving their placement; source/translation pairs flagged by numeric reordering were inspected.
- Targeted lexical screening of zero/nonzero, negation, at least/at most, exactly-one/no/infinite solutions, necessary/sufficient conditions and clockwise/counterclockwise expressions found no reversed mathematical conditions.

## Corrected wording

| ID | File | Finding | Suggested wording |
|---|---|---|---|
| 50 | es-000.tsv | Source “At k = 3 with right-hand side 13” refers to the second equation. Translation “con el segundo término del lado derecho igual a 13” refers to a second term on the right-hand side, which is a different object and is confusing when the right-hand side is just one number. The formulas and no-solution conclusion are unchanged, but the instruction/reference should name the second equation. | “Para k = 3 con el segundo miembro de la segunda ecuación igual a 13, la eliminación da 0 = 1, por lo que no hay solución.” |

Root applied the ID 50 correction to the final TSV and rebuilt the catalog.

No other material translation change to mathematical meaning was identified in this pass.

## Harmless numerical reorderings

- ID 54, es-000.tsv: “replace second target entry 6 by 7” becomes “reemplazara por 7 ... que es 6”. Replacement direction remains 6 → 7. No changed math.
- ID 7286, es-advanced-courses.tsv: source states step 0.5 before bounds −3,3; translation states bounds before step. Same allowed coefficient values.
- ID 8260, es-advanced-courses.tsv: x = 0 moves earlier in the sentence, while the left-hand limit remains −1 and right-hand limit remains 1. No changed math.

## Precision and logical-condition review

- ID 1360 preserves alternatives: exact values OR fractions OR correctly rounded final answers with at least 3 significant figures. Small nonzero values must remain nonzero.
- ID 1361 preserves alternatives: exact numbers OR fractions OR rounded decimals satisfying at least 2 decimal places AND 2 significant figures. Exact integer answers and final-only rounding remain explicit.
- ID 2049 preserves two decimal places AND two significant figures, final-answer-only rounding.
- IDs 2048, 2715, 2811, 4512–4514 preserve at-least decimal-place qualifiers and fractional/exact alternatives where present.
- Courtyard versions retain distinct ≥108 with L≥2x and ≥100 with L≥3x conditions. Boundary inclusion, real-number restrictions, forbidden logarithm/rational inputs and clockwise/antihorario distinctions are preserved.

## False distractors remain false

Inspected representative options rather than rewriting them toward mathematical correctness:

- ID 7329: “Two arrows always let us reach every point” retains the false universal claim.
- ID 7331: “Coefficients are only allowed to be positive” retains the false restriction.
- IDs 7363,7365: restricted-quadrant and x=y distractors retain their stated restrictions.
- ID 7527: negative-count misconception remains as a distractor.
- ID 7540: always-unchanged vertical-step misconception remains.
- ID 8366: “integrals always increase” remains false; translation did not repair it.
- IDs 8516,8517: all-summaries-increase and only-median-increases distractors retain their original assertions.
- ID 8547: “Yes, if at least 100 people respond” retains the original false coverage claim.
- IDs 8710 and 8709: original sign/equality claims preserved.

Limit: automated token and lexical checks are not a full proof of every translated statement or a native-speaker classroom validation. They provide a broad regression check plus targeted manual review of precision, quantifiers, negation and representative false choices.
