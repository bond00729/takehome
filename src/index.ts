import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { v1, v1Redirect } from './v1';
import { errorHandler } from './utils/errorHandler';
import { notFoundHandler } from './utils/notFoundHandler';
import { asyncHandler } from './utils/asyncHandler';
import { httpLogger, logger } from './lib/logger';

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
        url: process.env.SERVER_URL,
      },
    ],
  },
  apis: ['./src/v1/**/*.ts'],
});

const app = express();
app.use(express.json());
app.use(httpLogger);

app.use('/api/v1', v1);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // TODO: move this to v1 router
app.get('/:slug', asyncHandler(v1Redirect));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => {
  logger.info(`🚀 [server]: Server is running at ${process.env.SERVER_URL}`);
});
