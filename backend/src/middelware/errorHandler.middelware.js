const multer = require("multer");
const { ApiError } = require("../utils/ApiError.utils.js");

const send = (res, statusCode, message, errors = [], stack) =>
  res.status(statusCode).json({
    statusCode,
    message,
    success: false,
    errors,
    data: null,
    ...(process.env.NODE_ENV === "development" && stack ? { stack } : {}),
  });

const errorHandler = (err, req, res, next) => {
  // 1. Structured, intentional API errors
  if (err instanceof ApiError) {
    return send(res, err.statusCode, err.message, err.errors, err.stack);
  }

  // 2. Multer upload errors (e.g. too many images, file too large)
  if (err instanceof multer.MulterError) {
    let message;
    switch (err.code) {
      case "LIMIT_UNEXPECTED_FILE":
        message = "You uploaded too many images. Please upload a maximum of 15.";
        break;
      case "LIMIT_FILE_SIZE":
        message = "One of the files is too large to upload.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded.";
        break;
      default:
        message = err.message || "File upload failed.";
    }
    return send(res, 400, message, [], err.stack);
  }

  // 3. Mongoose schema validation (required fields, min, enum, etc.)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return send(
      res,
      400,
      messages.join(", ") || "Validation failed",
      messages,
      err.stack
    );
  }

  // 4. Mongoose invalid ObjectId / type cast
  if (err.name === "CastError") {
    return send(res, 400, `Invalid value for "${err.path}".`, [], err.stack);
  }

  // 5. Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    return send(
      res,
      409,
      field ? `A record with this ${field} already exists.` : "Duplicate entry.",
      [],
      err.stack
    );
  }

  // 6. Fallback — still surface the real message instead of a blanket 500 text
  return send(
    res,
    err.statusCode || 500,
    err.message || "Internal Server Error",
    [],
    err.stack
  );
};

module.exports = { errorHandler };
