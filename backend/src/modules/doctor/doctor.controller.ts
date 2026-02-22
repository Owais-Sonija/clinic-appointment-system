import { Request, Response } from 'express';
import doctorDashboardService from './doctor.service';
import asyncHandler from '../../utils/asyncHandler';
import ApiResponse from '../../utils/ApiResponse';

class DoctorDashboardController {
    getSummary = asyncHandler(async (req: any, res: Response) => {
        const summary = await doctorDashboardService.getDashboardSummary(req.user.id);
        res.status(200).json(new ApiResponse(200, summary, "Doctor dashboard summary retrieved"));
    });

    getAppointments = asyncHandler(async (req: any, res: Response) => {
        const appointments = await doctorDashboardService.getAppointments(req.user.id, req.query);
        res.status(200).json(new ApiResponse(200, appointments, "Doctor appointments retrieved"));
    });

    getPatientHistory = asyncHandler(async (req: any, res: Response) => {
        const history = await doctorDashboardService.getPatientHistory(req.user.id, req.params.patientId as string);
        res.status(200).json(new ApiResponse(200, history, "Patient history retrieved"));
    });

    getSchedule = asyncHandler(async (req: any, res: Response) => {
        const schedule = await doctorDashboardService.getSchedule(req.user.id);
        res.status(200).json(new ApiResponse(200, schedule, "Doctor schedule retrieved"));
    });

    updateSchedule = asyncHandler(async (req: any, res: Response) => {
        const schedule = await doctorDashboardService.updateSchedule(req.user.id, req.body);
        res.status(200).json(new ApiResponse(200, schedule, "Doctor schedule updated successfully"));
    });
}

export default new DoctorDashboardController();
