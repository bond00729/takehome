import express, { urlencoded, json } from 'express';

import { v1, v1Redirect } from '$/v1';
import { errorHandler } from '$/utils/errorHandler';
import { notFoundHandler } from '$/utils/notFoundHandler';
import { asyncHandler } from '$/utils/asyncHandler';
import { httpLogger, logger } from '$/lib/logger';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(httpLogger);

app.use('/api/v1', v1);
app.get('/:slug', asyncHandler(v1Redirect));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => {
  logger.info(`🚀 [server]: Server is running at ${process.env.SERVER_URL}`);
});

export { app };
