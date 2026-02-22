import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    userId: mongoose.Types.ObjectId | any;
    role: string;
    entity: string;
    entityId?: mongoose.Types.ObjectId;
    ipAddress?: string;
    details?: string;
    createdAt: Date;
}

const auditLogSchema: Schema<IAuditLog> = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    entity: { type: String, required: true }, // e.g., 'Appointment', 'Invoice', 'User'
    entityId: { type: mongoose.Schema.Types.ObjectId },
    ipAddress: { type: String },
    details: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
