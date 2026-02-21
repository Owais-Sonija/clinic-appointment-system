import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

// Security Middleware
app.use(helmet());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS config
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));

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

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/emr', emrRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Default health route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'API is running solidly...' });
});

// Centralized error handling
import { notFound, errorHandler } from './middleware/errorMiddleware';
app.use(notFound);
app.use(errorHandler);

export default app;
