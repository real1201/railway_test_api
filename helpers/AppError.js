const { StatusCodes } = require("http-status-codes");
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.success = false;

    // this.success = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
