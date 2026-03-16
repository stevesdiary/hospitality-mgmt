/**
 * Error Handler Middleware
 * Global error handling with consistent response format
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../../config/environment';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not found error handler
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Bad request error
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      error: config.nodeEnv === 'development' ? err.stack : undefined,
    });
    return;
  }

  // Handle Sequelize validation errors
  if ((err as any).name === 'SequelizeValidationError') {
    const errors = (err as any).errors.map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    
    res.status(400).json({
      message: 'Validation error',
      error: errors,
    });
    return;
  }

  // Handle Sequelize unique constraint errors
  if ((err as any).name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({
      message: 'Resource already exists',
      error: (err as any).errors.map((e: any) => e.message),
    });
    return;
  }

  // Default error response
  res.status(500).json({
    message: 'Internal server error',
    error: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};
