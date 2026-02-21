import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    icon?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema: Schema<IService> = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    icon: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<IService>('Service', serviceSchema);
