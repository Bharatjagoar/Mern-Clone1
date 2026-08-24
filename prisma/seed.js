const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // --- Organizations -------------------------------------------------
  const acme = await prisma.organization.create({ data: { name: 'Acme Corp' } });
  const globex = await prisma.organization.create({ data: { name: 'Globex Inc' } });

  // --- Users (5 total, spread across the two orgs) --------------------
  const alice = await prisma.user.create({
    data: { email: 'alice@acme.test', name: 'Alice Admin', passwordHash },
  });
  const bob = await prisma.user.create({
    data: { email: 'bob@acme.test', name: 'Bob Builder', passwordHash },
  });
  const carol = await prisma.user.create({
    data: { email: 'carol@acme.test', name: 'Carol Coder', passwordHash },
  });
  const dave = await prisma.user.create({
    data: { email: 'dave@globex.test', name: 'Dave Director', passwordHash },
  });
  const erin = await prisma.user.create({
    data: { email: 'erin@globex.test', name: 'Erin Engineer', passwordHash },
  });

  await prisma.orgMember.createMany({
    data: [
      { orgId: acme.id, userId: alice.id, role: 'org_admin' },
      { orgId: acme.id, userId: bob.id, role: 'member' },
      { orgId: acme.id, userId: carol.id, role: 'member' },
      { orgId: globex.id, userId: dave.id, role: 'org_admin' },
      { orgId: globex.id, userId: erin.id, role: 'member' },
    ],
  });

  // --- Projects ---------------------------------------------------------
  const website = await prisma.project.create({
    data: { orgId: acme.id, name: 'Website Revamp', description: 'Redesign the marketing site' },
  });
  const mobileApp = await prisma.project.create({
    data: { orgId: acme.id, name: 'Mobile App', description: 'Native iOS/Android client' },
  });
  const platform = await prisma.project.create({
    data: { orgId: globex.id, name: 'Core Platform', description: 'Internal platform services' },
  });

  // --- Tasks (12 total, spread across projects/status/priority) --------
  const dueSoon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const dueLater = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

  const taskDefs = [
    { project: website, title: 'Design new homepage hero', description: 'Above-the-fold redesign with new brand colors', status: 'in_progress', priority: 'high', dueDate: dueSoon },
    { project: website, title: 'Migrate blog to new CMS', description: 'Move markdown content into headless CMS', status: 'todo', priority: 'medium', dueDate: dueLater },
    { project: website, title: 'Fix mobile nav overlap bug', description: 'Nav menu overlaps hero text on small screens', status: 'review', priority: 'urgent', dueDate: dueSoon },
    { project: website, title: 'Add newsletter signup form', description: 'Embed Mailchimp signup in footer', status: 'done', priority: 'low', dueDate: null },
    { project: mobileApp, title: 'Implement push notifications', description: 'Wire up FCM/APNs for task assignment alerts', status: 'in_progress', priority: 'high', dueDate: dueLater },
    { project: mobileApp, title: 'Offline mode caching', description: 'Cache task lists for offline viewing', status: 'todo', priority: 'medium', dueDate: dueLater },
    { project: mobileApp, title: 'App store screenshots', description: 'Prepare marketing screenshots for release', status: 'todo', priority: 'low', dueDate: null },
    { project: mobileApp, title: 'Crash on task detail screen', description: 'NPE when task has no assignee', status: 'review', priority: 'urgent', dueDate: dueSoon },
    { project: platform, title: 'Set up rate limiting middleware', description: 'Protect auth endpoints from brute force', status: 'done', priority: 'high', dueDate: null },
    { project: platform, title: 'Add audit logging', description: 'Log all admin actions for compliance', status: 'in_progress', priority: 'medium', dueDate: dueLater },
    { project: platform, title: 'Upgrade Postgres to v16', description: 'Plan and execute zero-downtime migration', status: 'todo', priority: 'high', dueDate: dueLater },
    { project: platform, title: 'Investigate Redis memory spikes', description: 'Memory usage doubles under load, needs profiling', status: 'todo', priority: 'urgent', dueDate: dueSoon },
  ];

  const tasks = [];
  for (const def of taskDefs) {
    const task = await prisma.task.create({
      data: {
        projectId: def.project.id,
        title: def.title,
        description: def.description,
        status: def.status,
        priority: def.priority,
        dueDate: def.dueDate,
      },
    });
    tasks.push(task);
  }

  // --- Assignments ------------------------------------------------------
  await prisma.taskAssignment.createMany({
    data: [
      { taskId: tasks[0].id, userId: bob.id },
      { taskId: tasks[1].id, userId: carol.id },
      { taskId: tasks[2].id, userId: bob.id },
      { taskId: tasks[4].id, userId: carol.id },
      { taskId: tasks[7].id, userId: bob.id },
      { taskId: tasks[9].id, userId: erin.id },
      { taskId: tasks[10].id, userId: dave.id },
      { taskId: tasks[11].id, userId: erin.id },
    ],
  });

  // --- Comments -----------------------------------------------------
  await prisma.comment.createMany({
    data: [
      { taskId: tasks[0].id, userId: alice.id, body: 'Let\'s use the new brand palette from the style guide.' },
      { taskId: tasks[0].id, userId: bob.id, body: 'Working on it, first draft by EOD.' },
      { taskId: tasks[2].id, userId: bob.id, body: 'Repro\'d on iPhone SE, fix incoming.' },
      { taskId: tasks[7].id, userId: alice.id, body: 'This is blocking the release, please prioritize.' },
      { taskId: tasks[9].id, userId: dave.id, body: 'Compliance needs this before end of quarter.' },
    ],
  });

  console.log('Seed complete:');
  console.log(`  organizations: 2, users: 5, projects: 3, tasks: ${tasks.length}`);
  console.log('  All seeded users have password: Password123!');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
