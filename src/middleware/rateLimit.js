const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('../config/redis');
const env = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * 10 requests/minute/IP across all /auth/* routes (register, login, refresh,
 * logout share the same bucket per the assignment spec). Backed by Redis so
 * the limit holds even if multiple API replicas are running.
 */
function buildAuthRateLimiter() {
  // The integration suite fires many auth requests in a single 60s window;
  // rate limiting is unit-tested directly (tests/unit) instead of being
  // enforced against the shared Redis bucket during the rest of the suite.
  if (env.isTest) {
    return (req, res, next) => next();
  }

  return rateLimit({
    windowMs: env.authRateLimit.windowMs,
    max: env.authRateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix: 'rl:auth:',
    }),
    handler: (req, res, next) => {
      next(new AppError(429, 'RATE_LIMITED', 'Too many auth requests, please try again later.'));
    },
  });
}

const authRateLimiter = buildAuthRateLimiter();

module.exports = { authRateLimiter, buildAuthRateLimiter };
