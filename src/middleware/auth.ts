import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/http.js';

type Payload = { sub: string; role: Role };

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  if (!token) return next(new ApiError(401, 'Authentication required'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as Payload;
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch { next(new ApiError(401, 'Invalid or expired token')); }
}

export const allowRoles = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) =>
  req.user && roles.includes(req.user.role) ? next() : next(new ApiError(403, 'Insufficient permissions'));
