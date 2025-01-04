const errorHandler = async (req, res, next) => {
  if (typeof (err) === "string") {
    return res.status(400).send(err);
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ message: "Invalid token!" });
  }
  return res.status(500).send({ message: err.message });
}

module.exports = errorHandler;