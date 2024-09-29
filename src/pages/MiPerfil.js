import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import UsuarioService from '../services/UsuarioService';  // Servicio para manejar usuarios
import { Button, Modal } from 'react-bootstrap';

function MiPerfil() {
  // Estado para almacenar el usuario autenticado y control de carga
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para controlar el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado para los valores del formulario de edición
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellido: '',
    correo: '',
  });

  // Cargar los datos del perfil al montar el componente
  useEffect(() => {
    UsuarioService.obtenerPerfil()
      .then((response) => {
        setUsuario(response.data);
        // Inicializar los valores del formulario con los datos del usuario
        setFormValues({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          correo: response.data.correo,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del perfil:', error);
        setLoading(false);
      });
  }, []);

  // Mostrar un indicador de carga mientras los datos del usuario se están cargando
  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  // Si no se puede cargar el perfil, mostrar un mensaje
  if (!usuario) {
    return <div>No se pudieron cargar los datos del perfil.</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Mi Perfil</h1>
        <div className="perfil-container">
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Sexo:</strong> {usuario.sexo}</p>
          <p><strong>Rol:</strong> {usuario.rol ? usuario.rol.nombre : 'Sin rol'}</p>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;
