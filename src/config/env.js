require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isTest: process.env.NODE_ENV === 'test',
  port: parseInt(process.env.PORT || '3000', 10),

  // In test mode always prefer TEST_DATABASE_URL, even though .env also
  // sets DATABASE_URL for normal dev use — tests must never run against
  // the dev database.
  databaseUrl:
    process.env.NODE_ENV === 'test'
      ? required('TEST_DATABASE_URL')
      : required('DATABASE_URL'),
  redisUrl: required('REDIS_URL', 'redis://localhost:6379'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev-access-secret-change-me'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtlDays: parseInt(process.env.JWT_REFRESH_TTL_DAYS || '7', 10),
  },

  authRateLimit: {
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  },

  emailRateLimit: {
    max: parseInt(process.env.EMAIL_RATE_LIMIT_MAX || '50', 10),
    windowMs: parseInt(process.env.EMAIL_RATE_LIMIT_WINDOW_MS || '60000', 10),
  },

  bcryptCostFactor: 12,
  assignmentDedupTtlSeconds: 5,
};
