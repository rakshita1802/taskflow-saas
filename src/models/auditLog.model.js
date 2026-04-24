'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
      AuditLog.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  AuditLog.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    organisation_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true // System actions might not have a user
    },
    entity_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    previous_state: {
      type: DataTypes.JSONB
    },
    new_state: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false // Audit logs shouldn't be updated
  });
  return AuditLog;
};
