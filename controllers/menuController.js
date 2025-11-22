const { Category, Item, Restaurant } = require('../models');
const { Op } = require('sequelize');

// ==================== PUBLIC ENDPOINTS (للزبائن) ====================

// @desc    Get all active categories
// @route   GET /api/menu/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    const whereClause = {
      isActive: true
    };

    if (restaurantId) {
      whereClause.restaurantId = restaurantId;
    }

    const categories = await Category.findAll({
      where: whereClause,
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأقسام',
      error: error.message
    });
  }
};

// @desc    Get items by category
// @route   GET /api/menu/categories/:id/items
// @access  Public
exports.getItemsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const items = await Item.findAll({
      where: {
        categoryId: id,
        isAvailable: true
      },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'nameAr']
      }]
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Get items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأصناف',
      error: error.message
    });
  }
};

// @desc    Get all available items
// @route   GET /api/menu/items
// @access  Public
exports.getAllItems = async (req, res) => {
  try {
    const { restaurantId, search } = req.query;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { nameAr: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const items = await Item.findAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'nameAr'],
        where: restaurantId ? { restaurantId } : undefined
      }],
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأصناف',
      error: error.message
    });
  }
};

// @desc    Get single item
// @route   GET /api/menu/items/:id
// @access  Public
exports.getItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'nameAr']
      }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'الصنف غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الصنف',
      error: error.message
    });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc    Create category
// @route   POST /api/menu/categories
// @access  Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, nameAr, description, displayOrder } = req.body;
    const { restaurantId } = req.user;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'اسم القسم مطلوب'
      });
    }

    const category = await Category.create({
      name,
      nameAr,
      description,
      displayOrder: displayOrder || 0,
      restaurantId
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء القسم بنجاح',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء القسم',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/menu/categories/:id
// @access  Admin
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameAr, description, displayOrder, isActive } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    // Check ownership
    if (category.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا القسم'
      });
    }

    await category.update({
      name: name || category.name,
      nameAr: nameAr !== undefined ? nameAr : category.nameAr,
      description: description !== undefined ? description : category.description,
      displayOrder: displayOrder !== undefined ? displayOrder : category.displayOrder,
      isActive: isActive !== undefined ? isActive : category.isActive
    });

    res.status(200).json({
      success: true,
      message: 'تم تحديث القسم بنجاح',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث القسم',
      error: error.message
    });
  }
};

// @desc    Delete category (soft delete)
// @route   DELETE /api/menu/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    // Check ownership
    if (category.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذا القسم'
      });
    }

    // Soft delete
    await category.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'تم حذف القسم بنجاح'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف القسم',
      error: error.message
    });
  }
};

// @desc    Create item
// @route   POST /api/menu/items
// @access  Admin
exports.createItem = async (req, res) => {
  try {
    const { categoryId, name, nameAr, description, price, preparationTime, displayOrder } = req.body;

    if (!categoryId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'القسم والاسم والسعر مطلوبة'
      });
    }

    // Verify category exists and belongs to user's restaurant
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    if (category.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للإضافة لهذا القسم'
      });
    }

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/items/${file.filename}`);
    }

    const item = await Item.create({
      categoryId,
      name,
      nameAr,
      description,
      price,
      images,
      preparationTime,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الصنف بنجاح',
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الصنف',
      error: error.message
    });
  }
};

// @desc    Update item
// @route   PUT /api/menu/items/:id
// @access  Admin
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Item.findByPk(id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'الصنف غير موجود'
      });
    }

    // Check ownership
    if (item.category.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا الصنف'
      });
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/items/${file.filename}`);
      // Append new images to existing ones or replace based on request
      if (updateData.replaceImages === 'true') {
        updateData.images = newImages;
      } else {
        // Append to existing images
        const existingImages = item.images || [];
        updateData.images = [...existingImages, ...newImages];
      }
    }

    await item.update(updateData);

    res.status(200).json({
      success: true,
      message: 'تم تحديث الصنف بنجاح',
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الصنف',
      error: error.message
    });
  }
};

// @desc    Delete item (hard delete)
// @route   DELETE /api/menu/items/:id
// @access  Admin
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete item with ID: ${id}`);
    console.log('User:', req.user);

    const item = await Item.findByPk(id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!item) {
      console.log('Item not found');
      return res.status(404).json({
        success: false,
        message: 'الصنف غير موجود'
      });
    }

    console.log('Item found:', item.toJSON());

    // Check ownership
    if (item.category.restaurantId !== req.user.restaurantId) {
      console.log('Ownership check failed');
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذا الصنف'
      });
    }

    // Hard delete - permanently remove from database
    await item.destroy();

    console.log(`Item ${id} deleted successfully`);

    res.status(200).json({
      success: true,
      message: 'تم حذف الصنف بنجاح'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الصنف',
      error: error.message
    });
  }
};

// @desc    Toggle item availability
// @route   PATCH /api/menu/items/:id/availability
// @access  Admin, Kitchen
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const item = await Item.findByPk(id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'الصنف غير موجود'
      });
    }

    // Check ownership
    if (item.category.restaurantId !== req.user.restaurantId) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا الصنف'
      });
    }

    await item.update({
      isAvailable: isAvailable !== undefined ? isAvailable : !item.isAvailable
    });

    res.status(200).json({
      success: true,
      message: `تم ${item.isAvailable ? 'تفعيل' : 'تعطيل'} الصنف بنجاح`,
      data: {
        id: item.id,
        name: item.name,
        isAvailable: item.isAvailable
      }
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تغيير حالة الصنف',
      error: error.message
    });
  }
};
