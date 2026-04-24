const { AuditLog } = require('../models');

/**
 * Record an action in the audit log
 * @param {Object} params
 * @param {string} params.organisation_id
 * @param {string} params.user_id
 * @param {string} params.entity_type
 * @param {string} params.entity_id
 * @param {string} params.action
 * @param {Object} [params.previous_state]
 * @param {Object} [params.new_state]
 */
const recordLog = async ({
  organisation_id,
  user_id,
  entity_type,
  entity_id,
  action,
  previous_state = null,
  new_state = null
}) => {
  try {
    await AuditLog.create({
      organisation_id,
      user_id,
      entity_type,
      entity_id,
      action,
      previous_state,
      new_state
    });
  } catch (error) {
    // We log the error but don't necessarily throw it,
    // so an audit failure doesn't necessarily block the main business transaction.
    // In strict systems, you might want to fail the transaction.
    console.error('Failed to create audit log:', error);
  }
};

const getLogs = async (tenantFilter, additionalFilters = {}) => {
  return await AuditLog.findAll({
    where: { ...tenantFilter, ...additionalFilters },
    order: [['created_at', 'DESC']],
    limit: 100 // Prevent massive queries
  });
};

module.exports = {
  recordLog,
  getLogs
};
