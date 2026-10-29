# AC01 · Game Theory Foundations · Beta 0.1

AC01 is the third subject entry in the Quidence dashboard, alongside AA01 and AB01. Student-facing text is English. It runs as static HTML/CSS/JavaScript with no runtime dependencies, sign-up, backend, or external question bank.

## Learning sequence

Each of four lessons follows **first prediction → four guided steps with an interactive table → two fresh questions → feedback**:

1. Players, actions, outcomes, and the order of payoff pairs.
2. Conditional best responses and strictly dominant strategies.
3. A one-round prisoner’s dilemma, individual incentives versus mutual improvement, and a non-constant payoff sum.
4. One-player deviation tests for pure-strategy Nash equilibria, multiple equilibria, and the distinction between equilibrium and fairness or total payoff.

The table explorer always identifies A as the row player and B as the column player. Changing only A or B shows the relevant before/after own payoff. The explorer is instructional; its controls never submit an assessment answer. All numerical games, questions, graphics, and explanatory wording are original AC01 material. Payoffs are hypothetical preference points, not measured results or class grades. Repeated games, mixed strategies, and sequential games are mentioned as future topics, not taught or assessed here.

## Responses and feedback

- Four initial predictions and eight checks after instruction are separate observations. All checks use different contexts or numbers from the worked example.
- “I’m not sure yet” is an explicit response. Blank answers do not count as submitted; negative or incorrect answers can still be saved.
- Correctness is withheld in the UI until both fresh questions in a lesson are submitted. A prediction never gates learning on correctness.
- Editing a saved answer invalidates its submitted status until saved again. First and later submissions remain in history.
- Lesson-step exposure, prior feedback, and self-reported other help accompany submissions. Opening a step is not evidence of understanding. There is no behavior, attention, effort, or AI-use classifier.
- Optional explanations are saved, escaped on display, and left for human review; they are not keyword-scored.
- Lesson feedback and the final summary suggest specific practice without presenting a validated mastery percentage or a course grade. One result should not be interpreted as a complete assessment of the concept.

## Storage and exports

The isolated browser key is `ac01_beta01_session_v1`; AA01 and AB01 records are not touched. Local storage is a temporary record on this browser and origin, with no cross-device sync. The app continues in memory if saving fails. Unreadable or incompatible records are preserved until the user explicitly replaces them, with a raw download option first. Reset requires a dialog confirmation.

After all four lessons, JSON exports contain the complete submission history, support snapshots, event history, task definitions, game definitions, and content/schema versions. Markdown exports give a readable answer history and feedback. Printing formats the visible summary. Exports are not offered during an unfinished check. Correct answers exist in the static client source; this is a learning activity, not a secure exam system.

## Running and checking

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory .`, open `http://127.0.0.1:8000/`, and choose Game theory foundations. Direct entry: `http://127.0.0.1:8000/modules/ac01/dist/`.

Run `node scripts/test-ac01.cjs` for mathematical, record-integrity, and DOM-fixture interaction checks, or `node scripts/test-all.cjs` for all three modules. Checks cover complete and mixed journeys, editing and resubmission, restoring progress, exclusive multi-selection, one-player switches, exports, reset confirmation, incompatible records, and saving failure. Real-browser visual, pointer, download, and print verification was unavailable because the Chromium download failed in this environment. These checks are development validation, not evidence of instructional effectiveness.

## Concept references

Definitions were checked against these primary university teaching sources; no source exercises or wording were copied:

- [Yale ECON 159, Lecture 1: strategic situations, dominance, prisoner’s dilemma, and coordination](https://oyc.yale.edu/economics/econ-159/lecture-1)
- [Yale ECON 159, Lecture 5: best responses and Nash equilibrium](https://oyc.yale.edu/economics/econ-159/lecture-5)

The module was added to this GitHub repository only. Website hosting and domain configuration are separate.


## 基礎檢查與報告副本

公共導覽新增 [15 題基礎檢查](../../foundations/index.html?module=ac01) 和 [Saved reports](../../reports/index.html)。新檢查要求每題附上解釋，並保留草稿、歷次提交和審核；原課程題目和舊紀錄格式保持相容。開啟本模組報告時，會在瀏覽器另存一份報告副本。儲存不等於雲端同步，跨裝置使用請下載報告。範圍與限制見 [全站基礎審核](../../FOUNDATION_AUDIT.md)。

