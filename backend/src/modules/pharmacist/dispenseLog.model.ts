import mongoose, { Schema, Document } from 'mongoose';

export interface IDispenseLog extends Document {
    prescriptionId: mongoose.Types.ObjectId;
    medicineId: mongoose.Types.ObjectId;
    batchId?: mongoose.Types.ObjectId;
    quantityDispensed: number;
    pharmacistId: mongoose.Types.ObjectId;
    timestamp: Date;
    patientId: mongoose.Types.ObjectId;
}

const dispenseLogSchema = new Schema<IDispenseLog>({
    prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    batchId: { type: Schema.Types.ObjectId },
    quantityDispensed: { type: Number, required: true, min: 1 },
    pharmacistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export default mongoose.model<IDispenseLog>('DispenseLog', dispenseLogSchema);
