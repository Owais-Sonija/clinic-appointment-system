const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['system', 'appointment', 'billing', 'inventory'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedEntity: { type: mongoose.Schema.Types.ObjectId }, // Can be Invoice, Appointment, etc.
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
