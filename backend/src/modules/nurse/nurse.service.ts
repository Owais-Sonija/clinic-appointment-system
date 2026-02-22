import Appointment from '../appointments/appointment.model';
import User from '../auth/user.model';
import Doctor from '../doctors/doctor.model';
import Vitals from './vitals.model';
import NursingNote from './nursingNote.model';
import MedicalRecord from '../medicalRecords/medicalRecord.model';
import ApiError from '../../utils/apiError';
import mongoose from 'mongoose';

class NurseService {
    async getDashboardSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.find({
            date: { $gte: today, $lt: tomorrow }
        });

        const stats = {
            totalToday: appointments.length,
            waiting: appointments.filter(a => a.status === 'Scheduled').length, // In our flow, Scheduled = Waiting initially
            vitalsRecorded: appointments.filter(a => a.status === 'vitals_recorded' as any).length,
            readyForDoctor: appointments.filter(a => a.status === 'ready_for_doctor' as any).length,
            completedToday: appointments.filter(a => a.status === 'Completed').length
        };

        return stats;
    }

    async getAppointments(query: any) {
        let filter: any = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Nurse mostly cares about today's queue
        filter.date = { $gte: today, $lt: tomorrow };

        if (query.status) filter.status = query.status;
        if (query.doctorId) filter.doctorId = query.doctorId;

        return await Appointment.find(filter)
            .populate('patientId', 'name email phone')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ time: 1 });
    }

    async updateAppointmentStatus(appointmentId: string, status: string, nurseId: string) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new ApiError(404, 'Appointment not found');

        const allowedStatuses = ['Scheduled', 'vitals_recorded', 'ready_for_doctor'];
        if (!allowedStatuses.includes(status)) {
            throw new ApiError(400, 'Invalid status for nurse operation');
        }

        if (appointment.status === 'Completed' || appointment.status === 'Cancelled') {
            throw new ApiError(400, 'Cannot update status of a finished appointment');
        }

        appointment.status = status as any;
        await appointment.save();

        return appointment;
    }

    async createVitals(data: any, nurseId: string) {
        const appointment = await Appointment.findById(data.appointmentId);
        if (!appointment) throw new ApiError(404, 'Appointment not found');

        if (appointment.status === 'Completed') {
            throw new ApiError(400, 'Cannot record vitals for a completed appointment');
        }

        const vitals = await Vitals.create({
            ...data,
            nurseId,
            patientId: appointment.patientId,
            recordedAt: new Date()
        });

        // Automatically update status if it was waiting
        if (appointment.status === 'Scheduled') {
            appointment.status = 'vitals_recorded' as any;
            await appointment.save();
        }

        return vitals;
    }

    async getVitalsByAppointment(appointmentId: string) {
        return await Vitals.findOne({ appointmentId }).sort({ recordedAt: -1 });
    }

    async createNursingNote(data: any, nurseId: string) {
        const appointment = await Appointment.findById(data.appointmentId);
        if (!appointment) throw new ApiError(404, 'Appointment not found');

        if (appointment.status === 'Completed') {
            throw new ApiError(400, 'Cannot add notes to a completed appointment');
        }

        const note = await NursingNote.create({
            ...data,
            nurseId,
            patientId: appointment.patientId
        });

        return note;
    }

    async getNursingNotesByAppointment(appointmentId: string) {
        return await NursingNote.find({ appointmentId }).sort({ createdAt: -1 });
    }

    async getPatientHistory(patientId: string) {
        const appointments = await Appointment.find({ patientId }).sort({ date: -1 });
        const medicalRecords = await MedicalRecord.find({ patientId }).populate('doctorId', 'userId').sort({ createdAt: -1 });
        const vitals = await Vitals.find({ patientId }).sort({ recordedAt: -1 });

        return {
            appointments,
            medicalRecords,
            vitals
        };
    }
}

export default new NurseService();
