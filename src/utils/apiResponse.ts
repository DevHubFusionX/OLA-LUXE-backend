import { Response } from 'express';

interface ApiResponseOptions {
  success: boolean;
  data?: unknown;
  message?: string;
  statusCode?: number;
}

export function sendResponse(res: Response, options: ApiResponseOptions) {
  const { success, data, message, statusCode = 200 } = options;
  return res.status(statusCode).json({
    success,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  });
}

export function sendSuccess(res: Response, data: unknown, message?: string, statusCode = 200) {
  return sendResponse(res, { success: true, data, message, statusCode });
}

export function sendError(res: Response, message: string, statusCode = 500) {
  return sendResponse(res, { success: false, message, statusCode });
}
