import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let nurseToken = '';
let pharmacistToken = '';
let authHeader = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

async function runTests() {
    console.log('--- Starting Role-Based API Tests ---');
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
                await new Promise(res => setTimeout(res, 1000));
            }
        }

        if (!serverUp) {
            throw new Error("Server not responding at /api/health");
        }
        assert(true, 'Server Health Check');

        // --- NURSE TESTS ---
        console.log('\n--- Testing Nurse Flow (nancy@clinicos.com) ---');
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'nancy@clinicos.com',
                password: 'password123'
            });
            assert(loginRes.status === 200 && loginRes.data.data.accessToken, 'Nurse Login successful');
            nurseToken = loginRes.data.data.accessToken;
        } catch (e: any) {
            assert(false, 'Nurse Login failed', e?.response?.data || e.message);
        }

        if (nurseToken) {
            try {
                const summary = await axios.get(`${BASE_URL}/nurse/dashboard-summary`, authHeader(nurseToken));
                assert(summary.status === 200, 'Nurse Dashboard Summary Fetched');
            } catch (e: any) {
                assert(false, 'Nurse Dashboard Summary Fetch Failed', e?.response?.data || e.message);
            }

            try {
                const queue = await axios.get(`${BASE_URL}/nurse/appointments`, authHeader(nurseToken));
                assert(queue.status === 200 && Array.isArray(queue.data.data), 'Nurse Appointments Fetched');
            } catch (e: any) {
                assert(false, 'Nurse Appointments Fetch Failed', e?.response?.data || e.message);
            }
        }

        // --- PHARMACIST TESTS ---
        console.log('\n--- Testing Pharmacist Flow (phil@clinicos.com) ---');
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'phil@clinicos.com',
                password: 'password123'
            });
            assert(loginRes.status === 200 && loginRes.data.data.accessToken, 'Pharmacist Login successful');
            pharmacistToken = loginRes.data.data.accessToken;
        } catch (e: any) {
            assert(false, 'Pharmacist Login failed', e?.response?.data || e.message);
        }

        if (pharmacistToken) {
            try {
                const summary = await axios.get(`${BASE_URL}/pharmacist/dashboard-summary`, authHeader(pharmacistToken));
                assert(summary.status === 200, 'Pharmacist Dashboard Summary Fetched');
            } catch (e: any) {
                assert(false, 'Pharmacist Dashboard Summary Fetch Failed', e?.response?.data || e.message);
            }

            try {
                const inventory = await axios.get(`${BASE_URL}/pharmacist/inventory`, authHeader(pharmacistToken));
                assert(inventory.status === 200 && Array.isArray(inventory.data.data), 'Pharmacist Inventory Fetched');
            } catch (e: any) {
                assert(false, 'Pharmacist Inventory Fetch Failed', e?.response?.data || e.message);
            }

            try {
                const prescriptions = await axios.get(`${BASE_URL}/pharmacist/prescriptions`, authHeader(pharmacistToken));
                assert(prescriptions.status === 200 && Array.isArray(prescriptions.data.data), 'Pharmacist Prescriptions Fetched');
            } catch (e: any) {
                assert(false, 'Pharmacist Prescriptions Fetch Failed', e?.response?.data || e.message);
            }
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
