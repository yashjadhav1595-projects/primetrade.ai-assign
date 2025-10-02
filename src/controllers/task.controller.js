import httpStatus from 'http-status';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.create({ title, description, status, owner: req.user.id });
  res.status(httpStatus.CREATED).json({ task });
});

export const listTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user.id };
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.status(httpStatus.OK).json({ tasks });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (req.user.role !== 'admin' && String(task.owner) !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.status(httpStatus.OK).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (req.user.role !== 'admin' && String(task.owner) !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const { title, description, status } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  await task.save();
  res.status(httpStatus.OK).json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  if (req.user.role !== 'admin' && String(task.owner) !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await task.deleteOne();
  res.status(httpStatus.NO_CONTENT).send();
});



