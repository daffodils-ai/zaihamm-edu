# Quick Start Guide - Testing the Frontend

## Prerequisites
- Backend server running on `http://localhost:3000`
- Node.js 20.19.0 or >=22.12.0
- npm installed

## Step 1: Install Dependencies

```bash
cd /home/zaid/projects/edu/frontend
npm install
```

**Expected output:**
- All packages should install without errors
- Look for: `added X packages in Y seconds`

## Step 2: Verify Configuration

**Check API URL in `src/api/urls.js`:**
```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

The URL should match your backend server address and port.

## Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

## Step 4: Test the Application

### 1. Open browser to `http://localhost:5173/`
You should see the **Landing Page** with:
- Navigation bar with "Admin Login" and "Student Login" buttons
- Hero section with title and description
- Features grid (6 feature cards)
- About section
- Call-to-action buttons
- Footer

### 2. Test Admin Login
- Click "Admin Login" button
- Navigate to `http://localhost:5173/login`
- Use credentials from backend test data:
  - Organization ID: (check your backend setup)
  - Email: (org user email from backend)
  - Password: (org user password from backend)
- Click "Login"
- Should redirect to `/admin` dashboard

### 3. Test Student Login
- Click "Student Login" button
- Navigate to `http://localhost:5173/student-login`
- Use credentials:
  - Registration Number: (16-digit from backend)
  - Password: (student password from backend)
- Click "Login"
- Should redirect to `/student` portal

### 4. Test Admin Dashboard
Once logged in as organization user:
- See sidebar with menu items
- Click "Students" to view student list
- Test features:
  - **Filtering**: Enter name/registration number/class
  - **Pagination**: Navigate through pages
  - **View Student**: Click view icon to see details
  - **Edit Student**: Click edit icon to modify
  - **Delete Student**: Click delete icon
  - **Bulk Actions**: Select multiple and operate

### 5. Test Navigation
- Click different menu items to verify routing
- Try 404 page: `http://localhost:5173/nonexistent`

## Step 5: Build for Production

```bash
npm run build
```

**Expected output:**
```
✓ built in XXs

dist/index.html                   1.23 kB │ gzip:  0.45 kB
dist/assets/index-xxxxx.css      10.45 kB │ gzip:  3.21 kB
dist/assets/index-xxxxx.js      145.23 kB │ gzip: 42.15 kB
```

## Step 6: Preview Production Build

```bash
npm run preview
```

Navigate to the provided URL to test production build.

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] Navigation bar visible and responsive
- [ ] Admin login page accessible
- [ ] Student login page accessible
- [ ] Login succeeds with correct credentials
- [ ] Redirects to appropriate dashboard
- [ ] Sidebar navigation works
- [ ] Student list loads with data
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Create student form displays
- [ ] Edit student form displays
- [ ] Delete confirms and removes
- [ ] Responsive design works on mobile (F12 device mode)
- [ ] Console shows no errors (F12 console)

## Browser DevTools Inspection

### Check Network Requests (F12 > Network)
- All API calls should have status 200/201
- Check Authorization header has `Bearer <token>`
- Response data matches component expectations

### Check Storage (F12 > Application > LocalStorage)
- Keys with `edu_app_` prefix should exist:
  - `edu_app_auth_token`
  - `edu_app_user`
  - `edu_app_organization_id`

### Check Console (F12 > Console)
- No red errors
- Warnings are acceptable
- Message: "Auth restored from localStorage" on page refresh if logged in

## Common Test Scenarios

### Scenario 1: Fresh Install
1. Clear localStorage
2. Go to `http://localhost:5173/`
3. Try accessing `/admin` (should redirect to `/login`)
4. Login with credentials
5. Should see dashboard

### Scenario 2: Page Refresh
1. Login to admin
2. Press F5 to refresh page
3. Should stay logged in (auto-restore from localStorage)

### Scenario 3: Multiple Tabs
1. Login in Tab 1
2. Open Tab 2 and go to same URL
3. Should be logged in automatically (shared localStorage)

### Scenario 4: Session Expiry
1. Logout and verify:
   - Page redirects to `/`
   - localStorage cleared
   - Session data removed

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### API Connection Failed
- Check backend is running: `curl http://localhost:3000/api/v1/health`
- Check API URL in `src/api/urls.js`
- Check browser console for CORS errors

### Login Fails
- Verify credentials exist in backend database
- Check backend logs for error details
- Clear localStorage and try again
- Verify email/password are correct

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Styling Issues
- Check Bootstrap CSS loaded (Network tab look for bootstrap.css)
- Clear browser cache: Ctrl+Shift+Del
- Hard refresh: Ctrl+Shift+R

## Performance Tips

1. **Network Tab**: Check bundle sizes
   - HTML: ~1.23 kB
   - CSS: ~10-15 kB
   - JS: ~140-160 kB (with code splitting)

2. **Lighthouse Audit** (F12 > Lighthouse)
   - Target Performance: 80+
   - Target Accessibility: 90+

3. **Bundle Analysis**
   - Use: `npm run build -- --visualizer`
   - Identify large chunks

## Next Steps

After successful testing:

1. **Deploy Backend**: Set up backend server
2. **Deploy Frontend**: Build and deploy to static hosting
3. **Implement Remaining Pages**: Follow the pattern of StudentList/Form/Detail for other entities
4. **Add Advanced Features**: Charts, file upload, real-time notifications

## Documentation Files

- **IMPLEMENTATION_GUIDE.md**: Complete technical documentation
- **API_DOCUMENTATION.md** (server folder): Backend API specifications
- **SETUP_AND_TESTING.md** (server folder): Backend setup instructions

## Support

For detailed documentation, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
