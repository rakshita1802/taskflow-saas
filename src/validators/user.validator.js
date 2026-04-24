const Joi = require('joi');

const updateUser = Joi.object({
  name: Joi.string().min(2).max(50),
  role: Joi.string().valid('admin', 'member'),
  is_active: Joi.boolean()
});

module.exports = {
  updateUser
};
