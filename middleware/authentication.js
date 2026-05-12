const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type
    };
    // backward-compat aliases used by existing controllers
    req.userId = decoded.id;
    req.email = decoded.email;
    req.type = decoded.type;

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: err.message });
    }
    return res.status(500).json({ message: 'Authentication error occurred', error: err.message });
  }
};

module.exports = { authentication };
