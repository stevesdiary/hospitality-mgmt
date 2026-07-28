/**
 * Payment Model
 *
 * One row per transaction attempt against a reservation. Amounts are in the
 * currency's smallest unit (kobo for NGN).
 */

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export type PaymentState = 'pending' | 'success' | 'failed' | 'abandoned';

export interface PaymentInstance extends Model {
  id: string;
  reservationId: string;
  companyId?: string;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentState;
  channel?: string;
  email?: string;
  paidAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export interface PaymentCreationAttributes extends Optional<
  PaymentInstance,
  'id' | 'companyId' | 'currency' | 'status' | 'channel' | 'email' | 'paidAt' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): any => {
  class Payment extends Model<PaymentInstance, PaymentCreationAttributes> implements PaymentInstance {
    static associate(models: any) {
      Payment.belongsTo(models.Reservation, { foreignKey: 'reservationId', as: 'Reservation' });
    }

    id!: string;
    reservationId!: string;
    companyId?: string;
    reference!: string;
    amount!: number;
    currency!: string;
    status!: PaymentState;
    channel?: string;
    email?: string;
    paidAt?: Date;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  Payment.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      reservationId: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      companyId: {
        type: dataTypes.UUID,
        allowNull: true,
        references: { model: 'Companies', key: 'id' },
      },
      reference: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: dataTypes.BIGINT,
        allowNull: false,
      },
      currency: {
        type: dataTypes.STRING,
        allowNull: false,
        defaultValue: 'NGN',
      },
      status: {
        type: dataTypes.ENUM('pending', 'success', 'failed', 'abandoned'),
        allowNull: false,
        defaultValue: 'pending',
      },
      channel: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      paidAt: {
        type: dataTypes.DATE,
        allowNull: true,
      },
    } as any,
    {
      sequelize,
      tableName: 'Payments',
      modelName: 'Payment',
      paranoid: true,
      timestamps: true,
    }
  );

  return Payment;
};
