import httpStatus from 'http-status';
import { ApiError } from './errorHandler.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
    return next();
  };
}



