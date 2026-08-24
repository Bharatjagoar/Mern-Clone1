const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

async function listProjects({ orgId, query }) {
  const { page, limit, skip, take } = parsePagination(query);
  const where = { orgId, deletedAt: null };

  const [data, total] = await Promise.all([
    prisma.project.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.project.count({ where }),
  ]);

  return buildPaginatedResponse(data, total, page, limit);
}

async function getProject({ orgId, id }) {
  const project = await prisma.project.findFirst({ where: { id, deletedAt: null } });
  if (!project) throw AppError.notFound('Project not found', 'PROJECT_NOT_FOUND');
  // Existence is checked without the org filter first so that a
  // cross-tenant lookup returns 403 rather than a leaky 404.
  if (project.orgId !== orgId) {
    throw AppError.forbidden('You do not have access to this project');
  }
  return project;
}

async function createProject({ orgId, data }) {
  return prisma.project.create({ data: { ...data, orgId } });
}

async function updateProject({ orgId, id, data }) {
  await getProject({ orgId, id }); // enforces org scoping + 403/404
  return prisma.project.update({ where: { id }, data });
}

async function deleteProject({ orgId, id }) {
  await getProject({ orgId, id });
  // Soft delete only.
  await prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
}

async function getDashboard({ orgId, id }) {
  await getProject({ orgId, id });

  const grouped = await prisma.task.groupBy({
    by: ['status'],
    where: { projectId: id, deletedAt: null },
    _count: { _all: true },
  });

  const counts = { todo: 0, in_progress: 0, review: 0, done: 0 };
  for (const row of grouped) {
    counts[row.status] = row._count._all;
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return { projectId: id, total, counts };
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject, getDashboard };
