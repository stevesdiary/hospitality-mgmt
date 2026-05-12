'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── Users ──────────────────────────────────────────────────────────────
    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'users_email_unique'
    });
    await queryInterface.addIndex('Users', ['email'], { name: 'users_email_idx' });
    await queryInterface.addIndex('Users', ['type'], { name: 'users_type_idx' });

    // ── Hotels ─────────────────────────────────────────────────────────────
    await queryInterface.addIndex('Hotels', ['city'], { name: 'hotels_city_idx' });
    await queryInterface.addIndex('Hotels', ['state'], { name: 'hotels_state_idx' });
    await queryInterface.addIndex('Hotels', ['hotelType'], { name: 'hotels_hotel_type_idx' });

    // ── Rooms ──────────────────────────────────────────────────────────────
    await queryInterface.addConstraint('Rooms', {
      fields: ['hotelId'],
      type: 'foreign key',
      name: 'rooms_hotel_id_fk',
      references: { table: 'Hotels', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Rooms', ['hotelId'], { name: 'rooms_hotel_id_idx' });
    await queryInterface.addIndex('Rooms', ['availability'], { name: 'rooms_availability_idx' });
    await queryInterface.addIndex('Rooms', ['price'], { name: 'rooms_price_idx' });

    // ── Facilities ─────────────────────────────────────────────────────────
    await queryInterface.addConstraint('Facilities', {
      fields: ['hotelId'],
      type: 'foreign key',
      name: 'facilities_hotel_id_fk',
      references: { table: 'Hotels', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Facilities', ['hotelId'], { name: 'facilities_hotel_id_idx' });

    // ── RatingsAndReviews ──────────────────────────────────────────────────
    await queryInterface.addConstraint('RatingsAndReviews', {
      fields: ['hotelId'],
      type: 'foreign key',
      name: 'ratings_hotel_id_fk',
      references: { table: 'Hotels', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('RatingsAndReviews', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'ratings_user_id_fk',
      references: { table: 'Users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('RatingsAndReviews', ['hotelId'], { name: 'ratings_hotel_id_idx' });
    await queryInterface.addIndex('RatingsAndReviews', ['userId'], { name: 'ratings_user_id_idx' });

    // ── MediaFiles ─────────────────────────────────────────────────────────
    await queryInterface.addConstraint('MediaFiles', {
      fields: ['hotelId'],
      type: 'foreign key',
      name: 'media_hotel_id_fk',
      references: { table: 'Hotels', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('MediaFiles', {
      fields: ['roomId'],
      type: 'foreign key',
      name: 'media_room_id_fk',
      references: { table: 'Rooms', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('MediaFiles', ['hotelId'], { name: 'media_hotel_id_idx' });
    await queryInterface.addIndex('MediaFiles', ['roomId'], { name: 'media_room_id_idx' });

    // ── Reservations ───────────────────────────────────────────────────────
    await queryInterface.addConstraint('Reservations', {
      fields: ['hotelId'],
      type: 'foreign key',
      name: 'reservations_hotel_id_fk',
      references: { table: 'Hotels', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Reservations', {
      fields: ['roomId'],
      type: 'foreign key',
      name: 'reservations_room_id_fk',
      references: { table: 'Rooms', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('Reservations', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'reservations_user_id_fk',
      references: { table: 'Users', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addIndex('Reservations', ['hotelId'], { name: 'reservations_hotel_id_idx' });
    await queryInterface.addIndex('Reservations', ['roomId'], { name: 'reservations_room_id_idx' });
    await queryInterface.addIndex('Reservations', ['userId'], { name: 'reservations_user_id_idx' });
    await queryInterface.addIndex('Reservations', ['status'], { name: 'reservations_status_idx' });
    await queryInterface.addIndex('Reservations', ['dateIn', 'dateOut'], { name: 'reservations_date_range_idx' });
  },

  async down(queryInterface, Sequelize) {
    // Reservations
    await queryInterface.removeConstraint('Reservations', 'reservations_hotel_id_fk');
    await queryInterface.removeConstraint('Reservations', 'reservations_room_id_fk');
    await queryInterface.removeConstraint('Reservations', 'reservations_user_id_fk');
    await queryInterface.removeIndex('Reservations', 'reservations_hotel_id_idx');
    await queryInterface.removeIndex('Reservations', 'reservations_room_id_idx');
    await queryInterface.removeIndex('Reservations', 'reservations_user_id_idx');
    await queryInterface.removeIndex('Reservations', 'reservations_status_idx');
    await queryInterface.removeIndex('Reservations', 'reservations_date_range_idx');

    // MediaFiles
    await queryInterface.removeConstraint('MediaFiles', 'media_hotel_id_fk');
    await queryInterface.removeConstraint('MediaFiles', 'media_room_id_fk');
    await queryInterface.removeIndex('MediaFiles', 'media_hotel_id_idx');
    await queryInterface.removeIndex('MediaFiles', 'media_room_id_idx');

    // RatingsAndReviews
    await queryInterface.removeConstraint('RatingsAndReviews', 'ratings_hotel_id_fk');
    await queryInterface.removeConstraint('RatingsAndReviews', 'ratings_user_id_fk');
    await queryInterface.removeIndex('RatingsAndReviews', 'ratings_hotel_id_idx');
    await queryInterface.removeIndex('RatingsAndReviews', 'ratings_user_id_idx');

    // Facilities
    await queryInterface.removeConstraint('Facilities', 'facilities_hotel_id_fk');
    await queryInterface.removeIndex('Facilities', 'facilities_hotel_id_idx');

    // Rooms
    await queryInterface.removeConstraint('Rooms', 'rooms_hotel_id_fk');
    await queryInterface.removeIndex('Rooms', 'rooms_hotel_id_idx');
    await queryInterface.removeIndex('Rooms', 'rooms_availability_idx');
    await queryInterface.removeIndex('Rooms', 'rooms_price_idx');

    // Hotels
    await queryInterface.removeIndex('Hotels', 'hotels_city_idx');
    await queryInterface.removeIndex('Hotels', 'hotels_state_idx');
    await queryInterface.removeIndex('Hotels', 'hotels_hotel_type_idx');

    // Users
    await queryInterface.removeConstraint('Users', 'users_email_unique');
    await queryInterface.removeIndex('Users', 'users_email_idx');
    await queryInterface.removeIndex('Users', 'users_type_idx');
  }
};
