import axios from 'axios';

const API_URL = 'https://stylo-storebackend-production.up.railway.app/api/usuario';

// Obtener el token del localStorage
const token = localStorage.getItem('token');

// Configurar los headers con el token
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerUsuarios = () => {
  return axios.get(API_URL, config);  // Añade el token a la solicitud
};

const crearUsuarios = (usuario) => {
  return axios.post(API_URL, usuario, config);  // Añade el token a la solicitud
};

const obtenerUsuarioPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const actualizarUsuario = (id, usuario) => {
  return axios.put(`${API_URL}/${id}`, usuario, config);
};

const obtenerPerfil = () => {
  return axios.get(`${API_URL}/perfil`, config);  // Añade el token a la solicitud
};

const desactivarUsuario = (id) => {
  return axios.patch(`${API_URL}/${id}`, {},config);
};

const EliminarUsuario = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerUsuarios,
  crearUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  obtenerPerfil,
  EliminarUsuario
};
