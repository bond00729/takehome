import pino from 'pino';
import pinoHttp from 'pino-http';

export const httpLogger =
  process.env.NODE_ENV === 'production'
    ? pinoHttp()
    : pinoHttp({
        transport: {
          target: 'pino-pretty',
        },
      });

export const logger =
  process.env.NODE_ENV === 'production'
    ? pino()
    : pino({
        transport: {
          target: 'pino-pretty',
        },
      });
