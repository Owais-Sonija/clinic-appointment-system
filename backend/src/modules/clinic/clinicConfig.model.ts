import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkingHour {
    day: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
}

export interface IClinicConfig extends Document {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    workingHours: IWorkingHour[];
    emergencyContact?: string;
    registrationNumber?: string;
    taxNumber?: string;
    currency: string;
    timezone: string;
    invoicePrefix: string;
    prescriptionFooterNote?: string;
    isConfigured: boolean;
    isDeleted: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}

const clinicConfigSchema: Schema<IClinicConfig> = new mongoose.Schema({
    name: { type: String, required: true, default: 'MediClinic Enterprise' },
    logo: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    workingHours: [{
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        isClosed: { type: Boolean, default: false }
    }],
    emergencyContact: { type: String },
    registrationNumber: { type: String },
    taxNumber: { type: String },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    invoicePrefix: { type: String, default: 'INV-' },
    prescriptionFooterNote: { type: String, default: 'This is a computer generated prescription and does not require a physical signature.' },
    isConfigured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

export default mongoose.model<IClinicConfig>('ClinicConfig', clinicConfigSchema);
