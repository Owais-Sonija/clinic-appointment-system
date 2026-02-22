import User from '../users/user.model';
import Doctor from '../doctors/doctor.model';
import Appointment from '../appointments/appointment.model';
import MedicalRecord from '../medicalRecords/medicalRecord.model';
import AuditLog from '../auditLogs/auditLog.model';
import SystemSettings from './systemSettings.model';
import ApiError from '../../utils/ApiError';

class AdminService {
    // Audit Log Helper
    async logAction(userId: any, role: string, action: string, entity: string, entityId: any, previousValue: any, newValue: any, ipAddress: string) {
        await AuditLog.create({
            userId, role, action, entity, entityId, previousValue, newValue, ipAddress
        });
    }

    async getDashboardSummary() {
        const totalDoctors = await Doctor.countDocuments({ isDeleted: { $ne: true } });
        const totalPatients = await User.countDocuments({ role: 'patient', isActive: true });
        const totalAppointments = await Appointment.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointments = await Appointment.countDocuments({
            date: { $gte: today, $lt: tomorrow }
        });

        // Basic aggregation for status
        const appointmentStatusBreakdown = await Appointment.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        return {
            totalDoctors,
            totalPatients,
            totalAppointments,
            todayAppointments,
            appointmentStatusBreakdown
        };
    }

    async getDoctors(query: any) {
        let filter: any = { isDeleted: { $ne: true } };

        if (query.search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: query.search, $options: 'i' } },
                    { email: { $regex: query.search, $options: 'i' } }
                ],
                role: 'doctor'
            });
            const userIds = users.map(u => u._id);
            filter.userId = { $in: userIds };
        }

        if (query.specialization) filter.specialization = { $regex: query.specialization, $options: 'i' };
        if (query.status) {
            const isActive = query.status === 'Active';
            filter.isActive = isActive;
        }

        return await Doctor.find(filter).populate('userId', 'name email phone isActive').sort({ createdAt: -1 });
    }

    async createDoctor(data: any, adminId: string, ipAddress: string) {
        const existing = await User.findOne({ email: data.email });
        if (existing) throw new ApiError(400, 'User with this email already exists');

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role: 'doctor',
            isActive: true
        });

        const doctor = await Doctor.create({
            userId: user._id,
            specialization: data.specialization,
            experience: data.experience || 0,
            qualification: data.qualification,
            consultationFee: data.consultationFee,
            bio: data.bio,
            isActive: true
        });

        await this.logAction(adminId, 'admin', 'CREATE_DOCTOR', 'Doctor', doctor._id, null, { email: user.email }, ipAddress);
        return doctor;
    }

    async updateDoctor(doctorId: string, data: any, adminId: string, ipAddress: string) {
        const doctor = await Doctor.findById(doctorId).populate('userId');
        if (!doctor) throw new ApiError(404, 'Doctor not found');

        const oldData = { specialization: doctor.specialization, consultationFee: doctor.consultationFee };

        if (data.name || data.phone || (data.password && data.password.trim() !== '')) {
            const user = await User.findById(doctor.userId);
            if (user) {
                if (data.name) user.name = data.name;
                if (data.phone) user.phone = data.phone;
                if (data.password && data.password.trim() !== '') {
                    const bcrypt = require('bcryptjs');
                    user.password = await bcrypt.hash(data.password, 10);
                }
                await user.save();
            }
        }

        if (data.specialization) doctor.specialization = data.specialization;
        if (data.experience !== undefined) doctor.experience = data.experience;
        if (data.qualification) doctor.qualification = data.qualification;
        if (data.consultationFee !== undefined) doctor.consultationFee = data.consultationFee;
        if (data.bio) doctor.bio = data.bio;

        await doctor.save();
        await this.logAction(adminId, 'admin', 'UPDATE_DOCTOR', 'Doctor', doctor._id, oldData, { specialization: doctor.specialization, consultationFee: doctor.consultationFee }, ipAddress);
        return doctor;
    }

    async updateDoctorStatus(doctorId: string, isActive: boolean, isDeleted: boolean, adminId: string, ipAddress: string) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) throw new ApiError(404, 'Doctor not found');

        if (isDeleted) {
            const activeAppointments = await Appointment.countDocuments({
                doctorId: doctor._id,
                status: { $in: ['Scheduled', 'Confirmed', 'Rescheduled'] },
                date: { $gte: new Date() }
            });
            if (activeAppointments > 0) {
                throw new ApiError(400, `Cannot delete doctor. They have ${activeAppointments} active upcoming appointments.`);
            }
        }

        const oldStatus = { isActive: doctor.isActive, isDeleted: doctor.isDeleted };

        doctor.isActive = isActive;
        if (isDeleted) doctor.isDeleted = true;
        await doctor.save();

        const user = await User.findById(doctor.userId);
        if (user) {
            user.isActive = isActive;
            if (isDeleted) user.isDeleted = true;
            await user.save();
        }

        await this.logAction(adminId, 'admin', 'UPDATE_DOCTOR_STATUS', 'Doctor', doctor._id, oldStatus, { isActive, isDeleted }, ipAddress);
        return doctor;
    }

    async getUsers(query: any) {
        let filter: any = {};
        if (query.role) filter.role = query.role;
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ];
        }
        return await User.find(filter).select('-password').sort({ createdAt: -1 });
    }

    async updateUserRole(userId: string, targetRole: string, adminId: string, ipAddress: string) {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, 'User not found');
        const oldRole = user.role;
        user.role = targetRole as 'patient' | 'doctor' | 'admin' | 'receptionist' | 'nurse' | 'pharmacist';
        await user.save();
        await this.logAction(adminId, 'admin', 'UPDATE_USER_ROLE', 'User', user._id, { role: oldRole }, { role: targetRole }, ipAddress);
        return user;
    }

    async getPatients(query: any) {
        let filter: any = { role: 'patient' };
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } }
            ];
        }
        if (query.status) {
            filter.isActive = query.status === 'Active';
        }
        return await User.find(filter).select('-password').sort({ createdAt: -1 });
    }

    async getPatientById(patientId: string) {
        const patient = await User.findOne({ _id: patientId, role: 'patient' }).select('-password');
        if (!patient) throw new ApiError(404, 'Patient not found');
        return patient;
    }

    async updatePatientStatus(patientId: string, isActive: boolean, adminId: string, ipAddress: string) {
        const patient = await User.findOne({ _id: patientId, role: 'patient' });
        if (!patient) throw new ApiError(404, 'Patient not found');

        const oldStatus = { isActive: patient.isActive };
        patient.isActive = isActive;
        await patient.save();

        await this.logAction(adminId, 'admin', 'UPDATE_PATIENT_STATUS', 'User', patient._id, oldStatus, { isActive }, ipAddress);
        return patient;
    }

    async getMedicalRecords(query: any) {
        let filter: any = {};
        if (query.patientId) filter.patientId = query.patientId;
        if (query.doctorId) filter.doctorId = query.doctorId;

        return await MedicalRecord.find(filter)
            .populate('patientId', 'name email')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ createdAt: -1 });
    }

    async getMedicalRecordById(recordId: string) {
        const record = await MedicalRecord.findById(recordId)
            .populate('patientId', 'name email phone')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .populate('appointmentId');

        if (!record) throw new ApiError(404, 'Medical record not found');
        return record;
    }

    async getAppointments(query: any) {
        let filter: any = {};
        if (query.doctorId) filter.doctorId = query.doctorId;
        if (query.patientId) filter.patientId = query.patientId;
        if (query.status) filter.status = query.status;
        if (query.date) filter.date = query.date; // Note: Date matching might need to be range based in real world

        return await Appointment.find(filter)
            .populate('patientId', 'name email phone')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ date: -1, time: 1 });
    }

    async updateAppointmentStatus(appointmentId: string, status: string, reason: string | undefined, adminId: string, ipAddress: string) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new ApiError(404, 'Appointment not found');

        const oldStatus = { status: appointment.status };
        appointment.status = status as 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
        await appointment.save();

        await this.logAction(adminId, 'admin', 'OVERRIDE_APPOINTMENT_STATUS', 'Appointment', appointment._id, oldStatus, { status, reason }, ipAddress);
        return appointment;
    }

    async getSchedules(query: any) {
        let filter: any = { isDeleted: false, isActive: true };
        if (query.doctorId) filter._id = query.doctorId;

        return await Doctor.find(filter).select('availability specialization').populate('userId', 'name email');
    }

    async getSettings() {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        return settings;
    }

    async updateSettings(data: any, adminId: string, ipAddress: string) {
        let settings = await SystemSettings.findOne();
        if (!settings) settings = new SystemSettings();

        const oldData = settings.toObject();

        if (data.appointmentDuration) settings.appointmentDuration = data.appointmentDuration;
        if (data.cancellationWindowHours) settings.cancellationWindowHours = data.cancellationWindowHours;
        if (data.clinicStartTime) settings.clinicStartTime = data.clinicStartTime;
        if (data.clinicEndTime) settings.clinicEndTime = data.clinicEndTime;
        if (data.timezone) settings.timezone = data.timezone;
        if (data.featureFlags) settings.featureFlags = data.featureFlags;

        await settings.save();

        await this.logAction(adminId, 'admin', 'UPDATE_SYSTEM_SETTINGS', 'SystemSettings', settings._id, oldData, data, ipAddress);
        return settings;
    }

    async getAuditLogs(query: any) {
        let filter: any = {};
        if (query.action) filter.action = query.action;
        if (query.entity) filter.entity = query.entity;

        return await AuditLog.find(filter).populate('userId', 'name email role').sort({ timestamp: -1 });
    }

    async sendBroadcastNotification(title: string, message: string, targetRole: string, adminId: string, ipAddress: string) {
        let userFilter: any = { isActive: true };
        if (targetRole && targetRole !== 'all') {
            userFilter.role = targetRole;
        }

        const users = await User.find(userFilter).select('_id');
        const Notification = require('../notifications/notification.model').default;

        const notifications = users.map(user => ({
            userId: user._id,
            title,
            message,
            type: 'system',
            read: false
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        await this.logAction(adminId, 'admin', 'SEND_BROADCAST_NOTIFICATION', 'Notification', null, null, { title, targetRole, count: notifications.length }, ipAddress);
        return { success: true, count: notifications.length };
    }

    async getInvoices(query: any) {
        let filter: any = {};
        if (query.status) filter.status = query.status;
        if (query.patientId) filter.patientId = query.patientId;

        return await require('../billing/invoice.model').default.find(filter)
            .populate('patientId', 'name email')
            .populate('appointmentId')
            .sort({ date: -1 });
    }

    async getRevenueSummary() {
        const Invoice = require('../billing/invoice.model').default;

        const totalRevenueResult = await Invoice.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        const monthlyRevenue = await Invoice.aggregate([
            { $match: { status: 'Paid' } },
            {
                $group: {
                    _id: { $month: '$date' },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const unpaidInvoicesResult = await Invoice.aggregate([
            { $match: { status: { $ne: 'Paid' } } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);
        const unpaidDetails = unpaidInvoicesResult.length > 0 ? unpaidInvoicesResult[0] : { total: 0, count: 0 };

        return {
            totalRevenue,
            monthlyRevenue: monthlyRevenue.map((m: any) => ({ month: m._id, revenue: m.revenue })),
            unpaidAmount: unpaidDetails.total,
            unpaidCount: unpaidDetails.count
        };
    }
}

export default new AdminService();
