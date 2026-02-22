import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import nurseService from './nurse.service';
import ApiResponse from '../../utils/apiResponse';

class NurseController {
    getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
        const summary = await nurseService.getDashboardSummary();
        res.status(200).json(new ApiResponse(200, summary, "Nurse dashboard summary retrieved"));
    });

    getAppointments = asyncHandler(async (req: Request, res: Response) => {
        const appointments = await nurseService.getAppointments(req.query);
        res.status(200).json(new ApiResponse(200, appointments, "Appointments queue retrieved"));
    });

    updateAppointmentStatus = asyncHandler(async (req: Request | any, res: Response) => {
        const { status } = req.body;
        const appointment = await nurseService.updateAppointmentStatus(req.params.id, status, req.user._id);
        res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated"));
    });

    recordVitals = asyncHandler(async (req: Request | any, res: Response) => {
        const vitals = await nurseService.createVitals(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, vitals, "Vitals recorded successfully"));
    });

    getVitals = asyncHandler(async (req: Request, res: Response) => {
        const vitals = await nurseService.getVitalsByAppointment(req.params.appointmentId);
        res.status(200).json(new ApiResponse(200, vitals, "Vitals retrieved"));
    });

    addNursingNote = asyncHandler(async (req: Request | any, res: Response) => {
        const note = await nurseService.createNursingNote(req.body, req.user._id);
        res.status(201).json(new ApiResponse(201, note, "Nursing note added successfully"));
    });

    getNursingNotes = asyncHandler(async (req: Request, res: Response) => {
        const notes = await nurseService.getNursingNotesByAppointment(req.params.appointmentId);
        res.status(200).json(new ApiResponse(200, notes, "Nursing notes retrieved"));
    });

    getPatientHistory = asyncHandler(async (req: Request, res: Response) => {
        const history = await nurseService.getPatientHistory(req.params.patientId);
        res.status(200).json(new ApiResponse(200, history, "Patient history retrieved (Read-only)"));
    });
}

export default new NurseController();
