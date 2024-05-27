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
      // define association here
      Reservation.belongsTo(models.Hotel, {foreignKey: 'hotelId', type: DataTypes.UUID });
      Reservation.belongsTo(models.User, {foreignKey: 'userId', type: DataTypes.UUID });
      Reservation.belongsTo(models.Room, {foreignKey: 'roomId', type: DataTypes.UUID });
    }
  }
  Reservation.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    hotelId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Hotel must not be empty"
        }
      }
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.STRING,
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
    paymentStatus: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: "Reservations",
    modelName: 'Reservation',
    paranoid: true,
    timestamps: true,
  });
  return Reservation;
};