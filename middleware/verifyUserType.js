const SECRET = process.env.JWT_SECRET || "secret";

const authorise = (...allowedRoles) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "No authorization provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decoded = verify(token, SECRET);
    const userRole = decoded.role;

    if (decoded !== "object" || !allowedRoles.includes(userRole)) {
      return res.status(403).send({ message: 'Forbidden! You are NOT authorised to access this page!' });
    }
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Aww! an error occurred', error });
  }
};

module.exports = authorise;
