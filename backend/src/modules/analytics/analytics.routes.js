const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/dashboard', analyticsController.getDashboardMetrics);

module.exports = router;
