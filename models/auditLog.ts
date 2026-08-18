/**
 * AuditLog Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';

export type EventType = 'auth' | 'data_mutation' | 'admin_action' | 'payment';
export type AuditStatus = 'success' | 'failure';

export interface AuditLogInstance extends Model {
  id: string;
  userId?: string;
  userEmail?: string;
  userType?: string;
  eventType: EventType;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: AuditStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<AuditLogInstance> => {
  class AuditLog extends Model implements AuditLogInstance {
    static associate(_models: any) {}

    id!: string;
    userId?: string;
    userEmail?: string;
    userType?: string;
    eventType!: EventType;
    action!: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    status!: AuditStatus;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
  }

  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eventType: {
        type: DataTypes.ENUM('auth', 'data_mutation', 'admin_action', 'payment'),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('success', 'failure'),
        allowNull: false,
        defaultValue: 'success',
      },
    },
    {
      sequelize,
      tableName: 'AuditLogs',
      modelName: 'AuditLog',
      paranoid: false,
      timestamps: true,
    }
  );

  return AuditLog;
};
