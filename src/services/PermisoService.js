import axios from 'axios';

const API_URL = 'http://localhost:8080/api/permiso';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerPermisos = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearPermiso = (permiso) => {
  return axios.post(API_URL, permiso, config);  // Añade el token a la solicitud
};

const obtenerPermisoPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const actualizarPermiso = (id, permiso) => {
  return axios.put(`${API_URL}/${id}`, permiso, config);
};

const EliminarPermiso = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerPermisos,
  crearPermiso,
  obtenerPermisoPorId,
  actualizarPermiso,
  EliminarPermiso
};
