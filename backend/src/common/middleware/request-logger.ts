import { NextFunction, Request, Response } from 'express';
import { performance } from 'perf_hooks';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();
  res.on('finish', () => {
    const cost = (performance.now() - start).toFixed(2);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${cost}ms`);
  });
  next();
}
