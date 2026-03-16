/**
 * Error Handler Middleware - TypeScript Version
 */

import { Request, Response, NextFunction } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
