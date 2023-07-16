import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '$/lib/swagger';
import { shorten } from './shorten';
import { stats } from './stats';
import { redirect } from './redirect';

const v1 = express.Router();

v1.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
v1.use('/shorten', shorten);
v1.use('/stats', stats);

export { v1, redirect as v1Redirect };
