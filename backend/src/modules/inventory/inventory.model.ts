import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
    itemName: string;
    category: 'Medicine' | 'Equipment' | 'Consumable' | 'Other';
    batchNumber?: string;
    stockQuantity: number;
    unit: string;
    purchasePrice: number;
    sellingPrice: number;
    supplier: string;
    expiryDate?: Date;
    reorderLevel: number;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
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
    batchNumber: { type: String },
    stockQuantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    purchasePrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true },
    supplier: { type: String },
    expiryDate: { type: Date },
    reorderLevel: { type: Number, default: 10 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IInventory>('Inventory', inventorySchema);
