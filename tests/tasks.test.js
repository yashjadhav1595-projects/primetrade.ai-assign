import request from 'supertest';
import { app } from './setup.js';

async function registerAndLogin() {
  const email = `u${Date.now()}@example.com`;
  const password = 'Password123!';
  await request(app).post('/api/v1/auth/register').send({ name: 'U', email, password });
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res.body.tokens.accessToken;
}

describe('Tasks', () => {
  it('creates, lists, updates, and deletes a task', async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'T1', description: 'D1' })
      .expect(201);
    const id = created.body.task._id;

    const list = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body.tasks)).toBe(true);

    await request(app)
      .patch(`/api/v1/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' })
      .expect(200);

    await request(app)
      .delete(`/api/v1/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});


