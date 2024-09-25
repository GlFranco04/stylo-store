import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';  // Para obtener el rol del usuario
import UsuarioService from '../services/UsuarioService'; // Un servicio para manejar los usuarios
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import '../styles/Usuario.css';  // Estilos específicos del Dashboard
import { useNavigate } from 'react-router-dom';

function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const userRole = AuthService.getRoleFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada al servicio para obtener la lista de usuarios
    UsuarioService.obtenerUsuarios()
      .then(response => {
        setUsuarios(response.data);
        setLoading(false); // Cambia el estado de carga
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
        setLoading(false); // Asegúrate de detener el estado de carga
      });
  }, []);

  // Mostrar un mensaje mientras los datos se están cargando
  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  // Si no hay usuarios, muestra un mensaje
  if (!usuarios || usuarios.length === 0) {
    return <div>No se encontraron usuarios.</div>;
  }
    const handleCrearUsuario = () => {
    navigate('/crear-usuario');  // Redirige a la página de crear usuario
  };
  return (
    <div className="main-container">
      <Sidebar /> {/* Sidebar separado como componente */}
      <div className="main-content">
        <h1>Gestión de Usuarios</h1>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              {userRole === 'SuperUsuario' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              usuario && ( // Asegúrate de que el usuario no sea null o undefined
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre + " "+ usuario.apellido}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.rol.nombre}</td>
                  {userRole === 'SuperUsuario' && (
                    <td>
                      <button className="btn btn-warning">Editar</button>
                      <button className="btn btn-danger">Eliminar</button>
                    </td>
                  )}
                </tr>
              )
            ))}
          </tbody>
        </table>
        {userRole === 'SuperUsuario' && (
          <button 
            className="btn btn-primary" 
            onClick={handleCrearUsuario}>
            Crear Usuario
          </button>
        )}
      </div>
    </div>
  );
}
export default GestionarUsuarios;