/**
 * Focused integration test for Exam Result APIs
 *
 * Run this file with:
 * npm run test:exam-results
 *
 * Make sure the server is running on http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000/api/v1';
const runId = Date.now();
const suffix = String(runId).slice(-6);

const stats = {
    total: 0,
    passed: 0,
    failed: 0
};

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

function logResult(name, condition, details = '') {
    stats.total++;
    if (condition) {
        stats.passed++;
        console.log(`${colors.green}✓${colors.reset} ${name}`);
    } else {
        stats.failed++;
        console.log(`${colors.red}✗${colors.reset} ${name}`);
        if (details) {
            console.log(`  ${details}`);
        }
    }
}

function printHeader(label) {
    console.log(`\n${colors.bold}${colors.blue}=== ${label} ===${colors.reset}`);
}

async function apiCall(method, endpoint, data = null, token = null, parse = 'json') {
    const headers = {};
    if (parse === 'json') {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : null
    });

    if (parse === 'buffer') {
        const arrayBuffer = await response.arrayBuffer();
        return {
            status: response.status,
            headers: response.headers,
            data: Buffer.from(arrayBuffer)
        };
    }

    const responseData = await response.json();
    return {
        status: response.status,
        data: responseData
    };
}

async function run() {
    console.log(`${colors.bold}${colors.blue}Exam Result Integration Test${colors.reset}`);
    console.log(`Testing API at ${BASE_URL}`);

    const orgEmail = `school-${suffix}@integration.test`;
    const adminEmail = `admin-${suffix}@integration.test`;
    const orgMobile = `9${String(runId).slice(-9)}`;
    const adminMobile = `8${String(runId + 1).slice(-9)}`;
    const aadharBase = String(runId).padEnd(12, '1').slice(0, 12);
    const parentAadhar = String(runId + 1111).padEnd(12, '2').slice(0, 12);

    let token = null;
    let classId = null;
    let sectionId = null;
    let studentId = null;
    let examResultId = null;

    try {
        printHeader('1. Setup Organization');
        const signupResponse = await apiCall('POST', '/organizations/signup', {
            name: `Exam Result School ${suffix}`,
            email: orgEmail,
            mobile: orgMobile,
            address: 'Integration Test Address',
            firstName: 'Exam',
            lastName: 'Admin',
            adminEmail,
            adminPassword: 'AdminPass@123',
            adminMobile
        });

        logResult(
            'Organization signup',
            signupResponse.status === 201 && signupResponse.data.success,
            signupResponse.data.message
        );

        token = signupResponse.data?.data?.token;

        printHeader('2. Create Class and Section');
        const classResponse = await apiCall('POST', '/classes', {
            name: `Class ${suffix}`,
            description: 'Exam result test class'
        }, token);
        logResult('Create class', classResponse.status === 201 && classResponse.data.success, classResponse.data.message);
        classId = classResponse.data?.data?._id;

        const sectionResponse = await apiCall('POST', '/sections', {
            name: `Section ${suffix}`,
            classId,
            description: 'Exam result test section'
        }, token);
        logResult('Create section', sectionResponse.status === 201 && sectionResponse.data.success, sectionResponse.data.message);
        sectionId = sectionResponse.data?.data?._id;

        printHeader('3. Admit Student');
        const studentResponse = await apiCall('POST', '/students/admit', {
            fullName: `Student ${suffix}`,
            age: 15,
            bloodGroup: 'O+',
            mobile: `7${String(runId + 2).slice(-9)}`,
            parentMobile: `6${String(runId + 3).slice(-9)}`,
            studentEmail: `student-${suffix}@integration.test`,
            parentEmail: `parent-${suffix}@integration.test`,
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            guardianName: 'Test Guardian',
            aadharNo: aadharBase,
            parentAadharNumber: parentAadhar,
            parentAadharRelation: 'father',
            fullAddress: 'Student Integration Address',
            classId,
            sectionId,
            year: 2026
        }, token);
        logResult('Admit student', studentResponse.status === 201 && studentResponse.data.success, studentResponse.data.message);
        studentId = studentResponse.data?.data?.student?._id;

        printHeader('4. Create Exam Result');
        const createResultResponse = await apiCall('POST', '/exam-results', {
            studentId,
            classId,
            sectionId,
            year: 2026,
            examName: 'Final Examination',
            examDate: '2026-03-15',
            subjects: [
                { subject: 'Mathematics', obtainedMarks: 91, passMarks: 33, totalMarks: 100, grade: 'A+' },
                { subject: 'Science', obtainedMarks: 88, passMarks: 33, totalMarks: 100, grade: 'A' }
            ]
        }, token);
        logResult(
            'Create exam result',
            createResultResponse.status === 201 && createResultResponse.data.success,
            createResultResponse.data.message
        );
        examResultId = createResultResponse.data?.data?._id;

        const duplicateSubjectResponse = await apiCall('POST', '/exam-results', {
            studentId,
            classId,
            sectionId,
            year: 2026,
            examName: 'Unit Test',
            examDate: '2026-02-01',
            subjects: [
                { subject: 'English', obtainedMarks: 70, passMarks: 33, totalMarks: 100, grade: 'B' },
                { subject: 'english', obtainedMarks: 72, passMarks: 33, totalMarks: 100, grade: 'B+' }
            ]
        }, token);
        logResult(
            'Reject duplicate subject in same exam result',
            duplicateSubjectResponse.status === 409,
            `Expected 409, got ${duplicateSubjectResponse.status}`
        );

        printHeader('5. List and Update Exam Result');
        const listResponse = await apiCall('GET', `/exam-results?studentId=${studentId}`, null, token);
        logResult(
            'List exam results by student filter',
            listResponse.status === 200 && listResponse.data.success && Array.isArray(listResponse.data.data) && listResponse.data.data.length >= 1,
            listResponse.data.message
        );

        const updateResponse = await apiCall('PUT', `/exam-results/${examResultId}`, {
            examName: 'Final Examination',
            year: 2026,
            examDate: '2026-03-16',
            studentId,
            classId,
            sectionId,
            subjects: [
                { subject: 'Mathematics', obtainedMarks: 95, passMarks: 33, totalMarks: 100, grade: 'A+' },
                { subject: 'Science', obtainedMarks: 90, passMarks: 33, totalMarks: 100, grade: 'A+' },
                { subject: 'English', obtainedMarks: 84, passMarks: 33, totalMarks: 100, grade: 'A' }
            ]
        }, token);
        logResult(
            'Update draft exam result',
            updateResponse.status === 200 && updateResponse.data.success && updateResponse.data.data.subjects.length === 3,
            updateResponse.data.message
        );

        printHeader('6. Finalize and Lock Result');
        const finalizeResponse = await apiCall('PUT', `/exam-results/${examResultId}/finalize`, null, token);
        logResult(
            'Finalize exam result',
            finalizeResponse.status === 200 && finalizeResponse.data.success && finalizeResponse.data.data.isFinalized,
            finalizeResponse.data.message
        );

        const blockedUpdateResponse = await apiCall('PUT', `/exam-results/${examResultId}`, {
            examName: 'Should Not Update'
        }, token);
        logResult(
            'Block update after finalize',
            blockedUpdateResponse.status === 409,
            `Expected 409, got ${blockedUpdateResponse.status}`
        );

        const blockedDeleteResponse = await apiCall('DELETE', `/exam-results/${examResultId}`, null, token);
        logResult(
            'Block delete after finalize',
            blockedDeleteResponse.status === 409,
            `Expected 409, got ${blockedDeleteResponse.status}`
        );

        printHeader('7. Download PDF');
        const pdfResponse = await apiCall('GET', `/exam-results/${examResultId}/pdf`, null, token, 'buffer');
        logResult(
            'Download exam result PDF',
            pdfResponse.status === 200 &&
                pdfResponse.headers.get('content-type')?.includes('application/pdf') &&
                pdfResponse.data.length > 0,
            `Status: ${pdfResponse.status}, bytes: ${pdfResponse.data.length}`
        );
    } catch (error) {
        console.log(`${colors.red}Unexpected error:${colors.reset}`, error.message);
        stats.failed++;
    }

    printHeader('Summary');
    console.log(`Total: ${stats.total}`);
    console.log(`${colors.green}Passed: ${stats.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${stats.failed}${colors.reset}`);

    if (stats.failed > 0) {
        process.exit(1);
    }
}

run();
