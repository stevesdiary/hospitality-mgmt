'use strict';

/**
 * Adds an optional avatar image URL to users, set from the profile page after
 * uploading an image.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'avatarUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'avatarUrl');
  },
};
