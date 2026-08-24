const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/jwt');

/**
 * Verifies the access JWT and attaches `req.auth = {userId, orgId, role}`.
 * These claims are server-issued at login/refresh time — every downstream
 * service call scopes its queries by `req.auth.orgId`, NEVER by any org id
 * a client might send in a body/query/param.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(AppError.unauthorized('Missing or malformed Authorization header'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, orgId: payload.orgId, role: payload.role };
    next();
  } catch (err) {
    next(AppError.unauthorized('Invalid or expired access token', 'INVALID_TOKEN'));
  }
}

module.exports = { authenticate };
