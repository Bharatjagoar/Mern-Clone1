const request = require('supertest');
const app = require('../src/app');

let counter = 0;
function uniqueEmail(prefix = 'user') {
  counter += 1;
  return `${prefix}${Date.now()}${counter}@example.com`;
}

/** Registers a fresh user (+ new org, as org_admin) and returns their session. */
async function registerUser({ email, password = 'Password123!', name = 'Test User', organizationName = 'Test Org' } = {}) {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: email || uniqueEmail(), password, name, organizationName });

  if (res.status !== 201) {
    throw new Error(`registerUser failed: ${res.status} ${JSON.stringify(res.body)}`);
  }

  return {
    accessToken: res.body.accessToken,
    refreshToken: res.body.refreshToken,
    user: res.body.user,
    organization: res.body.organization,
  };
}

function authHeader(session) {
  return { Authorization: `Bearer ${session.accessToken}` };
}

module.exports = { app, request, registerUser, authHeader, uniqueEmail };
