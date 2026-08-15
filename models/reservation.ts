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
  status: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalPrice?: number;
  paymentReference?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
  Room?: any;
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
    status!: string;
    paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
    totalPrice?: number;
    paymentReference?: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
    Room?: any;
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
        type: dataTypes.ENUM('active', 'confirmed', 'cancelled', 'checked-out', 'used', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentStatus: {
        type: dataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalPrice: {
        type: dataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      paymentReference: {
        type: dataTypes.STRING(100),
        allowNull: true,
        unique: true,
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
