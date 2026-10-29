# AB01 · Linear Algebra Foundations

AB01 is the new project name for AA01_2. AA01 is a separate program and has not been changed. The Site origin remains stable so browser-local records are available at the same address.

## Beta 0.2: matrix learning

The default entry first explains the activity to students, then offers a complete English-language matrix learning unit: three starting tasks, the seven-step animation with a prediction checkpoint, two supported practice tasks, three fresh tasks without immediate correctness feedback, and a phase-specific evidence report. Two different delayed tasks become available at least 24 hours after the fresh-task check. There is no automatic reminder.

The lesson keeps the original counts visible while replacing the two directions with the matrix columns. The checkpoint asks for two copies of (1, 1). A submitted prediction opens the later worked steps even when incorrect. All seven displayed steps and a current submitted prediction are required to continue; viewing a step is not interpreted as comprehension.

Practice has explicit hints and feedback. First answers and later revisions are retained, including hint exposure, earlier feedback, instructional context and self-reported other help. Editing an answer invalidates its submitted status until it is submitted again. New-task checks withhold correctness feedback in both the UI and page tools. Reports keep calculation and conceptual answer parts distinct and treat related parts as one task, not independent demonstrations.

The pre-check, lesson prediction, supported practice, new tasks and later check are reported separately. These observations are not a validated mastery score or a causal estimate of learning gain. Optional written explanations require human review. The program does not infer attention, effort or AI use from interactions.

The new matrix session has its own pinned schema and task set, using ab01_beta02_matrix_session_v1. Unreadable stored sessions are preserved and can be downloaded before reset. JSON exports include task definitions, every submission, support context, phase observations and events. Markdown exports provide a readable answer history. Browser saving is temporary; there is no cloud student profile or cross-device memory.

## Student orientation and application guide

Fresh sessions now begin with a short purpose statement before the three-question starting check. Existing sessions resume their previous phase. The “Start here” navigation and #start link open the introduction without resetting answers. The introduction explains unfamiliar-topic choices, the learning phases and how the report is used. It makes clear that the same guided example is used for everyone in this version.

The optional #applications guide includes exact, interactive examples of a transformed triangle, two receipt equations, and a neural layer’s weighted sum, bias and ReLU activation. The neural example uses chosen weights rather than a trained model. A depth explanation distinguishes repeated affine operations from non-linear layers. The learning map separates the current matrix unit, available previews, and deeper topics that do not yet have full AB01 lessons or adaptive assessment. The selected example and map can be printed.

The orientation alone is not treated as mathematical instruction. Viewing worked application examples records versioned, phase-specific instructional exposure, including which example step was displayed. Later submissions preserve that context. Viewing material does not create a scored assessment record or imply comprehension. Page tools cannot submit hidden tasks while the introduction or application guide is open. The assessment schema, task set, old submissions and Beta 0.1 archive remain unchanged.

Sources linked in the guide: MIT OpenCourseWare’s 18.06SC linear algebra course, PyTorch Linear and ReLU documentation, and Google’s Machine Learning Crash Course on embedding spaces. Illustrations and numerical examples are original AB01 material.

Validation: node tests/student-materials.test.cjs checks transformation coordinates, both receipt equations, neural-layer arithmetic, every example step and topic changes. The learning-flow fixtures also check introduction versus instructional exposure, hidden-task safeguards, direct material links and old-session resume. Real browser visual and native page-tool QA remain unavailable in the current static Sites environment.

## Response-based learning advice

AB01’s primary role is a check-in alongside the student’s current class: make the starting foundation visible, suggest a focused action, and verify it with a different example. Explanations and the application map support that flow. They are not a substitute for the entire course.

The report now puts two suggested next steps before the phase ledger. Versioned rules examine coordinates, column images, unchanged coefficients, output calculation and the negative-coefficient extension. Suggestions cite the recorded tasks and keep calculation separate from conceptual choices. In particular, a correct output with an incorrect coefficient choice produces a recommendation about the coefficients; the reverse pattern focuses on the component sums.

Missing evidence is not classified as an error. Supported practice is not promoted to fresh-task evidence. Additional help, revisions and differing fresh/later results remain distinguishable. Suggestions never rewrite submissions or scores. Written explanations remain for human review. The recommendations are transparent rules, not a validated ability estimate or an exam-grade prediction.

Each priority has a brief reminder, a different self-check practice example, a worked solution and a concrete next check. Opening these is recorded as support activity, not as a scored response. The main lesson goal stays ahead of the wider application map. Students are directed to their teacher’s classwork and exam criteria for evaluating performance in class. The advice is included in JSON/Markdown exports and exposed by the existing page read tool only after the report is available.

Validation: node tests/learning-advice.test.cjs covers missing evidence, calculation/meaning mismatches, support, revisions, mixed later results, task grouping, priority selection and answer-record preservation. Learning-flow fixtures verify report rendering, advice exports, support-opening events and return from the learning map without resetting the report.

## Previous version

The original pre-upgrade static assets are preserved without changes at beta01/. Their historical AA01_2 labels and old record version are retained. The current Vector diagnostic entry at vectors.html uses AB01 branding while keeping the original Beta 0.1 tasks, scoring and browser key. Matrix Lab remains available for free exploration. Starting a new matrix session does not delete the vector record.

Validation: node tests/learning.test.cjs checks independent arithmetic, separate conceptual evidence, input validity, pinned records and the one-day threshold. node tests/learning-flow.test.cjs exercises complete and mixed workflows, prediction gating and resume, no-feedback page tools, revisions, exports, delayed checks, old-record preservation, reset, unreadable records and saving failure. The existing diagnostic, matrix and animation tests also pass. These use mathematical and DOM fixtures; real browser visual and native WebMCP-context QA are unavailable for this static Site in the current environment.

## Beta 0.1 vector diagnostic

## Scope
Eight original core tasks: coordinates, geometric placement, addition, tip-to-tail movement, negative scaling, constructing a linear combination, dependent directions, and systems-to-vector interpretation. Up to four structural follow-ups are selected using recorded evidence, prioritizing conflicting, then incorrect, then missing evidence.

## Assessment rules
- Answers are saved without correctness feedback until the final report.
- Record first and subsequent submissions, hints, skips, draft changes, and timestamps.
- Hint exposure carries forward to subsequent tasks about the same domain; old independent submissions stay identifiable in history.
- Interpret multi-part tasks as related observations, not multiple independent demonstrations.
- Keep calculation, geometry, meaning, reachability, and transfer dimensions separate.
- Open explanations are never scored by keyword; they require human review.
- Do not infer effort, AI use, intent, mastery percentages, or validated proficiency.

## Persistence
Browser storage is a temporary draft of this single diagnostic. It is not an authoritative student profile, cloud storage, or cross-device / cross-semester learning memory. JSON and Markdown exports preserve the record.

## Implementation
Plain static HTML/CSS/JavaScript, no runtime dependencies or external question banks. Deployable `dist/` assets. `engine.js` is also a CommonJS module for meaningful scoring and diagnostic-flow checks. Optional page-agent tools share the UI's state/actions when WebMCP is available. Static Sites cannot use the managed browser preview, so visual browser QA and native WebMCP-context QA are unavailable in this environment.

## Matrix Lab
`dist/matrix.html` extends the program with editable 2×2 matrices, input-vector dragging, output basis-column dragging, six presets, synchronized input/output grids, the unit-square image, live column decomposition and coordinate calculations, area/orientation/reachability explanations, and optional predict-before-reveal practice. Values are bounded from −3 to 3; drags snap to 0.5. Controls accept other finite values within that interval.

Animation is the explicit straight blend B(t) = (1 − t)I + tA, not a rotation-only trajectory. Both views share one coordinate scale; it remains fixed while dragging. Reduced-motion preference skips animated playback while leaving the manual progress control usable.

Matrix practice is page-local and is not folded into the vector diagnostic report or treated as a validated mastery result. Original vector progress remains in its existing draft namespace. Matrix page tools follow the same visible state and deliberately omit hidden prediction outputs.

Validation: `node tests/matrix.test.cjs` covers mathematical outputs, columns, linearity, ranks, orientation, interpolation and bounds. `node tests/matrix-flow.test.cjs` covers DOM-fixture interaction flow, prediction gating, revisions, hints, invalid inputs, animation and drag controls. Existing diagnostic and flow checks pass. Native browser visual/gesture and real WebMCP-context testing are unavailable for this static Site in the current environment.

## Guided matrix walkthrough
The Matrix Lab now opens with a fixed, seven-step worked example before free exploration. The example uses A = [[1, 1], [0, 1]] and v = (1, 2). It explicitly separates the original right/up counts, the two matrix-column destinations, preservation of coefficients, the first transformed move, two individually animated diagonal copies, and final horizontal/vertical totals.

The original and new matrices remain visible with stable column colors. Original counts 1 and 2 remain visible throughout. Only the active column is highlighted. The step diagram keeps the standard coordinate axes fixed. It does not suggest that the order of walking is the chronological definition of a linear transformation. Each copied arrow represents vector addition from the previous tip.

Playback holds for reading between steps, supports pause and direct step selection, and honors reduced motion. Switching to the guide preserves all exploratory inputs. The exploration configuration page tool selects the exploration view; walkthrough page tools use the guide's same state and actions.

Validation: `node tests/matrix-guide.test.cjs` verifies all seven steps, unchanged counts, both column images, separate route checkpoints (1,0) → (2,1) → (3,2), final arithmetic, invalid navigation, full playback and mode switching without replacing exploratory inputs. Mathematical and existing matrix interaction checks also pass. Real browser visual QA remains unavailable for this static Site in the current environment.


## 基礎檢查與報告副本

公共導覽新增 [15 題基礎檢查](../../foundations/index.html?module=ab01) 和 [Saved reports](../../reports/index.html)。新檢查要求每題附上解釋，並保留草稿、歷次提交和審核；原課程題目和舊紀錄格式保持相容。開啟本模組報告時，會在瀏覽器另存一份報告副本。儲存不等於雲端同步，跨裝置使用請下載報告。範圍與限制見 [全站基礎審核](../../FOUNDATION_AUDIT.md)。
