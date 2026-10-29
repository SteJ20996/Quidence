# Intuition Lab integration

Intuition Lab is the third homepage view (`?view=intuition`), alongside the map and subject views. It offers twelve authored activities with prediction, an interactive model, reference reasoning, a numerical transfer check, and reflection. The same activity is linked from its subject card and real course page.

The homepage follows the existing English/Spanish locale. The activity has authored English, Spanish, and Traditional Chinese catalogs. Original written answers and original submitted choice snapshots are preserved. Written explanations are not automatically assessed. First predictions are not scored.

The new `quidence_intuition_v1` record is registered with the existing local backup, restore and clearing policy. Invalid records are kept verbatim and exported for recovery; stale tabs cannot overwrite a newer tab. Decimal commas and Unicode minus are accepted in numerical checks.

Validation includes independent mathematical reference checks, sphere quadrature, all slider ranges, catalog completeness, backup/restore and original-answer preservation, plus browser regressions covering themes, modes, locale changes, phone widths, numerical answers and attempts. The existing full test suite remains in the checks workflow; the new browser regression is appended to it. Source inventory entries document the twelve new task definitions without asserting rights clearance or a human assessment of student explanations.

## 2026-10-29 · One design per appearance

The first version drew one layout in every appearance. In Paper Explorer and Learning Atlas it filled only part of the page width and showed none of those appearances' styling, so the view was briefly withdrawn and then redesigned. `assets/intuition-home.js` now renders a separate composition for each appearance, and `assets/intuition-home.css` scopes every rule to the appearance it draws:

| Appearance | Composition |
| --- | --- |
| Classic | Keeps the three-column page on desktop. The centre has a Classic heading, a mint "How an investigation works" panel in the style of the knowledge-map guide, and School / Further / Science sections of white cards with each subject's accent border and a full-width action. Below 960px the side rails are hidden in this view so the activities come first. |
| Paper Explorer | The subject page's two columns: Nunito heading with the yellow spark, paper tabs with their category drawings, cream paper cards with Paper Explorer subject art, and a right rail with the bookshelf, a taped note listing the four steps, and the records note. |
| Learning Atlas | A full-width serif hero with the observatory landscape, atlas tabs, lavender group panels with editorial headings, field-guide cards with Atlas subject art, and a "Field notes" rail with the compass, the four steps, the records note and the books illustration. |
| Geometric Studio | The original design, now using the same heading type, shapes and pill tabs as the Studio subject page. |

All four keep the same twelve activities, links, English/Spanish copy, saved-progress labels and filters (Classic shows its groups as sections instead of a filter). Atlas subject art is drawn with its own gradient-id scope, so the view and the subject cards never share element ids. Switching appearance while the view is open redraws it in the new composition.

The browser regression checks each appearance's structure (groups, filters, steps, subject art and decoration), unique ids, that the view spans the page width, filter focus, live appearance changes, and phone widths in English and Spanish.
