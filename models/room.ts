/** 
 * Room Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';

export interface RoomInstance extends Model {
  id: string;
  hotelId: string;
  category: string;
  capacity: number;
  description?: string;
  deals?: number;
  checkIn: Date;
  checkOut: Date;
  availability: boolean;
  price: number;
  discount?: number;
  discountCode?: string;
  condition: string;
  additionalRequest?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<RoomInstance> => {
  class Room extends Model implements RoomInstance {
    static associate(models: any) {
      Room.hasMany(models.Reservation, { foreignKey: 'roomId', as: 'rooms' });
      Room.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
    }

    id!: string;
    hotelId!: string;
    category!: string;
    capacity!: number;
    description!: string;
    deals?: number;
    checkIn!: Date;
    checkOut!: Date;
    availability!: boolean;
    price!: number;
    discount?: number;
    discountCode?: string;
    condition!: string;
    additionalRequest?: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
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
        type: DataTypes.ENUM('regular', 'luxury', 'conference', 'event hall', 'studio apartment'),
        allowNull: false,
        defaultValue: 'regular',
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
        allowNull: true,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      additionalRequest: {
        type: DataTypes.STRING,
        allowNull: true,
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
