import axios from 'axios'

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', withCredentials: true, headers: { 'Content-Type': 'application/json' } })

axiosInstance.interceptors.request.use((config) => {
  return config
})

export default axiosInstance