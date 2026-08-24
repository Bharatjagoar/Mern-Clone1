const { app, request, registerUser, authHeader } = require('../helpers');

async function createProject(session, overrides = {}) {
  const res = await request(app)
    .post('/api/v1/projects')
    .set(authHeader(session))
    .send({ name: 'Test Project', ...overrides });
  return res.body;
}

async function createTask(session, projectId, overrides = {}) {
  const res = await request(app)
    .post('/api/v1/tasks')
    .set(authHeader(session))
    .send({ projectId, title: 'Test Task', ...overrides });
  return res.body;
}

describe('Task CRUD (integration)', () => {
  it('creates, lists, updates and soft-deletes a task', async () => {
    const session = await registerUser();
    const project = await createProject(session);

    const created = await createTask(session, project.id, { priority: 'high', status: 'todo' });
    expect(created.id).toBeDefined();
    expect(created.priority).toBe('high');

    const listRes = await request(app)
      .get('/api/v1/tasks')
      .set(authHeader(session));
    expect(listRes.status).toBe(200);
    expect(listRes.body).toMatchObject({ total: 1, page: 1, limit: 20 });
    expect(listRes.body.data).toHaveLength(1);

    const updateRes = await request(app)
      .patch(`/api/v1/tasks/${created.id}`)
      .set(authHeader(session))
      .send({ status: 'done' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('done');

    const deleteRes = await request(app)
      .delete(`/api/v1/tasks/${created.id}`)
      .set(authHeader(session));
    expect(deleteRes.status).toBe(204);

    const afterDeleteList = await request(app)
      .get('/api/v1/tasks')
      .set(authHeader(session));
    expect(afterDeleteList.body.total).toBe(0);

    const getDeleted = await request(app)
      .get(`/api/v1/tasks/${created.id}`)
      .set(authHeader(session));
    expect(getDeleted.status).toBe(404);
    expect(getDeleted.body.code).toBe('TASK_NOT_FOUND');
  });

  it('filters tasks by status and priority', async () => {
    const session = await registerUser();
    const project = await createProject(session);
    await createTask(session, project.id, { title: 'Urgent one', status: 'todo', priority: 'urgent' });
    await createTask(session, project.id, { title: 'Low one', status: 'done', priority: 'low' });

    const res = await request(app)
      .get('/api/v1/tasks')
      .query({ status: 'todo', priority: 'urgent' })
      .set(authHeader(session));

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Urgent one');
  });

  it('paginates results', async () => {
    const session = await registerUser();
    const project = await createProject(session);
    for (let i = 0; i < 5; i++) {
      await createTask(session, project.id, { title: `Task ${i}` });
    }

    const res = await request(app)
      .get('/api/v1/tasks')
      .query({ page: 2, limit: 2 })
      .set(authHeader(session));

    expect(res.body).toMatchObject({ total: 5, page: 2, limit: 2 });
    expect(res.body.data).toHaveLength(2);
  });

  it('rejects invalid task creation payloads', async () => {
    const session = await registerUser();
    const res = await request(app)
      .post('/api/v1/tasks')
      .set(authHeader(session))
      .send({ title: 'Missing projectId' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns the required consistent error shape for a missing task', async () => {
    const session = await registerUser();
    const res = await request(app)
      .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
      .set(authHeader(session));

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: expect.any(String),
      code: 'TASK_NOT_FOUND',
      details: expect.any(Object),
    });
  });

  it('computes a project dashboard grouped by status', async () => {
    const session = await registerUser();
    const project = await createProject(session);
    await createTask(session, project.id, { status: 'todo' });
    await createTask(session, project.id, { status: 'todo' });
    await createTask(session, project.id, { status: 'done' });

    const res = await request(app)
      .get(`/api/v1/projects/${project.id}/dashboard`)
      .set(authHeader(session));

    expect(res.status).toBe(200);
    expect(res.body.counts).toMatchObject({ todo: 2, done: 1, in_progress: 0, review: 0 });
    expect(res.body.total).toBe(3);
  });

  it('adds and lists comments on a task', async () => {
    const session = await registerUser();
    const project = await createProject(session);
    const task = await createTask(session, project.id);

    const createRes = await request(app)
      .post(`/api/v1/tasks/${task.id}/comments`)
      .set(authHeader(session))
      .send({ body: 'First comment' });
    expect(createRes.status).toBe(201);
    expect(createRes.body.body).toBe('First comment');
    expect(createRes.body.user.email).toBe(session.user.email);

    const listRes = await request(app)
      .get(`/api/v1/tasks/${task.id}/comments`)
      .set(authHeader(session));
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
  });

  it('bulk-updates task status', async () => {
    const session = await registerUser();
    const project = await createProject(session);
    const t1 = await createTask(session, project.id);
    const t2 = await createTask(session, project.id);

    const res = await request(app)
      .patch('/api/v1/tasks/bulk-status')
      .set(authHeader(session))
      .send({ taskIds: [t1.id, t2.id], status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.updated).toBe(2);
  });
});
