import axios from 'axios';

const API_URL = 'https://stylo-storebackend-production.up.railway.app/api/nota-compra';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

// Obtener todas las notas de compra
const obtenerNotasCompra = () => {
  return axios.get(API_URL, config);
};

// Obtener una nota de compra por ID
const obtenerNotaCompraPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

// Crear una nueva nota de compra
const crearNotaCompra = (notaCompra) => {
  return axios.post(API_URL, notaCompra, config);
};

// Actualizar una nota de compra
const actualizarNotaCompra = (id, notaCompra) => {
  return axios.put(`${API_URL}/${id}`, notaCompra, config);
};

// Eliminar una nota de compra
const eliminarNotaCompra = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerNotasCompra,
  obtenerNotaCompraPorId,
  crearNotaCompra,
  actualizarNotaCompra,
  eliminarNotaCompra
};
