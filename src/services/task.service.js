const { Task, User } = require('../models');
const auditService = require('./audit.service');
const { AUDIT_ACTIONS } = require('../constants/auditActions');

const createTask = async (taskData) => {
  const task = await Task.create(taskData);
  
  await auditService.recordLog({
    organisation_id: task.organisation_id,
    user_id: task.created_by,
    entity_type: 'task',
    entity_id: task.id,
    action: AUDIT_ACTIONS.CREATE_TASK,
    new_state: task.toJSON()
  });

  return task;
};

const getTasks = async (tenantFilter, additionalFilters = {}) => {
  return await Task.findAll({
    where: { ...tenantFilter, ...additionalFilters },
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'DESC']]
  });
};

const getTaskById = async (id, tenantFilter) => {
  const task = await Task.findOne({
    where: { id, ...tenantFilter },
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
  });
  
  if (!task) throw new Error('Task not found');
  return task;
};

const updateTask = async (id, tenantFilter, updateData, userId) => {
  const task = await getTaskById(id, tenantFilter);
  const previous_state = task.toJSON();
  
  await task.update(updateData);

  await auditService.recordLog({
    organisation_id: task.organisation_id,
    user_id: userId,
    entity_type: 'task',
    entity_id: task.id,
    action: AUDIT_ACTIONS.UPDATE_TASK,
    previous_state,
    new_state: task.toJSON()
  });

  return task;
};

const deleteTask = async (id, tenantFilter, userId) => {
  const task = await getTaskById(id, tenantFilter);
  const previous_state = task.toJSON();

  await task.destroy();

  await auditService.recordLog({
    organisation_id: task.organisation_id,
    user_id: userId,
    entity_type: 'task',
    entity_id: task.id,
    action: AUDIT_ACTIONS.DELETE_TASK,
    previous_state
  });

  return { id };
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
