import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const baseURL = configuredBaseUrl
  ? (configuredBaseUrl.endsWith('/api') ? configuredBaseUrl : `${configuredBaseUrl}/api`)
  : '/api'

const axiosInstance = axios.create({ baseURL, withCredentials: true, headers: { 'Content-Type': 'application/json' } })

axiosInstance.interceptors.request.use((config) => {
  return config
})

export default axiosInstance