const { Order, OrderItem, Session, Table, Item, sequelize } = require('./models');

async function testQuery() {
  try {
    // Test 1: Get all orders without restaurant filter
    console.log('\n=== Test 1: All Orders (No Filter) ===');
    const allOrders = await Order.findAll({
      include: [
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'sessionNumber', 'restaurantId']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber']
        }
      ],
      limit: 5
    });
    console.log(`Found ${allOrders.length} orders`);
    allOrders.forEach(o => {
      console.log(`- Order ${o.id}: sessionId=${o.sessionId}, restaurantId=${o.session?.restaurantId}, status=${o.status}`);
    });

    // Test 2: Get all sessions
    console.log('\n=== Test 2: All Sessions ===');
    const sessions = await Session.findAll({
      attributes: ['id', 'sessionNumber', 'restaurantId', 'status'],
      limit: 10
    });
    console.log(`Found ${sessions.length} sessions`);
    sessions.forEach(s => {
      console.log(`- Session ${s.id}: restaurantId=${s.restaurantId}, status=${s.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testQuery();
