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
    availability: IAvailability[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const availabilitySchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g. "Monday"
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true }, // e.g. "17:00"
    slotDuration: { type: Number, default: 30 } // duration in minutes
});

const doctorSchema: Schema<IDoctor> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // years
    qualification: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    bio: { type: String },
    availability: [availabilitySchema],
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IDoctor>('Doctor', doctorSchema);
