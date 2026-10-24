# Intuition Lab integration

Intuition Lab is the third homepage view (`?view=intuition`), alongside the map and subject views. It offers twelve authored activities with prediction, an interactive model, reference reasoning, a numerical transfer check, and reflection. The same activity is linked from its subject card and real course page.

The homepage follows the existing English/Spanish locale. The activity has authored English, Spanish, and Traditional Chinese catalogs. Original written answers and original submitted choice snapshots are preserved. Written explanations are not automatically assessed. First predictions are not scored.

The new `quidence_intuition_v1` record is registered with the existing local backup, restore and clearing policy. Invalid records are kept verbatim and exported for recovery; stale tabs cannot overwrite a newer tab. Decimal commas and Unicode minus are accepted in numerical checks.

Validation includes independent mathematical reference checks, sphere quadrature, all slider ranges, catalog completeness, backup/restore and original-answer preservation, plus browser regressions covering themes, modes, locale changes, phone widths, numerical answers and attempts. The existing full test suite remains in the checks workflow; the new browser regression is appended to it. Source inventory entries document the twelve new task definitions without asserting rights clearance or a human assessment of student explanations.
