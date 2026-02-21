const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'My Clinic' },
    logo: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    workingHours: [{
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        isClosed: { type: Boolean, default: false }
    }],
    emergencyContact: { type: String },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },
    isConfigured: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Clinic', clinicSchema);
