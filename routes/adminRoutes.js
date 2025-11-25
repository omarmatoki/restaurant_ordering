const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Table Management - GET /tables is accessible by kitchen staff
router.get('/tables', authorize('admin', 'kitchen'), adminController.getAllTables);

// All other routes require admin role
router.use(authorize('admin'));

// Dashboard & Reports
router.get('/dashboard', adminController.getDashboard);
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/popular-items', adminController.getPopularItems);

// Table Management - admin only
router.post('/tables', adminController.createTable);
router.put('/tables/:id', adminController.updateTable);
router.delete('/tables/:id', adminController.deleteTable);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
