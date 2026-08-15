'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fix reservation status — the original migration used STRING not ENUM,
    // so we just ensure the column exists as STRING (it already accepts any value).
    // If it was somehow created as an ENUM, extend it safely.
    const [[{ data_type }]] = await queryInterface.sequelize.query(`
      SELECT data_type FROM information_schema.columns
      WHERE table_name = 'Reservations' AND column_name = 'status';
    `);

    if (data_type === 'USER-DEFINED') {
      // Was created as ENUM — add missing values
      for (const val of ['confirmed', 'cancelled', 'checked-out', 'used', 'expired']) {
        await queryInterface.sequelize.query(
          `ALTER TYPE "enum_Reservations_status" ADD VALUE IF NOT EXISTS '${val}';`
        );
      }
    }
    // If STRING, nothing to do — all values are already accepted

    // Fix password column — widen from STRING(64) to STRING(255)
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    // Add profileImage to Users (guard against column already existing)
    const userColumns = await queryInterface.describeTable('Users');
    if (!userColumns.profileImage) {
      await queryInterface.addColumn('Users', 'profileImage', {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'profileImage');
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING(64),
      allowNull: false,
    });
    // Note: PostgreSQL does not support removing ENUM values — manual rollback required
  },
};
