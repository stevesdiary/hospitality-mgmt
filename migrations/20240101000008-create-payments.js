'use strict';

/**
 * Payments — an audit trail of every transaction attempt against a reservation.
 *
 * Amounts are stored in the currency's smallest unit (kobo for NGN) as BIGINT:
 * integers avoid floating-point rounding on money, and BIGINT leaves no
 * realistic overflow ceiling.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      reservationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Reservations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Denormalised so payments can be scoped per tenant without a join.
      companyId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Companies', key: 'id' },
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'NGN',
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'abandoned'),
        allowNull: false,
        defaultValue: 'pending',
      },
      channel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE },
    });

    await queryInterface.addIndex('Payments', ['reservationId'], { name: 'payments_reservation_idx' });
    await queryInterface.addIndex('Payments', ['companyId'], { name: 'payments_company_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Payments', 'payments_reservation_idx');
    await queryInterface.removeIndex('Payments', 'payments_company_idx');
    await queryInterface.dropTable('Payments');
  },
};
