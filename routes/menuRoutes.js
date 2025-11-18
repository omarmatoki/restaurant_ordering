const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');

// ==================== PUBLIC ROUTES (للزبائن) ====================

// Categories
router.get('/categories', menuController.getAllCategories);
router.get('/categories/:id/items', menuController.getItemsByCategory);

// Items
router.get('/items', menuController.getAllItems);
router.get('/items/:id', menuController.getItem);

// ==================== ADMIN ROUTES ====================

// Categories Management
router.post('/categories', authenticate, authorize('admin'), menuController.createCategory);
router.put('/categories/:id', authenticate, authorize('admin'), menuController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), menuController.deleteCategory);

// Items Management
router.post('/items', authenticate, authorize('admin'), menuController.createItem);
router.put('/items/:id', authenticate, authorize('admin'), menuController.updateItem);
router.delete('/items/:id', authenticate, authorize('admin'), menuController.deleteItem);

// Toggle Availability (Admin & Kitchen)
router.patch('/items/:id/availability', authenticate, authorize('admin', 'kitchen'), menuController.toggleAvailability);

module.exports = router;
