const { PrismaClient } = require('@prisma/client');
const env = require('./env');

// Single shared client instance across the process (API and worker each
// require this module once at startup). The datasource URL is passed
// explicitly (rather than relying on Prisma's own env("DATABASE_URL")
// lookup) so NODE_ENV=test reliably points at TEST_DATABASE_URL even
// though .env also sets DATABASE_URL for normal dev use.
const prisma = new PrismaClient({
  datasources: { db: { url: env.databaseUrl } },
});

module.exports = prisma;
