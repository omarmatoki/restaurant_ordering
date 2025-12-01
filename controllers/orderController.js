const { Order, OrderItem, Session, Table, Item, sequelize } = require('../models');
const { generateOrderNumber } = require('../utils/generateNumbers');
const { Op } = require('sequelize');

// @desc    Create new order (للزبون)
// @route   POST /api/orders
// @access  Public (requires sessionId)
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sessionId, items, notes } = req.body;

    // Validation
    if (!sessionId || !items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'رقم الجلسة والأصناف مطلوبة'
      });
    }

    // Verify session exists and is active
    const session = await Session.findByPk(sessionId, {
      include: [{
        model: Table,
        as: 'table'
      }]
    });

    if (!session) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }

    if (session.status !== 'active') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'الجلسة مغلقة. لا يمكن إضافة طلبات جديدة'
      });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await Order.create({
      sessionId,
      tableId: session.tableId,
      orderNumber,
      notes: notes || null,
      status: 'new',
      totalAmount: 0
    }, { transaction });

    let totalAmount = 0;

    // Create order items
    for (const orderItem of items) {
      const { itemId, quantity, notes: itemNotes } = orderItem;

      if (!itemId || !quantity || quantity < 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'معرف الصنف والكمية مطلوبة'
        });
      }

      // Get item details
      const item = await Item.findByPk(itemId);

      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `الصنف ${itemId} غير موجود`
        });
      }

      if (!item.isAvailable) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `الصنف "${item.name}" غير متوفر حالياً`
        });
      }

      // Calculate subtotal
      const unitPrice = parseFloat(item.price);
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;

      // Create order item
      await OrderItem.create({
        orderId: order.id,
        itemId: item.id,
        quantity,
        unitPrice,
        subtotal,
        notes: itemNotes || null
      }, { transaction });
    }

    // Update order total
    await order.update({
      totalAmount: totalAmount.toFixed(2)
    }, { transaction });

    await transaction.commit();

    // Reload order with all details
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'sessionNumber', 'restaurantId']
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
            attributes: ['id', 'name', 'nameAr', 'images']
          }]
        }
      ]
    });

    // Emit socket event to all kitchens of this restaurant
    const io = req.app.get('io');
    const restaurantId = fullOrder.session.restaurantId;
    io.emit('new-order', {
      order: fullOrder,
      restaurantId: restaurantId
    });
    console.log(`📡 New order emitted to restaurant ${restaurantId}:`, fullOrder.orderNumber);

    res.status(201).json({
      success: true,
      message: 'تم إرسال الطلب بنجاح',
      data: fullOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الطلب',
      error: error.message
    });
  }
};

// @desc    Get orders for a session
// @route   GET /api/orders/session/:sessionId
// @access  Public
exports.getOrdersBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const orders = await Order.findAll({
      where: { sessionId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'nameAr', 'images', 'price']
          }]
        }
      ],
      order: [['orderTime', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders by session error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات',
      error: error.message
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:orderId
// @access  Public
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'sessionNumber', 'status']
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
            as: 'item'
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلب',
      error: error.message
    });
  }
};

// @desc    Get all orders with filters
// @route   GET /api/orders
// @access  Kitchen, Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, tableId, page = 1, limit = 50 } = req.query;
    const { restaurantId } = req.user;

    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (tableId) {
      whereClause.tableId = tableId;
    }

    if (startDate || endDate) {
      whereClause.orderTime = {};
      if (startDate) {
        whereClause.orderTime[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.orderTime[Op.lte] = new Date(endDate);
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows: orders} = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Session,
          as: 'session',
          required: false,
          attributes: ['id', 'sessionNumber', 'status', 'restaurantId']
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
            attributes: ['id', 'name', 'nameAr', 'images']
          }]
        }
      ],
      order: [['orderTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات',
      error: error.message
    });
  }
};

// @desc    Get active orders only
// @route   GET /api/orders/active
// @access  Kitchen
exports.getActiveOrders = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const orders = await Order.findAll({
      where: {
        status: {
          [Op.in]: ['new', 'preparing']
        }
      },
      include: [
        {
          model: Session,
          as: 'session',
          where: { restaurantId, status: 'active' },
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
            attributes: ['id', 'name', 'nameAr', 'images', 'preparationTime']
          }]
        }
      ],
      order: [['orderTime', 'ASC']] // FIFO - أقدم طلب أولاً
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get active orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات النشطة',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:orderId/status
// @access  Kitchen, Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'preparing', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة الطلب غير صحيحة'
      });
    }

    const order = await Order.findByPk(orderId, {
      include: [{
        model: Session,
        as: 'session'
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // Check if order belongs to user's restaurant
    if (order.session.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا الطلب'
      });
    }

    // Update status
    await order.update({ status });

    // Reload with full details
    await order.reload({
      include: [
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'sessionNumber', 'restaurantId']
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
            attributes: ['id', 'name', 'nameAr']
          }]
        }
      ]
    });

    // Emit socket event for status update
    const io = req.app.get('io');
    const restaurantId = order.session.restaurantId;
    io.emit('order-status-updated', {
      order: order,
      restaurantId: restaurantId
    });
    console.log(`📡 Order status update emitted for restaurant ${restaurantId}:`, order.orderNumber, '->', status);

    res.status(200).json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
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
