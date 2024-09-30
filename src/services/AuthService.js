// src/services/AuthService.js
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';

const API_URL = 'https://stylo-storebackend-production.up.railway.app/auhtenticate';

const login = (correo, contrasena) => {
  return axios.post(API_URL, {
    correo,
    contrasena,
  });
};

const getRoleFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
try {
    const decoded = jwtDecode(token);  // Decodificar el token
    console.log('Token decodificado:', decoded);  // Ver todo el contenido del token
    return decoded.role;  // Asumiendo que el rol está en el campo "role"
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};
const AuthService = {
  getRoleFromToken,
  login
};

export default AuthService;