'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.hasMany(models.Reservation, { foreignKey: 'roomId', as: 'rooms' });
      Room.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
      Room.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    }
  }
  Room.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      hotelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("regular",  "luxury", "conference", "event hall", "studio apartment"),
        allowNull: false,
        defaultValue: "regular",
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deals: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      checkIn: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discountCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      additionalRequest: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Companies', key: 'id' }
      },
    },
    {
      sequelize,
      tableName: 'Rooms',
      modelName: 'Room',
      paranoid: true,
      timestamps: true,
    }
  );
  return Room;
};