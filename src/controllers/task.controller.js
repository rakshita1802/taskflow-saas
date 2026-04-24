const taskService = require('../services/task.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { createTask, updateTask } = require('../validators/task.validator');
const { PERMISSIONS } = require('../constants/roles');

const create = asyncHandler(async (req, res) => {
  const { error, value } = createTask.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiResponse(400, null, error.details[0].message));
  }

  // Inject user and tenant details
  value.organisation_id = req.user.organisation_id;
  value.created_by = req.user.id;

  const task = await taskService.createTask(value);
  res.status(201).json(new ApiResponse(201, task, 'Task created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  let extraFilters = {};
  
  // If user only has READ_TASK (and not READ_ALL_TASKS), enforce scoping to only tasks they created
  if (req.user.role === 'member') {
    extraFilters.created_by = req.user.id;
  }

  const tasks = await taskService.getTasks(req.tenantFilter, extraFilters);
  res.status(200).json(new ApiResponse(200, tasks, 'Tasks retrieved successfully'));
});

const getById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.tenantFilter);
  
  // Scoping for members
  if (req.user.role === 'member' && task.created_by !== req.user.id) {
    return res.status(403).json(new ApiResponse(403, null, 'Forbidden: You can only view your own tasks'));
  }

  res.status(200).json(new ApiResponse(200, task, 'Task retrieved successfully'));
});

const update = asyncHandler(async (req, res) => {
  const { error, value } = updateTask.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiResponse(400, null, error.details[0].message));
  }

  const task = await taskService.getTaskById(req.params.id, req.tenantFilter);

  if (req.user.role === 'member' && task.created_by !== req.user.id) {
    return res.status(403).json(new ApiResponse(403, null, 'Forbidden: You can only update your own tasks'));
  }

  const updatedTask = await taskService.updateTask(req.params.id, req.tenantFilter, value, req.user.id);
  res.status(200).json(new ApiResponse(200, updatedTask, 'Task updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.tenantFilter);

  if (req.user.role === 'member' && task.created_by !== req.user.id) {
    return res.status(403).json(new ApiResponse(403, null, 'Forbidden: You can only delete your own tasks'));
  }

  await taskService.deleteTask(req.params.id, req.tenantFilter, req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
