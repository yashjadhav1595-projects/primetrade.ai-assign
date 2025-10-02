import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(8).max(128).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(8).max(128).required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});



