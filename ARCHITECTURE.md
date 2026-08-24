# Architecture

## Components

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │ HTTPS/JSON
                           ▼
                    ┌─────────────┐        reads/writes        ┌──────────────┐
                    │  API (Express)│ ─────────────────────────▶│ PostgreSQL   │
                    │  Route→Controller│◀────────────────────────│ (Prisma)     │
                    │  →Service→Data │                           └──────────────┘
                    └──────┬──────┘
                           │ enqueue job (BullMQ)
                           ▼
                    ┌─────────────┐        writes job status    ┌──────────────┐
                    │    Redis    │◀──────────────────────────▶│ Worker       │
                    │ (queue+dedup)│                             │ (BullMQ)     │
                    └─────────────┘                             └──────┬───────┘
                                                                        │ status updates
                                                                        ▼
                                                                 ┌──────────────┐
                                                                 │ PostgreSQL   │
                                                                 │ (NotificationJob) │
                                                                 └──────────────┘
```

Two Node processes share one codebase and one Postgres database:

- **`api`** (`src/server.js`) — the Express HTTP server. Layered as
  `routes → controllers → services → Prisma`. Owns request validation (Zod), auth/RBAC
  middleware, and enqueueing background jobs.
- **`worker`** (`src/worker.js`) — a BullMQ `Worker` that consumes the `email-notifications`
  queue, "sends" the (mocked) email, and writes job status back to the `notification_jobs`
  table so the API can serve `GET /jobs/:id` without talking to Redis directly.

They communicate only through Postgres (job status) and Redis/BullMQ (the job queue itself) —
no direct RPC between the two processes.

## Request flow: assigning a task

1. `POST /tasks/:id/assignments` hits `authenticate` (JWT → `req.auth`), then
   `task.controller.assign` → `assignment.service.assignUser`.
2. The service verifies the task belongs to the caller's org (`task.service.getTaskOrThrow`),
   verifies the assignee is an org member, checks for an existing assignment, then writes the
   `TaskAssignment` row. **This write is the point of no return** — the HTTP response reflects
   success from here on.
3. It then tries to enqueue a BullMQ job (after a Redis `SET NX EX 5` dedup check). Success or
   failure of the enqueue is recorded in a `NotificationJob` row, but never rolls back step 2.
4. The API returns `201` with both the assignment and the notification job (including its id,
   so a caller can immediately poll `GET /jobs/:id`).
5. Independently, the `worker` process picks the job off the queue, calls the mock email
   sender, and updates the same `NotificationJob` row to `active` → `completed` (or, after 3
   retries with exponential backoff, `failed` + a push onto the `email-notifications-dlq`
   queue).

## Data flow: multi-tenancy

Every authenticated request carries `req.auth = { userId, orgId, role }`, taken only from
server-issued JWT claims (never from the request body/query/params). Every service function
that touches org-scoped data takes `orgId` as an explicit parameter and filters by it — there is
no "trust the caller" path. Where a resource is looked up by primary key (a task, a project),
the lookup happens *before* the org check, so a cross-org request gets a clean `403 FORBIDDEN`
with no resource data in the body, distinguishable from `404` only by status code, not content.

## Database

See `prisma/schema.prisma` for the full model and `prisma/migrations/` for the two migrations
(initial schema; a follow-up raw-SQL migration adding the generated `tsvector` full-text-search
column + GIN index, since Prisma has no native tsvector type). FK cascade/restrict choices are
documented as comments directly above each relation in the schema — see the README's "Key
design decisions" section for the summary.

## Why this split (Route → Controller → Service → Data)

- **Routes** (`src/routes/*.js`) — wire HTTP verbs/paths to middleware + controller, and carry
  the Swagger/OpenAPI JSDoc annotations.
- **Controllers** (`src/controllers/*.js`) — thin: pull data off `req`, call one service method,
  set the HTTP status, return JSON. No business logic.
- **Services** (`src/services/*.js`) — all business logic and Prisma calls live here. This is
  what's unit-tested with Prisma mocked out, and what integration tests exercise indirectly
  through the HTTP layer.
- **Data** — Prisma Client (`src/config/prisma.js`), a single shared instance.

This keeps authorization/multi-tenancy logic in one layer (services) rather than scattered
across route handlers, which is what makes "every query is scoped by org_id" an auditable
property instead of a hope.
