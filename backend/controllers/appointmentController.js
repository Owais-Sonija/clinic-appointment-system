const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private/Patient
const createAppointment = async (req, res, next) => {
    try {
        const { doctorId, serviceId, appointmentDate, appointmentTime, notes } = req.body;

        // Check for double booking
        const existingAppt = await Appointment.findOne({ doctorId, appointmentDate, appointmentTime, status: { $ne: 'cancelled' } });
        if (existingAppt) {
            res.status(400);
            throw new Error('Doctor is already booked for this time slot');
        }

        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            serviceId,
            appointmentDate,
            appointmentTime,
            notes
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', 'name email')
            .populate('doctorId', 'specialization userId')
            .populate('serviceId', 'name price');
        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/my
// @access  Private/Patient
const getMyAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id })
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name email profileImage' }
            })
            .populate('serviceId', 'name price icon');
        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin/Doctor
const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete/Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Patient
const deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        if (appointment.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('User not authorized to cancel this appointment');
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getMyAppointments,
    updateAppointmentStatus,
    deleteAppointment
};
