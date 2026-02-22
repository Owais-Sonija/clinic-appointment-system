import Invoice, { IInvoice } from './invoice.model';
import Payment, { IPayment } from './payment.model';
import Appointment from '../appointments/appointment.model';
import Doctor from '../doctors/doctor.model';
import Service from '../clinic/service.model';
import Counter from '../../utils/counter.model';
import ApiError from '../../utils/ApiError';

class BillingService {
    async generateInvoiceFromAppointment(appointmentId: string): Promise<IInvoice> {
        const appointment = await Appointment.findById(appointmentId)
            .populate('patientId')
            .populate('doctorId')
            .populate('serviceId');

        if (!appointment) throw new ApiError(404, 'Appointment not found');

        const existingInvoice = await Invoice.findOne({ appointmentId, isDeleted: false });
        if (existingInvoice) throw new ApiError(400, 'Invoice already exists for this appointment');

        const items = [];
        let subtotal = 0;

        // 1. Add Doctor Consultation Fee
        const doctor: any = appointment.doctorId;
        if (doctor && doctor.consultationFee) {
            items.push({
                description: `Consultation with Dr. ${doctor.userId?.name || ''}`,
                amount: doctor.consultationFee,
                type: 'Consultation',
                referenceId: doctor._id
            });
            subtotal += doctor.consultationFee;
        }

        // 2. Add Service Fee if applicable
        const service: any = appointment.serviceId;
        if (service && service.price) {
            items.push({
                description: `Service: ${service.name}`,
                amount: service.price,
                type: 'Service',
                referenceId: service._id
            });
            subtotal += service.price;
        }

        const taxRate = 0.05; // Standard 5% VAT (configurable in ClinicConfig later)
        const tax = subtotal * taxRate;
        const discount = 0; // Logic for discount could be added here
        const totalAmount = subtotal + tax - discount;

        // Auto-increment Sequential Invoice Numbering
        const counter: any = await Counter.findOneAndUpdate(
            { modelName: 'Invoice', field: 'invoiceNumber' },
            { $inc: { sequence: 1 } },
            { new: true, upsert: true }
        );

        const invoiceNumber = `INV-${new Date().getFullYear()}-${counter.sequence.toString().padStart(4, '0')}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Default 7 days to pay

        const invoice = await Invoice.create({
            patientId: appointment.patientId,
            appointmentId: appointment._id,
            invoiceNumber,
            items,
            subtotal,
            tax,
            discount,
            totalAmount,
            dueDate
        });

        return invoice;
    }

    async getInvoices(filters = {}): Promise<IInvoice[]> {
        return await Invoice.find({ isDeleted: false, ...filters })
            .populate('patientId', 'name email phone')
            .sort({ createdAt: -1 });
    }

    async getInvoiceById(id: string): Promise<IInvoice> {
        const invoice = await Invoice.findOne({ _id: id, isDeleted: false })
            .populate('patientId', 'name email phone address')
            .populate('appointmentId', 'date startTime');
        if (!invoice) throw new ApiError(404, 'Invoice not found');
        return invoice;
    }

    async recordPayment(invoiceId: string, paymentData: Partial<IPayment>): Promise<{ payment: IPayment, invoice: IInvoice }> {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice || invoice.isDeleted) throw new ApiError(404, 'Invoice not found');
        if (invoice.status === 'Paid') throw new ApiError(400, 'Invoice is already fully paid');

        const amountToPay = paymentData.amount || 0;
        if (amountToPay <= 0) throw new ApiError(400, 'Payment amount must be greater than zero');
        if (amountToPay > (invoice.totalAmount - invoice.amountPaid)) {
            throw new ApiError(400, 'Payment amount exceeds remaining balance');
        }

        const payment = await Payment.create({
            invoiceId: invoice._id,
            patientId: invoice.patientId,
            ...paymentData,
            status: 'Success'
        });

        invoice.amountPaid += amountToPay;
        if (invoice.amountPaid >= invoice.totalAmount) {
            invoice.status = 'Paid';
        } else {
            invoice.status = 'Partial';
        }

        await invoice.save();

        // Update Appointment payment status if linked
        if (invoice.appointmentId) {
            await Appointment.findByIdAndUpdate(invoice.appointmentId, {
                paymentStatus: invoice.status
            });
        }

        return { payment, invoice };
    }

    async getPayments(filters = {}): Promise<IPayment[]> {
        return await Payment.find(filters)
            .populate('patientId', 'name')
            .populate('invoiceId', 'invoiceNumber totalAmount')
            .sort({ createdAt: -1 });
    }
}

export default new BillingService();
