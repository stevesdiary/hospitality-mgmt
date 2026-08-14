'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const cols = await queryInterface.describeTable('RatingsAndReviews');
    if (!cols.like) {
      await queryInterface.addColumn('RatingsAndReviews', 'like', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
    if (!cols.overallRating) {
      await queryInterface.addColumn('RatingsAndReviews', 'overallRating', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('RatingsAndReviews', 'overallRating');
    await queryInterface.removeColumn('RatingsAndReviews', 'like');
  },
};
