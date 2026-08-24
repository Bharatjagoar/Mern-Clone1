const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses `page`/`limit` query params into safe integers and the
 * corresponding Prisma `skip`/`take` values. Invalid or out-of-range input
 * falls back to sane defaults rather than throwing, since pagination params
 * are not critical user input.
 */
function parsePagination(query = {}) {
  let page = parseInt(query.page, 10);
  if (!Number.isInteger(page) || page < 1) page = 1;

  let limit = parseInt(query.limit, 10);
  if (!Number.isInteger(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;
  return { page, limit, skip, take: limit };
}

/** Builds the assignment-required offset pagination envelope. */
function buildPaginatedResponse(data, total, page, limit) {
  return { data, total, page, limit };
}

module.exports = { parsePagination, buildPaginatedResponse, DEFAULT_LIMIT, MAX_LIMIT };
