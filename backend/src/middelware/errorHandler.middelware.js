const { ApiError } = require("../utils/ApiError.utils.js");

const errorHandler = (err, req, res, next) => {
  // If the error is an instance of ApiError, use its properties
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      success: err.success,
      errors: err.errors,
      data: err.data,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Include stack trace only in development
    });
  }

  // Handle non-ApiError exceptions (unexpected errors)
  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    success: false,
    errors: [],
    data: null,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = { errorHandler };