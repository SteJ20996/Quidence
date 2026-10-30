# Account and cross-device learning records


後續決定：公測暫停帳戶和雲端同步，新學習紀錄改為僅本機儲存。預設帳戶 API 已關閉，已有雲端資料未刪除。本文件中的舊帳戶實作及未批准草案僅供歷史/後續討論，目前狀態以 [LOCAL_ONLY_REVIEW.md](LOCAL_ONLY_REVIEW.md) 為準。
This change supplies a runnable Node.js backend and account page. It has not been deployed to a public host. A GitHub Pages or Python static server can show the courses but cannot provide these account APIs.

## Run locally

Use Node.js 24.19 or a newer 24.x version, which provides `node:sqlite`. No third-party packages are needed.

```sh
npm start
```

Open <http://127.0.0.1:3000/account/>. Keep the same site address throughout; `localhost` and `127.0.0.1` have separate browser storage and cookies. Use two browser profiles to simulate two devices. This loopback development address is only available on the same computer.

Register with a lowercase username (3–32 letters/numbers/underscore/hyphen) and a password (12–128 characters). Save the recovery code privately. Recovery changes the password, rotates the code, and revokes existing sessions. There is no email reset service.

## Student behavior

- Guest records continue saving locally under their existing keys. Existing record schemas, course versions, and answer histories are preserved.
- Each account has a separate browser storage namespace. Signing out restores the guest workspace. Explicit sign-out removes all account caches, sync baselines and conflict backups from that browser. Guest originals remain until the user selects Clear learning records from this device. Download unsynced work first. This is deletion of application copies, not encryption or forensic erasure. Session expiry or a failed network request does not silently discard unsynced work.
- Import is explicit and only fills missing account records on this device. Guest originals are retained. A different cloud copy becomes a conflict to review.
- Logged-in answers upload after a short debounce. The account page also offers manual sync. Network failure retains local work.
- Open the account page and sync before continuing a course on another device. A running course stages newer cloud work instead of replacing its in-memory answers underneath the student.
- Conflicting records remain unchanged until the student chooses. “Use account’s work” first saves the local copy to a separate backup key; storage failure blocks replacement. “Keep this device’s work” requires the current cloud revision and retains prior cloud versions. Both copies can be downloaded before choosing.
- Sync works at the record level. Foundation checks share one portfolio record, diagnostic challenges share a separate portfolio record, and reports share one report collection: simultaneous edits to different items in either collection may require choosing a whole collection. Download both copies before resolving. This first version does not merge individual questions or report items.
- Saved records include course work, visual algebra activities, vectors, matrices, foundation portfolios, diagnostic challenge portfolios, reports, and learning requests. Temporary Matrix Lab controls do not persist.
- Sign out when using a shared device. Clear device records if guest work also needs removal. Browser-saved passwords, recovery codes, screenshots and downloaded files must be removed separately. Offline sign-out clears local application copies but cannot confirm server-session revocation; the page says so and keeps a signed-out marker to prevent automatically reopening the account.
- Course pages use an explicit application storage adapter; native browser Storage is not patched. Cross-tab account changes block stale writes immediately, reload active courses, and clear account-form/recovery-code displays. A returning page restored from the browser back/forward cache reloads before work continues.

## Hosting recipe

Serve the learning pages and API from the **same HTTPS origin**, with a reverse proxy terminating TLS and forwarding to this Node service. Use one running backend process with a persistent SQLite volume. An ephemeral/serverless filesystem loses records when replaced; do not use one for the database.

Production startup requires `PUBLIC_ORIGIN`, exactly the HTTPS origin without a trailing slash:

```sh
NODE_ENV=production PUBLIC_ORIGIN=https://learn.example.com HOST=127.0.0.1 DATA_PATH=/var/lib/quidence/cluevera.sqlite npm start
```

The database directory must be writable by the service user and private. Put the reverse proxy on that HTTPS hostname, forward to loopback port 3000, and keep Node’s port inaccessible from the public internet. `PUBLIC_ORIGIN` supplies the trusted origin; the server does not trust forwarded host headers. Passwords are entered only over HTTPS in production.

A Dockerfile is included (recipe not run in this workspace):

```sh
docker build -t quidence .
docker volume create quidence-data
docker run -d --name quidence -p 127.0.0.1:3000:3000 -e PUBLIC_ORIGIN=https://learn.example.com -v quidence-data:/app/student-data quidence
```

Reuse any existing data volume; creating a new volume does not migrate the old database. The volume must be writable by the image’s non-root `node` user. Point your HTTPS reverse proxy to `127.0.0.1:3000`. For a hosted container service, mount a persistent disk at `/app/student-data`, configure the public HTTPS origin, and use exactly one instance.

Back up the database using SQLite’s online backup API, or stop the service before copying the database and any WAL/SHM files together. Test restoring the backup before relying on it. The repository and container context exclude student data, database files, and environment files. No credentials or live student accounts are supplied.

## Interfaces and safeguards

| Endpoint | Purpose |
| --- | --- |
| `GET /api/me` | Session user and CSRF token; anonymous request succeeds with no user |
| `POST /api/register`, `/api/login`, `/api/recover`, `/api/logout` | Account lifecycle |
| `GET /api/records` | Current account records only |
| `GET /api/records/:key` | Latest record and revision |
| `PUT /api/records/:key` | Conditional write with `baseVersion` and serialized `value`; stale write returns 409 |
| `GET /api/records/:key/history` | Immutable previous cloud revisions for this account |

Passwords use salted scrypt. Only a hash of each session token and recovery code is stored. Sessions use HttpOnly, SameSite=Strict cookies (Secure in production). Writes require the configured Origin; authenticated writes also require a session CSRF token. Authentication is rate limited and strong hashing uses a bounded FIFO queue: two simultaneous hashes, at most 64 waiting requests, and a 30-second waiting limit. Disconnected queued requests are cancelled. Up to ten concurrent classroom registrations are tested; this is not a production load rating. Registration allows 60 attempts per IP per hour and 10 per username/IP per hour. Login/recovery allow 120 attempts per IP per minute and 12 per username/IP per minute. The rate table is bounded to 10,000 entries; it resets on process restart. Requests have size/time limits; each record is capped at 2 MiB and account revision history at 50 MiB. Full quota errors retain local work. Static routing excludes source/server files, secrets, and database paths. The backend accepts only the reviewed record keys and their schema versions. A save rechecks the session after reading its request body, so a request completed after sign-out cannot add a revision. Logout is repeatable for an already expired or revoked session.

This is a student account service, with no teacher dashboard, email verification, billing, classroom roles, or public account administration. There is no deletion UI yet. This first version does not support multiple Node processes sharing a network-mounted SQLite file.

## Validation

`npm test` includes existing mathematics/state/DOM regressions and the account integration tests. `npm run test:sync` runs the new tests alone. Coverage includes two authenticated HTTP clients, account isolation, version conflicts, immutable revisions, CSRF/origin rejection, recovery rotation/session revocation, disk restart, denied private files, guest import, separate local namespaces, staged downloads, failed backup protection, offline preservation, and edits during upload.

Student-visible Beta/test labels and module codes were removed from active pages, report titles, and download names. Internal legacy keys and namespaces remain to preserve saved work. Archived earlier pages are retained as historical source but removed from active navigation. Economic and Game Theory courses have since been retired. Their legacy record keys remain available for historical data export; new course selectors do not offer them.

Native macOS Safari behavior and the deployed HTTPS reverse proxy still require testing after hosting. The tests do not establish educational validity or full curriculum coverage.


本次專題擴充加入 `cluevera_project_portfolio_v1`：儲存 8 科專題的原始分步回應、結構化幾何點/線段、不可變提交及按提交綁定的本機複核。`projects/` 納入允許靜態路徑。專題專項的實際 HTTP 檢查驗證第二裝置還原這些資料、保留版本歷史和拒絕舊版本寫入。舊診斷鍵及原學習紀錄未改寫；後端仍需單獨部署，衝突按整份組合紀錄處理。

## Proxy rate limits

Forwarded IP headers are ignored unless `TRUSTED_PROXY_CIDRS` explicitly lists trusted proxy IPs or CIDRs, for example `127.0.0.1/32,::1/128` for a proxy on the same host. Do not configure universal networks or public clients as trusted proxies. The proxy must replace or append forwarding headers correctly. The server scans hops from the socket toward the client and stops at the first untrusted hop. Keep the Node port private; an IP rate limit is not account security on its own. Actual hosting/proxy configuration is still unverified.

History is still immutable and quota bounded; this patch does not introduce an automatic retention period or deletion policy. Age confirmation, privacy/terms, operator details, account deletion and password/recovery UX need separate decisions before a student-facing public launch.
