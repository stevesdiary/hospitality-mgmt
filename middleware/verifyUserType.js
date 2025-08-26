const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "secret";

const authorise = (...allowedRoles) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET);
    const userType = decoded.type; // Fixed: use 'type' instead of 'role'

    if (!decoded || !allowedRoles.includes(userType)) {
      return res.status(403).json({ message: 'Forbidden! You are not authorized to access this resource' });
    }
    
    // Set user info on request for downstream use
    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type
    };
    
    return next();
  } catch (error) {
    console.error('Authorization error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Authorization error occurred', error: error.message });
  }
};

module.exports = authorise;
