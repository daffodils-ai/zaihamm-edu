/**
 * Test Script for AdmissionTracker CRUD Operations
 * 
 * Run this file to test admission tracker APIs:
 * node test/admissionTracker.test.js
 * 
 * Make sure the server is running on http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000/api/v1';
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

/**
 * Make API request
 */
async function apiCall(method, endpoint, data = null, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json();
    
    return {
        status: response.status,
        data: responseData
    };
}

/**
 * Test a single API call
 */
function testCase(name, passed, expectedStatus, actualStatus, details = '') {
    testResults.total++;
    
    if (passed) {
        testResults.passed++;
        console.log(`${colors.green}✓${colors.reset} ${name}`);
    } else {
        testResults.failed++;
        console.log(`${colors.red}✗${colors.reset} ${name}`);
        if (details || expectedStatus !== actualStatus) {
            console.log(`  Expected Status: ${expectedStatus}, Got: ${actualStatus}`);
            if (details) console.log(`  Details: ${details}`);
        }
    }
    
    testResults.tests.push({ name, passed, expectedStatus, actualStatus });
}

/**
 * Print section header
 */
function printHeader(text) {
    console.log(`\n${colors.bold}${colors.blue}=== ${text} ===${colors.reset}\n`);
}

/**
 * Generate unique test data
 */
function generateTestData() {
    const timestamp = Date.now();
    return {
        fullName: `Test Student ${timestamp}`,
        age: 14,
        bloodGroup: 'B+',
        mobile: '9876543260',
        parentMobile: '9876543261',
        studentEmail: `student${timestamp}@test.com`,
        parentEmail: `parent${timestamp}@test.com`,
        fatherName: `Test Father ${timestamp}`,
        motherName: `Test Mother ${timestamp}`,
        guardianName: `Test Guardian ${timestamp}`,
        aadharNo: `${timestamp}123456`.slice(-12),
        parentAadharNumber: `${timestamp}654321`.slice(-12),
        parentAadharRelation: 'father',
        fullAddress: `${timestamp} Test Street, Test City, Bihar`
    };
}

/**
 * Main test flow
 */
async function runAdmissionTrackerTests() {
    console.log(`${colors.bold}${colors.blue}🎓 AdmissionTracker API - CRUD Tests${colors.reset}\n`);
    console.log(`Testing API at: ${BASE_URL}\n`);

    let admissionId = null;
    let testData = null;

    try {
        // ==================== 1. CREATE ADMISSION ENTRY ====================
        printHeader('1. Create Admission Entry');
        
        testData = generateTestData();
        
        const createResponse = await apiCall('POST', '/admissions', testData);

        testCase(
            'Create admission entry successful',
            createResponse.status === 201 && createResponse.data.success,
            201,
            createResponse.status,
            createResponse.data.message
        );

        if (createResponse.data.success) {
            admissionId = createResponse.data.data._id;
            console.log(`  Admission ID: ${admissionId}`);
            console.log(`  Student Name: ${createResponse.data.data.fullName}`);
            console.log(`  Aadhar No: ${createResponse.data.data.aadharNo}`);
            console.log(`  Parent Mobile: ${createResponse.data.data.parentMobile}`);
        }

        // ==================== 2. GET ALL ADMISSIONS ====================
        printHeader('2. Get All Admission Entries');
        
        const getAllResponse = await apiCall('GET', '/admissions');
        testCase(
            'Get all admissions successful',
            getAllResponse.status === 200 && getAllResponse.data.success,
            200,
            getAllResponse.status
        );

        if (getAllResponse.data.success) {
            console.log(`  Total Admissions: ${getAllResponse.data.data.length}`);
            console.log(`  Pagination Info: ${getAllResponse.data.pagination ? 'Available' : 'Not Available'}`);
        }

        // ==================== 3. GET ADMISSION BY ID ====================
        printHeader('3. Get Admission Entry by ID');
        
        const getByIdResponse = await apiCall('GET', `/admissions/${admissionId}`);
        testCase(
            'Get admission by ID successful',
            getByIdResponse.status === 200 && getByIdResponse.data.success,
            200,
            getByIdResponse.status
        );

        if (getByIdResponse.data.success) {
            console.log(`  Student Name: ${getByIdResponse.data.data.fullName}`);
            console.log(`  Age: ${getByIdResponse.data.data.age}`);
            console.log(`  Father's Name: ${getByIdResponse.data.data.fatherName}`);
        }

        // ==================== 4. UPDATE ADMISSION ENTRY ====================
        printHeader('4. Update Admission Entry');
        
        const updateData = {
            fullName: `${testData.fullName} (Updated)`,
            mobile: '9999999999',
            bloodGroup: 'O+'
        };

        const updateResponse = await apiCall('PUT', `/admissions/${admissionId}`, updateData);
        testCase(
            'Update admission entry successful',
            updateResponse.status === 200 && updateResponse.data.success,
            200,
            updateResponse.status
        );

        if (updateResponse.data.success) {
            console.log(`  Updated Name: ${updateResponse.data.data.fullName}`);
            console.log(`  Updated Mobile: ${updateResponse.data.data.mobile}`);
            console.log(`  Updated Blood Group: ${updateResponse.data.data.bloodGroup}`);
        }

        // ==================== 5. GET UPDATED ADMISSION ====================
        printHeader('5. Verify Updated Admission');
        
        const getUpdatedResponse = await apiCall('GET', `/admissions/${admissionId}`);
        testCase(
            'Get updated admission successful',
            getUpdatedResponse.status === 200 && getUpdatedResponse.data.success && 
            getUpdatedResponse.data.data.fullName.includes('(Updated)'),
            200,
            getUpdatedResponse.status
        );

        // ==================== 6. PAGINATION TEST ====================
        printHeader('6. Pagination & Filters');
        
        const paginationResponse = await apiCall('GET', '/admissions?page=1&limit=5');
        testCase(
            'Get admissions with pagination successful',
            paginationResponse.status === 200 && paginationResponse.data.success && paginationResponse.data.pagination,
            200,
            paginationResponse.status
        );

        if (paginationResponse.data.success && paginationResponse.data.pagination) {
            console.log(`  Current Page: ${paginationResponse.data.pagination.page}`);
            console.log(`  Limit: ${paginationResponse.data.pagination.limit}`);
            console.log(`  Total: ${paginationResponse.data.pagination.total}`);
            console.log(`  Total Pages: ${paginationResponse.data.pagination.pages}`);
        }

        // Filter by fatherName
        const filterResponse = await apiCall('GET', `/admissions?fatherName=${encodeURIComponent(testData.fatherName)}`);
        testCase(
            'Get admissions with filter successful',
            filterResponse.status === 200 && filterResponse.data.success,
            200,
            filterResponse.status
        );

        // ==================== 7. ERROR HANDLING TESTS ====================
        printHeader('7. Error Handling Tests');
        
        // Test 7.1: Missing required fields
        const invalidCreateResponse = await apiCall('POST', '/admissions', {
            fullName: 'Incomplete Student'
            // Missing required fields: age, parentMobile, fatherName, motherName, aadharNo, etc.
        });

        testCase(
            'Missing required fields validation',
            invalidCreateResponse.status === 400,
            400,
            invalidCreateResponse.status
        );

        // Test 7.2: Invalid age
        const invalidAgeResponse = await apiCall('POST', '/admissions', {
            ...testData,
            age: -5, // Invalid negative age
            aadharNo: `${Date.now()}999999`.slice(-12),
            parentAadharNumber: `${Date.now()}888888`.slice(-12)
        });

        testCase(
            'Invalid age validation',
            invalidAgeResponse.status === 400,
            400,
            invalidAgeResponse.status
        );

        // Test 7.3: Invalid parent Aadhar relation
        const invalidRelationResponse = await apiCall('POST', '/admissions', {
            ...testData,
            parentAadharRelation: 'invalid_relation',
            aadharNo: `${Date.now()}777777`.slice(-12),
            parentAadharNumber: `${Date.now()}666666`.slice(-12)
        });

        testCase(
            'Invalid parent Aadhar relation validation',
            invalidRelationResponse.status === 400,
            400,
            invalidRelationResponse.status
        );

        // Test 7.4: Not found for non-existent ID
        const notFoundResponse = await apiCall('GET', '/admissions/999999999999999999999999');
        testCase(
            'Not found error for invalid ID',
            notFoundResponse.status === 404,
            404,
            notFoundResponse.status
        );

        // Test 7.5: Update non-existent ID
        const updateNotFoundResponse = await apiCall('PUT', '/admissions/999999999999999999999999', {
            fullName: 'Non-existent Student'
        });
        testCase(
            'Update not found error for invalid ID',
            updateNotFoundResponse.status === 404,
            404,
            updateNotFoundResponse.status
        );

        // ==================== 8. DELETE ADMISSION ENTRY ====================
        printHeader('8. Delete Admission Entry');
        
        const deleteResponse = await apiCall('DELETE', `/admissions/${admissionId}`);
        testCase(
            'Delete admission entry successful',
            deleteResponse.status === 200 && deleteResponse.data.success,
            200,
            deleteResponse.status
        );

        // ==================== 9. VERIFY DELETION ====================
        printHeader('9. Verify Deletion');
        
        const afterDeleteResponse = await apiCall('GET', `/admissions/${admissionId}`);
        testCase(
            'Deleted admission returns 404',
            afterDeleteResponse.status === 404,
            404,
            afterDeleteResponse.status
        );

        // ==================== 10. CREATE MULTIPLE ENTRIES ====================
        printHeader('10. Create Multiple Test Entries');
        
        const createdIds = [];
        for (let i = 0; i < 3; i++) {
            const multiTestData = generateTestData();
            const multiCreateResponse = await apiCall('POST', '/admissions', multiTestData);
            
            if (multiCreateResponse.status === 201 && multiCreateResponse.data.success) {
                createdIds.push(multiCreateResponse.data.data._id);
                console.log(`  Created entry ${i + 1}: ${multiCreateResponse.data.data.fullName}`);
            }
        }

        testCase(
            'Create multiple admission entries successful',
            createdIds.length === 3,
            201,
            createdIds.length === 3 ? 201 : 0
        );

        // ==================== 11. CLEANUP ====================
        printHeader('11. Cleanup Test Data');
        
        let cleanupCount = 0;
        for (const id of createdIds) {
            const cleanupResponse = await apiCall('DELETE', `/admissions/${id}`);
            if (cleanupResponse.status === 200) {
                cleanupCount++;
            }
        }

        testCase(
            'Cleanup all test entries',
            cleanupCount === createdIds.length,
            200,
            cleanupCount === createdIds.length ? 200 : 0
        );

    } catch (error) {
        console.error(`${colors.red}❌ Test execution error: ${error.message}${colors.reset}`);
        console.error(error.stack);
        testResults.failed++;
        testResults.total++;
    }

    // ==================== SUMMARY ====================
    printHeader('Test Summary');
    
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
    
    const percentage = testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(2) : 0;
    console.log(`Success Rate: ${colors.bold}${percentage}%${colors.reset}\n`);

    if (testResults.failed === 0) {
        console.log(`${colors.green}${colors.bold}✓ All tests passed!${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}${colors.bold}✗ Some tests failed!${colors.reset}\n`);
        console.log(`${colors.yellow}Failed Tests:${colors.reset}`);
        testResults.tests.filter(t => !t.passed).forEach(t => {
            console.log(`  - ${t.name}`);
        });
        console.log();
        process.exit(1);
    }
}

// Run tests
runAdmissionTrackerTests().catch(error => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
});
