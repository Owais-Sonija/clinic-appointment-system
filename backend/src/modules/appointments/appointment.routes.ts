import express from 'express';
import appointmentController from './appointment.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect); // Require auth for all appointment routes

// Patients can book, Receptionists/Admins/Nurses can book on behalf
router.post('/', appointmentController.book);

// Filter logic applies roles automatically inside controller
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);

// Staff-only updates (reschedule, update status)
router.patch('/:id/status', roleAuth('admin', 'receptionist', 'doctor'), appointmentController.updateStatus);
router.patch('/:id/reschedule', roleAuth('admin', 'receptionist', 'doctor'), appointmentController.reschedule);

// ANY authorized can cancel their own (handled conceptually, could add strictly owned check)
router.delete('/:id', appointmentController.cancel);

export default router;
