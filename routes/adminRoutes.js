const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard & Reports
router.get('/dashboard', adminController.getDashboard);
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/popular-items', adminController.getPopularItems);

// Table Management
router.get('/tables', adminController.getAllTables);
router.post('/tables', adminController.createTable);
router.put('/tables/:id', adminController.updateTable);
router.delete('/tables/:id', adminController.deleteTable);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
