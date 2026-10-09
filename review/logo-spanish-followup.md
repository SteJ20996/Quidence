# Logo and Spanish review fixes · 2026-10-09

The external review of the logo/Spanish release identified a display-layer breach of original student evidence, ambiguous numeric punctuation, and an invisible report-page wordmark. These issues are repaired without rewriting stored answers, question definitions, or historical outcomes.

| Review | Result |
| --- | --- |
| S1 | Course feedback now isolates original explanations in protected student-work spans. Labels remain translatable. Course feedback, language switching, drafts, exports, and resumed records have regression coverage. |
| S2 | All numeric-entry screens specify decimal points and no thousands separators. Comma entries stay drafts until rewritten. Potential grouping dots require an explicit decimal-value confirmation. The confirmation records the original entry and interpreted value. Existing numeric parser policies and historical scores remain unchanged. |
| L1 | Saved reports uses the white/mint logo on its navy header. Browser tests check actual foreground/background contrast as well as loading, size, clipping, and overlap. |
| S3 | Removed arbitrary word/substring replacement. Only exact reviewed captions and complete reviewed numeric/structural formats are translated. Unknown sentences stay intact and appear in an in-memory developer missing-caption list; no telemetry is sent. Added coverage across introductions, reports, saved lists, controls, attributes, and course steps. |
| R1 | The export formatter removes only an exact duplicate of the heading it adds, preserving other titles and quoted student text. |
| S4 | Saved-list dates display an explicit month with `Intl.DateTimeFormat`, and update when the UI language changes. Stored timestamps remain ISO strings. |
| S5 | Geometry's Spanish label wraps into two lines; Physics 1's resting-cart label and speed have separate, bounded positions. |
| S6 | Consistent US Spanish UI terms: materia, Ingresa, Álgebra lineal, and the quoted Not sure button caption. Counts use singular/plural formats. Circuit connection captions translate independently of stored option values. International `sin` notation remains consistent with accepted mathematical input. |
| S7 | The Spanish catalog loads only when requested. Its separate fingerprint is pinned in page markup. English startup does not request it. Compiled caption and quantity lookup results are cached. |
| L2 | Added a vector-derived 180×180 PNG home-screen icon on every branded HTML page and a 1200×630 share image for the homepage. Original vector artwork is preserved. |
| L3 | Original supplied paths are unchanged. Large-format print curve refinement remains a future design task. |
| S8 | Dedicated static Spanish routes and hreflang remain future SEO work; this update continues to translate at runtime. JavaScript-capable crawlers may render that content, so the review's blanket claim that search engines cannot see it is not assumed. |

## Validation

- `npm test`: mathematics, schemas, record preservation, report formatting, safety, source inventory, locale punctuation, and exact-caption behavior.
- `test:browser`: 80 activity layouts, 40 draft checks, cached-version upgrades, four completed-report flows, and four homepage widths.
- `test:localization:browser`: 88 layouts, 72 multipart tasks, 20 completed reports; original multiline answers and language switches remain intact. Missing authored-caption and English-residue checks now fail the test instead of merely writing an audit file. Formula identifiers and the feedback email are exempt from missing-caption checks.
- `test:brand:browser`: 22 public pages × two languages × four widths, including contrast, plus two detached offline reports.
- `test:spanish:review`: 33 lessons, 132 steps, 956 control states, four punctuation cases, explicit-confirmation resume, no catalog download for English startup, and exact preserved feedback quotes.

These are automated Chromium and state checks, not native Safari or a Spanish teacher's language review. All generated public files are checked against the release package; Cloudflare upload remains the user's deployment step.
