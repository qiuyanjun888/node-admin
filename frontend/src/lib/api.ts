import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
})

// Add response interceptor to handle unified response structure
api.interceptors.response.use(
    (response) => {
        const res = response.data
        // If the backend uses the Result model, res will be { success, code, data, message }
        if (res.success === false) {
            // Handle error
            return Promise.reject(new Error(res.message || 'Error'))
        }
        return res.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
