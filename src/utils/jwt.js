const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function signAccessToken({ userId, orgId, role }) {
  return jwt.sign({ sub: userId, orgId, role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

/** Opaque refresh tokens: random bytes handed to the client, only the hash
 * is persisted so a leaked DB dump can't be replayed as a live token. */
function generateRefreshToken() {
  const token = crypto.randomBytes(48).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.jwt.refreshTtlDays * 24 * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { signAccessToken, verifyAccessToken, generateRefreshToken, hashToken };
