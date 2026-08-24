const prisma = require('../config/prisma');
const redis = require('../config/redis');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const taskService = require('./task.service');
const { emailQueue } = require('../jobs/queue');

/**
 * Consistency strategy for "assign task -> send email":
 * 1. The TaskAssignment row is persisted first and is the source of truth;
 *    the HTTP response reflects that success regardless of what happens next.
 * 2. Enqueueing the BullMQ job is attempted after the DB write commits. If
 *    enqueueing throws (e.g. Redis is briefly unavailable), the assignment
 *    is NOT rolled back — losing a real, already-persisted assignment
 *    because a side-effect notification failed to queue would be worse than
 *    a missed email. Instead a NotificationJob row is written with
 *    status "failed" and the error message, so the failure is visible via
 *    GET /jobs/:id and can be retried/alerted on operationally.
 * This is an at-least-once, best-effort notification guarantee, not a
 * two-phase commit — acceptable for a non-critical side channel like email.
 */
async function assignUser({ orgId, taskId, userId, actorId }) {
  const task = await taskService.getTaskOrThrow({ orgId, id: taskId });

  const membership = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
  });
  if (!membership) {
    throw AppError.badRequest(
      'ASSIGNEE_NOT_IN_ORG',
      'The assigned user must belong to the same organization as the task'
    );
  }

  const existing = await prisma.taskAssignment.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });
  if (existing) {
    throw AppError.conflict('User is already assigned to this task', 'ALREADY_ASSIGNED');
  }

  const assignee = await prisma.user.findUnique({ where: { id: userId } });
  const actor = actorId ? await prisma.user.findUnique({ where: { id: actorId } }) : null;

  const assignment = await prisma.taskAssignment.create({
    data: { taskId, userId },
  });

  const notificationJob = await enqueueAssignmentEmail({
    task,
    assignee,
    actorName: actor?.name,
  });

  return { assignment, notificationJob };
}

async function enqueueAssignmentEmail({ task, assignee, actorName }) {
  const dedupKey = `assign:${task.id}:${assignee.id}`;
  // NX+EX: only the first caller within the 5s window wins the key and
  // proceeds to enqueue; concurrent/rapid re-assignments are deduped.
  const acquired = await redis.set(dedupKey, '1', 'EX', env.assignmentDedupTtlSeconds, 'NX');

  if (!acquired) {
    return prisma.notificationJob.create({
      data: {
        type: 'task_assignment_email',
        status: 'completed',
        taskId: task.id,
        assigneeId: assignee.id,
        metadata: { deduped: true },
      },
    });
  }

  const notificationJob = await prisma.notificationJob.create({
    data: {
      type: 'task_assignment_email',
      status: 'pending',
      taskId: task.id,
      assigneeId: assignee.id,
    },
  });

  try {
    const job = await emailQueue.add(
      'send-task-assignment-email',
      {
        notificationJobId: notificationJob.id,
        to: assignee.email,
        taskTitle: task.title,
        taskId: task.id,
        assignerName: actorName,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 1000,
        removeOnFail: false,
      }
    );

    return prisma.notificationJob.update({
      where: { id: notificationJob.id },
      data: { queueJobId: job.id },
    });
  } catch (err) {
    return prisma.notificationJob.update({
      where: { id: notificationJob.id },
      data: { status: 'failed', lastError: String(err.message || err) },
    });
  }
}

async function unassignUser({ orgId, taskId, userId }) {
  await taskService.getTaskOrThrow({ orgId, id: taskId });

  const result = await prisma.taskAssignment.deleteMany({ where: { taskId, userId } });
  if (result.count === 0) {
    throw AppError.notFound('Assignment not found', 'ASSIGNMENT_NOT_FOUND');
  }
}

module.exports = { assignUser, unassignUser };
