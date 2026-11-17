# Quantitative Reasoning: gambling-harm notes and its place on the maps · 2026-11-17

The repository owner asked for two changes to the Quantitative Reasoning course:
1. State gambling harms in the course's key places.
2. Show the course on the maps as a branch of applied mathematics.

The owner also said that more quick-round templates will come later. The memorization gap recorded in the Part 1 to Part 3 notes therefore stays open, and this change does not address it.

## Gambling-harm notes

### Where they appear

| Place | What the learner sees |
| --- | --- |
| Course page, after the introduction | A box titled "About gambling": three paragraphs and a button to the helpline's online chat |
| Lesson 9, Expected value and ruin | The same box, with one paragraph for the lesson: every plan in the lesson loses points on average when the odds are against you, real gambling games are set up that way, and the best choice is not to play |
| Lesson 10, How much to stake | The same box, with one paragraph for the lesson: the Kelly share is for a known edge in your favor; casino games, sports betting and lotteries have an edge against you, so the right stake is zero; a stake that feels small can still grow into a harm |
| Quick rounds, before a round starts | One line: stakes are points, never money; gambling for money loses on average; the US helpline number |
| Both maps | The course's description ends "in points, never money" |

Lessons 9 and 10 carry the box because they are the two lessons that teach betting decisions: ruin and bold play, and how much to stake. Lessons 11 and 12 use coin-flip games and trades but do not teach staking, so they have no box. A test checks that only lessons 9 and 10 have one.

The box is an optional field of the course engine (`notice` on the course and on a lesson). No other course sets it, so no other page changes.

### What the notes say, and why

- **Gambling for money loses on average.** This is arithmetic, not a finding: casino games, sports betting and lotteries are priced so that the expected value of a bet is negative. Lesson 10 already said that the Kelly share is 0 for a negative edge. The note says it in plain words, outside the lesson.
- **Knowing the odds is not enough.** A course on expected value invites the belief that understanding the mathematics protects a person. The evidence does not support that belief:
  - Williams and Connolly (2006) taught university statistics students the mathematics of gambling. Six months later, the students calculated gambling odds better and resisted gambling fallacies better than a control group. Their gambling behaviour did not differ.
  - The note therefore does not present the course as protection.
- **Near misses and the illusion of control.** The note names features of gambling that keep people playing even when they know the odds:
  - **Near misses.** A near miss is a loss that looks almost like a win. Reid (1986) described its effect, and Clark et al. (2009) found that near misses raised the wish to keep playing and activated brain regions that respond to wins.
  - **The illusion of control.** Langer (1975) found that people act as though skill can control chance. For example, they valued lottery tickets they had chosen above tickets handed to them.
  - **Fast repeated bets.** Griffiths (1993) named how often a game lets a person bet as a structural feature of fruit machines.
- **Minors.** Gambling for money is illegal for minors in most places. Even so, problem gambling is measurable in adolescents. A systematic review found rates of 0.2% to 12.3% across countries (Calado, Alexandre & Griffiths, 2017). The course is for high school to early university, so some learners are minors.
- **The helpline.** The National Council on Problem Gambling's website was checked on 2026-11-17.
  - It lists the National Problem Gambling Helpline as 1-800-MY-RESET (1-800-697-3738), by call, text or online chat, at any hour and in confidence.
  - The older number, 1-800-GAMBLER, is no longer on the site.
  - The notes give the new number and link to the chat page, and they ask learners outside the United States to look for their own country's helpline.

### The course's own design

Simulated gambling is a concern in its own right. In one study, some players of free casino-style games moved to online gambling for money within six months, and spending inside the free game was the main predictor (Kim et al., 2015). The study is observational, so it cannot show that the free games caused the move. It still argues for keeping a course like this one unlike a casino:
- it has no reels, win sounds, streaks or prizes;
- a quick round scores accuracy and calibration, not points won;
- the labs show the average result and the spread of results, not a running balance that rises and falls.

None of this changed here. The note records it as a reason not to add game features later.

## Applied mathematics on the maps

| Map | Change |
| --- | --- |
| Knowledge map, University Maths | The layer "Computing and Probability" is now "Applied Mathematics". A new node, "Quantitative reasoning", sits in that layer beside Game theory, with a related link from Game theory. It is bound to the course, and its preview reads "Applied mathematics for deciding under uncertainty … in points, never money." The course's map entry moved from the Probability node in the Foundations view to the new node. The Probability node still lists the course as a use. |
| Learning map, Further Mathematics | A new course card, "Quantitative Reasoning", follows Statistics, with a link from Probability. A new link joins it to the branch card, renamed from "Data & computation" to "Applied mathematics". The branch card's description names the course as its entrance, and its topics list "Quantitative reasoning & decisions" first. The group now counts 8 course entrances. |

The tests check the layer label, the node and its binding, the preview text, the new card and both of its links, and the count of course cards (18). The browser suites confirm that the new node overlaps no other node and that no route crosses an unrelated card.

## Gaps that remain

- **Static notices are weak on their own.**
  - In a study of signs on gaming machines, pop-up messages that interrupted play were remembered better than static signs (Monaghan & Blaszczynski, 2010). The notes here are static text.
  - The lesson boxes appear in the lessons that teach betting decisions, which is nearer the point of decision than a page footer. Even so, nothing here measures whether learners read or remember them.
- **Education changes knowledge more than behaviour.**
  - A review of school gambling-education programmes found that most improved knowledge and corrected misconceptions, but the evidence that they change later gambling was limited (Keen, Blaszczynski & Anjoul, 2017).
  - Williams and Connolly (2006) point the same way.
  - The notes should therefore be read as honest information and a route to help, not as prevention.
- **One country's helpline.**
  - Only the US number is given. Numbers change: the national number itself changed from 1-800-GAMBLER to 1-800-MY-RESET.
  - Listing other countries would need a source for each and a regular check. Until then, the note sends other learners to "your country's gambling helpline".
  - A test fixes the current US number in place, so a change to it must be deliberate.
- **The understanding check.** Problem `qr-c04` asks for a Kelly share. It is in the published bank `quidence-challenges-14`, which is never edited in place, so it carries no box. The next bank version can add one.
- **What counts as applied.** Probability theory is also pure mathematics: it rests on measure theory. The label "Applied Mathematics" describes how the nodes in that layer are used on this map, not a claim about the field. The course itself is high school to early university. It sits in the University Maths view because its nearest topics (game theory, probability, statistics) are there, not because its level is university.

## Sources

- Calado, F., Alexandre, J., & Griffiths, M. D. (2017). Prevalence of adolescent problem gambling: A systematic review of recent research. *Journal of Gambling Studies*, 33(2), 397–424.
- Clark, L., Lawrence, A. J., Astley-Jones, F., & Gray, N. (2009). Gambling near-misses enhance motivation to gamble and recruit win-related brain circuitry. *Neuron*, 61(3), 481–490.
- Griffiths, M. (1993). Fruit machine gambling: The importance of structural characteristics. *Journal of Gambling Studies*, 9(2), 101–120.
- Keen, B., Blaszczynski, A., & Anjoul, F. (2017). Systematic review of empirically evaluated school-based gambling education programs. *Journal of Gambling Studies*, 33(1), 301–325.
- Kim, H. S., Wohl, M. J. A., Salmon, M. M., Gupta, R., & Derevensky, J. (2015). Do social casino gamers migrate to online gambling? An assessment of migration rate and potential predictors. *Journal of Gambling Studies*, 31(4), 1819–1831.
- Langer, E. J. (1975). The illusion of control. *Journal of Personality and Social Psychology*, 32(2), 311–328.
- Monaghan, S., & Blaszczynski, A. (2010). Impact of mode of display and message content of responsible gambling signs for electronic gaming machines on regular gamblers. *Journal of Gambling Studies*, 26(1), 67–88.
- National Council on Problem Gambling. National Problem Gambling Helpline. ncpgambling.org, checked 2026-11-17.
- Reid, R. L. (1986). The psychology of the near miss. *Journal of Gambling Behavior*, 2(1), 32–39.
- Williams, R. J., & Connolly, D. (2006). Does learning about the mathematics of gambling change gambling behavior? *Psychology of Addictive Behaviors*, 20(1), 62–68.
