import request from 'supertest';
import { app } from './setup.js';

describe('Auth', () => {
  it('registers and logs in a user', async () => {
    const email = 'test@example.com';
    const password = 'Password123!';

    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email, password })
      .expect(201);
    expect(reg.body.user.email).toBe(email);
    expect(reg.body.tokens.accessToken).toBeTruthy();

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);
    expect(login.body.tokens.accessToken).toBeTruthy();
  });
});


