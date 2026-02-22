import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import ApiResponse from '../../utils/ApiResponse';
import adminService from './admin.service';

class AdminController {
    getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
        const summary = await adminService.getDashboardSummary();
        res.status(200).json(new ApiResponse(200, summary, "Admin dashboard summary retrieved successfully"));
    });

    getDoctors = asyncHandler(async (req: Request, res: Response) => {
        const doctors = await adminService.getDoctors(req.query);
        res.status(200).json(new ApiResponse(200, doctors, "Doctors retrieved successfully"));
    });

    createDoctor = asyncHandler(async (req: Request | any, res: Response) => {
        const doctor = await adminService.createDoctor(req.body, req.user._id, req.ip || '');
        res.status(201).json(new ApiResponse(201, doctor, "Doctor created successfully"));
    });

    updateDoctor = asyncHandler(async (req: Request | any, res: Response) => {
        const doctor = await adminService.updateDoctor(req.params.id, req.body, req.user._id, req.ip || '');
        res.status(200).json(new ApiResponse(200, doctor, "Doctor updated successfully"));
    });

    updateDoctorStatus = asyncHandler(async (req: Request | any, res: Response) => {
        const { isActive, isDeleted } = req.body;
        const doctor = await adminService.updateDoctorStatus(req.params.id, isActive, isDeleted || false, req.user._id, req.ip || '');
        res.status(200).json(new ApiResponse(200, doctor, "Doctor status updated successfully"));
    });

    getPatients = asyncHandler(async (req: Request, res: Response) => {
        const patients = await adminService.getPatients(req.query);
        res.status(200).json(new ApiResponse(200, patients, "Patients retrieved successfully"));
    });

    getPatientById = asyncHandler(async (req: Request, res: Response) => {
        const patient = await adminService.getPatientById(req.params.id);
        res.status(200).json(new ApiResponse(200, patient, "Patient retrieved successfully"));
    });

    updatePatientStatus = asyncHandler(async (req: Request | any, res: Response) => {
        const { isActive } = req.body;
        const patient = await adminService.updatePatientStatus(req.params.id, isActive, req.user._id, req.ip || '');
        res.status(200).json(new ApiResponse(200, patient, "Patient status updated successfully"));
    });

    getMedicalRecords = asyncHandler(async (req: Request, res: Response) => {
        const records = await adminService.getMedicalRecords(req.query);
        res.status(200).json(new ApiResponse(200, records, "Medical records retrieved successfully"));
    });

    getMedicalRecordById = asyncHandler(async (req: Request, res: Response) => {
        const record = await adminService.getMedicalRecordById(req.params.id);
        res.status(200).json(new ApiResponse(200, record, "Medical record retrieved successfully"));
    });

    getAppointments = asyncHandler(async (req: Request, res: Response) => {
        const appointments = await adminService.getAppointments(req.query);
        res.status(200).json(new ApiResponse(200, appointments, "Appointments retrieved successfully"));
    });

    updateAppointmentStatus = asyncHandler(async (req: Request | any, res: Response) => {
        const { status, reason } = req.body;
        const appointment = await adminService.updateAppointmentStatus(req.params.id, status, reason, req.user._id, req.ip || '');
        res.status(200).json(new ApiResponse(200, appointment, "Appointment status overridden successfully"));
    });

    getSchedules = asyncHandler(async (req: Request, res: Response) => {
        const schedules = await adminService.getSchedules(req.query);
        res.status(200).json(new ApiResponse(200, schedules, "Schedules retrieved successfully"));
    });

    getSettings = asyncHandler(async (req: Request, res: Response) => {
        const settings = await adminService.getSettings();
        res.status(200).json(new ApiResponse(200, settings, "Settings retrieved successfully"));
    });

    updateSettings = asyncHandler(async (req: Request | any, res: Response) => {
        const settings = await adminService.updateSettings(req.body, req.user._id, req.ip || '');
        res.status(200).json(new ApiResponse(200, settings, "Settings updated successfully"));
    });

    getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
        const logs = await adminService.getAuditLogs(req.query);
        res.status(200).json(new ApiResponse(200, logs, "Audit logs retrieved successfully"));
    });

    sendBroadcastNotification = asyncHandler(async (req: Request | any, res: Response) => {
        const { title, message, targetRole } = req.body;
        const result = await adminService.sendBroadcastNotification(title, message, targetRole, req.user._id, req.ip || '');
        res.status(200).json(new ApiResponse(200, result, "Broadcast notification sent successfully"));
    });

    getInvoices = asyncHandler(async (req: Request, res: Response) => {
        const invoices = await adminService.getInvoices(req.query);
        res.status(200).json(new ApiResponse(200, invoices, "Invoices retrieved successfully"));
    });

    getRevenueSummary = asyncHandler(async (req: Request, res: Response) => {
        const summary = await adminService.getRevenueSummary();
        res.status(200).json(new ApiResponse(200, summary, "Revenue summary retrieved successfully"));
    });
}

export default new AdminController();
