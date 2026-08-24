const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const openapiSpec = require('./docs/openapi');
const env = require('./config/env');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (!env.isTest) app.use(morgan('dev'));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/openapi.json', (req, res) => res.status(200).json(openapiSpec));

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', code: 'ROUTE_NOT_FOUND', details: {} });
});

app.use(errorHandler);

module.exports = app;
