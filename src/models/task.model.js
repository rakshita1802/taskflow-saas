'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
      Task.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    }
  }
  Task.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    organisation_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending' // pending, in-progress, completed
    },
    due_date: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Task;
};
