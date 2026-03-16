/**
 * Response Helper Utilities
 * Standardized response formatting across the application
 */

import { Response } from 'express';

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface ApiResponse<T = any> {
  message?: string;
  Message?: string;
  data?: T;
  Data?: T;
  Count?: number;
  Error?: string | string[];
  error?: string | string[];
}

/**
 * Send success response
 */
export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    message: message || 'Success',
    data,
  };
  
  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any
): void => {
  const response: ApiResponse = {
    message,
    error: error?.message || error,
  };
  
  res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  message: string = 'Validation failed',
  errors?: ValidationError[] | string
): void => {
  const errorMessages = Array.isArray(errors) 
    ? errors.map(e => typeof e === 'string' ? e : e.message).filter((msg): msg is string => !!msg)
    : errors ? [errors] : [];
  
  const response: ApiResponse = {
    message,
    error: errorMessages,
  };
  
  res.status(400).json(response);
};

/**
 * Send not found response
 */
export const sendNotFound = (res: Response, message: string = 'Resource not found'): void => {
  sendError(res, message, 404);
};

/**
 * Send unauthorized response
 */
export const sendUnauthorized = (res: Response, message: string = 'Unauthorized'): void => {
  sendError(res, message, 401);
};

/**
 * Send forbidden response
 */
export const sendForbidden = (res: Response, message: string = 'Forbidden'): void => {
  sendError(res, message, 403);
};

/**
 * Send created response
 */
export const sendCreated = <T>(res: Response, data: T, message?: string): void => {
  sendSuccess(res, data, message, 201);
};

/**
 * Send no content response
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};
