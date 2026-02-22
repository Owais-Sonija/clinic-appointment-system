import mongoose, { Schema, Document } from 'mongoose';

export interface IVitals extends Document {
    appointmentId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    nurseId: mongoose.Types.ObjectId;
    bp: string; // e.g., "120/80"
    pulse: number;
    temperature: number;
    respiratoryRate: number;
    spo2: number;
    weight: number;
    height: number;
    bmi: number;
    recordedAt: Date;
}

const vitalsSchema: Schema = new Schema({
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nurseId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bp: { type: String, required: true },
    pulse: { type: Number, required: true },
    temperature: { type: Number, required: true },
    respiratoryRate: { type: Number, required: true },
    spo2: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    bmi: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IVitals>('Vitals', vitalsSchema);
