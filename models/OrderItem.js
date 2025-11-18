const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Price at the time of order (snapshot)'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'quantity * unitPrice'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Special instructions (e.g., no spice, extra sauce)'
    }
  }, {
    tableName: 'OrderItems',
    timestamps: true,
    hooks: {
      beforeSave: (orderItem) => {
        // Auto-calculate subtotal
        orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
      }
    }
  });

  return OrderItem;
};
