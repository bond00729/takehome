import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import pino from 'pino-http';

import { v1, v1Redirect } from './v1';
import { errorHandler } from './utils/errorHandler';
import { notFoundHandler } from './utils/notFoundHandler';
import { asyncHandler } from './utils/asyncHandler';

const swaggerSpec = swaggerJsDoc({
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Takehome',
      version: '1.0.0',
      description:
        'This is a REST API made with Express for the takehome assessment.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/v1/**/*.ts'],
});

const app = express();
app.use(express.json());
app.use(
  process.env.NODE_ENV === 'production'
    ? pino()
    : pino({
        transport: {
          target: 'pino-pretty',
        },
      })
);

app.use('/api/v1', v1);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/:slug', asyncHandler(v1Redirect));

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  // TODO: should i use winston or log-level instead of console log?
  console.log(`🚀 [server]: Server is running at http://localhost:${port}`);
});
