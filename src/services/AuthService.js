// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/authenticate';

const login = (correo, contrasena) => {
  return axios.post(API_URL, {
    correo,
    contrasena,
  });
};

export default {
  login,
};