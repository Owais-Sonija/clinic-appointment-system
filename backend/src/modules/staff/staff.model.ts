import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
    userId: mongoose.Types.ObjectId | any;
    department: 'Front Desk' | 'Nursing' | 'Administration' | 'Lab';
    designation: string;
    shiftStartTime: string;
    shiftEndTime: string;
    salary?: number;
    attendance: {
        date: Date;
        status: 'Present' | 'Absent' | 'Leave' | 'Half Day';
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const staffSchema: Schema<IStaff> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        enum: ['Front Desk', 'Nursing', 'Administration', 'Lab'],
        required: true
    },
    designation: { type: String, required: true },
    shiftStartTime: { type: String, required: true },
    shiftEndTime: { type: String, required: true },
    salary: { type: Number },
    attendance: [{
        date: { type: Date, required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Half Day'], required: true }
    }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<IStaff>('Staff', staffSchema);
