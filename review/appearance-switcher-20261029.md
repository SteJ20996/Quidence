# Appearance switcher · 2026-10-29

The appearance bar at the top of every page now shows what each appearance looks like. It also takes much less space on phones. The repository owner chose this design from a comparison of the current bar and two options.

## Before

- Each choice had a 15px two-colour dot. Classic and Learning Atlas both used lavender with a dark half, so they were hard to tell apart. None of the dots showed type, corners or illustration style.
- The selected choice was filled with the theme's dark colour and white text, which drew more attention than the page.
- On a 390px phone the bar was about 164px tall: label, two uneven rows of pills, and the note. On some widths the pills wrapped three and one.

## Now

| Width | Layout |
| --- | --- |
| 960px and wider | One row: label, four choices, note. |
| 601 to 959px | Label and note on the first row; the choices in an even grid below (2 × 2, or one row of four from 900px). |
| 600px and narrower | One button with the current appearance, about 61 to 72px tall depending on the theme. It opens the four choices as a 2 × 2 grid; choosing one closes it and returns focus to the button. Escape or a click outside also closes it. |

- **Previews:** each choice shows a 40 × 29 preview of its appearance.
  - Classic: a square card with a teal button.
  - Paper Explorer: a folded paper page with a leaf and a wavy line.
  - Learning Atlas: a map grid with an italic serif "Aa".
  - Geometric Studio: a coral circle, a mint quarter and a lavender triangle.
- **Selected choice:** the theme's tint, an outline and a check badge on its preview. The font weight never changes, so no control moves when the appearance changes. The theme test still checks this at 960 to 2560px in English and Spanish.
- **Phone button:** its accessible name says "Appearance: Paper Explorer. Change appearance" (or the Spanish equivalent). It reports `aria-expanded`.
- **Paper Explorer and Learning Atlas:** their homepage bars keep their own minimum height (70 and 72px).

## Tests

- **Shared helper:** `scripts/theme-choice.cjs` opens the phone menu when it is showing, then picks a theme. The nine browser suites that change appearance use it, because phone widths now hide the choices until the menu opens.
- **Phone menu:** `test-themes-browser` now checks that:
  - the phone bar starts collapsed and is at most 80px tall;
  - the open menu is an even 2 × 2 grid;
  - Escape closes it and returns focus;
  - choosing closes it, and the button's name follows the choice.
- **Desktop choices:** the same test checks that every desktop choice has a preview and that only the selected one shows the check badge.
- **Control sizes:** on every public page at 320px, the visible controls are now the phone button. It must be unclipped and at least 44px tall.
