import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailability {
    day: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
}

export interface IDoctor extends Document {
    userId: mongoose.Types.ObjectId | any;
    specialization: string;
    experience: number;
    qualification: string;
    consultationFee: number;
    bio?: string;
    licenseNumber?: string;
    isActive: boolean;
    availability: IAvailability[];
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const availabilitySchema = new mongoose.Schema({
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, default: 30 }
});

const doctorSchema: Schema<IDoctor> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    qualification: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    bio: { type: String },
    licenseNumber: { type: String },
    isActive: { type: Boolean, default: true },
    availability: [availabilitySchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IDoctor>('Doctor', doctorSchema);
