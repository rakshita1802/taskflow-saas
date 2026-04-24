const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

const PERMISSIONS = {
  // Task permissions
  CREATE_TASK: 'create_task',
  READ_TASK: 'read_task',
  READ_ALL_TASKS: 'read_all_tasks',
  UPDATE_TASK: 'update_task',
  UPDATE_ALL_TASKS: 'update_all_tasks',
  DELETE_TASK: 'delete_task',
  DELETE_ALL_TASKS: 'delete_all_tasks',

  // Organisation / User permissions
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.READ_TASK,
    PERMISSIONS.READ_ALL_TASKS,
    PERMISSIONS.UPDATE_TASK,
    PERMISSIONS.UPDATE_ALL_TASKS,
    PERMISSIONS.DELETE_TASK,
    PERMISSIONS.DELETE_ALL_TASKS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.READ_TASK,       // can only read own task
    PERMISSIONS.UPDATE_TASK,     // can only update own task
    PERMISSIONS.DELETE_TASK,     // can only delete own task
  ]
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS
};
