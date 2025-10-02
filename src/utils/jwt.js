import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function signAccessToken(user) {
  const payload = { sub: String(user._id), role: user.role };
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
}

export function signRefreshToken(user, jti) {
  const payload = { sub: String(user._id), jti };
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}



