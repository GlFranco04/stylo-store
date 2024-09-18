import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

const obtenerProductos = () => {
  return axios.get(API_URL);
};

const crearProducto = (producto) => {
  return axios.post(API_URL, producto);
};

const obtenerProductoPorId = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const actualizarProducto = (id, producto) => {
  return axios.put(`${API_URL}/${id}`, producto);
};

const eliminarProducto = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};
