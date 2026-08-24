-- Full-text search bonus: a generated tsvector column combining title
-- (weighted higher) and description, kept automatically in sync by
-- Postgres on every insert/update, plus a GIN index so
-- `search_vector @@ plainto_tsquery(...)` queries are index-scanned rather
-- than sequential-scanned. Prisma has no native tsvector type, so this
-- column is managed entirely in raw SQL and excluded from schema.prisma;
-- application code reads it via $queryRaw in task.service.js.
ALTER TABLE "tasks"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("description", '')), 'B')
  ) STORED;

CREATE INDEX "tasks_search_vector_idx" ON "tasks" USING GIN ("search_vector");
