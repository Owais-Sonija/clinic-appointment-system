import Appointment from '../appointments/appointment.model';
import MedicalRecord from '../medicalRecords/medicalRecord.model';
import Doctor from '../doctors/doctor.model';
import Schedule from '../clinic/schedule.model';
import mongoose from 'mongoose';

class DoctorDashboardService {
    async getDashboardSummary(userId: string) {
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) throw new Error('Doctor profile not found');

        const doctorId = doctor._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [todayAppts, upcomingAppts, completedAppts, cancelledAppts] = await Promise.all([
            Appointment.countDocuments({ doctorId, date: { $gte: today, $lt: tomorrow } }),
            Appointment.countDocuments({ doctorId, date: { $gte: today }, status: 'scheduled' }),
            Appointment.countDocuments({ doctorId, status: 'completed' }),
            Appointment.countDocuments({ doctorId, status: 'cancelled' })
        ]);

        // Monthly stats for chart
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyStats = await Appointment.aggregate([
            {
                $match: {
                    doctorId: new mongoose.Types.ObjectId(doctorId.toString()),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        return {
            todayAppts,
            upcomingAppts,
            completedAppts,
            cancelledAppts,
            monthlyStats
        };
    }

    async getAppointments(userId: string, filters: any) {
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) throw new Error('Doctor profile not found');

        const query: any = { doctorId: doctor._id };
        if (filters.status) query.status = filters.status;
        if (filters.date) {
            const date = new Date(filters.date);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            query.date = { $gte: date, $lt: nextDay };
        }

        return await Appointment.find(query)
            .populate('patientId', 'name email phone')
            .sort({ date: 1, startTime: 1 });
    }

    async getPatientHistory(userId: string, patientId: string) {
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) throw new Error('Doctor profile not found');

        // Verify patient has visited this doctor or is a generic patient
        // For simplicity, we allow doctors to see clinical history they/clinic created
        return await MedicalRecord.find({ patientId })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ createdAt: -1 });
    }

    async getSchedule(userId: string) {
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) throw new Error('Doctor profile not found');

        let schedule = await Schedule.findOne({ doctorId: doctor._id });
        if (!schedule) {
            schedule = await Schedule.create({ doctorId: doctor._id });
        }
        return schedule;
    }

    async updateSchedule(userId: string, scheduleData: any) {
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) throw new Error('Doctor profile not found');

        return await Schedule.findOneAndUpdate(
            { doctorId: doctor._id },
            { $set: scheduleData },
            { new: true, upsert: true }
        );
    }
}

export default new DoctorDashboardService();
