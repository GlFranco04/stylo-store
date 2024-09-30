import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/talla';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerTallas = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearTalla = (talla) => {
  return axios.post(API_URL, talla, config);  // Añade el token a la solicitud
};

const obtenerTallaPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);  // Asegúrate de tener el endpoint correcto
};


const actualizarTalla = (id, talla) => {
  return axios.put(`${API_URL}/${id}`, talla, config);
};

const desactivarTalla = (id) => {
  return axios.patch(`${API_URL}/${id}`, {},config);
};

const eliminarTalla = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerTallas,
  crearTalla,
  obtenerTallaPorId,
  actualizarTalla,
  desactivarTalla,
  eliminarTalla
};
