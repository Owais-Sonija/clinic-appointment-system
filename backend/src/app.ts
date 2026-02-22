import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';
import { setupSwagger } from './config/swagger';
import { startCronJobs } from './jobs/cronJobs';

import ClinicConfig from './modules/clinic/clinicConfig.model';

const app = express();

// Security Middleware (Headers)
app.use(helmet());

// Initialize Clinic Configuration if not present
const initClinic = async () => {
    try {
        const config = await ClinicConfig.findOne();
        if (!config) {
            await ClinicConfig.create({
                name: 'MediClinic Enterprise',
                isConfigured: false
            });
            console.log('[INFO] Default Clinic Configuration initialized.');
        }
    } catch (err) {
        console.error('[ERROR] Failed to init clinic config:', err);
    }
};
initClinic();

// Start scheduled tasks
startCronJobs();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security Middleware (Placed after body parsers)
const sanitize = (obj: any) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            // NoSQL Injection prevention: remove keys starting with $ or containing .
            if (typeof key === 'string' && (/^\$/.test(key) || /\./.test(key))) {
                delete obj[key];
            } else if (typeof obj[key] === 'string') {
                // Basic XSS prevention: remove < and >
                obj[key] = obj[key].replace(/<[^>]*>?/gm, '');
            } else {
                sanitize(obj[key]);
            }
        }
    }
};

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
});

// CORS config
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for development
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);
app.use(morgan('dev'));

// Winston request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// API Documentation
setupSwagger(app);

// Routes
import authRoutes from './modules/auth/auth.routes';
import doctorRoutes from './modules/doctors/doctor.routes';
import appointmentRoutes from './modules/appointments/appointment.routes';
import clinicRoutes from './modules/clinic/clinic.routes';
import staffRoutes from './modules/staff/staff.routes';
import emrRoutes from './modules/medicalRecords/medicalRecord.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import billingRoutes from './modules/billing/billing.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import contactRoutes from './modules/contact/contact.routes';

import userRoutes from './modules/users/user.routes';
import auditLogRoutes from './modules/auditLogs/auditLog.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/emr', emrRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Default health route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'API is running solidly...' });
});

// Centralized error handling
import { notFound, errorHandler } from './middleware/errorMiddleware';
app.use(notFound);
app.use(errorHandler);

export default app;
