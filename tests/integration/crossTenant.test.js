const { app, request, registerUser, authHeader } = require('../helpers');
const prisma = require('../../src/config/prisma');

describe('Cross-tenant isolation (integration)', () => {
  it('returns 403 (not 404) when accessing another org\'s project, without leaking data', async () => {
    const orgA = await registerUser({ organizationName: 'Org A' });
    const orgB = await registerUser({ organizationName: 'Org B' });

    const projectRes = await request(app)
      .post('/api/v1/projects')
      .set(authHeader(orgA))
      .send({ name: 'Org A Secret Project' });
    const projectId = projectRes.body.id;

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set(authHeader(orgB));

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
    expect(JSON.stringify(res.body)).not.toContain('Org A Secret Project');
  });

  it('returns 403 when accessing another org\'s task', async () => {
    const orgA = await registerUser({ organizationName: 'Org A' });
    const orgB = await registerUser({ organizationName: 'Org B' });

    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(orgA)).send({ name: 'P' })
    ).body;
    const task = (
      await request(app)
        .post('/api/v1/tasks')
        .set(authHeader(orgA))
        .send({ projectId: project.id, title: 'Secret task' })
    ).body;

    const res = await request(app).get(`/api/v1/tasks/${task.id}`).set(authHeader(orgB));
    expect(res.status).toBe(403);
  });

  it('rejects creating a task under another org\'s project', async () => {
    const orgA = await registerUser({ organizationName: 'Org A' });
    const orgB = await registerUser({ organizationName: 'Org B' });

    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(orgA)).send({ name: 'P' })
    ).body;

    const res = await request(app)
      .post('/api/v1/tasks')
      .set(authHeader(orgB))
      .send({ projectId: project.id, title: 'Should not be allowed' });

    expect(res.status).toBe(403);
  });

  it('rejects assigning a task to a user outside the org', async () => {
    const orgA = await registerUser({ organizationName: 'Org A' });
    const orgB = await registerUser({ organizationName: 'Org B' });

    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(orgA)).send({ name: 'P' })
    ).body;
    const task = (
      await request(app)
        .post('/api/v1/tasks')
        .set(authHeader(orgA))
        .send({ projectId: project.id, title: 'T' })
    ).body;

    const res = await request(app)
      .post(`/api/v1/tasks/${task.id}/assignments`)
      .set(authHeader(orgA))
      .send({ userId: orgB.user.id });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('ASSIGNEE_NOT_IN_ORG');
  });

  it('non-admin members cannot delete projects', async () => {
    const admin = await registerUser({ organizationName: 'Org C' });
    const project = (
      await request(app).post('/api/v1/projects').set(authHeader(admin)).send({ name: 'P' })
    ).body;

    // Registration always creates a brand-new org (the user becomes its
    // org_admin) — there's no public endpoint to sign up straight into an
    // existing org as a plain member. To exercise the "member" role against
    // Org C specifically, register normally then re-point that user's only
    // membership at Org C directly via Prisma (org add/remove is covered by
    // org.service directly; this test is about RBAC enforcement, not that
    // membership-management flow).
    const memberEmail = `member-${Date.now()}@example.com`;
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: memberEmail, password: 'Password123!', name: 'Member', organizationName: 'Temp' });

    const memberUser = await prisma.user.findUnique({ where: { email: memberEmail } });
    await prisma.orgMember.deleteMany({ where: { userId: memberUser.id } });
    await prisma.orgMember.create({
      data: { orgId: admin.organization.id, userId: memberUser.id, role: 'member' },
    });

    const memberLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: memberEmail, password: 'Password123!' });
    const memberSession = { accessToken: memberLogin.body.accessToken };

    const res = await request(app)
      .delete(`/api/v1/projects/${project.id}`)
      .set(authHeader(memberSession));

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('INSUFFICIENT_ROLE');
  });
});
