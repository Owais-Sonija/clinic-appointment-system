import Appointment from '../appointments/appointment.model';
import Invoice from '../billing/invoice.model';
import Inventory from '../inventory/inventory.model';
import User from '../users/user.model';
import Doctor from '../doctors/doctor.model';

class AnalyticsService {
    async getDashboardMetrics() {
        const [
            revenueMetrics,
            appointmentStats,
            lowStockItems,
            recentInvoices
        ] = await Promise.all([
            this.getRevenueMetrics(),
            this.getAppointmentStats(),
            this.getLowStockCount(),
            this.getRecentInvoices()
        ]);

        return {
            revenue: revenueMetrics,
            appointments: appointmentStats,
            inventory: {
                lowStockCount: lowStockItems
            },
            recentActivity: recentInvoices
        };
    }

    async getQuickStats(): Promise<any> {
        const [patients, doctors, appointments, revenue] = await Promise.all([
            User.countDocuments({ role: 'patient', isDeleted: false }),
            Doctor.countDocuments({ isDeleted: false }),
            Appointment.countDocuments({ isDeleted: false }),
            Invoice.aggregate([
                { $match: { isDeleted: false, status: 'Paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        return {
            totalPatients: patients,
            activeDoctors: doctors,
            totalAppointments: appointments,
            totalRevenue: revenue[0]?.total || 0
        };
    }

    async getMonthlyRevenue(): Promise<any> {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const revenue = await Invoice.aggregate([
            {
                $match: {
                    isDeleted: false,
                    status: 'Paid',
                    createdAt: { $gte: oneYearAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        return revenue;
    }

    async getAppointmentStats(): Promise<any> {
        const stats = await Appointment.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        return stats;
    }

    private async getRevenueMetrics() {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: startOfMonth },
                    status: { $in: ['Paid', 'Partial'] },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amountPaid' },
                    totalInvoices: { $sum: 1 }
                }
            }
        ];

        const result = await Invoice.aggregate(pipeline);
        return result.length > 0 ? result[0] : { totalRevenue: 0, totalInvoices: 0 };
    }

    private async getLowStockCount() {
        return await Inventory.countDocuments({
            isDeleted: false,
            $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
        });
    }

    private async getRecentInvoices() {
        return await Invoice.find({ isDeleted: false })
            .select('invoiceNumber patientId totalAmount amountPaid status createdAt')
            .populate('patientId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);
    }
}

export default new AnalyticsService();
