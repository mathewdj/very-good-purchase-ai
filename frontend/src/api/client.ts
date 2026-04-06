import axios from 'axios'

export const apiClient = axios.create({ baseURL: '/' })

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
