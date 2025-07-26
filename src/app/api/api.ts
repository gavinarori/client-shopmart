import axios from "axios"

const api = axios.create({
  baseURL: "https://backend-shopmart.onrender.com/api",
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Check for customer token first, then fallback to accessToken
      const token = localStorage.getItem("customerToken") || localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("customerToken")
      localStorage.removeItem("accessToken")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
