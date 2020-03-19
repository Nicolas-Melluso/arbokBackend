exports.validate = (req, res, next) => {
  if (!req.session) {
    return res.status(401).send("Unauthorized.");
  }
  return next();
};
