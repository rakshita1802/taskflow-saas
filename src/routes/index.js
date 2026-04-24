const express = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes');
const orgRoutes = require('./organisation.routes');
const auditRoutes = require('./audit.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/organisations', orgRoutes);
router.use('/audit-logs', auditRoutes);

module.exports = router;
