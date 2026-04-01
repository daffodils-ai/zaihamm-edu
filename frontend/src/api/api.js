import { API_BASE_URL } from './urls.js';
import { storage } from '../service/StorageService.js';

// Handle response
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(data.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// Make HTTP request
const request = async (url, options = {}) => {
  const token = storage.getToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  
  const headers = {
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const requestBlob = async (url, options = {}) => {
  const token = storage.getToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP ${response.status}` };
    }
    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.blob();
};

// GET request
export const get = (url, options = {}) => {
  return request(url, {
    method: 'GET',
    ...options,
  });
};

// POST request
export const post = (url, data = {}, options = {}) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

export const postForm = (url, formData, options = {}) => {
  return request(url, {
    method: 'POST',
    body: formData,
    ...options,
  });
};

// PUT request
export const put = (url, data = {}, options = {}) => {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

// DELETE request
export const deleteRequest = (url, options = {}) => {
  return request(url, {
    method: 'DELETE',
    ...options,
  });
};

export const download = (url, options = {}) => {
  return requestBlob(url, {
    method: 'GET',
    ...options,
  });
};

// =====================
// Authentication APIs
// =====================

export const auth = {
  orgUserLogin: async (email, password, organizationId) => {
    return post('/organization-users/login', {
      email,
      password,
      organizationId,
    });
  },

  studentLogin: async (registrationNumber, password) => {
    return post('/students/login', {
      registrationNumber,
      password,
    });
  },

  resetPassword: async (userId, newPassword) => {
    return post('/organization-users/reset-password', {
      userId,
      newPassword,
    });
  },
};

// =====================
// Organization User APIs
// =====================

export const organizationUsers = {
  create: (userData) => post('/organization-users', userData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/organization-users?${query}`);
  },
  getById: (id) => get(`/organization-users/${id}`),
  update: (id, userData) => put(`/organization-users/${id}`, userData),
  delete: (id) => deleteRequest(`/organization-users/${id}`),
};

// =====================
// Student APIs
// =====================

export const students = {
  admit: (studentData) => post('/students/admit', studentData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/students?${query}`);
  },
  getById: (id) => get(`/students/${id}`),
  update: (id, studentData) => put(`/students/${id}`, studentData),
  delete: (id) => deleteRequest(`/students/${id}`),
  promote: (id, promotionData) => post(`/students/promote/${id}`, promotionData),
  getHistory: (id, page = 1, limit = 10) => {
    const query = new URLSearchParams({ page, limit });
    return get(`/students/${id}/history?${query}`);
  },
  getLatestSession: (id) => get(`/students/${id}/latest-session`),
};

// =====================
// Class APIs
// =====================

export const classes = {
  create: (classData) => post('/classes', classData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/classes?${query}`);
  },
  getById: (id) => get(`/classes/${id}`),
  update: (id, classData) => put(`/classes/${id}`, classData),
  delete: (id) => deleteRequest(`/classes/${id}`),
};

// =====================
// Section APIs
// =====================

export const sections = {
  create: (sectionData) => post('/sections', sectionData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/sections?${query}`);
  },
  getById: (id) => get(`/sections/${id}`),
  getByClass: (classId, page = 1, limit = 10) => {
    const query = new URLSearchParams({ page, limit });
    return get(`/sections/class/${classId}?${query}`);
  },
  update: (id, sectionData) => put(`/sections/${id}`, sectionData),
  delete: (id) => deleteRequest(`/sections/${id}`),
};

// =====================
// Menu APIs
// =====================

export const menus = {
  create: (menuData) => post('/menus', menuData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/menus?${query}`);
  },
  getById: (id) => get(`/menus/${id}`),
  update: (id, menuData) => put(`/menus/${id}`, menuData),
  delete: (id) => deleteRequest(`/menus/${id}`),
  getMain: () => get('/menus/main/list'),
  getTree: () => get('/menus/tree/structure'),
  getSubmenus: (parentId) => get(`/menus/${parentId}/submenus`),
};

// =====================
// Admission Tracker APIs
// =====================

export const admissions = {
  create: (admissionData) => post('/admissions', admissionData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/admissions?${query}`);
  },
  getById: (id) => get(`/admissions/${id}`),
  update: (id, admissionData) => put(`/admissions/${id}`, admissionData),
  delete: (id) => deleteRequest(`/admissions/${id}`),
  downloadTemplate: (type = 'xlsx') => download(`/admissions/template/download?type=${type}`),
  exportCsv: (filters = {}) => {
    const query = new URLSearchParams({ ...filters, type: 'xlsx' });
    return download(`/admissions/export${query.toString() ? `?${query}` : ''}`);
  },
  bulkImport: (rows) => post('/admissions/bulk-import', { rows }),
  bulkImportFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return postForm('/admissions/bulk-import-file', formData);
  },
};

// =====================
// Notice Board APIs
// =====================

export const notices = {
  create: (noticeData) => post('/notices', noticeData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/notices?${query}`);
  },
  getById: (id) => get(`/notices/${id}`),
  update: (id, noticeData) => put(`/notices/${id}`, noticeData),
  delete: (id) => deleteRequest(`/notices/${id}`),
  getRecent: () => get('/notices/recent'),
};

// =====================
// Notification APIs
// =====================

export const notifications = {
  create: (notificationData) => post('/notifications', notificationData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/notifications?${query}`);
  },
  getById: (id) => get(`/notifications/${id}`),
  update: (id, notificationData) => put(`/notifications/${id}`, notificationData),
  delete: (id) => deleteRequest(`/notifications/${id}`),
  markRead: (id) => put(`/notifications/${id}/read`),
  getByStudent: (studentId, page = 1, limit = 10) => {
    const query = new URLSearchParams({ page, limit });
    return get(`/notifications/student/${studentId}?${query}`);
  },
  getUnreadCount: (studentId) => get(`/notifications/student/${studentId}/unread-count`),
};

// =====================
// Fee APIs
// =====================

export const fees = {
  create: (feeData) => post('/fees', feeData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/fees?${query}`);
  },
  getById: (id) => get(`/fees/${id}`),
  update: (id, feeData) => put(`/fees/${id}`, feeData),
  delete: (id) => deleteRequest(`/fees/${id}`),
  pay: (id) => put(`/fees/${id}/pay`),
  getByStudent: (studentId, page = 1, limit = 10) => {
    const query = new URLSearchParams({ page, limit });
    return get(`/fees/student/${studentId}?${query}`);
  },
  getPendingReport: () => get('/fees/report/pending'),
  getOverdueReport: () => get('/fees/report/overdue'),
  generateMonthly: (amount, dueDate) => post('/fees/generate/monthly', { amount, dueDate }),
};

// =====================
// Exam Result APIs
// =====================

export const examResults = {
  create: (payload) => post('/exam-results', payload),
  getAll: (page = 1, limit = 10, filters = {}) => {
    const query = new URLSearchParams({ page, limit, ...filters });
    return get(`/exam-results?${query}`);
  },
  getById: (id) => get(`/exam-results/${id}`),
  update: (id, payload) => put(`/exam-results/${id}`, payload),
  delete: (id) => deleteRequest(`/exam-results/${id}`),
  finalize: (id) => put(`/exam-results/${id}/finalize`),
  downloadPdf: (id) => download(`/exam-results/${id}/pdf`),
};

// =====================
// Dashboard APIs
// =====================

export const dashboard = {
  getSummary: () => get('/dashboard/summary'),
  getAnalytics: () => get('/dashboard/analytics'),
};
