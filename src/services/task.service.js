const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');
const projectService = require('./project.service');

function buildTaskFilters({ orgId, query }) {
  const where = {
    deletedAt: null,
    project: { orgId, deletedAt: null },
  };

  if (query.projectId) where.projectId = query.projectId;
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.assignee) where.assignments = { some: { userId: query.assignee } };

  if (query.dueFrom || query.dueTo) {
    where.dueDate = {};
    if (query.dueFrom) where.dueDate.gte = new Date(query.dueFrom);
    if (query.dueTo) where.dueDate.lte = new Date(query.dueTo);
  }

  return where;
}

async function listTasks({ orgId, query }) {
  const { page, limit, skip, take } = parsePagination(query);
  const where = buildTaskFilters({ orgId, query });

  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { assignments: { include: { user: { select: { id: true, name: true, email: true } } } } },
    }),
    prisma.task.count({ where }),
  ]);

  return buildPaginatedResponse(data, total, page, limit);
}

/**
 * Loads a task and enforces org scoping. Distinguishes "doesn't exist"
 * (404) from "exists but belongs to another org" (403, no resource data
 * leaked) from "exists but soft-deleted" (404, indistinguishable from
 * never having existed to the caller).
 */
async function getTaskOrThrow({ orgId, id }) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true, assignments: { include: { user: { select: { id: true, name: true, email: true } } } } },
  });

  if (!task) throw AppError.notFound('Task not found', 'TASK_NOT_FOUND');
  if (task.project.orgId !== orgId) {
    throw AppError.forbidden('You do not have access to this task');
  }
  if (task.deletedAt) throw AppError.notFound('Task not found', 'TASK_NOT_FOUND');

  return task;
}

async function createTask({ orgId, data }) {
  await projectService.getProject({ orgId, id: data.projectId });

  return prisma.task.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
}

async function updateTask({ orgId, id, data }) {
  await getTaskOrThrow({ orgId, id });

  return prisma.task.update({
    where: { id },
    data: {
      ...data,
      dueDate: data.dueDate === undefined ? undefined : data.dueDate ? new Date(data.dueDate) : null,
    },
  });
}

async function deleteTask({ orgId, id }) {
  await getTaskOrThrow({ orgId, id });
  await prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
}

async function bulkUpdateStatus({ orgId, taskIds, status }) {
  const where = { id: { in: taskIds }, deletedAt: null, project: { orgId } };
  const matching = await prisma.task.findMany({ where, select: { id: true } });

  if (matching.length !== taskIds.length) {
    throw AppError.forbidden(
      'One or more tasks were not found in your organization',
      'TASK_NOT_FOUND'
    );
  }

  const result = await prisma.task.updateMany({ where, data: { status } });
  return { updated: result.count };
}

async function searchTasks({ orgId, q, query }) {
  const { page, limit, skip, take } = parsePagination(query);

  // Raw SQL for full-text search against the generated tsvector column
  // (search_vector, added in the FTS migration) with a GIN index behind it.
  // Explicit column list (not t.*): Prisma's $queryRaw can't deserialize
  // the raw tsvector search_vector column.
  const rows = await prisma.$queryRaw`
    SELECT t.id, t.project_id AS "projectId", t.title, t.description, t.status,
           t.priority, t.due_date AS "dueDate", t.deleted_at AS "deletedAt",
           t.created_at AS "createdAt", t.updated_at AS "updatedAt"
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE p.org_id = ${orgId}
      AND t.deleted_at IS NULL
      AND p.deleted_at IS NULL
      AND t.search_vector @@ plainto_tsquery('english', ${q})
    ORDER BY ts_rank(t.search_vector, plainto_tsquery('english', ${q})) DESC
    OFFSET ${skip} LIMIT ${take}
  `;

  const countRows = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE p.org_id = ${orgId}
      AND t.deleted_at IS NULL
      AND p.deleted_at IS NULL
      AND t.search_vector @@ plainto_tsquery('english', ${q})
  `;

  const total = countRows[0]?.count ?? 0;
  return buildPaginatedResponse(rows, total, page, limit);
}

module.exports = {
  listTasks,
  getTaskOrThrow,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateStatus,
  searchTasks,
};
