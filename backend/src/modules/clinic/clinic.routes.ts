import express from 'express';
import clinicController from './clinic.controller';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

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

export default router;
