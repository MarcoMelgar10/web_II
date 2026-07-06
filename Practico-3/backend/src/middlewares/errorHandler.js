const { error } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return error(res, err.message, 400);
  }

  if (err.code === "P2002") {
    return error(res, "A record with this data already exists", 409);
  }

  if (err.code === "P2025") {
    return error(res, "Record not found", 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return error(res, message, statusCode);
};

module.exports = errorHandler;
