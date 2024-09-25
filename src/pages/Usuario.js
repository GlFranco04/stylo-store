// src/pages/GestionarUsuarios.js
import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';  // Para obtener el rol del usuario
import UsuarioService from '../services/UsuarioService'; // Un servicio para manejar los usuarios

function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const userRole = AuthService.getRoleFromToken();

  useEffect(() => {
    // Llamada al servicio para obtener la lista de usuarios
    UsuarioService.obtenerUsuarios()
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  return (
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
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre} {usuario.apellido}</td> {/* Combina nombre y apellido */}
              <td>{usuario.correo}</td>
              <td>{usuario.rol.nombre}</td> {/* Aquí accedes a usuario.rol.nombre */}
              {userRole === 'SuperUsuario' && (
                <td>
                  <button className="btn btn-warning">Editar</button>
                  <button className="btn btn-danger">Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {userRole === 'SuperUsuario' && (
        <button className="btn btn-primary">Crear Usuario</button>
      )}
    </div>
  );
}

export default GestionarUsuarios;
