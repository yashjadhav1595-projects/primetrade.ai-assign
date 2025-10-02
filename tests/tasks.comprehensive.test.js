import request from 'supertest';
import { app } from './setup.js';

describe('Tasks - Comprehensive Tests', () => {
  let userToken, adminToken;
  let userId, adminId;

  beforeEach(async () => {
    // Create regular user
    const userRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'Password123!'
      });
    userToken = userRes.body.tokens.accessToken;
    userId = userRes.body.user.id;

    // Create admin user (would need to be set manually in real app)
    const adminRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123!'
      });
    adminToken = adminRes.body.tokens.accessToken;
    adminId = adminRes.body.user.id;

    // Manually set admin role in database for testing
    const { User } = await import('../src/models/User.js');
    await User.findByIdAndUpdate(adminId, { role: 'admin' });
  });

  describe('Create Task', () => {
    it('should create task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send(taskData)
        .expect(201);

      expect(res.body.task.title).toBe(taskData.title);
      expect(res.body.task.description).toBe(taskData.description);
      expect(res.body.task.status).toBe(taskData.status);
      expect(res.body.task.owner).toBe(userId);
    });

    it('should create task with minimal data', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Minimal Task' })
        .expect(201);

      expect(res.body.task.title).toBe('Minimal Task');
      expect(res.body.task.status).toBe('pending');
    });

    it('should reject task creation without title', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ description: 'No title task' })
        .expect(400);
    });

    it('should reject task creation with title too long', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'a'.repeat(201) })
        .expect(400);
    });

    it('should reject task creation with invalid status', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Task',
          status: 'invalid-status'
        })
        .expect(400);
    });

    it('should reject task creation without authentication', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Test Task' })
        .expect(401);
    });

    it('should reject task creation with invalid token', async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', 'Bearer invalid-token')
        .send({ title: 'Test Task' })
        .expect(401);
    });
  });

  describe('List Tasks', () => {
    let userTaskId, otherUserTaskId;

    beforeEach(async () => {
      // Create task for user
      const userTaskRes = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'User Task' });
      userTaskId = userTaskRes.body.task.id;

      // Create another user and task
      const otherUserRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Other User',
          email: 'other@example.com',
          password: 'Password123!'
        });

      const otherTaskRes = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${otherUserRes.body.tokens.accessToken}`)
        .send({ title: 'Other User Task' });
      otherUserTaskId = otherTaskRes.body.task.id;
    });

    it('should return only user tasks for regular user', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0].title).toBe('User Task');
      expect(res.body.tasks[0].owner).toBe(userId);
    });

    it('should return all tasks for admin user', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.tasks.length).toBeGreaterThanOrEqual(2);
      const taskTitles = res.body.tasks.map(t => t.title);
      expect(taskTitles).toContain('User Task');
      expect(taskTitles).toContain('Other User Task');
    });

    it('should reject listing without authentication', async () => {
      await request(app)
        .get('/api/v1/tasks')
        .expect(401);
    });
  });

  describe('Get Task by ID', () => {
    let userTaskId, otherUserTaskId;

    beforeEach(async () => {
      const userTaskRes = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'User Task' });
      userTaskId = userTaskRes.body.task.id;

      const otherUserRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Other User',
          email: 'other2@example.com',
          password: 'Password123!'
        });

      const otherTaskRes = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${otherUserRes.body.tokens.accessToken}`)
        .send({ title: 'Other User Task' });
      otherUserTaskId = otherTaskRes.body.task.id;
    });

    it('should get own task by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.task.id).toBe(userTaskId);
      expect(res.body.task.title).toBe('User Task');
    });

    it('should reject access to other user task', async () => {
      await request(app)
        .get(`/api/v1/tasks/${otherUserTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should allow admin to access any task', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${otherUserTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.task.id).toBe(otherUserTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .get('/api/v1/tasks/64f1234567890abcdef12345')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });

    it('should return 400 for invalid task ID format', async () => {
      await request(app)
        .get('/api/v1/tasks/invalid-id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(500); // MongoDB throws CastError
    });
  });

  describe('Update Task', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Original Title',
          description: 'Original Description',
          status: 'pending'
        });
      taskId = res.body.task.id;
    });

    it('should update task with valid data', async () => {
      const updateData = {
        title: 'Updated Title',
        status: 'in_progress'
      };

      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.task.title).toBe(updateData.title);
      expect(res.body.task.status).toBe(updateData.status);
      expect(res.body.task.description).toBe('Original Description');
    });

    it('should update only specified fields', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'done' })
        .expect(200);

      expect(res.body.task.status).toBe('done');
      expect(res.body.task.title).toBe('Original Title');
    });

    it('should reject update with invalid status', async () => {
      await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);
    });

    it('should reject update without any fields', async () => {
      await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('Delete Task', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Task to Delete' });
      taskId = res.body.task.id;
    });

    it('should delete own task', async () => {
      await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);

      // Verify task is deleted
      await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app)
        .delete('/api/v1/tasks/64f1234567890abcdef12345')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});
