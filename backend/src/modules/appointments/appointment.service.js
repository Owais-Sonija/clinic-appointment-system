const Appointment = require('./appointment.model');
const Doctor = require('../doctors/doctor.model');
const ApiError = require('../../utils/ApiError');

class AppointmentService {
    async bookAppointment(patientId, appointmentData) {
        const { doctorId, appointmentDate, appointmentTime, serviceId } = appointmentData;

        // Check doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || doctor.isDeleted) {
            throw new ApiError(404, 'Doctor not found or inactive');
        }

        // Basic double booking check before Mongo index throws
        const conflict = await Appointment.findOne({
            doctorId,
            appointmentDate,
            appointmentTime,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (conflict) {
            throw new ApiError(409, 'This time slot is already booked for this doctor');
        }

        return await Appointment.create({
            patientId,
            doctorId,
            serviceId,
            appointmentDate,
            appointmentTime,
            status: 'pending'
        });
    }

    async getAppointments(filters) {
        return await Appointment.find({ ...filters, isDeleted: false })
            .populate('patientId', 'name email profileImage')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .populate('serviceId', 'name duration price')
            .sort({ appointmentDate: 1, appointmentTime: 1 });
    }

    async getAppointmentById(id) {
        const appointment = await Appointment.findOne({ _id: id, isDeleted: false })
            .populate('patientId', 'name email')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .populate('serviceId');

        if (!appointment) {
            throw new ApiError(404, 'Appointment not found');
        }
        return appointment;
    }

    async updateStatus(id, status, cancellationReason = null) {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            throw new ApiError(404, 'Appointment not found');
        }

        appointment.status = status;
        if (status === 'cancelled' && cancellationReason) {
            appointment.cancellationReason = cancellationReason;
        }

        await appointment.save();
        return appointment;
    }
}

module.exports = new AppointmentService();
