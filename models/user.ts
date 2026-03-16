/** 
 * User Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';
import { Gender, UserType } from '../types';

export interface UserInstance extends Model {
  id: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  phoneNumber: string;
  email: string;
  password: string;
  type?: UserType;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<UserInstance> => {
  class User extends Model implements UserInstance {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    firstName!: string;
    lastName!: string;
    gender?: Gender;
    phoneNumber!: string;
    email!: string;
    password!: string;
    type?: UserType;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;

    static associate(models: any) {
      // define association here
      User.hasMany(models.Reservation, {
        foreignKey: 'userId',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First name is required.',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Last name is required.',
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          isPhoneNumber(value: string) {
            const phoneRegex = /^(?:\+?234|0)\d{10}$/;
            if (!phoneRegex.test(value)) {
              throw new Error('Invalid phone number format, include the country code');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Invalid email format',
          },
        },
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password must not be empty',
          },
        },
      },
      type: {
        type: DataTypes.ENUM('guest', 'regular', 'premium', 'admin'),
        allowNull: true,
        defaultValue: 'regular',
      },
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User',
      paranoid: true,
      timestamps: true,
    }
  );

  return User;
};
