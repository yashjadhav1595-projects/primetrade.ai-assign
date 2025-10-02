import httpStatus from 'http-status';

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// eslint-disable-next-line no-unused-vars
export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  const response = {
    status: statusCode,
    message
  };
  if (process.env.NODE_ENV !== 'production') {
    response.details = err.details || undefined;
  }
  res.status(statusCode).json(response);
}



