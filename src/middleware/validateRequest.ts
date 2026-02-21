import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/apiResponse';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      sendError(res, `Validation error: ${errors}`, 400);
      return;
    }
    req.body = result.data;
    next();
  };
