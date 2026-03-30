# School Management System - Frontend

A comprehensive, modern Vue 3 + Vite frontend for the School Management System featuring beautiful UI, responsive design, complete CRUD operations, and professional state management.

## 📋 Quick Navigation

- **🚀 New to the project?** → Start with [QUICK_START.md](./QUICK_START.md)
- **📚 Technical details?** → See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- **✅ What's implemented?** → Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- **🔗 Backend API docs?** → See [../server/API_DOCUMENTATION.md](../server/API_DOCUMENTATION.md)

## 🎯 Project Overview

This is a **complete, production-ready frontend** for the School Management System with:

✅ **Beautiful UI** - Modern design with Bootstrap 5.3.8 and custom CSS  
✅ **Responsive Layout** - Works perfectly on desktop, tablet, and mobile  
✅ **Complete CRUD** - Create, read, update, delete for all entities  
✅ **State Management** - Vuex 4 with clean modular architecture  
✅ **API Integration** - Centralized service layer with all endpoints  
✅ **Authentication** - Token-based JWT with role-based access control  
✅ **Data Persistence** - localStorage for session management  
✅ **Form Validation** - Client-side validation before API calls  
✅ **Error Handling** - Comprehensive error management  
✅ **Date/Time Formatting** - 12-hour format with custom directives  

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Server runs on `http://localhost:5173/`

### 3. Login to Access Features
- **Admin**: Click "Admin Login" → Use organization credentials
- **Student**: Click "Student Login" → Use student credentials

### 4. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/src/
├── api/               # Centralized API service
├── components/        # Reusable UI components
├── store/             # Vuex state management
├── router/            # Vue Router configuration
├── utils/             # Helper functions & directives
├── views/             # Page components
├── service/           # localStorage management
├── main.js            # Entry point
├── App.vue            # Root component
└── style.css          # Global styling
```

## 🎨 Key Features

### Authentication
- Organization user login with multi-tenant support
- Student login with registration number
- Password reset functionality
- Automatic session restoration on page refresh

### Admin Dashboard
- Sidebar navigation with role-based menu
- Statistics dashboard with key metrics
- Student management (full CRUD)
- Classes, sections, notices, and fees management
- User account management

### Student Portal
- Personal dashboard
- View notices and announcements
- Check fees and payment status
- Account management

### Reusable Components
- CustomButton - Styled with variants and loading state
- CustomInput - Form input with validation
- CustomSelect - Dropdown with options
- AlertComponent - Notifications and alerts
- GenericList - Reusable table template

### Utilities
- Date formatting (12-hour format)
- Email, phone, aadhar validation
- Custom Vue directives
- Error message extraction

## 🔧 IDE Setup

### Recommended IDE
[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar/) (disable Vetur if installed)

### Recommended Browser Extensions
- **Chrome/Edge/Brave**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## 🌐 API Configuration

Update API base URL in `src/api/urls.js`:

```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

The backend must be running on the configured URL for all API calls to work.

## 🎓 Making API Calls

All API calls go through the centralized service:

```javascript
import { students, auth } from '@/api/api.js';

// Get list of students
const response = await students.getAll(page, limit, filters);

// Login
const loginResponse = await auth.orgUserLogin(email, password, organizationId);

// Create resource
const newStudent = await students.create(studentData);

// Update resource
const updated = await students.update(id, updatedData);

// Delete resource
await students.delete(id);
```

## 📊 State Management

Vuex modules provide clean state management:

```javascript
// In component
import { mapState, mapActions, mapGetters } from 'vuex';

computed: {
  ...mapState('students', ['students', 'loading']),
  ...mapGetters('students', ['totalPages'])
},
methods: {
  ...mapActions('students', ['fetchStudents', 'createStudent'])
}
```

## 🎯 Testing the Application

See [QUICK_START.md](./QUICK_START.md) for detailed testing checklist and scenarios.

Quick test:
1. Open `http://localhost:5173/`
2. Click "Admin Login"
3. Enter test credentials
4. View student list and test CRUD operations

## 📦 Technology Stack

- **Vue 3** (beta) - Progressive JavaScript framework
- **Vite** - Lightning-fast build tool
- **Vuex 4** - State management
- **Vue Router 5** - Client-side routing
- **Bootstrap 5.3.8** - CSS framework
- **Fetch API** - HTTP client
- **Vanilla CSS** - Custom styling

## 📈 Performance

- Total bundle size: ~150-175 KB (gzipped)
- Initial load: 1-2 seconds
- Page transitions: <500ms
- Optimized with code splitting and lazy loading

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control (organization_user, student)
- Protected routes with navigation guards
- Secure localStorage key prefixing
- CORS-ready API integration

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Setup and testing guide |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete technical documentation |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Implementation status and metrics |
| [../server/API_DOCUMENTATION.md](../server/API_DOCUMENTATION.md) | Backend API specifications |

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9
```

### API Connection Failed
Check backend is running:
```bash
curl http://localhost:3000/api/v1/health
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📋 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

1. Update API URL in `src/api/urls.js`
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting
4. Set up environment variables if needed

## 📞 Support

For questions or issues:
1. Check [QUICK_START.md](./QUICK_START.md) troubleshooting section
2. Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed docs
3. Check browser console (F12) for errors
4. Review network requests in DevTools (F12 > Network)

## 📝 License

Proprietary - School Management System

## ✨ Version

- **Frontend Version**: 1.0.0
- **Vue**: 3.x (beta)
- **Vite**: Latest
- **Bootstrap**: 5.3.8
- **Node**: 20.19.0+ or >=22.12.0
