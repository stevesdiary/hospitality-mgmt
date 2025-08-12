const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

const errorResponse = (message, error = null) => ({
  success: false,
  message,
  error: error?.message
});
