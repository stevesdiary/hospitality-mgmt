/**
 * Validation Schemas using Joi
 * Centralized validation for all hospitality management system entities
 */

import Joi from 'joi';

// Custom validators
const passwordValidator = Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
  .required()
  .messages({
    'string.pattern.base': 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  });

const phoneValidator = Joi.string()
  .pattern(/^(?:\+?234|0)\d{10}$/)
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be a valid Nigerian number format',
    'any.required': 'Phone number is required'
  });

const emailValidator = Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  });

// User validation schemas
export const userValidation = {
  register: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
        'string.pattern.base': 'First name can only contain letters and spaces',
        'any.required': 'First name is required'
      }),
    
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
        'string.pattern.base': 'Last name can only contain letters and spaces',
        'any.required': 'Last name is required'
      }),
    
    phoneNumber: phoneValidator,
    
    gender: Joi.string()
      .valid('male', 'female', 'other')
      .optional()
      .messages({
        'any.only': 'Gender must be either male, female, or other'
      }),
    
    email: emailValidator,
    
    password: passwordValidator,
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      }),
    
    type: Joi.string()
      .valid('guest', 'regular', 'premium', 'admin')
      .default('regular')
      .messages({
        'any.only': 'User type must be guest, regular, premium, or admin'
      })
  }),

  login: Joi.object({
    email: emailValidator,
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  update: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional(),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional(),
    phoneNumber: Joi.string()
      .pattern(/^(?:\+?234|0)\d{10}$/)
      .optional(),
    gender: Joi.string()
      .valid('male', 'female', 'other')
      .optional()
  })
};

// Hotel validation schemas
export const hotelValidation = {
  create: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Hotel name must be at least 3 characters',
        'string.max': 'Hotel name cannot exceed 100 characters',
        'any.required': 'Hotel name is required'
      }),
    
    address: Joi.string()
      .min(10)
      .max(200)
      .required()
      .messages({
        'string.min': 'Address must be at least 10 characters',
        'string.max': 'Address cannot exceed 200 characters',
        'any.required': 'Address is required'
      }),
    
    city: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'City must be at least 2 characters',
        'string.max': 'City cannot exceed 50 characters',
        'any.required': 'City is required'
      }),
    
    state: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'State must be at least 2 characters',
        'string.max': 'State cannot exceed 50 characters',
        'any.required': 'State is required'
      }),
    
    description: Joi.string()
      .min(20)
      .max(1000)
      .optional()
      .messages({
        'string.min': 'Description must be at least 20 characters',
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    
    hotelType: Joi.string()
      .valid('budget', 'mid-range', 'luxury', 'resort', 'boutique')
      .required()
      .messages({
        'any.only': 'Hotel type must be budget, mid-range, luxury, resort, or boutique',
        'any.required': 'Hotel type is required'
      }),
    
    numberOfRooms: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'number.min': 'Number of rooms must be at least 1',
        'number.max': 'Number of rooms cannot exceed 1000',
        'any.required': 'Number of rooms is required'
      }),
    
    contactEmail: emailValidator,
    
    contactPhone: phoneValidator,
    
    termsAndConditions: Joi.string()
      .min(50)
      .max(2000)
      .optional()
      .messages({
        'string.min': 'Terms and conditions must be at least 50 characters',
        'string.max': 'Terms and conditions cannot exceed 2000 characters'
      })
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    address: Joi.string().min(10).max(200).optional(),
    city: Joi.string().min(2).max(50).optional(),
    state: Joi.string().min(2).max(50).optional(),
    description: Joi.string().min(20).max(1000).optional(),
    hotelType: Joi.string().valid('budget', 'mid-range', 'luxury', 'resort', 'boutique').optional(),
    numberOfRooms: Joi.number().integer().min(1).max(1000).optional(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().pattern(/^(?:\+?234|0)\d{10}$/).optional(),
    termsAndConditions: Joi.string().min(50).max(2000).optional()
  })
};

// Room validation schemas
export const roomValidation = {
  create: Joi.object({
    hotelId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'Hotel ID must be a valid UUID',
        'any.required': 'Hotel ID is required'
      }),
    
    category: Joi.string()
      .valid('standard', 'deluxe', 'suite', 'presidential')
      .required()
      .messages({
        'any.only': 'Room category must be standard, deluxe, suite, or presidential',
        'any.required': 'Room category is required'
      }),
    
    capacity: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .required()
      .messages({
        'number.min': 'Room capacity must be at least 1',
        'number.max': 'Room capacity cannot exceed 10',
        'any.required': 'Room capacity is required'
      }),
    
    description: Joi.string()
      .min(20)
      .max(500)
      .optional()
      .messages({
        'string.min': 'Room description must be at least 20 characters',
        'string.max': 'Room description cannot exceed 500 characters'
      }),
    
    availability: Joi.boolean()
      .default(true),
    
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required'
      }),
    
    deals: Joi.number()
      .min(0)
      .max(100)
      .optional()
      .messages({
        'number.min': 'Deals percentage cannot be negative',
        'number.max': 'Deals percentage cannot exceed 100'
      }),
    
    condition: Joi.string()
      .valid('excellent', 'good', 'fair', 'needs-maintenance')
      .default('good')
      .messages({
        'any.only': 'Room condition must be excellent, good, fair, or needs-maintenance'
      })
  })
};

// Reservation validation schemas
export const reservationValidation = {
  create: Joi.object({
    hotelId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'Hotel ID must be a valid UUID',
        'any.required': 'Hotel ID is required'
      }),
    
    roomId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'Room ID must be a valid UUID',
        'any.required': 'Room ID is required'
      }),
    
    dateIn: Joi.date()
      .min('now')
      .required()
      .messages({
        'date.min': 'Check-in date cannot be in the past',
        'any.required': 'Check-in date is required'
      }),
    
    dateOut: Joi.date()
      .greater(Joi.ref('dateIn'))
      .required()
      .messages({
        'date.greater': 'Check-out date must be after check-in date',
        'any.required': 'Check-out date is required'
      }),
    
    paymentStatus: Joi.string()
      .valid('pending', 'paid', 'failed', 'refunded')
      .default('pending')
      .messages({
        'any.only': 'Payment status must be pending, paid, failed, or refunded'
      })
  })
};

// Rating and Review validation schemas
export const ratingValidation = {
  create: Joi.object({
    hotelId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'Hotel ID must be a valid UUID',
        'any.required': 'Hotel ID is required'
      }),
    
    reviewTitle: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.min': 'Review title must be at least 5 characters',
        'string.max': 'Review title cannot exceed 100 characters',
        'any.required': 'Review title is required'
      }),
    
    review: Joi.string()
      .min(20)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Review must be at least 20 characters',
        'string.max': 'Review cannot exceed 1000 characters',
        'any.required': 'Review is required'
      }),
    
    like: Joi.boolean().optional(),
    
    cleanliness: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required()
      .messages({
        'number.min': 'Cleanliness rating must be between 1 and 5',
        'number.max': 'Cleanliness rating must be between 1 and 5',
        'any.required': 'Cleanliness rating is required'
      }),
    
    comfort: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required()
      .messages({
        'number.min': 'Comfort rating must be between 1 and 5',
        'number.max': 'Comfort rating must be between 1 and 5',
        'any.required': 'Comfort rating is required'
      }),
    
    service: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required()
      .messages({
        'number.min': 'Service rating must be between 1 and 5',
        'number.max': 'Service rating must be between 1 and 5',
        'any.required': 'Service rating is required'
      }),
    
    security: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required()
      .messages({
        'number.min': 'Security rating must be between 1 and 5',
        'number.max': 'Security rating must be between 1 and 5',
        'any.required': 'Security rating is required'
      }),
    
    location: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required()
      .messages({
        'number.min': 'Location rating must be between 1 and 5',
        'number.max': 'Location rating must be between 1 and 5',
        'any.required': 'Location rating is required'
      })
  })
};

// Facility validation schemas
export const facilityValidation = {
  create: Joi.object({
    hotelId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'Hotel ID must be a valid UUID',
        'any.required': 'Hotel ID is required'
      }),
    
    restaurant: Joi.boolean().default(false),
    barLaunge: Joi.boolean().default(false),
    gym: Joi.boolean().default(false),
    roomService: Joi.boolean().default(false),
    wifiInternet: Joi.boolean().default(false),
    dstv: Joi.boolean().default(false),
    security: Joi.boolean().default(false),
    swimmingPool: Joi.boolean().default(false),
    cctv: Joi.boolean().default(false),
    frontDesk24h: Joi.boolean().default(false),
    carHire: Joi.boolean().default(false),
    electricity24h: Joi.boolean().default(false)
  })
};

// Password reset validation schemas
export const passwordResetValidation = {
  forgotPassword: Joi.object({
    email: emailValidator
  }),
  
  resetPassword: Joi.object({
    email: emailValidator,
    newPassword: passwordValidator,
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      })
  })
};

// Query parameter validation schemas
export const queryValidation = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  }),
  
  hotelSearch: Joi.object({
    search: Joi.string().min(2).max(50).optional(),
    hotelType: Joi.string().valid('budget', 'mid-range', 'luxury', 'resort', 'boutique').optional(),
    city: Joi.string().min(2).max(50).optional(),
    state: Joi.string().min(2).max(50).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    dateIn: Joi.date().optional(),
    dateOut: Joi.date().greater(Joi.ref('dateIn')).optional()
  })
};
