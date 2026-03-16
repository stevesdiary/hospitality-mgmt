/** 
 * Reservation Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface ReservationInstance extends Model {
  id: string;
  hotelId: string;
  userId: string;
  roomId: string;
  dateIn: Date;
  dateOut: Date;
  status: string;
  paymentStatus?: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export interface ReservationCreationAttributes extends Optional<ReservationInstance, 'id' | 'status' | 'paymentStatus' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export default (sequelize: Sequelize, dataTypes: typeof import('sequelize').DataTypes): any => {
  // Alias for type compatibility
  const DataTypes = dataTypes;
  class Reservation extends Model<ReservationInstance, ReservationCreationAttributes> implements ReservationInstance {
    static associate(models: any) {
      Reservation.belongsTo(models.Hotel, { foreignKey: 'hotelId', as: 'Hotel' });
      Reservation.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
      Reservation.belongsTo(models.Room, { foreignKey: 'roomId', as: 'Room' });
    }

    id!: string;
    hotelId!: string;
    userId!: string;
    roomId!: string;
    dateIn!: Date;
    dateOut!: Date;
    status!: string;
    paymentStatus?: boolean;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  Reservation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      hotelId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Hotel must not be empty',
          },
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Room must not be empty',
          },
        },
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
        defaultValue: 'active',
      },
      paymentStatus: DataTypes.BOOLEAN,
    } as any,
    {
      sequelize,
      tableName: 'Reservations',
      modelName: 'Reservation',
      paranoid: true,
      timestamps: true,
    }
  );
  
  return Reservation;
};
