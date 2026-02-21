const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'name email');
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');

        if (!doctor) {
            res.status(404);
            throw new Error('Doctor not found');
        }

        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        next(error);
    }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res, next) => {
    try {
        // Check if user already has a doctor profile
        const doctorExists = await Doctor.findOne({ userId: req.body.userId });

        if (doctorExists) {
            res.status(400);
            throw new Error('Doctor profile already exists for this user');
        }

        const doctor = await Doctor.create(req.body);
        res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        next(error);
    }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res, next) => {
    try {
        let doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            res.status(404);
            throw new Error('Doctor not found');
        }

        doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            res.status(404);
            throw new Error('Doctor not found');
        }

        await doctor.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
