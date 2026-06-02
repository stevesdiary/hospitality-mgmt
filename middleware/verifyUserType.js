const authorise = (...allowedRoles) => (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authorization provided' });
    }

    const userType = req.user.type;
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ message: 'Forbidden! You are not authorized to access this resource' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Authorization error occurred', error: error.message });
  }
};

module.exports = authorise;
