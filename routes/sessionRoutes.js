const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate, authorize } = require('../middleware/auth');

// ==================== PUBLIC ROUTES (للزبائن) ====================

// Start or get active session (when customer scans QR)
router.post('/start/:qrCode', sessionController.startSession);

// Get session details
router.get('/:sessionId', sessionController.getSession);

// ==================== PROTECTED ROUTES (Kitchen & Admin) ====================

// Get all sessions with filters (Kitchen & Admin)
router.get('/', authenticate, authorize('kitchen', 'admin'), sessionController.getAllSessions);

// Get active session for a table
router.get('/table/:tableId', authenticate, authorize('kitchen', 'admin'), sessionController.getActiveSessionByTable);

// Close session (Kitchen & Admin only)
router.post('/:sessionId/close', authenticate, authorize('kitchen', 'admin'), sessionController.closeSession);

module.exports = router;
