const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:5000',
    validateStatus: () => true
});

function getCookie(res) {
    const setCookieHeader = res.headers['set-cookie'];
    if (setCookieHeader) {
        if (Array.isArray(setCookieHeader)) {
            return setCookieHeader.map(c => c.split(';')[0]).join('; ');
        }
        return setCookieHeader.split(';')[0];
    }
    return '';
}

async function runTests() {
    console.log("=== STARTING COMPREHENSIVE BACKEND API TESTS ===");
    let passed = 0;
    let failed = 0;

    const testEndpoint = async (method, url, data, config, expectedStatus = 200, testName) => {
        try {
            const res = await api[method](url, data || config, data ? config : undefined);
            if (res.status === expectedStatus || (Array.isArray(expectedStatus) && expectedStatus.includes(res.status))) {
                console.log(`✅ PASS: ${testName} (${method.toUpperCase()} ${url})`);
                passed++;
                return res;
            } else {
                console.error(`❌ FAIL: ${testName} (${method.toUpperCase()} ${url}) - Expected ${expectedStatus}, Got ${res.status}`);
                failed++;
                return res;
            }
        } catch (e) {
            console.error(`❌ ERROR: ${testName} (${method.toUpperCase()} ${url}) - Request crashed:`, e.message);
            failed++;
        }
    };

    // 1. PUBLIC ROUTES
    await testEndpoint('get', '/api/clinic/services', null, null, [200, 304], 'Get Services');
    await testEndpoint('get', '/api/doctors', null, null, [200, 304], 'Get Doctors');
    await testEndpoint('get', '/api/clinic/settings', null, null, 200, 'Get Clinic Settings');

    // 2. AUTHENTICATION & PROTECTED PATIENT ROUTES
    const timestamp = Date.now();
    const dummyEmail = `testuser_${timestamp}@test.com`;

    const regRes = await testEndpoint('post', '/api/auth/register', {
        name: "Test Patient",
        email: dummyEmail,
        password: "password123",
        role: "patient"
    }, null, 201, 'Register New Patient');

    let patientCookie = '';
    if (regRes && regRes.status === 201) patientCookie = getCookie(regRes);

    if (patientCookie) {
        const authConfig = { headers: { Cookie: patientCookie } };

        await testEndpoint('get', '/api/auth/profile', null, authConfig, 200, 'Get Patient Profile');

        const docs = await api.get('/api/doctors');
        let firstDoctorId = docs.data?.data?.[0]?._id;

        const services = await api.get('/api/clinic/services');
        let firstServiceId = services.data?.data?.[0]?._id;

        let appointmentId = null;
        if (firstDoctorId && firstServiceId) {
            const today = new Date();
            today.setDate(today.getDate() + 2);

            const appRes = await testEndpoint('post', '/api/appointments', {
                doctorId: firstDoctorId,
                serviceId: firstServiceId,
                appointmentDate: today.toISOString().split('T')[0],
                appointmentTime: "10:00"
            }, authConfig, 201, 'Book Appointment');

            if (appRes && appRes.status === 201) appointmentId = appRes.data?.data?._id;
        }

        await testEndpoint('get', '/api/appointments', null, authConfig, 200, 'Get My Appointments');

        if (appointmentId) {
            await testEndpoint('delete', `/api/appointments/${appointmentId}`, null, authConfig, 200, 'Cancel Own Appointment');
        }
    }

    // 3. ADMIN OPERATIONS
    const adminEmail = `admin_${timestamp}@test.com`;
    const adminRegRes = await testEndpoint('post', '/api/auth/register', {
        name: "Test Admin",
        email: adminEmail,
        password: "password123",
        role: "admin"
    }, null, 201, 'Register New Admin');

    let adminCookie = '';
    if (adminRegRes && adminRegRes.status === 201) adminCookie = getCookie(adminRegRes);

    if (adminCookie) {
        const adminConfig = { headers: { Cookie: adminCookie } };
        await testEndpoint('get', '/api/staff', null, adminConfig, 200, 'Get Staff Members');
        await testEndpoint('get', '/api/inventory', null, adminConfig, 200, 'Get Inventory Items');
        await testEndpoint('get', '/api/analytics/dashboard', null, adminConfig, [200, 304], 'Get Admin Dashboard Stats');
    }

    console.log("-----------------------------------------");
    console.log(`TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log("-----------------------------------------");
    if (failed > 0) process.exit(1);
}

runTests();
