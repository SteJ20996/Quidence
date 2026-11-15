# Integrated Science 6–10, Unit 2 (grade 7) · 2026-11-15

This pull request adds the second unit of *Integrated Science 6–10*: four lessons, one for each instructional segment of California's integrated grade 7. Unit 1 and the course itself are described in [integrated-science-unit1-20261115.md](integrated-science-unit1-20261115.md); the plan is in [integrated-science-plan-20261115.md](integrated-science-plan-20261115.md).

## The four lessons

| # | Lesson | Model | Builds toward |
| --- | --- | --- | --- |
| 5 | Particles in motion: what changes when a substance melts or boils? | Five substances (water, oxygen, carbon dioxide, methane, ethanol) from −250 °C to 150 °C: state at sea-level pressure, particle arrangement, typical speed √(3kT/m), and a ball-and-stick drawing of each molecule | MS-PS1-1, PS1-4 |
| 6 | Atoms in living things: where does a tree's mass come from? | Atoms and masses before and after photosynthesis, cellular respiration and burning methane, repeated 1–10 times | MS-PS1-5, LS1-6, LS1-7 |
| 7 | Moving plates: how fast do plates move? | Magnetic stripes for the last 5.2 million years and seafloor age against distance from a ridge, for spreading rates of 0.5–8 cm a year | MS-ESS2-3, ESS3-1 |
| 8 | Recovering a population: what limits a population, and how can it recover? | A fox population at its carrying capacity; eagles arrive in year 5; from year 10, move the eagles, release captive-bred foxes, or both | MS-LS2-4, LS2-5 |

## Alignment

The PE lists were checked by hand against the grade 7 segment boxes in framework chapter 5, and the unit test checks that each listed PE is in its segment's box. The first plan put MS-LS2-1 (resources limit populations) in lesson 8, but the framework places it in segment 3, so lesson 8 now builds toward the segment 4 PEs: changes to an ecosystem shift populations (LS2-4) and competing solutions are judged against criteria (LS2-5). Lesson 8 still uses carrying capacity, the idea behind LS2-1, but does not claim it.

## What changed in the site

- **Saved records.** The course is now version 2. A record saved with the four grade 6 lessons opens with the grade 7 lessons added and every answer, draft and event kept, through the engine's existing upgrade path; a finished record reopens at the course start, ready for lesson 5. A unit test builds such a record and checks the upgrade.
- **Course page.** The menu shows two unit labels. Lesson counts above seven are now written in words ("Eight starting points"), and the summary heading for this course reads "Connect the model to the world" instead of "to the mathematics".
- **Homepage, map and SEO.** The card says eight lessons and grades 6 and 7; its description and the map and SEO lines name the new topics.

## Checking

`tests/integrated-science.test.cjs` recomputes the new models independently:
- **Particles.** Typical speeds from √(3kT/m) with the physical constants, and each substance's state at every 5 °C step. Each formula's atoms are parsed from the formula itself, and its mass is checked against standard atomic masses. The values each step and question uses are checked: 615 and 719 m/s for water at 0 and 100 °C; at −100 °C oxygen is a gas, carbon dioxide a solid and ethanol a liquid; 640 and 410 m/s at 25 °C.
- **Reactions.** Atoms and mass are equal before and after for every reaction and repeat count, and the mass is recounted from the atoms. The test also checks 168 of each sugar's 180 u (93%) from carbon dioxide.
- **Seafloor.** Age = distance ÷ (10 × rate) over the whole control grid; the polarity intervals are ordered and disjoint; step 3's 8 million years and question 2's 3 cm a year.
- **Foxes.** The recurrence is recomputed step by step for four predation levels and all four plans. Step 2's year-10 population is checked, along with each plan's recovery year (20 for moving the eagles, 18 for both, never for releases alone) and that releases alone slow the fall but do not stop it.
- **The drawing.** Every motion arrow in the particle box has the same scale in every state.

## Independent review

A reviewer checked every statement and number against sources, tried every step's settings, and checked the answer keys and PE claims. It found no errors and confirmed all twelve answer keys. Its findings and what changed:

| Finding | Change |
| --- | --- |
| The particle drawing used a different arrow scale for each state, so arrows jumped at a change of state even though the temperature, and so the typical speed, did not. It taught that gas particles move faster than liquid ones at the same temperature. | One scale for every state; the state shows only in the arrangement. A test measures every arrow. |
| Lesson 6 leaned on atomic masses and on the equations of photosynthesis and respiration, which the assessment boundaries of MS-PS1-5 and MS-LS1-7 exclude. | The atom table is the core evidence; the step says balancing equations and atomic masses come in high school, and the lab note marks masses as beyond grade 7. Question 2 now gives each molecule's atoms in words. A sentence on animals rebuilding food into their bodies supports LS1-7. |
| "It is photosynthesis run backward" is a common misconception. | "Its overall equation is photosynthesis written backward, but cells use different steps, and plants do both." |
| Lesson 7's stripes are paleomagnetic evidence, which MS-ESS2-3's boundary does not assess, and no question used the PE's own evidence (fossils, rocks, coastlines). | The first question now asks how Mesosaurus fossils in Africa and South America are best explained. |
| Step 4 used the spreading lab for the San Andreas Fault, which is a transform fault with no seafloor spreading, and the readout then described spreading. | The step is now a calculation: 5 cm a year for a million years. |
| "Heat from magma near the surface" overstated The Geysers. | Hot rock a few kilometers down, left by magma that rose there (USGS). |
| ESS3-1's emphasis on resources being limited and non-renewable, and the oil in question 3, were missing from the text. | Step 4 explains Los Angeles Basin oil and that gold and oil, once used, are gone. |
| Lesson 8's only evidence was the made-up model, and it never named biodiversity or constraints (MS-LS2-5). | Step 2 gives the real declines (Santa Rosa about 1,780 to 15, San Miguel about 450 to 15, Santa Cruz about 1,400 to 55); step 3 says each island's fox is found nowhere else and names cost, time and public acceptance; step 4 gives the removal of about 5,000 pigs and about 4,000 foxes by 2015. |
| Smaller points: "faster on average" without the exception for melting and boiling; a smell does not cross a room by diffusion in seconds; extended structures are described but not modeled; "-250 °C" with a hyphen; methane drawn flat; "tree's wood" against a "water" choice (living wood is about half water); one note for all three reactions; the oxygen gas comes from water; the stripes were first seen as stronger and weaker magnetism; undefined "magnetometers", "veins" and "feral"; "Grey"; the 2016 claim not attributed; bald eagles "probably" deterred golden eagles; "1 foxes"; question 3's premise impossible in this model. | All fixed. |

## Sources, and where they stop

- **Substances.** Molar masses, melting and boiling points at 1 atm and carbon dioxide's sublimation point (−78.5 °C) from the CRC Handbook and NIST. The typical speed is the root-mean-square speed √(3kT/m), from the CODATA values of k and the atomic mass unit.
- **Willow.** Van Helmont's account (5 lb tree, 200 lb of soil, about 169 lb after five years, about 2 oz of soil lost), as quoted in histories of plant physiology.
- **Seafloor.** Polarity intervals rounded from the geomagnetic polarity time scale (GTS2012; within 0.02 million years of GTS2020). The Mid-Atlantic Ridge spreading rate (about 2.5 cm a year), the Atlantic's age (100–200 million years) and the Pacific–North America rate (about 5 cm a year, mostly on the San Andreas Fault) from USGS *This Dynamic Earth*. Mother Lode gold from hydrothermal fluids tied to subduction (Böhlke and Kistler 1986). The Geysers' heat source from USGS.
- **Island foxes.** Declines, recovery actions, the 2015 estimates and the 2016 delisting from the US Fish and Wildlife Service and the National Park Service. The model's growth and predation rates are made up; it shows the shape of the story, not the islands' numbers.

## Gaps

- **Assessment boundaries.** Lesson 5's speed formula is grade 8 mathematics, beyond MS-PS1-4's qualitative emphasis; it is supplied, not derived. Lesson 6's masses go beyond MS-PS1-5. Lesson 7's stripes go beyond the evidence MS-ESS2-3 assesses. Each is labeled in the lesson or its lab note.
- **Extended structures.** MS-PS1-1 includes extended structures such as salt and diamond; the lab draws only molecules.
- **Ecosystem services.** Lesson 8 names biodiversity and the constraints on solutions, but not ecosystem services, which MS-LS2-5 also names.
- **Chance.** The fox model has no chance events, which are the real danger to a population of 15; the note says so.
- **No students or science teachers** have tried the lessons.
