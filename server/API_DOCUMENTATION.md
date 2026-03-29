# School Management System - API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints (except login) require Bearer token authentication.
Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Organization User Login
**Endpoint:** `POST /organization-users/login`

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "password123",
  "organizationId": "507f1f77bcf86cd799439011"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/organization-users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password123",
    "organizationId": "507f1f77bcf86cd799439011"
  }'
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@school.com",
      "firstName": "John",
      "lastName": "Admin",
      "role": "organization"
    }
  }
}
```

---

### 2. Student Login
**Endpoint:** `POST /students/login`

**Request Body:**
```json
{
  "registrationNumber": "1234567890123456",
  "password": "tempPassword123"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber": "1234567890123456",
    "password": "tempPassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": {
      "id": "607f1f77bcf86cd799439012",
      "fullName": "Student Name",
      "registrationNumber": "1234567890123456",
      "class": "507f1f77bcf86cd799439013",
      "section": "507f1f77bcf86cd799439014"
    }
  }
}
```

---

## Organization User Endpoints

### 3. Create Organization User
**Endpoint:** `POST /organization-users`

**Required Role:** organization

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@school.com",
  "mobile": "9876543210",
  "password": "SecurePass@123",
  "role": "teacher"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/organization-users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@school.com",
    "mobile": "9876543210",
    "password": "SecurePass@123",
    "role": "teacher"
  }'
```

### 4. Get All Organization Users
**Endpoint:** `GET /organization-users?page=1&limit=10&email=john&role=teacher`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/organization-users?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 5. Get Organization User by ID
**Endpoint:** `GET /organization-users/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/organization-users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

### 6. Update Organization User
**Endpoint:** `PUT /organization-users/:id`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "mobile": "9876543211"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/organization-users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "mobile": "9876543211"
  }'
```

### 7. Delete Organization User
**Endpoint:** `DELETE /organization-users/:id`

**Required Role:** organization

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/organization-users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

### 8. Reset Organization User Password
**Endpoint:** `POST /organization-users/reset-password`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "newPassword": "NewSecurePass@456"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/organization-users/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "newPassword": "NewSecurePass@456"
  }'
```

---

## Student Endpoints

### 9. Admit New Student
**Endpoint:** `POST /students/admit`

**Required Role:** organization, admission_staff, accountant

**Request Body:**
```json
{
  "fullName": "Raj Kumar",
  "age": 15,
  "bloodGroup": "O+",
  "mobile": "9876543210",
  "parentMobile": "9876543200",
  "studentEmail": "raj@example.com",
  "parentEmail": "parent@example.com",
  "fatherName": "Mr. Kumar",
  "motherName": "Mrs. Kumar",
  "guardianName": "Uncle Kumar",
  "aadharNo": "123456789012",
  "parentAadharNumber": "123456789013",
  "parentAadharRelation": "father",
  "fullAddress": "123 Main Street, City",
  "classId": "507f1f77bcf86cd799439013",
  "sectionId": "507f1f77bcf86cd799439014",
  "year": 2024
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/students/admit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "fullName": "Raj Kumar",
    "age": 15,
    "bloodGroup": "O+",
    "mobile": "9876543210",
    "parentMobile": "9876543200",
    "studentEmail": "raj@example.com",
    "parentEmail": "parent@example.com",
    "fatherName": "Mr. Kumar",
    "motherName": "Mrs. Kumar",
    "guardianName": "Uncle Kumar",
    "aadharNo": "123456789012",
    "parentAadharNumber": "123456789013",
    "parentAadharRelation": "father",
    "fullAddress": "123 Main Street, City",
    "classId": "507f1f77bcf86cd799439013",
    "sectionId": "507f1f77bcf86cd799439014",
    "year": 2024
  }'
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "student": {
      "_id": "607f1f77bcf86cd799439012",
      "fullName": "Raj Kumar",
      "aadharNo": "123456789012",
      "registrationNumber": "1234567890123456",
      ...
    },
    "session": {
      "_id": "607f1f77bcf86cd799439015",
      "studentId": "607f1f77bcf86cd799439012",
      "classId": "507f1f77bcf86cd799439013",
      ...
    },
    "credentials": {
      "registrationNumber": "1234567890123456",
      "password": "Ab@XyZ123!"
    }
  }
}
```

### 10. Get All Students
**Endpoint:** `GET /students?page=1&limit=10&fullName=Raj`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/students?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 11. Get Student by ID
**Endpoint:** `GET /students/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/students/607f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <token>"
```

### 12. Update Student
**Endpoint:** `PUT /students/:id`

**Request Body:**
```json
{
  "fullName": "Raj Kumar Singh",
  "mobile": "9876543215"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/students/607f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "fullName": "Raj Kumar Singh",
    "mobile": "9876543215"
  }'
```

### 13. Delete Student
**Endpoint:** `DELETE /students/:id`

**Required Role:** organization, admission_staff

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/students/607f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <token>"
```

### 14. Promote Student to Next Year
**Endpoint:** `POST /students/promote/:studentId`

**Required Role:** organization, admission_staff

**Request Body:**
```json
{
  "studentId": "607f1f77bcf86cd799439012",
  "newYear": 2025,
  "classId": "507f1f77bcf86cd799439016",
  "sectionId": "507f1f77bcf86cd799439017"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/students/promote/607f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "newYear": 2025,
    "classId": "507f1f77bcf86cd799439016",
    "sectionId": "507f1f77bcf86cd799439017"
  }'
```

### 15. Get Student History
**Endpoint:** `GET /students/:studentId/history?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/students/607f1f77bcf86cd799439012/history?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 16. Get Latest Student Session
**Endpoint:** `GET /students/:studentId/latest-session`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/students/607f1f77bcf86cd799439012/latest-session \
  -H "Authorization: Bearer <token>"
```

---

## Class Endpoints

### 17. Create Class
**Endpoint:** `POST /classes`

**Required Role:** organization

**Request Body:**
```json
{
  "name": "Class 10-A",
  "description": "Science stream class"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Class 10-A",
    "description": "Science stream class"
  }'
```

### 18. Get All Classes
**Endpoint:** `GET /classes?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/classes?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 19. Get Class by ID
**Endpoint:** `GET /classes/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/classes/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer <token>"
```

### 20. Update Class
**Endpoint:** `PUT /classes/:id`

**Request Body:**
```json
{
  "name": "Class 10-B",
  "description": "Science stream class (updated)"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/classes/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Class 10-B",
    "description": "Science stream class (updated)"
  }'
```

### 21. Delete Class
**Endpoint:** `DELETE /classes/:id`

**Required Role:** organization

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/classes/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer <token>"
```

---

## Section Endpoints

### 22. Create Section
**Endpoint:** `POST /sections`

**Required Role:** organization

**Request Body:**
```json
{
  "name": "Section A",
  "classId": "507f1f77bcf86cd799439013",
  "description": "First section of class 10"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Section A",
    "classId": "507f1f77bcf86cd799439013",
    "description": "First section of class 10"
  }'
```

### 23. Get All Sections
**Endpoint:** `GET /sections?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/sections?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 24. Get Sections by Class
**Endpoint:** `GET /sections/class/:classId?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/sections/class/507f1f77bcf86cd799439013?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 25. Get Section by ID
**Endpoint:** `GET /sections/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/sections/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer <token>"
```

### 26. Update Section
**Endpoint:** `PUT /sections/:id`

**Request Body:**
```json
{
  "name": "Section B"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/sections/507f1f77bcf86cd799439014 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Section B"
  }'
```

### 27. Delete Section
**Endpoint:** `DELETE /sections/:id`

**Required Role:** organization

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/sections/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer <token>"
```

---

## Menu Endpoints

### 28. Create Menu
**Endpoint:** `POST /menus`

**Required Role:** organization

**Request Body:**
```json
{
  "name": "Dashboard",
  "url": "/dashboard",
  "icon": "dashboard-icon",
  "order": 1,
  "parentId": null
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/menus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Dashboard",
    "url": "/dashboard",
    "icon": "dashboard-icon",
    "order": 1,
    "parentId": null
  }'
```

### 29. Get All Menus
**Endpoint:** `GET /menus?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/menus?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 30. Get Main Menus
**Endpoint:** `GET /menus/main/list`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/menus/main/list \
  -H "Authorization: Bearer <token>"
```

### 31. Get Menus with Submenus (Tree Structure)
**Endpoint:** `GET /menus/tree/structure`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/menus/tree/structure \
  -H "Authorization: Bearer <token>"
```

### 32. Get Menu by ID
**Endpoint:** `GET /menus/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/menus/507f1f77bcf86cd799439018 \
  -H "Authorization: Bearer <token>"
```

### 33. Get Submenus (By ParentId)
**Endpoint:** `GET /menus/:parentId/submenus`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/menus/507f1f77bcf86cd799439018/submenus \
  -H "Authorization: Bearer <token>"
```

### 34. Update Menu
**Endpoint:** `PUT /menus/:id`

**Request Body:**
```json
{
  "name": "Home",
  "url": "/home",
  "order": 0
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/menus/507f1f77bcf86cd799439018 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Home",
    "url": "/home",
    "order": 0
  }'
```

### 35. Delete Menu
**Endpoint:** `DELETE /menus/:id`

**Required Role:** organization

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/menus/507f1f77bcf86cd799439018 \
  -H "Authorization: Bearer <token>"
```

---

## Notice Board Endpoints

### 36. Create Notice
**Endpoint:** `POST /notices`

**Required Role:** organization, teacher, staff

**Request Body:**
```json
{
  "title": "Important Announcement",
  "description": "School will be closed on Monday",
  "attachments": ["document.pdf"]
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Important Announcement",
    "description": "School will be closed on Monday",
    "attachments": ["document.pdf"]
  }'
```

### 37. Get All Notices
**Endpoint:** `GET /notices?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/notices?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 38. Get Recent Notices
**Endpoint:** `GET /notices/recent`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/notices/recent \
  -H "Authorization: Bearer <token>"
```

### 39. Get Notice by ID
**Endpoint:** `GET /notices/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/notices/507f1f77bcf86cd799439019 \
  -H "Authorization: Bearer <token>"
```

### 40. Update Notice
**Endpoint:** `PUT /notices/:id`

**Request Body:**
```json
{
  "title": "Updated Announcement",
  "description": "School will be closed on Tuesday"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/notices/507f1f77bcf86cd799439019 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Updated Announcement",
    "description": "School will be closed on Tuesday"
  }'
```

### 41. Delete Notice
**Endpoint:** `DELETE /notices/:id`

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/notices/507f1f77bcf86cd799439019 \
  -H "Authorization: Bearer <token>"
```

---

## Notification Endpoints

### 42. Create Notification
**Endpoint:** `POST /notifications`

**Request Body:**
```json
{
  "type": "fee",
  "title": "Fee Due",
  "message": "Monthly fee is due",
  "email": "student@example.com",
  "mobile": "9876543210",
  "studentId": "607f1f77bcf86cd799439012"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "fee",
    "title": "Fee Due",
    "message": "Monthly fee is due",
    "email": "student@example.com",
    "mobile": "9876543210",
    "studentId": "607f1f77bcf86cd799439012"
  }'
```

### 43. Get All Notifications
**Endpoint:** `GET /notifications?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/notifications?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 44. Get Notifications by Student
**Endpoint:** `GET /notifications/student/:studentId?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/notifications/student/607f1f77bcf86cd799439012?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 45. Get Notification by ID
**Endpoint:** `GET /notifications/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/notifications/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <token>"
```

### 46. Mark Notification as Read
**Endpoint:** `PUT /notifications/:id/read`

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/507f1f77bcf86cd799439020/read \
  -H "Authorization: Bearer <token>"
```

### 47. Get Unread Count for Student
**Endpoint:** `GET /notifications/student/:studentId/unread-count`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/notifications/student/607f1f77bcf86cd799439012/unread-count \
  -H "Authorization: Bearer <token>"
```

### 48. Update Notification
**Endpoint:** `PUT /notifications/:id`

**Request Body:**
```json
{
  "title": "Updated Notification"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/507f1f77bcf86cd799439020 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Updated Notification"
  }'
```

### 49. Delete Notification
**Endpoint:** `DELETE /notifications/:id`

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/notifications/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <token>"
```

---

## Fee Endpoints

### 50. Create Fee
**Endpoint:** `POST /fees`

**Required Role:** organization, admission_staff, accountant

**Request Body:**
```json
{
  "studentId": "607f1f77bcf86cd799439012",
  "studentSessionId": "607f1f77bcf86cd799439015",
  "classId": "507f1f77bcf86cd799439013",
  "type": "monthly",
  "amount": 5000,
  "dueDate": "2024-12-31",
  "remarks": "Monthly fee"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/fees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "studentId": "607f1f77bcf86cd799439012",
    "studentSessionId": "607f1f77bcf86cd799439015",
    "classId": "507f1f77bcf86cd799439013",
    "type": "monthly",
    "amount": 5000,
    "dueDate": "2024-12-31",
    "remarks": "Monthly fee"
  }'
```

### 51. Get All Fees
**Endpoint:** `GET /fees?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/fees?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 52. Get Fees by Student
**Endpoint:** `GET /fees/student/:studentId?page=1&limit=10`

**CURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/fees/student/607f1f77bcf86cd799439012?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 53. Get Pending Fees (Report)
**Endpoint:** `GET /fees/report/pending`

**Required Role:** organization, accountant

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/fees/report/pending \
  -H "Authorization: Bearer <token>"
```

### 54. Get Overdue Fees (Report)
**Endpoint:** `GET /fees/report/overdue`

**Required Role:** organization, accountant

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/fees/report/overdue \
  -H "Authorization: Bearer <token>"
```

### 55. Get Fee by ID
**Endpoint:** `GET /fees/:id`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/fees/507f1f77bcf86cd799439021 \
  -H "Authorization: Bearer <token>"
```

### 56. Update Fee
**Endpoint:** `PUT /fees/:id`

**Required Role:** organization, accountant

**Request Body:**
```json
{
  "amount": 5500,
  "remarks": "Increased fee"
}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/fees/507f1f77bcf86cd799439021 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 5500,
    "remarks": "Increased fee"
  }'
```

### 57. Pay Fee
**Endpoint:** `PUT /fees/:id/pay`

**Request Body:**
```json
{}
```

**CURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/fees/507f1f77bcf86cd799439021/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{}'
```

### 58. Delete Fee
**Endpoint:** `DELETE /fees/:id`

**Required Role:** organization, accountant

**CURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/fees/507f1f77bcf86cd799439021 \
  -H "Authorization: Bearer <token>"
```

### 59. Generate Monthly Fees
**Endpoint:** `POST /fees/generate/monthly`

**Required Role:** organization, accountant

**Request Body:**
```json
{
  "amount": 5000,
  "dueDate": "2024-12-27"
}
```

**CURL:**
```bash
curl -X POST http://localhost:3000/api/v1/fees/generate/monthly \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 5000,
    "dueDate": "2024-12-27"
  }'
```

---

## Health Check

### 60. Health Check
**Endpoint:** `GET /api/v1/health`

**CURL:**
```bash
curl -X GET http://localhost:3000/api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-03-29T10:30:45.123Z"
}
```

---

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "details": ["email is required", "password is required"]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized - Token expired"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Forbidden - insufficient permissions"
}
```

### Not Found (404)
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Student not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already exists"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Pagination

All list endpoints support pagination with following query parameters:

- `page` (default: 1) - Page number
- `limit` (default: 10, max: 100) - Items per page

Response includes pagination information:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Filtering

List endpoints support field-based filtering:

```bash
curl -X GET "http://localhost:3000/api/v1/students?fullName=Raj&status=active" \
  -H "Authorization: Bearer <token>"
```

---

## Roles and Permissions

- **organization** - Full access to all features
- **admission_staff** - Can admit students, manage fees
- **teacher** - Can create notices, view students
- **staff** - Limited access
- **accountant** - Can manage fees, view reports

---

## Notes

1. Always include Bearer token in Authorization header for protected endpoints
2. Dates should be in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
3. Mobile numbers must be 10 digits
4. Aadhar numbers must be 12 digits
5. Passwords must contain at least 8 characters
6. Registration numbers are auto-generated (16 digits)
7. Default passwords are auto-generated and should be changed on first login

---

## Example Workflow

### 1. Organization Login
```bash
# Admin logs in
curl -X POST http://localhost:3000/api/v1/organization-users/login \
  -H "Content-Type: application/json" \
  -d '...'
```

### 2. Create Class and Section
```bash
# Create class
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Authorization: Bearer <token>" \
  -d '...'

# Create section
curl -X POST http://localhost:3000/api/v1/sections \
  -H "Authorization: Bearer <token>" \
  -d '...'
```

### 3. Admit Student
```bash
curl -X POST http://localhost:3000/api/v1/students/admit \
  -H "Authorization: Bearer <token>" \
  -d '...'
```

### 4. Student Logs In
```bash
# Use credentials from admission response
curl -X POST http://localhost:3000/api/v1/students/login \
  -d '...'
```

### 5. Generate Monthly Fees
```bash
curl -X POST http://localhost:3000/api/v1/fees/generate/monthly \
  -H "Authorization: Bearer <token>" \
  -d '...'
```

### 6. Create Notification for Fee
```bash
curl -X POST http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer <token>" \
  -d '...'
```

---

End of API Documentation
