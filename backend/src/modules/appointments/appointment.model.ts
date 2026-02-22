import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId | any;
    doctorId: mongoose.Types.ObjectId | any;
    serviceId?: mongoose.Types.ObjectId | any;
    date: Date;
    startTime: string;
    endTime: string;
    duration?: number; // minutes
    reason?: string;
    status: 'Scheduled' | 'CheckedIn' | 'vitals_recorded' | 'ready_for_doctor' | 'Completed' | 'Cancelled' | 'No Show';
    symptoms?: string;
    notes?: string;
    cancellationReason?: string;
    rescheduledFrom?: mongoose.Types.ObjectId;
    paymentStatus: 'Pending' | 'Paid' | 'Partial' | 'Refunded';
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema: Schema<IAppointment> = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number },
    reason: { type: String },

    status: {
        type: String,
        enum: ['Scheduled', 'CheckedIn', 'vitals_recorded', 'ready_for_doctor', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    },
    symptoms: { type: String },
    notes: { type: String },
    cancellationReason: { type: String },
    rescheduledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partial', 'Refunded'],
        default: 'Pending'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Compound Index to prevent double booking at the DB level
appointmentSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });


export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
