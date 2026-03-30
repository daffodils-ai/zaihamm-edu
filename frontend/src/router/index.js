import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index.js';
import { storage } from '../service/StorageService.js';

// Import views/pages - these will be created
const Landing = () => import('../views/Landing.vue');
const Login = () => import('../views/auth/Login.vue');
const StudentLogin = () => import('../views/auth/StudentLogin.vue');
const ResetPassword = () => import('../views/auth/ResetPassword.vue');
const Dashboard = () => import('../views/admin/Dashboard.vue');
const DashboardHome = () => import('../views/admin/DashboardHome.vue');
const StudentList = () => import('../views/admin/students/StudentList.vue');
const StudentForm = () => import('../views/admin/students/StudentForm.vue');
const StudentDetail = () => import('../views/admin/students/StudentDetail.vue');
const ClassList = () => import('../views/admin/classes/ClassList.vue');
const ClassForm = () => import('../views/admin/classes/ClassForm.vue');
const ClassDetail = () => import('../views/admin/classes/ClassDetail.vue');
const SectionList = () => import('../views/admin/sections/SectionList.vue');
const SectionForm = () => import('../views/admin/sections/SectionForm.vue');
const NoticeList = () => import('../views/admin/notices/NoticeList.vue');
const NoticeForm = () => import('../views/admin/notices/NoticeForm.vue');
const FeeList = () => import('../views/admin/fees/FeeList.vue');
const FeeForm = () => import('../views/admin/fees/FeeForm.vue');
const OrganizationUserList = () => import('../views/admin/users/OrganizationUserList.vue');
const OrganizationUserForm = () => import('../views/admin/users/OrganizationUserForm.vue');
const StudentPortal = () => import('../views/student/StudentPortal.vue');
const StudentDashboard = () => import('../views/student/StudentDashboard.vue');
const StudentNotices = () => import('../views/student/StudentNotices.vue');
const StudentFees = () => import('../views/student/StudentFees.vue');
const NotFound = () => import('../views/NotFound.vue');

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: { requiresAuth: false, title: 'School Management System' }
  },

  // Auth Routes
  {
    path: '/login',
    name: 'OrgUserLogin',
    component: Login,
    meta: { requiresAuth: false, title: 'Organization Login' }
  },
  {
    path: '/student-login',
    name: 'StudentLogin',
    component: StudentLogin,
    meta: { requiresAuth: false, title: 'Student Login' }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: true, title: 'Reset Password' }
  },

  // Admin Dashboard Routes
  {
    path: '/admin',
    component: Dashboard,
    meta: { requiresAuth: true, userType: 'organization_user' },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: DashboardHome,
        meta: { title: 'Dashboard' }
      },

      // Students
      {
        path: 'students',
        name: 'StudentList',
        component: StudentList,
        meta: { title: 'Students' }
      },
      {
        path: 'students/new',
        name: 'StudentNew',
        component: StudentForm,
        meta: { title: 'Add Student' }
      },
      {
        path: 'students/:id',
        name: 'StudentDetail',
        component: StudentDetail,
        meta: { title: 'Student Detail' }
      },
      {
        path: 'students/:id/edit',
        name: 'StudentEdit',
        component: StudentForm,
        meta: { title: 'Edit Student' }
      },

      // Classes
      {
        path: 'classes',
        name: 'ClassList',
        component: ClassList,
        meta: { title: 'Classes' }
      },
      {
        path: 'classes/new',
        name: 'ClassNew',
        component: ClassForm,
        meta: { title: 'Add Class' }
      },
      {
        path: 'classes/:id',
        name: 'ClassDetail',
        component: ClassDetail,
        meta: { title: 'Class Detail' }
      },
      {
        path: 'classes/:id/edit',
        name: 'ClassEdit',
        component: ClassForm,
        meta: { title: 'Edit Class' }
      },

      // Sections
      {
        path: 'sections',
        name: 'SectionList',
        component: SectionList,
        meta: { title: 'Sections' }
      },
      {
        path: 'sections/new',
        name: 'SectionNew',
        component: SectionForm,
        meta: { title: 'Add Section' }
      },
      {
        path: 'sections/:id/edit',
        name: 'SectionEdit',
        component: SectionForm,
        meta: { title: 'Edit Section' }
      },

      // Notices
      {
        path: 'notices',
        name: 'NoticeList',
        component: NoticeList,
        meta: { title: 'Notices' }
      },
      {
        path: 'notices/new',
        name: 'NoticeNew',
        component: NoticeForm,
        meta: { title: 'Add Notice' }
      },
      {
        path: 'notices/:id/edit',
        name: 'NoticeEdit',
        component: NoticeForm,
        meta: { title: 'Edit Notice' }
      },

      // Fees
      {
        path: 'fees',
        name: 'FeeList',
        component: FeeList,
        meta: { title: 'Fees' }
      },
      {
        path: 'fees/new',
        name: 'FeeNew',
        component: FeeForm,
        meta: { title: 'Add Fee' }
      },
      {
        path: 'fees/:id/edit',
        name: 'FeeEdit',
        component: FeeForm,
        meta: { title: 'Edit Fee' }
      },

      // Organization Users
      {
        path: 'users',
        name: 'OrganizationUserList',
        component: OrganizationUserList,
        meta: { title: 'Users' }
      },
      {
        path: 'users/new',
        name: 'OrganizationUserNew',
        component: OrganizationUserForm,
        meta: { title: 'Add User' }
      },
      {
        path: 'users/:id/edit',
        name: 'OrganizationUserEdit',
        component: OrganizationUserForm,
        meta: { title: 'Edit User' }
      },
    ]
  },

  // Student Portal Routes
  {
    path: '/student',
    component: StudentPortal,
    meta: { requiresAuth: true, userType: 'student' },
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { title: 'My Dashboard' }
      },
      {
        path: 'notices',
        name: 'StudentNotices',
        component: StudentNotices,
        meta: { title: 'Notices' }
      },
      {
        path: 'fees',
        name: 'StudentFees',
        component: StudentFees,
        meta: { title: 'My Fees' }
      },
    ]
  },

  // 404 - Must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/**
 * Navigation Guard - Check authentication
 */
router.beforeEach((to, from, next) => {
  // Restore auth from storage if not already in store
  if (!store.getters['auth/isAuthenticated'] && storage.isAuthenticated()) {
    store.dispatch('auth/restoreAuth');
  }

  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const userType = store.getters['auth/userType'];
  const requiresAuth = to.meta.requiresAuth;

  // Public routes
  if (!requiresAuth) {
    // If trying to access login/student-login while authenticated
    if ((to.name === 'OrgUserLogin' || to.name === 'StudentLogin') && isAuthenticated) {
      next('/admin');
      return;
    }
    next();
    return;
  }

  // Protected routes
  if (!isAuthenticated) {
    next('/login');
    return;
  }

  // Check user type
  if (to.meta.userType && to.meta.userType !== userType) {
    // Redirect based on user type
    if (userType === 'organization_user') {
      next('/admin');
    } else if (userType === 'student') {
      next('/student');
    } else {
      next('/login');
    }
    return;
  }

  // Update page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - School Management`;
  }

  next();
});

export default router;
