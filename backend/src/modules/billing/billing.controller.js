const billingService = require('./billing.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class BillingController {
    generateInvoice = asyncHandler(async (req, res) => {
        const { appointmentId, discount, tax } = req.body;
        const invoice = await billingService.generateInvoiceFromAppointment(appointmentId, discount, tax);
        res.status(201).json(new ApiResponse(201, invoice, "Invoice generated successfully"));
    });

    getInvoices = asyncHandler(async (req, res) => {
        // Patients can only see their own invoices
        let filters = {};
        if (req.user.role === 'patient') {
            filters.patientId = req.user._id;
        }

        const invoices = await billingService.getInvoices(filters);
        res.status(200).json(new ApiResponse(200, invoices, "Invoices retrieved"));
    });

    getInvoiceById = asyncHandler(async (req, res) => {
        const invoice = await billingService.getInvoiceById(req.params.id);

        // Basic authorization check
        if (req.user.role === 'patient' && invoice.patientId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json(new ApiResponse(403, null, "Not authorized to view this invoice"));
        }

        res.status(200).json(new ApiResponse(200, invoice, "Invoice details retrieved"));
    });

    recordPayment = asyncHandler(async (req, res) => {
        // e.g. Receptionist recording a cash payment
        const result = await billingService.recordPayment(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, result, "Payment recorded successfully"));
    });

    getPatientPayments = asyncHandler(async (req, res) => {
        // A specific patient checks their payout history
        const patientId = req.user.role === 'patient' ? req.user._id : req.params.patientId;
        const payments = await billingService.getPaymentsByPatient(patientId);
        res.status(200).json(new ApiResponse(200, payments, "Payment history retrieved"));
    });
}

module.exports = new BillingController();
