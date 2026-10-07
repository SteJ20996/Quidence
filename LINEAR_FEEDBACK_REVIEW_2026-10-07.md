# Linear algebra feedback review

## Implemented

- Keep the matrix and vector explanation boxes visible. Shared subject, foundation, challenge, project and visual-algebra forms now say that equations, calculations and short explanations are welcome. Review guidance accepts sound calculations and diagrams without preferred prose or keywords.
- Keep free reasoning for human review. No automatic semantic understanding score was introduced. Existing objective component checks and saved response history remain separate.
- Remove remaining student-facing project codes in the linear-algebra legacy headings, public explanatory copy and visual-algebra sketch footer. Use phase names and task titles in matrix reports. Retain internal storage keys, project IDs and task IDs for compatibility.
- Clarify the fixed guide input v = (1, 2), its two original basis directions and the origin. Retain the seven-step animation and prediction gate.
- Add original 2×2, 3×2 and 2×3 matrix-vector teaching examples, row calculations, the column-combination formula and input/output dimension constraints. In the assessment route these examples appear after the lesson prediction and final guide step; Matrix Lab also includes them as teaching material.
- Prevent incomplete later-check prompts and solutions from appearing in newly generated on-page, Markdown and JSON reports. Original responses remain available. References become available after that later check is finished.
- Mark prior reference-answer exposure as uncertain for legacy matrix sessions. Derive this annotation without rewriting old submissions; new later submissions on those sessions record the uncertainty explicitly. An older report could already have disclosed answers, so a later response cannot establish unseen-task performance.

## Routes and current inventory

| Route | Inventory | Location |
| --- | --- | --- |
| Matrix learning | 3 starting + 2 practice + 3 fresh tasks; 1 lesson prediction; 2 optional later tasks | modules/ab01/dist/index.html |
| Vector diagnostic | 8 base tasks; at most 3 optional follow-ups selected from 5 templates | modules/ab01/dist/vectors.html |
| Foundation checks | 15 entry + 8 further questions in separate checks | foundations/?module=ab01 |
| Diagnostic challenges | 12 multi-step problems | diagnostics/?module=ab01 |
| Field projects | 2 larger projects | projects/?module=ab01 |
| Matrix Lab | Guided and exploratory teaching; not a separate mandatory test count | modules/ab01/dist/matrix.html |

These are separate routes, not a required checklist. One matrix report cannot establish completion of all routes. Uploaded student files and personal response records are not included in this change.

## Validation and limits

- Full repository validation passed: 150 Node test entries, additional visual-algebra DOM/math checks and source-inventory consistency.
- Final linear-algebra validation passed after the last display/count changes: 10 test files. Coverage includes rectangular products, row/column agreement, formula-only response preservation, prediction gating, report-reference withholding, reference release after completion, legacy exposure annotations and immutable old responses.
- Existing served task definitions and task-set versions remain unchanged. No extra scored tasks were inserted.
- The source ledger was regenerated for changed file fingerprints. It remains an inventory, not copyright clearance or human mathematical certification.
- DOM fixtures do not certify native browser layout. macOS scrolling, live animation appearance and the earlier PDF-export freeze still need device testing.
- General semantic grading and equivalence across arbitrary explanations remain open research/review work. This change does not claim full mastery, effort, AI-use detection or exam-grade prediction.
