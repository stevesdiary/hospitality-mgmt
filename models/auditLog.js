'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {}
  }

  AuditLog.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    eventType: {
      type: DataTypes.ENUM('auth', 'data_mutation', 'admin_action', 'payment'),
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('success', 'failure'),
      allowNull: false,
      defaultValue: 'success'
    }
  }, {
    sequelize,
    tableName: 'AuditLogs',
    modelName: 'AuditLog',
    paranoid: false,
    timestamps: true
  });

  return AuditLog;
};
