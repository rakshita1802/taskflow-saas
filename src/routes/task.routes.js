const express = require('express');
const taskController = require('../controllers/task.controller');
const authenticate = require('../middleware/authenticate');
const tenantIsolation = require('../middleware/tenantIsolation');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/roles');

const router = express.Router();

// All task routes require authentication and tenant isolation
router.use(authenticate);
router.use(tenantIsolation);

router.post('/', authorize([PERMISSIONS.CREATE_TASK]), taskController.create);

// GET /tasks: Admin needs READ_ALL_TASKS, Member uses READ_TASK (logic handled in controller)
router.get('/', authorize([PERMISSIONS.READ_TASK]), taskController.getAll);

// GET /tasks/:id: Read a specific task
router.get('/:id', authorize([PERMISSIONS.READ_TASK]), taskController.getById);

// PUT /tasks/:id: Update a specific task
router.put('/:id', authorize([PERMISSIONS.UPDATE_TASK]), taskController.update);

// DELETE /tasks/:id: Delete a specific task
router.delete('/:id', authorize([PERMISSIONS.DELETE_TASK]), taskController.remove);

module.exports = router;
