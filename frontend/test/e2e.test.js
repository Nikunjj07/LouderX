/**
 * Frontend End-to-End Test Suite
 * Tests complete user flows and functionality
 */

// Test Configuration
const TEST_CONFIG = {
    apiUrl: 'http://localhost:5000/api',
    frontendUrl: 'http://localhost:3000',
    testEmail: 'test@example.com',
    timeout: 5000
};

// Test Results
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

/**
 * Test Runner
 */
class TestRunner {
    static async runAll() {
        console.log('='.repeat(60));
        console.log('FRONTEND E2E TEST SUITE');
        console.log('='.repeat(60));
        console.log();

        // API Tests
        await this.testAPIConnection();
        await this.testFetchEvents();
        await this.testEmailSubscription();

        // UI Tests (manual verification)
        this.logManualTests();

        // Print Results
        this.printResults();
    }

    static async testAPIConnection() {
        const test = 'API Connection';
        console.log(`Testing: ${test}...`);

        try {
            const response = await fetch(`${TEST_CONFIG.apiUrl}/events`);
            if (response.ok) {
                this.pass(test);
            } else {
                this.fail(test, `Status: ${response.status}`);
            }
        } catch (error) {
            this.fail(test, error.message);
        }
    }

    static async testFetchEvents() {
        const test = 'Fetch Events API';
        console.log(`Testing: ${test}...`);

        try {
            const response = await fetch(`${TEST_CONFIG.apiUrl}/events/upcoming`);
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                this.pass(test, `Found ${data.data.length} events`);
            } else {
                this.fail(test, 'Invalid response format');
            }
        } catch (error) {
            this.fail(test, error.message);
        }
    }

    static async testEmailSubscription() {
        const test = 'Email Subscription API';
        console.log(`Testing: ${test}...`);

        try {
            // First get an event ID
            const eventRes = await fetch(`${TEST_CONFIG.apiUrl}/events/upcoming`);
            const eventData = await eventRes.json();

            if (!eventData.data || eventData.data.length === 0) {
                this.fail(test, 'No events available');
                return;
            }

            const eventId = eventData.data[0]._id;

            // Try to subscribe
            const response = await fetch(`${TEST_CONFIG.apiUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: `test-${Date.now()}@example.com`,
                    eventId: eventId,
                    consent: true
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.pass(test);
            } else {
                this.fail(test, data.message || 'Subscription failed');
            }
        } catch (error) {
            this.fail(test, error.message);
        }
    }

    static logManualTests() {
        console.log('\n' + '='.repeat(60));
        console.log('MANUAL VERIFICATION REQUIRED');
        console.log('='.repeat(60));
        console.log('\nPlease manually verify the following:');
        console.log('1. Open http://localhost:3000 in browser');
        console.log('2. Events display in grid layout');
        console.log('3. Search filter works (type "festival")');
        console.log('4. Date filter works (select "This Week")');
        console.log('5. Location filter works');
        console.log('6. Click "Get Tickets" opens modal');
        console.log('7. Email validation works');
        console.log('8. Consent checkbox required');
        console.log('9. Successful subscription redirects to tickets');
        console.log('10. Responsive on mobile (resize window)');
        console.log();
    }

    static pass(name, message = '') {
        results.passed++;
        results.tests.push({ name, status: 'PASS', message });
        console.log(`  [PASS] ${name}${message ? ` - ${message}` : ''}`);
    }

    static fail(name, message = '') {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', message });
        console.log(`  [FAIL] ${name}${message ? ` - ${message}` : ''}`);
    }

    static printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Passed: ${results.passed}`);
        console.log(`Failed: ${results.failed}`);
        console.log(`Total: ${results.passed + results.failed}`);
        console.log('='.repeat(60));
        console.log();

        if (results.failed === 0) {
            console.log('[OK] All automated tests passed!');
        } else {
            console.log('[WARNING] Some tests failed. Review above.');
        }
    }
}

// Run tests
TestRunner.runAll();
