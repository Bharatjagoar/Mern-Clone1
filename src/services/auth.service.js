const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { signAccessToken, generateRefreshToken, hashToken } = require('../utils/jwt');

async function issueTokenPair({ userId, orgId, role }) {
  const accessToken = signAccessToken({ userId, orgId, role });
  const { token: refreshToken, tokenHash, expiresAt } = generateRefreshToken();

  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return { accessToken, refreshToken };
}

async function register({ email, password, name, organizationName }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw AppError.conflict('An account with this email already exists', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptCostFactor);

  const { user, org, membership } = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({ data: { name: organizationName } });
    const user = await tx.user.create({ data: { email, passwordHash, name } });
    const membership = await tx.orgMember.create({
      data: { orgId: org.id, userId: user.id, role: 'org_admin' },
    });
    return { user, org, membership };
  });

  const tokens = await issueTokenPair({ userId: user.id, orgId: org.id, role: membership.role });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    organization: { id: org.id, name: org.name },
    ...tokens,
  };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // A user can belong to multiple orgs in principle; login scopes the
  // session to their first (oldest) membership, which is the only one
  // created by our register flow.
  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });
  if (!membership) {
    throw AppError.unauthorized('User has no organization membership', 'NO_ORG_MEMBERSHIP');
  }

  const tokens = await issueTokenPair({
    userId: user.id,
    orgId: membership.orgId,
    role: membership.role,
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    orgId: membership.orgId,
    role: membership.role,
    ...tokens,
  };
}

async function refresh({ refreshToken }) {
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw AppError.unauthorized('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
  }

  const membership = await prisma.orgMember.findFirst({
    where: { userId: stored.userId },
    orderBy: { createdAt: 'asc' },
  });
  if (!membership) {
    throw AppError.unauthorized('User has no organization membership', 'NO_ORG_MEMBERSHIP');
  }

  // Rotation: the presented token is revoked and a fresh pair issued,
  // linked via replacedByTokenId so reuse of a revoked token is detectable.
  const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair({
    userId: stored.userId,
    orgId: membership.orgId,
    role: membership.role,
  });

  const newStored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(newRefreshToken) },
  });
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date(), replacedByTokenId: newStored.id },
  });

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout({ refreshToken }) {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function logoutAll({ userId }) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

module.exports = { register, login, refresh, logout, logoutAll, issueTokenPair };
