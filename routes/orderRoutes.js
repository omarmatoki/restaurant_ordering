const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

// ==================== PUBLIC ROUTES (للزبائن) ====================

// Create new order (customer places order)
router.post('/', orderController.createOrder);

// Get orders for a session
router.get('/session/:sessionId', orderController.getOrdersBySession);

// Get single order details
router.get('/:orderId', orderController.getOrder);

// ==================== PROTECTED ROUTES (Kitchen & Admin) ====================

// Get active orders (Kitchen)
router.get('/active/list', authenticate, authorize('kitchen', 'admin'), orderController.getActiveOrders);

// Get all orders with filters
router.get('/', authenticate, authorize('kitchen', 'admin'), orderController.getAllOrders);

// Update order status
router.patch('/:orderId/status', authenticate, authorize('kitchen', 'admin'), orderController.updateOrderStatus);

module.exports = router;
