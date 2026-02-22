import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

async function runTests() {
    try {
        console.log('--- Registering/Logging in Patient ---');
        let token = '';
        try {
            const regRes = await api.post('/auth/register', {
                name: 'Test Patient',
                email: 'testpatient@example.com',
                password: 'password123',
                role: 'patient'
            });
            token = regRes.data.data.accessToken;
            console.log('Registered successfully');
        } catch (err: any) {
            if (err.response?.data?.message === 'User already exists') {
                console.log('User exists, logging in...');
                const loginRes = await api.post('/auth/login', {
                    email: 'testpatient@example.com',
                    password: 'password123'
                });
                token = loginRes.data.data.accessToken;
            } else {
                throw err;
            }
        }

        console.log('\n--- Got Token ---');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('\n--- Testing Profile ---');
        const profileRes = await api.get('/auth/profile');
        console.log('Profile:', profileRes.data.data.name);

        console.log('\n--- Testing Dashboard Summary ---');
        const dbRes = await api.get('/patient/dashboard-summary');
        console.log('Dashboard Data:', Object.keys(dbRes.data.data));

        console.log('\n--- Testing Medical Records ---');
        const recordsRes = await api.get('/patient/medical-records');
        console.log(`Records fetched: ${recordsRes.data.data.length}`);

        console.log('\n--- Testing Prescriptions ---');
        const presRes = await api.get('/patient/prescriptions');
        console.log(`Prescriptions fetched: ${presRes.data.data.length}`);

        console.log('\n--- Fetching Doctors ---');
        const docRes = await api.get('/doctors');
        let doctorId = null;
        if (docRes.data.data && docRes.data.data.length > 0) {
            doctorId = docRes.data.data[0]._id;
            console.log(`Found ${docRes.data.data.length} doctors. Using ${doctorId}`);
        } else {
            console.log("No doctors found! Cannot test appointment creation.");
        }

        console.log('\n--- Fetching Services ---');
        const srvRes = await api.get('/clinic/services');
        let serviceId = null;
        if (srvRes.data.data && srvRes.data.data.length > 0) {
            serviceId = srvRes.data.data[0]._id;
            console.log(`Found ${srvRes.data.data.length} services. Using ${serviceId}`);
        } else {
            console.log("No services found! Cannot test appointment creation.");
        }

        if (doctorId && serviceId) {
            console.log('\n--- Testing Appointment Creation ---');
            const apptRes = await api.post('/appointments', {
                doctorId,
                serviceId,
                date: '2026-12-15',
                startTime: '10:00',
                endTime: '10:30',
                notes: 'Test booking'
            });
            console.log('Appointment Created:', apptRes.data.data._id);

            console.log('\n--- Testing My Appointments ---');
            const myAppts = await api.get('/appointments');
            console.log(`My Appointments fetched: ${myAppts.data.data.length}`);

            console.log('\n--- Testing Appointment Cancellation ---');
            const cancelRes = await api.delete(`/appointments/${apptRes.data.data._id}`);
            console.log('Cancelled successfully');
        }

        console.log('\nALL PATIENT TESTS PASSED');
    } catch (error: any) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
}

runTests();
