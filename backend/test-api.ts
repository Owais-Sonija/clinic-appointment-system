import axios from 'axios';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let doctorToken = '';
let authHeader = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log('--- Starting Backend API Integration Tests ---');
    let passed = 0;
    let failed = 0;

    const assert = (condition: boolean, name: string, details?: any) => {
        if (condition) {
            console.log(`✅ ${name}`);
            passed++;
        } else {
            console.error(`❌ ${name}`);
            if (details) console.error(JSON.stringify(details, null, 2));
            failed++;
        }
    };

    try {
        // Wait for server to be responsive
        let serverUp = false;
        for (let i = 0; i < 5; i++) {
            try {
                await axios.get(`${BASE_URL}/health`);
                serverUp = true;
                break;
            } catch (e) {
                await delay(1000);
            }
        }

        if (!serverUp) {
            throw new Error("Server not responding at /api/health");
        }
        assert(true, 'Server Health Check');

        // 1. Auth Tests
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@medi.com',
                password: 'Admin@123'
            });
            assert(loginRes.status === 200 && loginRes.data.data.accessToken, 'Admin Login successful');
            adminToken = loginRes.data.data.accessToken;
        } catch (e: any) {
            assert(false, 'Admin Login failed', e?.response?.data || e.message);
        }

        try {
            const docLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'james@clinicos.com',
                password: 'password123'
            });
            assert(docLoginRes.status === 200, 'Doctor Login successful');
            doctorToken = docLoginRes.data.data.accessToken;
        } catch (e: any) {
            assert(false, 'Doctor Login failed', e?.response?.data || e.message);
        }

        // 2. Admin Module Tests
        try {
            const summary = await axios.get(`${BASE_URL}/admin/dashboard-summary`, authHeader(adminToken));
            assert(summary.status === 200 && summary.data.data, 'Admin Dashboard Summary Fetched');
        } catch (e: any) {
            assert(false, 'Admin Dashboard Summary Fetch Failed', e?.response?.data || e.message);
        }

        try {
            const users = await axios.get(`${BASE_URL}/admin/users`, authHeader(adminToken));
            assert(users.status === 200 && Array.isArray(users.data.data), 'Admin Global Users Fetched');
        } catch (e: any) {
            assert(false, 'Admin Global Users Fetch Failed', e?.response?.data || e.message);
        }

        // 3. Doctor Module Tests
        try {
            const pList = await axios.get(`${BASE_URL}/doctor/appointments`, authHeader(doctorToken));
            assert(pList.status === 200, 'Doctor Appointments Fetched');
        } catch (e: any) {
            assert(false, 'Doctor Appointments Fetch Failed', e?.response?.data || e.message);
        }

        // 4. Clinical Endpoints Test (Public or Patient)
        try {
            const clinics = await axios.get(`${BASE_URL}/clinic/services`);
            assert(clinics.status === 200, 'Clinic Services Fetched');
        } catch (e: any) {
            assert(false, 'Clinic Services Fetch Failed', e?.response?.data || e.message);
        }

    } catch (err: any) {
        console.error('Test Suite Setup failed:', err.message);
    }

    console.log(`\n--- Test Summary ---`);
    console.log(`Total Passed: ${passed}`);
    console.log(`Total Failed: ${failed}`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests();
