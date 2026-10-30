# Basic Logic course · 2026-10-30

Basic Logic is a new School Mathematics course at the High School level, with four interactive lessons in English and Spanish. This is the first of four parts. Two field projects, the foundation and understanding checks, and an Intuition Lab activity follow in separate releases; until then the card lists them as not available yet.

The course takes the topics that Discrete Mathematics leaves out: statements, truth tables, valid and invalid arguments, common fallacies, quantifiers and syllogisms. Discrete Mathematics keeps proof techniques, and the course page links there as the next step.

## The lessons

Each lesson follows the school-course pattern used by Geometry and Algebra II: a first prediction with a reason, four short steps beside an interactive model, two fresh questions, and feedback that keeps the prediction separate from later work.

| Lesson | Question | Model | What the learner compares |
| --- | --- | --- | --- |
| Statements | When is a compound statement true? | A truth table for "P and Q", "P or Q", "P or Q, but not both" and "not P" | Inclusive and exclusive "or"; De Morgan's law in words |
| Conditionals | When is "if P, then Q" false? | "If P, then Q" beside its converse, inverse or contrapositive | Only the contrapositive agrees in all four rows; the converse and the inverse agree in two |
| Arguments | Valid argument or lucky conclusion? | A row-by-row table for modus ponens, modus tollens, affirming the consequent and denying the antecedent | The two fallacies fail in the same row: P false, Q true |
| Quantifiers | All, some, none: what follows? | A three-set Venn diagram for three syllogisms | Shaded parts are empty, an × marks a part that must hold something, and a red point marks a counterexample |

The Venn diagram decides validity by trying every way to fill its eight parts (256 cases). A part is shaded when no case that fits the premises uses it. The syllogisms are "All A are B; all B are C", which is valid; "All A are B; all C are B", which is invalid and shows the red point; and "No B are C; some A are B", which is valid. None of them depends on a set being non-empty, so the course does not need to discuss existential import.

## Checking the models

A new test in `tests/course-catalog.test.cjs` recomputes every readout without the course's own code:
- truth tables and argument forms from Boolean operations;
- syllogisms by trying every choice of the sets A, B and C among three things (512 cases). A countermodel needs at most one thing for each "some" premise and one for the denied conclusion, so three things are enough.

The test also checks that the number of shaded parts and the red point match. Both methods were written in this project, so this is a consistency check, not independent certification.

## Interface changes

- **Truth values.** Truth-table cells show T and F in English and V and F in Spanish, following each language's convention. The letters follow the page language, so switching languages updates an open table. Screen readers hear "True" or "False" ("Verdadero" or "Falso") instead of a letter. Each table's note explains the letters.
- **Tables on phones.** Truth tables keep equal, centered columns. On phones they wrap only between words; at 375 px and wider they fit, and at 320 px the widest one scrolls a few pixels inside its frame. The argument table does not repeat the P and Q columns: when a premise or the conclusion is just P or Q, the note under the table names it.
- **Long choices.** Argument forms and syllogisms are sentences, so their menus take the whole control row. On phones the longest syllogism is still cut off in the closed menu; the full syllogism is shown in the box under the diagram.
- **Course page links.** The course page's top bar now shows "Field projects" and "Test your understanding" only when a course has them. Every existing course has both, so their pages are unchanged.
- **Card note.** In Classic, a School Mathematics card without field projects now lists them in its "Not available yet" note. Only Basic Logic is affected.

## Where it appears

- **Homepage:** a High School card between Algebra II and Pre-calculus, with art for each appearance (a truth table and a Venn diagram in Classic, three overlapping sets in Paper Explorer, Learning Atlas and Geometric Studio). The scope line now reads "Thirteen mathematics courses and two physics foundations courses".
- **Knowledge map:** a new "Logic" node in Foundations, between Algebra I and "Proof & discrete math". Algebra I connects to it with a dashed line, and it leads to "Proof & discrete math" with a solid line, replacing the dashed line from Algebra I to that node.
- **Illustrated map:** a Basic Logic course node in School Mathematics below Algebra I, with dashed connections from Algebra I and Geometry. The map now counts six course entrances in School Mathematics.
- **Search engines:** the course page is in the sitemap. Field projects and understanding checks for Basic Logic stay out of the index until they exist.
- **Records:** lesson work is saved under `basic-logic_beta01_session_v1`, and saved reports use the label "Basic Logic". No existing record changes.

## Language

The lessons are not voice or AI activities, so they use English and Spanish, like the other school courses. The 188 Spanish strings are in `localization/basic-logic-extra-es.json`, with two readout templates in `localization/quantity-templates-es.json`. The Spanish uses "proposición", "conectivo", "recíproca", "inversa", "contrarrecíproca", "premisa" and "silogismo". The dictation button in explanation fields stays in English, as the language policy requires. Learner answers and explanations are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 354 of 354 Node tests pass, including the new Basic Logic test.
- The browser suites that count subject cards now expect 15 cards and six School Mathematics courses. The Intuition Lab still has 14 activities.
- Screenshots: each lesson model in English and Spanish at 1280 and 375 px, the card in all four appearances, and both maps. A Spanish walkthrough of all four lessons, the summary and the homepage left no untranslated text.
- Not checked: Safari and real devices.
