const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');
const { authenticate, authorize } = require('../middleware/auth');

// All kitchen routes require authentication (Kitchen or Admin)
router.use(authenticate);
router.use(authorize('kitchen', 'admin'));

// Dashboard
router.get('/dashboard', kitchenController.getKitchenDashboard);

// Orders
router.get('/orders/pending', kitchenController.getPendingOrders);
router.get('/orders/preparing', kitchenController.getPreparingOrders);
router.patch('/orders/:id/status', kitchenController.updateOrderStatus);

// Sessions
router.get('/sessions/active', kitchenController.getActiveSessions);
router.post('/sessions/:id/close', kitchenController.closeSession);

module.exports = router;
