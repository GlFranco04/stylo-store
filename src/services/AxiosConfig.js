// src/services/AxiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api',
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