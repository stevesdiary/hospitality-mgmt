'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Facilities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      hotelId: {
        type: Sequelize.UUID
      },
      restaurant: {
        type: Sequelize.STRING
      },
      barLounge: {
        type: Sequelize.BOOLEAN
      },
      security: {
        type: Sequelize.BOOLEAN
      },
      wifiInternet: {
        type: Sequelize.BOOLEAN
      },
      swimmingPool: {
        type: Sequelize.BOOLEAN
      },
      dstv: {
        type: Sequelize.BOOLEAN
      },
      gym: {
        type: Sequelize.BOOLEAN
      },
      cctv: {
        type: Sequelize.BOOLEAN
      },
      carHire: {
        type: Sequelize.BOOLEAN
      },
      roomService: {
        type: Sequelize.BOOLEAN
      },
      frontDesk24h: {
        type: Sequelize.BOOLEAN
      },
      electricity24h: {
        type: Sequelize.BOOLEAN
      },
      carPark: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Facilities');
  }
};