const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controller');
const { protect } = require('../../middleware/authMiddleware');

// Role middleware will be added for fine-grained permissions
router.post('/', protect, appointmentController.bookAppointment);
router.get('/my', protect, appointmentController.getMyPatientAppointments);
router.get('/doctor/:doctorId', protect, appointmentController.getDoctorAppointments);
router.get('/', protect, appointmentController.getAllAppointments); // Admin/Receptionist
router.patch('/:id/status', protect, appointmentController.updateAppointmentStatus);

module.exports = router;
