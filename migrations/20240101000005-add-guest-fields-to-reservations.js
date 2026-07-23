'use strict';

/**
 * Guest checkout: a guest can book a hotel's own page without an account.
 * Reservations therefore need optional guest contact fields, a human-friendly
 * booking reference (for confirmation + front-desk lookup / QR), and a nullable
 * userId (guest bookings aren't tied to a user account).
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reservations', 'guestName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Reservations', 'guestEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Reservations', 'guestPhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Reservations', 'bookingReference', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addIndex('Reservations', ['bookingReference'], {
      unique: true,
      name: 'reservations_booking_reference_unique',
      where: { deletedAt: null },
    });

    // Guest bookings have no user account.
    await queryInterface.changeColumn('Reservations', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Reservations', 'reservations_booking_reference_unique');
    await queryInterface.removeColumn('Reservations', 'guestName');
    await queryInterface.removeColumn('Reservations', 'guestEmail');
    await queryInterface.removeColumn('Reservations', 'guestPhone');
    await queryInterface.removeColumn('Reservations', 'bookingReference');
    await queryInterface.changeColumn('Reservations', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
