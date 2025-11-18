const { Order, OrderItem, Item, Session, Table, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get pending orders (new orders)
// @route   GET /api/kitchen/orders/pending
// @access  Kitchen
exports.getPendingOrders = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const orders = await Order.findAll({
      where: {
        status: 'new'
      },
      include: [
        {
          model: Session,
          as: 'session',
          where: { restaurantId, status: 'active' },
          attributes: ['id', 'sessionNumber', 'numberOfGuests']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'nameAr', 'image', 'preparationTime']
          }]
        }
      ],
      order: [['orderTime', 'ASC']] // FIFO
    });

    // Calculate waiting time for each order
    const ordersWithWaitTime = orders.map(order => {
      const orderData = order.toJSON();
      const waitingMinutes = Math.floor((Date.now() - new Date(order.orderTime)) / 60000);
      orderData.waitingTime = waitingMinutes;
      return orderData;
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: ordersWithWaitTime
    });
  } catch (error) {
    console.error('Get pending orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات المعلقة',
      error: error.message
    });
  }
};

// @desc    Get preparing orders
// @route   GET /api/kitchen/orders/preparing
// @access  Kitchen
exports.getPreparingOrders = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const orders = await Order.findAll({
      where: {
        status: 'preparing'
      },
      include: [
        {
          model: Session,
          as: 'session',
          where: { restaurantId, status: 'active' },
          attributes: ['id', 'sessionNumber', 'numberOfGuests']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'nameAr', 'image', 'preparationTime']
          }]
        }
      ],
      order: [['orderTime', 'ASC']]
    });

    // Calculate preparation time for each order
    const ordersWithPrepTime = orders.map(order => {
      const orderData = order.toJSON();
      const prepMinutes = Math.floor((Date.now() - new Date(order.updatedAt)) / 60000);
      orderData.preparationTime = prepMinutes;
      return orderData;
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: ordersWithPrepTime
    });
  } catch (error) {
    console.error('Get preparing orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات قيد التحضير',
      error: error.message
    });
  }
};

// @desc    Get active sessions with order counts
// @route   GET /api/kitchen/sessions/active
// @access  Kitchen
exports.getActiveSessions = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const sessions = await Session.findAll({
      where: {
        restaurantId,
        status: 'active'
      },
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location', 'capacity']
        },
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'orderNumber', 'status', 'totalAmount', 'orderTime']
        }
      ],
      order: [['startTime', 'DESC']]
    });

    // Add aggregated data
    const sessionsWithStats = sessions.map(session => {
      const sessionData = session.toJSON();

      // Count orders by status
      sessionData.orderStats = {
        total: sessionData.orders.length,
        new: sessionData.orders.filter(o => o.status === 'new').length,
        preparing: sessionData.orders.filter(o => o.status === 'preparing').length,
        delivered: sessionData.orders.filter(o => o.status === 'delivered').length
      };

      // Calculate session duration
      const durationMinutes = Math.floor((Date.now() - new Date(session.startTime)) / 60000);
      sessionData.durationMinutes = durationMinutes;

      // Calculate total spent so far
      sessionData.currentTotal = sessionData.orders.reduce((sum, order) => {
        return sum + parseFloat(order.totalAmount);
      }, 0).toFixed(2);

      return sessionData;
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessionsWithStats
    });
  } catch (error) {
    console.error('Get active sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الجلسات النشطة',
      error: error.message
    });
  }
};

// @desc    Update order status (Kitchen wrapper)
// @route   PATCH /api/kitchen/orders/:id/status
// @access  Kitchen
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'preparing', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة الطلب غير صحيحة'
      });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Session,
          as: 'session'
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // Check ownership
    if (order.session.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا الطلب'
      });
    }

    // Update status
    await order.update({ status });

    // Reload with items
    await order.reload({
      include: [
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'sessionNumber']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'nameAr', 'image']
          }]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: `تم تحديث حالة الطلب إلى: ${status === 'preparing' ? 'قيد التحضير' : status === 'delivered' ? 'تم التوصيل' : 'جديد'}`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة الطلب',
      error: error.message
    });
  }
};

// @desc    Close session (Kitchen wrapper)
// @route   POST /api/kitchen/sessions/:id/close
// @access  Kitchen
exports.closeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const session = await Session.findByPk(id, {
      include: [
        {
          model: Table,
          as: 'table'
        },
        {
          model: Order,
          as: 'orders'
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }

    // Check ownership
    if (session.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لإغلاق هذه الجلسة'
      });
    }

    if (session.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'الجلسة مغلقة بالفعل'
      });
    }

    // Calculate total
    const totalAmount = session.orders.reduce((sum, order) => {
      return sum + parseFloat(order.totalAmount);
    }, 0);

    // Close session
    await session.update({
      status: 'closed',
      endTime: new Date(),
      totalAmount: totalAmount.toFixed(2),
      closedBy: req.user.userId,
      notes: notes || session.notes
    });

    // Update table status
    await session.table.update({ status: 'available' });

    res.status(200).json({
      success: true,
      message: 'تم إغلاق الجلسة بنجاح',
      data: {
        sessionNumber: session.sessionNumber,
        tableNumber: session.table.tableNumber,
        totalAmount: totalAmount.toFixed(2),
        duration: Math.floor((new Date(session.endTime) - new Date(session.startTime)) / 60000)
      }
    });
  } catch (error) {
    console.error('Close session error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إغلاق الجلسة',
      error: error.message
    });
  }
};

// @desc    Get kitchen dashboard stats
// @route   GET /api/kitchen/dashboard
// @access  Kitchen
exports.getKitchenDashboard = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Active sessions count
    const activeSessions = await Session.count({
      where: {
        restaurantId,
        status: 'active'
      }
    });

    // Pending orders count
    const pendingOrders = await Order.count({
      where: {
        status: 'new'
      },
      include: [{
        model: Session,
        as: 'session',
        where: { restaurantId, status: 'active' },
        attributes: []
      }]
    });

    // Preparing orders count
    const preparingOrders = await Order.count({
      where: {
        status: 'preparing'
      },
      include: [{
        model: Session,
        as: 'session',
        where: { restaurantId, status: 'active' },
        attributes: []
      }]
    });

    // Today's completed orders
    const completedToday = await Order.count({
      where: {
        status: 'delivered',
        orderTime: {
          [Op.gte]: today
        }
      },
      include: [{
        model: Session,
        as: 'session',
        where: { restaurantId },
        attributes: []
      }]
    });

    res.status(200).json({
      success: true,
      data: {
        activeSessions,
        pendingOrders,
        preparingOrders,
        completedToday
      }
    });
  } catch (error) {
    console.error('Get kitchen dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب لوحة التحكم',
      error: error.message
    });
  }
};
