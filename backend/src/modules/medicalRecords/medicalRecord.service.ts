import MedicalRecord, { IMedicalRecord } from './medicalRecord.model';
import ApiError from '../../utils/ApiError';

class MedicalRecordService {
    async createRecord(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        return await MedicalRecord.create(data);
    }

    async getPatientHistory(patientId: string): Promise<IMedicalRecord[]> {
        return await MedicalRecord.find({ patientId, isDeleted: false })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
            .populate('appointmentId', 'date startTime status')
            .sort({ createdAt: -1 });
    }

    async getRecordById(id: string): Promise<IMedicalRecord> {
        const record = await MedicalRecord.findOne({ _id: id, isDeleted: false })
            .populate('patientId', 'name email dob gender phone') // Assuming user has these
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
            .populate('appointmentId');

        if (!record) throw new ApiError(404, 'Medical record not found');
        return record;
    }

    async updateRecord(id: string, updateData: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        const record = await MedicalRecord.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
        if (!record) throw new ApiError(404, 'Medical record not found');
        return record;
    }

    async deleteRecord(id: string): Promise<IMedicalRecord> {
        const record = await MedicalRecord.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        if (!record) throw new ApiError(404, 'Medical record not found');
        return record;
    }

    async getPrescriptionData(recordId: string): Promise<any> {
        const record = await this.getRecordById(recordId);
        // This data will be used by the frontend or an email service to generate the PDF
        return {
            patient: record.patientId,
            doctor: record.doctorId,
            date: record.visitDate || record.createdAt,
            diagnosis: record.diagnosis,
            prescriptions: record.prescriptions,
            vitals: record.vitals
        };
    }
}

export default new MedicalRecordService();
