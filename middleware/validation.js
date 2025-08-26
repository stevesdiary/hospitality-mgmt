/**
 * Validation Middleware
 * Provides standardized validation for API endpoints using Joi schemas
 * Follows project response format specifications
 */

const { sendValidationError } = require('../utils/responseHelper');

/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Show all validation errors
      allowUnknown: false, // Don't allow unknown fields
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      // Format validation errors for consistent response
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return sendValidationError(res, 'Validation failed', validationErrors);
    }

    // Replace the original request property with validated and sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Validate request body
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return validate(schema, 'body');
};

/**
 * Validate query parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return validate(schema, 'query');
};

/**
 * Validate route parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return validate(schema, 'params');
};

/**
 * Combine multiple validations
 * @param {Object} validations - Object with validation schemas for different properties
 * @returns {Function} Express middleware function
 */
const validateMultiple = (validations) => {
  return (req, res, next) => {
    const errors = [];

    // Validate each specified property
    Object.keys(validations).forEach(property => {
      const schema = validations[property];
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true
      });

      if (error) {
        error.details.forEach(detail => {
          errors.push({
            field: `${property}.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          });
        });
      } else {
        // Update request with validated data
        req[property] = value;
      }
    });

    if (errors.length > 0) {
      return sendValidationError(res, 'Validation failed', errors);
    }

    next();
  };
};

/**
 * Validate UUID parameter
 * Common validation for ID parameters
 */
const validateUuidParam = (paramName = 'id') => {
  const Joi = require('joi');
  const schema = Joi.object({
    [paramName]: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': `${paramName} must be a valid UUID`,
        'any.required': `${paramName} is required`
      })
  });
  
  return validateParams(schema);
};

/**
 * Validate pagination parameters
 * Common validation for list endpoints
 */
const validatePagination = () => {
  const { queryValidation } = require('../utils/validationSchemas');
  return validateQuery(queryValidation.pagination);
};

/**
 * Custom validation middleware for specific business logic
 */
const customValidations = {
  /**
   * Validate that check-out date is after check-in date
   */
  validateReservationDates: (req, res, next) => {
    const { dateIn, dateOut } = req.body;
    
    if (dateIn && dateOut) {
      const checkIn = new Date(dateIn);
      const checkOut = new Date(dateOut);
      
      if (checkOut <= checkIn) {
        return sendValidationError(res, 'Check-out date must be after check-in date');
      }
      
      // Validate minimum stay (1 day)
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) {
        return sendValidationError(res, 'Minimum stay is 1 day');
      }
    }
    
    next();
  },

  /**
   * Validate that user is not rating their own hotel (if applicable)
   */
  validateSelfRating: (req, res, next) => {
    // This would require checking if the user owns the hotel
    // Implementation depends on business logic
    next();
  },

  /**
   * Validate file upload constraints
   */
  validateFileUpload: (req, res, next) => {
    if (req.files && req.files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      for (let file of req.files) {
        if (!allowedTypes.includes(file.mimetype)) {
          return sendValidationError(res, 'Only JPEG, PNG, and JPG files are allowed');
        }
        
        if (file.size > maxSize) {
          return sendValidationError(res, 'File size cannot exceed 5MB');
        }
      }
    }
    
    next();
  }
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateMultiple,
  validateUuidParam,
  validatePagination,
  customValidations
};