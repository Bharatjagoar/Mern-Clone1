# TaskFlow Backend

A multi-tenant project management backend: organizations, projects, tasks, assignments, and
background email notifications. Built with Node.js/Express, PostgreSQL (Prisma), and
Redis/BullMQ.

## Stack

- **Runtime**: Node.js 20, Express
- **Database**: PostgreSQL (Prisma ORM + Prisma Migrate)
- **Jobs**: Redis + BullMQ
- **Validation**: Zod
- **Docs**: OpenAPI (swagger-jsdoc) served via Swagger UI at `/docs`
- **Tests**: Jest + Supertest
- **Containers**: Docker Compose (`api`, `worker`, `postgres`, `redis`)

## Quick start (Docker)

```bash
cp .env.example .env   # edit secrets if you want; defaults work for local use
docker compose up --build
```

This starts Postgres, Redis, the API (runs `prisma migrate deploy` on boot), and the worker.
Then seed some demo data:

```bash
docker compose exec api npm run seed
```

The API listens on port 3000 *inside* its container, but `docker-compose.yml` in this repo maps
it to **host port 3001** (Postgres → 5433, Redis → 6380) because this was built on a machine
that already had another project's containers bound to the standard ports. If that's not true
for you, feel free to change the `ports:` mappings back to `3000:3000` / `5432:5432` /
`6379:6379`.

- API: http://localhost:3001/api/v1
- Swagger UI: http://localhost:3001/docs
- Health check: http://localhost:3001/health

## Quick start (local, no Docker for the app)

```bash
npm install
docker compose up -d postgres redis   # just the infra
npx prisma migrate deploy
npm run seed
npm run start        # API on PORT (default 3000)
npm run start:worker # in a second terminal
```

## Seeded accounts

All seeded users share the password `Password123!`.

| Email | Org | Role |
|---|---|---|
| alice@acme.test | Acme Corp | org_admin |
| bob@acme.test | Acme Corp | member |
| carol@acme.test | Acme Corp | member |
| dave@globex.test | Globex Inc | org_admin |
| erin@globex.test | Globex Inc | member |

## Environment variables

See `.env.example` for the full list. Key ones:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | JWT signing secrets (change these in any real deployment) |
| `JWT_ACCESS_TTL` | Access token lifetime (default `15m`) |
| `JWT_REFRESH_TTL_DAYS` | Refresh token lifetime in days (default `7`) |
| `AUTH_RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_WINDOW_MS` | Auth endpoint rate limit (default 10/min) |
| `EMAIL_RATE_LIMIT_MAX` / `EMAIL_RATE_LIMIT_WINDOW_MS` | Global email send rate limit (default 50/min) |

`TEST_DATABASE_URL` is only used when `NODE_ENV=test` (see Testing below).

## API documentation

- Interactive: `GET /docs` (Swagger UI)
- Raw spec: `GET /openapi.json`
- Postman collection: `postman/TaskFlow.postman_collection.json` — import it, run **Login**
  (or **Register**) first; its test script writes `accessToken`/`refreshToken`/`userId` into
  collection variables that every other request reuses, so the whole collection runs without
  manual edits. `baseUrl` defaults to `http://localhost:3001/api/v1` (edit the collection
  variable if you're running the API on a different port).

## Testing

```bash
docker compose up -d postgres redis

# one-time: create the test database and apply migrations to it
docker exec <postgres-container-name> psql -U taskflow -d taskflow -c "CREATE DATABASE taskflow_test;"
DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy

npm test
```

Tests run against a **dedicated `taskflow_test` database** (set via `TEST_DATABASE_URL` in
`.env`), never the dev database. `tests/setup.js` truncates every table before each test for
isolation. Coverage: `npm run test:coverage`.

- `tests/unit/` — pure logic (JWT sign/verify, pagination math) and service-level logic with
  Prisma/queue/Redis mocked (auth register/login guard clauses, task-assignment validation:
  assignee-not-in-org, already-assigned, dedup).
- `tests/integration/` — full HTTP stack via Supertest: register/login/refresh/logout flow,
  task CRUD + filters + pagination, project dashboard, bulk status update, cross-tenant access
  returning 403 without leaking resource data, RBAC (member vs org_admin), and task assignment
  enqueueing a BullMQ job (queue itself mocked so this test doesn't need a live worker).

## Key design decisions

**Registration model.** `POST /auth/register` creates a *new organization* with the caller as
its `org_admin` — there's no invite-token flow in the assignment spec, so "register" doubles as
"start a new company workspace." To add more people to an existing org, an `org_admin` uses
`POST /organizations/members` with the email of someone who has already registered (their own,
throwaway org from that registration is simply never used again). A consequence: **login
always resolves to the user's oldest org membership** — this backend doesn't support switching
between multiple orgs from one login. Fine for the assignment's scope; a real multi-org product
would need an org-selection step at login.

**Multi-tenancy enforcement.** Every service function takes `orgId` from `req.auth` (set by
`authenticate` from the server-issued JWT claims) and never from client-supplied body/query/
params. Cross-org resource access returns **403 FORBIDDEN**, not 404 — existence is checked
first internally, then ownership, so a 403 never accidentally leaks whether a resource with that
ID exists, but the response body itself contains no resource data either way.

**Soft delete.** `projects` and `tasks` use `deleted_at`; all reads filter it out. Hard deletes
only happen via cascading FK when a parent row is truly removed (not exposed through the API).

**Assignment → email consistency strategy** (see `src/services/assignment.service.js`): the
`TaskAssignment` row is written first and is the source of truth — the HTTP response reflects
that success regardless of what happens next. Enqueueing the BullMQ job is attempted after; if
Redis is briefly unavailable and enqueueing throws, **the assignment is not rolled back** — a
`NotificationJob` row is written with `status: "failed"` and the error, visible via
`GET /jobs/:id` for operator follow-up. This is an at-least-once, best-effort guarantee for a
non-critical side channel (email), not a two-phase commit.

**Job retries & DLQ.** BullMQ `attempts: 3`, exponential backoff starting at 1000ms
(1s → 2s → 4s). On final failure the job is pushed onto an explicit `email-notifications-dlq`
queue and its `NotificationJob.status` is set to `failed`, both visible operationally.

**Assignment dedup.** A Redis key `assign:{taskId}:{userId}` with a 5s TTL (NX) ensures rapid
duplicate assignment calls only enqueue one email job.

**Full-text search.** `tasks.search_vector` is a Postgres **generated column**
(`tsvector`, title weighted higher than description) with a GIN index — added via raw SQL in
`prisma/migrations/20260824080113_add_task_fts/migration.sql` since Prisma has no native
tsvector type. `GET /tasks/search?q=` queries it directly.

## Known limitations

- No email/password reset flow (out of scope for the assignment).
- A user can technically be a member of more than one org (via `/organizations/members`), but
  can only ever *log in* as whichever org they joined first — see "Registration model" above.
- Mock email sending only (`src/jobs/emailService.js` logs instead of calling a real provider),
  as explicitly allowed by the assignment.
