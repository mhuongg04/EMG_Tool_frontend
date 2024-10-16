import Axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    if (config.headers) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    return config;
}

export const api = Axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(authRequestInterceptor);