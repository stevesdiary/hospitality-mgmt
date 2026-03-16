/** 
 * Media File Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';

export interface MediaFileInstance extends Model {
  id: string;
  hotelId: string;
  roomId: string;
  fileUrl: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<MediaFileInstance> => {
  class MediaFile extends Model implements MediaFileInstance {
    static associate(models: any) {
      MediaFile.belongsTo(models.Room, { foreignKey: 'room_id' });
    }

    id!: string;
    hotelId!: string;
    roomId!: string;
    fileUrl!: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
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
      fileUrl: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'MediaFile',
      modelName: 'MediaFile',
      paranoid: false,
    }
  );

  return MediaFile;
};
