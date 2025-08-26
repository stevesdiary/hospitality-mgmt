const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  if (typeof err === "string") {
    return res.status(400).json({ message: err });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token!" });
  }
  
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed", error: err.message });
  }
  
  if (err.name === "SequelizeValidationError") {
    const validationErrors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(400).json({ message: "Database validation failed", errors: validationErrors });
  }
  
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Resource already exists", error: err.message });
  }
  
  return res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
};

module.exports = errorHandler;