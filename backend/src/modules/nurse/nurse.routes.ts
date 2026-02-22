import express from 'express';
import nurseController from './nurse.controller';
import { protect, restrictTo } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('nurse'));

router.get('/dashboard-summary', nurseController.getDashboardSummary);
router.get('/appointments', nurseController.getAppointments);
router.put('/appointments/:id/status', nurseController.updateAppointmentStatus);

router.post('/vitals', nurseController.recordVitals);
router.get('/vitals/:appointmentId', nurseController.getVitals);

router.post('/notes', nurseController.addNursingNote);
router.get('/notes/:appointmentId', nurseController.getNursingNotes);

router.get('/patients/:patientId/history', nurseController.getPatientHistory);

export default router;
