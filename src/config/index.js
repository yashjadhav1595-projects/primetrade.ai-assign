import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUri: getRequiredEnv('MONGODB_URI', 'mongodb://localhost:27017/primetrade_api'),
  jwt: {
    accessSecret: getRequiredEnv('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
    refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};



