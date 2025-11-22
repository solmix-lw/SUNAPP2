
import axios from 'axios';
import * as XLSX from 'xlsx';
import fs from 'fs';

const API_URL = 'http://192.168.0.34:3000/api';
const USERNAME = 'RPAdmin';
const PASSWORD = 'RPAdmin';

async function runTest() {
    try {
        console.log('1. Authenticating...');
        const authRes = await axios.post(`${API_URL}/auth/login`, {
            username: USERNAME,
            password: PASSWORD
        });
        const token = authRes.data.token;
        console.log('Authenticated successfully.');

        console.log('2. Generating test data (2000 items)...');
        const parts = [];
        for (let i = 0; i < 2000; i++) {
            parts.push({
                partNumber: `TEST-PART-${Date.now()}-${i}`,
                partName: `Test Part ${i}`,
                description: `Description for part ${i}`,
                category: 'General',
                price: parseFloat((Math.random() * 1000).toFixed(2)),
                stockQuantity: Math.floor(Math.random() * 100),
                // stockStatus removed (not a column in schema)
            });
        }

        console.log('3. Sending bulk import request...');
        const startTime = Date.now();

        // We'll simulate the JSON payload sent by the frontend after preview
        const res = await axios.post(
            `${API_URL}/parts/import`,
            { parts },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            }
        );

        const duration = Date.now() - startTime;
        console.log(`Import completed in ${duration}ms`);
        console.log('Response:', JSON.stringify(res.data, null, 2));

        if (res.data.success && res.data.results.created === 2000) {
            console.log('SUCCESS: All 2000 parts imported.');
        } else {
            console.error('FAILURE: Import counts do not match.');
        }

    } catch (error: any) {
        console.error('Test failed:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    }
}

runTest();
