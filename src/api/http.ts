import axios from 'axios'
import { pinia, useAppStore } from '@/store'
const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
})

http.interceptors.request.use(
    (config) => {
        const appStore = useAppStore(pinia)
        const token = appStore.getToken()

        if (token) {
            config.headers.Authorization = token
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default http