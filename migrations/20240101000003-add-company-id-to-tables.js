'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const UUID_NULL = { type: Sequelize.UUID, allowNull: true };
    const UUID_NOT_NULL = { type: Sequelize.UUID, allowNull: false };

    // Users — nullable: guests have no company
    await queryInterface.addColumn('Users', 'companyId', UUID_NULL);
    await queryInterface.addConstraint('Users', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'users_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Users', ['companyId'], { name: 'users_company_id_idx' });

    // Hotels — every hotel must belong to a company
    await queryInterface.addColumn('Hotels', 'companyId', UUID_NOT_NULL);
    await queryInterface.addConstraint('Hotels', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'hotels_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Hotels', ['companyId'], { name: 'hotels_company_id_idx' });

    // Rooms
    await queryInterface.addColumn('Rooms', 'companyId', UUID_NOT_NULL);
    await queryInterface.addConstraint('Rooms', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'rooms_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Rooms', ['companyId'], { name: 'rooms_company_id_idx' });

    // Facilities
    await queryInterface.addColumn('Facilities', 'companyId', UUID_NOT_NULL);
    await queryInterface.addConstraint('Facilities', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'facilities_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Facilities', ['companyId'], { name: 'facilities_company_id_idx' });

    // Reservations — company is the hotel owner receiving the reservation
    await queryInterface.addColumn('Reservations', 'companyId', UUID_NOT_NULL);
    await queryInterface.addConstraint('Reservations', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'reservations_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Reservations', ['companyId'], { name: 'reservations_company_id_idx' });

    // RatingsAndReviews
    await queryInterface.addColumn('RatingsAndReviews', 'companyId', UUID_NOT_NULL);
    await queryInterface.addConstraint('RatingsAndReviews', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'ratings_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('RatingsAndReviews', ['companyId'], { name: 'ratings_company_id_idx' });

    // MediaFiles
    await queryInterface.addColumn('MediaFiles', 'companyId', UUID_NOT_NULL);
    await queryInterface.addConstraint('MediaFiles', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'media_company_id_fk',
      references: { table: 'Companies', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('MediaFiles', ['companyId'], { name: 'media_company_id_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('MediaFiles', 'media_company_id_fk');
    await queryInterface.removeIndex('MediaFiles', 'media_company_id_idx');
    await queryInterface.removeColumn('MediaFiles', 'companyId');

    await queryInterface.removeConstraint('RatingsAndReviews', 'ratings_company_id_fk');
    await queryInterface.removeIndex('RatingsAndReviews', 'ratings_company_id_idx');
    await queryInterface.removeColumn('RatingsAndReviews', 'companyId');

    await queryInterface.removeConstraint('Reservations', 'reservations_company_id_fk');
    await queryInterface.removeIndex('Reservations', 'reservations_company_id_idx');
    await queryInterface.removeColumn('Reservations', 'companyId');

    await queryInterface.removeConstraint('Facilities', 'facilities_company_id_fk');
    await queryInterface.removeIndex('Facilities', 'facilities_company_id_idx');
    await queryInterface.removeColumn('Facilities', 'companyId');

    await queryInterface.removeConstraint('Rooms', 'rooms_company_id_fk');
    await queryInterface.removeIndex('Rooms', 'rooms_company_id_idx');
    await queryInterface.removeColumn('Rooms', 'companyId');

    await queryInterface.removeConstraint('Hotels', 'hotels_company_id_fk');
    await queryInterface.removeIndex('Hotels', 'hotels_company_id_idx');
    await queryInterface.removeColumn('Hotels', 'companyId');

    await queryInterface.removeConstraint('Users', 'users_company_id_fk');
    await queryInterface.removeIndex('Users', 'users_company_id_idx');
    await queryInterface.removeColumn('Users', 'companyId');
  }
};
