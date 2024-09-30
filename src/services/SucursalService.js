import axios from 'axios';

const API_URL = 'https://stylo-storebackend-production.up.railway.app/api/sucursal';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

// Obtener todas las sucursales
const obtenerSucursales = () => {
  return axios.get(API_URL, config);
};

// Obtener sucursal por id
const obtenerSucursalPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

// Crear una nueva sucursal
const crearSucursal = (sucursal) => {
  return axios.post(API_URL, sucursal, config);
};

// Actualizar una sucursal
const actualizarSucursal = (id, sucursal) => {
  return axios.put(`${API_URL}/${id}`, sucursal, config);
};

// Activar/Desactivar una sucursal
const activarDesactivarSucursal = (id, estaActivo) => {
  return axios.patch(`${API_URL}/${id}`, { estaActivo }, config);
};

// Obtener direcciones disponibles
const obtenerDireccionesDisponibles = () => {
  return axios.get('http://localhost:8080/api/direccion/disponibles', config);
};

export default {
  obtenerSucursales,
  crearSucursal,
  actualizarSucursal,
  activarDesactivarSucursal,
  obtenerSucursalPorId,
  obtenerDireccionesDisponibles
};
