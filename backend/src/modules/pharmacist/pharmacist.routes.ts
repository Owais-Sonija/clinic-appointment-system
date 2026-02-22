import express from 'express';
import pharmacistController from './pharmacist.controller';
import { protect, restrictTo } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('pharmacist'));

// Dashboard
router.get('/dashboard-summary', pharmacistController.getDashboardSummary);

// Inventory
router.get('/inventory', pharmacistController.getInventory);
router.post('/inventory', pharmacistController.addMedicine);
router.put('/inventory/:id', pharmacistController.updateMedicine);
router.post('/inventory/:id/batches', pharmacistController.addBatch);

router.get('/alerts', pharmacistController.getLowStockAlerts);

// Prescriptions
router.get('/prescriptions', pharmacistController.getPrescriptions);
router.get('/prescriptions/:id', pharmacistController.getPrescriptionById);
router.put('/prescriptions/:id/dispense', pharmacistController.dispenseMedicine);

// Pharmacy Billing
router.get('/invoices', pharmacistController.getInvoices);
router.post('/invoices', pharmacistController.generateInvoice);
router.put('/invoices/:id/pay', pharmacistController.payInvoice);

// Patient History (Read Only for pharmacy context)
router.get('/patients/:id/prescriptions', pharmacistController.getPatientPrescriptionHistory);

export default router;
