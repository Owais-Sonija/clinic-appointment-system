import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clinic Management System API',
            version: '2.0.0',
            description: 'Enterprise-grade REST API for a single-clinic healthcare management system. Covers Authentication, Appointments, Doctors, Patients, EMR, Billing, Inventory, Staff, and Analytics.',
            contact: {
                name: 'Admin',
                email: 'admin@clinic.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication & Registration' },
            { name: 'Users', description: 'User Management (Admin)' },
            { name: 'Doctors', description: 'Doctor profiles and schedules' },
            { name: 'Appointments', description: 'Booking, rescheduling, and management' },
            { name: 'Clinic', description: 'Clinic settings and services' },
            { name: 'Staff', description: 'Staff management and attendance' },
            { name: 'EMR', description: 'Electronic Medical Records' },
            { name: 'Inventory', description: 'Medicine and supply management' },
            { name: 'Billing', description: 'Invoices and payments' },
            { name: 'Analytics', description: 'Dashboard aggregations' },
            { name: 'Notifications', description: 'In-app and email notifications' }
        ],
        paths: {
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['patient', 'doctor', 'receptionist', 'nurse', 'admin'] } }, required: ['name', 'email', 'password'] } } } },
                    responses: { '201': { description: 'User registered successfully' } }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user',
                    requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } } },
                    responses: { '200': { description: 'Login successful with JWT token' } }
                }
            },
            '/api/auth/profile': {
                get: {
                    tags: ['Auth'],
                    summary: 'Get current user profile',
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'User profile data' } }
                }
            },
            '/api/doctors': {
                get: {
                    tags: ['Doctors'],
                    summary: 'Get all doctors',
                    responses: { '200': { description: 'List of all doctor profiles' } }
                }
            },
            '/api/appointments': {
                get: {
                    tags: ['Appointments'],
                    summary: 'Get all appointments (filtered by role)',
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'List of appointments' } }
                },
                post: {
                    tags: ['Appointments'],
                    summary: 'Book a new appointment',
                    security: [{ bearerAuth: [] }],
                    requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { doctorId: { type: 'string' }, serviceId: { type: 'string' }, date: { type: 'string', format: 'date' }, startTime: { type: 'string' }, notes: { type: 'string' } } } } } },
                    responses: { '201': { description: 'Appointment booked' } }
                }
            },
            '/api/clinic/settings': {
                get: {
                    tags: ['Clinic'],
                    summary: 'Get clinic settings',
                    responses: { '200': { description: 'Clinic configuration' } }
                }
            },
            '/api/clinic/services': {
                get: {
                    tags: ['Clinic'],
                    summary: 'Get all clinic services',
                    responses: { '200': { description: 'Service list' } }
                }
            },
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users (Admin/Receptionist)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'role', in: 'query', schema: { type: 'string' }, description: 'Filter by role' }],
                    responses: { '200': { description: 'List of users' } }
                }
            },
            '/api/staff': {
                get: {
                    tags: ['Staff'],
                    summary: 'Get all staff members',
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'Staff list' } }
                }
            },
            '/api/emr/patient/{patientId}': {
                get: {
                    tags: ['EMR'],
                    summary: 'Get patient medical history',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { '200': { description: 'Patient EMR records' } }
                }
            },
            '/api/inventory': {
                get: {
                    tags: ['Inventory'],
                    summary: 'Get all inventory items',
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'Inventory list' } }
                }
            },
            '/api/billing/invoices': {
                get: {
                    tags: ['Billing'],
                    summary: 'Get all invoices',
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'Invoice list' } }
                }
            },
            '/api/analytics/dashboard': {
                get: {
                    tags: ['Analytics'],
                    summary: 'Get admin dashboard analytics',
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'Dashboard aggregation data' } }
                }
            }
        }
    },
    apis: [] // We define paths inline above
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Clinic CMS API Docs'
    }));
};
