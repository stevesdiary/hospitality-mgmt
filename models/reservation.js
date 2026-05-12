'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservation.belongsTo(models.Hotel, { foreignKey: 'hotelId', type: DataTypes.UUID });
      Reservation.belongsTo(models.User, { foreignKey: 'userId', type: DataTypes.UUID });
      Reservation.belongsTo(models.Room, { foreignKey: 'roomId', type: DataTypes.UUID });
      Reservation.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    }
  }
  Reservation.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    hotelId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Hotel must not be empty"
        }
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Room must not be empty"
        }
      }
    },
    dateIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateOut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'used', 'expired'),
      allowNull: false,
      defaultValue: "active"
    },
    paymentStatus: DataTypes.BOOLEAN,
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Companies', key: 'id' }
    }
  }, {
    sequelize,
    tableName: "Reservations",
    modelName: 'Reservation',
    paranoid: true,
    timestamps: true,
  });
  return Reservation;
};