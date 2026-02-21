import Appointment, { IAppointment } from './appointment.model';
import Doctor from '../doctors/doctor.model';
import User from '../users/user.model';
import ApiError from '../../utils/ApiError';
import mongoose from 'mongoose';

class AppointmentService {
    async bookAppointment(data: Partial<IAppointment>): Promise<IAppointment> {
        const { doctorId, date, startTime, endTime } = data;

        // Ensure doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || doctor.isDeleted) {
            throw new ApiError(404, 'Doctor not found or inactive');
        }

        // Check for double bookings (Overlap logic could be expanded)
        const existingApt = await Appointment.findOne({
            doctorId,
            date,
            startTime,
            status: { $ne: 'Cancelled' }
        });

        if (existingApt) {
            throw new ApiError(400, 'This time slot is already booked for the selected doctor');
        }

        // Basic validation passed; create appointment
        return await Appointment.create(data);
    }

    async getAppointments(filters: any): Promise<IAppointment[]> {
        // Exclude deleted by default
        const query = { isDeleted: false, ...filters };
        return await Appointment.find(query)
            .populate('patientId', 'name email phone')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name' }
            })
            .populate('serviceId', 'name price')
            .sort({ date: 1, startTime: 1 });
    }

    async getAppointmentById(id: string): Promise<IAppointment> {
        const apt = await Appointment.findById(id)
            .populate('patientId', 'name email phone')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name' }
            })
            .populate('serviceId', 'name price');

        if (!apt) throw new ApiError(404, 'Appointment not found');
        return apt;
    }

    async updateStatus(id: string, status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show'): Promise<IAppointment> {
        const apt = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
        if (!apt) throw new ApiError(404, 'Appointment not found');
        return apt;
    }

    async reschedule(id: string, newDate: Date, newStartTime: string, newEndTime: string): Promise<IAppointment> {
        const apt = await Appointment.findById(id);
        if (!apt) throw new ApiError(404, 'Appointment not found');

        // Ensure new slot isn't booked
        const overlap = await Appointment.findOne({
            doctorId: apt.doctorId,
            date: newDate,
            startTime: newStartTime,
            status: { $ne: 'Cancelled' },
            _id: { $ne: id } // Exclude the current appointment from check
        });

        if (overlap) {
            throw new ApiError(400, 'The new time slot is already booked');
        }

        apt.date = newDate;
        apt.startTime = newStartTime;
        apt.endTime = newEndTime;

        await apt.save();
        return apt;
    }

    async cancelAppointment(id: string): Promise<IAppointment> {
        return await this.updateStatus(id, 'Cancelled');
    }
}

export default new AppointmentService();
