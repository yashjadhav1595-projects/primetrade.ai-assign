import { Router } from 'express';
import { register, login, refresh, logout } from '../../controllers/auth.controller.js';
import { registerSchema, loginSchema, refreshSchema } from '../../validation/auth.validation.js';
import { validate } from '../../utils/validate.js';

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user account
 *     description: Create a new user account with email, password, and role assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "Password123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/TokenPair'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
authRouter.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate user and get tokens
 *     description: Login with email and password to receive JWT access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/TokenPair'
 *       401:
 *         description: Invalid credentials
 */
authRouter.post('/login', validate(loginSchema), login);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT tokens
 */
authRouter.post('/refresh-token', validate(refreshSchema), refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout and revoke refresh token
 */
authRouter.post('/logout', validate(refreshSchema), logout);



