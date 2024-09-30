import axios from 'axios';

const API_URL = 'https://stylo-store-a2yevyz8d-gabriels-projects-9c5cda58.vercel.app/api/empresa';
const token = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const obtenerEmpresaPorId = (id) => {
  return axios.get(`${API_URL}/${id}`, config);
};

const actualizarEmpresa = (id, empresa) => {
  return axios.put(`${API_URL}/${id}`, empresa, config);
};

export default {
  obtenerEmpresaPorId,
  actualizarEmpresa
};
