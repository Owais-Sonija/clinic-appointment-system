import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
    itemName: string;
    category: 'Medicine' | 'Equipment' | 'Consumable' | 'Other';
    stockQuantity: number;
    unit: string; // e.g., 'tablets', 'bottles', 'boxes', 'pieces'
    unitPrice: number;
    supplier: string;
    expiryDate?: Date;
    reorderLevel: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const inventorySchema: Schema<IInventory> = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: {
        type: String,
        enum: ['Medicine', 'Equipment', 'Consumable', 'Other'],
        required: true
    },
    stockQuantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    supplier: { type: String },
    expiryDate: { type: Date },
    reorderLevel: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IInventory>('Inventory', inventorySchema);
