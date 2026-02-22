import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId | any;
    type: 'System' | 'Appointment' | 'Billing' | 'Inventory';
    message: string;
    isRead: boolean;
    relatedEntity?: mongoose.Types.ObjectId | any; // Dynamic link based on type
    isDeleted: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema: Schema<INotification> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['System', 'Appointment', 'Billing', 'Inventory'],
        default: 'System'
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedEntity: { type: mongoose.Schema.Types.ObjectId }, // E.g. Appointment ID
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

export default mongoose.model<INotification>('Notification', notificationSchema);
