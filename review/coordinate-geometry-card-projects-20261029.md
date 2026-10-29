# Coordinate Geometry card: projects link · 2026-10-29

The homepage card for Coordinate Geometry now has an "Explore coordinate projects" link, like the project link on every other card. A post-release check found the card had four links where the others have five. The two guided projects could only be reached through "Start Coordinate Geometry", which now opens the lessons first.

## Cause

The card builder hid the project link for courses marked as project-only. That made sense while the course had no lessons and its main link was "Explore coordinate projects". When the lessons were added, the main link became "Start Coordinate Geometry", but the project link stayed hidden.

## Changes

- **Homepage card:** the project link appears for a project course that also has lessons. It uses the existing English and Spanish text.
- **Course page:** the link opens `courses/coordinate-geometry/#projects`, which shows the overview and scrolls to the two projects. This holds even when the saved view is an open project. A `#projects` hash change on the course page does the same.
- **Classic layout:** at 960px and wider, Classic aligns every card on the same rows. With all five activity links, the card has no free row for its "High school → university bridge" label, so Classic hides the label there.
  - I tried placing the label under the title instead. At 960px, and at 1024px with CI's DejaVu Sans fonts, "Coordinate Geometry" wraps to two lines, so the label would either overlap the title or change the row height of every card.
  - The label remains in the other three appearances and in Classic below 960px. The course page still describes the course as a bridge.

## Checks

- **Card heights:** in Classic, every card has the same height as on main at 960, 1024, 1280, 1440, 1920 and 2560px. This holds in English and Spanish, with both the local Inter font and CI's DejaVu Sans.
- **Coordinate Geometry suite:** checks the link text and target. It also checks that the course page lands at the two projects, both from the homepage after a project was open and after a hash change.
- **Appearances:** in all four, the card shows five links at 1440px in English and at 375px in Spanish, with no horizontal overflow.
