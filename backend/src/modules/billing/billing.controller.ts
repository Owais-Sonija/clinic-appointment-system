import { Request, Response } from 'express';
import billingService from './billing.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class BillingController {
    generateInvoice = asyncHandler(async (req: Request, res: Response) => {
        const { appointmentId } = req.body;
        const invoice = await billingService.generateInvoiceFromAppointment(appointmentId);
        res.status(201).json(new ApiResponse(201, invoice, "Invoice generated successfully"));
    });

    getInvoices = asyncHandler(async (req: Request | any, res: Response) => {
        const filters: any = {};
        if (req.user && req.user.role === 'patient') {
            filters.patientId = req.user._id;
        }
        const invoices = await billingService.getInvoices(filters);
        res.status(200).json(new ApiResponse(200, invoices, "Invoices retrieved"));
    });

    getInvoiceById = asyncHandler(async (req: Request, res: Response) => {
        const invoice = await billingService.getInvoiceById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, invoice, "Invoice details retrieved"));
    });

    recordPayment = asyncHandler(async (req: Request, res: Response) => {
        const result = await billingService.recordPayment((req.params.id as string), req.body);
        res.status(201).json(new ApiResponse(201, result, "Payment recorded successfully"));
    });

    getPayments = asyncHandler(async (req: Request | any, res: Response) => {
        const filters: any = {};
        if (req.user && req.user.role === 'patient') {
            filters.patientId = req.user._id;
        }
        const payments = await billingService.getPayments(filters);
        res.status(200).json(new ApiResponse(200, payments, "Payments retrieved"));
    });
}

export default new BillingController();
