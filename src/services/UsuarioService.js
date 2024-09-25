import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuario';

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

const eliminarUsuario = (id) => {
  return axios.delete(`${API_URL}/${id}`, config);
};

export default {
  obtenerUsuarios,
  crearUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario 
};
