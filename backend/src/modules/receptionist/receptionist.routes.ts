import express from 'express';
import receptionistController from './receptionist.controller';
import { protect, restrictTo } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('receptionist'));

// Dashboard & Reports
router.get('/dashboard-summary', receptionistController.getDashboardSummary);
router.get('/reports', receptionistController.getReports);

// Patient Management (Registration, List)
router.post('/patients', receptionistController.registerPatient);
router.get('/patients', receptionistController.getPatients);
router.get('/patients/:id', receptionistController.getPatientById);

// Appointment Management
router.post('/appointments', receptionistController.bookAppointment);
router.get('/appointments', receptionistController.getAppointments);
router.put('/appointments/:id/cancel', receptionistController.cancelAppointment);
router.put('/appointments/:id/checkin', receptionistController.checkInPatient); // Creates Queue Item

// Queue Management
router.get('/queue', receptionistController.getQueue);
router.put('/queue/:id/status', receptionistController.updateQueueStatus); // Update waiting, priority

// Billing Management
router.get('/invoices', receptionistController.getInvoices);
router.post('/invoices', receptionistController.generateInvoice);
router.put('/invoices/:id/pay', receptionistController.payInvoice);

export default router;
