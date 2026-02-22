import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
    doctorId: mongoose.Types.ObjectId;
    workingDays: string[]; // e.g., ['Monday', 'Tuesday']
    startTime: string; // e.g., '09:00'
    endTime: string; // e.g., '17:00'
    slotDuration: number; // in minutes
    blockedDates: Date[];
    isActive: boolean;
}

const scheduleSchema: Schema<ISchedule> = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        unique: true
    },
    workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    startTime: {
        type: String,
        default: '09:00'
    },
    endTime: {
        type: String,
        default: '17:00'
    },
    slotDuration: {
        type: Number,
        default: 30
    },
    blockedDates: {
        type: [Date],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model<ISchedule>('Schedule', scheduleSchema);
