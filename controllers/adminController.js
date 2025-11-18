const { Restaurant, User, Table, Session, Order, OrderItem, Item, Category, sequelize } = require('../models');
const { generateQRCode, generateQRCodeImage } = require('../utils/generateNumbers');
const { Op } = require('sequelize');

// ==================== DASHBOARD & REPORTS ====================

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Admin
exports.getDashboard = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Active sessions
    const activeSessions = await Session.count({
      where: { restaurantId, status: 'active' }
    });

    // Today's sales
    const todaySales = await Session.sum('totalAmount', {
      where: {
        restaurantId,
        status: 'closed',
        endTime: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    }) || 0;

    // Active orders
    const activeOrders = await Order.count({
      where: {
        status: {
          [Op.in]: ['new', 'preparing']
        }
      },
      include: [{
        model: Session,
        as: 'session',
        where: { restaurantId, status: 'active' },
        attributes: []
      }]
    });

    // Total tables
    const totalTables = await Table.count({
      where: { restaurantId, isActive: true }
    });

    // Occupied tables
    const occupiedTables = await Table.count({
      where: { restaurantId, status: 'occupied', isActive: true }
    });

    // Average session value (today)
    const avgSessionValue = await Session.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgValue']
      ],
      where: {
        restaurantId,
        status: 'closed',
        endTime: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      raw: true
    });

    // Table occupancy rate
    const occupancyRate = totalTables > 0 ? ((occupiedTables / totalTables) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        activeSessions,
        todaySales: parseFloat(todaySales).toFixed(2),
        activeOrders,
        totalTables,
        occupiedTables,
        occupancyRate: parseFloat(occupancyRate),
        avgSessionValue: parseFloat(avgSessionValue?.avgValue || 0).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب لوحة التحكم',
      error: error.message
    });
  }
};

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Admin
exports.getSalesReport = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const whereClause = {
      restaurantId,
      status: 'closed'
    };

    if (startDate || endDate) {
      whereClause.endTime = {};
      if (startDate) {
        whereClause.endTime[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.endTime[Op.lte] = new Date(endDate);
      }
    } else {
      // Default: last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      whereClause.endTime = { [Op.gte]: thirtyDaysAgo };
    }

    // Group by date format based on groupBy parameter
    let dateFormat;
    if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    } else if (groupBy === 'week') {
      dateFormat = '%Y-%U';
    } else {
      dateFormat = '%Y-%m-%d';
    }

    const salesData = await Session.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('endTime'), dateFormat), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'sessionsCount'],
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgSessionValue']
      ],
      where: whereClause,
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('endTime'), dateFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('endTime'), dateFormat), 'ASC']],
      raw: true
    });

    // Calculate totals
    const totals = salesData.reduce((acc, day) => {
      acc.totalSales += parseFloat(day.totalSales);
      acc.totalSessions += parseInt(day.sessionsCount);
      return acc;
    }, { totalSales: 0, totalSessions: 0 });

    res.status(200).json({
      success: true,
      data: {
        salesData: salesData.map(item => ({
          date: item.date,
          totalSales: parseFloat(item.totalSales).toFixed(2),
          sessionsCount: parseInt(item.sessionsCount),
          avgSessionValue: parseFloat(item.avgSessionValue).toFixed(2)
        })),
        totals: {
          totalSales: totals.totalSales.toFixed(2),
          totalSessions: totals.totalSessions,
          avgSessionValue: (totals.totalSales / totals.totalSessions).toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب تقرير المبيعات',
      error: error.message
    });
  }
};

// @desc    Get popular items report
// @route   GET /api/admin/reports/popular-items
// @access  Admin
exports.getPopularItems = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { startDate, endDate, limit = 10 } = req.query;

    const whereClause = {};

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    } else {
      // Default: last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      whereClause.createdAt = { [Op.gte]: thirtyDaysAgo };
    }

    const popularItems = await OrderItem.findAll({
      attributes: [
        'itemId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalOrdered'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('OrderItem.id')), 'ordersCount']
      ],
      where: whereClause,
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'nameAr', 'price', 'image'],
          include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'nameAr'],
            where: { restaurantId }
          }]
        }
      ],
      group: ['itemId', 'item.id', 'item->category.id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      count: popularItems.length,
      data: popularItems.map(item => ({
        item: item.item,
        totalOrdered: parseInt(item.dataValues.totalOrdered),
        totalRevenue: parseFloat(item.dataValues.totalRevenue).toFixed(2),
        ordersCount: parseInt(item.dataValues.ordersCount)
      }))
    });
  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأصناف الأكثر طلباً',
      error: error.message
    });
  }
};

// ==================== TABLE MANAGEMENT ====================

// @desc    Get all tables
// @route   GET /api/admin/tables
// @access  Admin
exports.getAllTables = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const tables = await Table.findAll({
      where: { restaurantId },
      order: [['tableNumber', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطاولات',
      error: error.message
    });
  }
};

// @desc    Create new table
// @route   POST /api/admin/tables
// @access  Admin
exports.createTable = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { tableNumber, capacity, location } = req.body;

    if (!tableNumber) {
      return res.status(400).json({
        success: false,
        message: 'رقم الطاولة مطلوب'
      });
    }

    // Generate unique QR code identifier
    const qrCode = generateQRCode(restaurantId, tableNumber);

    // Generate QR code image
    const qrCodeImage = await generateQRCodeImage(restaurantId, tableNumber, qrCode);

    const table = await Table.create({
      restaurantId,
      tableNumber,
      qrCode,
      qrCodeImage,
      capacity: capacity || null,
      location: location || null
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطاولة بنجاح',
      data: table
    });
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الطاولة',
      error: error.message
    });
  }
};

// @desc    Update table
// @route   PUT /api/admin/tables/:id
// @access  Admin
exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, location, isActive } = req.body;

    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'الطاولة غير موجودة'
      });
    }

    // Check ownership
    if (table.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذه الطاولة'
      });
    }

    await table.update({
      tableNumber: tableNumber || table.tableNumber,
      capacity: capacity !== undefined ? capacity : table.capacity,
      location: location !== undefined ? location : table.location,
      isActive: isActive !== undefined ? isActive : table.isActive
    });

    res.status(200).json({
      success: true,
      message: 'تم تحديث الطاولة بنجاح',
      data: table
    });
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الطاولة',
      error: error.message
    });
  }
};

// @desc    Delete table (soft delete)
// @route   DELETE /api/admin/tables/:id
// @access  Admin
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'الطاولة غير موجودة'
      });
    }

    // Check ownership
    if (table.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذه الطاولة'
      });
    }

    // Check if table has active session
    const activeSession = await Session.findOne({
      where: { tableId: id, status: 'active' }
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن حذف طاولة لها جلسة نشطة'
      });
    }

    // Soft delete
    await table.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'تم حذف الطاولة بنجاح'
    });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الطاولة',
      error: error.message
    });
  }
};

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const users = await User.findAll({
      where: { restaurantId },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين',
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Admin
exports.createUser = async (req, res) => {
  try {
    const { restaurantId } = req.user;
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل'
      });
    }

    const user = await User.create({
      restaurantId,
      username,
      email,
      password,
      role
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المستخدم بنجاح',
      data: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المستخدم',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Check ownership
    if (user.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا المستخدم'
      });
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      role: role || user.role,
      isActive: isActive !== undefined ? isActive : user.isActive
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      data: userResponse
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المستخدم',
      error: error.message
    });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك حذف حسابك الخاص'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Check ownership
    if (user.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذا المستخدم'
      });
    }

    // Soft delete
    await user.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المستخدم',
      error: error.message
    });
  }
};
