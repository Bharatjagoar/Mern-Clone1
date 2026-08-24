const AppError = require('../utils/AppError');

/** Requires req.auth.role to be one of `roles`. Must run after `authenticate`. */
function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.auth) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.auth.role)) {
      return next(AppError.forbidden('Insufficient role for this action', 'INSUFFICIENT_ROLE'));
    }
    next();
  };
}

module.exports = { requireRole };
