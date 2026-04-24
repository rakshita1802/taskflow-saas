const express = require('express');
const auditController = require('../controllers/audit.controller');
const authenticate = require('../middleware/authenticate');
const tenantIsolation = require('../middleware/tenantIsolation');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/roles');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

// Only admins can view audit logs
router.get('/', authorize([PERMISSIONS.VIEW_AUDIT_LOGS]), auditController.getAuditLogs);

module.exports = router;
