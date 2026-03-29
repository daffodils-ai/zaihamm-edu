# School Management System

A comprehensive school management system built with Node.js, Express, and MongoDB.

## Features

- **Authentication**
  - Organization user login with role-based access
  - Student login with registration number
  - Password reset functionality
  - JWT token-based authentication

- **Role-Based Access Control (RBAC)**
  - Organization Admin
  - Admission Staff
  - Teacher
  - Staff
  - Accountant
  - Custom roles support

- **Student Management**
  - Student admission with detailed information
  - Student session management (class, section, year)
  - Student history tracking
  - Student promotion to next year
  - Unique registration number generation

- **Academic Management**
  - Class CRUD operations
  - Section management
  - Menu and submenu management
  - Organization-specific menu mapping

- **Fee Management**
  - Fee creation and tracking
  - Multiple fee types (monthly, yearly, admission, exam, etc.)
  - Fee payment processing
  - Automated monthly fee generation (scheduled)
  - Fee reports (pending, overdue)

- **Notifications**
  - Notice board management
  - Notification system
  - Student notifications
  - Automatic fee due notifications
  - Multi-channel notifications (email, mobile)

- **Centralized Features**
  - Centralized error handling
  - Request logging
  - Database connection pooling
  - Audit fields (status, is_active, created_at, updated_at)
  - Comprehensive API documentation

## Tech Stack

- **Runtime:** Node.js (ES6 modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs for password hashing
- **Task Scheduling:** node-cron for recurring jobs
- **Validation:** express-validator
- **CORS:** cors middleware
- **Logging:** Custom logger with file support

## Project Structure

```
edu/
├── server/
│   ├── main.js                 # Entry point
│   └── src/
│       ├── constants/          # Constants and enums
│       ├── controller/         # Route controllers
│       ├── database/           # Database connection
│       ├── logger/             # Logging utility
│       ├── middleware/         # Authentication and error handling
│       ├── model/              # Mongoose schemas
│       ├── repository/         # Data access layer
│       ├── routes/             # Route definitions
│       ├── service/            # Business logic layer
│       └── utils/              # Utility functions
├── package.json
├── .env
└── API_DOCUMENTATION.md
```

## Installation

1. **Clone the repository**
```bash
cd /home/zaid/projects/edu
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=7d
LOG_LEVEL=INFO
PORT=3000
NODE_ENV=development
```

4. **Ensure MongoDB is running**
```bash
# Start MongoDB service
mongod
```

5. **Start the server**
```bash
# Production
npm start

# Development with auto-reload
npm run dev
```

The server will start at `http://localhost:3000`

## Architecture

This project follows SOLID principles and clean code architecture:

- **Controllers:** Handle HTTP requests/responses
- **Services:** Contain business logic
- **Repositories:** Handle database operations
- **Models:** Define database schemas
- **Middleware:** Authentication and error handling
- **Routes:** Define API endpoints
- **Utils:** Shared utility functions
- **Constants:** Application-wide constants

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation with CURL examples.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/organization-users/login` | Organization user login |
| POST | `/api/v1/organization-users` | Create organization user |
| GET | `/api/v1/organization-users` | Get all users |
| POST | `/api/v1/students/login` | Student login |
| POST | `/api/v1/students/admit` | Admit new student |
| GET | `/api/v1/students` | Get all students |
| POST | `/api/v1/classes` | Create class |
| POST | `/api/v1/sections` | Create section |
| POST | `/api/v1/fees` | Create fee |
| GET | `/api/v1/fees/report/pending` | Get pending fees |
| POST | `/api/v1/notifications` | Create notification |
| GET | `/api/v1/health` | Health check |

## Database Models

- **Organization** - School organization details
- **OrganizationUser** - Staff members and admin users
- **Student** - Student information
- **StudentSession** - Student enrollment per year
- **Class** - Academic classes
- **Section** - Class sections
- **Menu** - Menu system with submenus
- **OrganizationMenu** - Role-based menu mapping
- **NoticeBoard** - School notices
- **Notification** - Notification tracking
- **Fee** - Student fees

## Middleware

- **authMiddleware** - JWT token validation
- **roleAccessMiddleware** - Role-based access control
- **errorHandlerMiddleware** - Centralized error handling
- **notFoundMiddleware** - 404 handler

## Features Implementation

### 1. Authentication
- Secure password hashing with bcryptjs
- JWT token generation and validation
- Separate authentication for users and students
- Password reset functionality

### 2. RBAC
- Implemented via middleware
- Role-specific endpoint access
- Organization-scoped permissions

### 3. Student Management
- Comprehensive student admission
- Automatic registration number generation
- Multi-year session tracking
- Student promotion workflow

### 4. Fee Management
- Multiple fee types support
- Automated monthly fee generation
- Payment tracking
- Email/SMS notification integration points

### 5. Notifications
- Multi-type notification system
- Student-specific notifications
- Read/unread tracking
- Notification reports

### 6. Error Handling
- Centralized error middleware
- Custom API error class
- Consistent error response format
- Proper HTTP status codes

### 7. Logging
- Request logging
- Error logging
- File-based logging support
- Configurable log levels

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation
- Error message sanitization
- CORS protection
- Connection pooling for database

## Code Quality

- **ES6 Modules** - Modern module system
- **SOLID Principles** - Clean code architecture
- **DRY** - No code duplication
- **KISS** - Keep it simple and straightforward
- **YAGNI** - You aren't gonna need it
- **Consistent Naming** - Clear variable/function names
- **Separation of Concerns** - Each layer has a single responsibility

## Example Usage

### 1. Start Server
```bash
npm run dev
```

### 2. Create Organization User (Admin)
```bash
curl -X POST http://localhost:3000/api/v1/organization-users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com",
    "mobile": "9876543210",
    "password": "SecurePass@123",
    "role": "organization",
    "organizationId": "507f1f77bcf86cd799439011"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/organization-users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePass@123",
    "organizationId": "507f1f77bcf86cd799439011"
  }'
```

### 4. Create Class
```bash
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Class 10-A",
    "description": "Science stream class"
  }'
```

### 5. Admit Student
```bash
curl -X POST http://localhost:3000/api/v1/students/admit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "fullName": "Raj Kumar",
    "age": 15,
    "parentMobile": "9876543200",
    "fatherName": "Mr. Kumar",
    "motherName": "Mrs. Kumar",
    "aadharNo": "123456789012",
    "parentAadharNumber": "123456789013",
    "parentAadharRelation": "father",
    "fullAddress": "123 Main Street, City",
    "classId": "507f1f77bcf86cd799439013",
    "sectionId": "507f1f77bcf86cd799439014",
    "year": 2024
  }'
```

## Scheduled Jobs

- **Monthly Fee Generation** - Runs on 27th of every month at 00:00
  - Automatically generates monthly fees for all active students
  - Creates notification records for billing

## Scalability

- Database connection pooling with configurable pool size
- Pagination support for all list endpoints
- Indexed database queries for performance
- Modular architecture for easy feature addition

## Future Enhancements

- Email sending integration (Nodemailer, SendGrid)
- SMS sending integration (Twilio)
- File upload support (Multer)
- Advanced reporting and analytics
- Real-time notifications (Socket.io)
- API rate limiting
- Unit and integration tests
- Docker containerization

## Contributing

Follow the established architecture and coding standards when adding new features.

## License

This project is proprietary and confidential.

## Support

For issues and support, contact the development team.

---

**Last Updated:** March 29, 2026
