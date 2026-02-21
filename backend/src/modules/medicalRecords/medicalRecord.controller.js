const emrService = require('./medicalRecord.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

class MedicalRecordController {
    createRecord = asyncHandler(async (req, res) => {
        // Assume req.user is the doctor creating the record unless specified
        const recordData = { ...req.body };

        // If doctorId not in body, infer from logged in user if they are a doctor
        // Using body mapping assuming frontend passes it properly for now

        const record = await emrService.createRecord(recordData);
        res.status(201).json(new ApiResponse(201, record, "Medical record created successfully"));
    });

    getPatientHistory = asyncHandler(async (req, res) => {
        const history = await emrService.getPatientHistory(req.params.patientId);
        res.status(200).json(new ApiResponse(200, history, "Patient history timeline retrieved"));
    });

    getRecordById = asyncHandler(async (req, res) => {
        const record = await emrService.getRecordById(req.params.id);
        res.status(200).json(new ApiResponse(200, record, "Medical record retrieved"));
    });

    updateRecord = asyncHandler(async (req, res) => {
        const record = await emrService.updateRecord(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, record, "Medical record updated"));
    });

    deleteRecord = asyncHandler(async (req, res) => {
        await emrService.deleteRecord(req.params.id);
        res.status(200).json(new ApiResponse(200, null, "Medical record deleted"));
    });
}

module.exports = new MedicalRecordController();
