const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
    joiningDate: { type: Date, required: true, default: Date.now },
    attendance: [{
        date: { type: Date, required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Half-day'], required: true },
        remarks: { type: String }
    }],
    status: { type: String, enum: ['Active', 'OnLeave', 'Resigned', 'Terminated'], default: 'Active' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
