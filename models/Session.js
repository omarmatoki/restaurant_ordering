const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Restaurants',
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
    sessionNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique session identifier (e.g., #S-2024-0001)'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'closed'),
      defaultValue: 'active'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    numberOfGuests: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    closedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      comment: 'User ID who closed the session'
    }
  }, {
    tableName: 'Sessions',
    timestamps: true,
    indexes: [
      {
        fields: ['tableId', 'status']
      },
      {
        unique: true,
        fields: ['sessionNumber']
      }
    ]
  });

  return Session;
};
