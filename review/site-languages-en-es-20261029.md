# quidence.com in English and Spanish · 2026-10-29

The repository owner decided that quidence.com offers English and Spanish only. This change removes every Chinese text and Chinese language option from the published site. Repository documentation is not affected.

## What changed

| Area | Before | Now |
| --- | --- | --- |
| Coordinate Geometry course | lessons, projects and interface in English, Traditional Chinese and Spanish; a 中文（繁體） option | English and Spanish; the option is removed |
| Intuition Lab | 13 activities and the lab interface also in Traditional Chinese; a 中文（繁體） option | English and Spanish; the option is removed |
| Intuition Lab panel on course pages | also in Traditional Chinese | English and Spanish |
| Calculus Think in Motion | already English only, but carried unused Chinese strings | the unused strings are removed |
| Illustrated maps | carried unused Chinese labels | the unused labels are removed |
| Number Theory `data.json` | published an unused Simplified Chinese teacher guide for each project | the guide is no longer published; it remains in the source notes |
| Search | a `zh-Hant` page, hreflang link and `zh_TW` locale for Intuition Lab and Coordinate Geometry | English and Spanish only; the sitemap has no `zh-Hant` URLs |

The rebuilt release bundle contains no Chinese characters. A full-width plus sign (＋) remains on some buttons. It is a symbol, not language text.

## Saved work

Learner answers, drafts and recordings are not rewritten or deleted:
- **Coordinate Geometry:** a record saved with Traditional Chinese as its language still opens. The page shows it in English, and its answers and history are unchanged.
- **Think in Motion:** saved records that name Chinese as their language still validate.
- **Intuition Lab:** answers, reasons and reflections written in Chinese are kept word for word.
- **Locale requests:** a link with `?lang=zh-Hant`, `?lang=zh-TW` or another Chinese locale opens the English page.

## Policy

`AGENTS.md` now says that ordinary lessons, checks, projects, maps, reports and chooser pages use English and Spanish. It also says not to add other site languages. The rules for English-only voice and AI activities, and for preserving learner evidence, are unchanged.

## Tests

- **Language coverage:** the Coordinate Geometry and Intuition Lab tests now require every authored text to have English and Spanish, and nothing else.
- **Chinese requests and old records:**
  - A Chinese locale request opens English.
  - The language menus list only English and Spanish.
  - The overview shows no Chinese text.
  - An old Traditional Chinese record opens in English with its answers unchanged.
  - A Chinese reflection is stored verbatim.
- **Unchanged tests:** the tests that keep a learner's own Chinese words as evidence are unchanged.
