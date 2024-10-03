import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import * as FluentLogger from 'fluent-logger';
import Transport from 'winston-transport';

interface CustomLogger extends winston.Logger {
  logRequest(req: Request, res: Response, next: NextFunction): void;
  logEvent(event: string, details?: any): void;
}

const fluentLogger = FluentLogger.createFluentSender('pops-and-bops-backend', {
  host: 'localhost', // Adjust this if Fluentd is not on localhost
  port: 24224,
  timeout: 3.0,
  requireAckResponse: true,
});

// Custom transport for Fluentd
class FluentTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }
  
  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });
  
    fluentLogger.emit('log', info, (error) => {
      if (error) {
        console.error('Error sending log to Fluentd:', error);
      }
    });
  
    callback();
  }
}

const prodLogger: CustomLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'pops-and-bops-backend' },
  transports: [
    new FluentTransport(),
  ],
}) as CustomLogger;

prodLogger.logRequest = (req: Request, res: Response, next: NextFunction) => {
  prodLogger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: (req as any).user?.id,
    userAgent: req.get('User-Agent'),
    requestId: req.id,
  });
  next();
};

prodLogger.logEvent = (event: string, details?: any) => {
  prodLogger.info(`Event: ${event}`, { event, details });
};

['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'].forEach((level) => {
  (prodLogger as any)[level] = (message: string, meta?: any) => {
    prodLogger.log(level, message, meta);
  };
});

export default prodLogger;