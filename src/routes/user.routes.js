const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const tenantIsolation = require('../middleware/tenantIsolation');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/roles');

const router = express.Router();

// Protect all user routes
router.use(authenticate);
router.use(tenantIsolation);

// Only Admins can manage users
router.use(authorize([PERMISSIONS.MANAGE_USERS]));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
