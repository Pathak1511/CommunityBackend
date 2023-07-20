class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // used to identify if the error is an operational error or a programming error.

    Error.captureStackTrace(this, this.constructor); // to get more accurate information about the origin of the error
  }
}

module.exports = AppError;
