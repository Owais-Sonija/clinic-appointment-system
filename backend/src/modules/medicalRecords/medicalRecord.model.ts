import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
    patientId: mongoose.Types.ObjectId | any;
    doctorId: mongoose.Types.ObjectId | any;
    appointmentId?: mongoose.Types.ObjectId | any;
    vitals: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        weight?: number; // kg
        height?: number; // cm
    };
    symptoms: string[];
    diagnosis: string;
    prescriptions: {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string; // e.g. "7 days"
    }[];
    notes?: string;
    attachments: string[]; // file URLs
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const medicalRecordSchema: Schema<IMedicalRecord> = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },

    vitals: {
        bloodPressure: String,
        heartRate: Number,
        temperature: Number,
        weight: Number,
        height: Number
    },
    symptoms: [{ type: String }],
    diagnosis: { type: String, required: true },

    prescriptions: [{
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    notes: String,
    attachments: [{ type: String }],
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
