import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "An unexpected internal server error occurred",
      statusCode,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
};

export default errorHandler;
