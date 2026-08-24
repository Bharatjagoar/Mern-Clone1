const prisma = require('../src/config/prisma');

// FK-safe order: children before parents.
const TABLES_IN_DELETE_ORDER = [
  'comments',
  'task_assignments',
  'notification_jobs',
  'tasks',
  'projects',
  'refresh_tokens',
  'org_members',
  'users',
  'organizations',
];

async function truncateAll() {
  await prisma.$transaction(
    TABLES_IN_DELETE_ORDER.map((table) =>
      prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`)
    )
  );
}

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();

  // Best-effort close of the shared Redis/BullMQ connections opened at
  // module-load time by config/redis.js and jobs/queue.js. `--forceExit`
  // (see package.json) is the backstop since BullMQ/ioredis don't always
  // release their sockets deterministically within Jest's teardown window.
  try {
    const redis = require('../src/config/redis');
    await redis.quit();
  } catch (_) {
    // ignore
  }
  try {
    const { connection, emailQueue, emailDlq } = require('../src/jobs/queue');
    await emailQueue.close();
    await emailDlq.close();
    await connection.quit();
  } catch (_) {
    // ignore
  }
});

module.exports = { truncateAll };
