# Display fixes · 2026-10-30

These fixes come from a visual audit of quidence.com after the 29 October releases.

**What the audit covered:**
- Every public page and the new-subject entry points, 440 visits in total:
  - all four appearances at 1440 and 390px, in English;
  - Classic at 768 and 320px, in Spanish.
- A walkthrough of the new content:
  - every new foundation question, with feedback and the report;
  - the two new understanding checks;
  - the four Coordinate Geometry lessons and its projects section;
  - the Coordinate Geometry Intuition Lab activity in every appearance.

The audit found no page errors, failed requests, horizontal overflow or broken images. It did find five display problems.

## Fixed

1. **Classic homepage subject rail.**
   - Since Coordinate Geometry joined the subject list, the pinned rail needs about 1,000px of window height.
   - At 1440 × 900 the "Check my foundations" card was half hidden. At 1366 × 768 it could not be seen at all, and nothing showed that the panel scrolls.
   - The rail now stays pinned only while all of it fits. On shorter windows it scrolls with the page, so nothing in it is cut off.
2. **Coordinate Geometry: Intuition Lab card above the site header.** The card now sits below the header, before the page content, on the overview, the lessons and the projects.
3. **Coordinate Geometry lessons: underscore notation.** Formulas and readouts showed `x_B − x_A`. Point names now show as subscripts.
4. **Coordinate Geometry header: "Learning notebook" on two lines.**
   - On desktop the language menu took the full width of its row and pushed the link onto two lines.
   - The menu now has a fixed 150px width, so the link stays on one line in English and Spanish.
5. **Intuition Lab appearance bar.** `intuition/lab.css` still had rules for the old appearance bar. They caused three differences from every other page:
   - On phones the bar was 110px tall, with empty space around the menu button.
   - The label and note were smaller.
   - From 601 to 720px the label took its own row and the note was hidden.

   Those rules are removed, so the bar now matches every other page.

## Checked and left as is

- **English in Spanish reports.** Answer summaries and the copyable tutor handoff in Spanish reports use English. Older subjects do the same, and the localization test treats this English as intended.
- **"Dictate in English".** This button stays in English on Spanish pages, as AGENTS.md requires.
- **Classic homepage right rail.** On laptop windows it still scrolls inside itself, as it did before these releases.

## Tests

- **`test-home-map-browser`:**
  - Covers 1280 × 720, 1200 × 900, 1024 × 768 and 1920 × 1080, in English and Spanish.
  - Nothing in the subject rail is cut off at any of these sizes.
  - The rail is pinned only at 1080px.
- **`test-coordinate-browser`:**
  - The Intuition Lab card sits between the header and the main content, before and after a re-render.
  - No lesson shows `x_B`-style notation, and lessons 1 and 3 show subscripts in their formulas.
  - The notebook link stays on one line at 1280px in English and Spanish.
- **`test-themes-browser`:** On every public page at 320px, the collapsed appearance bar is at most 96px tall. That allows one row, or two when a wide font pushes the menu button under the label.
