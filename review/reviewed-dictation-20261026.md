# Reviewed English dictation

Learners can dictate an explanation, stop, edit the transcript, then explicitly append the reviewed text. Existing answers are preserved. The checker receives the answer text through the same input events as typing; this change does not enable automatic AI assessment of explanations or raw-audio analysis.

English-only speech dialogs preserve the surrounding course language. The browser provides speech recognition and may send audio to its own service; this is disclosed before Start. Unsupported browsers, denied permission and network failures retain text entry. No OpenAI API key, uploaded-audio endpoint or weakened CSP is introduced.

The shared component covers the foundation/diagnostic explanation field, explanation fields within field projects, Intuition Lab reflection/observation fields, Number Theory proof text, Game Theory project writing, Calculus Think in Motion, and six Math Voice Lab subjects. Existing audio rehearsal/playback remains a separate option. Formula-only fields, saved original answers, exports and disabled fields are excluded.

Original recognised wording and learner-reviewed wording are separate local records. Only confirmed text is appended. Unconfirmed dictation drafts have a separate draft store. The new record group participates in existing local backup, deletion and owner-workspace isolation. The voice activities also retain confirmed wording in their own source history.

Validation: full Node regression suite; dedicated speech-session tests for interim replacement, multiple starts, resumed correction, denied permission, late results, closing mid-utterance, overflow and invalid prior data. Browser QA used synthetic speech events with no microphone or service, including correcting “tree” to “three” before explicit insertion. All 12 Coordinate Geometry demo explanation steps expose the speech entry. Real microphone recognition quality remains browser/device/service dependent and requires hands-on testing.
