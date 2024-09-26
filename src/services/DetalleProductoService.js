import axios from 'axios';

const API_URL = 'http://localhost:8080/api/detalle-producto';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerDetalleProductos = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearDetalleProducto = (detalleproducto) => {
  return axios.post(API_URL,detalleproducto, config);  // Añade el token a la solicitud
};

const obtenerDetalleProductoPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const actualizarDetalleProducto = (id, detalleproducto) => {
  return axios.put(`${API_URL}/${id}`, detalleproducto, config);
};

const eliminarDetalleProducto = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerDetalleProductos,
  crearDetalleProducto,
  obtenerDetalleProductoPorId,
  actualizarDetalleProducto,
  eliminarDetalleProducto,
};