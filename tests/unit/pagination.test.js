const { parsePagination, buildPaginatedResponse } = require('../../src/utils/pagination');

describe('parsePagination', () => {
  it('defaults to page 1, limit 20 when no query given', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 20, skip: 0, take: 20 });
  });

  it('computes skip from page and limit', () => {
    expect(parsePagination({ page: '3', limit: '10' })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
      take: 10,
    });
  });

  it('falls back to defaults for invalid page/limit instead of throwing', () => {
    expect(parsePagination({ page: 'abc', limit: '-5' })).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
      take: 20,
    });
  });

  it('caps limit at MAX_LIMIT (100)', () => {
    expect(parsePagination({ limit: '9999' })).toEqual({
      page: 1,
      limit: 100,
      skip: 0,
      take: 100,
    });
  });

  it('treats page 0 or negative as page 1', () => {
    expect(parsePagination({ page: '0' }).page).toBe(1);
    expect(parsePagination({ page: '-2' }).page).toBe(1);
  });
});

describe('buildPaginatedResponse', () => {
  it('builds the required offset-pagination envelope', () => {
    expect(buildPaginatedResponse([1, 2], 2, 1, 20)).toEqual({
      data: [1, 2],
      total: 2,
      page: 1,
      limit: 20,
    });
  });
});
