# Integrated Science 6–10: plan · 2026-11-15

The repository owner asked for a science course for grade 10 and below, aligned with the science taught in Southern California, as one combined course that covers the core of each unit. This note fixes the plan that the following pull requests build on.

## What "aligned with Southern California" means here

California adopted the Next Generation Science Standards as CA NGSS. The 2016 *California Science Framework* sets out course models for them:
- **Grades 6–8: the Preferred Integrated Course Model** (framework chapter 5). Each grade has four instructional segments, and each segment bundles performance expectations (PEs) from physical, life, and Earth and space science. San Diego County Office of Education lists the same segments for its districts.
- **High school: the Three-Course Model** (chapter 7): *Living Earth* (biology with Earth science), *Chemistry in the Earth System* and *Physics of the Universe*. Districts choose the grade order. San Dieguito Union High School District, for example, places *Living Earth* in grade 9 and *Chemistry in the Earth System* in grade 10.

So the course follows grades 6, 7 and 8 of the integrated model, then *Living Earth* and *Chemistry in the Earth System*. *Physics of the Universe* is left out: it is usually taken in grade 11, and Quidence already has Physics 1 and 2.

## Shape of the course

One course, *Integrated Science 6–10*, in five units. Each unit has one lesson per instructional segment, 24 lessons in all. Each lesson is built like the Physics Foundations lessons:
- one phenomenon;
- an interactive model with sliders;
- four steps (predict, test, explain);
- three questions, saved as a first prediction and two fresh questions;
- a next step.

Each lesson covers the core of its segment, not every PE in full. The homepage card and the course page say so: these are selected foundations, not a complete year of science.

## The 24 lessons

PE codes come from the instructional-segment boxes in framework chapter 5, extracted from the CDE PDF and checked against a published grade list (The Wonder of Science). They are re-checked by hand in each unit's pull request, and a lesson lists only the PEs whose core idea it teaches. Each lesson page shows its segment and says it "builds toward" these PEs: one lesson does not meet a PE in full. The high school codes come from chapter 7 tables as listed by The Wonder of Science; they are re-checked against chapter 7 in their pull requests.

### Unit 1 · Grade 6: systems in organisms and Earth's climate

| # | Segment | Lesson and phenomenon | Model | Core PEs |
| --- | --- | --- | --- | --- |
| 1 | IS1 Systems and subsystems | Why are cells so small? | Surface area for each unit of volume of a cube or a flat "cell" as its side grows | MS-LS1-1, LS1-2, LS1-3 |
| 2 | IS2 Weather from Earth's subsystems | Heating ice: where does the energy go? | A heating curve: energy in vs temperature, with plateaus at melting and boiling | MS-PS3-4, PS3-5, ESS2-4 |
| 3 | IS3 Regional climates | Why is one side of the mountains wetter? | Air rising over a range cools, clouds form, rain falls; a rain shadow beyond | MS-ESS2-5, ESS2-6, LS1-5 |
| 4 | IS4 Global warming and living things | Why does more carbon dioxide warm the planet? | Eventual warming and extra energy kept, about 3 °C and 3.9 W/m² for each doubling of carbon dioxide | MS-ESS3-5, LS1-5 |

### Unit 2 · Grade 7: matter cycles and energy flows

| # | Segment | Lesson and phenomenon | Model | Core PEs |
| --- | --- | --- | --- | --- |
| 5 | IS1 Made of atoms | What changes when a substance melts or boils? | Particles of five substances: state, arrangement and typical speed against temperature; a ball-and-stick drawing of each molecule | MS-PS1-1, PS1-4 |
| 6 | IS2 Matter cycles, energy flows | Where does a tree's mass come from? | Atoms and masses before and after photosynthesis, respiration and burning methane | MS-PS1-5, LS1-6, LS1-7 |
| 7 | IS3 Earth's resources and ecosystems | How fast do plates move? | Magnetic stripes and seafloor age against distance from a ridge | MS-ESS2-3, ESS3-1 |
| 8 | IS4 Sustaining biodiversity | What limits a population, and how can it recover? | A fox population at its carrying capacity, a new predator, and two recovery plans compared | MS-LS2-4, LS2-5 |

The first plan put MS-LS2-1 in lesson 8. The framework places it in segment 3, so lesson 8 builds toward the segment 4 PEs instead: changes to an ecosystem shift populations (LS2-4), and competing solutions are judged against criteria (LS2-5).

### Unit 3 · Grade 8: forces, space, evolution and waves

| # | Segment | Lesson and phenomenon | Model | Core PEs |
| --- | --- | --- | --- | --- |
| 9 | IS1 Objects move and collide | Why does speed matter so much in a crash? | Kinetic energy, reaction and braking distances, and braking force against mass, speed and road | MS-PS3-1, PS2-2, PS2-1 |
| 10 | IS2 Noncontact forces | Why does the Moon change shape? | The Sun, Earth and Moon seen from above, the phase seen from Earth, and the rising time | MS-ESS1-1, PS2-4 |
| 11 | IS3 Evolution | How does a rare trait become common? | Rock pocket mice: the share of dark mice over 200 generations on dark lava or pale rock | MS-LS4-4, LS4-6, LS3-1 |
| 12 | IS4 Sustaining biodiversity | How do scientists listen to whales? | A sound wave in air, seawater or steel: frequency, wavelength, amplitude and energy | MS-PS4-1, PS4-2, PS4-3 |

Lesson 10 claims MS-PS2-4 (gravity depends on mass) through its last step, but not MS-ESS1-2 (gravity's role across the solar system and galaxies), which it does not teach.

### Unit 4 · Grade 9: Living Earth

| # | Segment | Lesson and phenomenon | Model | Core PEs |
| --- | --- | --- | --- | --- |
| 13 | Ecosystem interactions and energy | Why are there so few top predators? | Energy passed up two to five levels of a food chain | HS-LS2-4, LS2-1 |
| 14 | Photosynthesis and respiration | Why does the air's CO₂ rise and fall each year? | A yearly cycle on a rising trend at Mauna Loa, Utqiaġvik and the South Pole | HS-LS2-5, LS1-5 |
| 15 | Evidence of evolution | Who is related to whom? | Two DNA sequences changing from a shared ancestor: a molecular clock | HS-LS4-1 |
| 16 | Inheritance of traits | Why can a trait skip a generation? | Punnett squares for pea flower color, with samples of 4 to 1,000 offspring | HS-LS3-3, LS3-1, LS3-2 |
| 17 | Structure, function and growth | How does the body hold its temperature? | Core temperature over two hours with no, weak, normal or strong negative feedback | HS-LS1-3, LS1-2 |
| 18 | Ecosystem stability and climate change | Where will a species live as it warms? | A species' band of elevations moving up a cone-shaped mountain | HS-LS4-5, LS2-6 |

The first plan also listed HS-LS2-2, LS1-7, LS4-2 and ESS3-5. The lessons do not teach them well enough to claim them, so they were dropped.

### Unit 5 · Grade 10: Chemistry in the Earth System

| # | Segment | Lesson and phenomenon | Model | Core PEs |
| --- | --- | --- | --- | --- |
| 19 | Combustion | How much carbon dioxide comes from burning fuel? | Masses and moles for burning methane, octane or ethanol; energy from average bond energies | HS-PS1-7, PS1-4, PS3-1 |
| 20 | Heat and energy in the Earth system | Why does heat flow from hot to cold? | Mixing hot water, iron or aluminum with cold water in an insulated cup | HS-PS3-4, PS3-1 |
| 21 | Atoms, elements and molecules | Why does sodium pair with chlorine? | Electron shells, valence electrons and ion charges for five metals and five nonmetals | HS-PS1-1, PS1-2 |
| 22 | Chemical reactions | Why do reactions speed up when heated? | Relative rate from concentration, temperature and activation energy (e^(−Ea/RT)) | HS-PS1-5 |
| 23 | Chemistry of climate change | Why can a small warming grow? | Warming from 1–8 W/m² with water vapor, ice and cloud feedbacks switched on or off | HS-ESS2-4, ESS2-2 |
| 24 | Ocean acidification | What does a drop of 0.1 in pH mean? | Surface seawater carbonate chemistry from 280 to 1,000 ppm of carbon dioxide, with sodium carbonate added as a hatchery does | HS-ESS2-6, PS1-6 |

The first plan also listed HS-PS3-2 for lesson 20. The lesson describes energy as particle motion but does not model it at the scale the PE asks for, so it was dropped. Lesson 23 models water vapor and clouds as well as ice, and asks students to work with albedo and sea-ice data for HS-ESS2-2. Lesson 24 claims HS-PS1-6 through its last step, where students add sodium carbonate to water at 1,000 ppm, as an oyster hatchery does, until the carbonate ions are restored.

## Pull requests

1. **PR① Infrastructure and Unit 1.** Course data and models, the course page with lessons grouped by unit, the homepage card with art in four appearances, the catalogue, SEO and saved records. Lessons 1–4.
2. **PR② Unit 2.** Lessons 5–8.
3. **PR③ Unit 3.** Lessons 9–12.
4. **PR④ Unit 4.** Lessons 13–18.
5. **PR⑤ Unit 5.** Lessons 19–24.
6. **PR⑥ Checks.** A foundation check, an understanding check and an Intuition Lab activity.

Each unit is added to the same saved course. A record saved before a unit was added opens with the new lessons and every earlier answer unchanged, as the course engine already does for added lessons.

## How the content is checked

The mathematics in each model is recomputed by tests, as in the other courses. Scientific statements cannot be recomputed that way, so each pull request also:
- cites a source for its quantitative facts (for example the latent heat of fusion of water, or global energy budget values) in its review note;
- has an independent reader check each statement and each answer key;
- states what the model leaves out (each model is a simplification, and saying how is part of the lesson).

## Limits

- One lesson per segment covers each segment's core, not every PE. Engineering-design PEs (MS-ETS1, HS-ETS1) are mentioned where a lesson touches them but are not taught as design projects.
- Interactive models cannot replace hands-on investigation. Lessons say which measurements a class would make.
- The PE assignments were extracted from the framework PDF by a script and a secondary site. Each unit's pull request re-checks them.
