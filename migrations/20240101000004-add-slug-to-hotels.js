'use strict';

/**
 * Adds a URL-safe `slug` to Hotels so each hotel has its own public
 * landing/booking page (e.g. /h/abc-hotels-and-suites). Backfills slugs
 * for any existing rows from their name, guaranteeing uniqueness.
 *
 * @type {import('sequelize-cli').Migration}
 */

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'hotel';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Hotels', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Backfill slugs for existing hotels, ensuring uniqueness.
    const [hotels] = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Hotels" WHERE "deletedAt" IS NULL'
    );

    const used = new Set();
    for (const hotel of hotels) {
      let base = slugify(hotel.name);
      let candidate = base;
      let n = 2;
      while (used.has(candidate)) {
        candidate = `${base}-${n++}`;
      }
      used.add(candidate);
      await queryInterface.sequelize.query(
        'UPDATE "Hotels" SET "slug" = :slug WHERE "id" = :id',
        { replacements: { slug: candidate, id: hotel.id } }
      );
    }

    await queryInterface.addIndex('Hotels', ['slug'], {
      unique: true,
      name: 'hotels_slug_unique',
      where: { deletedAt: null },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Hotels', 'hotels_slug_unique');
    await queryInterface.removeColumn('Hotels', 'slug');
  },
};
