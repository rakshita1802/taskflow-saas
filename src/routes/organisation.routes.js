const express = require('express');
const orgController = require('../controllers/organisation.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/roles');

const router = express.Router();

router.use(authenticate);

// Everyone can view their own organisation info
router.get('/me', orgController.getMyOrg);

// Only admins can update organisation details (assuming MANAGE_USERS or a specific org permission)
router.put('/me', authorize([PERMISSIONS.MANAGE_USERS]), orgController.updateMyOrg);

module.exports = router;
