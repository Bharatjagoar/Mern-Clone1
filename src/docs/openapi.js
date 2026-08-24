const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description:
        'Multi-tenant project management backend: organizations, projects, tasks, ' +
        'assignments, and background email notifications.',
    },
    servers: [{ url: '/api/v1', description: 'Current server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
            details: { type: 'object' },
          },
        },
      },
    },
  },
  // glob (used internally by swagger-jsdoc) needs forward slashes even on
  // Windows, so this can't just be path.join(__dirname, '../routes/*.js').
  apis: [path.join(__dirname, '../routes/*.js').split(path.sep).join('/')],
});

module.exports = spec;
