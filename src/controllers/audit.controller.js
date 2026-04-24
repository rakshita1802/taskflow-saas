const auditService = require('../services/audit.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAuditLogs = asyncHandler(async (req, res) => {
  // Allow filtering by entity_id, action, etc via query params
  const { entity_type, entity_id, action } = req.query;
  const additionalFilters = {};

  if (entity_type) additionalFilters.entity_type = entity_type;
  if (entity_id) additionalFilters.entity_id = entity_id;
  if (action) additionalFilters.action = action;

  const logs = await auditService.getLogs(req.tenantFilter, additionalFilters);
  res.status(200).json(new ApiResponse(200, logs, 'Audit logs retrieved successfully'));
});

module.exports = {
  getAuditLogs
};
