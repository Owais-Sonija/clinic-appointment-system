import mongoose, { Schema, Document } from 'mongoose';

export interface IQueueStatus extends Document {
    appointmentId: mongoose.Types.ObjectId;
    status: 'Waiting' | 'In Consultation' | 'Completed' | 'No Show';
    priority: 'Normal' | 'Emergency';
    checkInTime: Date;
    estimatedWaitTime?: number; // in mins
}

const queueStatusSchema: Schema = new Schema({
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
    status: { type: String, enum: ['Waiting', 'In Consultation', 'Completed', 'No Show'], default: 'Waiting' },
    priority: { type: String, enum: ['Normal', 'Emergency'], default: 'Normal' },
    checkInTime: { type: Date, default: Date.now },
    estimatedWaitTime: { type: Number }
}, {
    timestamps: true
});

export default mongoose.model<IQueueStatus>('QueueStatus', queueStatusSchema);
