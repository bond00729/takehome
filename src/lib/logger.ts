import pino from 'pino';
import pinoHttp from 'pino-http';

const logLevel = process.env.LOG_LEVEL || 'info';

export const httpLogger =
  process.env.NODE_ENV === 'production'
    ? pinoHttp({ level: logLevel })
    : pinoHttp({
        level: logLevel,
        transport: {
          target: 'pino-pretty',
        },
      });

export const logger =
  process.env.NODE_ENV === 'production'
    ? pino({ level: logLevel })
    : pino({
        level: logLevel,
        transport: {
          target: 'pino-pretty',
        },
      });
