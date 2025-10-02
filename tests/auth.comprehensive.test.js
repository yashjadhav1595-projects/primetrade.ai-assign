import request from 'supertest';
import { app } from './setup.js';

describe('Authentication - Comprehensive Tests', () => {
  describe('Registration', () => {
    it('should register a user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.user.email).toBe(userData.email);
      expect(res.body.user.name).toBe(userData.name);
      expect(res.body.user.role).toBe('user');
      expect(res.body.tokens.accessToken).toBeTruthy();
      expect(res.body.tokens.refreshToken).toBeTruthy();
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'Password123!'
      };

      // First registration
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Duplicate registration
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);
    });

    it('should reject registration with invalid email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!'
        })
        .expect(400);
    });

    it('should reject registration with short password', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        })
        .expect(400);
    });

    it('should reject registration with missing name', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(400);
    });

    it('should reject registration with name too long', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'a'.repeat(121),
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(400);
    });
  });

  describe('Login', () => {
    const testUser = {
      name: 'Login Test User',
      email: 'login@example.com',
      password: 'Password123!'
    };

    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.tokens.accessToken).toBeTruthy();
      expect(res.body.tokens.refreshToken).toBeTruthy();
    });

    it('should reject login with wrong password', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401);
    });

    it('should reject login with non-existent email', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);
    });

    it('should reject login with invalid email format', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: testUser.password
        })
        .expect(400);
    });
  });

  describe('Token Refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Refresh Test User',
          email: 'refresh@example.com',
          password: 'Password123!'
        });
      refreshToken = res.body.tokens.refreshToken;
    });

    it('should refresh tokens with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.tokens.accessToken).toBeTruthy();
      expect(res.body.tokens.refreshToken).toBeTruthy();
      expect(res.body.tokens.refreshToken).not.toBe(refreshToken);
    });

    it('should reject refresh with invalid token', async () => {
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('should reject refresh with missing token', async () => {
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({})
        .expect(400);
    });

    it('should reject reuse of revoked refresh token', async () => {
      // Use refresh token once
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken })
        .expect(200);

      // Try to use it again
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken })
        .expect(401);
    });
  });

  describe('Logout', () => {
    let refreshToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Logout Test User',
          email: 'logout@example.com',
          password: 'Password123!'
        });
      refreshToken = res.body.tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(200);
    });

    it('should handle logout with invalid token gracefully', async () => {
      await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken: 'invalid-token' })
        .expect(200);
    });

    it('should prevent token reuse after logout', async () => {
      // Logout
      await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(200);

      // Try to refresh with logged out token
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken })
        .expect(401);
    });
  });
});
