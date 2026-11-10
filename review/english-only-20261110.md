# Quidence in English only · 2026-11-10

On 2026-11-10 the repository owner limited Quidence to English, including future subjects. This note records what was removed, what was kept on purpose, and how the result was checked.

## Policy

[AGENTS.md](../AGENTS.md) now says:
- Quidence is published in English only.
- Activities for voice recognition, AI conversation and direct AI analysis stay English and keep `data-fixed-language="en"`.
- A `lang` address parameter or a saved language preference must not switch a page away from English. The saved preference itself stays in place.
- Learner answers, drafts and recordings are never rewritten to enforce a language rule.

The policy applies to published site content. Repository documentation, including the dated notes in `review/`, keeps its history.

## What was removed

| Area | Change |
| --- | --- |
| Shared display layer | `assets/i18n.js` keeps the interface pages call (`text`, `markdown`, `html`, `apply`, `date`, `setLocale`, `locale`, `missing`). Every call returns English: `setLocale()` resolves to `'en'`, `missing` is empty, and `apply()` only formats saved dates and sets `lang="en"`. No `quidence:language` event is sent. |
| Catalogues and assets | `assets/i18n-es.js`, `assets/i18n-es/` (11 files), `localization/` (the whole folder) and 22 `assets/illustrations/*-es.svg` files are deleted. |
| Menus | The language menu on every page, the language row in the appearance menu, the Calculus check page's language button and the course pages' "English and Spanish" tags are gone, with their CSS. |
| Sources | Bilingual sources now hold English only: Algorithms, Coordinate Geometry (projects and lessons), Intuition Lab data and lab, both knowledge maps, the Game Theory projects (`modules/ac01/dist/projects/`), the Calculus check page, the probability, discrete-math and cross-disciplinary project sources, and the extra foundation checks. |
| Addresses and SEO | Links no longer carry `?lang=`. Canonical URLs drop `lang`, there are no hreflang alternates, and `sitemap.xml` lists each of the 22 public pages once (it had 44 entries). |
| Build and checks | `build-locales`, `extract-localization`, `number-theory-locales`, the coordinate-geometry catalogue injection and `test:spanish:review` are gone. `test:localization:browser` became `test:english:browser`. |

The English text is otherwise unchanged. For twelve bilingual sources, the English part of the old file was compared with the new file. Nine were identical. The other three differ only by intended edits:
- the catalogue scope lines that said "in English and Spanish";
- the unused Coordinate Geometry "Language" label;
- the removed Spanish map of the extra foundation checks.

The four project data files rebuilt byte for byte.

## What was kept on purpose, and why

- **Saved preferences.** A browser that saved `quidence_ui_locale_v1 = 'es'` keeps that value. Nothing reads or rewrites it. The policy asks for this so that removing a language never changes stored data.
- **Earlier records.** Several validators accept the language field of records saved while Spanish was offered:
  - Coordinate Geometry accepts `lang: 'es'`;
  - Game Theory projects accept `locale: 'es'`;
  - Algorithms accepts text objects that also hold `es`.

  Without this, earlier work would be treated as corrupt and could not be opened or exported. It opens in English with the learner's words unchanged.
- **Spanish unit spellings in the foundation grader.** `assets/foundation-engine.js` still accepts unit words such as *litros* and *horas* after a number.
  - Saved answers are graded again under versioned policies when a report is drawn, so removing the spellings would change the verdict on work learners already submitted.
  - The spellings are never shown on a page.
  - This is the one place where Spanish words remain in published code.
- **Decimal commas.** The Game Theory and foundation number readers still read `1,5` as 1.5, as before. This is input tolerance, not page text.

## Problems found while checking

- **Space left by the menu.** Without the language menu, the Classic homepage header kept an empty 112 px column on the right. The header grid now has no language column at any width. A first cleanup of the menu's CSS also dropped shared rules written as `:is(main,.top,.q-theme-bar,.language-toolbar)`, which took away the side margin of the appearance bar on the Calculus check page. Only the language selector was removed from those lists.

  The fix was checked with before-and-after screenshots of all 36 pages, at 375 and 1280 px, in Classic and Geometric Studio. Allowing for the height of the removed row, the remaining differences are the language controls themselves.
- **Browser-language dates.** Five places formatted dates or numbers with `toLocaleString()` and no locale, so a browser set to Spanish would have shown Spanish date text. The report viewer, saved goals, foundation sessions, the Linear Algebra delayed-task note and the speech-review length message now format in `en-US`.
- **Leftovers after the menu was gone.** The truth-table letters still carried a hidden Spanish V/F span, and several stylesheets still styled the removed language controls. Both are removed.

## How it was checked

- `tests/english-only.test.cjs` reads every published file. It fails on:
  - a language menu, a Spanish catalogue, `data-es` attributes or hreflang;
  - a switch on `'es'` or a `?lang=es` link;
  - Spanish punctuation;
  - any page that writes or removes the saved language.

  It also confirms that the old validators still accept earlier records.
- `npm run test:english:browser` sets the browser to `es-MX`, adds `?lang=es` to every address and saves a Spanish preference. Then it:
  - opens all 36 released HTML pages at 320, 375, 768 and 1440 px (144 layouts);
  - follows every same-site link reachable from the homepage, including query and hash routes (119 routes).

  On each page it checks:
  - `<html lang="en">` and no language control or alternate;
  - the saved preference is still `'es'`;
  - no Spanish in visible text, accessible names, titles, placeholders, alt text or options;
  - no failed same-site load and no page error.

  It also fills 88 questions in 24 diagnostics and projects with an explanation that contains Spanish words. Those words must reach the on-screen report, the Markdown export and the printable report exactly as written.
- A one-off audit (not part of CI) used the same browser settings in all four appearances.
  - It followed every same-site link from the homepage: 119 routes per appearance, 476 page loads.
  - On every route in Classic, and on the homepage in the other three, it clicked each visible control whose label does not mention deleting, downloading, recording, signing in or sending (1,435 clicks), and read the page again after each click.
  - It found no Spanish, no page error and no failed same-site load.
- All 18 browser suites were updated and pass. Instead of switching to Spanish, they now reopen pages with `?lang=es` and a saved Spanish preference, and check that learner drafts, records and the preference are unchanged.
- A static scan of every released text file found Spanish in one place only: the grader's unit spellings described above.

## Gaps

- The detector looks for Spanish punctuation, accented vowels outside a list of proper names, and a list of common Spanish words. A short Spanish phrase with none of these, such as a single unaccented word, could pass. The static scan and the deleted catalogues make this unlikely, but it is a pattern check, not a reading by a person.
- The click-through audit avoids controls that delete, download, record or send data. Text that appears only after such an action was checked through the static scan, not in the browser.
- Safari, Firefox and real phones were not part of this check.
