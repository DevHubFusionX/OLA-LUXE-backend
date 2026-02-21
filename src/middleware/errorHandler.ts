import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  sendError(res, message, statusCode);
};
