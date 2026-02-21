const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g. "Monday"
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true } // e.g. "17:00"
});

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // years
    qualification: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    bio: { type: String },
    profileImage: { type: String },
    availability: [availabilitySchema]
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
