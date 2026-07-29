import axios from 'axios'

const client = axios.create({
 const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: `${API_BASE}/api`,  // yeh line change hui
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resumeiq_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('resumeiq_token')
      localStorage.removeItem('resumeiq_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
