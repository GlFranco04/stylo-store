import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/rol-permiso';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerRolPermisos = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearRolPermiso = (rolpermiso) => {
  return axios.post(API_URL, rolpermiso, config);  // Añade el token a la solicitud
};

const obtenerRolPermisoPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const EliminarRolPermiso = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

// Nueva función para obtener permisos por rol_id
const obtenerPermisosPorRolId = (rolId) => {
  return axios.get(`${API_URL}/rol/${rolId}`, config);
};

export default {
  obtenerRolPermisos,
  crearRolPermiso,
  obtenerRolPermisoPorId,
  EliminarRolPermiso,
  obtenerPermisosPorRolId  // Incluye esta nueva función
};
