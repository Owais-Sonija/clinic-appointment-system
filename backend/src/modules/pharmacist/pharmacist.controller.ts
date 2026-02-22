import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import pharmacistService from './pharmacist.service';
import ApiResponse from '../../utils/ApiResponse';

class PharmacistController {
    getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
        const summary = await pharmacistService.getDashboardSummary();
        res.status(200).json(new ApiResponse(200, summary, "Pharmacist dashboard summary retrieved"));
    });

    // --- Inventory Management ---
    getInventory = asyncHandler(async (req: Request, res: Response) => {
        const inventory = await pharmacistService.getInventory();
        res.status(200).json(new ApiResponse(200, inventory, "Inventory retrieved"));
    });

    addMedicine = asyncHandler(async (req: Request | any, res: Response) => {
        const medicine = await pharmacistService.addMedicine(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, medicine, "Medicine added to inventory"));
    });

    updateMedicine = asyncHandler(async (req: Request | any, res: Response) => {
        const medicine = await pharmacistService.updateMedicine(req.params.id, req.body, req.user._id);
        res.status(200).json(new ApiResponse(200, medicine, "Medicine updated"));
    });

    addBatch = asyncHandler(async (req: Request | any, res: Response) => {
        const medicine = await pharmacistService.addBatch(req.params.id, req.body, req.user._id);
        res.status(200).json(new ApiResponse(200, medicine, "Batch added to medicine"));
    });

    getLowStockAlerts = asyncHandler(async (req: Request, res: Response) => {
        const alerts = await pharmacistService.getLowStockAlerts();
        res.status(200).json(new ApiResponse(200, alerts, "Alerts retrieved"));
    });

    // --- Prescriptions ---
    getPrescriptions = asyncHandler(async (req: Request, res: Response) => {
        let filters: any = {};
        if (req.query.status) {
            filters.status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
        }
        const prescriptions = await pharmacistService.getPendingPrescriptions(filters);
        res.status(200).json(new ApiResponse(200, prescriptions, "Pending prescriptions retrieved"));
    });

    getPrescriptionById = asyncHandler(async (req: Request, res: Response) => {
        const prescription = await pharmacistService.getPrescriptionById(req.params.id);
        if (!prescription) return res.status(404).json(new ApiResponse(404, null, "Prescription not found"));
        res.status(200).json(new ApiResponse(200, prescription, "Prescription details retrieved"));
    });

    dispenseMedicine = asyncHandler(async (req: Request | any, res: Response) => {
        const { dispenses } = req.body;
        const prescription = await pharmacistService.dispenseMedicine(req.params.id, dispenses, req.user._id);
        res.status(200).json(new ApiResponse(200, prescription, "Medicine dispensed successfully"));
    });

    // --- Billing ---
    getInvoices = asyncHandler(async (req: Request, res: Response) => {
        const invoices = await pharmacistService.getInvoices();
        res.status(200).json(new ApiResponse(200, invoices, "Invoices retrieved"));
    });

    generateInvoice = asyncHandler(async (req: Request | any, res: Response) => {
        const invoice = await pharmacistService.generateInvoice(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, invoice, "Pharmacy invoice generated"));
    });

    payInvoice = asyncHandler(async (req: Request | any, res: Response) => {
        const { paymentMethod } = req.body;
        const invoice = await pharmacistService.payInvoice(req.params.id, paymentMethod, req.user._id);
        res.status(200).json(new ApiResponse(200, invoice, "Invoice marked as paid"));
    });

    // --- Patient History ---
    getPatientPrescriptionHistory = asyncHandler(async (req: Request, res: Response) => {
        const history = await pharmacistService.getPatientPrescriptionHistory(req.params.id as any);
        res.status(200).json(new ApiResponse(200, history, "Patient pharmacy history retrieved"));
    });
}

export default new PharmacistController();
