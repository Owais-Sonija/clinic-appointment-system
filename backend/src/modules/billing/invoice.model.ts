import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceItem {
    description: string;
    amount: number;
    type: 'Consultation' | 'Service' | 'Medicine' | 'Other';
    referenceId?: mongoose.Types.ObjectId | any; // Could point to an Inventory ID or Service ID
}

export interface IInvoice extends Document {
    patientId: mongoose.Types.ObjectId | any;
    appointmentId?: mongoose.Types.ObjectId | any;
    invoiceNumber: string;
    items: IInvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    totalAmount: number;
    amountPaid: number;
    status: 'Draft' | 'Unpaid' | 'Partial' | 'Paid' | 'Cancelled';
    dueDate: Date;
    notes?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const invoiceSchema: Schema<IInvoice> = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    invoiceNumber: { type: String, required: true, unique: true },

    items: [{
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        type: {
            type: String,
            enum: ['Consultation', 'Service', 'Medicine', 'Other'],
            required: true
        },
        referenceId: { type: mongoose.Schema.Types.ObjectId }
    }],

    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ['Draft', 'Unpaid', 'Partial', 'Paid', 'Cancelled'],
        default: 'Unpaid'
    },
    dueDate: { type: Date, required: true },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
