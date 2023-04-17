import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/auth'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): any => {
    if (response.status === 200) {
      return response.data
    }
    throw new Error(response.status.toString())
  },
  (error) => {
    // console.log(error)
    return Promise.reject(error)
  },
)

export default service
