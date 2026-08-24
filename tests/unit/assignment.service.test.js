jest.mock('../../src/config/prisma', () => ({
  orgMember: { findUnique: jest.fn() },
  taskAssignment: { findUnique: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
  user: { findUnique: jest.fn() },
  notificationJob: { create: jest.fn(), update: jest.fn() },
}));

jest.mock('../../src/services/task.service', () => ({
  getTaskOrThrow: jest.fn(),
}));

jest.mock('../../src/config/redis', () => ({
  set: jest.fn().mockResolvedValue('OK'), // "acquired" the dedup lock by default
}));

jest.mock('../../src/jobs/queue', () => ({
  emailQueue: { add: jest.fn().mockResolvedValue({ id: 'job-1' }) },
}));

const prisma = require('../../src/config/prisma');
const taskService = require('../../src/services/task.service');
const { emailQueue } = require('../../src/jobs/queue');
const assignmentService = require('../../src/services/assignment.service');

const FAKE_TASK = { id: 'task-1', title: 'Do the thing', project: { orgId: 'org-1' } };
const FAKE_ASSIGNEE = { id: 'user-2', email: 'assignee@example.com', name: 'Assignee' };

describe('assignmentService.assignUser (task assignment validation)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskService.getTaskOrThrow.mockResolvedValue(FAKE_TASK);
    prisma.user.findUnique.mockResolvedValue(FAKE_ASSIGNEE);
    prisma.notificationJob.create.mockResolvedValue({ id: 'notif-1' });
    prisma.notificationJob.update.mockResolvedValue({ id: 'notif-1', status: 'pending' });
    prisma.taskAssignment.create.mockResolvedValue({ id: 'assign-1', taskId: 'task-1', userId: 'user-2' });
  });

  it('rejects assigning a user who is not a member of the task\'s organization', async () => {
    prisma.orgMember.findUnique.mockResolvedValue(null);

    await expect(
      assignmentService.assignUser({ orgId: 'org-1', taskId: 'task-1', userId: 'user-2' })
    ).rejects.toMatchObject({ code: 'ASSIGNEE_NOT_IN_ORG' });

    expect(prisma.taskAssignment.create).not.toHaveBeenCalled();
  });

  it('rejects assigning a user who is already assigned to the task', async () => {
    prisma.orgMember.findUnique.mockResolvedValue({ orgId: 'org-1', userId: 'user-2', role: 'member' });
    prisma.taskAssignment.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      assignmentService.assignUser({ orgId: 'org-1', taskId: 'task-1', userId: 'user-2' })
    ).rejects.toMatchObject({ statusCode: 409, code: 'ALREADY_ASSIGNED' });
  });

  it('persists the assignment and enqueues an email job for a valid assignment', async () => {
    prisma.orgMember.findUnique.mockResolvedValue({ orgId: 'org-1', userId: 'user-2', role: 'member' });
    prisma.taskAssignment.findUnique.mockResolvedValue(null);

    const result = await assignmentService.assignUser({
      orgId: 'org-1',
      taskId: 'task-1',
      userId: 'user-2',
    });

    expect(prisma.taskAssignment.create).toHaveBeenCalledWith({
      data: { taskId: 'task-1', userId: 'user-2' },
    });
    expect(emailQueue.add).toHaveBeenCalledTimes(1);
    expect(emailQueue.add).toHaveBeenCalledWith(
      'send-task-assignment-email',
      expect.objectContaining({ to: FAKE_ASSIGNEE.email, taskId: FAKE_TASK.id }),
      expect.objectContaining({ attempts: 3, backoff: { type: 'exponential', delay: 1000 } })
    );
    expect(result.assignment).toBeDefined();
  });

  it('deduplicates: skips enqueueing when the dedup key is already held', async () => {
    prisma.orgMember.findUnique.mockResolvedValue({ orgId: 'org-1', userId: 'user-2', role: 'member' });
    prisma.taskAssignment.findUnique.mockResolvedValue(null);
    require('../../src/config/redis').set.mockResolvedValueOnce(null); // NX lock not acquired

    await assignmentService.assignUser({ orgId: 'org-1', taskId: 'task-1', userId: 'user-2' });

    expect(emailQueue.add).not.toHaveBeenCalled();
    expect(prisma.notificationJob.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'completed' }) })
    );
  });
});
