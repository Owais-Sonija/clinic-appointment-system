import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
    modelName: string;
    field: string;
    sequence: number;
}

const counterSchema: Schema<ICounter> = new mongoose.Schema({
    modelName: { type: String, required: true },
    field: { type: String, required: true },
    sequence: { type: Number, default: 0 }
}, {
    timestamps: true
});

counterSchema.index({ modelName: 1, field: 1 }, { unique: true });

export default mongoose.model<ICounter>('Counter', counterSchema);
