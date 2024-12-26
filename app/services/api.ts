// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (credentials: { username: string; password: string }) => {
        const response = await api.post('/token/', credentials);
        localStorage.setItem('token', response.data.access);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const exeats = {
    create: (data: any) => api.post('/exeats/', data),
    getAll: () => api.get('/exeats/'),
    getOne: (id: string) => api.get(`/exeats/${id}/`),
    update: (id: string, data: any) => api.put(`/exeats/${id}/`, data),
    delete: (id: string) => api.delete(`/exeats/${id}/`)
};