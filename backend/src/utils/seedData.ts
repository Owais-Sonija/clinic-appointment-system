import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import User from '../modules/users/user.model';
import Doctor from '../modules/doctors/doctor.model';
import Staff from '../modules/staff/staff.model';
import Appointment from '../modules/appointments/appointment.model';
import MedicalRecord from '../modules/medicalRecords/medicalRecord.model';
import Inventory from '../modules/inventory/inventory.model';
import Invoice from '../modules/billing/invoice.model';
import Payment from '../modules/billing/payment.model';
import Service from '../modules/clinic/service.model';

dotenv.config();

const seed = async () => {
    try {
        console.log('--- Starting Phase 5 ERP Seeding ---');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clinic-erp');

        // 0. Clear existing data
        console.log('Clearing old data...');
        await Promise.all([
            User.deleteMany({}),
            Doctor.deleteMany({}),
            Staff.deleteMany({}),
            Appointment.deleteMany({}),
            MedicalRecord.deleteMany({}),
            Inventory.deleteMany({}),
            Invoice.deleteMany({}),
            Payment.deleteMany({}),
            Service.deleteMany({})
        ]);

        // 1. Create Core Users
        console.log('Creating Staff Users...');
        const adminUser = await User.create({
            name: 'Enterprise Admin',
            email: 'admin@medi.com',
            password: 'Admin@123',
            role: 'admin',
            phone: '1234567890',
            isActive: true
        });

        const doc1User = await User.create({
            name: 'Dr. James Wilson',
            email: 'james@clinicos.com',
            password: 'password123',
            role: 'doctor',
            phone: '1112223333',
            isActive: true
        });

        const doc2User = await User.create({
            name: 'Dr. Sarah Connor',
            email: 'sarah@clinicos.com',
            password: 'password123',
            role: 'doctor',
            phone: '4445556666',
            isActive: true
        });

        const receptionistUser = await User.create({
            name: 'Alice Receptionist',
            email: 'alice@clinicos.com',
            password: 'password123',
            role: 'receptionist',
            isActive: true
        });

        const pharmacistUser = await User.create({
            name: 'Philip Pharmacist',
            email: 'phil@clinicos.com',
            password: 'password123',
            role: 'pharmacist',
            isActive: true
        });

        const nurseUser = await User.create({
            name: 'Nancy Nurse',
            email: 'nancy@clinicos.com',
            password: 'password123',
            role: 'nurse',
            isActive: true
        });

        // 2. Create Doctors & Services
        console.log('Creating Doctor Profiles & Services...');
        const d1 = await Doctor.create({
            userId: doc1User._id,
            specialization: 'Cardiology',
            licenseNumber: 'DOC-12345',
            consultationFee: 150,
            experience: 15,
            qualification: 'MD, FACC',
            bio: 'Expert Cardiologist with 15 years experience.'
        });

        const d2 = await Doctor.create({
            userId: doc2User._id,
            specialization: 'Pediatrics',
            licenseNumber: 'DOC-67890',
            consultationFee: 100,
            experience: 10,
            qualification: 'MD, FAAP',
            bio: 'Passionate about child healthcare.'
        });

        const svc1 = await Service.create({ name: 'General Consultation', description: 'Standard checkup', price: 50, duration: 20 });
        const svc2 = await Service.create({ name: 'ECG Test', description: 'Electrocardiogram', price: 80, duration: 40 });
        const svc3 = await Service.create({ name: 'Child Vaccination', description: 'Pediatric immunisation', price: 40, duration: 15 });

        // 3. Create 30 Patients
        console.log('Creating 30 Patients...');
        const patients = [];
        for (let i = 0; i < 30; i++) {
            const p: any = await User.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: 'password123',
                role: 'patient',
                gender: faker.helpers.arrayElement(['Male', 'Female']),
                dateOfBirth: faker.date.birthdate({ min: 1, max: 80, mode: 'age' }),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                isActive: true
            });
            patients.push(p);
        }

        // 4. Create 15 Inventory Items
        console.log('Creating 15 Inventory Items...');
        const medicines = ['Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Metformin', 'Atorvastatin', 'Lisopril', 'Levothyroxine', 'Amlodipine', 'Omeprazole', 'Simvastatin', 'Gabapentin', 'Losartan', 'Azithromycin', 'Sertraline', 'Furosemide'];
        const inventoryItems = [];
        for (let i = 0; i < 15; i++) {
            const item = await Inventory.create({
                itemName: medicines[i],
                category: 'Medicine',
                batchNumber: 'BATCH-' + faker.string.alphanumeric(6).toUpperCase(),
                stockQuantity: faker.number.int({ min: 10, max: 200 }),
                unit: 'Tablets',
                purchasePrice: faker.number.int({ min: 2, max: 10 }),
                sellingPrice: faker.number.int({ min: 12, max: 30 }),
                supplier: faker.company.name(),
                expiryDate: faker.date.future({ years: 2 }),
                reorderLevel: 20
            });
            inventoryItems.push(item);
        }

        // 5. Create 80 Appointments
        console.log('Creating 80 Appointments...');
        const appointments = [];
        for (let i = 0; i < 80; i++) {
            const p = faker.helpers.arrayElement(patients);
            const d = faker.helpers.arrayElement([d1, d2]);
            const s = faker.helpers.arrayElement([svc1, svc2, svc3]);
            const date = faker.date.between({ from: '2025-01-01', to: '2026-12-31' });

            const apt = await Appointment.create({
                patientId: p._id,
                doctorId: d._id,
                serviceId: s._id,
                date,
                startTime: '09:00',
                endTime: '09:30',
                status: faker.helpers.arrayElement(['Scheduled', 'Completed', 'Cancelled']),
                reason: 'Routine checkup',
                paymentStatus: faker.helpers.arrayElement(['Pending', 'Paid'])
            });
            appointments.push(apt);
        }

        // 6. Create 15 Medical Records
        console.log('Creating 15 Medical Records...');
        const completedApts = appointments.filter(a => a.status === 'Completed').slice(0, 15);
        for (const apt of completedApts) {
            await MedicalRecord.create({
                patientId: apt.patientId,
                doctorId: apt.doctorId,
                appointmentId: apt._id,
                visitDate: apt.date,
                diagnosis: faker.lorem.sentence(),
                vitals: {
                    bloodPressure: '120/80',
                    heartRate: 72,
                    temperature: 98.6,
                    weight: 70
                },
                prescriptions: [
                    { medicineName: faker.helpers.arrayElement(medicines), dosage: '1 tablet', frequency: 'Twice a day', duration: '5 days' }
                ]
            });
        }

        // 7. Create Sample Invoices & Payments
        console.log('Creating Invoices & Payments...');
        for (let i = 0; i < 20; i++) {
            const apt = faker.helpers.arrayElement(appointments);
            const subtotal = faker.number.int({ min: 50, max: 200 });
            const tax = subtotal * 0.05;
            const total = subtotal + tax;

            const inv = await Invoice.create({
                patientId: apt.patientId,
                appointmentId: apt._id,
                invoiceNumber: `INV-2026-${(1000 + i)}`,
                items: [{ description: 'Consultation', amount: subtotal, type: 'Consultation' }],
                subtotal,
                tax,
                totalAmount: total,
                amountPaid: apt.paymentStatus === 'Paid' ? total : 0,
                status: apt.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid',
                dueDate: faker.date.future()
            });

            if (inv.status === 'Paid') {
                await Payment.create({
                    invoiceId: inv._id,
                    patientId: inv.patientId,
                    amount: total,
                    paymentMethod: 'Cash',
                    status: 'Success'
                });
            }
        }

        console.log('--- Seeding Completed Successfully! ---');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seed();
