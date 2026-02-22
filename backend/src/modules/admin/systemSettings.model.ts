import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSettings extends Document {
    appointmentDuration: number;
    cancellationWindowHours: number;
    clinicStartTime: string;
    clinicEndTime: string;
    timezone: string;
    featureFlags: Record<string, boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const systemSettingsSchema: Schema<ISystemSettings> = new mongoose.Schema({
    appointmentDuration: { type: Number, default: 30 },
    cancellationWindowHours: { type: Number, default: 24 },
    clinicStartTime: { type: String, default: '09:00' },
    clinicEndTime: { type: String, default: '17:00' },
    timezone: { type: String, default: 'UTC' },
    featureFlags: { type: Map, of: Boolean, default: {} }
}, {
    timestamps: true
});

export default mongoose.model<ISystemSettings>('SystemSettings', systemSettingsSchema);
