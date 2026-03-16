/**
 * Validation Middleware - TypeScript Version
 */

import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../src/shared/utils/responseHelper';
import Joi, { ObjectSchema } from 'joi';

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Generic validation middleware factory
 * @param schema - Joi validation schema
 * @param property - Request property to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
export const validate = (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property as keyof Request], {
      abortEarly: false, // Show all validation errors
      allowUnknown: false, // Don't allow unknown fields
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      // Format validation errors for consistent response
      const validationErrors: ValidationError[] = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }));

      sendValidationError(res, 'Validation failed', validationErrors);
      return;
    }

    // Replace the original request property with validated and sanitized data
    // Use type assertion to bypass readonly restriction
    if (property === 'body') {
      req.body = value;
    } else if (property === 'query') {
      req.query = value;
    } else if (property === 'params') {
      req.params = value;
    }
    next();
  };
};

/**
 * Validate request body
 * @param schema - Joi validation schema
 * @returns Express middleware function
 */
export const validateBody = (schema: ObjectSchema) => {
  return validate(schema, 'body');
};

/**
 * Validate query parameters
 * @param schema - Joi validation schema
 * @returns Express middleware function
 */
export const validateQuery = (schema: ObjectSchema) => {
  return validate(schema, 'query');
};

/**
 * Validate route parameters
 * @param schema - Joi validation schema
 * @returns Express middleware function
 */
export const validateParams = (schema: ObjectSchema) => {
  return validate(schema, 'params');
};

/**
 * Combine multiple validations
 * @param validations - Object with validation schemas for different properties
 * @returns Express middleware function
 */
export const validateMultiple = (validations: Record<string, ObjectSchema>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];

    // Validate each specified property
    Object.keys(validations).forEach((property) => {
      const schema = validations[property];
      const { error, value } = schema.validate(req[property as keyof Request], {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `${property}.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value,
          });
        });
      } else {
        // Update request with validated data
        if (property === 'body') {
          req.body = value;
        } else if (property === 'query') {
          req.query = value;
        } else if (property === 'params') {
          req.params = value;
        }
      }
    });

    if (errors.length > 0) {
      sendValidationError(res, 'Validation failed', errors);
      return;
    }

    next();
  };
};

/**
 * Validate UUID parameter
 * Common validation for ID parameters
 */
export const validateUuidParam = (paramName: string = 'id') => {
  const schema = Joi.object({
    [paramName]: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': `${paramName} must be a valid UUID`,
        'any.required': `${paramName} is required`,
      }),
  });

  return validateParams(schema);
};

/**
 * Validate pagination parameters
 * Common validation for list endpoints
 */
export const validatePagination = () => {
  const { queryValidation } = require('../utils/validationSchemas');
  return validateQuery(queryValidation.pagination);
};

/**
 * Custom validation middleware for specific business logic
 */
export const customValidations = {
  /**
   * Validate that check-out date is after check-in date
   */
  validateReservationDates: (req: Request, res: Response, next: NextFunction): void => {
    const { dateIn, dateOut } = req.body;

    if (dateIn && dateOut) {
      const checkIn = new Date(dateIn);
      const checkOut = new Date(dateOut);

      if (checkOut <= checkIn) {
        sendValidationError(res, 'Check-out date must be after check-in date');
        return;
      }

      // Validate minimum stay (1 day)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 1) {
        sendValidationError(res, 'Minimum stay is 1 day');
        return;
      }
    }

    next();
  },

  /**
   * Validate that user is not rating their own hotel (if applicable)
   */
  validateSelfRating: (req: Request, res: Response, next: NextFunction): void => {
    // This would require checking if the user owns the hotel
    // Implementation depends on business logic
    next();
  },

  /**
   * Validate file upload constraints
   */
  validateFileUpload: (req: Request, res: Response, next: NextFunction): void => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 10;

    // Handle both single file and multiple files
    let files: any[] = [];

    if ((req as any).files) {
      // express-fileupload format
      if (Array.isArray((req as any).files.images)) {
        files = (req as any).files.images;
      } else if ((req as any).files.image) {
        files = [(req as any).files.image];
      } else if ((req as any).files.images) {
        files = [(req as any).files.images];
      }
    } else if ((req as any).file) {
      // multer single file
      files = [(req as any).file];
    } else if ((req as any).files && Array.isArray((req as any).files)) {
      // multer multiple files
      files = (req as any).files;
    }

    if (files.length === 0) {
      sendValidationError(res, 'No files uploaded');
      return;
    }

    if (files.length > maxFiles) {
      sendValidationError(res, `Cannot upload more than ${maxFiles} files at once`);
      return;
    }

    for (const file of files) {
      // Check file type
      if (!allowedTypes.includes(file.mimetype)) {
        sendValidationError(
          res,
          `Invalid file type: ${file.mimetype}. Only JPEG, PNG, JPG, and WebP files are allowed`
        );
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        sendValidationError(res, `File ${file.name || file.originalname} exceeds 5MB size limit`);
        return;
      }

      // Check if file has content
      if (file.size === 0) {
        sendValidationError(res, `File ${file.name || file.originalname} is empty`);
        return;
      }
    }

    // Attach validated files to request
    (req as any).validatedFiles = files;
    next();
  },

  /**
   * Validate image upload for specific entity types
   */
  validateImageUpload: (entityType: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Validate entity type
      const allowedEntityTypes = ['room', 'hotel', 'facility', 'user', 'general'];
      if (!allowedEntityTypes.includes(entityType)) {
        sendValidationError(res, `Invalid entity type: ${entityType}`);
        return;
      }

      // Add entity type to request
      (req as any).entityType = entityType;

      // If entityId is provided in params, validate it
      if (req.params.id || req.params.entityId) {
        const entityId = req.params.id || req.params.entityId;
        const { error } = Joi.string().uuid().validate(entityId);

        if (error) {
          sendValidationError(res, 'Invalid entity ID format');
          return;
        }

        (req as any).entityId = entityId;
      }

      next();
    };
  },

  /**
   * Validate image deletion request
   */
  validateImageDeletion: (req: Request, res: Response, next: NextFunction): void => {
    const { publicId } = req.body;

    if (!publicId) {
      sendValidationError(res, 'Public ID is required for image deletion');
      return;
    }

    if (typeof publicId !== 'string' || publicId.trim().length === 0) {
      sendValidationError(res, 'Public ID must be a non-empty string');
      return;
    }

    next();
  },
};
