import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/pais';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerPaises = () => {
  return axios.get(API_URL, config);
};
// Crear un nuevo país
const crearPais = (pais) => {
  return axios.post(API_URL, pais, config);
};

// Actualizar un país
const actualizarPais = (id, pais) => {
  return axios.put(`${API_URL}/${id}`, pais, config);
};

// Eliminar un país
const eliminarPais = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerPaises,
  crearPais,
  actualizarPais,
  eliminarPais,
};
