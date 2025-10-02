import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { taskRouter } from './task.routes.js';

export const v1Router = Router();

v1Router.get('/', (req, res) => {
  res.json({ message: 'API v1 root' });
});

v1Router.use('/auth', authRouter);
v1Router.use('/tasks', taskRouter);


