# Account and cross-device learning records

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
- Each account has a separate browser storage namespace. Signing out restores the guest workspace. Account records remain on that browser for offline continuation; this is workspace separation, not encryption against someone with access to the browser profile.
- Import is explicit and only fills missing account records on this device. Guest originals are retained. A different cloud copy becomes a conflict to review.
- Logged-in answers upload after a short debounce. The account page also offers manual sync. Network failure retains local work.
- Open the account page and sync before continuing a course on another device. A running course stages newer cloud work instead of replacing its in-memory answers underneath the student.
- Conflicting records remain unchanged until the student chooses. “Use account’s work” first saves the local copy to a separate backup key; storage failure blocks replacement. “Keep this device’s work” requires the current cloud revision and retains prior cloud versions. Both copies can be downloaded before choosing.
- Sync works at the record level. Foundation checks share one portfolio record and reports share one report collection: simultaneous edits to different items in either collection may require choosing a whole collection. Download both copies before resolving. This first version does not merge individual questions or report items.
- Saved records include course work, visual algebra activities, vectors, matrices, foundation portfolios, reports, and learning requests. Temporary Matrix Lab controls do not persist.
- Sign out when using a shared device. Downloaded work and recovery codes should be kept private.

## Hosting recipe

Serve the learning pages and API from the **same HTTPS origin**, with a reverse proxy terminating TLS and forwarding to this Node service. Use one running backend process with a persistent SQLite volume. An ephemeral/serverless filesystem loses records when replaced; do not use one for the database.

Production startup requires `PUBLIC_ORIGIN`, exactly the HTTPS origin without a trailing slash:

```sh
NODE_ENV=production PUBLIC_ORIGIN=https://learn.example.com HOST=127.0.0.1 DATA_PATH=/var/lib/cluevera/cluevera.sqlite npm start
```

The database directory must be writable by the service user and private. Put the reverse proxy on that HTTPS hostname, forward to loopback port 3000, and keep Node’s port inaccessible from the public internet. `PUBLIC_ORIGIN` supplies the trusted origin; the server does not trust forwarded host headers. Passwords are entered only over HTTPS in production.

A Dockerfile is included (recipe not run in this workspace):

```sh
docker build -t cluevera .
docker volume create cluevera-data
docker run -d --name cluevera -p 127.0.0.1:3000:3000 -e PUBLIC_ORIGIN=https://learn.example.com -v cluevera-data:/app/student-data cluevera
```

The volume must be writable by the image’s non-root `node` user. Point your HTTPS reverse proxy to `127.0.0.1:3000`. For a hosted container service, mount a persistent disk at `/app/student-data`, configure the public HTTPS origin, and use exactly one instance.

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

Passwords use salted scrypt. Only a hash of each session token and recovery code is stored. Sessions use HttpOnly, SameSite=Strict cookies (Secure in production). Writes require the configured Origin; authenticated writes also require a session CSRF token. Authentication is rate limited and hashing concurrency is capped. Requests have size/time limits; each record is capped at 2 MiB and account revision history at 50 MiB. Full quota errors retain local work. Static routing excludes source/server files, secrets, and database paths. The backend accepts only the reviewed record keys and their schema versions.

This is a student account service, with no teacher dashboard, email verification, billing, classroom roles, or public account administration. There is no deletion UI yet. This first version does not support multiple Node processes sharing a network-mounted SQLite file.

## Validation

`npm test` includes existing mathematics/state/DOM regressions and the account integration tests. `npm run test:sync` runs the new tests alone. Coverage includes two authenticated HTTP clients, account isolation, version conflicts, immutable revisions, CSRF/origin rejection, recovery rotation/session revocation, disk restart, denied private files, guest import, separate local namespaces, staged downloads, failed backup protection, offline preservation, and edits during upload.

Student-visible Beta/test labels and module codes were removed from active pages, report titles, and download names. Internal legacy keys and namespaces remain to preserve saved work. Archived earlier pages are retained as historical source but removed from active navigation. “Planned” remains on the unimplemented Macroeconomics outline so its availability is accurate.

Native macOS Safari behavior and the deployed HTTPS reverse proxy still require testing after hosting. The tests do not establish educational validity or full curriculum coverage.
