jest.mock('../../src/jobs/queue', () => ({
  emailQueue: { add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }) },
  emailDlq: { add: jest.fn() },
}));

const { app, request, registerUser, authHeader } = require('../helpers');
const { emailQueue } = require('../../src/jobs/queue');

describe('Task assignment -> background job (integration, bonus)', () => {
  it('creates the assignment and enqueues an email notification job', async () => {
    const session = await registerUser();

    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(session)).send({ name: 'P' })
    ).body;
    const task = (
      await request(app)
        .post('/api/v1/tasks')
        .set(authHeader(session))
        .send({ projectId: project.id, title: 'Assign me' })
    ).body;

    const res = await request(app)
      .post(`/api/v1/tasks/${task.id}/assignments`)
      .set(authHeader(session))
      .send({ userId: session.user.id });

    expect(res.status).toBe(201);
    expect(res.body.assignment.taskId).toBe(task.id);
    expect(res.body.notificationJob.status).toBe('pending');

    expect(emailQueue.add).toHaveBeenCalledTimes(1);
    expect(emailQueue.add).toHaveBeenCalledWith(
      'send-task-assignment-email',
      expect.objectContaining({ taskId: task.id, to: session.user.email }),
      expect.objectContaining({ attempts: 3 })
    );

    const jobRes = await request(app)
      .get(`/api/v1/jobs/${res.body.notificationJob.id}`)
      .set(authHeader(session));
    expect(jobRes.status).toBe(200);
    expect(jobRes.body.status).toBe('pending');
  });

  it('rejects assigning the same user twice', async () => {
    const session = await registerUser();
    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(session)).send({ name: 'P' })
    ).body;
    const task = (
      await request(app)
        .post('/api/v1/tasks')
        .set(authHeader(session))
        .send({ projectId: project.id, title: 'T' })
    ).body;

    await request(app)
      .post(`/api/v1/tasks/${task.id}/assignments`)
      .set(authHeader(session))
      .send({ userId: session.user.id });

    const res = await request(app)
      .post(`/api/v1/tasks/${task.id}/assignments`)
      .set(authHeader(session))
      .send({ userId: session.user.id });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('ALREADY_ASSIGNED');
  });

  it('unassigns a user from a task', async () => {
    const session = await registerUser();
    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(session)).send({ name: 'P' })
    ).body;
    const task = (
      await request(app)
        .post('/api/v1/tasks')
        .set(authHeader(session))
        .send({ projectId: project.id, title: 'T' })
    ).body;

    await request(app)
      .post(`/api/v1/tasks/${task.id}/assignments`)
      .set(authHeader(session))
      .send({ userId: session.user.id });

    const res = await request(app)
      .delete(`/api/v1/tasks/${task.id}/assignments/${session.user.id}`)
      .set(authHeader(session));

    expect(res.status).toBe(204);
  });
});
