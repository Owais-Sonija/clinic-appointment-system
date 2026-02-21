const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const { protect } = require('../../middleware/authMiddleware');

// Role middleware will be added later for specific roles
router.post('/', protect, doctorController.createDoctor);
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);
router.put('/:id', protect, doctorController.updateDoctor);
router.delete('/:id', protect, doctorController.deleteDoctor);

module.exports = router;
