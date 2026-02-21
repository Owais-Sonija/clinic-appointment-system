const axios = require('axios');

async function seedData() {
    try {
        const api = axios.create({ baseURL: 'http://localhost:5000' });

        // Register Admin
        const adminRes = await api.post('/api/auth/register', {
            name: "Super Admin",
            email: "admin@clinic.com",
            password: "password123",
            role: "admin"
        }, { validateStatus: () => true });

        // Get Cookie
        const cookies = adminRes.headers['set-cookie'];
        let cookieStr = '';
        if (cookies) {
            cookieStr = Array.isArray(cookies) ? cookies.map(c => c.split(';')[0]).join('; ') : cookies.split(';')[0];
        }

        if (!cookieStr) {
            // Try to Login if already exists
            const loginRes = await api.post('/api/auth/login', {
                email: "admin@clinic.com",
                password: "password123"
            });
            const lCookies = loginRes.headers['set-cookie'];
            cookieStr = Array.isArray(lCookies) ? lCookies.map(c => c.split(';')[0]).join('; ') : lCookies.split(';')[0];
        }

        const authConfig = { headers: { Cookie: cookieStr } };

        // 1. Create Services
        await api.post('/api/clinic/services', {
            name: "General Consultation",
            description: "Standard primary care checkup",
            duration: 30,
            price: 150,
            isActive: true
        }, authConfig);

        await api.post('/api/clinic/services', {
            name: "Dental Cleaning",
            description: "Deep dental hygiene and cleaning session",
            duration: 60,
            price: 200,
            isActive: true
        }, authConfig);

        // 2. Create Doctors
        await api.post('/api/doctors', {
            userId: "652414123123123123123123", // Dummy valid 24 char hex
            specialization: "General Physician",
            qualifications: ["MD", "MBBS"],
            experience: 10,
            fees: 150,
            schedule: {
                monday: { isWorking: true, shifts: [{ startTime: "09:00", endTime: "17:00" }] },
                tuesday: { isWorking: true, shifts: [{ startTime: "09:00", endTime: "17:00" }] }
            }
        }, authConfig);

        console.log("Seeding Database Complete. Doctors and Services populated.");
    } catch (e) {
        console.error("Seeding Failed:", e.message);
    }
}
seedData();
