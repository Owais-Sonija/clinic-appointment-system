const Invoice = require('./invoice.model');
const Payment = require('./payment.model');
const Appointment = require('../appointments/appointment.model');
const ApiError = require('../../utils/ApiError');
const crypto = require('crypto');

class BillingService {
    _generateInvoiceNumber() {
        return `INV-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    }

    async generateInvoiceFromAppointment(appointmentId, discount = 0, tax = 0) {
        const appointment = await Appointment.findById(appointmentId).populate('serviceId');
        if (!appointment) throw new ApiError(404, 'Appointment not found');

        // Check if invoice already exists
        const existing = await Invoice.findOne({ appointmentId });
        if (existing) throw new ApiError(400, 'Invoice already exists for this appointment');

        const services = [];
        let subtotal = 0;

        // Base consultation service mapping
        if (appointment.serviceId) {
            services.push({
                serviceName: appointment.serviceId.name,
                amount: appointment.serviceId.price
            });
            subtotal += appointment.serviceId.price;
        }

        const total = subtotal + tax - discount;

        const invoice = await Invoice.create({
            invoiceNumber: this._generateInvoiceNumber(),
            patientId: appointment.patientId,
            appointmentId: appointment._id,
            services,
            subtotal,
            tax,
            discount,
            total,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        return invoice;
    }

    async getInvoices(filters = {}) {
        return await Invoice.find({ ...filters, isDeleted: false })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });
    }

    async getInvoiceById(id) {
        const invoice = await Invoice.findOne({ _id: id, isDeleted: false })
            .populate('patientId', 'name email phone address');
        if (!invoice) throw new ApiError(404, 'Invoice not found');
        return invoice;
    }

    async recordPayment(invoiceId, paymentData) {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice || invoice.isDeleted) throw new ApiError(404, 'Invoice not found');
        if (invoice.status === 'paid') throw new ApiError(400, 'Invoice is already fully paid');

        const payment = await Payment.create({
            invoiceId: invoice._id,
            patientId: invoice.patientId,
            amount: paymentData.amount,
            method: paymentData.method,
            transactionId: paymentData.transactionId,
            notes: paymentData.notes
        });

        // Update invoice totals
        invoice.amountPaid += payment.amount;
        if (invoice.amountPaid >= invoice.total) {
            invoice.status = 'paid';
            // update appointment payment status concurrently if applicable
            if (invoice.appointmentId) {
                await Appointment.findByIdAndUpdate(invoice.appointmentId, { paymentStatus: 'paid' });
            }
        } else if (invoice.amountPaid > 0) {
            invoice.status = 'partially_paid';
            if (invoice.appointmentId) {
                await Appointment.findByIdAndUpdate(invoice.appointmentId, { paymentStatus: 'partially_paid' });
            }
        }

        await invoice.save();
        return { payment, invoice };
    }

    async getPaymentsByPatient(patientId) {
        return await Payment.find({ patientId }).populate('invoiceId', 'invoiceNumber total').sort({ paymentDate: -1 });
    }
}

module.exports = new BillingService();
