import { Request, Response } from 'express';
import emrService from './medicalRecord.service';
import Doctor from '../doctors/doctor.model';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class MedicalRecordController {
    getAll = asyncHandler(async (req: Request | any, res: Response) => {
        let filter: any = {};

        if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: req.user._id });
            if (doctor) {
                filter.doctorId = doctor._id;
            }
        }

        const records = await emrService.listRecords(filter);
        res.status(200).json(new ApiResponse(200, records, "Medical records retrieved"));
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const record = await emrService.createRecord(req.body);
        res.status(201).json(new ApiResponse(201, record, "Medical record created successfully"));
    });

    getPatientHistory = asyncHandler(async (req: Request | any, res: Response) => {
        const patientId = req.params.patientId || req.user._id; // Allow fetching own or provided patientId
        const history = await emrService.getPatientHistory(patientId);
        res.status(200).json(new ApiResponse(200, history, "Patient history retrieved"));
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const record = await emrService.getRecordById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, record, "Medical record retrieved"));
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const record = await emrService.updateRecord((req.params.id as string), req.body);
        res.status(200).json(new ApiResponse(200, record, "Medical record updated successfully"));
    });

    deleteRecord = asyncHandler(async (req: Request, res: Response) => {
        await emrService.deleteRecord((req.params.id as string));
        res.status(200).json(new ApiResponse(200, null, "Medical record deleted"));
    });
}

export default new MedicalRecordController();
