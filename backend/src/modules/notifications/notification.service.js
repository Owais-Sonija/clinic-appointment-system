const Notification = require('./notification.model');
const nodemailer = require('nodemailer');

class NotificationService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: process.env.SMTP_PORT || 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async createNotification(userId, type, message, relatedEntity = null) {
        return await Notification.create({
            userId,
            type,
            message,
            relatedEntity
        });
    }

    async getNotifications(userId) {
        return await Notification.find({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    async markAsRead(id) {
        return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }

    async sendEmail(to, subject, text, html) {
        if (!process.env.SMTP_USER) {
            console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
            return;
        }

        const mailOptions = {
            from: process.env.FROM_EMAIL || 'noreply@clinic.com',
            to,
            subject,
            text,
            html
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

module.exports = new NotificationService();
