# Quidence brand and saved-record compatibility

The display brand is **Quidence**. Package names, CSS classes, JavaScript globals, browser events, page tools, newly generated report titles and download names use `quidence` / `Quidence`. The Q icon links back to the subject homepage.

## Existing work

This is a compatibility-preserving rename, not a data rewrite. The existing record keys and schema strings (`cluevera_*_v*`), immutable question-bank version IDs (`cluevera-foundations-1`, `cluevera-foundation-followups-1`, `cluevera-challenges-1`, `cluevera-projects-1`), device metadata key, per-user local prefix (`cluevera_user_`), session cookie (`cluevera_session`) and default SQLite filename (`cluevera.sqlite`) remain stable. They are persistence protocol identifiers, not visible branding. All existing accounts, conflict bases, session drafts, submissions, drawings, reviews, reports and revision histories can therefore be read without copying or replacing them. Tests intentionally retain these identifiers.

Historical Site URLs also remain exact; renaming text must not invent new hosted addresses. The imported version in `SOURCE_SNAPSHOT.json` remains historical provenance. Previously saved payloads and student-entered wording are not rewritten. When displaying an old Markdown report, only the generated brand heading is refreshed; original JSON exports retain the original evidence.

## Domain transition

The user has registered `quidence.com`, `quidence.app` and `quidence.org`. Prefer `.com` as the future canonical address. No DNS, redirects or deployment have been changed in this patch.

Browser storage belongs to an origin. An existing GitHub/preview address and `https://quidence.com` do not share localStorage or session cookies. Before moving traffic, export local-only/unsynced records at the old address. Reuse the existing persistent backend database and sign in at the new address to resume synced work; configure `PUBLIC_ORIGIN` for that exact origin. A redirect alone cannot migrate browser-local records. A separate, reviewed local-file import flow is needed before promising automatic domain migration.

## Verification limits

The name was selected by the user. Code changes do not establish trademark clearance. Automated mathematics, state, account and DOM checks verify software behavior, not complete mathematical-language diagnosis or native macOS print behavior.
