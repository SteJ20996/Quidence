# SEO foundation review — 2026-10-11

Base: `5f761da53ff15120eb4c22213d6283db9bbb0586`.

Implemented production URL normalization, reciprocal language alternates, authored bilingual metadata, static noindex on personal workspaces, robots/sitemap generation and release integration. Existing course URLs, UI body, answers, grading, storage and authored mathematics are unchanged. The body comparison permits only asset-version query changes. No Cloudflare deployment or DNS mutation occurred.

Validation:
- `npm test`: 236 tests passed, including seven SEO regressions.
- Actual CLI `npm run build:static`: 164 source files plus generated `_headers`.
- XML parsed successfully: 26 unique canonical entries; no workspace URLs.
- SEO generation and activity-version checks are idempotent. Course/home rebuilds retain metadata.
- Local HTTP GET/HEAD serves robots and sitemap with correct MIME, and source/review documents remain unavailable.
- DOM simulation executes the actual SEO script and tests language changes, duplicate tag removal and absence of body, storage or network access. This is not a native browser test.

Limitations: canonical/hreflang depend on JavaScript rendering because current bilingual hosting shares initial HTML. Verify rendered Spanish and canonical selection in Search Console after owner deployment. Google indexing and rankings are not guaranteed. No new local native-browser run was available; GitHub CI retains the existing browser suites.

Owner instructions: [SEO_SETUP.md](../SEO_SETUP.md).
