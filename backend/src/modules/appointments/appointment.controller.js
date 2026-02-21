const appointmentService = require('./appointment.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class AppointmentController {
    bookAppointment = asyncHandler(async (req, res) => {
        // req.user comes from protect middleware
        const appointment = await appointmentService.bookAppointment(req.user._id, req.body);
        res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully"));
    });

    getMyPatientAppointments = asyncHandler(async (req, res) => {
        const appointments = await appointmentService.getAppointments({ patientId: req.user._id });
        res.status(200).json(new ApiResponse(200, appointments, "Your appointments retrieved"));
    });

    getDoctorAppointments = asyncHandler(async (req, res) => {
        // For a doctor seeing their schedule
        const appointments = await appointmentService.getAppointments({ doctorId: req.params.doctorId });
        res.status(200).json(new ApiResponse(200, appointments, "Doctor schedule retrieved"));
    });

    getAllAppointments = asyncHandler(async (req, res) => {
        // For Receptionist / Admin
        const appointments = await appointmentService.getAppointments({});
        res.status(200).json(new ApiResponse(200, appointments, "All clinic appointments retrieved"));
    });

    updateAppointmentStatus = asyncHandler(async (req, res) => {
        const { status, cancellationReason } = req.body;
        const appointment = await appointmentService.updateStatus(req.params.id, status, cancellationReason);
        res.status(200).json(new ApiResponse(200, appointment, `Appointment marked as ${status}`));
    });
}

module.exports = new AppointmentController();
