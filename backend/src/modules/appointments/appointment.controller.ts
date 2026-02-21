import { Request, Response } from 'express';
import appointmentService from './appointment.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class AppointmentController {
    book = asyncHandler(async (req: Request | any, res: Response) => {
        const data = req.body;
        // If patient logs in and books, attach their ID automatically
        if (req.user && req.user.role === 'patient') {
            data.patientId = req.user._id;
        }

        const apt = await appointmentService.bookAppointment(data);
        res.status(201).json(new ApiResponse(201, apt, "Appointment booked successfully"));
    });

    getAll = asyncHandler(async (req: Request | any, res: Response) => {
        // Build filters based on role
        const filters: any = {};
        if (req.user && req.user.role === 'patient') {
            filters.patientId = req.user._id;
        } else if (req.query.date) {
            filters.date = new Date(req.query.date as string);
        }

        if (req.query.doctorId) {
            filters.doctorId = req.query.doctorId;
        }

        const appointments = await appointmentService.getAppointments(filters);
        res.status(200).json(new ApiResponse(200, appointments, "Appointments retrieved"));
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const apt = await appointmentService.getAppointmentById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, apt, "Appointment retrieved"));
    });

    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const apt = await appointmentService.updateStatus((req.params.id as string), req.body.status);
        res.status(200).json(new ApiResponse(200, apt, "Status updated"));
    });

    reschedule = asyncHandler(async (req: Request, res: Response) => {
        const { date, startTime, endTime } = req.body;
        const apt = await appointmentService.reschedule((req.params.id as string), date, startTime, endTime);
        res.status(200).json(new ApiResponse(200, apt, "Appointment rescheduled successfully"));
    });

    cancel = asyncHandler(async (req: Request, res: Response) => {
        const apt = await appointmentService.cancelAppointment((req.params.id as string));
        res.status(200).json(new ApiResponse(200, apt, "Appointment cancelled"));
    });
}

export default new AppointmentController();
