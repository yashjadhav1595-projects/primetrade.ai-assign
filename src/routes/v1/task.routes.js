import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { createTask, listTasks, getTaskById, updateTask, deleteTask } from '../../controllers/task.controller.js';
import { createTaskSchema, updateTaskSchema } from '../../validation/task.validation.js';
import { validate } from '../../utils/validate.js';

export const taskRouter = Router();

taskRouter.use(authenticate());

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     description: Create a new task assigned to the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Complete project documentation"
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "Write comprehensive API documentation"
 *               status:
 *                 type: string
 *                 enum: ['pending', 'in_progress', 'done']
 *                 default: 'pending'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
taskRouter.post('/', validate(createTaskSchema), createTask);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     description: Get tasks for current user (admin sees all tasks, users see only their own)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 */
taskRouter.get('/', listTasks);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Get task by id
 */
taskRouter.get('/:id', getTaskById);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 */
taskRouter.patch('/:id', validate(updateTaskSchema), updateTask);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 */
taskRouter.delete('/:id', deleteTask);



