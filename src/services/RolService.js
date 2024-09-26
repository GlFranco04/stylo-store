import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rol';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerRoles = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearRol = (rol) => {
  return axios.post(API_URL, rol, config);  // Añade el token a la solicitud
};

const obtenerRolPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);  // Asegúrate de tener el endpoint correcto
};


const actualizarRol = (id, rol) => {
  return axios.put(`${API_URL}/${id}`, rol, config);
};


const eliminarRol = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerRoles,
  crearRol,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol
};
