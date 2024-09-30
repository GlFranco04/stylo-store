import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/producto';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerProductos = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearProducto = (producto) => {
  return axios.post(API_URL, producto, config);  // Añade el token a la solicitud
};

const obtenerProductoPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const actualizarProducto = (id, producto) => {
  return axios.put(`${API_URL}/${id}`, producto, config);
};

const desactivarProducto = (id) => {
  return axios.patch(`${API_URL}/${id}`, {},config);
};

const eliminarProducto = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  desactivarProducto,
  eliminarProducto,
};
