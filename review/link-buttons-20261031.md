# Standalone links become buttons · 2026-10-31

On the Cross-disciplinary Projects page, "All subjects", "Related Intuition Lab activity ↗" and "Review my work ↗" looked like hyperlinks: underlined or plain text in a toolbar. They are now buttons in the current appearance. The same problem was found and fixed on the other released pages.

## The rule

A link or action that stands on its own looks like a button: it has a border or a fill, and no underline. "On its own" means in a toolbar, a header, a course navigation strip, or a paragraph of its own.

These stay as they are:
- links inside a sentence, such as "Save or delete records" in the records banner;
- links in a page footer, such as "Contact Quidence" and Coordinate Geometry's related courses;
- tab bars and lesson steppers ("Start here · 1 Equations · 2 Linear functions…"), activity lists and map labels, which have their own designs;
- icon buttons.

## What changed

| Where | Controls |
| --- | --- |
| Cross-disciplinary Projects | "All subjects", "Related Intuition Lab activity ↗" and "Review my work ↗" in the top bar; "Review my work ↗" under the step |
| Discrete Mathematics, Number Theory | "Check foundations ↗", "Test your understanding ↗" and "Open the proof toolkit ↗" in the top bar; "Review my work ↗"; "See the foundation proofs ↗" |
| Course navigation strip on every course and subject page | "← Choose a course ↗", "Field projects ↗", "Test your understanding ↗", "Check foundations ↗", "Saved reports ↗" and similar. This covers 8 courses (Pre-Algebra, Algebra I, Geometry, Algebra II, Basic Logic, Physics, Physics 1, Physics 2), the 6 subject pages (Visual Algebra, Linear Algebra, Game Theory, Calculus, Statistics, Pre-calculus), the Game Theory projects page, and the Linear Algebra vector and matrix pages |
| "Continue to…" links at the start of a course | For example "Continue with visual algebra activities →", "Continue to Pre-calculus →", "Explore two projects and a case study →" and "Need a function or trigonometry review? Explore Pre-calculus →" |
| Coordinate Geometry | "Check foundations · 15 questions ↗", "Test your understanding · 4 problems ↗" |
| Saved reports | "← All subjects", "Foundation checks" |
| Foundation checks, diagnostic problems, field projects | "← All subjects" |
| Records, data use and accounts pages | "Saved reports" and "Save or delete records" in the header; "Save, restore or delete local records →", "More about local records and report sharing" and "Choose your subject →" |
| Intuition Lab | "Quidence home" and "All explorations" take the same rounded shape as "Export my work ↓" |
| Math Voice Lab | "← Back to subjects", "Export field notes ↗", "Preview an example journey ↗" (no longer underlined), "Start another attempt ↗", and "Export notes ↓" and "About this demo" in the footer |
| Visual Algebra activities | "Hide list" / "Show list", "Skip this part", "Start a new session" |
| Linear Algebra | "Start a new session", "Skip for now", "Not studied yet", "Back to the introduction". The "Start here" tab was underlined; it now looks like the tabs beside it. |
| Calculus, Think in Motion | "✎ I have my own version" is a toggle button, filled while it is on |
| Homepage | Each card's "Test your intuition →" or "Related Intuition Lab activity →" link has the same size and shape as the card's other links. On Classic cards, "Shared school foundations · 15 questions →" is a button. "Open ChatGPT ↗" and "Open Claude ↗" sit as buttons beside "Copy my learning request". |

The Math Voice Lab and Think in Motion stay English-only, as the language policy requires; only their styling changed.

## How it looks in each appearance

One shared rule in `assets/appearance-layout.css` gives every one of these controls:
- the appearance's own paper color, border color and text color;
- the same corners as the appearance's other buttons:
  - Classic: 8 px;
  - Paper Explorer: uneven, hand-drawn corners of 8 to 10 px;
  - Learning Atlas: 4 px;
  - Geometric Studio: 24 px;
- a 44 px touch target;
- the appearance's soft color on hover.

Pages that already hide or arrange one of these controls keep doing so. For example, the Math Voice Lab hides its header actions on phones. A few places adjust the shared look:
- The Visual Algebra list toggle is smaller, so its heading still fits on one line.
- On homepage cards in the illustrated appearances, the Intuition Lab link matches the card's other links.
- On Classic cards, the foundation and Intuition Lab buttons keep within the rows the cards already reserve for them, so every card in a row stays the same height in English and Spanish.
- On phones, these buttons are a little smaller, so two short ones share a row. The Discrete Mathematics, Number Theory and Cross-disciplinary top bars wrap: links first, then "Review my work" or the toolkit, then the "Explore → … → Prove" line.

## Checking

- `scripts/link-button-audit.cjs` finds standalone links and actions that have no border and no fill, or that are underlined. `npm run test:themes:browser` now runs it on every released page in every appearance:
  - at 320 px in Spanish and at 1440 px in English;
  - with disclosures opened;
  - and on the homepage course cards.
- A separate sweep checked all 34 released pages and the homepage course cards in all four appearances, at 1280 px in English and 375 px in Spanish. It found no flagged control, no horizontal scroll and no page error.
- Not checked: Safari and real devices.

## Found but not changed

In Classic, the Math Voice Lab's "Teaching demo" label has white text on a light background, so it looks empty. This was already the case on the live site and is not a link, so it is left for a separate fix.
