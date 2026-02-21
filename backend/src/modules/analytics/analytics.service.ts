import Appointment from '../appointments/appointment.model';
import Invoice from '../billing/invoice.model';
import Inventory from '../inventory/inventory.model';

class AnalyticsService {
    async getDashboardMetrics() {
        // Run all queries concurrently for performance
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

    private async getAppointmentStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pipeline = [
            {
                $match: {
                    date: { $gte: today },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ];

        const results = await Appointment.aggregate(pipeline);

        // Format to easily consumable object mapped via string indexes
        const formatted: Record<string, number> = {
            Scheduled: 0,
            Completed: 0,
            Cancelled: 0,
            'No Show': 0,
            Total: 0
        };

        results.forEach((stat: any) => {
            if (stat._id) {
                formatted[stat._id] = stat.count;
                formatted.Total += stat.count;
            }
        });

        return formatted;
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
