import request from 'supertest';
import { app } from './setup.js';

describe('Middleware Tests', () => {
  describe('Authentication Middleware', () => {
    it('should reject requests without Authorization header', async () => {
      await request(app)
        .get('/api/v1/tasks')
        .expect(401);
    });

    it('should reject requests with malformed Authorization header', async () => {
      await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'InvalidHeader')
        .expect(401);
    });

    it('should reject requests with invalid Bearer token', async () => {
      await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject requests with expired token', async () => {
      // This would require mocking JWT to return an expired token
      // For now, we test with an obviously invalid token structure
      await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature')
        .expect(401);
    });
  });

  describe('Validation Middleware', () => {
    it('should reject registration with missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com'
          // missing name and password
        })
        .expect(400);

      expect(res.body.message).toContain('required');
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email-format',
          password: 'Password123!'
        })
        .expect(400);

      expect(res.body.message).toContain('email');
    });

    it('should strip unknown fields from request body', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
          unknownField: 'should be stripped',
          anotherField: 123
        })
        .expect(201);

      // The user should be created successfully, ignoring unknown fields
      expect(res.body.user.unknownField).toBeUndefined();
      expect(res.body.user.anotherField).toBeUndefined();
    });
  });

  describe('Error Handling Middleware', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app)
        .get('/api/v1/non-existent-route')
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.message).toBe('Not Found');
    });

    it('should handle internal server errors gracefully', async () => {
      // This test would require creating a route that intentionally throws an error
      // For now, we test with an invalid ObjectId which causes a CastError
      const userRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        });

      const res = await request(app)
        .get('/api/v1/tasks/invalid-object-id')
        .set('Authorization', `Bearer ${userRes.body.tokens.accessToken}`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.message).toBeTruthy();
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Make a few requests that should be allowed
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/v1/non-existent')
          .expect(404); // Route doesn't exist but shouldn't be rate limited
      }
    });

    // Note: Testing actual rate limiting would require making 100+ requests
    // which would slow down the test suite significantly
    // In a real application, you might want to create a separate test
    // with a lower rate limit for testing purposes
  });

  describe('CORS Middleware', () => {
    it('should include CORS headers in response', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle preflight OPTIONS requests', async () => {
      const res = await request(app)
        .options('/api/v1/auth/login')
        .expect(204);

      expect(res.headers['access-control-allow-methods']).toBeDefined();
      expect(res.headers['access-control-allow-headers']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from Helmet', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBeDefined();
      expect(res.headers['x-xss-protection']).toBeDefined();
    });
  });
});
