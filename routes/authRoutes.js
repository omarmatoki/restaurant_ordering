const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Initial setup route (only works if no admin exists)
router.post('/register/initial', authController.initialRegister);

// Protected routes (require authentication)
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);
router.put('/change-password', authenticate, authController.changePassword);

// Admin only routes (for creating additional users)
router.post('/register', authenticate, authorize('admin'), authController.register);

module.exports = router;
