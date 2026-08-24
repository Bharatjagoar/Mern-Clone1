const { app, request, registerUser, authHeader, uniqueEmail } = require('../helpers');

describe('Auth flow (integration)', () => {
  it('registers a new user + org and returns tokens', async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'Password123!', name: 'Alice', organizationName: 'Acme' });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('rejects duplicate email registration', async () => {
    const email = uniqueEmail();
    await registerUser({ email });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'Password123!', name: 'Bob', organizationName: 'Other Org' });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EMAIL_TAKEN');
  });

  it('logs in with correct credentials', async () => {
    const email = uniqueEmail();
    await registerUser({ email, password: 'Password123!' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    const email = uniqueEmail();
    await registerUser({ email, password: 'Password123!' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('rejects malformed registration payloads with a validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'short', name: '', organizationName: '' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('rotates the refresh token and rejects the old one after refresh', async () => {
    const session = await registerUser();

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: session.refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.refreshToken).not.toBe(session.refreshToken);

    const reuseOldRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: session.refreshToken });
    expect(reuseOldRes.status).toBe(401);
  });

  it('logout revokes the refresh token', async () => {
    const session = await registerUser();

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: session.refreshToken });
    expect(logoutRes.status).toBe(204);

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: session.refreshToken });
    expect(refreshRes.status).toBe(401);
  });

  it('logout-all revokes every refresh token for the user', async () => {
    const session = await registerUser();

    // Log in a second time to get a second refresh token for the same user.
    const secondLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: session.user.email, password: 'Password123!' });
    const secondRefreshToken = secondLogin.body.refreshToken;

    const logoutAllRes = await request(app)
      .post('/api/v1/auth/logout-all')
      .set(authHeader(session));
    expect(logoutAllRes.status).toBe(204);

    const refreshOriginal = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: session.refreshToken });
    expect(refreshOriginal.status).toBe(401);

    const refreshSecond = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: secondRefreshToken });
    expect(refreshSecond.status).toBe(401);
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });
});
