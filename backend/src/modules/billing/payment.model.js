const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['cash', 'card', 'online', 'bank_transfer'], required: true },
    transactionId: { type: String }, // e.g. stripe charge ID
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
