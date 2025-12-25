const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sessions',
        key: 'id'
      }
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tables',
        key: 'id'
      }
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique order identifier (e.g., #O-2024-0001)'
    },
    orderTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('new', 'preparing', 'delivered'),
      defaultValue: 'new'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'General notes for the order'
    },
    preparationTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total preparation time in seconds for this order'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Time when order preparation started'
    }
  }, {
    tableName: 'Orders',
    timestamps: true,
    indexes: [
      {
        fields: ['sessionId', 'status']
      },
      {
        unique: true,
        fields: ['orderNumber']
      }
    ]
  });

  return Order;
};
