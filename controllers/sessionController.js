const { Session, Table, Order, OrderItem, Item, User } = require('../models');
const { generateSessionNumber } = require('../utils/generateNumbers');
const { Op } = require('sequelize');

// @desc    Start new session or get active session (للزبون عند مسح QR)
// @route   POST /api/sessions/start/:qrCode
// @access  Public
exports.startSession = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const { numberOfGuests } = req.body;

    // Find table by QR code
    const table = await Table.findOne({
      where: { qrCode, isActive: true }
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'رمز QR غير صحيح أو الطاولة غير نشطة'
      });
    }

    // Check if there's already an active session for this table
    let session = await Session.findOne({
      where: {
        tableId: table.id,
        status: 'active'
      },
      include: [{
        model: Order,
        as: 'orders',
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Item,
            as: 'item',
            attributes: ['name', 'nameAr', 'image']
          }]
        }]
      }]
    });

    // If active session exists, return it
    if (session) {
      return res.status(200).json({
        success: true,
        message: 'جلسة نشطة موجودة بالفعل',
        data: {
          session,
          table: {
            id: table.id,
            tableNumber: table.tableNumber,
            location: table.location
          }
        }
      });
    }

    // Create new session
    const sessionNumber = generateSessionNumber();

    session = await Session.create({
      restaurantId: table.restaurantId,
      tableId: table.id,
      sessionNumber,
      numberOfGuests: numberOfGuests || null,
      status: 'active'
    });

    // Update table status to occupied
    await table.update({ status: 'occupied' });

    res.status(201).json({
      success: true,
      message: 'تم بدء جلسة جديدة بنجاح',
      data: {
        session,
        table: {
          id: table.id,
          tableNumber: table.tableNumber,
          location: table.location
        }
      }
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في بدء الجلسة',
      error: error.message
    });
  }
};

// @desc    Get session details
// @route   GET /api/sessions/:sessionId
// @access  Public
exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findByPk(sessionId, {
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: Order,
          as: 'orders',
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'nameAr', 'image']
            }]
          }],
          order: [['orderTime', 'DESC']]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الجلسة',
      error: error.message
    });
  }
};

// @desc    Get active session for a table
// @route   GET /api/sessions/table/:tableId
// @access  Kitchen, Admin
exports.getActiveSessionByTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    const session = await Session.findOne({
      where: {
        tableId,
        status: 'active'
      },
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: Order,
          as: 'orders',
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{
              model: Item,
              as: 'item'
            }]
          }]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'لا توجد جلسة نشطة لهذه الطاولة'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الجلسة',
      error: error.message
    });
  }
};

// @desc    Close session (فقط من المطبخ/الإدارة)
// @route   POST /api/sessions/:sessionId/close
// @access  Kitchen, Admin
exports.closeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { notes } = req.body;

    const session = await Session.findByPk(sessionId, {
      include: [
        {
          model: Table,
          as: 'table'
        },
        {
          model: Order,
          as: 'orders',
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{
              model: Item,
              as: 'item',
              attributes: ['name', 'nameAr', 'image']
            }]
          }]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'الجلسة غير موجودة'
      });
    }

    // Check if session belongs to user's restaurant
    if (session.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لإغلاق هذه الجلسة'
      });
    }

    // Check if already closed
    if (session.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'الجلسة مغلقة بالفعل'
      });
    }

    // Calculate total amount from all orders
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

    // Update table status to available
    await session.table.update({ status: 'available' });

    // Reload with updated data
    await session.reload({
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: Order,
          as: 'orders',
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{
              model: Item,
              as: 'item',
              attributes: ['name', 'nameAr', 'image']
            }]
          }]
        },
        {
          model: User,
          as: 'closedByUser',
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'تم إغلاق الجلسة بنجاح',
      data: session
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

// @desc    Get all sessions with filters
// @route   GET /api/sessions
// @access  Admin
exports.getAllSessions = async (req, res) => {
  try {
    const { status, startDate, endDate, tableId, page = 1, limit = 20 } = req.query;
    const { restaurantId } = req.user;

    const whereClause = {
      restaurantId
    };

    if (status) {
      whereClause.status = status;
    }

    if (tableId) {
      whereClause.tableId = tableId;
    }

    if (startDate || endDate) {
      whereClause.startTime = {};
      if (startDate) {
        whereClause.startTime[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.startTime[Op.lte] = new Date(endDate);
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows: sessions } = await Session.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'tableNumber', 'location']
        },
        {
          model: User,
          as: 'closedByUser',
          attributes: ['id', 'username']
        }
      ],
      order: [['startTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: sessions
    });
  } catch (error) {
    console.error('Get all sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الجلسات',
      error: error.message
    });
  }
};
