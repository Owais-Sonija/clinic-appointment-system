import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkingHour {
    day: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
}

export interface IClinic extends Document {
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
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    isConfigured: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const clinicSchema: Schema<IClinic> = new mongoose.Schema({
    name: { type: String, required: true, default: 'My Clinic' },
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
    timezone: { type: String, default: 'Asia/Karachi' },
    invoicePrefix: { type: String, default: 'INV' },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },
    isConfigured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IClinic>('Clinic', clinicSchema);
