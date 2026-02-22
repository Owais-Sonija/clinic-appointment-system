import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch {
    batchNumber: string;
    expiryDate: Date;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
}

export interface IMedicine extends Document {
    name: string;
    genericName?: string;
    category: string;
    dosageForm: string;
    strength: string;
    manufacturer?: string;
    batches: IBatch[];
    reorderThreshold: number;
    isDeleted: boolean;
}

const batchSchema = new Schema<IBatch>({
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 0 },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
});

const medicineSchema = new Schema<IMedicine>({
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true },
    category: { type: String, required: true },
    dosageForm: { type: String, required: true }, // e.g., Tablet, Syrup, Injection
    strength: { type: String, required: true }, // e.g., 500mg, 10ml
    manufacturer: { type: String },
    batches: [batchSchema],
    reorderThreshold: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IMedicine>('Medicine', medicineSchema);
