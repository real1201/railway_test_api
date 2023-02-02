const { StatusCodes } = require("http-status-codes");

const handleValidationError = (e) => {
  let errors = {};
  e.errors.forEach((err) => {
    const { path, message } = err;
    errors[path] = message;
  });
  return errors;
};

const CatchErrorMiddleware = (err, req, res, next) => {
  const defaultError = {
    success: false,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = handleValidationError(err);
  }

  if (err.name === "JsonWebTokenError") {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.msg = "You are not authorized, please login";
  }

  res
    .status(defaultError.statusCode)
    .json({ success: defaultError.success, errors: defaultError.msg });
};

module.exports = CatchErrorMiddleware;
