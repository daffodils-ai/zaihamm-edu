// API Base URL
export const API_BASE_URL = 'http://localhost:3000/api/v1';

// Authentication URLs
export const AUTH_URLS = {
  ORG_USER_LOGIN: '/organization-users/login',
  STUDENT_LOGIN: '/students/login',
  RESET_PASSWORD: '/organization-users/reset-password',
};

// Organization User URLs
export const ORG_USER_URLS = {
  CREATE: '/organization-users',
  GET_ALL: '/organization-users',
  GET_BY_ID: (id) => `/organization-users/${id}`,
  UPDATE: (id) => `/organization-users/${id}`,
  DELETE: (id) => `/organization-users/${id}`,
};

// Student URLs
export const STUDENT_URLS = {
  ADMIT: '/students/admit',
  GET_ALL: '/students',
  GET_BY_ID: (id) => `/students/${id}`,
  UPDATE: (id) => `/students/${id}`,
  DELETE: (id) => `/students/${id}`,
  PROMOTE: (id) => `/students/promote/${id}`,
  GET_HISTORY: (id) => `/students/${id}/history`,
  GET_LATEST_SESSION: (id) => `/students/${id}/latest-session`,
};

// Class URLs
export const CLASS_URLS = {
  CREATE: '/classes',
  GET_ALL: '/classes',
  GET_BY_ID: (id) => `/classes/${id}`,
  UPDATE: (id) => `/classes/${id}`,
  DELETE: (id) => `/classes/${id}`,
};

// Section URLs
export const SECTION_URLS = {
  CREATE: '/sections',
  GET_ALL: '/sections',
  GET_BY_ID: (id) => `/sections/${id}`,
  GET_BY_CLASS: (classId) => `/sections/class/${classId}`,
  UPDATE: (id) => `/sections/${id}`,
  DELETE: (id) => `/sections/${id}`,
};

// Menu URLs
export const MENU_URLS = {
  CREATE: '/menus',
  GET_ALL: '/menus',
  GET_BY_ID: (id) => `/menus/${id}`,
  UPDATE: (id) => `/menus/${id}`,
  DELETE: (id) => `/menus/${id}`,
  GET_MAIN: '/menus/main/list',
  GET_TREE: '/menus/tree/structure',
  GET_SUBMENUS: (parentId) => `/menus/${parentId}/submenus`,
};

// Notice Board URLs
export const NOTICE_URLS = {
  CREATE: '/notices',
  GET_ALL: '/notices',
  GET_BY_ID: (id) => `/notices/${id}`,
  UPDATE: (id) => `/notices/${id}`,
  DELETE: (id) => `/notices/${id}`,
  GET_RECENT: '/notices/recent',
};

// Notification URLs
export const NOTIFICATION_URLS = {
  CREATE: '/notifications',
  GET_ALL: '/notifications',
  GET_BY_ID: (id) => `/notifications/${id}`,
  UPDATE: (id) => `/notifications/${id}`,
  DELETE: (id) => `/notifications/${id}`,
  MARK_READ: (id) => `/notifications/${id}/read`,
  GET_BY_STUDENT: (studentId) => `/notifications/student/${studentId}`,
  GET_UNREAD_COUNT: (studentId) => `/notifications/student/${studentId}/unread-count`,
};

// Fee URLs
export const FEE_URLS = {
  CREATE: '/fees',
  GET_ALL: '/fees',
  GET_BY_ID: (id) => `/fees/${id}`,
  UPDATE: (id) => `/fees/${id}`,
  DELETE: (id) => `/fees/${id}`,
  PAY: (id) => `/fees/${id}/pay`,
  GET_BY_STUDENT: (studentId) => `/fees/student/${studentId}`,
  GET_PENDING_REPORT: '/fees/report/pending',
  GET_OVERDUE_REPORT: '/fees/report/overdue',
  GENERATE_MONTHLY: '/fees/generate/monthly',
};

// Dashboard URLs
export const DASHBOARD_URLS = {
  GET_SUMMARY: '/dashboard/summary',
  GET_ANALYTICS: '/dashboard/analytics',
};

// Report URLs
export const REPORT_URLS = {
  STUDENT_REPORT: '/reports/students',
  FEE_REPORT: '/reports/fees',
  ATTENDANCE_REPORT: '/reports/attendance',
};

// Health Check
export const HEALTH_CHECK = '/api/v1/health';
