import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    invoiceId: mongoose.Types.ObjectId | any;
    patientId: mongoose.Types.ObjectId | any;
    amount: number;
    paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Insurance' | 'Online';
    transactionId?: string;
    status: 'Success' | 'Pending' | 'Failed';
    paymentDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Online'],
        required: true
    },

    transactionId: { type: String },
    status: {
        type: String,
        enum: ['Success', 'Pending', 'Failed'],
        default: 'Success'
    },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<IPayment>('Payment', paymentSchema);
