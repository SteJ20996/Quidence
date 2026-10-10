# English / Spanish localization

The site defaults to English. Choose English or Español in the language menu; `?lang=es` also opens a Spanish view. The preference is browser-local and internal links preserve it. Switching language updates presentation without reloading an activity or submitting/persisting a new answer/report.

Spanish uses Latin American wording with Mexico as the reference (tú, residuo, boletos, Secundaria / Preparatoria / universidad; date formatting es-MX). The original English banks, immutable served versions, answer identifiers, input values and grading rules remain authoritative and unchanged. Spanish covers lessons, diagnostics, projects, generated feedback/report text, navigation, record-management explanations and original-layout SVG cover captions.

Student explanations, unfinished answers, learning requests, reviewer notes and exported JSON remain verbatim. New readable exports delimit original work as quotations. Older inline explanation/review formats are protected as original text. Generated Markdown is localized only as a display/download copy; archival payloads remain independent of UI language.

`source-inventory.json` contains stable IDs. `es-*.tsv` contains reviewed translations, one `ID<TAB>Spanish` per physical line. `*-extra-es.json` contains exact visible fragments and derived current-version strings missed by static extraction. `feedback-extra-es.json` expands current generated feedback from translated skill labels and reviewed fixed templates. Subject audit files record exclusions and review findings; final-math-review.md records numeric, symbol and qualifier checks and the corrected second-equation reference.

Use `npm run build:locales` then `npm run version:activities` after translation changes. Extraction uses the pinned Playwright parser and preserves existing IDs; it is a development aid, never an automatic translator or grader. It requires installed dev dependencies. New definitions and dynamic compositions require review and supplemented exact keys.

Verification: all 7,079 TSV rows checked for numeric values and mathematical symbols; 383 task fingerprints unchanged. Chromium browser verification covers 22 public pages at 320, 375, 768 and 1440 px, all 52 current diagnostic questions, all 20 field projects, 20 report flows, unchanged input values/browser records across language switches, original multiline explanations, detached Spanish printable reports and implicit option-value integrity. Focused Node tests protect inequality conditions and original Markdown evidence. Existing mathematics, storage, security and source-ledger tests also pass.

Native Firefox/Safari and pedagogical validation are outside these automated checks. A bilingual subject educator can review the wording through the catalog and audits; automated numeric checks do not establish linguistic perfection or diagnostic validity.

Number Theory: `number-theory-es-mx*.json` contains the reviewed project translations by stable project/step/field identifiers. `scripts/number-theory-locales.cjs` requires all 43 proofs and 120 fields/options/criteria, and merges complete paragraphs into the shared presentation catalog. Student entries and stored grading payloads remain protected. UI/model captions are in `number-theory-ui-extra-es.json`; Mexican level labels override older neutral labels in `z-mexico-extra-es.json`.
