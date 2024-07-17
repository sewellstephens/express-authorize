const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.JWT_KEY);
    req.userId = userId;
  }
  next();
};