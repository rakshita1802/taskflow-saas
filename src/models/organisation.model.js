'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organisation extends Model {
    static associate(models) {
      Organisation.hasMany(models.User, { foreignKey: 'organisation_id' });
    }
  }
  Organisation.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Organisation',
    tableName: 'organisations',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Organisation;
};
