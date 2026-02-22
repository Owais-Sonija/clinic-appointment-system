import express from 'express';
import doctorDashboardController from './doctor.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('doctor'));

router.get('/dashboard-summary', doctorDashboardController.getSummary);
router.get('/appointments', doctorDashboardController.getAppointments);
router.get('/patients/:patientId/history', doctorDashboardController.getPatientHistory);
router.get('/schedule', doctorDashboardController.getSchedule);
router.put('/schedule', doctorDashboardController.updateSchedule);

export default router;
