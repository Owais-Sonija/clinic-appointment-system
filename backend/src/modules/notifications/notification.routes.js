const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.get('/', notificationController.getUserNotifications);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
