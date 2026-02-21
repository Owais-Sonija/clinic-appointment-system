const express = require('express');
const router = express.Router();
const clinicController = require('./clinic.controller');
const { protect } = require('../../middleware/authMiddleware');

// Settings
router.get('/settings', clinicController.getSettings);
router.put('/settings', protect, clinicController.updateSettings);

// Services
router.get('/services', clinicController.getServices);
router.get('/services/:id', clinicController.getServiceById);
router.post('/services', protect, clinicController.createService);
router.put('/services/:id', protect, clinicController.updateService);
router.delete('/services/:id', protect, clinicController.deleteService);

// Contact
router.post('/contact', clinicController.submitContact);
router.get('/contact', protect, clinicController.getContacts);
router.patch('/contact/:id/read', protect, clinicController.markContactRead);

module.exports = router;
