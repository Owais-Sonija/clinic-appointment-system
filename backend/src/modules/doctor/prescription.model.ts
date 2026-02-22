import mongoose, { Document, Schema } from 'mongoose';

export interface IPrescriptionItem {
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantityPrescribed: number;
    notes?: string;
    status: 'Pending' | 'Partially Dispensed' | 'Dispensed';
    quantityDispensed: number;
}

export interface IPrescription extends Document {
    patientId: mongoose.Types.ObjectId | any;
    doctorId: mongoose.Types.ObjectId | any;
    appointmentId?: mongoose.Types.ObjectId | any;
    medicalRecordId?: mongoose.Types.ObjectId | any;
    items: IPrescriptionItem[];
    status: 'Pending' | 'Partially Dispensed' | 'Completed';
    generalNotes?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const prescriptionItemSchema = new Schema<IPrescriptionItem>({
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    quantityPrescribed: { type: Number, required: true, min: 1 },
    notes: { type: String },
    status: { type: String, enum: ['Pending', 'Partially Dispensed', 'Dispensed'], default: 'Pending' },
    quantityDispensed: { type: Number, default: 0 }
});

const prescriptionSchema: Schema<IPrescription> = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    medicalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' },

    items: [prescriptionItemSchema],

    status: {
        type: String,
        enum: ['Pending', 'Partially Dispensed', 'Completed'],
        default: 'Pending'
    },
    generalNotes: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IPrescription>('Prescription', prescriptionSchema);
