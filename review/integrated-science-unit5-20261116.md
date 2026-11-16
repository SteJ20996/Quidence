# Integrated Science 6–10, Unit 5 (grade 10, Chemistry in the Earth System) · 2026-11-16

This adds the fifth and last unit of *Integrated Science 6–10*. It has six lessons, one for each instructional segment of *Chemistry in the Earth System*. That is the chemistry course of California's high school Three-Course Model, in framework chapter 7. With this unit, all 24 planned lessons are open. The plan is in [integrated-science-plan-20261115.md](integrated-science-plan-20261115.md), and earlier units are described in the unit 1–4 notes.

## The six lessons

| # | Lesson | Model | Builds toward |
| --- | --- | --- | --- |
| 19 | Combustion: how much carbon dioxide comes from burning fuel? | Masses and moles for burning methane, octane or ethanol; energy from average bond energies | HS-PS1-7, PS1-4, PS3-1 |
| 20 | Heat flow: why does heat flow from hot to cold? | Hot water, iron or aluminum mixed with cold water in an insulated cup | HS-PS3-4, PS3-1 |
| 21 | Ions and charge: why does sodium pair with chlorine? | Shells, valence electrons and ion charges for five metals and five nonmetals | HS-PS1-1, PS1-2 |
| 22 | Reaction rates: why do reactions speed up when heated? | Relative rate from concentration, temperature and activation energy | HS-PS1-5 |
| 23 | Climate feedbacks: why can a small warming grow? | Warming from 1–8 W/m², with water vapor, ice and cloud feedbacks on or off | HS-ESS2-4, ESS2-2 |
| 24 | Ocean acidification: what does a drop of 0.1 in pH mean? | Surface seawater carbonate chemistry from 280 to 1,000 ppm, with sodium carbonate added as a hatchery does | HS-ESS2-6, PS1-6 |

Each lesson ends with a hands-on investigation, drawn to scale in `assets/science-investigations.js`. The drawings and their sizes are in [the illustrations note](integrated-science-illustrations-20261115.md).

## Alignment

- Each lesson's PEs come from its segment's box in framework chapter 7, and the unit test checks this. The unit's label in the lesson menu is "Grade 10 · Chemistry in the Earth System".
- **Dropped:** HS-PS3-2 was in the first plan for lesson 20. The lesson describes thermal energy as particle motion but does not model it, so the PE was dropped.
- **Kept after review, with added teaching:**
  - HS-ESS2-2: lesson 23 now gives albedo and sea-ice data to analyze.
  - HS-PS1-6: lesson 24 now has a control for changing the water's conditions.

## Site changes

- The course is now version 5. Records saved with 4, 8, 12 or 18 lessons open with the new lessons added and every answer kept.
- The homepage card says 24 lessons. Its description now reads "Model cells, energy, atoms, forces, ecosystems, and chemical reactions."
- **Card height:** The first draft of the description wrapped to five lines in DejaVu Sans, the font on the CI runners. That made the grade 6–8 row 945 px tall instead of 922 px, the failure seen on the first science pull request. The new text is four lines in both DejaVu Sans and Inter.
- The knowledge map and SEO lines now name chemistry and climate.

## Checking

`tests/integrated-science.test.cjs` recomputes the new models independently:

- **Burning:**
  - Moles and masses are recomputed from molar masses.
  - Mass is conserved: fuel + oxygen = carbon dioxide + water.
  - Energy = moles × heat of combustion.
  - Bond-energy estimates are within 3% of the measured values.
  - Gasoline gives more carbon dioxide per megajoule than natural gas.
- **Mixing:** The energy the hot sample loses equals the energy the water gains, for every material and several masses and temperatures.
- **Ions:**
  - Eight formulas are checked: NaCl, MgCl₂, Al₂O₃, CaF₂, AlN, K₂S, Mg₃N₂ and CaO.
  - Every pair's charges add to zero.
  - Each element's charge follows from its valence electrons.
- **Rates:**
  - The formula is e^(−Ea/RT) relative to 25 °C.
  - Doubling the concentration doubles the rate.
  - At 50 kJ/mol, 10 °C more gives about 1.9 times the rate.
  - A higher barrier is more sensitive to temperature.
- **Feedbacks:**
  - The rounds add up toward first ÷ (1 − f) for every combination.
  - Doubled carbon dioxide, 3.93 W/m², gives 3.42 °C with all feedbacks on.
- **Seawater:**
  - At each computed pH the alkalinity balances to 10⁻¹² mol/kg.
  - pH falls steadily with carbon dioxide: 8.17 at 280 ppm, 8.07 at 370, 8.03 at 420, 7.70 at 1,000.
  - When sodium carbonate is added, dissolved carbon rises by the amount added and alkalinity by twice that.
  - About 220 µmol/kg restores the carbonate of water at 1,000 ppm to its 280 ppm level.
- **Drawings:** The numbers written on two drawings are recomputed: the soda-can example (8.4 kJ, 14 kJ per gram, octane's 44.4 kJ per gram) and the 3.5 million ions along a 1 mm edge of salt.

## Independent review

A reviewer who had not written the lessons did the following:
- checked every statement against sources (NIST thermochemistry, OpenStax *Chemistry 2e*, IPCC AR6 WG1, NSIDC, Shannon's ionic radii, and the carbonate constants of Lueker et al. 2000 and Dickson);
- tried every step's settings;
- wrote a separate seawater solver with temperature-dependent constants;
- checked the answer keys, the PE claims and the safety of each activity.

It found 2 errors, 9 items that should be fixed and 12 minor ones. All were addressed:

| Finding | Change |
| --- | --- |
| **Error.** The seawater lab's note said the model's pH falls more than measured "because real surface water is cooler". Cold water holds less carbonate, so it loses *more* pH: from 280 to 420 ppm the fall is 0.141 at 25 °C and 0.157 at 2 °C. The "about 0.1" figure is for about 2000, when carbon dioxide was near 370 ppm; Jiang et al. (2019) estimate a fall of 0.11 from 1770 to 2000, largest in the Arctic (0.16). | The note now says the model falls by about 0.1 at 370 ppm, matching those estimates, and by about 0.14 at 420 ppm. Cold polar water has lost more and warm tropical water less. A test checks both numbers. |
| **Error.** Step 1 and question 1 treated "a drop of about 0.1" as today's value, while the lab showed 0.14 at 420 ppm. | Step 1 reads the lab at 370 ppm (about 2000) and then at 420 ppm. Question 1 says "By 2000…", and its explanation adds that today's drop is nearer 0.14, about 38% more hydrogen ions. |
| The explanation "more hydrogen per carbon, less carbon dioxide" fails for ethanol, which has more hydrogen per carbon than octane but gives more carbon dioxide per megajoule. | Step 4 explains that ethanol already contains oxygen: it is partly burned, so it releases less energy for each carbon atom. |
| The alcohol burner was unsafe as written: hardware-store denatured alcohol can be largely methanol, which is toxic and has caused flash fires when burners were refilled. The calculation also used Q = mcΔT before lesson 20. | The activity uses a tea-light candle, with an adult, a heat-proof surface, tied-back hair, and cooling before weighing. Its wax is compared with octane, at 44 kJ per gram. The text gives the 4.18 J per gram per degree it needs. |
| Water at 60 °C scalds in seconds. | The heat-flow activity and drawing use hot tap water no hotter than about 50 °C, on a steady surface. |
| "Atoms are most stable with a full outer shell" is a common misconception. Sodium's electron costs more energy to remove than chlorine releases by taking it. | The text says ions with full shells are especially stable, and that the large release of energy comes when the ions attract and pack into a crystal. |
| A refrigerator at 50 kJ/mol slows a reaction only about 4 times, while milk lasts weeks rather than a day. | The step uses 80 kJ/mol (about 10 times slower) and says real spoilage slows even more, because bacterial growth involves many reactions. |
| The hatchery step compared today's 420 ppm with 280 ppm, but upwelled water carries as much carbon dioxide as air at about 1,000 ppm (Feely et al. 2008; Barton et al. 2012). | The step sets 1,000 ppm. |
| HS-PS1-6 rested on one sentence: students could not change any condition. | The lab has a new control, sodium carbonate added in µmol/kg, modeled in a closed tank. Students add it until the carbonate ions return to their 280 ppm level, which takes about 220 µmol/kg. |
| HS-ESS2-2 asks students to analyze geoscience data, and the lesson gave none. | Step 2 gives NSIDC data: bare sea ice reflects about 50–70% of sunlight and open ocean about 6%. The September low has shrunk about 12% per decade since 1979, to 4.60 million km² in 2025; the record low was 3.39 million km² in 2012; and there has been no clear trend over the last two decades. Students work out how much more sunlight melted ice lets in, and what the recent data do and do not show. |
| A distractor, "warmth alone lowers the pH", is partly true for a closed sample. | It was replaced with a clearly wrong claim about oxygen. |
| **Smaller points:** "average energy" for temperature; "hot metal holds much less energy"; ocean heat "kept by greenhouse gases" (AR6 gives 91% of all the energy Earth has gained); sea ice "13% per decade" (NSIDC now gives 12.1%); the water vapor feedback includes the lapse rate; the lab leaves out the rise in collision frequency; "simple reaction" undefined; glow sticks not soaked first and safety; straw and cabbage-juice safety; a hot bulb, and LED bulbs that barely warm; anti-caking agents in table salt; "1 sodium for 1 chlorine"; HS-PS1-4's "absorption" never mentioned. | All fixed. Photosynthesis is now the example of a reaction that absorbs energy. |

One minor point was kept. Lesson 24 uses 280 ppm for the air before industry, the value its slider steps reach, while lesson 4 uses 278 ppm. The difference changes no number the lessons quote.

## Sources, and where they stop

- **Burning:**
  - Lower heating values: methane 802.3, octane 5,074 and ethanol 1,235 kJ/mol, from NIST standard enthalpies of combustion with the water as vapor.
  - Average bond energies as in common general chemistry tables: C–H 413, C–C 348, C–O 358, O–H 463, O=O 498 and C=O in carbon dioxide 799 kJ/mol. Tables differ by a few kJ/mol, which is why the estimates are only within a few percent.
  - About 8.9 kg of carbon dioxide per gallon of gasoline, from the US EPA.
  - Octane stands in for gasoline, which is a mixture.
- **Heat:**
  - Specific heats from OpenStax.
  - The ocean's 91% share of the energy Earth has gained since 1971, from IPCC AR6 WG1 Box 7.2.
- **Ions:**
  - Ionic radii (Na⁺ 0.102 nm, Cl⁻ 0.181 nm) from Shannon (1976).
  - Ionization energy and electron affinity from OpenStax *Chemistry 2e* §6.5 and §7.5.
  - The shell drawing is a simple model, and the lab says so.
- **Rates:** The Arrhenius equation. The lab treats a simple reaction whose rate is proportional to one concentration.
- **Feedbacks:**
  - Central feedback values from IPCC AR6 WG1 Table 7.10: Planck 3.22, water vapor with lapse rate 1.30, surface albedo 0.35 and clouds 0.42 W/m² per °C.
  - With the small remaining terms left out, these give 3.4 °C for doubled carbon dioxide. The IPCC's assessed best estimate is 3 °C, likely 2.5–4 °C; the lesson says both.
  - Sea ice data from NSIDC's 2025 minimum analysis. Albedo values come from NSIDC teaching material, seen through secondary pages.
- **Seawater:**
  - Constants: K0 (Weiss 1974), K1 and K2 (Lueker et al. 2000), KB and Kw (Dickson), at 25 °C and salinity 35, with alkalinity 2,300 µmol/kg.
  - Comparisons with measurements: Jiang et al. 2019 (*Scientific Reports* 9: 18624) and IPCC AR6 WG1 chapter 5.
  - The Whiskey Creek hatchery history: Barton et al. 2012.
  - The model has one temperature, and its water is in balance with the air until carbonate is added. Real surface water varies with temperature, upwelling, rivers and life, and the note says so.

## Gaps

- **HS-PS3-1** is only partly taught. Lessons 19 and 20 compute energy changes, but none follows energy through more than two parts of a system.
- **HS-ESS2-2's data** is a few numbers in the text, not a data set students graph.
- **The feedback model** gives the eventual warming. It says nothing about how long the warming takes.
- **The hands-on activities** have example readings, not readings from a class.
- **No students or science teachers** have tried the lessons.
