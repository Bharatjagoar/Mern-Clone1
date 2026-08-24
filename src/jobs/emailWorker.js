const { Worker } = require('bullmq');
const prisma = require('../config/prisma');
const env = require('../config/env');
const { sendTaskAssignmentEmail } = require('./emailService');
const { connection, emailDlq, EMAIL_QUEUE_NAME } = require('./queue');

async function processor(job) {
  const { notificationJobId, to, taskTitle, taskId, assignerName } = job.data;

  if (notificationJobId) {
    await prisma.notificationJob.update({
      where: { id: notificationJobId },
      data: { status: 'active', attempts: job.attemptsMade + 1 },
    });
  }

  await sendTaskAssignmentEmail({ to, taskTitle, taskId, assignerName });

  return { sentAt: new Date().toISOString() };
}

function createEmailWorker() {
  const worker = new Worker(EMAIL_QUEUE_NAME, processor, {
    connection,
    // Global email rate limit: 50 jobs/minute across the whole queue.
    limiter: { max: env.emailRateLimit.max, duration: env.emailRateLimit.windowMs },
  });

  worker.on('completed', async (job) => {
    const { notificationJobId } = job.data;
    if (!notificationJobId) return;
    await prisma.notificationJob.update({
      where: { id: notificationJobId },
      data: { status: 'completed' },
    });
  });

  worker.on('failed', async (job, err) => {
    if (!job) return;
    const { notificationJobId } = job.data;
    const exhausted = job.attemptsMade >= (job.opts.attempts || 1);

    if (notificationJobId) {
      await prisma.notificationJob.update({
        where: { id: notificationJobId },
        data: {
          status: exhausted ? 'failed' : 'pending',
          attempts: job.attemptsMade,
          lastError: String(err?.message || err),
        },
      });
    }

    // Retries (1s -> 2s -> 4s) exhausted: move the job to an explicit
    // dead-letter queue for operator visibility/replay.
    if (exhausted) {
      await emailDlq.add('failed-email-notification', {
        ...job.data,
        error: String(err?.message || err),
        failedAt: new Date().toISOString(),
      });
    }
  });

  return worker;
}

module.exports = { createEmailWorker };
