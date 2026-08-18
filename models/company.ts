/**
 * Company Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';

export interface CompanyInstance extends Model {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: number;
  address?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<CompanyInstance> => {
  class Company extends Model implements CompanyInstance {
    static associate(models: any) {
      Company.hasMany(models.User, { foreignKey: 'companyId', as: 'users' });
      Company.hasMany(models.Hotel, { foreignKey: 'companyId', as: 'hotels' });
    }

    id!: string;
    name!: string;
    contactEmail!: string;
    contactPhone?: number;
    address?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    isActive!: boolean;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  Company.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'Invalid email format' } },
      },
      contactPhone: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logoUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      primaryColor: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#3b82f6',
      },
      secondaryColor: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#64748b',
      },
      accentColor: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#f97316',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'Companies',
      modelName: 'Company',
      paranoid: true,
      timestamps: true,
    }
  );

  return Company;
};
