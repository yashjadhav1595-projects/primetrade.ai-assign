import httpStatus from 'http-status';
import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from './errorHandler.js';

export function authenticate() {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
      if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token missing');
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch (err) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
    }
  };
}



