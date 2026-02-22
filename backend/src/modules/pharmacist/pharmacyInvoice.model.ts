import mongoose, { Schema, Document } from 'mongoose';

export interface IPharmacyInvoiceItem {
    medicineId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface IPharmacyInvoice extends Document {
    patientId: mongoose.Types.ObjectId;
    prescriptionId?: mongoose.Types.ObjectId;
    items: IPharmacyInvoiceItem[];
    totalAmount: number;
    discount?: number;
    netAmount: number;
    status: 'Pending' | 'Paid' | 'Cancelled';
    paymentMethod?: 'Cash' | 'Card' | 'Online';
    paidAt?: Date;
    createdBy: mongoose.Types.ObjectId;
}

const pharmacyInvoiceItemSchema = new Schema<IPharmacyInvoiceItem>({
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
});

const pharmacyInvoiceSchema = new Schema<IPharmacyInvoice>({
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    items: [pharmacyInvoiceItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Pending', 'Paid', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'Online'] },
    paidAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export default mongoose.model<IPharmacyInvoice>('PharmacyInvoice', pharmacyInvoiceSchema);
