/** 
 * Facility Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';

export interface FacilityInstance extends Model {
  id: string;
  hotelId: string;
  restaurant?: string;
  barLaunge?: boolean;
  security?: boolean;
  wifiInternet?: boolean;
  swimmingPool?: boolean;
  dstv?: boolean;
  gym?: boolean;
  cctv?: boolean;
  carHire?: boolean;
  roomService?: boolean;
  frontDesk24h?: boolean;
  electricity24h?: boolean;
  carPark?: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<FacilityInstance> => {
  class Facility extends Model implements FacilityInstance {
    static associate(models: any) {
      Facility.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
    }

    id!: string;
    hotelId!: string;
    restaurant?: string;
    barLaunge?: boolean;
    security?: boolean;
    wifiInternet?: boolean;
    swimmingPool?: boolean;
    dstv?: boolean;
    gym?: boolean;
    cctv?: boolean;
    carHire?: boolean;
    roomService?: boolean;
    frontDesk24h?: boolean;
    electricity24h?: boolean;
    carPark?: boolean;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  Facility.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      hotelId: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      restaurant: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      barLaunge: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      security: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      wifiInternet: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      swimmingPool: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      dstv: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      gym: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      cctv: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      carHire: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      roomService: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      frontDesk24h: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      electricity24h: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      carPark: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Facilities',
      modelName: 'Facility',
      paranoid: true,
      timestamps: true,
    }
  );

  return Facility;
};
