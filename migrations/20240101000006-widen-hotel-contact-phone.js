'use strict';

/**
 * Hotel.contactPhone was a 32-bit INTEGER, which cannot hold a full Nigerian
 * phone number (an 11-digit MSISDN overflows it). Widen it to BIGINT to match
 * User.phoneNumber and Company.contactPhone.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Hotels', 'contactPhone', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Values that don't fit a 32-bit INTEGER would be truncated on downgrade.
    await queryInterface.changeColumn('Hotels', 'contactPhone', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
