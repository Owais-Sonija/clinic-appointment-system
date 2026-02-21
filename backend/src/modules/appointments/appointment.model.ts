import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId | any;
    doctorId: mongoose.Types.ObjectId | any;
    serviceId?: mongoose.Types.ObjectId | any;
    date: Date;
    startTime: string; // e.g., "14:00"
    endTime: string;   // e.g., "14:30"
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
    symptoms?: string;
    notes?: string;
    paymentStatus: 'Pending' | 'Paid' | 'Partial' | 'Refunded';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema: Schema<IAppointment> = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },

    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true },   // "10:30"

    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    },
    symptoms: { type: String },
    notes: { type: String },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partial', 'Refunded'],
        default: 'Pending'
    },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Composite index to prevent double bookings
appointmentSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
