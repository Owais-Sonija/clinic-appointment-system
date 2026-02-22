import { Request, Response } from 'express';
import patientService from './patient.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class PatientController {
    getDashboardSummary = asyncHandler(async (req: Request | any, res: Response) => {
        // Enforce patientId = req.user._id
        const patientId = req.user._id;

        const summary = await patientService.getDashboardSummary(patientId);

        res.status(200).json(new ApiResponse(200, summary, "Patient dashboard summary retrieved successfully"));
    });

    getMedicalRecords = asyncHandler(async (req: Request | any, res: Response) => {
        const patientId = req.user._id;
        const records = await patientService.getMedicalRecords(patientId);
        res.status(200).json(new ApiResponse(200, records, "Patient medical records retrieved successfully"));
    });

    getPrescriptions = asyncHandler(async (req: Request | any, res: Response) => {
        const patientId = req.user._id;
        const prescriptions = await patientService.getPrescriptions(patientId);
        res.status(200).json(new ApiResponse(200, prescriptions, "Patient prescriptions retrieved successfully"));
    });
}

export default new PatientController();
