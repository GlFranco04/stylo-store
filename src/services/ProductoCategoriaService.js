import axios from 'axios';

const API_URL = 'https://stylo-storebackend-production.up.railway.app/api/producto-categoria';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
const obtenerProductoCategoria = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearProductoCategoria = (usuario) => {
  return axios.post(API_URL, usuario, config);  // Añade el token a la solicitud
};

const obtenerCategoriasPorProductoId = (productoId) => {
  return axios.get(`${API_URL}/producto/${productoId}`, config);  // Asegúrate de que la ruta es correcta.
};

const actualizarProductoCategoria = (id, usuario) => {
  return axios.put(`${API_URL}/${id}`, usuario, config);
};

const EliminarProductoCategoria = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerProductoCategoria,
  crearProductoCategoria,
  obtenerCategoriasPorProductoId,
  actualizarProductoCategoria,
  EliminarProductoCategoria
};
