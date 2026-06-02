"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Reservation, { foreignKey: 'userId', type: DataTypes.UUID });
      User.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name is required.",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is required.",
          },
          // min: string(3) 
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          isPhoneNumber(value) {
            const phoneRegex = /^(?:\+?234|0)\d{10}$/; // Example: Allow only 10-digit numbers
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
            args: true,
            msg: 'Password must not be empty',
          },
        },
      },
      type: {
        type: DataTypes.ENUM("guest", "regular", "premium", "admin", "org_admin"),
        allowNull: true,
        defaultValue: "regular",
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'Companies', key: 'id' }
      },
    },
    {
      sequelize,
      tableName: "Users",
      modelName: "User",
      paranoid: true,
      timestamps: true,
    }
  );
  return User;
};
