import { Router } from 'express';
import adminController from './admin.controller';
import { protect, restrictTo } from '../../middleware/authMiddleware';

const router = Router();

// Apply strict RBAC to all admin routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard-summary', adminController.getDashboardSummary);

// Doctor Management
router.get('/doctors', adminController.getDoctors);
router.post('/doctors', adminController.createDoctor);
router.put('/doctors/:id', adminController.updateDoctor);
router.patch('/doctors/:id/status', adminController.updateDoctorStatus);

// Patient Management
router.get('/patients', adminController.getPatients);
router.get('/patients/:id', adminController.getPatientById);
router.patch('/patients/:id/status', adminController.updatePatientStatus);

// Medical Records Oversight
router.get('/medical-records', adminController.getMedicalRecords);
router.get('/medical-records/:id', adminController.getMedicalRecordById);

// Appointment Management
router.get('/appointments', adminController.getAppointments);
router.put('/appointments/:id/status', adminController.updateAppointmentStatus);
router.get('/schedules', adminController.getSchedules);

// System Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

// Notifications
router.post('/notifications/broadcast', adminController.sendBroadcastNotification);

// Billing & Revenue
router.get('/invoices', adminController.getInvoices);
router.get('/revenue-summary', adminController.getRevenueSummary);

export default router;
