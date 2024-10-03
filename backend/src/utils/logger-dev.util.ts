import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import path from 'path';

interface CustomLogger extends winston.Logger {
  logRequest(req: Request, res: Response, next: NextFunction): void;
  logEvent(event: string, details?: any): void;
}

const logDir = path.join(__dirname, '..', '..', 'logs');

const devLogger: CustomLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'pops-and-bops-backend' },
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
}) as CustomLogger;

devLogger.logRequest = (req: Request, res: Response, next: NextFunction) => {
  devLogger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: (req as any).user?.id,
    userAgent: req.get('User-Agent'),
    requestId: req.id,
  });
  next();
};

devLogger.logEvent = (event: string, details?: any) => {
  devLogger.info(`Event: ${event}`, { event, details });
};

['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'].forEach((level) => {
  (devLogger as any)[level] = (message: string, meta?: any) => {
    devLogger.log(level, message, meta);
  };
});

export default devLogger;