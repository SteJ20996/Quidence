'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {load}=require('../modules/aa01/tests/workspace.cjs');
test('a fluent keyword match does not receive automatic understanding credit; original text and candidate remain auditable',()=>{
 const h=load({expose:'window.testOnly={state,goto,submit,feedbackText,renderReport};'});h.api.goto(9);const why='The fixed sign-up fee is $12 before any visits.';
 h.api.submit({model:'12+5v',cost:27,why});const r=h.api.state.records.C10;
 assert.equal(r.score.correct,true);assert.equal(r.reason.points,null);assert.equal(r.reason.connection,null);assert.equal(r.reason.patternCandidate.points,2);assert.equal(r.answer.why,why);assert(r.reason.reviewReasons.includes('semantic_review_required'));
 assert.match(h.api.feedbackText(r),/meaning is not automatically graded/);assert.doesNotMatch(h.api.feedbackText(r),/Suggested explanation credit/);
 assert.equal(h.api.state.events.at(-1).reason_assessment.review_required,true);
});
test('viewing an older suggestion does not confirm understanding or rewrite its saved assessment',()=>{
 const h=load({expose:'window.testOnly={state,goto,submit,feedbackText,renderReport};'});h.api.goto(9);h.api.submit({model:'12+5v',cost:27,why:'fixed sign-up fee'});const r=h.api.state.records.C10;r.reason={...r.reason,points:2,connection:1,method:'legacy_pattern'};const before=JSON.stringify(r.reason);
 h.api.renderReport();assert.doesNotMatch(h.app.innerHTML,/Suggested reason credit: 2\/2|A concrete connection to this task is visible/);assert.equal(JSON.stringify(r.reason),before);
 r.verifiedReason={points:2,note:'The student linked the fixed fee to zero visits and justified the complete model.'};assert.match(h.api.feedbackText(r),/Reviewed explanation: 2\/2/);
});
