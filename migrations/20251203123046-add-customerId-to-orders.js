'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'customerId', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Unique identifier for the customer who placed the order'
    });

    // Add index for faster queries
    await queryInterface.addIndex('Orders', ['customerId'], {
      name: 'orders_customer_id_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Orders', 'orders_customer_id_index');
    await queryInterface.removeColumn('Orders', 'customerId');
  }
};
