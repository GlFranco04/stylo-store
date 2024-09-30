import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/direccion';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

// Obtener todas las direcciones
const obtenerDirecciones = () => {
  return axios.get(API_URL, config);
};

const obtenerDireccionPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const crearDireccion = (direccion) => {
  return axios.post(API_URL, direccion, config);
};

const actualizarDireccion = (id, direccion) => {
  return axios.put(`${API_URL}/${id}`, direccion, config);
};

// Eliminar una dirección
const eliminarDireccion = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

// Otros métodos para la gestión de direcciones se pueden añadir aquí.

export default {
  obtenerDirecciones,
  obtenerDireccionPorId,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion
};