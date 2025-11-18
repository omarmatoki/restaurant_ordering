const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Table = sequelize.define('Table', {
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
    tableNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    qrCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Unique QR code identifier for the table'
    },
    qrCodeImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Path to the QR code image file'
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of seats'
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied'),
      defaultValue: 'available'
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Floor or area location'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'Tables',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['qrCode']
      }
    ]
  });

  return Table;
};
