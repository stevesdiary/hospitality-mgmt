/**
 * Standardized response helper utility
 * Ensures consistent API response format across all controllers
 */

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

const sendError = (res, message, statusCode = 500, errorDetails = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errorDetails) {
    response.error = errorDetails;
  }

  return res.status(statusCode).json(response);
};

const sendCreated = (res, message, data) => {
  return sendSuccess(res, message, data, 201);
};

const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, message, 401);
};

const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, message, 403);
};

const sendValidationError = (res, message = 'Validation failed', errors = null) => {
  return sendError(res, message, 400, errors);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendCreated,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendValidationError
};