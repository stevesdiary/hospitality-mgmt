'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const cols = await queryInterface.describeTable('Companies');
    
    if (!cols.primaryColor) {
      await queryInterface.addColumn('Companies', 'primaryColor', {
        type: Sequelize.STRING(7),
        allowNull: true,
        defaultValue: '#3b82f6', // blue-500
      });
    }
    if (!cols.secondaryColor) {
      await queryInterface.addColumn('Companies', 'secondaryColor', {
        type: Sequelize.STRING(7),
        allowNull: true,
        defaultValue: '#64748b', // slate-500
      });
    }
    if (!cols.accentColor) {
      await queryInterface.addColumn('Companies', 'accentColor', {
        type: Sequelize.STRING(7),
        allowNull: true,
        defaultValue: '#f97316', // orange-500
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Companies', 'accentColor');
    await queryInterface.removeColumn('Companies', 'secondaryColor');
    await queryInterface.removeColumn('Companies', 'primaryColor');
  },
};
