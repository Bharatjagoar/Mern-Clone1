/**
 * Validates req.body/query/params against Zod schemas and replaces them
 * with the parsed (coerced/defaulted) values. Throws ZodError on failure,
 * which errorHandler turns into a 400 VALIDATION_ERROR response.
 */
function validate({ body, query, params }) {
  return function (req, res, next) {
    try {
      if (body) req.body = body.parse(req.body);
      if (query) req.query = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;
