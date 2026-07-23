/**
 * Reservation Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface ReservationInstance extends Model {
  id: string;
  hotelId: string;
  userId?: string;
  roomId: string;
  companyId?: string;
  guestCount?: number;
  // Guest-checkout contact details (used when there is no user account).
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  bookingReference?: string;
  dateIn: Date;
  dateOut: Date;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  paymentStatus?: boolean;
  checkInTime?: Date;
  checkOutTime?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export interface ReservationCreationAttributes extends Optional<
  ReservationInstance,
  'id' | 'status' | 'paymentStatus' | 'companyId' | 'guestCount' | 'userId' | 'guestName' | 'guestEmail' | 'guestPhone' | 'bookingReference' | 'checkInTime' | 'checkOutTime' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): any => {
  class Reservation extends Model<ReservationInstance, ReservationCreationAttributes> implements ReservationInstance {
    static associate(models: any) {
      Reservation.belongsTo(models.Hotel, { foreignKey: 'hotelId', as: 'Hotel' });
      Reservation.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
      Reservation.belongsTo(models.Room, { foreignKey: 'roomId', as: 'Room' });
    }

    id!: string;
    hotelId!: string;
    userId?: string;
    roomId!: string;
    companyId?: string;
    guestCount?: number;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    bookingReference?: string;
    dateIn!: Date;
    dateOut!: Date;
    status!: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
    paymentStatus?: boolean;
    checkInTime?: Date;
    checkOutTime?: Date;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  Reservation.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      hotelId: {
        type: dataTypes.UUID,
        allowNull: false,
        validate: { notNull: { msg: 'Hotel must not be empty' } },
      },
      userId: {
        type: dataTypes.UUID,
        allowNull: true,
      },
      roomId: {
        type: dataTypes.UUID,
        allowNull: false,
        validate: { notNull: { msg: 'Room must not be empty' } },
      },
      guestName: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      guestEmail: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      guestPhone: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      bookingReference: {
        type: dataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      companyId: {
        type: dataTypes.UUID,
        allowNull: true,
        references: { model: 'Companies', key: 'id' },
      },
      guestCount: {
        type: dataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      dateIn: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      dateOut: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: dataTypes.ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentStatus: dataTypes.BOOLEAN,
      checkInTime: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      checkOutTime: {
        type: dataTypes.DATE,
        allowNull: true,
      },
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
