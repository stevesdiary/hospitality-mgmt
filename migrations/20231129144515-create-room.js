'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      hotelId: {
        type: Sequelize.UUID
      },
      roomId: {
        type: Sequelize.UUID
      },
      category: {
        type: Sequelize.STRING
      },
      numOfToilet: {
        type: Sequelize.INTEGER
      },
      checkIn: {
        type: Sequelize.TIME
      },
      checkOut: {
        type: Sequelize.TIME
      },
      description: {
        type: Sequelize.STRING
      },
      availability: {
        type: Sequelize.BOOLEAN
      },
      price: {
        type: Sequelize.INTEGER
      },
      condition: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};