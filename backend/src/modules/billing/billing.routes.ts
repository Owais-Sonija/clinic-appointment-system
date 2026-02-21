import express from 'express';
import billingController from './billing.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect); // All routes require auth

// Invoices
router.post('/invoices', roleAuth('admin', 'receptionist'), billingController.generateInvoice);
router.get('/invoices', billingController.getInvoices);
router.get('/invoices/:id', billingController.getInvoiceById);

// Payments 
router.post('/invoices/:id/pay', roleAuth('admin', 'receptionist'), billingController.recordPayment);
router.get('/payments', billingController.getPayments);

export default router;
