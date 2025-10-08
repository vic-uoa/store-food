import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getConfig } from '../../config/config';
import { HttpException } from '../filters/http-exception.filter';

export interface AuthenticatedRequest extends Request {
  user?: { id: number; role: 'user' | 'admin' };
}

export function authenticate(requiredRole: 'user' | 'admin' | 'optional' = 'user') {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      if (requiredRole === 'optional') {
        next();
        return;
      }
      throw new HttpException(401, 'Unauthorized');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, getConfig().jwtSecret) as { sub: number; role: 'user' | 'admin' };
      req.user = { id: payload.sub, role: payload.role };
      if (requiredRole !== 'optional' && requiredRole !== payload.role && payload.role !== 'admin') {
        throw new HttpException(403, 'Forbidden');
      }
      next();
    } catch (error) {
      throw new HttpException(401, 'Unauthorized', error);
    }
  };
}
