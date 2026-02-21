const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getDoctors)
    .post(protect, authorizeRoles('admin'), createDoctor);

router.route('/:id')
    .get(getDoctorById)
    .put(protect, authorizeRoles('admin'), updateDoctor)
    .delete(protect, authorizeRoles('admin'), deleteDoctor);

module.exports = router;
