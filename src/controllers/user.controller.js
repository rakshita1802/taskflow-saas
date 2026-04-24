const userService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { updateUser } = require('../validators/user.validator');

const getAll = asyncHandler(async (req, res) => {
  const users = await userService.getUsers(req.tenantFilter);
  res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

const getById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id, req.tenantFilter);
  res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
});

const update = asyncHandler(async (req, res) => {
  const { error, value } = updateUser.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiResponse(400, null, error.details[0].message));
  }

  const user = await userService.updateUser(req.params.id, req.tenantFilter, value);
  const userResponse = user.toJSON();
  delete userResponse.password_hash;
  
  res.status(200).json(new ApiResponse(200, userResponse, 'User updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.tenantFilter);
  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

module.exports = {
  getAll,
  getById,
  update,
  remove
};
