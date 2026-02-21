import { Request, Response } from 'express';
import doctorService from './doctor.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import ApiError from '../../utils/ApiError';

class DoctorController {
    createDoctor = asyncHandler(async (req: Request, res: Response) => {
        // Assume admin creates profile for a user
        const { userId, ...doctorData } = req.body;
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }
        const doctor = await doctorService.createDoctor(userId, doctorData);
        res.status(201).json(new ApiResponse(201, doctor, "Doctor profile created successfully"));
    });

    getDoctors = asyncHandler(async (req: Request, res: Response) => {
        const doctors = await doctorService.getAllDoctors();
        res.status(200).json(new ApiResponse(200, doctors, "Doctors retrieved successfully"));
    });

    getDoctorById = asyncHandler(async (req: Request, res: Response) => {
        const doctor = await doctorService.getDoctorById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, doctor, "Doctor details retrieved"));
    });

    updateDoctor = asyncHandler(async (req: Request, res: Response) => {
        const doctor = await doctorService.updateDoctor((req.params.id as string), req.body);
        res.status(200).json(new ApiResponse(200, doctor, "Doctor updated successfully"));
    });

    deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
        await doctorService.deleteDoctor((req.params.id as string));
        res.status(200).json(new ApiResponse(200, null, "Doctor profile deleted successfully"));
    });
}

export default new DoctorController();
