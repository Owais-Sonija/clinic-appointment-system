import express from 'express';
import patientController from './patient.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles } from '../../middleware/roleMiddleware';

const router = express.Router();

// Enforce authentication and patient role for all routes in this module
router.use(protect);
router.use(authorizeRoles('patient'));

router.get('/dashboard-summary', patientController.getDashboardSummary);
router.get('/medical-records', patientController.getMedicalRecords);
router.get('/prescriptions', patientController.getPrescriptions);

export default router;
