const Joi = require('joi');

const register = Joi.object({
  organisation_id: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'member').default('member')
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refresh = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  register,
  login,
  refresh
};
