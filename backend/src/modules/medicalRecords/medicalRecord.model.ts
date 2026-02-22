import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
    patientId: mongoose.Types.ObjectId | any;
    doctorId: mongoose.Types.ObjectId | any;
    appointmentId?: mongoose.Types.ObjectId | any;
    visitDate?: Date;
    vitals: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        weight?: number;
        height?: number;
    };
    symptoms: string[];
    diagnosis: string;
    prescriptions: {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
    labTests: {
        testName: string;
        result?: string;
        normalRange?: string;
        status: 'Pending' | 'Completed';
    }[];
    followUpDate?: Date;
    notes?: string;
    attachments: string[];
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const medicalRecordSchema: Schema<IMedicalRecord> = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    visitDate: { type: Date },

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
    labTests: [{
        testName: { type: String, required: true },
        result: { type: String },
        normalRange: { type: String },
        status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
    }],
    followUpDate: { type: Date },
    notes: String,
    attachments: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
