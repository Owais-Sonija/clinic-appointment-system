const express = require('express');
const router = express.Router();
const staffController = require('./staff.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

// Only Admin can manage staff
router.use(protect, authorizeRoles('admin'));

router.post('/', staffController.createStaff);
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.post('/:id/attendance', staffController.logAttendance);
router.patch('/:id/status', staffController.updateStatus);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
