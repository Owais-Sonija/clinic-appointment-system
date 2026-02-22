import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

import User from './src/modules/users/user.model';
import Doctor from './src/modules/doctors/doctor.model';
import Appointment from './src/modules/appointments/appointment.model';
import Service from './src/modules/clinic/service.model';
import Inventory from './src/modules/inventory/inventory.model';
import MedicalRecord from './src/modules/medicalRecords/medicalRecord.model';
import Invoice from './src/modules/billing/invoice.model';
import Staff from './src/modules/staff/staff.model';
import Clinic from './src/modules/clinic/clinic.model';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        console.log('Dropping database to clear old schema indexes...');
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }

        console.log('[1/7] Creating Clinic Settings...');
        await Clinic.create({
            name: "Antigravity Prime Clinic",
            email: "contact@antigravityhealth.com",
            phone: "+1 555-0198",
            address: "123 Quantum Drive, Silicon Valley, CA",
            workingHours: [
                { day: "Monday", startTime: "09:00", endTime: "17:00", isClosed: false },
                { day: "Tuesday", startTime: "09:00", endTime: "17:00", isClosed: false },
                { day: "Wednesday", startTime: "09:00", endTime: "17:00", isClosed: false },
                { day: "Thursday", startTime: "09:00", endTime: "17:00", isClosed: false },
                { day: "Friday", startTime: "09:00", endTime: "17:00", isClosed: false },
                { day: "Saturday", startTime: "", endTime: "", isClosed: true },
                { day: "Sunday", startTime: "", endTime: "", isClosed: true }
            ]
        });

        console.log('[2/7] Creating Admin, Receptionist & Nurse...');
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@clinic.com',
            password: 'password123',
            role: 'admin',
            isActive: true
        });

        const receptionistUser = await User.create({
            name: 'Reception Desk',
            email: 'reception@clinic.com',
            password: 'password123',
            role: 'receptionist',
            isActive: true
        });
        await Staff.create({
            userId: receptionistUser._id,
            department: 'Front Desk',
            designation: 'Lead Receptionist',
            shiftStartTime: "09:00",
            shiftEndTime: "17:00",
            salary: 45000,
            attendance: []
        });

        const nurseUser = await User.create({
            name: 'Nurse Joy',
            email: 'nurse@clinic.com',
            password: 'password123',
            role: 'nurse',
            isActive: true
        });
        await Staff.create({
            userId: nurseUser._id,
            department: 'Nursing',
            designation: 'Senior Nurse',
            shiftStartTime: "09:00",
            shiftEndTime: "17:00",
            salary: 55000,
            attendance: []
        });

        console.log('[3/7] Creating Doctors...');
        const doc1User = await User.create({
            name: 'Dr. Sarah Connor',
            email: 'sarah@clinic.com',
            password: 'password123',
            role: 'doctor',
            isActive: true
        });
        const doc1 = await Doctor.create({
            userId: doc1User._id,
            specialization: 'Cardiology',
            experience: 12,
            qualification: 'MD, FACC',
            consultationFee: 200,
            bio: 'Expert in cardiovascular health and advanced heart conditions.'
        });

        const doc2User = await User.create({
            name: 'Dr. John Smith',
            email: 'john@clinic.com',
            password: 'password123',
            role: 'doctor',
            isActive: true
        });
        const doc2 = await Doctor.create({
            userId: doc2User._id,
            specialization: 'General Practice',
            experience: 8,
            qualification: 'MBBS, MD',
            consultationFee: 100,
            bio: 'Dedicated primary care physician focusing on holistic wellness.'
        });

        console.log('[4/7] Creating Services...');
        const s1 = await Service.create({ name: 'General Consultation', description: 'Standard primary care checkup', price: 100, icon: 'FaStethoscope', isActive: true });
        const s2 = await Service.create({ name: 'Cardiac Screening', description: 'Comprehensive heart evaluation', price: 250, icon: 'FaHeartbeat', isActive: true });
        const s3 = await Service.create({ name: 'Blood Test Panel', description: 'Full CBC and metabolic panel', price: 80, icon: 'FaVial', isActive: true });
        const services = [s1, s2, s3];

        console.log('[5/7] Creating 20 Patients...');
        const patients: any[] = [];
        for (let i = 0; i < 20; i++) {
            const patient = await User.create({
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: 'password123',
                role: 'patient',
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                isActive: true
            });
            patients.push(patient);
        }

        console.log('[6/7] Creating 10 Inventory Items...');
        for (let i = 0; i < 10; i++) {
            await Inventory.create({
                itemName: faker.commerce.productName(),
                category: faker.helpers.arrayElement(['Medicine', 'Equipment', 'Consumable']),
                stockQuantity: faker.number.int({ min: 10, max: 200 }),
                unit: 'boxes',
                purchasePrice: parseFloat(faker.commerce.price({ min: 5, max: 80 })),
                sellingPrice: parseFloat(faker.commerce.price({ min: 85, max: 150 })),
                supplier: faker.company.name(),
                reorderLevel: 20
            });
        }

        console.log('[7/7] Creating 50 Appointments, Invoices & Medical Records...');
        const statuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

        let dayOffset = 1;

        for (let i = 0; i < 50; i++) {
            const p = faker.helpers.arrayElement(patients);
            const d = faker.helpers.arrayElement([doc1, doc2]);
            const s = faker.helpers.arrayElement(services);
            const status = faker.helpers.arrayElement(statuses);

            const apptDate = new Date();
            apptDate.setDate(apptDate.getDate() - 25 + dayOffset);
            apptDate.setHours(0, 0, 0, 0); // normalize time for index
            dayOffset++;

            const appt = await Appointment.create({
                patientId: p._id,
                doctorId: d._id,
                serviceId: s._id,
                date: apptDate,
                startTime: '10:00',
                endTime: '10:30',
                status: status,
                notes: faker.lorem.sentence()
            });

            if (status === 'Completed') {
                // Generate Medical Record
                await MedicalRecord.create({
                    patientId: p._id,
                    doctorId: d._id,
                    appointmentId: appt._id,
                    diagnosis: faker.lorem.words(3),
                    symptoms: [faker.lorem.word(), faker.lorem.word()],
                    prescriptions: [{
                        medicineName: faker.helpers.arrayElement(['Amoxicillin', 'Lisinopril', 'Levothyroxine', 'Metformin', 'Amlodipine']),
                        dosage: faker.helpers.arrayElement(['50mg', '100mg', '500mg']),
                        frequency: faker.helpers.arrayElement(['1x day', '2x day', 'As needed']),
                        duration: faker.helpers.arrayElement(['7 days', '14 days', '30 days'])
                    }],
                    vitals: {
                        bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
                        heartRate: faker.number.int({ min: 60, max: 100 }),
                        temperature: 98.6,
                        weight: faker.number.int({ min: 50, max: 100 }),
                        height: 175
                    }
                });

                // Generate Invoice
                await Invoice.create({
                    patientId: p._id,
                    appointmentId: appt._id,
                    invoiceNumber: 'INV-' + faker.string.alphanumeric(6).toUpperCase(),
                    items: [{
                        description: s.name,
                        amount: s.price,
                        type: 'Consultation',
                        referenceId: s._id
                    }],
                    subtotal: s.price,
                    tax: 0,
                    discount: 0,
                    totalAmount: s.price,
                    amountPaid: s.price,
                    status: 'Paid',
                    dueDate: new Date()
                });
            }
        }

        console.log('✅ Master Seeding Complete! Database is populated with production-grade dummy data.');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

importData();
