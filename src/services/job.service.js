const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

async function getJob({ id }) {
  const job = await prisma.notificationJob.findUnique({ where: { id } });
  if (!job) throw AppError.notFound('Job not found', 'JOB_NOT_FOUND');

  return {
    id: job.id,
    status: job.status,
    type: job.type,
    attempts: job.attempts,
    metadata: {
      taskId: job.taskId,
      assigneeId: job.assigneeId,
      queueJobId: job.queueJobId,
      lastError: job.lastError,
      ...(job.metadata || {}),
    },
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

module.exports = { getJob };
