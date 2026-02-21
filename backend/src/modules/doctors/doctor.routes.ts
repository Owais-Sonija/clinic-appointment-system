import express from 'express';
import doctorController from './doctor.controller';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

// Role middleware will be added later for specific roles
router.post('/', protect, doctorController.createDoctor);
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);
router.put('/:id', protect, doctorController.updateDoctor);
router.delete('/:id', protect, doctorController.deleteDoctor);

export default router;
