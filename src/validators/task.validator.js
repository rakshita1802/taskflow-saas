const Joi = require('joi');

const createTask = Joi.object({
  title: Joi.string().required().max(255),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
  due_date: Joi.date().iso().allow(null)
});

const updateTask = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  due_date: Joi.date().iso().allow(null)
});

module.exports = {
  createTask,
  updateTask
};
