import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    userId?: mongoose.Types.ObjectId;
    role?: string;
    action: string;
    entity: string;
    entityId?: mongoose.Types.ObjectId | string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
    timestamp: Date;
}

const auditLogSchema: Schema<IAuditLog> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.Mixed },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
