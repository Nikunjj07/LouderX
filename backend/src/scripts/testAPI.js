#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all API endpoints to ensure they work correctly
 * 
 * Usage: node src/scripts/testAPI.js
 * 
 * Prerequisites:
 * 1. MongoDB must be running
 * 2. Database must be seeded (run: npm run seed)
 * 3. Server must be running (run: npm run dev in another terminal)
 *    OR this script will start the server automatically
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Test data
let testEventId = null;
let testEmail = 'apitest@example.com';

// ANSI Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Helper function to make HTTP requests
const makeRequest = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = http.request(reqOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(data)
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
};

// Test functions
const tests = [
    {
        name: 'Health Check',
        run: async () => {
            const response = await makeRequest(`${BASE_URL}/health`);
            return response.statusCode === 200 && response.data.status === 'OK';
        }
    },
    {
        name: 'API Info',
        run: async () => {
            const response = await makeRequest(`${BASE_URL}/api`);
            return response.statusCode === 200 && response.data.version;
        }
    },
    {
        name: 'Get All Events',
        run: async () => {
            const response = await makeRequest(`${API_URL}/events`);
            if (response.statusCode === 200 && response.data.success && response.data.data.length > 0) {
                testEventId = response.data.data[0]._id;
                return true;
            }
            return false;
        }
    },
    {
        name: 'Get Upcoming Events',
        run: async () => {
            const response = await makeRequest(`${API_URL}/events/upcoming`);
            return response.statusCode === 200 && response.data.success;
        }
    },
    {
        name: 'Get Event by ID',
        run: async () => {
            if (!testEventId) return false;
            const response = await makeRequest(`${API_URL}/events/${testEventId}`);
            return response.statusCode === 200 && response.data.success && response.data.data._id === testEventId;
        }
    },
    {
        name: 'Get Event Stats',
        run: async () => {
            const response = await makeRequest(`${API_URL}/events/stats`);
            return response.statusCode === 200 && response.data.success && response.data.stats;
        }
    },
    {
        name: 'Search Events',
        run: async () => {
            const response = await makeRequest(`${API_URL}/events/search?q=festival`);
            return response.statusCode === 200 && response.data.success;
        }
    },
    {
        name: 'Get Events by Date Range',
        run: async () => {
            const response = await makeRequest(`${API_URL}/events/range?start=2026-01-01&end=2026-12-31`);
            return response.statusCode === 200 && response.data.success;
        }
    },
    {
        name: 'Subscribe Email (Valid)',
        run: async () => {
            if (!testEventId) return false;
            const response = await makeRequest(`${API_URL}/subscribe`, {
                method: 'POST',
                body: {
                    email: testEmail,
                    eventId: testEventId,
                    consent: true
                }
            });
            return response.statusCode === 201 && response.data.success;
        }
    },
    {
        name: 'Subscribe Email (Duplicate - Should Fail)',
        run: async () => {
            if (!testEventId) return false;
            const response = await makeRequest(`${API_URL}/subscribe`, {
                method: 'POST',
                body: {
                    email: testEmail,
                    eventId: testEventId,
                    consent: true
                }
            });
            // Should return error for duplicate
            return response.statusCode === 400 && !response.data.success;
        }
    },
    {
        name: 'Subscribe Email (Invalid Email - Should Fail)',
        run: async () => {
            if (!testEventId) return false;
            const response = await makeRequest(`${API_URL}/subscribe`, {
                method: 'POST',
                body: {
                    email: 'invalid-email',
                    eventId: testEventId,
                    consent: true
                }
            });
            return response.statusCode === 400 && !response.data.success;
        }
    },
    {
        name: 'Subscribe Email (No Consent - Should Fail)',
        run: async () => {
            if (!testEventId) return false;
            const response = await makeRequest(`${API_URL}/subscribe`, {
                method: 'POST',
                body: {
                    email: 'another@example.com',
                    eventId: testEventId,
                    consent: false
                }
            });
            return response.statusCode === 400 && !response.data.success;
        }
    },
    {
        name: 'Check Subscription Status',
        run: async () => {
            if (!testEventId) return false;
            const response = await makeRequest(`${API_URL}/subscribe/check?email=${testEmail}&eventId=${testEventId}`);
            return response.statusCode === 200 && response.data.success && response.data.isSubscribed === true;
        }
    },
    {
        name: 'Get Subscription Stats',
        run: async () => {
            const response = await makeRequest(`${API_URL}/subscribe/stats`);
            return response.statusCode === 200 && response.data.success && response.data.data;
        }
    },
    {
        name: 'Get Subscriptions by User',
        run: async () => {
            const response = await makeRequest(`${API_URL}/subscribe/user/${testEmail}`);
            return response.statusCode === 200 && response.data.success;
        }
    },
    {
        name: '404 Not Found',
        run: async () => {
            const response = await makeRequest(`${API_URL}/nonexistent`);
            return response.statusCode === 404;
        }
    }
];

// Run all tests
const runTests = async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧪 Sydney Events Aggregator - API Test Suite');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`${colors.cyan}Testing API at: ${BASE_URL}${colors.reset}\n`);

    // Check if server is running
    try {
        await makeRequest(`${BASE_URL}/health`);
        console.log(`${colors.green}✓ Server is running${colors.reset}\n`);
    } catch (error) {
        console.log(`${colors.red}✗ Server is not running!${colors.reset}`);
        console.log(`${colors.yellow}Please start the server first: npm run dev${colors.reset}\n`);
        process.exit(1);
    }

    let passed = 0;
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        process.stdout.write(`${i + 1}. ${test.name}... `);

        try {
            const result = await test.run();
            if (result) {
                console.log(`${colors.green}✓ PASS${colors.reset}`);
                passed++;
            } else {
                console.log(`${colors.red}✗ FAIL${colors.reset}`);
                failed++;
            }
        } catch (error) {
            console.log(`${colors.red}✗ ERROR: ${error.message}${colors.reset}`);
            failed++;
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 Test Results');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Tests: ${tests.length}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (failed === 0) {
        console.log(`${colors.green}🎉 All tests passed! API is working correctly.${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.yellow}⚠️  Some tests failed. Please review the results above.${colors.reset}\n`);
        process.exit(1);
    }
};

// Run tests
runTests();
