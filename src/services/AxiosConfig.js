// src/services/AxiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://stylo-storebackend-production.up.railway.app/api',
});

// Interceptor para añadir el token JWT a todas las solicitudes
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;