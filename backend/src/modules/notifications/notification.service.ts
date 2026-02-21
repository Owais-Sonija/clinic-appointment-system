import Notification, { INotification } from './notification.model';
import nodemailer, { Transporter } from 'nodemailer';

class NotificationService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: Number(process.env.SMTP_PORT) || 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async createNotification(userId: string, type: 'System' | 'Appointment' | 'Billing' | 'Inventory', message: string, relatedEntity: string | null = null): Promise<INotification> {
        return await Notification.create({
            userId,
            type,
            message,
            relatedEntity
        });
    }

    async getNotifications(userId: string): Promise<INotification[]> {
        return await Notification.find({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    async markAsRead(id: string): Promise<INotification | null> {
        return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
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

export default new NotificationService();
