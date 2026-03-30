# School Management System - Frontend Implementation

## Project Overview

A comprehensive Vue 3 + Vite frontend for the School Management System with the following features:

### ✨ Features Implemented

#### 1. **Authentication System**
- Organization User Login (`/login`)
- Student Login (`/student-login`)
- Reset Password functionality
- Token-based JWT authentication
- Automatic auth persistence (localStorage)

#### 2. **API Integration Layer**
- Centralized API service (`api/api.js`)
- Comprehensive URL constants (`api/urls.js`)
- Modular API endpoints for all resources
- Error handling and response management
- Bearer token authentication

#### 3. **State Management (Vuex)**
- Namespaced modules for clean architecture
- Modules: auth, students, classes, sections, notices, fees, organizationUsers, notifications
- Each module includes: state, mutations, actions, getters
- Data persistence via localStorage
- Real-time state management

#### 4. **Data Persistence**
- Storage Service for localStorage management
- Auth tokens and user data persistence
- Filter state persistence at query parameter level
- Cache management for list data

#### 5. **Routing & Navigation**
- Vue Router with route guards
- Protected routes based on user authentication
- Role-based access control (organization_user vs student)
- Nested routing for admin dashboard
- Dynamic page titles

#### 6. **Components**
- Reusable UI components:
  - `CustomButton.vue` - Styled button with loading state
  - `CustomInput.vue` - Form input with validation
  - `CustomSelect.vue` - Dropdown select component
  - `AlertComponent.vue` - Alert/notification component
  - `GenericList.vue` - Generic list template

#### 7. **Utilities & Directives**
- Date utilities (format, parse, timezone conversion)
- Validation utilities (email, phone, aadhar, password)
- Custom directives (v-formatDateTime, v-formatDate, v-active)
- Error message extraction

#### 8. **UI/UX**
- Beautiful gradient designs
- Responsive bootstrap layout
- Smooth animations and transitions
- Modern card-based design
- Professional color scheme
- Mobile-responsive layouts

#### 9. **Pages Implemented**

**Public Pages:**
- Landing page with features showcase
- 404 Not Found page

**Authentication Pages:**
- Organization User Login
- Student Login
- Reset Password

**Admin Dashboard:**
- Dashboard Layout with sidebar navigation
- Dashboard Home with statistics and charts
- Student Management (List, Create, Edit, View)
- Classes, Sections, Notices, Fees, and Users (stubs ready for implementation)

**Student Portal:**
- Student Portal layout
- Dashboard, Notices, and Fees pages (stubs ready)

## Project Structure

```
frontend/src/
├── api/
│   ├── api.js              # API service with fetch wrapper
│   └── urls.js             # API endpoint constants
├── components/
│   ├── CustomButton.vue      # Reusable button component
│   ├── CustomInput.vue       # Form input component
│   ├── CustomSelect.vue      # Select dropdown component
│   ├── AlertComponent.vue    # Alert/notification component
│   └── GenericList.vue       # Generic list template
├── service/
│   └── StorageService.js     # LocalStorage management
├── store/
│   ├── index.js              # Vuex store root
│   └── modules/
│       ├── auth/             # Authentication module
│       ├── students/         # Students module
│       ├── classes/          # Classes module
│       ├── sections/         # Sections module
│       ├── notices/          # Notices module
│       ├── fees/             # Fees module
│       ├── organizationUsers/# Organization users module
│       └── notifications/    # Notifications module
├── views/
│   ├── Landing.vue           # Landing page
│   ├── NotFound.vue          # 404 page
│   ├── auth/
│   │   ├── Login.vue         # Organization login
│   │   ├── StudentLogin.vue  # Student login
│   │   └── ResetPassword.vue # Password reset
│   ├── admin/
│   │   ├── Dashboard.vue     # Admin layout
│   │   ├── DashboardHome.vue # Dashboard home
│   │   ├── students/         # Student pages
│   │   ├── classes/          # Class pages
│   │   ├── sections/         # Section pages
│   │   ├── notices/          # Notice pages
│   │   ├── fees/             # Fee pages
│   │   └── users/            # User management pages
│   └── student/
│       ├── StudentPortal.vue # Student layout
│       ├── StudentDashboard.vue
│       ├── StudentNotices.vue
│       └── StudentFees.vue
├── utils/
│   ├── dateUtils.js          # Date formatting utilities
│   ├── validation.js         # Form validation
│   └── directives.js         # Custom directives
├── router/
│   └── index.js              # Vue Router configuration
├── App.vue                   # Root component
├── main.js                   # Entry point
├── style.css                 # Global styles
└── vite.config.js            # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js 20.19.0 or >=22.12.0
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Bootstrap (if needed)
npm install bootstrap

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Configuration

**API Base URL:**
Update the API base URL in `src/api/urls.js`:
```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

## API Integration

### Making API Calls

All API calls go through the centralized service in `src/api/api.js`:

```javascript
import { students, auth } from '@/api/api.js';

// Fetch students
const response = await students.getAll(page, limit, filters);

// Login
const response = await auth.orgUserLogin(email, password, organizationId);

// Create resource
const response = await students.create(studentData);
```

### Error Handling

Errors are automatically extracted and can be accessed via:

```javascript
import { getErrorMessage } from '@/utils/validation.js';

try {
  await students.getAll();
} catch (error) {
  const message = getErrorMessage(error);
  console.error(message);
}
```

## State Management

### Vuex Store Usage

```javascript
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('students', ['students', 'loading']),
    ...mapGetters('students', ['totalPages'])
  },
  methods: {
    ...mapActions('students', ['fetchStudents'])
  }
};
```

### Available Modules

Each module has standard CRUD operations:

```javascript
// Fetch list
await fetchStudents({ page: 1, limit: 20, filters: {} });

// Fetch single item
await fetchStudentById(id);

// Create
await createStudent(data);

// Update
await updateStudent({ id, data });

// Delete
await deleteStudent(id);
```

## Components

### CustomInput
```vue
<CustomInput
  v-model="email"
  label="Email"
  type="email"
  placeholder="Enter email"
  :error="errors.email"
  required
/>
```

### CustomSelect
```vue
<CustomSelect
  v-model="classId"
  label="Class"
  :options="classOptions"
  placeholder="Select class"
  :error="errors.classId"
/>
```

### CustomButton
```vue
<CustomButton
  label="Submit"
  variant="primary"
  size="lg"
  :is-loading="isLoading"
  @click="submit"
/>
```

### AlertComponent
```vue
<AlertComponent
  type="success"
  title="Success"
  message="Operation successful"
  :timeout="3000"
/>
```

## Directives

### Date Formatting
```vue
<!-- Format as DD/MM/YYYY HH:mm:ss AM/PM -->
<div v-format-datetime="student.createdAt">
</div>

<!-- Format as DD/MM/YYYY -->
<div v-format-date="student.createdAt">
</div>

<!-- Format active status -->
<span v-active="student.is_active"></span>
```

## Styling

### Variables
```css
--primary-color: #2c3e50;
--secondary-color: #3498db;
--success-color: #27ae60;
--danger-color: #e74c3c;
--warning-color: #f39c12;
--light-color: #ecf0f1;
--dark-color: #2c3e50;
```

### Utility Classes
- `.bg-gradient` - Linear gradient background
- `.shadow-sm` - Small shadow
- `.shadow-lg` - Large shadow
- `.text-primary`, `.text-success`, etc. - Text colors
- `.badge-*` - Badge styles

## Authentication & Authorization

### Login Flow

```javascript
// 1. User logs in
await auth.orgUserLogin(email, password, organizationId);

// 2. Token and user data stored in Vuex and localStorage
// 3. Router guard checks authentication
// 4. Redirects to appropriate dashboard

// 5. On refresh, auth is restored from localStorage
store.dispatch('auth/restoreAuth');
```

### Protected Routes

Routes marked with `requiresAuth: true` require authentication. Routes marked with specific `userType` require that user type.

```javascript
{
  path: '/admin',
  meta: { requiresAuth: true, userType: 'organization_user' }
}
```

## Development Tips

### Adding a New Page

1. Create the Vue file in `views/` directory
2. Add route to `router/index.js`
3. Use Vuex actions for data fetching
4. Import and use reusable components

### Adding a New Vuex Module

1. Create folder in `store/modules/`
2. Create `state.js`, `mutations.js`, `actions.js`, `getters.js`
3. Create `index.js` that combines all
4. Import in `store/index.js`

### Adding Validation

1. Add validation rules in `utils/validation.js`
2. Use in components for form validation
3. Display errors via `.error` prop on input components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues
- Check if backend server is running on correct port
- Verify API_BASE_URL in `src/api/urls.js`
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage and try logging in again
- Check if token is present in browser DevTools > Application > LocalStorage
- Verify token in Authorization header

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`
- Check Node version: `node --version`

## Future Enhancements

The following pages are ready with stub implementations and can be completed:

- Class Management (List, Create, Edit, View)
- Section Management
- Notice Board Management
- Fee Management
- Organization User Management
- Student Portal Pages
- Advanced Analytics Dashboard
- Reports and Statistics
- Bulk Operations
- File Upload Handling

## API Documentation Reference

See [API_DOCUMENTATION.md](../server/API_DOCUMENTATION.md) in the server folder for complete API specifications.

## License

Proprietary - School Management System

## Support

For issues or questions, please contact the development team.
