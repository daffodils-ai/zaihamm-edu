# School Management System - Setup & Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
cd /home/zaid/projects/edu
npm install
```

### 2. Configure Environment
Edit `.env` file (already created):
```env
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=7d
LOG_LEVEL=INFO
PORT=3000
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# On Linux/Mac
mongod

# On macOS with Homebrew
brew services start mongodb-community
```

### 4. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Expected Output:
```
✓ Server running at http://localhost:3000
✓ API documentation available at see API_DOCUMENTATION.md
```

## Testing the API

### Using Postman
1. Import API documentation from `API_DOCUMENTATION.md`
2. Set `{{baseUrl}}` to `http://localhost:3000/api/v1`
3. Add `{{token}}` for authenticated requests

### Using cURL (Example Workflow)

#### Step 1: Check Server Health
```bash
curl -X GET http://localhost:3000/api/v1/health
```

#### Step 2: Create Organization (via MongoDB directly for initial setup)
```bash
# Use MongoDB client
db.organization.insertOne({
  name: "My School",
  email: "school@example.com",
  mobile: "9876543210",
  address: "123 School Road",
  status: "active",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

#### Step 3: Create Admin User
```bash
curl -X POST http://localhost:3000/api/v1/organization-users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com",
    "mobile": "9876543210",
    "password": "Admin@123456",
    "role": "organization",
    "organizationId": "<organization_id>"
  }'
```

#### Step 4: Login
```bash
curl -X POST http://localhost:3000/api/v1/organization-users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "Admin@123456",
    "organizationId": "<organization_id>"
  }'
```

Copy the token from response and use for subsequent requests.

#### Step 5: Create Class
```bash
curl -X POST http://localhost:3000/api/v1/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Class X-A",
    "description": "Science stream"
  }'
```

#### Step 6: Create Section
```bash
curl -X POST http://localhost:3000/api/v1/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Section A",
    "classId": "<class_id>",
    "description": "Main section"
  }'
```

#### Step 7: Admit Student
```bash
curl -X POST http://localhost:3000/api/v1/students/admit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "fullName": "John Doe",
    "age": 16,
    "bloodGroup": "O+",
    "mobile": "9876543211",
    "parentMobile": "9876543212",
    "studentEmail": "john@example.com",
    "parentEmail": "parent@example.com",
    "fatherName": "James Doe",
    "motherName": "Jane Doe",
    "aadharNo": "123456789012",
    "parentAadharNumber": "123456789013",
    "parentAadharRelation": "father",
    "fullAddress": "456 Main Street, City",
    "classId": "<class_id>",
    "sectionId": "<section_id>",
    "year": 2024
  }'
```

Response will include:
```json
{
  "credentials": {
    "registrationNumber": "1234567890123456",
    "password": "GeneratedPass@1"
  }
}
```

#### Step 8: Student Login
```bash
curl -X POST http://localhost:3000/api/v1/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber": "1234567890123456",
    "password": "GeneratedPass@1"
  }'
```

#### Step 9: Create Fee
```bash
curl -X POST http://localhost:3000/api/v1/fees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "studentId": "<student_id>",
    "studentSessionId": "<session_id>",
    "classId": "<class_id>",
    "type": "monthly",
    "amount": 5000,
    "dueDate": "2024-12-31",
    "remarks": "December fee"
  }'
```

#### Step 10: View Reports
```bash
# Pending fees
curl -X GET http://localhost:3000/api/v1/fees/report/pending \
  -H "Authorization: Bearer <token>"

# Overdue fees
curl -X GET http://localhost:3000/api/v1/fees/report/overdue \
  -H "Authorization: Bearer <token>"
```

## Database Schema

### Collections Created:
1. **organization** - School details
2. **organization_user** - Staff/admin users
3. **student** - Student information
4. **student_session** - Student year-wise enrollment
5. **class** - Academic classes
6. **section** - Class sections
7. **menu** - Navigation menus
8. **organization_menu** - Role-based menu access
9. **notice_board** - School notices
10. **notification** - Notification records
11. **fee** - Student fee tracking

### Indexes Created:
- Organization ID on all student-related collections
- Email and mobile on user collections
- Student session with year tracking
- Fee due date and status for efficient querying

## Key Features Tested

- ✅ Organization user authentication
- ✅ Student admission with document generation
- ✅ Role-based access control
- ✅ CRUD operations on all entities
- ✅ Pagination support
- ✅ Field-based filtering
- ✅ Centralized error handling
- ✅ Database connection pooling
- ✅ JWT token validation
- ✅ Password hashing and validation
- ✅ Audit fields (created_at, updated_at)
- ✅ Fee management and reporting
- ✅ Student promotion workflow
- ✅ Notification system

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** 
```bash
# Ensure MongoDB is running
mongod

# Check connection
mongo
> use school_management
> db.collection.find().pretty()
```

### Issue: Port Already in Use
**Solution:**
```bash
# Change PORT in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Token Expired
**Solution:**
- Generate new token via login endpoint
- Update Authorization header with new token

### Issue: Unauthorized Access
**Solution:**
- Verify user role matches required permissions
- Check role constants in `src/constants/index.js`
- Verify token includes correct organization ID

## Performance Tips

1. **Database Queries:**
   - Indexes are already created for common queries
   - Use pagination for large datasets
   - Apply filters to reduce result set

2. **API Calls:**
   - Implement request caching client-side
   - Use appropriate pagination limits
   - Batch similar operations

3. **Server:**
   - MongoDB connection pooling enabled (min: 5, max: 10)
   - Use production mode for deployment
   - Enable gzip compression in reverse proxy

## Deployment

### Environment Configuration
```env
# Production
NODE_ENV=production
MONGODB_URI=mongodb://prod-server:27017/school_management
JWT_SECRET=<strong-secret-key>
PORT=8080
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server/main.js --name "school-api"

# View logs
pm2 logs school-api

# Monitor
pm2 monitoring
```

## Maintenance

### Regular Tasks
1. **Monitor Logs** - Check for errors and warnings
2. **Database Backups** - Regular MongoDB backups
3. **Token Rotation** - Update JWT secret periodically
4. **Password Audits** - Review user passwords
5. **Fee Reports** - Generate monthly fee reports

### Scheduled Jobs
- **27th of every month at 00:00** - Monthly fee generation

## Support & Debugging

### Enable Debug Logging
```env
LOG_LEVEL=DEBUG
```

### View Logs
```bash
# Recent logs
tail -f output.log

# Search logs
grep "ERROR" output.log
```

### API Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "statusCode": <http_code>,
  "message": "<response_message>",
  "data": {},
  "errors": []
}
```

## Next Steps

1. Start the server: `npm run dev`
2. Test health endpoint: `curl http://localhost:3000/api/v1/health`
3. Create initial data via MongoDB or API
4. Follow API_DOCUMENTATION.md for complete endpoint reference
5. Implement email/SMS notifications integration
6. Add file upload support for student photos
7. Create frontend dashboard

## Documentation

- **API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **README:** [README.md](./README.md)
- **Setup Guide:** This file
- **Code Structure:** See comments in source files

---

**Project Last Updated:** March 29, 2026
