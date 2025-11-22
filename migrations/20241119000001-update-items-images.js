'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new images column (JSON type)
    await queryInterface.addColumn('Items', 'images', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });

    // Migrate existing image data to images array
    await queryInterface.sequelize.query(`
      UPDATE Items
      SET images = JSON_ARRAY(image)
      WHERE image IS NOT NULL AND image != ''
    `);

    // Remove old image column
    await queryInterface.removeColumn('Items', 'image');
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the old image column
    await queryInterface.addColumn('Items', 'image', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    // Migrate first image from array back to single image
    await queryInterface.sequelize.query(`
      UPDATE Items
      SET image = JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]'))
      WHERE images IS NOT NULL AND JSON_LENGTH(images) > 0
    `);

    // Remove images column
    await queryInterface.removeColumn('Items', 'images');
  }
};
