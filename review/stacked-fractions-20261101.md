# Stacked fractions on screen · 2026-11-01

Fractions written with a slash are now drawn stacked, numerator over denominator, on every published page. This covers numbers such as 2/3 and 90/981, and expressions such as n/2, σ/√n, (n + 1)/(n + 2), 4(n + 1)/(n + 2) and C(n, n/2) / 2ⁿ. It applies everywhere: question text, options, readouts, tables, formula boxes, explanations, proofs and feedback, in English and Spanish. Units keep the slash.

The change is display-only. Nothing that is stored or exported changes, including content files, translations, answer keys, learner answers, saved records and exported reports.

## How it works

`assets/fractions.js` has two parts:
- **Parser:** finds fractions in a text and works out where each numerator and denominator begin and end.
- **Drawing layer:** wraps each fraction found in a page's text.

The drawn element keeps the original text as visually hidden text. Its numerator and denominator are drawn with CSS from data attributes, so:
- the page's text is unchanged, which keeps the browser tests and any text search working;
- copying a passage gives "(n + 1)/(n + 2)";
- screen readers read the slash form, because the drawn parts have empty alternative text.

**Translation.** The Spanish catalog matches whole text nodes. Splitting a text node to draw a fraction would break that match, and switching back to English would lose the original text. So on pages with `assets/i18n.js`, each translation pass:
1. puts the original text nodes back;
2. translates them as before;
3. draws the fractions again.

A browser test switches a Statistics readout from English to Spanish and back, and checks that the text is identical and the fraction is still drawn. The pages without the shared translation module run the same drawing from their own observer: the Intuition Lab, Coordinate Geometry and the two Calculus activity pages.

## What counts as a fraction

The parser reads the operand on each side of a slash.

**Numerators and denominators can be:**
- **simple terms:** numbers (including decimals), Greek letters, and letters with a subscript, factorial or accent (Dₙ, n!, x̄);
- **products:** written with a Greek letter or a subscript (nσ², mv₀²), or two lowercase letters that are not a unit (bh, ab);
- **roots:** √n and √(…);
- **brackets:** ( ), [ ] and |…|, with a coefficient or function in front: 4(n + 1), n(n + 1), C(n, k), P(A ∩ B), E[X], log₁₀(…);
- **side-by-side bracketed factors:** P(+ | S)P(S).

**Rules:**
- **Spaces around the slash:** allowed only when one side is a bracketed group, so C(n, n/2) / 2ⁿ converts and a counter such as "3 / 12" does not.
- **Nesting:** the outer fraction is drawn, and an inner one stays written with a slash inside it.
- **Unclear extent:** a form such as a/b(c), or a function written with a space as in log₁₀ 2 / …, keeps the slash.

**Always kept with a slash:**
- units such as m/s, km/h, kg·m/s, rad/s, N/m, J/(kg·K), Wh/20 W, items/100 m, min/lap and $/player;
- words such as and/or, y/o, Top/Left and distance/time;
- labels made of single capital letters (E/N, A/B, V/R);
- dates, paths and links;
- progress counters such as "2/4 responses";
- form fields, menus, charts (SVG) and code;
- a learner's own words: quoted reasons and answers.

**Checks on all site text:** the parser ran over every English and Spanish string in the catalog, 25,495 strings in all. It drew 507 distinct fractions, and every one was checked to be mathematics. Every slash it left alone was reviewed: units, words, labels, paths, and the ambiguous forms above. `tests/fractions.test.cjs` keeps:
- the explicit cases;
- a check over the whole catalog that no multi-letter unit is drawn as a fraction, and no plain number is drawn over a unit symbol.

## Sources and their gaps

- **Typesetting practice.** Mathematical typesetting usually prefers a slash for fractions inside running text and stacked fractions in displayed formulas. Knuth's *The TeXbook* gives this advice, because stacked fractions in a line are small and widen the line spacing.
  - This change deliberately goes the other way inside paragraphs too, for learners who read the stacked form more easily. The cost is visible: lines that contain a fraction are taller.
  - No classroom study was consulted for this choice, and this note does not claim that stacked fractions improve understanding.
- **What stays a judgment call.** Single-letter pairs are a judgment call:
  - lowercase pairs such as a/d are drawn;
  - capital pairs such as V/R are not, because the same shape is used for labels (E/N, A/B);
  - a few physics formulas, such as kQ/r and V/R, therefore stay slashed.

## Not changed

- Charts drawn as SVG, form fields, exported Markdown and JSON, and printed report documents.
- Answers are still typed with a slash, and their checking is unchanged.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test` passes, including the new `tests/fractions.test.cjs`.
- All 17 browser suites in `checks.yml` pass, and so do the Coordinate Geometry and Math Voice checks.
  - These suites measure overflow and clipping at 320 to 1280 px, so they also cover layout with stacked fractions.
  - The Intuition Lab suite checks the coin activity's explanation in both languages: the fractions are drawn, and the text is unchanged.
  - The localization suite checks the language switch.
- Checked by eye in English and Spanish at 720 and 375 px: a Probability proof, the Intuition Lab explanation and feedback, Statistics options and readouts, and the Probability foundation check.
- Not checked: Safari, older browsers without the CSS alternative-text syntax (there the drawn parts may also be read aloud), and real devices.
