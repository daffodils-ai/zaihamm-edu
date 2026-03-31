import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

// Example API methods
export const api = {
  // Auth endpoints
  login(email, password) {
    return apiClient.post('/auth/login', { email, password })
  },

  // Notices endpoints
  getNotices(page = 1, limit = 10, filters = {}) {
    const query = new URLSearchParams({ page, limit, ...filters })
    return apiClient.get(`/notices?${query.toString()}`)
  },

  getNotice(id) {
    return apiClient.get(`/notices/${id}`)
  },

  createNotice(data) {
    return apiClient.post('/notices', data)
  },

  updateNotice(id, data) {
    return apiClient.put(`/notices/${id}`, data)
  },

  deleteNotice(id) {
    return apiClient.delete(`/notices/${id}`)
  },

  // Admissions endpoints
  getAdmissions() {
    return apiClient.get('/admissions')
  },

  getAdmission(id) {
    return apiClient.get(`/admissions/${id}`)
  },

  createAdmission(data) {
    return apiClient.post('/admissions', data)
  },

  updateAdmission(id, data) {
    return apiClient.put(`/admissions/${id}`, data)
  }
}
