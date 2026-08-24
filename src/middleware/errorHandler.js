const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details || {},
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: { issues: err.issues },
    });
  }

  if (err && err.code === 'P2025') {
    // Prisma "record not found" on update/delete
    return res.status(404).json({ error: 'Not found', code: 'NOT_FOUND', details: {} });
  }

  console.error(err);
  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    details: {},
  });
}

module.exports = errorHandler;
