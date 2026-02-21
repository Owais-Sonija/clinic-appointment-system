const Appointment = require('../appointments/appointment.model');
const User = require('../users/user.model');
const Doctor = require('../doctors/doctor.model');
const Invoice = require('../billing/invoice.model');
const Inventory = require('../inventory/inventory.model');

class AnalyticsService {
    async getAdminDashboardMetrics() {
        const totalPatients = await User.countDocuments({ role: 'patient', isActive: true });
        const totalDoctors = await Doctor.countDocuments({ isDeleted: false });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalAppointmentsMonthly = await Appointment.countDocuments({
            appointmentDate: { $gte: firstDayOfMonth },
            isDeleted: false
        });

        // Revenue Chart (Monthly)
        const revenueAggregation = await Invoice.aggregate([
            {
                $match: {
                    status: { $in: ['paid', 'partially_paid'] },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalRevenue: { $sum: "$amountPaid" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Appointment status breakdown
        const appointmentStatusBreakdown = await Appointment.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Popular Service (Extracting from Invoices for simplicity, or Appointments)
        const popularServices = await Appointment.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$serviceId", count: { $sum: 1 } } },
            { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'serviceDetails' } },
            { $unwind: "$serviceDetails" },
            { $project: { name: "$serviceDetails.name", count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Inventory Low Stock
        const lowStockItems = await Inventory.find({ isDeleted: false, $expr: { $lte: ["$stockQuantity", "$reorderLevel"] } }).limit(5);

        return {
            totalPatients,
            totalDoctors,
            totalAppointmentsMonthly,
            revenueAggregation,
            appointmentStatusBreakdown,
            popularServices,
            lowStockItems
        };
    }
}

module.exports = new AnalyticsService();
