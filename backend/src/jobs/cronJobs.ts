import cron from 'node-cron';
import Appointment from '../modules/appointments/appointment.model';
import Notification from '../modules/notifications/notification.model';
import Inventory from '../modules/inventory/inventory.model';
import User from '../modules/users/user.model';
import logger from '../utils/logger';

/**
 * Appointment Reminder: runs every hour, finds appointments in the next 24h
 * and creates notification records for patients.
 */
const appointmentReminderJob = cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const upcoming = await Appointment.find({
            date: { $gte: now, $lte: in24h },
            status: 'Scheduled',
            isDeleted: false
        }).populate('patientId', 'name');

        for (const apt of upcoming) {
            // Avoid duplicate reminders by checking if one already exists
            const exists = await Notification.findOne({
                relatedEntity: apt._id,
                type: 'Appointment',
                message: { $regex: /reminder/i }
            });
            if (!exists) {
                await Notification.create({
                    userId: apt.patientId,
                    type: 'Appointment',
                    message: `Reminder: You have an appointment on ${new Date(apt.date).toLocaleDateString()} at ${apt.startTime}.`,
                    relatedEntity: apt._id
                });
            }
        }
        logger.info(`[CRON] Appointment reminders sent for ${upcoming.length} appointments`);
    } catch (err) {
        logger.error('[CRON] Appointment reminder error:', err);
    }
});

/**
 * Inventory Alerts: runs daily at 7 AM, checks for low stock and expiring items.
 */
const inventoryAlertJob = cron.schedule('0 7 * * *', async () => {
    try {
        // Low stock
        const lowStock = await Inventory.find({
            $expr: { $lte: ['$stockQuantity', '$reorderLevel'] },
            isDeleted: false
        });

        // Expiring within 30 days
        const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const expiringSoon = await Inventory.find({
            expiryDate: { $lte: thirtyDays, $gte: new Date() },
            isDeleted: false
        });

        // Notify all admins
        const admins = await User.find({ role: 'admin', isActive: true });

        for (const admin of admins) {
            if (lowStock.length > 0) {
                await Notification.create({
                    userId: admin._id,
                    type: 'Inventory',
                    message: `⚠️ ${lowStock.length} inventory items are below reorder level.`
                });
            }
            if (expiringSoon.length > 0) {
                await Notification.create({
                    userId: admin._id,
                    type: 'Inventory',
                    message: `⏰ ${expiringSoon.length} inventory items expire within 30 days.`
                });
            }
        }
        logger.info(`[CRON] Inventory alerts: ${lowStock.length} low stock, ${expiringSoon.length} expiring`);
    } catch (err) {
        logger.error('[CRON] Inventory alert error:', err);
    }
});

export const startCronJobs = () => {
    appointmentReminderJob.start();
    inventoryAlertJob.start();
    logger.info('[CRON] All scheduled jobs started');
};
