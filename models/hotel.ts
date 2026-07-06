/** 
 * Hotel Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';
import { HotelType } from '../types';

export interface HotelInstance extends Model {
  id: string;
  name: string;
  slug?: string;
  address: string;
  city: string;
  state: string;
  description?: string;
  hotelType: HotelType;
  numberOfRooms?: number;
  contactEmail: string;
  contactPhone: string;
  termsAndConditions?: string;
  companyId?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<HotelInstance> => {
  class Hotel extends Model implements HotelInstance {
    static associate(models: any) {
      // define association here
      Hotel.hasMany(models.Room, { foreignKey: 'hotelId', as: 'rooms' });
      Hotel.hasMany(models.Facility, { foreignKey: 'hotelId', as: 'facilities' });
      Hotel.hasMany(models.RatingAndReview, { foreignKey: 'hotelId', as: 'ratingAndReview' });
      Hotel.hasMany(models.Reservation, { foreignKey: 'hotelId', as: 'reservation' });
    }

    id!: string;
    name!: string;
    slug?: string;
    address!: string;
    city!: string;
    state!: string;
    description?: string;
    hotelType!: HotelType;
    numberOfRooms?: number;
    contactEmail!: string;
    contactPhone!: string;
    termsAndConditions?: string;
    companyId?: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  Hotel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hotelType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numberOfRooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPhone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      termsAndConditions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'Companies', key: 'id' },
      },
    },
    {
      sequelize,
      tableName: 'Hotels',
      modelName: 'Hotel',
      paranoid: true,
      timestamps: true,
    }
  );

  return Hotel;
};
