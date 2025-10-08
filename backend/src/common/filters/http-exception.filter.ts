import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class HttpException extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpException) {
    res.status(err.status).json({ message: err.message, details: err.details });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation failed', details: err.errors });
    return;
  }

  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal Server Error' });
}
