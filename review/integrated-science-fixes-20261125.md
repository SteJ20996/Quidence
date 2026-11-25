# Integrated Science 6–10: independent review and the first round of fixes · 2026-11-25

The repository owner said the middle-school science course still needed work. A reviewer who had not written the course read all 24 lessons. The reviewer ran every model at the settings each step asks for, and checked the understanding problems, the foundation items and the activity drawings. This note records what the review found, what this first round fixes, and what the next rounds will do.

## What the review found

**Content.**
- About 80 numbers and claims were checked and found correct. Among them:
  - van Helmont's willow;
  - the island fox counts, Mc1r and the Moritz resurvey;
  - bond energies and grams of CO₂ per megajoule;
  - molecular speeds, Arrhenius factors, seawater carbonate chemistry and the magnetic polarity time scale.
- Apart from lesson 22, every model reproduces the numbers its text quotes.

**Weaknesses.** The weaknesses are in teaching and assessment, not in content. They are, in order of importance:
1. **Predictions answered above the question.** In about half of the 96 steps, the paragraph above a prediction already gives the answer. For example, lesson 22 says "10 °C more roughly doubles the rate", then asks how much faster a reaction is at 35 °C. Several explain prompts also state the result.
2. **Checks that repeat the lessons.** At least 15 of the 48 "new situation" questions repeat a step's prompt or a worked example.
3. **Answer length gives the key away.** In 49 of 72 questions the right option is the longest, and many wrong options are implausible.
4. **A thin understanding check.** The understanding check covers 5 of the 24 lessons, and none from grades 7 or 8.
5. **One model error.** Lesson 22's lab compared each activation energy with itself at 25 °C. So a lower barrier, which is what a catalyst gives, looked *slower*.

The first two points were checked here directly. Lesson 22's `rate()` divided by each barrier's own rate at 25 °C. The lesson 22 text and prediction quoted above appear as described.

## Round 1: errors and misleading setups (this change)

| Lesson | Problem | Fix |
| --- | --- | --- |
| 22 Reaction rates | The graph and readout implied that all barriers share one reference, so lowering the barrier seemed to slow the reaction | The graph now compares each reaction with itself ("× its own rate at 25 °C"). A new readout compares barriers at the same temperature, for example "40 kJ/mol is 49.6 times as fast as 50 kJ/mol". Step 3 asks the learner to read it. At 25 °C, 40 kJ/mol is about 1.0 × 10⁷ times as fast as 80 kJ/mol. |
| 3 and 18 | Lesson 3 uses 10 °C per km and lesson 18 uses 6.5 °C per km, with no explanation | Lesson 18 now explains the difference. A rising bubble of cloud-free air cools about 10 °C per km. Rising air that forms clouds cools more slowly, so the air around a mountain averages about 6.5 °C per km. |
| 2 Heating ice | The energy slider stopped at 800 kJ, but boiling away 500 g takes 1,525 kJ. After step 1 (500 g), step 2's "whole range" cut off the boiling plateau. | The slider goes to 1,600 kJ and the axis scales with the mass. Step 1 still uses 500 g, because only then does warming the ice span 20 kJ. |
| 9 Speed and crashes | The prompt asked about a graph of "energy against mass" that does not exist | It now refers to the energy graph and its 1,000 kg comparison line |
| 16 Inheritance | One fixed sample per size, so a learner could not see small samples vary | A "Sample" slider draws 10 different samples. Sample 1 is the earlier fixed sample. Three of the ten samples of 4 have no white offspring, close to the expected (3/4)⁴ ≈ 32%. |
| 20 Heat flow | Step 4 compared the energy from water and iron, but they cooled by different amounts | The readout gives energy for each degree cooled: 0.84 kJ for water and 0.09 kJ for iron, the ratio of their specific heats |
| 24 Ocean acidification | A model value (a drop of 0.14 at 420 ppm) was stated as fact | Now said to be the model's value, with a note that estimates from measured seawater are a little smaller |
| 12, 18, 6 | Lesson 12: an untestable "travels farther" prompt. Lesson 18: step 3's settings never reached the summit. Lesson 6: "atomic masses come in high school", though lesson 5 taught them. | Reworded; lesson 18 step 3 starts the band at 3 km |
| 19, 20 | Lesson 19 sent learners forward to lesson 20 for Q = m × c × ΔT, which lesson 2 already taught | Both now refer back to lesson 2 |
| 2, 23, 24 | Terms that were never defined: kJ, albedo, IPCC, upwelling, µmol/kg | Each is defined where it first appears |
| 1, 2, 5, 6 | Uneven safety notes | Added where missing:<br>• cheek-cell hygiene;<br>• goggles and a heat-proof beaker;<br>• an adult to pour 60 °C water;<br>• eye protection, and opening a capped bottle slowly |
| All | Every science question said a reviewer "should judge the mathematics" | Science questions now say "the science" |

**Saved work.** Lesson 16 gains a lab setting. A record saved before it opens with the new setting at its default. Every saved answer and setting is kept, and a test checks this. The same rule now applies to any course whose lab gains a control.

**Checks.** New tests cover:
- the barrier comparison, including that a lower barrier is faster at every temperature;
- that the heating axis and slider reach the end of boiling for every mass;
- the energy per degree;
- the ten samples of lesson 16;
- the upgrade of an older record;
- the safety notes.

## Round 2: ask before telling (this change)

**How each step works now.** Each step opens with its prediction. Only the step's title and its question show, and the model panel says it will open after the prediction.
- The learner either writes a prediction (up to 500 characters) or chooses "I'm not sure yet". The step's text, its activity and the model then appear.
- The saved prediction stays above the text and is never replaced. The activity list no longer asks for it again.
- A step counts as opened only after this. So the fresh questions, which need all four steps opened, come after four predictions or four "not sure" answers.
- The lesson's feedback page lists the step predictions, and so does the Markdown report. The JSON export holds them with the rest of the record.

**Scope.** This applies only to courses that set `predictFirst`, which is only Integrated Science.

**Saved work.** Predictions are stored per lesson as four entries, each empty or `{text, unsure, at}`, and are validated when a record opens. A record saved before this change has no step predictions and still opens: every answer is kept, and its steps ask for predictions only if they have not been opened yet.

**Prompts that gave the answer away.** 33 of the 96 "explain" prompts stated the result the step's own prediction asks for. Examples:
- "Explain why a full moon rises at sunset" followed "About what time does a full moon rise?"
- "Explain why doubling the efficiency gives eight times as much energy" followed a question asking how many times as much.

Each one now asks the learner to explain what they read in the model: "Use the view from above to explain the rising time you found."

**What this does not fix.**
- **"Not sure" at every step.** A learner can still choose "not sure" at every step. That is deliberate: forcing a guess can turn a prediction into noise.
- **Effort.** Nothing checks whether a prediction was thought through.
- **The text still gives the answer.** Once shown, the step text still answers the prediction. That is now the intended order: the guess first, then the evidence, then the explanation.
- **No evidence for this course.** The research on predicting first (Crouch et al., 2004) comes from university physics demonstrations, with a teacher in the room. Whether a written prediction does the same for 11–16-year-olds working alone has not been tested here.

## Round 3: new questions, with every earlier answer kept (this change)

All 72 lesson questions are revised: each lesson's question before the lesson and its two fresh questions after it.
- **Fresh questions use new situations.** They put the lesson's idea into a context and with numbers that appear nowhere in the lesson. Examples:
  - a potato cut into cubes (lesson 1);
  - Santa Ana winds (lesson 3);
  - an echo sounder in Monterey Bay (lesson 12);
  - a sealed globe ecosystem (lesson 13);
  - magnesium nitride (lesson 21).

  No question shares a run of more than 7 words with its lesson's text, predictions, tests or prompts.
- **Wrong options are known misconceptions or typical errors.** Examples:
  - "warm water lowers the energy a reaction needs";
  - 10 °C per km instead of 6.5 °C per km;
  - adding growth factors instead of multiplying them;
  - "humans evolved from today's chimpanzees";
  - "the next seed is due to be white".

  Many such ideas are documented in studies of students' thinking, among them:
  - Driver, Squires, Rushworth and Wood-Robinson (1994);
  - Bishop and Anderson (1990) on natural selection;
  - Baxter (1989) on Moon phases;
  - Hestenes, Wells and Swackhamer (1992) on forces;
  - Boyes and Stanisstreet (1993) on the greenhouse effect and the ozone layer.
- **Option lengths are balanced.** The right answer is now the longest option in 17 of 72 questions (24%), down from 49. In every question the longest option is at most 1.25 times the shortest.
- **Numbers are checked.** Every number comes from the course's own models, and the lab can be set to every setting a question names. Real-world facts were checked:
  - the October 2023 eclipses;
  - Venus and Mercury;
  - mustard plants flowering earlier after drought (Franks, Sim & Weis, 2007);
  - trout removal and frog recovery in Sierra lakes (Vredenburg, 2004).

**How saved answers are kept.** A saved answer is stored by question id and option, so changing a question in place would attach old answers to wording the learner never saw.
- **New ids.** Each revised question has a new id ending in `-r2` and names the version-1 question it replaces.
- **Frozen wording.** The version-1 wordings are kept frozen in the course content, and a test fails if they change.
- **Upgrade.** A record saved under version 5 opens under version 6 with every answer unchanged, and an event notes the revision.
- **Finished lessons stay finished.** A lesson counts as done when each question, or its earlier wording, has been answered. Learners who finished are not asked again.
- **Unfinished lessons.** A half-finished lesson asks only the questions still unanswered, in their new wording.
- **Display.** The feedback page, the summary and the reports show each answer with the wording it answered, and say so when that wording is an earlier one. The JSON export includes the retired definitions.
- **Scope.** The engine change works for any course that later revises questions; only Integrated Science uses it so far.

**Gaps.**
- **No item statistics.** No learner has answered the new items, so their difficulty and how well they separate understanding from guessing are unknown.
- **Transfer varies.** A few questions are near transfer, using the lesson's model with new numbers (3.1, 7.1, 15.1, 20.1). Item 13.2, the sealed globe, is close to step 4's idea.
- **Difficulty varies.** Some items ask more than the grade usually does: the √2 speed ratio in grade 7 (5.2), and multiplying rate factors (22.1).
- **Unchecked citations.** The drafts named other studies for some misconceptions. Only the sources above were checked, and only those are cited here.

## What comes next

| Round | Work | Why |
| --- | --- | --- |
| 2 (done above) | Ask before telling. | Predicting before a demonstration improves learning over watching it. Crouch, Fagen, Callan and Mazur (2004) found that students who predicted the outcome of physics demonstrations understood them better afterwards than students who only watched. The predict–observe–explain sequence (White & Gunstone, 1992) depends on the prediction coming first. |
| 3 (done above) | Rewrite the checks as new situations, with wrong options drawn from known misconceptions and options of similar length | Item-writing guidelines ask for plausible distractors based on common errors, and options of similar length (Haladyna, Downing & Rodriguez, 2002) |
| 4 | Add understanding problems for grades 7 and 8 and the other uncovered units, as a new bank version | Four problems now cover 5 of the 24 lessons |
| Later | Give lesson 8's fox model a chance of dying out | The model has no chance events, so captive breeding adds only two years and looks like a waste. Yet keeping populations of about 15 foxes from dying out by chance was its real purpose. A chance model needs choices of its own (bad years, an Allee threshold), so it is a separate piece of work. |

## Gaps

- **No learners have tried the course.** Readability scores (Flesch–Kincaid grade 6.3 to 10.9 by lesson) say nothing about whether learners understand it.
- **This round changes no questions.** The length cue and the repeated checks remain until round 3, so current results from the questions still overstate understanding.
- **The lesson 22 readout is a contrast between two models.** It gives two reactions the same collision factor, which real reactions with and without a catalyst need not share. The note says so.
- **The mathematics behind the lessons is still understated.** The prerequisites the course page lists (whole numbers, decimals, ratios and simple formulas) leave out several things the lessons use:
  - logarithms (lessons 4 and 24);
  - square roots (lesson 5);
  - scientific notation (lesson 19);
  - an exponential (lesson 22).

  This will be addressed with the round 3 rewrite.

## Sources
- Baxter, J. (1989). Children's understanding of familiar astronomical events. *International Journal of Science Education*, 11(5), 502–513.
- Bishop, B. A., & Anderson, C. W. (1990). Student conceptions of natural selection and its role in evolution. *Journal of Research in Science Teaching*, 27(5), 415–427.
- Boyes, E., & Stanisstreet, M. (1993). The "Greenhouse Effect": Children's perceptions of causes, consequences and cures. *International Journal of Science Education*, 15(5), 531–552.
- Driver, R., Squires, A., Rushworth, P., & Wood-Robinson, V. (1994). *Making Sense of Secondary Science: Research into Children's Ideas*. Routledge.
- Franks, S. J., Sim, S., & Weis, A. E. (2007). Rapid evolution of flowering time by an annual plant in response to a climate fluctuation. *PNAS*, 104(4), 1278–1282.
- Hestenes, D., Wells, M., & Swackhamer, G. (1992). Force Concept Inventory. *The Physics Teacher*, 30(3), 141–158.
- Vredenburg, V. T. (2004). Reversing introduced species effects: Experimental removal of introduced fish leads to rapid recovery of a declining frog. *PNAS*, 101(20), 7646–7650.

- Crouch, C. H., Fagen, A. P., Callan, J. P., & Mazur, E. (2004). Classroom demonstrations: Learning tools or entertainment? *American Journal of Physics*, 72(6), 835–838.
- Haladyna, T. M., Downing, S. M., & Rodriguez, M. C. (2002). A review of multiple-choice item-writing guidelines for classroom assessment. *Applied Measurement in Education*, 15(3), 309–333.
- White, R., & Gunstone, R. (1992). *Probing Understanding*. Falmer Press.
- U.S. Standard Atmosphere (1976). NOAA, NASA and USAF: a lapse rate of 6.5 K per km in the lower atmosphere.
