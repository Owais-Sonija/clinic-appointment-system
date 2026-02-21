const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getServices)
    .post(protect, authorizeRoles('admin'), createService);

router.route('/:id')
    .get(getServiceById)
    .put(protect, authorizeRoles('admin'), updateService)
    .delete(protect, authorizeRoles('admin'), deleteService);

module.exports = router;
