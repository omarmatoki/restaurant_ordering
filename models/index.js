const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool
  }
);

// Import models
const Restaurant = require('./Restaurant')(sequelize);
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Item = require('./Item')(sequelize);
const Table = require('./Table')(sequelize);
const Session = require('./Session')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);

// ============================================
// Define Relationships (Associations)
// ============================================

// Restaurant Relationships (1:N)
Restaurant.hasMany(User, {
  foreignKey: 'restaurantId',
  as: 'users',
  onDelete: 'CASCADE'
});
User.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'restaurant'
});

Restaurant.hasMany(Category, {
  foreignKey: 'restaurantId',
  as: 'categories',
  onDelete: 'CASCADE'
});
Category.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'restaurant'
});

Restaurant.hasMany(Table, {
  foreignKey: 'restaurantId',
  as: 'tables',
  onDelete: 'CASCADE'
});
Table.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'restaurant'
});

Restaurant.hasMany(Session, {
  foreignKey: 'restaurantId',
  as: 'sessions',
  onDelete: 'CASCADE'
});
Session.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'restaurant'
});

// Category -> Items (1:N)
Category.hasMany(Item, {
  foreignKey: 'categoryId',
  as: 'items',
  onDelete: 'CASCADE'
});
Item.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Table -> Sessions (1:N)
Table.hasMany(Session, {
  foreignKey: 'tableId',
  as: 'sessions'
});
Session.belongsTo(Table, {
  foreignKey: 'tableId',
  as: 'table'
});

// Table -> Orders (1:N)
Table.hasMany(Order, {
  foreignKey: 'tableId',
  as: 'orders'
});
Order.belongsTo(Table, {
  foreignKey: 'tableId',
  as: 'table'
});

// Session -> Orders (1:N)
Session.hasMany(Order, {
  foreignKey: 'sessionId',
  as: 'orders',
  onDelete: 'CASCADE'
});
Order.belongsTo(Session, {
  foreignKey: 'sessionId',
  as: 'session'
});

// User -> Sessions (closedBy relationship) (1:N)
User.hasMany(Session, {
  foreignKey: 'closedBy',
  as: 'closedSessions'
});
Session.belongsTo(User, {
  foreignKey: 'closedBy',
  as: 'closedByUser'
});

// Order -> OrderItems (1:N)
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Item -> OrderItems (1:N)
Item.hasMany(OrderItem, {
  foreignKey: 'itemId',
  as: 'orderItems'
});
OrderItem.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item'
});

// Orders <-> Items (Many-to-Many through OrderItems)
Order.belongsToMany(Item, {
  through: OrderItem,
  foreignKey: 'orderId',
  otherKey: 'itemId',
  as: 'items'
});
Item.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: 'itemId',
  otherKey: 'orderId',
  as: 'orders'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  Restaurant,
  User,
  Category,
  Item,
  Table,
  Session,
  Order,
  OrderItem
};
