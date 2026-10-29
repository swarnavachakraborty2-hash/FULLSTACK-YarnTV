import axios from 'axios'


const api = axios.create({
 
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    withCredentials: true
})

// Centralized wrapper with automatic refresh token handling
export const apiCall = async (fn) => {
    try {
        return await fn()
    }
    catch (error) {
        if (error.response?.status === 401) {
            await api.get('/user/refresh-token')
            return await fn()
        }
        throw error
    }
}

export default api;
