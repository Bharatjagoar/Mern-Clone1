const prisma = require('../config/prisma');
const taskService = require('./task.service');

async function listComments({ orgId, taskId }) {
  await taskService.getTaskOrThrow({ orgId, id: taskId }); // enforces org scoping

  return prisma.comment.findMany({
    where: { taskId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

async function createComment({ orgId, taskId, userId, body }) {
  await taskService.getTaskOrThrow({ orgId, id: taskId });

  return prisma.comment.create({
    data: { taskId, userId, body },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

module.exports = { listComments, createComment };
