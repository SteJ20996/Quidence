# Cross-disciplinary projects: Li Ye's round city · 2026-11-10

The Cross-disciplinary Projects section has a fourth project, "One round city, ten right triangles", at `cross-disciplinary/?project=cross-p04`. It is built on the first ten problems of Li Ye's *Sea Mirror of Circle Measurements* (*Ceyuan haijing*, 測圓海鏡, 1248). Those problems tell one story ten times: two people walk along two roads at right angles until each can just see the other past a round city wall (in problem 5, until their line of sight passes over the centre). Every answer is the same, a city 240 bu (步, paces) across, but the project asks the learner to find that out rather than announcing it. It derives all ten rules, explains why the answers agree, and finds the algebra behind four of them. It draws on Geometry, Algebra I, Coordinate Geometry and Number Theory.

## The project

| Step | Content | Courses |
| --- | --- | --- |
| 1 · The city inside the triangle | Problem 1 (320 and 600 from the north-west corner): c = 680. The triangle splits into three pieces of height r from the centre, so d = 2ab/(a + b + c) = 240. | Geometry, Algebra I |
| 2 · Centres on a side | Problems 2–5: the centre lies on the east leg, the south leg, the hypotenuse, or at the right angle, so only two pieces, or one, remain. c = 544 in problem 2; problems 2 and 5 give 240; the rule from the centre divides by c. | Geometry, Algebra I |
| 3 · Circles outside: take a piece away | Problems 6–8: the circle lies across one side, and that side's piece is subtracted. c = 408 in problem 6; problems 6 and 8 give 240. | Geometry, Algebra I |
| 4 · Half outside, checked with coordinates | Problems 9–10: the centre lies on a leg extended beyond the right angle. With the right angle at the origin, the hypotenuse is bx − ay − ab = 0, and the distance from (0, r) gives r = ab/(c − a). c = 153 in problem 9; problems 9 and 10 give 240. | Coordinate Geometry, Geometry |
| 5 · Why the answers agree | On one map, nine of the ten lines of sight lie on one line, the long side of problem 1's triangle, so those nine triangles are similar to (320, 600, 680) = 40 × (8, 15, 17). For (8, 15, 17), 2ab = 240, and a rule with divisor D gives k · 240/D for k × (8, 15, 17), so the city forces k = D (problem 6: 24). Problem 5 (180, 360) uses a second line, through the centre: 120/180 + 120/360 = 1. (8, 15, 17) is the triangle of the Nine Chapters' circle problem, whose circle is 6 across. | Number Theory, Geometry |
| 6 · Four diameters without dividing | (a + b + c)(a + b − c) = 2ab and (b + c − a)(a + c − b) = 2ab in a right triangle, so the circle inside has diameter a + b − c and the three outer circles have a + b + c, a + c − b and b + c − a. Problem 7: the learner chooses which sum gives its diameter (b + c − a). For 3-4-5: 2 and 12, product 24 = 2ab. | Algebra I, Geometry |

The names *gou* (the east–west leg), *gu* (the north–south leg) and *xian* (the hypotenuse) appear once, in pinyin, because the site is English only.

### The labs

As in the other projects, the labs start on other data (a 5-12-13 triangle) and show results only after the learner acts:
- **Steps 1–3:** the learner chooses a circle and moves the legs, then joins the centre to the corners. Pieces added are green; a piece taken away is orange and dashed. The lab writes the signed sum, for example ra/2 + rb/2 − rc/2 = ab/2. Step 1 starts on (8, 15), the Nine Chapters triangle, because on 5-12-13 each inside piece's area equals its side's length, a coincidence that could mislead.
- **Step 4:** a centre slides along an axis, and the lab shows its distance to the other leg's line and to the hypotenuse. It reports a touching circle only at the slider position nearest one of the two exact centres on that axis, and then draws that exact circle.
- **Step 5:** two views. *Li Ye's map* draws any problem's walks around one city and continues its line of sight across the map, so the learner can see that nine of the lines coincide. *Scale (8, 15, 17)* scales the triangle around a dashed circle 240 across, for any rule chosen from a list, until the rule's circle matches it.
- **Step 6:** the square on a + b holds the square on c and four copies of the triangle. Taking away the square on c leaves 2ab.

### Where it appears

- **Homepage:** the Cross-disciplinary Projects section has a fourth card. Its art, in each appearance, is the city with three of Li Ye's triangles drawn to scale: problem 1's around the city, and problems 7 and 8 at its eastern corners, which share corners with each other and with problem 1 in Li Ye's diagram.
- **Project page:** the picker lists four projects (24 steps). The card's related Intuition Lab activity is the Geometry one.
- **Catalogue line:** it now counts four cross-disciplinary projects.

## Checking the answers

`tests/cross-disciplinary.test.cjs` recomputes every answer without the rules in the proofs:
- **The story alone.** For each problem, the start (a corner, a gate or the centre of a city with centre (0, 0)) is written in terms of the radius r. r is then found where the line of sight is exactly r from the centre, or passes through it in problem 5. Every problem has the solution d = 240.
- **A second circle.** Problems 1 and 8 also have another solution, d = 1600 and d = 36. The same line of sight touches a second circle: the one across the hypotenuse in problem 1 and the one inside the triangle in problem 8. The text of the story does not rule these out; Li Ye's master diagram does. In both cases 240 times the other diameter is 2ab, the identity of step 6.
- **Exact hypotenuses.** Each hypotenuse is computed with whole numbers (BigInt), and each is checked to be exact.
- **The ten circles.** For 300 random triangles, the test measures the distance from each circle's centre to the three lines directly. It checks which lines each circle touches, on which side of each line its centre lies, and that the signed pieces add up to ab/2.
- **(8, 15, 17).** The ten divisors are 40, 32, 25, 17, 23, 24, 10, 6, 9 and 2. Each of the nine similar triangles is checked to be k × (8, 15, 17), with k equal to its rule's divisor.
- **Step 6.** The circles inside and across each side are computed from the textbook radius formulas K/s and K/(s − side), where K is the area and s the semiperimeter, for six right triangles.

`scripts/test-cross-disciplinary-browser.cjs` walks the new project at 1440 and 375 px:
- It compares every title and proof paragraph with the authored text.
- It checks that no lab starts on any of Li Ye's numbers.
- It presses every lab control, and checks the lab's statements for the joined pieces, the coordinate check, the scale lab and the square.
- It confirms the homepage card in all four appearances.

The browser test found a real error while it was written. The coordinate lab's "the distances agree" test used a tolerance taken from the slider's whole range, so in the x-axis view at x₀ = 2.5 it claimed a touching circle when the distances were 2.5 and 2.31. The lab now knows the two exact centres on each axis and reports a touching circle only at the nearest slider position.

## Second independent review

A second reviewer read the project against the Wikisource text of the *Ceyuan haijing* (volume 2 and the preface) and recomputed every number. It found no mathematical or lab error, and confirmed the data, names and rules of all ten problems, the preface date (1248) and the 170 problems. Its findings, all acted on:

| Finding | Change |
| --- | --- |
| Nine of the ten lines of sight are one line: problem 1's hypotenuse. Problem 7's walker, 80 bu east of the north-east corner, stands where problem 1's stands, 320 bu east of the north-west corner. So the similarity to (8, 15, 17) is forced by the diagram, and step 5's "That is how Li Ye chose nine of his ten triangles" was wrong. | Step 5 now starts from this fact, a new choice asks how many different lines of sight the problems use, and the lab has a map to discover it. The unit test checks that the ten lines of sight make exactly two lines. |
| The prompt and card announced "every answer is 240", which answered nine of the 27 fields; the card art said "d = 240 every time". | The prompt asks whether the ten problems agree; the card and its art no longer give the number; the browser test checks that labs 1–5 do not show 240 before the learner acts. |
| "The line of sight just touches the wall" is wrong for problem 5. | The prompt and approach say so. |
| The Dongyuan sentence read as Li Ye's words and over-stated what the preface says. | It now says that the preface says the book grew out of the nine containments of Dongyuan, that Li Ye does not list them, and that little is known of Dongyuan. |
| "East leg" and "south leg" do not fit problem 8, whose walkers go west and north. | The legs are the east–west and north–south legs; step 3 says to turn problem 8's picture half a turn. |
| "Half outside" was never explained. | The two circles are now "beyond the corner", and step 4 explains that Li Ye's names end in "half", with one reading of why. |
| Wording: step 2 said problems 2–5 "move the start"; the lab tabs ran 2, 3, 5, 4; the step 3 legend said "inside" for pieces that reach past the triangle; step 5 gave the centre as (120, 120) against step 4's axes; the coordinate lab printed "5·-6". | All fixed. |
| Problem 7's label "b + c − a =" gave away the formula; step 6's prompt said "compare it with 2ab"; the step 6 follow-up repeated its own proof. | Problem 7 is now a choice between three sums; the prompt says only "multiply out and simplify"; the follow-up asks for the 4b² pair. |
| Lab details: step 1's 5-12-13 coincidence, a coordinate slider of 1,000 steps, ten rule tabs filling six rows on a phone. | Step 1 starts on (8, 15); the slider has 200 steps and still snaps to the exact centres; the rules are a list. |

The reviewer could not confirm that Li Shanlan identified problems 2–10 as the nine Dongyuan rules. The project text no longer says so; the claim below is attributed to the Chinese Wikipedia article.

## Sources, and where they stop

- **The text.** The problems, numbers and methods (法曰) were read from the transcribed text of the *Ceyuan haijing* (volume 2, problems 1–10) in the 殆知閣 collection. Each problem's data were checked against its stated answer, and the unit test recomputes all ten from the story alone. The problems give only the rule, such as "以勾股相乘倍之為實，以較和為法" for problem 6: twice the product of the legs, divided by the hypotenuse plus the difference of the legs. They give no derivation.
- **"Dongyuan nine."** Li Ye's preface says that in later life he obtained the Dongyuan theory of nine containments (洞淵九容之說) and studied it day and night. Who or what Dongyuan was is uncertain. Encyclopedia summaries describe it as a person, a book, or a school linked with Quanzhen Daoism; a Korean *Journal for History of Mathematics* article on Jin–Yuan mathematics and Quanzhen Daoism takes the last view. Only abstracts and encyclopedia entries were read here. The project says only that the origin is uncertain.
- **The Nine Chapters.** Problem 1's rule, the circle inside a right triangle, is much older. The *Nine Chapters on the Mathematical Art* (chapter 9, problem 16) asks for the circle inside the right triangle with legs 8 and 15, and answers 6 bu; secondary sources (an MAA Convergence article and the exercise notes to Katz's history of mathematics) describe it, and the second reviewer read it on Wikisource. Liu Hui's 3rd-century commentary proves the rule by a dissection, which secondary sources describe; step 1's area argument is close to it in spirit. Li Ye's large triangle, (320, 600, 680), is 40 times that triangle.
- **Which nine.** Problem 1, the circle inside the triangle, is older. The other nine are commonly identified with the nine Dongyuan rules, following the 19th-century mathematician Li Shanlan (李善蘭), who also supplied derivations by similar triangles because the received text has none. The Chinese Wikipedia article on the *Ceyuan haijing* reports this. The project does not claim that problems 2–10 are exactly the Dongyuan nine, only that the book grew from them.
- **Method.** The area method used here (pieces of height r from the centre, added or subtracted) is a modern route, chosen because it gives all ten rules with one idea and connects to the area formula students know. It is not Li Ye's method. His own reasoning for these ten is not in the text, and the rest of the book works with his tianyuan algebra. Li Shanlan's similar-triangle derivations are another route.
- **Names.** The project uses pinyin (gou, gu, xian, Dongyuan jiurong) and English descriptions such as "across the east leg" or "half outside". The original vocabulary of sums and differences, such as 較和 (the hypotenuse plus the difference of the legs) and 大差, 小差 (the hypotenuse minus a leg), is richer than the English labels, and the project does not teach it.

## Gaps

- No students have tried the project, and no historian of Chinese mathematics has read it.
- The historical sources above were read in transcription and in summaries. The original woodblock editions and the modern annotated editions were not consulted.
- Signed area, a piece taken away because it lies outside, is a real conceptual step. Step 3 relies on the lab's picture to make it concrete. Whether that is enough for a high-school learner is untested.
