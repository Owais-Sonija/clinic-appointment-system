const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Security and Utility Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Body limit for basic sanitization
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const doctorRoutes = require('./modules/doctors/doctor.routes');
const appointmentRoutes = require('./modules/appointments/appointment.routes');
const clinicRoutes = require('./modules/clinic/clinic.routes');
const staffRoutes = require('./modules/staff/staff.routes');
const emrRoutes = require('./modules/medicalRecords/medicalRecord.routes');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const billingRoutes = require('./modules/billing/billing.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

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
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running solidly...' });
});

// Centralized error handling
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
