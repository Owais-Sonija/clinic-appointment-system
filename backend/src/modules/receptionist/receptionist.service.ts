import Appointment from '../appointments/appointment.model';
import User from '../auth/user.model';
import Invoice from '../billing/invoice.model';
import QueueStatus from './queueStatus.model';
import ApiError from '../../utils/apiError';
import AuditLog from '../admin/auditLog.model';

class ReceptionistService {
    // Audit internal helper
    private async logAction(userId: any, action: string, entity: string, entityId: any, prev: any, next: any) {
        await AuditLog.create({
            userId, role: 'receptionist', action, entity, entityId, previousValue: prev, newValue: next
        });
    }

    async getDashboardSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.find({ date: { $gte: today, $lt: tomorrow } });

        const stats = {
            totalToday: appointments.length,
            checkedIn: appointments.filter(a => ['CheckedIn', 'vitals_recorded', 'ready_for_doctor'].includes(a.status)).length,
            waiting: appointments.filter(a => a.status === 'Scheduled').length,
            walkInsToday: appointments.filter(a => a.reason?.toLowerCase().includes('walk-in')).length,
            cancelledToday: appointments.filter(a => a.status === 'Cancelled').length
        };

        return stats;
    }

    async registerPatient(data: any, receptionistId: string) {
        if (data.email) {
            const existing = await User.findOne({ email: data.email });
            if (existing) throw new ApiError(400, "Email already in use");
        }

        // Ensure default password for receptionist-registered patients
        const password = data.password || 'Patient123!';

        const patient = await User.create({
            name: data.name,
            email: data.email || null, // Allow null if optional
            password,
            phone: data.phone,
            role: 'patient',
            isVerified: true // Auto verified if registered at front desk
        });

        await this.logAction(receptionistId, 'REGISTER_PATIENT', 'User', patient._id, null, { name: patient.name, phone: patient.phone });
        return patient;
    }

    async getPatients(search: string) {
        const query: any = { role: 'patient' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        return await User.find(query).select('-password');
    }

    async getPatientById(id: string) {
        return await User.findOne({ _id: id, role: 'patient' }).select('-password');
    }

    async bookAppointment(data: any, receptionistId: string) {
        const appointment = await Appointment.create({
            ...data,
            createdBy: receptionistId
        });
        await this.logAction(receptionistId, 'CREATE_APPOINTMENT', 'Appointment', appointment._id, null, appointment);
        return appointment;
    }

    async getQueue() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const queue = await QueueStatus.find({
            createdAt: { $gte: today, $lt: tomorrow }
        })
            .populate({
                path: 'appointmentId',
                populate: [
                    { path: 'patientId', select: 'name phone' },
                    { path: 'doctorId', populate: { path: 'userId', select: 'name' } }
                ]
            })
            .sort({ priority: 1, checkInTime: 1 });

        return queue;
    }

    async checkInPatient(appointmentId: string, receptionistId: string) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new ApiError(404, "Appointment not found");
        if (appointment.status !== 'Scheduled') throw new ApiError(400, `Cannot check-in. Status is currently: ${appointment.status}`);

        const prevStatus = appointment.status;
        appointment.status = 'CheckedIn';
        await appointment.save();

        const queueItem = await QueueStatus.create({
            appointmentId: appointment._id,
            status: 'Waiting',
            priority: appointment.reason?.toLowerCase().includes('emergency') ? 'Emergency' : 'Normal',
            checkInTime: new Date()
        });

        await this.logAction(receptionistId, 'CHECK_IN_PATIENT', 'Appointment', appointment._id, { status: prevStatus }, { status: 'CheckedIn' });
        return queueItem;
    }

    async updateQueueStatus(queueId: string, payload: any, receptionistId: string) {
        const queue = await QueueStatus.findById(queueId);
        if (!queue) throw new ApiError(404, "Queue item not found");

        Object.assign(queue, payload);
        await queue.save();

        await this.logAction(receptionistId, 'UPDATE_QUEUE', 'QueueStatus', queue._id, null, payload);
        return queue;
    }

    async cancelAppointment(appointmentId: string, reason: string, receptionistId: string) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new ApiError(404, "Appointment not found");

        const oldStatus = appointment.status;
        appointment.status = 'Cancelled';
        appointment.cancellationReason = reason;
        await appointment.save();

        await this.logAction(receptionistId, 'CANCEL_APPOINTMENT', 'Appointment', appointment._id, { status: oldStatus }, { status: 'Cancelled', reason });
        return appointment;
    }

    async getAppointments(date?: string) {
        let filter: any = {};
        if (date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            const nd = new Date(d);
            nd.setDate(nd.getDate() + 1);
            filter.date = { $gte: d, $lt: nd };
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            filter.date = { $gte: today, $lt: tomorrow };
        }

        return await Appointment.find(filter)
            .populate('patientId', 'name phone email')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ time: 1 });
    }

    async getInvoices() {
        return await Invoice.find()
            .populate('patientId', 'name phone')
            .populate('appointmentId')
            .sort({ date: -1 });
    }

    async generateInvoice(data: any, receptionistId: string) {
        const invoice = await Invoice.create({
            ...data,
            createdBy: receptionistId
        });
        await this.logAction(receptionistId, 'GENERATE_INVOICE', 'Invoice', invoice._id, null, invoice);
        return invoice;
    }

    async payInvoice(invoiceId: string, method: string, receptionistId: string) {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) throw new ApiError(404, "Invoice not found");
        if (invoice.status === 'Paid') throw new ApiError(400, "Invoice is already paid");

        const prevState = invoice.status;
        invoice.status = 'Paid';
        if (method) invoice.paymentMethod = method; // Assuming schema has paymentMethod
        const paidAt = new Date();
        // Assume paidAt exists on invoice schema or we just rely on updatedAt
        await invoice.save();

        await this.logAction(receptionistId, 'PAY_INVOICE', 'Invoice', invoice._id, { status: prevState }, { status: 'Paid', method, paidAt });
        return invoice;
    }

    async getReports() {
        // Daily operational reports
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.find({ date: { $gte: today, $lt: tomorrow } });
        const invoices = await Invoice.find({ createdAt: { $gte: today, $lt: tomorrow }, status: 'Paid' });

        return {
            appointmentsPerDay: appointments.length,
            walkInsPerDay: appointments.filter(a => a.reason?.toLowerCase().includes('walk-in')).length,
            cancellationsPerDay: appointments.filter(a => a.status === 'Cancelled').length,
            revenueCollectedToday: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
        };
    }
}

export default new ReceptionistService();
