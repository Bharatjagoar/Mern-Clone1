jest.mock('../../src/config/prisma', () => ({
  user: { findUnique: jest.fn(), create: jest.fn() },
  organization: { create: jest.fn() },
  orgMember: { create: jest.fn(), findFirst: jest.fn() },
  refreshToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  $transaction: jest.fn(),
}));

const prisma = require('../../src/config/prisma');
const authService = require('../../src/services/auth.service');
const { signAccessToken, verifyAccessToken, generateRefreshToken, hashToken } = require('../../src/utils/jwt');

describe('jwt utils (pure auth logic)', () => {
  it('signs and verifies an access token round-trip with the right claims', () => {
    const token = signAccessToken({ userId: 'u1', orgId: 'o1', role: 'org_admin' });
    const payload = verifyAccessToken(token);
    expect(payload).toMatchObject({ sub: 'u1', orgId: 'o1', role: 'org_admin' });
  });

  it('rejects a tampered/invalid access token', () => {
    expect(() => verifyAccessToken('not-a-real-token')).toThrow();
  });

  it('generates a refresh token whose hash is deterministic for the same token', () => {
    const { token, tokenHash, expiresAt } = generateRefreshToken();
    expect(token).toHaveLength(96); // 48 random bytes as hex
    expect(hashToken(token)).toBe(tokenHash);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('produces different tokens/hashes on each call', () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a.token).not.toBe(b.token);
    expect(a.tokenHash).not.toBe(b.tokenHash);
  });
});

describe('authService.register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects registration when the email is already taken', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      authService.register({
        email: 'taken@example.com',
        password: 'password123',
        name: 'Someone',
        organizationName: 'Acme',
      })
    ).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_TAKEN' });
  });
});

describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects login for a non-existent email without leaking whether the account exists', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'nobody@example.com', password: 'whatever' })
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });

  it('rejects login for a wrong password', async () => {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('correct-password', 4);
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash });

    await expect(
      authService.login({ email: 'a@b.com', password: 'wrong-password' })
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });
});
