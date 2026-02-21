const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getMyAppointments,
    updateAppointmentStatus,
    deleteAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, authorizeRoles('patient', 'admin'), createAppointment)
    .get(protect, authorizeRoles('admin'), getAppointments);

router.route('/my')
    .get(protect, authorizeRoles('patient'), getMyAppointments);

router.route('/:id/status')
    .put(protect, authorizeRoles('admin', 'doctor'), updateAppointmentStatus);

router.route('/:id')
    .delete(protect, deleteAppointment);

module.exports = router;
