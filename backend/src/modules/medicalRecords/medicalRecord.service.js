const MedicalRecord = require('./medicalRecord.model');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');

class MedicalRecordService {
    async createRecord(recordData) {
        // Validate patient
        const patient = await User.findById(recordData.patientId);
        if (!patient || patient.role !== 'patient') {
            throw new ApiError(400, "Invalid patient ID");
        }

        return await MedicalRecord.create(recordData);
    }

    async getPatientHistory(patientId) {
        return await MedicalRecord.find({ patientId, isDeleted: false })
            .populate('doctorId')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ visitDate: -1 }); // chronological timeline newest first
    }

    async getRecordById(id) {
        const record = await MedicalRecord.findOne({ _id: id, isDeleted: false })
            .populate('patientId', 'name email profileImage')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

        if (!record) throw new ApiError(404, "Medical record not found.");
        return record;
    }

    async updateRecord(id, updateData) {
        const record = await MedicalRecord.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
        if (!record) throw new ApiError(404, "Medical record not found.");
        return record;
    }

    async deleteRecord(id) {
        const record = await MedicalRecord.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!record) throw new ApiError(404, "Medical record not found.");
        return record;
    }
}

module.exports = new MedicalRecordService();
