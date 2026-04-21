import axios from 'axios'

const api = axios.create({
  baseURL: 'https://library-management-backend-1-8tr2.onrender.com/api',
//  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lms_token')
      localStorage.removeItem('lms_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
