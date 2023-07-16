import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '$/lib/logger';

export function errorHandler(
  err: Error & { code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof z.ZodError) {
    logger.warn(`server error: ${JSON.stringify(err, null, 2)}`);
    res
      .status(400)
      .json(
        err.issues.map(({ code, message, path }) => ({ code, message, path }))
      );
  } else if (err.code === 'P2025') {
    logger.warn(`server error: ${JSON.stringify(err, null, 2)}`);
    res.status(404).send('Not found');
  } else {
    logger.error(`unexpected server error: ${JSON.stringify(err, null, 2)}`);
    res.status(500).send('Internal server error');
  }
}
