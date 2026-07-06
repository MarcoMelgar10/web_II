const { verify } = require("../utils/jwt");
const { error } = require("../utils/response");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verify(token);
    req.user = payload;
    next();
  } catch {
    return error(res, "Invalid or expired token", 401);
  }
};

module.exports = authenticate;
