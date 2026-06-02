'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MediaFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MediaFile.belongsTo(models.Room, { foreignKey: 'roomId' });
      MediaFile.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    }
  }
  MediaFile.init(
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
      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Companies', key: 'id' }
      },
    },
    {
      sequelize,
      tableName: "MediaFile",
      modelName: "MediaFile",
      paranoid: false,
    }
  );
  return MediaFile;
};