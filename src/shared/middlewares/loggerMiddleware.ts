import { logger, loggerStorage } from "@shared/logger/logger-context";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const correlationId = req.headers["x-request-id"] || randomUUID();
  const childLogger = logger.child({ 
    correlationId,
    method: req.method,
    url: req.url,
    data: req.body
  });

  res.on('finish', () => {
    const duration = Date.now() - start; 
    childLogger.info({
      status: res.statusCode,
      duration: `${duration}ms` 
    }, 'request finished');
  });

  loggerStorage.run(childLogger, () => {
    next();
  });
};

