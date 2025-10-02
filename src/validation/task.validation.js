import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(2000).allow('', null),
  status: Joi.string().valid('pending', 'in_progress', 'done').optional()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(200),
  description: Joi.string().trim().max(2000).allow('', null),
  status: Joi.string().valid('pending', 'in_progress', 'done')
}).min(1);



