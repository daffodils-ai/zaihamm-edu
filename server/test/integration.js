/**
 * Integration Test Script for School Management System
 * 
 * Run this file to test all APIs end-to-end:
 * node test/integration.js
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
 * Main integration test flow
 */
async function runIntegrationTests() {
    console.log(`${colors.bold}${colors.blue}🚀 School Management System - Integration Tests${colors.reset}\n`);
    console.log(`Testing API at: ${BASE_URL}\n`);

    let organizationId = null;
    let organizationUserId = null;
    let organizationAdminToken = null;
    let classId = null;
    let sectionId = null;
    let studentId = null;
    let studentSessionId = null;
    let feeId = null;
    let noticeId = null;
    let menuId = null;

    try {
        // ==================== 1. ORGANIZATION SIGNUP ====================
        printHeader('1. Organization Signup');
        
        const signupResponse = await apiCall('POST', '/organizations/signup', {
            name: 'Test School Management',
            email: 'school@integration-test.com',
            mobile: '9876543210',
            address: '456 Test Street, Integration City',
            firstName: 'Admin',
            lastName: 'User',
            adminEmail: 'admin@integration-test.com',
            adminPassword: 'AdminPass@123',
            adminMobile: '9876543211'
        });

        testCase(
            'Organization signup successful',
            signupResponse.status === 201 && signupResponse.data.success,
            201,
            signupResponse.status,
            signupResponse.data.message
        );

        if (signupResponse.data.success) {
            organizationId = signupResponse.data.data.organization.id;
            organizationUserId = signupResponse.data.data.admin.id;
            organizationAdminToken = signupResponse.data.data.token;
            
            console.log(`  Organization ID: ${organizationId}`);
            console.log(`  Admin User ID: ${organizationUserId}`);
            console.log(`  Token: ${organizationAdminToken.substring(0, 20)}...`);
        }

        // ==================== 2. HEALTH CHECK ====================
        printHeader('2. Health Check');
        
        const healthResponse = await apiCall('GET', '/health');
        testCase(
            'Health check successful',
            healthResponse.status === 200 && healthResponse.data.success,
            200,
            healthResponse.status
        );

        // ==================== 3. ORGANIZATION LOGIN ====================
        printHeader('3. Organization User Login');
        
        const loginResponse = await apiCall('POST', '/organization-users/login', {
            email: 'admin@integration-test.com',
            password: 'AdminPass@123',
            organizationId: organizationId
        });

        testCase(
            'Organization user login successful',
            loginResponse.status === 200 && loginResponse.data.success,
            200,
            loginResponse.status,
            loginResponse.data.message
        );

        if (loginResponse.data.success) {
            organizationAdminToken = loginResponse.data.data.token;
        }

        // ==================== 4. CREATE CLASS ====================
        printHeader('4. Class Management');
        
        const createClassResponse = await apiCall('POST', '/classes', {
            name: 'Class 10-A',
            description: 'Science stream test class'
        }, organizationAdminToken);

        testCase(
            'Create class successful',
            createClassResponse.status === 201 && createClassResponse.data.success,
            201,
            createClassResponse.status,
            createClassResponse.data.message
        );

        if (createClassResponse.data.success) {
            classId = createClassResponse.data.data._id;
            console.log(`  Class ID: ${classId}`);
        }

        // Get all classes
        const getAllClassesResponse = await apiCall('GET', '/classes', null, organizationAdminToken);
        testCase(
            'Get all classes successful',
            getAllClassesResponse.status === 200 && getAllClassesResponse.data.success,
            200,
            getAllClassesResponse.status
        );

        // ==================== 5. CREATE SECTION ====================
        printHeader('5. Section Management');
        
        const createSectionResponse = await apiCall('POST', '/sections', {
            name: 'Section A',
            classId: classId,
            description: 'Main section'
        }, organizationAdminToken);

        testCase(
            'Create section successful',
            createSectionResponse.status === 201 && createSectionResponse.data.success,
            201,
            createSectionResponse.status,
            createSectionResponse.data.message
        );

        if (createSectionResponse.data.success) {
            sectionId = createSectionResponse.data.data._id;
            console.log(`  Section ID: ${sectionId}`);
        }

        // ==================== 6. CREATE MENU ====================
        printHeader('6. Menu Management');
        
        const createMenuResponse = await apiCall('POST', '/menus', {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'dashboard-icon',
            order: 1,
            parentId: null
        }, organizationAdminToken);

        testCase(
            'Create menu successful',
            createMenuResponse.status === 201 && createMenuResponse.data.success,
            201,
            createMenuResponse.status,
            createMenuResponse.data.message
        );

        if (createMenuResponse.data.success) {
            menuId = createMenuResponse.data.data._id;
            console.log(`  Menu ID: ${menuId}`);
        }

        // Get main menus
        const getMainMenusResponse = await apiCall('GET', '/menus/main/list', null, organizationAdminToken);
        testCase(
            'Get main menus successful',
            getMainMenusResponse.status === 200 && getMainMenusResponse.data.success,
            200,
            getMainMenusResponse.status
        );

        // ==================== 7. STUDENT ADMISSION ====================
        printHeader('7. Student Management');
        
        const admitStudentResponse = await apiCall('POST', '/students/admit', {
            fullName: 'Integration Test Student',
            age: 16,
            bloodGroup: 'O+',
            mobile: '9876543220',
            parentMobile: '9876543221',
            studentEmail: 'student@integration-test.com',
            parentEmail: 'parent@integration-test.com',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            guardianName: 'Test Guardian',
            aadharNo: '123456789012',
            parentAadharNumber: '123456789013',
            parentAadharRelation: 'father',
            fullAddress: '789 Student Street, Test City',
            classId: classId,
            sectionId: sectionId,
            year: 2024
        }, organizationAdminToken);

        testCase(
            'Student admission successful',
            admitStudentResponse.status === 201 && admitStudentResponse.data.success,
            201,
            admitStudentResponse.status,
            admitStudentResponse.data.message
        );

        if (admitStudentResponse.data.success) {
            studentId = admitStudentResponse.data.data.student._id;
            studentSessionId = admitStudentResponse.data.data.session._id;
            console.log(`  Student ID: ${studentId}`);
            console.log(`  Registration Number: ${admitStudentResponse.data.data.credentials.registrationNumber}`);
            console.log(`  Student Password: ${admitStudentResponse.data.data.credentials.password}`);
        }

        // Get all students
        const getAllStudentsResponse = await apiCall('GET', '/students', null, organizationAdminToken);
        testCase(
            'Get all students successful',
            getAllStudentsResponse.status === 200 && getAllStudentsResponse.data.success,
            200,
            getAllStudentsResponse.status
        );

        // Get student by ID
        const getStudentResponse = await apiCall('GET', `/students/${studentId}`, null, organizationAdminToken);
        testCase(
            'Get student by ID successful',
            getStudentResponse.status === 200 && getStudentResponse.data.success,
            200,
            getStudentResponse.status
        );

        // ==================== 8. FEE MANAGEMENT ====================
        printHeader('8. Fee Management');
        
        const createFeeResponse = await apiCall('POST', '/fees', {
            studentId: studentId,
            studentSessionId: studentSessionId,
            classId: classId,
            type: 'monthly',
            amount: 5000,
            dueDate: '2024-12-31',
            remarks: 'Test monthly fee'
        }, organizationAdminToken);

        testCase(
            'Create fee successful',
            createFeeResponse.status === 201 && createFeeResponse.data.success,
            201,
            createFeeResponse.status,
            createFeeResponse.data.message
        );

        if (createFeeResponse.data.success) {
            feeId = createFeeResponse.data.data._id;
            console.log(`  Fee ID: ${feeId}`);
        }

        // Get fees by student
        const getStudentFeesResponse = await apiCall('GET', `/fees/student/${studentId}`, null, organizationAdminToken);
        testCase(
            'Get student fees successful',
            getStudentFeesResponse.status === 200 && getStudentFeesResponse.data.success,
            200,
            getStudentFeesResponse.status
        );

        // Get pending fees report
        const getPendingFeesResponse = await apiCall('GET', '/fees/report/pending', null, organizationAdminToken);
        testCase(
            'Get pending fees report successful',
            getPendingFeesResponse.status === 200 && getPendingFeesResponse.data.success,
            200,
            getPendingFeesResponse.status
        );

        // ==================== 9. NOTICE BOARD ====================
        printHeader('9. Notice Board Management');
        
        const createNoticeResponse = await apiCall('POST', '/notices', {
            title: 'Integration Test Notice',
            description: 'This is a test notice created during integration testing',
            attachments: []
        }, organizationAdminToken);

        testCase(
            'Create notice successful',
            createNoticeResponse.status === 201 && createNoticeResponse.data.success,
            201,
            createNoticeResponse.status,
            createNoticeResponse.data.message
        );

        if (createNoticeResponse.data.success) {
            noticeId = createNoticeResponse.data.data._id;
            console.log(`  Notice ID: ${noticeId}`);
        }

        // Get all notices
        const getAllNoticesResponse = await apiCall('GET', '/notices', null, organizationAdminToken);
        testCase(
            'Get all notices successful',
            getAllNoticesResponse.status === 200 && getAllNoticesResponse.data.success,
            200,
            getAllNoticesResponse.status
        );

        // Get recent notices
        const getRecentNoticesResponse = await apiCall('GET', '/notices/recent', null, organizationAdminToken);
        testCase(
            'Get recent notices successful',
            getRecentNoticesResponse.status === 200 && getRecentNoticesResponse.data.success,
            200,
            getRecentNoticesResponse.status
        );

        // ==================== 10. NOTIFICATION ====================
        printHeader('10. Notification Management');
        
        const createNotificationResponse = await apiCall('POST', '/notifications', {
            type: 'fee',
            title: 'Fee Due Notification',
            message: 'Monthly fee is due',
            studentId: studentId,
            email: 'student@integration-test.com',
            mobile: '9876543220'
        }, organizationAdminToken);

        testCase(
            'Create notification successful',
            createNotificationResponse.status === 201 && createNotificationResponse.data.success,
            201,
            createNotificationResponse.status,
            createNotificationResponse.data.message
        );

        // Get notifications by student
        const getStudentNotificationsResponse = await apiCall('GET', `/notifications/student/${studentId}`, null, organizationAdminToken);
        testCase(
            'Get student notifications successful',
            getStudentNotificationsResponse.status === 200 && getStudentNotificationsResponse.data.success,
            200,
            getStudentNotificationsResponse.status
        );

        // ==================== 11. CREATE ADDITIONAL USERS ====================
        printHeader('11. Create Additional Organization Users');
        
        const createTeacherResponse = await apiCall('POST', '/organization-users', {
            firstName: 'Test',
            lastName: 'Teacher',
            email: 'teacher@integration-test.com',
            mobile: '9876543230',
            password: 'TeacherPass@123',
            role: 'teacher'
        }, organizationAdminToken);

        testCase(
            'Create teacher user successful',
            createTeacherResponse.status === 201 && createTeacherResponse.data.success,
            201,
            createTeacherResponse.status,
            createTeacherResponse.data.message
        );

        const createAccountantResponse = await apiCall('POST', '/organization-users', {
            firstName: 'Test',
            lastName: 'Accountant',
            email: 'accountant@integration-test.com',
            mobile: '9876543240',
            password: 'AccountantPass@123',
            role: 'accountant'
        }, organizationAdminToken);

        testCase(
            'Create accountant user successful',
            createAccountantResponse.status === 201 && createAccountantResponse.data.success,
            201,
            createAccountantResponse.status,
            createAccountantResponse.data.message
        );

        // Get all organization users
        const getAllUsersResponse = await apiCall('GET', '/organization-users', null, organizationAdminToken);
        testCase(
            'Get all organization users successful',
            getAllUsersResponse.status === 200 && getAllUsersResponse.data.success,
            200,
            getAllUsersResponse.status
        );

        // ==================== 12. UPDATE OPERATIONS ====================
        printHeader('12. Update Operations');
        
        const updateClassResponse = await apiCall('PUT', `/classes/${classId}`, {
            name: 'Class 10-A (Updated)',
            description: 'Updated description'
        }, organizationAdminToken);

        testCase(
            'Update class successful',
            updateClassResponse.status === 200 && updateClassResponse.data.success,
            200,
            updateClassResponse.status
        );

        const updateSectionResponse = await apiCall('PUT', `/sections/${sectionId}`, {
            name: 'Section A (Updated)'
        }, organizationAdminToken);

        testCase(
            'Update section successful',
            updateSectionResponse.status === 200 && updateSectionResponse.data.success,
            200,
            updateSectionResponse.status
        );

        const updateStudentResponse = await apiCall('PUT', `/students/${studentId}`, {
            fullName: 'Integration Test Student (Updated)'
        }, organizationAdminToken);

        testCase(
            'Update student successful',
            updateStudentResponse.status === 200 && updateStudentResponse.data.success,
            200,
            updateStudentResponse.status
        );

        // ==================== 13. GET STUDENT HISTORY ====================
        printHeader('13. Student History & Session');
        
        const getStudentHistoryResponse = await apiCall('GET', `/students/${studentId}/history`, null, organizationAdminToken);
        testCase(
            'Get student history successful',
            getStudentHistoryResponse.status === 200 && getStudentHistoryResponse.data.success,
            200,
            getStudentHistoryResponse.status
        );

        // ==================== 14. TEST FILTERS & PAGINATION ====================
        printHeader('14. Filters & Pagination');
        
        const classesWithPaginationResponse = await apiCall('GET', '/classes?page=1&limit=5', null, organizationAdminToken);
        testCase(
            'Get classes with pagination successful',
            classesWithPaginationResponse.status === 200 && classesWithPaginationResponse.data.pagination,
            200,
            classesWithPaginationResponse.status
        );

        const feesWithFilterResponse = await apiCall('GET', '/fees?status=pending', null, organizationAdminToken);
        testCase(
            'Get fees with filter successful',
            feesWithFilterResponse.status === 200 && feesWithFilterResponse.data.success,
            200,
            feesWithFilterResponse.status
        );

        // ==================== 15. TEST ERROR SCENARIOS ====================
        printHeader('15. Error Handling Tests');
        
        // Invalid email format in signup
        const invalidSignupResponse = await apiCall('POST', '/organizations/signup', {
            name: 'Test',
            email: 'test@test.com',
            mobile: '9876543250',
            address: 'Test Address',
            firstName: 'Test',
            lastName: 'User',
            adminEmail: 'admin@integration-test.com', // Duplicate
            adminPassword: 'Pass@123'
        });

        testCase(
            'Duplicate admin email validation',
            invalidSignupResponse.status === 409 || invalidSignupResponse.status === 400,
            409,
            invalidSignupResponse.status
        );

        // Unauthorized access without token
        const unauthorizedResponse = await apiCall('GET', '/classes');
        testCase(
            'Unauthorized access properly rejected',
            unauthorizedResponse.status === 401,
            401,
            unauthorizedResponse.status
        );

        // Not found test
        const notFoundResponse = await apiCall('GET', '/students/999999999999999999999999', null, organizationAdminToken);
        testCase(
            'Not found error properly returned',
            notFoundResponse.status === 404,
            404,
            notFoundResponse.status
        );

    } catch (error) {
        console.error(`${colors.red}❌ Test execution error: ${error.message}${colors.reset}`);
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
runIntegrationTests().catch(error => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
});
