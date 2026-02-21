const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    visitDate: { type: Date, required: true, default: Date.now },
    symptoms: [{ type: String }],
    diagnosis: { type: String, required: true },
    prescription: [{
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true }, // e.g. "5 days"
        notes: { type: String }
    }],
    labTests: [{ type: String }],
    vitals: {
        bloodPressure: { type: String },
        pulse: { type: Number },
        weight: { type: Number },
        temperature: { type: Number }
    },
    followUpDate: { type: Date },
    attachments: [{ type: String }], // file URLs
    notes: { type: String },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
