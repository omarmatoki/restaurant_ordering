const { sequelize } = require('./models');

async function updateItemsTable() {
  try {
    console.log('Connecting to database...');

    // Check if 'images' column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'restaurant_ordering_db'
      AND TABLE_NAME = 'Items'
      AND COLUMN_NAME = 'images'
    `);

    if (results.length > 0) {
      console.log('✓ Column "images" already exists');
      process.exit(0);
    }

    console.log('Adding "images" column...');

    // Add images column
    await sequelize.query(`
      ALTER TABLE Items
      ADD COLUMN images JSON DEFAULT NULL
    `);

    console.log('✓ Column "images" added successfully');

    // Check if 'image' column exists
    const [imageResults] = await sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'restaurant_ordering_db'
      AND TABLE_NAME = 'Items'
      AND COLUMN_NAME = 'image'
    `);

    if (imageResults.length > 0) {
      console.log('Migrating data from "image" to "images"...');

      // Migrate existing image data
      await sequelize.query(`
        UPDATE Items
        SET images = JSON_ARRAY(image)
        WHERE image IS NOT NULL AND image != ''
      `);

      console.log('✓ Data migrated successfully');
      console.log('Removing old "image" column...');

      // Remove old column
      await sequelize.query(`
        ALTER TABLE Items
        DROP COLUMN image
      `);

      console.log('✓ Old column removed');
    }

    console.log('\n✓✓✓ Table update completed successfully! ✓✓✓\n');
    process.exit(0);

  } catch (error) {
    console.error('Error updating table:', error);
    process.exit(1);
  }
}

updateItemsTable();
