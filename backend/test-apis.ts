import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    validateStatus: () => true // Don't throw errors on 400s or 500s directly, let us handle them
});

// A helper to pull the cookie from the response header
function getCookie(res) {
    const setCookieHeader = res.headers['set-cookie'];
    if (setCookieHeader) {
        // Depending on the version, sometimes it's an array, sometimes a string
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
                console.error('Response:', JSON.stringify(res.data));
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

    // 2. AUTHENTICATION (Register & Login)
    // Let's create a unique dummy patient
    const timestamp = Date.now();
    const dummyEmail = `testuser_${timestamp}@test.com`;

    const regRes = await testEndpoint('post', '/api/auth/register', {
        name: "Test Patient",
        email: dummyEmail,
        password: "password123",
        role: "patient"
    }, null, 201, 'Register New Patient');

    let patientCookie = '';
    if (regRes && regRes.status === 201) {
        patientCookie = getCookie(regRes);
    } else {
        // Attempt Login if somehow registration failed but we had a fallback
        console.log("Skipping login-dependent tests because registration failed");
    }

    if (patientCookie) {
        const authConfig = { headers: { Cookie: patientCookie } };

        // 3. PROTECTED ROUTES (Patient)
        await testEndpoint('get', '/api/auth/profile', null, authConfig, 200, 'Get Patient Profile');

        const docs = await api.get('/api/doctors');
        let firstDoctorId = null;
        if (docs.data && docs.data.data && docs.data.data.length > 0) {
            firstDoctorId = docs.data.data[0]._id;
        }

        const services = await api.get('/api/clinic/services');
        let firstServiceId = null;
        if (services.data && services.data.data && services.data.data.length > 0) {
            firstServiceId = services.data.data[0]._id;
        }

        // 4. APPOINTMENT FLOW
        let appointmentId = null;
        if (firstDoctorId && firstServiceId) {
            const today = new Date();
            today.setDate(today.getDate() + 2); // 2 days from now

            const appRes = await testEndpoint('post', '/api/appointments', {
                doctorId: firstDoctorId,
                serviceId: firstServiceId,
                appointmentDate: today.toISOString().split('T')[0],
                appointmentTime: "10:00"
            }, authConfig, 201, 'Book Appointment');

            if (appRes && appRes.data && appRes.data.data) {
                appointmentId = appRes.data.data._id;
            }
        } else {
            console.log("⚠️ Skipped Booking test because no Doctors or Services were found initially.");
        }

        await testEndpoint('get', '/api/appointments', null, authConfig, 200, 'Get My Appointments');

        if (appointmentId) {
            // Cancel the appointment so it cleans up
            await testEndpoint('delete', `/api/appointments/${appointmentId}`, null, authConfig, 200, 'Cancel Own Appointment');
        }
    }

    // Final Results
    console.log("-----------------------------------------");
    console.log(`TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log("-----------------------------------------");
    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
