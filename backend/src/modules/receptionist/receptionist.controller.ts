import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import receptionistService from './receptionist.service';
import ApiResponse from '../../utils/apiResponse';

class ReceptionistController {
    getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
        const summary = await receptionistService.getDashboardSummary();
        res.status(200).json(new ApiResponse(200, summary, "Receptionist dashboard summary retrieved"));
    });

    registerPatient = asyncHandler(async (req: Request | any, res: Response) => {
        const patient = await receptionistService.registerPatient(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, patient, "Patient registered successfully"));
    });

    getPatients = asyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search as string;
        const patients = await receptionistService.getPatients(search);
        res.status(200).json(new ApiResponse(200, patients, "Patients retrieved"));
    });

    getPatientById = asyncHandler(async (req: Request, res: Response) => {
        const patient = await receptionistService.getPatientById(req.params.id);
        if (!patient) return res.status(404).json(new ApiResponse(404, null, "Patient not found"));
        res.status(200).json(new ApiResponse(200, patient, "Patient profile retrieved"));
    });

    bookAppointment = asyncHandler(async (req: Request | any, res: Response) => {
        const appointment = await receptionistService.bookAppointment(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully"));
    });

    getAppointments = asyncHandler(async (req: Request, res: Response) => {
        const appointments = await receptionistService.getAppointments(req.query.date as string);
        res.status(200).json(new ApiResponse(200, appointments, "Appointments retrieved"));
    });

    cancelAppointment = asyncHandler(async (req: Request | any, res: Response) => {
        const { reason } = req.body;
        const appointment = await receptionistService.cancelAppointment(req.params.id, reason, req.user._id);
        res.status(200).json(new ApiResponse(200, appointment, "Appointment cancelled"));
    });

    getQueue = asyncHandler(async (req: Request, res: Response) => {
        const queue = await receptionistService.getQueue();
        res.status(200).json(new ApiResponse(200, queue, "Daily queue retrieved"));
    });

    checkInPatient = asyncHandler(async (req: Request | any, res: Response) => {
        const queueItem = await receptionistService.checkInPatient(req.params.id, req.user._id);
        res.status(200).json(new ApiResponse(200, queueItem, "Patient checked in successfully"));
    });

    updateQueueStatus = asyncHandler(async (req: Request | any, res: Response) => {
        const queueItem = await receptionistService.updateQueueStatus(req.params.id, req.body, req.user._id);
        res.status(200).json(new ApiResponse(200, queueItem, "Queue status updated"));
    });

    getInvoices = asyncHandler(async (req: Request, res: Response) => {
        const invoices = await receptionistService.getInvoices();
        res.status(200).json(new ApiResponse(200, invoices, "Invoices retrieved"));
    });

    generateInvoice = asyncHandler(async (req: Request | any, res: Response) => {
        const invoice = await receptionistService.generateInvoice(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, invoice, "Invoice generated successfully"));
    });

    payInvoice = asyncHandler(async (req: Request | any, res: Response) => {
        const { method } = req.body;
        const invoice = await receptionistService.payInvoice(req.params.id, method, req.user._id);
        res.status(200).json(new ApiResponse(200, invoice, "Payment recorded successfully"));
    });

    getReports = asyncHandler(async (req: Request, res: Response) => {
        const reports = await receptionistService.getReports();
        res.status(200).json(new ApiResponse(200, reports, "Operational reports retrieved"));
    });
}

export default new ReceptionistController();
