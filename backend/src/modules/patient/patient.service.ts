import Appointment from '../appointments/appointment.model';
import MedicalRecord from '../medicalRecords/medicalRecord.model';
import ApiError from '../../utils/ApiError';

class PatientService {
    async getDashboardSummary(patientId: string) {
        // Fetch upcoming appointments
        const upcomingAppointments = await Appointment.find({
            patientId,
            date: { $gte: new Date() },
            status: { $in: ['Scheduled', 'Confirmed', 'Pending'] }
        })
            .populate('doctorId', 'userId specialization') // Assuming doctor has userId for name
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ date: 1, startTime: 1 })
            .limit(5);

        // Fetch past appointments
        const pastAppointmentsCount = await Appointment.countDocuments({
            patientId,
            date: { $lt: new Date() },
            status: 'Completed'
        });

        // Fetch recent medical records
        const recentMedicalRecords = await MedicalRecord.find({
            patientId,
            isDeleted: false
        })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
            .sort({ createdAt: -1 })
            .limit(5);

        // Calculate active prescriptions
        let activePrescriptionsCount = 0;
        recentMedicalRecords.forEach(record => {
            if (record.prescriptions && record.prescriptions.length > 0) {
                // In a real app, you might check if the duration hasn't expired
                activePrescriptionsCount += record.prescriptions.length;
            }
        });

        return {
            upcomingAppointments,
            upcomingCount: await Appointment.countDocuments({
                patientId,
                date: { $gte: new Date() },
                status: { $in: ['Scheduled', 'Confirmed', 'Pending'] }
            }),
            pastAppointmentsCount,
            recentMedicalRecords,
            activePrescriptionsCount,
        };
    }

    async getMedicalRecords(patientId: string) {
        return MedicalRecord.find({
            patientId,
            isDeleted: false
        })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
            .populate('appointmentId')
            .sort({ createdAt: -1 });
    }

    async getPrescriptions(patientId: string) {
        const records = await MedicalRecord.find({
            patientId,
            isDeleted: false
        })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
            .sort({ createdAt: -1 });

        // Extract prescriptions and attach doctor context
        const prescriptions: any[] = [];
        records.forEach(record => {
            if (record.prescriptions && record.prescriptions.length > 0) {
                record.prescriptions.forEach(rx => {
                    prescriptions.push({
                        ...rx,
                        recordId: record._id,
                        doctorName: (record.doctorId as any)?.userId?.name,
                        date: record.createdAt
                    });
                });
            }
        });

        return prescriptions;
    }
}

export default new PatientService();
