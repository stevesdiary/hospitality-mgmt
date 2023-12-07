'use strict';
const {
  Model
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
    }
  }
  Reservation.init({
    id: DataTypes.UUID,
    hotel: DataTypes.STRING,
    room: DataTypes.STRING,
    date: DataTypes.DATE,
    payment_status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};