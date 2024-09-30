import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/categoria';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerCategorias = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearCategoria = (categoria) => {
  return axios.post(API_URL, categoria, config);  // Añade el token a la solicitud
};

const obtenerCategoriaPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);  // Asegúrate de tener el endpoint correcto
};


const actualizarCategoria = (id, categoria) => {
  return axios.put(`${API_URL}/${id}`, categoria, config);
};

const desactivarCategoria = (id) => {
  return axios.patch(`${API_URL}/${id}`, {},config);
};

const eliminarCategoria = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerCategorias,
  crearCategoria,
  obtenerCategoriaPorId,
  actualizarCategoria,
  desactivarCategoria,
  eliminarCategoria
};
