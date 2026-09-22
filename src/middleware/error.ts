import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/http.js';

export const notFound: RequestHandler = (req, _res, next) => next(new ApiError(404, `Route ${req.method} ${req.path} not found`));

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) { res.status(400).json({ error: 'Validation failed', details: error.flatten() }); return; }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { res.status(409).json({ error: 'A unique value already exists' }); return; }
  const status = error instanceof ApiError ? error.status : 500;
  res.status(status).json({ error: status === 500 ? 'Internal server error' : error.message, ...(error.details ? { details: error.details } : {}) });
};
