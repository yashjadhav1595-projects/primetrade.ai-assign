import httpStatus from 'http-status';
import { ApiError } from '../middleware/errorHandler.js';

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new ApiError(httpStatus.BAD_REQUEST, error.details.map((d) => d.message).join(', ')));
    }
    req.body = value;
    return next();
  };
}



