'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change paymentStatus from BOOLEAN to ENUM
    await queryInterface.removeColumn('Reservations', 'paymentStatus');
    await queryInterface.addColumn('Reservations', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    });

    // Add totalPrice
    await queryInterface.addColumn('Reservations', 'totalPrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    // Add paymentReference for Paystack
    await queryInterface.addColumn('Reservations', 'paymentReference', {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
    });

    // Add index on paymentReference for quick lookups
    await queryInterface.addIndex('Reservations', ['paymentReference'], {
      name: 'reservations_payment_reference_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Reservations', 'reservations_payment_reference_idx');
    await queryInterface.removeColumn('Reservations', 'paymentReference');
    await queryInterface.removeColumn('Reservations', 'totalPrice');
    await queryInterface.removeColumn('Reservations', 'paymentStatus');
    await queryInterface.addColumn('Reservations', 'paymentStatus', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },
};
