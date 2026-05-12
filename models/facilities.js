'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Facility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Facility.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
    }
  }
  Facility.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    hotelId: DataTypes.UUID,
    restaurant: DataTypes.STRING,
    barLounge: DataTypes.BOOLEAN,
    security: DataTypes.BOOLEAN,
    wifiInternet: DataTypes.BOOLEAN,
    swimmingPool: DataTypes.BOOLEAN,
    dstv: DataTypes.BOOLEAN,
    gym: DataTypes.BOOLEAN,
    cctv: DataTypes.BOOLEAN,
    carHire: DataTypes.BOOLEAN,
    roomService: DataTypes.BOOLEAN,
    frontDesk24h: DataTypes.BOOLEAN,
    electricity24h: DataTypes.BOOLEAN,
    carPark: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'Facilities',
    modelName: 'Facility',
    paranoid: true,
    timestamps: true,
  });
  return Facility;
};