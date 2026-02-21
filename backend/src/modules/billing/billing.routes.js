const express = require('express');
const router = express.Router();
const billingController = require('./billing.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

router.use(protect);

// Invoice Routes
router.post('/invoices', authorizeRoles('admin', 'receptionist'), billingController.generateInvoice);
router.get('/invoices', billingController.getInvoices); // filtered by role inside controller
router.get('/invoices/:id', billingController.getInvoiceById);

// Payment Routes
router.post('/invoices/:id/payments', authorizeRoles('admin', 'receptionist'), billingController.recordPayment);
router.get('/payments/patient', billingController.getPatientPayments); // for self (patient)
router.get('/payments/patient/:patientId', authorizeRoles('admin', 'receptionist'), billingController.getPatientPayments);

module.exports = router;
