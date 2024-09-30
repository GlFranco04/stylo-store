import axios from 'axios';

const API_URL = 'https://stylo-storebackend-production.up.railway.app/api/ciudad';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

// Obtener todas las ciudades
const obtenerCiudades = () => {
  return axios.get(API_URL, config);
};

// Obtener ciudades por país
const obtenerCiudadesPorPais = (paisId) => {
  return axios.get(`${API_URL}/pais/${paisId}`, config);
};

// Crear una nueva ciudad
const crearCiudad = (ciudad) => {
  return axios.post(API_URL, ciudad, config);
};

// Actualizar una ciudad
const actualizarCiudad = (id, ciudad) => {
  return axios.put(`${API_URL}/${id}`, ciudad, config);
};

// Eliminar una ciudad
const eliminarCiudad = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerCiudades,
  obtenerCiudadesPorPais,
  crearCiudad,
  actualizarCiudad,
  eliminarCiudad,
};
