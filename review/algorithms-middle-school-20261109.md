# Algorithms, part 1: the course page and algorithms 1 to 5 · 2026-11-09

Algorithms is a new course (`courses/algorithms/`) in a new homepage group, Computer Science. It is planned as one numbered route from middle school to university, in four parts:

| Part | Content |
| --- | --- |
| 1 (this note) | The course page and the middle-school algorithms 1 to 5 |
| 2 | High school: 6 Binary search, 7 Merge sort, 8 Recursion (Tower of Hanoi), 9 Breadth-first search, 10 Depth-first search, 11 Greedy change |
| 3 | University: 12 Quicksort, 13 Dynamic programming, 14 Dijkstra's shortest paths, 15 Spanning trees, 16 P versus NP |
| 4 | A 15-question foundation check, a four-problem understanding check and an Intuition Lab activity |

The page is in English and Spanish. It is not a voice or AI activity, so the language policy's English-only rule does not apply. Code keeps its English keywords in both languages; in Spanish, the numbered steps translate their keywords (`para`, `si`, `mientras`, `devolver`) and keep the variable names.

## What a learner does

Each algorithm is shown three ways at once, and all three follow the same event:
- **Flowchart:** blocks and arrows. The current block is highlighted, and so is the arrow just taken. Every loop check and loop counter is a step of its own, so each move goes along an arrow of the chart; a test checks this for all five algorithms.
- **Steps:** numbered pseudocode. At a loop the line shows which pass it is on, and at an `if` it shows the comparison with the actual numbers.
- **Data:** the list or the number pair, with pointers (i, j), the value set aside (`key`) and the gap it leaves, plus a trace table that grows one row per comparison.

Below these, the same lines in **Python, Java and MATLAB** are highlighted as the trace moves. **Teach me to write it** walks through the code one pseudocode line at a time and explains each line in the chosen language. The code is shown, not run, as decided for this part. The page's security policy does not allow a browser Python interpreter without loosening it, so running code is left for a later decision.

**Predictions** are on by default:
- before each comparison, and once before the whole run, the learner predicts what will happen;
- "Skip predictions in this section" plays straight through;
- "Predict this step" still asks for one step on request.

Predictions are not scored, only counted.

## The five algorithms

| # | Algorithm | Default input | What the trace shows |
| --- | --- | --- | --- |
| 1 | Find the maximum | 4, 9, 2, 11, 7, 11, 3 | `best` and how often it changes; equal is not bigger |
| 2 | Linear search | 7, 3, 9, 12, 5, 18, 2, 11; target 5 | each check, stopping at the first match, or −1 |
| 3 | Bubble sort | 5, 1, 4, 2, 8, 3 | each pass, each comparison and swap, the sorted tail |
| 4 | Insertion sort | 6, 2, 5, 1, 4, 3 | the key set aside, the gap moving left, each shift |
| 5 | Euclid's algorithm | 252 and 105 | each division as a = q × b + r, then the pair (b, r) |

Learners can type their own input or ask for a random one.

## Think further: four observable behaviours, not a score

As decided, the system does not rate thinking ability. It records four kinds of action. Each algorithm has a card where the learner writes an idea in their own words (kept exactly as written and not scored), plus three cards:

| # | Find a counterexample | Find the bottleneck | Propose an improvement and test it | Predict the cost |
| --- | --- | --- | --- | --- |
| 1 | "Starting with best ← 0 gives the same answer." It fails exactly when every number is negative. | | Largest and smallest together: three methods, each tested on 300 lists. Pairs need 148 comparisons for 100 items instead of 198. | 999 comparisons for 1,000 items |
| 2 | "The returned position is the only place the target appears." A repeated target breaks it. | | Build a search on a sorted list from blocks and test it on 300 lists. A correct halving search needs at most 7 checks for 100 items. | 1,000,000 checks in the worst case |
| 3 | | Choose the box that runs most, in the flowchart. Every box's run count is then shown. | Stop early, compare a[i] with a[i + 2], or run right to left, each tested on 300 lists. | 4,950 comparisons on 100 items, even with early stopping |
| 4 | "Insertion sort always makes fewer comparisons than bubble sort." Decreasing lists tie it, and so does 2, 3, 1. | The busiest box depends on the list: the while check on most lists, the outer loop check on a sorted one. | | 999 comparisons on a sorted list of 1,000 |
| 5 | "A bigger pair never needs fewer steps." (13, 8) needs 5 steps and (1000, 500) needs 1. | | Replace repeated subtraction with one remainder; the other two changes give wrong answers, tested on 200 pairs. | About 30 steps below 1,000,000 |

Each counterexample is followed by a question about why it works. The answer shows whether the learner found the reason or only an example.

## Suggested next step

The suggestion names a numbered algorithm and lists the evidence it used:
- predictions matched, only after at least five;
- each challenge result;
- whether an idea was written.

The rules are fixed and readable in `core.js`. For example:

| Algorithm | Evidence | Suggestion |
| --- | --- | --- |
| #2 | A halving search passes all 300 tests | #3 Bubble sort, because the idea needs a sorted list, then #6 Binary search in the high-school part |
| #5 | The Fibonacci reason for the counterexample | #8 Recursion, and the Number Theory project "Square tiles and Euclid's shortcut" |

On #1 and #2, if fewer than 60% of at least five predictions matched and no challenge result decides, the suggestion is to stay with a new list; from #2 it also offers #1. Every algorithm on the route map can still be opened; the suggestion only explains a good next step. Algorithms 6 to 16 are drawn on the map as planned.

## On the homepage

- **Catalog:** a fourth group, Computer Science (`cs`), with one course card: Algorithms, "Middle school → university". The site now has 17 subject cards: 6 School Mathematics, 8 Further Mathematics, 2 Science, 1 Computer Science.
  - Algorithms has no foundation check, understanding check, field projects or Intuition Lab activity yet. Its card lists all three planned checks under "Not available yet" and links nowhere else.
  - The generic rule that gives other courses project and diagnostic links skips it.
- **Appearances:**
  - Classic: its own section between College Level and Cross-disciplinary Projects.
  - Paper Explorer, Learning Atlas and Geometric Studio: a Computer Science category button.
  - Card art in each appearance: a small flowchart with a loop beside a row of bars, with a compared pair and a pointer. The art contains no words.
  - The Paper category bar now wraps into two rows of three between 601 and 920 px, because six categories overflowed there.
- **Knowledge maps:**
  - The Classic map has a fourth chapter, Computer Science, with 11 nodes. Number algorithms offers both Algorithms and Number Theory, which links Euclid's algorithm to the Number Theory projects.
  - The cartoon map has a fourth world with 9 nodes.
  - Both maps are now titled "Knowledge Map" ("Mapa de conocimientos"), since they are no longer only mathematics and physics.
- **Learning request:** when Algorithms is the chosen subject, the box no longer offers to include the request in reports, because the course saves no reports.
- **Also registered:** SEO titles and descriptions in both languages, the sitemap, the sync policy label "Algorithms work", the static release and the source ledger.

## Saved work

Work is saved in this browser under `quidence:algorithms:v1`, in the same way as the other project courses:
- **Change in another tab:** a record changed in another tab is not overwritten, and new work is not saved.
- **Unreadable record:** it is kept until the learner exports it.
- **Export:** "Your session" exports Markdown notes in the current language. The notes quote ideas exactly and keep a check history with the input given each time.
- **Language switch:** switching language does not change the record or the learner's words.

## Sources and their gaps

1. **Watching is not enough; doing something with the animation is what helps.**
   - Hundhausen, Douglas and Stasko (2002, *Journal of Visual Languages and Computing*) reviewed 24 experiments. They found that how learners engage with an algorithm visualization matters more than how it looks.
   - Naps et al. (2002, ITiCSE working group report) proposed an engagement scale: viewing, responding, changing, constructing, presenting.
   - Here, predictions are "responding", own input and the improvement tests are "changing", and the search builder is a small step of "constructing". Nothing supports "presenting".
   - **Gap:** almost all of these experiments used university students and short sessions, and measured learning right after the activity. They say little about middle-school learners or about what is remembered weeks later.
2. **Predicting before seeing.** Byrne, Catrambone and Stasko (1999, *Computers & Education*) compared animation and prediction conditions for learning algorithms. They reported modest benefits, mainly on harder questions.
   - **Gap:** their setting was a single lab session, so it does not show whether predictions at every step help or tire learners. That is why predictions can be skipped per section, while one step can still be predicted on request.
3. **Tracing before writing.**
   - Lister et al. (2004, ITiCSE working group) found that many novices across several countries could not reliably trace short code.
   - Lopez, Whalley, Robbins and Lister (2008, ICER) found that tracing and explaining code are associated with writing it.
   - The trace table and the line-by-line guide follow this order: trace, explain, then write.
   - **Gap:** the association is correlational and comes from university courses. It does not prove that tracing practice causes better writing, least of all for younger learners.
4. **Flowcharts.** Shneiderman, Mayer, McKay and Heller (1977, *Communications of the ACM*) found no benefit from detailed flowcharts for comprehension, composition or debugging, compared with code alone.
   - The flowchart here is a second view kept in step with the numbered steps, as requested. It is not claimed to teach better than the steps.
   - **Gap:** those experiments used professional-style flowcharts of whole programs, not small charts synchronized with an animation, and no study of the synchronized form was consulted.
5. **Euclid's worst case.** Lamé's theorem (1844; Knuth, *The Art of Computer Programming*, vol. 2, §4.5.3) says that k remainder steps with a > b need b ≥ F(k + 1). The test suite checks the consequence used here:
   - below 1,000,000 the worst pair is (832,040, 514,229), with 28 steps;
   - it takes 29 steps when the smaller number is given first;
   - 20,000 random pairs never exceed 29.
6. **What the suggestion rules do not know.**
   - The rules were written for this course and have not been checked against learning outcomes.
   - A learner can reach the right reason for a counterexample by elimination among three options, and the rules cannot tell.
   - The 60% threshold for predictions, used only on #1 and #2, is a judgment call, not a calibrated value. The advice states the count it is based on, and the count is shown without a good or bad mark.

## Pre-release review

A separate review read the module and the page, recomputed the numbers, and checked the behaviour in a browser. These changes followed.

- **Wrong statements.**
  - Euclid improvement: halving was said to fail by removing "a factor of 2 that only one number has". It fails only when both numbers are even.
  - Fibonacci pairs: "every quotient is 1" is now "every quotient except the last".
  - Bubble sort, Python guide: in pass p, only p − 1 items are already in place.
  - "Kept for the teacher": the idea is kept in this browser.
- **Small inputs.** Plurals now read correctly for 1 item, 1 comparison, 0 or 1 out-of-order pairs and 1 remainder step. Bubble sort explains the sum for 2 and 3 items separately.
- **Euclid with a < b.** The first step only swaps the numbers, and the note now says so.
- **Two defensible answers.** For an all-negative list, "the largest number comes first" could also be true. The follow-up now asks why best ends at 0. The claim now also says that every item, including a[0], is compared, so the checker and the claim agree.
- **Flowchart and steps.** Bubble sort and insertion sort skipped their loop boxes, so the box that runs most often in bubble sort was never highlighted. Every loop check and counter is now a step.
- **A crash.** `?algorithm=constructor` or `toString` stopped the page from loading. Only the five algorithm names are accepted now.
- **Lost choices.** Redrawing the challenges reset dropdowns, radio buttons and typed counterexamples that had not been tested yet. Untested choices now survive redraws and language changes.
- **Playback.** Turning predictions off while Play waited on a prediction stopped playback for good. Playback now continues.
- **Leaving the page.** When saving is blocked, leaving the page now warns for any unsaved work, not only for a typed idea.
- **Linear search counterexample.** The workbench now accepts repeated numbers, so a counterexample can be traced there.
- **Suggestions.**
  - After a counterexample with the wrong reason, the suggestion asks for the reason instead of a new counterexample.
  - A wrong bottleneck choice no longer moves on to the improvement.
  - A halving search assembled with every hint is described as assembled, not as built alone.
  - Prediction counts are shown neutrally, and the advice that uses them states the count.
- **Keyboard and screen readers.**
  - Focus stays on, or moves to, the next sensible control after a prediction, a tab, a language or a challenge.
  - In pick mode, focus moves to the flowchart.
  - Prediction outcomes and challenge results are announced through one stable live region.
- **Records.**
  - History entries keep the builder and improvement choices in both languages, so Spanish notes are Spanish.
  - Exported dates use the reader's format.
  - Pair inputs accept thousands separators such as 100,000.
- **MATLAB.** A failed linear search now highlights `idx = -1` and the end of the function, not the start alone.
- **Spanish.**
  - Merge sort, bubble sort and insertion sort are named in full.
  - The suggestion box speaks to the learner as tú throughout.
  - The Number Theory project carries its real title, "Losetas cuadradas y el atajo de Euclides".
  - Decision boxes open with ¿.
  - "Pulsa" is now "Presiona", "Reiniciar" no longer names two different actions, and several machine-like phrasings were rewritten.
- **Left as is.** Restarting a trace asks its predictions again, and the new answers are counted. Repeating a run is practice the learner chose, and the count says how many predictions were made.

## Not in this part

- Running learner code in the browser.
- MATLAB execution: the listings are checked by pattern only, because no MATLAB or Octave is available here.
- The foundation and understanding checks and the Intuition Lab activity, which come in part 4.
- A teacher view of the ideas learners write. They stay in the learner's browser and exports.
