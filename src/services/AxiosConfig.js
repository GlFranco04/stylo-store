// src/services/AxiosConfig.js
import axios from 'axios';

axios.defaults.baseURL = 'https://stylo-storebackend-production.up.railway.app';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Esto es necesario si usas cookies o autenticación basada en sesiones

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