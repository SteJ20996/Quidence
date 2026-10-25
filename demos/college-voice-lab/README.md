# Quidence Math Voice Lab

An English-only interaction and teaching demo for six mathematics subjects. This extends the Linear Algebra and Statistics version merged in PR #50 with Precalculus, Game Theory, Geometry and Algebra II.

| Subject | Interactive model | Main distinction |
| --- | --- | --- |
| Linear Algebra | A horizontal vector stretch | Coordinate scaling versus vector length |
| Statistics | Known-SD normal confidence intervals | Individual variation versus uncertainty about a mean |
| Precalculus | Sine curves with an input multiplier | Period versus amplitude |
| Game Theory | A one-shot payoff table and a new coordination game | Joint benefit versus unilateral incentives |
| Geometry | Rectangles with a fixed perimeter | Fixed side sum versus changing area |
| Algebra II | Consecutive exponential values | Fixed ratio versus changing difference |

- Five stages: first idea, evidence, explanation with a scripted follow-up, transfer, reflection.
- Recording and playback stay local to the open dialog. Audio is not uploaded or exported.
- Example transcripts are labelled and editable before confirmation. Confirmation appends wording and preserves the original example separately.
- Follow-ups use a learner-selected reasoning focus or an unchanged authored example. Free prose is not semantically assessed. No provider API, automatic speech recognition, or AI judgment is enabled.
- Numerical checks use explicit mathematical targets, independently of prose.
- Local drafts, submitted snapshots, raw/confirmed wording and earlier attempts are preserved. Existing two-subject notes are retained when the four new tracks are added. Unreadable or concurrently changed notes are not overwritten.
- General Quidence language preferences are not read or modified. All voice/explanation activities are English-only.

Run `npm test` in this directory for model, state and recorder lifecycle checks. Serve `dist/` as a static site; no dependency installation or credentials are required. The dedicated Math Voice Lab workflow runs these checks when the demo changes.

This folder is the source for the public activity at `/explain/`. Run `node scripts/build-math-voice.cjs` from the repository root after changing its browser modules, then regenerate asset versions. The public HTML integrates the existing theme, fixed-English language policy, home navigation and local-record backup. The six subject entries use `/checks/?module=...` to offer this activity alongside each original check.
