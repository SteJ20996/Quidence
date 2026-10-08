(function(root){
'use strict';
// Legacy persistence identifiers are intentionally retained; see BRAND_MIGRATION.md.
const KEYS={
 cluevera_project_portfolio_v1:{label:"Field projects",schema:"cluevera_project_portfolio_v1"},
 cluevera_challenge_portfolio_v1:{label:'Diagnostic challenges',schema:'cluevera_challenge_portfolio_v1'},
 cluevera_algebra_progress_v06:{label:'Visual algebra activities',schema:'cluevera_algebra_progress_v06'},
 aa01_2_beta01_draft_v1:{label:'Vector diagnostic',schema:1},
 ab01_beta02_matrix_session_v1:{label:'Matrix learning',schema:2},
 ac01_beta01_session_v1:{label:'Game Theory',schema:'ac01_beta01_session_v1'},
 ad01_beta01_session_v1:{label:'Calculus',schema:'ad01_beta01_session_v1'},
 ae01_beta01_session_v1:{label:'Statistics',schema:'ae01_beta01_session_v1'},
 af01_beta01_session_v1:{label:'Pre-calculus',schema:'af01_beta01_session_v1'},
 'pre-algebra_beta01_session_v1':{label:'Pre-Algebra',schema:'pre-algebra_beta01_session_v1'},
 'algebra-1_beta01_session_v1':{label:'Algebra I',schema:'algebra-1_beta01_session_v1'},
 geometry_beta01_session_v1:{label:'Geometry',schema:'geometry_beta01_session_v1'},
 'algebra-2_beta01_session_v1':{label:'Algebra II',schema:'algebra-2_beta01_session_v1'},
 'physics-1_beta01_session_v1':{label:'Physics 1 Foundations',schema:'physics-1_beta01_session_v1'},
 'physics-2_beta01_session_v1':{label:'Physics 2 Foundations',schema:'physics-2_beta01_session_v1'},
 physics_beta01_session_v1:{label:'Physics',schema:'physics_beta01_session_v1'},
 microeconomics_beta01_session_v1:{label:'Microeconomics',schema:'microeconomics_beta01_session_v1'},
 cluevera_foundation_portfolio_v1:{label:'Foundation checks',schema:'cluevera_foundation_portfolio_v1'},
 cluevera_saved_reports_v1:{label:'Saved reports',schema:'cluevera_saved_reports_v1'},
 cluevera_learning_goal_v1:{label:'Learning request',schema:'cluevera_learning_goal_v1'}
};
const MAX_RECORD_BYTES=2*1024*1024;
function valid(key,value){if(!Object.hasOwn(KEYS,key)||typeof value!=='string'||value.length>MAX_RECORD_BYTES)return false;try{const v=JSON.parse(value);return !!v&&typeof v==='object'&&!Array.isArray(v)&&(KEYS[key].schema===undefined||v.schema===KEYS[key].schema);}catch{return false;}}
const api={KEYS,MAX_RECORD_BYTES,valid};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceSyncPolicy=api;
})(typeof window==='undefined'?globalThis:window);
