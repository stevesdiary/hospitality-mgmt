/**
 * Validation Middleware
 * Joi-based request validation with type safety
 */

import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { sendValidationError } from '../utils/responseHelper';

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Generic validation middleware factory
 */
export const validate = (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property as keyof Request], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }));

      sendValidationError(res, 'Validation failed', validationErrors);
      return;
    }

    // Update request with validated data
    (req as any)[property] = value;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: ObjectSchema) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = (schema: ObjectSchema) => validate(schema, 'query');

/**
 * Validate route parameters
 */
export const validateParams = (schema: ObjectSchema) => validate(schema, 'params');

/**
 * Validate UUID parameter
 */
export const validateUuid = (paramName: string = 'id') => {
  const schema = Joi.object({
    [paramName]: Joi.string().uuid().required().messages({
      'string.uuid': `${paramName} must be a valid UUID`,
      'any.required': `${paramName} is required`,
    }),
  });
  
  return validateParams(schema);
};
