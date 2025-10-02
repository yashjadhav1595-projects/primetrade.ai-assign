import httpStatus from 'http-status';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Token } from '../models/Token.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

function generateTokenId() {
  return crypto.randomBytes(16).toString('hex');
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const jti = generateTokenId();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, jti);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Token.create({ user: user._id, token: jti, type: 'refresh', expiresAt: refreshExpiresAt });

  res.status(httpStatus.CREATED).json({ user, tokens: { accessToken, refreshToken } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

  const jti = generateTokenId();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, jti);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Token.create({ user: user._id, token: jti, type: 'refresh', expiresAt: refreshExpiresAt });

  res.status(httpStatus.OK).json({ user, tokens: { accessToken, refreshToken } });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken: provided } = req.body;
  // Verify via DB jti lookup; JWT verification happens in service layer if desired
  const tokenDoc = await Token.findOne({ token: provided, type: 'refresh', revoked: false });
  if (!tokenDoc) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');

  const user = await User.findById(tokenDoc.user);
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');

  const newJti = generateTokenId();
  const accessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user, newJti);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  tokenDoc.revoked = true;
  tokenDoc.replacedByToken = newJti;
  await tokenDoc.save();
  await Token.create({ user: user._id, token: newJti, type: 'refresh', expiresAt: refreshExpiresAt });

  res.status(httpStatus.OK).json({ tokens: { accessToken, refreshToken: newRefreshToken } });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken: provided } = req.body;
  const tokenDoc = await Token.findOne({ token: provided, type: 'refresh', revoked: false });
  if (tokenDoc) {
    tokenDoc.revoked = true;
    await tokenDoc.save();
  }
  res.status(httpStatus.OK).json({ message: 'Logged out' });
});



